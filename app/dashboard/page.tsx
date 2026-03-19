import { Cpu, Wrench, BookOpen, Flame, Sparkles, ExternalLink, AlertTriangle, RefreshCw, TrendingUp, Zap } from 'lucide-react'
import { supabaseAdmin, Trend } from '@/lib/supabase'
import Image from 'next/image'
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

const categoryColors: Record<string, { badge: string; accent: string }> = {
  models: { badge: 'bg-blue-50 text-blue-600', accent: 'from-blue-500 to-blue-600' },
  tools: { badge: 'bg-emerald-50 text-emerald-600', accent: 'from-emerald-500 to-emerald-600' },
  research: { badge: 'bg-purple-50 text-purple-600', accent: 'from-purple-500 to-purple-600' },
  drama: { badge: 'bg-orange-50 text-orange-600', accent: 'from-orange-500 to-orange-600' },
  tutorials: { badge: 'bg-pink-50 text-pink-600', accent: 'from-pink-500 to-pink-600' },
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

  // Category counts for stats
  const categoryCounts = trends.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="signalss" width={24} height={24} className="rounded" />
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-xl transition-colors shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </a>
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <Sparkles className="w-9 h-9 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No trends yet today
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              The scanner runs at 6am PT. Check back later or trigger a manual scan.
            </p>
            <ScanButton />
          </div>
        ) : (
          <>
            {/* Hero stats area */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    Today&apos;s AI Briefing
                  </h1>
                  <p className="text-gray-500">
                    {trends.length} signals from across the web
                  </p>
                </div>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <span
                    key={cat}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${categoryColors[cat]?.badge || 'bg-gray-50 text-gray-600'}`}
                  >
                    {categoryIcons[cat]}
                    {cat}
                    <span className="ml-0.5 opacity-60">{count}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured card (first trend) */}
            {trends.length > 0 && (
              <div className="mb-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/15 text-white/90 backdrop-blur-sm">
                        <Zap className="w-3 h-3" />
                        Top Signal
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70">
                        {categoryIcons[trends[0].category]}
                        {trends[0].category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{trends[0].title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed max-w-2xl mb-4">
                      {trends[0].summary}
                    </p>
                    {trends[0].why_it_matters && (
                      <p className="text-sm text-white/60 mb-4">
                        <span className="font-semibold text-white/80">Why it matters:</span>{' '}
                        {trends[0].why_it_matters}
                      </p>
                    )}
                    {trends[0].tiktok_angle && (
                      <div className="inline-flex items-start gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl mb-4">
                        <TrendingUp className="w-4 h-4 mt-0.5 shrink-0 text-blue-300" />
                        <p className="text-sm text-white/80">
                          {trends[0].tiktok_angle}
                        </p>
                      </div>
                    )}
                    {trends[0].sources && trends[0].sources.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {trends[0].sources.slice(0, 3).map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-blue-200 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {source.platform || 'Source'}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Rest of trends */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trends.slice(1).map((trend) => {
                const colors = categoryColors[trend.category] || { badge: 'bg-gray-50 text-gray-600', accent: 'from-gray-500 to-gray-600' }
                return (
                  <div
                    key={trend.id}
                    className="group relative rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                        {categoryIcons[trend.category]}
                        {trend.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {trend.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-3">
                      {trend.summary}
                    </p>

                    {trend.why_it_matters && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        <span className="font-semibold text-gray-700">Why it matters:</span>{' '}
                        {trend.why_it_matters}
                      </p>
                    )}

                    {trend.tiktok_angle && (
                      <div className="px-3 py-2 bg-blue-50/70 rounded-xl mb-3">
                        <p className="text-sm text-blue-600 line-clamp-2">
                          <span className="font-medium">Action:</span> {trend.tiktok_angle}
                        </p>
                      </div>
                    )}

                    {trend.sources && trend.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-100">
                        {trend.sources.slice(0, 2).map((source, idx) => (
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
                )
              })}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
