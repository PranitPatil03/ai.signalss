import { ArrowRight, BellRing, Brain, Check, ChevronDown, Clock, Code2, Sparkles, Target, Zap } from 'lucide-react'
import { EmailSignup } from '@/components/landing/EmailSignup'
import { TrendPreview } from '@/components/landing/TrendPreview'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fafc]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-16 h-96 w-96 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute top-36 -right-16 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg font-medium tracking-tight text-text-primary">AI Daily Updates</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-text-secondary md:flex">
            <a href="#features" className="transition-colors hover:text-text-primary">Features</a>
            <a href="#pricing" className="transition-colors hover:text-text-primary">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-text-primary">FAQ</a>
          </nav>

          <a
            href="#signup"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-600 bg-linear-to-b from-emerald-400 to-emerald-600 px-4 text-sm font-medium text-white shadow-[0_4px_16px_rgba(5,150,105,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(5,150,105,0.45)]"
          >
            Start Free
          </a>
        </div>
      </header>

      <section className="relative px-4 pb-24 pt-16 md:pt-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
          <div className="text-center md:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-sm text-emerald-700 shadow-sm">
              <BellRing className="h-4 w-4" />
              The daily pulse of artificial intelligence
            </div>

            <h1 className="text-4xl font-light tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              Stay Ahead of AI.
              <br className="hidden sm:block" />
              <span className="bg-linear-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent">
                Without Reading Everything.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:mx-0 md:text-lg">
              Get curated AI updates across business, startups, movies, research, content creation, and more,
              all summarized so you never miss what matters.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <a
                href="#signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-linear-to-b from-emerald-400 to-emerald-600 px-7 text-sm font-medium text-white shadow-[0_4px_16px_rgba(5,150,105,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(5,150,105,0.45)]"
              >
                Start Your AI Daily Feed
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-7 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-hover"
              >
                See Features
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-text-muted md:justify-start">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Free plan available</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Email + Google auth</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Personalized by interests</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border bg-white/90 p-5 shadow-[0_15px_60px_rgba(15,23,42,0.1)] backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Today</p>
                  <h3 className="text-lg font-semibold text-text-primary">AI Signal Board</h3>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">5 min read</span>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-surface p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm text-text-primary">
                    <Code2 className="h-4 w-4 text-emerald-700" />
                    Open-source coding models improved repo-level edits
                  </div>
                  <p className="text-xs text-text-secondary">Action: route tests + docs generation to cheaper models, keep premium for architecture tasks.</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm text-text-primary">
                    <Brain className="h-4 w-4 text-cyan-700" />
                    Agent orchestration defaults changed in major frameworks
                  </div>
                  <p className="text-xs text-text-secondary">Action: add tool schema validation and retry policies before release.</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm text-text-primary">
                    <Target className="h-4 w-4 text-teal-700" />
                    Claude computer-use benchmarks moved up this week
                  </div>
                  <p className="text-xs text-text-secondary">Action: automate repetitive UI QA flows for regression checks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="signup" className="relative px-4 pb-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-white/95 p-6 shadow-[0_8px_28px_rgba(15,23,42,0.08)] md:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-light tracking-tight text-text-primary md:text-4xl">Create your personalized AI feed</h2>
            <p className="mt-3 text-text-secondary">Sign up in 30 seconds and choose what you want to track.</p>
          </div>
          <div className="flex justify-center">
            <EmailSignup buttonText="Create free account" />
          </div>
        </div>
      </section>

      <section id="features" className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-light tracking-tight text-text-primary md:text-5xl">Everything you need to stay updated</h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">Inspired by modern product landings: clean layout, bold hierarchy, and practical value.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary">Daily briefs made for your role</h3>
              <p className="mt-2 text-text-secondary">
                Developer, founder, PM, or creator. We adapt output tone and depth to your context so it feels instantly useful.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-lg bg-cyan-100 p-2 text-cyan-700">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">5 to 10 min format</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Quick read with practical actions.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-lg bg-teal-100 p-2 text-teal-700">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Interest targeting</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Select topics once, refine anytime.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-4 inline-flex rounded-lg bg-slate-100 p-2 text-slate-700">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary">Action-first insights, not generic news</h3>
              <p className="mt-2 text-text-secondary">Every trend includes why-it-matters and next-step ideas, so users can ship faster and decide better.</p>
            </article>

            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Built for AI builders</h3>
              <p className="mt-2 text-sm text-text-secondary">Tools, models, workflows, and product moves.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-light tracking-tight text-text-primary md:text-4xl">Preview your daily digest</h2>
            <p className="mt-3 text-text-secondary">A clean, scannable feed with clear priority and practical context.</p>
          </div>
          <TrendPreview />
        </div>
      </section>

      <section id="pricing" className="px-4 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-light tracking-tight text-text-primary md:text-5xl">Simple pricing</h2>
            <p className="mt-3 text-text-secondary">Start free. Upgrade only when you want deeper personalization.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <article className="rounded-2xl border border-border bg-white p-8 shadow-sm md:scale-95">
              <h3 className="text-2xl font-semibold text-text-primary">Free</h3>
              <p className="mt-1 text-sm text-text-secondary">For devs getting started</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-light tracking-tight text-text-primary">$0</span>
                <span className="text-text-muted">/month</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />3 tracked interests</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />One daily digest at fixed time</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />5 top signals each day</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Email + in-app access</li>
              </ul>
              <a
                href="#signup"
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-surface text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
              >
                Start Free
              </a>
            </article>

            <article className="relative rounded-2xl border border-emerald-300 bg-white p-8 shadow-[0_12px_36px_rgba(5,150,105,0.12)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">Most Popular</div>
              <h3 className="text-2xl font-semibold text-text-primary">Pro</h3>
              <p className="mt-1 text-sm text-text-secondary">For teams moving fast with AI</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-light tracking-tight text-text-primary">$12</span>
                <span className="text-text-muted">/month</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Unlimited interests</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Custom delivery schedule</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Deep-dive and role-based formats</li>
                <li className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Priority sources and support</li>
              </ul>
              <a
                href="#signup"
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl border border-emerald-700 bg-linear-to-b from-emerald-400 to-emerald-600 text-sm font-medium text-white shadow-[0_4px_16px_rgba(5,150,105,0.35)] transition-all hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(5,150,105,0.45)]"
              >
                Upgrade to Pro
              </a>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-light tracking-tight text-text-primary md:text-5xl">Frequently asked questions</h2>
          </div>

          <div className="space-y-3">
            <details className="group rounded-xl border border-border bg-white shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer">
                <span className="font-medium text-text-primary">What sources do you scan?</span>
                <ChevronDown className="w-5 h-5 text-text-muted group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-text-secondary">
                Reddit, Hacker News, X, GitHub, AI labs, and selected newsletters. Ranking balances trust, freshness, and your interests.
              </div>
            </details>

            <details className="group rounded-xl border border-border bg-white shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer">
                <span className="font-medium text-text-primary">When do I get my digest?</span>
                <ChevronDown className="w-5 h-5 text-text-muted group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-text-secondary">
                Free users get one daily digest at a default time. Pro users can choose custom delivery windows.
              </div>
            </details>

            <details className="group rounded-xl border border-border bg-white shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer">
                <span className="font-medium text-text-primary">Can I change interests later?</span>
                <ChevronDown className="w-5 h-5 text-text-muted group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-text-secondary">
                Yes. Update interests anytime in settings. Changes are applied from the next digest onward.
              </div>
            </details>

            <details className="group rounded-xl border border-border bg-white shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer">
                <span className="font-medium text-text-primary">Is Google sign in supported?</span>
                <ChevronDown className="w-5 h-5 text-text-muted group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-text-secondary">
                Yes. You can sign in using both email/password and Google OAuth.
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-20 md:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl font-light tracking-tight text-text-primary md:text-4xl">Cut noise. Keep signal.</h2>
          <p className="text-lg text-text-secondary">
            Build faster with a daily AI brief designed for real execution.
          </p>
          <a
            href="#signup"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-emerald-700 bg-linear-to-b from-emerald-400 to-emerald-600 px-8 text-sm font-medium text-white shadow-[0_4px_16px_rgba(5,150,105,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(5,150,105,0.45)]"
          >
            Start free now
          </a>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <span className="font-semibold">AI Daily Updates</span>
            </div>
            <div className="flex gap-6 text-sm text-text-muted">
              <a href="#" className="hover:text-text-secondary transition-colors">Privacy</a>
              <a href="#" className="hover:text-text-secondary transition-colors">Terms</a>
              <a href="mailto:hello@aitrenddigest.com" className="hover:text-text-secondary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
