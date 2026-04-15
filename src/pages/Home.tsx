import { Link } from 'react-router-dom'
import { useAppSettings } from '../hooks/useAppSettings'

export default function Home() {
  const { t, osClass } = useAppSettings()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 text-center">
      {/* Logo / title */}
      <div className="space-y-2">
        <p className="text-sm font-semibold tracking-widest text-emerald-500 uppercase">
          {t('home.welcomeTo')}
        </p>
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-100">
          {t('home.appName')}
        </h1>
        <p className="text-2xl font-medium text-emerald-400">
          {t('home.tagline')}
        </p>
      </div>

      {/* Description */}
      <p className="max-w-md text-base text-gray-500 leading-relaxed">
        {t('home.description')}
      </p>

      {/* CTA */}
      <Link
        to="/lab"
        className={[
          'inline-flex items-center gap-2 bg-emerald-500 px-7 py-3 text-base font-bold text-gray-950',
          'transition-all duration-200 hover:bg-emerald-400 hover:scale-105 active:scale-95',
          osClass('rounded-lg', 'rounded-none'),
        ].join(' ')}
      >
        {t('home.cta')}
        <span aria-hidden>→</span>
      </Link>

      {/* Decorative badge */}
      <div
        className={[
          'mt-4 flex items-center gap-2 border border-gray-800 bg-gray-900 px-4 py-1.5',
          osClass('rounded-full', 'rounded-none'),
        ].join(' ')}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-gray-500">{t('home.badge')}</span>
      </div>
    </div>
  )
}
