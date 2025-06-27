import { createClient } from '@supabase/supabase-js'

// 使用後端環境的 URL 為優先，否則允許前端 fallback
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL

// 若有高權限金鑰，使用 service；否則使用安全的 anon key
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

