'use client'
import { useState } from 'react'
import { modulData, kabGorontalo } from '@/lib/data'
import {
  Users, Map, Megaphone, ClipboardCheck, BarChart2,
  Wallet, Radio, Heart, UserCircle, LayoutDashboard,
  ArrowLeft, Table2, BarChart
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  m0:LayoutDashboard, m9:UserCircle, m1:Users, m2:Map,
  m3:Megaphone, m4:ClipboardCheck, m5:BarChart2,
  m6:Wallet, m7:Radio, m8:Heart,
}
const colorText: Record<string,string> = {
  indigo:'text-indigo-400', purple:'text-purple-400', green:'text-green-400',
  sky:'text-sky-400', pink:'text-pink-400', orange:'text-orange-400',
  teal:'text-teal-400', amber:'text-amber-400', red:'text-red-400',
}
const colorBg: Record<string,string> = {
  indigo:'bg-indigo-500/10 border-indigo-500/20', purple:'bg-purple-500/10 border-purple-500/20',
  green:'bg-green-500/10 border-green-500/20', sky:'bg-sky-500/10 border-sky-500/20',
  pink:'bg-pink-500/10 border-pink-500/20', orange:'bg-orange-500/10 border-orange-500/20',
  teal:'bg-teal-500/10 border-teal-500/20', amber:'bg-amber-500/10 border-amber-500/20',
  red:'bg-red-500/10 border-red-500/20',
}

