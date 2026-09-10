// build/build.js
const fs = require("fs");
const path = require("path");
const { layout } = require("./layout");
const { games, CATEGORIES } = require("../data/games");
const { SITE_URL, SITE_NAME, categoryLabel } = require("./components");
const { homePage } = require("./pages/home");
const { listingPage } = require("./pages/listing");
const { detailPage } = require("./pages/detail");
const { searchPage } = require("./pages/search");
const { aboutPage, contactPage, privacyPage, termsPage, disclaimerPage, notFoundPage } = require("./pages/static");

const OUT = path.join(__dirname, "..", "public");
const pagesForSitemap = [];

function write(relPath, html) {
  const filePath = path.join(OUT, relPath, "index.html");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
  if (relPath !== "/404") pagesForSitemap.push(relPath === "" ? "/" : relPath + "/");
}

function relatedGamesFor(game, count = 4) {
  return games.filter((g) => g.slug !== game.slug && g.category === game.category).slice(0, count).concat(
    games.filter((g) => g.slug !== game.slug && g.category !== game.category)
  ).slice(0, count);
}

/* ---------------- homepage ---------------- */
write(
  "",
  layout({
    title: "GameEarn - Discover Earning Games, Reward Apps & Popular Games",
    description: "Explore gaming and reward apps, compare features, and find new ways to play and earn on GameEarn — a discovery platform for earning games, reward apps and popular titles.",
    path: "/",
    active: "home",
    content: homePage(games),
    jsonLd: [
      { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/assets/favicon.svg` },
      { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search/?q={search_term_string}`, "query-input": "required name=search_term_string" } },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          ["What is GameEarn?", "GameEarn is a discovery platform that helps you find gaming and reward apps, compare their features, and visit the official source to download or learn more."],
          ["How do earning games work?", "Earning games typically let you complete in-game activities, tasks or tournaments that contribute to points, gift cards or other rewards managed entirely by the game's developer."],
          ["Are rewards guaranteed?", "No. Reward availability varies by app, region and eligibility, and is controlled by each app's provider. GameEarn does not guarantee earnings or payouts."],
        ].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
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
      heading: "Explore Games",
      intro: "Browse every game and app on GameEarn. Use the filters below to narrow down by category, platform, reward type or genre, then visit any listing for full details before heading to the official source.",
      games,
      breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Games" }],
    }),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Games", url: "/games/" }])],
  })
);

/* ---------------- /earning-games/ ---------------- */
const earningGames = games.filter((g) => g.category === "earning-games" || g.category === "reward-apps" || g.rewardType !== "None");
write(
  "earning-games",
  layout({
    title: "Earning Games - Play & Discover Reward-Based Games | GameEarn",
    description: "Discover earning games and reward apps that pair regular play with points, gift cards, cashback or tournament rewards managed by each developer.",
    path: "/earning-games/",
    active: "earning-games",
    content: listingPage({
      heading: "Earning Games",
      intro: "Earning games pair everyday gameplay with a rewards program run by the developer — think points, gift cards, cashback or tournament prizes. Availability, eligibility and payout terms are always set by the individual app, so treat this list as a starting point for research, not a promise of income.",
      games: earningGames,
      breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Earning Games" }],
      note: "Reward availability varies by app, region and eligibility. Always check the provider's official terms before participating.",
      faq: [
        { q: "What counts as an earning game on GameEarn?", a: "Any game or app that runs its own points, gift card, cashback or tournament-reward program, as described by its developer." },
        { q: "Does GameEarn pay out rewards?", a: "No. GameEarn is a discovery platform only. All rewards are issued and managed directly by each app's provider." },
      ],
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
    active: "trending",
    content: listingPage({
      heading: "Trending Now",
      intro: "The games and reward apps generating the most interest on GameEarn this week.",
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
    description: "Recently added games and reward apps on GameEarn, updated regularly across every category.",
    path: "/new-games/",
    active: "new",
    content: listingPage({
      heading: "New Games",
      intro: "Freshly added titles across action, puzzle, racing, earning games and more.",
      games: newGames,
      breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "New Games" }],
    }),
    jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "New Games", url: "/new-games/" }])],
  })
);

