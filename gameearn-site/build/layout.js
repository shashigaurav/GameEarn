// build/layout.js
const { header, footer, SITE_NAME, SITE_URL } = require("./components");

/**
 * @param {object} opts
 * @param {string} opts.title - unique <title>
 * @param {string} opts.description - unique meta description
 * @param {string} opts.path - canonical path, e.g. "/games/coindash-runner/"
 * @param {string} [opts.ogImage] - absolute or root-relative image path
 * @param {string} [opts.active] - key for header nav highlighting
 * @param {string} opts.content - page body HTML
 * @param {object[]} [opts.jsonLd] - array of schema.org objects to embed
 * @param {boolean} [opts.noindex] - set robots noindex (e.g. search results page)
 */
function layout({ title, description, path, ogImage, active = "", content, jsonLd = [], noindex = false }) {
  const canonical = `${SITE_URL}${path}`;
  const image = ogImage ? `${SITE_URL}${ogImage}` : `${SITE_URL}/assets/og-default.svg`;
  const ldBlocks = jsonLd
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${canonical}" />
${noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow" />'}
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${image}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="theme-color" content="#0A0B10" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/css/styles.css" />
${ldBlocks}
</head>
<body>
<div class="bg-glow" aria-hidden="true"></div>
${header(active)}
<main id="main">
${content}
</main>
${footer()}
<script src="/js/main.js" defer></script>
</body>
</html>`;
}

module.exports = { layout };
