import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PLANS } from '@/lib/stripe'
import { getSupabaseAdmin, getSupabaseServiceKey } from '@/lib/supabase'
import {
  createUserScopedSupabaseClient,
  getAuthenticatedUser,
  getBearerToken,
} from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request)
    const token = getBearerToken(request)

    if (!authUser?.id || !token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = authUser.id
    const hasServiceKey = Boolean(getSupabaseServiceKey())
    const db = hasServiceKey ? getSupabaseAdmin() : createUserScopedSupabaseClient(token)

    // Get user from database
    const { data: user, error: userError } = await db
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const stripe = getStripe()
    let customerId = user.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      })
      customerId = customer.id

      // Save customer ID to database
      await db
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Check if price ID is configured
    if (!PLANS.pro.priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured' },
        { status: 500 }
      )
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLANS.pro.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/settings?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/settings?cancelled=true`,
      metadata: { userId },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    )
  }
}
