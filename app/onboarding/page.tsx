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
    color: 'from-blue-50 to-blue-100/50 border-blue-200',
    iconColor: 'text-blue-500',
    keywords: ['AI', 'machine learning', 'LLM', 'coding', 'Copilot', 'Cursor', 'programming', 'developer tools', 'infrastructure'],
    subreddits: ['LocalLLaMA', 'MachineLearning', 'artificial'],
  },
  {
    id: 'startups',
    label: 'Startups & Founders',
    description: 'AI-first companies, funding, product launches',
    icon: Rocket,
    color: 'from-amber-50 to-amber-100/50 border-amber-200',
    iconColor: 'text-amber-500',
    keywords: ['startup', 'funding', 'launch', 'founder', 'venture', 'YC', 'seed round', 'Series A'],
    subreddits: ['artificial', 'MachineLearning'],
  },
  {
    id: 'research',
    label: 'Research & Papers',
    description: 'Breakthroughs, benchmarks, arxiv, new architectures',
    icon: FlaskConical,
    color: 'from-purple-50 to-purple-100/50 border-purple-200',
    iconColor: 'text-purple-500',
    keywords: ['research', 'paper', 'arxiv', 'benchmark', 'neural network', 'transformer', 'architecture', 'SOTA'],
    subreddits: ['MachineLearning', 'LocalLLaMA'],
  },
  {
    id: 'business',
    label: 'Business & Enterprise',
    description: 'Enterprise AI adoption, automation, ROI, strategy',
    icon: Briefcase,
    color: 'from-emerald-50 to-emerald-100/50 border-emerald-200',
    iconColor: 'text-emerald-500',
    keywords: ['enterprise', 'business', 'automation', 'ROI', 'strategy', 'digital transformation', 'AI adoption'],
    subreddits: ['artificial', 'ChatGPT'],
  },
  {
    id: 'creative',
    label: 'Creative & Design',
    description: 'Image gen, video, music, creative AI tools',
    icon: Palette,
    color: 'from-pink-50 to-pink-100/50 border-pink-200',
    iconColor: 'text-pink-500',
    keywords: ['Midjourney', 'Stable Diffusion', 'DALL-E', 'Sora', 'image generation', 'creative AI', 'design'],
    subreddits: ['StableDiffusion', 'artificial'],
  },
  {
    id: 'healthcare',
    label: 'Healthcare & Biotech',
    description: 'Medical AI, drug discovery, diagnostics',
    icon: HeartPulse,
    color: 'from-red-50 to-red-100/50 border-red-200',
    iconColor: 'text-red-500',
    keywords: ['healthcare', 'medical AI', 'drug discovery', 'diagnostics', 'biotech', 'clinical AI'],
    subreddits: ['MachineLearning', 'artificial'],
  },
  {
    id: 'education',
    label: 'Education & Learning',
    description: 'AI tutoring, EdTech, skill development, courses',
    icon: GraduationCap,
    color: 'from-cyan-50 to-cyan-100/50 border-cyan-200',
    iconColor: 'text-cyan-500',
    keywords: ['education', 'learning', 'tutoring', 'EdTech', 'courses', 'AI education'],
    subreddits: ['MachineLearning', 'ChatGPT'],
  },
  {
    id: 'media',
    label: 'Media & Entertainment',
    description: 'AI in film, gaming, content, streaming',
    icon: Film,
    color: 'from-orange-50 to-orange-100/50 border-orange-200',
    iconColor: 'text-orange-500',
    keywords: ['gaming', 'film', 'entertainment', 'content', 'streaming', 'media AI'],
    subreddits: ['artificial', 'StableDiffusion'],
  },
  {
    id: 'safety',
    label: 'AI Safety & Ethics',
    description: 'Alignment, regulation, governance, responsible AI',
    icon: Scale,
    color: 'from-violet-50 to-violet-100/50 border-violet-200',
    iconColor: 'text-violet-500',
    keywords: ['safety', 'alignment', 'ethics', 'regulation', 'governance', 'responsible AI', 'bias'],
    subreddits: ['MachineLearning', 'singularity'],
  },
  {
    id: 'general',
    label: 'General AI News',
    description: 'Everything else — models, GPT, Claude, industry moves',
    icon: Newspaper,
    color: 'from-gray-50 to-gray-100/50 border-gray-200',
    iconColor: 'text-gray-500',
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
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-2xl font-bold text-gray-900">signalss</span>
          </div>
          <p className="text-gray-500">Personalize your daily AI briefing</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${s === step
                  ? 'bg-blue-500 text-white'
                  : s < step
                    ? 'bg-blue-100 text-blue-500'
                    : 'bg-gray-100 text-gray-400'
                  }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 rounded ${s < step ? 'bg-blue-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                What domains interest you?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
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
                        : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSelected ? 'bg-white/20' : 'bg-gray-100'
                          }`}>
                          <Icon className={`h-4 w-4 ${isSelected ? domain.iconColor : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                              {domain.label}
                            </span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${isSelected
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                              }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                          <p className={`text-xs mt-0.5 ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                            {domain.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {selectedDomains.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <Check className="h-3.5 w-3.5 text-blue-500" />
                  <span>{selectedDomains.length} domain{selectedDomains.length !== 1 ? 's' : ''} selected</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                How do you like your briefing?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Choose the format that works best for how you consume information.
              </p>

              <div className="grid gap-3">
                {DIGEST_FORMATS.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setDigestFormat(format.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${digestFormat === format.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${digestFormat === format.id ? 'border-blue-500' : 'border-gray-300'
                        }`}>
                        {digestFormat === format.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <div>
                        <div className={`font-medium ${digestFormat === format.id ? 'text-gray-900' : 'text-gray-700'}`}>
                          {format.label}
                        </div>
                        <div className="text-sm text-gray-500">{format.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                When do you want your digest?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                We&apos;ll send your personalized AI briefing at this time every day.
              </p>

              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <input
                    type="time"
                    value={digestTime}
                    onChange={(e) => setDigestTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz.id} value={tz.id} className="bg-white text-gray-900">
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Your briefing setup</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Domains</span>
                    <span className="text-gray-700">
                      {selectedDomains.map(d => DOMAIN_CATEGORIES.find(c => c.id === d)?.label.split(' ')[0]).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Format</span>
                    <span className="text-gray-700">{DIGEST_FORMATS.find(f => f.id === digestFormat)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-gray-700">{digestTime} ({TIMEZONES.find(t => t.id === timezone)?.label})</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
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
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
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
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl transition-colors font-medium shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 font-medium shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
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
