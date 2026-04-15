// ─── GlossaryPanel ───────────────────────────────────────────────────────────
//
// A slide-over panel that floats above the entire app layout.
// Features:
//  • Backdrop click to close
//  • Search input (filters by term name + definition text)
//  • Accordion: each term expands to show the full definition + example
//  • Fully translated (EN / ES / NL) via useAppSettings
//
// Controlled entirely through AppContext (glossaryOpen / setGlossaryOpen).

import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useAppSettings } from '../hooks/useAppSettings'
import { useAppContext } from '../context/AppContext'
import {
  GLOSSARY_TERMS,
  getDefinition,
  searchGlossary,
} from '../content/glossary'

export default function GlossaryPanel() {
  const { t, osClass, language } = useAppSettings()
  const { glossaryOpen, setGlossaryOpen } = useAppContext()

  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)

  // Reset state when the panel opens; focus the search box
  useEffect(() => {
    if (glossaryOpen) {
      setQuery('')
      setExpandedId(null)
      // Defer focus so the CSS transition has started
      setTimeout(() => searchRef.current?.focus(), 80)
    }
  }, [glossaryOpen])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setGlossaryOpen(false)
    }
    if (glossaryOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [glossaryOpen, setGlossaryOpen])

  const filtered = searchGlossary(GLOSSARY_TERMS, query, language)

  function toggleTerm(id: string) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        aria-hidden={!glossaryOpen}
        onClick={() => setGlossaryOpen(false)}
        className={clsx(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          glossaryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* ── Slide-over panel ─────────────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('glossary.title')}
        className={clsx(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-gray-900 shadow-2xl',
          'border-l border-gray-800 transition-transform duration-300 ease-out',
          osClass('rounded-l-xl', 'rounded-none'),
          glossaryOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-gray-100">
              📖 {t('glossary.title')}
            </h2>
            <p className="text-xs text-gray-500">{t('glossary.subtitle')}</p>
          </div>
          <button
            onClick={() => setGlossaryOpen(false)}
            aria-label={t('glossary.close')}
            className={clsx(
              'flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-200',
              osClass('rounded-md', 'rounded-none'),
            )}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-gray-800 px-6 py-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              🔍
            </span>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setExpandedId(null)
              }}
              placeholder={t('glossary.searchPlaceholder')}
              className={clsx(
                'w-full bg-gray-800 py-2 pl-9 pr-4 text-sm text-gray-100 placeholder-gray-600',
                'border border-gray-700 outline-none transition-colors',
                'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50',
                osClass('rounded-lg', 'rounded-none'),
              )}
            />
          </div>
        </div>

        {/* Term list */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {filtered.length === 0 ? (
            <p className="mt-8 text-center text-sm text-gray-600">
              {t('glossary.noResults')}
            </p>
          ) : (
            <ul className="space-y-1">
              {filtered.map(term => {
                const def = getDefinition(term, language)
                const isOpen = expandedId === term.id

                return (
                  <li key={term.id}>
                    <button
                      onClick={() => toggleTerm(term.id)}
                      aria-expanded={isOpen}
                      className={clsx(
                        'flex w-full items-start gap-3 px-3 py-3 text-left transition-colors duration-150',
                        osClass('rounded-lg', 'rounded-none border-l-2 border-transparent'),
                        isOpen
                          ? osClass(
                              'bg-gray-800 text-gray-100',
                              'border-l-emerald-400 bg-gray-800/80 text-gray-100',
                            )
                          : 'text-gray-300 hover:bg-gray-800/60 hover:text-gray-100',
                      )}
                    >
                      {/* Icon */}
                      <span className="mt-0.5 flex-shrink-0 text-base leading-none">
                        {term.icon}
                      </span>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold leading-tight">
                            {term.term}
                          </span>
                          <span
                            className={clsx(
                              'flex-shrink-0 text-xs text-gray-500 transition-transform duration-200',
                              isOpen ? 'rotate-180' : '',
                            )}
                            aria-hidden
                          >
                            ▾
                          </span>
                        </div>

                        {/* Short definition — always visible */}
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                          {def.short}
                        </p>

                        {/* Expanded content */}
                        {isOpen && (
                          <div className="mt-3 space-y-3">
                            <p className="text-xs leading-relaxed text-gray-300">
                              {def.long}
                            </p>

                            {def.example && (
                              <pre
                                className={clsx(
                                  'overflow-x-auto bg-gray-950 p-3 text-xs font-mono text-sky-300',
                                  osClass('rounded-md', 'rounded-none border-l-2 border-sky-700'),
                                )}
                              >
                                {def.example}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 px-6 py-3">
          <p className="text-xs text-gray-700">
            {filtered.length} / {GLOSSARY_TERMS.length} {t('glossary.terms')}
          </p>
        </div>
      </aside>
    </>
  )
}
