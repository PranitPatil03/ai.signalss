import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-server'

type AuthReason = 'cron' | 'admin-user'

export type AdminAuthResult =
  | { ok: true; reason: AuthReason; userId?: string; email?: string }
  | { ok: false; status: number; error: string }

function getAdminEmails(): string[] {
  const combined = [process.env.ADMIN_EMAILS, process.env.ADMIN_EMAIL]
    .filter(Boolean)
    .join(',')

  return combined
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

export async function authorizeCronOrAdmin(request: NextRequest): Promise<AdminAuthResult> {
  const authHeader = request.headers.get('authorization')
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'

  // Support cron secret via Bearer token (Supabase cron, Vercel cron, or manual)
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return {
      ok: true,
      reason: 'cron',
    }
  }

  if (isVercelCron) {
    if (!cronSecret) {
      return {
        ok: false,
        status: 500,
        error: 'CRON_SECRET is not configured',
      }
    }

    return {
      ok: false,
      status: 401,
      error: 'Unauthorized',
    }
  }

  const user = await getAuthenticatedUser(request)

  if (!user?.email || !user.id) {
    return {
      ok: false,
      status: 401,
      error: 'Unauthorized',
    }
  }

  const adminEmails = getAdminEmails()
  if (adminEmails.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      return {
        ok: true,
        reason: 'admin-user',
        userId: user.id,
        email: user.email,
      }
    }

    return {
      ok: false,
      status: 500,
      error: 'Admin emails are not configured',
    }
  }

  if (!adminEmails.includes(user.email.toLowerCase())) {
    return {
      ok: false,
      status: 403,
      error: 'Forbidden',
    }
  }

  return {
    ok: true,
    reason: 'admin-user',
    userId: user.id,
    email: user.email,
  }
}