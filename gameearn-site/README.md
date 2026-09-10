# GameEarn

A premium, SEO-ready discovery platform for earning games, reward apps and popular games —
built as a **dependency-free static site**. No backend, no auth, no admin panel, no payments,
no APK hosting. Every page is pre-rendered HTML so it works instantly, indexes cleanly, and
needs nothing but a static file host.

## Why static HTML instead of a framework

No build tooling or npm registry access is required to run or edit this project — just Node.js
(built-in, no external packages). That keeps it framework-agnostic today and easy to port into
Next.js / Astro / a real backend later, since the data layer (`data/games.js`), the templates
(`build/pages/*.js`) and the components (`build/components.js`) are already cleanly separated
from the HTML output.

## Structure

```
data/games.js          Single source of truth: 28 dummy games/apps + categories/reward types
build/generate-assets.js  Generates SVG cover/icon/screenshot art per game (no external images)
build/components.js    Reusable "components" (header, footer, game card, FAQ, badges, etc.)
build/layout.js         Page shell: <head> metadata, JSON-LD injection, header/footer wiring
build/pages/*.js        One template per page type (home, listing, detail, search, static)
build/build.js           Orchestrates everything → writes /public
css/styles.css           Design system (tokens, layout, components)
js/main.js               Mobile nav, FAQ accordions, filters/sort/search — vanilla JS only
public/                  Build output — this is what you deploy
```

## Running / rebuilding

```bash
node build/generate-assets.js   # (re)generate per-game SVG art into public/assets/games
node build/build.js             # (re)generate every HTML page + sitemap.xml + robots.txt
```

Then open `public/index.html` directly in a browser, or serve the `public/` folder with any
static server (`npx serve public`, Netlify, Vercel static hosting, GitHub Pages, nginx, etc.).

To add or edit games, edit `data/games.js` only — never edit game data inside a template — then
re-run both scripts above.

## What's implemented

- Homepage: hero, featured earning games, trending, popular earning games, categories, new
  games, top rated, how-it-works, why-GameEarn, FAQ.
- `/games/`, `/earning-games/`, `/trending/`, `/new-games/`, `/category/` and `/category/<slug>/`
  listing pages with client-side search, category/platform/reward/genre filters, sort, and
  Load More (all filtering happens in `js/main.js` against `data-*` attributes already rendered
  server-side, so content is crawlable with JavaScript disabled too).
- `/games/<slug>/` detail pages: full metadata, features, screenshots, reward info panel,
  related games, FAQ, and a "Visit Official Source" CTA (dummy URL, `rel="nofollow sponsored"`).
- `/search/` global client-side search over the full catalog.
- Unique `<title>`, meta description, canonical URL and Open Graph tags on every page.
- Schema.org JSON-LD: `Organization`, `WebSite` + `SearchAction`, `BreadcrumbList` on every
  inner page, and `VideoGame` + `AggregateRating` on every game page.
- `sitemap.xml` and `robots.txt` generated from the same page list used to build the site.
- Semantic HTML, skip link, visible focus states, `prefers-reduced-motion` support, accessible
  mobile nav, descriptive image alt text, `loading="lazy"` on below-the-fold images.
- Legal/trust pages: About, Contact (demo form, no backend), Privacy Policy, Terms & Conditions,
  Disclaimer — all written to avoid guaranteed-earnings language, plus a 404 page.

## Intentionally not included (per brief)

Supabase, any backend/API, authentication, an admin panel, payments/wallets, and APK hosting.
`data/games.js` is structured so a future backend can replace it with real API calls without
touching any template.

## Before going live

- Replace `SITE_URL` in `build/components.js` with your real production domain (metadata,
  canonical URLs, sitemap and JSON-LD all read from this one constant).
- Replace each game's dummy `sourceUrl` with the real official download/source link.
- Swap the generated SVG art for real cover images/screenshots when available.
