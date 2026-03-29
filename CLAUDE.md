# CLAUDE.md — Development Context Guide for KampanyeOS

This file is comprehensive documentation for developers and AI assistants working on the KampanyeOS project. Load this before starting any development session.

---

## Project Identity

**Name:** KampanyeOS  
**Tagline:** One Source of Truth — satu platform, satu komando, satu instruksi  
**Purpose:** SaaS platform for legislative campaign management for 2029 Indonesian Elections  
**Target:** Candidates for DPR RI / DPRD and their campaign teams in Gorontalo Province  
**Live URL:** https://saas-pemilu.vercel.app  
**Repository:** https://github.com/gorontalounite/saas-pemilu  
**Supabase Project ID:** `ygaqoanykrwmzeuydexq` (region: ap-southeast-1)  
**Local Folder:** `/Users/stevenpolapa/Downloads/Files v2/saas-pemilu` (developer's machine)

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14.2.5 (App Router, TypeScript) |
| Styling | Tailwind CSS 3.4.1 + CSS Variables (dark/light theme) |
| Database | Supabase (PostgreSQL + Auth + RLS + Realtime) |
| Hosting | Vercel (auto-deploy from GitHub main branch) |
| AI Integration | Anthropic Claude API (for Module 11 — ARIA Chatbot) |
| Icons | Lucide React 0.383.0 |
| State Management | React hooks + custom TenantContext (multi-tenant) |
| Package Manager | npm |

---

## Project Structure

```
saas-pemilu/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout + TenantProvider
│   │   ├── page.tsx                      ← Main dashboard & routing logic
│   │   ├── globals.css                   ← CSS variables & animations
│   │   ├── landing/page.tsx              ← Public landing page
│   │   ├── login/page.tsx                ← Login page (light mode default)
│   │   ├── register/page.tsx             ← Register 4-step onboarding
│   │   └── auth/callback/page.tsx        ← Supabase auth callback
│   ├── components/
│   │   ├── Sidebar.tsx                   ← Navigation (13 modules + links)
│   │   ├── Topbar.tsx                    ← Breadcrumb, countdown, theme toggle
│   │   ├── DashboardOverview.tsx         ← Module 00 — command center
│   │   ├── ModulPage.tsx                 ← Shell for modules 01-09
│   │   ├── DatabaseCenter.tsx            ← CRUD interface for all tables
│   │   ├── RAGKnowledge.tsx              ← Knowledge base UI
│   │   ├── PetaSuara.tsx                 ← Module 10 — live vote mapping
│   │   ├── ModulAria.tsx                 ← Module 11 — AI chatbot (live)
│   │   └── ModulMediaMonitoring.tsx      ← Module 12 — media monitoring (live)
│   ├── lib/
│   │   ├── supabase.ts                   ← Browser-side Supabase client
│   │   ├── supabase-server.ts            ← Server-side Supabase client (SSR)
│   │   └── data.ts                       ← Static data: modulData, kabGorontalo
│   ├── contexts/
│   │   └── TenantContext.tsx             ← Multi-tenant state (useTenant hook)
│   └── middleware.ts                     ← Route protection & auth redirects
├── supabase/
│   ├── config.toml                       ← Supabase CLI config
│   └── migrations/                       ← SQL migration files (11 total)
├── .env.local.example                    ← Environment template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                           ← Vercel deployment config
├── package.json
└── README.md                             ← User-facing documentation
```

---

## Key Conventions

### 1. CSS & Styling

**All colors MUST use CSS variables** — never hardcode hex colors:

```css
/* In src/app/globals.css */
:root {
  --bg-base:       #0d1117;      /* Main background */
  --bg-card:       #161c26;      /* Card/panel background */
  --bg-hover:      #1c2434;      /* Hover state background */
  --border:        #232d3f;      /* Default border */
  --border-lit:    #2e3b52;      /* Active/highlight border */
  --text-primary:  #e8edf5;      /* Main text */
  --text-secondary:#7a8aa0;      /* Secondary text */
  --text-muted:    #3d4f6b;      /* Muted/label text */
}

.light {
  --bg-base:       #f1f5fb;
  --bg-card:       #ffffff;
  /* ... etc */
}
```

**Font sizes:** Use `text-xs` (12px) for body, `text-[11px]` or `text-[10px]` for small labels.

**Animations:** Add `className="... animate-slide-up"` for entrance animations.

### 2. Supabase Client Usage

```typescript
// In browser components ('use client')
import { createClient } from '@/lib/supabase'
const supabase = createClient()

// In server components (only for SSR)
import { createServerSupabaseClient } from '@/lib/supabase-server'
const supabase = await createServerSupabaseClient()
```

**Key:** `auth.uid() === kandidat.id === users.id` (one-to-one mapping)

### 3. Component Patterns

**All client components must start with:**
```typescript
'use client'
```

**Props interface always explicit:**
```typescript
interface Props {
  onNavigate: (id: string) => void
  isDark: boolean
  onToggleTheme: () => void
}
```

**Loading state pattern:**
```typescript
import { Loader2 } from 'lucide-react'

<button disabled={loading}>
  {loading && <Loader2 size={13} className="animate-spin" />}
  {loading ? 'Processing...' : 'Submit'}
</button>
```

**Toast notifications:**
```typescript
const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

function showToast(type: 'ok' | 'err', msg: string) {
  setToast({ type, msg })
  setTimeout(() => setToast(null), 4000)
}
```

### 4. Data Fetching Pattern

```typescript
useEffect(() => {
  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data } = await supabase
      .from('table_name')
      .select('col1,col2')
      .eq('kandidat_id', user.id)
    
    // Process data
  }
  
  load()
}, [])
```

---

## Database Schema Overview

### Critical Tables

#### Auth & Multi-Tenant
- `auth.users` — Supabase built-in auth table
- `profiles` — Synced with auth.users
- `users` — Extended user profile (kandidat_id, role, etc.)
- `kandidat` — Candidate data (id = auth.uid())
- `tenants` — Campaign organizations (kandidat_id FK)
- `tenant_members` — User roles per tenant

#### Reference Data (Read-Only)
- `ref_kabkota` — 6 districts of Gorontalo
- `ref_partai` — 18 political parties
- `ref_dapil` — Electoral districts (DPR RI, DPRD, etc.)
- `ref_anggota_dprd` — Elected DPRD members 2024
- `histori_pemilu` — 2019 election results by district

#### Operational Tables (48 total)
`relawan`, `tps`, `posko`, `pemilih`, `absensi`, `tugas`, `jadwal_kampanye`, `program_kerja`, `kompetitor`, `dokumen_legal`, `rekam_jejak`, `tracker_janji`, `konten`, `monitoring_sosmed`, `media_feed`, `rab`, `transaksi`, `penyumbang`, `vendor`, `lppdk`, `survei`, `respons_survei`, `tracking_elektabilitas`, `simulasi_suara`, `crisis_room`, `laporan_harian`, `konstituen`, `aspirasi`, `chat_riwayat`, `penugasan_saksi`, `c1_uploads`, and more...

### Important Enums

```sql
-- kontestasi_type
'dpr_ri' | 'dpd_ri' | 'dprd_provinsi' | 'dprd_kabkota'

-- level_relawan
'korkot' | 'korcam' | 'korkel' | 'relawan'

-- status_dukungan (voters)
'pendukung' | 'netral' | 'lawan' | 'belum_didata'

-- status_isu (crisis/aspirations)
'open' | 'on_progress' | 'resolved'

-- format_konten (content)
'foto' | 'video' | 'carousel' | 'reel' | 'story' | 'infografis'
```

---

## 13 Modules Overview

| # | ID | Module Name | Purpose | Status |
|---|----|----|---------|--------|
| 0 | m0 | Dashboard Master | Central command center | Shell |
| 1 | m1 | Relawan & Posko | Volunteer database & management | Shell |
| 2 | m2 | Pemetaan Pemilih | Voter mapping & canvassing | Shell |
| 3 | m3 | Kampanye Digital | Content calendar & social monitoring | Shell |
| 4 | m4 | Saksi & Quick Count | Poll monitoring & real-time counting | Shell (H-Day) |
| 5 | m5 | Survei & Elektabilitas | Survey builder & electability tracking | Shell |
| 6 | m6 | Keuangan & Budget | Budget & financial tracking (LPPDK) | Shell |
| 7 | m7 | War Room | Executive dashboard & crisis management | Shell |
| 8 | m8 | Konstituen | Constituent management & CRM | Shell |
| 9 | m9 | Profil Calon | Candidate profile & programs | Shell |
| 10 | m10 | Peta Suara & Referensi | Election results & reference data | **LIVE** |
| 11 | m11 | Chatbot ARIA | AI-powered campaign assistant | **LIVE** |
| 12 | m12 | Media Monitoring | News & social media monitoring | **LIVE** |

---

## Routing & Page Flow

### Public Pages (No Auth Required)
- `/landing` — Landing page with Sign In / Sign Up buttons
- `/login` — Login form (light mode default)
- `/register` — 4-step registration (light mode default)
- `/auth/callback` — Supabase OAuth callback

### Protected Pages (Auth Required)
- `/` — Main dashboard (auto-redirects to `/landing` if not logged in)
- `/modul/:id` — Module pages

### Middleware Logic
```typescript
// src/middleware.ts
const PUBLIC_PATHS = ['/', '/landing', '/login', '/register', '/auth/callback']

if (!user && !isPublic) {
  // Redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}

if (user && (path === '/login' || path === '/register')) {
  // Redirect to dashboard
  return NextResponse.redirect(new URL('/', request.url))
}

if (!user && path === '/') {
  // Redirect from dashboard to landing
  return NextResponse.redirect(new URL('/landing', request.url))
}
```

---

## Gorontalo Province Data

```
Provinsi Gorontalo
├── Kabupaten Gorontalo    (19 kec, 1.205 TPS, 300.250 DPT)
├── Kota Gorontalo         (9 kec,    550 TPS, 146.061 DPT)
├── Boalemo                (7 kec,    424 TPS, 108.392 DPT)
├── Bone Bolango           (18 kec,   509 TPS, 122.773 DPT)
├── Pohuwato               (13 kec,   439 TPS, 111.466 DPT)
└── Gorontalo Utara        (11 kec,   412 TPS,  92.264 DPT)

TOTAL: 77 kecamatan · 729 desa · 3.539 TPS · 881.206 DPT
DPR RI Seats Available: 3
Election Date: 14 Februari 2029
```

---

## Known Issues & Bugs (Sprint Backlog)

### 🔴 Critical

**1. Register Error: "Database error saving new user"**
- **Location:** `src/app/register/page.tsx`
- **Issue:** After `signUp()` succeeds, Supabase trigger `on_auth_user_created` fails to auto-create user profile
- **Impact:** User gets created in auth but no `users`/`kandidat`/`tenants` records
- **Workaround:** Manual SQL insert or fix trigger in Supabase
- **Solution Path:** Verify trigger in Supabase SQL Editor, check RLS policies, add frontend error handling

**2. Dark/Light Mode on Login & Register**
- **Location:** `src/app/login/page.tsx` and `src/app/register/page.tsx`
- **Issue:** Pages render in dark mode despite `useState(false)` and `useEffect` to remove `.dark` class
- **Cause:** Global CSS or parent component override
- **Solution:** Force light mode with `document.documentElement.classList.add('light')`

---

## Development Workflow

### 1. Setup Local Environment

```bash
git clone https://github.com/gorontalounite/saas-pemilu.git
cd saas-pemilu
npm install
cp .env.local.example .env.local
# Edit .env.local with Supabase credentials
npm run dev
```

### 2. Create Feature Branch

```bash
git checkout -b feature/nama-fitur
```

### 3. Make Changes

- Follow conventions above
- Test locally
- Update relevant docs

### 4. Commit & Push

```bash
git add .
git commit -m "feat: deskripsi perubahan"
git push origin feature/nama-fitur
```

### 5. Deploy

Vercel auto-deploys when pushed to `main` branch (~90 seconds).

```bash
git push origin main
```

---

## Supabase CLI Commands

```bash
# Link project (already done)
supabase link --project-ref ygaqoanykrwmzeuydexq

# Create new migration
supabase migration new <migration_name>

# Apply migrations locally
supabase db push

# Push to production
supabase db push --linked

# View migrations
supabase migration list

# SQL Editor (local)
supabase sql
```

---

## Debugging Tips

### Check Auth State
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

### View RLS Policies
Supabase Dashboard → SQL Editor:
```sql
SELECT * FROM pg_policies WHERE tablename = 'table_name';
```

### Test Trigger
```sql
-- Manually invoke trigger (if testing)
SELECT auth.uid() -- Should return user UUID if logged in
```

### View Server Logs
```bash
# Vercel logs
vercel logs [--prod]

# Supabase logs
Supabase Dashboard → Logs → API or Database
```

---

## File Naming & Organization

- **Components:** PascalCase (e.g., `DashboardOverview.tsx`)
- **Functions/hooks:** camelCase (e.g., `useTenant.ts`)
- **Styles:** Use CSS variables, no separate CSS files
- **Types/interfaces:** In same file or `types.ts` if reused
- **Migrations:** Auto-generated by Supabase CLI

---

## Commit Message Format

Follow conventional commits:

```
feat: add new feature
fix: resolve bug
refactor: restructure code
docs: update documentation
chore: maintenance tasks
```

Example:
```
feat: register error handling & light mode default for login page
```

---

## Performance Optimization

- Use `next/Image` for images
- Lazy-load components with `dynamic()`
- Optimize DB queries (select only needed columns)
- Use Supabase realtime only when necessary
- Cache static data (modulData, kabGorontalo)

---

## Security Notes

- Never commit `.env.local`
- Supabase keys are public (ANON_KEY) by design
- All data access controlled by RLS policies
- User ID = candidate ID for data isolation
- Always verify `auth.uid()` server-side

---

## Quick Reference: CSS Variables

```css
/* Background */
var(--bg-base)      /* Page background */
var(--bg-card)      /* Card/panel */
var(--bg-hover)     /* Hover state */

/* Borders */
var(--border)       /* Default */
var(--border-lit)   /* Highlighted */

/* Text */
var(--text-primary)   /* Main text */
var(--text-secondary) /* Secondary */
var(--text-muted)     /* Muted/disabled */
```

---

## Support & Resources

- **GitHub:** https://github.com/gorontalounite/saas-pemilu
- **Live Demo:** https://saas-pemilu.vercel.app
- **Supabase:** https://app.supabase.com (project: ygaqoanykrwmzeuydexq)
- **Vercel:** https://vercel.com/dashboard
- **API Docs:** https://docs.supabase.com

---

*KampanyeOS · CLAUDE.md · Last updated: March 2026*
