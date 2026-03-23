'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { kabGorontalo } from '@/lib/data'
import { ArrowLeft, Map, ChevronDown, ChevronUp, Loader2, Users, MapPin } from 'lucide-react'

interface KabData { nama: string; jumlah_tps: number; jumlah_dpt: number }
interface AnggotaDPRD { nama: string; partai: string; nomor_dapil: number; suara_sah: number }
interface DapilData { id: string; nama_dapil: string; kecamatan: string[]; jumlah_kursi: number; jumlah_tps: number }

const PARTAI_COLOR: Record<string,string> = {
  'Golkar':'#EAB308','NasDem':'#3B82F6','Gerindra':'#DC2626','PDIP':'#EF4444',
  'PPP':'#16A34A','PKB':'#22C55E','PKS':'#F97316','Demokrat':'#0EA5E9',
  'PAN':'#F59E0B','Hanura':'#FB923C','Gelora':'#EA580C','Perindo':'#60A5FA',
  'PSI':'#EC4899','Garuda':'#F87171','PBB':'#14B8A6','PKPI':'#9CA3AF',
}

interface Props { onBack: () => void }

export default function PetaSuara({ onBack }: Props) {
  const supabase = createClient()
  const [kabData, setKabData] = useState<Record<string, KabData>>({})
  const [selectedKab, setSelectedKab] = useState<string | null>(null)
  const [dapilList, setDapilList] = useState<DapilData[]>([])
  const [selectedDapil, setSelectedDapil] = useState<DapilData | null>(null)
  const [anggotaDapil, setAnggotaDapil] = useState<AnggotaDPRD[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAnggota, setLoadingAnggota] = useState(false)
  const totalDPT = 884080

  useEffect(() => {
    supabase.from('ref_kabkota').select('nama,jumlah_tps,jumlah_dpt').then(({ data }) => {
      if (data) {
        const map: Record<string, KabData> = {}
        data.forEach((d: any) => { map[d.nama] = d })
        setKabData(map)
      }
    })
  }, [])

  async function pilihKab(nama: string) {
    if (selectedKab === nama) {
      setSelectedKab(null); setDapilList([]); setSelectedDapil(null); setAnggotaDapil([])
      return
    }
    setSelectedKab(nama); setSelectedDapil(null); setAnggotaDapil([])
    setLoading(true)
    const { data } = await supabase.from('ref_dapil')
      .select('id,nama_dapil,kecamatan,jumlah_kursi,jumlah_tps')
      .eq('kabkota', nama).eq('kontestasi','dprd_kabkota').order('nama_dapil')
    setDapilList(data || [])
    setLoading(false)
  }

  async function pilihDapil(d: DapilData) {
    if (selectedDapil?.id === d.id) {
      setSelectedDapil(null); setAnggotaDapil([])
      return
    }
    setSelectedDapil(d); setAnggotaDapil([])
    setLoadingAnggota(true)
    const nomorDapil = parseInt(d.nama_dapil.match(/\d+$/)?.[0] || '0')
    const { data } = await supabase.from('ref_anggota_dprd')
      .select('nama,partai,nomor_dapil,suara_sah')
      .eq('kabkota', selectedKab)
      .eq('nomor_dapil', nomorDapil)
      .order('suara_sah', { ascending: false })
    setAnggotaDapil(data || [])
    setLoadingAnggota(false)
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/8 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
            <Map size={22} className="text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">10</span>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Peta Suara & Referensi</h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Hasil Pemilu 2024 · Data TPS & DPT · Pemetaan Dapil per Kabupaten/Kota</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Provinsi Gorontalo · 2.016 TPS · 884.080 DPT · 14 Februari 2024</p>
          </div>
        </div>
      </div>

      {/* 6 Kartu Kabupaten/Kota */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-primary)] mb-3">Pilih Kabupaten / Kota</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {kabGorontalo.map(k => {
            const d = kabData[k.name]
            const isActive = selectedKab === k.name
            return (
              <button key={k.id} onClick={() => pilihKab(k.name)}
                className={`p-3 rounded-xl border text-left transition-all ${isActive ? 'bg-blue-500/12 border-blue-500/35' : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-lit)]'}`}>
                <p className={`text-[11px] font-semibold leading-tight mb-2 ${isActive ? 'text-blue-400' : 'text-[var(--text-primary)]'}`}>{k.name}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{(d?.jumlah_tps || k.tps).toLocaleString('id-ID')} TPS</p>
                <p className="text-[10px] text-[var(--text-muted)]">{(d?.jumlah_dpt || k.dpt).toLocaleString('id-ID')} DPT</p>
                {d && <p className="text-[9px] text-blue-400 mt-1">{(d.jumlah_dpt/totalDPT*100).toFixed(1)}% provinsi</p>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Empty state */}
      {!selectedKab && (
        <div className="rounded-xl border border-dashed border-[var(--border-lit)] p-10 text-center">
          <Map size={28} className="mx-auto mb-2 text-[var(--text-muted)] opacity-40" />
          <p className="text-sm text-[var(--text-muted)]">Pilih kabupaten/kota di atas untuk melihat hasil pemilu & dapil</p>
        </div>
      )}

      {/* Detail kabupaten */}
      {selectedKab && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
          {/* Info bar kabupaten */}
          <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-hover)]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{selectedKab}</h3>
                {kabData[selectedKab] && (
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {kabData[selectedKab].jumlah_tps.toLocaleString('id-ID')} TPS ·{' '}
                    {kabData[selectedKab].jumlah_dpt.toLocaleString('id-ID')} pemilih ·{' '}
                    {(kabData[selectedKab].jumlah_dpt/totalDPT*100).toFixed(1)}% dari Provinsi Gorontalo
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-medium">
                  Hasil Pemilu 2024
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">DPRD Kabupaten/Kota</span>
              </div>
            </div>
          </div>

          {/* Dapil list */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={18} className="animate-spin text-blue-400" />
                <span className="ml-2 text-xs text-[var(--text-muted)]">Memuat data dapil...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  {dapilList.length} Daerah Pemilihan — klik dapil untuk detail
                </p>
                {dapilList.map(d => {
                  const isOpen = selectedDapil?.id === d.id
                  return (
                    <div key={d.id} className={`rounded-xl border overflow-hidden transition-all ${isOpen ? 'border-blue-500/30' : 'border-[var(--border)]'}`}>

                      {/* Baris dapil */}
                      <button onClick={() => pilihDapil(d)}
                        className={`w-full flex items-center justify-between p-3.5 text-left transition-colors ${isOpen ? 'bg-blue-500/8' : 'hover:bg-[var(--bg-hover)]'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 border ${isOpen ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-[var(--bg-hover)] border-[var(--border)] text-[var(--text-muted)]'}`}>
                            {d.nama_dapil.match(/\d+$/)?.[0]}
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-[var(--text-primary)]">{d.nama_dapil}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              {d.jumlah_kursi} kursi · {d.kecamatan.length} kecamatan
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex gap-1">
                            {d.kecamatan.slice(0,2).map(kec => (
                              <span key={kec} className="text-[9px] bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--text-muted)] px-1.5 py-0.5 rounded">{kec}</span>
                            ))}
                            {d.kecamatan.length > 2 && <span className="text-[9px] text-[var(--text-muted)]">+{d.kecamatan.length-2} lainnya</span>}
                          </div>
                          {isOpen ? <ChevronUp size={13} className="text-blue-400 flex-shrink-0" /> : <ChevronDown size={13} className="text-[var(--text-muted)] flex-shrink-0" />}
                        </div>
                      </button>

                      {/* Detail dapil */}
                      {isOpen && (
                        <div className="border-t border-blue-500/15">
                          {/* Wilayah kecamatan */}
                          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-hover)]">
                            <div className="flex items-center gap-1.5 mb-2">
                              <MapPin size={10} className="text-[var(--text-muted)]" />
                              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Wilayah {selectedKab}</p>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {d.kecamatan.map(kec => (
                                <span key={kec} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">{kec}</span>
                              ))}
                            </div>
                            <div className="flex gap-6">
                              <div>
                                <p className="text-[9px] text-[var(--text-muted)] mb-0.5">Alokasi Kursi</p>
                                <p className="text-xs font-semibold text-[var(--text-primary)]">{d.jumlah_kursi} kursi</p>
                              </div>
                              {kabData[selectedKab] && (
                                <>
                                  <div>
                                    <p className="text-[9px] text-[var(--text-muted)] mb-0.5">Total TPS Kab</p>
                                    <p className="text-xs font-semibold text-[var(--text-primary)]">{kabData[selectedKab].jumlah_tps.toLocaleString('id-ID')} TPS</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] text-[var(--text-muted)] mb-0.5">Total DPT Kab</p>
                                    <p className="text-xs font-semibold text-[var(--text-primary)]">{kabData[selectedKab].jumlah_dpt.toLocaleString('id-ID')} pemilih</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Anggota terpilih */}
                          <div className="p-4 bg-[var(--bg-hover)]">
                            <div className="flex items-center gap-1.5 mb-3">
                              <Users size={10} className="text-[var(--text-muted)]" />
                              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                Anggota DPRD Terpilih — Pemilu 2024
                              </p>
                            </div>
                            {loadingAnggota ? (
                              <div className="flex items-center gap-2 py-3">
                                <Loader2 size={14} className="animate-spin text-blue-400" />
                                <span className="text-xs text-[var(--text-muted)]">Memuat...</span>
                              </div>
                            ) : anggotaDapil.length === 0 ? (
                              <p className="text-xs text-[var(--text-muted)] py-2">Belum ada data anggota untuk dapil ini</p>
                            ) : (
                              <div className="space-y-1.5">
                                {anggotaDapil.map((a, i) => (
                                  <div key={i} className="flex items-center gap-3 p-2.5 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                                    <div className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                                      style={{ backgroundColor: PARTAI_COLOR[a.partai] || '#6366f1' }}>
                                      {i+1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate">{a.nama}</p>
                                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded text-white"
                                        style={{ backgroundColor: PARTAI_COLOR[a.partai] || '#6366f1' }}>
                                        {a.partai}
                                      </span>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-[11px] font-semibold text-[var(--text-primary)]">{a.suara_sah.toLocaleString('id-ID')}</p>
                                      <p className="text-[9px] text-[var(--text-muted)]">suara sah</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
