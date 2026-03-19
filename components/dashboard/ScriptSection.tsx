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
    <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <FileText className="w-4 h-4" />
          Summary Script
        </div>
        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-white hover:bg-gray-100 text-gray-600 rounded border border-gray-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-500" />
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
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {script}
          </div>
        </div>
      )}
    </div>
  )
}
