// build/build.js
//
// IMPORTANT ARCHITECTURE NOTE (post-Supabase integration):
// Pages that depend on the live `games` catalog — the homepage's game
// sections, /games/, /games/<slug>/, /category/*, /trending/, /new-games/,
// /earning-games/, and /sitemap.xml — are NO LONGER generated here. They're
// served at request time by the serverless functions under /api (see
// vercel.json for the rewrites that map clean URLs to them), reading live
// data straight from Supabase. That's what makes "no rebuild after an
// admin edit" possible on a statically-hosted project.
//
// Everything else on the site (legal pages and the admin panel UI) is
// unchanged in spirit: still pre-rendered once, right here, from local data
// files. GameEarn is a pure games-discovery site — no offers, earn hub,
// rewards explainer, or leaderboard.
const fs = require("fs");
const path = require("path");
const { layout } = require("./layout");
const { SITE_URL } = require("./components");
const { searchPage } = require("./pages/search");
const { aboutPage, contactPage, privacyPage, termsPage, disclaimerPage, notFoundPage } = require("./pages/static");

// admin panel (the only authentication in this project)
const { adminLoginPage } = require("./pages/admin/login");
const { adminDashboardPage } = require("./pages/admin/dashboard");
const { adminGamesListPage } = require("./pages/admin/games-list");
const { gameFormPage } = require("./pages/admin/game-form");

const OUT = path.join(__dirname, "..", "public");
const NOINDEX_PATHS = new Set([
  "/search/",
  "/admin/", "/admin/login/", "/admin/games/", "/admin/games/add/", "/admin/games/edit/",
]);

function write(relPath, html) {
  const filePath = path.join(OUT, relPath, "index.html");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.url}` })),
  };
}

/* ---------------- copy static assets into /public ---------------- */
fs.mkdirSync(path.join(OUT, "css"), { recursive: true });
fs.mkdirSync(path.join(OUT, "js", "admin"), { recursive: true });
fs.mkdirSync(path.join(OUT, "lib"), { recursive: true });
fs.mkdirSync(path.join(OUT, "services"), { recursive: true });
fs.copyFileSync(path.join(__dirname, "..", "css", "styles.css"), path.join(OUT, "css", "styles.css"));
fs.copyFileSync(path.join(__dirname, "..", "js", "main.js"), path.join(OUT, "js", "main.js"));
fs.copyFileSync(path.join(__dirname, "..", "js", "search-live.js"), path.join(OUT, "js", "search-live.js"));
for (const file of fs.readdirSync(path.join(__dirname, "..", "js", "admin"))) {
  fs.copyFileSync(path.join(__dirname, "..", "js", "admin", file), path.join(OUT, "js", "admin", file));
}
// Only the browser-facing client goes to /public/lib — supabaseServer.js, gameQueries.js and
// errorPage.js are Node-only (used by /api) and must never ship as a browser-fetchable file.
fs.copyFileSync(path.join(__dirname, "..", "lib", "supabaseClient.js"), path.join(OUT, "lib", "supabaseClient.js"));
for (const file of fs.readdirSync(path.join(__dirname, "..", "services"))) {
  fs.copyFileSync(path.join(__dirname, "..", "services", file), path.join(OUT, "services", file));
}
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });
const FAVICON_SVG = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="16" fill="#050609"/><rect x="2" y="2" width="60" height="60" rx="14" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#35F2A6"/><stop offset="1" stop-color="#3DBBFF"/></linearGradient></defs><circle cx="24" cy="32" r="4" fill="#050609"/><circle cx="34" cy="32" r="4" fill="#050609"/></svg>`;
fs.writeFileSync(path.join(OUT, "assets", "favicon.svg"), FAVICON_SVG);
fs.writeFileSync(path.join(OUT, "assets", "og-default.svg"), FAVICON_SVG);

/* ---------------- generate public env config (anon key is safe to expose) ---------------- */
const envConfig = `window.__GAMEEARN_ENV = ${JSON.stringify({
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || "",
})};`;
fs.writeFileSync(path.join(OUT, "js", "env-config.js"), envConfig);
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "\n⚠️  VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set in this build environment.\n" +
      "   The admin panel and live search will show a 'Supabase isn't configured' notice\n" +
      "   until these are set (Vercel: Project Settings → Environment Variables).\n"
  );
}

/* ---------------- search (games fetched live client-side) ---------------- */
write("search", layout({ title: "Search Games | GameEarn", description: "Search GameEarn's full games catalog by name, genre, developer or platform.", path: "/search/", noindex: true, content: searchPage() }));

/* ---------------- static/legal pages ---------------- */
write("about", layout({ title: "About GameEarn - Our Discovery Platform", description: "Learn what GameEarn is and how it works.", path: "/about/", content: aboutPage() }));
write("contact", layout({ title: "Contact GameEarn", description: "Get in touch with the GameEarn team.", path: "/contact/", content: contactPage() }));
write("privacy-policy", layout({ title: "Privacy Policy | GameEarn", description: "Read GameEarn's privacy policy.", path: "/privacy-policy/", content: privacyPage() }));
write("terms-and-conditions", layout({ title: "Terms & Conditions | GameEarn", description: "Read the terms and conditions for using GameEarn.", path: "/terms-and-conditions/", content: termsPage() }));
write("disclaimer", layout({ title: "Disclaimer | GameEarn", description: "GameEarn's disclaimer.", path: "/disclaimer/", content: disclaimerPage() }));

/* ---------------- admin panel (real, Supabase-backed) ---------------- */
write("admin/login", adminLoginPage());
write("admin", adminDashboardPage());
write("admin/games", adminGamesListPage());
write("admin/games/add", gameFormPage("add"));
write("admin/games/edit", gameFormPage("edit"));

// 404 (written directly)
fs.writeFileSync(path.join(OUT, "404.html"), layout({ title: "Page Not Found | GameEarn", description: "The page you're looking for doesn't exist.", path: "/404/", noindex: true, content: notFoundPage() }));

/* ---------------- robots.txt (sitemap.xml is served dynamically by /api/sitemap) ---------------- */
const robots = `User-agent: *
Allow: /
Disallow: /search/
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(OUT, "robots.txt"), robots);

console.log(`Built static pages into ${OUT}. Games/category/homepage pages are served live via /api (see vercel.json).`);
