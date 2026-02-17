# Central Square — Technical Snapshot for Nick

**Date:** 17 Feb 2025
**From:** Teijas
**Context:** We're getting the MVP live so design partners can start testing with real communities. Here's everything you need to jump in.

---

## What Central Square Is

A B2B2C community operations platform. Think "Shopify for real-world communities" — community operators (run clubs, design circles, professional networks) get a unified hub instead of stitching together 6+ tools. An AI host called Ellie helps with onboarding, intelligence, and coaching.

**Live URL:** https://central-square.vercel.app
**Repo:** https://github.com/teijas7-star/central-square
**Pitch deck (Figma):** https://dingy-exit-45607273.figma.site

---

## Tech Stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| React | React | 19.2.4 |
| Language | TypeScript | 5 |
| Database | PostgreSQL | via Supabase |
| ORM | Prisma | 6.18.0 |
| Auth | Supabase (magic link / passwordless) | SSR 0.7.0 |
| AI | OpenAI (gpt-4o-mini) | SDK 6.7.0 |
| Styling | Tailwind CSS | 4 |
| Animations | Framer Motion | 12.23.24 |
| Validation | Zod | 4.1.12 |
| Rate Limiting | Upstash Redis | 2.0.6 |
| Hosting | Vercel | auto-deploy on push to main |

---

## What's Built and Working

### Core Platform (WORKING)
- **Auth:** Supabase magic-link (passwordless). Sign in → email → click link → session. Rate-limited 1 per 60s per email.
- **Profiles:** Create/edit with handle, name, bio, interests. Zod-validated.
- **Arcades (communities):** Full CRUD. Open or invite-only visibility. Host/member roles.
- **Posts:** Create, reply, thread, "lantern" (highlight). Rate-limited 10/min. Content moderation filter. Soft deletes.
- **Discovery:** Search/filter arcades by tags and keywords. Global feed across all public arcades.
- **Invites:** Token-based invite system with expiration for private arcades.
- **Moderation:** Report posts, soft-delete, banned-word filter.

### AI Host — Ellie (PARTIAL)
- **Chat interface:** Full conversation UI, messages persisted to DB.
- **Preference learning:** After 4+ messages, extracts user interests/values/goals from conversation.
- **Recommendations:** Matches user preferences to arcades using tag-overlap algorithm, returns top 5 with confidence scores.
- **Mock mode:** Works without OpenAI key (deterministic responses). Add `OPENAI_API_KEY` for real GPT-4o-mini responses.

### Static Pages (WORKING, NO AUTH NEEDED)
- `/partner` — Design partner one-pager (shareable)
- `/pitch` — 27-slide interactive pitch deck
- `/aspeninstitute` — Pilot customer landing page

---

## What's NOT Built Yet

| Feature | Status | Notes |
|---------|--------|-------|
| WhatsApp bot integration | Zero code | Core to the cold-start strategy — bots deploy into existing channels |
| Instagram bot integration | Zero code | Same as above |
| Eventbrite integration | Zero code | Pull events into arcade automatically |
| Real-time messaging | Not started | Currently polling-based, no WebSocket/SSE |
| Image uploads / CDN | Not started | Posts are text-only, avatars use DiceBear |
| Structured events system | Not started | Events exist as UI mock, no DB model |
| Intelligence dashboard (real) | Mock data only | Beautiful UI exists at `/intelligence` but all data is hardcoded |
| Payments / billing | Not started | Revenue model designed (SaaS tiers) but no Stripe etc. |
| Mobile app | Skeleton only | `/ios_app` dir has React Native/Expo starter, not connected |

---

## Database Schema (13 models)

```
Profile ──┬── Membership ── Arcade
          ├── Post (threaded, soft-delete)
          ├── AIHost ── AIConversation
          ├── UserPreferences
          └── AIRecommendation ── Arcade

Arcade ──── Invite (token-based, expiring)
Post ────── Report
```

**Key relationships:**
- Profile → many Memberships → many Arcades
- Profile → one AIHost → many AIConversations
- Arcade has host (Profile) + members via Membership
- Posts are threaded (self-referential parent/replies)

---

## API Surface (25 endpoints)

### Auth
- `POST /api/auth/magic-link` — send OTP email
- `GET  /api/auth/callback` — handle magic link redirect
- `POST /api/auth/signout`

### Profiles
- `GET  /api/profiles` — get current user
- `PUT  /api/profiles` — update profile

