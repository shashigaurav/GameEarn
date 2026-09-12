// build/build.js
const fs = require("fs");
const path = require("path");
const { layout } = require("./layout");
const { games, CATEGORIES } = require("../data/games");
const { offers, OFFER_CATEGORIES } = require("../data/offers");
const {
  DEMO_DASHBOARD,
  DEMO_DAILY_REWARDS,
  DEMO_LEADERBOARD,
  DEMO_PROFILE,
  DEMO_ACHIEVEMENTS,
  DEMO_REFERRAL,
  DEMO_TRANSACTIONS,
} = require("../data/demo");
const { SITE_URL, SITE_NAME, categoryLabel } = require("./components");
const { homePage } = require("./pages/home");
const { listingPage } = require("./pages/listing");
const { offersListingPage } = require("./pages/offers-listing");
const { detailPage } = require("./pages/detail");
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
const { adminPage } = require("./pages/admin");
const { searchPage } = require("./pages/search");
const { aboutPage, contactPage, privacyPage, termsPage, disclaimerPage, notFoundPage } = require("./pages/static");

const OUT = path.join(__dirname, "..", "public");
const pagesForSitemap = [];
const NOINDEX_PATHS = new Set(["/search/", "/login/", "/signup/", "/dashboard/", "/profile/", "/referrals/", "/rewards/history/", "/admin/"]);

function write(relPath, html) {
  const filePath = path.join(OUT, relPath, "index.html");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
  const urlPath = relPath === "" ? "/" : "/" + relPath + "/";
  if (relPath !== "/404" && !NOINDEX_PATHS.has(urlPath)) pagesForSitemap.push(urlPath);
}

function relatedGamesFor(game, count = 4) {
  return games.filter((g) => g.slug !== game.slug && g.category === game.category).slice(0, count).concat(
    games.filter((g) => g.slug !== game.slug && g.category !== game.category)
  ).slice(0, count);
}

function relatedOffersFor(offer, count = 4) {
  return offers.filter((o) => o.slug !== offer.slug && o.category === offer.category).slice(0, count).concat(
    offers.filter((o) => o.slug !== offer.slug && o.category !== offer.category)
  ).slice(0, count);
}

