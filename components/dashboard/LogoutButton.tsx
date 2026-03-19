'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Log out"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  )
}
