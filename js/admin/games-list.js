// js/admin/games-list.js
import { isConfigured } from "../../lib/supabaseClient.js";
import { listGamesForAdmin, deleteGame } from "../../services/gameService.js";
import { showToast } from "./toast.js";

const state = { search: "", category: "", status: "", sort: "newest", page: 1, pageSize: 10, total: 0, pendingDeleteId: null };

const body = document.getElementById("adminGamesBody");
const errorBox = document.getElementById("adminGamesError");
const pageInfo = document.getElementById("adminPageInfo");

function esc(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

(function showCrossPageToast() {
  const raw = sessionStorage.getItem("adminToast");
  if (!raw) return;
  sessionStorage.removeItem("adminToast");
  try {
    const { message, type } = JSON.parse(raw);
    showToast(message, type);
  } catch (e) {}
})();

function renderLoading() {
  body.innerHTML = `<tr class="loading-row"><td colspan="7"><div class="spinner"></div><div style="margin-top:10px;">Loading games…</div></td></tr>`;
}

function renderEmpty() {
  body.innerHTML = `<tr><td colspan="7"><div class="empty-state" style="border:none;padding:32px 0;"><h3>No games match your filters</h3><p>Try clearing a filter or search term, or add a new game.</p></div></td></tr>`;
}

function renderError(message) {
  errorBox.innerHTML = `<div class="note-panel" style="border-color:rgba(255,107,129,0.3);background:rgba(255,107,129,0.06);margin-bottom:16px;"><p style="color:#FF9BAD;">${esc(
    message
  )}</p></div>`;
}

function renderRows(games) {
  body.innerHTML = games
    .map(
      (g) => `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          ${g.icon_url ? `<img src="${g.icon_url}" alt="" width="32" height="32" style="border-radius:8px;object-fit:cover;" />` : ""}
          <div><div style="font-weight:600;">${esc(g.name)}</div><div style="font-size:0.75rem;color:var(--text-faint);">${esc(g.slug)}</div></div>
        </div>
      </td>
      <td>${esc(g.category)}</td>
      <td>${Number(g.rating || 0).toFixed(1)}</td>
      <td><span class="badge status-pill ${g.status}">${g.status}</span></td>
      <td>${g.featured ? "✅" : "—"}</td>
      <td>${g.trending ? "✅" : "—"}</td>
      <td class="admin-actions">
        <a class="btn btn-ghost btn-sm" href="/admin/games/edit/?id=${g.id}">Edit</a>
        <button class="btn btn-ghost btn-sm" style="color:var(--red);" data-delete-id="${g.id}" data-delete-name="${esc(g.name)}">Delete</button>
      </td>
    </tr>`
    )
    .join("");

  body.querySelectorAll("[data-delete-id]").forEach((btn) => {
    btn.addEventListener("click", () => openDeleteModal(btn.getAttribute("data-delete-id"), btn.getAttribute("data-delete-name")));
  });
}

async function load() {
  if (!isConfigured) return;
  renderLoading();
  errorBox.innerHTML = "";
  try {
    const { games, total } = await listGamesForAdmin(state);
    state.total = total;
    if (!games.length) renderEmpty();
    else renderRows(games);

    const start = total === 0 ? 0 : (state.page - 1) * state.pageSize + 1;
    const end = Math.min(state.page * state.pageSize, total);
    pageInfo.textContent = `Showing ${start}–${end} of ${total}`;
    document.getElementById("adminPrevPage").disabled = state.page <= 1;
    document.getElementById("adminNextPage").disabled = end >= total;
  } catch (err) {
    console.error("Failed to load games:", err);
    body.innerHTML = "";
    renderError(`Couldn't load games: ${(err && err.message) || "unknown error"}`);
  }
}

function openDeleteModal(id, name) {
  state.pendingDeleteId = id;
  const modal = document.getElementById("deleteConfirmModal");
  modal.querySelector("h3").textContent = `Delete "${name}"?`;
  modal.style.display = "flex";
}

document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
  document.getElementById("deleteConfirmModal").style.display = "none";
  state.pendingDeleteId = null;
});

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
  if (!state.pendingDeleteId) return;
  const btn = document.getElementById("confirmDeleteBtn");
  btn.disabled = true;
  btn.textContent = "Deleting…";
  try {
    await deleteGame(state.pendingDeleteId);
    showToast("Game deleted.", "success");
    document.getElementById("deleteConfirmModal").style.display = "none";
    state.pendingDeleteId = null;
    load();
  } catch (err) {
    showToast(`Delete failed: ${(err && err.message) || "unknown error"}`, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Delete";
  }
});

let searchDebounce;
document.getElementById("adminGameSearch").addEventListener("input", (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    state.search = e.target.value.trim();
    state.page = 1;
    load();
  }, 300);
});

document.getElementById("adminCategoryFilter").addEventListener("change", (e) => {
  state.category = e.target.value;
  state.page = 1;
  load();
});
document.getElementById("adminStatusFilter").addEventListener("change", (e) => {
  state.status = e.target.value;
  state.page = 1;
  load();
});
document.getElementById("adminSort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  state.page = 1;
  load();
});
document.getElementById("adminPrevPage").addEventListener("click", () => {
  if (state.page > 1) {
    state.page -= 1;
    load();
  }
});
document.getElementById("adminNextPage").addEventListener("click", () => {
  if (state.page * state.pageSize < state.total) {
    state.page += 1;
    load();
  }
});

load();
