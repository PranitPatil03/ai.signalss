'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, ArrowLeft, Check, Loader2, Cpu, Rocket, FlaskConical, Briefcase, Palette, HeartPulse, GraduationCap, Film, Scale, Newspaper } from 'lucide-react'
import { ContentStyle } from '@/lib/supabase'
import { getAuthHeaders, syncCurrentUserProfile } from '@/lib/auth-client'

// Reddit-style domain categories
const DOMAIN_CATEGORIES = [
  {
    id: 'tech',
    label: 'Tech & Engineering',
    description: 'AI tools, coding, developer workflows, infrastructure',
    icon: Cpu,
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    iconColor: 'text-blue-400',
    keywords: ['AI', 'machine learning', 'LLM', 'coding', 'Copilot', 'Cursor', 'programming', 'developer tools', 'infrastructure'],
    subreddits: ['LocalLLaMA', 'MachineLearning', 'artificial'],
  },
  {
    id: 'startups',
    label: 'Startups & Founders',
    description: 'AI-first companies, funding, product launches',
    icon: Rocket,
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    iconColor: 'text-amber-400',
    keywords: ['startup', 'funding', 'launch', 'founder', 'venture', 'YC', 'seed round', 'Series A'],
    subreddits: ['artificial', 'MachineLearning'],
  },
  {
    id: 'research',
    label: 'Research & Papers',
    description: 'Breakthroughs, benchmarks, arxiv, new architectures',
    icon: FlaskConical,
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    iconColor: 'text-purple-400',
    keywords: ['research', 'paper', 'arxiv', 'benchmark', 'neural network', 'transformer', 'architecture', 'SOTA'],
    subreddits: ['MachineLearning', 'LocalLLaMA'],
  },
  {
    id: 'business',
    label: 'Business & Enterprise',
    description: 'Enterprise AI adoption, automation, ROI, strategy',
    icon: Briefcase,
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    keywords: ['enterprise', 'business', 'automation', 'ROI', 'strategy', 'digital transformation', 'AI adoption'],
    subreddits: ['artificial', 'ChatGPT'],
  },
  {
    id: 'creative',
    label: 'Creative & Design',
    description: 'Image gen, video, music, creative AI tools',
    icon: Palette,
    color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
    iconColor: 'text-pink-400',
    keywords: ['Midjourney', 'Stable Diffusion', 'DALL-E', 'Sora', 'image generation', 'creative AI', 'design'],
    subreddits: ['StableDiffusion', 'artificial'],
  },
  {
    id: 'healthcare',
    label: 'Healthcare & Biotech',
    description: 'Medical AI, drug discovery, diagnostics',
    icon: HeartPulse,
    color: 'from-red-500/20 to-red-600/10 border-red-500/30',
    iconColor: 'text-red-400',
    keywords: ['healthcare', 'medical AI', 'drug discovery', 'diagnostics', 'biotech', 'clinical AI'],
    subreddits: ['MachineLearning', 'artificial'],
  },
  {
    id: 'education',
    label: 'Education & Learning',
    description: 'AI tutoring, EdTech, skill development, courses',
    icon: GraduationCap,
    color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    keywords: ['education', 'learning', 'tutoring', 'EdTech', 'courses', 'AI education'],
    subreddits: ['MachineLearning', 'ChatGPT'],
  },
  {
    id: 'media',
    label: 'Media & Entertainment',
    description: 'AI in film, gaming, content, streaming',
    icon: Film,
    color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    iconColor: 'text-orange-400',
    keywords: ['gaming', 'film', 'entertainment', 'content', 'streaming', 'media AI'],
    subreddits: ['artificial', 'StableDiffusion'],
  },
  {
    id: 'safety',
    label: 'AI Safety & Ethics',
    description: 'Alignment, regulation, governance, responsible AI',
    icon: Scale,
    color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
    iconColor: 'text-violet-400',
    keywords: ['safety', 'alignment', 'ethics', 'regulation', 'governance', 'responsible AI', 'bias'],
    subreddits: ['MachineLearning', 'singularity'],
  },
  {
    id: 'general',
    label: 'General AI News',
    description: 'Everything else — models, GPT, Claude, industry moves',
    icon: Newspaper,
    color: 'from-zinc-500/20 to-zinc-600/10 border-zinc-500/30',
    iconColor: 'text-zinc-400',
    keywords: ['GPT', 'Claude', 'Gemini', 'Llama', 'chatbot', 'language model', 'OpenAI', 'Anthropic'],
    subreddits: ['ChatGPT', 'ClaudeAI', 'OpenAI', 'singularity'],
  },
]

