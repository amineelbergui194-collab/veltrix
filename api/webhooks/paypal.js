import { handlePayPalWebhook } from '../../server/apiHandlers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await handlePayPalWebhook(req.headers, req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Webhook PayPal Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
