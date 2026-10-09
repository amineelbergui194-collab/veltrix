import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderPrice } from '../server/pricing.js';
import { generateOrderId } from '../server/apiHandlers.js';

test('1. Calcul de prix serveur valide pour un article du catalogue', () => {
  const result = calculateOrderPrice({
    items: [{ productId: 'airpods-pro-2', quantity: 1 }],
    shippingMethod: 'standard',
  });

  // airpods-pro-2 is 120 DH. Since 120 < 300 DH, standard shipping is 25 DH.
  assert.equal(result.subtotal, 120);
  assert.equal(result.shippingCost, 25);
  assert.equal(result.totalAmount, 145);
  assert.equal(result.currency, 'MAD');
  assert.equal(result.validatedItems.length, 1);
});

test('2. Anti-fraude : Ignorer toute tentative de modification de prix côté navigateur', () => {
  // Client tries to submit fraudulent unit price of 1 DH instead of 120 DH
  const fraudulentClientItem = {
    productId: 'airpods-pro-2',
    quantity: 1,
    unitPrice: 1, // Fraudulent attempt
    total: 1,
  };

  const result = calculateOrderPrice({
    items: [fraudulentClientItem],
    shippingMethod: 'standard',
  });

  // Server must enforce canonical price of 120 DH regardless of what client passed
  assert.equal(result.subtotal, 120);
  assert.notEqual(result.subtotal, 1);
  assert.equal(result.validatedItems[0].unitPrice, 120);
});

test('3. Rejet strict si le panier est vide ou contient un article inexistant', () => {
  assert.throws(
    () => calculateOrderPrice({ items: [] }),
    /La commande doit contenir au moins un article valide/
  );

  assert.throws(
    () => calculateOrderPrice({ items: [{ productId: 'fake-inexistent-device', quantity: 1 }] }),
    /Produit introuvable dans le catalogue officiel/
  );

  assert.throws(
    () => calculateOrderPrice({ items: [{ productId: 'airpods-pro-2', quantity: 0 }] }),
    /Article invalide dans le panier/
  );
});

test('4. Validation des codes promo serveur (VELTRIX10 & FREESHIP)', () => {
  // 10% promo test
  const with10Percent = calculateOrderPrice({
    items: [{ productId: 'airpods-pro-2', quantity: 1 }], // 120 DH
    shippingMethod: 'standard', // 25 DH
    promoCode: 'VELTRIX10',
  });
  // 120 - 12 (10%) + 25 = 133 DH
  assert.equal(with10Percent.discountAmount, 12);
  assert.equal(with10Percent.totalAmount, 133);

  // Free shipping promo test
  const withFreeShip = calculateOrderPrice({
    items: [{ productId: 'airpods-pro-2', quantity: 1 }],
    shippingMethod: 'standard',
    promoCode: 'FREESHIP',
  });
  assert.equal(withFreeShip.shippingCost, 0);
  assert.equal(withFreeShip.totalAmount, 120);
});

test('5. Seuil de livraison gratuite (300 DH)', () => {
  // apple-watch-ultra-edition is 300 DH (>= 300 DH -> free shipping)
  const result = calculateOrderPrice({
    items: [{ productId: 'apple-watch-ultra-edition', quantity: 1 }],
    shippingMethod: 'standard',
  });
  assert.equal(result.subtotal, 300);
  assert.equal(result.shippingCost, 0);
  assert.equal(result.totalAmount, 300);
});

test('6. Génération de référence commande unique et idempotence', () => {
  const orderId1 = generateOrderId();
  const orderId2 = generateOrderId();

  assert.match(orderId1, /^VELT-2026-\d{5}$/);
  assert.match(orderId2, /^VELT-2026-\d{5}$/);
  assert.notEqual(orderId1, orderId2);
});
