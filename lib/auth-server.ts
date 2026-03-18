import { NextRequest } from 'next/server'
import { createClient, User } from '@supabase/supabase-js'
import { getSupabasePublishableKey, getSupabaseServiceKey, getSupabaseUrl } from '@/lib/supabase'

function getAuthSupabaseClient() {
  const supabaseUrl = getSupabaseUrl()
  const privilegedKey = getSupabaseServiceKey() || getSupabasePublishableKey()

  if (!supabaseUrl || !privilegedKey) {
    throw new Error('Supabase URL and publishable key are required for auth checks')
  }

  return createClient(supabaseUrl, privilegedKey)
}

export function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return null
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return null
  }

  return token
}

export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  const token = getBearerToken(request)
  if (!token) {
    return null
  }

  const supabase = getAuthSupabaseClient()
  const { data, error } = await supabase.auth.getUser(token)

  if (error) {
    return null
  }

  return data.user ?? null
}

export function createUserScopedSupabaseClient(token: string) {
  const supabaseUrl = getSupabaseUrl()
  const publishableKey = getSupabasePublishableKey()

  if (!supabaseUrl || !publishableKey) {
    throw new Error('Supabase URL and publishable key are required')
  }

  return createClient(supabaseUrl, publishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}
