# KampanyeOS

> **One Source of Truth. Satu platform, satu komando, satu instruksi.**

Platform SaaS manajemen kampanye legislatif berbasis data untuk Pemilu 2029 — dirancang untuk Calon Anggota DPR RI / DPRD dan tim suksesnya di Provinsi Gorontalo.

**Live:** [https://saas-pemilu.vercel.app](https://saas-pemilu.vercel.app)  
**Repo:** [https://github.com/gorontalounite/saas-pemilu](https://github.com/gorontalounite/saas-pemilu)  
**Supabase Project:** `ygaqoanykrwmzeuydexq` (ap-southeast-1)

---

## Status Saat Ini — v0.7 (Beta — Auth & Dashboard Live)

| Komponen | Status |
|----------|--------|
| Routing & navigasi (13 modul) | ✅ Selesai |
| Dashboard Master + peta SVG Gorontalo | ✅ Selesai |
| Topbar + countdown 14 Feb 2029 | ✅ Selesai |
| Dark / Light mode toggle | ✅ Selesai |
| Responsive (mobile + desktop) | ✅ Selesai |
| Login page + Register 4-step | ✅ Selesai (dengan error handling) |
| Supabase Auth — signup/login/logout | ✅ Aktif |
| Middleware proteksi route | ✅ Aktif |
| Landing page (/landing) | ✅ Selesai |
| Database schema 48 tabel | ✅ Migrasi selesai |
| RLS Policies — semua tabel | ✅ Selesai |
| Database Center — CRUD interface | ✅ Selesai |
| RAG Knowledge Base | ✅ Selesai |
| Modul 10 — Peta Suara & Referensi | ✅ Live |
| Modul 11 — Chatbot ARIA (Anthropic API) | ✅ Live |
| Modul 12 — Media Monitoring | ✅ Live |
| CI/CD Vercel | ✅ Aktif |

### ⚠️ Known Issues (Sprint Berikutnya)

1. **Register Error:** "Database error saving new user"
   - Trigger Supabase perlu diverifikasi
   - Saat ini email confirmation masih pending

2. **Dark/Light Mode:** Login & Register masih muncul dark mode
   - Perlu force light mode di mount
   - CSS variables global mungkin override

---

## Tech Stack

| Layer | Detail |
|-------|--------|
| Frontend | Next.js 14.2.5 — App Router, TypeScript, Tailwind CSS |
| Database | Supabase — PostgreSQL, Auth, RLS, Realtime |
| Deploy | Vercel — auto-deploy dari GitHub `main` |
| AI | Anthropic Claude API (Modul 11) |
| Icons | Lucide React |
| State | React hooks + TenantContext (multi-tenant) |

---

## Instalasi Lokal

### 1. Clone Repository

```bash
git clone https://github.com/gorontalounite/saas-pemilu.git
cd saas-pemilu
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root folder:

```
NEXT_PUBLIC_SUPABASE_URL=https://ygaqoanykrwmzeuydexq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ambil dari Supabase dashboard>
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka: http://localhost:3000

---

## Project Structure

```
saas-pemilu/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               ← Main dashboard & routing
│   │   ├── globals.css            ← CSS variables dark/light
│   │   ├── landing/page.tsx       ← Landing page
│   │   ├── login/page.tsx         ← Login (light mode default)
│   │   └── register/page.tsx      ← Register 4-step (light mode default)
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── DashboardOverview.tsx  ← Modul 00
│   │   ├── ModulPage.tsx          ← Shell modul 01-09
│   │   ├── DatabaseCenter.tsx
│   │   ├── RAGKnowledge.tsx
│   │   ├── PetaSuara.tsx          ← Modul 10 (live)
│   │   ├── ModulAria.tsx          ← Modul 11 (live)
│   │   └── ModulMediaMonitoring.tsx ← Modul 12 (live)
│   ├── lib/
│   │   ├── supabase.ts            ← Browser client
│   │   ├── supabase-server.ts     ← Server client
│   │   └── data.ts                ← Mock data & constants
│   ├── contexts/
│   │   └── TenantContext.tsx      ← Multi-tenant state
│   └── middleware.ts              ← Auth routing protection
├── supabase/
│   ├── config.toml
│   └── migrations/               ← 11 migration files
├── .env.local.example
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 13 Modul Produk

| No | Modul | Deskripsi | Status |
|----|-------|-----------|--------|
| 00 | Dashboard Master | Command center semua modul | 🟡 Shell |
| 09 | Profil Calon | Profil, visi misi, program kerja | 🟡 Shell |
| 01 | Relawan & Posko | Database relawan, absensi, tugas | 🟡 Shell |
| 02 | Pemetaan Pemilih | Peta TPS, DPT, canvassing | 🟡 Shell |
| 03 | Kampanye Digital | Konten, sosmed monitoring | 🟡 Shell |
| 04 | Saksi & Quick Count | Upload C1, agregasi real-time | 🟡 Shell (H-Day) |
| 05 | Survei & Elektabilitas | Tracking elektabilitas, simulasi | 🟡 Shell |
| 06 | Keuangan & Budget | RAB, transaksi, LPPDK | 🟡 Shell |
| 07 | War Room | Crisis room, laporan eksekutif | 🟡 Shell |
| 08 | Konstituen | By-name by-address, CRM | 🟡 Shell |
| 10 | Peta Suara & Referensi | Data DPRD, dapil, histori 2019 | 🟢 Live |
| 11 | Chatbot ARIA | AI kampanye via Anthropic | 🟢 Live |
| 12 | Media Monitoring | Berita, sosmed, sentimen | 🟢 Live |

---

## Deploy ke Vercel

### 1. Push ke GitHub

```bash
git add .
git commit -m "feat: deskripsi perubahan"
git push origin main
```

### 2. Auto-deploy Vercel

Vercel akan otomatis deploy dalam ~90 detik saat push ke `main`.

**Environment variables di Vercel Dashboard:**
```
NEXT_PUBLIC_SUPABASE_URL      = https://ygaqoanykrwmzeuydexq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
```

### 3. Verifikasi

Buka: https://saas-pemilu.vercel.app

---

## Database Schema

### Tabel Referensi (Read-Only)
- `ref_kabkota` — 6 kabupaten/kota Gorontalo
- `ref_partai` — 18 partai peserta Pemilu 2024
- `ref_dapil` — Semua dapil (DPR RI, DPRD Prov, DPRD Kab/Kota)
- `ref_anggota_dprd` — Anggota DPRD terpilih 2024
- `histori_pemilu` — Hasil Pileg 2019

### Tabel Auth & Tenant
- `profiles` — Sync dengan auth.users
- `users` — Extended user profile
- `kandidat` — Data kandidat (id = auth.uid())
- `tenants` — Multi-tenant
- `tenant_members` — Role per user

### Tabel Operasional (48 total)
Relawan, TPS, Posko, Pemilih, Absensi, Tugas, Konten, Rab, Transaksi, Survei, Crisis_room, dan 37 tabel lainnya.

---

## Routing & Pages

| Path | Deskripsi | Status |
|------|-----------|--------|
| `/landing` | Landing page | ✅ Public |
| `/` | Dashboard (protected) | ✅ Auth required |
| `/login` | Login page | ✅ Public |
| `/register` | Register 4-step | ✅ Public |
| `/auth/callback` | Supabase callback | ✅ Public |

**Middleware Logic:**
```
Jika tidak login → redirect ke /login
Jika sudah login + akses /login atau /register → redirect ke /
Jika akses / → check auth → jika belum login, redirect ke /landing
```

---

## Build & Testing

### Build Production

```bash
npm run build
```

### Jalankan Production Build Locally

```bash
npm run start
```

### Lint Code

```bash
npm run lint
```

---

## Konvensi Kode

### CSS & Variables
Semua warna pakai CSS variables (lihat `src/app/globals.css`):
```css
--bg-base       /* background halaman */
--bg-card       /* background card */
--bg-hover      /* hover state */
--border        /* border default */
--text-primary  /* teks utama */
--text-secondary/* teks sekunder */
--text-muted    /* teks redup */
```

### Supabase Client
```typescript
// Browser component
import { createClient } from '@/lib/supabase'
const supabase = createClient()

// Server component
import { createServerSupabaseClient } from '@/lib/supabase-server'
const supabase = await createServerSupabaseClient()
```

### Komponen
- Semua `'use client'` untuk client components
- Interface props selalu explicit
- Toast: `{ type: 'ok'|'err', msg: string } | null`

---

## Masalah & Debugging

### Problem: "Database error saving new user"

**Penyebab:** Trigger Supabase tidak otomatis membuat user profile saat signup.

**Cara Debug:**
1. Buka Supabase Dashboard → SQL Editor
2. Cari trigger: `on_auth_user_created`
3. Jalankan trigger manual atau check logs
4. Verifikasi RLS policy pada tabel `users`, `kandidat`, `tenants`

### Problem: Dark mode tidak hilang di login/register

**Penyebab:** CSS global override atau class `.dark` masih ada di `<html>`.

**Solusi:**
```typescript
useEffect(() => {
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
}, [])
```

---

## Roadmap

### Sprint 2 — CRUD Live Modul Prioritas
- [ ] Modul 09: form profil kandidat
- [ ] Modul 01: CRUD relawan + CSV import
- [ ] Modul 06: RAB + transaksi

### Sprint 3 — Pemetaan Pemilih
- [ ] Modul 02: import DPT dari KPU
- [ ] Leaflet.js peta interaktif
- [ ] Canvassing form

### Sprint 4 — Kampanye Digital
- [ ] Modul 03: kalender konten + approval
- [ ] WhatsApp API integration

### Sprint 5 — Quick Count H-Day
- [ ] Modul 04: penugasan saksi + upload C1
- [ ] OCR foto C1
- [ ] Realtime agregasi

---

## Kontribusi

1. Fork repo
2. Buat branch feature: `git checkout -b feature/nama-fitur`
3. Commit: `git commit -m "feat: deskripsi"`
4. Push: `git push origin feature/nama-fitur`
5. Buat Pull Request

---

## Lisensi

Proprietary — hak cipta milik tim pengembang. Tidak untuk didistribusikan tanpa izin.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/gorontalounite/saas-pemilu/issues)
- **Documentation:** Lihat `CLAUDE.md`
- **Live Demo:** https://saas-pemilu.vercel.app

---

*KampanyeOS · Gorontalo Unite · 2026–2029*
