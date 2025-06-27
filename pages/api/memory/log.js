import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,  // ✅ 使用統一命名
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY  // ✅ 支援寫入與只查詢
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { user_id, target, event_type, content } = req.body
  if (!user_id || !content) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { error } = await supabase.from('memory_interactions').insert({
    user_id,
    target,
    event_type,
    content
  })

  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json({ success: true })
}

