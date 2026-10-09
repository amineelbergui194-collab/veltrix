/**
 * Official PayPal REST API v2 Server Client
 * Supports Sandbox & Live modes with secure access token generation
 */

function getPayPalConfig() {
  const mode = process.env.PAYPAL_MODE || 'sandbox';
  const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  return { mode, baseUrl, clientId, clientSecret };
}

// Conversion rate for international payment processing via PayPal
// By default, PayPal accounts outside MAD settlement can charge in EUR (1 EUR ~ 10.8 MAD)
const MAD_TO_EUR_RATE = 0.092;

export function isPayPalConfigured() {
  const { clientId, clientSecret } = getPayPalConfig();
  return Boolean(clientId && clientSecret);
}

/**
 * Obtains an OAuth 2.0 access token from PayPal
 */
async function getPayPalAccessToken() {
  const { baseUrl, clientId, clientSecret } = getPayPalConfig();

  if (!clientId || !clientSecret) {
    throw new Error(
      'Identifiants PayPal non configurés. Renseignez PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET dans votre fichier .env.'
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erreur d'authentification PayPal (${response.status}): ${errorData}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Creates a PayPal v2 Checkout Order on the server
 */
export async function createPayPalOrder({ orderId, pricing, customerEmail = null }) {
  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();

  // Determine PayPal currency (EUR by default for global Moroccan cross-border compatibility, or USD)
  const currency = process.env.PAYPAL_CURRENCY || 'EUR';
  let formattedAmount = pricing.totalAmount.toFixed(2);

  if (currency === 'EUR') {
    // Convert MAD to EUR
    const eurAmount = (pricing.totalAmount * MAD_TO_EUR_RATE).toFixed(2);
    formattedAmount = eurAmount;
  }

  const payload = {
    intent: 'CAPTURE',
    payer: customerEmail ? { email_address: customerEmail } : undefined,
    purchase_units: [
      {
        reference_id: orderId,
        custom_id: orderId,
        invoice_id: orderId,
        description: `Veltrix Tech - Commande ${orderId}`,
        amount: {
          currency_code: currency,
          value: formattedAmount,
        },
      },
    ],
    application_context: {
      brand_name: 'Veltrix Tech',
      locale: 'fr-FR',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `${process.env.APP_URL || 'http://localhost:5173'}/checkout?status=success`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:5173'}/checkout?status=cancel`,
    },
  };

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erreur lors de la création de commande PayPal (${response.status}): ${errorBody}`);
  }

  const orderData = await response.json();
  return orderData;
}

/**
 * Captures an approved PayPal order on the server
 * SECURITY RULE: Always capture and verify server-side before marking order paid.
 */
export async function capturePayPalOrder(paypalOrderId) {
  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erreur lors de la capture PayPal (${response.status}): ${errorBody}`);
  }

  const captureData = await response.json();

  if (captureData.status !== 'COMPLETED') {
    throw new Error(`Paiement PayPal non complété : statut reçu "${captureData.status}".`);
  }

  const captureId =
    captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
    captureData.id;

  return {
    success: true,
    status: captureData.status,
    captureId,
    details: captureData,
  };
}

/**
 * Verifies PayPal Webhook event signature
 */
export async function verifyPayPalWebhookSignature(reqHeaders, rawBody, webhookId) {
  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();

  const verificationPayload = {
    auth_algo: reqHeaders['paypal-auth-algo'],
    cert_url: reqHeaders['paypal-cert-url'],
    client_metadata_id: reqHeaders['paypal-client-metadata-id'] || '',
    transmission_id: reqHeaders['paypal-transmission-id'],
    transmission_sig: reqHeaders['paypal-transmission-sig'],
    transmission_time: reqHeaders['paypal-transmission-time'],
    webhook_id: webhookId,
    webhook_event: typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody,
  };

  const response = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verificationPayload),
  });

  if (!response.ok) return false;
  const result = await response.json();
  return result.verification_status === 'SUCCESS';
}
