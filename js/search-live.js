// js/search-live.js
import { supabase, isConfigured } from "../lib/supabaseClient.js";

let dataset = [];

const input = document.getElementById("siteSearchInput");
const resultsEl = document.getElementById("searchResults");
const countEl = document.getElementById("searchResultCount");
const emptyEl = document.getElementById("searchEmptyState");

const params = new URLSearchParams(window.location.search);
if (params.get("q") && input) input.value = params.get("q");

function esc(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function cardHtml(item) {
  const href = `/games/${item.slug}/`;
  const freeBadge = item.freeToPlay ? '<span class="badge badge-free">Free to Play</span>' : '<span class="badge">Paid</span>';
  const rewardBadge = item.rewardType && item.rewardType !== "None" ? `<span class="badge badge-reward">${esc(item.rewardType)}</span>` : "";
  const desc = item.description && item.description.length > 96 ? item.description.slice(0, 96) + "…" : item.description || "";
  return `<article class="game-card">
    <a href="${href}" class="thumb-wrap"><img src="${item.image}" alt="${esc(item.name)} cover" loading="lazy" width="640" height="320" />
      ${item.newRelease ? '<span class="badge-row"><span class="badge badge-new">New</span></span>' : ""}
    </a>
    <div class="body">
      <div class="title-row"><img class="icon" src="${item.icon}" alt="" loading="lazy" width="34" height="34" /><h3><a href="${href}">${esc(item.name)}</a></h3></div>
      <div class="meta-line"><span class="rating">★ ${Number(item.rating || 0).toFixed(1)}</span><span>&middot;</span><span>${esc(item.category)}</span>${
    item.platform ? `<span>&middot;</span><span>${esc(item.platform)}</span>` : ""
  }</div>
      <p class="desc">${esc(desc)}</p>
      <div class="card-foot"><div style="display:flex;gap:6px;flex-wrap:wrap;">${freeBadge}${rewardBadge}</div><a href="${href}" class="btn btn-ghost btn-sm">View Details</a></div>
    </div>
  </article>`;
}

function runSearch() {
  const q = (input && input.value.trim().toLowerCase()) || "";
  if (!q) {
    resultsEl.innerHTML = "";
    countEl.textContent = "Type to search";
    emptyEl.style.display = "none";
    return;
  }
  const results = dataset.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.genre || "").toLowerCase().includes(q) ||
      (item.developer || "").toLowerCase().includes(q)
  );
  resultsEl.innerHTML = results.map(cardHtml).join("");
  countEl.textContent = `${results.length} result${results.length === 1 ? "" : "s"} for "${input ? input.value : ""}"`;
  emptyEl.style.display = results.length === 0 ? "block" : "none";
}

async function loadLiveGames() {
  if (!isConfigured) {
    countEl.textContent = "Type to search";
    return;
  }
  try {
    const { data, error } = await supabase
      .from("games")
      .select("name, slug, category, genre, developer, reward_type, platform, rating, free_to_play, description, image_url, icon_url, new_release")
      .eq("status", "published");
    if (error) throw error;

    dataset = (data || []).map((g) => ({
      name: g.name,
      slug: g.slug,
      category: g.category,
      genre: g.genre,
      developer: g.developer,
      rewardType: g.reward_type,
      platform: g.platform,
      rating: g.rating,
      freeToPlay: g.free_to_play,
      description: g.description,
      image: g.image_url,
      icon: g.icon_url,
      newRelease: g.new_release,
    }));
  } catch (err) {
    console.error("Live game search failed to load:", err);
  } finally {
    countEl.textContent = "Type to search";
    if (input && input.value) runSearch();
  }
}

if (input) input.addEventListener("input", runSearch);
loadLiveGames();
