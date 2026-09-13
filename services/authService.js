// services/authService.js
// Thin wrapper around Supabase Auth, shared by the admin panel AND the public
// site's login/signup/profile pages (the underlying `profiles` table and Auth
// user are the same for both — an "admin" is just a profile with role='admin').
// This file is a UX convenience layer only — the real authorization boundary
// is the RLS policies in supabase/schema.sql. Nothing here grants access on
// its own; it just helps the UI decide what to show and where to redirect.
import { supabase } from "../lib/supabaseClient.js";

/**
 * Creates a new Supabase Auth user. `username` is passed as user metadata —
 * the `handle_new_user` trigger in supabase/schema.sql reads it from
 * `raw_user_meta_data` and stores it on the new `profiles` row automatically,
 * so there's no separate client-side profile insert to worry about (or to
 * get out of sync with RLS).
 */
export async function signUp({ email, password, username }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  // `data.session` is null when Supabase is configured to require email
  // confirmation before a session is issued — the caller (js/signup.js)
  // checks for this to decide which message to show.
  return { user: data.user, session: data.session };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

/**
 * Redirects the browser to Google's consent screen; on return, Supabase
 * completes the session automatically. Requires the Google provider to be
 * enabled and configured in the Supabase dashboard first (see README).
 */
export async function signInWithGoogle(redirectTo = window.location.origin + "/") {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSessionUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user || null;
}

/**
 * Looks up the caller's own profile row. RLS only allows a user to select their
 * own row (or any row if they're already an admin), so this never leaks other
 * users' data.
 */
export async function getOwnProfile(userId) {
  const { data, error } = await supabase.from("profiles").select("id, username, email, role").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function isCurrentUserAdmin() {
  const user = await getSessionUser();
  if (!user) return { user: null, isAdmin: false };
  const profile = await getOwnProfile(user.id);
  return { user, isAdmin: profile ? profile.role === "admin" : false, profile };
}

/** Thin re-export so pages don't need to import lib/supabaseClient.js directly just for this. */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Maps common Supabase Auth error messages (and generic network failures) to
 * plain-language text for the UI. Falls back to the raw message, then to a
 * generic string, so nothing ever surfaces a raw stack trace to the visitor.
 */
export function friendlyAuthError(err) {
  const msg = (err && err.message) || "";
  const lower = msg.toLowerCase();

  if (!err) return "Something went wrong. Please try again.";
  if (err.name === "TypeError" || lower.includes("failed to fetch") || lower.includes("networkerror")) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  if (lower.includes("already registered") || lower.includes("already exists") || lower.includes("user already registered")) {
    return "An account with that email already exists — try logging in instead.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (lower.includes("password should be at least") || lower.includes("password is too short") || lower.includes("weak password")) {
    return "Please choose a longer password (at least 6 characters).";
  }
  if (lower.includes("unable to validate email") || lower.includes("invalid email")) {
    return "That doesn't look like a valid email address.";
  }
  if (lower.includes("email not confirmed") || lower.includes("email link is invalid") || lower.includes("confirm")) {
    return "Please confirm your email address before logging in — check your inbox for the confirmation link.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts — please wait a moment and try again.";
  }
  return msg || "Something went wrong. Please try again.";
}
