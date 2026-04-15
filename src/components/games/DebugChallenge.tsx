// ─── DebugChallenge ───────────────────────────────────────────────────────────
//
// Mini-game: click (or keyboard-select) the line that contains a bug, then
// submit.  Empty lines are non-interactive spacers.  After submitting:
//  • Correct pick  → green feedback + explanation
//  • Wrong pick    → red feedback + explanation (the bug line is revealed)

import { useState } from 'react'
import clsx from 'clsx'
import type { DebugChallenge as DebugChallengeData } from '../../content/challenges'
import { useAppSettings } from '../../hooks/useAppSettings'

interface Props {
  challenge: DebugChallengeData
  alreadySolved: boolean
  onSolve: () => void
}

export default function DebugChallenge({ challenge, alreadySolved, onSolve }: Props) {
  const { t, osClass } = useAppSettings()

  // When already solved, pre-highlight the bug line and lock the UI.
  const [selectedLine, setSelectedLine] = useState<number | null>(
    alreadySolved ? challenge.bugLine : null,
  )
  const [submitted, setSubmitted] = useState(alreadySolved)
  const [correct,   setCorrect]   = useState(alreadySolved)

  function handleSubmit() {
    if (selectedLine === null || submitted) return
    const isCorrect = selectedLine === challenge.bugLine
    setSubmitted(true)
    setCorrect(isCorrect)
    if (isCorrect) onSolve()
  }

  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed text-gray-200">{challenge.prompt}</p>

      {/* ── Code block with clickable lines ──────────────────────────────── */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900 font-mono text-sm">
        {challenge.lines.map((line, i) => {
          const lineNum     = i + 1
          const isEmpty     = line === ''
          const isSelected  = selectedLine === lineNum
          const isBug       = submitted && lineNum === challenge.bugLine
          const isWrongPick = submitted && isSelected && !correct

          return (
            <div
              key={i}
              role={isEmpty || submitted ? undefined : 'button'}
              tabIndex={isEmpty || submitted ? undefined : 0}
              onKeyDown={e => {
                if (!isEmpty && !submitted && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  setSelectedLine(lineNum)
                }
              }}
              onClick={() => { if (!isEmpty && !submitted) setSelectedLine(lineNum) }}
              className={clsx(
                'flex items-start gap-3 px-4 py-1.5 transition-colors',
                isEmpty    ? 'cursor-default'
                  : submitted ? 'cursor-default'
                  : 'cursor-pointer',
                isBug       ? 'bg-red-900/40'
                  : isWrongPick ? 'bg-orange-900/30'
                  : isSelected  ? 'bg-gray-700/60'
                  : !isEmpty    ? 'hover:bg-gray-800'
                  : '',
              )}
            >
              {/* Line number gutter */}
              <span className="w-5 shrink-0 select-none text-right text-gray-600">
                {lineNum}
              </span>

              {/* Line content */}
              <span
                className={clsx(
                  'flex-1 whitespace-pre-wrap break-all',
                  isBug       ? 'text-red-300'
                    : isWrongPick ? 'text-orange-300'
                    : isSelected  ? 'text-gray-100'
                    : isEmpty     ? 'select-none text-transparent'
                    : 'text-gray-300',
                )}
              >
                {line || '\u00a0'}
              </span>

              {/* Bug marker (shown after submission) */}
              {isBug && (
                <span className="shrink-0 text-xs text-red-400">← bug</span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Feedback / submit button ──────────────────────────────────────── */}
      {submitted ? (
        <p className={clsx('text-sm leading-relaxed', correct ? 'text-emerald-300' : 'text-red-300')}>
          {correct ? '✓' : '✗'} {challenge.explanation}
        </p>
      ) : (
        <button
          disabled={selectedLine === null}
          onClick={handleSubmit}
          className={clsx(
            'px-5 py-2 text-sm font-bold transition-all duration-150',
            osClass('rounded-lg', 'rounded-none'),
            selectedLine === null
              ? 'cursor-not-allowed bg-gray-800 text-gray-600'
              : 'bg-red-500 text-gray-950 hover:bg-red-400 active:scale-95',
          )}
        >
          {t('game.reportBugLine')}
        </button>
      )}
    </div>
  )
}
