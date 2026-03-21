'use client'
import { useState } from 'react'
import { modulData, alerts, candidate, kabGorontalo } from '@/lib/data'
import {
  AlertCircle, AlertTriangle, Info,
  Users, Map, Megaphone, ClipboardCheck,
  BarChart2, Wallet, Radio, Heart, UserCircle,
  LayoutDashboard, ArrowUpRight, Upload
} from 'lucide-react'

const colorTextMap: Record<string,string> = {
  indigo:'text-indigo-400', teal:'text-teal-400', amber:'text-amber-400',
  green:'text-green-400', purple:'text-purple-400', pink:'text-pink-400',
  orange:'text-orange-400', sky:'text-sky-400', red:'text-red-400',
}
const colorBgMap: Record<string,string> = {
  indigo:'bg-indigo-500/10 border-indigo-500/20', teal:'bg-teal-500/10 border-teal-500/20',
  amber:'bg-amber-500/10 border-amber-500/20', green:'bg-green-500/10 border-green-500/20',
  purple:'bg-purple-500/10 border-purple-500/20', pink:'bg-pink-500/10 border-pink-500/20',
  orange:'bg-orange-500/10 border-orange-500/20', sky:'bg-sky-500/10 border-sky-500/20',
  red:'bg-red-500/10 border-red-500/20',
}
const iconMap: Record<string,React.ElementType> = {
  m0:LayoutDashboard, m9:UserCircle, m1:Users, m2:Map,
  m3:Megaphone, m4:ClipboardCheck, m5:BarChart2,
  m6:Wallet, m7:Radio, m8:Heart,
}
const statCards = [
  { label:'Total Relawan',   value:'0',    delta:'Belum ada relawan',  color:'indigo' },
  { label:'TPS Terpetakan',  value:'0',    delta:'dari ± 1.800 TPS',   color:'teal'   },
  { label:'Dana Tersisa',    value:'Rp —', delta:'Budget belum diset', color:'amber'  },
  { label:'Elektabilitas',   value:'—%',   delta:'Belum ada survei',   color:'green'  },
]

interface Props { onNavigate: (id: string) => void }

