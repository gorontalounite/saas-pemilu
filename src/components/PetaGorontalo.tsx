'use client'
import { useState } from 'react'
import { X, Map, ChevronRight } from 'lucide-react'

const PARTAI_COLOR: Record<string, { bg: string; text: string; border: string; hex: string }> = {
  'Golkar':   { bg:'bg-yellow-500/15', text:'text-yellow-500', border:'border-yellow-500/30', hex:'#EAB308' },
  'NasDem':   { bg:'bg-blue-500/15',   text:'text-blue-400',   border:'border-blue-500/30',   hex:'#3B82F6' },
  'PDIP':     { bg:'bg-red-500/15',    text:'text-red-400',    border:'border-red-500/30',    hex:'#EF4444' },
  'Gerindra': { bg:'bg-red-700/15',    text:'text-red-600',    border:'border-red-700/30',    hex:'#DC2626' },
  'PPP':      { bg:'bg-green-500/15',  text:'text-green-400',  border:'border-green-500/30',  hex:'#16A34A' },
  'PKB':      { bg:'bg-green-600/15',  text:'text-green-500',  border:'border-green-600/30',  hex:'#15803D' },
  'PKS':      { bg:'bg-orange-500/15', text:'text-orange-400', border:'border-orange-500/30', hex:'#F97316' },
  'Demokrat': { bg:'bg-sky-500/15',    text:'text-sky-400',    border:'border-sky-500/30',    hex:'#0EA5E9' },
  'PAN':      { bg:'bg-amber-500/15',  text:'text-amber-400',  border:'border-amber-500/30',  hex:'#F59E0B' },
  'Hanura':   { bg:'bg-orange-400/15', text:'text-orange-300', border:'border-orange-400/30', hex:'#FB923C' },
}

interface KabInfo {
  id: string
  name: string
  kecamatan: number
  desa_kel: number
  tps: number
  dpt_l: number
  dpt_p: number
  dpt: number
  // DPR RI 2019
  dpr_top3: { partai: string; suara: number }[]
  // DPRD Provinsi
  dprd_prov_dapil: string
  dprd_prov_kursi: number
  dprd_prov_top3: { partai: string; kursi: number }[]
  // DPRD Kab/Kota
  dprd_kab_pemenang: string
  dprd_kab_kursi_total: number
  dprd_kab_top3: { partai: string; kursi: number }[]
  dprd_kab_dapil: number
  // Maps
  embed: string
}

