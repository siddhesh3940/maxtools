# MaxTools — Complete Project Context

> Hand this file to any AI agent for full codebase context.
> Reflects the exact current state of the project.

---

## What It Is

MaxTools is a **Next.js 16 SaaS web app** — an online PDF & file processing toolkit.
Users upload files, run tools (PDF, conversion, image, AI, print, workflow), and download results.
It has a public marketing site, an authenticated dashboard, and an admin panel.

**GitHub:** https://github.com/siddhesh3940/maxtools

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Auth | Clerk (`@clerk/nextjs` v6) — middleware protects all routes |
| Database | PostgreSQL via Prisma ORM v6 |
| Queue / Workers | BullMQ + Redis (separate worker process) |
| File Storage | Cloudflare R2 (falls back to `public/uploads/` locally) |
| AI | OpenAI API (`gpt-4o-mini` default) |
| PDF Processing | `pdf-lib` (manipulation), `pdfjs-dist` (rendering) |
| UI | Radix UI primitives + Tailwind CSS v4 + shadcn-style components |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Fonts | Geist Sans + Geist Mono (next/font/google) |
| Theme | Custom ThemeProvider (localStorage + system preference, replaces next-themes) |
| Deployment | Docker / Docker Compose; configs for Vercel, Railway, Coolify |

---

## Route Structure

```
/                          → Marketing homepage (app/page.tsx)
/pricing                   → Pricing page
/blog                      → Blog
/contact                   → Contact
/sign-in                   → Clerk sign-in page
/sign-up                   → Clerk sign-up page
/dashboard                 → Authenticated dashboard home
/pdf/[slug]                → PDF tool pages (real processing)
/convert/[slug]            → Conversion tool pages
/image/[slug]              → Image tool pages
/ai/[slug]                 → AI tool pages
/print/[slug]              → Print tool pages
/cut-and-stack             → Cut & stack imposition tool
/workflow                  → Workflow builder
/batch                     → Batch processing
/admin                     → Admin panel home
/admin/analytics           → Admin analytics
/admin/files               → Admin file manager
/admin/jobs                → Admin job manager
/admin/logs                → Admin logs
/admin/users               → Admin user manager
```

---

## Project File Structure

