import { Sparkles, Cpu, Wrench, BookOpen, Flame } from 'lucide-react'

const sampleTrends = [
  {
    title: 'Claude computer-use got a major reliability bump',
    category: 'models',
    summary: 'The latest update improves task completion on multi-step browser flows. Great fit for QA automation and repetitive ops tasks.',
    tiktok_angle: 'Build idea: automate release checklist verification with agent computer-use.',
  },
  {
    title: 'Open-source coding models closed the gap this week',
    category: 'tools',
    summary: 'Several OSS models now match paid tools on common repo-level tasks. Teams can reduce inference cost with smart routing.',
    tiktok_angle: 'Migration playbook: route unit-test generation to OSS, keep premium for architecture tasks.',
  },
  {
    title: 'AI framework updates changed agent orchestration defaults',
    category: 'drama',
    summary: 'New defaults improve tool-calling reliability but can break older prompts. You may need to update system instructions and retries.',
    tiktok_angle: 'Quick win: add structured tool schema validation before deploy.',
  },
]

const categoryIcons: Record<string, React.ReactNode> = {
  models: <Cpu className="w-4 h-4" />,
  tools: <Wrench className="w-4 h-4" />,
  research: <BookOpen className="w-4 h-4" />,
  drama: <Flame className="w-4 h-4" />,
  tutorials: <Sparkles className="w-4 h-4" />,
}

const categoryColors: Record<string, string> = {
  models: 'bg-blue-500/20 text-blue-400',
  tools: 'bg-green-500/20 text-green-400',
  research: 'bg-purple-500/20 text-purple-400',
  drama: 'bg-orange-500/20 text-orange-400',
  tutorials: 'bg-pink-500/20 text-pink-400',
}

export function TrendPreview() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
        {/* Email header mockup */}
        <div className="px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-electric" />
            </div>
            <div>
              <div className="font-medium text-text-primary">AI Trend Digest</div>
              <div className="text-sm text-text-muted">Today's top AI stories</div>
            </div>
          </div>
        </div>

        {/* Trends list */}
        <div className="divide-y divide-border">
          {sampleTrends.map((trend, index) => (
            <div key={index} className="px-6 py-4 hover:bg-surface-hover transition-colors">
              <div className="flex items-start gap-3">
                <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[trend.category]}`}>
                  {categoryIcons[trend.category]}
                  {trend.category}
                </span>
              </div>
              <h3 className="mt-2 font-semibold text-text-primary">
                {trend.title}
              </h3>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                {trend.summary}
              </p>
              <div className="mt-3 px-3 py-2 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm text-accent">
                  <span className="font-medium">Content angle:</span> {trend.tiktok_angle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Fade effect */}
        <div className="h-20 bg-linear-to-t from-surface-elevated to-transparent -mt-20 relative pointer-events-none" />
      </div>
    </div>
  )
}
