# GameEarn

A dark, glassmorphism gaming/rewards discovery platform. The **games catalog is backed by
Supabase** (Postgres + Auth + Storage + RLS) with a secure admin panel for managing it. There is
**no public user-account system** — visitors browse, search and open games without logging in.
The only authentication in this project is **admin authentication**, gating `/admin/*`.

## Architecture (read this first if you're extending the project)

This project has **no client-side JS framework and no bundler** — pages are either:

1. **Pre-rendered static HTML** (built once by `node build/build.js`, output to `/public`) — used
   for pages that don't depend on live game data: offers, legal pages, the demo dashboard/
   leaderboard/profile/referrals, and the admin panel's UI shells.
2. **Vercel serverless functions** under `/api` — used for every page that must reflect the live
   `games` table without a rebuild: the homepage's game sections, `/games/`, `/games/<slug>/`,
   `/category/*`, `/trending/`, `/new-games/`, `/earning-games/`, and `/sitemap.xml`. `vercel.json`
   rewrites the clean URLs to these functions. They query Supabase with the **public anon key**
   only — the same key the browser uses — because every read they do is already allowed for
   anonymous users under RLS (published games only).
3. **Client-side Supabase calls** — the admin panel (`/admin/...`) and the games portion of
   `/search/` talk to Supabase directly from the browser using `@supabase/supabase-js` (loaded
   via `esm.sh`, no bundler needed) and the anon key. Security here is enforced by **Row Level
   Security**, not by hiding pages — see `supabase/schema.sql`.

Because of #2, **local preview now needs `vercel dev`** (which runs the serverless functions and
honors `vercel.json`) rather than just opening `public/index.html`. Static-only pages will still
open directly in a browser, but the homepage/games/category pages will not.

## Authentication model

There is exactly one authentication flow in this project: **admin login** at `/admin/login/`,
which protects `/admin/`, `/admin/games/`, `/admin/games/add/`, and `/admin/games/edit/`. There is
no signup, login, logout, or account system for regular visitors — `services/authService.js` is
used only by the admin panel; public pages never import it. An "admin" is simply a row in
`profiles` with `role = 'admin'` — created by you via the SQL Editor, never through a public form.

## Verify your Supabase connection

I can't test your live project from here — this environment has no network access, and I never
see your real `.env` values (correctly so). Instead, use the diagnostic endpoint built for this:

1. Deploy (or run `vercel dev` locally) with `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` set.
2. Visit `/api/health`. You'll get JSON like:
   ```json
   {
     "ok": true,
     "checks": {
       "envVarsPresent": true,
       "urlLooksValid": true,
       "gamesTableReachable": true,
       "publishedGamesCount": 28,
       "authReachable": true
     },
     "errors": []
   }
   ```
3. If `"ok": false`, the `errors` array tells you exactly what's wrong — most commonly:
   - `envVarsPresent: false` → the env vars aren't set in this environment yet (or you're testing
     locally without a `.env` file / `vercel dev`).
   - `urlLooksValid: false` → double-check you copied the **Project URL**, not something else, from
     Supabase → Project Settings → API.
   - `gamesTableReachable: false` → usually means `supabase/schema.sql` hasn't been run yet against
     this project, or the anon key doesn't match the project URL.
   - `authReachable: false` → the Auth API didn't respond for this project/key combination.

