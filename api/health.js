// api/health.js
// Visit /api/health after deploying (or via `vercel dev` locally) to get a real,
// live check of your Supabase setup. This runs server-side on Vercel, so it
// actually contacts your project — unlike a claim made without network access.
//
// Uses only the anon key (via lib/supabaseServer.js), so it reports exactly what
// an anonymous visitor's queries would see — the same thing RLS enforces for them.
const { createClient } = require("@supabase/supabase-js");

module.exports = async function handler(req, res) {
  const checks = {};
  const errors = [];

  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  checks.envVarsPresent = Boolean(url && anonKey);
  if (!checks.envVarsPresent) {
    errors.push(
      "VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are not set in this environment. Add them in Vercel → Project Settings → Environment Variables, then redeploy."
    );
    res.status(200).json({ ok: false, checks, errors });
    return;
  }

  checks.urlLooksValid = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url.trim());
  if (!checks.urlLooksValid) {
    errors.push(`VITE_SUPABASE_URL doesn't look like a Supabase project URL (got: "${url}"). It should look like https://xxxxx.supabase.co`);
  }

  let supabase;
  try {
    supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  } catch (err) {
    errors.push(`Failed to create Supabase client: ${err.message}`);
    res.status(200).json({ ok: false, checks, errors });
    return;
  }

  // Reachability + RLS check: this SELECT should succeed (return 0+ rows) for
  // an anonymous caller once schema.sql has been run, regardless of whether
  // any games exist yet.
  try {
    const { count, error } = await supabase.from("games").select("id", { count: "exact", head: true }).eq("status", "published");
    if (error) {
      checks.gamesTableReachable = false;
      errors.push(`Query against "games" failed: ${error.message}. Common causes: schema.sql hasn't been run yet, or the anon key/project URL is wrong.`);
    } else {
      checks.gamesTableReachable = true;
      checks.publishedGamesCount = count ?? 0;
    }
  } catch (err) {
    checks.gamesTableReachable = false;
    errors.push(`Network error reaching Supabase: ${err.message}`);
  }

  // Auth reachability (doesn't require a logged-in user — just confirms the
  // Auth API responds for this project/key combination).
  try {
    const { error } = await supabase.auth.getSession();
    checks.authReachable = !error;
    if (error) errors.push(`Auth API check failed: ${error.message}`);
  } catch (err) {
    checks.authReachable = false;
    errors.push(`Network error reaching Supabase Auth: ${err.message}`);
  }

  const ok = checks.envVarsPresent && checks.urlLooksValid && checks.gamesTableReachable && checks.authReachable;

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    ok,
    checks,
    errors,
    note: "This reflects what an anonymous visitor's browser can see — the same access RLS grants them. It does not use or check the service_role key, which this project never uses.",
  });
};
