// js/admin/auth-guard.js
import { isConfigured, configWarningHtml } from "../../lib/supabaseClient.js";
import { isCurrentUserAdmin, signOut } from "../../services/authService.js";

(async function guard() {
  if (!isConfigured) {
    const content = document.getElementById("adminContent");
    if (content) content.innerHTML = configWarningHtml();
    return;
  }

  try {
    const { user, isAdmin, profile } = await isCurrentUserAdmin();

    if (!user || !isAdmin) {
      window.location.href = "/admin/login/";
      return;
    }

    const badge = document.getElementById("adminUserBadge");
    if (badge) badge.textContent = (profile && profile.email) || user.email || "Admin";
  } catch (err) {
    console.error("Admin auth check failed:", err);
    window.location.href = "/admin/login/";
    return;
  }

  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await signOut();
      window.location.href = "/admin/login/";
    });
  }
})();
