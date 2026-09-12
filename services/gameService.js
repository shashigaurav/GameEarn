// services/gameService.js
// All calls here run as the logged-in admin's own session. Supabase RLS (see
// supabase/schema.sql) is what actually allows or denies each operation — this
// file has no special privilege of its own, and never touches the service_role key.
import { supabase } from "../lib/supabaseClient.js";

const BUCKET = "game-assets";

export async function getDashboardCounts() {
  const counts = {};
  const queries = {
    total: supabase.from("games").select("id", { count: "exact", head: true }),
    published: supabase.from("games").select("id", { count: "exact", head: true }).eq("status", "published"),
    draft: supabase.from("games").select("id", { count: "exact", head: true }).eq("status", "draft"),
    featured: supabase.from("games").select("id", { count: "exact", head: true }).eq("featured", true),
    trending: supabase.from("games").select("id", { count: "exact", head: true }).eq("trending", true),
  };
  for (const [key, query] of Object.entries(queries)) {
    const { count, error } = await query;
    if (error) throw error;
    counts[key] = count || 0;
  }
  return counts;
}

export async function listGamesForAdmin({ search = "", category = "", status = "", sort = "newest", page = 1, pageSize = 10 } = {}) {
  let query = supabase.from("games").select("*", { count: "exact" });

  if (search) query = query.ilike("name", `%${search}%`);
  if (category) query = query.eq("category", category);
  if (status) query = query.eq("status", status);

  if (sort === "name") query = query.order("name", { ascending: true });
  else if (sort === "rating") query = query.order("rating", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { games: data || [], total: count || 0 };
}

export async function getGameById(id) {
  const { data, error } = await supabase.from("games").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function slugExists(slug, excludeId = null) {
  let query = supabase.from("games").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function createGame(payload) {
  const { data, error } = await supabase.from("games").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateGame(id, payload) {
  const { data, error } = await supabase.from("games").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteGame(id) {
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Uploads a single file to `game-assets/{gameId}/{kind}/{filename}` and returns its
 * public URL. `kind` is one of "icon" | "cover" | "screenshots".
 */
export async function uploadGameAsset(gameId, file, kind) {
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${gameId}/${kind}/${Date.now()}-${cleanName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, cacheControl: "3600" });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
