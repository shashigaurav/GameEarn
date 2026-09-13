// js/signup.js
import { isConfigured } from "../lib/supabaseClient.js";
import { signUp, signInWithGoogle, friendlyAuthError } from "../services/authService.js";

const form = document.getElementById("signupForm");
const messageBox = document.getElementById("signupMessage");
const submitBtn = document.getElementById("signupSubmitBtn");
const googleBtn = document.getElementById("googleSignupBtn");

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
      submitBtn.textContent = "Creating account…";

      const username = document.getElementById("signup-username").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;

      if (password.length < 6) {
        showMessage("Please choose a password with at least 6 characters.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Create Account";
        return;
      }

      try {
        const { session } = await signUp({ email, password, username });

        if (!session) {
          // Email confirmation is required — Supabase doesn't return a session yet.
          showMessage("Account created! Check your email to confirm your address before logging in.", "success");
          form.reset();
          submitBtn.textContent = "Create Account";
          submitBtn.disabled = true; // avoid a confusing double-submit while they check email
        } else {
          showMessage("Account created! Redirecting…", "success");
          window.location.href = "/profile/";
        }
      } catch (err) {
        showMessage(friendlyAuthError(err));
        submitBtn.disabled = false;
        submitBtn.textContent = "Create Account";
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