const modulColumns: Record<string, { section: string; cols: string[] }[]> = {
  m9: [
    { section:'Profil Calon', cols:['Nama Lengkap','Nama Panggilan','Kontestasi','Partai','Nomor Urut','Dapil','Status Petahana'] },
    { section:'Visi & Misi', cols:['Visi','Tagline','Isu Unggulan','Tone of Voice'] },
    { section:'Program Kerja', cols:['Nama Program','Sektor','Target Terukur','Wilayah Sasaran','Periode','Prioritas'] },
    { section:'Jadwal Kampanye', cols:['Tanggal','Waktu','Jenis Kegiatan','Lokasi','Kabupaten','PIC'] },
    { section:'Kompetitor', cols:['Nama','Partai','Nomor Urut','Basis Pemilih','Elektabilitas Est.'] },
    { section:'Dokumen Legal', cols:['Jenis Dokumen','Nama','Tanggal','Penerbit','Status'] },
  ],
  m1: [
    { section:'Database Relawan', cols:['NIK','Nama Lengkap','No. HP','Kabupaten','Kecamatan','Level','Atasan','Status'] },
    { section:'Absensi', cols:['Nama Relawan','Tanggal','Check-in','Lokasi GPS','Posko','Keterangan'] },
    { section:'Tugas', cols:['Judul Tugas','Jenis','Assignee','Deadline','Status','Poin'] },
    { section:'Laporan Harian', cols:['Relawan','Tanggal','Pintu Dikunjungi','Pendukung Baru','Undecided','Wilayah'] },
    { section:'Posko', cols:['Nama Posko','Alamat','Kecamatan','PIC','Kapasitas','Status'] },
    { section:'Broadcast WA', cols:['Judul','Target','Jadwal Kirim','Penerima','Terkirim','Status'] },
  ],
  m2: [
    { section:'Data TPS', cols:['Nomor TPS','Kelurahan','Kecamatan','Kabupaten','DPT L','DPT P','Total DPT','Target Suara'] },
    { section:'Data Pemilih (DPT)', cols:['NIK','Nama','JK','Tgl Lahir','Alamat','RT/RW','Nomor TPS'] },
    { section:'Segmentasi Pemilih', cols:['Nama','Status Dukungan','Pekerjaan','Isu Prioritas','Tgl Canvassing','Canvasser'] },
    { section:'Canvassing', cols:['Relawan','Pemilih','Waktu','GPS','Hasil','Isu Disampaikan'] },
    { section:'Target & Proyeksi', cols:['Kabupaten','Target Suara','Proyeksi','Coverage %','Skor Dukungan'] },
  ],
  m3: [
    { section:'Konten', cols:['Judul','Jenis','Platform','Tanggal Posting','Status Approval','Isu Kampanye'] },
    { section:'Library Aset', cols:['Nama','Kategori','Versi','Tags','Diupload Oleh','Tanggal'] },
    { section:'Influencer & Buzzer', cols:['Nama','Tipe','Platform','Follower','Engagement Rate','Status'] },
    { section:'Iklan Digital', cols:['Platform','Campaign','Periode','Budget','Spend','Reach','CTR'] },
    { section:'Monitoring Sentimen', cols:['Platform','Penulis','Sentimen','Skor','Engagement','Waktu'] },
  ],
  m4: [
    { section:'Data Saksi', cols:['Nama Saksi','TPS','Kabupaten','Status Konfirmasi','Briefing','Surat Mandat'] },
    { section:'Upload C1', cols:['TPS','Saksi','Suara Kita','Total Suara Sah','Status Verifikasi','Waktu Upload'] },
    { section:'Laporan Pelanggaran', cols:['TPS','Saksi','Jenis Pelanggaran','Waktu','Status','No. Bawaslu'] },
  ],
  m5: [
    { section:'Survei', cols:['Judul','Tipe','Target Responden','Wilayah','Periode','Status','Responden Masuk'] },
    { section:'Respons Survei', cols:['Survei','Kabupaten','Kecamatan','Usia','JK','Waktu','Sumber'] },
    { section:'Tracking Elektabilitas', cols:['Tanggal','Persentase','Margin Error','Sampel','Sumber','Wilayah'] },
    { section:'Simulasi Suara', cols:['Nama Skenario','Asumsi Partisipasi','Proyeksi Suara','Confidence','Kesimpulan'] },
  ],
  m6: [
    { section:'Master Budget', cols:['Pos Anggaran','Plafon','Terpakai','Sisa','%','Periode'] },
    { section:'RAB Kegiatan', cols:['Nama Kegiatan','Pos','Wilayah','Tanggal','Total RAB','Status Approval'] },
    { section:'Transaksi', cols:['Tipe','Tanggal','Jumlah','Deskripsi','Pos','Vendor','Metode'] },
    { section:'Penyumbang', cols:['Nama','Tipe','NIK/NPWP','Jumlah','Tanggal','Validasi'] },
    { section:'Vendor', cols:['Nama','Kategori','No. HP','Rekening','Rating','Status'] },
    { section:'LPPDK', cols:['Jenis','Periode','Penerimaan','Pengeluaran','Saldo','Status','Deadline KPU'] },
  ],
  m7: [
    { section:'Alert', cols:['Level','Modul','Judul','Pesan','Status','Waktu','Ditangani Oleh'] },
    { section:'Isu & Krisis', cols:['Judul','Sumber','Skor Bahaya','Status','Durasi Penanganan'] },
    { section:'Laporan Harian', cols:['Tanggal','Elektabilitas','Relawan Aktif','Sisa Kas','Status Kirim'] },
    { section:'Audit Log', cols:['User','Aksi','Modul','Waktu','IP Address'] },
  ],
  m8: [
    { section:'Database Konstituen', cols:['NIK','Nama','JK','Alamat','Kecamatan','Kabupaten','No. HP','Kategori','Kedekatan'] },
    { section:'Aspirasi & Keluhan', cols:['Konstituen','Judul','Kategori','Wilayah','Status','Tgl Masuk','Tgl Respons'] },
    { section:'Program Bantuan', cols:['Nama Program','Jenis','Anggaran','Target Penerima','Wilayah','Status'] },
    { section:'Laporan Kinerja & Reses', cols:['Periode','Jenis','Rapat Dihadiri','Aspirasi Ditangani','Status'] },
  ],
}

