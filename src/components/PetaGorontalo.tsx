'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { X, ChevronDown, ChevronUp, ChevronRight, Loader2 } from 'lucide-react'

const PC: Record<string,{hex:string;bg:string;text:string;border:string}> = {
  'Golkar':   {hex:'#CA8A04',bg:'bg-yellow-500/12',text:'text-yellow-600 dark:text-yellow-400',border:'border-yellow-500/25'},
  'NasDem':   {hex:'#2563EB',bg:'bg-blue-500/12',  text:'text-blue-700 dark:text-blue-400',   border:'border-blue-500/25'},
  'PDIP':     {hex:'#DC2626',bg:'bg-red-500/12',   text:'text-red-700 dark:text-red-400',     border:'border-red-500/25'},
  'Gerindra': {hex:'#B91C1C',bg:'bg-red-700/12',   text:'text-red-800 dark:text-red-500',     border:'border-red-700/25'},
  'PPP':      {hex:'#15803D',bg:'bg-green-500/12', text:'text-green-700 dark:text-green-400', border:'border-green-500/25'},
  'PKB':      {hex:'#166534',bg:'bg-green-700/12', text:'text-green-800 dark:text-green-500', border:'border-green-700/25'},
  'PKS':      {hex:'#C2410C',bg:'bg-orange-500/12',text:'text-orange-700 dark:text-orange-400',border:'border-orange-500/25'},
  'Demokrat': {hex:'#0284C7',bg:'bg-sky-500/12',   text:'text-sky-700 dark:text-sky-400',    border:'border-sky-500/25'},
  'PAN':      {hex:'#B45309',bg:'bg-amber-500/12', text:'text-amber-700 dark:text-amber-400', border:'border-amber-500/25'},
  'Hanura':   {hex:'#D97706',bg:'bg-orange-400/12',text:'text-orange-600 dark:text-orange-300',border:'border-orange-400/25'},
}

interface Kec { kecamatan: string; jumlah_desa: number }
interface Anggota { nama: string; partai: string; suara_sah: number; nomor_dapil?: number; nama_dapil?: string }

