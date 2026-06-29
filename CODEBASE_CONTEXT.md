# MaxTools — Codebase Context

## What It Is
MaxTools is a **Next.js 16 SaaS web app** — an online PDF & file processing toolkit. Users upload files, run tools (PDF, conversion, image, AI, print, workflow), and download results. It has a marketing site, authenticated dashboard, and admin panel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Auth | Clerk (`@clerk/nextjs`) — all routes protected via middleware |
| Database | PostgreSQL via Prisma ORM |
| Queue / Workers | BullMQ + Redis (separate worker process) |
| File Storage | Cloudflare R2 (falls back to `public/uploads/` locally) |
| AI | OpenAI API (`gpt-4o-mini` default) |
| PDF Processing | `pdf-lib` (manipulation), `pdfjs-dist` (rendering) |
| UI | Radix UI primitives + Tailwind CSS v4 + shadcn-style components |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Deployment | Docker / Docker Compose, Coolify, Railway, Vercel configs present |

---

## Project Structure

```
src/
  app/
    (dashboard)/       # Authenticated app — layout wraps DashboardLayout
      ai/              # AI tools UI
      batch/           # Batch processing UI
      convert/         # Conversion tools UI
      cut-and-stack/   # Print imposition UI
      dashboard/       # Main dashboard page
      image/           # Image tools UI
      pdf/             # PDF tools UI
      print/           # Print production UI
      workflow/        # Workflow builder UI
    (marketing)/       # Public marketing site — layout wraps MarketingLayout
      blog/
      contact/
      pricing/
    admin/             # Admin panel (analytics, files, jobs, logs, users)
    api/               # All API routes (see below)
    sign-in/           # Clerk sign-in
    sign-up/           # Clerk sign-up
    layout.tsx         # Root layout — ClerkProvider + fonts
  components/
    ai/
    layout/            # DashboardLayout, MarketingLayout, Header, Footer
    print/             # CutAndStack component
    tools/             # Tool-specific components
    ui/                # Shared UI primitives (button, card, dialog, etc.)
    workflow/          # WorkflowBuilder component
  lib/
    ai/index.ts        # OpenAI helpers (summarize, MCQs, flashcards, chat, key points, notes)
    cloudflare/r2.ts   # R2 upload/delete/getSignedUrl (local fallback)
    pdf/
      engine.ts        # pdf-lib operations (merge, split, compress, rotate, etc.)
      conversion.ts    # Image↔PDF conversion helpers
      index.ts
    print/
      cut-and-stack.ts # Cut-and-stack imposition algorithm
    workflow/
      engine.ts        # Workflow execution engine (chains tool steps via /api/process)
    api-helpers.ts     # successResponse / errorResponse / unauthorizedResponse
    constants.ts       # App constants, tool lists, file size limits, plan limits
    db.ts              # Prisma client singleton
    queue.ts           # BullMQ queue instances (pdf, conversion, print, ai)
    utils.ts
  providers/
    providers.tsx      # App-level providers wrapper
    theme-provider.tsx # next-themes
  types/index.ts       # All shared TypeScript types
  workers/
    pdf-worker.ts      # BullMQ worker for PDF jobs
    print-worker.ts    # BullMQ worker for print jobs
    index.ts           # Worker entry point
  middleware.ts        # Clerk middleware — protects all routes
prisma/
  schema.prisma        # Database schema
```

---

## Database Models (Prisma / PostgreSQL)

- **User** — linked to Clerk via `clerkId`; has `plan` (FREE/PRO/BUSINESS/ENTERPRISE), `storageUsed`, `storageLimit`
- **File** — uploaded files; `storedName` is the R2/local key; soft-deleted via `deletedAt`
- **PDFPage** — page metadata (dimensions, rotation) per File
- **Tool** — registered tools with `slug`, `category`, `isActive`
- **Job** — processing job with `status` (PENDING/PROCESSING/COMPLETED/FAILED/CANCELLED), `config` JSON, `result` JSON, progress %
- **Workflow** — user-defined multi-step workflows; `steps` stored as JSON (`WorkflowStep[]`)
- **WorkflowExecution** — execution run of a Workflow
- **Subscription** — Stripe subscription per user
- **Payment** — Stripe payment record
- **ActivityLog** — audit log per user action
- **Notification** — in-app notifications

---

## API Routes (`src/app/api/`)

| Route | Method | Purpose |
|---|---|---|
| `/api/upload` | POST | Upload file (multipart/form-data); stores to R2 or local; creates File record |
| `/api/process` | POST | Create a Job for a tool+file+config; returns job+file |
| `/api/files` | GET | List user's files (paginated, filterable by mimeType) |
| `/api/files/[id]` | GET/DELETE | Single file operations |
| `/api/jobs` | GET/POST | List/create jobs |
| `/api/jobs/[id]` | GET/PATCH | Single job status/update |
| `/api/tools` | GET | List active tools |
| `/api/tools/[slug]` | GET | Tool details by slug |
| `/api/workflows` | GET/POST | List/create workflows |
| `/api/workflows/[id]` | GET/PUT/DELETE | Manage workflow |
| `/api/workflows/[id]/execute` | POST | Execute a workflow |
| `/api/dashboard/stats` | GET | Dashboard statistics |
| `/api/auth/webhook` | POST | Clerk webhook (user sync) |

