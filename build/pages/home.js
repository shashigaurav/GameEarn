const {
  gameCard,
  offerCard,
  categoryCard,
  featureCard,
  earnCard,
  trustCard,
  faqList,
  notePanel,
  demoBanner,
  statCard,
  leaderboardRow,
} = require("../components");
const { CATEGORIES } = require("../../data/games");
const { DEMO_LEADERBOARD, DEMO_DASHBOARD, WAYS_TO_EARN } = require("../../data/demo");

const EARN_ICONS = {
  games: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="10" rx="4"/><circle cx="8.5" cy="13" r="1.2"/><circle cx="16" cy="12.5" r="1"/><circle cx="18" cy="14.5" r="1"/></svg>',
  tasks: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l2 2 4-4"/><rect x="4" y="4" width="16" height="16" rx="4"/></svg>',
  surveys: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  "app-offers": '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></svg>',
  cashback: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1.2 1.3-2 3-2s3 .9 3 2.1c0 2.7-6 1.3-6 4 0 1.2 1.3 2.1 3 2.1s3-.9 3-2.1"/></svg>',
  referral: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M2.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6M14.5 14.5c2.6.2 4.5 2.5 4.5 5.5"/></svg>',
  daily: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.9 7.1 18.2l.9-5.5-4-3.9L9.5 8z"/></svg>',
  quizzes: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.7-2.5 1.8-2.5 3.5M12 17h.01"/></svg>',
};

