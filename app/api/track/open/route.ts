import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// 1x1 transparent GIF as Uint8Array (Cloudflare Workers compatible)
const TRACKING_PIXEL = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0))

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const digestId = searchParams.get('id')

  if (digestId) {
    try {
      // Update opened_at timestamp
      await supabaseAdmin
        .from('digests')
        .update({
          opened: true,
          opened_at: new Date().toISOString(),
        })
        .eq('id', digestId)

      console.log(`Digest ${digestId} opened`)
    } catch (error) {
      console.error('Failed to track open:', error)
    }
  }

  // Return tracking pixel
  return new NextResponse(TRACKING_PIXEL, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}
