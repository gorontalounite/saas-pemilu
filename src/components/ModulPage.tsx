'use client'
import { useState } from 'react'
import { modulData, modulFields, kabGorontalo } from '@/lib/data'
import {
  Users, Map, Megaphone, ClipboardCheck, BarChart2,
  Wallet, Radio, Heart, UserCircle, LayoutDashboard,
  ArrowLeft, Upload, ChevronDown, ChevronUp, X,
  Edit3, Send, Plus, FileText, BarChart, Check
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
const colorDot: Record<string,string> = {
  indigo:'bg-indigo-400', purple:'bg-purple-400', green:'bg-green-400',
  sky:'bg-sky-400', pink:'bg-pink-400', orange:'bg-orange-400',
  teal:'bg-teal-400', amber:'bg-amber-400', red:'bg-red-400',
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

function UploadModal({ onClose, moduleName }: { onClose: () => void; moduleName: string }) {
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fl: FileList | null) => { if (fl) setFiles(p => [...p, ...Array.from(fl)]) }
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Upload Data — {moduleName}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center"><X size={13} className="text-[var(--text-secondary)]" /></button>
        </div>
        <div className="border-2 border-dashed border-[var(--border-lit)] rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500/40 transition-all mb-3"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
          onClick={() => document.getElementById('up-inp')?.click()}>
          <Upload size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">Drag & drop atau klik untuk pilih</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">jpg · png · mp4 · pdf · docx · xlsx · csv</p>
          <input id="up-inp" type="file" multiple className="hidden"
            accept=".jpg,.jpeg,.png,.mp4,.pdf,.doc,.docx,.xls,.xlsx,.csv"
            onChange={e => handleFiles(e.target.files)} />
        </div>
        {files.length > 0 && (
          <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-[var(--bg-hover)] rounded-lg px-3 py-2">
                <FileText size={12} className="text-[var(--text-muted)] flex-shrink-0" />
                <span className="text-[11px] text-[var(--text-primary)] flex-1 truncate">{f.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{(f.size/1024/1024).toFixed(1)}MB</span>
                <button onClick={() => setFiles(p => p.filter((_,j)=>j!==i))}><X size={11} className="text-[var(--text-muted)] hover:text-red-400" /></button>
              </div>
            ))}
          </div>
        )}
        <select className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] outline-none mb-2">
          <option value="">Pilih kategori...</option>
          {['Data relawan','Data pemilih / DPT','Foto kegiatan','Video kampanye','Dokumen legal','Laporan keuangan','Materi kampanye','Data survei','Form C1','Lainnya'].map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg py-2 text-xs text-[var(--text-secondary)]">Batal</button>
          <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
            <Upload size={11} /> Upload {files.length > 0 ? `(${files.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

function EditModal({ section, fields, onClose }: { section: string; fields: any[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Edit — {section}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center"><X size={13} className="text-[var(--text-secondary)]" /></button>
        </div>
        <div className="space-y-3">
          {fields.slice(0,8).map((f, i) => (
            <div key={i}>
              <label className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wide block mb-1">
                {f.name} — <span className="normal-case font-normal">{f.desc}</span>
              </label>
              {f.type === 'boolean' ? (
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">Ya</button>
                  <button className="px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--text-secondary)]">Tidak</button>
                </div>
              ) : f.type === 'file' || f.type === 'file[]' ? (
                <div className="border border-dashed border-[var(--border-lit)] rounded-lg px-3 py-2.5 text-[11px] text-[var(--text-muted)] cursor-pointer hover:border-indigo-500/30 flex items-center gap-2">
                  <Upload size={12} /> Klik untuk upload
                </div>
              ) : f.type === 'enum' || f.type === 'enum[]' ? (
                <select className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500">
                  <option>Pilih...</option>
                </select>
              ) : (
                <input placeholder={f.desc}
                  className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)]" />
              )}
            </div>
          ))}
          {fields.length > 8 && <p className="text-[10px] text-[var(--text-muted)] text-center">+{fields.length - 8} field lainnya tersedia setelah Supabase terhubung</p>}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg py-2 text-xs text-[var(--text-secondary)]">Batal</button>
          <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
            <Check size={11} /> Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldSection({ section, fields, color, moduleName }: { section: string; fields: any[]; color: string; moduleName: string }) {
  const [open, setOpen] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [published, setPublished] = useState(false)
  const hasFile = fields.some(f => f.type === 'file' || f.type === 'file[]')
  return (
    <>
      {showEdit && <EditModal section={section} fields={fields} onClose={() => setShowEdit(false)} />}
      {showUpload && <UploadModal moduleName={moduleName + ' — ' + section} onClose={() => setShowUpload(false)} />}
      <div className="border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-hover)]">
          <button onClick={() => setOpen(p => !p)} className="flex items-center gap-2 flex-1 text-left min-w-0">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colorDot[color] || 'bg-indigo-400'}`} />
            <span className="text-xs font-semibold text-[var(--text-primary)] truncate flex-1">{section}</span>
            <span className="text-[10px] text-[var(--text-muted)] mr-1 flex-shrink-0">{fields.length} field</span>
            {open ? <ChevronUp size={13} className="text-[var(--text-muted)] flex-shrink-0" /> : <ChevronDown size={13} className="text-[var(--text-muted)] flex-shrink-0" />}
          </button>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            <button onClick={() => setShowEdit(true)}
              className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
              <Edit3 size={10} /> Edit
            </button>
            {hasFile && (
              <button onClick={() => setShowUpload(true)}
                className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors">
                <Upload size={10} /> Upload
              </button>
            )}
            <button onClick={() => setPublished(p => !p)}
              className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${published ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
              {published ? <Check size={10} /> : <Send size={10} />}
              {published ? 'Published' : 'Publish'}
            </button>
          </div>
        </div>
        {open && (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-card)]">
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">Keterangan</th>
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide w-36">Field</th>
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide w-28">Tipe</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, i) => (
                  <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-4 py-2.5 text-[var(--text-secondary)]">{f.desc}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-[var(--text-muted)]">{f.name}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-medium ${typeBadge[f.type] || 'bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>{f.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

function GorontaloMap() {
  const [sel, setSel] = useState<string|null>(null)
  const selKab = kabGorontalo.find(k => k.id === sel)
  const kc = (id: string) => sel === id
    ? 'fill-indigo-500/60 stroke-indigo-300 stroke-[1.5]'
    : 'fill-[var(--bg-hover)] stroke-[var(--border-lit)] stroke-[1] hover:fill-indigo-500/20 hover:stroke-indigo-400 cursor-pointer'
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Peta TPS — Provinsi Gorontalo</h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Klik wilayah untuk input data TPS & DPT</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <svg viewBox="0 0 600 260" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
          <style>{'.kab{transition:fill .15s,stroke .15s}.kl{font-family:DM Sans,system-ui,sans-serif;pointer-events:none;text-anchor:middle;dominant-baseline:central}'}</style>
          <g onClick={() => setSel(s => s==='pohuwato'?null:'pohuwato')}><path className={`kab ${kc('pohuwato')}`} d="M30,160 L28,120 L40,90 L65,65 L95,52 L125,50 L148,62 L155,85 L150,115 L138,138 L115,155 L85,165 L55,168 Z"/><text className="kl" x="95" y="112" fontSize="9" fill="var(--text-secondary)">Pohuwato</text></g>
          <g onClick={() => setSel(s => s==='bonebol'?null:'bonebol')}><path className={`kab ${kc('bonebol')}`} d="M148,62 L155,85 L150,115 L138,138 L165,148 L192,140 L205,118 L200,88 L185,65 L165,55 Z"/><text className="kl" x="175" y="105" fontSize="9" fill="var(--text-secondary)">Boalemo</text></g>
          <g onClick={() => setSel(s => s==='gorontalo'?null:'gorontalo')}><path className={`kab ${kc('gorontalo')}`} d="M192,140 L205,118 L200,88 L228,82 L252,90 L265,112 L258,138 L238,155 L215,158 Z"/><text className="kl" x="228" y="118" fontSize="9" fill="var(--text-secondary)">Kab.</text><text className="kl" x="228" y="130" fontSize="9" fill="var(--text-secondary)">Gorontalo</text></g>
          <g onClick={() => setSel(s => s==='gortalkota'?null:'gortalkota')}><path className={`kab ${kc('gortalkota')}`} d="M252,90 L272,86 L282,100 L275,118 L258,115 L252,100 Z"/><text className="kl" x="266" y="102" fontSize="7.5" fill="var(--text-secondary)">Kota</text></g>
          <g onClick={() => setSel(s => s==='bone'?null:'bone')}><path className={`kab ${kc('bone')}`} d="M265,112 L275,118 L282,100 L310,95 L345,108 L358,130 L348,155 L322,168 L292,165 L268,150 L258,138 Z"/><text className="kl" x="308" y="132" fontSize="9" fill="var(--text-secondary)">Bone Bolango</text></g>
          <g onClick={() => setSel(s => s==='gorut'?null:'gorut')}><path className={`kab ${kc('gorut')}`} d="M95,52 L125,50 L148,62 L165,55 L185,65 L200,88 L228,82 L252,90 L272,86 L310,95 L345,108 L370,90 L385,65 L370,42 L340,28 L300,20 L255,18 L210,22 L170,28 L140,35 L115,38 L90,44 Z"/><text className="kl" x="240" y="58" fontSize="9" fill="var(--text-secondary)">Gorontalo Utara</text></g>
          <text fontSize="9" fill="var(--text-muted)" fontFamily="DM Sans,sans-serif" x="80" y="215">Teluk Tomini</text>
          <text fontSize="9" fill="var(--text-muted)" fontFamily="DM Sans,sans-serif" x="200" y="240">Laut Sulawesi</text>
        </svg>
        <div className="lg:w-44 flex-shrink-0">
          <p className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Kab / Kota</p>
          <div className="space-y-1">
            {kabGorontalo.map(k => (
              <button key={k.id} onClick={() => setSel(s => s===k.id?null:k.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${sel===k.id ? 'bg-indigo-500/12 border border-indigo-500/20 text-indigo-300' : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-transparent'}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sel===k.id ? 'bg-indigo-400' : 'bg-[var(--border-lit)]'}`} />
                <span className="text-[11px] truncate flex-1">{k.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">—</span>
              </button>
            ))}
          </div>
          {selKab && (
            <div className="mt-3 p-2.5 bg-indigo-500/8 border border-indigo-500/20 rounded-lg">
              <p className="text-[11px] font-semibold text-indigo-300 mb-1.5">{selKab.name}</p>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">DPT</span><span className="text-[var(--text-secondary)]">Belum diinput</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">TPS</span><span className="text-[var(--text-secondary)]">Belum diinput</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Target suara</span><span className="text-[var(--text-secondary)]">—</span></div>
              </div>
              <button className="mt-2 w-full text-[10px] bg-indigo-500 text-white py-1.5 rounded-lg hover:bg-indigo-600 transition-colors">Input Data →</button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[var(--text-primary)]">Distribusi DPT per Kab/Kota</p>
          <BarChart size={13} className="text-[var(--text-muted)]" />
        </div>
        <div className="flex items-end gap-2" style={{height:'64px'}}>
          {kabGorontalo.map(k => (
            <div key={k.id} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-[var(--bg-hover)] border border-[var(--border)]" style={{height:'48px'}} />
              <span className="text-[8px] text-[var(--text-muted)] text-center">{k.name.split(' ').slice(-1)[0]}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">Chart terisi setelah data DPT diimport</p>
      </div>
    </div>
  )
}

function KonstituenPanel({ moduleName }: { moduleName: string }) {
  const [showUpload, setShowUpload] = useState(false)
  const cats = [
    { label:'DPT', color:'indigo', icon:'📋' },
    { label:'Potensi Pemilih', color:'green', icon:'🌱' },
    { label:'Daftar Kawan', color:'teal', icon:'🤝' },
    { label:'Daftar Relasi', color:'purple', icon:'🔗' },
    { label:'Tokoh Masyarakat', color:'amber', icon:'⭐' },
    { label:'Mantan Relawan', color:'pink', icon:'👥' },
  ]
  return (
    <>
      {showUpload && <UploadModal moduleName={moduleName} onClose={() => setShowUpload(false)} />}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Database Konstituen — By Name By Address</h3>
          <div className="flex gap-2">
            <button onClick={() => setShowUpload(true)} className="flex items-center gap-1 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors">
              <Upload size={10} /> Import Excel/CSV
            </button>
            <button className="flex items-center gap-1 text-[10px] bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors">
              <Plus size={10} /> Tambah Manual
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {cats.map((c, i) => (
            <div key={i} className={`p-3.5 rounded-xl border cursor-pointer hover:opacity-80 transition-opacity ${colorBg[c.color]}`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-lg">{c.icon}</span>
                <span className="text-[10px] bg-[var(--bg-hover)] text-[var(--text-muted)] px-1.5 py-0.5 rounded-md">0 data</span>
              </div>
              <p className={`text-xs font-semibold ${colorText[c.color]}`}>{c.label}</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Belum ada data</p>
            </div>
          ))}
        </div>
        <div className="border border-dashed border-[var(--border-lit)] rounded-xl p-5 text-center">
          <Users size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">Belum ada data konstituen</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">Import file DPT dari KPU (XLS/CSV) atau tambah satu per satu</p>
        </div>
      </div>
    </>
  )
}

interface Props { modulId: string; onBack: () => void }

export default function ModulPage({ modulId, onBack }: Props) {
  const [showUpload, setShowUpload] = useState(false)
  const modul = modulData.find(m => m.id === modulId)
  if (!modul) return null
  const Icon = iconMap[modulId] || LayoutDashboard
  const sections = (modulFields as any)[modulId] || []
  const isStandby = modul.status === 'standby'
  const totalFields = sections.reduce((acc: number, s: any) => acc + s.fields.length, 0)
  return (
    <>
      {showUpload && <UploadModal moduleName={modul.name} onClose={() => setShowUpload(false)} />}
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
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] px-3 py-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                <Upload size={12} /> Upload Data
              </button>
              <button className="flex items-center gap-1.5 text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors">
                <Plus size={12} /> Tambah
              </button>
            </div>
          </div>
        </div>
        {modulId === 'm8' && <KonstituenPanel moduleName={modul.name} />}
        {modulId === 'm2' && <GorontaloMap />}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-base">🔨</div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">Modul dalam pengembangan</p>
            <p className="text-[11px] text-[var(--text-secondary)]"><strong>{totalFields}</strong> field di {sections.length} section. Upload aktif. CRUD & Supabase menyusul di sprint berikutnya.</p>
          </div>
        </div>
        {sections.length > 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Schema Database — {totalFields} field</h3>
              <span className="text-[10px] text-[var(--text-muted)]">Expand · Edit · Upload · Publish per section</span>
            </div>
            <div className="space-y-2">
              {sections.map((s: any, i: number) => (
                <FieldSection key={i} section={s.section} fields={s.fields} color={modul.color} moduleName={modul.name} />
              ))}
            </div>
          </div>
        )}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
          <p className="text-xs font-semibold text-[var(--text-primary)] mb-2.5">Tech stack</p>
          <div className="flex flex-wrap gap-1.5">
            {['Next.js 14','TypeScript','Tailwind CSS','Supabase','PostgreSQL + PostGIS','Redis','Socket.io','React Native (Expo)','WhatsApp API','Leaflet.js'].map(t => (
              <span key={t} className="text-[9px] font-mono bg-[var(--bg-hover)] text-[var(--text-muted)] px-2 py-1 rounded border border-[var(--border)]">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
