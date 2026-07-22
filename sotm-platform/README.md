# SOTM Platform

One repo, three deployable apps, merged from `sotm-main`, `glt-sermon-lib` and `aso-media`.

```
sotm-platform/
├── website/   Main ministry site (Vite + React) — deploy to Vercel
├── api/       Sermon library API (NestJS + MongoDB) — deployed on AWS App Runner
└── admin/     Admin panel (Next.js) — deploy separately, e.g. admin.segunobadje.org
```

## What changed in the merge

**website/** now pulls the message library live from the API instead of the hardcoded samples in `data.ts`:

- `/messages` — full library with search, year / minister / category filters, pagination and a direct Download button on every card
- `/messages/:id` — message detail page with download, share buttons and related messages
- Homepage — new photo-led hero (no video), impact stats strip, and a live "Latest messages" section fed by the API (featured messages first, newest uploads as fallback)
- New files: `src/lib/api.ts` (API client + download-link handling), `src/components/MessageCard.tsx`
- `vercel.json` CSP updated — the old policy (`connect-src 'self'`) would have blocked every API call, Cloudinary thumbnail and OneDrive download
- API base URL is configurable via `VITE_API_URL` (see `.env.example`); defaults to the deployed App Runner instance

**api/** received targeted fixes:

- `GET /messages/:id`, `GET /speakers`, `GET /series`, `GET /special-meetings` are now public reads (they were behind JWT, which broke the public site — a visitor could never open a message deep link or load the minister filter)
- Removed the startup `console.log` that printed the Cloudinary API key into logs
- CORS is now driven by an `ALLOWED_ORIGINS` env var (comma-separated); falls back to allow-all until you set it. Set it in production.

**Redeploy the API for the message detail deep links and minister filter to work.** Until then the website degrades gracefully: detail pages open from the library via navigation state, and the minister filter falls back to a curated list.

**admin/** bug fixes:

- All sixteen hardcoded API URLs (mix of the App Runner URL and `localhost:3001`) replaced with a single `API_URL` from `lib/api.ts`, configurable via `NEXT_PUBLIC_API_URL`
- `hooks/use-auth.ts` actually validates now — it previously called a hardcoded localhost URL, never sent the token, and ignored the response entirely
- Year filter no longer stops at 2025; it runs through the current year automatically
- Downloads now handle OneDrive links, not just Cloudinary

## Hosting messages on OneDrive

Upload the audio file to OneDrive, copy the share link (set to "Anyone with the link"), and paste it as the message's `downloadUrl` in the admin panel. The site converts share links to direct downloads automatically:

- `https://1drv.ms/...` short links → Microsoft's shares API (streams the file directly)
- `https://onedrive.live.com/...` → `download=1`
- `https://*.sharepoint.com/...` (OneDrive for Business) → `download=1`
- Legacy Cloudinary URLs still work (`fl_attachment`)

No re-uploading of the existing library is needed — old and new links coexist.

## Running locally

```bash
# API
cd api && cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, Cloudinary
npm install && npm run start:dev # http://localhost:3001

# Website
cd website && cp .env.example .env  # point VITE_API_URL at your API
npm install && npm run dev          # http://localhost:5173

# Admin
cd admin && cp .env.example .env.local
npm install && npm run dev          # http://localhost:3000
```

## Deploying everything on Vercel

Three Vercel projects from this one repo. Create each with "Add New →
Project", import the same GitHub repo, and set the Root Directory.

**1. API** (deploy this first)
- Root Directory: `api` (or `sotm-platform/api` if the repo has the wrapper folder)
- Framework preset: Other
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ALLOWED_ORIGINS`
- The included `api/vercel.json` handles the build and routes every request
  into the NestJS serverless function. Visit `<api-url>/messages` after
  deploying to confirm it returns JSON.

**2. Website**
- Root Directory: `website` — Framework preset: Vite
- Environment variable: `VITE_API_URL` = the API project URL from step 1

**3. Admin**
- Root Directory: `admin` — Framework preset: Next.js
- Environment variable: `NEXT_PUBLIC_API_URL` = the API project URL

### Security follow-ups (do these the same day)

1. **Rotate the MongoDB password.** The old connection string (user and
   password) was hardcoded in `app.module.ts` and lives in git history.
   In MongoDB Atlas: Database Access → edit the user → reset password.
   Use the new string only in Vercel env vars.
2. Generate a fresh `JWT_SECRET` with `node api/generate-secret.js`.
3. Set `ALLOWED_ORIGINS` on the API project to your website and admin URLs.

### First admin on a fresh database

If you are starting a new database (or lost the old admin credentials):

```bash
cd api
MONGODB_URI="..." ADMIN_EMAIL="you@example.org" ADMIN_PASSWORD="..." \
  node scripts/seed-admin.js
```

### Notes on the serverless API

- The Nest app and its Mongo connection are cached per lambda instance, so
  warm requests are fast; the first request after idling takes a few seconds.
- Vercel limits request bodies to ~4.5 MB — message artwork images must stay
  under that. Audio files are unaffected (they go to OneDrive, not the API).
