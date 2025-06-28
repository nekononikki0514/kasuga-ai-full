import { fetchLatestPostsFromX } from '../../../lib/xFetcher';
import { generateFutureStyleMessage } from '../../../lib/futureNarration';
import { sendLineMessage } from '../../../lib/line';

export default async function handler(req, res) {
  const userId = process.env.LINE_USER_ID || 'nekononikki';

  try {
    const posts = await fetchLatestPostsFromX();
    if (!posts.length) {
      return res.status(200).json({ skip: true });
    }

    const summary = generateFutureStyleMessage(posts);
    await sendLineMessage(userId, summary);

    res.status(200).json({ success: true, message: summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

