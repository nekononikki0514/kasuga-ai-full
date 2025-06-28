import { sendLineMessage } from '../../lib/line';

export default async function handler(req, res) {
  const userId = process.env.LINE_USER_ID || 'nekononikki';
  const message = '早安～今天也要元氣滿滿喔～！☀️✨';

  try {
    await sendLineMessage(userId, message);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

