const { layout } = require("../build/layout");
const { getPublishedGames } = require("../lib/gameQueries");
const { CATEGORIES } = require("../data/games");
const { errorPage } = require("../lib/errorPage");
const { breadcrumbLd } = require("../lib/seo");

module.exports = async function handler(req, res) {
  try {
    const games = await getPublishedGames();

    const html = layout({
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
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(html);
  } catch (err) {
    console.error("categories handler error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(errorPage(err));
  }
};
