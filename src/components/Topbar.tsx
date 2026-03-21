'use client'
import { candidate, alerts } from '@/lib/data'
import { Bell, Search, Clock } from 'lucide-react'

const criticalAlerts = alerts.filter(a => a.level === 'critical').length

export default function Topbar({ moduleName }: { moduleName: string }) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
      {/* Spacer for mobile hamburger */}
      <div className="w-8 lg:hidden" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs text-[var(--text-muted)] hidden sm:block">KampanyeOS</span>
        <span className="text-[var(--text-muted)] text-xs hidden sm:block">/</span>
        <span className="text-sm font-medium text-[var(--text-primary)] truncate">{moduleName}</span>
      </div>

      {/* Time */}
      <div className="hidden md:flex items-center gap-1.5 text-[var(--text-muted)]">
        <Clock size={12} />
        <span className="text-xs">{timeStr} · {dateStr}</span>
      </div>

      {/* H count */}
      <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span ...>{Math.ceil((new Date('2029-02-14').getTime() - Date.now()) / 86400000).toLocaleString('id-ID')} hari lagi · 14 Feb 2029</span>
      </div>

      {/* Alert bell */}
      <button className="relative w-8 h-8 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-all">
        <Bell size={15} className="text-[var(--text-secondary)]" />
        {criticalAlerts > 0 && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold">
            {criticalAlerts}
          </span>
        )}
      </button>
    </header>
  )
}
