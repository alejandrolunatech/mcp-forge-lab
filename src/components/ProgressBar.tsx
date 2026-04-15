// ─── ProgressBar ─────────────────────────────────────────────────────────────
//
// Standalone progress bar.
//  • value: 0–100
//  • variant: default (emerald) | warning (amber) | danger (red)
//  • size: sm | md | lg
//  • Optional label (left) and valueLabel (right, defaults to "N%")
//  • OS-aware radius

import clsx from 'clsx'
import { useAppSettings } from '../hooks/useAppSettings'

export type ProgressVariant = 'default' | 'warning' | 'danger'
export type ProgressSize = 'sm' | 'md' | 'lg'

interface ProgressBarProps {
  value: number
  variant?: ProgressVariant
  size?: ProgressSize
  label?: string
  showValue?: boolean
  className?: string
}

const FILL_CLASSES: Record<ProgressVariant, string> = {
  default: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-500',
}

const TRACK_HEIGHT: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
}

export default function ProgressBar({
  value,
  variant = 'default',
  size = 'md',
  label,
  showValue = true,
  className,
}: ProgressBarProps) {
  const { osClass } = useAppSettings()
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={clsx('space-y-1', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-xs font-medium text-gray-400">{label}</span>
          )}
          {showValue && (
            <span className="ml-auto text-xs tabular-nums text-gray-500">
              {clamped}%
            </span>
          )}
        </div>
      )}

      <div
        className={clsx(
          'w-full overflow-hidden bg-gray-800',
          TRACK_HEIGHT[size],
          osClass('rounded-full', 'rounded-none'),
        )}
      >
        <div
          className={clsx(
            'h-full transition-all duration-500',
            FILL_CLASSES[variant],
            osClass('rounded-full', 'rounded-none'),
          )}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
