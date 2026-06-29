# MaxTools — Complete Project Context

> Hand this file to any AI agent for full codebase context.
> Last updated: reflects all fixes and changes made during development session.

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
| Theme | next-themes (dark/light/system) |
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
/pdf/[slug]                → PDF tool pages
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
    (dashboard)/           # Route group — wraps with DashboardLayout + Providers
      page.tsx             # Redirects / → /dashboard
      layout.tsx           # Wraps children in Providers + DashboardLayout
      dashboard/
        page.tsx           # Main dashboard UI (/dashboard)
      ai/[slug]/page.tsx   # AI tool page
      batch/page.tsx       # Batch processing page
      convert/[slug]/page.tsx
      cut-and-stack/page.tsx
      image/[slug]/page.tsx
      pdf/[slug]/page.tsx
      print/[slug]/page.tsx
      workflow/page.tsx

    (marketing)/           # Route group — wraps with MarketingLayout + Providers
      layout.tsx           # Wraps children in Providers + MarketingLayout
      blog/page.tsx
      contact/page.tsx
      pricing/page.tsx
      # NOTE: NO page.tsx here — homepage is app/page.tsx directly

    admin/
      layout.tsx
      page.tsx
      analytics/page.tsx
      files/page.tsx
      jobs/page.tsx
      logs/page.tsx
      users/page.tsx

    api/
      auth/webhook/route.ts         # Clerk webhook (user sync)
      dashboard/stats/route.ts      # Dashboard statistics
      files/route.ts                # GET list files
      files/[id]/route.ts           # GET/DELETE single file
      jobs/route.ts                 # GET list / POST create job
      jobs/[id]/route.ts            # GET/PATCH single job
      process/route.ts              # POST create processing job
      tools/route.ts                # GET list tools
      tools/[slug]/route.ts         # GET tool by slug
      upload/route.ts               # POST upload file
      workflows/route.ts            # GET list / POST create workflow
      workflows/[id]/route.ts       # GET/PUT/DELETE workflow
      workflows/[id]/execute/route.ts  # POST execute workflow

    sign-in/[[...sign-in]]/page.tsx   # Clerk SignIn component
    sign-up/[[...sign-up]]/page.tsx   # Clerk SignUp component
    layout.tsx                        # Root layout — ClerkProvider + fonts
    page.tsx                          # Marketing homepage (full content here)
    globals.css
    favicon.ico

  components/
    layout/
      dashboard-layout.tsx   # Sidebar + topbar for authenticated pages
      marketing-layout.tsx   # Header + Footer wrapper
      header.tsx             # Marketing header with nav, tools dropdown, Clerk buttons
      footer.tsx
    print/
      cut-and-stack.tsx      # Cut & stack UI component
    tools/                   # Tool-specific UI components
    ui/                      # Shared primitives (all shadcn-style)
      avatar, badge, button, card, checkbox, dialog, dropdown-menu,
      file-upload, input, label, progress, scroll-area, select,
      separator, skeleton, slider, switch, table, tabs, textarea,
      toast, tooltip
    workflow/
      workflow-builder.tsx   # Drag-and-drop workflow UI
    ai/                      # AI tool components

  lib/
    ai/index.ts              # OpenAI helpers
    cloudflare/r2.ts         # R2 file storage
    pdf/
      engine.ts              # pdf-lib operations
      conversion.ts          # Image↔PDF helpers
      index.ts
    print/
      cut-and-stack.ts       # Cut-and-stack algorithm (pure, no I/O)
    workflow/
      engine.ts              # Workflow execution engine
    api-helpers.ts           # Response helpers
    constants.ts             # All tool lists, limits, plan configs
    db.ts                    # Prisma singleton
    queue.ts                 # BullMQ queue instances
    utils.ts                 # cn() and general utils

  providers/
    providers.tsx            # ThemeProvider + Toaster wrapper
    theme-provider.tsx       # next-themes wrapper

  types/index.ts             # All shared TypeScript types
  middleware.ts              # Clerk middleware (protects all routes)

  workers/
    index.ts                 # startWorkers() / stopWorkers()
    pdf-worker.ts            # BullMQ worker for pdf-processing queue
    print-worker.ts          # BullMQ worker for print-production queue

