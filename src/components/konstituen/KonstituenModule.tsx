'use client'

import { useState, useCallback } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useKonstituen, Konstituen, KonstituenFilter } from '@/hooks/useKonstituen'
import KonstituenForm from './KonstituenForm'

const STATUS_CRM_BADGE: Record<string, string> = {
  baru: 'bg-blue-50 text-blue-700',
  terhubung: 'bg-yellow-50 text-yellow-700',
  aktif: 'bg-green-50 text-green-700',
  dorman: 'bg-gray-100 text-gray-500',
}

const KATEGORI_BADGE: Record<string, string> = {
  pemilih: 'bg-purple-50 text-purple-700',
  tokoh: 'bg-orange-50 text-orange-700',
  kelompok: 'bg-teal-50 text-teal-700',
  aspirasi: 'bg-pink-50 text-pink-700',
}

export default function KonstituenModule() {
  const { activeTenant, isManager } = useTenant()
  const [filter, setFilter] = useState<KonstituenFilter>({})
  const [page, setPage] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Konstituen | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Konstituen | null>(null)
  const [search, setSearch] = useState('')

  const { data, loading, error, total, fetch, create, update, remove } = useKonstituen(activeTenant?.id ?? null)
  const PAGE_SIZE = 20

  const applyFilter = useCallback((f: KonstituenFilter) => {
    setFilter(f)
    setPage(0)
    fetch(f, 0, PAGE_SIZE)
  }, [fetch])

  function handleSearch(val: string) {
    setSearch(val)
    applyFilter({ ...filter, search: val })
  }

  async function handleSave(payload: Omit<Konstituen, 'id' | 'created_at'>) {
    if (editTarget) {
      await update(editTarget.id, payload)
    } else {
      await create(payload)
    }
    setShowForm(false)
    setEditTarget(null)
    fetch(filter, page, PAGE_SIZE)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await remove(deleteTarget.id)
    setDeleteTarget(null)
    fetch(filter, page, PAGE_SIZE)
  }

  if (!activeTenant) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--color-text-secondary)] text-sm">
        Pilih tenant terlebih dahulu
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-[var(--color-text-primary)]">Konstituen</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{total.toLocaleString('id')} total data</p>
        </div>
        {isManager && (
          <button
            onClick={() => { setEditTarget(null); setShowForm(true) }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-text-primary)] text-[var(--color-background-primary)]"
          >
            + Tambah
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Cari nama, NIK, no. HP..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-[var(--color-border-secondary)] bg-[var(--color-background-primary)] text-sm text-[var(--color-text-primary)] focus:outline-none"
        />
        <select
          value={filter.kategori ?? ''}
          onChange={e => applyFilter({ ...filter, kategori: e.target.value as KonstituenFilter['kategori'] })}
          className="px-3 py-2 rounded-lg border border-[var(--color-border-secondary)] bg-[var(--color-background-primary)] text-sm text-[var(--color-text-primary)]"
        >
          <option value="">Semua kategori</option>
          <option value="pemilih">Pemilih</option>
          <option value="tokoh">Tokoh</option>
          <option value="kelompok">Kelompok</option>
          <option value="aspirasi">Aspirasi</option>
        </select>
        <select
          value={filter.status_crm ?? ''}
          onChange={e => applyFilter({ ...filter, status_crm: e.target.value as KonstituenFilter['status_crm'] })}
          className="px-3 py-2 rounded-lg border border-[var(--color-border-secondary)] bg-[var(--color-background-primary)] text-sm text-[var(--color-text-primary)]"
        >
          <option value="">Semua status</option>
          <option value="baru">Baru</option>
          <option value="terhubung">Terhubung</option>
          <option value="aktif">Aktif</option>
          <option value="dorman">Dorman</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-[var(--color-background-danger)] text-[var(--color-text-danger)] text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-[var(--color-border-tertiary)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-background-secondary)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Nama</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)] hidden md:table-cell">NIK</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)] hidden md:table-cell">No. HP</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)] hidden lg:table-cell">Wilayah</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Kategori</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">CRM</th>
              {isManager && <th className="px-4 py-3 text-right font-medium text-[var(--color-text-secondary)]">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--color-text-tertiary)]">Memuat data...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--color-text-tertiary)]">Belum ada data konstituen</td>
              </tr>
            ) : data.map(k => (
              <tr key={k.id} className="border-t border-[var(--color-border-tertiary)] hover:bg-[var(--color-background-secondary)]">
                <td className="px-4 py-3 text-[var(--color-text-primary)] font-medium">{k.nama}</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden md:table-cell">{k.nik ?? '-'}</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden md:table-cell">{k.no_hp ?? '-'}</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden lg:table-cell">
                  {[k.kelurahan, k.kecamatan, k.kabkota].filter(Boolean).join(', ') || '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${KATEGORI_BADGE[k.kategori] ?? ''}`}>
                    {k.kategori}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CRM_BADGE[k.status_crm] ?? ''}`}>
                    {k.status_crm}
                  </span>
                </td>
                {isManager && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { setEditTarget(k); setShowForm(true) }}
                      className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(k)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
          <span>Halaman {page + 1} dari {Math.ceil(total / PAGE_SIZE)}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => { const p = page - 1; setPage(p); fetch(filter, p, PAGE_SIZE) }}
              className="px-3 py-1 rounded border border-[var(--color-border-secondary)] disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              disabled={(page + 1) * PAGE_SIZE >= total}
              onClick={() => { const p = page + 1; setPage(p); fetch(filter, p, PAGE_SIZE) }}
              className="px-3 py-1 rounded border border-[var(--color-border-secondary)] disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <KonstituenForm
          initial={editTarget ?? undefined}
          tenantId={activeTenant.id}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm bg-[var(--color-background-primary)] rounded-2xl p-6 shadow-xl">
            <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Hapus konstituen?</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              <strong>{deleteTarget.nama}</strong> akan dihapus permanen.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]">
                Batal
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
