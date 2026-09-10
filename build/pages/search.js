function searchPage(games) {
  const dataset = games.map((g) => ({
    name: g.name,
    slug: g.slug,
    category: g.category,
    genre: g.genre,
    developer: g.developer,
    rewardType: g.rewardType,
    platform: g.platform,
    rating: g.rating,
    freeToPlay: g.freeToPlay,
    description: g.description,
    image: g.image,
    icon: g.icon,
    newRelease: g.newRelease,
  }));

  return `
<section class="page-head">
  <div class="container">
    <h1>Search GameEarn</h1>
    <p class="page-intro">Search across every game and reward app by name, category, genre, developer or reward type.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="toolbar" role="search">
      <div class="search-field" style="flex:1 1 100%;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input type="search" id="siteSearchInput" placeholder="Try 'earning', 'racing', or a developer name..." autofocus />
      </div>
    </div>
    <div class="result-meta"><span class="result-count" id="searchResultCount">Type to search</span></div>
    <div class="grid" id="searchResults"></div>
    <div class="empty-state" id="searchEmptyState" style="display:none;">
      <h3>No games found</h3>
      <p>Try a different name, category or developer.</p>
    </div>
  </div>
</section>
<script id="site-dataset" type="application/json">${JSON.stringify(dataset)}</script>
`;
}

module.exports = { searchPage };
