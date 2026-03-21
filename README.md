# KampanyeOS — Platform Kampanye Digital

> One Source of Truth. Satu platform, satu komando, satu instruksi.

SaaS platform manajemen kampanye Pilkada & Pemilu — 10 modul terintegrasi dari manajemen relawan hingga quick count real-time.

---

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend / DB**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Deploy**: Vercel (CI/CD otomatis dari GitHub)
- **Mobile**: React Native (Expo) — *coming soon*

## Modul

| No | Nama | Status |
|----|------|--------|
| 00 | Dashboard Master | ✅ Selesai |
| 09 | Profil Calon | 🔨 Development |
| 01 | Relawan & Posko | 🔨 Development |
| 02 | Pemetaan Pemilih | 🔨 Development |
| 03 | Kampanye Digital | 🔨 Development |
| 04 | Saksi & Quick Count | 📋 Planned |
| 05 | Survei & Elektabilitas | 🔨 Development |
| 06 | Keuangan & Budget | 🔨 Development |
| 07 | War Room | 🔨 Development |
| 08 | Konstituen (Pasca Pemilu) | 🔒 Locked |

---

## Setup Lokal

```bash
# 1. Clone atau download project
cd saas-pemilu

# 2. Install dependencies
npm install

# 3. Copy env template
cp .env.local.example .env.local

# 4. Isi SUPABASE_URL dan SUPABASE_ANON_KEY di .env.local

# 5. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Deploy ke Vercel

```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "init: KampanyeOS dashboard"
git remote add origin https://github.com/USERNAME/saas-pemilu.git
git push -u origin main

# 2. Import di vercel.com → pilih repo → set env variables:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Deploy otomatis setiap push ke main
```

---

## Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Copy URL dan anon key ke `.env.local`
3. Jalankan migration SQL di `/supabase/migrations/` *(coming soon)*
4. Enable Realtime untuk tabel `c1_uploads`, `aktivitas`, `alerts`

---

## Struktur Project

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── DashboardOverview.tsx
│   └── ModulPage.tsx
└── lib/
    └── data.ts          ← mock data, akan diganti Supabase
```

---

## Roadmap

- [ ] Supabase auth (login per kandidat / multi-tenant)
- [ ] Modul 09: Profil Calon — form input & tampilan
- [ ] Modul 01: Relawan — CRUD + import Excel
- [ ] Modul 06: Keuangan — RAB & approval flow
- [ ] Modul 02: Peta TPS — integrasi Leaflet + data KPU
- [ ] React Native app untuk relawan & saksi
- [ ] Modul 04: Quick count real-time (Socket.io + Redis)

---

*Dibuat dengan ❤️ untuk digitalisasi kampanye Indonesia*
