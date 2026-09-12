// js/admin/dashboard.js
import { isConfigured } from "../../lib/supabaseClient.js";
import { getDashboardCounts } from "../../services/gameService.js";

const ids = { total: "statTotal", published: "statPublished", draft: "statDraft", featured: "statFeatured", trending: "statTrending" };

async function load() {
  if (!isConfigured) return; // auth-guard.js already shows the config warning
  const errBox = document.getElementById("dashboardError");
  try {
    const counts = await getDashboardCounts();
    Object.entries(ids).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove("skeleton");
      el.textContent = counts[key];
    });
  } catch (err) {
    console.error("Dashboard load failed:", err);
    if (errBox) {
      errBox.innerHTML = `<div class="note-panel" style="border-color:rgba(255,107,129,0.3);background:rgba(255,107,129,0.06);"><p style="color:#FF9BAD;">Couldn't load dashboard stats: ${
        (err && err.message) || "unknown error"
      }</p></div>`;
    }
  }
}

load();
