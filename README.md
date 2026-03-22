# KampanyeOS

> **One Source of Truth. Satu platform, satu komando, satu instruksi.**

Platform SaaS manajemen kampanye legislatif berbasis data — dirancang untuk Calon Anggota DPR RI / DPRD dan tim suksesnya. Mencakup seluruh siklus kampanye: dari manajemen relawan, pemetaan pemilih, kampanye digital, hingga quick count hari-H dan manajemen konstituen pasca terpilih.

**Live:** [https://saas-pemilu.vercel.app](https://saas-pemilu.vercel.app)
**Repo:** [https://github.com/gorontalounite/saas-pemilu](https://github.com/gorontalounite/saas-pemilu)

---

## Kondisi Saat Ini — v0.4 (Foundation Complete)

Shell dashboard sudah berdiri penuh. Supabase client terhubung. Login page aktif. Migration schema belum dijalankan — CRUD per modul menyusul di sprint berikutnya.

| Komponen | Status |
|----------|--------|
| Routing & navigasi sidebar | ✅ Selesai |
| Dashboard Master (layout) | ✅ Selesai |
| Topbar + countdown 14 Feb 2029 | ✅ Selesai |
| Dark / Light mode toggle | ✅ Selesai |
| 10 modul — shell & placeholder | ✅ Selesai |
| Daftar fitur & schema per modul | ✅ Selesai |
| Responsive (mobile + desktop) | ✅ Selesai |
| CI/CD otomatis via Vercel + GitHub | ✅ Aktif |
| Database Center (schema viewer) | ✅ Selesai |
| RAG Knowledge Base (UI) | ✅ Selesai |
| Login page (/login) | ✅ Selesai |
| Supabase client (`src/lib/supabase.ts`) | ✅ Terhubung |
| Supabase CLI + `supabase/config.toml` | ✅ Init |
| Peta SVG Gorontalo interaktif (6 kab/kota) | ✅ Selesai |
| Google Maps embed per kabupaten | ✅ Selesai |
| Konstituen panel (UI) | ✅ Selesai |
| Supabase Auth (multi-tenant, session) | 🔲 Belum |
| SQL Migration schema database | 🔲 Belum |
| CRUD per modul | 🔲 Belum |
| Upload file (DPT, foto, dokumen) | 🔲 Belum |
| React Native app (relawan & saksi) | 🔲 Belum |
| WhatsApp API integration | 🔲 Belum |

---

## Struktur File Aktual

```
saas-pemilu/
├── src/
│   ├── app/
│   │   ├── globals.css               ← CSS variables, dark/light theme
│   │   ├── layout.tsx                ← Root layout + metadata
│   │   ├── page.tsx                  ← Entry point, routing state (AppView)
│   │   └── login/
│   │       └── page.tsx              ← Login page (Supabase Auth — UI ready)
│   ├── components/
│   │   ├── Sidebar.tsx               ← Navigasi 10 modul + Database/RAG
│   │   ├── Topbar.tsx                ← Breadcrumb, countdown, dark/light toggle
│   │   ├── DashboardOverview.tsx     ← Modul 00 — command center + peta mini
│   │   ├── ModulPage.tsx             ← Shell semua modul + peta Gorontalo + konstituen
│   │   ├── DatabaseCenter.tsx        ← Schema viewer, chart placeholder, field DB
│   │   └── RAGKnowledge.tsx          ← Knowledge base regulasi & strategi pemilu
│   └── lib/
│       ├── data.ts                   ← Mock data (candidate, modul, schema fields)
│       └── supabase.ts               ← Supabase client (createClient)
├── supabase/
│   └── config.toml                   ← Supabase CLI config (linked ke project)
├── .env.local                        ← SUPABASE_URL + ANON_KEY (tidak di-commit)
├── .env.local.example                ← Template env
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 10 Modul Produk

| No | Modul | Deskripsi | Status |
|----|-------|-----------|--------|
| 00 | Dashboard Master | Command center semua modul, countdown H-Day, peta mini | 🟡 Shell |
| 09 | Profil Calon | Profil, visi misi, program kerja, jadwal kampanye, rekam jejak | 🟡 Shell |
| 01 | Relawan & Posko | Database relawan, hierarki tim, absensi QR, tugas, WA blast | 🟡 Shell |
| 02 | Pemetaan Pemilih | Peta TPS Gorontalo interaktif, DPT, segmentasi, canvassing | 🟡 Shell |
| 03 | Kampanye Digital | Kalender konten, sosmed monitoring, iklan, AI generator | 🟡 Shell |
| 04 | Saksi & Quick Count | Penugasan saksi, upload C1, agregasi real-time | 🟡 Shell (aktif H-Day) |
| 05 | Survei & Elektabilitas | Builder survei, tracking elektabilitas, simulasi suara | 🟡 Shell |
| 06 | Keuangan & Budget | RAB, approval, LPPDK otomatis, cost per vote | 🟡 Shell |
| 07 | War Room | Dashboard eksekutif, laporan harian WA, crisis room | 🟡 Shell |
| 08 | Konstituen | By-name by-address, DPT, potensi pemilih, CRM pasca terpilih | 🟡 Shell |

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Backend & DB | Supabase (PostgreSQL + PostGIS + Auth + Storage + Realtime) |
| Deploy | Vercel (CI/CD otomatis dari GitHub `main`) |
| Peta | SVG interaktif (saat ini) → Leaflet.js + OpenStreetMap (planned) |
| Mobile | React Native (Expo) — relawan & saksi (planned) |
| Realtime | Supabase Realtime → Socket.io + Redis untuk quick count H-Day |
| Messaging | WhatsApp Business API via Fonnte/Wablas (planned) |
| OCR | Google Vision API — scan form C1 (planned) |
| AI | OpenAI API — generator konten kampanye (planned) |

---

## Setup Lokal

```bash
# 1. Clone repo
git clone https://github.com/gorontalounite/saas-pemilu.git
cd saas-pemilu

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.local.example .env.local
# Edit .env.local: isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Jalankan dev server
npm run dev
# Buka http://localhost:3000
```

---

## Deploy

Push ke `main` → Vercel auto-deploy dalam ~90 detik.

```bash
git add .
git commit -m "feat: deskripsi perubahan"
git push
```

**Environment variables di Vercel Dashboard:**
```
NEXT_PUBLIC_SUPABASE_URL      = https://ygaqoanykrwmzeuydexq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
```

---

## Supabase — Next Steps

```bash
# Link project (sudah dilakukan)
supabase link --project-ref ygaqoanykrwmzeuydexq

# Jalankan migration pertama (Sprint 1)
supabase db push

# Enable Realtime untuk tabel:
# c1_uploads, aktivitas, alerts

# Setup Storage bucket:
# assets, dokumen, foto_relawan, foto_c1
```

### Tabel yang akan dibuat (Sprint 1):

| Tabel | Keterangan |
|-------|------------|
| `profiles` | Data kandidat per tenant (multi-tenant) |
| `user_roles` | Role: kandidat / manajer / koordinator / relawan / saksi |
| `relawan` | Database relawan + hierarki wilayah |
| `tps` | Data TPS Gorontalo + koordinat GPS |
| `pemilih` | DPT + segmentasi per TPS |
| `konten` | Jadwal & aset kampanye digital |
| `transaksi` | Keuangan & RAB kampanye |
| `survei` + `respons_survei` | Builder survei & elektabilitas |
| `c1_uploads` | Quick count hari-H (realtime) |
| `konstituen` | CRM pasca terpilih |
| `audit_log` | Semua aksi user (immutable) |

---

## Roadmap Sprint

### ✅ Sprint 0 — Shell & Foundation
- [x] Layout, sidebar, topbar, routing
- [x] Dark/light mode
- [x] 10 modul placeholder + schema fields
- [x] Database Center + RAG Knowledge Base
- [x] Peta SVG Gorontalo interaktif + Google Maps embed
- [x] Login page UI
- [x] Supabase client setup
- [x] Supabase CLI init + link project
- [x] CI/CD Vercel aktif

### 🔄 Sprint 1 — Supabase Auth & Multi-Tenant (Aktif)
- [ ] SQL migration: schema lengkap semua tabel
- [ ] Auth: signup/login/logout via Supabase
- [ ] Session management + middleware proteksi route
- [ ] Role-based access control (RBAC)
- [ ] Kandidat onboarding flow (isi profil pertama kali)

### Sprint 2 — Modul 09: Profil Calon
- [ ] Form input profil lengkap kandidat
- [ ] Visi, misi, program kerja (CRUD)
- [ ] Jadwal kampanye
- [ ] Upload dokumen legal (KPU, LHKPN, ijazah)

### Sprint 3 — Modul 01: Relawan & Posko
- [ ] CRUD database relawan + import Excel
- [ ] Hierarki tim (Korkot → Korcam → Korkel → Relawan)
- [ ] Absensi QR code
- [ ] Broadcast WA via WhatsApp API

### Sprint 4 — Modul 02: Pemetaan Pemilih
- [ ] Import DPT format KPU (XLS/CSV)
- [ ] Leaflet.js — peta TPS interaktif
- [ ] Segmentasi & heatmap dukungan per wilayah

### Sprint 5 — Modul 06: Keuangan & Budget
- [ ] Master budget + RAB per kegiatan
- [ ] Approval flow bertingkat
- [ ] Generate LPPDK format KPU

### Sprint 6 — Modul 04: Saksi & Quick Count (H-Day)
- [ ] Aplikasi mobile saksi (React Native Expo)
- [ ] Upload foto C1 + OCR (Google Vision)
- [ ] Dashboard agregasi real-time (Supabase Realtime)

---

## Konteks Bisnis

Filosofi: **One Source of Truth** — semua data kampanye mengalir dari satu platform, satu komando dari kandidat, satu instruksi ke seluruh tim. Tidak ada data berceceran di WhatsApp grup atau Excel yang berbeda.

Target pengguna per level:

| Role | Akses |
|------|-------|
| Kandidat | Penuh — dashboard eksekutif 60 detik |
| Tim Sukses Inti | Semua modul kecuali master budget |
| Bendahara | Modul keuangan & LPPDK |
| Koordinator Wilayah | Data wilayahnya saja (kecamatan/kelurahan) |
| Relawan Lapangan | Tugas harian & absensi |
| Saksi TPS | Upload C1 hari-H |

---

## Lisensi

Proprietary — hak cipta milik tim pengembang. Tidak untuk didistribusikan tanpa izin.

---

*KampanyeOS · Gorontalo Unite · 2026–2029*