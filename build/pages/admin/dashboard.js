const { adminLayout } = require("./layout");

function adminDashboardPage() {
  const content = `
<div class="page-head" style="padding-top:0;">
  <h1>Dashboard</h1>
  <p class="page-intro">Live counts from your Supabase <code>games</code> table.</p>
</div>
<div class="admin-stat-row" id="statRow">
  <div class="stat-card glass accent-green"><div class="stat-label">Total Games</div><div class="stat-value skeleton" id="statTotal">&nbsp;</div></div>
  <div class="stat-card glass accent-blue"><div class="stat-label">Published Games</div><div class="stat-value skeleton" id="statPublished">&nbsp;</div></div>
  <div class="stat-card glass accent-gold"><div class="stat-label">Draft Games</div><div class="stat-value skeleton" id="statDraft">&nbsp;</div></div>
  <div class="stat-card glass accent-violet"><div class="stat-label">Featured Games</div><div class="stat-value skeleton" id="statFeatured">&nbsp;</div></div>
</div>
<div class="admin-stat-row">
  <div class="stat-card glass accent-green"><div class="stat-label">Trending Games</div><div class="stat-value skeleton" id="statTrending">&nbsp;</div></div>
</div>
<div id="dashboardError"></div>
<div class="cta-banner glass" style="margin-top:20px;">
  <h2>Manage your catalog</h2>
  <p>Add a new game or review what's currently live and in draft.</p>
  <div class="hero-actions">
    <a href="/admin/games/add/" class="btn btn-primary">+ Add Game</a>
    <a href="/admin/games/" class="btn btn-outline-blue">View All Games</a>
  </div>
</div>`;

  return adminLayout({ title: "Dashboard", active: "dashboard", content, pageScript: "/js/admin/dashboard.js" });
}

module.exports = { adminDashboardPage };
