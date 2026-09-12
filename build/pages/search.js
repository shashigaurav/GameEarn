function searchPage(offers) {
  // Games are no longer embedded at build time — they're fetched live from
  // Supabase in the browser (see js/search-live.js) so newly added/edited/
  // deleted games show up here without a rebuild. Offers stay local/static.
  const offerItems = offers.map((o) => ({
    type: "offer",
    name: o.title,
    slug: o.slug,
    category: o.category,
    genre: o.provider,
    developer: o.provider,
    rewardType: o.rewardRange,
    platform: "",
    rating: o.rating,
    freeToPlay: o.noCost,
    description: o.description,
    image: o.image,
    icon: o.icon,
    newRelease: o.newOffer,
  }));

  return `
<section class="page-head">
  <div class="container">
    <h1>Search GameEarn</h1>
    <p class="page-intro">Search across games, offers, rewards and categories by name, provider or reward type.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="toolbar" role="search">
      <div class="search-field" style="flex:1 1 100%;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input type="search" id="siteSearchInput" placeholder="Try 'earning', 'racing', 'cashback', or a provider name..." autofocus />
      </div>
    </div>
    <div class="result-meta"><span class="result-count" id="searchResultCount">Loading games…</span></div>
    <div class="grid" id="searchResults"></div>
    <div class="empty-state" id="searchEmptyState" style="display:none;">
      <h3>No results found</h3>
      <p>Try a different name, category or provider.</p>
    </div>
  </div>
</section>
<script id="site-dataset" type="application/json">${JSON.stringify(offerItems)}</script>
<script type="module" src="/js/search-live.js"></script>
`;
}

module.exports = { searchPage };
