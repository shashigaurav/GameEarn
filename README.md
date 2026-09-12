# GameEarn 2026

A premium, dark, glassmorphism gaming/rewards discovery platform — still a **dependency-free
static site**. No real backend, no functioning auth, no payments. Everything account-related
(dashboard, leaderboard, profile, referrals, rewards history) uses clearly labeled **demo data**;
everything auth-related (login/signup) is a working UI that explains it needs a backend to
actually authenticate. An `/admin/` route ships as a UI mockup of the entities a future CMS
would manage. GameEarn does **not** include betting, gambling, casino wagering, deposits or
real-money gaming anywhere on the site.

## What changed in this redesign

- New visual theme: near-black background, glassmorphism cards, neon green + electric blue as
  the primary duo (violet used sparingly), glowing buttons, floating particles, card-hover glow,
  number count-up animations, skeleton-ready dashboard styling.
- New information architecture layered on top of the original games catalog:
  - `/earn/` — the "Ways to Earn" hub (games, tasks, surveys, app offers, cashback, referrals,
    daily challenges, quizzes)
  - `/offers/` + `/offer/<slug>/` — a new **offers** catalog (tasks/surveys/app-offers/cashback)
    separate from games, each with provider, reward range, difficulty, trust score and
    last-verified date (`data/offers.js`)
  - `/rewards/` + `/rewards/history/` — reward-type explainer + demo transaction history
  - `/dashboard/` — demo stat cards (Total/Available/Pending/Completed) + daily streak
  - `/leaderboard/` — demo top-earners table
  - `/profile/` + `/referrals/` — demo profile/achievements + referral code with copy/share
  - `/login/` + `/signup/` — real forms, but submitting shows a clear "connect a backend" message
  - `/admin/` — non-functional CRUD-mockup for offers/games (noindexed, not linked in main nav)
  - Sticky header now includes Login/Sign Up + search/notification/profile icons; a mobile
    bottom nav (Home / Earn / Games / Rewards / Profile) appears under 720px.
- All of the original games catalog, category pages, search, and legal pages carry over.

## Structure

```
data/games.js            28 dummy games/apps (unchanged catalog from the original build)
data/offers.js            16 dummy tasks/surveys/app-offers/cashback deals, with trust scoring
data/demo.js               Demo-only dashboard/streak/leaderboard/profile/referral/transaction data
build/generate-assets.js        SVG art generator for games
build/generate-offer-assets.js  SVG art generator for offers
build/components.js       Reusable "components" — header, footer, bottom nav, cards, badges,
                           trust score bar, stat cards, streak days, leaderboard rows, etc.
build/layout.js            Page shell: <head> metadata, JSON-LD, header/bottomNav/footer wiring
build/pages/*.js           One template per page type
build/build.js              Orchestrates everything → writes /public, sitemap.xml, robots.txt
css/styles.css              Full design system (2026 neon/glass theme)
js/main.js                   Nav, FAQ accordions, counters, grid filter/sort/search engine
                              (shared by games + offers grids), streak claim demo (localStorage),
                              referral copy/share, mixed games+offers global search
public/                      Build output — deploy this folder
```

## Running / rebuilding

```bash
node build/generate-assets.js         # (re)generate per-game SVG art
node build/generate-offer-assets.js   # (re)generate per-offer SVG art
node build/build.js                   # (re)generate every HTML page + sitemap.xml + robots.txt
```

Then open `public/index.html` or serve `public/` with any static host.

To edit games: `data/games.js`. To edit offers: `data/offers.js`. To edit demo dashboard/
leaderboard/streak/profile/referral numbers: `data/demo.js`. Never edit data inside a template —
re-run both generate scripts and the build script after any data change.

## Demo-data policy (important)

Per the brief, no part of this build fabricates real users, balances or transactions. Every page
that shows dashboard/leaderboard/profile/referral/transaction data renders a visible
"Demo data" banner next to it, and the footer disclaimer, About, Terms and Disclaimer pages all
say this explicitly. When a real backend is connected, replace the data sources in
`data/demo.js` (and the corresponding page templates) with real API/account calls — the rest of
the markup and styling needs no changes.

## Database-ready structure

`data/games.js`, `data/offers.js` and `data/demo.js` map directly onto the entities named in the
brief: `games`, `offers`/`providers`, `users`, `rewards`/`transactions`, `referrals`, `reviews`
(see each offer's `reviews` array), `daily_rewards`, `achievements`. Swapping a data file's export
for a real database/API call is the only change needed to go live — no template touches raw data.

## Before going live

- Replace `SITE_URL` in `build/components.js` with your real production domain.
- Replace each game's/offer's dummy `sourceUrl`/CTA link with the real official link.
- Connect a real backend (Supabase/Firebase/PostgreSQL) for auth, the dashboard, leaderboard,
  profile, referrals and admin actions — all currently UI-only by design.
- Swap the generated SVG art for real cover images/screenshots when available.
