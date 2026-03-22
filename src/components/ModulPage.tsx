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

  const kabColors: Record<string, { fill: string; stroke: string; mapSrc: string }> = {
    gorut:      { fill:'#06b6d4', stroke:'#0891b2', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1021276.7257009968!2d121.96759887268229!3d0.8663637604616092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327968d2ae4b4e3b%3A0x3030bfbcaf76f00!2sKabupaten%20Gorontalo%20Utara%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143293750!5m2!1sid!2sid' },
    bone:       { fill:'#8b5cf6', stroke:'#7c3aed', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510672.62259982125!2d122.67114624166054!3d0.5568882941649742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327ed976fe70d79f%3A0x3030bfbcaf76ee0!2sKabupaten%20Bone%20Bolango%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143328712!5m2!1sid!2sid' },
    bonebol:    { fill:'#10b981', stroke:'#059669', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.1290144366!2d122.03778693685258!3d0.6671091748500295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3279a7aeaeda4ee1%3A0x3030bfbcaf76ed0!2sKabupaten%20Boalemo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143405459!5m2!1sid!2sid' },
    pohuwato:   { fill:'#3b82f6', stroke:'#2563eb', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510662.183131596!2d121.647892!3d0.6665875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3277628b1bb51ce5%3A0x3030bfbcaf76f10!2sKabupaten%20Pohuwato%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143393235!5m2!1sid!2sid' },
    gorontalo:  { fill:'#f59e0b', stroke:'#d97706', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510658.6757165025!2d122.33230858517621!3d0.6995941303976962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32793df3e7b43eef%3A0x3030bfbcaf76ef0!2sKabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143277222!5m2!1sid!2sid' },
    gortalkota: { fill:'#ef4444', stroke:'#dc2626', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63834.162559348326!2d122.99873489216493!3d0.5490077866268024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32792b4799e5e75d%3A0x6dcc4d0923155967!2sGorontalo%2C%20Kabupaten%20Gorontalo%2C%20Gorontalo!5e0!3m2!1sid!2sid!4v1774143309383!5m2!1sid!2sid' },
  }

  const f = (id: string) => kabColors[id]?.fill || '#374151'
  const s = (id: string) => sel === id ? '#ffffff' : (kabColors[id]?.stroke || '#1f2937')
  const o = (id: string) => sel === null ? 0.7 : sel === id ? 1 : 0.25
  const sw = (id: string) => sel === id ? 2 : 1

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Peta TPS — Provinsi Gorontalo</h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Klik wilayah untuk lihat peta · 6 Kabupaten/Kota</p>
        </div>
        {sel && (
          <button onClick={() => setSel(null)} className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] underline">
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* SVG Peta */}
        <div className="flex-1 flex items-center justify-center">
          <svg viewBox="0 0 480 220" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
            <style>{`.kab{transition:all .2s}.kl{font-family:system-ui,sans-serif;pointer-events:none;text-anchor:middle;dominant-baseline:central;font-size:8.5px;font-weight:700}`}</style>

            {/* Pohuwato */}
            <g onClick={() => setSel(s => s==='pohuwato' ? null : 'pohuwato')} style={{cursor:'pointer'}}>
              <path className="kab" d="M18,148 L16,112 L26,85 L48,62 L72,50 L100,46 L118,56 L124,78 L120,106 L110,128 L90,142 L62,152 Z"
                style={{fill:f('pohuwato'), opacity:o('pohuwato'), stroke:s('pohuwato'), strokeWidth:sw('pohuwato')}}/>
              <text className="kl" x="70" y="100" fill="white">Pohuwato</text>
            </g>

            {/* Boalemo */}
            <g onClick={() => setSel(s => s==='bonebol' ? null : 'bonebol')} style={{cursor:'pointer'}}>
              <path className="kab" d="M118,56 L124,78 L120,106 L110,128 L136,136 L160,128 L172,108 L168,80 L152,58 L134,50 Z"
                style={{fill:f('bonebol'), opacity:o('bonebol'), stroke:s('bonebol'), strokeWidth:sw('bonebol')}}/>
              <text className="kl" x="144" y="96" fill="white">Boalemo</text>
            </g>

            {/* Kab. Gorontalo */}
            <g onClick={() => setSel(s => s==='gorontalo' ? null : 'gorontalo')} style={{cursor:'pointer'}}>
              <path className="kab" d="M160,128 L172,108 L168,80 L196,74 L218,82 L228,102 L220,124 L200,136 L178,138 Z"
                style={{fill:f('gorontalo'), opacity:o('gorontalo'), stroke:s('gorontalo'), strokeWidth:sw('gorontalo')}}/>
              <text className="kl" x="196" y="106" fill="white">Kab.</text>
              <text className="kl" x="196" y="118" fill="white">Gorontalo</text>
            </g>

            {/* Kota Gorontalo */}
            <g onClick={() => setSel(s => s==='gortalkota' ? null : 'gortalkota')} style={{cursor:'pointer'}}>
              <path className="kab" d="M218,82 L236,78 L244,90 L238,106 L228,102 Z"
                style={{fill:f('gortalkota'), opacity:o('gortalkota'), stroke:s('gortalkota'), strokeWidth:sw('gortalkota')}}/>
              <text className="kl" x="234" y="93" fill="white" fontSize="7">Kota</text>
            </g>

            {/* Bone Bolango */}
            <g onClick={() => setSel(s => s==='bone' ? null : 'bone')} style={{cursor:'pointer'}}>
              <path className="kab" d="M228,102 L238,106 L244,90 L272,86 L300,96 L312,116 L304,138 L280,148 L254,144 L236,130 L220,124 Z"
                style={{fill:f('bone'), opacity:o('bone'), stroke:s('bone'), strokeWidth:sw('bone')}}/>
              <text className="kl" x="270" y="116" fill="white">Bone Bolango</text>
            </g>

            {/* Gorontalo Utara */}
            <g onClick={() => setSel(s => s==='gorut' ? null : 'gorut')} style={{cursor:'pointer'}}>
              <path className="kab" d="M72,50 L100,46 L118,56 L134,50 L152,58 L168,80 L196,74 L218,82 L236,78 L272,86 L308,78 L338,60 L355,40 L340,22 L305,14 L260,10 L215,12 L172,18 L138,26 L108,34 L82,40 Z"
                style={{fill:f('gorut'), opacity:o('gorut'), stroke:s('gorut'), strokeWidth:sw('gorut')}}/>
              <text className="kl" x="215" y="46" fill="white">Gorontalo Utara</text>
            </g>

            <text fontSize="8" fill="#6b7280" fontFamily="system-ui" x="42" y="190">Teluk Tomini</text>
            <text fontSize="8" fill="#6b7280" fontFamily="system-ui" x="155" y="208">Laut Sulawesi</text>
          </svg>
        </div>

        {/* Legend */}
        <div className="lg:w-44 flex-shrink-0">
          <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">6 Kabupaten / Kota</p>
          <div className="space-y-1">
            {kabGorontalo.map(k => (
              <button key={k.id} onClick={() => setSel(s => s===k.id ? null : k.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all border ${sel===k.id ? 'border-[var(--border-lit)] bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)] border-transparent'}`}>
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{backgroundColor: kabColors[k.id]?.fill || '#374151'}} />
                <span className="text-[11px] truncate flex-1 text-[var(--text-secondary)]">{k.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">0 TPS</span>
              </button>
            ))}
          </div>

          {selKab && (
            <div className="mt-3 p-3 rounded-xl border" style={{borderColor: kabColors[selKab.id]?.fill + '40', backgroundColor: kabColors[selKab.id]?.fill + '12'}}>
              <p className="text-xs font-semibold mb-2" style={{color: kabColors[selKab.id]?.fill}}>{selKab.name}</p>
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

      {/* Google Maps embed */}
      {sel && kabColors[sel]?.mapSrc && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--text-primary)] mb-3">
            Peta Google Maps — {kabGorontalo.find(k => k.id === sel)?.name}
          </p>
          <div className="rounded-xl overflow-hidden border border-[var(--border)]">
            <iframe
              src={kabColors[sel].mapSrc}
              width="100%"
              height="320"
              style={{border:0, display:'block'}}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}

      {/* Bar chart DPT */}
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[var(--text-primary)]">Distribusi DPT per Kabupaten/Kota</p>
        </div>
        <div className="flex items-end gap-2" style={{height:'56px'}}>
          {kabGorontalo.map(k => (
            <div key={k.id} onClick={() => setSel(s => s===k.id ? null : k.id)}
              className="flex-1 flex flex-col items-center gap-1 cursor-pointer">
              <div className="w-full rounded-t-sm transition-opacity" style={{
                height:'40px',
                backgroundColor: kabColors[k.id]?.fill || '#374151',
                opacity: sel === null ? 0.6 : sel === k.id ? 1 : 0.2,
              }}/>
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
