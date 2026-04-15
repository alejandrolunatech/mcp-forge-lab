// ─── BossHUD ──────────────────────────────────────────────────────────────────
//
// Sticky header shown throughout the boss fight running screen.
// Displays: phase progress dots · elapsed timer · live score · hint button.

import clsx from 'clsx'
import { useAppSettings } from '../../hooks/useAppSettings'
import { bossEngine, BOSS_HINT_PENALTY } from '../../engine/bossEngine'
import { BOSS_TASK_COUNT } from '../../content/bossFight'

interface BossHUDProps {
  elapsed: number
  score: number
  taskIndex: number
  hintRevealedForCurrentTask: boolean
  onRevealHint: () => void
}

export default function BossHUD({
  elapsed,
  score,
  taskIndex,
  hintRevealedForCurrentTask,
  onRevealHint,
}: BossHUDProps) {
  const { t, osClass } = useAppSettings()

  // Warn once elapsed ≥ 3 minutes (score < 820 assuming no hints).
  const timerWarning = elapsed >= 180

  return (
    <div
      className={clsx(
        'sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3',
        'border-b border-gray-800 bg-gray-950/95 px-6 py-3 backdrop-blur',
      )}
    >
      {/* ── Phase dots ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t('boss.task')}
        </span>

        <div className="flex gap-1.5" aria-label={`Task ${taskIndex + 1} of ${BOSS_TASK_COUNT}`}>
          {Array.from({ length: BOSS_TASK_COUNT }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                'h-2 w-2 rounded-full transition-colors duration-300',
                i < taskIndex
                  ? 'bg-emerald-400'
                  : i === taskIndex
                    ? 'bg-yellow-400'
                    : 'bg-gray-700',
              )}
            />
          ))}
        </div>

        <span className="text-xs font-medium tabular-nums text-gray-400">
          {taskIndex + 1}/{BOSS_TASK_COUNT}
        </span>
      </div>

      {/* ── Timer ────────────────────────────────────────────────────────── */}
      <div
        className={clsx(
          'flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums',
          timerWarning ? 'boss-timer-pulse text-red-400' : 'text-gray-200',
        )}
        aria-label={t('boss.timeElapsed')}
        aria-live="polite"
      >
        <span aria-hidden>⏱</span>
        {bossEngine.formatTime(elapsed)}
      </div>

      {/* ── Score ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-400">
        <span aria-hidden>⭐</span>
        <span>{score}</span>
      </div>

      {/* ── Hint button ──────────────────────────────────────────────────── */}
      <button
        onClick={onRevealHint}
        disabled={hintRevealedForCurrentTask}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold transition-colors duration-150',
          osClass('rounded-md', 'rounded-none border border-gray-700'),
          hintRevealedForCurrentTask
            ? 'cursor-not-allowed bg-gray-800 text-gray-600'
            : 'bg-gray-800 text-orange-400 hover:bg-gray-700 hover:text-orange-300',
        )}
        aria-pressed={hintRevealedForCurrentTask}
      >
        <span aria-hidden>💡</span>
        {hintRevealedForCurrentTask
          ? t('boss.hintUsed')
          : `${t('boss.hint')} (−${BOSS_HINT_PENALTY})`}
      </button>
    </div>
  )
}
