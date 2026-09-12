// js/admin/game-form.js
import { isConfigured } from "../../lib/supabaseClient.js";
import { getGameById, createGame, updateGame, slugExists, uploadGameAsset } from "../../services/gameService.js";
import { showToast } from "./toast.js";

const isEditMode = window.location.pathname.includes("/admin/games/edit");
const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

const form = document.getElementById("gameForm");
const loadErrorBox = document.getElementById("formLoadError");
const saveBtn = document.getElementById("saveGameBtn");

const fields = {
  name: document.getElementById("f-name"),
  slug: document.getElementById("f-slug"),
  description: document.getElementById("f-description"),
  category: document.getElementById("f-category"),
  genre: document.getElementById("f-genre"),
  rating: document.getElementById("f-rating"),
  platform: document.getElementById("f-platform"),
  developer: document.getElementById("f-developer"),
  version: document.getElementById("f-version"),
  size: document.getElementById("f-size"),
  releaseDate: document.getElementById("f-release-date"),
  rewardType: document.getElementById("f-reward-type"),
  sourceUrl: document.getElementById("f-source-url"),
  status: document.getElementById("f-status"),
  free: document.getElementById("f-free"),
  featured: document.getElementById("f-featured"),
  trending: document.getElementById("f-trending"),
  popular: document.getElementById("f-popular"),
  newRelease: document.getElementById("f-new"),
  icon: document.getElementById("f-icon"),
  cover: document.getElementById("f-cover"),
  screenshots: document.getElementById("f-screenshots"),
};

let slugManuallyEdited = false;
let existing = { icon_url: null, image_url: null, screenshots: [] };

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

fields.name.addEventListener("input", () => {
  if (!slugManuallyEdited) fields.slug.value = slugify(fields.name.value);
});
fields.slug.addEventListener("input", () => {
  slugManuallyEdited = true;
});

function markInvalid(fieldEl, invalid) {
  const wrap = fieldEl.closest(".form-field");
  if (wrap) wrap.classList.toggle("invalid", invalid);
}

