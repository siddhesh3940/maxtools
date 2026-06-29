# MaxTools — Complete Project Context

> Hand this file to any AI agent for full codebase context.
> Reflects the exact current state of the project.

---

## What It Is

MaxTools is a **Next.js 16 SaaS web app** — an online PDF & file processing toolkit.
Users upload files, run tools (PDF, conversion, image, AI, print, workflow), and download results.
It has a public marketing/tool site and an authenticated dashboard.

**GitHub:** https://github.com/siddhesh3940/maxtools
**Live:** https://maxtools-three.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Auth | Clerk (`@clerk/nextjs` v6) |
| Database | PostgreSQL via Prisma ORM v6 (Neon in production) |
| Queue / Workers | BullMQ + Redis (Upstash in production) |
| File Storage | Cloudflare R2 (falls back to `public/uploads/` locally) |
| AI | OpenAI API (`gpt-4o-mini`) |
| PDF Processing | `pdf-lib` (manipulation), `pdfjs-dist` (rendering) |
| UI | Radix UI + Tailwind CSS v4 + shadcn-style components |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Fonts | Geist Sans + Geist Mono |
| Theme | `next-themes` (wrapped in custom `ThemeProvider` + `useTheme`) |
| Deployment | Vercel (app) + Railway (worker) |

---

## Route Structure

```
/                    → Marketing homepage — tool grid + hero (server component)
/tools               → All tools listing page
/pricing             → Pricing page
/blog                → Blog
/contact             → Contact (email: sidvaishnav1234@gmail.com, +91 7774842406, Vasai India)
/sign-in             → Clerk sign-in
/sign-up             → Clerk sign-up
/pdf/[slug]          → PDF tool page (real processing)
/convert/[slug]      → Conversion tool page
/print/[slug]        → Print tool page
/dashboard           → Authenticated dashboard home
/workflow            → Workflow builder
/batch               → Batch processing
/admin/*             → Admin panel
```

After sign-in/sign-up → redirects to `/` (homepage).

---

## Project File Structure

```
src/
  app/
    (dashboard)/           # "use client" route group → DashboardLayout
      layout.tsx           # "use client" — renders DashboardLayout directly
      dashboard/page.tsx   # Dashboard home (/dashboard)
      batch/page.tsx
      workflow/page.tsx    # Workflow builder with Workflow icon in header

    (marketing)/           # Route group — layout is passthrough (<>{children}</>)
      layout.tsx           # No extra wrapping — root layout handles Providers
      blog/page.tsx
      contact/page.tsx     # sidvaishnav1234@gmail.com, +91 7774842406, Vasai India
      pricing/page.tsx

    (tools)/               # Public tool pages — Header + Footer layout
      layout.tsx           # Header + main + Footer
      pdf/[slug]/page.tsx  # Real PDF tool — upload → /api/process → download
      convert/[slug]/page.tsx
      print/[slug]/page.tsx

    admin/
      layout.tsx, page.tsx
      analytics/, files/, jobs/, logs/, users/

    api/
      auth/webhook/route.ts          # Clerk webhook
      ai/route.ts                    # AI processing endpoint
      convert/route.ts               # Conversion endpoint
      dashboard/stats/route.ts       # Stats
      files/route.ts                 # GET list files
      files/[id]/route.ts            # GET / DELETE file
      image/route.ts                 # Image processing
      jobs/route.ts                  # GET / POST jobs
      jobs/[id]/route.ts             # GET / PATCH job
      print/route.ts                 # Print processing
      process/route.ts               # POST — real PDF ops, binary response
      tools/route.ts                 # GET tools list
      tools/[slug]/route.ts          # GET tool by slug
      upload/route.ts                # POST file upload
      workflows/route.ts             # GET / POST workflows
      workflows/[id]/route.ts        # GET / PUT / DELETE workflow
      workflows/[id]/execute/route.ts

    sign-in/[[...sign-in]]/page.tsx
    sign-up/[[...sign-up]]/page.tsx
    tools/page.tsx                   # /tools — all tools listing
    layout.tsx                       # Root: ClerkProvider + Providers + Geist fonts
    page.tsx                         # Homepage (server component, tool grid)
    globals.css
    favicon.ico

  components/
    layout/
      dashboard-layout.tsx  # Sidebar (collapsible, auto-expands active) + topbar
                            # Uses useTheme from @/providers/theme-provider
                            # Sidebar categories from PDF_TOOLS/CONVERSION_TOOLS constants
      marketing-layout.tsx  # Header + Footer (used by (tools) layout)
      header.tsx            # Sticky header; SignedOut: SignIn/SignUp modal buttons
                            # SignedIn: UserButton only (no Dashboard button)
      footer.tsx            # Links + © MaxTools + "by Siddhesh Vaishnav"
    tools/                  # Tool UI components
    ui/                     # shadcn-style: avatar, badge, button, card, checkbox,
                            # dialog, dropdown-menu, file-upload, input, label,
                            # progress, scroll-area, select, separator, skeleton,
                            # slider, switch, table, tabs, textarea, toast, tooltip
    workflow/
      workflow-builder.tsx
    ai/                     # AI components

  lib/
    ai/index.ts             # OpenAI helpers
    cloudflare/r2.ts        # R2 storage + local fallback
    pdf/
      engine.ts             # pdf-lib operations
      conversion.ts         # Image↔PDF
      index.ts
    print/
      booklet-optimizer.ts  # Print optimization algorithm
    workflow/
      engine.ts             # Workflow execution engine
    api-helpers.ts
    constants.ts            # PDF_TOOLS (with category), CONVERSION_TOOLS, POWER_TOOLS,
                            # PRINT_TOOLS, TOOL_CATEGORIES, limits, plan configs
    db.ts                   # Prisma singleton
    queue.ts                # BullMQ queues
    utils.ts                # cn()

  providers/
    providers.tsx           # ThemeProvider (next-themes) + Toaster
    theme-provider.tsx      # Wraps next-themes; exports ThemeProvider + useTheme()

  types/index.ts
  middleware.ts             # clerkMiddleware() on all routes

  workers/
    index.ts                # startWorkers() / stopWorkers()
    pdf-worker.ts           # pdf-processing queue, concurrency 3

prisma/schema.prisma
docker-compose.yml
Dockerfile / Dockerfile.worker (npx tsx src/workers/index.ts)
next.config.ts              # output: standalone, serverExternalPackages: [pdf-lib]
vercel.json                 # buildCommand: npx prisma generate && next build
.env                        # DATABASE_URL (Prisma CLI)
.env.local                  # All secrets (gitignored)
```

