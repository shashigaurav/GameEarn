const { getPublishedGames } = require("../lib/gameQueries");
const { SITE_URL } = require("../build/components");
const { CATEGORIES } = require("../data/games");

const STATIC_PATHS = [
  "/",
  "/games/",
  "/earning-games/",
  "/trending/",
  "/new-games/",
  "/category/",
  "/about/",
  "/contact/",
  "/privacy-policy/",
  "/terms-and-conditions/",
  "/disclaimer/",
];

module.exports = async function handler(req, res) {
  try {
    const games = await getPublishedGames();

    const urls = [
      ...STATIC_PATHS,
      ...CATEGORIES.map((c) => `/category/${c.slug}/`),
      ...games.map((g) => `/games/${g.slug}/`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    res.status(200).send(xml);
  } catch (err) {
    console.error("sitemap handler error:", err);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
};
