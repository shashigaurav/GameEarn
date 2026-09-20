const {
  gameCard,
  categoryCard,
  trustCard,
  faqList,
  notePanel,
  esc,
} = require("../components");
const { CATEGORIES } = require("../../data/games");

function homePage(games, { telegramUrl = null } = {}) {
  const popularGames = [...games].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const trendingGames = games.filter((g) => g.trending).slice(0, 3);
  const newGames = [...games].filter((g) => g.newRelease).slice(0, 4);

  const catCounts = CATEGORIES.map((c) => ({ ...c, count: games.filter((g) => g.category === c.slug).length }));

  return `
<section class="hero">
  <div class="container">
    <div class="hero-copy">
      <span class="eyebrow-tag"><span class="dot"></span> A daily-updated shelf of mobile games</span>
      <h1>Discover Games <span class="accent">Worth Playing.</span></h1>
      <p class="lede">Browse, search and filter mobile games across every genre — then head straight to the official source to download.</p>
      <div class="hero-actions">
        <a href="/games/" class="btn btn-primary">Explore Games</a>
        <a href="/trending/" class="btn btn-ghost">See What's Trending</a>
      </div>
      <p class="hero-disclaimer">Any reward information shown on a game page is descriptive only and set by that game's developer — GameEarn does not guarantee earnings.</p>
      <div class="hero-stats">
        <div class="stat"><b>${games.length}+</b><span>Games listed</span></div>
        <div class="stat"><b>${CATEGORIES.length}</b><span>Categories</span></div>
        <div class="stat"><b>${newGames.length}</b><span>New this week</span></div>
      </div>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="hero-orb"></div>
      <div class="hero-card-stack">
        <div class="floating-card glass card-1">
          <div class="fc-top"><img src="${popularGames[0]?.icon}" alt="" /><div><div class="fc-name">${popularGames[0]?.name}</div><div class="fc-meta">${popularGames[0]?.rating.toFixed(1)}★ &middot; ${popularGames[0]?.genre}</div></div></div>
        </div>
        <div class="floating-card glass card-2">
          <div class="fc-top"><img src="${popularGames[1]?.icon}" alt="" /><div><div class="fc-name">${popularGames[1]?.name}</div><div class="fc-meta">${popularGames[1]?.rating.toFixed(1)}★ &middot; ${popularGames[1]?.genre}</div></div></div>
        </div>
        <div class="floating-card glass card-3">
          <div class="fc-top"><img src="${popularGames[2]?.icon}" alt="" /><div><div class="fc-name">${popularGames[2]?.name}</div><div class="fc-meta">${popularGames[2]?.rating.toFixed(1)}★ &middot; ${popularGames[2]?.genre}</div></div></div>
        </div>
        <div class="floating-coin c1">★</div>
        <div class="floating-coin c2">New</div>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head">
      <div><h2>🎮 Popular Games</h2><p>Top-rated games across action, puzzle, racing and more.</p></div>
      <a class="section-link" href="/games/">Browse all games &rarr;</a>
    </div>
    <div class="grid">
      ${popularGames.map((g) => gameCard(g)).join("\n")}
    </div>
  </div>
</section>

${
  trendingGames.length
    ? `<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head">
      <div><h2>🔥 Trending Now</h2><p>What players are checking out this week.</p></div>
      <a class="section-link" href="/trending/">See full trending list &rarr;</a>
    </div>
    <div class="grid">
      ${trendingGames.map((g) => gameCard(g)).join("\n")}
    </div>
  </div>
</section>`
    : ""
}

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Browse by Category</h2><p>Jump straight into a genre you enjoy.</p></div></div>
    <div class="grid grid-6">
      ${catCounts.map((c) => categoryCard(c, c.count)).join("\n")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Why GameEarn?</h2><p>Built for finding games quickly, without the clutter.</p></div></div>
    <div class="grid">
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>', "Curated Listings", "Every game shown here has a full details page — genre, rating, platform, size and more.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>', "No Hidden Fees", "GameEarn never charges to browse, search or discover a game.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>', "Straight to the Source", "Every download button links directly to the game's official page — nothing hosted here.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>', "Fresh Additions", "New games and trending titles are added and refreshed regularly.")}
    </div>
  </div>
</section>

<section class="marquee-section" aria-label="Game categories on GameEarn">
  <div class="marquee-track">
    <div class="marquee-content">
      ${CATEGORIES.map((c) => `<a href="/category/${c.slug}/" class="marquee-pill">${c.name}</a>`).join("")}
    </div>
    <div class="marquee-content" aria-hidden="true">
      ${CATEGORIES.map((c) => `<a href="/category/${c.slug}/" class="marquee-pill" tabindex="-1">${c.name}</a>`).join("")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>How It Works</h2><p>Three steps between you and your next game.</p></div></div>
    <div class="steps">
      <div class="step glass"><span class="step-num">1</span><h3>Browse or Search</h3><p>Explore by category, check what's trending, or search for a game by name.</p></div>
      <div class="step glass"><span class="step-num">2</span><h3>Check the Details</h3><p>Every game page shows genre, rating, platform, size, screenshots and more.</p></div>
      <div class="step glass"><span class="step-num">3</span><h3>Download or Play</h3><p>Click through to the game's official source — no account or sign-in needed.</p></div>
    </div>
    ${notePanel("GameEarn is a discovery platform. It doesn't develop, publish or host the games listed — clicking through takes you straight to the developer's own page.")}
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Frequently Asked Questions</h2></div></div>
    ${faqList([
      { q: "What is GameEarn?", a: "GameEarn is a discovery platform that helps you find mobile games by genre, rating and platform, then takes you straight to the official source to download." },
      { q: "Do I need an account?", a: "No. GameEarn requires no signup or login to browse, search or open any game's details." },
      { q: "Where do downloads happen?", a: "GameEarn doesn't host any files. Every download button links directly to the game's own official page." },
      { q: "How often are new games added?", a: "New and trending titles are refreshed regularly — check the New and Trending pages for the latest additions." },
    ])}
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="seo-content prose">
      <h2>GameEarn — Discover Games, Apps &amp; Reward Opportunities</h2>
      <p>GameEarn helps you discover games, apps and reward opportunities in one place. Explore game information, categories, trending titles and newly added apps, then visit the official source when you are ready to learn more or download.</p>
      <p>Every listing is organized into clear categories — from casual and puzzle games to earning games that run their own in-app reward programs — so you can browse gaming apps by exactly the kind of experience you're after. The Trending and New Games pages make game discovery easier by surfacing what's picking up attention right now or has just been added, without digging through a cluttered app store.</p>
      <p>Reward information shown on a game's page, where applicable, is descriptive only and set entirely by that game's developer — it can vary by app, region and eligibility, and GameEarn does not guarantee any outcome. Always review the official source and its current terms before downloading or using an app.</p>
    </div>
  </div>
</section>

${
  telegramUrl
    ? `<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="telegram-cta glass">
      <div>
        <h2>Join GameEarn on Telegram</h2>
        <p>Get notified when new and trending games are added.</p>
      </div>
      <a href="${esc(telegramUrl)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Join Telegram</a>
    </div>
  </div>
</section>`
    : ""
}

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="homepage-utility-row">
      <div class="utility-block">
        <span class="utility-label">Language</span>
        <button class="lang-pill" id="langPillBtn" type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z"/></svg>
          English
        </button>
      </div>
      <div class="utility-block">
        <span class="utility-label">Share GameEarn</span>
        <button class="btn btn-ghost btn-sm" id="shareSiteBtn" type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-3.9M8.6 13.5l6.8 3.9"/></svg>
          Share
        </button>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="cta-banner glass">
      <h2>Ready to find your next game?</h2>
      <p>Browse the full catalog or jump straight into what's trending this week.</p>
      <div class="hero-actions">
        <a href="/games/" class="btn btn-primary">Explore Games</a>
        <a href="/search/" class="btn btn-outline-blue">Search Games</a>
      </div>
    </div>
  </div>
</section>
`;
}

module.exports = { homePage };