### Arcades
- `GET  /api/arcades` — list all (paginated)
- `POST /api/arcades` — create (auto-creates host membership)
- `GET  /api/arcades/[id]` — get details
- `POST /api/arcades/[id]/join` — join (open or with invite token)
- `GET  /api/arcades/[id]/members` — list members
- `POST /api/arcades/[id]/invite` — create invite token

### Posts
- `GET  /api/posts` — paginated, filterable by arcade/parent
- `POST /api/posts` — create (rate-limited, moderated)
- `POST /api/posts/[id]/lantern` — toggle highlight

### AI Host
- `GET  /api/ai-host/chat` — conversation history
- `POST /api/ai-host/chat` — send message, get AI response
- `GET  /api/ai-host/recommendations` — personalized arcade matches
- `POST /api/ai-host/recommendations` — track click/join

### Discovery & Feed
- `GET  /api/discovery` — search arcades by tag/query
- `GET  /api/feed/square` — global feed

### Moderation
- `POST /api/moderation/posts/[id]/soft-delete`
- `POST /api/reports` — report post

### Health
- `GET  /api/health`

---

## Project Structure

```
app/
├── (account)/       # Profile, AI Host
├── (app)/           # Dashboard, Discover, Events, People
├── (arcades)/       # Arcade pages (feed, members, settings, insights)
├── (city)/          # City-based views
├── (global)/        # Agora (public square)
├── (public)/        # Sign in
├── api/             # 25 API routes
├── onboarding/      # Onboarding flow
├── partner/         # Design partner page
├── pitch/           # Investor deck
└── intelligence/    # Analytics dashboard (mock data)

components/          # ~46 components organized by feature
├── ui/              # Base design system (buttons, cards, inputs)
├── onboarding/      # Onboarding flow screens
├── intelligence/    # Charts and analytics
├── layout/          # Nav, shells
├── CSLogos/         # Logo variants
└── pitch/           # Deck components

lib/
├── supabase.ts      # Auth client (server + browser)
├── prisma.ts        # DB client singleton
├── ai-host.ts       # OpenAI integration + mock fallback
├── rate-limit.ts    # Upstash Redis rate limiter
└── utils.ts         # Shared helpers

prisma/
├── schema.prisma    # 13 models, 2 enums
├── migrations/      # 4 applied migrations
└── seed.ts          # DB seeder
```

---

## Environment Variables

Currently configured (need to add to Vercel):

```
DATABASE_URL          = Supabase PostgreSQL (pgbouncer pooler)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
UPSTASH_REDIS_URL
UPSTASH_REDIS_TOKEN
DEMO_USER_ID
```

**Missing / Optional:**
```
OPENAI_API_KEY        = Needed for real AI Host (runs mock without it)
SUPABASE_SERVICE_ROLE_KEY = For admin operations
```

---

## Current Deployment Status

- **Vercel:** Connected to `teijas7-star/central-square`, auto-deploys on push to main
- **Static pages work:** `/partner`, `/pitch` are live and shareable
- **Dynamic pages:** Currently showing 500 because env vars haven't been added to Vercel yet
- **Next step:** Add env vars on Vercel dashboard → redeploy → full platform goes live

---

## Immediate Priorities (what we're doing now)

1. **Get env vars on Vercel** — 5 min, just pasting values into dashboard
2. **Verify core flows on production** — sign in, create arcade, post, AI host
3. **Add OpenAI API key** — enables real Ellie AI responses
4. **Onboard 3-5 design partners** — test with real communities using the `/partner` page as intro

## Medium-Term (where help would be huge)

1. **WhatsApp/Instagram bot integration** — the cold-start play. Bots deploy into existing channels, collect interaction data, intelligence emerges without migration.
2. **Real-time messaging** — WebSocket or SSE for live chat in arcades
3. **Intelligence dashboard with real data** — the mock UI exists, need to wire up actual analytics
4. **Eventbrite integration** — pull events into arcades automatically
5. **Image uploads** — S3/Cloudflare R2 for post images and avatars

---

## How to Get Running Locally

```bash
git clone https://github.com/teijas7-star/central-square.git
cd central-square
cp .env.local.example .env.local   # or get .env.local from Teijas
npm install                         # triggers prisma generate via postinstall
npm run dev                         # http://localhost:3000
```

Database is hosted on Supabase (shared), so no local Postgres needed.

---

**Questions? Ping Teijas or just dive into the repo. The codebase is clean TypeScript throughout, well-structured App Router, and the Prisma schema is the source of truth for the data model.**
