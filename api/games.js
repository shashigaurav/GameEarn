const { layout } = require("../build/layout");
const { listingPage } = require("../build/pages/listing");
const { getPublishedGames } = require("../lib/gameQueries");
const { errorPage } = require("../lib/errorPage");

module.exports = async function handler(req, res) {
  try {
    const games = await getPublishedGames();

    const html = layout({
      title: "Explore Games - Action, Racing, Puzzle & More | GameEarn",
      description:
        "Browse the full GameEarn library of games. Filter by category, platform, reward type and genre, then sort by popularity, rating or release date.",
      path: "/games/",
      active: "games",
      content: listingPage({
        heading: "Popular Games",
        intro:
          "Browse every published game on GameEarn. Use the filters below to narrow down by category, platform, reward type or genre, then visit any listing for full details before heading to the official source.",
        games,
        breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Games" }],
      }),
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  } catch (err) {
    console.error("games handler error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(errorPage(err));
  }
};
