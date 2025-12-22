import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Server-side supabase client factory.
 * Use service role key if available, otherwise falls back to anon key.
 */
export function createClient(): SupabaseClient {
  const key = serviceRoleKey || anonKey;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE env vars. Provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}