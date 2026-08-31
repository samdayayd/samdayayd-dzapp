# DZ APP

A classifieds marketplace connecting Algerians in France and Algeria —
"tout en un seul endroit." This repo is the **MVP**, scoped to a single
category (**Voitures** / cars) to prove out the product before expanding to
Immobilier, Travail, Mariage, and the rest.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS)
- **Prisma** ORM + **PostgreSQL**
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

## Local setup

### 1. Start Postgres

Option A — Docker:

```bash
docker compose up -d
```

Option B — a local Postgres install: create a `dzapp` role/database matching
`.env.example`.

### 2. Configure environment

```bash
cp .env.example .env
# generate a real secret:
openssl rand -base64 32   # paste into AUTH_SECRET
```

### 3. Install deps, migrate, run

```bash
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
- Object storage for images (S3/R2) instead of local disk
- Phone/ID verification badge
- Additional categories: Immobilier, Travail, Achat/Vente, Mariage, Location, Services
- Bilingual FR/AR with RTL support
- Saved searches + alerts
- Admin/moderation dashboard
