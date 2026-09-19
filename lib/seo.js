// lib/seo.js
// Shared structured-data builders for the /api serverless pages, so every
// listing and detail page emits consistent, valid schema.org JSON-LD.
const { SITE_URL } = require("../build/components");

/** items: [{ name, url }] — url is root-relative, e.g. "/games/" */
function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.url}`,
    })),
  };
}

/**
 * Represents a listing page's games as an ItemList — helps search engines
 * understand the page is a curated collection rather than a single article.
 * Capped at 30 entries: ItemList is meant to signal page structure, not
 * duplicate the entire sitemap.
 */
function itemListLd(games, listName) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: games.slice(0, 30).map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/games/${g.slug}/`,
      name: g.name,
    })),
  };
}

module.exports = { breadcrumbLd, itemListLd };
