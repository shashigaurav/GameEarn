const { adminLayout } = require("./layout");
const { CATEGORIES } = require("../../../data/games");

function adminGamesListPage() {
  const content = `
<div class="page-head" style="padding-top:0;">
  <h1>Games</h1>
  <p class="page-intro">Search, filter and manage every game in your Supabase catalog.</p>
</div>

<div class="toolbar glass" role="search">
  <div class="search-field">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    <input type="search" id="adminGameSearch" placeholder="Search games by name..." />
  </div>
  <select class="filter-select" id="adminCategoryFilter">
    <option value="">All Categories</option>
    ${CATEGORIES.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("")}
  </select>
  <select class="filter-select" id="adminStatusFilter">
    <option value="">All Statuses</option>
    <option value="published">Published</option>
    <option value="draft">Draft</option>
  </select>
  <select class="filter-select" id="adminSort">
    <option value="newest">Sort by Newest</option>
    <option value="name">Sort by Name</option>
    <option value="rating">Sort by Rating</option>
  </select>
  <a href="/admin/games/add/" class="btn btn-primary btn-sm">+ Add Game</a>
</div>

<div id="adminGamesError"></div>

<div class="admin-table-wrap glass">
  <table class="admin-table">
    <thead>
      <tr><th>Game</th><th>Category</th><th>Rating</th><th>Status</th><th>Featured</th><th>Trending</th><th>Actions</th></tr>
    </thead>
    <tbody id="adminGamesBody">
      <tr class="loading-row"><td colspan="7"><div class="spinner"></div><div style="margin-top:10px;">Loading games…</div></td></tr>
    </tbody>
  </table>
</div>

<div class="pagination-bar">
  <span class="page-info" id="adminPageInfo"></span>
  <div style="display:flex;gap:8px;">
    <button class="btn btn-ghost btn-sm" id="adminPrevPage">&larr; Prev</button>
    <button class="btn btn-ghost btn-sm" id="adminNextPage">Next &rarr;</button>
  </div>
</div>

<div id="deleteConfirmModal" style="display:none;position:fixed;inset:0;z-index:150;background:rgba(0,0,0,0.6);align-items:center;justify-content:center;">
  <div class="glass" style="max-width:380px;padding:26px;border-radius:20px;margin:16px;">
    <h3 style="margin-bottom:10px;">Delete this game?</h3>
    <p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:20px;">Are you sure you want to delete this game? This can't be undone.</p>
    <div style="display:flex;gap:10px;justify-content:flex-end;">
      <button class="btn btn-ghost btn-sm" id="cancelDeleteBtn">Cancel</button>
      <button class="btn btn-sm" style="background:var(--red);color:#fff;" id="confirmDeleteBtn">Delete</button>
    </div>
  </div>
</div>`;

  return adminLayout({ title: "Games", active: "games", content, pageScript: "/js/admin/games-list.js" });
}

module.exports = { adminGamesListPage };
