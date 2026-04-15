// ─── BossFight page ───────────────────────────────────────────────────────────
//
// Three screens driven by session.status:
//  idle     → rules + records + start button
//  running  → BossHUD + BossTaskCard
//  complete → score card + grade + XP award

import { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useAppSettings } from '../hooks/useAppSettings'
import { useAppContext } from '../context/AppContext'
import { useBossFight } from '../hooks/useBossFight'
import BossHUD from '../components/boss/BossHUD'
import BossTaskCard from '../components/boss/BossTaskCard'
import { bossEngine } from '../engine/bossEngine'
import { BOSS_TASK_COUNT } from '../content/bossFight'

// ── Grade ────────────────────────────────────────────────────────────────────

function computeGrade(score: number): { label: string; colorClass: string } {
  if (score >= 900) return { label: 'S', colorClass: 'text-yellow-400' }
  if (score >= 750) return { label: 'A', colorClass: 'text-emerald-400' }
  if (score >= 600) return { label: 'B', colorClass: 'text-sky-400' }
  return { label: 'C', colorClass: 'text-gray-400' }
}

// ── Small layout helper ───────────────────────────────────────────────────────

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={clsx(
          'text-sm font-bold',
          highlight ? 'text-yellow-400' : 'text-gray-100',
        )}
      >
        {value}
      </span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BossFight() {
  const { t, osClass } = useAppSettings()
  const { awardBossXP } = useAppContext()

  const {
    session,
    highScore,
    bestTime,
    runs,
    start,
    submitAnswer,
    revealHint,
    restart,
  } = useBossFight()

  // Prevent double XP award in React Strict Mode or fast re-renders.
  const xpAwardedRef = useRef(false)

  useEffect(() => {
    if (session.status === 'complete' && !xpAwardedRef.current) {
      xpAwardedRef.current = true
      awardBossXP(session.score)
    }
    if (session.status === 'idle') {
      xpAwardedRef.current = false
    }
    // `awardBossXP` is stable (memoized with no deps); `score` is frozen after complete.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, session.score])

  const { label: gradeLabel, colorClass: gradeColor } = computeGrade(session.score)
  const xpEarned = bossEngine.computeXP(session.score)

  // ── Idle screen ────────────────────────────────────────────────────────────

  if (session.status === 'idle') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-8 overflow-y-auto px-8 py-12">
        {/* Hero */}
        <div className="text-center">
          <p className="mb-3 text-6xl" aria-hidden>⚔️</p>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-100">
            {t('boss.title')}
          </h1>
          <p className="text-sm text-gray-400">{t('boss.subtitle')}</p>
        </div>

        {/* Personal records — only shown after at least one run */}
        {runs > 0 && (
          <div
            className={clsx(
              'flex gap-8 bg-gray-800 px-8 py-5 text-center',
              osClass('rounded-xl', 'rounded-none border border-gray-700'),
            )}
          >
            <div>
              <p className="text-2xl font-extrabold text-yellow-400">{highScore}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t('boss.bestScore')}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-400">
                {bossEngine.formatTime(bestTime)}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{t('boss.bestTime')}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-sky-400">{runs}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t('boss.runs')}</p>
            </div>
          </div>
        )}

        {/* Rules */}
        <div
          className={clsx(
            'w-full max-w-md bg-gray-900 px-6 py-5',
            osClass('rounded-xl', 'rounded-none border border-gray-800'),
          )}
        >
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            {t('boss.rules')}
          </h2>
          <ul className="space-y-2.5 text-sm text-gray-300">
            <li>⚔️ {t('boss.rule1')}</li>
            <li>⏱ {t('boss.rule2')}</li>
            <li>⭐ {t('boss.rule3')}</li>
            <li>💡 {t('boss.rule4')}</li>
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={start}
          className={clsx(
            'px-10 py-3.5 text-base font-extrabold tracking-wide transition-colors duration-150',
            osClass('rounded-xl', 'rounded-none border border-transparent'),
            'bg-yellow-400 text-gray-950 hover:bg-yellow-300 active:bg-yellow-500',
          )}
        >
          ⚔️ {t('boss.start')}
        </button>
      </div>
    )
  }

  // ── Complete screen ────────────────────────────────────────────────────────

  if (session.status === 'complete') {
    const isNewHigh = session.score >= highScore

    return (
      <div className="flex h-full flex-col items-center justify-center gap-8 overflow-y-auto px-8 py-12">
        {/* Trophy */}
        <div className="text-center">
          <p className="mb-3 text-5xl" aria-hidden>🏆</p>
          <h1 className="mb-1 text-3xl font-extrabold text-gray-100">
            {t('boss.complete')}
          </h1>
          {isNewHigh && (
            <p className="text-sm font-bold text-yellow-400">
              ✨ {t('boss.newHighScore')}
            </p>
          )}
        </div>

        {/* Score card */}
        <div
          className={clsx(
            'w-full max-w-sm bg-gray-900 px-8 py-7',
            osClass('rounded-2xl', 'rounded-none border border-gray-800'),
          )}
        >
          {/* Grade */}
          <div className="mb-6 text-center">
            <span className={clsx('block text-7xl font-black leading-none', gradeColor)}>
              {gradeLabel}
            </span>
          </div>

          <div className="space-y-3">
            <Row label={t('boss.scoreLabel')} value={String(session.score)} />
            <Row label={t('boss.time')}       value={bossEngine.formatTime(session.elapsed)} />
            <Row label={t('boss.tasks')}      value={`${BOSS_TASK_COUNT}/${BOSS_TASK_COUNT}`} />
            <div className="my-1 border-t border-gray-800" />
            <Row label={t('boss.xpEarned')}  value={`+${xpEarned} XP`} highlight />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={restart}
            className={clsx(
              'px-6 py-2.5 text-sm font-bold transition-colors duration-150',
              osClass('rounded-lg', 'rounded-none border border-gray-700'),
              'bg-gray-800 text-gray-200 hover:bg-gray-700',
            )}
          >
            🔁 {t('boss.playAgain')}
          </button>
          <Link
            to="/lab"
            className={clsx(
              'px-6 py-2.5 text-sm font-bold transition-colors duration-150',
              osClass('rounded-lg', 'rounded-none border border-transparent'),
              'bg-emerald-500 text-gray-950 hover:bg-emerald-400',
            )}
          >
            ⚙️ {t('boss.backToLab')}
          </Link>
        </div>
      </div>
    )
  }

  // ── Running screen ─────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col">
      <BossHUD
        elapsed={session.elapsed}
        score={session.score}
        taskIndex={session.currentTaskIndex}
        hintRevealedForCurrentTask={session.hintRevealedForCurrentTask}
        onRevealHint={revealHint}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-xl">
          {session.currentTask && (
            <BossTaskCard
              task={session.currentTask}
              hintRevealed={session.hintRevealedForCurrentTask}
              onSubmit={submitAnswer}
            />
          )}
        </div>
      </div>
    </div>
  )
}
