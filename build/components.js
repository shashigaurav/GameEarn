// build/components.js
// Every function here returns an HTML string. Nothing here touches game data files
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
  ["/games/", "Games", "games"],
  ["/category/", "Categories", "categories"],
  ["/trending/", "Trending", "trending"],
  ["/new-games/", "New", "new"],
  ["/search/", "Search", "search"],
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
      <button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav"><span></span></button>
    </div>
  </div>
</header>
<nav class="mobile-nav" id="mobileNav" aria-label="Mobile">
  ${NAV_LINKS.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
</nav>`;
}

function bottomNav(active = "") {
  const items = [
    ["/", "Home", "home", '<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z"/>'],
    ["/games/", "Games", "games", '<rect x="3" y="8" width="18" height="10" rx="4"/><circle cx="8.5" cy="13" r="1.2"/><circle cx="6.5" cy="13" r="0"/><path d="M8.5 11.5v3M7 13h3"/><circle cx="16" cy="12.5" r="1"/><circle cx="18" cy="14.5" r="1"/>'],
    ["/category/", "Categories", "categories", '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'],
    ["/trending/", "Trending", "trending", '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 6h6v6"/>'],
    ["/search/", "Search", "search", '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'],
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
        <p>GameEarn is a discovery platform for mobile games. Browse, search and head to the official source when you're ready to play.</p>
      </div>
      <div>
        <h4>Discover</h4>
        <ul>
          <li><a href="/games/">Games</a></li>
          <li><a href="/category/">Categories</a></li>
          <li><a href="/trending/">Trending</a></li>
          <li><a href="/new-games/">New Games</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
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
    <p class="footer-disclaimer">GameEarn is an independent discovery and information platform. We are not affiliated with the games or developers listed unless stated otherwise, and we do not run any gambling, betting or casino-style wagering. Reward information shown on game pages is descriptive only and determined solely by each developer, and can change at any time. GameEarn does not guarantee earnings, payouts or rankings, does not process payments, and does not host or distribute app installation files. No account, signup or login is required to use GameEarn.</p>
    <div class="footer-bottom">
      <span>&copy; ${year} GameEarn. All rights reserved.</span>
      <span>Play. Discover. Download.</span>
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
      <a href="/games/${g.slug}/" class="btn btn-ghost btn-sm">Download</a>
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
      <a href="/games/${g.slug}/" class="btn btn-primary btn-sm">Download</a>
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

/* ---------------- feature card ---------------- */
function featureCard(iconSvg, title, desc) {
  return `<div class="feature-card">
    <span class="f-icon" aria-hidden="true">${iconSvg}</span>
    <h3>${title}</h3>
    <p>${desc}</p>
  </div>`;
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
  header,
  bottomNav,
  footer,
  gameCard,
  featuredCard,
  categoryCard,
  featureCard,
  trustCard,
  faqList,
  breadcrumbs,
  notePanel,
  loadMoreButton,
};