function homePage(games, offers) {
  const featuredOffers = offers.filter((o) => o.featured).slice(0, 6);
  const popularGames = [...games].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const topLeaders = DEMO_LEADERBOARD.slice(0, 5);

  const catCounts = CATEGORIES.map((c) => ({ ...c, count: games.filter((g) => g.category === c.slug).length }));

  return `
<section class="hero">
  <div class="container">
    <div class="hero-copy">
      <span class="eyebrow-tag"><span class="dot"></span> Verified games, tasks &amp; reward opportunities</span>
      <h1>Play. Complete. <span class="accent">Earn Rewards.</span></h1>
      <p class="lede">Discover verified games, tasks and reward opportunities in one place.</p>
      <div class="hero-actions">
        <a href="/earn/" class="btn btn-primary">Start Earning</a>
        <a href="/games/" class="btn btn-ghost">Explore Games</a>
      </div>
      <p class="hero-disclaimer">Reward availability varies by app, region and eligibility. GameEarn does not guarantee income — always check a provider's official terms.</p>
      <div class="hero-stats">
        <div class="stat"><b>${games.length + offers.length}+</b><span>Games &amp; offers listed</span></div>
        <div class="stat"><b>${offers.filter((o) => o.verified).length}</b><span>Verified opportunities</span></div>
        <div class="stat"><b>${CATEGORIES.length}</b><span>Categories</span></div>
      </div>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="hero-orb"></div>
      <div class="hero-card-stack">
        <div class="floating-card glass card-1">
          <div class="fc-top"><img src="${featuredOffers[0]?.icon || "/assets/offers/dailyquest-app-install-icon.svg"}" alt="" /><div><div class="fc-name">${featuredOffers[0]?.title.slice(0, 22) || "DailyQuest"}</div><div class="fc-meta">${featuredOffers[0]?.rewardRange || "Verified offer"}</div></div></div>
        </div>
        <div class="floating-card glass card-2">
          <div class="fc-top"><img src="${popularGames[0]?.icon}" alt="" /><div><div class="fc-name">${popularGames[0]?.name}</div><div class="fc-meta">${popularGames[0]?.rating.toFixed(1)}★ &middot; ${popularGames[0]?.rewardType}</div></div></div>
        </div>
        <div class="floating-card glass card-3">
          <div class="fc-top"><img src="${featuredOffers[1]?.icon || "/assets/offers/fittrack-7-day-trial-icon.svg"}" alt="" /><div><div class="fc-name">${featuredOffers[1]?.title.slice(0, 22) || "FitTrack Challenge"}</div><div class="fc-meta">${featuredOffers[1]?.rewardRange || "Verified offer"}</div></div></div>
        </div>
        <div class="floating-coin c1">pts</div>
        <div class="floating-coin c2">+30</div>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head">
      <div><h2>🔥 Featured Opportunities</h2><p>Verified tasks, surveys and app offers worth checking out this week.</p></div>
      <a class="section-link" href="/offers/">View all offers &rarr;</a>
    </div>
    <div class="grid grid-6">
      ${featuredOffers.map(offerCard).join("\n")}
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

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>💰 Ways To Earn</h2><p>Every path to a reward on GameEarn, in one place.</p></div></div>
    <div class="grid grid-8">
      ${WAYS_TO_EARN.map((w) => earnCard(EARN_ICONS[w.key], w.title, w.desc, w.href, w.cta)).join("\n")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Your Reward Dashboard</h2><p>A live look at your rewards once you're signed in.</p></div><a class="section-link" href="/dashboard/">Open full dashboard &rarr;</a></div>
    ${demoBanner("Demo data shown below — sign in and connect a backend to see your real numbers.")}
    <div class="dashboard-grid">
      ${statCard("Total Rewards", DEMO_DASHBOARD.totalRewards, "green", DEMO_DASHBOARD.unit)}
      ${statCard("Available", DEMO_DASHBOARD.availableRewards, "blue", DEMO_DASHBOARD.unit)}
      ${statCard("Pending", DEMO_DASHBOARD.pendingRewards, "gold", DEMO_DASHBOARD.unit)}
      ${statCard("Completed Tasks", DEMO_DASHBOARD.completedTasks, "violet", "tasks")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>🏆 Top Reward Earners</h2><p>This week's leaderboard, ranked by points.</p></div><a class="section-link" href="/leaderboard/">View full leaderboard &rarr;</a></div>
    ${demoBanner("Demo leaderboard — connects to real accounts once a backend is added.")}
    <div class="leaderboard-wrap glass">
      <table class="leaderboard-table">
        <thead><tr><th>Rank</th><th>Player</th><th>Points</th><th>Level</th></tr></thead>
        <tbody>${topLeaders.map(leaderboardRow).join("")}</tbody>
      </table>
    </div>
  </div>
</section>

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
    <div class="section-head"><div><h2>Why GameEarn?</h2><p>Built on transparency, not promises.</p></div></div>
    <div class="grid">
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>', "Verified Opportunities", "Offers are reviewed and marked with a trust score before they're featured.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8M8 16h5"/></svg>', "Transparent Reward Terms", "Every listing shows reward range, eligibility and requirements up front.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>', "No Hidden Fees", "GameEarn never charges to browse, discover or start an offer.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>', "Clear Eligibility", "Region, device and account requirements are listed on every offer page.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>', "Provider Information", "We name the actual provider behind every game and offer, not just GameEarn.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>', "Last Verified Date", "Every offer shows the date its terms were last checked.")}
    </div>
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>How It Works</h2><p>GameEarn helps you discover and verify — the reward itself comes from the provider.</p></div><a class="section-link" href="/how-it-works/">Full walkthrough &rarr;</a></div>
    <div class="steps">
      <div class="step glass"><span class="step-num">1</span><h3>Discover</h3><p>Browse games, tasks, surveys, app offers and cashback deals in one place.</p></div>
      <div class="step glass"><span class="step-num">2</span><h3>Check Details</h3><p>Review reward range, eligibility, requirements and trust score before you start.</p></div>
      <div class="step glass"><span class="step-num">3</span><h3>Complete &amp; Track</h3><p>Complete the offer with its provider, then track progress in your dashboard.</p></div>
    </div>
    ${notePanel("GameEarn helps you discover and evaluate opportunities. Rewards, eligibility and payout terms are controlled entirely by each game or offer provider, not by GameEarn.")}
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Frequently Asked Questions</h2></div></div>
    ${faqList([
      { q: "What is GameEarn?", a: "GameEarn is a discovery platform that helps you find verified games, tasks, surveys, app offers and cashback deals, and understand their reward terms before you start." },
      { q: "Are rewards guaranteed?", a: "No. Reward availability varies by provider, region and eligibility. GameEarn does not guarantee earnings, payouts or rankings." },
      { q: "Does GameEarn involve betting or gambling?", a: "No. GameEarn does not offer betting, gambling, casino wagering, deposits or real-money gaming of any kind." },
      { q: "Is the dashboard data real?", a: "Not yet on this version of the site — dashboard, leaderboard and profile numbers are clearly marked demo data until a backend and accounts are connected." },
      { q: "How do I start earning?", a: "Browse Games or Offers, check an item's details and requirements, then use the official CTA to start it with the provider directly." },
    ])}
  </div>
</section>

<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="cta-banner glass">
      <h2>Ready to start discovering rewards?</h2>
      <p>Browse verified games and offers, check the details, and head to the official source when you're ready.</p>
      <div class="hero-actions">
        <a href="/games/" class="btn btn-primary">Explore Games</a>
        <a href="/offers/" class="btn btn-outline-blue">Browse Offers</a>
      </div>
    </div>
  </div>
</section>
`;
}

module.exports = { homePage };
