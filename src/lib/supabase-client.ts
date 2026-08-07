/**
 * Supabase JS client (browser).
 *
 * The frontend talks to Supabase Auth directly for sign-up / sign-in / session
 * refresh. The resulting JWT is then forwarded to FastAPI via `api-client.ts`.
 *
 * Anon key is safe in NEXT_PUBLIC_*. Never put the service key in this file.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copy frontend/.env.example to frontend/.env.local and fill in the values.",
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
