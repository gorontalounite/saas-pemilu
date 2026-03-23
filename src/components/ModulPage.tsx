'use client'
import { modulData } from '@/lib/data'
import {
  Users, Map, Megaphone, ClipboardCheck, BarChart2,
  Wallet, Radio, Heart, UserCircle, LayoutDashboard,
  Construction, ArrowLeft, Zap
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  m0: LayoutDashboard, m9: UserCircle, m1: Users, m2: Map,
  m3: Megaphone, m4: ClipboardCheck, m5: BarChart2,
  m6: Wallet, m7: Radio, m8: Heart,
}

const colorTextMap: Record<string, string> = {
  indigo: 'text-indigo-400', purple: 'text-purple-400',
  green:  'text-green-400',  sky:    'text-sky-400',
  pink:   'text-pink-400',   orange: 'text-orange-400',
  teal:   'text-teal-400',   amber:  'text-amber-400',
  red:    'text-red-400',
}
const colorBgMap: Record<string, string> = {
  indigo: 'bg-indigo-500/10 border-indigo-500/25',
  purple: 'bg-purple-500/10 border-purple-500/25',
  green:  'bg-green-500/10 border-green-500/25',
  sky:    'bg-sky-500/10 border-sky-500/25',
  pink:   'bg-pink-500/10 border-pink-500/25',
  orange: 'bg-orange-500/10 border-orange-500/25',
  teal:   'bg-teal-500/10 border-teal-500/25',
  amber:  'bg-amber-500/10 border-amber-500/25',
  red:    'bg-red-500/10 border-red-500/25',
}

const fiturList: Record<string, string[]> = {
  m9: ['Profil lengkap paslon', 'Visi, misi & narasi kampanye', 'Program kerja terstruktur', 'Knowledge base persiapan debat', 'Analisis profil kompetitor', 'Dokumen legal kampanye', 'Rekam jejak petahana', 'Tracker janji vs realisasi', 'Portofolio proyek & kebijakan', 'Gap analysis persepsi vs kenyataan'],
  m1: ['Database relawan terpusat', 'Hierarki tim & role-based access', 'Absensi via QR code & GPS', 'Distribusi tugas & task management', 'Laporan harian relawan', 'Manajemen posko & logistik', 'Broadcast WA ke relawan', 'Gamifikasi & poin relawan', 'Rekrutmen & onboarding digital', 'Tracking mobilisasi hari-H', 'Surat tugas digital + e-signature', 'Analitik performa tim lapangan'],
  m2: ['Peta TPS interaktif', 'Import & manajemen DPT', 'Segmentasi & profiling pemilih', 'Heatmap dukungan per wilayah', 'Analisis hasil Pemilu sebelumnya', 'Target suara per TPS', 'Canvassing digital door-to-door', 'Analisis swing voter & undecided', 'Prediksi perolehan suara', 'Overlay data sosiodemografi', 'Manajemen pemilih khusus'],
  m3: ['Kalender konten terpadu', 'Library aset kampanye', 'Monitoring sentimen sosmed', 'Approval workflow konten', 'Dashboard analitik iklan Meta & TikTok', 'Tracking berita & media monitoring', 'Manajemen influencer & buzzer', 'Analisis kompetitor digital', 'AI generator konten kampanye', 'Deteksi isu viral & crisis management'],
  m4: ['Database & penugasan saksi TPS', 'Upload & digitasi form C1', 'Dashboard quick count real-time', 'Peta sebaran suara real-time', 'Status & komunikasi saksi hari-H', 'Deteksi anomali & kecurangan', 'Laporan pelanggaran TPS', 'Rekap & ekspor hasil akhir'],
  m5: ['Builder survei internal', 'Distribusi via link & WhatsApp', 'Dashboard hasil survei real-time', 'Tracking elektabilitas harian', 'Survei isu & kebutuhan warga', 'Segmentasi responden otomatis', 'Simulasi penghitungan suara', 'Benchmarking vs lembaga eksternal'],
  m6: ['Master budget kampanye', 'RAB per kegiatan kampanye', 'Proyeksi cash flow kampanye', 'Alokasi anggaran per wilayah', 'Dashboard realisasi vs anggaran', 'Sistem approval bertingkat', 'Cost per vote analysis', 'Deteksi anomali pengeluaran', 'Manajemen vendor & kontrak', 'Pencatatan sumber dana & penyumbang', 'Generate LPPDK otomatis format KPU', 'Rekonsiliasi kas fisik vs digital', 'Kalender deadline pelaporan KPU', 'Audit trail & histori lengkap'],
  m7: ['Dashboard eksekutif 60 detik', 'Laporan situasi harian otomatis', 'Manajemen jadwal kandidat', 'Alert & notifikasi kritikal', 'Manajemen isu & respons krisis', 'Crisis room hari-H (mode penuh)', 'Manajemen akses & audit log', 'Laporan pasca-kampanye'],
  m8: ['CRM konstituen', 'Portal aspirasi warga', 'Laporan kinerja legislatif', 'Manajemen program & bantuan sosial', 'Manajemen reses & kunjungan', 'Koneksi ke kampanye berikutnya'],
}

interface ModulPageProps {
  modulId: string
  onBack: () => void
}

export default function ModulPage({ modulId, onBack }: ModulPageProps) {
  const modul = modulData.find(m => m.id === modulId)
  if (!modul) return null

  const Icon = iconMap[modulId] || LayoutDashboard
  const fitur = fiturList[modulId] || []
  const isLocked = modul.status === 'locked'
  const isStandby = modul.status === 'standby'

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Back + Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] mb-4 transition-colors"
        >
          <ArrowLeft size={13} /> Kembali ke Dashboard
        </button>

        <div className={`rounded-xl border p-5 ${colorBgMap[modul.color]}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorBgMap[modul.color]}`}>
              <Icon size={22} className={colorTextMap[modul.color]} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-mono text-[var(--text-muted)]">{modul.num}</span>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">{modul.name}</h2>
                {isLocked && <span className="text-[10px] bg-[var(--bg-hover)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">Pasca pemilu</span>}
                {isStandby && <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">Aktif hari-H</span>}
                {modul.alerts > 0 && (
                  <span className="text-[10px] bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full">{modul.alerts} alert</span>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{modul.desc}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{modul.stats}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Under Construction Notice */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Construction size={20} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Input & edit data melalui Database Center</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Data modul ini dikelola melalui Database Center. Klik ikon database di topbar untuk input, edit, upload CSV, dan publish data.
            </p>
          </div>
        </div>
      </div>

      {/* Feature list */}
      {fitur.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            {fitur.length} fitur direncanakan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fitur.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--bg-hover)]">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colorBarMap[modul.color] || 'bg-indigo-400'}`} />
                <span className="text-xs text-[var(--text-secondary)]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stack info */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Tech stack modul ini</h3>
        <div className="flex flex-wrap gap-2">
          {['Next.js 14', 'TypeScript', 'Supabase', 'Tailwind CSS', 'React Native', 'PostgreSQL', 'Redis', 'Socket.io'].map(t => (
            <span key={t} className="text-[11px] font-mono bg-[var(--bg-hover)] text-[var(--text-muted)] px-2.5 py-1 rounded-md border border-[var(--border)]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const colorBarMap: Record<string, string> = {
  indigo: 'bg-indigo-400', purple: 'bg-purple-400',
  green:  'bg-green-400',  sky:    'bg-sky-400',
  pink:   'bg-pink-400',   orange: 'bg-orange-400',
  teal:   'bg-teal-400',   amber:  'bg-amber-400',
  red:    'bg-red-400',
}
