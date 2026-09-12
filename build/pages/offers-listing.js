const { offerCard, breadcrumbs, faqList, notePanel } = require("../components");
const { OFFER_CATEGORIES } = require("../../data/offers");

function offersListingPage(offers) {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Offers" }])}
    <h1>Explore Offers</h1>
    <p class="page-intro">Verified tasks, surveys, app offers and cashback deals from named providers. Every listing shows a trust score, reward range and last-verified date so you can decide before you start.</p>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="toolbar" role="search">
      <div class="search-field">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input type="search" id="offerSearch" placeholder="Search offers by title or provider..." />
      </div>
      <select class="filter-select" id="offerCategoryFilter" aria-label="Filter by category">
        <option value="">All Categories</option>
        ${OFFER_CATEGORIES.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("")}
      </select>
      <select class="filter-select" id="offerDifficultyFilter" aria-label="Filter by difficulty">
        <option value="">Any Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <select class="filter-select" id="offerSort" aria-label="Sort offers">
        <option value="newest">Sort by Newest</option>
        <option value="rating">Sort by Rating</option>
        <option value="reward">Sort by Highest Reward</option>
      </select>
    </div>
    <div class="filter-pills" id="offerPills" style="margin-bottom:22px;">
      <button class="filter-pill active" data-pill="all">All</button>
      <button class="filter-pill" data-pill="nocost">No-cost</button>
      <button class="filter-pill" data-pill="easy">Easy</button>
      <button class="filter-pill" data-pill="tasks">Tasks</button>
      <button class="filter-pill" data-pill="surveys">Surveys</button>
      <button class="filter-pill" data-pill="app-offers">App Offers</button>
      <button class="filter-pill" data-pill="cashback">Cashback</button>
    </div>

    <div class="result-meta"><span class="result-count" id="offerResultCount">${offers.length} results</span></div>

    <div class="grid" id="offerGrid" data-page-size="12">
      ${offers.map(offerCard).join("\n")}
    </div>

    <div class="empty-state" id="offerEmptyState" style="display:none;">
      <h3>No offers match your filters</h3>
      <p>Try clearing a filter or a different search term.</p>
    </div>

    <div class="load-more-wrap" id="offerLoadMoreWrap" style="display:none;">
      <button class="btn btn-ghost" id="offerLoadMoreBtn">Load More</button>
    </div>

    ${notePanel("Reward ranges are set by each provider and are not guaranteed. Always confirm current terms on the offer's detail page before starting.")}
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Frequently Asked Questions</h2></div></div>
    ${faqList([
      { q: "What does 'Verified' mean on an offer?", a: "A verified badge means GameEarn has checked that the offer's terms are published and current as of its last-verified date. It does not guarantee you'll receive the reward." },
      { q: "What does the Trust Score measure?", a: "Trust Score reflects how consistently a provider's terms have matched what's actually delivered in past verification checks. It's informational, not a guarantee." },
      { q: "Are any of these offers gambling or betting?", a: "No. GameEarn does not list gambling, betting or casino-style wagering offers of any kind." },
    ])}
  </div>
</section>
`;
}

module.exports = { offersListingPage };
