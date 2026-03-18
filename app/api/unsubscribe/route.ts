import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

function getUnsubscribeSecret(): string | null {
  return process.env.UNSUBSCRIBE_SECRET || null
}

// Verify unsubscribe token
function verifyToken(userId: string, token: string): boolean {
  const secret = getUnsubscribeSecret()

  if (!secret) {
    return false
  }

  const expectedToken = crypto
    .createHmac('sha256', secret)
    .update(userId)
    .digest('hex')
    .slice(0, 16)

  if (expectedToken.length !== token.length) {
    return false
  }

  return crypto.timingSafeEqual(Buffer.from(expectedToken), Buffer.from(token))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user')
  const token = searchParams.get('token')

  if (!userId || !token) {
    return NextResponse.redirect(new URL('/unsubscribed?error=invalid', request.url))
  }

  // Verify token
  if (!verifyToken(userId, token)) {
    return NextResponse.redirect(new URL('/unsubscribed?error=invalid', request.url))
  }

  try {
    // Mark user as unsubscribed by setting verified to false
    // This prevents future digest emails
    const { error } = await supabaseAdmin
      .from('users')
      .update({ verified: false })
      .eq('id', userId)

    if (error) {
      console.error('Failed to unsubscribe:', error)
      return NextResponse.redirect(new URL('/unsubscribed?error=failed', request.url))
    }

    console.log(`User ${userId} unsubscribed`)
    return NextResponse.redirect(new URL('/unsubscribed?success=true', request.url))
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.redirect(new URL('/unsubscribed?error=failed', request.url))
  }
}
