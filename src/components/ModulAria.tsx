'use client'
import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Bot, Send, Loader2, Sparkles, RefreshCw, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const STARTER_QUESTIONS = [
  'Berapa target suara yang realistis untuk dapilku?',
  'Strategi canvassing apa yang paling efektif di Gorontalo?',
  'Bagaimana cara meningkatkan elektabilitas dengan cepat?',
  'Isu apa yang paling relevan untuk pemilih di Gorontalo?',
  'Bagaimana cara mengelola relawan lapangan yang efektif?',
  'Apa saja syarat dokumen untuk pencalonan legislatif?',
]

interface Props { onBack: () => void }

export default function ModulAria({ onBack }: Props) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [kandidatCtx, setKandidatCtx] = useState<string>('')
  const [kandidatId, setKandidatId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadCtx() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setKandidatId(user.id)
      const { data } = await supabase
        .from('kandidat')
        .select('nama_lengkap,dapil,kontestasi,target_suara,visi,partai')
        .eq('id', user.id)
        .single()
      if (data) {
        setKandidatCtx(
          `Nama: ${data.nama_lengkap}, Dapil: ${data.dapil}, ` +
          `Kontestasi: ${data.kontestasi?.replace(/_/g, ' ')}, ` +
          `Partai: ${data.partai || 'belum diisi'}, ` +
          `Target suara: ${data.target_suara?.toLocaleString('id-ID')}, ` +
          `Visi: ${data.visi || 'belum diisi'}`
        )
      }
    }
    loadCtx()
    setMessages([{
      role: 'assistant',
      content: 'Halo! Saya **ARIA** — Asisten Riset & Intelijen Kampanye untuk KampanyeOS.\n\nSaya siap membantu strategi kampanye, analisis data Gorontalo, regulasi KPU, manajemen relawan, dan apa saja yang berkaitan dengan pemenangan Pemilu 2029.\n\nAda yang bisa saya bantu?',
      timestamp: new Date(),
    }])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function renderContent(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  async function sendMessage(text?: string) {
    const userText = (text || input).trim()
    if (!userText || loading) return
    setInput('')

    const userMsg: Message = { role: 'user', content: userText, timestamp: new Date() }
    setMessages(p => [...p, userMsg])
    setLoading(true)

    try {
      const systemPrompt = `Kamu adalah ARIA (Asisten Riset & Intelijen Kampanye), AI asisten untuk platform KampanyeOS yang membantu calon legislatif di Provinsi Gorontalo memenangkan Pemilu 2029.

Konteks kandidat saat ini:
${kandidatCtx || 'Data kandidat belum tersedia — minta kandidat lengkapi profil di Modul 09'}

Panduan respons:
- Jawab dalam Bahasa Indonesia yang natural dan profesional
- Berikan jawaban yang actionable dan spesifik, bukan umum
- Gunakan data konteks Gorontalo bila relevan (6 kab/kota: Kota Gorontalo, Kab. Gorontalo, Gorontalo Utara, Bone Bolango, Boalemo, Pohuwato — total ~881.206 DPT, 3.539 TPS)
- Referensikan modul KampanyeOS yang relevan bila perlu
- Format respons dengan **bold** untuk poin penting, gunakan baris baru untuk keterbacaan
- Jika ditanya regulasi, rujuk ke UU No.7/2017 dan PKPU terbaru
- Maksimal 300 kata per respons kecuali diminta detail lebih`

      const history = messages.slice(-10).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...history, { role: 'user', content: userText }],
        }),
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()
      const assistantText = data.content?.[0]?.text || 'Maaf, terjadi kesalahan. Silakan coba lagi.'

      setMessages(p => [...p, {
        role: 'assistant',
        content: assistantText,
        timestamp: new Date(),
      }])

      // Simpan ke chat_riwayat
      if (kandidatId) {
        await supabase.from('chat_riwayat').insert([
          { kandidat_id: kandidatId, peran: 'user',      isi: userText,      sumber: 'aria' },
          { kandidat_id: kandidatId, peran: 'assistant', isi: assistantText, sumber: 'aria' },
        ])
      }
    } catch {
      setMessages(p => [...p, {
        role: 'assistant',
        content: 'Koneksi ke AI gagal. Pastikan jaringan aktif dan coba lagi.',
        timestamp: new Date(),
      }])
    }

    setLoading(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function clearChat() {
    setMessages([{
      role: 'assistant',
      content: 'Chat dibersihkan. Ada yang bisa saya bantu?',
      timestamp: new Date(),
    }])
  }

  return (
    <div className="flex flex-col animate-slide-up" style={{ height: 'calc(100vh - 7rem)' }}>

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-3 flex-shrink-0"
      >
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/8 p-4 mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
            <Bot size={20} className="text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">ARIA</h2>
              <span className="text-[9px] bg-violet-500/15 text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded-full font-medium">
                AI Kampanye
              </span>
              <span className="flex items-center gap-1 text-[9px] text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Online
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Asisten Riset &amp; Intelijen Kampanye · Konteks kandidat aktif
              {kandidatCtx && <span className="text-violet-400 ml-1">✓</span>}
            </p>
          </div>
          <button
            onClick={clearChat}
            title="Bersihkan chat"
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors flex-shrink-0"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === 'user'
                ? 'bg-indigo-500/20 border border-indigo-500/30'
                : 'bg-violet-500/20 border border-violet-500/30'
            }`}>
              {msg.role === 'user'
                ? <User size={13} className="text-indigo-300" />
                : <Bot size={13} className="text-violet-300" />
              }
            </div>
            <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-500/15 border border-indigo-500/20 text-[var(--text-primary)] rounded-tr-sm'
                : 'bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--text-secondary)] rounded-tl-sm'
            }`}>
              <span dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }} />
              <p className="text-[9px] text-[var(--text-muted)] mt-1.5 opacity-60">
                {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
              <Bot size={13} className="text-violet-300" />
            </div>
            <div className="bg-[var(--bg-hover)] border border-[var(--border)] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin text-violet-400" />
              <span className="text-[11px] text-[var(--text-muted)]">ARIA sedang berpikir...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starter questions */}
      {messages.length <= 1 && (
        <div className="flex-shrink-0 mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STARTER_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="text-left text-[10px] p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] hover:border-violet-500/30 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-all leading-relaxed"
            >
              <Sparkles size={9} className="inline mr-1 text-violet-400" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 mt-3 flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Tanya ARIA tentang strategi kampanye, regulasi, atau data Gorontalo..."
          disabled={loading}
          className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-violet-500 placeholder:text-[var(--text-muted)] transition-colors disabled:opacity-60"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send size={14} className="text-white" />
        </button>
      </div>
    </div>
  )
}
