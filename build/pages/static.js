const { breadcrumbs } = require("../components");

function simplePage(title, trail, bodyHtml) {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs(trail)}
    <h1>${title}</h1>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="prose">${bodyHtml}</div>
  </div>
</section>`;
}

function aboutPage() {
  return simplePage(
    "About GameEarn",
    [{ label: "Home", href: "/" }, { label: "About" }],
    `<p>GameEarn is a discovery platform built for one purpose: helping players find verified games, tasks, surveys, app offers and cashback deals worth their time. Instead of running these programs ourselves, we organize information about them — provider, reward range, eligibility, requirements and trust score — so you can compare and verify before you start.</p>
    <h2>What we do</h2>
    <p>We list and describe games and reward offers across genres and categories, and show a dashboard, leaderboard, streak and referral system so you can track your own activity. On this version of the site, dashboard, leaderboard and profile numbers are clearly marked demo data until a real backend and accounts are connected.</p>
    <h2>What we don't do</h2>
    <ul>
      <li>We do not offer betting, gambling, casino-style wagering, deposits or real-money gaming of any kind.</li>
      <li>We do not host or distribute installation files (APKs or otherwise).</li>
      <li>We do not process real payments, wallets or withdrawals on this version of the site.</li>
      <li>We do not guarantee earnings, payouts or rankings for any listed game or offer.</li>
      <li>We do not control the reward programs described on game or offer pages — those are run entirely by each provider.</li>
    </ul>
    <p>If something on a listing looks out of date, <a href="/contact/">let us know</a>.</p>`
  );
}

function contactPage() {
  return simplePage(
    "Contact Us",
    [{ label: "Home", href: "/" }, { label: "Contact" }],
    `<p>Have a question about a listing, spotted an outdated detail, or want to suggest a game for GameEarn to cover? Send us a message.</p>
    <form class="contact-form" onsubmit="event.preventDefault(); this.reset(); document.getElementById('contactSent').style.display='block';">
      <div>
        <label for="cf-name">Name</label>
        <input id="cf-name" name="name" type="text" required />
      </div>
      <div>
        <label for="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" required />
      </div>
      <div>
        <label for="cf-message">Message</label>
        <textarea id="cf-message" name="message" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="justify-self:flex-start;">Send Message</button>
      <p id="contactSent" style="display:none;color:var(--green);font-size:0.88rem;">Thanks — this demo form doesn't send yet, but your message would normally reach our team here.</p>
    </form>`
  );
}

function privacyPage() {
  return simplePage(
    "Privacy Policy",
    [{ label: "Home", href: "/" }, { label: "Privacy Policy" }],
    `<p>This Privacy Policy explains how GameEarn ("we", "us") handles information when you use this website. This is a discovery platform: it does not require account creation, does not process payments, and does not host downloadable files.</p>
    <h2>Information we collect</h2>
    <p>The current version of GameEarn uses local, static content and does not collect personal information through accounts, forms submitted to a backend, or payment processing, because none of those systems exist on this version of the site.</p>
    <h2>Cookies and analytics</h2>
    <p>A future version of this site may use standard analytics tools to understand aggregate traffic patterns. This version does not include a backend or analytics integration.</p>
    <h2>Third-party links</h2>
    <p>Game and app pages link to official third-party sources for downloads and detailed terms. GameEarn is not responsible for the privacy practices of those third-party sites.</p>
    <h2>Changes to this policy</h2>
    <p>We may update this policy as the platform evolves, including when backend features are introduced. Continued use of the site after changes constitutes acceptance of the updated policy.</p>`
  );
}

function termsPage() {
  return simplePage(
    "Terms &amp; Conditions",
    [{ label: "Home", href: "/" }, { label: "Terms & Conditions" }],
    `<p>By using GameEarn, you agree to the following terms.</p>
    <h2>Nature of the service</h2>
    <p>GameEarn is an informational discovery platform for games and reward offers. We do not develop, publish, host or distribute the games and offers listed, and we do not control their reward programs, eligibility rules or payout terms.</p>
    <h2>No gambling or betting</h2>
    <p>GameEarn does not offer, host or link to betting, gambling, casino-style wagering, deposits or real-money gaming of any kind. Nothing on this site should be interpreted as such.</p>
    <h2>No guarantee of earnings</h2>
    <p>Any mention of rewards, points, gift cards, cashback or tournament prizes on this site is descriptive only. GameEarn does not guarantee that any user will earn, receive or be eligible for any reward from any listed game or offer. Reward availability varies by provider, region and eligibility, and is determined solely by that provider.</p>
    <h2>Demo data</h2>
    <p>Dashboard totals, leaderboard rankings, profile statistics, referral counts and rewards history shown on this version of the site are placeholder demo data for layout purposes only, clearly labeled as such, and do not reflect real user accounts, balances or transactions.</p>
    <h2>Third-party sources</h2>
    <p>"Start Offer", "Play / View Offer" and similar links direct you to the actual provider's own website, app or store listing. GameEarn is not responsible for the content, accuracy, security or terms of third-party sites.</p>
    <h2>Accuracy of information</h2>
    <p>We aim to keep listings accurate and up to date, but game details, ratings and reward information can change without notice. Always confirm current details on the official source before downloading or participating in a rewards program.</p>
    <h2>Limitation of liability</h2>
    <p>GameEarn is provided "as is" without warranties of any kind. We are not liable for losses arising from your use of, or reliance on, information found on this site.</p>`
  );
}

function disclaimerPage() {
  return simplePage(
    "Disclaimer",
    [{ label: "Home", href: "/" }, { label: "Disclaimer" }],
    `<p>GameEarn is an independent discovery and information platform for games and reward offers.</p>
    <ul>
      <li>GameEarn does not offer betting, gambling, casino-style wagering, deposits or real-money gaming of any kind.</li>
      <li>We are not affiliated with the games, apps or offer providers listed unless explicitly stated.</li>
      <li>We do not guarantee any level of earnings, payouts or rewards from any listed game or offer.</li>
      <li>Reward availability varies by provider, region and eligibility, and is controlled entirely by that provider and its official terms.</li>
      <li>We do not host, distribute or verify installation files (including APKs) for any listed app.</li>
      <li>Dashboard, leaderboard, profile and rewards-history figures on this version of the site are demo data for layout purposes only, clearly labeled as such — not real balances or transactions.</li>
      <li>Ratings, trust scores, screenshots and descriptions shown on this site are for informational purposes and may not reflect the current state of a game or offer after updates.</li>
      <li>Always review a provider's official terms, privacy policy and permissions before starting any game or offer.</li>
    </ul>
    <p>If you believe a listing is inaccurate or misleading, please <a href="/contact/">contact us</a> so we can review it.</p>`
  );
}

function notFoundPage() {
  return `
<section class="section" style="text-align:center;padding:120px 0;">
  <div class="container">
    <h1 style="font-size:clamp(2rem,5vw,3rem);margin-bottom:16px;">Page not found</h1>
    <p style="color:var(--text-muted);margin-bottom:28px;">The page you're looking for doesn't exist or may have moved.</p>
    <a href="/" class="btn btn-primary">Back to Home</a>
  </div>
</section>`;
}

module.exports = { aboutPage, contactPage, privacyPage, termsPage, disclaimerPage, notFoundPage };
