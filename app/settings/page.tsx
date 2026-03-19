'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Save, Plus, X, Check, Loader2, Lock, Crown } from 'lucide-react'
import { ContentStyle, DEFAULT_PREFERENCES, UserPreferences } from '@/lib/supabase'
import { PLANS } from '@/lib/stripe'
import { getAuthHeaders, syncCurrentUserProfile } from '@/lib/auth-client'

const SUBREDDIT_OPTIONS = [
  { id: 'LocalLLaMA', label: 'r/LocalLLaMA' },
  { id: 'MachineLearning', label: 'r/MachineLearning' },
  { id: 'artificial', label: 'r/artificial' },
  { id: 'ClaudeAI', label: 'r/ClaudeAI' },
  { id: 'ChatGPT', label: 'r/ChatGPT' },
  { id: 'StableDiffusion', label: 'r/StableDiffusion' },
  { id: 'singularity', label: 'r/singularity' },
  { id: 'OpenAI', label: 'r/OpenAI' },
  { id: 'Bard', label: 'r/Bard' },
]

const DIGEST_FORMATS: { id: ContentStyle; label: string; description: string; proOnly?: boolean }[] = [
  { id: 'tiktok', label: 'Quick Summary', description: 'Fast, punchy highlights — under 2 minutes' },
  { id: 'youtube', label: 'Deep Dive', description: 'Detailed analysis with context and examples', proOnly: true },
  { id: 'linkedin', label: 'Professional Brief', description: 'Business-focused, concise insights', proOnly: true },
  { id: 'twitter', label: 'Key Takeaways', description: 'Bullet-point style, most important points', proOnly: true },
  { id: 'newsletter', label: 'Full Report', description: 'Comprehensive newsletter-style breakdown', proOnly: true },
]

