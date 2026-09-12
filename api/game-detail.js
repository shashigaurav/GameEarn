const { layout } = require("../build/layout");
const { detailPage } = require("../build/pages/detail");
const { notFoundPage } = require("../build/pages/static");
const { getGameBySlug, getPublishedGames } = require("../lib/gameQueries");
const { categoryLabel, SITE_URL } = require("../build/components");
const { errorPage } = require("../lib/errorPage");

module.exports = async function handler(req, res) {
  try {
    const slug = String(req.query.slug || "").trim();
    if (!slug) {
      res.status(400).send(errorPage("Missing slug", "Bad request"));
      return;
    }

    const game = await getGameBySlug(slug);

    if (!game) {
      // Covers: game doesn't exist, was deleted, or is currently a draft —
      // drafts must never be reachable on the public site.
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(404).send(
        layout({
          title: "Game Not Found | GameEarn",
          description: "The game you're looking for doesn't exist or is not currently published.",
          path: `/games/${slug}/`,
          noindex: true,
          content: notFoundPage(),
        })
      );
      return;
    }

    const allPublished = await getPublishedGames();
    const related = allPublished
      .filter((g) => g.slug !== game.slug && g.category === game.category)
      .slice(0, 4)
      .concat(allPublished.filter((g) => g.slug !== game.slug && g.category !== game.category))
      .slice(0, 4);

    const html = layout({
      title: `${game.name} - Rewards, Features & Details | GameEarn`,
      description: `Explore ${game.name}, including gameplay, rewards information, supported platforms, features and official source details on GameEarn.`,
      path: `/games/${game.slug}/`,
      ogImage: game.image,
      active: "games",
      content: detailPage(game, related),
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: categoryLabel(game.category), item: `${SITE_URL}/category/${game.category}/` },
            { "@type": "ListItem", position: 3, name: game.name, item: `${SITE_URL}/games/${game.slug}/` },
          ],
        },
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
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            [`Is ${game.name} free to play?`, game.freeToPlay ? `Yes, ${game.name} is free to play.` : `${game.name} is a paid title.`],
            [`What platforms is ${game.name} available on?`, `${game.name} is available on ${game.platform}.`],
          ].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        },
      ],
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  } catch (err) {
    console.error("game-detail handler error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(errorPage(err));
  }
};
