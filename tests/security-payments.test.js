import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderPrice } from '../server/pricing.js';
import {
  generateOrderId,
  handleCreateCodOrder,
  isValidPhoneNumber,
  isValidAddress,
  handleGetAdminOrders,
  handleUpdateAdminOrderStatus,
} from '../server/apiHandlers.js';
import { isCodAvailableForZone } from '../server/codConfig.js';
import { getOrderById } from '../server/orderStore.js';

// ==============================================================================
// 1. TESTS DES RÈGLES DE PRIX SERVEUR EXISTANTES (COMPATIBILITÉ GARANTIE)
// ==============================================================================

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

// ==============================================================================
// 2. TESTS DU PAIEMENT À LA LIVRAISON (CASH ON DELIVERY — COD)
// ==============================================================================

test('7. COD : Création valide d\'une commande avec statut initial strict « pending_payment »', async () => {
  const codOrderPayload = {
    items: [{ productId: 'airpods-pro-2', quantity: 1 }],
    shippingMethod: 'standard',
    shippingAddress: {
      firstName: 'Hamza',
      lastName: 'Bennani',
      phone: '+212 6 12 34 56 78',
      address: '42 Rue Zerktouni',
      city: 'Casablanca',
      country: 'Morocco',
      zip: '20100',
    },
    deliveryNotes: 'Appeler 15 min avant arrivée',
    idempotencyKey: `test_cod_${Date.now()}_1`,
  };

  const result = await handleCreateCodOrder(codOrderPayload);

  assert.equal(result.success, true);
  assert.match(result.orderId, /^VELT-2026-\d{5}$/);
  assert.equal(result.paymentMethod, 'cod');
  // Le statut de paiement doit STRICTEMENT être 'pending_payment' (En attente de paiement)
  assert.equal(result.status, 'pending_payment');
  assert.equal(result.totalAmount, 145); // 120 DH + 25 DH livraison
  assert.equal(result.currency, 'MAD');
  assert.equal(result.shippingAddress.city, 'Casablanca');

  // Vérifier la persistance dans le store
  const stored = await getOrderById(result.orderId);
  assert.ok(stored);
  assert.equal(stored.status, 'pending_payment');
  assert.equal(stored.payment_provider, 'cod');
  assert.equal(stored.provider_payment_id, null); // Pas encore encaissé
});

