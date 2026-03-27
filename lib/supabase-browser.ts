'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) {
    return browserClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''

  if (!supabaseUrl || !publishableKey) {
    // During static prerender on CI/platform builds, client components may render on server.
    // Avoid hard-failing the build; runtime browser usage will still require valid env vars.
    if (typeof window === 'undefined') {
      browserClient = createClient('https://placeholder.supabase.co', 'placeholder-key')
      return browserClient
    }

    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or Supabase publishable key')
  }

  browserClient = createClient(supabaseUrl, publishableKey)
  return browserClient
}
