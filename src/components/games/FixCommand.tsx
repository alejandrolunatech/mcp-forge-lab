// ─── FixCommand ───────────────────────────────────────────────────────────────
//
// Mini-game: pick the correct shell command from a list of options.
// Shows colour-coded feedback and the explanation after submitting.

import { useState } from 'react'
import clsx from 'clsx'
import type { FixCommandChallenge } from '../../content/challenges'
import { useAppSettings } from '../../hooks/useAppSettings'

interface Props {
  challenge: FixCommandChallenge
  /** True if the player already solved this challenge in a previous session. */
  alreadySolved: boolean
  /** Called once when the player submits a correct answer. */
  onSolve: () => void
}

export default function FixCommand({ challenge, alreadySolved, onSolve }: Props) {
  const { t, osClass } = useAppSettings()

  // Pre-select the correct answer and lock the UI when already solved.
  const [selected, setSelected] = useState<number | null>(
    alreadySolved ? challenge.correctIndex : null,
  )
  const [submitted, setSubmitted] = useState(alreadySolved)
  const [correct,   setCorrect]   = useState(alreadySolved)

  function handleSubmit() {
    if (selected === null || submitted) return
    const isCorrect = selected === challenge.correctIndex
    setSubmitted(true)
    setCorrect(isCorrect)
    if (isCorrect) onSolve()
  }

  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed text-gray-200">{challenge.prompt}</p>

      {/* Options */}
      <div className="space-y-2">
        {challenge.options.map((opt, i) => {
          const isSelected  = selected === i
          const isRight     = submitted && i === challenge.correctIndex
          const isWrongPick = submitted && isSelected && i !== challenge.correctIndex

          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => !submitted && setSelected(i)}
              className={clsx(
                'block w-full text-left px-4 py-3 font-mono text-sm transition-all duration-150',
                osClass('rounded-lg', 'rounded-none'),
                isRight
                  ? 'border border-emerald-500 bg-emerald-950/40 text-emerald-300'
                  : isWrongPick
                  ? 'border border-red-500 bg-red-950/40 text-red-300'
                  : isSelected
                  ? 'border border-sky-400 bg-sky-900/40 text-sky-100'
                  : 'border border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500 hover:text-gray-100 disabled:cursor-default',
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Feedback / submit button */}
      {submitted ? (
        <p className={clsx('text-sm leading-relaxed', correct ? 'text-emerald-300' : 'text-red-300')}>
          {correct ? '✓' : '✗'} {challenge.explanation}
        </p>
      ) : (
        <button
          disabled={selected === null}
          onClick={handleSubmit}
          className={clsx(
            'px-5 py-2 text-sm font-bold transition-all duration-150',
            osClass('rounded-lg', 'rounded-none'),
            selected === null
              ? 'cursor-not-allowed bg-gray-800 text-gray-600'
              : 'bg-sky-500 text-gray-950 hover:bg-sky-400 active:scale-95',
          )}
        >
          {t('game.submit')}
        </button>
      )}
    </div>
  )
}
