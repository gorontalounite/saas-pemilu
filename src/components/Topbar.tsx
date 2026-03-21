'use client'
import { useState } from 'react'
import { alerts } from '@/lib/data'
import type { AppView } from '@/app/page'
import { Bell, Clock, Sun, Moon, X, Calendar, ChevronRight, Database, BookOpen } from 'lucide-react'

const criticalAlerts = (alerts as any[]).filter(a => a.level === 'critical').length
const TARGET = new Date('2029-02-14')
function getDaysLeft() { return Math.max(0, Math.ceil((TARGET.getTime() - Date.now()) / 86400000)) }

const phases = [
  { date:'2026–2027',   label:'Pendaftaran & verifikasi partai',   color:'bg-green-400' },
  { date:'Mid 2027',    label:'Penetapan daerah pemilihan',        color:'bg-teal-400' },
  { date:'Akhir 2027',  label:'Pencalonan anggota legislatif',     color:'bg-indigo-400' },
  { date:'2028',        label:'Masa kampanye',                     color:'bg-purple-400' },
  { date:'Jan 2029',    label:'Masa tenang (3 hari)',              color:'bg-amber-400' },
  { date:'14 Feb 2029', label:'⭐ Hari Pemungutan Suara',          color:'bg-red-400' },
]

interface Props {
  moduleName: string
  appView: AppView
  onSetView: (v: AppView) => void
  isDark: boolean
  onToggleTheme: () => void
}

export default function Topbar({ moduleName, appView, onSetView, isDark, onToggleTheme }: Props) {
  const [showModal, setShowModal] = useState(false)
  const daysLeft = getDaysLeft()
  const now = new Date()
  const timeStr = now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
  const dateStr = now.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  return (
    <>
      <header className="h-14 border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-30 transition-colors">
        <div className="w-8 lg:hidden flex-shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-[var(--text-muted)] hidden sm:block">KampanyeOS</span>
          <ChevronRight size={12} className="text-[var(--text-muted)] hidden sm:block flex-shrink-0" />
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">{moduleName}</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-[var(--text-muted)]">
          <Clock size={12} />
          <span className="text-xs">{timeStr} · {dateStr}</span>
        </div>
        <button onClick={() => setShowModal(true)}
          className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full hover:bg-amber-500/15 transition-colors flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-medium text-amber-400">{daysLeft.toLocaleString('id-ID')} hari · 14 Feb 2029</span>
        </button>
        <button onClick={() => onSetView(appView === 'database' ? 'main' : 'database')} title="Database Center"
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${appView === 'database' ? 'bg-teal-500/15 border-teal-500/30 text-teal-400' : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
          <Database size={14} />
        </button>
        <button onClick={() => onSetView(appView === 'rag' ? 'main' : 'rag')} title="RAG Knowledge"
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${appView === 'rag' ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
          <BookOpen size={14} />
        </button>
        <button onClick={onToggleTheme} title="Toggle theme"
          className="w-8 h-8 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-hover)] flex items-center justify-center transition-all flex-shrink-0">
          {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-[var(--text-secondary)]" />}
        </button>
        <button className="relative w-8 h-8 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-all flex-shrink-0">
          <Bell size={15} className="text-[var(--text-secondary)]" />
          {criticalAlerts > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold">{criticalAlerts}</span>
          )}
        </button>
      </header>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-amber-400" />
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Timeline Kampanye — Pemilu 2029</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center"><X size={14} className="text-[var(--text-secondary)]" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { val: daysLeft.toLocaleString('id-ID'), lbl:'Hari tersisa', c:'text-indigo-400' },
                { val: Math.floor(daysLeft/7).toLocaleString('id-ID'), lbl:'Minggu tersisa', c:'text-green-400' },
                { val: '2029', lbl:'Pemilu Nasional', c:'text-amber-400' },
              ].map((s,i) => (
                <div key={i} className="bg-[var(--bg-hover)] rounded-xl p-3 text-center">
                  <p className={`text-xl font-bold ${s.c}`}>{s.val}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{s.lbl}</p>
                </div>
              ))}
            </div>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Tahapan Pemilu 2029</h3>
            {phases.map((p, i) => (
              <div key={i} className="flex gap-3 items-stretch">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${p.color}`} />
                  {i < phases.length-1 && <div className="w-px flex-1 bg-[var(--border)] my-1" />}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-0.5 rounded">{p.date}</span>
                    <span className="text-xs font-medium text-[var(--text-primary)]">{p.label}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-[11px] text-[var(--text-muted)] mb-3">Tambah kegiatan di Modul 9 → Profil Calon → Jadwal Kampanye</p>
              <div className="flex gap-2">
                <input className="flex-1 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)]" placeholder="Nama kegiatan kampanye..." />
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg transition-colors font-medium">+ Tambah</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
