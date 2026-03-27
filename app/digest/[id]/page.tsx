import { notFound } from 'next/navigation'
import { Cpu, Wrench, BookOpen, Flame, Sparkles, ExternalLink } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyDigestAccessToken } from '@/lib/digest-token'
import Link from 'next/link'

const categoryIcons: Record<string, React.ReactNode> = {
  models: <Cpu className="w-4 h-4" />,
  tools: <Wrench className="w-4 h-4" />,
  research: <BookOpen className="w-4 h-4" />,
  drama: <Flame className="w-4 h-4" />,
  tutorials: <Sparkles className="w-4 h-4" />,
}

const categoryColors: Record<string, string> = {
  models: 'bg-blue-50 text-blue-600',
  tools: 'bg-emerald-50 text-emerald-600',
  research: 'bg-purple-50 text-purple-600',
  drama: 'bg-orange-50 text-orange-600',
  tutorials: 'bg-pink-50 text-pink-600',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}

export default async function DigestPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { token } = await searchParams

  // Fetch the digest
  const { data: digest, error: digestError } = await supabaseAdmin
    .from('digests')
    .select('*')
    .eq('id', id)
    .single()

  if (digestError || !digest) {
    notFound()
  }

  if (!token || !(await verifyDigestAccessToken(id, digest.user_id, token))) {
    notFound()
  }

  // Mark as opened
  await supabaseAdmin
    .from('digests')
    .update({ opened: true })
    .eq('id', id)

  // Fetch the trends included in this digest
  const { data: trends } = await supabaseAdmin
    .from('trends')
    .select('*')
    .in('id', digest.trends_included || [])
    .order('engagement_score', { ascending: false })

  const digestDate = new Date(digest.sent_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-xl font-normal tracking-tight text-gray-900">signalss</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Daily AI Briefing
          </h1>
          <p className="text-gray-400">{digestDate}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-lg text-gray-500 mb-8">
          Here's your AI intelligence briefing:
        </p>

        {trends && trends.length > 0 ? (
          <div className="space-y-6">
            {trends.map((trend) => (
              <div
                key={trend.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[trend.category]}`}>
                    {categoryIcons[trend.category]}
                    {trend.category}
                  </span>
                </div>

                <h2 className="font-semibold text-gray-900 text-xl mb-3">
                  {trend.title}
                </h2>

                <p className="text-gray-500 leading-relaxed mb-4">
                  {trend.summary}
                </p>

                {trend.why_it_matters && (
                  <p className="text-gray-400 mb-4">
                    <span className="font-medium text-gray-700">Why it matters:</span>{' '}
                    {trend.why_it_matters}
                  </p>
                )}

                {trend.tiktok_angle && (
                  <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                    <p className="text-blue-600">
                      <span className="font-medium">Action:</span> {trend.tiktok_angle}
                    </p>
                  </div>
                )}

                {trend.sources && trend.sources.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                    {trend.sources.map((source: { url: string; platform: string; title?: string }, idx: number) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {source.title || source.platform || 'Source'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">
            No trends found for this digest.
          </p>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 mb-4">
            Want this in your inbox every morning?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-blue-400 to-blue-600 text-white font-medium rounded-lg transition-colors shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
          >
            Subscribe for free
          </Link>
        </div>
      </div>
    </main>
  )
}
