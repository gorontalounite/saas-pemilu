'use client'
import { useState } from 'react'
import { alerts } from '@/lib/data'
import { Bell, Clock, Sun, Moon, X, Calendar, ChevronRight } from 'lucide-react'

const criticalAlerts = (alerts as any[]).filter(a => a.level === 'critical').length

const TARGET = new Date('2029-02-14')

function getDaysLeft() {
  return Math.max(0, Math.ceil((TARGET.getTime() - Date.now()) / 86400000))
}

const phases = [
  { date: '2026–2027',  label: 'Pendaftaran & verifikasi partai',     desc: 'KPU membuka pendaftaran peserta Pemilu 2029',          color: 'bg-green-400' },
  { date: 'Mid 2027',   label: 'Penetapan daerah pemilihan',          desc: 'Penetapan dapil dan alokasi kursi DPR RI',             color: 'bg-teal-400' },
  { date: 'Akhir 2027', label: 'Pencalonan anggota legislatif',       desc: 'Partai mendaftarkan caleg ke KPU',                     color: 'bg-indigo-400' },
  { date: '2028',       label: 'Masa kampanye',                       desc: 'Kampanye terbuka, debat kandidat, iklan politik',      color: 'bg-purple-400' },
  { date: 'Jan 2029',   label: 'Masa tenang',                        desc: '3 hari sebelum pemungutan suara',                      color: 'bg-amber-400' },
  { date: '14 Feb 2029',label: '⭐ Hari Pemungutan Suara',            desc: 'Pemilu Nasional — DPR RI, DPD, Presiden',             color: 'bg-red-400' },
]

interface Props {
  moduleName: string
  isDark: boolean
  onToggleTheme: () => void
}

export default function Topbar({ moduleName, isDark, onToggleTheme }: Props) {
  const [showModal, setShowModal] = useState(false)
  const daysLeft = getDaysLeft()

  const now = new Date()
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <header className="h-14 border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30 transition-colors">
        {/* Mobile hamburger spacer */}
        <div className="w-8 lg:hidden" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-[var(--text-muted)] hidden sm:block">KampanyeOS</span>
          <ChevronRight size={12} className="text-[var(--text-muted)] hidden sm:block" />
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">{moduleName}</span>
        </div>

        {/* Time */}
        <div className="hidden md:flex items-center gap-1.5 text-[var(--text-muted)]">
          <Clock size={12} />
          <span className="text-xs">{timeStr} · {dateStr}</span>
        </div>

        {/* Countdown pill — clickable */}
        <button
          onClick={() => setShowModal(true)}
          className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full hover:bg-amber-500/15 transition-colors"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-medium text-amber-400">
            {daysLeft.toLocaleString('id-ID')} hari · 14 Feb 2029
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-8 h-8 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-hover)] flex items-center justify-center transition-all"
        >
          {isDark
            ? <Sun size={14} className="text-amber-400" />
            : <Moon size={14} className="text-[var(--text-secondary)]" />
          }
        </button>

        {/* Bell */}
        <button className="relative w-8 h-8 rounded-lg hover:bg-[var(--bg-hover)] flex items-center justify-center transition-all">
          <Bell size={15} className="text-[var(--text-secondary)]" />
          {criticalAlerts > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold">
              {criticalAlerts}
            </span>
          )}
        </button>
      </header>

      {/* Calendar / Timeline Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-amber-400" />
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Timeline & Kalender Kampanye</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
              >
                <X size={14} className="text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[var(--bg-hover)] rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-indigo-400">{daysLeft.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Hari tersisa</p>
              </div>
              <div className="bg-[var(--bg-hover)] rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-green-400">{Math.floor(daysLeft / 7).toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Minggu tersisa</p>
              </div>
              <div className="bg-[var(--bg-hover)] rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-amber-400">2029</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Pemilu Nasional</p>
              </div>
            </div>

            {/* Phases */}
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Tahapan Pemilu 2029</h3>
            <div className="space-y-0">
              {phases.map((p, i) => (
                <div key={i} className="flex gap-3 items-stretch">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${p.color}`} />
                    {i < phases.length - 1 && <div className="w-px flex-1 bg-[var(--border)] my-1" />}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-0.5 rounded">{p.date}</span>
                      <span className="text-xs font-medium text-[var(--text-primary)]">{p.label}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add event CTA */}
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] mb-3">Tambah kegiatan kampanye di Modul 9 → Profil Calon → Jadwal Kampanye</p>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)]"
                  placeholder="Nama kegiatan kampanye..."
                />
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg transition-colors font-medium">
                  + Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
