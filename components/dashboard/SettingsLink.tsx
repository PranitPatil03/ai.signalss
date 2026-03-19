'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'

export function SettingsLink() {
  return (
    <Link
      href="/settings"
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/[0.15] rounded-lg transition-colors"
    >
      <Settings className="w-4 h-4" />
      Settings
    </Link>
  )
}
