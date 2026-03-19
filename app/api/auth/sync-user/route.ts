import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-server'
import { DEFAULT_PREFERENCES, getSupabaseAdmin } from '@/lib/supabase'

type SyncResult = {
  id: string
  onboarding_completed: boolean
}

function isUsersTableMissingError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const msg = error.message.toLowerCase()
  return (
    msg.includes("could not find the table 'public.users'") ||
    msg.includes('relation "users" does not exist')
  )
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user?.id || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: user.id,
          email: user.email,
          verified: true,
          preferences: DEFAULT_PREFERENCES,
        },
        { onConflict: 'id' }
      )
      .select('id, onboarding_completed')
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Failed to sync user profile')
    }

    return NextResponse.json({
      userId: data.id,
      onboarding_completed: data.onboarding_completed ?? false,
      schema_ready: true,
    })
  } catch (error) {
    if (isUsersTableMissingError(error)) {
      return NextResponse.json({
        userId: user.id,
        onboarding_completed: true,
        schema_ready: false,
        warning:
          'Database schema is not initialized yet. Run supabase/schema.sql in your Supabase SQL editor to enable full account features.',
      })
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to sync user profile',
      },
      { status: 500 }
    )
  }
}
