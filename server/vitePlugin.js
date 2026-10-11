import {
  handleCreatePaymentIntent,
  handleCreatePayPalOrder,
  handleCapturePayPalOrder,
  handleStripeWebhook,
  handlePayPalWebhook,
  handleCreateCodOrder,
  handleGetAdminOrders,
  handleUpdateAdminOrderStatus,
  handleLookupOrder,
  handleGetCodConfig,
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

          const parsedUrl = new URL(req.url, 'http://localhost');
          const path = parsedUrl.pathname;
          const query = Object.fromEntries(parsedUrl.searchParams.entries());

          // 1. Stripe PaymentIntent
          if (path === '/api/create-payment-intent' && req.method === 'POST') {
            const data = await handleCreatePaymentIntent(parsedBody);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          // 2. PayPal Create & Capture Order
          if (path === '/api/paypal/create-order' && req.method === 'POST') {
            const data = await handleCreatePayPalOrder(parsedBody);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          if (path === '/api/paypal/capture-order' && req.method === 'POST') {
            const data = await handleCapturePayPalOrder(parsedBody);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          // 3. Cash on Delivery (COD) Creation
          if (path === '/api/cod/create-order' && req.method === 'POST') {
            const data = await handleCreateCodOrder(parsedBody);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          // 4. COD Zones Configuration
          if (path === '/api/cod/zones' && req.method === 'GET') {
            const data = await handleGetCodConfig();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          // 5. Admin Order Listing
          if (path === '/api/admin/orders' && req.method === 'GET') {
            const data = await handleGetAdminOrders(query);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          // 6. Admin Update Order Status
          if (path === '/api/admin/orders/update-status' && req.method === 'POST') {
            const data = await handleUpdateAdminOrderStatus(parsedBody);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          // 7. Order Real-time Lookup / Tracking
          if (path === '/api/orders/lookup' && req.method === 'GET') {
            const data = await handleLookupOrder(query);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          // 8. Webhooks
          if (path === '/api/webhooks/stripe' && req.method === 'POST') {
            const sig = req.headers['stripe-signature'];
            const data = await handleStripeWebhook(rawBuffer, sig);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          if (path === '/api/webhooks/paypal' && req.method === 'POST') {
            const data = await handlePayPalWebhook(req.headers, rawBuffer);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          }

          next();
        } catch (error) {
          console.error(`[API Dev Error] ${req.url}:`, error.message);
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    },
  };
}
