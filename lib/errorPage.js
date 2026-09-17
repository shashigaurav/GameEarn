// lib/errorPage.js
function errorPage(err, title = "GameEarn is temporarily unavailable") {
  // Errors explicitly marked safeToDisplay (e.g. a missing-env-var message that
  // names only variable names, never a value/key) are shown verbatim even in
  // production — that's the difference between a self-diagnosing message and
  // a dead end. Anything else still hides its stack trace in production.
  const isSafe = err && err.safeToDisplay;
  const showDetails = isSafe || process.env.NODE_ENV !== "production";
  const detailText = isSafe ? (err.message || String(err)) : String(err && err.stack ? err.stack : err);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <meta name="robots" content="noindex" /></head>
  <body style="font-family:sans-serif;background:#050609;color:#fff;padding:60px;text-align:center;">
    <h1>${title}</h1>
    <p>Please try again in a moment.</p>
    ${showDetails ? `<pre style="color:#ff9bad;white-space:pre-wrap;max-width:800px;margin:24px auto;text-align:left;">${detailText}</pre>` : ""}
  </body></html>`;
}

module.exports = { errorPage };
