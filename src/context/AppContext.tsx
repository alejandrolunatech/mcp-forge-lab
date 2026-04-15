// ─── AppContext ───────────────────────────────────────────────────────────────
//
// Global app settings context:
//  • language  — active UI locale: "en" | "es" | "nl"
//  • os        — active OS mode:   "mac" | "windows"
//  • XP / Level state — reactive player progression
//  • setLanguage / setOS / awardXP — updaters exposed to any component

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { xpEngine, XP_PER_LEVEL } from '../engine/xpEngine'
import type { XPAward, XPAwardParams } from '../engine/xpEngine'

// ── Types ────────────────────────────────────────────────────────────────────

export type Language = 'en' | 'es' | 'nl'
export type OS = 'mac' | 'windows'

/** Snapshot of a single XP award event, used to drive the toast. */
export interface XPAwardEvent {
  award: XPAward
  /** Monotonically-increasing timestamp used as React key to re-trigger animations. */
  timestamp: number
}

export interface AppContextValue {
  language: Language
  os: OS
  setLanguage: (lang: Language) => void
  setOS: (os: OS) => void
  // ── Glossary ─────────────────────────────────────────────────────────────
  /** Whether the glossary slide-over panel is visible. */
  glossaryOpen: boolean
  /** Open or close the glossary panel. */
  setGlossaryOpen: (open: boolean) => void
  // ── XP / Level ──────────────────────────────────────────────────────────
  /** Total accumulated XP across all sessions. */
  totalXP: number
  /** Current 1-based player level. */
  level: number
  /** XP accumulated within the current level (0 to XP_PER_LEVEL − 1). */
  xpInLevel: number
  /** XP required to fill one level bar. */
  xpPerLevel: number
  /** Level progress as a percentage (0–100). */
  levelProgressPercent: number
  /** Most recent XP award event, or null if no award has been issued yet. */
  lastAward: XPAwardEvent | null
  /** Award XP for completing a step (and optionally a region / world). */
  awardXP: (params: XPAwardParams) => void
  /** Award mini-game bonus XP for solving a challenge. Idempotent. */
  awardMinigameXP: (stepId: string) => void
  /** Award XP for completing a boss fight run. Score-scaled; call once per run. */
  awardBossXP: (score: number) => void
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function readXPSnapshot() {
  const xp = xpEngine.getXP()
  return {
    totalXP: xp,
    level: xpEngine.levelForXP(xp),
    xpInLevel: xpEngine.xpInLevelForXP(xp),
    xpPerLevel: XP_PER_LEVEL,
    levelProgressPercent: xpEngine.levelProgressPercentForXP(xp),
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [os, setOS] = useState<OS>('mac')
  const [glossaryOpen, setGlossaryOpen] = useState(false)

  // XP / Level — initialised from localStorage via xpEngine
  const [xpSnapshot, setXPSnapshot] = useState(readXPSnapshot)
  const [lastAward, setLastAward] = useState<XPAwardEvent | null>(null)

  const awardXP = useCallback((params: XPAwardParams) => {
    const award = xpEngine.award(params)
    if (award.totalGained > 0) {
      setXPSnapshot(readXPSnapshot())
      setLastAward({ award, timestamp: Date.now() })
    }
  }, [])

  const awardMinigameXP = useCallback((stepId: string) => {
    const award = xpEngine.awardMinigame(stepId)
    if (award.totalGained > 0) {
      setXPSnapshot(readXPSnapshot())
      setLastAward({ award, timestamp: Date.now() })
    }
  }, [])

  const awardBossXP = useCallback((score: number) => {
    const award = xpEngine.awardBoss(score)
    if (award.totalGained > 0) {
      setXPSnapshot(readXPSnapshot())
      setLastAward({ award, timestamp: Date.now() })
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        language,
        os,
        setLanguage,
        setOS,
        glossaryOpen,
        setGlossaryOpen,
        ...xpSnapshot,
        lastAward,
        awardXP,
        awardMinigameXP,
        awardBossXP,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// ── Raw context hook (used internally) ──────────────────────────────────────

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>')
  return ctx
}
