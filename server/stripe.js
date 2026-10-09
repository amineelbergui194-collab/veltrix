import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
export const stripeClient = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

/**
 * Creates a Stripe PaymentIntent for Cards & Apple Pay
 */
export async function createStripePaymentIntent({
  orderId,
  pricing,
  userId = null,
  customerEmail = null,
  idempotencyKey = null,
}) {
  if (!stripeClient) {
    throw new Error(
      'STRIPE_SECRET_KEY non configurée sur le serveur. Veuillez renseigner votre clé secrète Stripe dans le fichier .env.'
    );
  }

  // Stripe requires amount in smallest currency unit (cents/centimes)
  // For MAD (Moroccan Dirham), 1 MAD = 100 centimes
  const amountInCents = Math.round(pricing.totalAmount * 100);

  const paymentIntentParams = {
    amount: amountInCents,
    currency: 'mad',
    automatic_payment_methods: {
      enabled: true, // Enables Credit/Debit Cards, Apple Pay on compatible devices
    },
    metadata: {
      orderId,
      userId: userId || 'guest',
      customerEmail: customerEmail || 'unknown',
      subtotalMAD: pricing.subtotal.toString(),
      totalMAD: pricing.totalAmount.toString(),
    },
    receipt_email: customerEmail || undefined,
    description: `Veltrix Tech - Commande ${orderId}`,
  };

  const requestOptions = idempotencyKey ? { idempotencyKey } : {};

  const paymentIntent = await stripeClient.paymentIntents.create(
    paymentIntentParams,
    requestOptions
  );

  return paymentIntent;
}

/**
 * Verifies a Stripe Webhook signature
 */
export function verifyStripeWebhookSignature(rawBody, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeClient || !webhookSecret) {
    throw new Error('Stripe ou STRIPE_WEBHOOK_SECRET non configuré.');
  }

  return stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
}
