import { Outlet } from 'react-router-dom'
import { useAppSettings } from '../hooks/useAppSettings'
import Sidebar from './Sidebar'
import GlossaryPanel from './GlossaryPanel'

export default function Layout() {
  const { os, osClass } = useAppSettings()

  return (
    <div
      data-os={os}
      className={[
        'flex h-screen w-screen overflow-hidden bg-gray-950 text-gray-100',
        osClass('font-[system-ui]', 'font-["Segoe_UI",system-ui]'),
      ].join(' ')}
    >
      <Sidebar />
      <main
        className={[
          'flex-1 overflow-y-auto p-8',
          osClass('', 'border-l border-gray-700'),
        ].join(' ')}
      >
        <Outlet />
      </main>

      {/* Glossary slide-over — rendered here so it can float above any page */}
      <GlossaryPanel />
    </div>
  )
}

