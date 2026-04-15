// ─── Card ────────────────────────────────────────────────────────────────────
//
// Flexible container card.
//  • variant: default | accent (emerald) | warning (amber) | ghost
//  • Slots: header (title + subtitle), children (body), footer
//  • OS-aware border radius + shadows

import { type ReactNode } from 'react'
import clsx from 'clsx'
import { useAppSettings } from '../hooks/useAppSettings'

export type CardVariant = 'default' | 'accent' | 'warning' | 'ghost'

interface CardProps {
  title?: string
  subtitle?: string
  footer?: ReactNode
  variant?: CardVariant
  className?: string
  children?: ReactNode
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: 'bg-gray-900 border border-gray-800',
  accent:  'bg-emerald-950/30 border border-emerald-900/60',
  warning: 'bg-amber-950/30 border border-amber-900/60',
  ghost:   'bg-transparent border border-dashed border-gray-700',
}

const TITLE_CLASSES: Record<CardVariant, string> = {
  default: 'text-gray-100',
  accent:  'text-emerald-400',
  warning: 'text-amber-400',
  ghost:   'text-gray-300',
}

export default function Card({
  title,
  subtitle,
  footer,
  variant = 'default',
  className,
  children,
}: CardProps) {
  const { osClass } = useAppSettings()

  return (
    <div
      className={clsx(
        'overflow-hidden',
        osClass('rounded-xl shadow-md shadow-black/30', 'rounded-none'),
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-5 pt-5 pb-3">
          {title && (
            <h3 className={clsx('text-base font-bold', TITLE_CLASSES[variant])}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      )}

      {/* Body */}
      {children && (
        <div className={clsx('px-5', title || subtitle ? 'pb-5' : 'py-5')}>
          {children}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-800 px-5 py-3">
          {footer}
        </div>
      )}
    </div>
  )
}