This check only ever uses the anon key and only ever does what an anonymous visitor's browser is
already allowed to do under RLS — it's a real read against your live database, not a guess.

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project. Pick any name/region/password.
2. Once it's ready, go to **Project Settings → API** and copy:
   - **Project URL** → this is `VITE_SUPABASE_URL`
   - **anon public** key (labeled **"Publishable key"** in newer Supabase dashboards — same thing)
     → this is `VITE_SUPABASE_ANON_KEY`
   (Never copy the **service_role**/**secret** key into this project — it isn't used anywhere here.
   Note: this project has no Vite build step; the `VITE_` prefix is kept only because it's the
   exact variable name used throughout — both `build/build.js` and the `/api` functions read it
   via plain `process.env`.)

## 2. Run the SQL schema

Open **SQL Editor** in the Supabase dashboard, paste the contents of `supabase/schema.sql`, and
run it. This creates:
- `public.games` (with indexes on category/status/featured/trending/popular/new_release, and a
  unique index on `slug` via its UNIQUE constraint)
- `public.profiles` (role: `admin` | `user`, auto-created for every new auth user via a trigger)
- The `is_admin()` helper function
- RLS policies on both tables (public can SELECT published games only; only admins can
  INSERT/UPDATE/DELETE games)
- The `game-assets` Storage bucket (public read, admin-only write) and its RLS policies

Then run `supabase/seed.sql` (also in the SQL Editor) to load all 28 games from the existing
catalog as `status = 'published'` — nothing from the current dummy data is lost.

## 3. Storage bucket

`schema.sql` already creates the `game-assets` bucket via SQL and sets it public with admin-only
write policies. Nothing else to do here — but you can double check it under **Storage** in the
dashboard; you should see `game-assets` listed as a public bucket.

## 4. Configure Auth

No special configuration is required — email/password auth is enabled by default on a new
Supabase project (**Authentication → Providers → Email**). If you disabled it, turn it back on.
You do *not* need to enable public signups for end users; admins are the only accounts you'll
create (see next step).

## 5. Create your first admin

There is no hardcoded admin password anywhere in this project. The admin login screen only asks
for a **username** — Supabase Auth itself is still email-based under the hood, so a fixed internal
domain (`gameearn.local`, set in `services/authService.js`) is appended automatically. You never
type or see that email anywhere in the UI.

1. Pick a username, e.g. `admin`. Its internal email will be `admin@gameearn.local`.
2. In the Supabase dashboard, go to **Authentication → Users → Add User**, using that constructed
   email (`admin@gameearn.local`) and a password you choose. Turn on **Auto Confirm User** so it
   doesn't wait on an email confirmation link that will never arrive (this address isn't real mail).
3. This automatically creates a matching row in `public.profiles` with `role = 'user'` (via the
   trigger in `schema.sql`).
4. Promote it to admin **and** set its username — in the **SQL Editor**, run:
   ```sql
   update public.profiles
   set role = 'admin', username = 'admin'
   where email = 'admin@gameearn.local';
   ```
5. Log in at `/admin/login/` with username `admin` and the password you chose in step 2.

To add another admin later, repeat with a different username (e.g. `admin2@gameearn.local`).

## 6. Environment variables

| Variable | Where it's used | Safe to expose? |
|---|---|---|
| `VITE_SUPABASE_URL` | Build step (`build/build.js`) → injected into `public/js/env-config.js`; also read directly by `/api` functions at request time | Yes |
| `VITE_SUPABASE_ANON_KEY` | Same as above | Yes — this is the public anon key, meant to be used from the browser. RLS is the actual security boundary. |

Copy `.env.example` to `.env` for local use with `vercel dev`. **Never** add
`SUPABASE_SERVICE_ROLE_KEY` anywhere in this project — it is not used, and `.gitignore` already
excludes `.env*` files from version control.

In Vercel: **Project Settings → Environment Variables** → add both variables (Production,
Preview, and Development environments) → redeploy.

## 7. Run locally

```bash
npm install          # installs @supabase/supabase-js for the /api functions
cp .env.example .env # fill in your real VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npx vercel dev        # runs the static site + /api functions together, honoring vercel.json
```

`npx vercel dev` is required (not a plain static server) because the homepage, games, and
category pages are serverless functions, not static files. The first time, `vercel dev` will ask
you to link the folder to a Vercel project — you can create a new one or link the existing one.

## 8. Deploy to Vercel

If the project is already connected to Vercel (as you mentioned), just push these changes to the
branch Vercel deploys from — `vercel.json`'s `buildCommand` (`npm run build`) and
`outputDirectory` (`public`) tell Vercel everything it needs. Two things to check in the Vercel
dashboard for a project that was previously "just static files":

1. **Environment Variables** — add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as described above.
2. **Build & Development Settings** — if the project was previously configured with a manual
   "Output Directory" of `public` and no build command (i.e., you were committing pre-built HTML),
   switch **Build Command** to `npm run build` (or just leave it — `vercel.json` sets this for you)
   so Vercel regenerates `/public` — including `env-config.js` with your real keys, and the
   `/admin` pages — on every deploy.

`public/` is now `.gitignore`d — it's build output, not something to commit — since it depends on
environment variables at build time.

## Project structure

```
data/games.js, data/offers.js, data/demo.js   Local data (offers/demo unchanged; games.js is
                                                now only used for the CATEGORIES/PLATFORMS/
                                                REWARD_TYPES reference lists and as the source
                                                for supabase/seed.sql — not for live game data)
supabase/schema.sql                            Tables, indexes, RLS policies, storage bucket
supabase/seed.sql                              28 games seeded from the existing catalog
lib/supabaseServer.js                          Server-side Supabase client (anon key only)
lib/supabaseClient.js                          Browser Supabase client (ESM via esm.sh)
lib/gameQueries.js                             Server-side read helpers, mapped to the shape
                                                the existing templates already expect
lib/errorPage.js                               Shared error page for serverless functions
api/home.js, games.js, game-detail.js,         Serverless functions — live game data, wired
    category.js, categories.js, trending.js,   up via vercel.json rewrites
    new-games.js, earning-games.js, sitemap.js
api/health.js                                   Live diagnostic endpoint — visit /api/health
services/gameService.js                        Client-side CRUD + storage uploads
services/authService.js                        Client-side auth wrapper (sign in/out, role check)
js/admin/auth-guard.js, login.js,               Per-page admin glue (imports the services above)
    dashboard.js, games-list.js, game-form.js
js/search-live.js                              Live game search (offers stay static)
build/pages/admin/*.js                          Admin panel page templates (static shells)
vercel.json                                     Rewrites + build/output config
package.json                                    Only dependency: @supabase/supabase-js
.env.example                                    Env var template (no real secrets)
```

## Final test checklist

**Visitor:** homepage loads with live games, `/games/` and category pages filter live data,
`/games/<slug>/` loads by slug (404s cleanly for a bad/draft slug), draft games never appear on
the public site or in the sitemap, `/search/` finds live games + static offers.

**Admin:** `/admin/login/` signs in and rejects non-admin accounts; `/admin/` shows live
counts; Add/Edit Game create and update rows (with image upload to `game-assets`); Delete asks for
confirmation and refreshes the list; Logout clears the session and redirects to login.

**Security:** a non-admin (or logged-out) user is redirected out of `/admin/*` client-side, *and*
— this is the real boundary — cannot INSERT/UPDATE/DELETE `games` at all, because RLS checks
`public.is_admin()` on every write regardless of what the client sends. The `service_role` key is
never present anywhere in this codebase.
