const { trustCard, breadcrumbs, notePanel } = require("../components");

function rewardsPage() {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Rewards" }])}
    <h1>Rewards on GameEarn</h1>
    <p class="page-intro">Rewards come in a few different forms depending on the game or offer. Here's what each type means before you start one.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="grid">
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/></svg>', "Points", "In-platform points issued by a game or offer provider, often redeemable within that provider's own system.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg>', "Gift Cards", "Redeemable gift cards issued directly by the provider once reward thresholds are met.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1.2 1.3-2 3-2s3 .9 3 2.1c0 2.7-6 1.3-6 4 0 1.2 1.3 2.1 3 2.1s3-.9 3-2.1"/></svg>', "Cashback", "A percentage of a qualifying purchase credited back by the provider, on their own schedule.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.9 7.1 18.2l.9-5.5-4-3.9L9.5 8z"/></svg>', "Tournament Rewards", "Prizes tied to ranked leaderboard standings during a scheduled event window.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 12l2 2 4-4"/></svg>', "In-game Rewards", "Cosmetic items, currency or unlocks that stay inside a single game.")}
      ${trustCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M2.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6"/></svg>', "Referral Rewards", "A bonus some providers offer within their own app when you refer a friend — managed entirely by that provider, not by GameEarn.")}
    </div>
    ${notePanel("Reward availability, exact values and payout timing are set entirely by each provider and can change at any time. GameEarn does not guarantee any reward type listed above.")}
    <div class="cta-banner glass" style="margin-top:36px;">
      <h2>Ready to check one out?</h2>
      <p>Browse verified games and offers, then head to the official source when you're ready.</p>
      <div class="hero-actions">
        <a href="/games/" class="btn btn-primary">Browse Games</a>
        <a href="/offers/" class="btn btn-outline-blue">Browse Offers</a>
      </div>
    </div>
  </div>
</section>
`;
}

module.exports = { rewardsPage };
