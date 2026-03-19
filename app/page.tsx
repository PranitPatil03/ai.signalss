import { ArrowRight, BellRing, Brain, Check, ChevronDown, Clock, Globe, Sparkles, Target, Layers, BarChart3, Mail } from 'lucide-react'
import { EmailSignup } from '@/components/landing/EmailSignup'
import { TrendPreview } from '@/components/landing/TrendPreview'

export const dynamic = 'force-dynamic'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[500px] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">AI Daily Updates</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
          </nav>

          <a
            href="#signup"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white transition-all hover:bg-emerald-400"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pb-24 pt-20 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <BellRing className="h-3.5 w-3.5" />
            Your daily AI intelligence briefing
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-white">AI updates that </span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              never sleep
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            Get personalized AI updates across startups, tech, research, business, and more —
            summarized daily so you stay ahead without reading everything.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 text-sm font-medium text-white shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_32px_rgba(16,185,129,0.35)]"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Free plan available</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Personalized by domain</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Multi-source intelligence</span>
          </div>
        </div>

        {/* Signal Board Preview */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1 shadow-2xl backdrop-blur-sm">
            <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Today&apos;s Briefing</p>
                  <h3 className="text-lg font-semibold text-white">AI Signal Board</h3>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">Live</span>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:bg-white/[0.04]">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="rounded-md bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">Tech</span>
                    <span className="text-xs text-zinc-600">• 2h ago</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-200">Open-source coding models improved repo-level edits by 40%</p>
                  <p className="mt-1 text-xs text-zinc-500">Route tests & docs generation to cheaper models, keep premium for architecture tasks.</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:bg-white/[0.04]">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="rounded-md bg-purple-500/15 px-2 py-0.5 text-xs font-medium text-purple-400">Research</span>
                    <span className="text-xs text-zinc-600">• 4h ago</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-200">New reasoning benchmark shows 3x improvement in multi-step tasks</p>
                  <p className="mt-1 text-xs text-zinc-500">Teams building agent workflows should re-evaluate prompt chains after this update.</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:bg-white/[0.04]">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">Startups</span>
                    <span className="text-xs text-zinc-600">• 5h ago</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-200">AI-first startup raises $50M to automate enterprise document workflows</p>
                  <p className="mt-1 text-xs text-zinc-500">Validates the market for vertical AI applications in legacy industries.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup" className="relative px-4 pb-24">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Start your AI briefing</h2>
              <p className="mt-2 text-sm text-zinc-400">Sign up in 30 seconds. Choose your domains.</p>
            </div>
            <div className="flex justify-center">
              <EmailSignup buttonText="Create free account" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Everything You Need
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              A complete AI intelligence platform — multi-source scanning, personalized ranking, and daily delivery.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:col-span-2 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white md:text-2xl">Personalized by your domain</h3>
                <p className="mt-2 max-w-lg text-zinc-400">
                  Engineer, founder, researcher, or product manager — we adapt the depth and focus of every briefing to match your role and interests.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Tech', 'Startups', 'Research', 'Business', 'Healthcare', 'Creative'].map(d => (
                    <span key={d} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">5-minute daily read</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Concise, actionable summaries. No fluff, just what you need to know.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-lg bg-purple-500/10 p-2.5 text-purple-400">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Multi-source scanning</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Reddit, Hacker News, Bluesky, RSS, AI lab blogs — all in one place.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:col-span-2 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-lg bg-amber-500/10 p-2.5 text-amber-400">
                  <Brain className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white md:text-2xl">Action-first insights, not generic news</h3>
                <p className="mt-2 max-w-lg text-zinc-400">
                  Every trend includes why-it-matters and next-step ideas — so you can make better decisions and move faster.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Smart ranking</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  AI-powered relevance scoring with source trust tiers and velocity detection.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-lg bg-rose-500/10 p-2.5 text-rose-400">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Email delivery</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Get your daily digest in your inbox at the time you choose.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-lg bg-sky-500/10 p-2.5 text-sky-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Dashboard & history</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Browse today&apos;s trends and access your full briefing history anytime.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Preview your daily digest</h2>
              <p className="mt-3 text-zinc-400">A clean, scannable feed with clear priority and practical context.</p>
            </div>
            <TrendPreview />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Simple,<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> Transparent</span> Pricing
            </h2>
            <p className="mt-4 text-zinc-400">Choose the plan that fits your needs. Scale up anytime.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <article className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
              <h3 className="text-2xl font-bold text-white">Free</h3>
              <p className="mt-1 text-sm text-zinc-400">For individuals getting started</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-white">$0</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />3 tracked domains</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Daily digest at fixed time</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Top 5 signals each day</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Email + in-app access</li>
              </ul>
              <a
                href="#signup"
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Start Free
              </a>
            </article>

            <article className="relative rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 shadow-[0_0_40px_rgba(16,185,129,0.08)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white">Pro</h3>
              <p className="mt-1 text-sm text-zinc-400">For professionals moving fast with AI</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-white">$12</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Unlimited domains</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Custom delivery schedule</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Deep-dive analysis format</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />Priority sources & support</li>
              </ul>
              <a
                href="#signup"
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-emerald-500 text-sm font-medium text-white shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_32px_rgba(16,185,129,0.35)]"
              >
                Upgrade to Pro
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-4 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Frequently Asked<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="mt-4 text-zinc-400">Everything you need to know about your AI briefing.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'What sources do you scan?',
                a: 'Reddit, Hacker News, Bluesky, RSS feeds, AI lab blogs (OpenAI, Anthropic, Google DeepMind), and tech publications. Our ranking algorithm balances trust, freshness, and your interests.'
              },
              {
                q: 'Who is this for?',
                a: 'Anyone who wants to stay updated on AI — engineers, startup founders, researchers, product managers, business leaders, students, and curious minds. You choose your domains and we personalize your briefing.'
              },
              {
                q: 'When do I get my digest?',
                a: 'Free users get one daily digest at 7 AM in their timezone. Pro users can choose any custom delivery time.'
              },
              {
                q: 'Can I change my interests later?',
                a: 'Absolutely. Update your domains and topics anytime in settings. Changes are applied from the next digest onward.'
              },
              {
                q: 'How is the AI analysis done?',
                a: 'We use Claude AI to analyze and synthesize trends from across all sources. It generates summaries, identifies why each trend matters, and suggests actionable next steps relevant to your domains.'
              },
              {
                q: 'Is Google sign-in supported?',
                a: 'Yes. You can sign in with email/password or Google OAuth — both are fully supported.'
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-white/[0.08] bg-white/[0.03]">
                <summary className="flex cursor-pointer items-center justify-between p-5">
                  <span className="font-medium text-white">{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-zinc-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-zinc-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/[0.06] px-4 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            AI updates that<br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">work for you</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Stay informed, make better decisions, and move faster — with a daily AI briefing designed for your world.
          </p>
          <a
            href="#signup"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-8 text-sm font-medium text-white shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_32px_rgba(16,185,129,0.35)]"
          >
            Start free now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-zinc-400">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold text-white">AI Daily Updates</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="#" className="transition-colors hover:text-zinc-300">Privacy</a>
              <a href="#" className="transition-colors hover:text-zinc-300">Terms</a>
              <a href="mailto:hello@aidailyupdates.com" className="transition-colors hover:text-zinc-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
