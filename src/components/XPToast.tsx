// ─── XPToast ─────────────────────────────────────────────────────────────────
//
// Fixed-position animated notification that appears when a step is completed.
// Shows a stack of cards for: step XP, region bonus, world bonus, and level-up.
//
// Usage: render with a changing `key` prop to re-trigger the slide-in animation
// on every new award:
//
//   {lastAward && <XPToast key={lastAward.timestamp} award={lastAward.award} />}

import clsx from 'clsx'
import type { XPAward } from '../engine/xpEngine'
import { useAppSettings } from '../hooks/useAppSettings'

interface XPToastProps {
  award: XPAward
}

export default function XPToast({ award }: XPToastProps) {
  const { t, osClass } = useAppSettings()

  if (award.totalGained === 0) return null

  const pill = osClass('rounded-xl', 'rounded-none')

  return (
    <div
      className="pointer-events-none fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2 xp-toast"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Step XP */}
      {award.stepXP > 0 && (
        <div
          className={clsx(
            'flex items-center gap-2 bg-emerald-500 px-4 py-2 text-sm font-bold text-gray-950 shadow-lg',
            pill,
          )}
        >
          <span aria-hidden>⚡</span>
          <span>+{award.stepXP} {t('xp.xp')}</span>
          <span className="text-xs font-medium opacity-70">
            — {t('xp.stepComplete')}
          </span>
        </div>
      )}

      {/* Mini-game challenge bonus */}
      {award.minigameBonus != null && award.minigameBonus > 0 && (
        <div
          className={clsx(
            'flex items-center gap-2 bg-orange-400 px-4 py-2 text-sm font-bold text-gray-950 shadow-lg',
            pill,
          )}
        >
          <span aria-hidden>🎯</span>
          <span>+{award.minigameBonus} {t('xp.xp')}</span>
          <span className="text-xs font-medium opacity-70">
            — {t('xp.minigameBonus')}
          </span>
        </div>
      )}

      {/* Boss fight bonus */}
      {award.bossBonus != null && award.bossBonus > 0 && (
        <div
          className={clsx(
            'flex items-center gap-2 bg-yellow-400 px-4 py-2 text-sm font-bold text-gray-950 shadow-lg',
            pill,
          )}
        >
          <span aria-hidden>⚔️</span>
          <span>+{award.bossBonus} {t('xp.xp')}</span>
          <span className="text-xs font-medium opacity-70">
            — {t('boss.xpBonus')}
          </span>
        </div>
      )}

      {/* Region completion bonus */}
      {award.regionBonus > 0 && (
        <div
          className={clsx(
            'flex items-center gap-2 bg-sky-400 px-4 py-2 text-sm font-bold text-gray-950 shadow-lg',
            pill,
          )}
        >
          <span aria-hidden>🏆</span>
          <span>+{award.regionBonus} {t('xp.xp')}</span>
          <span className="text-xs font-medium opacity-70">
            — {t('xp.regionBonus')}
          </span>
        </div>
      )}

      {/* World completion bonus */}
      {award.worldBonus > 0 && (
        <div
          className={clsx(
            'flex items-center gap-2 bg-amber-400 px-4 py-2 text-sm font-bold text-gray-950 shadow-lg',
            pill,
          )}
        >
          <span aria-hidden>🌟</span>
          <span>+{award.worldBonus} {t('xp.xp')}</span>
          <span className="text-xs font-medium opacity-70">
            — {t('xp.worldBonus')}
          </span>
        </div>
      )}

      {/* Level-up banner */}
      {award.levelAfter > award.levelBefore && (
        <div
          className={clsx(
            'flex items-center gap-2 bg-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-xl',
            pill,
          )}
        >
          <span aria-hidden>🎉</span>
          <span>
            {t('xp.levelUp')} {t('xp.level')} {award.levelAfter}!
          </span>
        </div>
      )}
    </div>
  )
}
