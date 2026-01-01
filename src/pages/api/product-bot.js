export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const upstream = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/product-bot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Bot proxy failed' });
  }
}