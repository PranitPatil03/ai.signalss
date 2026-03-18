import crypto from 'crypto'

function getDigestLinkSecret(): string {
  const secret = process.env.DIGEST_LINK_SECRET || process.env.UNSUBSCRIBE_SECRET

  if (!secret) {
    throw new Error('DIGEST_LINK_SECRET or UNSUBSCRIBE_SECRET is required')
  }

  return secret
}

export function generateDigestAccessToken(digestId: string, userId: string): string {
  return crypto
    .createHmac('sha256', getDigestLinkSecret())
    .update(`${digestId}:${userId}`)
    .digest('hex')
    .slice(0, 24)
}

export function verifyDigestAccessToken(digestId: string, userId: string, token: string): boolean {
  const expectedToken = generateDigestAccessToken(digestId, userId)

  if (expectedToken.length !== token.length) {
    return false
  }

  return crypto.timingSafeEqual(Buffer.from(expectedToken), Buffer.from(token))
}