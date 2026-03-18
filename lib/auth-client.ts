'use client'

import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

export async function getClientAccessToken(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.access_token ?? null
}

export async function syncCurrentUserProfile() {
  const token = await getClientAccessToken()
  if (!token) {
    throw new Error('You are not signed in')
  }

  const response = await fetch('/api/auth/sync-user', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error || 'Failed to sync profile')
  }

  return payload as { userId: string; onboarding_completed: boolean }
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getClientAccessToken()

  if (!token) {
    return {
      'Content-Type': 'application/json',
    }
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}