---

## Layout Hierarchy

```
app/layout.tsx  (server)
  ClerkProvider
    Providers (ThemeProvider via next-themes + Toaster)
      (marketing)/layout.tsx  → passthrough
      (tools)/layout.tsx      → Header + Footer
      (dashboard)/layout.tsx  → "use client" → DashboardLayout
      admin/layout.tsx
      sign-in, sign-up pages
      app/page.tsx (homepage — server component)
```

---

## Theme System

`src/providers/theme-provider.tsx` wraps `next-themes`:
- `ThemeProvider` — `NextThemesProvider` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`
- `useTheme()` — wraps `useNextTheme()`, returns typed `{ theme, setTheme, resolvedTheme }` with safe defaults
- Used in: `DashboardLayout` (toggle button), `Header` (toggle button)
- `suppressHydrationWarning` on `<html>` tag prevents hydration mismatch

---

## Tool Categories & Slugs (from `constants.ts`)

### PDF_TOOLS (with category field)
| Slug | Category |
|---|---|
| `compress-pdf` | COMPRESS |
| `merge-pdf`, `split-pdf` | MERGE_SPLIT |
| `sign-pdf`, `watermark-pdf` | EDIT_SIGN |
| `unlock-pdf`, `protect-pdf` | SECURITY |
| `organize-pdf`, `rotate-pdf`, `repair-pdf` | ORGANIZE |

### CONVERSION_TOOLS
`images-to-pdf`

### POWER_TOOLS
`booklet-optimizer`, `workflow-builder`, `batch-processing`, `smart-print`

### PRINT_TOOLS
`booklet-optimizer`, `smart-print`

---

## `/api/process` — Real PDF Processing

**Request:** `multipart/form-data`
- `tool` — slug string
- `file` — one or more File blobs
- Config fields per tool:

| Tool | Config |
|---|---|
| `merge-pdf` | multiple `file` entries |
| `split-pdf` | `range` e.g. `"1-5,7"` |
| `compress-pdf` | `quality` 10-100 |
| `rotate-pdf` | `degrees` 90/180/270 |
| `delete-pages` | `pages` comma-separated |
| `extract-pages` | `pages` comma-separated |
| `watermark-pdf` | `watermarkText`, `opacity` |
| `unlock-pdf` | `password` |
| `flatten-pdf` | none |
| `sign-pdf` | `signatureText` |

**Response:**
- Single → `application/pdf` binary with `Content-Disposition: attachment`
- Multiple (split) → `{ success: true, files: [{ name, data: base64 }] }`

---

## PDF Tool Page (`/pdf/[slug]`)

1. Drop/select file via `FileUpload`
2. Fill config fields
3. Click "Process File" → `FormData` → `POST /api/process`
4. Result stored as `Blob`
5. Download via `URL.createObjectURL` + `<a>` click
6. Split → one download button per file
7. Errors shown inline

---

## Database Models

```
User            clerkId, email, name, plan, storageUsed, storageLimit
                → files, jobs, workflows, subscriptions, payments, activityLogs, notifications
