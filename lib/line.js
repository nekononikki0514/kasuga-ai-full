// lib/line.js
export async function sendLineMessage(userId, message) {
  const body = {
    to: userId,
    messages: [
      {
        type: 'text',
        text: message,
      },
    ],
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
  };

  const response = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('LINE API error:', errorData);
    throw new Error('Failed to send LINE message');
  }
}

