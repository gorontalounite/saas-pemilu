'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Zap, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.href = '/'
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-base font-semibold text-[var(--text-primary)]">KampanyeOS</p>
            <p className="text-[10px] text-[var(--text-muted)]">One Source of Truth</p>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <div className="mb-2">
            <h1 className="text-sm font-semibold text-[var(--text-primary)]">Masuk ke akun Anda</h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Platform manajemen kampanye legislatif</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-secondary)]">Email</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)] transition-colors" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-secondary)]">Password</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg pl-8 pr-9 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)] transition-colors" />
              <button onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          {error && <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
          <button onClick={handleLogin} disabled={loading || !email || !password}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 size={13} className="animate-spin" /> : null}
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </div>
        <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">KampanyeOS · Gorontalo Unite · 2025–2029</p>
      </div>
    </div>
  )
}
