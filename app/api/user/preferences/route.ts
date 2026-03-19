import { NextRequest, NextResponse } from 'next/server'
import { UserPreferences, getSupabaseAdmin, getSupabaseServiceKey } from '@/lib/supabase'
import { PLANS } from '@/lib/stripe'
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

    const hasServiceKey = Boolean(getSupabaseServiceKey())
    const db = hasServiceKey ? getSupabaseAdmin() : createUserScopedSupabaseClient(token)

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
          return NextResponse.json(
            { error: 'Content style not available on free plan' },
            { status: 403 }
          )
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
    const token = getBearerToken(request)

    if (!authUser?.id || !token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const hasServiceKey = Boolean(getSupabaseServiceKey())
    const db = hasServiceKey ? getSupabaseAdmin() : createUserScopedSupabaseClient(token)

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

    const { data, error } = await db
      .from('users')
      .select('preferences, timezone, onboarding_completed, subscription_tier')
      .eq('id', targetUserId)
      .single()

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
