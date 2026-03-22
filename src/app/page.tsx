'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import DashboardOverview from '@/components/DashboardOverview'
import ModulPage from '@/components/ModulPage'
import DatabaseCenter from '@/components/DatabaseCenter'
import RAGKnowledge from '@/components/RAGKnowledge'
import { modulData } from '@/lib/data'

export type AppView = 'main' | 'database' | 'rag'

export default function Home() {
  const [activeModul, setActiveModul] = useState('m0')
  const [appView, setAppView] = useState<AppView>('main')
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark)
  }, [isDark])

  const currentModul = modulData.find(m => m.id === activeModul)
  const moduleName = appView === 'database'
    ? 'Database Center'
    : appView === 'rag'
    ? 'RAG Knowledge'
    : currentModul?.name || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      <Sidebar
        activeModul={activeModul}
        onSelect={(id) => { setActiveModul(id); setAppView('main') }}
        appView={appView}
        onSetView={setAppView}
        isDark={isDark}
        onToggleTheme={() => setIsDark(p => !p)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          moduleName={moduleName}
          appView={appView}
          onSetView={setAppView}
          isDark={isDark}
          onToggleTheme={() => setIsDark(p => !p)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {appView === 'database' ? (
              <DatabaseCenter onBack={() => setAppView('main')} />
            ) : appView === 'rag' ? (
              <RAGKnowledge onBack={() => setAppView('main')} />
            ) : activeModul === 'm0' ? (
              <DashboardOverview onNavigate={(id) => { setActiveModul(id); setAppView('main') }} />
            ) : (
              <ModulPage modulId={activeModul} onBack={() => setActiveModul('m0')} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
