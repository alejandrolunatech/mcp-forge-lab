import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAppSettings } from '../hooks/useAppSettings'
import type { Language, OS } from '../context/AppContext'
import { useAppContext } from '../context/AppContext'
import XPBar from './XPBar'

const LANGUAGES: { value: Language; flag: string }[] = [
  { value: 'en', flag: '🇬🇧' },
  { value: 'es', flag: '🇪🇸' },
  { value: 'nl', flag: '🇳🇱' },
]

const OS_OPTIONS: { value: OS; icon: string }[] = [
  { value: 'mac', icon: '' },
  { value: 'windows', icon: '🪟' },
]

export default function Sidebar() {
  const { t, osClass, language, os, setLanguage, setOS } = useAppSettings()
  const { setGlossaryOpen } = useAppContext()

  return (
    <aside
      className={clsx(
        'flex w-64 flex-col border-r border-gray-800 bg-gray-900 p-6 shrink-0',
        osClass('rounded-r-xl', ''),
      )}
    >
      {/* Brand */}
      <div className="mb-8">
        <h1 className="text-lg font-bold tracking-tight text-emerald-400">
          {t('home.appName')}
        </h1>
        <p className="text-xs text-gray-500">{t('home.tagline')}</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {[
          { label: `🏠 ${t('nav.home')}`, to: '/' },
          { label: `⚙️ ${t('nav.lab')}`, to: '/lab' },
          { label: `⚔️ ${t('boss.navLabel')}`, to: '/boss' },
        ].map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'px-3 py-2 text-sm font-medium transition-colors duration-150',
                osClass('rounded-md', 'rounded-none border-l-2 border-transparent'),
                isActive
                  ? osClass(
                      'bg-emerald-900/40 text-emerald-400',
                      'border-l-emerald-400 bg-emerald-900/20 text-emerald-400',
                    )
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100',
              )
            }
          >
            {label}
          </NavLink>
        ))}

        {/* Glossary button */}
        <button
          onClick={() => setGlossaryOpen(true)}
          className={clsx(
            'mt-1 px-3 py-2 text-left text-sm font-medium text-gray-400 transition-colors duration-150 hover:bg-gray-800 hover:text-gray-100',
            osClass('rounded-md', 'rounded-none border-l-2 border-transparent'),
          )}
        >
          📖 {t('glossary.navLabel')}
        </button>
      </nav>

      {/* XP / Level tracker */}
      <div className="mt-6">
        <div
          className={clsx(
            'bg-gray-800 p-4 space-y-2',
            osClass('rounded-lg', 'rounded-none border border-gray-700'),
          )}
        >
          <XPBar />
        </div>
      </div>

      {/* ── Settings panel ─────────────────────────────────────────────── */}
      <div className="mt-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t('sidebar.settings')}
        </p>

        {/* Language toggle */}
        <div className="space-y-1.5">
          <p className="text-xs text-gray-600">{t('sidebar.language')}</p>
          <div className="flex gap-1">
            {LANGUAGES.map(({ value, flag }) => (
              <button
                key={value}
                onClick={() => setLanguage(value)}
                aria-pressed={language === value}
                className={clsx(
                  'flex-1 py-1 text-xs font-semibold uppercase transition-colors duration-150',
                  osClass('rounded-md', 'rounded-none border'),
                  language === value
                    ? 'bg-emerald-500 text-gray-950'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100',
                )}
              >
                {flag} {value}
              </button>
            ))}
          </div>
        </div>

        {/* OS mode toggle */}
        <div className="space-y-1.5">
          <p className="text-xs text-gray-600">{t('sidebar.osMode')}</p>
          <div className="flex gap-1">
            {OS_OPTIONS.map(({ value, icon }) => (
              <button
                key={value}
                onClick={() => setOS(value)}
                aria-pressed={os === value}
                className={clsx(
                  'flex-1 py-1 text-xs font-semibold transition-colors duration-150',
                  osClass('rounded-md', 'rounded-none border'),
                  os === value
                    ? 'bg-emerald-500 text-gray-950'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100',
                )}
              >
                {icon} {t(`os.${value}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
