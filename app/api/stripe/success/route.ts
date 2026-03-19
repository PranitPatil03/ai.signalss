import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  const baseUrl = process.env.NEXT_PUBLIC_URL || request.nextUrl.origin

  if (!sessionId) {
    return NextResponse.redirect(`${baseUrl}/settings?upgrade_error=missing_session`)
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(`${baseUrl}/settings?upgrade_error=not_paid`)
    }

    const userId = session.metadata?.userId
    if (!userId) {
      return NextResponse.redirect(`${baseUrl}/settings?upgrade_error=no_user`)
    }

    const db = getSupabaseAdmin()

    // Build update — always set tier + customer ID
    const updateData: Record<string, unknown> = {
      subscription_tier: 'pro',
    }

    if (session.customer) {
      updateData.stripe_customer_id = session.customer as string
    }

    // Try to get subscription end date
    if (session.subscription) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as unknown as { current_period_end: number }
        updateData.subscription_ends_at = new Date(subscription.current_period_end * 1000).toISOString()
      } catch {
        // Column might not exist — that's fine
      }
    }

    // Update user to pro
    const { error } = await db
      .from('users')
      .update(updateData)
      .eq('id', userId)

    if (error && error.message?.includes('subscription_ends_at')) {
      // Retry without the column that doesn't exist
      delete updateData.subscription_ends_at
      await db.from('users').update(updateData).eq('id', userId)
    }

    console.log(`User ${userId} upgraded to pro via checkout success redirect`)

    return NextResponse.redirect(`${baseUrl}/settings?upgraded=true`)
  } catch (err) {
    console.error('Stripe success verification error:', err)
    return NextResponse.redirect(`${baseUrl}/settings?upgrade_error=verification_failed`)
  }
}
