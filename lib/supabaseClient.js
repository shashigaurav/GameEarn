// js/admin/supabase-client.js
// Loaded as an ES module. Uses esm.sh to pull the official @supabase/supabase-js
// package straight into the browser with no bundler/build step required — this
// project intentionally has no client-side JS build pipeline.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const env = window.__GAMEEARN_ENV || {};

export const isConfigured = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);

// Only ever the public anon key here — same key RLS already treats as
// "anonymous or authenticated user", never the service_role key.
export const supabase = isConfigured
  ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  : null;

export function configWarningHtml() {
  return `<div class="config-warning">
    <strong>Supabase isn't configured yet.</strong> Set <code>SUPABASE_URL</code> and
    <code>SUPABASE_ANON_KEY</code> in your Vercel project's Environment Variables (see the
    README), then redeploy so the build step can inject them into <code>/js/env-config.js</code>.
  </div>`;
}
