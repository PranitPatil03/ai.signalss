'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, EyeIcon, EyeOffIcon } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { syncCurrentUserProfile } from '@/lib/auth-client'

export default function SignInPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/dashboard')
      } else {
        setChecking(false)
      }
    }
    check()
  }, [supabase, router])

  if (checking) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      const profile = await syncCurrentUserProfile()
      router.push(profile.onboarding_completed ? '/dashboard' : '/onboarding')
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch {
      setError('Google sign-in failed')
      setLoading(false)
    }
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center bg-[#f8fafc] px-6">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <Image src="/images/logo.png" alt="signalss" width={28} height={28} className="rounded" />
          <span className="text-xl font-normal tracking-tight text-gray-900">signalss</span>
        </Link>

        <h1 className="text-2xl font-medium text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">Sign in to your account to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5 w-full">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-1.5 w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            />
          </div>

          <div className="space-y-1.5 w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-11 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-black text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Sign in
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#f8fafc] px-3 text-gray-400 tracking-wider">Or authorize with</span>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
          onClick={handleGoogleAuth}
        >
          <svg className="size-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="font-semibold text-gray-900 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
