'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check, FileText } from 'lucide-react'

interface ScriptSectionProps {
  script: string | null
}

export function ScriptSection({ script }: ScriptSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!script) return null

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-3 border border-white/[0.08] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
          <FileText className="w-4 h-4" />
          Summary Script
        </div>
        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-white/5 hover:bg-white/10 text-zinc-300 rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-4 bg-white/[0.03] border-t border-white/[0.08]">
          <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {script}
          </div>
        </div>
      )}
    </div>
  )
}
