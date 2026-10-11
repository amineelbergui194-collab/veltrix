import { handleGetAdminOrders } from '../../server/apiHandlers.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez GET.' });
  }

  try {
    const result = await handleGetAdminOrders(req.query || {});
    return res.status(200).json(result);
  } catch (error) {
    console.error('API admin/orders error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
