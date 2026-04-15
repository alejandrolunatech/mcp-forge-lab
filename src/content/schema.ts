// ─── Content Schema ─────────────────────────────────────────────────────────
//
// These types drive the entire app. All worlds, regions and steps are expressed
// as plain data objects that conform to these interfaces — no hardcoded UI.

/** A single interactive step inside a learning region. */
export interface LessonStep {
  /** Unique identifier, e.g. "step-01-create-server" */
  id: string
  /** Short display title shown in the sidebar and header */
  title: string
  /** Full Markdown-compatible description of what the learner should do */
  description: string
  /** Optional code block to display in a syntax-highlighted editor panel */
  code?: string
  /** Optional shell command the learner needs to run */
  command?: string
  /** Explanation shown after the step is validated / marked complete */
  explanation?: string
  /** Progressive hint revealed when the learner asks for help */
  hint?: string
  /** Operating-system context for the step's instructions */
  os?: 'mac' | 'windows' | 'both'
}

/** A named group of sequential LessonSteps inside a World. */
export interface Region {
  /** Unique identifier, e.g. "region-01-basics" */
  id: string
  /** Human-readable region name */
  title: string
  /** Ordered list of steps in this region */
  steps: LessonStep[]
}

/** A top-level learning world made up of one or more Regions. */
export interface World {
  /** Unique identifier, e.g. "world-01-mcp-fundamentals" */
  id: string
  /** Human-readable world name */
  title: string
  /** Ordered list of regions in this world */
  regions: Region[]
}
