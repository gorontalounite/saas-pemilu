'use client'
import { useState } from 'react'
import { ArrowLeft, BookOpen, Search, ChevronDown, ChevronUp, ExternalLink, Upload, FileText } from 'lucide-react'

const categories = [
  { id:'regulasi',  label:'Regulasi & UU',        icon:'⚖️',  color:'indigo', count:12 },
  { id:'partai',    label:'Partai Politik',        icon:'🏛️',  color:'blue',   count:18 },
  { id:'kpu',       label:'Peraturan KPU',         icon:'📋',  color:'teal',   count:8  },
  { id:'histori',   label:'Histori Pemilu',        icon:'📊',  color:'purple', count:6  },
  { id:'dapil',     label:'Dapil & Kursi',         icon:'🗺️',  color:'green',  count:4  },
  { id:'strategi',  label:'Strategi Kampanye',     icon:'🎯',  color:'pink',   count:15 },
  { id:'media',     label:'Media & Komunikasi',    icon:'📣',  color:'orange', count:10 },
  { id:'anggaran',  label:'Aturan Dana Kampanye',  icon:'💰',  color:'amber',  count:7  },
]

const knowledge: Record<string, { title: string; summary: string; source: string; year: number; tags: string[] }[]> = {
  regulasi: [
    { title:'UU No. 7 Tahun 2017 tentang Pemilihan Umum', summary:'Regulasi induk penyelenggaraan Pemilu di Indonesia — mencakup DPR, DPD, DPRD Provinsi, DPRD Kabupaten/Kota, dan Presiden/Wakil Presiden.', source:'DPR RI', year:2017, tags:['UU','Pemilu','Legislatif'] },
    { title:'UU No. 10 Tahun 2016 tentang Pilkada', summary:'Mengatur pemilihan Gubernur, Bupati, dan Walikota secara langsung, umum, bebas, rahasia, jujur dan adil.', source:'DPR RI', year:2016, tags:['UU','Pilkada','Daerah'] },
    { title:'UU No. 2 Tahun 2011 tentang Partai Politik', summary:'Mengatur pembentukan, fungsi, hak dan kewajiban partai politik dalam sistem demokrasi Indonesia.', source:'DPR RI', year:2011, tags:['UU','Partai','Demokrasi'] },
    { title:'UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi', summary:'Mengatur pengumpulan, pemrosesan, dan perlindungan data pribadi — relevan untuk pengelolaan data DPT dan relawan.', source:'DPR RI', year:2022, tags:['UU','Data','Privasi'] },
  ],
  kpu: [
    { title:'PKPU No. 7 Tahun 2022 — Penyusunan Daftar Pemilih', summary:'Mengatur tata cara penyusunan, pemutakhiran, dan penetapan DPT. Tim sukses terdaftar berhak meminta salinan DPT ke KPU Kab/Kota.', source:'KPU RI', year:2022, tags:['PKPU','DPT','Pemilih'] },
    { title:'PKPU No. 18 Tahun 2023 — Dana Kampanye', summary:'Mengatur sumber, bentuk, batasan, pembukuan, dan pelaporan dana kampanye termasuk LPPDK.', source:'KPU RI', year:2023, tags:['PKPU','Dana','LPPDK'] },
    { title:'PKPU No. 20 Tahun 2023 — Pencalonan DPR & DPRD', summary:'Persyaratan bakal calon, verifikasi partai, dan penetapan daftar calon sementara/tetap.', source:'KPU RI', year:2023, tags:['PKPU','Caleg','Pencalonan'] },
  ],
  histori: [
    { title:'Hasil Pemilu Legislatif 2024 — Nasional', summary:'PKB, Gerindra, PDI-P, Golkar menjadi 4 partai dengan suara terbanyak. Partisipasi pemilih mencapai 81,78%. Total 580 kursi DPR RI diperebutkan.', source:'KPU RI', year:2024, tags:['Pemilu 2024','DPR RI','Hasil'] },
    { title:'Hasil Pemilu 2024 — Dapil Gorontalo', summary:'Data perolehan suara DPR RI Dapil Gorontalo per partai dan per caleg pada Pemilu 2024. Gorontalo memiliki 3 kursi DPR RI.', source:'KPU RI', year:2024, tags:['Gorontalo','Dapil','DPR RI'] },
    { title:'Tren Pemilu Gorontalo 2004–2024', summary:'Rekap histori pemilu Provinsi Gorontalo selama 5 periode — pergeseran kekuatan partai, tingkat partisipasi, dan pola perolehan suara per kabupaten.', source:'KPU Gorontalo', year:2024, tags:['Histori','Gorontalo','Tren'] },
  ],
  dapil: [
    { title:'Dapil Gorontalo — Alokasi Kursi DPR RI', summary:'Provinsi Gorontalo mendapatkan 3 kursi DPR RI. Mencakup 6 kabupaten/kota: Kota Gorontalo, Kab. Gorontalo, Gorontalo Utara, Bone Bolango, Boalemo, Pohuwato.', source:'KPU RI', year:2024, tags:['Dapil','Gorontalo','Kursi'] },
    { title:'Metode Konversi Suara ke Kursi — Sainte-Laguë', summary:'Pemilu 2024 menggunakan metode Sainte-Laguë untuk konversi suara ke kursi. Memahami metode ini krusial untuk strategi perolehan suara minimum.', source:'UU No.7/2017', year:2017, tags:['Sainte-Laguë','Kursi','Konversi'] },
  ],
  partai: [
    { title:'Profil 18 Partai Peserta Pemilu 2024', summary:'Ringkasan platform, basis massa, sejarah perolehan suara, dan kekuatan di daerah dari 18 partai peserta Pemilu 2024.', source:'KPU RI', year:2024, tags:['Partai','Peserta','2024'] },
    { title:'Ambang Batas Parlemen (Parliamentary Threshold)', summary:'Partai harus meraih minimal 4% suara sah nasional untuk mendapatkan kursi DPR RI. Tidak berlaku untuk DPRD Provinsi dan DPRD Kab/Kota.', source:'UU No.7/2017', year:2017, tags:['Threshold','Parlemen','Nasional'] },
  ],
  strategi: [
    { title:'Panduan Strategi Kampanye Digital untuk Caleg', summary:'Best practices kampanye digital: content calendar, targeting per segmen pemilih, penggunaan iklan Meta & TikTok, dan manajemen reputasi online.', source:'Internal', year:2024, tags:['Digital','Strategi','Kampanye'] },
    { title:'Door-to-Door Canvassing — Metodologi & Efektivitas', summary:'Studi efektivitas canvassing door-to-door dibanding kampanye massal. Rata-rata konversi 15–25% untuk undecided voters yang berhasil ditemui langsung.', source:'Electoral Research', year:2023, tags:['Canvassing','Relawan','Konversi'] },
    { title:'Analisis Swing Voters — Gorontalo 2024', summary:'Profil pemilih yang berpindah pilihan antar pemilu. Fokus segmen: pemilih muda 17–25 tahun, perempuan, dan pemilih berbasis isu (bukan berbasis partai).', source:'Internal', year:2024, tags:['Swing Voter','Segmen','Gorontalo'] },
  ],
  anggaran: [
    { title:'Batasan Dana Kampanye Caleg DPR RI', summary:'Berdasarkan PKPU, dana kampanye caleg DPR RI bersumber dari: caleg sendiri, partai, dan sumbangan individu/badan usaha. Ada batasan per penyumbang.', source:'PKPU No.18/2023', year:2023, tags:['Dana','Batasan','Kampanye'] },
    { title:'Format LPPDK dan Jadwal Pelaporan', summary:'Laporan Penerimaan dan Pengeluaran Dana Kampanye (LPPDK) diserahkan ke KPU maksimal H+1 setelah masa kampanye berakhir dan H+7 setelah hari pemungutan suara.', source:'KPU RI', year:2024, tags:['LPPDK','Laporan','Jadwal'] },
  ],
  media: [
    { title:'Panduan Komunikasi Publik untuk Caleg', summary:'Strategi membangun narasi yang kuat, menghadapi media, mengelola krisis komunikasi, dan membangun citra konsisten di berbagai platform.', source:'Internal', year:2024, tags:['Komunikasi','Media','Narasi'] },
  ],
}