prisma/
  schema.prisma              # Full DB schema

docker-compose.yml           # postgres + redis + app + worker
Dockerfile                   # Next.js app container
Dockerfile.worker            # Worker process container (uses npx tsx)
vercel.json                  # Vercel build config (prisma generate + next build)
railway.json                 # Railway config
coolify.json                 # Coolify config
.env                         # DATABASE_URL only (for Prisma CLI)
.env.local                   # All env vars (gitignored)
```

---

## Key Architectural Decisions & Fixes Made

1. **Route conflict fix** — `(marketing)/page.tsx` was deleted. Marketing homepage lives directly in `app/page.tsx`. `(dashboard)/page.tsx` redirects to `/dashboard`. Dashboard content is at `(dashboard)/dashboard/page.tsx`.

2. **Clerk auth buttons** — Marketing homepage uses `<SignedOut><SignUpButton mode="modal">` and `<SignedIn>` redirects to `/dashboard`. This prevents the "cannot render modal when signed in" error.

3. **Clerk env vars** — Updated to use non-deprecated vars:
   - `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard`

4. **Prisma env** — `.env` file created with just `DATABASE_URL` since Prisma CLI doesn't read `.env.local`.

5. **Dockerfile.worker fix** — Was using `node` to run a `.ts` file. Fixed to use `npx tsx src/workers/index.ts`.

6. **next-themes React 19 warning** — Added `scriptProps={{ "data-cfasync": "false" }}` to ThemeProvider in `providers.tsx`.

7. **Prisma schema fix** — Added missing `payments Payment[]` relation to the `User` model.

8. **Node.js version** — Project requires Node.js v20+. Uses `nvm use 20`.

---

## Database Models (Prisma / PostgreSQL)

```prisma
User          # clerkId, email, name, plan, storageUsed, storageLimit
File          # userId, originalName, storedName, mimeType, size, path, url, toolType
PDFPage       # fileId, pageNum, width, height, rotation
Tool          # name, slug, description, category, icon, isActive, order
Job           # userId, toolId, fileId, type, status, progress, config, result, error
Workflow      # userId, name, description, steps(JSON), isTemplate, isScheduled
WorkflowExecution  # workflowId, jobId, status, result, error
Subscription  # userId, plan, stripeId, currentPeriodStart/End, status
Payment       # userId, stripeId, amount, currency, status
ActivityLog   # userId, action, details
Notification  # userId, title, message, type, isRead
```

**Enums:** `ToolCategory` (PDF/CONVERSION/IMAGE/AI/PRINT/WORKFLOW), `JobStatus` (PENDING/PROCESSING/COMPLETED/FAILED/CANCELLED), `SubscriptionPlan` (FREE/PRO/BUSINESS/ENTERPRISE)

---

## API Routes

All routes use `getAuth(request)` from Clerk — return 401 if unauthenticated.
Response format: `{ success: true, data: ... }` or `{ success: false, error: "..." }`

| Route | Methods | Description |
|---|---|---|
| `/api/upload` | POST | Multipart file upload → R2/local + DB record |
| `/api/process` | POST | Create job for tool+file+config |
| `/api/files` | GET | List user files (paginated, ?mimeType filter) |
| `/api/files/[id]` | GET, DELETE | Single file |
| `/api/jobs` | GET, POST | List/create jobs (?status filter) |
| `/api/jobs/[id]` | GET, PATCH | Single job |
| `/api/tools` | GET | List active tools |
| `/api/tools/[slug]` | GET | Tool by slug |
| `/api/workflows` | GET, POST | List/create workflows |
| `/api/workflows/[id]` | GET, PUT, DELETE | Manage workflow |
| `/api/workflows/[id]/execute` | POST | Execute workflow |
| `/api/dashboard/stats` | GET | Dashboard stats |
| `/api/auth/webhook` | POST | Clerk webhook |

---

## Tool Categories & Slugs

### PDF
`merge-pdf`, `split-pdf`, `compress-pdf`, `rotate-pdf`, `reorder-pages`, `delete-pages`, `extract-pages`, `watermark-pdf`, `protect-pdf`, `unlock-pdf`, `sign-pdf`, `flatten-pdf`, `compare-pdfs`, `repair-pdf`

### Conversion
`pdf-to-word`, `word-to-pdf`, `pdf-to-jpg`, `jpg-to-pdf`, `pdf-to-png`, `png-to-pdf`, `excel-to-pdf`, `pdf-to-excel`, `ppt-to-pdf`, `pdf-to-ppt`, `html-to-pdf`, `pdf-to-html`

### Image
`resize-image`, `compress-image`, `crop-image`, `convert-image`, `watermark-image`, `remove-background`, `image-upscaler`

### AI
`ocr-pdf`, `ai-summary`, `chat-with-pdf`, `generate-notes`, `generate-mcqs`, `generate-flashcards`, `extract-key-points`, `study-material`

### Print
`n-up`, `booklet`, `cut-and-stack`, `signature`, `saddle-stitch`, `perfect-binding`, `crop-marks`, `registration-marks`, `batch-print`

---

## Key Lib Modules

### `lib/pdf/engine.ts`
Uses `pdf-lib`. All accept `Buffer`, return `Buffer` or `Buffer[]`.
Exports: `mergePDFs`, `splitPDF`, `compressPDF`, `rotatePDFPages`, `reorderPages`, `deletePages`, `extractPages`, `unlockPDF`, `addWatermark`, `getPDFInfo`, `flattenPDF`, `signPDF`
> Note: `protectPDF` throws — pdf-lib doesn't support encryption.

### `lib/ai/index.ts`
Uses OpenAI API directly via `fetch`. Default model: `gpt-4o-mini`. Text capped at 50,000 chars.
Exports: `summarizeText`, `generateMCQs`, `generateFlashcards`, `extractKeyPoints`, `generateNotes`, `chatWithDocument`
All gracefully return empty/fallback if `OPENAI_API_KEY` is missing.

### `lib/cloudflare/r2.ts`
Exports: `uploadFile(buffer, key, contentType) → url`, `getSignedUrl(key)`, `deleteFile(key)`
Falls back to `public/uploads/` when R2 env vars (`R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) are missing.

