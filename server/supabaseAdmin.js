import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yjkldllbcvnxpooecdor.supabase.co';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_fOSyZR9uUCXKVi--gVNABg_q7DFf7em';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Persists a validated order and its items into Supabase
 */
export async function persistOrder({
  orderId,
  userId = null,
  guestEmail = null,
  status = 'pending',
  paymentProvider,
  providerOrderId = null,
  providerPaymentId = null,
  pricing,
  shippingAddress,
  receiptUrl = null,
  idempotencyKey = null,
}) {
  try {
    // 1. Insert order record
    const { error: orderError } = await supabaseAdmin.from('orders').upsert({
      id: orderId,
      user_id: userId || null,
      guest_email: guestEmail,
      status,
      payment_provider: paymentProvider,
      provider_order_id: providerOrderId,
      provider_payment_id: providerPaymentId,
      subtotal: pricing.subtotal,
      discount_amount: pricing.discountAmount,
      shipping_cost: pricing.shippingCost,
      total_amount: pricing.totalAmount,
      currency: pricing.currency,
      shipping_address: shippingAddress,
      receipt_url: receiptUrl,
      idempotency_key: idempotencyKey,
      updated_at: new Date().toISOString(),
    });

    if (orderError) {
      // Si la table orders existante attend un type UUID pour id
      if (orderError.message?.includes('invalid input syntax for type uuid')) {
        const crypto = await import('node:crypto');
        const fallbackUuid = crypto.randomUUID();
        const { error: uuidErr } = await supabaseAdmin.from('orders').upsert({
          id: fallbackUuid,
          user_id: userId || null,
          guest_email: guestEmail,
          status,
          payment_provider: paymentProvider,
          provider_order_id: orderId,
          provider_payment_id: providerPaymentId,
          subtotal: pricing.subtotal,
          discount_amount: pricing.discountAmount,
          shipping_cost: pricing.shippingCost,
          total_amount: pricing.totalAmount,
          currency: pricing.currency,
          shipping_address: shippingAddress,
          receipt_url: receiptUrl,
          idempotency_key: idempotencyKey,
          updated_at: new Date().toISOString(),
        });

        if (!uuidErr) {
          return { success: true, uuid: fallbackUuid };
        }
      }

      console.warn('[Supabase persistOrder Warning]:', orderError.message);
      return { success: false, error: orderError.message };
    }

    // 2. Insert order items
    if (pricing.validatedItems && pricing.validatedItems.length > 0) {
      const itemsToInsert = pricing.validatedItems.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        color_name: item.colorName,
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.warn('Supabase items insert warning:', itemsError.message);
      }
    }

    return { success: true };
  } catch (err) {
    console.warn('Exception persisting order to Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Updates order status upon verified payment confirmation (Webhook or Capture or COD Cash Handover)
 */
export async function markOrderPaid({
  orderId,
  providerPaymentId,
  receiptUrl = null,
}) {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);

    let query = supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        provider_payment_id: providerPaymentId,
        receipt_url: receiptUrl,
        updated_at: new Date().toISOString(),
      });

    if (isUuid) {
      query = query.eq('id', orderId);
    } else {
      query = query.or(`id.eq.${orderId},provider_order_id.eq.${orderId}`);
    }

    const { data, error } = await query.select();

    if (error) {
      console.warn('[Supabase markOrderPaid Warning]:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, order: data?.[0] };
  } catch (err) {
    console.warn('Exception in markOrderPaid:', err.message);
    return { success: false, error: err.message };
  }
}
