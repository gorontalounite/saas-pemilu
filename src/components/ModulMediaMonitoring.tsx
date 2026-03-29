'use client'
import { useState, useEffect } from 'react'
import {
  ArrowLeft, Tv2, TrendingUp, TrendingDown, Minus,
  ExternalLink, RefreshCw, AlertCircle, Loader2,
  CheckCircle2, Eye
} from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface MediaItem {
  id: string
  judul: string
  sumber: string
  url: string
  penulis: string
  isi: string
  sentimen: string
  skor_sentimen: number
  engagement: number
  est_reach: number
  kategori_isu: string
  is_viral: boolean
  perlu_respons: boolean
  status_respons: string
  is_kompetitor: boolean
  nama_kompetitor: string
  published_at: string
  created_at: string
}

type FilterType = 'semua' | 'positif' | 'negatif' | 'netral' | 'viral' | 'perlu_respons'

const SENTIMEN: Record<string, { label: string; color: string; textColor: string; Icon: any }> = {
  positif: { label: 'Positif',  color: 'bg-green-500/10 border-green-500/20',  textColor: 'text-green-400',  Icon: TrendingUp   },
  negatif: { label: 'Negatif',  color: 'bg-red-500/10 border-red-500/20',      textColor: 'text-red-400',    Icon: TrendingDown },
  netral:  { label: 'Netral',   color: 'bg-slate-500/10 border-slate-500/20',  textColor: 'text-slate-400',  Icon: Minus        },
}

interface Props { onBack: () => void }