```
src/
  app/
    (dashboard)/           # Route group — "use client" boundary
      page.tsx             # Redirects / → /dashboard
      layout.tsx           # "use client" — renders DashboardLayout directly
      dashboard/
        page.tsx           # Main dashboard UI at /dashboard
      ai/[slug]/page.tsx
      batch/page.tsx
      convert/[slug]/page.tsx
      cut-and-stack/page.tsx
      image/[slug]/page.tsx
      pdf/[slug]/page.tsx  # Real PDF tool — upload → /api/process → binary download
      print/[slug]/page.tsx
      workflow/page.tsx

    (marketing)/           # Route group — uses root Providers via app/layout.tsx
      layout.tsx           # Wraps with MarketingLayout only (Providers in root)
      blog/page.tsx
      contact/page.tsx
      pricing/page.tsx
      # NO page.tsx here — homepage lives at app/page.tsx

    admin/
      layout.tsx
      page.tsx
      analytics/page.tsx
      files/page.tsx
      jobs/page.tsx
      logs/page.tsx
      users/page.tsx

    api/
      auth/webhook/route.ts          # Clerk webhook (user sync)
      dashboard/stats/route.ts       # Dashboard statistics
      files/route.ts                 # GET list files (paginated, ?mimeType)
      files/[id]/route.ts            # GET / DELETE single file (soft delete)
      jobs/route.ts                  # GET list / POST create job
      jobs/[id]/route.ts             # GET / PATCH single job
      process/route.ts               # POST multipart — real PDF ops, returns binary PDF
      tools/route.ts                 # GET list tools
      tools/[slug]/route.ts          # GET tool by slug
      upload/route.ts                # POST multipart file upload → R2/local + DB
      workflows/route.ts             # GET list / POST create workflow
      workflows/[id]/route.ts        # GET / PUT / DELETE workflow
      workflows/[id]/execute/route.ts  # POST execute workflow

    sign-in/[[...sign-in]]/page.tsx
    sign-up/[[...sign-up]]/page.tsx
    layout.tsx             # Root — ClerkProvider + Providers + Geist fonts + theme inline script
    page.tsx               # Full marketing homepage (SignedIn/SignedOut Clerk buttons)
    globals.css
    favicon.ico

  components/
    layout/
      dashboard-layout.tsx   # Sidebar + topbar; uses useTheme from @/providers/theme-provider
      marketing-layout.tsx   # Header + Footer
      header.tsx             # Marketing header; SignInButton/SignUpButton mode="modal"
      footer.tsx
    print/
      cut-and-stack.tsx
    tools/                   # Tool UI components (mostly empty stubs)
    ui/                      # shadcn-style primitives:
                             # avatar, badge, button, card, checkbox, dialog,
                             # dropdown-menu, file-upload, input, label, progress,
                             # scroll-area, select, separator, skeleton, slider,
                             # switch, table, tabs, textarea, toast, tooltip
    workflow/
      workflow-builder.tsx
    ai/                      # AI components (mostly empty)

  lib/
    ai/index.ts              # OpenAI helpers (summarize, MCQs, flashcards, chat, etc.)
    cloudflare/r2.ts         # R2 storage (local fallback)
    pdf/
      engine.ts              # pdf-lib operations
      conversion.ts          # Image↔PDF helpers
      index.ts
    print/
      cut-and-stack.ts       # Pure imposition algorithm
    workflow/
      engine.ts              # Workflow execution engine
    api-helpers.ts           # Response helpers
    constants.ts             # Tool lists, limits, plan configs
    db.ts                    # Prisma singleton
    queue.ts                 # BullMQ queue instances
    utils.ts                 # cn() utility

  providers/
    providers.tsx            # ThemeProvider + Toaster wrapper
    theme-provider.tsx       # Custom theme (ThemeProvider + useTheme hook)

  types/index.ts             # All shared TypeScript types
  middleware.ts              # clerkMiddleware() on all routes

  workers/
    index.ts                 # startWorkers() / stopWorkers()
    pdf-worker.ts            # BullMQ pdf-processing queue worker
    print-worker.ts          # BullMQ print-production queue worker

prisma/schema.prisma
docker-compose.yml
Dockerfile                   # Next.js standalone app
Dockerfile.worker            # Worker: npx tsx src/workers/index.ts
next.config.ts               # output: standalone, serverExternalPackages: [pdf-lib]
vercel.json                  # buildCommand: npx prisma generate && next build
.env                         # DATABASE_URL only (Prisma CLI)
.env.local                   # All secrets (gitignored)
```

---

## Layout Hierarchy (Important)

```
app/layout.tsx  (server component)
  └─ ClerkProvider
      └─ Providers (ThemeProvider + Toaster)   ← wraps EVERYTHING
          └─ (marketing)/layout.tsx → MarketingLayout
          └─ (dashboard)/layout.tsx ("use client") → DashboardLayout
          └─ admin/layout.tsx
          └─ sign-in, sign-up pages
```

`app/layout.tsx` includes a minimal inline `<script>` in `<head>` that reads `localStorage` and applies the `dark` class before hydration to prevent flash. This is intentional — it's a one-liner, not `next-themes`.

---

## Theme System

Custom implementation in `src/providers/theme-provider.tsx` (replaces `next-themes`):
- `ThemeProvider` — reads `localStorage["theme"]` on mount, applies dark/light class to `document.documentElement`, listens to system preference changes
- `useTheme()` — returns `{ theme, setTheme, resolvedTheme }`. Returns a **safe default** (no throw) when called outside provider for SSR safety
- Used in: `DashboardLayout` (theme toggle button), `Header` (marketing)

---

## `/api/process` — Real PDF Processing

**Request:** `multipart/form-data`
- `tool` — tool slug
- `file` — one or more File blobs
- Config fields per tool (see below)

**Supported tools & config:**

