import { PRODUCTS } from '../src/data/products.js';

/**
 * Server-Side Order Pricing Validator
 * SECURITY RULE 1 & 2: Never trust client-submitted amounts.
 * Always compute subtotal, discounts, and shipping cost strictly on the server.
 */
export function calculateOrderPrice({ items, shippingMethod = 'standard', promoCode = null }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('La commande doit contenir au moins un article valide.');
  }

  // 1. Calculate validated subtotal from canonical product catalog
  let subtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    const productId = item.productId || item.id || item.product?.id;
    const quantity = parseInt(item.quantity, 10);

    if (!productId || isNaN(quantity) || quantity <= 0) {
      throw new Error(`Article invalide dans le panier : ${JSON.stringify(item)}`);
    }

    const catalogProduct = PRODUCTS.find((p) => p.id === productId);
    if (!catalogProduct) {
      throw new Error(`Produit introuvable dans le catalogue officiel : ${productId}`);
    }

    const unitPrice = Number(catalogProduct.price);
    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;

    validatedItems.push({
      productId: catalogProduct.id,
      productName: catalogProduct.name,
      quantity,
      unitPrice,
      colorName: item.selectedColor?.name || item.colorName || 'Standard',
      lineTotal,
    });
  }

  // 2. Validate and apply promo code server-side
  let discountAmount = 0;
  let freeShippingPromo = false;

  if (promoCode) {
    const cleanPromo = promoCode.trim().toUpperCase();
    if (cleanPromo === 'VELTRIX10') {
      discountAmount = Math.round((subtotal * 0.10) * 100) / 100; // 10%
    } else if (cleanPromo === 'FREESHIP') {
      freeShippingPromo = true;
    } else if (cleanPromo === 'TECH20') {
      discountAmount = Math.round((subtotal * 0.20) * 100) / 100; // 20%
    }
  }

  // 3. Calculate shipping cost
  // Free standard shipping if subtotal >= 300 DH or promo FREESHIP
  let shippingCost = 0;
  const isFreeStandard = subtotal >= 300 || freeShippingPromo;

  switch (shippingMethod) {
    case 'express':
      shippingCost = 35;
      break;
    case 'overnight':
      shippingCost = 60;
      break;
    case 'standard':
    default:
      shippingCost = isFreeStandard ? 0 : 25;
      break;
  }

  // 4. Final total in MAD (Dirham Marocain)
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    shippingCost: Math.round(shippingCost * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    currency: 'MAD',
    validatedItems,
  };
}
