'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

export type KategoriKonstituen = 'pemilih' | 'tokoh' | 'kelompok' | 'aspirasi'
export type StatusCRM = 'baru' | 'terhubung' | 'aktif' | 'dorman'

export interface Konstituen {
  id: string
  tenant_id: string
  kandidat_id: string | null
  nama: string
  nik: string | null
  no_hp: string | null
  alamat: string | null
  kabkota: string | null
  kecamatan: string | null
  kelurahan: string | null
  kategori: KategoriKonstituen
  status_crm: StatusCRM
  created_at: string
}

export interface KonstituenFilter {
  search?: string
  kategori?: KategoriKonstituen | ''
  status_crm?: StatusCRM | ''
  kabkota?: string
}

export function useKonstituen(tenantId: string | null) {
  const supabase = createClient()
  const [data, setData] = useState<Konstituen[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetch = useCallback(async (filter: KonstituenFilter = {}, page = 0, limit = 20) => {
    if (!tenantId) return
    setLoading(true)
    setError(null)

    let query = supabase
      .from('konstituen')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1)

    if (filter.search) {
      query = query.or(`nama.ilike.%${filter.search}%,nik.ilike.%${filter.search}%,no_hp.ilike.%${filter.search}%`)
    }
    if (filter.kategori) query = query.eq('kategori', filter.kategori)
    if (filter.status_crm) query = query.eq('status_crm', filter.status_crm)
    if (filter.kabkota) query = query.eq('kabkota', filter.kabkota)

    const { data: rows, error: err, count } = await query

    if (err) setError(err.message)
    else {
      setData(rows as Konstituen[])
      setTotal(count ?? 0)
    }
    setLoading(false)
  }, [tenantId])

  const create = async (payload: Omit<Konstituen, 'id' | 'created_at'>) => {
    const { data: row, error: err } = await supabase
      .from('konstituen')
      .insert({ ...payload, tenant_id: tenantId })
      .select()
      .single()
    if (err) throw new Error(err.message)
    return row as Konstituen
  }

  const update = async (id: string, payload: Partial<Konstituen>) => {
    const { data: row, error: err } = await supabase
      .from('konstituen')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (err) throw new Error(err.message)
    return row as Konstituen
  }

  const remove = async (id: string) => {
    const { error: err } = await supabase
      .from('konstituen')
      .delete()
      .eq('id', id)
    if (err) throw new Error(err.message)
  }

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, total, fetch, create, update, remove }
}
