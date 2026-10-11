import { handleUpdateAdminOrderStatus } from '../../server/apiHandlers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const result = await handleUpdateAdminOrderStatus(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('API admin/update-status error:', error.message);
    return res.status(400).json({ error: error.message });
  }
}
