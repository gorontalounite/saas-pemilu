'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Tv2, TrendingUp, TrendingDown, Minus, AlertTriangle, ExternalLink, Filter, RefreshCw, Loader2, BarChart2, Users, Globe, Zap } from 'lucide-react'

interface MediaItem {
  id: string
  sumber: string
  url: string
  judul: string
  sentimen: 'positif' | 'negatif' | 'netral'
  skor_sentimen: number
  engagement: number
  est_reach: number
  kategori_isu: string
  is_viral: boolean
  is_kompetitor: boolean
  nama_kompetitor: string
  perlu_respons: boolean
  status_respons: string
  published_at: string
}

const SENTIMEN_CONFIG = {
  positif: { color:'text-green-400', bg:'bg-green-500/10 border-green-500/20', icon:TrendingUp },
  negatif: { color:'text-red-400',   bg:'bg-red-500/10 border-red-500/20',     icon:TrendingDown },
  netral:  { color:'text-amber-400', bg:'bg-amber-500/10 border-amber-500/20', icon:Minus },
}

const PLATFORM_COLOR: Record<string,string> = {
  'Instagram':'bg-pink-500/15 text-pink-400',
  'TikTok':'bg-slate-500/15 text-slate-300',
  'Facebook':'bg-blue-500/15 text-blue-400',
  'Twitter':'bg-sky-500/15 text-sky-400',
  'Media Online':'bg-indigo-500/15 text-indigo-400',
}

interface Props { onBack: () => void }

