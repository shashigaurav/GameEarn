// lib/supabaseServer.js
// Used ONLY by files under /api (Node serverless functions running on Vercel).
// Deliberately uses the public anon key — the same key the browser uses — because
// every read this file performs is already allowed for anonymous users under RLS
// (public.games: "published OR admin"). There is no server-side privilege here
// beyond what RLS already grants, and the service_role key is never imported,
// referenced, or required anywhere in this project.
const { createClient } = require("@supabase/supabase-js");

let cached = null;

function getSupabaseServerClient() {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_ANON_KEY environment variables. Set them in your Vercel project settings (see README)."
    );
  }

  cached = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

module.exports = { getSupabaseServerClient };
