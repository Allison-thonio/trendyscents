import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ldctbkxvcktjgpmhqhco.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_RfzBnfcv1iTc5OtVwML_rQ_F_4gV-9s";

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);
