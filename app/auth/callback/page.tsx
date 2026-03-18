'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { syncCurrentUserProfile } from '@/lib/auth-client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const completeAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            throw new Error(exchangeError.message)
          }
        }

        const profile = await syncCurrentUserProfile()
        router.replace(profile.onboarding_completed ? '/dashboard' : '/onboarding')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to complete sign in')
      }
    }

    completeAuth()
  }, [router])

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface-elevated p-6 text-center">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-text-primary">Authentication failed</h1>
            <p className="mt-2 text-sm text-red-400">{error}</p>
            <button
              onClick={() => router.replace('/')}
              className="mt-4 rounded-lg bg-electric px-4 py-2 text-white hover:bg-electric-dark"
            >
              Go back
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-electric" />
            <h1 className="mt-4 text-xl font-semibold text-text-primary">Signing you in...</h1>
            <p className="mt-2 text-sm text-text-secondary">Finalizing your account setup.</p>
          </>
        )}
      </div>
    </main>
  )
}
