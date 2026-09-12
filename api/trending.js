const { layout } = require("../build/layout");
const { listingPage } = require("../build/pages/listing");
const { getPublishedGames } = require("../lib/gameQueries");
const { errorPage } = require("../lib/errorPage");

module.exports = async function handler(req, res) {
  try {
    const games = (await getPublishedGames()).filter((g) => g.trending).sort((a, b) => b.rating - a.rating);

    const html = layout({
      title: "Trending Games & Reward Apps This Week | GameEarn",
      description: "See which games are trending on GameEarn right now, ranked by community activity.",
      path: "/trending/",
      active: "games",
      content: listingPage({
        heading: "Trending Now",
        intro: "The games generating the most interest on GameEarn this week.",
        games,
        breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Trending" }],
      }),
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  } catch (err) {
    console.error("trending handler error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(errorPage(err));
  }
};
