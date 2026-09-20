const { esc, ratingStars, rewardBadge, freeBadge, categoryLabel, breadcrumbs, faqList } = require("../components");

const FEATURES_POOL = [
  "Regular content updates",
  "Cross-device progress where supported",
  "Daily and weekly challenges",
  "Leaderboards and rankings",
  "In-app customization options",
  "Offline play for core modes",
  "Low storage footprint",
  "Achievements and milestones",
];

function pick(seed, n) {
  const arr = [...FEATURES_POOL];
  const out = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(arr.splice(s % arr.length, 1)[0]);
  }
  return out;
}

function detailPage(game, relatedGames) {
  const features = pick(game.id, 4);
  const needsSysReq = game.platform.includes("Windows");

  const faq = [
    { q: `Is ${game.name} free to play?`, a: game.freeToPlay ? `Yes, ${game.name} is free to play. Some optional purchases or in-app offers may still be available depending on the developer.` : `${game.name} is a paid title. Check the official source page for current pricing.` },
    { q: `What platforms is ${game.name} available on?`, a: `${game.name} is available on ${game.platform}. Always confirm device compatibility on the official source page before downloading.` },
    { q: `How do rewards work in ${game.name}?`, a: game.rewardType === "None" ? `${game.name} does not run a rewards program at this time.` : `${game.name} offers ${game.rewardType.toLowerCase()} through a program run by ${game.developer}. Reward availability varies by app, region and eligibility — review the developer's official terms for full details.` },
    { q: `Where can I download ${game.name}?`, a: `Use the "Download" button on this page to go to ${game.developer}'s official page for ${game.name}.` },
  ];

  return `
<div class="container" style="padding-top:32px;">
  ${breadcrumbs([
    { label: "Home", href: "/" },
    { label: categoryLabel(game.category), href: `/category/${game.category}/` },
    { label: game.name },
  ])}
  <div class="detail-hero">
    <div class="detail-cover">
      <img src="${game.image}" alt="${esc(game.name)} cover" width="640" height="320" />
    </div>
    <div class="detail-info">
      <div class="title-row">
        <img src="${game.icon}" alt="" />
        <div>
          <h1>${esc(game.name)}</h1>
          <div class="meta-line">${ratingStars(game.rating)}<span>&middot;</span><span>${categoryLabel(game.category)}</span><span>&middot;</span><span>${esc(game.genre)}</span></div>
        </div>
      </div>
      <div class="detail-badges">
        ${freeBadge(game.freeToPlay)}
        ${rewardBadge(game.rewardType)}
        ${game.newRelease ? '<span class="badge badge-new">New</span>' : ""}
        ${game.trending ? '<span class="badge badge-trending">Trending</span>' : ""}
      </div>
      <p>${esc(game.description)}</p>
      <div class="detail-meta-grid">
        <div class="meta-block"><div class="label">Platform</div><div class="value">${game.platform}</div></div>
        <div class="meta-block"><div class="label">Developer</div><div class="value">${esc(game.developer)}</div></div>
        <div class="meta-block"><div class="label">Version</div><div class="value">${game.version}</div></div>
        <div class="meta-block"><div class="label">Size</div><div class="value">${game.size}</div></div>
        <div class="meta-block"><div class="label">Release Date</div><div class="value">${game.releaseDate}</div></div>
        <div class="meta-block"><div class="label">Bonus</div><div class="value">${game.rewardType}</div></div>
      </div>
      <div class="detail-actions">
        <a href="${game.sourceUrl}" class="btn btn-primary" rel="nofollow sponsored noopener" target="_blank">Download</a>
        <a href="/category/${game.category}/" class="btn btn-ghost">More in ${categoryLabel(game.category)}</a>
      </div>
    </div>
  </div>

  <div class="detail-body">
    <div>
      <div class="content-block">
        <h2>About ${esc(game.name)}</h2>
        <p>${esc(game.description)} Developed by ${esc(game.developer)}, it's currently on version ${game.version} and available on ${game.platform}.</p>
      </div>

      <div class="content-block">
        <h2>How It Works</h2>
        <p>${esc(game.name)} follows the core loop typical of the ${esc(game.genre.toLowerCase())} genre. ${game.rewardType === "None" ? "Progress and unlocks are tied purely to in-game systems, with no external rewards program attached." : `Players take part in regular gameplay and events; activity can contribute toward ${game.rewardType.toLowerCase()} distributed by ${esc(game.developer)} under its own program rules.`}</p>
      </div>

      <div class="content-block">
        <h2>Features</h2>
        <ul class="feature-list">
          ${features.map((f) => `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>${f}</li>`).join("")}
        </ul>
      </div>

      <div class="content-block">
        <h2>Gameplay Information</h2>
        <p>${esc(game.name)} is best suited to players who enjoy ${esc(game.genre.toLowerCase())} experiences. Session length, difficulty and progression pace are set by the developer and may change between updates — check the official source page for the latest patch notes.</p>
      </div>

      ${
        needsSysReq
          ? `<div class="content-block sys-req">
        <h2>System Requirements</h2>
        <dl>
          <dt>OS</dt><dd>Windows 10 or later</dd>
          <dt>Storage</dt><dd>${game.size} free space</dd>
          <dt>Connection</dt><dd>Internet connection required for updates and online features</dd>
        </dl>
      </div>`
          : ""
      }

      <div class="content-block">
        <h2>Screenshots</h2>
        <div class="screenshot-gallery">
          ${game.screenshots.map((s, i) => `<img src="${s}" alt="${esc(game.name)} gameplay screenshot ${i + 1}" loading="lazy" width="480" height="300" />`).join("")}
        </div>
      </div>

      <div class="content-block">
        <h2>Frequently Asked Questions</h2>
        ${faqList(faq)}
      </div>
    </div>

    <aside>
      <div class="reward-panel">
        <h3>Rewards Information</h3>
        <p>${game.rewardNote}</p>
      </div>
      <div class="sidebar-card">
        <h3>Quick Facts</h3>
        <div class="feature-list" style="grid-template-columns:1fr;">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Category: ${categoryLabel(game.category)}</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Genre: ${esc(game.genre)}</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Free to Play: ${game.freeToPlay ? "Yes" : "No"}</li>
        </div>
      </div>
      <div class="sidebar-card">
        <h3>Related Games</h3>
        ${relatedGames
          .map(
            (r) => `<a class="related-mini" href="/games/${r.slug}/">
          <img src="${r.icon}" alt="" />
          <div><div class="rm-name">${esc(r.name)}</div><div class="rm-meta">${categoryLabel(r.category)} &middot; ${r.rating.toFixed(1)}★</div></div>
        </a>`
          )
          .join("")}
      </div>
    </aside>
  </div>
</div>
`;
}

module.exports = { detailPage };
