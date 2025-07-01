import { supabase } from '../../lib/supabaseClient';
import { reply } from '../../lib/reply';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing userId or message' });
  }

  // 抓取使用者最近一筆記憶（上下文＋目標對象）
  const { data: memoryData } = await supabase
    .from('memory_interactions')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();

  const context = memoryData?.content || '';
  const related = memoryData?.target || '';

  // 預設為 distant（陌生），如果有目標對象才查詢 affinity
  let affinity = 'distant';
  if (related) {
    const { data: characterData } = await supabase
      .from('characters_with_affinity')
      .select('affinity')
      .eq('name', related)
      .maybeSingle();

    if (characterData?.affinity) {
      affinity = characterData.affinity;
    }
  }
console.log("✅ 進入 chat.js，收到訊息：", message);
  const text = reply({
    user: '製作人',
    topic: message,
    context,
    related,
    affinity
  });
console.log("✅ reply() 輸出為：", text);
  return res.status(200).json({ text });
}

// trigger deploy