function DataTable({ section, cols }: { section: string; cols: string[] }) {
  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden mb-3">
      <div className="px-4 py-2.5 bg-[var(--bg-hover)] border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--text-primary)]">{section}</span>
        <span className="text-[10px] text-[var(--text-muted)]">0 record</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-card)]">
              {cols.map(c => (
                <th key={c} className="text-left px-3 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={cols.length} className="px-4 py-6 text-center">
                <Table2 size={18} className="mx-auto mb-1.5 text-[var(--text-muted)]" />
                <p className="text-[11px] text-[var(--text-muted)]">Belum ada data</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Input melalui Database Center atau hubungkan Supabase</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GorontaloMap() {
  const [sel, setSel] = useState<string|null>(null)
  const selKab = kabGorontalo.find(k => k.id === sel)
  const kc = (id: string) => sel === id
    ? 'fill-indigo-500/50 stroke-indigo-300 stroke-[1.8]'
    : 'fill-[var(--bg-hover)] stroke-[var(--border-lit)] stroke-[1] hover:fill-indigo-400/20 hover:stroke-indigo-400 cursor-pointer'

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Peta TPS — Provinsi Gorontalo</h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Klik wilayah untuk detail · Input data via Database Center</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 flex items-center justify-center">
          <svg viewBox="0 0 480 220" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
            <style>{'.kab{transition:fill .15s,stroke .15s}.kl{font-family:DM Sans,system-ui,sans-serif;pointer-events:none;text-anchor:middle;dominant-baseline:central;font-size:8.5px}'}</style>
            <g onClick={() => setSel(s => s==='pohuwato'?null:'pohuwato')}>
              <path className={`kab ${kc('pohuwato')}`} d="M18,148 L16,112 L26,85 L48,62 L72,50 L100,46 L118,56 L124,78 L120,106 L110,128 L90,142 L62,152 Z"/>
              <text className="kl" x="72" y="102" fill="var(--text-secondary)">Pohuwato</text>
            </g>
            <g onClick={() => setSel(s => s==='bonebol'?null:'bonebol')}>
              <path className={`kab ${kc('bonebol')}`} d="M118,56 L124,78 L120,106 L110,128 L136,136 L160,128 L172,108 L168,80 L152,58 L134,50 Z"/>
              <text className="kl" x="144" y="96" fill="var(--text-secondary)">Boalemo</text>
            </g>
            <g onClick={() => setSel(s => s==='gorontalo'?null:'gorontalo')}>
              <path className={`kab ${kc('gorontalo')}`} d="M160,128 L172,108 L168,80 L196,74 L218,82 L228,102 L220,124 L200,136 L178,138 Z"/>
              <text className="kl" x="196" y="108" fill="var(--text-secondary)">Kab.</text>
              <text className="kl" x="196" y="120" fill="var(--text-secondary)">Gorontalo</text>
            </g>
            <g onClick={() => setSel(s => s==='gortalkota'?null:'gortalkota')}>
              <path className={`kab ${kc('gortalkota')}`} d="M218,82 L236,78 L244,90 L238,106 L228,102 Z"/>
              <text className="kl" x="232" y="94" fill="var(--text-secondary)" fontSize="7">Kota</text>
            </g>
            <g onClick={() => setSel(s => s==='bone'?null:'bone')}>
              <path className={`kab ${kc('bone')}`} d="M228,102 L238,106 L244,90 L272,86 L300,96 L312,116 L304,138 L280,148 L254,144 L236,130 L220,124 Z"/>
              <text className="kl" x="270" y="118" fill="var(--text-secondary)">Bone Bolango</text>
            </g>
            <g onClick={() => setSel(s => s==='gorut'?null:'gorut')}>
              <path className={`kab ${kc('gorut')}`} d="M72,50 L100,46 L118,56 L134,50 L152,58 L168,80 L196,74 L218,82 L236,78 L272,86 L308,78 L338,60 L355,40 L340,22 L305,14 L260,10 L215,12 L172,18 L138,26 L108,34 L82,40 Z"/>
              <text className="kl" x="215" y="48" fill="var(--text-secondary)">Gorontalo Utara</text>
            </g>
            <text fontSize="8" fill="var(--text-muted)" fontFamily="DM Sans,sans-serif" x="42" y="190">Teluk Tomini</text>
            <text fontSize="8" fill="var(--text-muted)" fontFamily="DM Sans,sans-serif" x="160" y="205">Laut Sulawesi (Utara)</text>
            <text fontSize="10" fill="var(--text-muted)" fontFamily="DM Sans,sans-serif" x="418" y="30">N</text>
            <line x1="424" y1="33" x2="424" y2="48" stroke="var(--text-muted)" strokeWidth="1"/>
          </svg>
        </div>
        <div className="lg:w-44 flex-shrink-0">
          <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">6 Kabupaten / Kota</p>
          <div className="space-y-1">
            {kabGorontalo.map(k => (
              <button key={k.id} onClick={() => setSel(s => s===k.id?null:k.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all border ${sel===k.id ? 'bg-indigo-500/12 border-indigo-500/20 text-indigo-300' : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border-transparent'}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sel===k.id ? 'bg-indigo-400' : 'bg-[var(--border-lit)]'}`} />
                <span className="text-[11px] truncate flex-1">{k.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">0 TPS</span>
              </button>
            ))}
          </div>
          {selKab && (
            <div className="mt-3 p-3 bg-indigo-500/8 border border-indigo-500/20 rounded-xl">
              <p className="text-xs font-semibold text-indigo-300 mb-2">{selKab.name}</p>
              <div className="space-y-1.5 text-[11px]">
                {[['DPT','—'],['TPS','—'],['Target suara','—'],['Relawan','—']].map(([l,v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-[var(--text-muted)]">{l}</span>
                    <span className="text-[var(--text-secondary)]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[var(--text-primary)]">Distribusi DPT per Kabupaten/Kota</p>
          <BarChart size={13} className="text-[var(--text-muted)]" />
        </div>
        <div className="flex items-end gap-2" style={{height:'56px'}}>
          {kabGorontalo.map(k => (
            <div key={k.id} onClick={() => setSel(s => s===k.id?null:k.id)}
              className="flex-1 flex flex-col items-center gap-1 cursor-pointer group">
              <div className={`w-full rounded-t-sm border transition-colors ${sel===k.id ? 'bg-indigo-500/40 border-indigo-500/40' : 'bg-[var(--bg-hover)] border-[var(--border)] group-hover:bg-indigo-500/15'}`} style={{height:'40px'}} />
              <span className="text-[8px] text-[var(--text-muted)] text-center">{k.name.split(' ').slice(-1)[0]}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">Chart terisi otomatis setelah data DPT diimport</p>
      </div>
    </div>
  )
}

function KonstituenPanel() {
  const cats = [
    { label:'DPT', color:'indigo', icon:'📋' },
    { label:'Potensi Pemilih', color:'green', icon:'🌱' },
    { label:'Daftar Kawan', color:'teal', icon:'🤝' },
    { label:'Daftar Relasi', color:'purple', icon:'🔗' },
    { label:'Tokoh Masyarakat', color:'amber', icon:'⭐' },
    { label:'Mantan Relawan', color:'pink', icon:'👥' },
  ]
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-4">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Database Konstituen — By Name By Address</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {cats.map((c,i) => (
          <div key={i} className={`p-3.5 rounded-xl border cursor-pointer hover:opacity-80 transition-opacity ${colorBg[c.color]}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-lg">{c.icon}</span>
              <span className="text-[10px] bg-[var(--bg-hover)] text-[var(--text-muted)] px-1.5 py-0.5 rounded">0</span>
            </div>
            <p className={`text-xs font-semibold ${colorText[c.color]}`}>{c.label}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Belum ada data</p>
          </div>
        ))}
      </div>
      <div className="border border-dashed border-[var(--border-lit)] rounded-xl p-4 text-center">
        <Users size={20} className="text-[var(--text-muted)] mx-auto mb-1.5" />
        <p className="text-[11px] text-[var(--text-muted)]">Input data via Database Center · Import Excel/CSV DPT dari KPU</p>
      </div>
    </div>
  )
}

interface Props { modulId: string; onBack: () => void }

export default function ModulPage({ modulId, onBack }: Props) {
  const modul = modulData.find(m => m.id === modulId)
  if (!modul) return null
  const Icon = iconMap[modulId] || LayoutDashboard
  const tables = modulColumns[modulId] || []
  const isStandby = modul.status === 'standby'

  return (
    <div className="space-y-4 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>
      <div className={`rounded-xl border p-5 ${colorBg[modul.color]}`}>
        <div className="flex items-start gap-4 flex-wrap">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${colorBg[modul.color]}`}>
            <Icon size={22} className={colorText[modul.color]} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">{modul.num}</span>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">{modul.name}</h2>
              {modul.alerts > 0 && <span className="text-[10px] bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">{modul.alerts} setup diperlukan</span>}
              {isStandby && <span className="text-[10px] bg-amber-500/12 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">Aktif hari-H</span>}
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{modul.desc}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{modul.stats}</p>
          </div>
        </div>
      </div>
      {modulId === 'm8' && <KonstituenPanel />}
      {modulId === 'm2' && <GorontaloMap />}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-sm">🔨</div>
        <p className="text-[11px] text-[var(--text-secondary)] flex-1">
          Modul dalam pengembangan. Input & edit data melalui <strong>Database Center</strong> di topbar atau sidebar. Koneksi Supabase menyusul di sprint berikutnya.
        </p>
      </div>
      {tables.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--text-primary)] mb-3">Data — {tables.length} tabel</p>
          {tables.map((t, i) => <DataTable key={i} section={t.section} cols={t.cols} />)}
        </div>
      )}
    </div>
  )
}