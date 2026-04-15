// ─── XPBar ───────────────────────────────────────────────────────────────────
//
// Displays the player's current level and XP progress within that level.
// Intended for use in the Sidebar as a compact gamification widget.
//
//  ┌────────────────────────────────┐
//  │ LVL 2  ·  XP          35/50   │
//  │ ████████████░░░░░░░░░░░░░░░░░ │
//  │ 85 total XP                   │
//  └────────────────────────────────┘

import clsx from 'clsx'
import { useXP } from '../hooks/useXP'
import { useAppSettings } from '../hooks/useAppSettings'

interface XPBarProps {
  className?: string
}

export default function XPBar({ className }: XPBarProps) {
  const { totalXP, level, xpInLevel, xpPerLevel, levelProgressPercent } = useXP()
  const { t, osClass } = useAppSettings()

  return (
    <div className={clsx('space-y-2', className)}>
      {/* Level badge + label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'inline-flex items-center px-2 py-0.5 text-xs font-bold tabular-nums',
              'bg-emerald-400 text-gray-950',
              osClass('rounded-full', 'rounded-none'),
            )}
          >
            {t('xp.level')} {level}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t('xp.xp')}
          </span>
        </div>
        <span className="tabular-nums text-xs text-gray-500">
          {xpInLevel} / {xpPerLevel}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className={clsx(
          'h-2 w-full overflow-hidden bg-gray-700',
          osClass('rounded-full', 'rounded-none'),
        )}
        role="progressbar"
        aria-valuenow={levelProgressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${t('xp.level')} ${level}: ${xpInLevel} / ${xpPerLevel} ${t('xp.xp')}`}
      >
        <div
          className={clsx(
            'h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700',
            osClass('rounded-full', 'rounded-none'),
          )}
          style={{ width: `${levelProgressPercent}%` }}
        />
      </div>

      {/* Total XP */}
      <p className="tabular-nums text-xs text-gray-600">
        {totalXP} {t('xp.totalXP')}
      </p>
    </div>
  )
}
