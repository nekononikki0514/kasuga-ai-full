import { createClient } from '@supabase/supabase-js';
import { sendLineMessage } from '../../../lib/line';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const userId = process.env.LINE_USER_ID || 'nekononikki';
  const today = new Date().toISOString().slice(5, 10); // MM-DD

  const { data, error } = await supabase
    .from('events')
    .select('message')
    .eq('date', today)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(200).json({ skip: true });

  try {
    await sendLineMessage(userId, data.message);
    res.status(200).json({ success: true, message: data.message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

