// ─── CommandBlock ────────────────────────────────────────────────────────────
//
// Terminal-styled command block.
//  • Mac: macOS-style traffic-light dots header + `$` prompt
//  • Windows: title-bar style header + `>` prompt
//  • Copy button with "Copied!" toast
//  • Optional label / window title
//  • OS-aware border radius

import { useState, useCallback } from 'react'
import clsx from 'clsx'
import { useAppSettings } from '../hooks/useAppSettings'

interface CommandBlockProps {
  /** The shell command to display (without the prompt prefix). */
  command: string
  /** Optional window title shown in the header. */
  title?: string
}

export default function CommandBlock({ command, title }: CommandBlockProps) {
  const { os, osClass, t } = useAppSettings()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = command
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [command])

  const prompt = os === 'mac' ? '$' : '>'

  return (
    <div
      className={clsx(
        'overflow-hidden border border-gray-700 bg-gray-950',
        osClass('rounded-lg shadow-lg shadow-black/40', 'rounded-none'),
      )}
    >
      {/* ── Title bar ──────────────────────────────────────────────────────── */}
      {os === 'mac' ? (
        // macOS-style: traffic light dots + centred title
        <div className="relative flex items-center gap-1.5 bg-gray-900 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          {title && (
            <span className="absolute inset-x-0 text-center text-xs text-gray-500 pointer-events-none">
              {title}
            </span>
          )}
          {/* Copy button (right side) */}
          <div className="ml-auto">
            <CopyButton copied={copied} onCopy={handleCopy} t={t} osClass={osClass} />
          </div>
        </div>
      ) : (
        // Windows-style: title bar with label + copy
        <div className="flex items-center justify-between bg-gray-800 px-3 py-1.5">
          <span className="text-xs font-medium text-gray-400">
            {title ?? 'Command Prompt'}
          </span>
          <div className="flex items-center gap-1">
            <CopyButton copied={copied} onCopy={handleCopy} t={t} osClass={osClass} />
            {/* Decorative window buttons */}
            <span className="ml-2 flex gap-1 opacity-40">
              <span className="h-3 w-3 border border-gray-500 text-[8px] flex items-center justify-center text-gray-400">—</span>
              <span className="h-3 w-3 border border-gray-500 text-[8px] flex items-center justify-center text-gray-400">□</span>
              <span className="h-3 w-3 border border-gray-500 text-[8px] flex items-center justify-center text-gray-400">✕</span>
            </span>
          </div>
        </div>
      )}

      {/* ── Terminal body ──────────────────────────────────────────────────── */}
      <div className="overflow-x-auto px-4 py-4">
        <div className="flex items-start gap-3 font-mono text-sm leading-relaxed">
          {/* Prompt */}
          <span
            className={clsx(
              'flex-shrink-0 select-none font-bold',
              os === 'mac' ? 'text-emerald-400' : 'text-amber-400',
            )}
          >
            {prompt}
          </span>
          {/* Command text */}
          <span className="text-gray-200 break-all">{command}</span>
        </div>
      </div>
    </div>
  )
}

// ── Internal copy button ──────────────────────────────────────────────────────

interface CopyButtonProps {
  copied: boolean
  onCopy: () => void
  t: (key: string) => string
  osClass: (mac: string, windows: string) => string
}

function CopyButton({ copied, onCopy, t, osClass }: CopyButtonProps) {
  return (
    <button
      onClick={onCopy}
      aria-label={copied ? t('lesson.copied') : t('lesson.copy')}
      className={clsx(
        'flex items-center gap-1 px-2 py-0.5 text-xs font-medium transition-all duration-150',
        osClass('rounded-md', 'rounded-none'),
        copied
          ? 'bg-emerald-500 text-gray-950'
          : 'bg-gray-700/70 text-gray-400 hover:bg-gray-600/70 hover:text-gray-100',
      )}
    >
      {copied ? '✓' : '⧉'} {copied ? t('lesson.copied') : t('lesson.copy')}
    </button>
  )
}
