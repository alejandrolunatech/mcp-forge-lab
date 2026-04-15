// ─── BossTaskCard ─────────────────────────────────────────────────────────────
//
// Renders the active boss task:
//  • 'command' tasks → free-text input (Enter to submit)
//  • 'choice' tasks  → option-picker buttons
//
// Hints are hidden until explicitly revealed via the BossHUD hint button.
// Wrong answers trigger a shake animation.

import { useState } from 'react'
import clsx from 'clsx'
import type { BossTask } from '../../content/bossFight'
import { useAppSettings } from '../../hooks/useAppSettings'

interface BossTaskCardProps {
  task: BossTask
  hintRevealed: boolean
  onSubmit: (answer: string | number) => boolean
}

export default function BossTaskCard({
  task,
  hintRevealed,
  onSubmit,
}: BossTaskCardProps) {
  const { t, osClass } = useAppSettings()
  const [commandInput, setCommandInput] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [shake, setShake] = useState(false)

  const canSubmit =
    task.type === 'command' ? commandInput.trim().length > 0 : selectedIndex !== null

  function handleSubmit() {
    if (!canSubmit) return
    const answer = task.type === 'command' ? commandInput : (selectedIndex as number)
    const correct = onSubmit(answer)

    if (!correct) {
      setShake(true)
      setTimeout(() => setShake(false), 480)
    } else {
      // Reset local state for the next task.
      setCommandInput('')
      setSelectedIndex(null)
    }
  }

  return (
    <div
      className={clsx(
        'flex flex-col gap-5 bg-gray-900 p-6',
        osClass('rounded-xl', 'rounded-none border border-gray-800'),
        shake && 'boss-shake',
      )}
    >
      {/* Phase badge + title */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={clsx(
            'px-2.5 py-0.5 text-xs font-bold text-gray-950',
            osClass('rounded-full', 'rounded-none'),
            'bg-yellow-400',
          )}
        >
          Phase {task.phase}
        </span>
        <h2 className="text-lg font-semibold text-gray-100">{task.title}</h2>
      </div>

      {/* Task prompt */}
      <p className="text-sm leading-relaxed text-gray-300">{task.prompt}</p>

      {/* Hint — revealed by BossHUD hint button */}
      {hintRevealed && (
        <div
          className={clsx(
            'border-l-4 border-orange-400 bg-orange-900/20 px-4 py-3 text-sm text-orange-200',
            osClass('rounded-r-lg', ''),
          )}
        >
          <span className="font-semibold text-orange-400">
            💡 {t('boss.hintLabel')}:{' '}
          </span>
          {task.hint}
        </div>
      )}

      {/* Input area */}
      {task.type === 'command' ? (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t('lesson.command')}
          </label>
          <input
            type="text"
            value={commandInput}
            onChange={e => setCommandInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
            placeholder="$ type your command…"
            spellCheck={false}
            autoComplete="off"
            className={clsx(
              'w-full bg-gray-950 px-4 py-2.5 font-mono text-sm text-emerald-300 outline-none',
              'border border-gray-700 focus:border-emerald-500 transition-colors duration-150',
              osClass('rounded-lg', 'rounded-none'),
            )}
            aria-label="Command input"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t('boss.chooseOption')}
          </p>
          {task.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={clsx(
                'w-full px-4 py-3 text-left font-mono text-sm transition-colors duration-150',
                osClass('rounded-lg', 'rounded-none border'),
                selectedIndex === i
                  ? 'border-emerald-500 bg-emerald-900/30 text-emerald-300'
                  : 'border-gray-700 bg-gray-950 text-gray-300 hover:border-gray-600 hover:bg-gray-800',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={clsx(
          'self-start px-5 py-2.5 text-sm font-bold transition-colors duration-150',
          osClass('rounded-lg', 'rounded-none border'),
          canSubmit
            ? 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 active:bg-emerald-600'
            : 'cursor-not-allowed bg-gray-800 text-gray-600',
        )}
      >
        {t('game.submit')} →
      </button>
    </div>
  )
}
