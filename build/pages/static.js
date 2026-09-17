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
    `<p>GameEarn is a discovery platform built for one purpose: helping players find mobile games worth their time. We organize information about each game — genre, rating, platform, developer, size and more — so you can decide before you click through.</p>
    <h2>What we do</h2>
    <p>We list and describe games across genres and categories, with a details page for each one and simple search and filtering to help you find what you're looking for.</p>
    <h2>What we don't do</h2>
    <ul>
      <li>We do not offer betting, gambling, casino-style wagering, deposits or real-money gaming of any kind.</li>
      <li>We do not host or distribute installation files (APKs or otherwise).</li>
      <li>We do not require an account, login or signup to browse or search.</li>
      <li>We do not guarantee earnings, payouts or rankings for any listed game.</li>
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
    <p>GameEarn is an informational discovery platform for mobile games. We do not develop, publish, host or distribute the games listed, and we do not control any reward programs a game's developer may run within their own app.</p>
    <h2>No gambling or betting</h2>
    <p>GameEarn does not offer, host or link to betting, gambling, casino-style wagering, deposits or real-money gaming of any kind. Nothing on this site should be interpreted as such.</p>
    <h2>No guarantee of earnings</h2>
    <p>Any reward information shown on a game page is descriptive only. GameEarn does not guarantee that any user will earn, receive or be eligible for any reward from any listed game. Reward availability varies by developer and is determined solely by that developer.</p>
    <h2>Third-party sources</h2>
    <p>"Download", "Play Now" and similar links direct you to the game's actual official source. GameEarn is not responsible for the content, accuracy, security or terms of third-party sites.</p>
    <h2>Accuracy of information</h2>
    <p>We aim to keep listings accurate and up to date, but game details, ratings and reward information can change without notice. Always confirm current details on the official source before downloading.</p>
    <h2>Limitation of liability</h2>
    <p>GameEarn is provided "as is" without warranties of any kind. We are not liable for losses arising from your use of, or reliance on, information found on this site.</p>`
  );
}

function disclaimerPage() {
  return simplePage(
    "Disclaimer",
    [{ label: "Home", href: "/" }, { label: "Disclaimer" }],
    `<p>GameEarn is an independent discovery and information platform for mobile games.</p>
    <ul>
      <li>GameEarn does not offer betting, gambling, casino-style wagering, deposits or real-money gaming of any kind.</li>
      <li>We are not affiliated with the games or developers listed unless explicitly stated.</li>
      <li>We do not guarantee any level of earnings, payouts or rankings from any listed game.</li>
      <li>Reward information shown on a game page is descriptive only and controlled entirely by that game's developer.</li>
      <li>We do not host, distribute or verify installation files (including APKs) for any listed app.</li>
      <li>Ratings, screenshots and descriptions shown on this site are for informational purposes and may not reflect the current state of a game after updates.</li>
      <li>Always review a developer's official terms and permissions before downloading any game.</li>
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
