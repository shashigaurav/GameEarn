// js/admin/login.js
import { isConfigured, configWarningHtml } from "../../lib/supabaseClient.js";
import { signIn, isCurrentUserAdmin, signOut, friendlyAuthError } from "../../services/authService.js";

const form = document.getElementById("adminLoginForm");
const errorBox = document.getElementById("loginError");
const configWarning = document.getElementById("configWarning");
const submitBtn = document.getElementById("adminLoginBtn");

if (!isConfigured) {
  if (configWarning) configWarning.innerHTML = configWarningHtml();
  if (form) form.style.display = "none";
} else {
  // If already logged in as an admin, skip straight to the dashboard.
  isCurrentUserAdmin().then(({ isAdmin }) => {
    if (isAdmin) window.location.href = "/admin/";
  });
}

function setError(message) {
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.style.display = message ? "block" : "none";
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("");
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in…";

    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;

    try {
      await signIn(email, password);
      const { isAdmin } = await isCurrentUserAdmin();

      if (!isAdmin) {
        await signOut();
        setError("This account is not authorized as an admin.");
        return;
      }

      window.location.href = "/admin/";
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Log In";
    }
  });
}
