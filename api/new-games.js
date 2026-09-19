const { layout } = require("../build/layout");
const { listingPage } = require("../build/pages/listing");
const { getPublishedGames } = require("../lib/gameQueries");
const { errorPage } = require("../lib/errorPage");
const { breadcrumbLd, itemListLd } = require("../lib/seo");

module.exports = async function handler(req, res) {
  try {
    const games = (await getPublishedGames())
      .filter((g) => g.newRelease)
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

    const html = layout({
      title: "New Games & Reward Apps | GameEarn",
      description: "Recently added games on GameEarn, updated regularly across every category.",
      path: "/new-games/",
      active: "games",
      content: listingPage({
        heading: "New Games",
        intro: "Freshly added titles across action, puzzle, racing, earning games and more.",
        games,
        breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "New Games" }],
      }),
      jsonLd: [
        breadcrumbLd([{ name: "Home", url: "/" }, { name: "New Games", url: "/new-games/" }]),
        itemListLd(games, "New Games — GameEarn"),
      ],
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  } catch (err) {
    console.error("new-games handler error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(errorPage(err));
  }
};
