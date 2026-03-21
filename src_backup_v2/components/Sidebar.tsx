'use client'
import { useState } from 'react'
import { modulData, candidate } from '@/lib/data'
import {
  LayoutDashboard, Users, Map, Megaphone, ClipboardCheck,
  BarChart2, Wallet, Radio, Heart, UserCircle,
  ChevronRight, Bell, Settings, LogOut, Menu, X, Zap
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  m0: LayoutDashboard,
  m9: UserCircle,
  m1: Users,
  m2: Map,
  m3: Megaphone,
  m4: ClipboardCheck,
  m5: BarChart2,
  m6: Wallet,
  m7: Radio,
  m8: Heart,
}

const colorMap: Record<string, string> = {
  indigo: 'text-indigo-400 bg-indigo-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  green:  'text-green-400 bg-green-500/10',
  sky:    'text-sky-400 bg-sky-500/10',
  pink:   'text-pink-400 bg-pink-500/10',
  orange: 'text-orange-400 bg-orange-500/10',
  teal:   'text-teal-400 bg-teal-500/10',
  amber:  'text-amber-400 bg-amber-500/10',
  red:    'text-red-400 bg-red-500/10',
}

interface SidebarProps {
  activeModul: string
  onSelect: (id: string) => void
}

export default function Sidebar({ activeModul, onSelect }: SidebarProps) {
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] leading-none">KampanyeOS</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">v1.0 · Beta</p>
          </div>
        </div>
      </div>

      {/* Candidate chip */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--bg-hover)]">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
            {candidate.initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--text-primary)] truncate">{candidate.shortName}</p>
            <p className="text-[10px] text-[var(--text-muted)]">{candidate.title} · No. {candidate.nomorUrut}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest px-3 mb-2">Modul</p>
        {modulData.map((m) => {
          const Icon = iconMap[m.id] || LayoutDashboard
          const colors = colorMap[m.color] || colorMap.indigo
          const isActive = activeModul === m.id
          const isLocked = m.status === 'locked'

          return (
            <button
              key={m.id}
              onClick={() => { if (!isLocked) { onSelect(m.id); setOpen(false) } }}
              disabled={isLocked}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all
                ${isActive
                  ? 'bg-indigo-500/15 border border-indigo-500/25 text-[var(--text-primary)]'
                  : isLocked
                  ? 'opacity-35 cursor-not-allowed'
                  : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${isActive ? colors : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium truncate">{m.name}</span>
                  {m.alerts > 0 && (
                    <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold leading-none">
                      {m.alerts}
                    </span>
                  )}
                  {isLocked && <span className="text-[9px] text-[var(--text-muted)]">🔒</span>}
                </div>
              </div>
              {isActive && <ChevronRight size={12} className="text-indigo-400 flex-shrink-0" />}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-[var(--border)] space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all">
          <Bell size={14} /><span className="text-xs">Notifikasi</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all">
          <Settings size={14} /><span className="text-xs">Pengaturan</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={14} /><span className="text-xs">Keluar</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center"
      >
        {open ? <X size={16} className="text-[var(--text-primary)]" /> : <Menu size={16} className="text-[var(--text-primary)]" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-[var(--bg-card)] border-r border-[var(--border)] z-40 transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 bg-[var(--bg-card)] border-r border-[var(--border)] h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
