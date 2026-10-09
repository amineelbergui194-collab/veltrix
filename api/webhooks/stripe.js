import { handleStripeWebhook } from '../../server/apiHandlers.js';

// Configuration for Vercel Serverless Function to receive raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'En-tête stripe-signature manquant' });
  }

  try {
    const rawBody = await getRawBody(req);
    const result = await handleStripeWebhook(rawBody, sig);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Webhook Stripe Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
