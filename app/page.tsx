'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  Brain,
  Rocket,
  FlaskConical,
  Code2,
  Palette,
  Shield,
  HeartPulse,
  Bot,
  Eye,
  GraduationCap,
  Server,
  Newspaper,
  Cpu,
  Globe,
  Sparkles,
  Layers,
  Target,
  Clock,
  BarChart3,
  Mail,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Signal Cards Data                                                  */
/* ------------------------------------------------------------------ */

const signalCardsRow1 = [
  { icon: Brain, title: 'LLM Breakthroughs', description: 'Latest model improvements in reasoning, coding, and multi-modal capabilities across GPT, Claude, Gemini', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  { icon: Rocket, title: 'AI Startup Funding', description: 'VC investments, seed rounds, and Series A launches from AI-first companies disrupting industries', color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
  { icon: FlaskConical, title: 'Research Papers', description: 'Breakthrough arxiv papers, new architectures, SOTA benchmarks, and academic advances in ML', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  { icon: Code2, title: 'Open Source Tools', description: 'New frameworks, libraries, and developer tools for building AI applications faster', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: Palette, title: 'Creative AI', description: 'Image generation, video synthesis, music composition, and creative design powered by AI', color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-100' },
  { icon: Shield, title: 'AI Regulation', description: 'Policy updates, governance frameworks, and regulatory changes affecting AI development globally', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
  { icon: HeartPulse, title: 'Healthcare AI', description: 'Medical diagnostics, drug discovery, clinical trials, and biotech breakthroughs using AI', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  { icon: Bot, title: 'AI Agents', description: 'Autonomous systems, multi-agent workflows, and agentic AI frameworks for complex tasks', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
]

const signalCardsRow2 = [
  { icon: Cpu, title: 'Coding Assistants', description: 'Developer copilots, code generation, automated testing, and IDE integrations for engineering', color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100' },
  { icon: Eye, title: 'Computer Vision', description: 'Object detection, image segmentation, 3D reconstruction, and visual understanding advances', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100' },
  { icon: Globe, title: 'Enterprise AI', description: 'Business adoption strategies, automation ROI, digital transformation, and AI deployment guides', color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-teal-100' },
  { icon: GraduationCap, title: 'Education AI', description: 'Intelligent tutoring systems, personalized learning, EdTech innovations, and skill development', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
  { icon: Server, title: 'AI Infrastructure', description: 'GPU compute, model training, deployment pipelines, and cloud AI platform updates', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' },
  { icon: Newspaper, title: 'General AI News', description: 'Industry moves, partnerships, product launches, and everything else in the AI ecosystem', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' },
  { icon: Layers, title: 'Multi-modal AI', description: 'Vision-language models, audio understanding, and cross-modal reasoning capabilities', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50', border: 'border-fuchsia-100' },
  { icon: Shield, title: 'AI Safety', description: 'Alignment research, interpretability, red-teaming, responsible AI practices and guardrails', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
]

/* ------------------------------------------------------------------ */
/*  Pricing                                                            */
/* ------------------------------------------------------------------ */

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individuals getting started with AI intelligence.',
    features: [
      '3 tracked domains',
      'Daily digest at fixed time',
      'Top 5 signals each day',
      'Email + in-app access',
      'Community support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    description: 'For professionals who move fast with AI.',
    features: [
      'Everything in Free',
      'Unlimited domains',
      'Custom delivery schedule',
      'Deep-dive analysis format',
      'Priority sources & support',
      'Full briefing history',
    ],
    cta: 'Upgrade Now',
    highlight: true,
  },
]

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: 'What sources do you scan?',
    a: 'Reddit, Hacker News, Bluesky, RSS feeds, AI lab blogs (OpenAI, Anthropic, Google DeepMind), and tech publications. Our ranking algorithm balances trust, freshness, and your interests.',
  },
  {
    q: 'Who is this for?',
    a: 'Anyone who wants to stay updated on AI — engineers, startup founders, researchers, product managers, business leaders, students, and curious minds. You choose your domains and we personalize your briefing.',
  },
  {
    q: 'When do I get my digest?',
    a: 'Free users get one daily digest at 7 AM in their timezone. Pro users can choose any custom delivery time.',
  },
  {
    q: 'Can I change my interests later?',
    a: 'Absolutely. Update your domains and topics anytime in settings. Changes are applied from the next digest onward.',
  },
  {
    q: 'How is the AI analysis done?',
    a: 'We use Claude AI to analyze and synthesize trends from across all sources. It generates summaries, identifies why each trend matters, and suggests actionable next steps relevant to your domains.',
  },
  {
    q: 'Is Google sign-in supported?',
    a: 'Yes. You can sign in with email/password or Google OAuth — both are fully supported.',
  },
]

/* ------------------------------------------------------------------ */
/*  Signal Card Component                                             */
/* ------------------------------------------------------------------ */

function SignalCard({ card }: { card: typeof signalCardsRow1[0] }) {
  const Icon = card.icon
  return (
    <div className={`flex items-center gap-4 w-[340px] shrink-0 rounded-sm bg-white p-4 shadow-sm`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.bg}`}>
        <Icon className={`h-5 w-5 ${card.color}`} />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-semibold text-gray-900">{card.title}</span>
        <span className="text-xs text-gray-500 leading-relaxed line-clamp-2">{card.description}</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc]">
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 w-full bg-[#f8fafc]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="signalss" width={28} height={28} className="rounded" />
            <span className="text-xl font-normal tracking-tight text-gray-900">signalss</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="/sign-in"
              className="text-gray-500 transition-colors hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center rounded-full bg-gray-900 px-5 text-sm font-medium text-white transition-all hover:bg-gray-800"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center md:pt-28">
        <h1 className="animate-fade-in-up relative max-w-3xl text-4xl font-light tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
          AI updates that{' '}
          <br className="hidden sm:block" />
          never sleep
        </h1>
        <p className="animate-fade-in-up-delay-1 relative mt-6 max-w-2xl text-base font-light leading-relaxed text-gray-500 md:text-lg">
          Get personalized AI updates across startups, tech, research, business,
          and more — summarized daily so you stay ahead without reading everything.
        </p>
        <div className="animate-fade-in-up-delay-2 relative mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center gap-2 rounded-sm bg-gradient-to-b from-blue-400 to-blue-600 px-8 text-sm font-medium text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]"
          >
            Get Started Free
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── Marquee Signal Cards ── */}
      <section className="relative px-0 pb-24 pt-8 overflow-hidden">
        {/* Row 1: Left to right */}
        <div className="mb-4 flex overflow-hidden py-2" style={{ '--gap': '16px' } as React.CSSProperties}>
          <div className="animate-marquee flex gap-4" style={{ '--duration': '45s' } as React.CSSProperties}>
            {[...signalCardsRow1, ...signalCardsRow1].map((card, i) => (
              <SignalCard key={`r1-${i}`} card={card} />
            ))}
          </div>
        </div>
        {/* Row 2: Right to left */}
        <div className="flex overflow-hidden py-2" style={{ '--gap': '16px' } as React.CSSProperties}>
          <div className="animate-marquee-reverse flex gap-4" style={{ '--duration': '50s' } as React.CSSProperties}>
            {[...signalCardsRow2, ...signalCardsRow2].map((card, i) => (
              <SignalCard key={`r2-${i}`} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features – Bento Grid ── */}
      <section id="features" className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-base text-gray-500">
              A complete AI intelligence platform — multi-source scanning, personalized ranking, and daily delivery.
            </p>
          </div>

          {/* Row 1: 3 columns */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group rounded-md bg-white p-6 transition-shadow shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-500">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Personalized domains</h3>
              <p className="mt-2 text-sm text-gray-500">
                We adapt the depth and focus of every briefing to match your role and interests.
              </p>
            </div>

            <div className="group rounded-md bg-white p-6 transition-shadow shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-500">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">5-minute daily read</h3>
              <p className="mt-2 text-sm text-gray-500">
                Concise, actionable summaries. No fluff, just what you need to know.
              </p>
            </div>

            <div className="group rounded-md bg-white p-6 transition-shadow shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-500">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Multi-source scanning</h3>
              <p className="mt-2 text-sm text-gray-500">
                Reddit, Hacker News, Bluesky, RSS, AI lab blogs — all in one place.
              </p>
            </div>
          </div>

          {/* Row 2: 2 columns */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group rounded-md bg-white p-6 transition-shadow shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-500">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Action-first insights</h3>
              <p className="mt-2 text-sm text-gray-500">
                Every trend includes why-it-matters and next-step ideas — so you can move faster.
              </p>
            </div>

            <div className="group rounded-md bg-white p-6 transition-shadow shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-500">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Smart ranking</h3>
              <p className="mt-2 text-sm text-gray-500">
                AI-powered relevance scoring with source trust tiers and velocity detection.
              </p>
            </div>
          </div>

          {/* Row 3: 4 columns */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            <div className="group rounded-md bg-white p-6 transition-shadow shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-500">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Email delivery</h3>
              <p className="mt-2 text-sm text-gray-500">
                Daily digest in your inbox at your chosen time.
              </p>
            </div>

            <div className="group rounded-md bg-white p-6 transition-shadow shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-500">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Dashboard</h3>
              <p className="mt-2 text-sm text-gray-500">
                Browse trends and access your full briefing history.
              </p>
            </div>

            <div className="group rounded-md bg-white p-6 transition-shadow shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">AI-powered</h3>
              <p className="mt-2 text-sm text-gray-500">
                Claude AI synthesizes and summarizes trends for you.
              </p>
            </div>

            <div className="group rounded-md bg-white p-6 transition-shadow shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2.5 text-blue-500">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Trusted sources</h3>
              <p className="mt-2 text-sm text-gray-500">
                Priority ranking for authors and sources you trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Simple,
              <br className="hidden sm:block" />
              Transparent Pricing
            </h2>
            <p className="mt-4 text-base text-gray-500">
              Choose the plan that fits your needs.
              <br className="hidden sm:block" />
              Scale up anytime with no surprises.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-md bg-white transition-shadow ${plan.highlight
                  ? 'shadow-xl p-7 md:-my-2 md:py-8'
                  : 'shadow-sm p-9'
                  }`}
              >
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-3">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-400">/month</span>
                </p>
                <p className="mt-3 text-sm text-gray-500">{plan.description}</p>

                <ul className="mt-8 flex-1 space-y-3 text-sm text-gray-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/sign-up"
                  className={`mt-8 flex h-12 items-center justify-center rounded-sm text-sm font-medium transition-all ${plan.highlight
                    ? 'bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-[0_6px_20px_rgba(37,99,235,0.6)]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Frequently
              <br className="hidden sm:block" />
              Asked Questions
            </h2>
            <p className="mt-4 text-base text-gray-500">
              Everything you need to know about your AI briefing.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full rounded-md bg-white/10 px-6 py-5 text-left transition-shadow shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                    <ChevronDownIcon
                      className={`size-4 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                  <div
                    className={`grid transition-all duration-200 ${isOpen
                      ? 'mt-3 grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                      }`}
                  >
                    <div className="overflow-hidden text-sm leading-relaxed text-gray-500">
                      {faq.a}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative px-6 py-28 md:py-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 100% at 0% 80%, rgba(253,200,180,0.45) 0%, transparent 60%), radial-gradient(ellipse 80% 100% at 100% 80%, rgba(186,210,255,0.5) 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)',
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            AI updates that
            <br className="hidden sm:block" />
            work for you
          </h2>
          <p className="mt-6 text-base text-gray-500 md:text-lg">
            Stay informed, make better decisions, and move faster —
            <br className="hidden sm:block" />
            with a daily AI briefing designed for your world.
          </p>
          <Link
            href="/sign-up"
            className="mt-10 inline-flex h-12 items-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 px-8 text-sm font-medium text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)]"
          >
            Try For Free
          </Link>
        </div>
      </section>


    </div>
  )
}
