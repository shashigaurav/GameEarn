const { esc, demoBanner, breadcrumbs } = require("../components");

const ACTION_ALERT = "alert('This is a UI mockup. Connect Supabase/Firebase/PostgreSQL to make admin actions functional.');";

function adminPage(games, offers) {
  const sections = ["Offers", "Games", "Users", "Reviews", "Analytics", "Featured Offers", "Banner Management", "Reports"];

  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Admin (Demo)" }])}
    <h1>Admin Dashboard</h1>
    <p class="page-intro">This is a frontend architecture mockup for the entities GameEarn will need once a backend is connected. No action here is functional yet.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    ${demoBanner("UI mockup only — no data here is real, and no button performs a real action until a backend is connected.")}

    <div class="admin-stat-row">
      <div class="stat-card glass accent-green"><div class="stat-label">Total Games</div><div class="stat-value">${games.length}</div></div>
      <div class="stat-card glass accent-blue"><div class="stat-label">Total Offers</div><div class="stat-value">${offers.length}</div></div>
      <div class="stat-card glass accent-gold"><div class="stat-label">Verified Offers</div><div class="stat-value">${offers.filter((o) => o.verified).length}</div></div>
      <div class="stat-card glass accent-violet"><div class="stat-label">Pending Review</div><div class="stat-value">${offers.filter((o) => !o.verified).length}</div></div>
    </div>

    <div class="admin-shell">
      <nav class="admin-side glass" aria-label="Admin sections">
        ${sections.map((s, i) => `<a href="#" class="${i === 0 ? "active" : ""}" onclick="event.preventDefault(); ${ACTION_ALERT}">${s}</a>`).join("")}
      </nav>

      <div>
        <div class="section-head"><div><h2>Offers</h2><p>Add, edit, verify or expire offers. Connects to the <code>offers</code> and <code>providers</code> tables.</p></div>
          <button class="btn btn-primary btn-sm" onclick="${ACTION_ALERT}">+ Add Offer</button>
        </div>
        <div class="admin-table-wrap glass">
          <table class="admin-table">
            <thead><tr><th>Title</th><th>Provider</th><th>Category</th><th>Reward</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${offers
                .slice(0, 10)
                .map(
                  (o) => `<tr>
                <td>${esc(o.title)}</td>
                <td>${esc(o.provider)}</td>
                <td>${o.category}</td>
                <td>${esc(o.rewardRange)}</td>
                <td><span class="badge ${o.verified ? "badge-verified" : "badge-demo"}">${o.verified ? "Verified" : "Pending"}</span></td>
                <td class="admin-actions">
                  <button class="btn btn-ghost btn-sm" onclick="${ACTION_ALERT}">Edit</button>
                  <button class="btn btn-ghost btn-sm" onclick="${ACTION_ALERT}">Verify</button>
                  <button class="btn btn-ghost btn-sm" onclick="${ACTION_ALERT}">Expire</button>
                </td>
              </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section-head" style="margin-top:36px;"><div><h2>Games</h2><p>Add, edit or remove games. Connects to the <code>games</code> table.</p></div>
          <button class="btn btn-primary btn-sm" onclick="${ACTION_ALERT}">+ Add Game</button>
        </div>
        <div class="admin-table-wrap glass">
          <table class="admin-table">
            <thead><tr><th>Name</th><th>Category</th><th>Platform</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody>
              ${games
                .slice(0, 8)
                .map(
                  (g) => `<tr>
                <td>${esc(g.name)}</td>
                <td>${g.category}</td>
                <td>${g.platform}</td>
                <td>${g.rating.toFixed(1)}</td>
                <td class="admin-actions">
                  <button class="btn btn-ghost btn-sm" onclick="${ACTION_ALERT}">Edit</button>
                  <button class="btn btn-ghost btn-sm" onclick="${ACTION_ALERT}">Delete</button>
                </td>
              </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>
`;
}

module.exports = { adminPage };