// ── Knowledge Card ──────────────────────────────────────────────────────────────
function KnowledgeCard({ item }: { item: typeof knowledge.regulasi[0] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 hover:border-[var(--border-lit)] transition-colors">
      <div className="flex items-start gap-3">
        <FileText size={15} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-semibold text-[var(--text-primary)] leading-tight">{item.title}</h4>
            <span className="text-[9px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded flex-shrink-0">{item.year}</span>
          </div>
          {expanded && <p className="text-[11px] text-[var(--text-secondary)] mt-2 leading-relaxed">{item.summary}</p>}
          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <div className="flex gap-1.5 flex-wrap">
              {item.tags.map(t => (
                <span key={t} className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[var(--text-muted)]">{item.source}</span>
              <button onClick={() => setExpanded(p => !p)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">
                {expanded ? 'Sembunyikan' : 'Selengkapnya'}
                {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main ────────────────────────────────────────────────────────────────────────
interface Props { onBack: () => void }

export default function RAGKnowledge({ onBack }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('regulasi')
  const [search, setSearch] = useState('')

  const items = (knowledge[activeCategory] || []).filter(k =>
    search === '' ||
    k.title.toLowerCase().includes(search.toLowerCase()) ||
    k.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const totalItems = Object.values(knowledge).reduce((a, b) => a + b.length, 0)

  return (
    <div className="space-y-5 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-[var(--text-primary)] mb-1">RAG Knowledge Base</h1>
            <p className="text-sm text-[var(--text-secondary)]">Referensi regulasi, partai, strategi, dan histori pemilu sebagai pembanding analisis kampanye</p>
            <div className="flex gap-4 mt-2 flex-wrap">
              <span className="text-[11px] text-[var(--text-muted)]">{categories.length} kategori</span>
              <span className="text-[11px] text-[var(--text-muted)]">{totalItems} artikel referensi</span>
              <span className="text-[11px] text-purple-400">⚡ RAG (AI search) — coming soon</span>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-xs bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-2 rounded-lg hover:bg-purple-500/20 transition-colors flex-shrink-0">
            <Upload size={12} /> Upload Dokumen
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari regulasi, partai, strategi, histori pemilu..."
          className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-purple-500 placeholder:text-[var(--text-muted)] transition-colors" />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {categories.map(c => (
          <button key={c.id} onClick={() => { setActiveCategory(c.id); setSearch('') }}
            className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${activeCategory === c.id ? `bg-${c.color}-500/10 border-${c.color}-500/25` : 'border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)]'}`}>
            <span className="text-lg flex-shrink-0">{c.icon}</span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[var(--text-primary)] truncate">{c.label}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{c.count} artikel</p>
            </div>
          </button>
        ))}
      </div>

      {/* Articles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {categories.find(c => c.id === activeCategory)?.icon} {categories.find(c => c.id === activeCategory)?.label}
          </h3>
          <span className="text-[11px] text-[var(--text-muted)]">{items.length} artikel</span>
        </div>
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, i) => <KnowledgeCard key={i} item={item} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border-lit)] p-8 text-center">
            <Search size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-xs text-[var(--text-secondary)]">Tidak ada artikel yang cocok</p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">Coba kata kunci lain atau upload dokumen baru</p>
          </div>
        )}
      </div>

      {/* AI RAG coming soon */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🤖</span>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">RAG AI Search — Coming Soon</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Tanya langsung ke AI: "Berapa batasan dana kampanye DPR RI?", "Siapa kompetitor terkuat di Dapil Gorontalo?", 
              "Bagaimana tren pemilih muda di Gorontalo 2024?". AI akan menjawab berdasarkan dokumen yang sudah diupload ke knowledge base ini.
            </p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {['"Regulasi LPPDK terbaru"', '"Hasil Pileg Gorontalo 2024"', '"Strategi swing voter"'].map(q => (
                <span key={q} className="text-[10px] bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--text-muted)] px-2.5 py-1 rounded-lg">{q}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload section */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-3">Upload Dokumen Referensi</h3>
        <div className="border-2 border-dashed border-[var(--border-lit)] rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/40 transition-colors">
          <Upload size={22} className="text-[var(--text-muted)] mx-auto mb-2" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">Upload PDF, XLSX, atau dokumen lainnya</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">Contoh: hasil Pemilu sebelumnya (.mhtml, .xlsx), regulasi KPU (.pdf), data BPS (.xlsx)</p>
          <p className="text-[10px] text-amber-400 mt-1.5">Setelah Supabase terhubung, dokumen akan diindeks untuk AI search</p>
        </div>
      </div>
    </div>
  )
}
