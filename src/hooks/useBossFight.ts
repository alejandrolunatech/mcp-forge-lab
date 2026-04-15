// ─── useBossFight ─────────────────────────────────────────────────────────────
//
// React bridge for the boss fight.  Drives an in-memory session (timer, task
// progression, hint tracking) and delegates persistence to bossEngine.

import { useState, useCallback, useEffect, useRef } from 'react'
import { BOSS_TASKS, BOSS_TASK_COUNT, type BossTask } from '../content/bossFight'
import { bossEngine } from '../engine/bossEngine'

// ── Public types ─────────────────────────────────────────────────────────────

export type BossStatus = 'idle' | 'running' | 'complete'

export interface BossSession {
  status: BossStatus
  currentTaskIndex: number
  currentTask: BossTask | null
  elapsed: number
  score: number
  hintsUnlockedInRun: number
  hintRevealedForCurrentTask: boolean
  tasksCompleted: number
}

export interface UseBossFightReturn {
  session: BossSession
  highScore: number
  bestTime: number
  runs: number
  start: () => void
  submitAnswer: (answer: string | number) => boolean
  revealHint: () => void
  restart: () => void
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useBossFight(): UseBossFightReturn {
  const [status, setStatus] = useState<BossStatus>('idle')
  const [taskIndex, setTaskIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hintRevealedForTask, setHintRevealedForTask] = useState(false)
  const [tasksCompleted, setTasksCompleted] = useState(0)

  // Mutable refs so interval callbacks always see up-to-date values without
  // creating a new interval every second.
  const elapsedRef  = useRef(0)
  const hintsRef    = useRef(0)
  const statusRef   = useRef<BossStatus>('idle')
  const taskRef     = useRef(0)
  const completedRef = useRef(0)

  // Keep refs in sync with state on every render.
  statusRef.current   = status
  taskRef.current     = taskIndex
  completedRef.current = tasksCompleted
  elapsedRef.current  = elapsed
  hintsRef.current    = hintsUsed

  // Derived score (reactively updated on every re-render triggered by state).
  const score = bossEngine.computeScore(elapsed, hintsUsed)

  // ── Timer ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => {
      elapsedRef.current += 1
      setElapsed(elapsedRef.current)
    }, 1_000)
    return () => clearInterval(id)
  }, [status])

  // ── Actions ────────────────────────────────────────────────────────────

  const start = useCallback(() => {
    elapsedRef.current  = 0
    hintsRef.current    = 0
    setStatus('running')
    setTaskIndex(0)
    setElapsed(0)
    setHintsUsed(0)
    setHintRevealedForTask(false)
    setTasksCompleted(0)
  }, [])

  const submitAnswer = useCallback(
    (answer: string | number): boolean => {
      if (statusRef.current !== 'running') return false

      const task = BOSS_TASKS[taskRef.current]
      if (!task) return false

      let isCorrect = false

      if (task.type === 'command' && task.answers) {
        const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()
        isCorrect = task.answers.some(a => norm(a) === norm(String(answer)))
      } else if (task.type === 'choice') {
        isCorrect = Number(answer) === task.correctIndex
      }

      if (!isCorrect) return false

      completedRef.current += 1
      setTasksCompleted(completedRef.current)

      const nextIndex = taskRef.current + 1

      if (nextIndex >= BOSS_TASK_COUNT) {
        // Run complete — freeze elapsed, record, finish.
        const finalScore = bossEngine.computeScore(elapsedRef.current, hintsRef.current)
        bossEngine.recordRun(finalScore, elapsedRef.current)
        setStatus('complete')
      } else {
        setTaskIndex(nextIndex)
        setHintRevealedForTask(false)
      }

      return true
    },
    // statusRef, taskRef, etc. are refs so they don't need to be listed, but
    // lint cannot know that — the empty dep array is intentional here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const revealHint = useCallback(() => {
    if (hintRevealedForTask) return
    hintsRef.current += 1
    setHintsUsed(hintsRef.current)
    setHintRevealedForTask(true)
  }, [hintRevealedForTask])

  const restart = useCallback(() => {
    elapsedRef.current  = 0
    hintsRef.current    = 0
    setStatus('idle')
    setTaskIndex(0)
    setElapsed(0)
    setHintsUsed(0)
    setHintRevealedForTask(false)
    setTasksCompleted(0)
  }, [])

  // ── Return ─────────────────────────────────────────────────────────────

  return {
    session: {
      status,
      currentTaskIndex: taskIndex,
      currentTask: status === 'running' ? (BOSS_TASKS[taskIndex] ?? null) : null,
      elapsed,
      score,
      hintsUnlockedInRun: hintsUsed,
      hintRevealedForCurrentTask: hintRevealedForTask,
      tasksCompleted,
    },
    highScore: bossEngine.getHighScore(),
    bestTime:  bossEngine.getBestTime(),
    runs:      bossEngine.getRuns(),
    start,
    submitAnswer,
    revealHint,
    restart,
  }
}
