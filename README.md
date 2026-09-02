# DZ APP

A classifieds marketplace connecting Algerians in France and Algeria —
"Écosystème d'affaires franco-algérien." This repo is the **MVP**, scoped to
a single category (**Voitures** / cars, sale and rental) to prove out the
product before expanding to Immobilier, Travail, Mariage, and the rest.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS)
- **next-intl** — French (default), English, Arabic (full RTL support)
- **Prisma** ORM + **SQLite** — chosen for this MVP stage so it runs
  anywhere (including a free Render deploy) with zero external database
  setup; see `prisma/schema.prisma` for notes on moving to Postgres once
  there's real user data to persist
- **Auth.js (NextAuth v5)** — email/password (Credentials provider, JWT
  sessions), with forgot/reset password via email
- **Resend** — password reset emails (free tier). Without an API key set,
  reset links are logged to the server console instead (fine for local dev)
- Uploaded images are served through `src/app/api/uploads/[...path]`, not
  Next's `public/` static pipeline — see that route's comments for why

## What's in the MVP

- Register / login, with show/hide password and forgot/reset password
- Browse Voitures listings with filters (ville, pays, type, prix)
- Listings can be tagged **à vendre** or **à louer** (rentals show price
  per day)
- Listing detail page with image gallery and real contact info (call /
  email buttons using the seller-provided contact name, email, phone)
- Post a new car listing (with photo upload)
- Data model already includes `Conversation` / `Message` / `Favorite` for
  the next iteration (in-app chat, saved listings) — not wired to any UI
  yet; contact info on each listing is the way to reach a seller today

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
5. (Optional but recommended) Create a free [Resend](https://resend.com)
   account, grab an API key, and set `RESEND_API_KEY` in the same
   Environment tab so forgot-password emails actually get delivered.
6. Visit the URL — register an account and post a listing.

Note: the free plan has no persistent disk, so the SQLite database and
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
prisma/schema.prisma          # User, Listing, ListingImage, Favorite, Conversation, Message, PasswordResetToken
messages/{fr,en,ar}.json       # all UI translations
src/i18n/                      # next-intl routing/config
src/auth.ts                    # NextAuth config (Credentials provider)
src/app/api/register           # sign-up endpoint
src/app/api/forgot-password    # sends a reset link
src/app/api/reset-password     # consumes the reset token
src/app/api/listings           # create listing endpoint
src/app/api/upload             # image upload endpoint
src/app/api/uploads/[...path]  # serves uploaded images (see comments there)
src/app/[locale]/voitures      # feed, detail, create-listing pages
src/app/[locale]/login, /register, /forgot-password, /reset-password
```

## Roadmap (post-MVP)

- In-app messaging (buyer ↔ seller, using the existing `Conversation`/`Message` models)
- Move from SQLite to Postgres, and images to S3/R2, once there's real user
  data to persist (both currently reset on every Render redeploy)
- Phone/ID verification badge
- Additional categories: Immobilier, Travail, Achat/Vente, Mariage, Location, Services
- Saved searches + alerts
- Admin/moderation dashboard
