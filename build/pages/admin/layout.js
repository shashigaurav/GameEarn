// build/pages/admin/layout.js
const { SITE_NAME, SITE_URL } = require("../../components");

const NAV = [
  ["/admin/", "Dashboard", "dashboard", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>'],
  ["/admin/games/", "Games", "games", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="10" rx="4"/><circle cx="8.5" cy="13" r="1.2"/><circle cx="16" cy="12.5" r="1"/></svg>'],
  ["/admin/games/add/", "Add Game", "add", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>'],
];

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.active - "dashboard" | "games" | "add"
 * @param {string} opts.content
 * @param {boolean} [opts.guarded] - if true, injects the auth-guard script that runs before
 *   the page paints anything sensitive (dashboard/games/add/edit). Login page sets this false.
 */
function adminLayout({ title, active = "", content, guarded = true, pageScript = null }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} | GameEarn Admin</title>
<meta name="robots" content="noindex, nofollow" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/css/styles.css" />
<script src="/js/env-config.js"></script>
</head>
<body class="admin-body">
<div class="bg-glow" aria-hidden="true"></div>
<header class="admin-topbar">
  <a href="/admin/" class="logo">
    <span class="logo-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 9.5C4 7 6 5 8.5 5h7C18 5 20 7 20 9.5S18 14 15.5 14h-7A4.5 4.5 0 014 9.5z" fill="#050609"/><circle cx="8.2" cy="9.5" r="1.1" fill="#F0B429"/><circle cx="10.4" cy="9.5" r="1.1" fill="#F0B429"/></svg></span>
    <span class="logo-word">Game<span>Earn</span></span>
  </a>
  <span class="admin-tag">Admin</span>
  <div style="flex:1;"></div>
  <div class="admin-user" id="adminUserBadge">—</div>
</header>
${
  guarded
    ? `<div class="admin-shell admin-main">
  <nav class="admin-side glass" aria-label="Admin navigation">
    ${NAV.map(([href, label, key, icon]) => `<a href="${href}" class="${active === key ? "active" : ""}">${icon}${label}</a>`).join("")}
    <a href="#" class="side-logout" id="adminLogoutBtn">Logout</a>
  </nav>
  <div id="adminContent">${content}</div>
</div>`
    : `<div class="admin-main">${content}</div>`
}
<div class="toast-stack" id="toastStack" aria-live="polite"></div>
${guarded ? '<script src="/js/admin/auth-guard.js" type="module"></script>' : ""}
${pageScript ? `<script src="${pageScript}" type="module"></script>` : ""}
</body>
</html>`;
}

module.exports = { adminLayout, SITE_NAME, SITE_URL };
