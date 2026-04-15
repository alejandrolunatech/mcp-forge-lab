// ─── BuildTool ────────────────────────────────────────────────────────────────
//
// Mini-game: drag-and-drop code pieces into named slots to assemble a
// server.tool() call.  Uses the native HTML5 drag-and-drop API — no deps.
//
// Interaction model:
//  • Pieces in the tray are draggable.
//  • Slots accept drops; swapping pulls the displaced piece back to the tray.
//  • Dragging a placed piece back onto the tray also works.
//  • "Check Assembly" button verifies all slots and shows per-slot feedback.
//  • "Reset" clears slots for another attempt.

import { useState } from 'react'
import clsx from 'clsx'
import type { BuildToolChallenge } from '../../content/challenges'
import { useAppSettings } from '../../hooks/useAppSettings'

interface Props {
  challenge: BuildToolChallenge
  alreadySolved: boolean
  onSolve: () => void
}

export default function BuildTool({ challenge, alreadySolved, onSolve }: Props) {
  const { t, osClass } = useAppSettings()

  const initSlots = (): Record<string, string | null> =>
    Object.fromEntries(challenge.slots.map(s => [s.id, null]))

  const [slotContents, setSlotContents] = useState<Record<string, string | null>>(initSlots)
  const [dragId, setDragId]   = useState<string | null>(null)
  const [checked, setChecked] = useState(alreadySolved)
  const [allOk,   setAllOk]   = useState(alreadySolved)

  const placedSet    = new Set(Object.values(slotContents).filter(Boolean) as string[])
  const trayPieceIds = challenge.pieces.map(p => p.id).filter(id => !placedSet.has(id))
  const allFilled    = challenge.slots.every(s => slotContents[s.id] !== null)

  const pieceLabel = (id: string) => challenge.pieces.find(p => p.id === id)?.label ?? id

  // Remove dragId from any slot it currently occupies, then place it in target.
  function dropOnSlot(slotId: string) {
    if (!dragId) return
    setSlotContents(prev => {
      const next = { ...prev }
      for (const k of Object.keys(next)) if (next[k] === dragId) next[k] = null
      next[slotId] = dragId
      return next
    })
    setDragId(null)
    setChecked(false)
  }

  // Return dragId to the tray by clearing it from any slot.
  function dropOnTray() {
    if (!dragId) return
    setSlotContents(prev => {
      const next = { ...prev }
      for (const k of Object.keys(next)) if (next[k] === dragId) next[k] = null
      return next
    })
    setDragId(null)
    setChecked(false)
  }

  function handleCheck() {
    const ok = challenge.slots.every(slot => {
      const placed = slotContents[slot.id]
      if (!placed) return false
      return challenge.pieces.find(p => p.id === placed)?.correctSlot === slot.id
    })
    setChecked(true)
    setAllOk(ok)
    if (ok) onSolve()
  }

  function handleReset() {
    setSlotContents(initSlots())
    setChecked(false)
    setAllOk(false)
  }

  return (
    <div className="space-y-5">
      <p className="text-base leading-relaxed text-gray-200">{challenge.prompt}</p>

      {/* ── Assembly template ────────────────────────────────────────────── */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 font-mono text-sm space-y-2">
        <div>
          <span className="text-sky-400">server</span>
          <span className="text-gray-400">.</span>
          <span className="text-yellow-300">tool</span>
          <span className="text-gray-400">(</span>
        </div>

        {challenge.slots.map(slot => {
          const placed    = slotContents[slot.id]
          const piece     = placed ? challenge.pieces.find(p => p.id === placed) : null
          const isCorrect = checked && piece?.correctSlot === slot.id
          const isWrong   = checked && placed !== null && piece?.correctSlot !== slot.id

          return (
            <div
              key={slot.id}
              className="flex items-start gap-3 pl-4"
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); dropOnSlot(slot.id) }}
            >
              {/* Slot label */}
              <span className="w-16 shrink-0 pt-1.5 text-right text-xs text-gray-500">
                {slot.label}:
              </span>

              {/* Drop zone */}
              <div
                className={clsx(
                  'min-h-8 min-w-40 max-w-full border-2 border-dashed px-3 py-1.5 transition-colors',
                  osClass('rounded-md', 'rounded-none'),
                  isCorrect
                    ? 'border-emerald-500 bg-emerald-950/30'
                    : isWrong
                    ? 'border-red-500 bg-red-950/30'
                    : placed
                    ? 'border-violet-400 bg-violet-950/20'
                    : 'border-gray-600 bg-gray-800/40 hover:border-violet-500',
                )}
              >
                {placed ? (
                  <span
                    draggable={!checked}
                    onDragStart={() => setDragId(placed)}
                    title={pieceLabel(placed)}
                    className={clsx(
                      'block cursor-grab break-all text-xs',
                      isCorrect ? 'text-emerald-300'
                        : isWrong ? 'text-red-300'
                        : 'text-violet-200',
                    )}
                  >
                    {pieceLabel(placed)}
                  </span>
                ) : (
                  <span className="text-xs italic text-gray-600">drop here</span>
                )}
              </div>

              {/* Per-slot indicator */}
              {isCorrect && <span className="shrink-0 pt-1.5 text-xs text-emerald-400">✓</span>}
              {isWrong   && <span className="shrink-0 pt-1.5 text-xs text-red-400">✗</span>}
            </div>
          )
        })}

        <div><span className="text-gray-400">)</span></div>
      </div>

      {/* ── Piece tray ───────────────────────────────────────────────────── */}
      <div
        className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-dashed border-gray-700 bg-gray-900/50 p-3"
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); dropOnTray() }}
      >
        {trayPieceIds.length === 0
          ? <span className="text-xs italic text-gray-600">all pieces placed</span>
          : trayPieceIds.map(id => (
            <span
              key={id}
              draggable
              onDragStart={() => setDragId(id)}
              title={pieceLabel(id)}
              className={clsx(
                'max-w-xs cursor-grab truncate rounded border border-gray-600 bg-gray-800',
                'px-2 py-1 font-mono text-xs text-gray-200',
                'transition-colors hover:border-violet-400 hover:text-violet-200 active:cursor-grabbing',
              )}
            >
              {pieceLabel(id)}
            </span>
          ))
        }
      </div>

      {/* ── Feedback / action button ─────────────────────────────────────── */}
      {checked ? (
        <div className="flex items-center gap-4">
          <p className={clsx('text-sm', allOk ? 'text-emerald-300' : 'text-red-300')}>
            {allOk ? `✓ ${t('game.correct')}` : `✗ ${t('game.tryAgain')}`}
          </p>
          {!allOk && (
            <button
              onClick={handleReset}
              className={clsx(
                'border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400',
                'transition-colors hover:border-gray-500 hover:text-gray-100',
                osClass('rounded-md', 'rounded-none'),
              )}
            >
              {t('game.reset')}
            </button>
          )}
        </div>
      ) : (
        <button
          disabled={!allFilled}
          onClick={handleCheck}
          className={clsx(
            'px-5 py-2 text-sm font-bold transition-all duration-150',
            osClass('rounded-lg', 'rounded-none'),
            !allFilled
              ? 'cursor-not-allowed bg-gray-800 text-gray-600'
              : 'bg-violet-500 text-gray-950 hover:bg-violet-400 active:scale-95',
          )}
        >
          {t('game.checkAssembly')}
        </button>
      )}
    </div>
  )
}
