# MaxTools

**The Ultimate PDF & File Toolkit** — Merge, split, compress, convert, watermark, sign and process your documents online. Built with Next.js 16, Clerk, PostgreSQL, and pdf-lib.

🔗 **Live:** https://maxtools-three.vercel.app
🐙 **GitHub:** https://github.com/siddhesh3940/maxtools

---

## Screenshots

![Homepage](screenshots/Screenshot%202026-06-30%20000248.png)

![Tools](screenshots/Screenshot%202026-06-30%20000256.png)

![Dashboard](screenshots/Screenshot%202026-06-30%20000310.png)

![PDF Tool](screenshots/Screenshot%202026-06-30%20000350.png)

---

## Features

- **PDF Tools** — Merge, split, compress, rotate, watermark, sign, flatten, unlock, organize pages
- **Conversion** — Images to PDF, PDF to various formats *(backends in progress)*
- **Print Production** — Booklet optimizer, smart print mode
- **AI Tools** — Summarize, extract key points, generate MCQs, flashcards, chat with PDF *(requires OpenAI key)*
- **Workflow Builder** — Chain multiple tools into automated pipelines
- **Batch Processing** — Process multiple files at once
- **Dark / Light Mode** — System-aware theme with no flash

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Auth | Clerk |
| Database | PostgreSQL + Prisma (Neon in production) |
| Queue | BullMQ + Redis (Upstash in production) |
| Storage | Cloudflare R2 (local fallback to `public/uploads/`) |
| AI | OpenAI API (`gpt-4o-mini`) |
| PDF | pdf-lib |
| UI | Radix UI + Tailwind CSS v4 |
| Theme | next-themes |
| Animations | Framer Motion |

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

### Start Workers (optional — needed for background jobs)

```bash
npx tsx src/workers/index.ts
```

---

## Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/maxtools?schema=public

# Clerk — get from clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/

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

Also create `.env` (Prisma CLI):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/maxtools?schema=public
```

---

## How PDF Processing Works

1. User selects file(s) and configures options on the tool page
2. Client sends `multipart/form-data` to `POST /api/process` with `tool` slug + files + config
3. Server runs the pdf-lib operation
4. Returns binary PDF (`application/pdf`) for single results
5. Returns base64 JSON array for multiple results (e.g. split)
6. Browser triggers file download automatically

**Supported:** merge, split, compress, rotate, watermark, unlock, flatten, sign, delete pages, extract pages

---

## Deployment (Free Stack)

| Service | Purpose | Free Tier |
|---|---|---|
| [Vercel](https://vercel.com) | Next.js app | Unlimited hobby |
| [Neon](https://neon.tech) | PostgreSQL | 0.5 GB |
| [Upstash](https://upstash.com) | Redis | 10K cmds/day |
| [Cloudflare R2](https://cloudflare.com) | File storage | 10 GB |
| [Clerk](https://clerk.com) | Auth | 10K MAU |
| [Railway](https://railway.app) | BullMQ worker | $5/month credit |

### Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all env vars in Vercel dashboard
4. `vercel.json` build command: `npx prisma generate && next build`
5. Run `npx prisma db push` against your Neon DB

### Deploy Worker to Railway

1. New project → Deploy from GitHub
2. Settings → Build → **Dockerfile Path**: `Dockerfile.worker`
3. Add same env vars as Vercel

---

## Project Structure

```
src/
  app/
    (dashboard)/     # Authenticated routes — dashboard, workflow, batch
    (marketing)/     # Public routes — pricing, blog, contact
    (tools)/         # Tool pages — pdf, convert, print
    admin/           # Admin panel
    api/             # API routes
    tools/           # /tools listing page
  components/
    layout/          # Dashboard layout, marketing header/footer
    ui/              # Shared UI primitives (shadcn-style)
    workflow/        # Workflow builder component
  lib/
    pdf/             # pdf-lib operations
    ai/              # OpenAI helpers
    cloudflare/      # R2 storage
    print/           # Booklet optimizer
    workflow/        # Workflow execution engine
  providers/         # next-themes ThemeProvider + Toaster
  workers/           # BullMQ workers
  types/             # Shared TypeScript types
prisma/
  schema.prisma
```

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
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## Contact

- **Email:** sidvaishnav1234@gmail.com
- **Phone:** +91 7774842406
- **Location:** Vasai, India

---

## License

MIT

---

<p align="center">by Siddhesh Vaishnav</p>
