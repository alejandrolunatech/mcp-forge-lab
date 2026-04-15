// Content barrel — re-exports all public content types and data.
export type { LessonStep, Region, World } from './schema'
export { ALL_WORLDS, mcpFundamentals } from './worlds'
export { resolveStep, resolveRegion, resolveWorld } from './resolver'
export type { GlossaryTerm, GlossaryDefinition } from './glossary'
export { GLOSSARY_TERMS, getDefinition, searchGlossary } from './glossary'

