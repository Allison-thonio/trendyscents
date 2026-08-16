import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_URL = 'https://ldctbkxvcktjgpmhqhco.supabase.co'
const DEFAULT_KEY = 'sb_publishable_RfzBnfcv1iTc5OtVwML_rQ_F_4gV-9s'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_KEY

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  DEFAULT_KEY
)
