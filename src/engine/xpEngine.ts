// ─── XP Engine ───────────────────────────────────────────────────────────────
//
// Responsible for:
//  • Persisting accumulated XP to localStorage
//  • Computing level and level-progress from total XP
//  • Awarding XP for step / region / world completion (idempotent)

// ── Constants ────────────────────────────────────────────────────────────────

/** XP awarded for completing a single step. */
export const XP_PER_STEP = 10
/** Bonus XP awarded when all steps in a region are complete. */
export const XP_REGION_BONUS = 15
/** Bonus XP awarded when all steps in a world are complete. */
export const XP_WORLD_BONUS = 25
/** XP required to advance one level. Flat curve — every level needs the same amount. */
export const XP_PER_LEVEL = 50
/** Bonus XP awarded for solving a mini-game challenge. */
export const XP_MINIGAME_BONUS = 20
/** Nominal XP label for the boss fight; actual XP scales with score. */
export const XP_BOSS_BONUS = 50

// ── Storage schema ───────────────────────────────────────────────────────────

interface XPStore {
  /** Total accumulated XP */
  xp: number
  /** Step IDs that have already been rewarded (prevents double-counting). */
  awardedSteps: string[]
  /** Region IDs that have already received their completion bonus. */
  awardedRegions: string[]
  /** World IDs that have already received their completion bonus. */
  awardedWorlds: string[]
}

const STORAGE_KEY = 'mcp-forge:xp'
const emptyStore = (): XPStore => ({
  xp: 0,
  awardedSteps: [],
  awardedRegions: [],
  awardedWorlds: [],
})

// ── Public types ─────────────────────────────────────────────────────────────

/** Input to xpEngine.award(). */
export interface XPAwardParams {
  stepId: string
  regionId?: string
  /** True when every step in the region is now complete. */
  regionComplete?: boolean
  worldId?: string
  /** True when every step in the world is now complete. */
  worldComplete?: boolean
}

/** Result returned by xpEngine.award(). */
export interface XPAward {
  /** XP gained from the step itself (0 if already rewarded). */
  stepXP: number
  /** Bonus XP from completing a region (0 if none or already rewarded). */
  regionBonus: number
  /** Bonus XP from completing a world (0 if none or already rewarded). */
  worldBonus: number
  /** Bonus XP from solving a mini-game challenge (0 if not a mini-game award). */
  minigameBonus: number
  /** XP gained from completing the boss fight (0 if not a boss award). */
  bossBonus: number
  /** Sum of all XP gained in this single transaction. */
  totalGained: number
  /** Player level before this transaction. */
  levelBefore: number
  /** Player level after this transaction (> levelBefore = level-up). */
  levelAfter: number
  /** Total accumulated XP after this transaction. */
  currentXP: number
}

// ── Engine ───────────────────────────────────────────────────────────────────

class XPEngine {
  // ── Storage helpers ──────────────────────────────────────────────────────

