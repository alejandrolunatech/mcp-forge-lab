// ─── Boss Engine ─────────────────────────────────────────────────────────────
//
// Pure utility class — no React, no side effects beyond localStorage.
//  • Score calculation:  base − (seconds × TIME_PENALTY) − (hints × HINT_PENALTY)
//  • XP calculation:     Math.floor(score / XP_RATIO), min BOSS_MIN_XP
//  • Persistent records: high score, best time, run count

// ── Constants ─────────────────────────────────────────────────────────────────

/** Score the player starts with at the beginning of each run. */
export const BOSS_BASE_SCORE   = 1000
/** Points deducted per elapsed second. */
export const BOSS_TIME_PENALTY = 1
/** Points deducted each time the player reveals a hint. */
export const BOSS_HINT_PENALTY = 50
/** Minimum possible score (floor). */
export const BOSS_MIN_SCORE    = 100
/** Divisor for converting score to XP. */
export const BOSS_XP_RATIO     = 10
/** Minimum XP awarded even on a minimum score. */
export const BOSS_MIN_XP       = 5

// ── Persistence ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mcp-forge:boss'

interface BossStore {
  /** Best (highest) score achieved across all runs. */
  highScore: number
  /** Fastest completion time in seconds (0 = never completed). */
  bestTime: number
  /** Total number of completed runs. */
  runs: number
}

const emptyStore = (): BossStore => ({ highScore: 0, bestTime: 0, runs: 0 })

// ── Engine class ──────────────────────────────────────────────────────────────

class BossEngine {
  private load(): BossStore {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as BossStore) : emptyStore()
    } catch {
      return emptyStore()
    }
  }

  private save(store: BossStore): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      // Storage unavailable — silently continue
    }
  }

  // ── Computation ─────────────────────────────────────────────────────────

  /** Calculate live score from elapsed time and hint count. */
  computeScore(elapsed: number, hintsUsed: number): number {
    return Math.max(
      BOSS_MIN_SCORE,
      BOSS_BASE_SCORE
        - elapsed     * BOSS_TIME_PENALTY
        - hintsUsed   * BOSS_HINT_PENALTY,
    )
  }

  /** Convert a final score into an XP reward. */
  computeXP(score: number): number {
    return Math.max(BOSS_MIN_XP, Math.floor(score / BOSS_XP_RATIO))
  }

  /** Format seconds as MM:SS. */
  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // ── Records ─────────────────────────────────────────────────────────────

  getHighScore(): number { return this.load().highScore }
  getBestTime():  number { return this.load().bestTime  }
  getRuns():      number { return this.load().runs      }

  /** Persist the results of a completed run; update records as needed. */
  recordRun(score: number, elapsed: number): void {
    const store = this.load()
    store.runs += 1
    if (score > store.highScore) store.highScore = score
    if (store.bestTime === 0 || elapsed < store.bestTime) store.bestTime = elapsed
    this.save(store)
  }

  /** Wipe all stored records. */
  reset(): void {
    this.save(emptyStore())
  }
}

// Export singleton.
export const bossEngine = new BossEngine()
