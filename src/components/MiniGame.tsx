// ─── MiniGame ─────────────────────────────────────────────────────────────────
//
// Dispatcher: looks up the challenge for `stepId`, renders the correct
// sub-game, and awards mini-game bonus XP via AppContext on the first solve.
//
// Solved-state persistence is handled by xpEngine.isMinigameSolved() which
// checks localStorage, so players don't lose their progress across sessions.

import { useState } from 'react'
import clsx from 'clsx'
import { useAppContext } from '../context/AppContext'
import { useAppSettings } from '../hooks/useAppSettings'
import { getChallenge } from '../content/challenges'
import { xpEngine, XP_MINIGAME_BONUS } from '../engine'
import FixCommand   from './games/FixCommand'
import BuildTool    from './games/BuildTool'
import DebugChallenge from './games/DebugChallenge'

// ── Theming per challenge kind ───────────────────────────────────────────────

const ACCENT: Record<string, string> = {
  'fix-command': 'border-sky-900/50 bg-sky-950/20',
  'build-tool':  'border-violet-900/50 bg-violet-950/20',
  'debug':       'border-red-900/50 bg-red-950/20',
}

const HEADER_COLOR: Record<string, string> = {
  'fix-command': 'text-sky-400',
  'build-tool':  'text-violet-400',
  'debug':       'text-red-400',
}

const LABEL_KEY: Record<string, string> = {
  'fix-command': 'game.fixCommand',
  'build-tool':  'game.buildTool',
  'debug':       'game.debugChallenge',
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  /** The ID of the current lesson step. */
  stepId: string
}

export default function MiniGame({ stepId }: Props) {
  const { awardMinigameXP } = useAppContext()
  const { t, osClass } = useAppSettings()

  const challenge = getChallenge(stepId)
  if (!challenge) return null

  // Derive initial solved state from localStorage via xpEngine.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [solved, setSolved] = useState(() => xpEngine.isMinigameSolved(stepId))

  function handleSolve() {
    awardMinigameXP(stepId) // idempotent — xpEngine skips if already awarded
    setSolved(true)
  }

  const accent     = ACCENT[challenge.kind]
  const headerColor = HEADER_COLOR[challenge.kind]
  const labelKey   = LABEL_KEY[challenge.kind]

  return (
    <div className={clsx('rounded-lg border p-5 space-y-4', accent)}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className={clsx('text-xs font-semibold uppercase tracking-wider', headerColor)}>
          🎯 {t(labelKey)}
        </p>
        <span
          className={clsx(
            'px-2 py-0.5 text-xs font-bold',
            osClass('rounded-full', 'rounded-none'),
            solved
              ? 'bg-emerald-900/60 text-emerald-400'
              : 'bg-gray-800 text-gray-400',
          )}
        >
          {solved ? `✓ ${t('game.solved')}` : `+${XP_MINIGAME_BONUS} ${t('xp.xp')}`}
        </span>
      </div>

      {/* ── Sub-game ───────────────────────────────────────────────────── */}
      {challenge.kind === 'fix-command' && (
        <FixCommand
          challenge={challenge}
          alreadySolved={solved}
          onSolve={handleSolve}
        />
      )}
      {challenge.kind === 'build-tool' && (
        <BuildTool
          challenge={challenge}
          alreadySolved={solved}
          onSolve={handleSolve}
        />
      )}
      {challenge.kind === 'debug' && (
        <DebugChallenge
          challenge={challenge}
          alreadySolved={solved}
          onSolve={handleSolve}
        />
      )}
    </div>
  )
}
