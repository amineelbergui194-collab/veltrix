import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { supabaseAdmin, persistOrder, markOrderPaid as supabaseMarkOrderPaid } from './supabaseAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Assure que le dossier data/ existe
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Lecture sécurisée des commandes locales
export function readLocalOrders() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('Erreur lecture orders.json:', err.message);
    return [];
  }
}

// Écriture atomique et sécurisée des commandes locales
export function writeLocalOrders(orders) {
  ensureDataDir();
  try {
    const tempFile = `${ORDERS_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(orders, null, 2), 'utf-8');
    fs.renameSync(tempFile, ORDERS_FILE);
    return true;
  } catch (err) {
    console.error('Erreur écriture orders.json:', err.message);
    return false;
  }
}

/**
 * Vérifie si une commande identique a été passée récemment (protection anti-doublon / idempotence)
 */
export function checkDuplicateOrder({ customerPhone, totalAmount, idempotencyKey }) {
  const orders = readLocalOrders();
  const now = Date.now();

  return orders.find((o) => {
    // Si la clé d'idempotence correspond exactement
    if (idempotencyKey && o.idempotency_key === idempotencyKey) {
      return true;
    }

    // Si même numéro de téléphone et même montant total dans les 45 dernières secondes
    if (
      o.shipping_address?.phone &&
      customerPhone &&
      o.shipping_address.phone.replace(/\s+/g, '') === customerPhone.replace(/\s+/g, '') &&
      Math.abs(o.total_amount - totalAmount) < 0.01
    ) {
      const orderTime = new Date(o.created_at).getTime();
      if (now - orderTime < 45000) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Enregistre une commande avec persistance garantie (Local + Supabase)
 */
export async function saveOrder(orderRecord) {
  const orders = readLocalOrders();

  const formattedOrder = {
    id: orderRecord.id || orderRecord.orderId,
    user_id: orderRecord.userId || orderRecord.user_id || null,
    guest_email: orderRecord.customerEmail || orderRecord.guest_email || null,
    status: orderRecord.status || 'pending_payment',
    payment_provider: orderRecord.paymentProvider || orderRecord.payment_provider || 'cod',
    provider_order_id: orderRecord.providerOrderId || orderRecord.provider_order_id || null,
    provider_payment_id: orderRecord.providerPaymentId || orderRecord.provider_payment_id || null,
    subtotal: orderRecord.pricing ? orderRecord.pricing.subtotal : orderRecord.subtotal || 0,
    discount_amount: orderRecord.pricing ? orderRecord.pricing.discountAmount : orderRecord.discount_amount || 0,
    shipping_cost: orderRecord.pricing ? orderRecord.pricing.shippingCost : orderRecord.shipping_cost || 0,
    total_amount: orderRecord.pricing ? orderRecord.pricing.totalAmount : orderRecord.total_amount || 0,
    currency: orderRecord.currency || 'MAD',
    shipping_address: orderRecord.shippingAddress || orderRecord.shipping_address || {},
    receipt_url: orderRecord.receiptUrl || orderRecord.receipt_url || null,
    idempotency_key: orderRecord.idempotencyKey || orderRecord.idempotency_key || null,
    items: orderRecord.pricing?.validatedItems || orderRecord.items || [],
    metadata: {
      ...orderRecord.metadata,
      createdAtIso: new Date().toISOString(),
    },
    created_at: orderRecord.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 1. Sauvegarde dans le stockage local persistant
  const existingIdx = orders.findIndex((o) => o.id === formattedOrder.id);
  if (existingIdx >= 0) {
    orders[existingIdx] = formattedOrder;
  } else {
    orders.unshift(formattedOrder);
  }
  writeLocalOrders(orders);

  // 2. Synchronisation Supabase (si configuré)
  try {
    await persistOrder({
      orderId: formattedOrder.id,
      userId: formattedOrder.user_id,
      guestEmail: formattedOrder.guest_email,
      status: formattedOrder.status,
      paymentProvider: formattedOrder.payment_provider,
      providerOrderId: formattedOrder.provider_order_id,
      providerPaymentId: formattedOrder.provider_payment_id,
      pricing: {
        subtotal: formattedOrder.subtotal,
        discountAmount: formattedOrder.discount_amount,
        shippingCost: formattedOrder.shipping_cost,
        totalAmount: formattedOrder.total_amount,
        currency: formattedOrder.currency,
        validatedItems: formattedOrder.items,
      },
      shippingAddress: formattedOrder.shipping_address,
      receiptUrl: formattedOrder.receipt_url,
      idempotencyKey: formattedOrder.idempotency_key,
    });
  } catch (err) {
    console.warn('[OrderStore] Synchronisation Supabase différée ou non critique:', err.message);
  }

  return formattedOrder;
}

/**
 * Récupère toutes les commandes avec support de filtrage (statut, recherche, pagination)
 */
export async function getAllOrders({ status = 'all', search = '', limit = 100 } = {}) {
  // Récupération locale
  let orders = readLocalOrders();

  // Tentative d'enrichissement depuis Supabase
  try {
    const { data: supabaseOrders, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && supabaseOrders && supabaseOrders.length > 0) {
      // Fusionner les données de Supabase sans écraser les commandes locales plus récentes
      const localIds = new Set(orders.map((o) => o.id));
      for (const sbOrder of supabaseOrders) {
        if (!localIds.has(sbOrder.id)) {
          orders.push({
            ...sbOrder,
            items: sbOrder.order_items || [],
          });
        }
      }
    }
  } catch {
    // Si Supabase est inaccessible, on utilise les données locales
  }

  // Tri par date décroissante
  orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filtrage par statut
  if (status && status !== 'all') {
    orders = orders.filter((o) => {
      if (status === 'cod') return o.payment_provider === 'cod';
      if (status === 'pending_payment') return o.status === 'pending_payment' || o.status === 'pending';
      return o.status === status;
    });
  }

  // Filtrage par recherche (ID, nom, téléphone, ville, email)
  if (search && search.trim() !== '') {
    const cleanSearch = search.trim().toLowerCase();
    orders = orders.filter((o) => {
      const idMatch = o.id?.toLowerCase().includes(cleanSearch);
      const nameMatch = `${o.shipping_address?.firstName || ''} ${o.shipping_address?.lastName || ''}`
        .toLowerCase()
        .includes(cleanSearch);
      const phoneMatch = o.shipping_address?.phone?.toLowerCase().includes(cleanSearch);
      const cityMatch = o.shipping_address?.city?.toLowerCase().includes(cleanSearch);
      const emailMatch = (o.guest_email || o.shipping_address?.email || '').toLowerCase().includes(cleanSearch);
      return idMatch || nameMatch || phoneMatch || cityMatch || emailMatch;
    });
  }

  return orders.slice(0, limit);
}

/**
 * Recherche une commande par son identifiant unique
 */
export async function getOrderById(orderId) {
  if (!orderId) return null;
  const orders = readLocalOrders();
  let found = orders.find((o) => o.id.toUpperCase() === orderId.trim().toUpperCase());

  if (!found) {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId.trim())
        .maybeSingle();

      if (!error && data) {
        found = {
          ...data,
          items: data.order_items || [],
        };
      }
    } catch {
      // Fallback
    }
  }

  return found || null;
}

/**
 * Met à jour le statut d'une commande (ex: passer de 'pending_payment' à 'paid', 'shipped', 'delivered')
 */
export async function updateOrderStatus(orderId, { status, adminNotes = null, providerPaymentId = null }) {
  const orders = readLocalOrders();
  const orderIdx = orders.findIndex((o) => o.id.toUpperCase() === orderId.trim().toUpperCase());

  if (orderIdx === -1) {
    throw new Error(`Commande introuvable : ${orderId}`);
  }

  const updatedOrder = {
    ...orders[orderIdx],
    status,
    provider_payment_id: providerPaymentId || orders[orderIdx].provider_payment_id,
    metadata: {
      ...orders[orderIdx].metadata,
      adminNotes: adminNotes || orders[orderIdx].metadata?.adminNotes,
      statusUpdatedAt: new Date().toISOString(),
    },
    updated_at: new Date().toISOString(),
  };

  // Si marqué comme payé, enregistrer l'horodatage du paiement
  if (status === 'paid' && !updatedOrder.provider_payment_id) {
    updatedOrder.provider_payment_id = `COD-CASH-${Date.now()}`;
  }

  orders[orderIdx] = updatedOrder;
  writeLocalOrders(orders);

  // Mettre à jour Supabase en parallèle
  try {
    if (status === 'paid') {
      await supabaseMarkOrderPaid({
        orderId: updatedOrder.id,
        providerPaymentId: updatedOrder.provider_payment_id,
      });
    } else {
      await supabaseAdmin
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedOrder.id);
    }
  } catch (err) {
    console.warn('[OrderStore] Mise à jour Supabase différée:', err.message);
  }

  return updatedOrder;
}