  private load(): XPStore {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as XPStore) : emptyStore()
    } catch {
      return emptyStore()
    }
  }

  private save(store: XPStore): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      // Storage unavailable — silently continue
    }
  }

  // ── Level math ───────────────────────────────────────────────────────────

  /** Compute the 1-based level for a given XP total. */
  levelForXP(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1
  }

  /** XP progress within the current level (0 to XP_PER_LEVEL − 1). */
  xpInLevelForXP(xp: number): number {
    return xp % XP_PER_LEVEL
  }

  /** Level progress as a percentage (0–100). */
  levelProgressPercentForXP(xp: number): number {
    return Math.round((this.xpInLevelForXP(xp) / XP_PER_LEVEL) * 100)
  }

  // ── Public API ───────────────────────────────────────────────────────────

  /** Total accumulated XP. */
  getXP(): number {
    return this.load().xp
  }

  /** Current level (1-based). */
  getLevel(): number {
    return this.levelForXP(this.getXP())
  }

  /** XP accumulated within the current level. */
  getXPInLevel(): number {
    return this.xpInLevelForXP(this.getXP())
  }

  /** Progress within current level as 0–100. */
  getLevelProgressPercent(): number {
    return this.levelProgressPercentForXP(this.getXP())
  }

  /**
   * Award XP for a step completion, plus optional region / world bonuses.
   * All awards are idempotent — calling again for the same IDs has no effect.
   * Returns an XPAward describing exactly what was gained.
   */
  award(params: XPAwardParams): XPAward {
    const store = this.load()
    const levelBefore = this.levelForXP(store.xp)

    let stepXP = 0
    let regionBonus = 0
    let worldBonus = 0

    // Step award
    if (!store.awardedSteps.includes(params.stepId)) {
      stepXP = XP_PER_STEP
      store.awardedSteps.push(params.stepId)
    }

    // Region completion bonus
    if (
      params.regionComplete &&
      params.regionId &&
      !store.awardedRegions.includes(params.regionId)
    ) {
      regionBonus = XP_REGION_BONUS
      store.awardedRegions.push(params.regionId)
    }

    // World completion bonus
    if (
      params.worldComplete &&
      params.worldId &&
      !store.awardedWorlds.includes(params.worldId)
    ) {
      worldBonus = XP_WORLD_BONUS
      store.awardedWorlds.push(params.worldId)
    }

    const totalGained = stepXP + regionBonus + worldBonus
    store.xp += totalGained
    this.save(store)

    return {
      stepXP,
      regionBonus,
      worldBonus,
      minigameBonus: 0,
      bossBonus: 0,
      totalGained,
      levelBefore,
      levelAfter: this.levelForXP(store.xp),
      currentXP: store.xp,
    }
  }

  /**
   * Award mini-game bonus XP for solving a challenge.
   * Idempotent — calling again for the same stepId has no effect.
   */
  awardMinigame(stepId: string): XPAward {
    const store = this.load()
    const levelBefore = this.levelForXP(store.xp)
    const minigameId  = `minigame-${stepId}`

    let minigameBonus = 0
    if (!store.awardedSteps.includes(minigameId)) {
      minigameBonus = XP_MINIGAME_BONUS
      store.awardedSteps.push(minigameId)
    }

    store.xp += minigameBonus
    this.save(store)

    return {
      stepXP: 0,
      regionBonus: 0,
      worldBonus: 0,
      minigameBonus,
      bossBonus: 0,
      totalGained: minigameBonus,
      levelBefore,
      levelAfter: this.levelForXP(store.xp),
      currentXP: store.xp,
    }
  }

  /** Returns true if the mini-game for this step was already solved. */
  isMinigameSolved(stepId: string): boolean {
    return this.load().awardedSteps.includes(`minigame-${stepId}`)
  }

  /**
   * Award XP for completing a boss fight run.
   * XP scales with the final score (1 XP per 10 points, minimum 5).
   * Not idempotent — each completed run awards XP; the caller is responsible
   * for only calling this once per run.
   */
  awardBoss(score: number): XPAward {
    const store = this.load()
    const levelBefore = this.levelForXP(store.xp)
    // Same ratio as BOSS_XP_RATIO / BOSS_MIN_XP in bossEngine.ts.
    const bossBonus = Math.max(5, Math.floor(score / 10))
    store.xp += bossBonus
    this.save(store)

    return {
      stepXP: 0,
      regionBonus: 0,
      worldBonus: 0,
      minigameBonus: 0,
      bossBonus,
      totalGained: bossBonus,
      levelBefore,
      levelAfter: this.levelForXP(store.xp),
      currentXP: store.xp,
    }
  }

  /** Reset all XP and award history. */
  reset(): void {
    this.save(emptyStore())
  }
}

// Export a singleton so the whole app shares one XP instance.
export const xpEngine = new XPEngine()