export default function DashboardOverview({ onNavigate }: Props) {
  const [selectedKab, setSelectedKab] = useState<string | null>(null)
  const typedAlerts = alerts as any[]
  const criticalCount = typedAlerts.filter(a => a.level === 'critical').length
  const selKab = kabGorontalo.find(k => k.id === selectedKab)

  const kabColor = (id: string) =>
    selectedKab === id
      ? 'fill-indigo-500 stroke-indigo-300'
      : 'fill-[var(--bg-hover)] stroke-[var(--border-lit)] hover:fill-indigo-500/20 hover:stroke-indigo-400 cursor-pointer'

  return (
    <div className="space-y-5">

      {/* Hero */}
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
          <div className="sm:text-right">
            <p className="text-2xl font-bold text-[var(--text-muted)]">—%</p>
            <p className="text-[10px] text-[var(--text-muted)]">elektabilitas saat ini</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Belum ada data survei</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 animate-slide-up" style={{ animationDelay:`${i*0.05}s` }}>
            <p className="text-[11px] text-[var(--text-muted)] mb-2">{s.label}</p>
            <p className={`text-xl font-bold ${colorTextMap[s.color]}`}>{s.value}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1.5">{s.delta}</p>
          </div>
        ))}
      </div>

      {/* PETA GORONTALO */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Peta Provinsi Gorontalo</h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">6 Kabupaten/Kota · klik wilayah untuk detail</p>
          </div>
          <button
            onClick={() => onNavigate('m2')}
            className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Upload size={11} /> Input Data
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* SVG Map */}
          <svg viewBox="0 0 520 200" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
            <style>{`
              .kab { transition: fill .15s, stroke .15s; stroke-width: 1.2; }
              .kab-lbl { font-family: 'DM Sans', sans-serif; font-size: 8px; pointer-events: none; text-anchor: middle; dominant-baseline: central; }
            `}</style>

            {/* Pohuwato */}
            <g onClick={() => setSelectedKab(s => s === 'pohuwato' ? null : 'pohuwato')}>
              <path className={`kab ${kabColor('pohuwato')}`}
                d="M20,85 L22,55 L50,32 L88,28 L100,45 L105,75 L95,90 L70,95 L45,98 Z"/>
              <text className="kab-lbl" x="62" y="65" fill="currentColor" style={{color:'var(--text-secondary)'}}>Pohuwato</text>
            </g>

            {/* Boalemo */}
            <g onClick={() => setSelectedKab(s => s === 'bonebol' ? null : 'bonebol')}>
              <path className={`kab ${kabColor('bonebol')}`}
                d="M100,45 L105,75 L95,90 L128,98 L148,92 L158,72 L152,48 L130,35 Z"/>
              <text className="kab-lbl" x="130" y="70" fill="currentColor" style={{color:'var(--text-secondary)'}}>Boalemo</text>
            </g>

            {/* Kab. Gorontalo */}
            <g onClick={() => setSelectedKab(s => s === 'gorontalo' ? null : 'gorontalo')}>
              <path className={`kab ${kabColor('gorontalo')}`}
                d="M148,92 L158,72 L195,68 L215,78 L224,98 L212,116 L188,124 L162,112 Z"/>
              <text className="kab-lbl" x="190" y="96" fill="currentColor" style={{color:'var(--text-secondary)'}}>Kab. Gorontalo</text>
            </g>

            {/* Kota Gorontalo (kecil) */}
            <g onClick={() => setSelectedKab(s => s === 'gortalkota' ? null : 'gortalkota')}>
              <path className={`kab ${kabColor('gortalkota')}`}
                d="M215,78 L234,74 L244,88 L232,102 L224,98 Z"/>
              <text className="kab-lbl" x="230" y="89" fill="currentColor" style={{color:'var(--text-secondary)', fontSize:'7px'}}>Kota</text>
            </g>

            {/* Bone Bolango */}
            <g onClick={() => setSelectedKab(s => s === 'bone' ? null : 'bone')}>
              <path className={`kab ${kabColor('bone')}`}
                d="M224,98 L244,88 L285,86 L315,98 L325,118 L305,136 L272,140 L248,128 Z"/>
              <text className="kab-lbl" x="276" y="112" fill="currentColor" style={{color:'var(--text-secondary)'}}>Bone Bolango</text>
            </g>

            {/* Gorontalo Utara (memanjang di utara) */}
            <g onClick={() => setSelectedKab(s => s === 'gorut' ? null : 'gorut')}>
              <path className={`kab ${kabColor('gorut')}`}
                d="M88,28 L100,45 L130,35 L152,48 L195,68 L215,78 L234,74 L285,86 L315,78 L355,62 L375,42 L360,22 L320,14 L258,10 L195,12 L148,18 L115,24 Z"/>
              <text className="kab-lbl" x="224" y="44" fill="currentColor" style={{color:'var(--text-secondary)'}}>Gorontalo Utara</text>
            </g>

            {/* Laut labels */}
            <text style={{fontSize:'9px', fill:'var(--text-muted)', fontFamily:'DM Sans, sans-serif'}} x="50" y="155">Teluk Tomini</text>
            <text style={{fontSize:'9px', fill:'var(--text-muted)', fontFamily:'DM Sans, sans-serif'}} x="180" y="170">Laut Sulawesi (utara)</text>
          </svg>

          {/* Legend + selected info */}
          <div className="w-full lg:w-48 flex-shrink-0">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Kabupaten / Kota</p>
            <div className="space-y-1">
              {kabGorontalo.map(k => (
                <button
                  key={k.id}
                  onClick={() => setSelectedKab(s => s === k.id ? null : k.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors text-[11px] ${selectedKab === k.id ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'}`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedKab === k.id ? 'bg-indigo-400' : 'bg-[var(--border-lit)]'}`} />
                  <span className="truncate">{k.name}</span>
                  <span className="ml-auto text-[10px] text-[var(--text-muted)]">DPT: —</span>
                </button>
              ))}
            </div>
            {selKab && (
              <div className="mt-3 p-2.5 bg-indigo-500/8 border border-indigo-500/20 rounded-lg">
                <p className="text-xs font-medium text-indigo-300">{selKab.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">DPT: belum diinput</p>
                <p className="text-[10px] text-[var(--text-muted)]">TPS: belum diinput</p>
                <button onClick={() => onNavigate('m2')} className="mt-2 text-[10px] text-indigo-400 hover:underline">Input data →</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Tren elektabilitas</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Survei internal · belum ada data</p>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-1 rounded-md">Modul 5</span>
          </div>
          <div className="flex items-center justify-center h-24 border border-dashed border-[var(--border-lit)] rounded-lg">
            <div className="text-center">
              <BarChart2 size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-[11px] text-[var(--text-muted)]">Belum ada data elektabilitas</p>
              <p className="text-[10px] text-[var(--text-muted)]">Input survei pertama di Modul 5</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-px flex-1 border-t border-dashed border-amber-500/30" />
            <span className="text-[10px] text-amber-400">Target {candidate.targetSuara}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Alert aktif</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${criticalCount > 0 ? 'bg-red-500/15 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {criticalCount} kritis
            </span>
          </div>
          {typedAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-2 text-center">
              <span className="text-2xl">✓</span>
              <p className="text-[11px] text-[var(--text-muted)]">Tidak ada alert<br /><span className="text-[10px]">Lengkapi profil untuk mulai</span></p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {typedAlerts.map((a: any, idx: number) => {
                const Icon = a.level==='critical' ? AlertCircle : a.level==='warning' ? AlertTriangle : Info
                const cls = a.level==='critical' ? 'text-red-400 bg-red-500/10' : a.level==='warning' ? 'text-amber-400 bg-amber-500/10' : 'text-sky-400 bg-sky-500/10'
                return (
                  <div key={idx} className="flex gap-2 p-2 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer">
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${cls}`}><Icon size={11}/></div>
                    <div><p className="text-[11px] text-[var(--text-primary)] leading-tight">{a.msg}</p><p className="text-[10px] text-[var(--text-muted)]">{a.modul} · {a.time}</p></div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Budget + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Realisasi anggaran</h3>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-1 rounded-md">Modul 6</span>
          </div>
          <div className="flex items-center justify-center h-20 border border-dashed border-[var(--border-lit)] rounded-lg">
            <div className="text-center">
              <Wallet size={20} className="text-[var(--text-muted)] mx-auto mb-1.5" />
              <p className="text-[11px] text-[var(--text-muted)]">Budget belum dikonfigurasi</p>
              <button onClick={() => onNavigate('m6')} className="text-[10px] text-indigo-400 hover:underline mt-1">Setup di Modul 6 →</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Aktivitas hari ini</h3>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-1 rounded-md">Live</span>
          </div>
          <div className="flex items-center justify-center h-20">
            <p className="text-[11px] text-[var(--text-muted)] text-center">Belum ada aktivitas<br /><span className="text-[10px]">Daftarkan relawan pertama di Modul 1</span></p>
          </div>
        </div>
      </div>

      {/* All Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Semua modul</h3>
          <span className="text-[11px] text-[var(--text-muted)]">10 modul · klik untuk masuk</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {modulData.map((m, i) => {
            const Icon = iconMap[m.id] || LayoutDashboard
            const healthColor = m.health >= 90 ? 'bg-green-400' : m.health >= 70 ? 'bg-amber-400' : m.health > 0 ? 'bg-red-400' : 'bg-[var(--text-muted)]'
            return (
              <button
                key={m.id}
                onClick={() => onNavigate(m.id)}
                style={{ animationDelay:`${i*0.04}s` }}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3.5 text-left transition-all group animate-slide-up hover:border-[var(--border-lit)] hover:bg-[var(--bg-hover)] cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorBgMap[m.color] || colorBgMap.indigo} border`}>
                    <Icon size={14} className={colorTextMap[m.color] || colorTextMap.indigo} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {m.alerts > 0 && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">{m.alerts}</span>}
                    <div className={`w-1.5 h-1.5 rounded-full ${healthColor}`} />
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-[var(--text-primary)] leading-tight mb-1">
                  <span className="text-[var(--text-muted)] mr-1">{m.num}·</span>{m.name}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] leading-tight line-clamp-2">{m.stats}</p>
                <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] text-[var(--text-muted)]">Buka</span>
                  <ArrowUpRight size={9} className="text-[var(--text-muted)]" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
