// ─── CodeBlock ───────────────────────────────────────────────────────────────
//
// Renders a code or command snippet with:
//  • A labelled header ("Code" / "Command" / custom label)
//  • Horizontal-scrollable pre block
//  • Copy button with a brief "Copied!" toast
//  • OS-aware border radius via useAppSettings

import { useState, useCallback } from 'react'
import clsx from 'clsx'
import { useAppSettings } from '../hooks/useAppSettings'

/** Number of lines shown when the block is collapsed. */
const COLLAPSE_LINES = 6

interface CodeBlockProps {
  /** The raw text to display and copy. */
  code: string
  /** Visual label shown in the header bar. Defaults to "Code". */
  label?: string
  /** Accent colour variant. */
  variant?: 'code' | 'command'
  /** Allow the block to be collapsed when it has many lines. Default: true */
  collapsible?: boolean
  /** Whether the block starts expanded. Default: true */
  defaultExpanded?: boolean
}

export default function CodeBlock({
  code,
  label,
  variant = 'code',
  collapsible = true,
  defaultExpanded = true,
}: CodeBlockProps) {
  const { osClass, t } = useAppSettings()
  const [copied, setCopied] = useState(false)

  const lines = code.split('\n')
  const isLong = lines.length > COLLAPSE_LINES
  const [expanded, setExpanded] = useState(
    !collapsible || defaultExpanded || !isLong,
  )

  const visibleCode =
    expanded || !collapsible ? code : lines.slice(0, COLLAPSE_LINES).join('\n')

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Fallback for environments without clipboard API
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const displayLabel =
    label ?? (variant === 'command' ? t('lesson.command') : t('lesson.code'))

  const accentClass =
    variant === 'command'
      ? 'text-amber-400 border-amber-900/60 bg-amber-950/30'
      : 'text-sky-400 border-sky-900/60 bg-sky-950/30'

  const headerAccent =
    variant === 'command' ? 'bg-amber-950/60' : 'bg-sky-950/60'

  return (
    <div
      className={clsx(
        'overflow-hidden border',
        accentClass,
        osClass('rounded-lg', 'rounded-none'),
      )}
    >
      {/* Header bar */}
      <div
        className={clsx(
          'flex items-center justify-between px-4 py-2',
          headerAccent,
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
          {displayLabel}
        </span>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          aria-label={copied ? t('lesson.copied') : t('lesson.copy')}
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-all duration-150',
            osClass('rounded-md', 'rounded-none'),
            copied
              ? 'bg-emerald-500 text-gray-950'
              : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 hover:text-gray-100',
          )}
        >
          {copied ? (
            <>
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="currentColor"
                aria-hidden
              >
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
              </svg>
              {t('lesson.copied')}
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="currentColor"
                aria-hidden
              >
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
              </svg>
              {t('lesson.copy')}
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-200 font-mono">
        <code>{visibleCode}</code>
      </pre>

      {/* Expand / collapse toggle */}
      {collapsible && isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className={clsx(
            'flex w-full items-center justify-center gap-1.5 border-t border-current/10 py-1.5 text-xs font-medium opacity-60 transition-opacity hover:opacity-100',
            variant === 'command' ? 'text-amber-400' : 'text-sky-400',
          )}
        >
          {expanded ? (
            <>▴ {t('codeblock.showLess')}</>
          ) : (
            <>▾ {t('codeblock.showMore')} ({lines.length - COLLAPSE_LINES} {t('codeblock.moreLines')})</>
          )}
        </button>
      )}
    </div>
  )
}