### `lib/print/cut-and-stack.ts`
Exports: `calculateCutAndStack(config, totalPages) → CutAndStackResult`
Pure algorithm — no I/O. Computes duplex sheet layout for cut-and-stack imposition.

### `lib/workflow/engine.ts`
Exports: `executeWorkflow(steps, inputFileIds) → { fileIds, results }`
Chains steps sequentially by calling `/api/process` for each tool.

### `lib/queue.ts`
Exports: `pdfQueue`, `conversionQueue`, `printQueue`, `aiQueue` (BullMQ Queue instances), `addJob(queue, name, data, opts?)`

### `lib/api-helpers.ts`
Exports: `successResponse`, `errorResponse`, `unauthorizedResponse`, `forbiddenResponse`, `notFoundResponse`, `rateLimitResponse`

---

## Workers

Run as a **separate process** via `Dockerfile.worker` → `npx tsx src/workers/index.ts`.
Connect to same Redis and PostgreSQL as the app.

**pdf-worker** (`pdf-processing` queue, concurrency 3):
Handles: `merge`, `split`, `compress`, `rotate`, `reorder`, `delete-pages`, `extract-pages`

**print-worker** (`print-production` queue, concurrency 2):
Handles: `cut-and-stack`, `booklet`, `n-up`

Job lifecycle: DB status → `PROCESSING` → run processor → `COMPLETED` or `FAILED`

---

## Auth & Middleware