/* ---------------- /category/<slug>/ ---------------- */
CATEGORIES.forEach((cat) => {
  const catGames = games.filter((g) => g.category === cat.slug);
  const related = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 5);
  write(
    `category/${cat.slug}`,
    layout({
      title: `${cat.name} Games & Apps | GameEarn`,
      description: `Browse ${cat.name} games and apps on GameEarn. ${cat.blurb}`,
      path: `/category/${cat.slug}/`,
      active: "categories",
      content: listingPage({
        heading: `${cat.name} Games`,
        intro: `${cat.blurb} Explore ${catGames.length} listing${catGames.length === 1 ? "" : "s"} below, or check related categories for more.`,
        games: catGames,
        breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Categories", href: "/category/" }, { label: cat.name }],
        showCategoryFilter: false,
        relatedCategories: related,
        faq: [
          { q: `What is included in the ${cat.name} category?`, a: `${cat.blurb}` },
          { q: `Are ${cat.name} games free to play?`, a: `Most listings in this category are free to play; each game page shows its free-to-play status and any reward information clearly.` },
        ],
      }),
      jsonLd: [breadcrumbLd([{ name: "Home", url: "/" }, { name: "Categories", url: "/category/" }, { name: cat.name, url: `/category/${cat.slug}/` }])],
    })
  );
});

// /category/ index — lists all categories
write(
  "category",
  layout({
    title: "Browse All Categories | GameEarn",
    description: "Browse every game and reward-app category on GameEarn, from earning games and reward apps to action, racing, puzzle and more.",
    path: "/category/",
    active: "categories",
    content: `
<section class="page-head"><div class="container">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span aria-current="page">Categories</span></nav>
  <h1>Browse All Categories</h1>
  <p class="page-intro">Jump straight into a category to see every matching game and app.</p>
</div></section>
<section class="section" style="padding-top:0;"><div class="container">
  <div class="grid grid-6">
    ${CATEGORIES.map((c) => {
      const count = games.filter((g) => g.category === c.slug).length;
      return `<a class="category-card" href="/category/${c.slug}/"><span class="cat-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F3F4F8" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg></span><h3>${c.name}</h3><span class="count">${count} game${count === 1 ? "" : "s"}</span></a>`;
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

/* ---------------- /search/ ---------------- */
write(
  "search",
  layout({
    title: "Search Games & Reward Apps | GameEarn",
    description: "Search GameEarn's full catalog of games and reward apps by name, category, genre or developer.",
    path: "/search/",
    noindex: true,
    content: searchPage(games),
  })
);

/* ---------------- static pages ---------------- */
write("about", layout({ title: "About GameEarn - Our Discovery Platform", description: "Learn what GameEarn is, how it works, and what it does and doesn't do as a gaming and reward-app discovery platform.", path: "/about/", content: aboutPage() }));
write("contact", layout({ title: "Contact GameEarn", description: "Get in touch with the GameEarn team about listings, corrections or suggestions.", path: "/contact/", content: contactPage() }));
write("privacy-policy", layout({ title: "Privacy Policy | GameEarn", description: "Read GameEarn's privacy policy covering how information is handled on this discovery platform.", path: "/privacy-policy/", content: privacyPage() }));
write("terms-and-conditions", layout({ title: "Terms & Conditions | GameEarn", description: "Read the terms and conditions for using GameEarn, including our no-guaranteed-earnings policy.", path: "/terms-and-conditions/", content: termsPage() }));
write("disclaimer", layout({ title: "Disclaimer | GameEarn", description: "GameEarn's disclaimer regarding reward guarantees, third-party apps and listing accuracy.", path: "/disclaimer/", content: disclaimerPage() }));

// 404 (written directly, excluded from sitemap)
fs.writeFileSync(path.join(OUT, "404.html"), layout({ title: "Page Not Found | GameEarn", description: "The page you're looking for doesn't exist.", path: "/404/", noindex: true, content: notFoundPage() }));

/* ---------------- sitemap.xml ---------------- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagesForSitemap
  .filter((p) => p !== "/search/")
  .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
  .join("\n")}
</urlset>`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);

/* ---------------- robots.txt ---------------- */
const robots = `User-agent: *
Allow: /
Disallow: /search/

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(OUT, "robots.txt"), robots);

function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.url}`,
    })),
  };
}

console.log(`Built ${pagesForSitemap.length} pages + sitemap.xml + robots.txt into ${OUT}`);
