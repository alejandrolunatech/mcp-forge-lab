// ─── ToggleSwitch ─────────────────────────────────────────────────────────────
//
// Accessible toggle switch (checkbox semantics).
//  • checked / onChange
//  • label (right-side text)
//  • description (smaller helper text below label)
//  • disabled state
//  • OS-aware: Mac = pill, Windows = square

import { type ChangeEvent } from 'react'
import clsx from 'clsx'
import { useAppSettings } from '../hooks/useAppSettings'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  id?: string
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
}: ToggleSwitchProps) {
  const { osClass } = useAppSettings()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  return (
    <label
      className={clsx(
        'inline-flex cursor-pointer items-start gap-3',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {/* Hidden native checkbox for accessibility */}
      <input
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        aria-checked={checked}
      />

      {/* Visual track + thumb */}
      <span
        aria-hidden
        className={clsx(
          'relative mt-0.5 flex-shrink-0 transition-colors duration-200',
          // Mac: pill-shaped 36×20, Windows: squarer 34×18
          osClass('h-5 w-9 rounded-full', 'h-[18px] w-[34px] rounded-sm'),
          checked
            ? 'bg-emerald-500'
            : 'bg-gray-700 border border-gray-600',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 block bg-white shadow transition-transform duration-200',
            osClass(
              // Mac: circular thumb
              clsx(
                'h-4 w-4 rounded-full',
                checked ? 'translate-x-4' : 'translate-x-0.5',
              ),
              // Windows: square thumb
              clsx(
                'h-3.5 w-3.5 rounded-none',
                checked ? 'translate-x-[17px]' : 'translate-x-0.5',
              ),
            ),
          )}
        />
      </span>

      {/* Label text */}
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-gray-200">{label}</span>
          )}
          {description && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </span>
      )}
    </label>
  )
}
