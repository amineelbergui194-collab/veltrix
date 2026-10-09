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
      console.error('Supabase order insert error:', orderError.message);
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
    console.error('Exception persisting order to Supabase:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Updates order status upon verified payment confirmation (Webhook or Capture)
 */
export async function markOrderPaid({
  orderId,
  providerPaymentId,
  receiptUrl = null,
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        provider_payment_id: providerPaymentId,
        receipt_url: receiptUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Error marking order as paid:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, order: data?.[0] };
  } catch (err) {
    console.error('Exception in markOrderPaid:', err);
    return { success: false, error: err.message };
  }
}