export default function MediaMonitoring({ onBack }: Props) {
  const supabase = createClient()
  const [tab, setTab] = useState<'berita'|'sosmed'|'kompetitor'|'h2h'>('berita')
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [filterSentimen, setFilterSentimen] = useState<string>('semua')
  const [kandidatId, setKandidatId] = useState<string|null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) { setKandidatId(data.user.id); fetchData(data.user.id) }
    })
  }, [])

  useEffect(() => {
    if (kandidatId) fetchData(kandidatId)
  }, [tab])

  async function fetchData(uid: string) {
    setLoading(true)
    let q = supabase.from('media_feed').select('*').eq('kandidat_id', uid)
    if (tab === 'kompetitor') q = q.eq('is_kompetitor', true)
    else if (tab === 'sosmed') q = q.in('sumber', ['Instagram','TikTok','Facebook','Twitter'])
    else if (tab === 'berita') q = q.eq('sumber', 'Media Online')
    const { data } = await q.order('published_at', { ascending: false }).limit(30)
    setItems(data || [])
    setLoading(false)
  }

  const filtered = filterSentimen === 'semua' ? items : items.filter(i => i.sentimen === filterSentimen)
  const stats = {
    total: items.length,
    positif: items.filter(i => i.sentimen === 'positif').length,
    negatif: items.filter(i => i.sentimen === 'negatif').length,
    viral: items.filter(i => i.is_viral).length,
    perlu_respons: items.filter(i => i.perlu_respons && i.status_respons !== 'selesai').length,
  }

  // Chart data simulasi untuk H2H
  const h2hData = [
    { label:'Kandidat Kita', elekt:32, sentimen:68, berita:45 },
    { label:'Kompetitor A', elekt:28, sentimen:52, berita:38 },
    { label:'Kompetitor B', elekt:22, sentimen:45, berita:28 },
    { label:'Kompetitor C', elekt:18, sentimen:61, berita:22 },
  ]

  return (
    <div className="space-y-4 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/8 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center flex-shrink-0">
            <Tv2 size={22} className="text-rose-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">12</span>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Media Monitoring</h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Berita, sosmed, sentimen, kompetitor & head-to-head analytics real-time</p>
          </div>
          <button onClick={() => kandidatId && fetchData(kandidatId)}
            className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border)] px-3 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { label:'Total Feed', value: stats.total, color:'indigo' },
          { label:'Positif', value: stats.positif, color:'green' },
          { label:'Negatif', value: stats.negatif, color:'red' },
          { label:'Viral', value: stats.viral, color:'amber' },
          { label:'Perlu Respons', value: stats.perlu_respons, color:'orange' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 bg-${s.color}-500/8 border-${s.color}-500/20`}>
            <p className={`text-xl font-bold text-${s.color}-400`}>{s.value}</p>
            <p className="text-[10px] text-[var(--text-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-hover)] p-1 rounded-xl w-fit flex-wrap">
        {[
          {id:'berita',label:'Dashboard Berita',icon:Globe},
          {id:'sosmed',label:'Monitoring Sosmed',icon:TrendingUp},
          {id:'kompetitor',label:'Kompetitor Tracker',icon:Users},
          {id:'h2h',label:'Head to Head',icon:BarChart2},
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${tab === t.id ? 'bg-[var(--bg-card)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
            <t.icon size={11} /> {t.label}
          </button>
        ))}
      </div>

      {/* Filter sentimen */}
      {tab !== 'h2h' && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={11} className="text-[var(--text-muted)]" />
          {['semua','positif','netral','negatif'].map(f => (
            <button key={f} onClick={() => setFilterSentimen(f)}
              className={`text-[10px] px-2.5 py-1 rounded-full border capitalize transition-all ${filterSentimen === f ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-lit)]'}`}>
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {tab === 'h2h' ? (
        /* Head to Head */
        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
            <p className="text-xs font-semibold text-[var(--text-primary)] mb-4">Perbandingan Elektabilitas</p>
            <div className="space-y-3">
              {h2hData.map((d, i) => (
                <div key={d.label}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-[11px] font-medium ${i === 0 ? 'text-rose-400' : 'text-[var(--text-secondary)]'}`}>{d.label}</span>
                    <span className="text-[11px] font-semibold text-[var(--text-primary)]">{d.elekt}%</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${i === 0 ? 'bg-rose-500' : 'bg-slate-600'}`}
                      style={{width:`${d.elekt}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
              <p className="text-xs font-semibold text-[var(--text-primary)] mb-4">Skor Sentimen Sosmed</p>
              <div className="space-y-3">
                {h2hData.map((d, i) => (
                  <div key={d.label}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-[11px] ${i === 0 ? 'text-rose-400' : 'text-[var(--text-secondary)]'}`}>{d.label}</span>
                      <span className="text-[11px] font-semibold text-[var(--text-primary)]">{d.sentimen}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${i === 0 ? 'bg-green-500' : 'bg-slate-600'}`} style={{width:`${d.sentimen}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
              <p className="text-xs font-semibold text-[var(--text-primary)] mb-4">Volume Pemberitaan Media</p>
              <div className="space-y-3">
                {h2hData.map((d, i) => (
                  <div key={d.label}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-[11px] ${i === 0 ? 'text-rose-400' : 'text-[var(--text-secondary)]'}`}>{d.label}</span>
                      <span className="text-[11px] font-semibold text-[var(--text-primary)]">{d.berita} artikel</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-slate-600'}`} style={{width:`${d.berita*2}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={13} className="text-amber-400" />
              <p className="text-[11px] font-semibold text-amber-400">Data Real-time Segera Hadir</p>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Grafik head-to-head akan otomatis update dari monitoring sosmed dan berita. Hubungkan API media partner untuk aktivasi.</p>
          </div>
        </div>
      ) : (
        /* Feed list */
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={18} className="animate-spin text-rose-400" />
              <span className="ml-2 text-xs text-[var(--text-muted)]">Memuat feed...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Tv2 size={28} className="mx-auto mb-2 text-[var(--text-muted)] opacity-30" />
              <p className="text-sm text-[var(--text-muted)]">Belum ada data media</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Upload data via Database Center atau hubungkan API monitoring</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filtered.map(item => {
                const sc = SENTIMEN_CONFIG[item.sentimen] || SENTIMEN_CONFIG.netral
                const SIcon = sc.icon
                return (
                  <div key={item.id} className={`p-4 hover:bg-[var(--bg-hover)] transition-colors ${item.is_viral ? 'border-l-2 border-amber-500' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded flex items-center justify-center border ${sc.bg}`}>
                        <SIcon size={12} className={sc.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${PLATFORM_COLOR[item.sumber] || 'bg-slate-500/15 text-slate-400'}`}>{item.sumber}</span>
                          {item.is_viral && <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">🔥 Viral</span>}
                          {item.perlu_respons && item.status_respons !== 'selesai' && <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5"><AlertTriangle size={8} /> Perlu Respons</span>}
                          {item.is_kompetitor && <span className="text-[9px] bg-purple-500/15 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">{item.nama_kompetitor}</span>}
                        </div>
                        <p className="text-[12px] font-medium text-[var(--text-primary)] mt-1.5 leading-snug">{item.judul}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-[var(--text-muted)]">Reach: {item.est_reach?.toLocaleString('id-ID') || '—'}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">Engagement: {item.engagement?.toLocaleString('id-ID') || '—'}</span>
                          {item.kategori_isu && <span className="text-[10px] text-[var(--text-muted)]">#{item.kategori_isu}</span>}
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              className="ml-auto text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5">
                              Buka <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
