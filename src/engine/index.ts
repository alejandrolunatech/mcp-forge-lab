// Engine barrel — re-exports all public engine singletons and types.
export { lessonEngine } from './lessonEngine'
export type { LessonCursor, LessonState } from './lessonEngine'
export { progressEngine } from './progressEngine'
export { xpEngine, XP_PER_STEP, XP_REGION_BONUS, XP_WORLD_BONUS, XP_PER_LEVEL, XP_MINIGAME_BONUS, XP_BOSS_BONUS } from './xpEngine'
export type { XPAward, XPAwardParams } from './xpEngine'
export { bossEngine, BOSS_BASE_SCORE, BOSS_HINT_PENALTY, BOSS_XP_RATIO, BOSS_MIN_XP } from './bossEngine'

