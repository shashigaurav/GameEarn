const { adminLayout } = require("./layout");
const { CATEGORIES, REWARD_TYPES, PLATFORMS } = require("../../../data/games");

function gameFormPage(mode) {
  const isEdit = mode === "edit";
  const content = `
<div class="page-head" style="padding-top:0;">
  <h1>${isEdit ? "Edit Game" : "Add Game"}</h1>
  <p class="page-intro">${isEdit ? "Update this game's details, images or status." : "Fill in the details below to add a new game to the catalog."}</p>
</div>

<div id="formLoadError"></div>

<form class="form-card glass" id="gameForm" style="${isEdit ? "display:none;" : ""}">
  <input type="hidden" id="gameId" />
  <div class="form-grid">
    <div class="form-field full">
      <label for="f-name">Game Name <span class="req">*</span></label>
      <input type="text" id="f-name" required />
      <div class="field-error">Game name is required.</div>
    </div>

    <div class="form-field full">
      <label for="f-slug">Slug <span class="req">*</span></label>
      <input type="text" id="f-slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
      <div class="hint">Auto-generated from the name — edit if you need a different URL. Lowercase letters, numbers and hyphens only.</div>
      <div class="field-error">Enter a valid, unique slug (lowercase letters, numbers, hyphens).</div>
    </div>

    <div class="form-field full">
      <label for="f-description">Description</label>
      <textarea id="f-description"></textarea>
    </div>

    <div class="form-field">
      <label for="f-category">Category <span class="req">*</span></label>
      <select id="f-category" required>
        ${CATEGORIES.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("")}
      </select>
    </div>

    <div class="form-field">
      <label for="f-genre">Genre</label>
      <input type="text" id="f-genre" />
    </div>

    <div class="form-field">
      <label for="f-rating">Rating (0–5)</label>
      <input type="number" id="f-rating" min="0" max="5" step="0.1" value="0" />
    </div>

    <div class="form-field">
      <label for="f-platform">Platform</label>
      <select id="f-platform">
        ${PLATFORMS.map((p) => `<option value="${p}">${p}</option>`).join("")}
      </select>
    </div>

    <div class="form-field">
      <label for="f-developer">Developer</label>
      <input type="text" id="f-developer" />
    </div>

    <div class="form-field">
      <label for="f-version">Version</label>
      <input type="text" id="f-version" placeholder="1.0.0" />
    </div>

    <div class="form-field">
      <label for="f-size">Size</label>
      <input type="text" id="f-size" placeholder="e.g. 250 MB" />
    </div>

    <div class="form-field">
      <label for="f-release-date">Release Date</label>
      <input type="date" id="f-release-date" />
    </div>

    <div class="form-field">
      <label for="f-reward-type">Bonus</label>
      <select id="f-reward-type">
        ${REWARD_TYPES.map((r) => `<option value="${r}">${r}</option>`).join("")}
      </select>
    </div>

    <div class="form-field full">
      <label for="f-source-url">Source URL <span class="req">*</span></label>
      <input type="url" id="f-source-url" required placeholder="https://..." />
      <div class="field-error">Enter a valid URL starting with http:// or https://.</div>
    </div>

    <div class="form-field">
      <label for="f-status">Status</label>
      <select id="f-status">
        <option value="draft">Draft (not visible on the public site)</option>
        <option value="published">Published (live on the public site)</option>
      </select>
    </div>

    <div class="form-field full">
      <label>Flags</label>
      <div class="checkbox-row">
        <label class="checkbox-field"><input type="checkbox" id="f-free" checked /> Free to Play</label>
        <label class="checkbox-field"><input type="checkbox" id="f-featured" /> Featured</label>
        <label class="checkbox-field"><input type="checkbox" id="f-trending" /> Trending</label>
        <label class="checkbox-field"><input type="checkbox" id="f-popular" /> Popular</label>
        <label class="checkbox-field"><input type="checkbox" id="f-new" /> New Release</label>
      </div>
    </div>

    <div class="form-field">
      <label>Icon</label>
      <div class="upload-box">
        <div id="iconPreviewWrap"></div>
        <input type="file" id="f-icon" accept="image/*" />
        <div class="hint">Square image recommended.</div>
      </div>
    </div>

    <div class="form-field">
      <label>Cover Image</label>
      <div class="upload-box">
        <div id="coverPreviewWrap"></div>
        <input type="file" id="f-cover" accept="image/*" />
        <div class="hint">2:1 landscape recommended.</div>
      </div>
    </div>

    <div class="form-field full">
      <label>Screenshots</label>
      <div class="upload-box">
        <div class="upload-preview-row" id="screenshotsPreviewWrap"></div>
        <input type="file" id="f-screenshots" accept="image/*" multiple />
        <div class="hint">Select up to several images — replaces existing screenshots when you save.</div>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary" id="saveGameBtn">${isEdit ? "Save Changes" : "Create Game"}</button>
    <a href="/admin/games/" class="btn btn-ghost">Cancel</a>
  </div>
</form>`;

  return adminLayout({ title: isEdit ? "Edit Game" : "Add Game", active: isEdit ? "games" : "add", content, pageScript: "/js/admin/game-form.js" });
}

module.exports = { gameFormPage };
