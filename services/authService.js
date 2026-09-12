// services/authService.js
// Thin wrapper around Supabase Auth for the admin panel. This is a UX convenience layer
// only — the real authorization boundary is the RLS policies in supabase/schema.sql
// (games INSERT/UPDATE/DELETE require public.is_admin()). Nothing in this file grants
// access on its own; it just helps the UI decide what to show/hide and where to redirect.
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
  const { data, error } = await supabase.from("profiles").select("id, email, role").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function isCurrentUserAdmin() {
  const user = await getSessionUser();
  if (!user) return { user: null, isAdmin: false };
  const profile = await getOwnProfile(user.id);
  return { user, isAdmin: profile ? profile.role === "admin" : false, profile };
}