| Tool | Config fields |
|---|---|
| `merge-pdf` | none (multiple `file` entries) |
| `split-pdf` | `range` — e.g. `"1-5,7,9-12"` (optional, splits all if empty) |
| `compress-pdf` | `quality` — number 10-100 |
| `rotate-pdf` | `degrees` — 90, 180, 270 |
| `delete-pages` | `pages` — comma-separated e.g. `"1,3,5"` |
| `extract-pages` | `pages` — comma-separated |
| `watermark-pdf` | `watermarkText`, `opacity` — 5-100 |
| `unlock-pdf` | `password` |
| `flatten-pdf` | none |
| `sign-pdf` | `signatureText` |

**Response:**
- Single result → `application/pdf` binary with `Content-Disposition: attachment; filename="..."`
- Multiple results (split) → `{ success: true, files: [{ name, data: base64 }] }`

---

## PDF Tool Page (`/pdf/[slug]`)

Real end-to-end flow:
1. User drops/selects file(s) via `FileUpload` component
2. Fills in tool config (rotation angle, page range, watermark text, etc.)
3. Clicks "Process File" → builds `FormData` → `POST /api/process`
4. Success → result stored as `Blob` in state
5. Download triggered via `URL.createObjectURL` + programmatic `<a>` click
6. Split results → one `Download` button per output file
7. Errors shown inline with `AlertCircle`

---

## Database Models (Prisma / PostgreSQL)

```
User            clerkId(unique), email, name, plan, storageUsed, storageLimit
                → files, jobs, workflows, subscriptions, payments, activityLogs, notifications
File            userId, originalName, storedName, mimeType, size, path, url, toolType
                soft-delete via deletedAt
PDFPage         fileId, pageNum, width, height, rotation
Tool            name, slug, description, category, icon, isActive, order
Job             userId, toolId?, fileId?, type, status, progress, config(JSON), result(JSON), error
Workflow        userId, name, steps(JSON), isTemplate, isScheduled, schedule
WorkflowExecution  workflowId, jobId?, status, result, error
Subscription    userId(unique), plan, stripeId, currentPeriodStart/End, status
Payment         userId, stripeId, amount, currency, status
ActivityLog     userId, action, details(JSON)
Notification    userId, title, message, type, isRead
```

**Enums:** `ToolCategory` (PDF/CONVERSION/IMAGE/AI/PRINT/WORKFLOW), `JobStatus` (PENDING/PROCESSING/COMPLETED/FAILED/CANCELLED), `SubscriptionPlan` (FREE/PRO/BUSINESS/ENTERPRISE)

---

## Key Lib Modules

### `lib/pdf/engine.ts`
All functions: `Buffer` in, `Buffer` / `Buffer[]` out. Uses `pdf-lib`.
`mergePDFs`, `splitPDF`, `compressPDF`, `rotatePDFPages`, `reorderPages`, `deletePages`, `extractPages`, `addWatermark`, `unlockPDF`, `flattenPDF`, `signPDF`, `getPDFInfo`
> `protectPDF` throws — pdf-lib doesn't support encryption.

### `lib/ai/index.ts`
OpenAI fetch. Model: `gpt-4o-mini`. Text capped at 50k chars. All functions degrade gracefully if `OPENAI_API_KEY` missing.
`summarizeText`, `generateMCQs`, `generateFlashcards`, `extractKeyPoints`, `generateNotes`, `chatWithDocument`

### `lib/cloudflare/r2.ts`
`uploadFile(buffer, key, contentType) → url`, `getSignedUrl(key)`, `deleteFile(key)`
Falls back to `public/uploads/` when R2 env vars absent.

### `lib/workflow/engine.ts`
`executeWorkflow(steps, inputFileIds) → { fileIds, results }`
Chains steps by calling `/api/process` per tool.

### `lib/queue.ts`
`pdfQueue`, `conversionQueue`, `printQueue`, `aiQueue`, `addJob(queue, name, data, opts?)`

### `lib/api-helpers.ts`
`successResponse`, `errorResponse`, `unauthorizedResponse`, `forbiddenResponse`, `notFoundResponse`, `rateLimitResponse`

