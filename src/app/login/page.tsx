'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, Sun, Moon } from 'lucide-react'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [dark, setDark]         = useState(false)

  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark')
    setDark(isDark)
  }

  async function handleLogin() {
    if (!email || !password) { setError('Isi email dan password.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        {dark ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-base font-semibold text-[var(--text-primary)]">KampanyeOS</p>
            <p className="text-[10px] text-[var(--text-muted)]">Platform Kampanye Legislatif</p>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <div>
            <h1 className="text-sm font-semibold text-[var(--text-primary)]">Masuk ke akun</h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Kelola kampanye legislatif Anda</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-secondary)]">Email</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="nama@email.com"
                className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-secondary)]">Password</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Password kamu"
                className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg pl-8 pr-9 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-indigo-500 placeholder:text-[var(--text-muted)] transition-colors"
              />
              <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleLogin} disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? 'Masuk...' : 'Masuk'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[var(--bg-card)] px-2 text-[10px] text-[var(--text-muted)]">atau</span>
            </div>
          </div>

          <a
            href="/register"
            className="w-full border border-[var(--border)] hover:border-indigo-500/50 hover:bg-indigo-500/5 text-[var(--text-secondary)] hover:text-indigo-400 text-xs font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Daftar sebagai kandidat
          </a>
        </div>

        <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">
          KampanyeOS · Gorontalo Unite · 2026–2029
        </p>
      </div>
    </div>
  )
}
