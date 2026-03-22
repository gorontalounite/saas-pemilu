'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { modulData } from '@/lib/data'
import {
  ArrowLeft, Database, ChevronDown, ChevronUp, Upload, Plus,
  Users, Map, Megaphone, ClipboardCheck, BarChart2,
  Wallet, Radio, Heart, UserCircle, LayoutDashboard,
  Loader2, RefreshCw, Table2, CheckCircle2, AlertCircle, X
} from 'lucide-react'

const iconMap: Record<string, any> = {
  m0:LayoutDashboard, m9:UserCircle, m1:Users, m2:Map,
  m3:Megaphone, m4:ClipboardCheck, m5:BarChart2,
  m6:Wallet, m7:Radio, m8:Heart, m10:Table2,
}
const colorText: Record<string,string> = {
  indigo:'text-indigo-400', purple:'text-purple-400', green:'text-green-400',
  sky:'text-sky-400', pink:'text-pink-400', orange:'text-orange-400',
  teal:'text-teal-400', amber:'text-amber-400', red:'text-red-400', blue:'text-blue-400',
}
const colorBg: Record<string,string> = {
  indigo:'bg-indigo-500/10 border-indigo-500/20', purple:'bg-purple-500/10 border-purple-500/20',
  green:'bg-green-500/10 border-green-500/20', sky:'bg-sky-500/10 border-sky-500/20',
  pink:'bg-pink-500/10 border-pink-500/20', orange:'bg-orange-500/10 border-orange-500/20',
  teal:'bg-teal-500/10 border-teal-500/20', amber:'bg-amber-500/10 border-amber-500/20',
  red:'bg-red-500/10 border-red-500/20', blue:'bg-blue-500/10 border-blue-500/20',
}

// Tabel per modul
const modulTables: Record<string, { tabel: string; label: string; cols: string[]; insertable?: boolean }[]> = {
  m9: [
    { tabel:'kandidat', label:'Profil Kandidat', cols:['nama_lengkap','inisial','dapil','kontestasi','nomor_urut','visi','misi'] },
    { tabel:'jadwal_kampanye', label:'Jadwal Kampanye', cols:['nama_kegiatan','tanggal','jenis','lokasi','keterangan','status'], insertable:true },
  ],
  m1: [
    { tabel:'relawan', label:'Database Relawan', cols:['nama','nik','no_hp','level','kabkota','kecamatan','status'], insertable:true },
    { tabel:'posko', label:'Posko', cols:['nama_posko','alamat','kabkota','kecamatan','kapasitas','status'], insertable:true },
    { tabel:'absensi', label:'Absensi', cols:['tanggal','hadir','tugas'] },
  ],
  m2: [
    { tabel:'tps', label:'Data TPS', cols:['kode_tps','nama_tps','kabkota','kecamatan','dpt_count','target_suara'], insertable:true },
    { tabel:'pemilih', label:'Data Pemilih DPT', cols:['nama','nik','jenis_kelamin','alamat','kecamatan','status_dukungan'], insertable:true },
  ],
  m3: [
    { tabel:'konten', label:'Konten Digital', cols:['judul','platform','format','jadwal_post','status'], insertable:true },
    { tabel:'monitoring_sosmed', label:'Monitoring Sosmed', cols:['tanggal','platform','reach','engagement','followers'], insertable:true },
  ],
  m4: [
    { tabel:'penugasan_saksi', label:'Penugasan Saksi', cols:['tps_id','status','check_in_at'] },
    { tabel:'c1_uploads', label:'Upload C1', cols:['tps_id','verified','ocr_status'] },
  ],
  m5: [
    { tabel:'survei', label:'Survei', cols:['judul','target_resp','wilayah','status'], insertable:true },
    { tabel:'respons_survei', label:'Respons Survei', cols:['survei_id','submitted_at'] },
  ],
  m6: [
    { tabel:'rab', label:'RAB / Anggaran', cols:['nama_pos','kategori','anggaran','wilayah'], insertable:true },
    { tabel:'transaksi', label:'Transaksi', cols:['jenis','jumlah','keterangan','tanggal'], insertable:true },
  ],
  m7: [
    { tabel:'crisis_room', label:'Isu & Krisis', cols:['judul','level','status','created_at'], insertable:true },
    { tabel:'laporan_harian', label:'Laporan Harian', cols:['tanggal','ringkasan','isu_utama'], insertable:true },
    { tabel:'audit_log', label:'Audit Log', cols:['aksi','tabel','created_at'] },
  ],
  m8: [
    { tabel:'konstituen', label:'Database Konstituen', cols:['nama','nik','no_hp','kabkota','kecamatan','kategori','status_crm'], insertable:true },
    { tabel:'aspirasi', label:'Aspirasi & Keluhan', cols:['isi_aspirasi','sektor','status','submitted_at'], insertable:true },
  ],
}

