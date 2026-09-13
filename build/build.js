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
// Everything else on the site (offers, legal pages, the demo dashboard/
// leaderboard/profile/referrals from the previous redesign, and the new
// real admin panel UI) is unchanged in spirit: still pre-rendered once,
// right here, from local data files.
const fs = require("fs");
const path = require("path");
const { layout } = require("./layout");
const { offers } = require("../data/offers");
const {
  DEMO_DASHBOARD,
  DEMO_DAILY_REWARDS,
  DEMO_LEADERBOARD,
  DEMO_PROFILE,
  DEMO_ACHIEVEMENTS,
  DEMO_REFERRAL,
  DEMO_TRANSACTIONS,
} = require("../data/demo");
const { SITE_URL } = require("./components");
const { offersListingPage } = require("./pages/offers-listing");
const { offerDetailPage, offerCategoryLabel } = require("./pages/offer-detail");
const { earnPage } = require("./pages/earn");
const { howItWorksPage } = require("./pages/how-it-works");
const { rewardsPage } = require("./pages/rewards");
const { rewardsHistoryPage } = require("./pages/rewards-history");
const { dashboardPage } = require("./pages/dashboard");
const { leaderboardPage } = require("./pages/leaderboard");
const { profilePage } = require("./pages/profile");
const { referralsPage } = require("./pages/referrals");
const { loginPage, signupPage } = require("./pages/auth");
const { searchPage } = require("./pages/search");
const { aboutPage, contactPage, privacyPage, termsPage, disclaimerPage, notFoundPage } = require("./pages/static");

// admin panel (new)
const { adminLoginPage } = require("./pages/admin/login");
const { adminDashboardPage } = require("./pages/admin/dashboard");
const { adminGamesListPage } = require("./pages/admin/games-list");
const { gameFormPage } = require("./pages/admin/game-form");

