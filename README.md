# DZ APP

A classifieds marketplace connecting Algerians in France and Algeria —
"tout en un seul endroit." This repo is the **MVP**, scoped to a single
category (**Voitures** / cars) to prove out the product before expanding to
Immobilier, Travail, Mariage, and the rest.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS)
- **Prisma** ORM + **SQLite** — chosen for this MVP stage so it runs
  anywhere (including a free Render deploy) with zero external database
  setup; see `prisma/schema.prisma` for notes on moving to Postgres once
  there's real user data to persist
- **Auth.js (NextAuth v5)** — email/password (Credentials provider, JWT
  sessions)
- Local filesystem image upload (`public/uploads/`) — swap for S3-compatible
  object storage before deploying to production, since most hosts don't
  persist local disk across deploys

## What's in the MVP

- Register / login
- Browse Voitures listings with filters (ville, pays, prix)
- Listing detail page with image gallery
- Post a new car listing (with photo upload)
- Data model already includes `Conversation` / `Message` / `Favorite` for
  the next iteration (in-app chat, saved listings) — not wired to any UI yet
- "Contacter le vendeur" button is a placeholder (messaging is v2)

## Quickstart

### Option A — Deploy to Render (get a real URL)

This repo includes a [`render.yaml`](render.yaml) blueprint.

1. Click **[Deploy to Render](https://render.com/deploy?repo=https://github.com/samdayayd/samdayayd-dzapp)**.
2. Sign in with GitHub, connect this repo, pick the branch you're working on.
3. Click **Apply**. Render does the first deploy — it'll fail once, because
   `NEXTAUTH_URL` can't be known until the service exists.
4. Once the service has a `*.onrender.com` URL, open its **Environment**
   tab, set `NEXTAUTH_URL` to that full URL (e.g.
   `https://dzapp-xxxx.onrender.com`), save, and it redeploys automatically.
5. Visit the URL — register an account and post a listing.

Note: the free plan has no persistent disk, so both the SQLite database and
uploaded photos reset on every redeploy or restart — fine for trying it
out, see `render.yaml`'s comments before any real usage.

### Option B — run locally

```bash
cp .env.example .env
# generate a real secret and paste it into AUTH_SECRET in .env:
openssl rand -base64 32

npm install
npx prisma migrate dev
npm run dev
```

Visit http://localhost:3000.

## Project structure

```
prisma/schema.prisma       # User, Listing, ListingImage, Favorite, Conversation, Message
src/auth.ts                 # NextAuth config (Credentials provider)
src/app/api/register        # sign-up endpoint
src/app/api/listings        # create listing endpoint
src/app/api/upload          # image upload endpoint
src/app/voitures            # feed, detail, create-listing pages
src/app/login, /register    # auth pages
```

## Roadmap (post-MVP)

- In-app messaging (buyer ↔ seller, using the existing `Conversation`/`Message` models)
- Move from SQLite to Postgres once there's real user data to persist
- Object storage for images (S3/R2) instead of local disk
- Phone/ID verification badge
- Additional categories: Immobilier, Travail, Achat/Vente, Mariage, Location, Services
- Bilingual FR/AR with RTL support
- Saved searches + alerts
- Admin/moderation dashboard