export default function ModulMediaMonitoring({ onBack }: Props) {
  const supabase = createClient()
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('semua')
  const [kandidatId, setKandidatId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [stats, setStats] = useState({ positif: 0, negatif: 0, netral: 0, viral: 0, perlu: 0, total: 0 })

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      setKandidatId(data.user.id)
      await fetchData(data.user.id)
    })
  }, [])

  async function fetchData(kid: string) {
    setLoading(true)
    const { data } = await supabase
      .from('media_feed')
      .select('*')
      .eq('kandidat_id', kid)
      .order('published_at', { ascending: false })
      .limit(200)

    const rows = (data || []) as MediaItem[]
    setItems(rows)
    setStats({
      total:   rows.length,
      positif: rows.filter(r => r.sentimen === 'positif').length,
      negatif: rows.filter(r => r.sentimen === 'negatif').length,
      netral:  rows.filter(r => r.sentimen === 'netral').length,
      viral:   rows.filter(r => r.is_viral).length,
      perlu:   rows.filter(r => r.perlu_respons && r.status_respons === 'belum').length,
    })
    setLoading(false)
  }

  async function markResponded(id: string) {
    await supabase.from('media_feed').update({ status_respons: 'selesai' }).eq('id', id)
    setItems(p => p.map(item => item.id === id ? { ...item, status_respons: 'selesai' } : item))
    setStats(p => ({ ...p, perlu: Math.max(0, p.perlu - 1) }))
  }

  const filtered = items.filter(item => {
    if (filter === 'semua')          return true
    if (filter === 'viral')          return item.is_viral
    if (filter === 'perlu_respons')  return item.perlu_respons && item.status_respons === 'belum'
    return item.sentimen === filter
  })

  const FILTERS: { key: FilterType; label: string; value: number; color: string }[] = [
    { key: 'semua',         label: 'Semua',          value: stats.total,   color: 'indigo' },
    { key: 'positif',       label: 'Positif',        value: stats.positif, color: 'green'  },
    { key: 'negatif',       label: 'Negatif',        value: stats.negatif, color: 'red'    },
    { key: 'netral',        label: 'Netral',         value: stats.netral,  color: 'slate'  },
    { key: 'viral',         label: 'Viral',          value: stats.viral,   color: 'amber'  },
    { key: 'perlu_respons', label: 'Perlu Respons',  value: stats.perlu,   color: 'orange' },
  ]

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
    green:  'bg-green-500/15 border-green-500/30 text-green-400',
    red:    'bg-red-500/15 border-red-500/30 text-red-400',
    slate:  'bg-slate-500/15 border-slate-500/30 text-slate-400',
    amber:  'bg-amber-500/15 border-amber-500/30 text-amber-400',
    orange: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
  }
  const colorValueMap: Record<string, string> = {
    indigo: 'text-indigo-400', green: 'text-green-400', red: 'text-red-400',
    slate: 'text-slate-400', amber: 'text-amber-400', orange: 'text-orange-400',
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
      >
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/8 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center flex-shrink-0">
            <Tv2 size={22} className="text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">12</span>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Media Monitoring</h2>
              {stats.total > 0 && (
                <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded-full">
                  {stats.total} artikel terpantau
                </span>
              )}
              {stats.perlu > 0 && (
                <span className="text-[9px] bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-full animate-pulse">
                  {stats.perlu} perlu respons
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Berita, sosmed, sentimen, kompetitor &amp; head-to-head analytics
            </p>
          </div>
          {kandidatId && (
            <button
              onClick={() => fetchData(kandidatId)}
              className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-rose-400 transition-colors flex-shrink-0"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`p-3 rounded-xl border text-center transition-all ${
              filter === f.key
                ? colorMap[f.color]
                : 'bg-[var(--bg-card)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <p className={`text-xl font-bold ${colorValueMap[f.color]}`}>{f.value}</p>
            <p className="text-[9px] text-[var(--text-muted)] mt-0.5 leading-tight">{f.label}</p>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="animate-spin text-rose-400" />
          <span className="ml-2 text-sm text-[var(--text-muted)]">Memuat data media...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-lit)] p-14 text-center">
          <Tv2 size={32} className="mx-auto mb-3 text-[var(--text-muted)] opacity-30" />
          <p className="text-sm font-medium text-[var(--text-muted)]">
            {filter === 'semua' ? 'Belum ada data media monitoring' : `Tidak ada artikel dengan filter "${filter}"`}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-2 max-w-xs mx-auto leading-relaxed">
            {filter === 'semua'
              ? 'Input artikel berita dan monitoring sosmed melalui Database Center → Modul 3, tabel media_feed'
              : 'Coba filter lain atau tambahkan data lebih banyak'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[10px] text-[var(--text-muted)]">
            Menampilkan {filtered.length} dari {items.length} artikel
          </p>
          {filtered.map(item => {
            const sentimenCfg = SENTIMEN[item.sentimen] || SENTIMEN.netral
            const SentimenIcon = sentimenCfg.Icon
            const isExpanded = expanded === item.id
            const needsResponse = item.perlu_respons && item.status_respons === 'belum'

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 transition-all ${
                  needsResponse
                    ? 'border-orange-500/30 bg-orange-500/5'
                    : 'border-[var(--border)] bg-[var(--bg-card)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Sentimen icon */}
                  <div className={`flex-shrink-0 mt-0.5 p-1.5 rounded-lg border ${sentimenCfg.color}`}>
                    <SentimenIcon size={12} className={sentimenCfg.textColor} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title + badges */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                        {item.judul || '(tanpa judul)'}
                      </p>
                      <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                        {item.is_viral && (
                          <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                            🔥 Viral
                          </span>
                        )}
                        {item.is_kompetitor && (
                          <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full">
                            Kompetitor
                          </span>
                        )}
                        {item.status_respons === 'selesai' && (
                          <span className="text-[9px] bg-green-500/15 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                            ✓ Direspons
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] flex-wrap mb-1.5">
                      {item.sumber && <span className="font-medium">{item.sumber}</span>}
                      {item.penulis && <span>· {item.penulis}</span>}
                      {item.kategori_isu && (
                        <span className="bg-[var(--bg-hover)] border border-[var(--border)] px-1.5 py-0.5 rounded">
                          {item.kategori_isu}
                        </span>
                      )}
                      {item.engagement > 0 && (
                        <span>{item.engagement.toLocaleString('id-ID')} engagement</span>
                      )}
                      {item.est_reach > 0 && (
                        <span>~{item.est_reach.toLocaleString('id-ID')} reach</span>
                      )}
                      {item.is_kompetitor && item.nama_kompetitor && (
                        <span className="text-red-400">terkait: {item.nama_kompetitor}</span>
                      )}
                    </div>

                    {/* Expanded isi */}
                    {isExpanded && item.isi && (
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-2 mb-2 border-t border-[var(--border)] pt-2">
                        {item.isi}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.isi && (
                        <button
                          onClick={() => setExpanded(isExpanded ? null : item.id)}
                          className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                        >
                          <Eye size={10} />
                          {isExpanded ? 'Sembunyikan' : 'Baca ringkasan'}
                        </button>
                      )}
                      {needsResponse && (
                        <>
                          <span className="text-[var(--border)]">·</span>
                          <div className="flex items-center gap-1.5">
                            <AlertCircle size={10} className="text-orange-400 flex-shrink-0" />
                            <span className="text-[10px] text-orange-400">Perlu respons</span>
                            <button
                              onClick={() => markResponded(item.id)}
                              className="text-[10px] bg-orange-500/15 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded hover:bg-orange-500/25 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 size={9} /> Tandai selesai
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* External link */}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
