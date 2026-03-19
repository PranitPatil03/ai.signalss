import { Sparkles, Cpu, Wrench, BookOpen, Flame, Rocket } from 'lucide-react'

const sampleTrends = [
  {
    title: 'Claude computer-use got a major reliability bump',
    category: 'models',
    summary: 'The latest update improves task completion on multi-step browser flows. Great fit for QA automation and repetitive ops tasks.',
    actionable: 'Automate release checklist verification with agent computer-use.',
  },
  {
    title: 'Open-source coding models closed the gap this week',
    category: 'tools',
    summary: 'Several OSS models now match paid tools on common repo-level tasks. Teams can reduce inference cost with smart routing.',
    actionable: 'Route unit-test generation to OSS while keeping premium for architecture tasks.',
  },
  {
    title: 'AI framework updates changed agent orchestration defaults',
    category: 'research',
    summary: 'New defaults improve tool-calling reliability but can break older prompts. You may need to update system instructions and retries.',
    actionable: 'Add structured tool schema validation before deploying agent workflows.',
  },
]

const categoryIcons: Record<string, React.ReactNode> = {
  models: <Cpu className="w-3.5 h-3.5" />,
  tools: <Wrench className="w-3.5 h-3.5" />,
  research: <BookOpen className="w-3.5 h-3.5" />,
  drama: <Flame className="w-3.5 h-3.5" />,
  tutorials: <Sparkles className="w-3.5 h-3.5" />,
  startups: <Rocket className="w-3.5 h-3.5" />,
}

const categoryColors: Record<string, string> = {
  models: 'bg-blue-500/15 text-blue-400',
  tools: 'bg-emerald-500/15 text-emerald-400',
  research: 'bg-purple-500/15 text-purple-400',
  drama: 'bg-orange-500/15 text-orange-400',
  tutorials: 'bg-pink-500/15 text-pink-400',
  startups: 'bg-amber-500/15 text-amber-400',
}

export function TrendPreview() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-xl border border-white/[0.06] bg-[#111113] overflow-hidden">
        {/* Email header mockup */}
        <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-medium text-white">AI Daily Updates</div>
              <div className="text-sm text-zinc-500">Today&apos;s top AI signals</div>
            </div>
          </div>
        </div>

        {/* Trends list */}
        <div className="divide-y divide-white/[0.06]">
          {sampleTrends.map((trend, index) => (
            <div key={index} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start gap-3">
                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${categoryColors[trend.category]}`}>
                  {categoryIcons[trend.category]}
                  {trend.category}
                </span>
              </div>
              <h3 className="mt-2 font-semibold text-white">
                {trend.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                {trend.summary}
              </p>
              <div className="mt-3 px-3 py-2 bg-emerald-500/8 rounded-lg border border-emerald-500/15">
                <p className="text-sm text-emerald-400">
                  <span className="font-medium">Action:</span> {trend.actionable}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Fade effect */}
        <div className="h-16 bg-gradient-to-t from-[#111113] to-transparent -mt-16 relative pointer-events-none" />
      </div>
    </div>
  )
}