const OUT = path.join(__dirname, "..", "public");
const NOINDEX_PATHS = new Set([
  "/search/", "/login/", "/signup/", "/dashboard/", "/profile/", "/referrals/", "/rewards/history/",
  "/admin/login/", "/admin/dashboard/", "/admin/games/", "/admin/games/add/", "/admin/games/edit/",
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
fs.copyFileSync(path.join(__dirname, "..", "js", "login.js"), path.join(OUT, "js", "login.js"));
fs.copyFileSync(path.join(__dirname, "..", "js", "signup.js"), path.join(OUT, "js", "signup.js"));
fs.copyFileSync(path.join(__dirname, "..", "js", "profile-auth.js"), path.join(OUT, "js", "profile-auth.js"));
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

/* ---------------- offers ---------------- */
write(
  "offers",
  layout({
    title: "Explore Verified Offers - Tasks, Surveys, App Offers & Cashback | GameEarn",
    description: "Browse verified tasks, surveys, app offers and cashback deals on GameEarn. Filter by category, difficulty and reward, and check each provider's trust score before you start.",
    path: "/offers/",
    active: "offers",
    content: offersListingPage(offers),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Offers", url: "/offers/" }])],
  })
);

offers.forEach((offer) => {
  const related = offers.filter((o) => o.slug !== offer.slug && o.category === offer.category).slice(0, 4).concat(
    offers.filter((o) => o.slug !== offer.slug && o.category !== offer.category)
  ).slice(0, 4);

  write(
    `offer/${offer.slug}`,
    layout({
      title: `${offer.title} - Reward, Terms & Details | GameEarn`,
      description: `See the reward range, eligibility, requirements and trust score for ${offer.title} from ${offer.provider} on GameEarn.`,
      path: `/offer/${offer.slug}/`,
      ogImage: offer.image,
      active: "offers",
      content: offerDetailPage(offer, related),
      jsonLd: [
        breadcrumbLd([{ name: "Home", url: "/" }, { name: "Offers", url: "/offers/" }, { name: offer.title, url: `/offer/${offer.slug}/` }]),
        {
          "@context": "https://schema.org",
          "@type": "Offer",
          name: offer.title,
          description: offer.description,
          category: offerCategoryLabel(offer.category),
          seller: { "@type": "Organization", name: offer.provider },
          image: `${SITE_URL}${offer.image}`,
        },
      ],
    })
  );
});

/* ---------------- earn / how-it-works / rewards ---------------- */
write("earn", layout({ title: "Ways To Earn on GameEarn", description: "Every path to a reward on GameEarn.", path: "/earn/", active: "earn", content: earnPage(), jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Earn", url: "/earn/" }])] }));
write("how-it-works", layout({ title: "How GameEarn Works", description: "See exactly how discovery, verification, offers and rewards work on GameEarn.", path: "/how-it-works/", active: "how-it-works", content: howItWorksPage(), jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "How It Works", url: "/how-it-works/" }])] }));
write("rewards", layout({ title: "Rewards on GameEarn", description: "Learn about the reward types available on GameEarn.", path: "/rewards/", active: "rewards", content: rewardsPage(), jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Rewards", url: "/rewards/" }])] }));
write("rewards/history", layout({ title: "Rewards History | GameEarn", description: "A demo record of points earned and redeemed on a GameEarn account.", path: "/rewards/history/", active: "rewards", noindex: true, content: rewardsHistoryPage(DEMO_TRANSACTIONS) }));
write("dashboard", layout({ title: "Your Reward Dashboard | GameEarn", description: "Track your total rewards, streak and completed tasks on GameEarn.", path: "/dashboard/", active: "rewards", noindex: true, content: dashboardPage(DEMO_DASHBOARD, DEMO_DAILY_REWARDS) }));
write("leaderboard", layout({ title: "Top Reward Earners Leaderboard | GameEarn", description: "See the top reward earners on GameEarn this season.", path: "/leaderboard/", active: "leaderboard", content: leaderboardPage(DEMO_LEADERBOARD), jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Leaderboard", url: "/leaderboard/" }])] }));
write("profile", layout({ title: "Your Profile | GameEarn", description: "View your GameEarn profile, achievements and streak.", path: "/profile/", active: "profile", noindex: true, content: profilePage(DEMO_PROFILE, DEMO_ACHIEVEMENTS) }));
write("referrals", layout({ title: "Invite Friends & Earn Rewards | GameEarn", description: "Get your GameEarn referral code.", path: "/referrals/", active: "rewards", noindex: true, content: referralsPage(DEMO_REFERRAL) }));

/* ---------------- generic (non-admin) login/signup demo pages ---------------- */
write("login", layout({ title: "Log In | GameEarn", description: "Log in to your GameEarn account.", path: "/login/", noindex: true, content: loginPage() }));
write("signup", layout({ title: "Sign Up | GameEarn", description: "Create a free GameEarn account.", path: "/signup/", noindex: true, content: signupPage() }));

/* ---------------- search (offers embedded; games fetched live) ---------------- */
write("search", layout({ title: "Search Games, Offers & Rewards | GameEarn", description: "Search GameEarn's full catalog of games and reward offers.", path: "/search/", noindex: true, content: searchPage(offers) }));

/* ---------------- static/legal pages ---------------- */
write("about", layout({ title: "About GameEarn - Our Discovery Platform", description: "Learn what GameEarn is and how it works.", path: "/about/", content: aboutPage() }));
write("contact", layout({ title: "Contact GameEarn", description: "Get in touch with the GameEarn team.", path: "/contact/", content: contactPage() }));
write("privacy-policy", layout({ title: "Privacy Policy | GameEarn", description: "Read GameEarn's privacy policy.", path: "/privacy-policy/", content: privacyPage() }));
write("terms-and-conditions", layout({ title: "Terms & Conditions | GameEarn", description: "Read the terms and conditions for using GameEarn.", path: "/terms-and-conditions/", content: termsPage() }));
write("disclaimer", layout({ title: "Disclaimer | GameEarn", description: "GameEarn's disclaimer.", path: "/disclaimer/", content: disclaimerPage() }));

/* ---------------- admin panel (real, Supabase-backed) ---------------- */
write("admin/login", adminLoginPage());
write("admin/dashboard", adminDashboardPage());
write("admin/games", adminGamesListPage());
write("admin/games/add", gameFormPage("add"));
write("admin/games/edit", gameFormPage("edit"));

// 404 (written directly)
fs.writeFileSync(path.join(OUT, "404.html"), layout({ title: "Page Not Found | GameEarn", description: "The page you're looking for doesn't exist.", path: "/404/", noindex: true, content: notFoundPage() }));

/* ---------------- robots.txt (sitemap.xml is served dynamically by /api/sitemap) ---------------- */
const robots = `User-agent: *
Allow: /
Disallow: /search/
Disallow: /login/
Disallow: /signup/
Disallow: /dashboard/
Disallow: /profile/
Disallow: /referrals/
Disallow: /rewards/history/
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(OUT, "robots.txt"), robots);

console.log(`Built static pages into ${OUT}. Games/category/homepage pages are served live via /api (see vercel.json).`);
