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
  const kabColors: Record<string,{fill:string;stroke:string;mapSrc:string}> = {
    gorut:     {fill:'#06b6d4',stroke:'#0891b2',mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1021276.7257009968!2d121.96759887268229!3d0.8663637604616092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327968d2ae4b4e3b%3A0x3030bfbcaf76f00!2sKabupaten%20Gorontalo%20Utara%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143293750!5m2!1sid!2sid'},
    bone:      {fill:'#8b5cf6',stroke:'#7c3aed',mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510672.62259982125!2d122.67114624166054!3d0.5568882941649742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327ed976fe70d79f%3A0x3030bfbcaf76ee0!2sKabupaten%20Bone%20Bolango%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143328712!5m2!1sid!2sid'},
    bonebol:   {fill:'#10b981',stroke:'#059669',mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.1290144366!2d122.03778693685258!3d0.6671091748500295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3279a7aeaeda4ee1%3A0x3030bfbcaf76ed0!2sKabupaten%20Boalemo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143405459!5m2!1sid!2sid'},
    pohuwato:  {fill:'#3b82f6',stroke:'#2563eb',mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.183131596!2d121.647892!3d0.6665875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3277628b1bb51ce5%3A0x3030bfbcaf76f10!2sKabupaten%20Pohuwato%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143393235!5m2!1sid!2sid'},
    gorontalo: {fill:'#f59e0b',stroke:'#d97706',mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510658.6757165025!2d122.33230858517621!3d0.6995941303976962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32793df3e7b43eef%3A0x3030bfbcaf76ef0!2sKabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143277222!5m2!1sid!2sid'},
    gortalkota:{fill:'#ef4444',stroke:'#dc2626',mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63834.162559348326!2d122.99873489216493!3d0.5490077866268024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32792b4799e5e75d%3A0x6dcc4d0923155967!2sGorontalo%2C%20Kabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143309383!5m2!1sid!2sid'},
  }
  const f  = (id:string) => kabColors[id]?.fill||'#374151'
  const s  = (id:string) => sel===id?'#ffffff':(kabColors[id]?.stroke||'#1f2937')
  const o  = (id:string) => sel===null?0.75:sel===id?1:0.2
  const sw = (id:string) => sel===id?2:1
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Peta TPS — Provinsi Gorontalo</h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Klik wilayah untuk detail · 6 Kabupaten/Kota</p>
        </div>
        {sel && <button onClick={() => setSel(null)} className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] underline">Reset</button>}
      </div>
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 flex items-center justify-center">
          <svg viewBox="0 0 520 230" className="w-full max-w-xl" xmlns="http://www.w3.org/2000/svg">
            <style>{`.kab{transition:all .2s}.kl{font-family:system-ui,sans-serif;pointer-events:none;text-anchor:middle;dominant-baseline:central;font-weight:700}`}</style>
            <g onClick={() => setSel(s => s==='pohuwato'?null:'pohuwato')} style={{cursor:'pointer'}}>
              <path className="kab" d="M8,75 L6,115 L10,155 L18,178 L32,188 L55,192 L75,188 L88,175 L92,155 L90,128 L82,102 L70,80 L55,65 L36,62 L18,66 Z" style={{fill:f('pohuwato'),opacity:o('pohuwato'),stroke:s('pohuwato'),strokeWidth:sw('pohuwato')}}/>
              <text className="kl" x="50" y="130" fill="white" fontSize="8.5">Pohuwato</text>
            </g>
            <g onClick={() => setSel(s => s==='bonebol'?null:'bonebol')} style={{cursor:'pointer'}}>
              <path className="kab" d="M92,72 L90,128 L92,155 L96,175 L112,185 L132,184 L148,175 L156,158 L158,132 L152,105 L144,82 L130,68 L112,64 Z" style={{fill:f('bonebol'),opacity:o('bonebol'),stroke:s('bonebol'),strokeWidth:sw('bonebol')}}/>
              <text className="kl" x="124" y="128" fill="white" fontSize="8.5">Boalemo</text>
            </g>
            <g onClick={() => setSel(s => s==='gorontalo'?null:'gorontalo')} style={{cursor:'pointer'}}>
              <path className="kab" d="M158,85 L152,105 L158,132 L156,158 L162,175 L178,185 L198,186 L215,178 L224,162 L226,142 L220,118 L210,96 L196,80 L178,74 L164,76 Z" style={{fill:f('gorontalo'),opacity:o('gorontalo'),stroke:s('gorontalo'),strokeWidth:sw('gorontalo')}}/>
              <text className="kl" x="190" y="132" fill="white" fontSize="8">Kab. Gorontalo</text>
            </g>
            <g onClick={() => setSel(s => s==='gortalkota'?null:'gortalkota')} style={{cursor:'pointer'}}>
              <path className="kab" d="M226,142 L224,162 L232,172 L244,172 L252,164 L254,150 L248,138 L236,132 Z" style={{fill:f('gortalkota'),opacity:o('gortalkota'),stroke:s('gortalkota'),strokeWidth:sw('gortalkota')}}/>
              <text className="kl" x="240" y="155" fill="white" fontSize="7">Kota</text>
            </g>
            <g onClick={() => setSel(s => s==='bone'?null:'bone')} style={{cursor:'pointer'}}>
              <path className="kab" d="M254,150 L252,164 L258,178 L275,192 L298,198 L322,196 L344,186 L360,170 L365,150 L358,130 L344,112 L325,98 L302,90 L280,90 L262,100 L252,118 Z" style={{fill:f('bone'),opacity:o('bone'),stroke:s('bone'),strokeWidth:sw('bone')}}/>
              <text className="kl" x="308" y="148" fill="white" fontSize="8.5">Bone Bolango</text>
            </g>
            <g onClick={() => setSel(s => s==='gorut'?null:'gorut')} style={{cursor:'pointer'}}>
              <path className="kab" d="M18,66 L36,62 L55,65 L70,80 L82,102 L92,72 L112,64 L130,68 L144,82 L158,85 L164,76 L178,74 L196,80 L210,96 L220,118 L226,142 L236,132 L248,138 L252,118 L262,100 L280,90 L302,90 L325,98 L344,112 L358,130 L368,114 L376,95 L380,72 L376,50 L364,34 L345,22 L318,14 L288,8 L255,6 L222,8 L192,14 L162,22 L135,32 L108,40 L80,50 L52,56 Z" style={{fill:f('gorut'),opacity:o('gorut'),stroke:s('gorut'),strokeWidth:sw('gorut')}}/>
              <text className="kl" x="200" y="48" fill="white" fontSize="8.5">Gorontalo Utara</text>
            </g>
            <text fontSize="7.5" fill="#6b7280" fontFamily="system-ui" x="20" y="215">Teluk Tomini</text>
            <text fontSize="7.5" fill="#6b7280" fontFamily="system-ui" x="150" y="228">Laut Sulawesi (utara)</text>
          </svg>
        </div>
        <div className="lg:w-44 flex-shrink-0">
          <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">6 Kabupaten / Kota</p>
          <div className="space-y-1">
            {kabGorontalo.map(k => (
              <button key={k.id} onClick={() => setSel(s => s===k.id?null:k.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all border ${sel===k.id?'border-[var(--border-lit)] bg-[var(--bg-hover)]':'hover:bg-[var(--bg-hover)] border-transparent'}`}>
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{backgroundColor:kabColors[k.id]?.fill||'#374151'}}/>
                <span className="text-[11px] truncate flex-1 text-[var(--text-secondary)]">{k.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">0 TPS</span>
              </button>
            ))}
          </div>
          {selKab && (
            <div className="mt-3 p-3 rounded-xl border" style={{borderColor:kabColors[selKab.id]?.fill+'40',backgroundColor:kabColors[selKab.id]?.fill+'12'}}>
              <p className="text-xs font-semibold mb-2" style={{color:kabColors[selKab.id]?.fill}}>{selKab.name}</p>
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
      {sel && kabColors[sel]?.mapSrc && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--text-primary)] mb-3">{kabGorontalo.find(k=>k.id===sel)?.name}</p>
          <div className="rounded-xl overflow-hidden border border-[var(--border)]">
            <iframe src={kabColors[sel].mapSrc} width="100%" height="300" style={{border:0,display:'block'}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
          </div>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <p className="text-xs font-semibold text-[var(--text-primary)] mb-3">Distribusi DPT per Kabupaten/Kota</p>
        <div className="flex items-end gap-2" style={{height:'56px'}}>
          {kabGorontalo.map(k => (
            <div key={k.id} onClick={() => setSel(s=>s===k.id?null:k.id)} className="flex-1 flex flex-col items-center gap-1 cursor-pointer">
              <div className="w-full rounded-t-sm transition-opacity" style={{height:'40px',backgroundColor:kabColors[k.id]?.fill||'#374151',opacity:sel===null?0.6:sel===k.id?1:0.2}}/>
              <span className="text-[8px] text-[var(--text-muted)] text-center leading-tight">{k.name.split(' ').slice(-1)[0]}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">Terisi otomatis setelah data DPT diimport</p>
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
          <strong className="text-[var(--text-primary)]">Data — {tables.length} tabel</strong>
          {' '}siap diisi melalui Database Center.
        </p>
        <BarChart size={14} className="text-[var(--text-muted)] flex-shrink-0" />
      </div>
      <p className="text-xs font-semibold text-[var(--text-secondary)] mt-2 mb-3">Data — {tables.length} tabel</p>
      {tables.map(t => <DataTable key={t.section} section={t.section} cols={t.cols} />)}
    </div>
  )
}
