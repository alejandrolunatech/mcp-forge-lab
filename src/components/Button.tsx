// ─── Button ──────────────────────────────────────────────────────────────────
//
// General-purpose button.
//  • variant: primary | secondary | ghost | danger
//  • size: sm | md | lg
//  • loading state (spinner + disabled)
//  • OS-aware border radius

import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { useAppSettings } from '../hooks/useAppSettings'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-500 text-gray-950 font-bold hover:bg-emerald-400 active:bg-emerald-600',
  secondary:
    'bg-gray-800 text-gray-200 font-medium hover:bg-gray-700 hover:text-gray-100 border border-gray-700',
  ghost:
    'bg-transparent text-gray-400 font-medium hover:bg-gray-800 hover:text-gray-100',
  danger:
    'bg-red-600 text-white font-bold hover:bg-red-500 active:bg-red-700',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-7 py-3 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const { osClass } = useAppSettings()

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
        osClass('rounded-lg', 'rounded-none'),
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        (disabled || loading) && 'cursor-not-allowed opacity-50',
        className,
      )}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
