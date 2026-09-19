const { layout } = require("../build/layout");
const { listingPage } = require("../build/pages/listing");
const { getPublishedGames } = require("../lib/gameQueries");
const { errorPage } = require("../lib/errorPage");
const { breadcrumbLd, itemListLd } = require("../lib/seo");

module.exports = async function handler(req, res) {
  try {
    const games = (await getPublishedGames()).filter(
      (g) => g.category === "earning-games" || g.category === "reward-apps" || g.rewardType !== "None"
    );

    const html = layout({
      title: "Earning Games - Reward-Based Games | GameEarn",
      description: "Discover earning games and reward apps that pair regular play with points, gift cards, cashback or tournament rewards managed by each developer.",
      path: "/earning-games/",
      active: "games",
      content: listingPage({
        heading: "Earning Games",
        intro: "Earning games pair everyday gameplay with a rewards program run by the developer — think points, gift cards, cashback or tournament prizes. Availability, eligibility and payout terms are always set by the individual app.",
        games,
        breadcrumbTrail: [{ label: "Home", href: "/" }, { label: "Earning Games" }],
        note: "Reward availability varies by app, region and eligibility. Always check the provider's official terms before participating.",
      }),
      jsonLd: [
        breadcrumbLd([{ name: "Home", url: "/" }, { name: "Earning Games", url: "/earning-games/" }]),
        itemListLd(games, "Earning Games — GameEarn"),
      ],
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  } catch (err) {
    console.error("earning-games handler error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(errorPage(err));
  }
};
