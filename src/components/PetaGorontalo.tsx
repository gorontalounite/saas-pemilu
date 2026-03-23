'use client'
import { useState } from 'react'
import { X, Map, Users, Building2, TrendingUp } from 'lucide-react'

interface KabInfo {
  id: string
  name: string
  kecamatan: number
  desa_kel: number
  tps: number
  dpt_l: number
  dpt_p: number
  dpt: number
  top3: { partai: string; suara: number; pct: number }[]
  pemenang: string
  embed: string
  dapil_dprd_prov: string
  warna: string
  warnaStroke: string
}

const DATA: KabInfo[] = [
  {
    id: 'gorontalo', name: 'Kab. Gorontalo',
    kecamatan: 19, desa_kel: 205, tps: 1205, dpt_l: 149072, dpt_p: 151178, dpt: 300250,
    top3: [
      { partai:'Golkar',  suara:67432, pct:32 },
      { partai:'NasDem',  suara:53626, pct:25 },
      { partai:'PPP',     suara:29477, pct:14 },
    ],
    pemenang: 'Golkar',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510658.6757165025!2d122.33230858517621!3d0.6995941303976962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32793df3e7b43eef%3A0x3030bfbcaf76ef0!2sKabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143277222!5m2!1sid!2sid',
    dapil_dprd_prov: 'Dapil Gorontalo 2 & 3',
    warna: '#f59e0b', warnaStroke: '#d97706',
  },
  {
    id: 'gorut', name: 'Gorontalo Utara',
    kecamatan: 11, desa_kel: 123, tps: 412, dpt_l: 46233, dpt_p: 46031, dpt: 92264,
    top3: [
      { partai:'Golkar',  suara:24798, pct:35 },
      { partai:'NasDem',  suara:15020, pct:21 },
      { partai:'Gerindra',suara:8822,  pct:12 },
    ],
    pemenang: 'Golkar',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1021276.7257009968!2d121.96759887268229!3d0.8663637604616092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327968d2ae4b4e3b%3A0x3030bfbcaf76f00!2sKabupaten%20Gorontalo%20Utara%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143293750!5m2!1sid!2sid',
    dapil_dprd_prov: 'Dapil Gorontalo 5',
    warna: '#06b6d4', warnaStroke: '#0891b2',
  },
  {
    id: 'kota', name: 'Kota Gorontalo',
    kecamatan: 9, desa_kel: 50, tps: 550, dpt_l: 71226, dpt_p: 74835, dpt: 146061,
    top3: [
      { partai:'NasDem',  suara:33507, pct:30 },
      { partai:'Golkar',  suara:25195, pct:23 },
      { partai:'Gerindra',suara:20200, pct:18 },
    ],
    pemenang: 'NasDem',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63834.162559348326!2d122.99873489216493!3d0.5490077866268024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32792b4799e5e75d%3A0x6dcc4d0923155967!2sGorontalo%2C%20Kabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143309383!5m2!1sid!2sid',
    dapil_dprd_prov: 'Dapil Gorontalo 1',
    warna: '#ef4444', warnaStroke: '#dc2626',
  },
  {
    id: 'bone', name: 'Bone Bolango',
    kecamatan: 18, desa_kel: 165, tps: 509, dpt_l: 60856, dpt_p: 61917, dpt: 122773,
    top3: [
      { partai:'NasDem',  suara:34487, pct:38 },
      { partai:'Golkar',  suara:20216, pct:22 },
      { partai:'Gerindra',suara:13248, pct:15 },
    ],
    pemenang: 'NasDem',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510672.62259982125!2d122.67114624166054!3d0.5568882941649742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327ed976fe70d79f%3A0x3030bfbcaf76ee0!2sKabupaten%20Bone%20Bolango%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143328712!5m2!1sid!2sid',
    dapil_dprd_prov: 'Dapil Gorontalo 6',
    warna: '#8b5cf6', warnaStroke: '#7c3aed',
  },
  {
    id: 'bonebol', name: 'Boalemo',
    kecamatan: 7, desa_kel: 82, tps: 424, dpt_l: 54959, dpt_p: 53433, dpt: 108392,
    top3: [
      { partai:'Golkar',  suara:24630, pct:29 },
      { partai:'NasDem',  suara:16722, pct:20 },
      { partai:'PDIP',    suara:10593, pct:12 },
    ],
    pemenang: 'Golkar',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.1290144366!2d122.03778693685258!3d0.6671091748500295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3279a7aeaeda4ee1%3A0x3030bfbcaf76ed0!2sKabupaten%20Boalemo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143405459!5m2!1sid!2sid',
    dapil_dprd_prov: 'Dapil Gorontalo 4',
    warna: '#10b981', warnaStroke: '#059669',
  },
  {
    id: 'pohuwato', name: 'Pohuwato',
    kecamatan: 13, desa_kel: 104, tps: 439, dpt_l: 56336, dpt_p: 55130, dpt: 111466,
    top3: [
      { partai:'Golkar',  suara:29396, pct:36 },
      { partai:'NasDem',  suara:11181, pct:14 },
      { partai:'Gerindra',suara:11147, pct:14 },
    ],
    pemenang: 'Golkar',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.183131596!2d121.647892!3d0.6665875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3277628b1bb51ce5%3A0x3030bfbcaf76f10!2sKabupaten%20Pohuwato%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143393235!5m2!1sid!2sid',
    dapil_dprd_prov: 'Dapil Gorontalo 4',
    warna: '#3b82f6', warnaStroke: '#2563eb',
  },
]

