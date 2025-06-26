// pages/api/chat.js

import { createClient } from '@supabase/supabase-js';
import { reply } from '../../lib/reply';

const supabase = createClient(
  process.env.SUPABASE_BASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ error: 'Missing userId or message' });

  // 擷取最近記憶
  const { data: memoryData } = await supabase
    .from('memory_interactions')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();

  const context = memoryData?.content || '';
  const related = memoryData?.target || '';

  const text = reply({
    topic: message,
    context,
    related
  });

  return res.status(200).json({ text });
}
