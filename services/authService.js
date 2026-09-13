// services/authService.js
// Thin wrapper around Supabase Auth for the ADMIN panel ONLY. GameEarn has no
// public user-account system — visitors browse, search and open games without
// logging in. This file is a UX convenience layer, not the security boundary:
// the real authorization boundary is the RLS policies in supabase/schema.sql
// (games INSERT/UPDATE/DELETE require public.is_admin()). Nothing here grants
// access on its own; it just helps the admin UI decide what to show and where
// to redirect.
import { supabase } from "../lib/supabaseClient.js";

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
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

/**
 * Maps common Supabase Auth error messages (and generic network failures) to
 * plain-language text for the admin login form. Falls back to the raw message,
 * then to a generic string, so nothing ever surfaces a raw stack trace.
 */
export function friendlyAuthError(err) {
  const msg = (err && err.message) || "";
  const lower = msg.toLowerCase();

  if (!err) return "Something went wrong. Please try again.";
  if (err.name === "TypeError" || lower.includes("failed to fetch") || lower.includes("networkerror")) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (lower.includes("email not confirmed") || lower.includes("confirm")) {
    return "This account's email address hasn't been confirmed yet.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts — please wait a moment and try again.";
  }
  return msg || "Something went wrong. Please try again.";
}
