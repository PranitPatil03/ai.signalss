function getDigestLinkSecret(): string {
  const secret = process.env.DIGEST_LINK_SECRET || process.env.UNSUBSCRIBE_SECRET

  if (!secret) {
    throw new Error('DIGEST_LINK_SECRET or UNSUBSCRIBE_SECRET is required')
  }

  return secret
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

export async function generateDigestAccessToken(digestId: string, userId: string): Promise<string> {
  const hex = await hmacHex(getDigestLinkSecret(), `${digestId}:${userId}`)
  return hex.slice(0, 24)
}

export async function verifyDigestAccessToken(digestId: string, userId: string, token: string): Promise<boolean> {
  const expectedToken = await generateDigestAccessToken(digestId, userId)

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
