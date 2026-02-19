import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client if env vars are missing (for development)
const createDummyClient = () => {
  console.warn("Supabase environment variables not set. Using dummy client.");
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {
              /* no-op */
            },
          },
        },
      }),
      signInWithPassword: async () => ({
        error: new Error("Supabase not configured"),
      }),
      signUp: async () => ({
        error: new Error("Supabase not configured"),
        data: { user: null },
      }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({ data: [], error: null }),
          }),
          single: () => ({ data: null, error: null }),
        }),
        order: () => ({
          limit: () => ({ data: [], error: null }),
        }),
      }),
      insert: async () => ({ error: null }),
    }),
  } as unknown as ReturnType<typeof createClient<Database>>;
};

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : createDummyClient();
