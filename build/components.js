// build/components.js
// Every function here returns an HTML string. Nothing here touches game/offer data files
// directly except by receiving already-selected objects as arguments — keeps data and UI apart.
const { CATEGORIES } = require("../data/games");

const SITE_NAME = "GameEarn";
const SITE_URL = "https://www.gameearn.example"; // placeholder production domain

function esc(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function ratingStars(rating) {
  return `<span class="rating" aria-label="Rated ${rating} out of 5">
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z"/></svg>
    ${rating.toFixed(1)}
  </span>`;
}

function rewardBadge(rewardType) {
  if (!rewardType || rewardType === "None") return "";
  return `<span class="badge badge-reward">${esc(rewardType)}</span>`;
}

function freeBadge(freeToPlay) {
  return freeToPlay ? `<span class="badge badge-free">Free to Play</span>` : `<span class="badge">Paid</span>`;
}

function categoryLabel(slug) {
  const c = CATEGORIES.find((c) => c.slug === slug);
  return c ? c.name : slug;
}

function verifiedBadge() {
  return `<span class="verified-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg> Verified</span>`;
}

function difficultyBadge(level) {
  const cls = { Easy: "badge-difficulty-easy", Medium: "badge-difficulty-medium", Hard: "badge-difficulty-hard" }[level] || "";
  return `<span class="badge ${cls}">${esc(level)}</span>`;
}

function trustScoreBar(score) {
  return `<div class="trust-score">
    <div class="bar"><div class="fill" style="width:${score}%;"></div></div>
    <span class="score-label">${score}/100 Trust Score</span>
  </div>`;
}

function demoBanner(text = "Demo data — connect a backend to show real numbers.") {
  return `<div class="demo-banner">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v5M12 16h.01"/><circle cx="12" cy="12" r="9"/></svg>
    ${esc(text)}
  </div>`;
}

/* ---------------- header / nav ---------------- */
function logoMark() {
  return `<span class="logo-mark" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 9.5C4 7 6 5 8.5 5h7C18 5 20 7 20 9.5S18 14 15.5 14h-7A4.5 4.5 0 014 9.5z" fill="#050609"/>
      <circle cx="8.2" cy="9.5" r="1.1" fill="#F0B429"/>
      <circle cx="10.4" cy="9.5" r="1.1" fill="#F0B429"/>
      <path d="M6 17l2.5-3M18 17l-2.5-3" stroke="#050609" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  </span>`;
}

const NAV_LINKS = [
  ["/", "Home", "home"],
  ["/earn/", "Earn", "earn"],
  ["/games/", "Games", "games"],
  ["/offers/", "Offers", "offers"],
  ["/rewards/", "Rewards", "rewards"],
  ["/leaderboard/", "Leaderboard", "leaderboard"],
  ["/how-it-works/", "How It Works", "how-it-works"],
];

function header(active = "") {
  const navHtml = NAV_LINKS.map(
    ([href, label, key]) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("");

  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container">
    <a href="/" class="logo">${logoMark()}<span class="logo-word">Game<span>Earn</span></span></a>
    <nav class="main-nav" aria-label="Primary">${navHtml}</nav>
    <div class="header-actions">
      <a href="/search/" class="icon-btn" aria-label="Search GameEarn">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      </a>
      <a href="/dashboard/" class="icon-btn desktop-only" aria-label="Notifications"><span class="dot"></span>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>
      </a>
      <a href="/profile/" class="icon-btn" aria-label="Profile">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>
      </a>
      <div class="auth-actions">
        <a href="/login/" class="btn btn-ghost btn-sm">Login</a>
        <a href="/signup/" class="btn btn-primary btn-sm">Sign Up</a>
      </div>
      <button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav"><span></span></button>
    </div>
  </div>
</header>
<nav class="mobile-nav" id="mobileNav" aria-label="Mobile">
  ${NAV_LINKS.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
  <a href="/search/">Search</a>
  <a href="/login/">Login</a>
  <a href="/signup/" class="btn btn-primary btn-block">Sign Up</a>
</nav>`;
}

function bottomNav(active = "") {
  const items = [
    ["/", "Home", "home", '<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z"/>'],
    ["/earn/", "Earn", "earn", '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M8.5 9.5c0-1.4 1.4-2.5 3.5-2.5s3.5 1 3.5 2.2c0 3-7 1.5-7 4.5 0 1.3 1.5 2.3 3.5 2.3s3.5-1 3.5-2.3"/>'],
    ["/games/", "Games", "games", '<rect x="3" y="8" width="18" height="10" rx="4"/><circle cx="8.5" cy="13" r="1.2"/><circle cx="6.5" cy="13" r="0"/><path d="M8.5 11.5v3M7 13h3"/><circle cx="16" cy="12.5" r="1"/><circle cx="18" cy="14.5" r="1"/>'],
    ["/rewards/", "Rewards", "rewards", '<path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.9 7.1 18.2l.9-5.5-4-3.9L9.5 8z"/>'],
    ["/profile/", "Profile", "profile", '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>'],
  ];
  return `<nav class="bottom-nav" aria-label="Primary mobile">
  <ul>
    ${items
      .map(
        ([href, label, key, path]) => `<li><a href="${href}"${active === key ? ' aria-current="page"' : ""}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${path}</svg>
      <span>${label}</span>
    </a></li>`
      )
      .join("")}
  </ul>
</nav>`;
}

/* ---------------- footer ---------------- */
function footer() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-about">
        <a href="/" class="logo">${logoMark()}<span class="logo-word">Game<span>Earn</span></span></a>
        <p>GameEarn is a discovery platform for games and reward opportunities. We help you compare and verify offers before you start them.</p>
      </div>
      <div>
        <h4>Discover</h4>
        <ul>
          <li><a href="/games/">Games</a></li>
          <li><a href="/offers/">Offers</a></li>
          <li><a href="/earn/">Ways to Earn</a></li>
          <li><a href="/leaderboard/">Leaderboard</a></li>
        </ul>
      </div>
      <div>
        <h4>Account</h4>
        <ul>
          <li><a href="/dashboard/">Dashboard</a></li>
          <li><a href="/profile/">Profile</a></li>
          <li><a href="/referrals/">Referrals</a></li>
          <li><a href="/rewards/history/">Rewards History</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/how-it-works/">How It Works</a></li>
          <li><a href="/about/">About</a></li>
          <li><a href="/contact/">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/terms-and-conditions/">Terms &amp; Conditions</a></li>
          <li><a href="/disclaimer/">Disclaimer</a></li>
        </ul>
      </div>
    </div>
    <p class="footer-disclaimer">GameEarn is an independent discovery and information platform. We are not affiliated with the games, apps or offer providers listed unless stated otherwise, and we do not run any gambling, betting or casino-style wagering. Reward availability, eligibility and payout terms are determined solely by each provider and can change at any time. GameEarn does not guarantee earnings, payouts or rankings, does not process payments or withdrawals, and does not host or distribute app installation files. Dashboard, leaderboard and profile figures shown on this version of the site are demo data for layout purposes only. Always review a provider's official terms before participating in any offer.</p>
    <div class="footer-bottom">
      <span>&copy; ${year} GameEarn. All rights reserved.</span>
      <span>Play. Complete. Discover rewards.</span>
    </div>
  </div>
</footer>`;
}

/* ---------------- game card (grid) ---------------- */
function gameCard(g, { rank = null, badge = null } = {}) {
  return `<article class="game-card"
    data-name="${esc(g.name.toLowerCase())}"
    data-category="${g.category}"
    data-genre="${esc(g.genre.toLowerCase())}"
    data-platform="${esc(g.platform.toLowerCase())}"
    data-reward="${esc(g.rewardType.toLowerCase())}"
    data-developer="${esc(g.developer.toLowerCase())}"
    data-rating="${g.rating}"
    data-free="${g.freeToPlay}"
    data-date="${g.releaseDate}"
    data-popular="${g.popular}"
  >
  <a href="/games/${g.slug}/" class="thumb-wrap">
    <img src="${g.image}" alt="${esc(g.name)} cover" loading="lazy" width="640" height="320" />
    <span class="badge-row">
      ${g.newRelease ? '<span class="badge badge-new">New</span>' : ""}
      ${badge === "trending" && !g.newRelease ? '<span class="badge badge-trending">Trending</span>' : ""}
    </span>
    ${rank ? `<span class="rank-badge">#${rank}</span>` : ""}
  </a>
  <div class="body">
    <div class="title-row">
      <img class="icon" src="${g.icon}" alt="" loading="lazy" width="34" height="34" />
      <h3><a href="/games/${g.slug}/">${esc(g.name)}</a></h3>
    </div>
    <div class="meta-line">
      ${ratingStars(g.rating)}
      <span>&middot;</span>
      <span>${categoryLabel(g.category)}</span>
      <span>&middot;</span>
      <span>${g.platform}</span>
    </div>
    <p class="desc">${esc(g.description.slice(0, 96))}${g.description.length > 96 ? "…" : ""}</p>
    <div class="card-foot">
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${freeBadge(g.freeToPlay)}
        ${rewardBadge(g.rewardType)}
      </div>
      <a href="/games/${g.slug}/" class="btn btn-ghost btn-sm">Play / View Offer</a>
    </div>
  </div>
</article>`;
}

/* ---------------- featured card (larger, homepage) ---------------- */
function featuredCard(g) {
  return `<article class="game-card">
  <a href="/games/${g.slug}/" class="thumb-wrap">
    <img src="${g.image}" alt="${esc(g.name)} cover" loading="lazy" width="640" height="320" />
    <span class="badge-row">${g.trending ? '<span class="badge badge-trending">Trending</span>' : ""}</span>
  </a>
  <div class="body">
    <div class="title-row">
      <img class="icon" src="${g.icon}" alt="" loading="lazy" width="34" height="34" />
      <h3><a href="/games/${g.slug}/">${esc(g.name)}</a></h3>
    </div>
    <div class="meta-line">
      ${ratingStars(g.rating)}<span>&middot;</span><span>${categoryLabel(g.category)}</span><span>&middot;</span><span>${g.platform}</span>
    </div>
    <p class="desc">${esc(g.description.slice(0, 110))}${g.description.length > 110 ? "…" : ""}</p>
    <div class="card-foot">
      <div style="display:flex;gap:6px;flex-wrap:wrap;">${freeBadge(g.freeToPlay)}${rewardBadge(g.rewardType)}</div>
      <a href="/games/${g.slug}/" class="btn btn-primary btn-sm">View Details</a>
    </div>
  </div>
</article>`;
}

/* ---------------- offer card (grid) ---------------- */
function offerCard(o) {
  return `<article class="offer-card"
    data-name="${esc(o.title.toLowerCase())}"
    data-category="${o.category}"
    data-provider="${esc(o.provider.toLowerCase())}"
    data-difficulty="${o.difficulty.toLowerCase()}"
    data-rating="${o.rating}"
    data-nocost="${o.noCost}"
    data-date="${o.lastVerified}"
    data-trending="${o.trending}"
    data-rewardvalue="${o.rewardValue}"
  >
  <a href="/offer/${o.slug}/" class="thumb-wrap">
    <img src="${o.image}" alt="${esc(o.title)} cover" loading="lazy" width="640" height="320" />
    <span class="badge-row">
      ${o.newOffer ? '<span class="badge badge-new">New</span>' : ""}
      ${o.verified ? '<span class="badge badge-verified">Verified</span>' : ""}
    </span>
  </a>
  <div class="body">
    <div class="title-row">
      <img class="icon" src="${o.icon}" alt="" loading="lazy" width="34" height="34" />
      <h3><a href="/offer/${o.slug}/">${esc(o.title)}</a></h3>
    </div>
    <div class="meta-line">
      ${ratingStars(o.rating)}<span>&middot;</span><span>${esc(o.provider)}</span>
    </div>
    <div class="offer-meta-grid">
      <span>${difficultyBadge(o.difficulty)}</span>
      <span>⏱ ${esc(o.estimatedTime)}</span>
    </div>
    <p class="desc">${esc(o.description.slice(0, 100))}${o.description.length > 100 ? "…" : ""}</p>
    <div class="card-foot">
      <span class="offer-reward">${esc(o.rewardRange)}</span>
      <a href="/offer/${o.slug}/" class="btn btn-ghost btn-sm">View Details</a>
    </div>
  </div>
</article>`;
}

/* ---------------- category card ---------------- */
function categoryCard(cat, count) {
  return `<a class="category-card" href="/category/${cat.slug}/">
    <span class="cat-icon" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>
    </span>
    <h3>${cat.name}</h3>
    <span class="count">${count} game${count === 1 ? "" : "s"}</span>
  </a>`;
}

/* ---------------- feature / earn card ---------------- */
function featureCard(iconSvg, title, desc) {
  return `<div class="feature-card">
    <span class="f-icon" aria-hidden="true">${iconSvg}</span>
    <h3>${title}</h3>
    <p>${desc}</p>
  </div>`;
}

function earnCard(iconSvg, title, desc, href, cta) {
  return `<a class="earn-card" href="${href}" style="display:block;">
    <span class="f-icon" aria-hidden="true">${iconSvg}</span>
    <h3>${esc(title)}</h3>
    <p>${esc(desc)}</p>
    <span class="cta-link">${esc(cta)} &rarr;</span>
  </a>`;
}

function trustCard(iconSvg, title, desc) {
  return `<div class="trust-card">
    ${iconSvg}
    <div><h3>${title}</h3><p>${desc}</p></div>
  </div>`;
}

/* ---------------- FAQ ---------------- */
function faqList(items) {
  return `<div class="faq-list">
    ${items
      .map(
        (item, i) => `<div class="faq-item glass" data-open="false">
      <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
        <span>${esc(item.q)}</span>
        <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><p>${esc(item.a)}</p></div>
    </div>`
      )
      .join("")}
  </div>`;
}

/* ---------------- breadcrumbs ---------------- */
function breadcrumbs(trail) {
  const items = trail
    .map((t) => (t.href ? `<a href="${t.href}">${esc(t.label)}</a>` : `<span aria-current="page">${esc(t.label)}</span>`))
    .join(' <span aria-hidden="true">/</span> ');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${items}</nav>`;
}

/* ---------------- note panel (informational disclaimer) ---------------- */
function notePanel(text) {
  return `<div class="note-panel">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
    <p>${text}</p>
  </div>`;
}

/* ---------------- dashboard stat card ---------------- */
function statCard(label, value, accent = "green", sub = "") {
  return `<div class="stat-card glass accent-${accent}">
    <div class="stat-label">${esc(label)}</div>
    <div class="stat-value" data-count="${value}">0</div>
    ${sub ? `<div class="stat-sub">${esc(sub)}</div>` : ""}
  </div>`;
}

/* ---------------- daily streak day ---------------- */
function streakDay(d) {
  const icon =
    d.state === "claimed"
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>'
      : d.state === "today"
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.9 7.1 18.2l.9-5.5-4-3.9L9.5 8z"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>';
  return `<div class="streak-day glass ${d.state === "claimed" ? "claimed" : ""} ${d.state === "today" ? "today" : ""}">
    <div class="day-label">${esc(d.label)}</div>
    <div class="day-icon">${icon}</div>
    <div class="reward-label">${esc(d.reward)}</div>
  </div>`;
}

/* ---------------- leaderboard row ---------------- */
function leaderboardRow(entry) {
  const topClass = entry.rank <= 3 ? `top-${entry.rank}` : "";
  const initial = entry.username.trim()[0].toUpperCase();
  return `<tr class="leaderboard-row ${topClass}">
    <td class="lb-rank">#${entry.rank}</td>
    <td><div class="lb-user">
      <svg class="lb-avatar" viewBox="0 0 40 40"><rect width="40" height="40" rx="20" fill="#171922"/><text x="20" y="26" font-family="Space Grotesk, Arial" font-size="16" fill="#35F2A6" text-anchor="middle">${initial}</text></svg>
      <span>${esc(entry.username)}</span>
    </div></td>
    <td class="lb-points">${entry.points.toLocaleString()} pts</td>
    <td class="lb-level">Level ${entry.level}</td>
  </tr>`;
}

/* ---------------- pagination / load more ---------------- */
function loadMoreButton(id = "loadMoreBtn") {
  return `<div class="load-more-wrap"><button class="btn btn-ghost" id="${id}">Load More</button></div>`;
}

module.exports = {
  SITE_NAME,
  SITE_URL,
  esc,
  ratingStars,
  rewardBadge,
  freeBadge,
  categoryLabel,
  verifiedBadge,
  difficultyBadge,
  trustScoreBar,
  demoBanner,
  header,
  bottomNav,
  footer,
  gameCard,
  featuredCard,
  offerCard,
  categoryCard,
  featureCard,
  earnCard,
  trustCard,
  faqList,
  breadcrumbs,
  notePanel,
  statCard,
  streakDay,
  leaderboardRow,
  loadMoreButton,
};
