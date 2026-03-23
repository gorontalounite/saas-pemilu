'use client'
import { useState, useEffect } from 'react'
import { modulData } from '@/lib/data'
import { createClient } from '@/lib/supabase'
import { useTenant } from '@/contexts/TenantContext'
import {
  AlertCircle, AlertTriangle,
  Users, Map, Megaphone, ClipboardCheck,
  BarChart2, Wallet, Radio, Heart, UserCircle,
  LayoutDashboard, ArrowUpRight, Upload, Loader2
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
const kabColors: Record<string,{fill:string;stroke:string}> = {
  gorut:      { fill:'#06b6d4', stroke:'#0891b2' },
  bone:       { fill:'#8b5cf6', stroke:'#7c3aed' },
  bonebol:    { fill:'#10b981', stroke:'#059669' },
  pohuwato:   { fill:'#3b82f6', stroke:'#2563eb' },
  gorontalo:  { fill:'#f59e0b', stroke:'#d97706' },
  gortalkota: { fill:'#ef4444', stroke:'#dc2626' },
}

interface KandidatData {
  nama_lengkap: string
  nama_pendek: string | null
  inisial: string | null
  partai: string | null
  nomor_urut: number | null
  dapil: string
  kontestasi: string
  target_suara: number
}

interface Props { onNavigate: (id: string) => void }

export default function DashboardOverview({ onNavigate }: Props) {
  const supabase = createClient()
  const { activeTenant, loading: tenantLoading } = useTenant()

  const [selectedKab, setSelectedKab] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [kandidat, setKandidat] = useState<KandidatData | null>(null)
  const [relawanCount, setRelawanCount] = useState(0)
  const [tpsCount, setTpsCount] = useState(0)
  const [tpsPerKab, setTpsPerKab] = useState<Record<string,number>>({})
  const [sisaKas, setSisaKas] = useState(0)
  const [krisisCount, setKrisisCount] = useState(0)

  useEffect(() => {
    if (tenantLoading) return
    if (!activeTenant?.kandidat_id) { setLoading(false); return }
    fetchAll(activeTenant.kandidat_id)
  }, [activeTenant, tenantLoading])

  async function fetchAll(kid: string) {
    setLoading(true)
    try {
      const [
        { data: kData },
        { count: rCount },
        { count: tCount },
        { data: tpsData },
        { data: txData },
        { count: krCount },
      ] = await Promise.all([
        supabase.from('kandidat').select('nama_lengkap,nama_pendek,inisial,partai,nomor_urut,dapil,kontestasi,target_suara').eq('id', kid).single(),
        supabase.from('relawan').select('*', { count:'exact', head:true }).eq('kandidat_id', kid).eq('status', 'aktif'),
        supabase.from('tps').select('*', { count:'exact', head:true }).eq('kandidat_id', kid),
        supabase.from('tps').select('kabkota').eq('kandidat_id', kid),
        supabase.from('transaksi').select('jenis,jumlah').eq('kandidat_id', kid),
        supabase.from('crisis_room').select('*', { count:'exact', head:true }).eq('kandidat_id', kid).eq('status', 'open'),
      ])

      if (kData) setKandidat(kData)
      setRelawanCount(rCount || 0)
      setTpsCount(tCount || 0)
      setKrisisCount(krCount || 0)

      // TPS per kabupaten
      const perKab: Record<string,number> = {}
      tpsData?.forEach((t: any) => { perKab[t.kabkota] = (perKab[t.kabkota] || 0) + 1 })
      setTpsPerKab(perKab)

      // Saldo kas
      let masuk = 0, keluar = 0
      txData?.forEach((t: any) => {
        if (t.jenis === 'pemasukan') masuk += Number(t.jumlah)
        else keluar += Number(t.jumlah)
      })
      setSisaKas(masuk - keluar)

    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const selKab = kabGorontalo.find(k => k.id === selectedKab)
  const kf = (id: string) => kabColors[id]?.fill || '#374151'
  const ks = (id: string) => selectedKab === id ? '#ffffff' : (kabColors[id]?.stroke || '#1f2937')
  const ko = (id: string) => selectedKab === null ? 0.7 : selectedKab === id ? 1 : 0.25
  const kw = (id: string) => selectedKab === id ? 2 : 1

  const statCards = [
    { label:'Total Relawan',  value: relawanCount > 0 ? relawanCount.toLocaleString('id-ID') : '0',  delta: relawanCount > 0 ? `${relawanCount} relawan aktif` : 'Belum ada relawan',  color:'indigo' },
    { label:'TPS Terpetakan', value: tpsCount > 0 ? tpsCount.toLocaleString('id-ID') : '0',          delta: tpsCount > 0 ? 'dari ± 1.800 TPS' : 'Belum ada TPS',                       color:'teal'   },
    { label:'Saldo Kas',      value: sisaKas > 0 ? `Rp ${(sisaKas/1_000_000).toFixed(1)}jt` : 'Rp —', delta: sisaKas > 0 ? 'Dari total transaksi' : 'Budget belum diset',             color:'amber'  },
    { label:'Elektabilitas',  value: '—%',                                                            delta: 'Belum ada survei',                                                        color:'green'  },
  ]

  if (loading || tenantLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-indigo-400" />
        <span className="ml-3 text-sm text-[var(--text-muted)]">Memuat dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Hero */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 relative overflow-hidden animate-slide-up">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl font-bold text-indigo-300 flex-shrink-0">
            {kandidat?.inisial || 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-base font-semibold text-[var(--text-primary)]">
                {kandidat?.nama_lengkap || 'ADMIN'}
              </h1>
              {kandidat?.nomor_urut && (
                <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 px-2 py-0.5 rounded-full">
                  No. {kandidat.nomor_urut}
                </span>
              )}
              {kandidat?.kontestasi && (
                <span className="text-[10px] bg-purple-500/15 border border-purple-500/25 text-purple-300 px-2 py-0.5 rounded-full">
                  {kandidat.kontestasi.replace(/_/g, ' ').toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {kandidat ? `Dapil ${kandidat.dapil}` : 'Login dan lengkapi profil untuk memulai'}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {kandidat?.partai || 'Partai belum diisi'}
            </p>
          </div>
          <div className="sm:text-right">
            {krisisCount > 0 ? (
              <div className="flex items-center gap-1.5 sm:justify-end">
                <AlertCircle size={14} className="text-red-400" />
                <span className="text-sm font-semibold text-red-400">{krisisCount} isu aktif</span>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-[var(--text-muted)]">—%</p>
                <p className="text-[10px] text-[var(--text-muted)]">elektabilitas saat ini</p>
              </>
            )}
            {!kandidat && (
              <button onClick={() => onNavigate('m9')}
                className="mt-2 text-[10px] bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors">
                Setup Profil →
              </button>
            )}
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
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">6 Kabupaten/Kota · {tpsCount} TPS terpetakan</p>
          </div>
          <button onClick={() => onNavigate('m2')}
            className="flex items-center gap-1.5 text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors">
            <Upload size={11} /> Input Data
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <svg viewBox="0 0 520 200" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
            <style>{`.kab{transition:fill .15s,stroke .15s;stroke-width:1.2}.kab-lbl{font-family:'DM Sans',sans-serif;font-size:8px;pointer-events:none;text-anchor:middle;dominant-baseline:central}`}</style>
            <g onClick={() => setSelectedKab(s => s==='pohuwato'?null:'pohuwato')}>
              <path className="kab" d="M20,85 L22,55 L50,32 L88,28 L100,45 L105,75 L95,90 L70,95 L45,98 Z" style={{fill:kf('pohuwato'),opacity:ko('pohuwato'),stroke:ks('pohuwato'),strokeWidth:kw('pohuwato')}}/>
              <text className="kab-lbl" x="62" y="65" fill="var(--text-secondary)">Pohuwato</text>
            </g>
            <g onClick={() => setSelectedKab(s => s==='bonebol'?null:'bonebol')}>
              <path className="kab" d="M100,45 L105,75 L95,90 L128,98 L148,92 L158,72 L152,48 L130,35 Z" style={{fill:kf('bonebol'),opacity:ko('bonebol'),stroke:ks('bonebol'),strokeWidth:kw('bonebol')}}/>
              <text className="kab-lbl" x="130" y="70" fill="var(--text-secondary)">Boalemo</text>
            </g>
            <g onClick={() => setSelectedKab(s => s==='gorontalo'?null:'gorontalo')}>
              <path className="kab" d="M148,92 L158,72 L195,68 L215,78 L224,98 L212,116 L188,124 L162,112 Z" style={{fill:kf('gorontalo'),opacity:ko('gorontalo'),stroke:ks('gorontalo'),strokeWidth:kw('gorontalo')}}/>
              <text className="kab-lbl" x="190" y="96" fill="var(--text-secondary)">Kab. Gorontalo</text>
            </g>
            <g onClick={() => setSelectedKab(s => s==='gortalkota'?null:'gortalkota')}>
              <path className="kab" d="M215,78 L234,74 L244,88 L232,102 L224,98 Z" style={{fill:kf('gortalkota'),opacity:ko('gortalkota'),stroke:ks('gortalkota'),strokeWidth:kw('gortalkota')}}/>
              <text className="kab-lbl" x="230" y="89" fill="var(--text-secondary)" style={{fontSize:'7px'}}>Kota</text>
            </g>
            <g onClick={() => setSelectedKab(s => s==='bone'?null:'bone')}>
              <path className="kab" d="M224,98 L244,88 L285,86 L315,98 L325,118 L305,136 L272,140 L248,128 Z" style={{fill:kf('bone'),opacity:ko('bone'),stroke:ks('bone'),strokeWidth:kw('bone')}}/>
              <text className="kab-lbl" x="276" y="112" fill="var(--text-secondary)">Bone Bolango</text>
            </g>
            <g onClick={() => setSelectedKab(s => s==='gorut'?null:'gorut')}>
              <path className="kab" d="M88,28 L100,45 L130,35 L152,48 L195,68 L215,78 L234,74 L285,86 L315,78 L355,62 L375,42 L360,22 L320,14 L258,10 L195,12 L148,18 L115,24 Z" style={{fill:kf('gorut'),opacity:ko('gorut'),stroke:ks('gorut'),strokeWidth:kw('gorut')}}/>
              <text className="kab-lbl" x="224" y="44" fill="var(--text-secondary)">Gorontalo Utara</text>
            </g>
            <text style={{fontSize:'9px',fill:'var(--text-muted)',fontFamily:'DM Sans,sans-serif'}} x="50" y="155">Teluk Tomini</text>
            <text style={{fontSize:'9px',fill:'var(--text-muted)',fontFamily:'DM Sans,sans-serif'}} x="180" y="170">Laut Sulawesi (utara)</text>
          </svg>
          <div className="w-full lg:w-48 flex-shrink-0">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Kabupaten / Kota</p>
            <div className="space-y-1">
              {kabGorontalo.map(k => (
                <button key={k.id} onClick={() => setSelectedKab(s => s===k.id?null:k.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors text-[11px] border ${selectedKab===k.id ? 'bg-[var(--bg-hover)] border-[var(--border-lit)]' : 'hover:bg-[var(--bg-hover)] border-transparent'} text-[var(--text-secondary)]`}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',flexShrink:0,backgroundColor:kabColors[k.id]?.fill||'#374151',opacity:selectedKab===null||selectedKab===k.id?1:0.3}} />
                  <span className="truncate flex-1">{k.name}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{tpsPerKab[k.name] || 0} TPS</span>
                </button>
              ))}
            </div>
            {selKab && (
              <div className="mt-3 p-2.5 bg-[var(--bg-hover)] border border-[var(--border-lit)] rounded-lg">
                <p className="text-xs font-medium text-[var(--text-primary)]">{selKab.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">TPS: {tpsPerKab[selKab.name] || 0}</p>
                <button onClick={() => onNavigate('m2')} className="mt-1.5 text-[10px] text-indigo-400 hover:underline">Lihat detail →</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart + Krisis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
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
            <span className="text-[10px] text-amber-400">
              Target {kandidat?.target_suara?.toLocaleString('id-ID') || '30.000'} suara
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Isu & Krisis</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${krisisCount > 0 ? 'bg-red-500/15 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {krisisCount} aktif
            </span>
          </div>
          {krisisCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-2 text-center">
              <span className="text-2xl">✓</span>
              <p className="text-[11px] text-[var(--text-muted)]">Tidak ada isu aktif</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 gap-2 text-center">
              <AlertTriangle size={24} className="text-amber-400" />
              <p className="text-[11px] text-amber-400">{krisisCount} isu perlu ditangani</p>
              <button onClick={() => onNavigate('m7')} className="text-[10px] text-indigo-400 hover:underline">Buka War Room →</button>
            </div>
          )}
        </div>
      </div>

      {/* Kas + Tim */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Saldo Kas Kampanye</h3>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-1 rounded-md">Modul 6</span>
          </div>
          {sisaKas > 0 ? (
            <div className="text-center py-4">
              <p className="text-2xl font-bold text-amber-400">Rp {(sisaKas/1_000_000).toFixed(1)}jt</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Saldo tersisa</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 border border-dashed border-[var(--border-lit)] rounded-lg">
              <div className="text-center">
                <Wallet size={20} className="text-[var(--text-muted)] mx-auto mb-1.5" />
                <p className="text-[11px] text-[var(--text-muted)]">Budget belum dikonfigurasi</p>
                <button onClick={() => onNavigate('m6')} className="text-[10px] text-indigo-400 hover:underline mt-1">Setup di Modul 6 →</button>
              </div>
            </div>
          )}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Ringkasan Tim</h3>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-1 rounded-md">Live</span>
          </div>
          {relawanCount > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--bg-hover)] rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-indigo-400">{relawanCount.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Relawan aktif</p>
              </div>
              <div className="bg-[var(--bg-hover)] rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-teal-400">{tpsCount.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">TPS terpetakan</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20">
              <div className="text-center">
                <Users size={20} className="text-[var(--text-muted)] mx-auto mb-1.5" />
                <p className="text-[11px] text-[var(--text-muted)]">Belum ada relawan</p>
                <button onClick={() => onNavigate('m1')} className="text-[10px] text-indigo-400 hover:underline mt-1">Daftarkan relawan →</button>
              </div>
            </div>
          )}
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
              <button key={m.id} onClick={() => onNavigate(m.id)}
                style={{ animationDelay:`${i*0.04}s` }}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3.5 text-left transition-all group animate-slide-up hover:border-[var(--border-lit)] hover:bg-[var(--bg-hover)] cursor-pointer">
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
