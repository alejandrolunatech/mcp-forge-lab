// ─── useAppSettings ──────────────────────────────────────────────────────────
//
// Primary hook for consuming global app settings.  Bundles together:
//  • language / os state + their setters (from AppContext)
//  • t(key)     — translate a key into the active language
//  • osClass(mac, windows) — pick a Tailwind class string based on OS mode

import { useAppContext, type Language, type OS } from '../context/AppContext'
import { t as translateFn } from '../i18n'

// ── Public types ─────────────────────────────────────────────────────────────

export interface AppSettings {
  /** Active locale */
  language: Language
  /** Active OS mode */
  os: OS
  /** Change the active locale */
  setLanguage: (lang: Language) => void
  /** Change the active OS mode */
  setOS: (os: OS) => void
  /**
   * Translate a dot-separated key into the active language.
   * Falls back to English, then to the raw key.
   */
  t: (key: string) => string
  /**
   * Return `mac` class string when OS is mac, `windows` string otherwise.
   * Useful for applying OS-specific Tailwind utilities inline.
   *
   * @example
   * className={osClass('rounded-xl shadow-md', 'rounded-none shadow-none')}
   */
  osClass: (mac: string, windows: string) => string
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAppSettings(): AppSettings {
  const { language, os, setLanguage, setOS } = useAppContext()

  function t(key: string): string {
    return translateFn(key, language)
  }

  function osClass(mac: string, windows: string): string {
    return os === 'mac' ? mac : windows
  }

  return { language, os, setLanguage, setOS, t, osClass }
}