test('8. COD Anti-Fraude : Ignorer toute altération de prix envoyée par le navigateur', async () => {
  const fraudulentPayload = {
    items: [
      {
        productId: 'airpods-pro-2',
        quantity: 1,
        unitPrice: 5, // Tentative de fraude
        totalAmount: 5,
      },
    ],
    shippingMethod: 'standard',
    shippingCost: 0, // Tentative de contourner les frais de port
    shippingAddress: {
      firstName: 'Youssef',
      lastName: 'Alami',
      phone: `06${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: '10 Avenue Hassan II',
      city: 'Rabat',
      country: 'Morocco',
    },
    idempotencyKey: `test_cod_${Date.now()}_2_${Math.random()}`,
  };

  const result = await handleCreateCodOrder(fraudulentPayload);

  // Le serveur DOIT appliquer 120 DH (prix officiel) + 25 DH (frais port) = 145 DH
  assert.equal(result.totalAmount, 145);
  assert.notEqual(result.totalAmount, 5);
  assert.equal(result.shippingCost, 25);
});

test('9. COD Zones de Livraison : Acceptation d\'une ville marocaine éligible et rejet d\'un pays non desservi', () => {
  // Casablanca (Maroc) : Doit être éligible
  const casaCheck = isCodAvailableForZone('Morocco', 'Casablanca');
  assert.equal(casaCheck.available, true);

  // Tanger (Maroc) : Doit être éligible
  const tangerCheck = isCodAvailableForZone('Maroc', 'Tanger');
  assert.equal(tangerCheck.available, true);

  // France (International) : Doit être refusé avec motif explicite
  const franceCheck = isCodAvailableForZone('France', 'Paris');
  assert.equal(franceCheck.available, false);
  assert.match(franceCheck.reason, /pas disponible pour les expéditions en France/);

  // États-Unis : Doit être refusé
  const usaCheck = isCodAvailableForZone('United States', 'New York');
  assert.equal(usaCheck.available, false);
});

test('10. COD Zone de Livraison : handleCreateCodOrder rejette une commande hors zone éligible', async () => {
  const internationalPayload = {
    items: [{ productId: 'airpods-pro-2', quantity: 1 }],
    shippingMethod: 'standard',
    shippingAddress: {
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '+33 6 12 34 56 78',
      address: '10 Rue de la Paix',
      city: 'Paris',
      country: 'France', // Zone non éligible au COD
    },
    idempotencyKey: `test_cod_${Date.now()}_3`,
  };

  await assert.rejects(
    async () => handleCreateCodOrder(internationalPayload),
    /Le paiement à la livraison.*n’est pas disponible/
  );
});

test('11. COD Validation : Rejet strict si téléphone ou adresse incomplets', async () => {
  // Téléphone manquant ou trop court
  assert.equal(isValidPhoneNumber(''), false);
  assert.equal(isValidPhoneNumber('123'), false);
  assert.equal(isValidPhoneNumber('+212 6 00 00 00 00'), true);
  assert.equal(isValidPhoneNumber('0661223344'), true);

  // Adresse trop courte
  assert.equal(isValidAddress('Rue'), false);
  assert.equal(isValidAddress('12 Boulevard d’Anfa'), true);

  // Rejet par l'API si le téléphone est invalide
  await assert.rejects(
    async () =>
      handleCreateCodOrder({
        items: [{ productId: 'airpods-pro-2', quantity: 1 }],
        shippingAddress: {
          firstName: 'Ali',
          lastName: 'Mansour',
          phone: 'abc', // Téléphone invalide
          address: '15 Boulevard d’Anfa',
          city: 'Casablanca',
          country: 'Morocco',
        },
      }),
    /Numéro de téléphone invalide/
  );

  // Rejet si le nom ou prénom est manquant
  await assert.rejects(
    async () =>
      handleCreateCodOrder({
        items: [{ productId: 'airpods-pro-2', quantity: 1 }],
        shippingAddress: {
          firstName: '',
          lastName: 'Mansour',
          phone: '0600000000',
          address: '15 Boulevard d’Anfa',
          city: 'Casablanca',
          country: 'Morocco',
        },
      }),
    /Veuillez renseigner un prénom valide/
  );
});

test('12. COD Idempotence : Protection contre les commandes en double', async () => {
  const uniqueKey = `idemp_${Date.now()}_duplicate_test`;
  const payload = {
    items: [{ productId: 'airpods-pro-2', quantity: 1 }],
    shippingMethod: 'standard',
    shippingAddress: {
      firstName: 'Salma',
      lastName: 'Tazi',
      phone: '+212699887766',
      address: '22 Avenue Mohammed VI',
      city: 'Marrakech',
      country: 'Morocco',
    },
    idempotencyKey: uniqueKey,
  };

  const firstSubmission = await handleCreateCodOrder(payload);
  const secondSubmission = await handleCreateCodOrder(payload);

  assert.equal(firstSubmission.orderId, secondSubmission.orderId);
  assert.equal(secondSubmission.isDuplicateSubmission, true);
});

test('13. Admin COD : Consultation et encaissement en espèces (statut -> paid)', async () => {
  // 1. Créer une commande COD
  const payload = {
    items: [{ productId: 'airpods-pro-2', quantity: 1 }],
    shippingMethod: 'standard',
    shippingAddress: {
      firstName: 'Nabil',
      lastName: 'Chraibi',
      phone: '+212677889900',
      address: '5 Rue Ibn Battouta',
      city: 'Fès',
      country: 'Morocco',
    },
    idempotencyKey: `admin_test_${Date.now()}`,
  };

  const orderResult = await handleCreateCodOrder(payload);
  const orderId = orderResult.orderId;

  // 2. Vérifier que la commande apparaît dans l'interface admin
  const adminListing = await handleGetAdminOrders({ search: orderId });
  assert.ok(adminListing.success);
  assert.ok(adminListing.orders.some((o) => o.id === orderId));

  // 3. Simuler l'administrateur qui marque la commande comme encaissée après réception de l'argent
  const updateResult = await handleUpdateAdminOrderStatus({
    orderId,
    status: 'paid',
    adminNotes: 'Montant 145 DH encaissé en espèces par le livreur Amana.',
  });

  assert.ok(updateResult.success);
  assert.equal(updateResult.order.status, 'paid');
  assert.match(updateResult.order.provider_payment_id, /^COD-CASH-\d+$/);

  // 4. Vérifier la persistance du nouveau statut
  const updatedOrder = await getOrderById(orderId);
  assert.equal(updatedOrder.status, 'paid');
});
