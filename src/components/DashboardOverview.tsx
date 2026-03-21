'use client'
import { modulData, alerts, candidate } from '@/lib/data'
import {
  AlertCircle, AlertTriangle, Info,
  Users, Map, Megaphone, ClipboardCheck,
  BarChart2, Wallet, Radio, Heart, UserCircle,
  LayoutDashboard, ArrowUpRight
} from 'lucide-react'

const colorTextMap: Record<string, string> = {
  indigo:'text-indigo-400', teal:'text-teal-400', amber:'text-amber-400',
  green:'text-green-400',   purple:'text-purple-400', pink:'text-pink-400',
  orange:'text-orange-400', sky:'text-sky-400', red:'text-red-400',
}
const colorBgMap: Record<string, string> = {
  indigo:'bg-indigo-500/10 border-indigo-500/20', teal:'bg-teal-500/10 border-teal-500/20',
  amber:'bg-amber-500/10 border-amber-500/20',   green:'bg-green-500/10 border-green-500/20',
  purple:'bg-purple-500/10 border-purple-500/20', pink:'bg-pink-500/10 border-pink-500/20',
  orange:'bg-orange-500/10 border-orange-500/20', sky:'bg-sky-500/10 border-sky-500/20',
  red:'bg-red-500/10 border-red-500/20',
}
const iconMap: Record<string, React.ElementType> = {
  m0:LayoutDashboard, m9:UserCircle, m1:Users,  m2:Map,
  m3:Megaphone, m4:ClipboardCheck, m5:BarChart2,
  m6:Wallet, m7:Radio, m8:Heart,
}
const statCards = [
  { label:'Total Relawan',  value:'0',    delta:'Belum ada relawan',  color:'indigo' },
  { label:'TPS Terpetakan', value:'0',    delta:'dari ± 1.800 TPS',   color:'teal'   },
  { label:'Dana Tersisa',   value:'Rp —', delta:'Budget belum diset', color:'amber'  },
  { label:'Elektabilitas',  value:'—%',   delta:'Belum ada survei',   color:'green'  },
]

interface Props { onNavigate: (id: string) => void }

export default function DashboardOverview({ onNavigate }: Props) {
  const typedAlerts = alerts as any[]
  const criticalCount = typedAlerts.filter(a => a.level === 'critical').length

  return (
    <div className="space-y-6">

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 relative overflow-hidden animate-slide-up">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl font-bold text-indigo-300 flex-shrink-0">
            {candidate.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-base font-semibold text-[var(--text-primary)]">{candidate.name}</h1>
              <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 px-2 py-0.5 rounded-full">No. {candidate.nomorUrut}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{candidate.title} · {candidate.region}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{candidate.party || 'Partai belum diisi'}</p>
          </div>
          <div className="flex flex-row sm:flex-col gap-3 sm:gap-1 sm:text-right">
            <div>
              <p className="text-2xl font-bold text-[var(--text-muted)]">—%</p>
              <p className="text-[10px] text-[var(--text-muted)]">elektabilitas saat ini</p>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">Belum ada data survei</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4" style={{ animationDelay:`${i*0.05}s` }}>
            <p className="text-[11px] text-[var(--text-muted)] mb-2">{s.label}</p>
            <p className={`text-xl font-bold ${colorTextMap[s.color]}`}>{s.value}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1.5">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Tren elektabilitas</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Survei internal · belum ada data</p>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-1 rounded-md">Modul 5</span>
          </div>
          <div className="flex items-center justify-center h-24 border border-dashed border-[var(--border-lit)] rounded-lg">
            <p className="text-[11px] text-[var(--text-muted)] text-center">
              Belum ada data elektabilitas<br />
              <span className="text-[10px]">Input survei pertama di Modul 5</span>
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 border-t border-dashed border-amber-500/40" />
            <span className="text-[10px] text-amber-400">Target {candidate.targetSuara}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Alert aktif</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${criticalCount > 0 ? 'bg-red-500/15 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {criticalCount} kritis
            </span>
          </div>
          {typedAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-2">
              <span className="text-2xl">✓</span>
              <p className="text-[11px] text-[var(--text-muted)] text-center">
                Tidak ada alert<br />
                <span className="text-[10px]">Lengkapi profil untuk mulai</span>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {typedAlerts.map((a, idx) => {
                const Icon = a.level === 'critical' ? AlertCircle : a.level === 'warning' ? AlertTriangle : Info
                const cls = a.level === 'critical' ? 'text-red-400 bg-red-500/10' : a.level === 'warning' ? 'text-amber-400 bg-amber-500/10' : 'text-sky-400 bg-sky-500/10'
                return (
                  <div key={idx} className="flex gap-2.5 p-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-all cursor-pointer">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${cls}`}>
                      <Icon size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[var(--text-primary)] leading-tight">{a.msg}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{a.modul} · {a.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Realisasi anggaran</h3>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-1 rounded-md">Modul 6</span>
          </div>
          <div className="flex items-center justify-center h-20 border border-dashed border-[var(--border-lit)] rounded-lg">
            <p className="text-[11px] text-[var(--text-muted)] text-center">
              Budget kampanye belum dikonfigurasi<br />
              <span className="text-[10px]">Setup di Modul 6</span>
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Aktivitas hari ini</h3>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-1 rounded-md">Live</span>
          </div>
          <div className="flex items-center justify-center h-20">
            <p className="text-[11px] text-[var(--text-muted)] text-center">
              Belum ada aktivitas<br />
              <span className="text-[10px]">Mulai dengan mendaftarkan relawan pertama</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Semua modul</h3>
          <span className="text-[11px] text-[var(--text-muted)]">10 modul · klik untuk masuk</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {modulData.map((m, i) => {
            const Icon = iconMap[m.id] || LayoutDashboard
            const isLocked = m.status === 'locked'
            const healthColor = m.health >= 90 ? 'bg-green-400' : m.health >= 70 ? 'bg-amber-400' : m.health > 0 ? 'bg-red-400' : 'bg-[var(--text-muted)]'
            return (
              <button
                key={m.id}
                onClick={() => !isLocked && onNavigate(m.id)}
                disabled={isLocked}
                style={{ animationDelay:`${i*0.04}s` }}
                className={`rounded-xl border p-3.5 text-left transition-all group ${isLocked ? 'border-[var(--border)] bg-[var(--bg-card)] opacity-40 cursor-not-allowed' : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-lit)] hover:bg-[var(--bg-hover)] cursor-pointer'}`}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorBgMap[m.color] || colorBgMap.indigo} border`}>
                    <Icon size={14} className={colorTextMap[m.color] || colorTextMap.indigo} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {m.alerts > 0 && (
                      <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">{m.alerts}</span>
                    )}
                    <div className={`w-1.5 h-1.5 rounded-full ${healthColor}`} />
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-[var(--text-primary)] leading-tight mb-1">
                  <span className="text-[var(--text-muted)] mr-1">{m.num}·</span>{m.name}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] leading-tight line-clamp-2">{m.stats}</p>
                {!isLocked && (
                  <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-[var(--text-muted)]">Buka</span>
                    <ArrowUpRight size={9} className="text-[var(--text-muted)]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
