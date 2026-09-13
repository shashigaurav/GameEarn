// js/login.js
import { isConfigured, configWarningHtml } from "../lib/supabaseClient.js";
import { signIn, signInWithGoogle, friendlyAuthError } from "../services/authService.js";

const form = document.getElementById("loginForm");
const messageBox = document.getElementById("loginMessage");
const submitBtn = document.getElementById("loginSubmitBtn");
const googleBtn = document.getElementById("googleLoginBtn");

function showMessage(text, kind = "error") {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.style.color = kind === "success" ? "var(--green)" : "var(--red)";
  messageBox.style.display = text ? "block" : "none";
}

if (!isConfigured) {
  showMessage("Supabase isn't configured yet — see the README to add VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.");
  if (form) form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
  if (googleBtn) googleBtn.disabled = true;
} else {
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showMessage("");
      submitBtn.disabled = true;
      submitBtn.textContent = "Logging in…";

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      try {
        await signIn(email, password);
        showMessage("Logged in! Redirecting…", "success");
        const params = new URLSearchParams(window.location.search);
        window.location.href = params.get("redirect") || "/profile/";
      } catch (err) {
        showMessage(friendlyAuthError(err));
        submitBtn.disabled = false;
        submitBtn.textContent = "Log In";
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      googleBtn.disabled = true;
      googleBtn.textContent = "Redirecting to Google…";
      try {
        await signInWithGoogle();
      } catch (err) {
        showMessage(friendlyAuthError(err));
        googleBtn.disabled = false;
        googleBtn.textContent = "Continue with Google";
      }
    });
  }
}
