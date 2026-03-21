'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import DashboardOverview from '@/components/DashboardOverview'
import ModulPage from '@/components/ModulPage'
import { modulData } from '@/lib/data'

export default function Home() {
  const [activeModul, setActiveModul] = useState('m0')

  const currentModul = modulData.find(m => m.id === activeModul)
  const moduleName = currentModul?.name || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar activeModul={activeModul} onSelect={setActiveModul} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar moduleName={moduleName} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {activeModul === 'm0'
              ? <DashboardOverview onNavigate={setActiveModul} />
              : <ModulPage modulId={activeModul} onBack={() => setActiveModul('m0')} />
            }
          </div>
        </main>
      </div>
    </div>
  )
}
