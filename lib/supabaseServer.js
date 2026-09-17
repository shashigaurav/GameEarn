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

  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    const err = new Error(
      "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY environment variables. Set them in Vercel → Project Settings → Environment Variables (make sure they're enabled for the Production environment specifically, not just Preview/Development), then redeploy."
    );
    // Marked as safe to show verbatim even in production — it names only
    // environment *variable names*, never a value, key, or stack trace.
    err.safeToDisplay = true;
    throw err;
  }

  cached = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

module.exports = { getSupabaseServerClient };
