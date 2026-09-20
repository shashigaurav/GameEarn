const { gameCard, breadcrumbs, faqList, notePanel } = require("../components");
const { CATEGORIES, PLATFORMS, REWARD_TYPES } = require("../../data/games");

/**
 * @param {object} opts
 * @param {string} opts.heading
 * @param {string} [opts.intro] - SEO-friendly intro paragraph(s), HTML allowed
 * @param {object[]} opts.games
 * @param {object[]} [opts.breadcrumbTrail]
 * @param {boolean} [opts.showCategoryFilter]
 * @param {boolean} [opts.showFilters]
 * @param {object[]} [opts.relatedCategories] - [{slug,name}]
 * @param {object[]} [opts.faq] - [{q,a}]
 * @param {string} [opts.note]
 */
function listingPage(opts) {
  const {
    heading,
    intro = "",
    games,
    breadcrumbTrail = null,
    showCategoryFilter = true,
    showFilters = true,
    relatedCategories = null,
    faq = null,
    note = null,
  } = opts;

  const genres = [...new Set(games.map((g) => g.genre))].sort();
  const rewardTypesPresent = REWARD_TYPES.filter((r) => games.some((g) => g.rewardType === r));

  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbTrail ? breadcrumbs(breadcrumbTrail) : ""}
    <h1>${heading}</h1>
    ${intro ? `<p class="page-intro">${intro}</p>` : ""}
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    ${
      showFilters
        ? `<div class="toolbar" role="search">
      <div class="search-field">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <label class="sr-only" for="gridSearch" style="position:absolute;left:-9999px;">Search games</label>
        <input type="search" id="gridSearch" placeholder="Search by name, developer or genre..." />
      </div>
      ${
        showCategoryFilter
          ? `<select class="filter-select" id="filterCategory" aria-label="Filter by category">
        <option value="">All Categories</option>
        ${CATEGORIES.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("")}
      </select>`
          : ""
      }
      <select class="filter-select" id="filterPlatform" aria-label="Filter by platform">
        <option value="">All Platforms</option>
        <option value="android">Android</option>
        <option value="ios">iOS</option>
        <option value="windows">Windows</option>
      </select>
      <select class="filter-select" id="filterReward" aria-label="Filter by bonus type">
        <option value="">All Bonus Types</option>
        ${rewardTypesPresent.map((r) => `<option value="${r.toLowerCase()}">${r}</option>`).join("")}
      </select>
      <select class="filter-select" id="filterGenre" aria-label="Filter by genre">
        <option value="">All Genres</option>
        ${genres.map((g) => `<option value="${g.toLowerCase()}">${g}</option>`).join("")}
      </select>
      <select class="filter-select" id="sortBy" aria-label="Sort games">
        <option value="popular">Sort by Popular</option>
        <option value="rating">Sort by Rating</option>
        <option value="newest">Sort by Newest</option>
      </select>
    </div>`
        : ""
    }

    <div class="result-meta">
      <span class="result-count" id="resultCount">${games.length} result${games.length === 1 ? "" : "s"}</span>
    </div>

    <div class="grid" id="gameGrid" data-page-size="12">
      ${games.map((g) => gameCard(g)).join("\n")}
    </div>

    <div class="empty-state" id="emptyState" style="display:none;">
      <h3>No games match your filters</h3>
      <p>Try clearing a filter or searching a different term.</p>
    </div>

    <div class="load-more-wrap" id="loadMoreWrap" style="display:none;">
      <button class="btn btn-ghost" id="loadMoreBtn">Load More</button>
    </div>

    ${note ? notePanel(note) : ""}
  </div>
</section>

${
  relatedCategories
    ? `<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Related Categories</h2></div></div>
    <div class="related-categories">
      ${relatedCategories.map((c) => `<a class="pill-link" href="/category/${c.slug}/">${c.name}</a>`).join("")}
    </div>
  </div>
</section>`
    : ""
}

${
  faq
    ? `<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Frequently Asked Questions</h2></div></div>
    ${faqList(faq)}
  </div>
</section>`
    : ""
}
`;
}

module.exports = { listingPage };