function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.url}` })),
  };
}

/* ---------------- homepage ---------------- */
write(
  "",
  layout({
    title: "GameEarn - Play Games, Complete Offers & Discover Rewards",
    description: "Discover verified games, tasks, surveys, app offers and cashback deals in one place. GameEarn helps you compare reward opportunities before you start — no betting, no gambling.",
    path: "/",
    active: "home",
    content: homePage(games, offers),
    jsonLd: [
      { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/assets/favicon.svg` },
      { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search/?q={search_term_string}`, "query-input": "required name=search_term_string" } },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          ["What is GameEarn?", "GameEarn is a discovery platform that helps you find verified games, tasks, surveys, app offers and cashback deals, and understand their reward terms before you start."],
          ["Are rewards guaranteed?", "No. Reward availability varies by provider, region and eligibility. GameEarn does not guarantee earnings, payouts or rankings."],
          ["Does GameEarn involve betting or gambling?", "No. GameEarn does not offer betting, gambling, casino wagering, deposits or real-money gaming of any kind."],
        ].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  })
);

/* ---------------- /earn/ ---------------- */
write(
  "earn",
  layout({
    title: "Ways To Earn on GameEarn",
    description: "Every path to a reward on GameEarn: games, tasks, surveys, app offers, cashback, referrals, daily challenges and quizzes.",
    path: "/earn/",
    active: "earn",
    content: earnPage(),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Earn", url: "/earn/" }])],
  })
);

/* ---------------- /games/ ---------------- */
write(
  "games",
  layout({
    title: "Explore Games - Action, Racing, Puzzle & More | GameEarn",
    description: "Browse the full GameEarn library of games and apps. Filter by category, platform, reward type and genre, then sort by popularity, rating or release date.",
    path: "/games/",
    active: "games",
    content: listingPage({
      heading: "Popular Games",
      intro: "Browse every game on GameEarn. Use the filters below to narrow down by category, platform, reward type or genre, then visit any listing for full details before heading to the official source.",
      games,
      breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Games" }],
    }),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Games", url: "/games/" }])],
  })
);

/* ---------------- /earning-games/ (kept for continuity with the previous site structure) ---------------- */
const earningGames = games.filter((g) => g.category === "earning-games" || g.category === "reward-apps" || g.rewardType !== "None");
write(
  "earning-games",
  layout({
    title: "Earning Games - Play & Discover Reward-Based Games | GameEarn",
    description: "Discover earning games and reward apps that pair regular play with points, gift cards, cashback or tournament rewards managed by each developer.",
    path: "/earning-games/",
    active: "games",
    content: listingPage({
      heading: "Earning Games",
      intro: "Earning games pair everyday gameplay with a rewards program run by the developer — think points, gift cards, cashback or tournament prizes. Availability, eligibility and payout terms are always set by the individual app.",
      games: earningGames,
      breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Earning Games" }],
      note: "Reward availability varies by app, region and eligibility. Always check the provider's official terms before participating.",
    }),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Earning Games", url: "/earning-games/" }])],
  })
);

/* ---------------- /trending/ ---------------- */
const trendingGames = games.filter((g) => g.trending).sort((a, b) => b.rating - a.rating);
write(
  "trending",
  layout({
    title: "Trending Games & Reward Apps This Week | GameEarn",
    description: "See which games and reward apps are trending on GameEarn right now, ranked by community activity.",
    path: "/trending/",
    active: "games",
    content: listingPage({
      heading: "Trending Now",
      intro: "The games generating the most interest on GameEarn this week.",
      games: trendingGames,
      breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Trending" }],
    }),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Trending", url: "/trending/" }])],
  })
);

/* ---------------- /new-games/ ---------------- */
const newGames = [...games].filter((g) => g.newRelease).sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
write(
  "new-games",
  layout({
    title: "New Games & Reward Apps | GameEarn",
    description: "Recently added games on GameEarn, updated regularly across every category.",
    path: "/new-games/",
    active: "games",
    content: listingPage({
      heading: "New Games",
      intro: "Freshly added titles across action, puzzle, racing, earning games and more.",
      games: newGames,
      breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "New Games" }],
    }),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "New Games", url: "/new-games/" }])],
  })
);

/* ---------------- /category/<slug>/ + /category/ ---------------- */
CATEGORIES.forEach((cat) => {
  const catGames = games.filter((g) => g.category === cat.slug);
  const related = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 5);
  write(
    `category/${cat.slug}`,
    layout({
      title: `${cat.name} Games & Apps | GameEarn`,
      description: `Browse ${cat.name} games and apps on GameEarn. ${cat.blurb}`,
      path: `/category/${cat.slug}/`,
      active: "games",
      content: listingPage({
        heading: `${cat.name} Games`,
        intro: `${cat.blurb} Explore ${catGames.length} listing${catGames.length === 1 ? "" : "s"} below, or check related categories for more.`,
        games: catGames,
        breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Categories", href: "/category/" }, { label: cat.name }],
        showCategoryFilter: false,
        relatedCategories: related,
      }),
      jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Categories", url: "/category/" }, { name: cat.name, url: `/category/${cat.slug}/` }])],
    })
  );
});

write(
  "category",
  layout({
    title: "Browse All Categories | GameEarn",
    description: "Browse every game category on GameEarn, from earning games and reward apps to action, racing, puzzle and more.",
    path: "/category/",
    active: "games",
    content: `
<section class="page-head"><div class="container">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span aria-current="page">Categories</span></nav>
  <h1>Browse All Categories</h1>
  <p class="page-intro">Jump straight into a category to see every matching game.</p>
</div></section>
<section class="section" style="padding-top:0;"><div class="container">
  <div class="grid grid-6">
    ${CATEGORIES.map((c) => {
      const count = games.filter((g) => g.category === c.slug).length;
      return `<a class="category-card" href="/category/${c.slug}/"><span class="cat-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg></span><h3>${c.name}</h3><span class="count">${count} game${count === 1 ? "" : "s"}</span></a>`;
    }).join("")}
  </div>
</div></section>`,
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Categories", url: "/category/" }])],
  })
);

/* ---------------- /games/<slug>/ ---------------- */
games.forEach((game) => {
  const related = relatedGamesFor(game);
  write(
    `games/${game.slug}`,
    layout({
      title: `${game.name} - Rewards, Features & Details | GameEarn`,
      description: `Explore ${game.name}, including gameplay, rewards information, supported platforms, features and official source details on GameEarn.`,
      path: `/games/${game.slug}/`,
      ogImage: game.image,
      active: "games",
      content: detailPage(game, related),
      jsonLd: [
        breadcrumbLd([{ name: "Home", url: "/" }, { name: categoryLabel(game.category), url: `/category/${game.category}/` }, { name: game.name, url: `/games/${game.slug}/` }]),
        {
          "@context": "https://schema.org",
          "@type": "VideoGame",
          name: game.name,
          description: game.description,
          genre: game.genre,
          applicationCategory: "Game",
          operatingSystem: game.platform,
          author: { "@type": "Organization", name: game.developer },
          image: `${SITE_URL}${game.image}`,
          aggregateRating: { "@type": "AggregateRating", ratingValue: game.rating, bestRating: "5", ratingCount: 1 },
        },
      ],
    })
  );
});

/* ---------------- /offers/ ---------------- */
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

/* ---------------- /offer/<slug>/ ---------------- */
offers.forEach((offer) => {
  const related = relatedOffersFor(offer);
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
          eligibleRegion: "Varies — see eligibility section",
        },
      ],
    })
  );
});

/* ---------------- /rewards/ + /rewards/history/ ---------------- */
write(
  "rewards",
  layout({
    title: "Rewards on GameEarn - Points, Gift Cards, Cashback & More",
    description: "Learn about the reward types available on GameEarn — points, gift cards, cashback, tournament rewards, in-game rewards and referral rewards.",
    path: "/rewards/",
    active: "rewards",
    content: rewardsPage(),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Rewards", url: "/rewards/" }])],
  })
);
write(
  "rewards/history",
  layout({
    title: "Rewards History | GameEarn",
    description: "A demo record of points earned and redeemed on a GameEarn account.",
    path: "/rewards/history/",
    active: "rewards",
    noindex: true,
    content: rewardsHistoryPage(DEMO_TRANSACTIONS),
  })
);

/* ---------------- /dashboard/ ---------------- */
write(
  "dashboard",
  layout({
    title: "Your Reward Dashboard | GameEarn",
    description: "Track your total rewards, available balance, pending rewards, completed tasks and daily streak on GameEarn.",
    path: "/dashboard/",
    active: "rewards",
    noindex: true,
    content: dashboardPage(DEMO_DASHBOARD, DEMO_DAILY_REWARDS),
  })
);

/* ---------------- /leaderboard/ ---------------- */
write(
  "leaderboard",
  layout({
    title: "Top Reward Earners Leaderboard | GameEarn",
    description: "See the top reward earners on GameEarn this season, ranked by points and level.",
    path: "/leaderboard/",
    active: "leaderboard",
    content: leaderboardPage(DEMO_LEADERBOARD),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Leaderboard", url: "/leaderboard/" }])],
  })
);

/* ---------------- /how-it-works/ ---------------- */
write(
  "how-it-works",
  layout({
    title: "How GameEarn Works",
    description: "See exactly how discovery, verification, offers and rewards work on GameEarn, step by step.",
    path: "/how-it-works/",
    active: "how-it-works",
    content: howItWorksPage(),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "How It Works", url: "/how-it-works/" }])],
  })
);

/* ---------------- /profile/ + /referrals/ ---------------- */
write(
  "profile",
  layout({
    title: "Your Profile | GameEarn",
    description: "View your GameEarn profile, achievements, streak and account settings.",
    path: "/profile/",
    active: "profile",
    noindex: true,
    content: profilePage(DEMO_PROFILE, DEMO_ACHIEVEMENTS),
  })
);
write(
  "referrals",
  layout({
    title: "Invite Friends & Earn Rewards | GameEarn",
    description: "Get your GameEarn referral code and invite friends to earn a bonus once they complete their first verified offer.",
    path: "/referrals/",
    active: "rewards",
    noindex: true,
    content: referralsPage(DEMO_REFERRAL),
  })
);

/* ---------------- /login/ + /signup/ ---------------- */
write("login", layout({ title: "Log In | GameEarn", description: "Log in to your GameEarn account to track rewards, offers and your daily streak.", path: "/login/", noindex: true, content: loginPage() }));
write("signup", layout({ title: "Sign Up | GameEarn", description: "Create a free GameEarn account to track rewards, offers and your daily streak.", path: "/signup/", noindex: true, content: signupPage() }));

/* ---------------- /admin/ (UI mockup, not linked in main nav) ---------------- */
write("admin", layout({ title: "Admin Dashboard (Demo) | GameEarn", description: "Frontend architecture mockup for the GameEarn admin dashboard.", path: "/admin/", noindex: true, content: adminPage(games, offers) }));

/* ---------------- /search/ ---------------- */
write(
  "search",
  layout({
    title: "Search Games, Offers & Rewards | GameEarn",
    description: "Search GameEarn's full catalog of games and reward offers by name, category, provider or reward type.",
    path: "/search/",
    noindex: true,
    content: searchPage(games, offers),
  })
);

/* ---------------- static pages ---------------- */
write("about", layout({ title: "About GameEarn - Our Discovery Platform", description: "Learn what GameEarn is, how it works, and what it does and doesn't do as a games and reward discovery platform.", path: "/about/", content: aboutPage() }));
write("contact", layout({ title: "Contact GameEarn", description: "Get in touch with the GameEarn team about listings, corrections or suggestions.", path: "/contact/", content: contactPage() }));
write("privacy-policy", layout({ title: "Privacy Policy | GameEarn", description: "Read GameEarn's privacy policy covering how information is handled on this discovery platform.", path: "/privacy-policy/", content: privacyPage() }));
write("terms-and-conditions", layout({ title: "Terms & Conditions | GameEarn", description: "Read the terms and conditions for using GameEarn, including our no-guaranteed-earnings and no-gambling policy.", path: "/terms-and-conditions/", content: termsPage() }));
write("disclaimer", layout({ title: "Disclaimer | GameEarn", description: "GameEarn's disclaimer regarding reward guarantees, third-party offers, demo data and listing accuracy.", path: "/disclaimer/", content: disclaimerPage() }));

// 404 (written directly, excluded from sitemap)
fs.writeFileSync(path.join(OUT, "404.html"), layout({ title: "Page Not Found | GameEarn", description: "The page you're looking for doesn't exist.", path: "/404/", noindex: true, content: notFoundPage() }));

/* ---------------- sitemap.xml ---------------- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagesForSitemap.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join("\n")}
</urlset>`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);

/* ---------------- robots.txt ---------------- */
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

console.log(`Built ${pagesForSitemap.length} indexable pages (plus noindex account/demo pages) into ${OUT}`);
