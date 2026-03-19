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
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-gray-900">Authentication failed</h1>
            <p className="mt-2 text-sm text-red-500">{error}</p>
            <button
              onClick={() => router.replace('/')}
              className="mt-4 rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 px-4 py-2 text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
            >
              Go back
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
            <h1 className="mt-4 text-xl font-semibold text-gray-900">Signing you in...</h1>
            <p className="mt-2 text-sm text-gray-500">Finalizing your account setup.</p>
          </>
        )}
      </div>
    </main>
  )
}