File            userId, originalName, storedName, mimeType, size, path, url, toolType, deletedAt
PDFPage         fileId, pageNum, width, height, rotation
Tool            name, slug, description, category, icon, isActive, order
Job             userId, toolId?, fileId?, type, status, progress, config(JSON), result(JSON), error
Workflow        userId, name, steps(JSON), isTemplate, isScheduled, schedule
WorkflowExecution  workflowId, jobId?, status, result, error
Subscription    userId, plan, stripeId, currentPeriodStart/End, status
Payment         userId, stripeId, amount, currency, status
ActivityLog     userId, action, details(JSON)
Notification    userId, title, message, type, isRead
```

---

## Environment Variables

```env
# Database (Neon)
DATABASE_URL=postgresql://...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/

# Redis (Upstash)
REDIS_HOST=noble-falcon-95643.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=...
REDIS_URL=rediss://...

# Cloudflare R2
R2_ENDPOINT=https://7fdec2250bc71500bea67654bfcdfb7a.r2.cloudflarestorage.com
R2_BUCKET_NAME=maxtools
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_PUBLIC_URL=https://pub-6a1e180967f9460d8f87015a29a344f4.r2.dev

# OpenAI (optional)
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://maxtools-three.vercel.app
NEXT_PUBLIC_APP_NAME=MaxTools
```

---

## Local Development

```bash
# Node.js v20+, Docker Desktop required
docker-compose up postgres redis -d
npm install
npx prisma db push

# Terminal 1
npm run dev

# Terminal 2
npx tsx src/workers/index.ts
```

---

## Production Deployment

| Service | URL |
|---|---|
| App | https://maxtools-three.vercel.app |
| Database | Neon PostgreSQL |
| Redis | Upstash |
| Storage | Cloudflare R2 |
| Auth | Clerk |
| Worker | Railway (Dockerfile.worker) |

---

## All Bugs Fixed

| Bug | Fix |
|---|---|
| Route conflict — two pages at `/` | Deleted `(marketing)/page.tsx`, homepage at `app/page.tsx` |
| Clerk modal error when signed in | `<SignedOut>` wraps buttons |
| Deprecated Clerk env vars | Using `FORCE_REDIRECT_URL` |
| Prisma `DATABASE_URL` not found | Created `.env` |
| Missing `payments` relation on `User` | Added to schema |
| `Dockerfile.worker` used `node` on `.ts` | Fixed to `npx tsx` |
| Theme flash on navigation | Switched to `next-themes` |
| `useTheme` throws on SSR | Wraps `next-themes` with safe defaults |
| `(dashboard)/layout.tsx` not client boundary | Added `"use client"` |
| Manual `<script>` tag React 19 warning | Removed, `next-themes` handles it |
| PDF tool page was fake | Rewrote to real upload → process → download |
| Node.js v18 too low | Upgraded to v20 |
| After sign-in went to old UI | Redirect changed to `/` |

---

## Known Gaps

- Conversion tool backends — UI exists, no processor
- Image tool backends — UI exists, no processor
- `protect-pdf` — pdf-lib doesn't support encryption
- `pdfToImages()` — needs canvas renderer
- `reorder-pages`, `compare-pdfs`, `repair-pdf` not in `/api/process`
- Stripe payment webhook — schema exists, no handler
- Subscription plan enforcement — no tool-level gating
- Admin panel — UI only, no real data fetching
- `components/tools/`, `components/ai/`, `src/hooks/` — mostly empty
