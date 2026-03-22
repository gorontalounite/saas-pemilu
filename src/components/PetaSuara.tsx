'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { kabGorontalo } from '@/lib/data'
import { ArrowLeft, Map, BarChart2, Users, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface KabData {
  nama: string
  jumlah_tps: number
  jumlah_dpt: number
}

interface PartaiSuara {
  partai: string
  total: number
  pct: number
}

interface AnggotaDPRD {
  nama: string
  partai: string
  nama_dapil: string
  nomor_dapil: number
  suara_sah: number
}

interface DapilData {
  id: string
  nama_dapil: string
  kecamatan: string[]
  jumlah_kursi: number
  jumlah_tps: number
}

const colorMap: Record<string,string> = {
  'Golkar':'bg-yellow-500','NasDem':'bg-blue-500','Gerindra':'bg-red-600',
  'PDIP':'bg-red-500','PPP':'bg-green-600','PKB':'bg-green-500',
  'PKS':'bg-orange-500','Demokrat':'bg-sky-500','PAN':'bg-amber-500',
  'Hanura':'bg-orange-400','Gelora':'bg-orange-600','Perindo':'bg-blue-400',
  'PSI':'bg-pink-500','Garuda':'bg-red-400','PBB':'bg-teal-500',
  'PKPI':'bg-gray-500','Berkarya':'bg-orange-700','default':'bg-indigo-500',
}

interface Props { onBack: () => void }

export default function PetaSuara({ onBack }: Props) {
  const supabase = createClient()
  const [selectedKab, setSelectedKab] = useState<string>('Kab. Gorontalo')
  const [kabData, setKabData] = useState<Record<string, KabData>>({})
  const [partaiSuara, setPartaiSuara] = useState<PartaiSuara[]>([])
  const [anggota, setAnggota] = useState<AnggotaDPRD[]>([])
  const [dapilList, setDapilList] = useState<DapilData[]>([])
  const [selectedDapil, setSelectedDapil] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tabAktif, setTabAktif] = useState<'partai'|'anggota'|'dapil'>('partai')
  const [expandDapil, setExpandDapil] = useState<number | null>(null)

  useEffect(() => {
    fetchKabData()
  }, [])

  useEffect(() => {
    if (selectedKab) {
      fetchKabDetail(selectedKab)
    }
  }, [selectedKab])

  async function fetchKabData() {
    const { data } = await supabase.from('ref_kabkota').select('nama,jumlah_tps,jumlah_dpt')
    if (data) {
      const map: Record<string, KabData> = {}
      data.forEach((d: any) => { map[d.nama] = d })
      setKabData(map)
    }
    setLoading(false)
  }

  async function fetchKabDetail(kab: string) {
    setLoading(true)
    setPartaiSuara([])
    setAnggota([])
    setDapilList([])

    const [histori, anggotaRes, dapilRes] = await Promise.all([
      supabase.from('histori_pemilu').select('partai,suara').eq('kabkota', kab).eq('tahun', 2019),
      supabase.from('ref_anggota_dprd').select('nama,partai,nama_dapil,nomor_dapil,suara_sah').eq('kabkota', kab).order('suara_sah', { ascending: false }),
      supabase.from('ref_dapil').select('id,nama_dapil,kecamatan,jumlah_kursi,jumlah_tps').eq('kabkota', kab).eq('kontestasi','dprd_kabkota').order('nama_dapil'),
    ])

    // Agregasi suara per partai
    if (histori.data) {
      const map: Record<string, number> = {}
      histori.data.forEach((r: any) => {
        map[r.partai] = (map[r.partai] || 0) + r.suara
      })
      const total = Object.values(map).reduce((a, b) => a + b, 0)
      const sorted = Object.entries(map)
        .map(([partai, suara]) => ({ partai, total: suara, pct: total > 0 ? Math.round(suara/total*1000)/10 : 0 }))
        .sort((a, b) => b.total - a.total)
      setPartaiSuara(sorted)
    }

    if (anggotaRes.data) setAnggota(anggotaRes.data as AnggotaDPRD[])
    if (dapilRes.data) setDapilList(dapilRes.data as DapilData[])
    setLoading(false)
  }

  const kab = kabData[selectedKab]
  const totalDPT = 884080

  return (
    <div className="space-y-4 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Map size={22} className="text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">10</span>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Peta Suara & Referensi</h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">TPS, DPT, partai, perolehan suara historis & anggota DPRD terpilih</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Data KPU 2019 & 2024 · Provinsi Gorontalo · 2.016 TPS · 884.080 DPT</p>
          </div>
        </div>
      </div>

      {/* Ringkasan 6 Kabupaten/Kota */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-primary)] mb-3">6 Kabupaten / Kota</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {kabGorontalo.map(k => {
            const d = kabData[k.name]
            const isActive = selectedKab === k.name
            return (
              <button key={k.id} onClick={() => setSelectedKab(k.name)}
                className={`p-3 rounded-xl border text-left transition-all ${isActive ? 'bg-blue-500/12 border-blue-500/30' : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-lit)]'}`}>
                <p className={`text-[11px] font-semibold truncate mb-1 ${isActive ? 'text-blue-400' : 'text-[var(--text-primary)]'}`}>{k.name}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{(d?.jumlah_tps || k.tps).toLocaleString('id-ID')} TPS</p>
                <p className="text-[10px] text-[var(--text-muted)]">{(d?.jumlah_dpt || k.dpt).toLocaleString('id-ID')} DPT</p>
                {d && <p className="text-[9px] text-blue-400 mt-0.5">{(d.jumlah_dpt/totalDPT*100).toFixed(1)}% provinsi</p>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail kabupaten terpilih */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        {/* Header kabupaten */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{selectedKab}</h3>
            {kab && (
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {kab.jumlah_tps.toLocaleString('id-ID')} TPS · {kab.jumlah_dpt.toLocaleString('id-ID')} pemilih · {(kab.jumlah_dpt/totalDPT*100).toFixed(1)}% dari Provinsi
              </p>
            )}
          </div>
          <div className="flex gap-1">
            {(['partai','anggota','dapil'] as const).map(t => (
              <button key={t} onClick={() => setTabAktif(t)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all capitalize ${tabAktif === t ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'}`}>
                {t === 'partai' ? 'Suara 2019' : t === 'anggota' ? 'DPRD 2024' : 'Dapil'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-blue-400" />
              <span className="ml-2 text-sm text-[var(--text-muted)]">Memuat data...</span>
            </div>
          ) : (
            <>
              {/* Tab: Suara Partai 2019 */}
              {tabAktif === 'partai' && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-3">Perolehan suara DPR RI per partai — Pemilu 2019</p>
                  {partaiSuara.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] py-6 text-center">Tidak ada data untuk wilayah ini</p>
                  ) : (
                    <div className="space-y-2">
                      {partaiSuara.map((p, i) => (
                        <div key={p.partai} className="flex items-center gap-3">
                          <span className="text-[10px] text-[var(--text-muted)] w-4 text-right flex-shrink-0">{i+1}</span>
                          <div className="w-16 text-[11px] font-medium text-[var(--text-primary)] flex-shrink-0 truncate">{p.partai}</div>
                          <div className="flex-1 bg-[var(--bg-hover)] rounded-full h-5 overflow-hidden">
                            <div className={`h-full rounded-full ${colorMap[p.partai] || colorMap.default}`}
                              style={{width: `${Math.max(p.pct / partaiSuara[0].pct * 100, 2)}%`, opacity: 0.7}} />
                          </div>
                          <span className="text-[11px] text-[var(--text-primary)] w-16 text-right flex-shrink-0">{p.total.toLocaleString('id-ID')}</span>
                          <span className="text-[10px] text-[var(--text-muted)] w-10 text-right flex-shrink-0">{p.pct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Anggota DPRD 2024 */}
              {tabAktif === 'anggota' && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-3">Anggota DPRD terpilih periode 2024–2029</p>
                  {anggota.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] py-6 text-center">Belum ada data anggota DPRD</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="border-b border-[var(--border)]">
                            <th className="text-left py-2 px-2 text-[10px] font-medium text-[var(--text-muted)] uppercase">Nama</th>
                            <th className="text-left py-2 px-2 text-[10px] font-medium text-[var(--text-muted)] uppercase">Partai</th>
                            <th className="text-left py-2 px-2 text-[10px] font-medium text-[var(--text-muted)] uppercase">Dapil</th>
                            <th className="text-right py-2 px-2 text-[10px] font-medium text-[var(--text-muted)] uppercase">Suara</th>
                          </tr>
                        </thead>
                        <tbody>
                          {anggota.map((a, i) => (
                            <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]">
                              <td className="py-2 px-2 text-[var(--text-primary)] font-medium">{a.nama}</td>
                              <td className="py-2 px-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold text-white ${colorMap[a.partai] || colorMap.default}`}>
                                  {a.partai}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-[var(--text-muted)]">Dapil {a.nomor_dapil}</td>
                              <td className="py-2 px-2 text-right text-[var(--text-primary)]">{a.suara_sah.toLocaleString('id-ID')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Dapil */}
              {tabAktif === 'dapil' && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-3">Pembagian Daerah Pemilihan DPRD Kab/Kota</p>
                  {dapilList.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] py-6 text-center">Belum ada data dapil</p>
                  ) : (
                    <div className="space-y-2">
                      {dapilList.map((d, i) => (
                        <div key={d.id} className="border border-[var(--border)] rounded-xl overflow-hidden">
                          <button onClick={() => setExpandDapil(expandDapil === i ? null : i)}
                            className="w-full flex items-center justify-between p-3 hover:bg-[var(--bg-hover)] transition-colors">
                            <div className="flex items-center gap-3 text-left">
                              <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 flex-shrink-0">
                                {i+1}
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-[var(--text-primary)]">{d.nama_dapil}</p>
                                <p className="text-[10px] text-[var(--text-muted)]">{d.jumlah_kursi} kursi · {d.kecamatan.length} kecamatan</p>
                              </div>
                            </div>
                            {expandDapil === i ? <ChevronUp size={13} className="text-[var(--text-muted)]" /> : <ChevronDown size={13} className="text-[var(--text-muted)]" />}
                          </button>
                          {expandDapil === i && (
                            <div className="px-3 pb-3 pt-1 border-t border-[var(--border)] bg-[var(--bg-hover)]">
                              <div className="flex flex-wrap gap-1">
                                {d.kecamatan.map(kec => (
                                  <span key={kec} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">{kec}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Info footer */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart2 size={13} className="text-blue-400" />
        </div>
        <p className="text-[11px] text-[var(--text-secondary)]">
          Data historis Pemilu 2019 DPR RI dari KPU · Data DPRD 2024 dari hasil Pemilu legislatif 14 Februari 2024 · Total 170 anggota DPRD dari 6 kab/kota
        </p>
      </div>
    </div>
  )
}