const DATA: KabInfo[] = [
  {
    id:'gorontalo', name:'Kab. Gorontalo',
    kecamatan:19, desa_kel:205, tps:1205, dpt_l:149072, dpt_p:151178, dpt:300250,
    dpr_top3:[{partai:'Golkar',suara:67432},{partai:'NasDem',suara:53626},{partai:'PPP',suara:29477}],
    dprd_prov_dapil:'Dapil 2 & 3', dprd_prov_kursi:17,
    dprd_prov_top3:[{partai:'Golkar',kursi:5},{partai:'NasDem',kursi:4},{partai:'PPP',kursi:3}],
    dprd_kab_pemenang:'Golkar', dprd_kab_kursi_total:40, dprd_kab_dapil:6,
    dprd_kab_top3:[{partai:'Golkar',kursi:8},{partai:'NasDem',kursi:6},{partai:'PPP',kursi:6}],
    embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510658.6757165025!2d122.33230858517621!3d0.6995941303976962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32793df3e7b43eef%3A0x3030bfbcaf76ef0!2sKabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143277222!5m2!1sid!2sid',
  },
  {
    id:'gorut', name:'Gorontalo Utara',
    kecamatan:11, desa_kel:123, tps:412, dpt_l:46233, dpt_p:46031, dpt:92264,
    dpr_top3:[{partai:'Golkar',suara:24798},{partai:'NasDem',suara:15020},{partai:'Gerindra',suara:8822}],
    dprd_prov_dapil:'Dapil 5', dprd_prov_kursi:5,
    dprd_prov_top3:[{partai:'NasDem',kursi:2},{partai:'Golkar',kursi:2},{partai:'Hanura',kursi:1}],
    dprd_kab_pemenang:'NasDem', dprd_kab_kursi_total:25, dprd_kab_dapil:6,
    dprd_kab_top3:[{partai:'NasDem',kursi:7},{partai:'PDIP',kursi:6},{partai:'Hanura',kursi:5}],
    embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1021276.7257009968!2d121.96759887268229!3d0.8663637604616092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327968d2ae4b4e3b%3A0x3030bfbcaf76f00!2sKabupaten%20Gorontalo%20Utara%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143293750!5m2!1sid!2sid',
  },
  {
    id:'kota', name:'Kota Gorontalo',
    kecamatan:9, desa_kel:50, tps:550, dpt_l:71226, dpt_p:74835, dpt:146061,
    dpr_top3:[{partai:'NasDem',suara:33507},{partai:'Golkar',suara:25195},{partai:'Gerindra',suara:20200}],
    dprd_prov_dapil:'Dapil 1', dprd_prov_kursi:8,
    dprd_prov_top3:[{partai:'Golkar',kursi:3},{partai:'NasDem',kursi:2},{partai:'PPP',kursi:2}],
    dprd_kab_pemenang:'Golkar', dprd_kab_kursi_total:30, dprd_kab_dapil:4,
    dprd_kab_top3:[{partai:'Golkar',kursi:7},{partai:'PAN',kursi:5},{partai:'NasDem',kursi:4}],
    embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63834.162559348326!2d122.99873489216493!3d0.5490077866268024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32792b4799e5e75d%3A0x6dcc4d0923155967!2sGorontalo%2C%20Kabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143309383!5m2!1sid!2sid',
  },
  {
    id:'bone', name:'Bone Bolango',
    kecamatan:18, desa_kel:165, tps:509, dpt_l:60856, dpt_p:61917, dpt:122773,
    dpr_top3:[{partai:'NasDem',suara:34487},{partai:'Golkar',suara:20216},{partai:'Gerindra',suara:13248}],
    dprd_prov_dapil:'Dapil 6', dprd_prov_kursi:8,
    dprd_prov_top3:[{partai:'NasDem',kursi:3},{partai:'Golkar',kursi:2},{partai:'PKS',kursi:1}],
    dprd_kab_pemenang:'NasDem', dprd_kab_kursi_total:25, dprd_kab_dapil:4,
    dprd_kab_top3:[{partai:'NasDem',kursi:6},{partai:'Golkar',kursi:4},{partai:'PPP',kursi:4}],
    embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510672.62259982125!2d122.67114624166054!3d0.5568882941649742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327ed976fe70d79f%3A0x3030bfbcaf76ee0!2sKabupaten%20Bone%20Bolango%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143328712!5m2!1sid!2sid',
  },
  {
    id:'bonebol', name:'Boalemo',
    kecamatan:7, desa_kel:82, tps:424, dpt_l:54959, dpt_p:53433, dpt:108392,
    dpr_top3:[{partai:'Golkar',suara:24630},{partai:'NasDem',suara:16722},{partai:'PDIP',suara:10593}],
    dprd_prov_dapil:'Dapil 4', dprd_prov_kursi:6,
    dprd_prov_top3:[{partai:'Golkar',kursi:2},{partai:'NasDem',kursi:2},{partai:'PPP',kursi:1}],
    dprd_kab_pemenang:'PDIP', dprd_kab_kursi_total:25, dprd_kab_dapil:3,
    dprd_kab_top3:[{partai:'PDIP',kursi:5},{partai:'Golkar',kursi:4},{partai:'Gerindra',kursi:4}],
    embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.1290144366!2d122.03778693685258!3d0.6671091748500295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3279a7aeaeda4ee1%3A0x3030bfbcaf76ed0!2sKabupaten%20Boalemo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143405459!5m2!1sid!2sid',
  },
  {
    id:'pohuwato', name:'Pohuwato',
    kecamatan:13, desa_kel:104, tps:439, dpt_l:56336, dpt_p:55130, dpt:111466,
    dpr_top3:[{partai:'Golkar',suara:29396},{partai:'NasDem',suara:11181},{partai:'Gerindra',suara:11147}],
    dprd_prov_dapil:'Dapil 4', dprd_prov_kursi:6,
    dprd_prov_top3:[{partai:'NasDem',kursi:2},{partai:'Golkar',kursi:2},{partai:'PKB',kursi:1}],
    dprd_kab_pemenang:'Golkar', dprd_kab_kursi_total:25, dprd_kab_dapil:5,
    dprd_kab_top3:[{partai:'Golkar',kursi:7},{partai:'Gerindra',kursi:6},{partai:'PKB',kursi:3}],
    embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.183131596!2d121.647892!3d0.6665875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3277628b1bb51ce5%3A0x3030bfbcaf76f10!2sKabupaten%20Pohuwato%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143393235!5m2!1sid!2sid',
  },
]

