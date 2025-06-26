import { loadMemory, saveMemory } from '../../lib/memory';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const apiUrl = "https://api.openai.com/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message, userId } = req.body;
    if (!userId || !message) return res.status(400).json({ error: "Missing userId or message" });

    const memory = loadMemory(userId);
    memory.interaction_count += 1;

    const nameMatch = message.match(/我叫(.{1,5})/);
    if (nameMatch) memory.user_name = nameMatch[1];

    if (message.includes("我是你的製作人") || message.includes("我是製作人") || message.includes("P")) {
      memory.user_role = "製作人";
    }

    if (message.includes("我喜歡")) {
      const favMatch = message.match(/我喜歡(.+?)。|我喜歡(.+)/);
      const favs = (favMatch?.[1] || favMatch?.[2] || "").split(/、|和|以及|,|，/);
      favs.forEach((fav) => {
        if (fav && !memory.favorites.includes(fav.trim())) memory.favorites.push(fav.trim());
      });
    }

    if (message.match(/明天|後天|今天.+(考試|面試|約會|報告)/)) {
      memory.events.push(message);
    }

    saveMemory(userId, memory);

    const name = memory.user_name || "朋友";
    const role = memory.user_role ? `他是我的${memory.user_role}` : "";
    const favorites = memory.favorites.length > 0 ? `他喜歡的東西有：${memory.favorites.join("、")}` : "";
    const events = memory.events.slice(-2).join("、");

    const background = `你是春日未來，一位活潑可愛的少女虛擬偶像。
你講話風格天然呆、有點冒失，喜歡說「欸嘿嘿～」「哇啊～」「ぬふふ～」。
請根據以下這段話，用自然、少女風格、只針對內容來回應，不要加無關的資訊或模板式問候。

使用者叫${name}。${role}。${favorites}。最近他提過：「${events}」。

請回應這句話：「${message}」`;

    const result = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: background }],
        temperature: 0.8
      })
    });

    const data = await result.json();
    const reply = data.choices?.[0]?.message?.content || "欸嘿嘿～我一時不知道該怎麼回呢…";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("chat.js error:", err);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
