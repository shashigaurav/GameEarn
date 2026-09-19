// build/layout.js
const { header, footer, bottomNav, SITE_NAME, SITE_URL, esc } = require("./components");

function particles(n = 18) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const left = Math.round((i / n) * 100 + (i % 3) * 2);
    const delay = -(i * 1.3) % 20;
    const size = i % 4 === 0 ? 4 : 2 + (i % 3);
    out += `<span style="left:${left}%;width:${size}px;height:${size}px;animation-delay:${delay}s;"></span>`;
  }
  return out;
}

/**
 * @param {object} opts
 * @param {string} opts.title - unique <title>
 * @param {string} opts.description - unique meta description
 * @param {string} opts.path - canonical path, e.g. "/games/coindash-runner/"
 * @param {string} [opts.ogImage] - absolute or root-relative image path
 * @param {string} [opts.active] - key for header/bottom-nav highlighting
 * @param {string} opts.content - page body HTML
 * @param {object[]} [opts.jsonLd] - array of schema.org objects to embed
 * @param {boolean} [opts.noindex] - set robots noindex (e.g. search results page)
 */
function layout({ title, description, path, ogImage, active = "", content, jsonLd = [], noindex = false }) {
  const canonical = `${SITE_URL}${path}`;
  const image = ogImage ? `${SITE_URL}${ogImage}` : `${SITE_URL}/assets/og-default.svg`;
  const safeTitle = esc(title);
  const safeDescription = esc(description);
  const ldBlocks = jsonLd
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${safeTitle}</title>
<meta name="description" content="${safeDescription}" />
<link rel="canonical" href="${canonical}" />
${noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />'}
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:title" content="${safeTitle}" />
<meta property="og:description" content="${safeDescription}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${image}" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${safeTitle}" />
<meta name="twitter:description" content="${safeDescription}" />
<meta name="theme-color" content="#050609" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/css/styles.css" />
<script src="/js/env-config.js"></script>
${ldBlocks}
</head>
<body>
<div class="bg-glow" aria-hidden="true"></div>
<div class="bg-particles" aria-hidden="true">${particles()}</div>
${header(active)}
<main id="main">
${content}
</main>
${footer()}
${bottomNav(active)}
<button class="back-to-top" id="backToTopBtn" type="button" aria-label="Back to top" hidden>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
</button>
<div class="toast-stack" id="toastStack" aria-live="polite"></div>
<script src="/js/main.js" defer></script>
</body>
</html>`;
}

module.exports = { layout };
