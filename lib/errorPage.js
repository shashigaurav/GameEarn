// lib/errorPage.js
function errorPage(err, title = "GameEarn is temporarily unavailable") {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <meta name="robots" content="noindex" /></head>
  <body style="font-family:sans-serif;background:#050609;color:#fff;padding:60px;text-align:center;">
    <h1>${title}</h1>
    <p>Please try again in a moment.</p>
    ${process.env.NODE_ENV !== "production" ? `<pre style="color:#ff9bad;white-space:pre-wrap;max-width:800px;margin:24px auto;text-align:left;">${String(err && err.stack ? err.stack : err)}</pre>` : ""}
  </body></html>`;
}

module.exports = { errorPage };
