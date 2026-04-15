// ─── Progress Engine ─────────────────────────────────────────────────────────
//
// Responsible for:
//  • Persisting which steps have been completed (localStorage)
//  • Querying completion state for individual steps
//  • Computing completion percentage for a world
//  • Resetting progress for a world or all worlds

// ── Storage schema ───────────────────────────────────────────────────────────

/** Shape stored in localStorage for each world. */
interface WorldProgress {
  /** ISO-8601 timestamp of when this progress record was first created */
  startedAt: string
  /** ISO-8601 timestamp of the last update */
  updatedAt: string
  /** Set of step IDs that have been marked complete */
  completedStepIds: string[]
}

/** The root object persisted under STORAGE_KEY. */
type ProgressStore = Record<string, WorldProgress>

// ── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mcp-forge:progress'

// ── Engine ───────────────────────────────────────────────────────────────────

class ProgressEngine {
  // ── Private helpers ──────────────────────────────────────────────────────

  private load(): ProgressStore {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as ProgressStore) : {}
    } catch {
      // Corrupted storage — start fresh
      return {}
    }
  }

  private save(store: ProgressStore): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      // Storage quota exceeded or unavailable — silently ignore
    }
  }

  private getOrCreateWorld(store: ProgressStore, worldId: string): WorldProgress {
    if (!store[worldId]) {
      const now = new Date().toISOString()
      store[worldId] = {
        startedAt: now,
        updatedAt: now,
        completedStepIds: [],
      }
    }
    return store[worldId]
  }

  // ── Public API ───────────────────────────────────────────────────────────

  /**
   * Mark a step as complete. Idempotent — calling it more than once for the
   * same step has no effect.
   */
  markStepComplete(worldId: string, stepId: string): void {
    const store = this.load()
    const worldProgress = this.getOrCreateWorld(store, worldId)

    if (!worldProgress.completedStepIds.includes(stepId)) {
      worldProgress.completedStepIds.push(stepId)
      worldProgress.updatedAt = new Date().toISOString()
      this.save(store)
    }
  }

  /**
   * Return whether a specific step has been marked complete.
   */
  isStepComplete(worldId: string, stepId: string): boolean {
    const store = this.load()
    return store[worldId]?.completedStepIds.includes(stepId) ?? false
  }

  /**
   * Return all completed step IDs for a world.
   */
  getCompletedSteps(worldId: string): string[] {
    const store = this.load()
    return [...(store[worldId]?.completedStepIds ?? [])]
  }

  /**
   * Compute the completion percentage (0–100) for a world.
   *
   * @param worldId     - ID of the world to evaluate
   * @param totalSteps  - Total number of steps in the world (provided by the
   *                      lessonEngine to avoid a circular dependency)
   */
  getCompletionPercent(worldId: string, totalSteps: number): number {
    if (totalSteps === 0) return 0
    const completed = this.getCompletedSteps(worldId).length
    return Math.round((completed / totalSteps) * 100)
  }

  /**
   * Return the raw WorldProgress record for a world, or null if no progress
   * has been recorded yet.
   */
  getWorldProgress(worldId: string): WorldProgress | null {
    const store = this.load()
    return store[worldId] ?? null
  }

  /**
   * Reset all progress for a specific world.
   */
  resetWorld(worldId: string): void {
    const store = this.load()
    delete store[worldId]
    this.save(store)
  }

  /**
   * Reset progress for all worlds.
   */
  resetAll(): void {
    this.save({})
  }

  /**
   * Return a summary of progress across all worlds that have been started.
   * Keys are world IDs.
   */
  getAllProgress(): ProgressStore {
    return this.load()
  }
}

// Export a singleton so the whole app shares one progress instance.
export const progressEngine = new ProgressEngine()