- `src/middleware.ts` — applies `clerkMiddleware()` to all routes
- Root `app/layout.tsx` wraps everything in `<ClerkProvider>`
- API routes use `getAuth(request)` and check `userId`
- Marketing header uses `<SignedIn>`, `<SignedOut>`, `<SignInButton mode="modal">`, `<SignUpButton mode="modal">`, `<UserButton>`
- After sign-in/sign-up → force redirect to `/dashboard`

---

## Subscription Plans & Limits

| Plan | Storage | File Size Limit | File Retention |
|---|---|---|---|
| FREE | 100 MB | 10 MB | 7 days |
| PRO | 1 GB | 100 MB | 30 days |
| BUSINESS | 10 GB | 100 MB | 30 days |
| ENTERPRISE | 100 GB | 100 MB | 30 days |

Max batch size: 100 files. Max file size (hard): 100 MB.

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard

# Redis
REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=

# Cloudflare R2 (optional — falls back to local)
R2_ENDPOINT=
R2_BUCKET_NAME=maxtools
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=

# OpenAI (optional — AI tools degrade gracefully without it)
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MaxTools
```

---

## Local Development

**Requirements:** Node.js v20+, Docker Desktop

```bash
# 1. Start Postgres + Redis
docker-compose up postgres redis -d

# 2. Install dependencies
npm install

# 3. Push DB schema
npx prisma db push

# 4. Start app (Terminal 1)
npm run dev

# 5. Start workers (Terminal 2)
npx tsx src/workers/index.ts
```

App runs at http://localhost:3000. Files upload to `public/uploads/` locally.

---

## Deployment (Free Tier)

| Service | Purpose | Free Limit |
|---|---|---|
| Vercel | Next.js app | Unlimited hobby |
| Neon | PostgreSQL | 0.5 GB |
| Upstash | Redis | 10K cmds/day |
| Cloudflare R2 | File storage | 10 GB |
| Clerk | Auth | 10K MAU |
| Railway | BullMQ worker | $5/month credit |

`vercel.json` build command: `npx prisma generate && next build`

Only paid service: **OpenAI API** (AI tools work without it, just return graceful fallback).

---

## TypeScript Types (`src/types/index.ts`)

```ts
ToolCategory       = 'PDF' | 'CONVERSION' | 'IMAGE' | 'AI' | 'PRINT' | 'WORKFLOW'
JobStatus          = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
SubscriptionPlan   = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'

ToolDefinition     { id, name, slug, description, category, icon, isActive, order }
FileInfo           { id, originalName, storedName, mimeType, size, url?, pages? }
PDFPageInfo        { pageNum, width?, height?, rotation }
JobConfig          { tool, files, options }
JobResult          { files, message?, stats? }
WorkflowStep       { id, tool, config, position }
WorkflowDefinition { id, name, steps, isTemplate? }
CutAndStackConfig  { rows, columns, duplex, stackDirection, autoPadding, cutMarks,
                     cropMarks, registrationMarks, printInstructions, pageSize? }
CutAndStackResult  { frontSheets, backSheets, totalSheets, pagesPerSheet,
                     gridCapacity, totalPages, blankPagesAdded, stacks[], sheets[] }
BatchJob           { id, type, files, completed, failed, status, createdAt }
AIModelConfig      { provider: 'openai', model, temperature?, maxTokens? }
AppStatistics      { filesProcessed, activeTools, uptime, users }
```

---

## Known Gaps / Not Yet Implemented

- Tool-level access gating by subscription plan (code exists for plans but no enforcement)
- Stripe payment integration (schema exists, no webhook handler)
- Admin panel is UI-only (no real data fetching wired up)
- `components/tools/` and `components/ai/` directories exist but are mostly empty
- `src/hooks/` directory exists but is empty
- `pdfToImages()` in `lib/pdf/conversion.ts` returns a placeholder — needs canvas renderer
- `protectPDF()` throws — pdf-lib doesn't support encryption
- Conversion tools (Word/Excel/PPT ↔ PDF) are defined but backend processors not implemented
