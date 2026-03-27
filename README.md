# Signal

Signal is a personalized AI intelligence platform that scans high-signal sources, ranks what matters, and delivers a daily briefing with actionable insights — tailored to your interests across tech, startups, research, business, and more.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green) ![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)

---

## Features

- **Multi-source scanning**: Collects daily AI signals from Reddit, Hacker News, Bluesky, X, and curated RSS feeds.
- **Relevance ranking**: Scores trends by source quality, engagement velocity, and user preference matching.
- **AI summarization**: Converts raw links into plain-English updates with clear why-it-matters context.
- **Multiple digest formats**: Quick Summary, Deep Dive, Professional Brief, Key Takeaways, and Full Report.
- **Domain-based personalization**: Choose from 10+ interest domains (Tech, Startups, Research, Business, Healthcare, etc.).
- **Tiered access**: Supports free and pro feature limits with Stripe-based subscription upgrades.
- **Automated delivery**: Sends daily digest emails with open tracking and secure unsubscribe handling.
- **Admin-safe operations**: Restricts scan/send automation to cron or approved admin identities.

---

## Tech Stack

| Area | Stack | Purpose |
|------|-------|---------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript | Builds the landing, onboarding, settings, and dashboard UI with typed components. |
| Styling | Tailwind CSS v4, Lucide icons | Delivers the design system, responsive layouts, and iconography. |
| Auth & DB | Supabase Auth + Postgres (supabase-js v2) | Handles email/password + Google OAuth sessions and stores users, trends, and digests. |
| API Layer | Next.js Route Handlers | Exposes scan, digest, preferences, billing, tracking, and auth sync endpoints. |
| AI Processing | Anthropic Claude SDK | Summarizes trends and generates actionable insights for each digest format. |
| Billing | Stripe Checkout + Webhooks | Manages plan upgrades, subscription lifecycle, and entitlement updates. |
| Email Delivery | Resend | Sends digest emails, tracks opens, and supports secure unsubscribe links. |
| Deployment | Vercel | Hosts the Next.js app and runs scheduled cron-triggered operations. |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  Landing Page → Onboarding → Dashboard → Settings            │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                     API Routes                               │
│  /scan  /send-digests  /stripe/*  /track/*  /preferences    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Core Services                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Scanner  │  │ Ranker   │  │ Claude   │  │ Resend   │    │
│  │          │  │          │  │ Analysis │  │ Email    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              External Services                               │
│  Supabase │ Stripe │ Anthropic │ Resend │ HN/Reddit/RSS    │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Anthropic API key
- Stripe account (for payments)
- Resend account (for email)

### Installation

```bash
git clone https://github.com/Rchong01010/ai-trend-digest.git
cd ai-trend-digest
npm install
cp .env.example .env.local
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_legacy_anon_jwt
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_SERVICE_KEY=your_service_key

# Google OAuth (Supabase provider settings)
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
GOOGLE_OAUTH_SUPABASE_CALLBACK_URL=https://your-project-ref.supabase.co/auth/v1/callback

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_key

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_URL=http://localhost:3000
ADMIN_EMAIL=your@email.com
ADMIN_EMAILS=admin1@email.com,admin2@email.com
CRON_SECRET=your-random-secret
MIGRATION_SECRET=your-migration-secret
SEED_SECRET=your-local-seed-secret
UNSUBSCRIBE_SECRET=your-unsubscribe-secret
DIGEST_LINK_SECRET=optional-digest-link-secret
ENABLE_LEGACY_SUBSCRIBE=false
ALLOW_RUNTIME_MIGRATIONS=false
```

### Database Setup

Run in Supabase SQL Editor:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  timezone TEXT DEFAULT 'America/Los_Angeles',
  preferences JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  subscription_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  summary TEXT,
  why_it_matters TEXT,
  tiktok_angle TEXT,
  script TEXT,
  sources JSONB,
  engagement_score INTEGER,
  date DATE,
  scanned_at TIMESTAMP DEFAULT now()
);

CREATE TABLE digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  sent_at TIMESTAMP DEFAULT now(),
  trends_included UUID[],
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);

CREATE INDEX idx_users_stripe ON users(stripe_customer_id);
CREATE INDEX idx_trends_date ON trends(date);
```

### Run Development Server

```bash
npm run dev
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/scan` | POST | Trigger trend scan |
| `/api/send-digests` | POST | Send emails to all verified users |
| `/api/subscribe` | POST | Legacy endpoint (disabled by default) |
| `/api/verify` | GET | Legacy endpoint (disabled by default) |
| `/api/user/preferences` | GET/POST | Manage user settings |
| `/api/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/stripe/webhook` | POST | Handle Stripe events |
| `/api/track/open` | GET | Track email opens |
| `/api/unsubscribe` | GET | Unsubscribe user |

---

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Cloudflare Pages (Full Project)

This repo is configured for Cloudflare via OpenNext.

#### 1) One-time setup

```bash
pnpm install
pnpm run cf:build
```

Cloudflare config files in this repo:
- `wrangler.jsonc`
- `open-next.config.ts`

#### 2) Create required Cloudflare resources

Create the R2 bucket used for Next incremental cache (must match `wrangler.jsonc`):

```bash
pnpm wrangler r2 bucket create signalss-pages-opennext-cache
```

#### 3) Configure Cloudflare project

Use Workers/Pages with this project connected to Git, then set:
- Build command: `pnpm run cf:build`
- Build output directory: `.open-next/assets`
- Compatibility date: use latest stable (repo default is set in `wrangler.jsonc`)
- Compatibility flags: `nodejs_compat`, `global_fetch_strictly_public`

#### 4) Set environment variables in Cloudflare

Set all variables from `.env.example`, especially:
- `NEXT_PUBLIC_URL` (must be your Cloudflare production domain)
- Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, publishable key, service role key)
- `CRON_SECRET`
- Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`)
- `RESEND_API_KEY`, `ANTHROPIC_API_KEY`

#### 5) Deploy

```bash
pnpm run cf:deploy
```

For local production-like preview:

```bash
pnpm run cf:preview
```

#### 6) Post-deploy provider updates

- Supabase Auth: add Cloudflare domain in site/redirect URLs.
- Stripe: set webhook endpoint to `https://<your-domain>/api/stripe/webhook` and update `STRIPE_WEBHOOK_SECRET`.
- Resend links will use `NEXT_PUBLIC_URL`, so ensure it points to Cloudflare production domain.

#### 7) Cron (Supabase scheduler)

This project supports Bearer-token cron auth (`CRON_SECRET`) for non-Vercel schedulers.
Configure Supabase scheduled jobs to call:

```
POST https://your-domain.com/api/scan
Authorization: Bearer <CRON_SECRET>

POST https://your-domain.com/api/send-digests
Authorization: Bearer <CRON_SECRET>
```

> Note: `vercel.json` cron settings are only used on Vercel and can be ignored for Cloudflare.

### Cron Jobs

```
0 6 * * * curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/scan
0 7 * * * curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/send-digests
```
