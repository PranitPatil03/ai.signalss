'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, ArrowLeft, Check, Loader2, Cpu, Rocket, FlaskConical, Briefcase, Palette, HeartPulse, GraduationCap, Film, Scale, Newspaper, Plus, X } from 'lucide-react'
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
  const [customTopics, setCustomTopics] = useState<string[]>([])
  const [newTopic, setNewTopic] = useState('')
  const [digestFormat] = useState<ContentStyle>('tiktok')
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
    const topicKeywords = Array.from(new Set([...selectedCategories.flatMap(c => c.keywords), ...customTopics]))
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

  const addTopic = () => {
    const topic = newTopic.trim()
    if (topic && !customTopics.includes(topic)) {
      setCustomTopics([...customTopics, topic])
      setNewTopic('')
    }
  }

  const removeTopic = (topic: string) => {
    setCustomTopics(customTopics.filter(t => t !== topic))
  }

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 pt-8 pb-2">
        <Image src="/images/logo.png" alt="signalss" width={28} height={28} className="rounded" />
        <span className="text-2xl font-normal tracking-tight text-gray-900">signalss</span>
      </div>
      <p className="text-center text-gray-500 text-sm mb-6">Personalize your daily AI briefing</p>

      {/* Progress */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {[1, 2].map(s => (
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
            {s < 2 && (
              <div className={`w-12 h-0.5 rounded ${s < step ? 'bg-blue-300' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pb-6 flex flex-col">
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              What domains interest you?
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Choose the AI domains you want to follow.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-5">
              {DOMAIN_CATEGORIES.map(domain => {
                const Icon = domain.icon
                const isSelected = selectedDomains.includes(domain.id)
                return (
                  <button
                    key={domain.id}
                    onClick={() => toggleDomain(domain.id)}
                    className={`relative rounded-xl p-3 text-left transition-all ${isSelected
                      ? 'bg-blue-50 ring-2 ring-blue-200'
                      : 'bg-white hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? domain.iconColor : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium truncate ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                        {domain.label.split(' ')[0]}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Custom topics */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Add custom topics</label>
              {customTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {customTopics.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {t}
                      <button onClick={() => removeTopic(t)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                  placeholder="e.g., computer vision, RAG, agents"
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400"
                />
                <button onClick={addTopic} className="px-3 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedDomains.length > 0 && (
              <p className="text-xs text-gray-500">
                <Check className="inline h-3.5 w-3.5 text-blue-500 mr-1" />
                {selectedDomains.length} domain{selectedDomains.length !== 1 ? 's' : ''} selected
                {customTopics.length > 0 && ` + ${customTopics.length} custom topic${customTopics.length !== 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              When do you want your digest?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              We&apos;ll send your AI briefing at this time every day.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={digestTime}
                  onChange={(e) => setDigestTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz.id} value={tz.id}>{tz.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-gray-50 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your briefing setup</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Domains</span>
                  <span className="text-gray-700 text-right">
                    {selectedDomains.map(d => DOMAIN_CATEGORIES.find(c => c.id === d)?.label.split(' ')[0]).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Format</span>
                  <span className="text-gray-700">Quick Summary</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-gray-700">{digestTime} ({TIMEZONES.find(t => t.id === timezone)?.label})</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-xl text-red-600 text-sm mb-4">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < 2 ? (
            <button
              onClick={() => {
                if (selectedDomains.length === 0) {
                  setError('Please select at least one domain.')
                  return
                }
                setError(null)
                setStep(2)
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-xl font-medium shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-xl font-medium shadow-[0_4px_14px_rgba(37,99,235,0.4)] disabled:opacity-50"
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
