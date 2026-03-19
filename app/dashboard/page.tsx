import { Cpu, Wrench, BookOpen, Flame, Sparkles, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react'
import { supabaseAdmin, Trend } from '@/lib/supabase'
import { RefreshButton } from '@/components/dashboard/RefreshButton'
import { ScanButton } from '@/components/dashboard/ScanButton'
import { TrackingBadge } from '@/components/dashboard/TrackingBadge'
import { SettingsLink } from '@/components/dashboard/SettingsLink'
import Link from 'next/link'

const categoryIcons: Record<string, React.ReactNode> = {
  models: <Cpu className="w-3.5 h-3.5" />,
  tools: <Wrench className="w-3.5 h-3.5" />,
  research: <BookOpen className="w-3.5 h-3.5" />,
  drama: <Flame className="w-3.5 h-3.5" />,
  tutorials: <Sparkles className="w-3.5 h-3.5" />,
}

const categoryColors: Record<string, string> = {
  models: 'bg-blue-50 text-blue-600 border-blue-200',
  tools: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  research: 'bg-purple-50 text-purple-600 border-purple-200',
  drama: 'bg-orange-50 text-orange-600 border-orange-200',
  tutorials: 'bg-pink-50 text-pink-600 border-pink-200',
}

interface DashboardData {
  trends: Trend[]
  error?: string
}

async function getTodaysTrends(): Promise<DashboardData> {
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data: trends, error } = await supabaseAdmin
      .from('trends')
      .select('*')
      .eq('date', today)
      .order('engagement_score', { ascending: false })

    if (error) {
      console.error('Failed to fetch trends:', error)
      return { trends: [], error: 'Failed to load trends. Please try again.' }
    }

    return { trends: trends || [] }
  } catch (err) {
    console.error('Dashboard error:', err)
    return { trends: [], error: 'Something went wrong. Please try again.' }
  }
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { trends, error } = await getTodaysTrends()
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-normal tracking-tight text-gray-900">signalss</span>
            </Link>
            <TrackingBadge />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">{today}</span>
            <SettingsLink />
            <RefreshButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-lg transition-colors shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </a>
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No trends yet today
            </h2>
            <p className="text-gray-500 mb-6">
              The scanner runs at 6am PT. Check back later or trigger a manual scan.
            </p>
            <ScanButton />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Today&apos;s AI Briefing
              </h1>
              <p className="text-gray-500">
                {trends.length} signals from across the web
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {trends.map((trend) => (
                <div
                  key={trend.id}
                  className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${categoryColors[trend.category]}`}>
                      {categoryIcons[trend.category]}
                      {trend.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      Score: {trend.engagement_score}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {trend.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed mb-3">
                    {trend.summary}
                  </p>

                  {trend.why_it_matters && (
                    <p className="text-sm text-gray-400 mb-3">
                      <span className="font-medium text-gray-700">Why it matters:</span>{' '}
                      {trend.why_it_matters}
                    </p>
                  )}

                  {trend.tiktok_angle && (
                    <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                      <p className="text-sm text-blue-600">
                        <span className="font-medium">Action:</span> {trend.tiktok_angle}
                      </p>
                    </div>
                  )}

                  {trend.sources && trend.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                      {trend.sources.slice(0, 3).map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {source.platform || 'Source'}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
