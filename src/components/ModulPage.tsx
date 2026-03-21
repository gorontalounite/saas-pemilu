'use client'
import { useState } from 'react'
import { modulData, modulFields, kabGorontalo } from '@/lib/data'
import {
  Users, Map, Megaphone, ClipboardCheck, BarChart2,
  Wallet, Radio, Heart, UserCircle, LayoutDashboard,
  ArrowLeft, Upload, ChevronDown, ChevronUp, X, BarChart
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  m0:LayoutDashboard, m9:UserCircle, m1:Users, m2:Map,
  m3:Megaphone, m4:ClipboardCheck, m5:BarChart2,
  m6:Wallet, m7:Radio, m8:Heart,
}
const colorTextMap: Record<string,string> = {
  indigo:'text-indigo-400', purple:'text-purple-400', green:'text-green-400',
  sky:'text-sky-400', pink:'text-pink-400', orange:'text-orange-400',
  teal:'text-teal-400', amber:'text-amber-400', red:'text-red-400',
}
const colorBgMap: Record<string,string> = {
  indigo:'bg-indigo-500/10 border-indigo-500/25', purple:'bg-purple-500/10 border-purple-500/25',
  green:'bg-green-500/10 border-green-500/25', sky:'bg-sky-500/10 border-sky-500/25',
  pink:'bg-pink-500/10 border-pink-500/25', orange:'bg-orange-500/10 border-orange-500/25',
  teal:'bg-teal-500/10 border-teal-500/25', amber:'bg-amber-500/10 border-amber-500/25',
  red:'bg-red-500/10 border-red-500/25',
}
const colorDotMap: Record<string,string> = {
  indigo:'bg-indigo-400', purple:'bg-purple-400', green:'bg-green-400',
  sky:'bg-sky-400', pink:'bg-pink-400', orange:'bg-orange-400',
  teal:'bg-teal-400', amber:'bg-amber-400', red:'bg-red-400',
}
const typeBadge: Record<string,string> = {
  uuid:'bg-gray-500/15 text-gray-400',
  text:'bg-blue-500/15 text-blue-400',
  'text[]':'bg-blue-500/15 text-blue-400',
  integer:'bg-green-500/15 text-green-400',
  bigint:'bg-green-500/15 text-green-400',
  decimal:'bg-green-500/15 text-green-400',
  boolean:'bg-purple-500/15 text-purple-400',
  date:'bg-amber-500/15 text-amber-400',
  time:'bg-amber-500/15 text-amber-400',
  timestamptz:'bg-amber-500/15 text-amber-400',
  enum:'bg-pink-500/15 text-pink-400',
  'enum[]':'bg-pink-500/15 text-pink-400',
  file:'bg-orange-500/15 text-orange-400',
  'file[]':'bg-orange-500/15 text-orange-400',
  jsonb:'bg-teal-500/15 text-teal-400',
  'jsonb[]':'bg-teal-500/15 text-teal-400',
  'uuid[]':'bg-gray-500/15 text-gray-400',
  point:'bg-red-500/15 text-red-400',
}

