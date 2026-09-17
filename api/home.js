// api/home.js
// Renders "/" at request time, reading the live `games` catalog from Supabase
// (published rows only). GameEarn is a pure games-discovery site.
const { layout } = require("../build/layout");
const { homePage } = require("../build/pages/home");
const { getPublishedGames } = require("../lib/gameQueries");
const { SITE_NAME, SITE_URL } = require("../build/components");
const { errorPage } = require("../lib/errorPage");

module.exports = async function handler(req, res) {
  try {
    const games = await getPublishedGames();

    const html = layout({
      title: "GameEarn - Discover Mobile Games",
      description:
        "Browse, search and filter mobile games across every genre. GameEarn links straight to each game's official source — no account needed.",
      path: "/",
      active: "home",
      content: homePage(games),
      jsonLd: [
        { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/assets/favicon.svg` },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search/?q={search_term_string}`, "query-input": "required name=search_term_string" },
        },
      ],
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  } catch (err) {
    console.error("home handler error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(errorPage(err));
  }
};
