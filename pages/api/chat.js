import { supabase } from '../../lib/supabaseClient';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { userId, message } = req.body;

  const { data: history } = await supabase
    .from('history')
    .select('role, content')
    .eq('userid', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  const messages = (history || []).reverse().map(h => ({
    role: h.role,
    content: h.content
  }));

  messages.push({ role: 'user', content: message });

  const gptRes = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.85
  });

  const reply = gptRes.choices[0].message.content.trim();

  await supabase.from('history').insert([
    { userid: userId, role: 'user', content: message },
    { userid: userId, role: 'assistant', content: reply }
  ]);

  res.status(200).json({ reply });
}