### `lib/utils.ts`
`cn(...inputs)` — clsx + tailwind-merge

---

## Workers

Separate process via `Dockerfile.worker` → `npx tsx src/workers/index.ts`

- **pdf-worker** — `pdf-processing` queue, concurrency 3
  Handles: `merge`, `split`, `compress`, `rotate`, `reorder`, `delete-pages`, `extract-pages`
- **print-worker** — `print-production` queue, concurrency 2
  Handles: `cut-and-stack`, `booklet`, `n-up`

Job lifecycle: DB status `PROCESSING` → run processor → `COMPLETED` / `FAILED`

---

## Subscription Plans & Limits

| Plan | Storage | File Retention |
|---|---|---|
| FREE | 100 MB | 7 days |
| PRO | 1 GB | 30 days |
| BUSINESS | 10 GB | 30 days |
| ENTERPRISE | 100 GB | 30 days |

Max file size: 100 MB hard limit (10 MB for free tier). Max batch: 100 files.

---

## Environment Variables (`.env.local`)

```env
DATABASE_URL=postgresql://...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard

REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=

R2_ENDPOINT=
R2_BUCKET_NAME=maxtools
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=

OPENAI_API_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MaxTools
```

`.env` (Prisma CLI only):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/maxtools?schema=public
```

---

## Local Development

```bash
# Requirements: Node.js v20+, Docker Desktop

docker-compose up postgres redis -d
npm install
npx prisma db push

# Terminal 1 — app
npm run dev

# Terminal 2 — workers
npx tsx src/workers/index.ts
```

App → http://localhost:3000. Files saved to `public/uploads/` locally.

---

## Deployment (Free Tier Stack)

| Service | Purpose | Free Limit |
|---|---|---|
| Vercel | Next.js app | Unlimited hobby |
| Neon | PostgreSQL | 0.5 GB |
| Upstash | Redis | 10K cmds/day |
| Cloudflare R2 | File storage | 10 GB |
| Clerk | Auth | 10K MAU |
| Railway | BullMQ worker | $5/month credit |

Only paid: **OpenAI API** (AI tools return graceful fallback without it).

---

## All Bugs Fixed

| Bug | Fix |
|---|---|
| Route conflict — two `page.tsx` resolving to `/` | Deleted `(marketing)/page.tsx`, moved to `app/page.tsx`, `(dashboard)/page.tsx` redirects |
| Clerk modal error when already signed in | `<SignedOut>` wraps `SignUpButton`, `<SignedIn>` shows "Go to Dashboard" |
| Deprecated Clerk env vars | Replaced `AFTER_SIGN_IN_URL` with `SIGN_IN_FORCE_REDIRECT_URL` |
| Prisma `DATABASE_URL` not found | Created `.env` file |
| Prisma schema — missing `payments` relation on `User` | Added `payments Payment[]` |
| `Dockerfile.worker` ran `.ts` with `node` | Fixed to `npx tsx` |
| `next-themes` React 19 script tag warning | Replaced with custom `ThemeProvider` |
| `useTheme` throws on SSR | Returns safe default instead of throwing |
| `(dashboard)/layout.tsx` not a client boundary | Added `"use client"` |
| PDF tool page was entirely fake (fake timer) | Rewrote to real upload → `/api/process` → binary download |
| Node.js v18 too low | Upgraded to v20 via nvm |

---

## Known Gaps / Not Yet Implemented

- Conversion tool backends (Word/Excel/PPT ↔ PDF) — UI exists, no processor
- Image tool backends — UI exists, no processor
- `protect-pdf` — pdf-lib doesn't support encryption
- `pdfToImages()` returns placeholder — needs canvas renderer
- `reorder-pages`, `compare-pdfs`, `repair-pdf` not wired in `/api/process`
- Stripe payment webhook — schema exists, no handler
- Subscription plan enforcement — no tool-level gating
- Admin panel — UI only, no real data fetching
- `components/tools/`, `components/ai/`, `src/hooks/` — mostly empty