const TOTAL = { tps: 3539, dpt: 881206 }

type DetailTab = 'wilayah' | 'dpr' | 'dprd_prov' | 'dprd_kab'

interface Props { onNavigate?: (id: string) => void }

export default function PetaGorontalo({ onNavigate }: Props) {
  const [selected, setSelected] = useState<KabInfo | null>(null)
  const [tab, setTab] = useState<DetailTab>('wilayah')
  const [showMap, setShowMap] = useState(false)

  function pilih(kab: KabInfo) {
    if (selected?.id === kab.id) { setSelected(null); setShowMap(false); return }
    setSelected(kab)
    setTab('wilayah')
    setShowMap(false)
  }

  return (
    <div>
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-[var(--text-primary)]">Peta Provinsi Gorontalo</p>
          <p className="text-[10px] text-[var(--text-muted)]">6 Kabupaten/Kota · {TOTAL.tps.toLocaleString('id-ID')} TPS · {TOTAL.dpt.toLocaleString('id-ID')} DPT</p>
        </div>
        {onNavigate && (
          <button onClick={() => onNavigate('m10')}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            Detail <ChevronRight size={10} />
          </button>
        )}
      </div>

      {/* 6 card — grid 3x2, semua sama besar */}
      <div className="grid grid-cols-3 gap-2">
        {DATA.map(kab => {
          const p = PARTAI_COLOR[kab.dprd_kab_pemenang] || PARTAI_COLOR['Golkar']
          const isActive = selected?.id === kab.id
          const isDim = selected && !isActive
          return (
            <button key={kab.id} onClick={() => pilih(kab)}
              className={`rounded-xl border p-3 text-left transition-all ${isActive ? `${p.bg} ${p.border} scale-[1.02] shadow-sm` : isDim ? `${p.bg} ${p.border} opacity-35` : `${p.bg} ${p.border} hover:scale-[1.01] hover:shadow-sm`}`}>
              <p className={`text-[11px] font-bold leading-tight mb-1.5 ${p.text}`}>{kab.name}</p>
              <div className="space-y-0.5">
                <p className="text-[10px] text-[var(--text-muted)]">{kab.tps.toLocaleString('id-ID')} TPS</p>
                <p className="text-[10px] text-[var(--text-muted)]">{kab.dpt.toLocaleString('id-ID')} DPT</p>
              </div>
              <div className="mt-2 pt-2 border-t flex items-center gap-1.5" style={{ borderColor: 'var(--border)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.hex }} />
                <span className={`text-[9px] font-semibold ${p.text}`}>{kab.dprd_kab_pemenang}</span>
                <span className="text-[9px] text-[var(--text-muted)] ml-auto">{kab.dprd_kab_top3[0].kursi} kursi</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {selected && (() => {
        const p = PARTAI_COLOR[selected.dprd_kab_pemenang] || PARTAI_COLOR['Golkar']
        return (
          <div className={`mt-3 rounded-xl border overflow-hidden ${p.border}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 ${p.bg}`}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.hex }} />
                <span className={`text-sm font-bold ${p.text}`}>{selected.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowMap(s => !s)}
                  className="text-[10px] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-2.5 py-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                  {showMap ? 'Tutup Peta' : '🗺 Lihat Peta'}
                </button>
                <button onClick={() => { setSelected(null); setShowMap(false) }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] p-1 transition-colors">
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-[var(--border)] bg-[var(--bg-hover)] px-1">
              {([
                { id:'wilayah',   label:'Data Wilayah' },
                { id:'dpr',       label:'DPR RI 2019' },
                { id:'dprd_prov', label:'DPRD Provinsi' },
                { id:'dprd_kab',  label:'DPRD Kab/Kota' },
              ] as { id: DetailTab; label: string }[]).map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-3 py-2.5 text-[11px] font-medium transition-all border-b-2 -mb-px ${tab === t.id ? `${p.text} border-current` : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-4">

              {/* Tab 1: Data Wilayah */}
              {tab === 'wilayah' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label:'Kecamatan',    value: selected.kecamatan },
                      { label:'Desa / Kel',   value: selected.desa_kel },
                      { label:'Jumlah TPS',   value: selected.tps.toLocaleString('id-ID') },
                      { label:'% TPS Prov',   value: (selected.tps/TOTAL.tps*100).toFixed(1)+'%' },
                    ].map(s => (
                      <div key={s.label} className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-xl p-3 text-center">
                        <p className="text-base font-bold text-[var(--text-primary)]">{s.value}</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-semibold text-[var(--text-primary)]">DPT Total</p>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{selected.dpt.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-center bg-[var(--bg-card)] rounded-lg p-2">
                        <p className="text-xs font-bold text-blue-400">{selected.dpt_l.toLocaleString('id-ID')}</p>
                        <p className="text-[9px] text-[var(--text-muted)]">Laki-laki ({(selected.dpt_l/selected.dpt*100).toFixed(1)}%)</p>
                      </div>
                      <div className="text-center bg-[var(--bg-card)] rounded-lg p-2">
                        <p className="text-xs font-bold text-pink-400">{selected.dpt_p.toLocaleString('id-ID')}</p>
                        <p className="text-[9px] text-[var(--text-muted)]">Perempuan ({(selected.dpt_p/selected.dpt*100).toFixed(1)}%)</p>
                      </div>
                    </div>
                    <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden flex">
                      <div className="h-full bg-blue-400 transition-all" style={{ width:`${selected.dpt_l/selected.dpt*100}%` }} />
                      <div className="h-full bg-pink-400 flex-1" />
                    </div>
                    <p className="text-[9px] text-[var(--text-muted)] mt-1">{(selected.dpt/TOTAL.dpt*100).toFixed(1)}% dari total DPT Provinsi Gorontalo</p>
                  </div>
                </div>
              )}

              {/* Tab 2: DPR RI 2019 */}
              {tab === 'dpr' && (
                <div className="space-y-3">
                  <p className="text-[10px] text-[var(--text-muted)]">Perolehan suara DPR RI — Pemilu 2019 · Dapil Gorontalo (3 kursi)</p>
                  {(() => {
                    const totalSuara = selected.dpr_top3.reduce((a,b) => a+b.suara, 0)
                    const max = selected.dpr_top3[0].suara
                    return (
                      <div className="space-y-3">
                        {selected.dpr_top3.map((item, i) => {
                          const pc = PARTAI_COLOR[item.partai]
                          const pct = (item.suara/totalSuara*100).toFixed(1)
                          return (
                            <div key={item.partai}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-bold text-[var(--text-muted)] w-3">{i+1}</span>
                                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pc?.hex || '#6366f1' }} />
                                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">{item.partai}</span>
                                  {i === 0 && <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full">Pemenang</span>}
                                </div>
                                <span className="text-[11px] font-bold text-[var(--text-primary)]">{pct}%</span>
                              </div>
                              <div className="h-2.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all"
                                  style={{ width:`${item.suara/max*100}%`, backgroundColor: pc?.hex || '#6366f1', opacity:0.85 }} />
                              </div>
                              <p className="text-[9px] text-[var(--text-muted)] mt-0.5 text-right">{item.suara.toLocaleString('id-ID')} suara</p>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Tab 3: DPRD Provinsi */}
              {tab === 'dprd_prov' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-xl p-3 text-center">
                      <p className={`text-base font-bold ${p.text}`}>{selected.dprd_prov_dapil}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Nama Dapil DPRD Prov</p>
                    </div>
                    <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-xl p-3 text-center">
                      <p className={`text-base font-bold ${p.text}`}>{selected.dprd_prov_kursi} kursi</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Alokasi Kursi DPRD Prov</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">3 Besar Kursi DPRD Provinsi</p>
                    <div className="space-y-2">
                      {selected.dprd_prov_top3.map((item, i) => {
                        const pc = PARTAI_COLOR[item.partai]
                        return (
                          <div key={item.partai} className="flex items-center gap-3 p-2.5 bg-[var(--bg-hover)] border border-[var(--border)] rounded-xl">
                            <span className="text-[10px] font-bold text-[var(--text-muted)] w-4">{i+1}</span>
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pc?.hex || '#6366f1' }} />
                            <span className="text-[11px] font-semibold text-[var(--text-primary)] flex-1">{item.partai}</span>
                            {i === 0 && <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full">Terbanyak</span>}
                            <span className={`text-[11px] font-bold ${pc?.text || 'text-indigo-400'}`}>{item.kursi} kursi</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: DPRD Kab/Kota */}
              {tab === 'dprd_kab' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`${p.bg} border ${p.border} rounded-xl p-3 text-center`}>
                      <p className={`text-base font-bold ${p.text}`}>{selected.dprd_kab_pemenang}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Partai Pemenang</p>
                    </div>
                    <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-xl p-3 text-center">
                      <p className="text-base font-bold text-[var(--text-primary)]">{selected.dprd_kab_kursi_total}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Total Kursi</p>
                    </div>
                    <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-xl p-3 text-center">
                      <p className="text-base font-bold text-[var(--text-primary)]">{selected.dprd_kab_dapil}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Daerah Pemilihan</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">3 Besar Kursi DPRD Kab/Kota — Pemilu 2024</p>
                    <div className="space-y-2">
                      {selected.dprd_kab_top3.map((item, i) => {
                        const pc = PARTAI_COLOR[item.partai]
                        const pct = Math.round(item.kursi/selected.dprd_kab_kursi_total*100)
                        return (
                          <div key={item.partai}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-bold text-[var(--text-muted)] w-3">{i+1}</span>
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pc?.hex || '#6366f1' }} />
                              <span className="text-[11px] font-semibold text-[var(--text-primary)] flex-1">{item.partai}</span>
                              {i === 0 && <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full">Pemenang</span>}
                              <span className={`text-[11px] font-bold ${pc?.text || 'text-indigo-400'}`}>{item.kursi} kursi</span>
                              <span className="text-[10px] text-[var(--text-muted)]">{pct}%</span>
                            </div>
                            <div className="h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden ml-5">
                              <div className="h-full rounded-full transition-all"
                                style={{ width:`${pct}%`, backgroundColor: pc?.hex || '#6366f1', opacity: 0.8 }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Google Maps */}
            {showMap && (
              <div className="border-t border-[var(--border)]">
                <iframe src={selected.embed} width="100%" height="260"
                  style={{ border:0, display:'block' }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
