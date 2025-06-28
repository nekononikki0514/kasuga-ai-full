import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';
import { sendLineMessage } from '../../../lib/line';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export default async function handler(req, res) {
  const userId = process.env.LINE_USER_ID || 'nekononikki';

  const { data, error } = await supabase
    .from('memory')
    .select('content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) return res.status(500).json({ error: error.message });

  const memorySummary = data.map(d => d.content).join('；');
  const prompt = `以下是使用者的近期記憶摘要：「${memorySummary}」。請以春日未來的語氣，產生一段自然的話語來回應。`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    const message = completion.data.choices[0].message.content;
    await sendLineMessage(userId, message);

    res.status(200).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

