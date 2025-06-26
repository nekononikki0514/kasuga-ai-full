export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  return res.status(200).json({ success: true, message: "LINE webhook 已連接成功（尚未實作訊息處理）" });
}