// ── Upload Panel ────────────────────────────────────────────────────────────────
function UploadPanel({ moduleName }: { moduleName: string }) {
  const [files, setFiles] = useState<File[]>([])
  const [show, setShow] = useState(false)

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return
    setFiles(prev => [...prev, ...Array.from(fl)])
  }

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full flex items-center gap-2 border border-dashed border-[var(--border-lit)] rounded-xl p-4 hover:border-indigo-500/40 hover:bg-indigo-500/4 transition-all text-[var(--text-muted)] hover:text-indigo-400"
      >
        <Upload size={16} />
        <span className="text-xs font-medium">Upload Data ke {moduleName}</span>
        <span className="ml-auto text-[10px] bg-[var(--bg-hover)] px-2 py-0.5 rounded">jpg · png · mp4 · pdf · docx · xlsx · csv</span>
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-[var(--text-primary)]">Upload Data — {moduleName}</h4>
        <button onClick={() => setShow(false)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"><X size={14} /></button>
      </div>

      <div
        className="border-2 border-dashed border-[var(--border-lit)] rounded-lg p-6 text-center hover:border-indigo-500/50 transition-colors cursor-pointer"
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        onClick={() => document.getElementById('file-input-hidden')?.click()}
      >
        <Upload size={22} className="text-[var(--text-muted)] mx-auto mb-2" />
        <p className="text-xs text-[var(--text-secondary)]">Drag & drop atau klik untuk pilih file</p>
        <p className="text-[10px] text-[var(--text-muted)] mt-1">Maks. 50MB per file</p>
        <input
          id="file-input-hidden" type="file" multiple className="hidden"
          accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,.pdf,.doc,.docx,.xls,.xlsx,.csv,.zip"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-[var(--bg-hover)] rounded-lg px-3 py-2">
              <span className="text-[11px] text-[var(--text-primary)] flex-1 truncate">{f.name}</span>
              <span className="text-[10px] text-[var(--text-muted)]">{(f.size/1024/1024).toFixed(1)} MB</span>
              <button onClick={() => setFiles(p => p.filter((_,j) => j !== i))} className="text-[var(--text-muted)] hover:text-red-400">
                <X size={12} />
              </button>
            </div>
          ))}
          <div className="mt-2">
            <select className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] outline-none mb-2">
              <option>Pilih kategori data...</option>
              <option>Data relawan</option><option>Data pemilih / DPT</option><option>Foto kegiatan</option>
              <option>Video kampanye</option><option>Dokumen legal</option><option>Laporan keuangan</option>
              <option>Materi kampanye</option><option>Data survei</option><option>Form C1</option><option>Lainnya</option>
            </select>
            <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-2 rounded-lg transition-colors font-medium">
              Upload {files.length} File
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Field Table ─────────────────────────────────────────────────────────────────
function FieldSection({ section, fields, color }: { section: string; fields: any[]; color: string }) {
  const [open, setOpen] = useState(false)
  const dot = colorDotMap[color] || 'bg-indigo-400'

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-hover)] hover:bg-[var(--border)] transition-colors text-left"
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
        <span className="text-xs font-semibold text-[var(--text-primary)] flex-1">{section}</span>
        <span className="text-[10px] text-[var(--text-muted)] mr-2">{fields.length} field</span>
        {open ? <ChevronUp size={13} className="text-[var(--text-muted)]" /> : <ChevronDown size={13} className="text-[var(--text-muted)]" />}
      </button>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide w-48">Field</th>
                <th className="text-left px-4 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide w-32">Tipe</th>
                <th className="text-left px-4 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f, i) => (
                <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors">
                  <td className="px-4 py-2.5 font-mono text-[11px] text-[var(--text-secondary)]">{f.name}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-medium ${typeBadge[f.type] || 'bg-gray-500/15 text-gray-400'}`}>
                      {f.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Gorontalo Map for Modul 2 ───────────────────────────────────────────────────
function GorontaloMapM2() {
  const [sel, setSel] = useState<string|null>(null)
  const kc = (id: string) =>
    sel === id
      ? 'fill-indigo-500 stroke-indigo-300'
      : 'fill-[var(--bg-hover)] stroke-[var(--border-lit)] hover:fill-indigo-500/20 hover:stroke-indigo-400 cursor-pointer'

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Peta TPS — Provinsi Gorontalo</h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Klik wilayah untuk input data TPS & DPT</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <svg viewBox="0 0 520 200" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
          <style>{`.kab2{transition:fill .15s,stroke .15s;stroke-width:1.2}.kl2{font-family:'DM Sans',sans-serif;font-size:8px;pointer-events:none;text-anchor:middle;dominant-baseline:central}`}</style>
          <g onClick={() => setSel(s => s==='pohuwato'?null:'pohuwato')}><path className={`kab2 ${kc('pohuwato')}`} d="M20,85 L22,55 L50,32 L88,28 L100,45 L105,75 L95,90 L70,95 L45,98 Z"/><text className="kl2" x="62" y="65" fill="var(--text-secondary)">Pohuwato</text></g>
          <g onClick={() => setSel(s => s==='bonebol'?null:'bonebol')}><path className={`kab2 ${kc('bonebol')}`} d="M100,45 L105,75 L95,90 L128,98 L148,92 L158,72 L152,48 L130,35 Z"/><text className="kl2" x="130" y="70" fill="var(--text-secondary)">Boalemo</text></g>
          <g onClick={() => setSel(s => s==='gorontalo'?null:'gorontalo')}><path className={`kab2 ${kc('gorontalo')}`} d="M148,92 L158,72 L195,68 L215,78 L224,98 L212,116 L188,124 L162,112 Z"/><text className="kl2" x="190" y="96" fill="var(--text-secondary)">Kab. Gorontalo</text></g>
          <g onClick={() => setSel(s => s==='gortalkota'?null:'gortalkota')}><path className={`kab2 ${kc('gortalkota')}`} d="M215,78 L234,74 L244,88 L232,102 L224,98 Z"/><text className="kl2" x="230" y="89" style={{fontSize:'7px'}} fill="var(--text-secondary)">Kota</text></g>
          <g onClick={() => setSel(s => s==='bone'?null:'bone')}><path className={`kab2 ${kc('bone')}`} d="M224,98 L244,88 L285,86 L315,98 L325,118 L305,136 L272,140 L248,128 Z"/><text className="kl2" x="276" y="112" fill="var(--text-secondary)">Bone Bolango</text></g>
          <g onClick={() => setSel(s => s==='gorut'?null:'gorut')}><path className={`kab2 ${kc('gorut')}`} d="M88,28 L100,45 L130,35 L152,48 L195,68 L215,78 L234,74 L285,86 L315,78 L355,62 L375,42 L360,22 L320,14 L258,10 L195,12 L148,18 L115,24 Z"/><text className="kl2" x="224" y="44" fill="var(--text-secondary)">Gorontalo Utara</text></g>
          <text style={{fontSize:'9px',fill:'var(--text-muted)',fontFamily:'DM Sans,sans-serif'}} x="50" y="155">Teluk Tomini</text>
        </svg>

        {/* Stats per kab */}
        <div className="flex-1 space-y-2">
          {kabGorontalo.map(k => (
            <div key={k.id} className={`p-3 rounded-lg border transition-colors cursor-pointer ${sel===k.id ? 'border-indigo-500/30 bg-indigo-500/8' : 'border-[var(--border)] bg-[var(--bg-hover)] hover:border-[var(--border-lit)]'}`}
              onClick={() => setSel(s => s===k.id?null:k.id)}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--text-primary)]">{k.name}</span>
                {sel===k.id && <span className="text-[10px] text-indigo-400">Dipilih</span>}
              </div>
              <div className="flex gap-4 mt-1.5">
                <div><p className="text-[10px] text-[var(--text-muted)]">DPT</p><p className="text-xs font-semibold text-[var(--text-secondary)]">—</p></div>
                <div><p className="text-[10px] text-[var(--text-muted)]">TPS</p><p className="text-xs font-semibold text-[var(--text-secondary)]">—</p></div>
                <div><p className="text-[10px] text-[var(--text-muted)]">Target suara</p><p className="text-xs font-semibold text-[var(--text-secondary)]">—</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="mt-4 border-t border-[var(--border)] pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-[var(--text-primary)]">Distribusi DPT per Kabupaten/Kota</h4>
          <BarChart size={14} className="text-[var(--text-muted)]" />
        </div>
        <div className="flex items-end gap-2 h-20">
          {kabGorontalo.map((k) => (
            <div key={k.id} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-t-md" style={{height:'60px'}} />
              <span className="text-[8px] text-[var(--text-muted)] text-center leading-tight">{k.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">Chart akan terisi setelah data DPT diimport</p>
      </div>
    </div>
  )
}

// ── Konstituen Panel for Modul 8 ────────────────────────────────────────────────
function KonstituenPanel() {
  const cats = [
    { id:'dpt',            label:'DPT',              count:0, color:'indigo' },
    { id:'potensi',        label:'Potensi Pemilih',  count:0, color:'green'  },
    { id:'kawan',          label:'Daftar Kawan',     count:0, color:'teal'   },
    { id:'relasi',         label:'Daftar Relasi',    count:0, color:'purple' },
    { id:'tokoh',          label:'Tokoh Masyarakat', count:0, color:'amber'  },
    { id:'mantan_relawan', label:'Mantan Relawan',   count:0, color:'pink'   },
  ]

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Database Konstituen</h3>
        <div className="flex gap-2">
          <button className="text-[10px] bg-[var(--bg-hover)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
            <Upload size={10} /> Import Excel/CSV
          </button>
          <button className="text-[10px] bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors">
            + Tambah Manual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {cats.map(c => (
          <div key={c.id} className={`p-3 rounded-xl border ${colorBgMap[c.color] || colorBgMap.indigo} cursor-pointer hover:opacity-80 transition-opacity`}>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{c.count}</p>
            <p className={`text-[11px] font-medium mt-1 ${colorTextMap[c.color] || colorTextMap.indigo}`}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="border border-dashed border-[var(--border-lit)] rounded-xl p-6 text-center">
        <Users size={28} className="text-[var(--text-muted)] mx-auto mb-2" />
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">Belum ada data konstituen</p>
        <p className="text-[11px] text-[var(--text-muted)]">Upload file DPT dari KPU atau tambah satu per satu</p>
        <p className="text-[10px] text-[var(--text-muted)] mt-1">Format yang diterima: XLS, XLSX, CSV</p>
      </div>
    </div>
  )
}

// ── Main ModulPage ──────────────────────────────────────────────────────────────
interface Props { modulId: string; onBack: () => void }

export default function ModulPage({ modulId, onBack }: Props) {
  const modul = modulData.find(m => m.id === modulId)
  if (!modul) return null

  const Icon = iconMap[modulId] || LayoutDashboard
  const sections = modulFields[modulId] || []
  const isStandby = modul.status === 'standby'
  const totalFields = sections.reduce((acc, s) => acc + s.fields.length, 0)

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className={`rounded-xl border p-5 ${colorBgMap[modul.color]}`}>
        <div className="flex items-start gap-4 flex-wrap">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${colorBgMap[modul.color]}`}>
            <Icon size={22} className={colorTextMap[modul.color]} />
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

      {/* Konstituen khusus */}
      {modulId === 'm8' && <KonstituenPanel />}

      {/* Peta Gorontalo khusus Modul 2 */}
      {modulId === 'm2' && <GorontaloMapM2 />}

      {/* Upload Panel */}
      <UploadPanel moduleName={modul.name} />

      {/* Status card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-lg">🔨</div>
        <div>
          <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">Modul dalam pengembangan</p>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Semua <strong>{totalFields}</strong> field database ({sections.length} section) sudah dirancang di bawah.
            Upload data sudah aktif. Fitur CRUD lengkap menyusul di sprint berikutnya.
          </p>
        </div>
      </div>

      {/* Field sections */}
      {sections.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Schema Database — {totalFields} field</h3>
            <span className="text-[10px] text-[var(--text-muted)]">Klik section untuk expand</span>
          </div>
          <div className="space-y-2">
            {sections.map((s, i) => (
              <FieldSection key={i} section={s.section} fields={s.fields} color={modul.color} />
            ))}
          </div>
        </div>
      )}

      {/* Tech stack */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-3">Tech stack</h3>
        <div className="flex flex-wrap gap-2">
          {['Next.js 14','TypeScript','Tailwind CSS','Supabase','PostgreSQL + PostGIS','Redis','Socket.io','React Native (Expo)','WhatsApp API','Leaflet.js'].map(t => (
            <span key={t} className="text-[10px] font-mono bg-[var(--bg-hover)] text-[var(--text-muted)] px-2.5 py-1 rounded-md border border-[var(--border)]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
