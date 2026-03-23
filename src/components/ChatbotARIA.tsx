'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Bot, Send, Loader2, Upload, Download, MessageSquare, Smartphone, Bell, Clock, Plus, Trash2, BookOpen, Database, Globe } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: 'db' | 'rag' | 'general'
  created_at: string
}

const SUGGESTED = [
  'Berapa total relawan aktif saat ini?',
  'Apa saja jadwal kampanye minggu ini?',
  'Tunjukkan ringkasan keuangan bulan ini',
  'Siapa kompetitor terkuat di dapil ini?',
  'Berapa perolehan suara NasDem di Kota Gorontalo 2019?',
  'Bagaimana strategi kampanye door-to-door yang efektif?',
]

const SOURCE_LABEL: Record<string, { label: string; color: string; icon: any }> = {
  db:      { label: 'Dari Database',      color: 'text-blue-400',   icon: Database },
  rag:     { label: 'Dari Knowledge Base', color: 'text-green-400', icon: BookOpen },
  general: { label: 'General Knowledge',  color: 'text-amber-400',  icon: Globe },
}

interface Props { onBack: () => void }

export default function ChatbotARIA({ onBack }: Props) {
  const supabase = createClient()
  const [tab, setTab] = useState<'chat'|'whatsapp'>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [kandidatId, setKandidatId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setKandidatId(data.user.id)
        loadHistory(data.user.id)
      }
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadHistory(uid: string) {
    const { data } = await supabase.from('chat_riwayat')
      .select('id,peran,isi,sumber,created_at')
      .eq('kandidat_id', uid)
      .order('created_at', { ascending: true })
      .limit(50)
    if (data) {
      setMessages(data.map((d: any) => ({
        id: d.id,
        role: d.peran as 'user' | 'assistant',
        content: d.isi,
        source: d.sumber,
        created_at: d.created_at,
      })))
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    }
    setMessages(p => [...p, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Simpan pesan user ke DB
      if (kandidatId) {
        await supabase.from('chat_riwayat').insert({
          kandidat_id: kandidatId,
          user_id: kandidatId,
          peran: 'user',
          isi: userMsg.content,
        })
      }

      // Panggil Claude API
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `Kamu adalah ARIA (Asisten Riset & Intelijen Aktivitas), AI asisten kampanye legislatif untuk KampanyeOS. 
Kamu membantu tim kampanye di Provinsi Gorontalo dengan pertanyaan seputar strategi kampanye, data pemilih, relawan, keuangan, dan monitoring situasi.
Jawab dalam Bahasa Indonesia yang jelas dan profesional. Jika pertanyaan tentang data spesifik yang kamu tidak tahu, sarankan pengguna cek modul terkait.
Tambahkan label [DB], [RAG], atau [GENERAL] di awal respons untuk menandai sumber pengetahuanmu.`,
          messages: [
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMsg.content }
          ]
        })
      })
      const data = await res.json()
      const rawContent = data.content?.[0]?.text || 'Maaf, saya tidak bisa menjawab saat ini.'

      // Deteksi sumber dari label
      let source: 'db'|'rag'|'general' = 'general'
      let content = rawContent
      if (rawContent.startsWith('[DB]')) { source = 'db'; content = rawContent.replace('[DB]', '').trim() }
      else if (rawContent.startsWith('[RAG]')) { source = 'rag'; content = rawContent.replace('[RAG]', '').trim() }
      else if (rawContent.startsWith('[GENERAL]')) { source = 'general'; content = rawContent.replace('[GENERAL]', '').trim() }

      const assistantMsg: Message = {
        id: (Date.now()+1).toString(),
        role: 'assistant',
        content,
        source,
        created_at: new Date().toISOString(),
      }
      setMessages(p => [...p, assistantMsg])

      // Simpan respons ARIA ke DB
      if (kandidatId) {
        await supabase.from('chat_riwayat').insert({
          kandidat_id: kandidatId,
          peran: 'assistant',
          isi: content,
          sumber: source,
        })
      }
    } catch (err) {
      setMessages(p => [...p, {
        id: (Date.now()+1).toString(),
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan koneksi. Coba lagi sebentar.',
        created_at: new Date().toISOString(),
      }])
    }
    setLoading(false)
  }

  async function clearHistory() {
    if (!kandidatId) return
    await supabase.from('chat_riwayat').delete().eq('kandidat_id', kandidatId)
    setMessages([])
  }

  function exportChat() {
    const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `ARIA-chat-${new Date().toLocaleDateString('id-ID')}.txt`
    a.click()
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/8 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
            <Bot size={22} className="text-violet-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">11</span>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Chatbot ARIA</h2>
              <span className="text-[9px] bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Online</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Asisten Riset & Intelijen Aktivitas — AI kampanye berbasis data real-time & knowledge base</p>
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="flex gap-1 bg-[var(--bg-hover)] p-1 rounded-xl w-fit">
        {[{id:'chat',label:'Chat',icon:MessageSquare},{id:'whatsapp',label:'WhatsApp Channel',icon:Smartphone}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      {/* Chat tab */}
      {tab === 'chat' && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col" style={{height:'calc(100vh - 380px)', minHeight:'400px'}}>
          {/* Chat toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-hover)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-medium text-[var(--text-primary)]">ARIA</span>
              <span className="text-[10px] text-[var(--text-muted)]">· {messages.length} pesan</span>
            </div>
            <div className="flex gap-1.5">
              <input ref={fileRef} type="file" className="hidden" accept=".pdf,.txt,.docx"
                onChange={() => alert('Upload dokumen ke knowledge base — segera hadir')} />
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
                <Upload size={10} /> Upload Dokumen
              </button>
              <button onClick={exportChat}
                className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
                <Download size={10} /> Export
              </button>
              <button onClick={clearHistory}
                className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-red-400 border border-[var(--border)] px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
                <Trash2 size={10} /> Hapus
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Bot size={28} className="text-violet-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Halo! Saya ARIA 👋</p>
                  <p className="text-xs text-[var(--text-muted)]">Asisten AI kampanye KampanyeOS. Tanya apapun tentang data, strategi, atau situasi kampanye.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {SUGGESTED.map(s => (
                    <button key={s} onClick={() => { setInput(s) }}
                      className="text-left text-[11px] text-[var(--text-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 hover:bg-[var(--bg-hover)] hover:border-violet-500/30 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={13} className="text-violet-400" />
                  </div>
                )}
                <div className={`max-w-[75%] ${m.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-violet-500 text-white rounded-br-sm'
                      : 'bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-sm'
                  }`}>
                    {m.content}
                  </div>
                  {m.source && m.role === 'assistant' && (
                    <div className={`flex items-center gap-1 mt-1 ${SOURCE_LABEL[m.source]?.color}`}>
                      {(() => { const S = SOURCE_LABEL[m.source]?.icon; return S ? <S size={9} /> : null })()}
                      <span className="text-[9px]">{SOURCE_LABEL[m.source]?.label}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-violet-400" />
                </div>
                <div className="bg-[var(--bg-hover)] border border-[var(--border)] px-3.5 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-violet-400" />
                  <span className="text-[11px] text-[var(--text-muted)]">ARIA sedang berpikir...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[var(--border)] p-3">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Tanya ARIA tentang data kampanye, strategi, atau situasi terkini..."
                className="flex-1 bg-[var(--bg-hover)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[12px] text-[var(--text-primary)] outline-none focus:border-violet-500 transition-colors placeholder:text-[var(--text-muted)]" />
              <button onClick={sendMessage} disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0">
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp tab */}
      {tab === 'whatsapp' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Smartphone size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">WhatsApp Bot ARIA</p>
                <p className="text-[11px] text-[var(--text-muted)]">Channel terpisah dari broadcast — untuk komunikasi 2 arah</p>
              </div>
              <span className="ml-auto text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">Segera Hadir</span>
            </div>
            <div className="space-y-3">
              {[
                { icon:Smartphone, title:'Nomor Bot Dedicated', desc:'Nomor WhatsApp khusus untuk ARIA — anggota tim bisa tanya langsung via WA' },
                { icon:MessageSquare, title:'Riwayat Percakapan', desc:'Semua percakapan WA tersimpan di dashboard untuk review tim' },
                { icon:Bell, title:'Notifikasi Proaktif', desc:'ARIA kirim alert otomatis jika ada isu kritis, update relawan, atau laporan penting' },
                { icon:Clock, title:'Laporan Harian Jam 20:00', desc:'Ringkasan hari ini otomatis dikirim ke kandidat & tim inti setiap pukul 20:00 WITA' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-hover)]">
                  <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <f.icon size={13} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--text-primary)]">{f.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
