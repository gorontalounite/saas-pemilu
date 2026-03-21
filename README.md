# KampanyeOS

> **One Source of Truth. Satu platform, satu komando, satu instruksi.**

Platform SaaS manajemen kampanye legislatif berbasis data — dirancang untuk Calon Anggota DPR RI / DPRD dan tim suksesnya. Mencakup seluruh siklus kampanye: dari manajemen relawan, pemetaan pemilih, kampanye digital, hingga quick count hari-H dan manajemen konstituen pasca terpilih.

**Live:** [https://saas-pemilu.vercel.app](https://saas-pemilu.vercel.app)
**Repo:** [https://github.com/gorontalounite/saas-pemilu](https://github.com/gorontalounite/saas-pemilu)

---

## Kondisi Saat Ini — v0.1 (Dashboard Shell)

Versi ini adalah **dashboard shell** — struktur navigasi, layout, dan arsitektur komponen sudah berdiri. Data masih statis (mock). Integrasi database Supabase dan fitur per modul menyusul di sprint berikutnya.

| Komponen | Status |
|----------|--------|
| Routing & navigasi sidebar | ✅ Selesai |
| Dashboard Master (layout) | ✅ Selesai |
| Topbar + countdown 14 Feb 2029 | ✅ Selesai |
| Dark / Light mode toggle | ✅ Selesai |
| Placeholder semua 10 modul | ✅ Selesai |
| Daftar fitur per modul | ✅ Selesai |
| Responsive (mobile + desktop) | ✅ Selesai |
| CI/CD otomatis via Vercel + GitHub | ✅ Aktif |
| Supabase Auth (multi-tenant) | 🔲 Belum |
| Database & CRUD per modul | 🔲 Belum |
| Peta Gorontalo interaktif | 🔲 Belum |
| Upload file (DPT, foto, dokumen) | 🔲 Belum |
| React Native app (relawan & saksi) | 🔲 Belum |
| WhatsApp API integration | 🔲 Belum |

---

## 10 Modul Produk

| No | Modul | Fitur | Status |
|----|-------|-------|--------|
| 00 | Dashboard Master | Command center semua modul, countdown H-Day | 🟡 Shell |
| 09 | Profil Calon | Profil, visi misi, program kerja, jadwal kampanye, rekam jejak | 🔲 Planned |
| 01 | Relawan & Posko | Database relawan, hierarki tim, absensi QR, tugas, WA blast | 🔲 Planned |
| 02 | Pemetaan Pemilih | Peta TPS Gorontalo, DPT, segmentasi, canvassing digital | 🔲 Planned |
| 03 | Kampanye Digital | Kalender konten, sosmed monitoring, iklan, AI generator | 🔲 Planned |
| 04 | Saksi & Quick Count | Penugasan saksi, upload C1, agregasi real-time | 🔲 Planned |
| 05 | Survei & Elektabilitas | Builder survei, tracking elektabilitas, simulasi suara | 🔲 Planned |
| 06 | Keuangan & Budget | RAB, approval, LPPDK otomatis, cost per vote | 🔲 Planned |
| 07 | War Room | Dashboard eksekutif, laporan harian WA, crisis room | 🔲 Planned |
| 08 | Konstituen | By-name by-address, DPT, potensi pemilih, CRM pasca terpilih | 🔲 Planned |

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Backend & DB | Supabase (PostgreSQL + PostGIS + Auth + Storage + Realtime) |
| Deploy | Vercel (CI/CD otomatis dari GitHub `main`) |
| Peta | Leaflet.js + OpenStreetMap + data KPU |
| Mobile | React Native (Expo) — relawan & saksi |
| Realtime | Socket.io + Redis — quick count hari-H |
| Messaging | WhatsApp Business API (Fonnte/Wablas) |
| OCR | Google Vision API — scan form C1 |
| AI | OpenAI API — generator konten kampanye |

---

## Struktur Project

```
saas-pemilu/
├── src/
│   ├── app/
│   │   ├── globals.css          ← CSS variables, dark/light theme
│   │   ├── layout.tsx           ← Root layout + metadata
│   │   └── page.tsx             ← Entry point, routing state
│   ├── components/
│   │   ├── Sidebar.tsx          ← Navigasi 10 modul, candidate chip
│   │   ├── Topbar.tsx           ← Breadcrumb, countdown, alert bell
│   │   ├── DashboardOverview.tsx ← Modul 00 — command center
│   │   └── ModulPage.tsx        ← Placeholder semua modul
│   └── lib/
│       └── data.ts              ← Mock data (sementara → Supabase)
├── .env.local.example           ← Template env variables
├── vercel.json                  ← Vercel deployment config
└── README.md
```

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

**Environment variables di Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL      = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
```

---

## Setup Supabase (Next Steps)

```bash
# 1. Buat project di supabase.com
# 2. Copy URL + anon key ke .env.local
# 3. Jalankan SQL migration (coming soon di /supabase/migrations/)
# 4. Enable Realtime untuk: c1_uploads, aktivitas, alerts
# 5. Setup Storage bucket: assets, dokumen, foto_relawan, foto_c1
```

Tabel utama yang akan dibuat:
- `users` — auth multi-tenant (kandidat, tim sukses, relawan, saksi)
- `relawan` — database relawan + hierarki
- `tps` — data TPS Gorontalo + koordinat GPS
- `pemilih` — DPT + segmentasi per TPS
- `konten` — jadwal & aset kampanye digital
- `transaksi` — keuangan & RAB kampanye
- `survei` + `respons_survei` — elektabilitas
- `c1_uploads` — quick count hari-H
- `konstituen` — CRM pasca terpilih
- `audit_log` — semua aksi user (immutable)

---

## Roadmap Sprint

### Sprint 1 — Supabase Foundation (Prioritas)
- [ ] Setup Supabase project + schema database
- [ ] Implementasi Auth multi-tenant (kandidat / manajer / koordinator / relawan)
- [ ] Login page + session management
- [ ] Role-based access control (RBAC)

### Sprint 2 — Modul 09: Profil Calon
- [ ] Form input profil lengkap kandidat
- [ ] Visi, misi, program kerja (CRUD)
- [ ] Jadwal kampanye (terhubung ke Modul 03)
- [ ] Upload dokumen legal (KPU, LHKPN, ijazah)

### Sprint 3 — Modul 01: Relawan & Posko
- [ ] CRUD database relawan + import Excel
- [ ] Hierarki tim (Korkot → Korcam → Korkel → Relawan)
- [ ] Absensi QR code
- [ ] Broadcast WA via WhatsApp API

### Sprint 4 — Modul 02: Pemetaan Pemilih
- [ ] Peta TPS interaktif Provinsi Gorontalo (Leaflet)
- [ ] Import DPT format KPU (XLS/CSV)
- [ ] Segmentasi & heatmap dukungan per wilayah

### Sprint 5 — Modul 06: Keuangan & Budget
- [ ] Master budget + RAB per kegiatan
- [ ] Approval flow bertingkat
- [ ] Generate LPPDK format KPU

### Sprint 6 — Modul 04: Saksi & Quick Count (H-Day)
- [ ] Aplikasi mobile saksi (React Native)
- [ ] Upload foto C1 + OCR
- [ ] Dashboard agregasi real-time (Socket.io)

---

## Konteks Bisnis

Dibangun untuk **Andi Rahmatillah, S.E.** — Calon Anggota DPR RI Dapil Gorontalo, Pemilu 14 Februari 2029.

Filosofi: **One Source of Truth** — semua data kampanye mengalir dari satu platform, satu komando dari kandidat, satu instruksi ke seluruh tim. Tidak ada data berceceran di WhatsApp grup atau Excel yang berbeda.

Target pengguna per level:
- **Kandidat** — akses penuh, dashboard eksekutif 60 detik
- **Tim sukses inti** — akses semua modul kecuali master budget
- **Bendahara** — modul keuangan & LPPDK
- **Koordinator wilayah** — data wilayahnya saja (kecamatan/kelurahan)
- **Relawan lapangan** — tugas harian & absensi
- **Saksi TPS** — upload C1 hari-H

---

## Lisensi

Proprietary — hak cipta milik tim pengembang. Tidak untuk didistribusikan tanpa izin.

---

*KampanyeOS · Gorontalo Unite · 2025–2029*
