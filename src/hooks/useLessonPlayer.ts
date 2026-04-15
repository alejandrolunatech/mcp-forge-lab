// ─── useLessonPlayer ─────────────────────────────────────────────────────────
//
// React hook that bridges the imperative lessonEngine singleton with React
// state.  Components call this hook to get the current lesson state and
// functions to navigate / complete steps.

import { useState, useCallback, useEffect } from 'react'
import { lessonEngine } from '../engine/lessonEngine'
import type { LessonState } from '../engine/lessonEngine'
import { progressEngine } from '../engine/progressEngine'
import { useAppContext } from '../context/AppContext'
import { ALL_WORLDS } from '../content/worlds'

// Ensure worlds are registered once (idempotent — loadWorlds uses a Map).
lessonEngine.loadWorlds(ALL_WORLDS)

// ── Hook ─────────────────────────────────────────────────────────────────────

export interface LessonPlayerControls {
  /** Current lesson state snapshot, or null before the engine has started. */
  state: LessonState | null
  /** Advance to the next step. No-op when already at the last step. */
  next: () => void
  /** Go back to the previous step. No-op when already at the first step. */
  previous: () => void
  /** Mark the current step as complete and refresh state. */
  complete: () => void
  /** Jump directly to a step by its world + step IDs. */
  jumpTo: (worldId: string, stepId: string) => void
  /** Completion percentage (0–100) for the active world. */
  completionPercent: number
}

export function useLessonPlayer(
  initialWorldId: string = ALL_WORLDS[0].id,
): LessonPlayerControls {
  const { awardXP } = useAppContext()

  const [state, setState] = useState<LessonState | null>(() =>
    lessonEngine.start(initialWorldId),
  )

  // Keep the completion % in sync with state so re-renders happen on complete.
  const [completionPercent, setCompletionPercent] = useState<number>(() => {
    const total = lessonEngine.getTotalSteps(initialWorldId)
    return progressEngine.getCompletionPercent(initialWorldId, total)
  })

  const refreshPercent = useCallback((worldId: string) => {
    const total = lessonEngine.getTotalSteps(worldId)
    setCompletionPercent(progressEngine.getCompletionPercent(worldId, total))
  }, [])

  // Re-sync when the initialWorldId prop changes.
  useEffect(() => {
    const newState = lessonEngine.start(initialWorldId)
    setState(newState)
    refreshPercent(initialWorldId)
  }, [initialWorldId, refreshPercent])

  const next = useCallback(() => {
    const newState = lessonEngine.next()
    if (newState) setState(newState)
  }, [])

  const previous = useCallback(() => {
    const newState = lessonEngine.previous()
    if (newState) setState(newState)
  }, [])

  const complete = useCallback(() => {
    const newState = lessonEngine.completeCurrentStep()
    if (newState) {
      setState(newState)
      refreshPercent(newState.world.id)

      // ── Award XP ────────────────────────────────────────────────────────
      const { world, region, step } = newState

      // Region is complete when every step in it is now marked done.
      const regionComplete = region.steps.every(s =>
        progressEngine.isStepComplete(world.id, s.id),
      )

      // World is complete when every region is fully done.
      const worldComplete = world.regions.every(r =>
        r.steps.every(s => progressEngine.isStepComplete(world.id, s.id)),
      )

      awardXP({
        stepId: step.id,
        regionId: region.id,
        regionComplete,
        worldId: world.id,
        worldComplete,
      })
    }
  }, [refreshPercent, awardXP])

  const jumpTo = useCallback(
    (worldId: string, stepId: string) => {
      // Find the region that contains the step.
      const world = lessonEngine.getWorld(worldId)
      if (!world) return
      const region = world.regions.find(r => r.steps.some(s => s.id === stepId))
      if (!region) return
      const newState = lessonEngine.start(worldId, { regionId: region.id, stepId })
      if (newState) {
        setState(newState)
        refreshPercent(worldId)
      }
    },
    [refreshPercent],
  )

  return { state, next, previous, complete, jumpTo, completionPercent }
}