const DIGEST_FORMATS: { id: ContentStyle; label: string; description: string }[] = [
  { id: 'tiktok', label: 'Quick Summary', description: 'Fast, punchy highlights — under 2 minutes' },
  { id: 'youtube', label: 'Deep Dive', description: 'Detailed analysis with context and examples' },
  { id: 'linkedin', label: 'Professional Brief', description: 'Business-focused, concise insights' },
  { id: 'twitter', label: 'Key Takeaways', description: 'Bullet-point style, most important points' },
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

function OnboardingContent() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['tech', 'general'])
  const [digestFormat, setDigestFormat] = useState<ContentStyle>('tiktok')
  const [digestTime, setDigestTime] = useState('07:00')
  const [timezone, setTimezone] = useState('Asia/Kolkata')

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const profile = await syncCurrentUserProfile()

        if (profile.onboarding_completed) {
          router.replace('/dashboard')
          return
        }

        setUserId(profile.userId)
      } catch {
        router.replace('/')
      } finally {
        setIsAuthLoading(false)
      }
    }

    bootstrap()
  }, [router])

  const toggleDomain = (id: string) => {
    setSelectedDomains(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!userId) {
      setError('Missing user ID. Please sign up again.')
      return
    }

    if (selectedDomains.length === 0) {
      setError('Please select at least one domain.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    // Build topics and subreddits from selected domains
    const selectedCategories = DOMAIN_CATEGORIES.filter(c => selectedDomains.includes(c.id))
    const topicKeywords = Array.from(new Set(selectedCategories.flatMap(c => c.keywords)))
    const subreddits = Array.from(new Set(selectedCategories.flatMap(c => c.subreddits)))

    const preferences = {
      topics: topicKeywords,
      subreddits,
      trusted_authors: [],
      digest_time: digestTime,
      content_style: digestFormat,
    }

    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId,
          preferences,
          timezone,
          onboarding_completed: true,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save preferences')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-2xl font-bold text-white">AI Daily Updates</span>
          </div>
          <p className="text-zinc-400">Personalize your daily AI briefing</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${s === step
                    ? 'bg-emerald-500 text-white'
                    : s < step
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 text-zinc-600'
                  }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 rounded ${s < step ? 'bg-emerald-500/40' : 'bg-white/5'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                What domains interest you?
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                Choose the AI domains you want to follow. We&apos;ll curate your daily briefing around these.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DOMAIN_CATEGORIES.map(domain => {
                  const Icon = domain.icon
                  const isSelected = selectedDomains.includes(domain.id)
                  return (
                    <button
                      key={domain.id}
                      onClick={() => toggleDomain(domain.id)}
                      className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${isSelected
                          ? `bg-gradient-to-br ${domain.color}`
                          : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12]'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSelected ? 'bg-white/10' : 'bg-white/5'
                          }`}>
                          <Icon className={`h-4 w-4 ${isSelected ? domain.iconColor : 'text-zinc-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                              {domain.label}
                            </span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${isSelected
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-white/20'
                              }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                          <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/60' : 'text-zinc-500'}`}>
                            {domain.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {selectedDomains.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{selectedDomains.length} domain{selectedDomains.length !== 1 ? 's' : ''} selected</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                How do you like your briefing?
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                Choose the format that works best for how you consume information.
              </p>

              <div className="grid gap-3">
                {DIGEST_FORMATS.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setDigestFormat(format.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${digestFormat === format.id
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${digestFormat === format.id ? 'border-emerald-400' : 'border-zinc-600'
                        }`}>
                        {digestFormat === format.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <div>
                        <div className={`font-medium ${digestFormat === format.id ? 'text-white' : 'text-zinc-300'}`}>
                          {format.label}
                        </div>
                        <div className="text-sm text-zinc-500">{format.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                When do you want your digest?
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                We&apos;ll send your personalized AI briefing at this time every day.
              </p>

              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Delivery Time
                  </label>
                  <input
                    type="time"
                    value={digestTime}
                    onChange={(e) => setDigestTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz.id} value={tz.id} className="bg-[#111113] text-white">
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Your briefing setup</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Domains</span>
                    <span className="text-zinc-300">
                      {selectedDomains.map(d => DOMAIN_CATEGORIES.find(c => c.id === d)?.label.split(' ')[0]).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Format</span>
                    <span className="text-zinc-300">{DIGEST_FORMATS.find(f => f.id === digestFormat)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Delivery</span>
                    <span className="text-zinc-300">{digestTime} ({TIMEZONES.find(t => t.id === timezone)?.label})</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1 && selectedDomains.length === 0) {
                  setError('Please select at least one domain.')
                  return
                }
                setError(null)
                setStep(s => s + 1)
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-colors font-medium"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-colors disabled:opacity-50 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Start My Briefing
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

export default function OnboardingPage() {
  return <OnboardingContent />
}
