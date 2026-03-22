'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Zap, User, Mail, Lock, Eye, EyeOff, Loader2, ChevronDown, ChevronRight } from 'lucide-react'

interface RefDapil {
  id: string
  kontestasi: string
  kabkota: string | null
  nama_dapil: string
  kecamatan: string[]
  jumlah_kursi: number
  jumlah_tps: number
}

interface RefPartai {
  id: number
  nomor_urut: number
  nama_lengkap: string
  nama_pendek: string
}

const KONTESTASI_OPTIONS = [
  { value: 'dpr_ri',       label: 'DPR RI',              desc: 'Dewan Perwakilan Rakyat Republik Indonesia' },
  { value: 'dpd_ri',       label: 'DPD RI',              desc: 'Dewan Perwakilan Daerah Republik Indonesia' },
  { value: 'dprd_provinsi',label: 'DPRD Provinsi',       desc: 'DPRD Provinsi Gorontalo' },
  { value: 'dprd_kabkota', label: 'DPRD Kabupaten/Kota', desc: 'DPRD Kabupaten atau Kota di Gorontalo' },
]

type Step = 1 | 2 | 3 | 4

export default function RegisterPage() {
  const supabase = createClient()

  // Form state
  const [step, setStep] = useState<Step>(1)
  const [nama, setNama]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [kontestasi, setKontestasi] = useState('')
  const [dapilId, setDapilId]     = useState('')
  const [partaiId, setPartaiId]   = useState<number | null>(null)

  // Data referensi
  const [dapilList, setDapilList]   = useState<RefDapil[]>([])
  const [partaiList, setPartaiList] = useState<RefPartai[]>([])
  const [selectedDapil, setSelectedDapil] = useState<RefDapil | null>(null)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  // Load dapil saat kontestasi dipilih
  useEffect(() => {
    if (!kontestasi) return
    setDapilId('')
    setSelectedDapil(null)
    supabase
      .from('ref_dapil')
      .select('*')
      .eq('kontestasi', kontestasi)
      .order('nama_dapil')
      .then(({ data }) => setDapilList(data || []))
  }, [kontestasi])

  // Load partai sekali
  useEffect(() => {
    supabase
      .from('ref_partai')
      .select('*')
      .order('nomor_urut')
      .then(({ data }) => setPartaiList(data || []))
  }, [])

  // Update selected dapil
  useEffect(() => {
    const found = dapilList.find(d => d.id === dapilId) || null
    setSelectedDapil(found)
  }, [dapilId, dapilList])

  const isDPD = kontestasi === 'dpd_ri'

  // Group dapil by kabkota untuk DPRD Kab/Kota
  const dapilGrouped = dapilList.reduce<Record<string, RefDapil[]>>((acc, d) => {
    const key = d.kabkota || 'Provinsi Gorontalo'
    if (!acc[key]) acc[key] = []
    acc[key].push(d)
    return acc
  }, {})

  async function handleRegister() {
    if (!nama || !email || !password || !kontestasi || !dapilId) {
      setError('Lengkapi semua field yang diperlukan.')
      return
    }
    if (!isDPD && !partaiId) {
      setError('Pilih partai pengusung.')
      return
    }

    setLoading(true)
    setError('')

    const dapil = dapilList.find(d => d.id === dapilId)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nama,
          nama_pendek: nama.split(' ')[0],
          inisial: nama.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
          kontestasi,
          dapil: dapil?.nama_dapil || 'Gorontalo',
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Update partai di tabel kandidat jika bukan DPD RI
    if (!isDPD && partaiId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('kandidat').update({ partai_id: partaiId }).eq('id', user.id)
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  const canNext1 = nama.trim().length >= 2 && email.trim() && password.length >= 6
  const canNext2 = kontestasi !== ''
  const canNext3 = dapilId !== ''
  const canSubmit = !isDPD ? partaiId !== null : true

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-1">Cek email <strong>{email}</strong> untuk verifikasi.</p>
          <p className="text-xs text-[var(--text-muted)] mb-6">Setelah verifikasi, kamu bisa login dan mulai setup profil kampanye.</p>
          <a href="/login"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
            Ke Halaman Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-base font-semibold text-[var(--text-primary)]">KampanyeOS</p>
            <p className="text-[10px] text-[var(--text-muted)]">Daftar sebagai kandidat</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-6">
          {[1,2,3,4].map((s) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all ${
                step > s ? 'bg-green-500 text-white' :
                step === s ? 'bg-indigo-500 text-white' :
                'bg-[var(--bg-hover)] text-[var(--text-muted)]'
              }`}>{step > s ? '✓' : s}</div>
              {s < 4 && <div className={`h-px flex-1 transition-all ${step > s ? 'bg-green-500' : 'bg-[var(--border)]'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">

          {/* Step 1 — Akun */}
          {step === 1 && (
            <>
              <div>
                <h1 className="text-sm font-semibold text-[var(--text-primary)]">Buat akun</h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Data dasar untuk login ke KampanyeOS</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">Nama Lengkap</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama lengkap kamu"
                    className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)] transition-colors" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">Email</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com"
                    className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)] transition-colors" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">Password</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 karakter"
                    className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg pl-8 pr-9 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)] transition-colors" />
                  <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <button onClick={() => setStep(2)} disabled={!canNext1}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                Lanjut <ChevronRight size={13} />
              </button>
            </>
          )}

          {/* Step 2 — Kontestasi */}
          {step === 2 && (
            <>
              <div>
                <h1 className="text-sm font-semibold text-[var(--text-primary)]">Pilih kontestasi</h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Jenis pemilihan yang kamu ikuti</p>
              </div>
              <div className="space-y-2">
                {KONTESTASI_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setKontestasi(opt.value)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      kontestasi === opt.value
                        ? 'bg-indigo-500/12 border-indigo-500/40 text-indigo-300'
                        : 'bg-[var(--bg-hover)] border-[var(--border)] hover:border-[var(--border-lit)]'
                    }`}>
                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${kontestasi === opt.value ? 'border-indigo-400 bg-indigo-400' : 'border-[var(--border-lit)]'}`}>
                      {kontestasi === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{opt.label}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium py-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                  Kembali
                </button>
                <button onClick={() => setStep(3)} disabled={!canNext2}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                  Lanjut <ChevronRight size={13} />
                </button>
              </div>
            </>
          )}

          {/* Step 3 — Dapil */}
          {step === 3 && (
            <>
              <div>
                <h1 className="text-sm font-semibold text-[var(--text-primary)]">Pilih Dapil</h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Daerah pemilihan kamu</p>
              </div>

              {/* DPR RI / DPD RI — hanya 1 pilihan */}
              {(kontestasi === 'dpr_ri' || kontestasi === 'dpd_ri') && dapilList.length > 0 && (
                <button onClick={() => setDapilId(dapilList[0].id)}
                  className="w-full flex items-start gap-3 p-3.5 rounded-xl border bg-indigo-500/12 border-indigo-500/40 text-left">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-400 bg-indigo-400 mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-300">{dapilList[0].nama_dapil}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {dapilList[0].jumlah_kursi} kursi · {dapilList[0].jumlah_tps.toLocaleString('id-ID')} TPS · Se-Provinsi Gorontalo
                    </p>
                  </div>
                </button>
              )}

              {/* DPRD Provinsi */}
              {kontestasi === 'dprd_provinsi' && (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {dapilList.map(d => (
                    <button key={d.id} onClick={() => setDapilId(d.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        dapilId === d.id ? 'bg-indigo-500/12 border-indigo-500/40' : 'bg-[var(--bg-hover)] border-[var(--border)] hover:border-[var(--border-lit)]'
                      }`}>
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${dapilId === d.id ? 'border-indigo-400 bg-indigo-400' : 'border-[var(--border-lit)]'}`}>
                        {dapilId === d.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">{d.nama_dapil}</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          {d.jumlah_kursi} kursi · {d.kabkota || 'Lintas Kabupaten'}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">{d.kecamatan.slice(0, 4).join(', ')}{d.kecamatan.length > 4 ? ` +${d.kecamatan.length - 4} kec` : ''}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* DPRD Kab/Kota — grouped by kabkota */}
              {kontestasi === 'dprd_kabkota' && (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {Object.entries(dapilGrouped).map(([kab, dapils]) => (
                    <div key={kab}>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 px-1">{kab}</p>
                      <div className="space-y-1.5">
                        {dapils.map(d => (
                          <button key={d.id} onClick={() => setDapilId(d.id)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                              dapilId === d.id ? 'bg-indigo-500/12 border-indigo-500/40' : 'bg-[var(--bg-hover)] border-[var(--border)] hover:border-[var(--border-lit)]'
                            }`}>
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${dapilId === d.id ? 'border-indigo-400 bg-indigo-400' : 'border-[var(--border-lit)]'}`}>
                              {dapilId === d.id && <div className="w-1 h-1 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-[var(--text-primary)]">{d.nama_dapil}</p>
                              <p className="text-[10px] text-[var(--text-muted)]">{d.jumlah_kursi} kursi · {d.kecamatan.join(', ')}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview dapil terpilih */}
              {selectedDapil && kontestasi !== 'dpr_ri' && kontestasi !== 'dpd_ri' && (
                <div className="p-3 bg-indigo-500/8 border border-indigo-500/20 rounded-xl">
                  <p className="text-[11px] font-semibold text-indigo-300 mb-1">{selectedDapil.nama_dapil}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{selectedDapil.jumlah_kursi} kursi · {selectedDapil.kecamatan.length} kecamatan</p>
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium py-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                  Kembali
                </button>
                <button onClick={() => isDPD ? handleRegister() : setStep(4)}
                  disabled={!canNext3 || loading}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                  {loading ? <Loader2 size={13} className="animate-spin" /> : null}
                  {isDPD ? (loading ? 'Mendaftar...' : 'Daftar') : <><span>Lanjut</span><ChevronRight size={13} /></>}
                </button>
              </div>
            </>
          )}

          {/* Step 4 — Partai (skip untuk DPD RI) */}
          {step === 4 && (
            <>
              <div>
                <h1 className="text-sm font-semibold text-[var(--text-primary)]">Pilih Partai</h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Partai pengusung kamu di Pemilu 2029</p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {partaiList.map(p => (
                  <button key={p.id} onClick={() => setPartaiId(p.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                      partaiId === p.id ? 'bg-indigo-500/12 border-indigo-500/40' : 'bg-[var(--bg-hover)] border-[var(--border)] hover:border-[var(--border-lit)]'
                    }`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                      partaiId === p.id ? 'bg-indigo-500 text-white' : 'bg-[var(--border)] text-[var(--text-muted)]'
                    }`}>{p.nomor_urut}</div>
                    <span className="text-[10px] font-medium text-[var(--text-primary)] leading-tight">{p.nama_pendek}</span>
                  </button>
                ))}
              </div>
              {partaiId && (
                <div className="p-2.5 bg-indigo-500/8 border border-indigo-500/20 rounded-lg">
                  <p className="text-[11px] text-indigo-300">
                    {partaiList.find(p => p.id === partaiId)?.nama_lengkap}
                  </p>
                </div>
              )}
              {error && <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              <div className="flex gap-2">
                <button onClick={() => setStep(3)} className="flex-1 border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium py-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                  Kembali
                </button>
                <button onClick={handleRegister} disabled={!canSubmit || loading}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={13} className="animate-spin" /> : null}
                  {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                </button>
              </div>
            </>
          )}

        </div>

        <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">
          Sudah punya akun?{' '}
          <a href="/login" className="text-indigo-400 hover:underline">Login di sini</a>
        </p>
        <p className="text-center text-[10px] text-[var(--text-muted)] mt-1">KampanyeOS · Gorontalo Unite · 2025–2029</p>
      </div>
    </div>
  )
}