function clearValidation() {
  document.querySelectorAll(".form-field.invalid").forEach((el) => el.classList.remove("invalid"));
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function previewImage(wrapEl, url) {
  wrapEl.innerHTML = url ? `<img src="${url}" alt="" />` : "";
}

function previewScreenshots(urls) {
  const wrap = document.getElementById("screenshotsPreviewWrap");
  wrap.innerHTML = (urls || []).map((u) => `<img src="${u}" alt="" />`).join("");
}

async function loadForEdit() {
  if (!editId) {
    loadErrorBox.innerHTML = `<div class="note-panel"><p>No game id was provided in the URL.</p></div>`;
    return;
  }
  try {
    const game = await getGameById(editId);
    if (!game) {
      loadErrorBox.innerHTML = `<div class="note-panel"><p>No game found with that id. It may have been deleted.</p></div>`;
      return;
    }

    fields.name.value = game.name || "";
    fields.slug.value = game.slug || "";
    slugManuallyEdited = true; // never auto-overwrite an existing slug
    fields.description.value = game.description || "";
    fields.category.value = game.category || "";
    fields.genre.value = game.genre || "";
    fields.rating.value = game.rating || 0;
    fields.platform.value = game.platform || "";
    fields.developer.value = game.developer || "";
    fields.version.value = game.version || "";
    fields.size.value = game.size || "";
    fields.releaseDate.value = game.release_date || "";
    fields.rewardType.value = game.reward_type || "None";
    fields.sourceUrl.value = game.source_url || "";
    fields.status.value = game.status || "draft";
    fields.free.checked = !!game.free_to_play;
    fields.featured.checked = !!game.featured;
    fields.trending.checked = !!game.trending;
    fields.popular.checked = !!game.popular;
    fields.newRelease.checked = !!game.new_release;

    existing.icon_url = game.icon_url;
    existing.image_url = game.image_url;
    existing.screenshots = Array.isArray(game.screenshots) ? game.screenshots : [];
    previewImage(document.getElementById("iconPreviewWrap"), existing.icon_url);
    previewImage(document.getElementById("coverPreviewWrap"), existing.image_url);
    previewScreenshots(existing.screenshots);

    form.style.display = "";
  } catch (err) {
    loadErrorBox.innerHTML = `<div class="note-panel"><p>Couldn't load this game: ${(err && err.message) || "unknown error"}</p></div>`;
  }
}

function buildPayload() {
  return {
    name: fields.name.value.trim(),
    slug: fields.slug.value.trim(),
    description: fields.description.value.trim(),
    category: fields.category.value,
    genre: fields.genre.value.trim(),
    rating: parseFloat(fields.rating.value) || 0,
    platform: fields.platform.value,
    developer: fields.developer.value.trim(),
    version: fields.version.value.trim(),
    size: fields.size.value.trim(),
    release_date: fields.releaseDate.value || null,
    reward_type: fields.rewardType.value,
    source_url: fields.sourceUrl.value.trim(),
    status: fields.status.value,
    free_to_play: fields.free.checked,
    featured: fields.featured.checked,
    trending: fields.trending.checked,
    popular: fields.popular.checked,
    new_release: fields.newRelease.checked,
  };
}

async function validate(payload) {
  clearValidation();
  let ok = true;

  if (!payload.name) {
    markInvalid(fields.name, true);
    ok = false;
  }
  if (!payload.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(payload.slug)) {
    markInvalid(fields.slug, true);
    ok = false;
  } else {
    const duplicate = await slugExists(payload.slug, isEditMode ? editId : null);
    if (duplicate) {
      markInvalid(fields.slug, true);
      fields.slug.closest(".form-field").querySelector(".field-error").textContent = "This slug is already used by another game.";
      ok = false;
    }
  }
  if (!payload.source_url || !isValidUrl(payload.source_url)) {
    markInvalid(fields.sourceUrl, true);
    ok = false;
  }

  return ok;
}

async function uploadSelectedAssets(gameId) {
  const updates = {};

  if (fields.icon.files[0]) {
    updates.icon_url = await uploadGameAsset(gameId, fields.icon.files[0], "icon");
  }
  if (fields.cover.files[0]) {
    updates.image_url = await uploadGameAsset(gameId, fields.cover.files[0], "cover");
  }
  if (fields.screenshots.files.length) {
    const urls = [];
    for (const file of fields.screenshots.files) {
      urls.push(await uploadGameAsset(gameId, file, "screenshots"));
    }
    updates.screenshots = urls;
  }

  return updates;
}

function redirectWithToast(message) {
  sessionStorage.setItem("adminToast", JSON.stringify({ message, type: "success" }));
  window.location.href = "/admin/games/";
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isConfigured) return;

    const payload = buildPayload();
    const valid = await validate(payload);
    if (!valid) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = isEditMode ? "Saving…" : "Creating…";

    try {
      if (isEditMode) {
        const assetUpdates = await uploadSelectedAssets(editId);
        await updateGame(editId, { ...payload, ...assetUpdates });
        redirectWithToast("Game updated successfully.");
      } else {
        // Create first (without images) to get a game id, then upload assets
        // into game-assets/{id}/... and attach the resulting URLs.
        const created = await createGame(payload);
        const assetUpdates = await uploadSelectedAssets(created.id);
        if (Object.keys(assetUpdates).length) {
          await updateGame(created.id, assetUpdates);
        }
        redirectWithToast("Game created successfully.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      showToast(`Save failed: ${(err && err.message) || "unknown error"}`, "error");
      saveBtn.disabled = false;
      saveBtn.textContent = isEditMode ? "Save Changes" : "Create Game";
    }
  });
}

if (isConfigured && isEditMode) {
  loadForEdit();
}
