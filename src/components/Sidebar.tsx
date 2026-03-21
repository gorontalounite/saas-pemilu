'use client'
import { useState } from 'react'
import { modulData, candidate } from '@/lib/data'
import type { AppView } from '@/app/page'
import {
  LayoutDashboard, Users, Map, Megaphone, ClipboardCheck,
  BarChart2, Wallet, Radio, Heart, UserCircle,
  ChevronRight, Bell, Settings, LogOut, Menu, X,
  Zap, Sun, Moon, Database, BookOpen, ChevronDown
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  m0:LayoutDashboard, m9:UserCircle, m1:Users, m2:Map,
  m3:Megaphone, m4:ClipboardCheck, m5:BarChart2,
  m6:Wallet, m7:Radio, m8:Heart,
}
const colorMap: Record<string, string> = {
  indigo:'text-indigo-400 bg-indigo-500/10', purple:'text-purple-400 bg-purple-500/10',
  green:'text-green-400 bg-green-500/10', sky:'text-sky-400 bg-sky-500/10',
  pink:'text-pink-400 bg-pink-500/10', orange:'text-orange-400 bg-orange-500/10',
  teal:'text-teal-400 bg-teal-500/10', amber:'text-amber-400 bg-amber-500/10',
  red:'text-red-400 bg-red-500/10',
}

const KONTESTASI = [
  { value:'dpr_ri',      label:'DPR RI' },
  { value:'dpd_ri',      label:'DPD RI' },
  { value:'dprd_prov',   label:'DPRD Provinsi' },
  { value:'dprd_kabkot', label:'DPRD Kab/Kota' },
]

interface Props {
  activeModul: string
  onSelect: (id: string) => void
  appView: AppView
  onSetView: (v: AppView) => void
  isDark: boolean
  onToggleTheme: () => void
}

export default function Sidebar({ activeModul, onSelect, appView, onSetView, isDark, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false)
  const [kontestasi, setKontestasi] = useState(candidate.kontestasi || '')
  const [locked, setLocked] = useState(false)
  const isAdmin = candidate.name === 'ADMIN'

  const handleKontestasi = (val: string) => {
    if (locked) return
    setKontestasi(val)
  }
  const lockKontestasi = () => {
    if (kontestasi) setLocked(true)
  }

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[var(--border)] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <Zap size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)] leading-none">KampanyeOS</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">v1.0 · Beta</p>
        </div>
      </div>

      {/* Candidate chip */}
      <div className="px-3 py-2.5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-hover)]">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
            {candidate.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[var(--text-primary)] truncate">
              {isAdmin ? 'ADMIN' : candidate.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">
              {locked && kontestasi
                ? KONTESTASI.find(k => k.value === kontestasi)?.label
                : isAdmin ? 'Belum setup profil' : candidate.title}
            </p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
        </div>

        {/* Kontestasi selector — tampil jika admin atau belum terkunci */}
        {(!locked || isAdmin) && (
          <div className="mt-2">
            <p className="text-[9px] text-[var(--text-muted)] mb-1 px-1">
              {isAdmin ? 'Pilih kontestasi (semua tersedia untuk Admin)' : 'Pilih kontestasi Anda'}
            </p>
            <div className="relative">
              <select
                value={kontestasi}
                onChange={e => handleKontestasi(e.target.value)}
                disabled={locked && !isAdmin}
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-[11px] text-[var(--text-primary)] outline-none focus:border-indigo-500 appearance-none pr-6 disabled:opacity-50"
              >
                <option value="">— Pilih kontestasi —</option>
                {KONTESTASI.map(k => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            </div>
            {kontestasi && !locked && (
              <button
                onClick={lockKontestasi}
                className="mt-1.5 w-full text-[10px] bg-indigo-500 text-white py-1.5 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Konfirmasi & Kunci
              </button>
            )}
            {locked && isAdmin && (
              <p className="text-[9px] text-amber-400 mt-1 px-1">Admin: bisa ganti kapan saja</p>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-1.5">
          Modul Kampanye
        </p>
        {modulData.map((m) => {
          const Icon = iconMap[m.id] || LayoutDashboard
          const colors = colorMap[m.color] || colorMap.indigo
          const isActive = activeModul === m.id && appView === 'main'
          return (
            <button
              key={m.id}
              onClick={() => { onSelect(m.id); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 text-left transition-all border
                ${isActive
                  ? 'bg-indigo-500/12 border-indigo-500/20 text-[var(--text-primary)]'
                  : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent'
                }`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${isActive ? colors : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
                <Icon size={13} />
              </div>
              <span className="text-xs font-medium truncate flex-1">{m.name}</span>
              {m.alerts > 0 && (
                <span className="text-[9px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded-full font-semibold leading-none flex-shrink-0">
                  {m.alerts}
                </span>
              )}
              {isActive && <ChevronRight size={11} className="text-indigo-400 flex-shrink-0" />}
            </button>
          )
        })}

        {/* Halaman terpisah */}
        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-widest px-2 mb-1.5">
            Halaman Lainnya
          </p>
          <button
            onClick={() => { onSetView('database'); setOpen(false) }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 text-left transition-all border
              ${appView === 'database'
                ? 'bg-teal-500/12 border-teal-500/20 text-teal-300'
                : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent'
              }`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${appView === 'database' ? 'bg-teal-500/10 text-teal-400' : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
              <Database size={13} />
            </div>
            <span className="text-xs font-medium truncate flex-1">Database Center</span>
            {appView === 'database' && <ChevronRight size={11} className="text-teal-400 flex-shrink-0" />}
          </button>

          <button
            onClick={() => { onSetView('rag'); setOpen(false) }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 text-left transition-all border
              ${appView === 'rag'
                ? 'bg-purple-500/12 border-purple-500/20 text-purple-300'
                : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent'
              }`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${appView === 'rag' ? 'bg-purple-500/10 text-purple-400' : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
              <BookOpen size={13} />
            </div>
            <span className="text-xs font-medium truncate flex-1">RAG Knowledge</span>
            {appView === 'rag' && <ChevronRight size={11} className="text-purple-400 flex-shrink-0" />}
          </button>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2 py-2 border-t border-[var(--border)] space-y-0.5">
        <button onClick={onToggleTheme}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all">
          {isDark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-indigo-400" />}
          <span className="text-xs">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all">
          <Settings size={13} /><span className="text-xs">Pengaturan</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-all">
          <LogOut size={13} /><span className="text-xs">Keluar</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-3.5 left-4 z-50 w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
        {open ? <X size={15} className="text-[var(--text-primary)]" /> : <Menu size={15} className="text-[var(--text-primary)]" />}
      </button>
      {open && <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-60 bg-[var(--bg-card)] border-r border-[var(--border)] z-40 transition-transform duration-200 overflow-y-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <Content />
      </aside>
      <aside className="hidden lg:flex flex-col w-60 bg-[var(--bg-card)] border-r border-[var(--border)] h-screen sticky top-0 flex-shrink-0 transition-colors overflow-y-auto">
        <Content />
      </aside>
    </>
  )
}
