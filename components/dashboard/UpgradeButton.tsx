'use client'

import { useState, useEffect } from 'react'
import { Zap, Loader2, Crown } from 'lucide-react'
import { getClientAccessToken } from '@/lib/auth-client'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

interface UpgradeButtonProps {
  variant?: 'header' | 'settings'
}

export function UpgradeButton({ variant = 'header' }: UpgradeButtonProps) {
  const [tier, setTier] = useState<'free' | 'pro' | null>(null)
  const [isUpgrading, setIsUpgrading] = useState(false)

  useEffect(() => {
    const checkTier = async () => {
      try {
        const token = await getClientAccessToken()
        if (!token) return

        const response = await fetch('/api/user/preferences', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setTier(data.subscription_tier || 'free')
        }
      } catch {
        setTier('free')
      }
    }
    checkTier()
  }, [])

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      const token = await getClientAccessToken()
      if (!token) {
        window.location.href = '/'
        return
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // Fallback
    } finally {
      setIsUpgrading(false)
    }
  }

  // Don't render if still loading or already Pro
  if (tier === null || tier === 'pro') return null

  if (variant === 'header') {
    return (
      <button
        onClick={handleUpgrade}
        disabled={isUpgrading}
        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-b from-blue-400 to-blue-600 text-white text-sm font-medium rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isUpgrading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Zap className="w-3.5 h-3.5" />
        )}
        Upgrade to Pro
      </button>
    )
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={isUpgrading}
      className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
    >
      {isUpgrading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <Crown className="w-4 h-4" />
          Upgrade for $12/mo
        </>
      )}
    </button>
  )
}
