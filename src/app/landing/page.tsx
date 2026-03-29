'use client'
import { useState, useEffect } from 'react'
import { Zap, Sun, Moon, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('light', !dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-4">
      <button onClick={() => setDark(!dark)} className="fixed top-4 right-4 w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
        {dark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <div className="w-full max-w-lg text-center space-y-6">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-500 flex items-center justify-center">
            <Zap size={28} className="text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">KampanyeOS</h1>
          <p className="text-lg text-[var(--text-secondary)]">Platform Manajemen Kampanye Legislatif</p>
        </div>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">Satu platform, satu komando, satu instruksi. Kelola seluruh kampanye Anda dari relawan, pemilih, hingga quick count hari-H.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/login" className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-colors">Masuk</a>
          <a href="/register" className="flex items-center justify-center gap-2 border border-indigo-500/50 hover:bg-indigo-500/5 text-indigo-400 font-medium py-3 rounded-xl transition-colors">Daftar <ArrowRight size={14} /></a>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-8">Gorontalo Unite · 2026–2029</p>
      </div>
    </div>
  )
}
