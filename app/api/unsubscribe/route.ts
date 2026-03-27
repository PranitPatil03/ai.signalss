import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function getUnsubscribeSecret(): string | null {
  return process.env.UNSUBSCRIBE_SECRET || null
}

async function hmacHex(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Verify unsubscribe token
async function verifyToken(userId: string, token: string): Promise<boolean> {
  const secret = getUnsubscribeSecret()

  if (!secret) {
    return false
  }

  const expectedToken = (await hmacHex(secret, userId)).slice(0, 16)

  if (expectedToken.length !== token.length) {
    return false
  }

  // Constant-time comparison
  let mismatch = 0
  for (let i = 0; i < expectedToken.length; i++) {
    mismatch |= expectedToken.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return mismatch === 0
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user')
  const token = searchParams.get('token')

  if (!userId || !token) {
    return NextResponse.redirect(new URL('/unsubscribed?error=invalid', request.url))
  }

  // Verify token
  if (!(await verifyToken(userId, token))) {
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