// Referensi (read-only)
const refTables = [
  { tabel:'ref_dapil',       label:'Referensi Dapil',       cols:['kontestasi','kabkota','nama_dapil','jumlah_kursi','jumlah_tps'] },
  { tabel:'ref_partai',      label:'Referensi Partai',       cols:['nomor_urut','nama_lengkap','nama_pendek'] },
  { tabel:'ref_kabkota',     label:'Referensi Kab/Kota',     cols:['nama','jumlah_tps','jumlah_dpt'] },
  { tabel:'ref_anggota_dprd',label:'Anggota DPRD 2024',      cols:['kabkota','nama','partai','nama_dapil','suara_sah'] },
  { tabel:'histori_pemilu',  label:'Histori Pemilu 2019',    cols:['kabkota','kecamatan','partai','suara','tahun'] },
]

interface TableStats { count: number; loading: boolean }

function TableBlock({
  tabel, label, cols, insertable, kandidatId
}: {
  tabel: string; label: string; cols: string[]; insertable?: boolean; kandidatId: string | null
}) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<any[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{type:'ok'|'err'; msg:string} | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchCount()
  }, [])

  async function fetchCount() {
    const { count: c } = await supabase.from(tabel).select('*', { count:'exact', head:true })
    setCount(c || 0)
  }

  async function fetchRows() {
    setLoading(true)
    const { data } = await supabase.from(tabel).select(cols.join(',')).limit(50).order('created_at' as any, { ascending:false }).catch(() => ({ data: [] }))
    setRows(data || [])
    setLoading(false)
  }

  function toggle() {
    if (!open) fetchRows()
    setOpen(p => !p)
  }

  async function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const text = await file.text()
      const lines = text.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g,''))
      const records = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim().replace(/"/g,''))
        const obj: any = {}
        headers.forEach((h, i) => { if (vals[i] !== undefined && vals[i] !== '') obj[h] = vals[i] })
        return obj
      }).filter(r => Object.keys(r).length > 0)

      if (records.length === 0) throw new Error('Tidak ada data valid di file CSV')

      const { error } = await supabase.from(tabel).insert(records)
      if (error) throw new Error(error.message)
      setToast({ type:'ok', msg: `${records.length} baris berhasil diupload ke ${tabel}` })
      fetchCount()
      if (open) fetchRows()
    } catch (err: any) {
      setToast({ type:'err', msg: err.message })
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Header baris */}
      <div className="flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors">
        <button onClick={toggle} className="flex items-center gap-3 flex-1 text-left">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-[12px] font-medium text-[var(--text-primary)]">{label}</span>
          <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] border border-[var(--border)] px-1.5 py-0.5 rounded">{count.toLocaleString('id-ID')} baris</span>
          <span className="text-[10px] text-[var(--text-muted)] hidden sm:block font-mono">{tabel}</span>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          {insertable && (
            <>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
              <button onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 text-[10px] bg-[var(--bg-hover)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-secondary)] px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                {uploading ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
                Upload CSV
              </button>
            </>
          )}
          <button onClick={toggle} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] p-1">
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Toast notifikasi */}
      {toast && (
        <div className={`mx-4 mb-2 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] border ${toast.type === 'ok' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toast.type === 'ok' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-auto"><X size={10} /></button>
        </div>
      )}

      {/* Tabel data */}
      {open && (
        <div className="border-t border-[var(--border)]">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={16} className="animate-spin text-[var(--text-muted)]" />
              <span className="ml-2 text-xs text-[var(--text-muted)]">Memuat...</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-xs text-[var(--text-muted)]">Belum ada data</p>
              {insertable && (
                <p className="text-[10px] text-[var(--text-muted)] mt-1">Upload CSV untuk mengisi tabel ini</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-hover)]">
                    {cols.map(c => (
                      <th key={c} className="text-left px-3 py-2 text-[var(--text-muted)] font-medium uppercase tracking-wider whitespace-nowrap">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]">
                      {cols.map(c => (
                        <td key={c} className="px-3 py-2 text-[var(--text-secondary)] whitespace-nowrap max-w-[200px] truncate">
                          {row[c] !== null && row[c] !== undefined ? String(row[c]) : <span className="text-[var(--text-muted)] italic">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length >= 50 && (
                <p className="text-[10px] text-[var(--text-muted)] text-center py-2">Menampilkan 50 baris terakhir</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface Props { onBack: () => void }

export default function DatabaseCenter({ onBack }: Props) {
  const supabase = createClient()
  const [kandidatId, setKandidatId] = useState<string | null>(null)
  const [openModul, setOpenModul] = useState<string | null>(null)
  const [openRef, setOpenRef] = useState(false)
  const modules = modulData.filter(m => m.id !== 'm0' && m.id !== 'm10' && modulTables[m.id])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setKandidatId(data.user.id)
    })
  }, [])

  return (
    <div className="space-y-4 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/8 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
            <Database size={22} className="text-indigo-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Database Center</h2>
            <p className="text-sm text-[var(--text-secondary)]">Satu pintu untuk semua data kampanye — upload CSV, lihat isi tabel, dan kelola data per modul</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Upload CSV → data langsung masuk ke tabel yang sesuai · Format: header kolom di baris pertama</p>
          </div>
        </div>
      </div>

      {/* Panduan upload CSV */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <p className="text-[11px] font-semibold text-[var(--text-primary)] mb-2">Cara Upload Data</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { step:'1', text:'Siapkan file CSV dengan header kolom di baris pertama' },
            { step:'2', text:'Klik tombol "Upload CSV" di tabel yang sesuai' },
            { step:'3', text:'Data langsung masuk ke database dan tampil di semua modul' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-[10px] font-bold text-indigo-400 flex-shrink-0 mt-0.5">{s.step}</div>
              <p className="text-[11px] text-[var(--text-secondary)]">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per modul */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--text-primary)]">Data per Modul</p>
        {modules.map(m => {
          const Icon = iconMap[m.id] || Database
          const isOpen = openModul === m.id
          const tables = modulTables[m.id] || []
          return (
            <div key={m.id} className={`rounded-xl border overflow-hidden transition-all ${isOpen ? `${colorBg[m.color]} border-opacity-50` : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
              <button onClick={() => setOpenModul(isOpen ? null : m.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--bg-hover)] transition-colors">
                <div className={`w-8 h-8 rounded-lg ${colorBg[m.color]} border flex items-center justify-center flex-shrink-0`}>
                  <Icon size={15} className={colorText[m.color]} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--text-primary)]">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] mr-1">{m.num}</span>
                    {m.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">{tables.length} tabel · {tables.filter(t => t.insertable).length} tabel bisa diisi</p>
                </div>
                <div className="flex items-center gap-2">
                  {tables.filter(t => t.insertable).length > 0 && (
                    <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Upload tersedia</span>
                  )}
                  {isOpen ? <ChevronUp size={13} className="text-[var(--text-muted)]" /> : <ChevronDown size={13} className="text-[var(--text-muted)]" />}
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-2 border-t border-[var(--border)]">
                  <div className="pt-3" />
                  {tables.map(t => (
                    <TableBlock key={t.tabel} {...t} kandidatId={kandidatId} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Data Referensi (read-only) */}
      <div className="space-y-2">
        <button onClick={() => setOpenRef(p => !p)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
              <Table2 size={15} className="text-slate-400" />
            </div>
            <div className="text-left">
              <p className="text-[12px] font-semibold text-[var(--text-primary)]">Data Referensi</p>
              <p className="text-[10px] text-[var(--text-muted)]">Dapil, partai, kab/kota, anggota DPRD, histori pemilu — read only</p>
            </div>
          </div>
          {openRef ? <ChevronUp size={13} className="text-[var(--text-muted)]" /> : <ChevronDown size={13} className="text-[var(--text-muted)]" />}
        </button>
        {openRef && (
          <div className="space-y-2 pl-2">
            {refTables.map(t => (
              <TableBlock key={t.tabel} {...t} insertable={false} kandidatId={null} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
