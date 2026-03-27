import { Resend } from 'resend'
import { generateDigestAccessToken } from '@/lib/digest-token'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required')
    }
    _resend = new Resend(apiKey)
  }
  return _resend
}

// Generate unsubscribe token using Web Crypto API
async function generateUnsubscribeToken(userId: string): Promise<string> {
  const secret = process.env.UNSUBSCRIBE_SECRET

  if (!secret) {
    throw new Error('UNSUBSCRIBE_SECRET is required')
  }

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(userId))
  const hex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return hex.slice(0, 16)
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_URL}/api/verify?token=${token}`

  const { error } = await getResend().emails.send({
    from: 'signalss <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your email for signalss',
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 20px; background: #f8fafc; color: #111827;">
        <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 8px;">Welcome to signalss!</h1>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Click the button below to verify your email and start receiving daily AI intelligence briefings.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(to bottom, #60a5fa, #2563eb); color: white; padding: 12px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Verify Email
        </a>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
          Or copy this link: ${verifyUrl}
        </p>
        <p style="color: #d1d5db; font-size: 12px; margin-top: 40px;">
          If you didn't sign up for signalss, you can ignore this email.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send verification email:', error)
    throw error
  }
}

export async function sendDigestEmail(
  email: string,
  trends: Array<{
    title: string
    category: string
    summary: string
    why_it_matters: string | null
    tiktok_angle: string | null
    script: string | null
    sources: Array<{ url: string; platform: string; title: string }>
  }>,
  digestId: string,
  userId?: string,
  userTier?: 'free' | 'pro'
) {
  const topTopic = trends[0]?.title || 'AI Updates'
  const digestToken = userId ? await generateDigestAccessToken(digestId, userId) : null
  const webViewUrl = digestToken
    ? `${process.env.NEXT_PUBLIC_URL}/digest/${digestId}?token=${digestToken}`
    : `${process.env.NEXT_PUBLIC_URL}/digest/${digestId}`
  const trackingPixelUrl = `${process.env.NEXT_PUBLIC_URL}/api/track/open?id=${digestId}`
  const unsubscribeToken = userId ? await generateUnsubscribeToken(userId) : null
  const unsubscribeUrl = userId && unsubscribeToken
    ? `${process.env.NEXT_PUBLIC_URL}/api/unsubscribe?user=${userId}&token=${unsubscribeToken}`
    : `${process.env.NEXT_PUBLIC_URL}/unsubscribe`

  const categoryEmojis: Record<string, string> = {
    models: '🤖',
    tools: '🛠️',
    research: '📚',
    drama: '🔥',
    tutorials: '📖',
  }

  const trendsHtml = trends.map(trend => `
    <div style="margin-bottom: 24px; padding: 20px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
      <h3 style="margin: 0 0 10px; color: #111827; font-size: 17px; font-weight: 600;">
        ${categoryEmojis[trend.category] || '📰'} ${trend.title}
      </h3>
      <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px; line-height: 1.6;">
        ${trend.summary}
      </p>
      ${trend.tiktok_angle ? `
        <p style="margin: 12px 0; padding: 10px 14px; background: #eff6ff; border-radius: 8px; font-size: 13px; color: #2563eb;">
          💡 <strong>Action:</strong> ${trend.tiktok_angle}
        </p>
      ` : ''}
      ${trend.script ? `
        <div style="margin: 16px 0; padding: 16px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">
            📝 Summary
          </p>
          <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
${trend.script}
          </p>
        </div>
      ` : ''}
      ${trend.sources.length > 0 ? `
        <p style="margin: 12px 0 0; font-size: 12px; color: #9ca3af;">
          📎 Source: <a href="${trend.sources[0].url}" style="color: #2563eb; text-decoration: none;">${trend.sources[0].title || trend.sources[0].platform}</a>
        </p>
      ` : ''}
    </div>
  `).join('')

  // Upgrade CTA for free users
  const upgradeCta = userTier === 'free' ? `
    <div style="margin: 28px 0; padding: 20px; background: linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%); border: 1px solid #bfdbfe; border-radius: 12px; text-align: center;">
      <p style="margin: 0 0 12px; color: #2563eb; font-size: 16px; font-weight: 600;">
        ⭐ Unlock More with Pro
      </p>
      <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">
        Get all digest formats, custom delivery times, and unlimited domains.
      </p>
      <a href="${process.env.NEXT_PUBLIC_URL}/settings" style="display: inline-block; padding: 10px 24px; background: linear-gradient(to bottom, #60a5fa, #2563eb); color: white; text-decoration: none; border-radius: 10px; font-weight: 600;">
        Upgrade for $12/mo
      </a>
    </div>
  ` : ''

  const { error } = await getResend().emails.send({
    from: 'signalss <onboarding@resend.dev>',
    to: email,
    subject: `🔥 AI Digest: ${topTopic} + ${trends.length - 1} more trends`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px 20px; background: #f8fafc; color: #111827;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 28px;">
          <h1 style="margin: 0; color: #111827; font-size: 26px; font-weight: 700;">signalss</h1>
          <p style="margin: 8px 0 0; color: #9ca3af; font-size: 14px;">
            ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Here's your AI intelligence briefing:
        </p>

        ${trendsHtml}

        ${upgradeCta}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 16px;">
            <a href="${webViewUrl}" style="color: #2563eb; text-decoration: none; font-weight: 500;">View in browser</a>
            <span style="color: #d1d5db; margin: 0 8px;">·</span>
            Reply to this email with feedback
          </p>
          <p style="color: #d1d5db; font-size: 12px;">
            <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>

        <!-- Tracking pixel -->
        <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send digest email:', error)
    throw error
  }
}

// Send error alert to admin
export async function sendErrorAlert(
  subject: string,
  message: string,
  details?: string
) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.error('ADMIN_EMAIL not set, cannot send error alert')
    return
  }

  try {
    const { error } = await getResend().emails.send({
      from: 'signalss <onboarding@resend.dev>',
      to: adminEmail,
      subject: `[Alert] ${subject}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626; font-size: 24px;">Error Alert</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            ${message}
          </p>
          ${details ? `
            <pre style="background: #f3f4f6; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 12px;">
${details}
            </pre>
          ` : ''}
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Sent at ${new Date().toISOString()}
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Failed to send error alert:', error)
    }
  } catch (err) {
    console.error('Error sending alert email:', err)
  }
}
