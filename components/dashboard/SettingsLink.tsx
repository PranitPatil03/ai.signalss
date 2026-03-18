'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'

export function SettingsLink() {
  return (
    <Link
      href="/settings"
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary border border-border hover:border-text-muted rounded-lg transition-colors"
    >
      <Settings className="w-4 h-4" />
      Settings
    </Link>
  )
}
