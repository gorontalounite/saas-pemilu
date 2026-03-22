'use client'

import { useState } from 'react'
import { Konstituen } from '@/hooks/useKonstituen'

interface Props {
  initial?: Partial<Konstituen>
  tenantId: string
  onSave: (data: Omit<Konstituen, 'id' | 'created_at'>) => Promise<void>
  onCancel: () => void
}

const KABKOTA_OPTIONS = [
  'Kota Gorontalo',
  'Kab. Gorontalo',
  'Kab. Gorontalo Utara',
  'Kab. Bone Bolango',
  'Kab. Pohuwato',
  'Kab. Boalemo',
]

export default function KonstituenForm({ initial, tenantId, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    nama: initial?.nama ?? '',
    nik: initial?.nik ?? '',
    no_hp: initial?.no_hp ?? '',
    alamat: initial?.alamat ?? '',
    kabkota: initial?.kabkota ?? '',
    kecamatan: initial?.kecamatan ?? '',
    kelurahan: initial?.kelurahan ?? '',
    kategori: initial?.kategori ?? 'pemilih',
    status_crm: initial?.status_crm ?? 'baru',
    tenant_id: tenantId,
    kandidat_id: initial?.kandidat_id ?? null,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nama.trim()) { setError('Nama wajib diisi'); return }
    setSaving(true)
    setError(null)
    try {
      await onSave(form as Omit<Konstituen, 'id' | 'created_at'>)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full px-3 py-2 rounded-lg border border-[var(--color-border-secondary)] bg-[var(--color-background-primary)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-primary)]"
  const labelCls = "block text-xs font-medium text-[var(--color-text-secondary)] mb-1"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-[var(--color-background-primary)] rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border-tertiary)]">
          <h2 className="text-base font-medium text-[var(--color-text-primary)]">
            {initial?.id ? 'Edit Konstituen' : 'Tambah Konstituen'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-[var(--color-background-danger)] text-[var(--color-text-danger)] text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Nama lengkap *</label>
              <input className={inputCls} value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="Nama lengkap" />
            </div>
            <div>
              <label className={labelCls}>NIK</label>
              <input className={inputCls} value={form.nik} onChange={e => set('nik', e.target.value)} placeholder="16 digit NIK" maxLength={16} />
            </div>
            <div>
              <label className={labelCls}>No. HP</label>
              <input className={inputCls} value={form.no_hp} onChange={e => set('no_hp', e.target.value)} placeholder="08xx" />
            </div>
            <div>
              <label className={labelCls}>Kategori</label>
              <select className={inputCls} value={form.kategori} onChange={e => set('kategori', e.target.value)}>
                <option value="pemilih">Pemilih</option>
                <option value="tokoh">Tokoh</option>
                <option value="kelompok">Kelompok</option>
                <option value="aspirasi">Aspirasi</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status CRM</label>
              <select className={inputCls} value={form.status_crm} onChange={e => set('status_crm', e.target.value)}>
                <option value="baru">Baru</option>
                <option value="terhubung">Terhubung</option>
                <option value="aktif">Aktif</option>
                <option value="dorman">Dorman</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Kab/Kota</label>
              <select className={inputCls} value={form.kabkota} onChange={e => set('kabkota', e.target.value)}>
                <option value="">Pilih kab/kota</option>
                {KABKOTA_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Kecamatan</label>
              <input className={inputCls} value={form.kecamatan} onChange={e => set('kecamatan', e.target.value)} placeholder="Kecamatan" />
            </div>
            <div>
              <label className={labelCls}>Kelurahan</label>
              <input className={inputCls} value={form.kelurahan} onChange={e => set('kelurahan', e.target.value)} placeholder="Kelurahan/Desa" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Alamat</label>
              <textarea className={inputCls} rows={2} value={form.alamat} onChange={e => set('alamat', e.target.value)} placeholder="Alamat lengkap" />
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-[var(--color-border-tertiary)] flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-text-primary)] text-[var(--color-background-primary)] disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}
