import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PLANS } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getAuthenticatedUser } from '@/lib/auth-server'

async function createCheckoutSession(request: NextRequest) {
  const authUser = await getAuthenticatedUser(request)

  if (!authUser?.id || !authUser.email) {
    return { error: 'Unauthorized', status: 401 }
  }

  const userId = authUser.id
  const db = getSupabaseAdmin()

  // Get user from database
  const { data: user, error: userError } = await db
    .from('users')
    .select('email, stripe_customer_id')
    .eq('id', userId)
    .single()

  // If user not found in DB, use auth email directly
  const userEmail = user?.email || authUser.email

  if (userError && userError.code !== 'PGRST116') {
    console.error('Checkout user lookup error:', userError)
  }

  const stripe = getStripe()
  let customerId = user?.stripe_customer_id

  // Create Stripe customer if doesn't exist
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: { userId },
    })
    customerId = customer.id

    // Try to save customer ID — column might not exist yet
    try {
      await db
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    } catch {
      console.warn('Could not save stripe_customer_id — column may not exist')
    }
  }

  // Check if price ID is configured
  if (!PLANS.pro.priceId) {
    return { error: 'Stripe price ID not configured. Set STRIPE_PRO_PRICE_ID in your environment variables.', status: 500 }
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
    success_url: `${process.env.NEXT_PUBLIC_URL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/settings?cancelled=true`,
    metadata: { userId },
  })

  return { url: session.url }
}

// GET — browser navigates here via <a> link, redirect to Stripe
export async function GET(request: NextRequest) {
  try {
    const result = await createCheckoutSession(request)
    if (result.error) {
      // Redirect back to dashboard on error (can't show JSON to browser)
      return NextResponse.redirect(new URL('/dashboard?checkout_error=1', request.url))
    }
    return NextResponse.redirect(result.url!)
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.redirect(new URL('/dashboard?checkout_error=1', request.url))
  }
}

// POST — API call, returns JSON
export async function POST(request: NextRequest) {
  try {
    const result = await createCheckoutSession(request)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }
    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error('Checkout error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    )
  }
}
