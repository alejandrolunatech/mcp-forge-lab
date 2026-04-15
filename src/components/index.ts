// ─── Components barrel ───────────────────────────────────────────────────────
// Re-exports all reusable UI components.

export { default as Button } from './Button'
export type { ButtonVariant, ButtonSize } from './Button'

export { default as Card } from './Card'
export type { CardVariant } from './Card'

export { default as CodeBlock } from './CodeBlock'

export { default as CommandBlock } from './CommandBlock'

export { default as GlossaryPanel } from './GlossaryPanel'

export { default as Layout } from './Layout'

export { default as LessonNav } from './LessonNav'

export { default as LessonPlayer } from './LessonPlayer'

export { default as ProgressBar } from './ProgressBar'
export type { ProgressVariant, ProgressSize } from './ProgressBar'

export { default as Sidebar } from './Sidebar'

export { default as ToggleSwitch } from './ToggleSwitch'

export { default as MiniGame } from './MiniGame'
export { default as FixCommand } from './games/FixCommand'
export { default as BuildTool } from './games/BuildTool'
export { default as DebugChallenge } from './games/DebugChallenge'

export { default as BossHUD } from './boss/BossHUD'
export { default as BossTaskCard } from './boss/BossTaskCard'
