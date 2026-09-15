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
      <div class="step glass"><span class="step-num">2</span><h3>Check Details</h3><p>Every listing shows description, screenshots, rating, developer, platform and reward information before you decide.</p></div>
      <div class="step glass"><span class="step-num">3</span><h3>Click Download / Play</h3><p>The "Download Game", "Play Game" or "Start Offer" button is right there on the detail page — no account needed.</p></div>
      <div class="step glass"><span class="step-num">4</span><h3>Go to the Official Source</h3><p>You're taken straight to the game or offer's official page, entered by GameEarn's team. Completion and any rewards happen entirely on that provider's platform.</p></div>
    </div>
    ${notePanel("GameEarn does not develop, publish or control the games and offers listed, and does not guarantee any reward. We do not offer betting, gambling or casino-style wagering of any kind.")}
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="section-head"><div><h2>Frequently Asked Questions</h2></div></div>
    ${faqList([
      { q: "Do I need to create an account?", a: "No. GameEarn requires no signup or login to browse, search, view game details, or start any offer." },
      { q: "Who actually pays out the reward?", a: "The provider named on each game or offer page — GameEarn does not issue, process or guarantee any reward itself." },
      { q: "Is there a fee to use GameEarn?", a: "No. Browsing, searching and starting offers through GameEarn is free." },
      { q: "Can I lose money using GameEarn?", a: "GameEarn does not involve betting, wagering or deposits. Some app offers or cashback deals may involve a purchase through the provider — always read the requirements and terms before starting." },
    ])}
  </div>
</section>
`;
}

module.exports = { howItWorksPage };
