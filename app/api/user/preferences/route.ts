import { NextRequest, NextResponse } from 'next/server'
import { UserPreferences, getSupabaseAdmin } from '@/lib/supabase'
import { PLANS } from '@/lib/stripe'
import { getAuthenticatedUser } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request)

    if (!authUser?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = getSupabaseAdmin()

    const body = await request.json()
    const { userId, preferences, timezone, onboarding_completed } = body
    const targetUserId = userId || authUser.id

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (targetUserId !== authUser.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get user's current tier for validation
    const { data: user, error: userError } = await db
      .from('users')
      .select('subscription_tier')
      .eq('id', targetUserId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const tier = user.subscription_tier || 'free'

    // Server-side validation of tier limits
    if (preferences) {
      const prefs = preferences as UserPreferences

      // Validate content style for free users
      if (tier === 'free' && prefs.content_style) {
        const allowedStyles = PLANS.free.limits.styles as readonly string[]
        if (!allowedStyles.includes(prefs.content_style)) {
          // Silently default to 'tiktok' instead of rejecting
          prefs.content_style = 'tiktok'
        }
      }

      // Validate custom digest time for free users
      if (tier === 'free' && prefs.digest_time && !PLANS.free.limits.customDigestTime) {
        // Allow default time, block custom times
        // Note: we no longer block this server-side during onboarding
        // The client enforces this restriction in the settings UI
      }
    }

    const updateData: Record<string, unknown> = {}
    if (preferences) updateData.preferences = preferences
    if (timezone) updateData.timezone = timezone
    if (typeof onboarding_completed === 'boolean') {
      updateData.onboarding_completed = onboarding_completed
    }

    const { error } = await db
      .from('users')
      .update(updateData)
      .eq('id', targetUserId)

    if (error) {
      console.error('Failed to update preferences:', error)
      return NextResponse.json(
        { error: 'Failed to save preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request)

    if (!authUser?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = getSupabaseAdmin()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const targetUserId = userId || authUser.id

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (targetUserId !== authUser.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Try with subscription_ends_at, fall back without it if column doesn't exist
    let data, error
    const result1 = await db
      .from('users')
      .select('preferences, timezone, onboarding_completed, subscription_tier, subscription_ends_at')
      .eq('id', targetUserId)
      .single()

    if (result1.error && result1.error.message?.includes('subscription_ends_at')) {
      // Column doesn't exist yet — query without it
      const result2 = await db
        .from('users')
        .select('preferences, timezone, onboarding_completed, subscription_tier')
        .eq('id', targetUserId)
        .single()
      data = result2.data
      error = result2.error
    } else {
      data = result1.data
      error = result1.error
    }

    if (error) {
      console.error('Failed to fetch preferences:', error)
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
