import axios from 'axios';

export default async function handler(req, res) {
  const events = req.body.events;

  await Promise.all(events.map(async (event) => {
    if (event.type === 'message') {
      const userId = event.source.userId;
      const message = event.message.text;

      const chatRes = await axios.post(`${process.env.BASE_URL}/api/chat`, {
        userId,
        message
      });

      await axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: chatRes.data.reply }]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
    }
  }));

  res.status(200).end();
}

