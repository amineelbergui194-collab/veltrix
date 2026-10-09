import {
  handleCreatePaymentIntent,
  handleCreatePayPalOrder,
  handleCapturePayPalOrder,
  handleStripeWebhook,
  handlePayPalWebhook,
} from './apiHandlers.js';

export function veltrixApiPlugin() {
  return {
    name: 'veltrix-api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        try {
          // Collect request body
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          const rawBuffer = Buffer.concat(chunks);
          let parsedBody = {};
          if (rawBuffer.length > 0) {
            try {
              parsedBody = JSON.parse(rawBuffer.toString('utf-8'));
            } catch {
              parsedBody = rawBuffer.toString('utf-8');
            }
          }

          const url = req.url.split('?')[0];

          if (url === '/api/create-payment-intent' && req.method === 'POST') {
            const data = await handleCreatePaymentIntent(parsedBody);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          if (url === '/api/paypal/create-order' && req.method === 'POST') {
            const data = await handleCreatePayPalOrder(parsedBody);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          if (url === '/api/paypal/capture-order' && req.method === 'POST') {
            const data = await handleCapturePayPalOrder(parsedBody);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          if (url === '/api/webhooks/stripe' && req.method === 'POST') {
            const sig = req.headers['stripe-signature'];
            const data = await handleStripeWebhook(rawBuffer, sig);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          if (url === '/api/webhooks/paypal' && req.method === 'POST') {
            const data = await handlePayPalWebhook(req.headers, rawBuffer);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          next();
        } catch (error) {
          console.error(`[API Dev Error] ${req.url}:`, error.message);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    },
  };
}
