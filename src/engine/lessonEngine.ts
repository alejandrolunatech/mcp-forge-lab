// ─── Lesson Engine ───────────────────────────────────────────────────────────
//
// Responsible for:
//  • Registering / loading World data
//  • Maintaining the "cursor" (current world → region → step)
//  • Moving forward and backward through steps
//  • Marking a step as complete (delegates persistence to progressEngine)

import type { LessonStep, Region, World } from '../content/schema'
import { progressEngine } from './progressEngine'

// ── Types ────────────────────────────────────────────────────────────────────

/** Fully-resolved position inside the content tree. */
export interface LessonCursor {
  worldId: string
  regionId: string
  stepId: string
  /** 0-based index of the step inside its parent Region */
  stepIndex: number
  /** 0-based index of the region inside its parent World */
  regionIndex: number
}

/** Everything a consumer needs to render the current step. */
export interface LessonState {
  world: World
  region: Region
  step: LessonStep
  cursor: LessonCursor
  /** True when there is no previous step in the entire world */
  isFirst: boolean
  /** True when there is no next step in the entire world */
  isLast: boolean
  /** True when the current step has been marked complete */
  isCurrentStepComplete: boolean
}

// ── Engine ───────────────────────────────────────────────────────────────────

class LessonEngine {
  private worlds: Map<string, World> = new Map()
  private cursor: LessonCursor | null = null

  // ── Registration ────────────────────────────────────────────────────────

  /** Register one or more worlds. Must be called before any navigation. */
  loadWorlds(worlds: World[]): void {
    for (const world of worlds) {
      this.worlds.set(world.id, world)
    }
  }

  /** Return an immutable copy of all registered worlds (sorted by insertion). */
  getWorlds(): World[] {
    return Array.from(this.worlds.values())
  }

  /** Return a single world by id, or undefined if not found. */
  getWorld(worldId: string): World | undefined {
    return this.worlds.get(worldId)
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  /**
   * Set the cursor to the first step of the given world, or to a specific
   * step if a full cursor is supplied.
   */
  start(worldId: string, cursor?: Partial<LessonCursor>): LessonState | null {
    const world = this.worlds.get(worldId)
    if (!world || world.regions.length === 0) return null

    const regionIndex = cursor?.regionId
      ? world.regions.findIndex(r => r.id === cursor.regionId)
      : 0
    if (regionIndex === -1) return null

    const region = world.regions[regionIndex]
    const stepIndex = cursor?.stepId
      ? region.steps.findIndex(s => s.id === cursor.stepId)
      : 0
    if (stepIndex === -1) return null

    this.cursor = {
      worldId,
      regionId: region.id,
      stepId: region.steps[stepIndex].id,
      regionIndex,
      stepIndex,
    }

    return this.getState()
  }

  /** Advance to the next step. Returns null when already at the last step. */
  next(): LessonState | null {
    if (!this.cursor) return null

    const world = this.worlds.get(this.cursor.worldId)!
    const region = world.regions[this.cursor.regionIndex]

    // Still steps left in the current region
    if (this.cursor.stepIndex < region.steps.length - 1) {
      const stepIndex = this.cursor.stepIndex + 1
      this.cursor = {
        ...this.cursor,
        stepIndex,
        stepId: region.steps[stepIndex].id,
      }
      return this.getState()
    }

    // Move to the first step of the next region
    const nextRegionIndex = this.cursor.regionIndex + 1
    if (nextRegionIndex < world.regions.length) {
      const nextRegion = world.regions[nextRegionIndex]
      this.cursor = {
        ...this.cursor,
        regionIndex: nextRegionIndex,
        regionId: nextRegion.id,
        stepIndex: 0,
        stepId: nextRegion.steps[0].id,
      }
      return this.getState()
    }

    // Already at the last step of the last region
    return null
  }

  /** Move to the previous step. Returns null when already at the first step. */
  previous(): LessonState | null {
    if (!this.cursor) return null

    const world = this.worlds.get(this.cursor.worldId)!

    // Still steps left in the current region (going backwards)
    if (this.cursor.stepIndex > 0) {
      const stepIndex = this.cursor.stepIndex - 1
      const region = world.regions[this.cursor.regionIndex]
      this.cursor = {
        ...this.cursor,
        stepIndex,
        stepId: region.steps[stepIndex].id,
      }
      return this.getState()
    }

    // Move to the last step of the previous region
    const prevRegionIndex = this.cursor.regionIndex - 1
    if (prevRegionIndex >= 0) {
      const prevRegion = world.regions[prevRegionIndex]
      const stepIndex = prevRegion.steps.length - 1
      this.cursor = {
        ...this.cursor,
        regionIndex: prevRegionIndex,
        regionId: prevRegion.id,
        stepIndex,
        stepId: prevRegion.steps[stepIndex].id,
      }
      return this.getState()
    }

    // Already at the first step of the first region
    return null
  }

  // ── Completion ──────────────────────────────────────────────────────────

  /**
   * Mark the current step as complete and persist via progressEngine.
   * Returns the updated state.
   */
  completeCurrentStep(): LessonState | null {
    if (!this.cursor) return null
    progressEngine.markStepComplete(this.cursor.worldId, this.cursor.stepId)
    return this.getState()
  }

  /**
   * Mark an arbitrary step complete without changing the cursor.
   */
  completeStep(worldId: string, stepId: string): void {
    progressEngine.markStepComplete(worldId, stepId)
  }

  // ── State snapshot ──────────────────────────────────────────────────────

  /** Return a fully-resolved state snapshot, or null if the engine has not been started. */
  getState(): LessonState | null {
    if (!this.cursor) return null

    const world = this.worlds.get(this.cursor.worldId)
    if (!world) return null

    const region = world.regions[this.cursor.regionIndex]
    const step = region.steps[this.cursor.stepIndex]

    const isFirst =
      this.cursor.regionIndex === 0 && this.cursor.stepIndex === 0

    const lastRegion = world.regions[world.regions.length - 1]
    const isLast =
      this.cursor.regionIndex === world.regions.length - 1 &&
      this.cursor.stepIndex === lastRegion.steps.length - 1

    return {
      world,
      region,
      step,
      cursor: { ...this.cursor },
      isFirst,
      isLast,
      isCurrentStepComplete: progressEngine.isStepComplete(
        this.cursor.worldId,
        this.cursor.stepId,
      ),
    }
  }

  /** Count the total number of steps across all regions in a world. */
  getTotalSteps(worldId: string): number {
    const world = this.worlds.get(worldId)
    if (!world) return 0
    return world.regions.reduce((acc, r) => acc + r.steps.length, 0)
  }
}

// Export a singleton so the whole app shares one engine instance.
export const lessonEngine = new LessonEngine()
