# MaxTools — Free Deployment Guide

## Services Used (All Free Tier)

| Service | Purpose | Free Limit |
|---|---|---|
| [Vercel](https://vercel.com) | Host Next.js app | Unlimited hobby projects |
| [Neon](https://neon.tech) | PostgreSQL database | 0.5 GB |
| [Upstash](https://upstash.com) | Redis (BullMQ) | 10,000 cmds/day |
| [Cloudflare R2](https://cloudflare.com) | File storage | 10 GB / 10M requests |
| [Clerk](https://clerk.com) | Auth | 10,000 MAU |
| [Railway](https://railway.app) | BullMQ worker process | $5 free credit/month |

> ⚠️ Only **OpenAI** has no free tier — AI tools won't work without a paid API key.

---

## Step 1 — Neon (PostgreSQL)

1. Go to [neon.tech](https://neon.tech) → Sign up → **Create Project**
2. Name it `maxtools`
3. Copy the **Connection string** — looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Save it as `DATABASE_URL`

---

## Step 2 — Upstash (Redis)

1. Go to [upstash.com](https://upstash.com) → Sign up → **Create Database**
2. Name it `maxtools`, pick a region, select **Free**
3. Go to **Details** tab and copy:
   - `Endpoint` → `REDIS_HOST`
   - `Port` → `REDIS_PORT`
   - `Password` → `REDIS_PASSWORD`

---

## Step 3 — Cloudflare R2 (File Storage)

1. Go to [cloudflare.com](https://cloudflare.com) → Sign up (free)
2. Sidebar → **R2 Object Storage** → **Create bucket** → name it `maxtools`
3. Go to **R2 → Manage R2 API tokens** → **Create API Token**
   - Permissions: `Object Read & Write`
   - Copy `Access Key ID` → `R2_ACCESS_KEY_ID`
   - Copy `Secret Access Key` → `R2_SECRET_ACCESS_KEY`
4. Back on bucket page, copy the **S3 API endpoint** → `R2_ENDPOINT`
   - Format: `https://<account-id>.r2.cloudflarestorage.com`
5. Optional — Enable **Public Access** on the bucket → copy the public URL → `R2_PUBLIC_URL`

---

## Step 4 — Clerk (Auth)

Your Clerk keys are already in `.env.local`. For production:

1. Go to [clerk.com](https://clerk.com) → your app → **API Keys**
2. Make sure you use the **production** keys (not test keys) for your deployed app
3. In Clerk dashboard → **Domains** → add your Vercel domain (e.g. `maxtools.vercel.app`)
4. In Clerk dashboard → **Webhooks** → Add endpoint:
   - URL: `https://your-vercel-domain.vercel.app/api/auth/webhook`
   - Events: `user.created`, `user.updated`, `user.deleted`

---

## Step 5 — Deploy to Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo

3. In **Environment Variables**, add all of these:

```env
DATABASE_URL=<from Neon>

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your clerk publishable key>
CLERK_SECRET_KEY=<your clerk secret key>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

REDIS_HOST=<from Upstash>
REDIS_PORT=<from Upstash>
REDIS_PASSWORD=<from Upstash>

R2_ENDPOINT=<from Cloudflare>
R2_BUCKET_NAME=maxtools
R2_ACCESS_KEY_ID=<from Cloudflare>
R2_SECRET_ACCESS_KEY=<from Cloudflare>
R2_PUBLIC_URL=<from Cloudflare, optional>

OPENAI_API_KEY=<your openai key, optional>

NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_APP_NAME=MaxTools
```

4. Click **Deploy** ✅

---

## Step 6 — Run Database Migrations

After first deploy, run Prisma migrations against your Neon DB:

```bash
# In your local terminal with DATABASE_URL set to Neon
npx prisma db push
```

Or in Vercel dashboard → **Settings → Functions** → use the Vercel CLI:
```bash
npx vercel env pull .env.production.local
npx prisma db push
```

---

## Step 7 — Deploy Worker to Railway

The BullMQ worker needs an always-running process — Vercel can't do this.

1. Go to [railway.app](https://railway.app) → Sign up → **New Project**
2. **Deploy from GitHub repo** → select your repo
3. Railway will detect the Dockerfile — change it to use `Dockerfile.worker`:
   - Go to service **Settings** → **Build** → set **Dockerfile Path** to `Dockerfile.worker`
4. Add the same environment variables as Vercel (especially `DATABASE_URL`, `REDIS_*`)
5. Deploy ✅

Railway gives **$5 free credit/month** — the worker process uses very little RAM so it should stay within free limits.

---

## Final Checklist

- [ ] Neon DB created + `DATABASE_URL` set
- [ ] `npx prisma db push` run against Neon
- [ ] Upstash Redis created + `REDIS_*` vars set
- [ ] Cloudflare R2 bucket created + `R2_*` vars set
- [ ] Clerk production keys set + domain added + webhook configured
- [ ] Vercel project deployed with all env vars
- [ ] Railway worker deployed with `Dockerfile.worker`
- [ ] Visit `https://your-domain.vercel.app` and test sign up ✅

---

## Cost Summary

Everything above runs **free** within the stated limits.  
The only thing that costs money is **OpenAI API** — without it, AI tools (`/ai/`) will return a graceful error message but everything else works fine.
