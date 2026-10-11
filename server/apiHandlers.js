import { calculateOrderPrice } from './pricing.js';
import { createStripePaymentIntent, verifyStripeWebhookSignature } from './stripe.js';
import { createPayPalOrder, capturePayPalOrder, verifyPayPalWebhookSignature } from './paypal.js';
import { persistOrder, markOrderPaid } from './supabaseAdmin.js';
import { isCodAvailableForZone, COD_CONFIGURATION } from './codConfig.js';
import {
  saveOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  checkDuplicateOrder,
} from './orderStore.js';

/**
 * Generates unique order identifier (e.g., VELT-2026-98172)
 */
export function generateOrderId() {
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `VELT-2026-${randomPart}`;
}

/**
 * Valide le format d'un numéro de téléphone
 */
export function isValidPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 8 || digitsOnly.length > 15) return false;
  return /^(\+?[0-9\s\-.\(\)]{8,20})$/.test(phone.trim());
}

/**
 * Valide la complétude de l'adresse de livraison
 */
export function isValidAddress(address) {
  if (!address || typeof address !== 'string') return false;
  return address.trim().length >= 5;
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

  // 2. Persist pending order to database & unified store
  await saveOrder({
    orderId,
    userId,
    customerEmail,
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

  // 2. Persist pending order
  await saveOrder({
    orderId,
    userId,
    customerEmail,
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

  // 2. Mark order as paid in store
  await updateOrderStatus(orderId, {
    status: 'paid',
    providerPaymentId: captureResult.captureId,
  });

  return {
    success: true,
    orderId,
    captureId: captureResult.captureId,
    status: captureResult.status,
    dbUpdated: true,
  };
}

/**
 * 4. POST /api/cod/create-order
 * Traite et enregistre une commande avec Paiement à la Livraison (Cash on Delivery)
 *
 * RÈGLES DE SÉCURITÉ & FONCTIONNEMENT :
 * - Validation stricte des coordonnées (Nom, Prénom, Téléphone, Adresse, Ville, Pays)
 * - Validation de la zone de livraison et de l'éligibilité au service d'encaissement en espèces
 * - Calcul sécurisé des prix et frais de livraison côté serveur
 * - Protection anti-doublon / idempotence
 * - Statut initial strict : 'pending_payment' (« En attente de paiement »)
 * - Notification de confirmation enregistrée
 */
export async function handleCreateCodOrder(body) {
  const {
    items,
    shippingMethod = 'standard',
    promoCode = null,
    userId = null,
    customerEmail = null,
    shippingAddress = {},
    deliveryNotes = '',
    idempotencyKey = null,
  } = body || {};

  // 1. Vérification des articles du panier
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Le panier est vide. Veuillez ajouter au moins un produit.');
  }

  // 2. Vérification des champs obligatoires du destinataire
  const firstName = (shippingAddress.firstName || '').trim();
  const lastName = (shippingAddress.lastName || '').trim();
  const phone = (shippingAddress.phone || '').trim();
  const address = (shippingAddress.address || '').trim();
  const city = (shippingAddress.city || '').trim();
  const country = (shippingAddress.country || 'Morocco').trim();
  const zip = (shippingAddress.zip || '').trim();
  const apartment = (shippingAddress.apartment || '').trim();

  if (!firstName || firstName.length < 2) {
    throw new Error('Veuillez renseigner un prénom valide pour la livraison.');
  }
  if (!lastName || lastName.length < 2) {
    throw new Error('Veuillez renseigner un nom de famille valide pour la livraison.');
  }
  if (!phone || !isValidPhoneNumber(phone)) {
    throw new Error(
      'Numéro de téléphone invalide. Un numéro valide est requis pour que le livreur puisse vous contacter avant son passage.'
    );
  }
  if (!address || !isValidAddress(address)) {
    throw new Error('Adresse de livraison incomplète. Veuillez indiquer le nom de rue et le numéro.');
  }
  if (!city || city.length < 2) {
    throw new Error('Veuillez spécifier la ville de destination.');
  }

  // 3. Vérification de l'éligibilité de la zone de livraison (Pays & Ville)
  const zoneCheck = isCodAvailableForZone(country, city);
  if (!zoneCheck.available) {
    throw new Error(
      zoneCheck.reason ||
        `Le paiement à la livraison n’est pas disponible pour la zone « ${city}, ${country} ».\nVeuillez choisir une autre méthode de paiement (Carte Bancaire ou PayPal) ou modifier votre adresse.`
    );
  }

  // 4. Calcul sécurisé du prix côté serveur
  const pricing = calculateOrderPrice({ items, shippingMethod, promoCode });

  // 5. Vérification du plafond de sécurité en espèces
  if (pricing.totalAmount > COD_CONFIGURATION.maxOrderAmount) {
    throw new Error(
      `Le montant total de la commande (${pricing.totalAmount} DH) dépasse le plafond autorisé pour le paiement en espèces à la livraison (${COD_CONFIGURATION.maxOrderAmount} DH). Veuillez régler par Carte Bancaire ou réduire la quantité.`
    );
  }

  // 6. Protection anti-doublon / idempotence
  const clientKey = idempotencyKey || `cod_${phone.replace(/\D/g, '')}_${pricing.totalAmount}`;
  const duplicate = checkDuplicateOrder({
    customerPhone: phone,
    totalAmount: pricing.totalAmount,
    idempotencyKey: clientKey,
  });

  if (duplicate) {
    return {
      success: true,
      orderId: duplicate.id,
      totalAmount: duplicate.total_amount,
      subtotal: duplicate.subtotal,
      shippingCost: duplicate.shipping_cost,
      discountAmount: duplicate.discount_amount,
      currency: duplicate.currency,
      status: duplicate.status,
      paymentMethod: 'cod',
      shippingAddress: duplicate.shipping_address,
      message: 'Votre commande a déjà été enregistrée avec succès.',
      isDuplicateSubmission: true,
    };
  }

  // 7. Génération de l'identifiant unique de commande
  const orderId = generateOrderId();

  // 8. Préparation de l'enregistrement de la commande
  const fullShippingAddress = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    phone,
    email: customerEmail || shippingAddress.email || 'client@veltrix.tech',
    address,
    apartment,
    city,
    state: shippingAddress.state || city,
    zip: zip || '20000',
    country,
    deliveryNotes: deliveryNotes.trim(),
  };

  const orderRecord = {
    id: orderId,
    userId,
    customerEmail: fullShippingAddress.email,
    // STATUT STRICTEMENT 'pending_payment' : en attente de paiement en espèces à la livraison
    status: 'pending_payment',
    paymentProvider: 'cod',
    providerOrderId: null,
    providerPaymentId: null, // Nul tant que le livreur n'a pas encaissé l'argent
    pricing,
    shippingAddress: fullShippingAddress,
    idempotencyKey: clientKey,
    metadata: {
      paymentMethodName: 'Paiement à la livraison (Cash on Delivery)',
      paymentInstructions: 'Payer en espèces au moment de la réception du colis.',
      estimatedDeliveryTime: zoneCheck.zone?.estimatedDeliveryTime || '24h à 48h ouvrées',
      carrier: zoneCheck.zone?.courierPartners?.[0] || 'Veltrix Express',
      shippingMethodSelected: shippingMethod,
      orderCreatedAt: new Date().toISOString(),
    },
  };

  // 9. Enregistrement dans le gestionnaire de commandes persistant (Local + Supabase)
  const saved = await saveOrder(orderRecord);

  // 10. Journalisation de la notification client
  console.log(
    `[Notification Commande COD] Commande ${orderId} validée pour ${fullShippingAddress.fullName} (${fullShippingAddress.phone}) à ${city}. Montant à encaisser : ${pricing.totalAmount} ${pricing.currency}.`
  );

  return {
    success: true,
    orderId,
    totalAmount: pricing.totalAmount,
    subtotal: pricing.subtotal,
    shippingCost: pricing.shippingCost,
    discountAmount: pricing.discountAmount,
    currency: pricing.currency,
    status: 'pending_payment',
    paymentMethod: 'cod',
    shippingAddress: fullShippingAddress,
    estimatedDeliveryTime: orderRecord.metadata.estimatedDeliveryTime,
    message: 'Votre commande a été confirmée ! Préparez le montant exact en espèces à la réception de votre colis.',
    order: saved,
  };
}

/**
 * 5. GET /api/admin/orders
 * Permet à l'administrateur de consulter toutes les commandes (filtrées par statut ou recherche)
 */
export async function handleGetAdminOrders(query = {}) {
  const { status = 'all', search = '', limit = 100 } = query;
  const orders = await getAllOrders({
    status,
    search,
    limit: parseInt(limit, 10) || 100,
  });

  // Calcul des métriques pour le tableau de bord admin
  const allOrders = await getAllOrders({ status: 'all', limit: 1000 });
  const metrics = {
    totalOrders: allOrders.length,
    pendingCodOrders: allOrders.filter(
      (o) => o.payment_provider === 'cod' && (o.status === 'pending_payment' || o.status === 'pending')
    ).length,
    paidOrders: allOrders.filter((o) => o.status === 'paid').length,
    deliveredOrders: allOrders.filter((o) => o.status === 'delivered').length,
    totalRevenue: allOrders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0),
  };

  return {
    success: true,
    orders,
    metrics,
  };
}

/**
 * 6. POST /api/admin/orders/update-status
 * Permet à l'administrateur de mettre à jour le statut et de marquer le paiement comme effectué
 */
export async function handleUpdateAdminOrderStatus(body = {}) {
  const { orderId, status, adminNotes, providerPaymentId } = body;

  if (!orderId) {
    throw new Error('Identifiant de commande manquant.');
  }
  if (!status) {
    throw new Error('Nouveau statut manquant.');
  }

  const validStatuses = [
    'pending_payment',
    'pending',
    'processing',
    'shipped',
    'delivered',
    'paid',
    'cancelled',
  ];

  if (!validStatuses.includes(status)) {
    throw new Error(`Statut invalide : ${status}. Statuts autorisés : ${validStatuses.join(', ')}`);
  }

  const updated = await updateOrderStatus(orderId, {
    status,
    adminNotes,
    providerPaymentId,
  });

  return {
    success: true,
    order: updated,
    message: `Statut de la commande ${orderId} mis à jour : ${status}`,
  };
}

/**
 * 7. GET /api/orders/lookup
 * Permet au client de rechercher et suivre une commande en temps réel
 */
export async function handleLookupOrder(query = {}) {
  const { orderId } = query;
  if (!orderId) {
    throw new Error('Numéro de commande manquant.');
  }

  const order = await getOrderById(orderId);
  if (!order) {
    throw new Error(`Aucune commande trouvée sous la référence « ${orderId} ».`);
  }

  return {
    success: true,
    order: {
      id: order.id,
      status: order.status,
      paymentProvider: order.payment_provider,
      totalAmount: order.total_amount,
      currency: order.currency,
      createdAt: order.created_at,
      shippingAddress: {
        city: order.shipping_address?.city,
        country: order.shipping_address?.country,
      },
      itemsCount: order.items?.length || 0,
    },
  };
}

/**
 * 8. GET /api/cod/zones
 * Renvoie la configuration des zones et des tarifs pour le paiement à la livraison
 */
export async function handleGetCodConfig() {
  return {
    success: true,
    config: COD_CONFIGURATION,
  };
}

/**
 * 9. POST /api/webhooks/stripe
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
        await updateOrderStatus(orderId, {
          status: 'paid',
          providerPaymentId: paymentIntent.id,
        });
        await markOrderPaid({
          orderId,
          providerPaymentId: paymentIntent.id,
          receiptUrl,
        });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      console.warn(`Payment failed for PaymentIntent: ${event.data.object.id}`);
      break;
    }
  }

  return { received: true };
}

/**
 * 10. POST /api/webhooks/paypal
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
      await updateOrderStatus(orderId, {
        status: 'paid',
        providerPaymentId: capture.id,
      });
      await markOrderPaid({
        orderId,
        providerPaymentId: capture.id,
      });
    }
  }

  return { received: true };
}