const TIMEZONES = [
  { id: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { id: 'America/Denver', label: 'Mountain Time (MT)' },
  { id: 'America/Chicago', label: 'Central Time (CT)' },
  { id: 'America/New_York', label: 'Eastern Time (ET)' },
  { id: 'Europe/London', label: 'London (GMT/BST)' },
  { id: 'Europe/Paris', label: 'Central Europe (CET)' },
  { id: 'Asia/Kolkata', label: 'India (IST)' },
  { id: 'Asia/Tokyo', label: 'Japan (JST)' },
  { id: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { id: 'Australia/Sydney', label: 'Sydney (AEST)' },
]

function SettingsContent() {
  const [userId, setUserId] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [errorIsUpgradeable, setErrorIsUpgradeable] = useState(false)
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free')

  // Form state
  const [topics, setTopics] = useState<string[]>(DEFAULT_PREFERENCES.topics)
  const [newTopic, setNewTopic] = useState('')
  const [subreddits, setSubreddits] = useState<string[]>(DEFAULT_PREFERENCES.subreddits)
  const [trustedAuthors, setTrustedAuthors] = useState<string[]>([])
  const [newAuthor, setNewAuthor] = useState('')
  const [contentStyle, setContentStyle] = useState<ContentStyle>('tiktok')
  const [digestTime, setDigestTime] = useState('07:00')
  const [timezone, setTimezone] = useState('America/Los_Angeles')

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const profile = await syncCurrentUserProfile()
        setUserId(profile.userId)
        await fetchPreferences()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Please sign in again.')
      } finally {
        setIsLoading(false)
      }
    }

    bootstrap()
  }, [])

  const fetchPreferences = async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/user/preferences', { headers })
      if (!response.ok) throw new Error('Failed to fetch preferences')

      const data = await response.json()
      const prefs: UserPreferences = data.preferences || DEFAULT_PREFERENCES

      setTopics(prefs.topics || DEFAULT_PREFERENCES.topics)
      setSubreddits(prefs.subreddits || DEFAULT_PREFERENCES.subreddits)
      setTrustedAuthors(prefs.trusted_authors || [])
      setContentStyle(prefs.content_style || 'tiktok')
      setDigestTime(prefs.digest_time || '07:00')
      setTimezone(data.timezone || 'America/Los_Angeles')
      setUserTier(data.subscription_tier || 'free')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    }
  }

  const handleUpgrade = async () => {
    if (!userId) return

    setIsUpgrading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers,
      })

      if (!response.ok) throw new Error('Failed to create checkout session')

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start upgrade')
    } finally {
      setIsUpgrading(false)
    }
  }

  const isFeatureLocked = (feature: 'style' | 'topics' | 'digestTime', value?: string | number): boolean => {
    if (userTier === 'pro') return false

    if (feature === 'style' && value) {
      const style = DIGEST_FORMATS.find(s => s.id === value)
      return style?.proOnly || false
    }

    if (feature === 'topics' && typeof value === 'number') {
      return value > PLANS.free.limits.topics
    }

    if (feature === 'digestTime') {
      return !PLANS.free.limits.customDigestTime
    }

    return false
  }

  const handleSave = async () => {
    if (!userId) return

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const preferences: UserPreferences = {
        topics,
        subreddits,
        trusted_authors: trustedAuthors,
        digest_time: digestTime,
        content_style: contentStyle,
      }

      const headers = await getAuthHeaders()
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId, preferences, timezone }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      setSaveStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      if (isFeatureLocked('topics', topics.length + 1)) {
        setError(`Free plan limited to ${PLANS.free.limits.topics} topics.`)
        setErrorIsUpgradeable(true)
        return
      }
      setTopics([...topics, newTopic.trim()])
      setNewTopic('')
      setError(null)
      setErrorIsUpgradeable(false)
    }
  }

  const removeTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic))
  }

  const addAuthor = () => {
    const author = newAuthor.trim().replace('@', '')
    if (author && !trustedAuthors.includes(author)) {
      setTrustedAuthors([...trustedAuthors, author])
      setNewAuthor('')
    }
  }

  const removeAuthor = (author: string) => {
    setTrustedAuthors(trustedAuthors.filter(a => a !== author))
  }

  const toggleSubreddit = (id: string) => {
    setSubreddits(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </main>
    )
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white mb-2">Sign in required</h1>
          <p className="text-zinc-400 mb-4">Please sign up or sign in to access settings.</p>
          <Link href="/" className="text-emerald-400 hover:text-emerald-300">
            Go to homepage
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#09090b]">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#111113]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-white">Settings</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between gap-4">
            <span className="text-red-400 text-sm">{error}</span>
            {errorIsUpgradeable && userTier === 'free' && (
              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isUpgrading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Crown className="w-3 h-3" />
                )}
                Upgrade to Pro
              </button>
            )}
          </div>
        )}

        {/* Topics Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Topics to Track</h2>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
            <div className="flex flex-wrap gap-2 mb-4">
              {topics.map(topic => (
                <span
                  key={topic}
                  className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 flex items-center gap-2"
                >
                  {topic}
                  <button onClick={() => removeTopic(topic)} className="hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                placeholder="Add a topic (e.g., 'computer vision')"
                className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/40"
              />
              <button
                onClick={addTopic}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Subreddits Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Subreddits to Scan</h2>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUBREDDIT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleSubreddit(option.id)}
                  className={`p-2 rounded-lg border text-left transition-all ${subreddits.includes(option.id)
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-white'
                      : 'border-white/[0.06] hover:border-white/[0.12] text-zinc-400'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${subreddits.includes(option.id)
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-zinc-600'
                      }`}>
                      {subreddits.includes(option.id) && (
                        <Check className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted Authors Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-2">Trusted Authors</h2>
          <p className="text-zinc-500 text-sm mb-4">
            Content from these accounts gets a 2x boost in your digest rankings.
          </p>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
            {trustedAuthors.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {trustedAuthors.map(author => (
                  <span
                    key={author}
                    className="px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded-full text-sm text-zinc-300 flex items-center gap-2"
                  >
                    @{author}
                    <button onClick={() => removeAuthor(author)} className="text-zinc-500 hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAuthor()}
                placeholder="@username (e.g., @karpathy)"
                className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/40"
              />
              <button
                onClick={addAuthor}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Digest Format Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Digest Format</h2>
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
            <div className="grid sm:grid-cols-2 gap-3">
              {DIGEST_FORMATS.map(format => {
                const locked = isFeatureLocked('style', format.id)
                return (
                  <button
                    key={format.id}
                    onClick={() => {
                      if (locked) {
                        setError('This format is only available on Pro.')
                        setErrorIsUpgradeable(true)
                        return
                      }
                      setContentStyle(format.id)
                      setError(null)
                      setErrorIsUpgradeable(false)
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative ${contentStyle === format.id
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : locked
                          ? 'border-white/[0.04] opacity-50 cursor-not-allowed'
                          : 'border-white/[0.06] hover:border-white/[0.12]'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${contentStyle === format.id ? 'border-emerald-400' : 'border-zinc-600'
                        }`}>
                        {contentStyle === format.id && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white flex items-center gap-2">
                          {format.label}
                          {locked && <Lock className="w-3 h-3 text-zinc-500" />}
                        </div>
                        <div className="text-xs text-zinc-500">{format.description}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Delivery Time Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-white">Delivery Time</h2>
            {isFeatureLocked('digestTime') && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                <Crown className="w-3 h-3" />
                Pro
              </span>
            )}
          </div>
          <div className={`rounded-xl border border-white/[0.06] bg-[#111113] p-5 ${isFeatureLocked('digestTime') ? 'opacity-50' : ''}`}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Time</label>
                <input
                  type="time"
                  value={digestTime}
                  onChange={(e) => {
                    if (isFeatureLocked('digestTime')) {
                      setError('Custom delivery time is only available on Pro.')
                      setErrorIsUpgradeable(true)
                      return
                    }
                    setDigestTime(e.target.value)
                  }}
                  disabled={isFeatureLocked('digestTime')}
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-emerald-500/40 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-emerald-500/40"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz.id} value={tz.id} className="bg-[#111113] text-white">{tz.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Upgrade to Pro Section */}
        {userTier === 'free' && (
          <section className="mb-8">
            <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5 p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Upgrade to Pro</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Unlock unlimited topics, all digest formats (Deep Dive, Professional Brief, Key Takeaways, Full Report), and custom delivery times.
                  </p>
                  <button
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isUpgrading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4" />
                        Upgrade for $12/mo
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${saveStatus === 'saved'
                ? 'bg-emerald-500 text-white'
                : saveStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              } disabled:opacity-50`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function SettingsPage() {
  return <SettingsContent />
}
