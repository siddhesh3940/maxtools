# MaxTools

**The Ultimate PDF & File Toolkit** — Convert, edit, merge, split, compress, and process your documents online. Built with Next.js 16, Clerk auth, PostgreSQL, and pdf-lib.

🔗 **GitHub:** https://github.com/siddhesh3940/maxtools

---

## Features

- **PDF Tools** — Merge, split, compress, rotate, watermark, sign, flatten, unlock, delete/extract pages
- **Conversion** — PDF ↔ Word, Excel, PPT, JPG, PNG, HTML *(backends in progress)*
- **Image Tools** — Resize, compress, crop, convert, remove background *(backends in progress)*
- **AI Tools** — Summarize, extract key points, generate MCQs, flashcards, study notes, chat with PDF *(requires OpenAI key)*
- **Print Production** — Cut & stack imposition, N-up, booklet maker
- **Workflow Builder** — Chain multiple tools into automated pipelines
- **Batch Processing** — Process multiple files at once

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Auth | Clerk |
| Database | PostgreSQL + Prisma |
| Queue | BullMQ + Redis |
| Storage | Cloudflare R2 (local fallback) |
| AI | OpenAI API |
| PDF | pdf-lib |
| UI | Radix UI + Tailwind CSS v4 |

---

## Getting Started (Local)

### Prerequisites
- Node.js v20+
- Docker Desktop

### Setup

```bash
# 1. Clone
git clone https://github.com/siddhesh3940/maxtools.git
cd maxtools

# 2. Install dependencies
npm install

# 3. Start Postgres + Redis
docker-compose up postgres redis -d

# 4. Push database schema
npx prisma db push

# 5. Start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Start Workers (optional — needed for background job processing)

```bash
npx tsx src/workers/index.ts
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/maxtools?schema=public

# Clerk Auth — get from clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Cloudflare R2 (optional — falls back to public/uploads/ locally)
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

Also create a `.env` file (used by Prisma CLI):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/maxtools?schema=public
```

---

## Deployment (Free Stack)

| Service | Purpose | Free Tier |
|---|---|---|
| [Vercel](https://vercel.com) | Host Next.js app | Unlimited hobby |
| [Neon](https://neon.tech) | PostgreSQL | 0.5 GB |
| [Upstash](https://upstash.com) | Redis | 10K cmds/day |
| [Cloudflare R2](https://cloudflare.com) | File storage | 10 GB |
| [Clerk](https://clerk.com) | Auth | 10K MAU |
| [Railway](https://railway.app) | BullMQ worker | $5/month credit |

### Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in the Vercel dashboard
4. Vercel uses `vercel.json` build command: `npx prisma generate && next build`
5. Run `npx prisma db push` against your Neon DB

### Deploy Worker to Railway

1. New project → Deploy from GitHub repo
2. Set **Dockerfile Path** to `Dockerfile.worker` in service settings
3. Add same environment variables as Vercel

---

## Project Structure

```
src/
  app/
    (dashboard)/     # Authenticated routes — PDF, AI, print, workflow tools
    (marketing)/     # Public routes — pricing, blog, contact
    admin/           # Admin panel
    api/             # API routes
  components/
    layout/          # Dashboard + marketing layouts, header, footer
    ui/              # Shared UI primitives (shadcn-style)
  lib/
    pdf/             # pdf-lib operations
    ai/              # OpenAI helpers
    cloudflare/      # R2 storage
    print/           # Cut-and-stack algorithm
    workflow/        # Workflow execution engine
  providers/         # Theme + Toaster providers
  workers/           # BullMQ workers (pdf, print)
  types/             # Shared TypeScript types
prisma/
  schema.prisma      # Full database schema
```

---

## How PDF Processing Works

1. User selects file(s) and configures options on the tool page
2. Client sends `multipart/form-data` to `POST /api/process` with `tool` slug + files + config
3. Server runs the appropriate `pdf-lib` operation
4. Returns a binary PDF response (`application/pdf`) for single results
5. Returns base64 JSON for multiple results (e.g. split)
6. Browser triggers file download automatically

**Supported PDF operations:** merge, split, compress, rotate, watermark, unlock, flatten, sign, delete pages, extract pages

---

## Subscription Plans

| Plan | Storage | File Retention |
|---|---|---|
| Free | 100 MB | 7 days |
| Pro | 1 GB | 30 days |
| Business | 10 GB | 30 days |
| Enterprise | 100 GB | 30 days |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT
