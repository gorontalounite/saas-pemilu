'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase'

type MemberRole = 'owner' | 'manager' | 'staff'
type FunctionalRole = 'calon' | 'tim_inti' | 'relawan' | 'saksi'

interface Tenant {
  id: string
  name: string
  kandidat_id: string | null
  slug: string | null
}

interface TenantMembership {
  tenant: Tenant
  member_role: MemberRole
  functional_role: FunctionalRole | null
  display_name: string | null
}

interface TenantContextType {
  memberships: TenantMembership[]
  activeTenant: Tenant | null
  activeMembership: TenantMembership | null
  setActiveTenantId: (id: string) => void
  isOwner: boolean
  isManager: boolean
  loading: boolean
}

const TenantContext = createContext<TenantContextType | null>(null)

export function TenantProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [memberships, setMemberships] = useState<TenantMembership[]>([])
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data, error } = await supabase
        .from('tenant_members')
        .select(`
          member_role, functional_role, display_name,
          tenant:tenants (id, name, kandidat_id, slug)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (!error && data) {
        const parsed = data as unknown as TenantMembership[]
        setMemberships(parsed)
        const saved = localStorage.getItem('activeTenantId')
        const valid = parsed.find(m => m.tenant.id === saved)
        setActiveTenantId(valid ? saved! : (parsed[0]?.tenant.id ?? null))
      }
      setLoading(false)
    }
    load()
  }, [])

  const activeMembership = memberships.find(m => m.tenant.id === activeTenantId) ?? null
  const activeTenant = activeMembership?.tenant ?? null
  const isOwner = activeMembership?.member_role === 'owner'
  const isManager = ['owner', 'manager'].includes(activeMembership?.member_role ?? '')

  function handleSetActive(id: string) {
    setActiveTenantId(id)
    localStorage.setItem('activeTenantId', id)
  }

  return (
    <TenantContext.Provider value={{
      memberships, activeTenant, activeMembership,
      setActiveTenantId: handleSetActive,
      isOwner, isManager, loading
    }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant harus dipakai di dalam TenantProvider')
  return ctx
}