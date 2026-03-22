'use client'
import { useState } from 'react'
import { modulData } from '@/lib/data'
import {
  ArrowLeft, Database, ChevronDown, ChevronUp,
  Users, Map, Megaphone, ClipboardCheck, BarChart2,
  Wallet, Radio, Heart, UserCircle, LayoutDashboard,
  BarChart, PieChart, TrendingUp, Table2
} from 'lucide-react'

const iconMap: Record<string,React.ElementType> = {
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
const typeBadge: Record<string,string> = {
  uuid:'bg-[var(--bg-hover)] text-[var(--text-muted)]',
  'uuid[]':'bg-[var(--bg-hover)] text-[var(--text-muted)]',
  text:'bg-blue-500/12 text-blue-400', 'text[]':'bg-blue-500/12 text-blue-400',
  integer:'bg-green-500/12 text-green-400', bigint:'bg-green-500/12 text-green-400',
  decimal:'bg-green-500/12 text-green-400', boolean:'bg-purple-500/12 text-purple-400',
  date:'bg-amber-500/12 text-amber-400', time:'bg-amber-500/12 text-amber-400',
  timestamptz:'bg-amber-500/12 text-amber-400',
  enum:'bg-pink-500/12 text-pink-400', 'enum[]':'bg-pink-500/12 text-pink-400',
  file:'bg-orange-500/12 text-orange-400', 'file[]':'bg-orange-500/12 text-orange-400',
  jsonb:'bg-teal-500/12 text-teal-400', 'jsonb[]':'bg-teal-500/12 text-teal-400',
  point:'bg-red-500/12 text-red-400',
}

// ── Empty chart placeholder per modul ──────────────────────────────────────────
function EmptyChart({ type, label }: { type: 'bar'|'pie'|'line'; label: string }) {
  const Icon = type === 'bar' ? BarChart : type === 'pie' ? PieChart : TrendingUp
  return (
    <div className="border border-dashed border-[var(--border-lit)] rounded-xl p-6 text-center">
      <Icon size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
      <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
      <p className="text-[10px] text-[var(--text-muted)] mt-1">Chart tersedia setelah data diinput</p>
    </div>
  )
}

// ── Empty table placeholder ─────────────────────────────────────────────────────
function EmptyTable({ columns }: { columns: string[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-hover)]">
            {columns.map(c => (
              <th key={c} className="text-left px-4 py-2.5 text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} className="px-4 py-8 text-center text-[11px] text-[var(--text-muted)]">
              <Table2 size={20} className="mx-auto mb-2 text-[var(--text-muted)]" />
              Belum ada data. Input data melalui halaman modul masing-masing.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ── Schema accordion per modul ──────────────────────────────────────────────────
function ModulSchema({ modul }: { modul: typeof modulData[0] }) {
  const [open, setOpen] = useState(false)
  const sections = []
  const totalFields = sections.reduce((a: number, s: any) => a + s.fields.length, 0)
  const Icon = iconMap[modul.id] || LayoutDashboard

  return (
    <div className={`rounded-xl border overflow-hidden ${colorBg[modul.color]}`}>
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-black/5 transition-colors">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorBg[modul.color]} border`}>
          <Icon size={15} className={colorText[modul.color]} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">{modul.num}</span>
            <span className="text-xs font-semibold text-[var(--text-primary)]">{modul.name}</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{sections.length} section · {totalFields} field</p>
        </div>
        <span className="text-[10px] bg-[var(--bg-hover)] text-[var(--text-muted)] px-2 py-0.5 rounded mr-2">0 record</span>
        {open ? <ChevronUp size={14} className="text-[var(--text-muted)] flex-shrink-0" /> : <ChevronDown size={14} className="text-[var(--text-muted)] flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-card)]">
          {/* Charts area */}
          <div className="p-4 border-b border-[var(--border)]">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Visualisasi Data</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {modul.id === 'm1' && <>
                <EmptyChart type="bar" label="Relawan per Wilayah" />
                <EmptyChart type="pie" label="Distribusi Level Hierarki" />
                <EmptyChart type="line" label="Tren Rekrutmen Harian" />
              </>}
              {modul.id === 'm2' && <>
                <EmptyChart type="bar" label="DPT per Kabupaten/Kota" />
                <EmptyChart type="pie" label="Segmentasi Status Dukungan" />
                <EmptyChart type="bar" label="Coverage Canvassing per TPS" />
              </>}
              {modul.id === 'm3' && <>
                <EmptyChart type="bar" label="Konten per Platform" />
                <EmptyChart type="line" label="Tren Sentimen Sosmed" />
                <EmptyChart type="pie" label="Status Approval Konten" />
              </>}
              {modul.id === 'm4' && <>
                <EmptyChart type="bar" label="Suara per Kabupaten" />
                <EmptyChart type="line" label="Progress Upload C1 Real-time" />
                <EmptyChart type="pie" label="Status Kehadiran Saksi" />
              </>}
              {modul.id === 'm5' && <>
                <EmptyChart type="line" label="Tren Elektabilitas Harian" />
                <EmptyChart type="bar" label="Distribusi Responden per Wilayah" />
                <EmptyChart type="pie" label="Isu Prioritas Warga" />
              </>}
              {modul.id === 'm6' && <>
                <EmptyChart type="bar" label="Realisasi vs Anggaran per Pos" />
                <EmptyChart type="line" label="Cash Flow Kampanye" />
                <EmptyChart type="pie" label="Alokasi per Wilayah" />
              </>}
              {modul.id === 'm7' && <>
                <EmptyChart type="line" label="Jumlah Isu per Hari" />
                <EmptyChart type="bar" label="Alert per Level" />
                <EmptyChart type="pie" label="Status Penanganan Isu" />
              </>}
              {modul.id === 'm8' && <>
                <EmptyChart type="bar" label="Konstituen per Kategori" />
                <EmptyChart type="pie" label="Aspirasi per Sektor" />
                <EmptyChart type="bar" label="Konstituen per Kab/Kota" />
              </>}
              {modul.id === 'm9' && <>
                <EmptyChart type="bar" label="Program Kerja per Sektor" />
                <EmptyChart type="line" label="Tracker Janji vs Realisasi" />
                <EmptyChart type="pie" label="Jadwal per Jenis Kegiatan" />
              </>}
              {(modul.id === 'm0') && (
                <div className="col-span-3 text-center py-4 text-[11px] text-[var(--text-muted)]">Dashboard Master tidak memiliki data tersendiri — merupakan agregasi dari semua modul.</div>
              )}
            </div>
          </div>

          {/* Schema tables per section */}
          <div className="p-4">
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Schema Database</p>
            <div className="space-y-3">
              {sections.map((s: any, si: number) => (
                <div key={si} className="rounded-lg border border-[var(--border)] overflow-hidden">
                  <div className="px-3 py-2 bg-[var(--bg-hover)] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{s.section}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">{s.fields.length} field · 0 record</span>
                  </div>
                  {/* Data table (empty) */}
                  <EmptyTable columns={s.fields.slice(0,5).map((f: any) => f.name)} />
                  {/* Field schema */}
                  <details className="group">
                    <summary className="px-3 py-2 text-[10px] text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] border-t border-[var(--border)] list-none flex items-center gap-1">
                      <span className="group-open:hidden">▶ Lihat schema ({s.fields.length} field)</span>
                      <span className="hidden group-open:inline">▼ Sembunyikan schema</span>
                    </summary>
                    <div className="overflow-x-auto border-t border-[var(--border)]">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="border-b border-[var(--border)] bg-[var(--bg-hover)]">
                            <th className="text-left px-3 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase">Keterangan</th>
                            <th className="text-left px-3 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase w-36">Field</th>
                            <th className="text-left px-3 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase w-24">Tipe</th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.fields.map((f: any, fi: number) => (
                            <tr key={fi} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]">
                              <td className="px-3 py-2 text-[var(--text-secondary)]">{f.desc}</td>
                              <td className="px-3 py-2 font-mono text-[10px] text-[var(--text-muted)]">{f.name}</td>
                              <td className="px-3 py-2">
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${typeBadge[f.type] || 'bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>{f.type}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ────────────────────────────────────────────────────────────────────────
interface Props { onBack: () => void }

export default function DatabaseCenter({ onBack }: Props) {
  const [filter, setFilter] = useState<string>('all')
  const modules = modulData.filter(m => m.id !== 'm0')
  const totalFields = modules.reduce((acc, m) => {
    const secs = []
    return acc + secs.reduce((a: number, s: any) => a + s.fields.length, 0)
  }, 0)

  const filtered = filter === 'all' ? modules : modules.filter(m => m.id === filter)

  return (
    <div className="space-y-5 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
            <Database size={22} className="text-teal-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-[var(--text-primary)] mb-1">Database Center</h1>
            <p className="text-sm text-[var(--text-secondary)]">Pusat data seluruh modul — schema, record, dan visualisasi dalam satu halaman</p>
            <div className="flex gap-4 mt-2">
              <span className="text-[11px] text-[var(--text-muted)]">{modules.length} modul</span>
              <span className="text-[11px] text-[var(--text-muted)]">{totalFields} field terdefinisi</span>
              <span className="text-[11px] text-[var(--text-muted)]">0 total record</span>
              <span className="text-[11px] text-amber-400">⚡ Supabase belum terhubung</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Modul',   val: modules.length,  color:'teal'   },
          { label:'Total Field',   val: totalFields,      color:'indigo' },
          { label:'Total Record',  val: 0,                color:'green'  },
          { label:'Supabase',      val: 'Offline',        color:'amber'  },
        ].map((s,i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-[10px] text-[var(--text-muted)] mb-1.5">{s.label}</p>
            <p className={`text-xl font-bold text-${s.color}-400`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[var(--text-muted)]">Filter:</span>
        <button onClick={() => setFilter('all')}
          className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors ${filter==='all' ? 'bg-teal-500/15 border-teal-500/25 text-teal-300' : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'}`}>
          Semua
        </button>
        {modules.map(m => (
          <button key={m.id} onClick={() => setFilter(m.id)}
            className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors ${filter===m.id ? `bg-${m.color}-500/15 border-${m.color}-500/25 text-${m.color}-300` : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'}`}>
            {m.num}·{m.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Modul schemas */}
      <div className="space-y-3">
        {filtered.map(m => <ModulSchema key={m.id} modul={m} />)}
      </div>

      {/* Supabase CTA */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">⚡</div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Hubungkan Supabase untuk mengaktifkan Database</p>
            <p className="text-xs text-[var(--text-secondary)]">Semua {totalFields} field sudah terdefinisi dan siap di-migrate ke PostgreSQL. Setelah Supabase terhubung, data akan mengalir otomatis ke semua chart dan tabel di halaman ini.</p>
            <div className="flex gap-2 mt-3">
              <button className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">Setup Supabase</button>
              <button className="text-xs bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-4 py-2 rounded-lg transition-colors">Lihat dokumentasi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
