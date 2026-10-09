import { calculateOrderPrice } from './pricing.js';
import { createStripePaymentIntent, verifyStripeWebhookSignature } from './stripe.js';
import { createPayPalOrder, capturePayPalOrder, verifyPayPalWebhookSignature } from './paypal.js';
import { persistOrder, markOrderPaid } from './supabaseAdmin.js';

/**
 * Generates unique order identifier (e.g., VELT-2026-98172)
 */
export function generateOrderId() {
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `VELT-2026-${randomPart}`;
}

/**
 * 1. POST /api/create-payment-intent
 * Calculates total on server, initializes order in database, returns Stripe clientSecret
 */
export async function handleCreatePaymentIntent(body) {
  const { items, shippingMethod, promoCode, userId, customerEmail, shippingAddress } = body;

  // 1. Calculate price securely on server
  const pricing = calculateOrderPrice({ items, shippingMethod, promoCode });
  const orderId = generateOrderId();
  const idempotencyKey = `stripe_${orderId}_${pricing.totalAmount}`;

  // 2. Persist pending order to Supabase
  await persistOrder({
    orderId,
    userId,
    guestEmail: customerEmail,
    status: 'pending',
    paymentProvider: 'stripe',
    pricing,
    shippingAddress,
    idempotencyKey,
  });

  // 3. Create Stripe PaymentIntent
  const paymentIntent = await createStripePaymentIntent({
    orderId,
    pricing,
    userId,
    customerEmail,
    idempotencyKey,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    orderId,
    totalAmount: pricing.totalAmount,
    currency: pricing.currency,
  };
}

/**
 * 2. POST /api/paypal/create-order
 * Calculates price on server, initializes order in database, creates PayPal v2 order
 */
export async function handleCreatePayPalOrder(body) {
  const { items, shippingMethod, promoCode, userId, customerEmail, shippingAddress } = body;

  // 1. Calculate price securely on server
  const pricing = calculateOrderPrice({ items, shippingMethod, promoCode });
  const orderId = generateOrderId();
  const idempotencyKey = `paypal_${orderId}_${pricing.totalAmount}`;

  // 2. Persist pending order in Supabase
  await persistOrder({
    orderId,
    userId,
    guestEmail: customerEmail,
    status: 'pending',
    paymentProvider: 'paypal',
    pricing,
    shippingAddress,
    idempotencyKey,
  });

  // 3. Call PayPal REST API v2
  const paypalOrder = await createPayPalOrder({
    orderId,
    pricing,
    customerEmail,
  });

  return {
    id: paypalOrder.id,
    orderId,
    totalAmount: pricing.totalAmount,
    currency: pricing.currency,
  };
}

/**
 * 3. POST /api/paypal/capture-order
 * Captures order on server, validates COMPLETED status, marks order paid in database
 */
export async function handleCapturePayPalOrder(body) {
  const { paypalOrderId, orderId } = body;
  if (!paypalOrderId) {
    throw new Error('Identifiant de commande PayPal manquant.');
  }

  // 1. Capture on PayPal server
  const captureResult = await capturePayPalOrder(paypalOrderId);

  // 2. Mark order as paid in Supabase
  const dbUpdate = await markOrderPaid({
    orderId,
    providerPaymentId: captureResult.captureId,
  });

  return {
    success: true,
    orderId,
    captureId: captureResult.captureId,
    status: captureResult.status,
    dbUpdated: dbUpdate.success,
  };
}

/**
 * 4. POST /api/webhooks/stripe
 * Verifies cryptographic signature, handles payment_intent.succeeded
 */
export async function handleStripeWebhook(rawBody, signature) {
  const event = verifyStripeWebhookSignature(rawBody, signature);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      const receiptUrl = paymentIntent.charges?.data?.[0]?.receipt_url || null;

      if (orderId) {
        await markOrderPaid({
          orderId,
          providerPaymentId: paymentIntent.id,
          receiptUrl,
        });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      // Log failure and optionally flag order
      console.warn(`Payment failed for PaymentIntent: ${event.data.object.id}`);
      break;
    }
  }

  return { received: true };
}

/**
 * 5. POST /api/webhooks/paypal
 * Verifies PayPal signature, handles PAYMENT.CAPTURE.COMPLETED
 */
export async function handlePayPalWebhook(headers, rawBody) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    throw new Error('PAYPAL_WEBHOOK_ID non configuré.');
  }

  const isValid = await verifyPayPalWebhookSignature(headers, rawBody, webhookId);
  if (!isValid) {
    throw new Error('Signature webhook PayPal invalide.');
  }

  const event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;

  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const capture = event.resource;
    const orderId = capture.custom_id || capture.invoice_id;
    if (orderId) {
      await markOrderPaid({
        orderId,
        providerPaymentId: capture.id,
      });
    }
  }

  return { received: true };
}
