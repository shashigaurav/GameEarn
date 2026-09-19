// lib/gameQueries.js
// Shared read helpers for the /api serverless functions. Every function here maps
// Supabase's snake_case columns onto the exact camelCase shape the existing
// build/pages/*.js templates already render (see data/games.js for the original
// shape) — that's what lets the existing UI/SEO templates keep working unchanged.
const { getSupabaseServerClient } = require("./supabaseServer");

function rewardNote(rewardType) {
  if (!rewardType || rewardType === "None") return "This title does not run a rewards program.";
  return "Reward availability varies by app, region and eligibility. Check the provider's official terms before participating.";
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    category: row.category,
    genre: row.genre || "",
    rating: Number(row.rating) || 0,
    platform: row.platform || "",
    developer: row.developer || "",
    version: row.version || "",
    size: row.size || "",
    releaseDate: row.release_date,
    image: row.image_url,
    icon: row.icon_url,
    screenshots: Array.isArray(row.screenshots) ? row.screenshots : [],
    sourceUrl: row.source_url,
    rewardType: row.reward_type || "None",
    freeToPlay: !!row.free_to_play,
    featured: !!row.featured,
    trending: !!row.trending,
    popular: !!row.popular,
    newRelease: !!row.new_release,
    status: row.status,
    updatedAt: row.updated_at,
    rewardNote: rewardNote(row.reward_type),
  };
}

/**
 * Fetches every published game in one request. Small catalog (dozens, not
 * thousands, of rows) so it's cheaper to fetch once per request and filter
 * in memory for homepage sections than to issue five separate queries.
 */
async function getPublishedGames() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Supabase query failed (games): ${error.message}`);
  return (data || []).map(mapRow);
}

/** Published game by slug, or null if it doesn't exist / isn't published. */
async function getGameBySlug(slug) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Supabase query failed (game by slug): ${error.message}`);
  return data ? mapRow(data) : null;
}

module.exports = { mapRow, getPublishedGames, getGameBySlug };