All routes use `getAuth(request)` from Clerk — return 401 if unauthenticated.

---

## Tool Categories & Slugs

### PDF (`/pdf/`)
merge-pdf, split-pdf, compress-pdf, rotate-pdf, reorder-pages, delete-pages, extract-pages, watermark-pdf, protect-pdf, unlock-pdf, sign-pdf, flatten-pdf, compare-pdfs, repair-pdf

### Conversion (`/convert/`)
pdf-to-word, word-to-pdf, pdf-to-jpg, jpg-to-pdf, pdf-to-png, png-to-pdf, excel-to-pdf, pdf-to-excel, ppt-to-pdf, pdf-to-ppt, html-to-pdf, pdf-to-html

### Image (`/image/`)
resize-image, compress-image, crop-image, convert-image, watermark-image, remove-background, image-upscaler

### AI (`/ai/`)
ocr-pdf, ai-summary, chat-with-pdf, generate-notes, generate-mcqs, generate-flashcards, extract-key-points, study-material

### Print (`/print/`)
n-up, booklet, cut-and-stack, signature, saddle-stitch, perfect-binding, crop-marks, registration-marks, batch-print

### Workflow (`/workflow/`)
User-defined multi-step pipelines combining any of the above tools.

---

## Key Lib Modules

### `lib/pdf/engine.ts`
Exports: `mergePDFs`, `splitPDF`, `compressPDF`, `rotatePDFPages`, `reorderPages`, `deletePages`, `extractPages`, `protectPDF`, `unlockPDF`, `addWatermark`, `getPDFInfo`, `flattenPDF`, `signPDF`
All accept `Buffer`, return `Buffer` or `Buffer[]`. Uses `pdf-lib`.

### `lib/ai/index.ts`
Exports: `summarizeText`, `generateMCQs`, `generateFlashcards`, `extractKeyPoints`, `generateNotes`, `chatWithDocument`
All call OpenAI (`OPENAI_API_KEY`). Text is capped at 50,000 chars.

### `lib/cloudflare/r2.ts`
Exports: `uploadFile(buffer, key, contentType) → url`, `getSignedUrl(key)`, `deleteFile(key)`
Falls back to `public/uploads/` when R2 env vars are missing.

### `lib/print/cut-and-stack.ts`
Exports: `calculateCutAndStack(config, totalPages) → CutAndStackResult`
Pure algorithm — no I/O. Computes sheet layout for duplex cut-and-stack imposition.

### `lib/workflow/engine.ts`
Exports: `executeWorkflow(steps, inputFileIds) → { fileIds, results }`
Chains steps sequentially, calling `/api/process` for each tool.

### `lib/queue.ts`
Exports: `pdfQueue`, `conversionQueue`, `printQueue`, `aiQueue` (BullMQ queues), `addJob(queue, name, data, opts)`

---

## Workers (`src/workers/`)
Run as a **separate process** (Dockerfile.worker). Connect to the same Redis and PostgreSQL.

- **pdf-worker**: handles `merge`, `split`, `compress`, `rotate`, `reorder`, `delete-pages`, `extract-pages` on `pdf-processing` queue. Concurrency: 3.
- **print-worker**: handles `cut-and-stack`, `booklet`, `n-up` on `print-production` queue. Concurrency: 2.

Workers: update Job status to PROCESSING → run processor → update to COMPLETED/FAILED.

---

## Authentication & Middleware
- `middleware.ts` applies `clerkMiddleware()` to all routes (including API and `/__clerk/`).
- Root layout wraps everything in `<ClerkProvider>`.
- API routes call `getAuth(request)` and check `userId`.

---

## Subscription Plans

| Plan | Storage |
|---|---|
| FREE | 100 MB |
| PRO | 1 GB |
| BUSINESS | 10 GB |
| ENTERPRISE | 100 GB |

File retention: 7 days (FREE), 30 days (PRO+). Max file size: 100 MB (10 MB for free tier).

---

## Environment Variables Required

```
# Database
DATABASE_URL=

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Redis
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

# Cloudflare R2 (optional — falls back to local)
R2_ENDPOINT=
R2_BUCKET_NAME=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=

# AI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Deployment

- `docker-compose.yml` — spins up `postgres`, `redis`, `app` (Next.js), `worker` (BullMQ workers)
- `Dockerfile` — builds Next.js app
- `Dockerfile.worker` — builds worker process
- `coolify.json` / `railway.json` / `vercel.json` — platform-specific configs

---

## Important Types (`src/types/index.ts`)

- `ToolCategory` — `'PDF' | 'CONVERSION' | 'IMAGE' | 'AI' | 'PRINT' | 'WORKFLOW'`
- `JobStatus` — `'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'`
- `SubscriptionPlan` — `'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'`
- `WorkflowStep` — `{ id, tool, config, position }`
- `CutAndStackConfig` — full config for imposition (rows, cols, duplex, stackDirection, marks, etc.)
- `CutAndStackResult` — computed sheet layout with stacks and per-sheet page assignments
- `FileInfo`, `PDFPageInfo`, `JobConfig`, `JobResult`, `WorkflowDefinition`, `BatchJob`, `AIModelConfig`, `AppStatistics`
