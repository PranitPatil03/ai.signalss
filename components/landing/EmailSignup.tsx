'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle, Mail, Lock } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { syncCurrentUserProfile } from '@/lib/auth-client'

interface EmailSignupProps {
  buttonText?: string
}

export function EmailSignup({ buttonText = 'Get the digest' }: EmailSignupProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const redirectToApp = async () => {
    const profile = await syncCurrentUserProfile()
    router.push(profile.onboarding_completed ? '/dashboard' : '/onboarding')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    if (!password || password.length < 8) {
      setStatus('error')
      setMessage('Password must be at least 8 characters')
      return
    }

    setStatus('loading')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) {
          throw new Error(error.message)
        }

        // If email confirmations are enabled, session may be null until verification.
        if (!data.session) {
          setStatus('success')
          setMessage('Account created. Check your email to confirm, then sign in.')
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw new Error(error.message)
        }
      }

      await redirectToApp()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Something went wrong')
      return
    }

    setStatus('success')
    setMessage('Signed in. Redirecting...')
  }

  async function handleGoogleAuth() {
    setStatus('loading')
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Google sign-in failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-4 inline-flex rounded-lg border border-border bg-surface p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`rounded-md px-3 py-1.5 transition-colors ${mode === 'signup' ? 'bg-emerald-600 text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`rounded-md px-3 py-1.5 transition-colors ${mode === 'signin' ? 'bg-emerald-600 text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
        >
          Sign in
        </button>
      </div>

      <div className="space-y-3">
        <label className="relative block">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            disabled={status === 'loading'}
            className="w-full rounded-lg border border-border bg-surface-elevated py-3 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          />
        </label>

        <label className="relative block">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            disabled={status === 'loading'}
            className="w-full rounded-lg border border-border bg-surface-elevated py-3 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          />
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-700 bg-linear-to-b from-emerald-400 to-emerald-600 px-6 py-3 font-medium text-white shadow-[0_4px_14px_rgba(5,150,105,0.35)] transition-all hover:scale-[1.01] hover:shadow-[0_6px_20px_rgba(5,150,105,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
            </>
          ) : mode === 'signup' ? (
            buttonText
          ) : (
            'Sign in to your account'
          )}
        </button>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={status === 'loading'}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 font-medium text-text-primary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue with Google
        </button>
      </div>

      {message && (
        <div
          className={`mt-3 flex items-center gap-2 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
        >
          {status === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {message}
        </div>
      )}

      <p className="mt-3 text-xs text-text-muted">
        {mode === 'signup'
          ? 'Free forever. You can upgrade to Pro anytime.'
          : 'Welcome back. Continue where you left off.'}
      </p>
    </form>
  )
}