const PARTAI_COLOR: Record<string,string> = {
  'Golkar':'#EAB308','NasDem':'#3B82F6','Gerindra':'#DC2626',
  'PDIP':'#EF4444','PPP':'#16A34A','PKB':'#22C55E',
}

interface Props {
  onNavigate?: (id: string) => void
}

export default function PetaGorontalo({ onNavigate }: Props) {
  const [selected, setSelected] = useState<KabInfo | null>(null)
  const [showMap, setShowMap] = useState(false)

  function pilih(kab: KabInfo) {
    setSelected(s => s?.id === kab.id ? null : kab)
    setShowMap(false)
  }

  const total = { tps: 3539, dpt: 881206 }

  return (
    <div>
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-[var(--text-primary)]">Peta Provinsi Gorontalo</p>
          <p className="text-[10px] text-[var(--text-muted)]">6 Kabupaten/Kota · {total.tps.toLocaleString('id-ID')} TPS · {total.dpt.toLocaleString('id-ID')} DPT</p>
        </div>
        {onNavigate && (
          <button onClick={() => onNavigate('m10')}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <Map size={10} /> Detail →
          </button>
        )}
      </div>

      {/* Layout peta — mencerminkan posisi geografis */}
      <div className="space-y-1.5">
        {/* Baris 1: Gorontalo Utara (memanjang di atas) */}
        <div>
          <KabCard kab={DATA[1]} selected={selected} onClick={pilih} fullWidth />
        </div>

        {/* Baris 2: Pohuwato | Boalemo | Kab.Gorontalo | Kota | Bone Bolango */}
        <div className="grid gap-1.5" style={{gridTemplateColumns:'2fr 1.2fr 2fr 0.8fr 1.5fr'}}>
          <KabCard kab={DATA[5]} selected={selected} onClick={pilih} />
          <KabCard kab={DATA[4]} selected={selected} onClick={pilih} />
          <KabCard kab={DATA[0]} selected={selected} onClick={pilih} />
          <KabCard kab={DATA[2]} selected={selected} onClick={pilih} small />
          <KabCard kab={DATA[3]} selected={selected} onClick={pilih} />
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="mt-3 rounded-xl border overflow-hidden"
          style={{ borderColor: selected.warna + '40' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: selected.warna + '15' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selected.warna }} />
              <span className="text-sm font-semibold text-[var(--text-primary)]">{selected.name}</span>
              <span className="text-[10px] text-[var(--text-muted)]">{selected.dapil_dprd_prov}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowMap(p => !p)}
                className="text-[10px] border px-2.5 py-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-muted)] border-[var(--border)]">
                {showMap ? 'Tutup Peta' : '🗺 Lihat Peta'}
              </button>
              <button onClick={() => setSelected(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] p-1">
                <X size={13} />
              </button>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat */}
            <div className="space-y-3">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Data Wilayah</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label:'Kecamatan', value: selected.kecamatan },
                  { label:'Desa/Kel', value: selected.desa_kel },
                  { label:'TPS', value: selected.tps.toLocaleString('id-ID') },
                  { label:'% TPS Prov', value: (selected.tps/total.tps*100).toFixed(1)+'%' },
                ].map(s => (
                  <div key={s.label} className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{s.value}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg p-2.5">
                <p className="text-xs font-semibold text-[var(--text-primary)]">{selected.dpt.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-[var(--text-muted)]">Total DPT · L:{selected.dpt_l.toLocaleString('id-ID')} P:{selected.dpt_p.toLocaleString('id-ID')}</p>
                <div className="mt-1.5 h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${selected.dpt_l/selected.dpt*100}%`, backgroundColor: selected.warna, opacity: 0.7 }} />
                </div>
                <p className="text-[9px] text-[var(--text-muted)] mt-0.5">{(selected.dpt_l/selected.dpt*100).toFixed(1)}% laki-laki</p>
              </div>
            </div>

            {/* 3 Besar suara */}
            <div className="space-y-3">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">3 Besar Suara DPR RI 2019</p>
              <div className="space-y-2">
                {selected.top3.map((p, i) => (
                  <div key={p.partai}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-[var(--text-muted)] w-3">{i+1}</span>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PARTAI_COLOR[p.partai] || '#6366f1' }} />
                        <span className="text-[11px] font-semibold text-[var(--text-primary)]">{p.partai}</span>
                        {i === 0 && <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full">Pemenang</span>}
                      </div>
                      <span className="text-[11px] font-semibold text-[var(--text-primary)]">{p.pct}%</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${p.pct}%`, backgroundColor: PARTAI_COLOR[p.partai] || selected.warna, opacity: 0.8 }} />
                    </div>
                    <p className="text-[9px] text-[var(--text-muted)] mt-0.5">{p.suara.toLocaleString('id-ID')} suara</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DPRD info */}
            <div className="space-y-3">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Info DPRD</p>
              <div className="space-y-2">
                <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg p-3">
                  <p className="text-[10px] text-[var(--text-muted)] mb-0.5">DPRD Provinsi</p>
                  <p className="text-xs font-semibold text-[var(--text-primary)]">{selected.dapil_dprd_prov}</p>
                </div>
                <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg p-3">
                  <p className="text-[10px] text-[var(--text-muted)] mb-0.5">Partai Pemenang 2019</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PARTAI_COLOR[selected.pemenang] || selected.warna }} />
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{selected.pemenang}</p>
                  </div>
                </div>
                <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg p-3">
                  <p className="text-[10px] text-[var(--text-muted)] mb-1">% DPT dari Provinsi</p>
                  <p className="text-lg font-bold" style={{ color: selected.warna }}>
                    {(selected.dpt/total.dpt*100).toFixed(1)}%
                  </p>
                  <div className="mt-1 h-1 bg-[var(--bg-card)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${selected.dpt/total.dpt*100}%`, backgroundColor: selected.warna }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps embed */}
          {showMap && (
            <div className="border-t border-[var(--border)]">
              <iframe
                src={selected.embed}
                width="100%" height="280"
                style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function KabCard({ kab, selected, onClick, fullWidth, small }: {
  kab: KabInfo
  selected: KabInfo | null
  onClick: (k: KabInfo) => void
  fullWidth?: boolean
  small?: boolean
}) {
  const isActive = selected?.id === kab.id
  const isDim = selected && !isActive

  return (
    <button
      onClick={() => onClick(kab)}
      className={`w-full rounded-xl border text-left transition-all duration-200 ${
        isActive ? 'scale-[1.02] shadow-sm' : isDim ? 'opacity-40' : 'hover:scale-[1.01]'
      }`}
      style={{
        backgroundColor: isActive ? kab.warna + '25' : kab.warna + '12',
        borderColor: isActive ? kab.warna + '60' : kab.warna + '30',
        padding: small ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-1.5">
        <div className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: kab.warna }} />
        <div className="min-w-0 flex-1">
          <p className={`font-semibold truncate leading-tight ${small ? 'text-[10px]' : 'text-[11px]'}`}
            style={{ color: kab.warnaStroke }}>
            {small ? kab.name.replace('Kota ','').replace('Kab. ','') : kab.name}
          </p>
          {!small && (
            <p className="text-[9px] text-[var(--text-muted)] mt-0.5">{kab.tps.toLocaleString('id-ID')} TPS</p>
          )}
          {fullWidth && (
            <p className="text-[9px] text-[var(--text-muted)]">{kab.dpt.toLocaleString('id-ID')} DPT · {kab.kecamatan} Kecamatan</p>
          )}
          <div className="mt-1 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PARTAI_COLOR[kab.pemenang] || kab.warna }} />
            <span className="text-[9px] text-[var(--text-muted)]">{kab.pemenang}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
