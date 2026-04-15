// ─── useXP ───────────────────────────────────────────────────────────────────
//
// Convenience hook that surfaces the reactive XP / level state from AppContext.
// Components that only need XP data (e.g. XPBar) import this instead of the
// heavier useAppSettings hook.

import { useAppContext } from '../context/AppContext'
import type { XPAwardEvent } from '../context/AppContext'

export interface XPState {
  /** Total accumulated XP. */
  totalXP: number
  /** Current 1-based player level. */
  level: number
  /** XP accumulated within the current level (0 to xpPerLevel − 1). */
  xpInLevel: number
  /** XP required to fill one full level bar. */
  xpPerLevel: number
  /** Progress within the current level as a percentage (0–100). */
  levelProgressPercent: number
  /** Most recent award event, used by XPToast to trigger animations. */
  lastAward: XPAwardEvent | null
}

export function useXP(): XPState {
  const {
    totalXP,
    level,
    xpInLevel,
    xpPerLevel,
    levelProgressPercent,
    lastAward,
  } = useAppContext()

  return { totalXP, level, xpInLevel, xpPerLevel, levelProgressPercent, lastAward }
}
