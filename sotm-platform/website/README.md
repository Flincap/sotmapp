# SOTM Website — Segun Obadje Teaching Ministries

React + Vite + TypeScript + Tailwind CSS. Real path routing (no hash URLs), per-page SEO, sitemap, security headers, ready for Vercel.

## Run it

```bash
npm install
npm run dev      # local development
npm run lint     # zero errors expected
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Deploy to Vercel

1. Push this folder to a Git repository and import it in Vercel (framework preset: Vite).
2. `vercel.json` already handles SPA rewrites (deep links like /messages/xyz work) and security headers.
3. Attach the real domain, then update `SITE_URL` in `src/data.ts` and the domain inside `public/sitemap.xml` and `public/robots.txt`.

## Where everything lives

All editable content is in **`src/data.ts`**. You never need to touch a component to update messages, books, events, links, socials or giving details. Search the file for `TODO`.

---

## LAUNCH CHECKLIST — every placeholder in one place

### src/data.ts
- [ ] `SITE_URL` — swap when the real domain is attached
- [ ] `CONTACT_EMAIL` — currently a guessed `info@segunobadje.org`; confirm or replace
- [ ] `PRAYER_LINE_PHONE` / `PRAYER_LINE_EMAIL` — hidden on the site until filled
- [ ] `FORM_ENDPOINT` — paste a Formspree-style endpoint to switch Contact from email buttons to a working form (nothing posts to nowhere; while empty, email buttons show instead)
- [ ] `LINKS.glt` — God's Love Tabernacle website URL (currently `#`)
- [ ] `LINKS.morningDewMixlr` / `LINKS.morningDewYouTube` — buttons appear on the Platforms page once filled
- [ ] `LINKS.onlineGiving` — Give page shows a marked note until this is filled
- [ ] `SOCIALS` — paste real URLs; icons stay hidden while empty
- [ ] `MESSAGES` — the six entries are SAMPLES; replace with real messages. Per message: `mediaUrl` (YouTube/Vimeo embed URL or audio file) and `thumbnail` (drop images in `public/images/messages/`)
- [ ] `BOOKS` — add `coverImage` per book (drop covers in `public/images/books/`); confirm blurbs; add per-book `link` if different from the bookstore
- [ ] `DOWNLOADS` — add free study-note PDFs to `public/downloads/` and list them
- [ ] `EVENTS` — replace the three placeholder cards with the real itinerary
- [ ] `PLATFORMS` — expand the two short descriptions marked TODO (BASE 314, Shout the Word Loud)
- [ ] `IMPACT` — confirm the four figures on the About page

### Media
- [ ] Hero video: add `public/images/hero.mp4` + `hero-poster.webp`, then in `src/pages/Home.tsx` replace the marked poster block with:
  ```html
  <video className="absolute inset-0 -z-10 h-full w-full object-cover" autoPlay muted loop playsInline
         poster="/images/hero-poster.webp" src="/images/hero.mp4" />
  ```
  Keep `muted` — browsers block autoplay audio, and the poster keeps first paint instant.
- [ ] Message thumbnails and book covers as above
- [ ] Favicon: currently the logo PNG; supply a square icon if preferred

### After adding video embeds
- [ ] `vercel.json` CSP already allows YouTube embeds (`frame-src`). If you host video elsewhere (e.g. Vimeo), add that domain to `frame-src`.

### public/
- [ ] `sitemap.xml` and `robots.txt` — swap the domain if it is not segunobadje.org

---

## Decisions made for you (override freely)

- **Palette**: near-black ink `#171226` base, warm gold `#C99938/#E4B14A` accent, parchment `#F7F4EE` background, with the logo's plum `#7B3A6E` as a secondary. No green anywhere (reserved for the GLT brand). All tokens live in `tailwind.config.js`.
- **Type**: Bricolage Grotesque (display) + Source Serif 4 (body), self-hosted via Fontsource — no external font requests, which also keeps the CSP tight. Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty` (no orphaned words).
- **Signature device**: the "blade rule" — a gold line tapering to a sword point (echoing the sword in the SOTM mark) under every section eyebrow, drawn in on scroll.
- **Motion**: reveal-once fade/slide, eyebrow draw-in, button micro-lift. Everything under 1s, plays once, fully disabled under `prefers-reduced-motion`.
- **Extra page**: `/platforms` was added beyond the original seven because the content document lists the full platform catalogue (SOM, SAFOMS, Morning Dew, etc.) — too substantial to bury.
- **Photos**: the three supplied portraits were optimised to WebP (the 15 MB portrait is now 0.35 MB) and are live on the Home and About pages. The logo got a light variant for dark surfaces.
