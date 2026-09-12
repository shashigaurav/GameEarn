const { breadcrumbs, faqList, notePanel } = require("../components");

function howItWorksPage() {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "How It Works" }])}
    <h1>How GameEarn Works</h1>
    <p class="page-intro">GameEarn is a discovery and verification layer sitting in front of games and reward opportunities run by other providers. Here's exactly what happens at each step.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="steps">
      <div class="step glass"><span class="step-num">1</span><h3>Discover</h3><p>Browse games and offers by category, difficulty, reward type or platform. Use search or filters to narrow things down.</p></div>
      <div class="step glass"><span class="step-num">2</span><h3>Check Details</h3><p>Every listing shows reward range, eligibility, requirements, a trust score and the date its terms were last verified.</p></div>
      <div class="step glass"><span class="step-num">3</span><h3>Start With the Provider</h3><p>The "Start Offer" or "Play / View Offer" button takes you to the actual game or provider. Completion and rewards happen on their platform.</p></div>
      <div class="step glass"><span class="step-num">4</span><h3>Track Progress</h3><p>Once accounts are connected, your dashboard reflects completed offers, pending rewards and your daily streak.</p></div>
      <div class="step glass"><span class="step-num">5</span><h3>Redeem or Withdraw</h3><p>Redemption and withdrawal are handled by the reward provider (or a connected payments system in a future version) under their own terms.</p></div>
      <div class="step glass"><span class="step-num">6</span><h3>Refer Friends</h3><p>Share your referral link — when a friend completes their first verified offer, you can both become eligible for a bonus.</p></div>
    </div>
    ${notePanel("GameEarn does not develop, publish or control the games and offers listed, and does not guarantee any reward. We do not offer betting, gambling or casino-style wagering of any kind.")}
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Frequently Asked Questions</h2></div></div>
    ${faqList([
      { q: "Who actually pays out the reward?", a: "The provider named on each game or offer page — GameEarn does not issue, process or guarantee any reward itself." },
      { q: "Is there a fee to use GameEarn?", a: "No. Browsing, searching and starting offers through GameEarn is free." },
      { q: "Can I lose money using GameEarn?", a: "GameEarn does not involve betting, wagering or deposits. Some app offers or cashback deals may involve a purchase through the provider — always read the requirements and terms before starting." },
    ])}
  </div>
</section>
`;
}

module.exports = { howItWorksPage };
