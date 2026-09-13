// js/profile-auth.js
import { isConfigured } from "../lib/supabaseClient.js";
import { getSessionUser, getOwnProfile, signOut, onAuthStateChange } from "../services/authService.js";

const usernameEl = document.getElementById("profileUsername");
const demoBannerEl = document.getElementById("profileDemoBanner");
const authNoticeEl = document.getElementById("profileAuthNotice");
const loginLink = document.getElementById("profileLoginLink");
const logoutBtn = document.getElementById("profileLogoutBtn");

function showSignedInUI(displayName) {
  if (usernameEl) usernameEl.textContent = displayName;
  if (demoBannerEl) demoBannerEl.style.display = "none";
  if (authNoticeEl) {
    authNoticeEl.style.display = "block";
    authNoticeEl.innerHTML = `<div class="note-panel"><p>Signed in as <strong>${displayName}</strong>. The stats below are still sample data until rewards tracking is connected.</p></div>`;
  }
  if (loginLink) loginLink.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "";
}

function showSignedOutUI() {
  if (loginLink) loginLink.style.display = "";
  if (logoutBtn) logoutBtn.style.display = "none";
  if (authNoticeEl) authNoticeEl.style.display = "none";
  if (demoBannerEl) demoBannerEl.style.display = "";
}

async function refresh() {
  if (!isConfigured) return;
  try {
    const user = await getSessionUser();
    if (!user) {
      showSignedOutUI();
      return;
    }
    const profile = await getOwnProfile(user.id);
    showSignedInUI((profile && profile.username) || user.email || "Player");
  } catch (err) {
    console.error("Couldn't load profile:", err);
    showSignedOutUI();
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    logoutBtn.disabled = true;
    await signOut();
    window.location.href = "/login/";
  });
}

if (isConfigured) {
  refresh();
  onAuthStateChange(() => refresh());
}