const KABDATA = [
  {id:'gorontalo', name:'Kab. Gorontalo',   kec:19,des:205,tps:1205,dpt_l:149072,dpt_p:151178,dpt:300250,
   pemenang:'Golkar',kursi_total:40,dapil_kab:6,dapil_prov:'Dapil 2 & 3',kursi_prov:17,
   top3_dpr:   [{p:'Golkar',s:67432},{p:'NasDem',s:53626},{p:'PPP',s:29477}],
   top3_prov:  [{p:'Golkar',k:5},{p:'NasDem',k:4},{p:'PPP',k:3}],
   top3_kab:   [{p:'Golkar',k:8},{p:'NasDem',k:6},{p:'PPP',k:6}],
   embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510658.6757165025!2d122.33230858517621!3d0.6995941303976962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32793df3e7b43eef%3A0x3030bfbcaf76ef0!2sKabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143277222!5m2!1sid!2sid'},
  {id:'gorut',    name:'Gorontalo Utara',   kec:11,des:123,tps:412, dpt_l:46233, dpt_p:46031, dpt:92264,
   pemenang:'NasDem',kursi_total:25,dapil_kab:6,dapil_prov:'Dapil 5',kursi_prov:5,
   top3_dpr:   [{p:'Golkar',s:24798},{p:'NasDem',s:15020},{p:'Gerindra',s:8822}],
   top3_prov:  [{p:'NasDem',k:2},{p:'Golkar',k:2},{p:'Hanura',k:1}],
   top3_kab:   [{p:'NasDem',k:7},{p:'PDIP',k:6},{p:'Hanura',k:5}],
   embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1021276.7257009968!2d121.96759887268229!3d0.8663637604616092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327968d2ae4b4e3b%3A0x3030bfbcaf76f00!2sKabupaten%20Gorontalo%20Utara%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143293750!5m2!1sid!2sid'},
  {id:'kota',     name:'Kota Gorontalo',    kec:9, des:50, tps:550, dpt_l:71226, dpt_p:74835, dpt:146061,
   pemenang:'Golkar',kursi_total:30,dapil_kab:4,dapil_prov:'Dapil 1',kursi_prov:8,
   top3_dpr:   [{p:'NasDem',s:33507},{p:'Golkar',s:25195},{p:'Gerindra',s:20200}],
   top3_prov:  [{p:'Golkar',k:3},{p:'NasDem',k:2},{p:'PPP',k:2}],
   top3_kab:   [{p:'Golkar',k:7},{p:'PAN',k:5},{p:'NasDem',k:4}],
   embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63834.162559348326!2d122.99873489216493!3d0.5490077866268024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32792b4799e5e75d%3A0x6dcc4d0923155967!2sGorontalo%2C%20Kabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143309383!5m2!1sid!2sid'},
  {id:'bone',     name:'Bone Bolango',      kec:18,des:165,tps:509, dpt_l:60856, dpt_p:61917, dpt:122773,
   pemenang:'NasDem',kursi_total:25,dapil_kab:4,dapil_prov:'Dapil 6',kursi_prov:8,
   top3_dpr:   [{p:'NasDem',s:34487},{p:'Golkar',s:20216},{p:'Gerindra',s:13248}],
   top3_prov:  [{p:'NasDem',k:3},{p:'Golkar',k:2},{p:'PKS',k:1}],
   top3_kab:   [{p:'NasDem',k:6},{p:'Golkar',k:4},{p:'PPP',k:4}],
   embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510672.62259982125!2d122.67114624166054!3d0.5568882941649742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327ed976fe70d79f%3A0x3030bfbcaf76ee0!2sKabupaten%20Bone%20Bolango%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143328712!5m2!1sid!2sid'},
  {id:'bonebol',  name:'Boalemo',           kec:7, des:82, tps:424, dpt_l:54959, dpt_p:53433, dpt:108392,
   pemenang:'PDIP',kursi_total:25,dapil_kab:3,dapil_prov:'Dapil 4',kursi_prov:6,
   top3_dpr:   [{p:'Golkar',s:24630},{p:'NasDem',s:16722},{p:'PDIP',s:10593}],
   top3_prov:  [{p:'Golkar',k:2},{p:'NasDem',k:2},{p:'PPP',k:1}],
   top3_kab:   [{p:'PDIP',k:5},{p:'Golkar',k:4},{p:'Gerindra',k:4}],
   embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.1290144366!2d122.03778693685258!3d0.6671091748500295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3279a7aeaeda4ee1%3A0x3030bfbcaf76ed0!2sKabupaten%20Boalemo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143405459!5m2!1sid!2sid'},
  {id:'pohuwato', name:'Pohuwato',          kec:13,des:104,tps:439, dpt_l:56336, dpt_p:55130, dpt:111466,
   pemenang:'Golkar',kursi_total:25,dapil_kab:5,dapil_prov:'Dapil 4',kursi_prov:6,
   top3_dpr:   [{p:'Golkar',s:29396},{p:'NasDem',s:11181},{p:'Gerindra',s:11147}],
   top3_prov:  [{p:'NasDem',k:2},{p:'Golkar',k:2},{p:'PKB',k:1}],
   top3_kab:   [{p:'Golkar',k:7},{p:'Gerindra',k:6},{p:'PKB',k:3}],
   embed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.183131596!2d121.647892!3d0.6665875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3277628b1bb51ce5%3A0x3030bfbcaf76f10!2sKabupaten%20Pohuwato%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143393235!5m2!1sid!2sid'},
]

const TOTAL = {tps:3539,dpt:881206}

type Tab = 'wilayah'|'dpr'|'dprd_prov'|'dprd_kab'

interface Props { onNavigate?: (id:string)=>void }

export default function PetaGorontalo({onNavigate}: Props) {
  const supabase = createClient()
  const [sel, setSel] = useState<typeof KABDATA[0]|null>(null)
  const [tab, setTab] = useState<Tab>('wilayah')
  const [showMap, setShowMap] = useState(false)
  // data dari DB
  const [kecList, setKecList] = useState<Kec[]>([])
  const [expandKec, setExpandKec] = useState(false)
  const [anggotaDPR, setAnggotaDPR] = useState<Anggota[]>([])
  const [anggotaProv, setAnggotaProv] = useState<Anggota[]>([])
  const [anggotaKab, setAnggotaKab] = useState<Anggota[]>([])
  const [showAllProv, setShowAllProv] = useState(false)
  const [showAllKab, setShowAllKab] = useState(false)
  const [loading, setLoading] = useState(false)

  async function pilih(kab: typeof KABDATA[0]) {
    if (sel?.id === kab.id) { setSel(null); setShowMap(false); return }
    setSel(kab); setTab('wilayah'); setShowMap(false)
    setExpandKec(false); setShowAllProv(false); setShowAllKab(false)
    setLoading(true)
    const [kecRes, dprRes, provRes, kabRes] = await Promise.all([
      supabase.from('ref_kecamatan').select('kecamatan,jumlah_desa').eq('kabkota', kab.name).order('kecamatan'),
      supabase.from('ref_anggota_dpr').select('nama,partai,suara_sah').eq('tahun',2019).order('suara_sah',{ascending:false}).limit(3),
      supabase.from('ref_anggota_dprd_prov').select('nama,partai,suara_sah,nama_dapil,nomor_dapil')
        .in('nomor_dapil', getDapilNomor(kab.dapil_prov)).order('suara_sah',{ascending:false}),
      supabase.from('ref_anggota_dprd').select('nama,partai,suara_sah,nama_dapil,nomor_dapil')
        .eq('kabkota', kab.name).order('suara_sah',{ascending:false}),
    ])
    setKecList(kecRes.data || [])
    setAnggotaDPR(dprRes.data || [])
    setAnggotaProv(provRes.data || [])
    setAnggotaKab(kabRes.data || [])
    setLoading(false)
  }

  function getDapilNomor(dapilStr: string): number[] {
    const nums = dapilStr.match(/\d+/g)
    return nums ? nums.map(Number) : []
  }

  const p = sel ? (PC[sel.pemenang] || PC['Golkar']) : PC['Golkar']

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-[var(--text-primary)]">Peta Provinsi Gorontalo</p>
          <p className="text-[10px] text-[var(--text-muted)]">6 Kabupaten/Kota · {TOTAL.tps.toLocaleString('id-ID')} TPS · {TOTAL.dpt.toLocaleString('id-ID')} DPT</p>
        </div>
        {onNavigate && (
          <button onClick={() => onNavigate('m10')}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            Detail <ChevronRight size={10}/>
          </button>
        )}
      </div>

      {/* 6 card grid 3x2 — semua sama besar */}
      <div className="grid grid-cols-3 gap-2">
        {KABDATA.map(kab => {
          const cp = PC[kab.pemenang] || PC['Golkar']
          const isActive = sel?.id === kab.id
          const isDim = sel && !isActive
          return (
            <button key={kab.id} onClick={() => pilih(kab)}
              className={`rounded-xl border p-3 text-left transition-all duration-200 ${
                isActive ? `${cp.bg} ${cp.border} ring-1 ring-inset shadow-sm` :
                isDim    ? `${cp.bg} ${cp.border} opacity-30` :
                           `${cp.bg} ${cp.border} hover:shadow-sm hover:opacity-90`
              }`}
              style={isActive ? { '--tw-ring-color': cp.hex+'60' } as any : {}}>
              <p className={`text-[11px] font-bold leading-tight mb-2 ${cp.text}`}>{kab.name}</p>
              <p className="text-[10px] font-medium text-[var(--text-primary)]">{kab.tps.toLocaleString('id-ID')} TPS</p>
              <p className="text-[10px] text-[var(--text-secondary)]">{kab.dpt.toLocaleString('id-ID')} DPT</p>
              <div className="mt-2 pt-1.5 border-t border-black/10 dark:border-white/10 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:cp.hex}}/>
                <span className={`text-[9px] font-bold ${cp.text}`}>{kab.pemenang}</span>
                <span className="text-[9px] text-[var(--text-muted)] ml-auto">{kab.top3_kab[0].k}k</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {sel && (
        <div className={`mt-3 rounded-xl border overflow-hidden ${p.border}`}>

          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 ${p.bg}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor:p.hex}}/>
              <span className={`text-sm font-bold ${p.text}`}>{sel.name}</span>
              {loading && <Loader2 size={12} className="animate-spin text-[var(--text-muted)]"/>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setShowMap(s=>!s)}
                className="text-[10px] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                {showMap ? 'Tutup Peta' : '🗺 Lihat Peta'}
              </button>
              <button onClick={()=>{setSel(null);setShowMap(false)}}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 transition-colors">
                <X size={13}/>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] bg-[var(--bg-hover)] overflow-x-auto">
            {([
              {id:'wilayah',  label:'Data Wilayah'},
              {id:'dpr',      label:'DPR RI 2019'},
              {id:'dprd_prov',label:'DPRD Provinsi'},
              {id:'dprd_kab', label:'DPRD Kab/Kota'},
            ] as {id:Tab;label:string}[]).map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`flex-shrink-0 px-4 py-2.5 text-[11px] font-semibold transition-all border-b-2 -mb-px whitespace-nowrap ${
                  tab===t.id
                    ? `${p.text} border-current`
                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-card)]">

            {/* ── Tab 1: Data Wilayah ── */}
            {tab==='wilayah' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {label:'Jumlah TPS',  value:sel.tps.toLocaleString('id-ID')},
                    {label:'% TPS Prov',  value:(sel.tps/TOTAL.tps*100).toFixed(1)+'%'},
                    {label:'Kecamatan',   value:sel.kec},
                    {label:'Desa/Kel',    value:sel.des},
                  ].map(s=>(
                    <div key={s.label} className="border border-[var(--border)] bg-[var(--bg-hover)] rounded-xl p-3 text-center">
                      <p className="text-base font-bold text-[var(--text-primary)]">{s.value}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* DPT L/P */}
                <div className="border border-[var(--border)] bg-[var(--bg-hover)] rounded-xl p-3">
                  <div className="flex justify-between mb-2">
                    <p className="text-[11px] font-semibold text-[var(--text-primary)]">DPT Total</p>
                    <p className="text-[11px] font-bold text-[var(--text-primary)]">{sel.dpt.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2">
                      <p className="text-xs font-bold text-blue-500">{sel.dpt_l.toLocaleString('id-ID')}</p>
                      <p className="text-[9px] text-[var(--text-muted)]">Laki-laki · {(sel.dpt_l/sel.dpt*100).toFixed(1)}%</p>
                    </div>
                    <div className="text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-2">
                      <p className="text-xs font-bold text-pink-500">{sel.dpt_p.toLocaleString('id-ID')}</p>
                      <p className="text-[9px] text-[var(--text-muted)]">Perempuan · {(sel.dpt_p/sel.dpt*100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500" style={{width:`${sel.dpt_l/sel.dpt*100}%`}}/>
                    <div className="h-full bg-pink-500 flex-1"/>
                  </div>
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">{(sel.dpt/TOTAL.dpt*100).toFixed(1)}% dari total DPT Provinsi</p>
                </div>

                {/* Kecamatan expandable */}
                <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                  <button onClick={()=>setExpandKec(s=>!s)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[var(--bg-hover)] transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[var(--text-primary)]">Daftar Kecamatan</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${p.bg} ${p.text} ${p.border}`}>{sel.kec} kecamatan</span>
                    </div>
                    {expandKec ? <ChevronUp size={13} className="text-[var(--text-muted)]"/> : <ChevronDown size={13} className="text-[var(--text-muted)]"/>}
                  </button>
                  {expandKec && (
                    <div className="border-t border-[var(--border)] bg-[var(--bg-hover)] p-3">
                      {kecList.length === 0 ? (
                        <p className="text-[10px] text-[var(--text-muted)] text-center py-2">Memuat...</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                          {kecList.map(k => (
                            <div key={k.kecamatan} className="flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-2.5 py-2">
                              <p className="text-[10px] font-medium text-[var(--text-primary)] truncate flex-1">{k.kecamatan}</p>
                              <span className={`text-[9px] font-bold ml-2 flex-shrink-0 ${p.text}`}>{k.jumlah_desa}d</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Tab 2: DPR RI 2019 ── */}
            {tab==='dpr' && (
              <div className="space-y-3">
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Perolehan Suara DPR RI — Pemilu 2019 · Dapil Gorontalo (3 kursi)</p>
                {sel.top3_dpr.map((item,i) => {
                  const cp2 = PC[item.p] || PC['Golkar']
                  const maxS = sel.top3_dpr[0].s
                  const pct = (item.s / sel.top3_dpr.reduce((a,b)=>a+b.s,0)*100).toFixed(1)
                  const caleg = anggotaDPR.find(a=>a.partai===item.p)
                  return (
                    <div key={item.p} className="border border-[var(--border)] bg-[var(--bg-hover)] rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] w-4">{i+1}</span>
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor:cp2.hex}}/>
                        <span className={`text-[12px] font-bold ${cp2.text} flex-1`}>{item.p}</span>
                        {i===0 && <span className="text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 px-1.5 py-0.5 rounded-full font-semibold">Pemenang</span>}
                        <span className="text-[12px] font-bold text-[var(--text-primary)]">{pct}%</span>
                      </div>
                      <div className="h-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-full overflow-hidden mb-2">
                        <div className="h-full rounded-full" style={{width:`${item.s/maxS*100}%`,backgroundColor:cp2.hex,opacity:0.85}}/>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-[var(--text-secondary)]">{item.s.toLocaleString('id-ID')} suara</p>
                        {caleg && (
                          <p className="text-[10px] font-semibold text-[var(--text-primary)]">📍 {caleg.nama}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Tab 3: DPRD Provinsi ── */}
            {tab==='dprd_prov' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className={`${p.bg} border ${p.border} rounded-xl p-3 text-center`}>
                    <p className={`text-sm font-bold ${p.text}`}>{sel.dapil_prov}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Dapil DPRD Provinsi</p>
                  </div>
                  <div className="border border-[var(--border)] bg-[var(--bg-hover)] rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{sel.kursi_prov} kursi</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Alokasi Kursi</p>
                  </div>
                </div>

                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">3 Besar Kursi DPRD Provinsi</p>
                {(() => {
                  const shown = showAllProv ? anggotaProv : anggotaProv.slice(0,3)
                  const maxK = sel.top3_prov[0].k
                  const grouped: Record<string,Anggota[]> = {}
                  anggotaProv.forEach(a => {
                    if (!grouped[a.partai]) grouped[a.partai]=[]
                    grouped[a.partai].push(a)
                  })
                  return (
                    <>
                      {sel.top3_prov.map((item,i) => {
                        const cp2 = PC[item.p] || PC['Golkar']
                        const members = grouped[item.p] || []
                        return (
                          <div key={item.p} className="border border-[var(--border)] bg-[var(--bg-hover)] rounded-xl p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[var(--text-muted)] w-4">{i+1}</span>
                              <div className="w-3 h-3 rounded-full" style={{backgroundColor:cp2.hex}}/>
                              <span className={`text-[12px] font-bold ${cp2.text} flex-1`}>{item.p}</span>
                              {i===0 && <span className="text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 px-1.5 py-0.5 rounded-full font-semibold">Terbanyak</span>}
                              <span className={`text-sm font-bold ${cp2.text}`}>{item.k} kursi</span>
                            </div>
                            <div className="h-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{width:`${item.k/maxK*100}%`,backgroundColor:cp2.hex,opacity:0.8}}/>
                            </div>
                            {members.length > 0 && (
                              <div className="space-y-1 pt-0.5">
                                {members.slice(0,3).map(m => (
                                  <div key={m.nama} className="flex items-center justify-between">
                                    <p className="text-[10px] font-medium text-[var(--text-primary)]">📍 {m.nama}</p>
                                    <p className="text-[10px] text-[var(--text-muted)]">{m.suara_sah.toLocaleString('id-ID')}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                      {anggotaProv.length > 3 && (
                        <button onClick={()=>setShowAllProv(s=>!s)}
                          className={`w-full text-[11px] font-semibold py-2 rounded-xl border transition-colors ${p.bg} ${p.text} ${p.border} hover:opacity-80`}>
                          {showAllProv ? '↑ Tampilkan lebih sedikit' : `↓ Lihat semua ${anggotaProv.length} anggota`}
                        </button>
                      )}
                      {showAllProv && (
                        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                          <div className="divide-y divide-[var(--border)]">
                            {anggotaProv.map((m,i) => {
                              const cp2 = PC[m.partai] || PC['Golkar']
                              return (
                                <div key={m.nama} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-hover)]">
                                  <span className="text-[9px] text-[var(--text-muted)] w-4">{i+1}</span>
                                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:cp2.hex}}/>
                                  <p className="text-[11px] font-medium text-[var(--text-primary)] flex-1">{m.nama}</p>
                                  <span className={`text-[9px] font-bold ${cp2.text}`}>{m.partai}</span>
                                  <span className="text-[10px] text-[var(--text-muted)]">{m.suara_sah.toLocaleString('id-ID')}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}

            {/* ── Tab 4: DPRD Kab/Kota ── */}
            {tab==='dprd_kab' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className={`${p.bg} border ${p.border} rounded-xl p-3 text-center`}>
                    <p className={`text-sm font-bold ${p.text}`}>{sel.pemenang}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Partai Pemenang</p>
                  </div>
                  <div className="border border-[var(--border)] bg-[var(--bg-hover)] rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{sel.kursi_total}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Total Kursi</p>
                  </div>
                  <div className="border border-[var(--border)] bg-[var(--bg-hover)] rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{sel.dapil_kab}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Dapil</p>
                  </div>
                </div>

                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">3 Besar Kursi DPRD Kab/Kota — Pemilu 2024</p>
                {(() => {
                  const grouped: Record<string,Anggota[]> = {}
                  anggotaKab.forEach(a => {
                    if (!grouped[a.partai]) grouped[a.partai]=[]
                    grouped[a.partai].push(a)
                  })
                  const maxK = sel.top3_kab[0].k
                  return (
                    <>
                      {sel.top3_kab.map((item,i) => {
                        const cp2 = PC[item.p] || PC['Golkar']
                        const members = grouped[item.p] || []
                        const pct = Math.round(item.k/sel.kursi_total*100)
                        return (
                          <div key={item.p} className="border border-[var(--border)] bg-[var(--bg-hover)] rounded-xl p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[var(--text-muted)] w-4">{i+1}</span>
                              <div className="w-3 h-3 rounded-full" style={{backgroundColor:cp2.hex}}/>
                              <span className={`text-[12px] font-bold ${cp2.text} flex-1`}>{item.p}</span>
                              {i===0 && <span className="text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 px-1.5 py-0.5 rounded-full font-semibold">Pemenang</span>}
                              <span className={`text-sm font-bold ${cp2.text}`}>{item.k}</span>
                              <span className="text-[10px] text-[var(--text-muted)]">kursi · {pct}%</span>
                            </div>
                            <div className="h-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{width:`${item.k/maxK*100}%`,backgroundColor:cp2.hex,opacity:0.8}}/>
                            </div>
                            {members.length > 0 && (
                              <div className="space-y-1 pt-0.5">
                                {members.slice(0,3).map(m => (
                                  <div key={m.nama} className="flex items-center justify-between">
                                    <p className="text-[10px] font-medium text-[var(--text-primary)]">📍 {m.nama}</p>
                                    <p className="text-[10px] text-[var(--text-muted)]">{m.suara_sah.toLocaleString('id-ID')} suara</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                      {anggotaKab.length > 3 && (
                        <button onClick={()=>setShowAllKab(s=>!s)}
                          className={`w-full text-[11px] font-semibold py-2 rounded-xl border transition-colors ${p.bg} ${p.text} ${p.border} hover:opacity-80`}>
                          {showAllKab ? '↑ Tampilkan lebih sedikit' : `↓ Lihat semua ${anggotaKab.length} anggota`}
                        </button>
                      )}
                      {showAllKab && (
                        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                          <div className="divide-y divide-[var(--border)]">
                            {anggotaKab.map((m,i) => {
                              const cp2 = PC[m.partai] || PC['Golkar']
                              return (
                                <div key={m.nama} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-hover)]">
                                  <span className="text-[9px] text-[var(--text-muted)] w-4">{i+1}</span>
                                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:cp2.hex}}/>
                                  <p className="text-[11px] font-medium text-[var(--text-primary)] flex-1 truncate">{m.nama}</p>
                                  <span className={`text-[9px] font-bold ${cp2.text} flex-shrink-0`}>{m.partai}</span>
                                  <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">{m.suara_sah.toLocaleString('id-ID')}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
          </div>

          {showMap && (
            <div className="border-t border-[var(--border)]">
              <iframe src={sel.embed} width="100%" height="260"
                style={{border:0,display:'block'}} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"/>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
