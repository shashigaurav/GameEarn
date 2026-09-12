const { layout } = require("../build/layout");
const { listingPage } = require("../build/pages/listing");
const { getPublishedGames } = require("../lib/gameQueries");
const { CATEGORIES } = require("../data/games");
const { errorPage } = require("../lib/errorPage");
const { notFoundPage } = require("../build/pages/static");

module.exports = async function handler(req, res) {
  try {
    const slug = String(req.query.slug || "").trim();
    const cat = CATEGORIES.find((c) => c.slug === slug);

    if (!cat) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(404).send(
        layout({ title: "Category Not Found | GameEarn", description: "This category doesn't exist.", path: `/category/${slug}/`, noindex: true, content: notFoundPage() })
      );
      return;
    }

    const games = await getPublishedGames();
    const catGames = games.filter((g) => g.category === cat.slug);
    const related = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 5);

    const html = layout({
      title: `${cat.name} Games & Apps | GameEarn`,
      description: `Browse ${cat.name} games on GameEarn. ${cat.blurb}`,
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
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  } catch (err) {
    console.error("category handler error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(errorPage(err));
  }
};
