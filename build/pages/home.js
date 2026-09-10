const {
  gameCard,
  featuredCard,
  categoryCard,
  featureCard,
  faqList,
  notePanel,
} = require("../components");
const { CATEGORIES } = require("../../data/games");

function homePage(games) {
  const featured = games.filter((g) => g.featured).slice(0, 6);
  const trending = games.filter((g) => g.trending).sort((a, b) => b.rating - a.rating).slice(0, 5);
  const earning = games.filter((g) => g.category === "earning-games" || g.rewardType !== "None").slice(0, 8);
  const newest = [...games].filter((g) => g.newRelease).sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 4);
  const topRated = [...games].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const catCounts = CATEGORIES.map((c) => ({ ...c, count: games.filter((g) => g.category === c.slug).length }));

  return `
<section class="hero">
  <div class="container">
    <div class="hero-copy">
      <span class="eyebrow-tag"><span class="dot"></span> 28+ games &amp; reward apps to discover</span>
      <h1>Discover Games That Reward You</h1>
      <p class="lede">Explore gaming and reward apps, compare features, and find new ways to play and earn.</p>
      <div class="hero-actions">
        <a href="/earning-games/" class="btn btn-gold">Explore Earning Games</a>
        <a href="/games/" class="btn btn-ghost">Browse All Games</a>
      </div>
      <p class="hero-disclaimer">Reward availability varies by app, region and eligibility. GameEarn is a discovery platform — always check the provider's official terms.</p>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="hero-card-stack">
        <div class="floating-card card-1">
          <div class="fc-top"><img src="${featured[0]?.icon || "/assets/games/coindash-runner-icon.svg"}" alt="" /><div><div class="fc-name">${featured[0]?.name || "CoinDash Runner"}</div><div class="fc-meta">Points &middot; 4.3★</div></div></div>
        </div>
        <div class="floating-card card-2">
          <div class="fc-top"><img src="${featured[1]?.icon || "/assets/games/trivia-vault-icon.svg"}" alt="" /><div><div class="fc-name">${featured[1]?.name || "Trivia Vault"}</div><div class="fc-meta">Gift Cards &middot; 4.1★</div></div></div>
        </div>
        <div class="floating-card card-3">
          <div class="fc-top"><img src="${featured[2]?.icon || "/assets/games/blade-reckoning-icon.svg"}" alt="" /><div><div class="fc-name">${featured[2]?.name || "Blade Reckoning"}</div><div class="fc-meta">Action &middot; 4.6★</div></div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <div><h2>Featured Earning Games</h2><p>A hand-picked mix of games and apps that pair play with a rewards program.</p></div>
      <a class="section-link" href="/earning-games/">View all earning games &rarr;</a>
    </div>
    <div class="grid grid-6">
      ${featured.map(featuredCard).join("\n")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head">
      <div><h2>Trending This Week</h2><p>Ranked by community activity across the platform.</p></div>
      <a class="section-link" href="/trending/">See full trending list &rarr;</a>
    </div>
    <div class="grid">
      ${trending.map((g, i) => gameCard(g, { rank: i + 1 })).join("\n")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head">
      <div><h2>Popular Earning Games</h2><p>Filter by how each app works before you check it out.</p></div>
      <a class="section-link" href="/earning-games/">Browse earning games &rarr;</a>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px;">
      <span class="badge">Free to Play</span>
      <span class="badge badge-reward">Reward Games</span>
      <span class="badge">Tournament</span>
      <span class="badge">Multiplayer</span>
      <span class="badge">Casual</span>
    </div>
    <div class="grid">
      ${earning.slice(0, 8).map((g) => gameCard(g)).join("\n")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head">
      <div><h2>Browse by Category</h2><p>From earning games to classic genres — jump straight to what you're after.</p></div>
    </div>
    <div class="grid grid-6">
      ${catCounts.map((c) => categoryCard(c, c.count)).join("\n")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head">
      <div><h2>New Games</h2><p>Freshly added to the platform.</p></div>
      <a class="section-link" href="/new-games/">See all new games &rarr;</a>
    </div>
    <div class="grid">
      ${newest.map((g) => gameCard(g)).join("\n")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head">
      <div><h2>Top Rated</h2><p>The highest-rated titles across every category.</p></div>
    </div>
    <div class="grid">
      ${topRated.map((g) => gameCard(g)).join("\n")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>How It Works</h2><p>GameEarn helps you discover and understand apps — the rest happens on the provider's side.</p></div></div>
    <div class="steps">
      <div class="step"><span class="step-num">1</span><h3>Discover</h3><p>Browse games and reward apps by category, platform or reward type.</p></div>
      <div class="step"><span class="step-num">2</span><h3>Check Details</h3><p>Review ratings, features, reward information and requirements on each game page.</p></div>
      <div class="step"><span class="step-num">3</span><h3>Visit Official Source</h3><p>Head to the developer's official page to download and see the current, authoritative terms.</p></div>
    </div>
    ${notePanel("GameEarn helps users discover apps and games. The actual rewards, eligibility and terms are controlled by the respective game or app provider, not by GameEarn.")}
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Why GameEarn</h2><p>Built to make discovery easy, not to make promises about earnings.</p></div></div>
    <div class="grid">
      ${featureCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 9l6-1z"/></svg>', "Discover Reward Games", "Explore a growing library of earning games and reward apps in one place.")}
      ${featureCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>', "Compare Game Information", "See ratings, platforms and reward types side by side before you decide.")}
      ${featureCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>', "Find New Games", "New titles and reward apps are added regularly across every category.")}
      ${featureCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6h16M4 12h16M4 18h10"/></svg>', "Easy Navigation", "Search, filter and browse by category, platform or reward type in seconds.")}
      ${featureCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>', "Mobile Friendly", "A fast, responsive layout built for browsing on your phone.")}
      ${featureCard('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4v16h16"/><path d="M8 15l3-4 3 3 4-6"/></svg>', "Updated Listings", "Game details and categories are reviewed and refreshed regularly.")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Frequently Asked Questions</h2></div></div>
    ${faqList([
      { q: "What is GameEarn?", a: "GameEarn is a discovery platform that helps you find gaming and reward apps, compare their features, and visit the official source to download or learn more." },
      { q: "How do earning games work?", a: "Earning games typically let you complete in-game activities, tasks or tournaments that contribute to points, gift cards or other rewards managed entirely by the game's developer." },
      { q: "Are rewards guaranteed?", a: "No. Reward availability varies by app, region and eligibility, and is controlled by each app's provider. GameEarn does not guarantee earnings or payouts." },
      { q: "How do I download a game?", a: "Each game page includes a link to visit the official source or download page maintained by the developer. GameEarn does not host installation files." },
      { q: "Are all games free?", a: "Most listed games are free to play, though some are paid titles. Each game page shows its free-to-play status clearly." },
      { q: "How do I know whether a game supports my device?", a: "Every game page lists supported platforms (Android, iOS or Windows). Check the official source page for exact device requirements." },
    ])}
  </div>
</section>
`;
}

module.exports = { homePage };
