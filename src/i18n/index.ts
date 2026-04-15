// ─── i18n ────────────────────────────────────────────────────────────────────
//
// Minimal translation system:
//  • Three locale JSON files (en / es / nl)
//  • t(key, language) — looks up a key, falls back to English, then the key itself

import type { Language } from '../context/AppContext'
import en from './en.json'
import es from './es.json'
import nl from './nl.json'

export type { Language }

type TranslationMap = Record<string, string>

const translations: Record<Language, TranslationMap> = { en, es, nl }

/**
 * Translate a dot-separated key into the given language.
 * Falls back to English, then to the raw key if no translation exists.
 */
export function t(key: string, language: Language): string {
  return translations[language]?.[key] ?? translations['en'][key] ?? key
}

