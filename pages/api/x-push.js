// pages/api/x-push.js
import { fetchLatestPostsFromX } from '@/lib/xFetcher';
import { generateFutureStyleMessage } from '@/lib/futureNarration';
import { sendLineMessage } from '@/lib/line';

export default async function handler(req, res) {
  const userId = process.env.LINE_USER_ID || 'nekononikki';

  try {
    const posts = await fetchLatestPostsFromX();
    const message = generateFutureStyleMessage(posts);
    await sendLineMessage(userId, message);

    res.status(200).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}