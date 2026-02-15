import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/lib/database.types";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const createSupabaseClient = (
  accessToken?: string
): SupabaseClient<Database> => {
  if (!(supabaseUrl && supabaseAnonKey)) {
    throw new Error("Supabase environment variables belum diatur.");
  }

  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { headers },
  });
};
