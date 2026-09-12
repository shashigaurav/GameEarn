// api/home.js
// Renders "/" at request time. Everything except the games catalog is unchanged
// from the static build: offers/demo data still come from their local data files,
// only `games` is now fetched live from Supabase (published rows only).
const { layout } = require("../build/layout");
const { homePage } = require("../build/pages/home");
const { getPublishedGames } = require("../lib/gameQueries");
const { offers } = require("../data/offers");
const { SITE_NAME, SITE_URL } = require("../build/components");
const { errorPage } = require("../lib/errorPage");

module.exports = async function handler(req, res) {
  try {
    const games = await getPublishedGames();

    const html = layout({
      title: "GameEarn - Play Games, Complete Offers & Discover Rewards",
      description:
        "Discover verified games, tasks, surveys, app offers and cashback deals in one place. GameEarn helps you compare reward opportunities before you start — no betting, no gambling.",
      path: "/",
      active: "home",
      content: homePage(games, offers),
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
