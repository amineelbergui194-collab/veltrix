import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import { ApplePayButton } from './payment/ApplePayButton';
import { PayPalSection } from './payment/PayPalSection';
import { CashOnDeliverySection } from './payment/CashOnDeliverySection';
import { GooglePlayInfoSection } from './payment/GooglePlayInfoSection';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  ExternalLink,
  Smartphone,
  Banknote,
  Phone
} from 'lucide-react';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const isStripeConfigured = Boolean(
  stripePublishableKey &&
  stripePublishableKey !== 'pk_test_your_key_here' &&
  stripePublishableKey !== 'your-stripe-publishable-key-here'
);

// Initialize Stripe promise only if key is configured
const stripePromise = isStripeConfigured ? loadStripe(stripePublishableKey) : null;

export const CheckoutPage = () => {
  const {
    cart,
    subtotal,
    discountAmount,
    appliedPromo,
    clearCart,
    navigateTo,
    addToast
  } = useShop();

  const { user } = useAuth();

  // Customer Contact and Delivery Information
  const [formData, setFormData] = useState({
    email: user?.email || 'client@veltrix.tech',
    phone: '+212 6 00 00 00 00',
    firstName: user?.user_metadata?.full_name?.split(' ')[0] || 'Karim',
    lastName: user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'El Amrani',
    address: '15 Boulevard d\'Anfa',
    apartment: 'Appt 12',
    city: 'Casablanca',
    state: 'Grand Casablanca',
    zip: '20000',
    country: 'Morocco',
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard', 'express', 'overnight'
  const [selectedPaymentTab, setSelectedPaymentTab] = useState('cod'); // 'cod', 'apple-pay', 'paypal'

  // Server-side Payment Intent State for Stripe
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [serverOrderId, setServerOrderId] = useState(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [initError, setInitError] = useState(null);

  // Confirmed Order State
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Shipping costs in DH
  const shippingCosts = {
    standard: subtotal >= 300 || appliedPromo?.freeShipping ? 0 : 25,
    express: 35,
    overnight: 60,
  };

  const activeShippingCost = shippingCosts[shippingMethod];
  const finalCheckoutTotal = Math.max(0, subtotal - discountAmount + activeShippingCost);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Initialize Stripe PaymentIntent only when apple-pay tab is active
  useEffect(() => {
    let isSubscribed = true;

    if (cart.length === 0 || confirmedOrder) return;
    if (selectedPaymentTab !== 'apple-pay') return;
    if (!isStripeConfigured) return;

    const initializeStripePayment = async () => {
      setIsInitializingPayment(true);
      setInitError(null);

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              selectedColor: item.selectedColor,
            })),
            shippingMethod,
            promoCode: appliedPromo?.code || null,
            userId: user?.id || null,
            customerEmail: formData.email,
            shippingAddress: formData,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Erreur d'initialisation (${response.status})`);
        }

        const data = await response.json();
        if (isSubscribed) {
          setStripeClientSecret(data.clientSecret);
          setServerOrderId(data.orderId);
        }
      } catch (err) {
        if (isSubscribed) {
          console.warn('Initialisation Stripe:', err.message);
          setInitError(err.message);
        }
      } finally {
        if (isSubscribed) setIsInitializingPayment(false);
      }
    };

    initializeStripePayment();

    return () => {
      isSubscribed = false;
    };
  }, [cart, shippingMethod, appliedPromo, formData, user, confirmedOrder, selectedPaymentTab]);

  // Handle successful payment or order confirmation
  const handlePaymentSuccess = (paymentResult) => {
    const orderRef = paymentResult.orderId || serverOrderId || 'VELT-2026-CONFIRMED';
    const isCod = paymentResult.method === 'cod';

    setConfirmedOrder({
      orderId: orderRef,
      transactionId: isCod
        ? 'Règlement en espèces à la livraison'
        : paymentResult.paymentIntentId || paymentResult.captureId || 'TXN-CONFIRMED',
      method: paymentResult.method || selectedPaymentTab,
      methodLabel: isCod
        ? 'Paiement à la livraison (Cash on Delivery)'
        : paymentResult.method === 'paypal'
        ? 'PayPal Express'
        : 'Apple Pay',
      status: isCod ? 'pending_payment' : 'paid',
      totalPaid: paymentResult.totalPaid || finalCheckoutTotal,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.state ? formData.state + ', ' : ''}${formData.country}`,
      estimatedDeliveryTime: paymentResult.estimatedDeliveryTime || '24h à 48h ouvrées',
    });

    clearCart();

    const toastMessage = isCod
      ? `Commande ${orderRef} confirmée ! Préparez le montant en espèces pour la livraison.`
      : `Paiement validé avec succès ! Commande ${orderRef} enregistrée.`;

    addToast(toastMessage, 'success');
  };

  // 1. EMPTY CART VIEW
  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="py-24 bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold uppercase text-white">Votre Panier est Vide</h2>
          <p className="text-xs text-neutral-400">
            Ajoutez des articles au panier avant de procéder au règlement de votre commande.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Découvrir les Nouveautés
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ORDER CONFIRMED SCREEN (FOR BOTH COD AND ONLINE PAYMENTS)
  if (confirmedOrder) {
    const isCod = confirmedOrder.method === 'cod';

    return (
      <div className="py-16 bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center animate-in fade-in">
          {/* Status Icon */}
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl ${
              isCod
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-amber-500/20'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {isCod ? <Banknote className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
          </div>

          {/* Status Badge */}
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest border ${
              isCod
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
            }`}
          >
            {isCod ? 'En attente de paiement — Paiement à la livraison' : 'Paiement Validé & Sécurisé'}
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mt-4 mb-2 text-white">
            Merci pour votre commande !
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
            Votre commande <strong className="text-cyan-300">{confirmedOrder.orderId}</strong> a bien été enregistrée.
            {isCod ? (
              <span> Vous réglerez vos achats en espèces lors de la remise de votre colis par le transporteur.</span>
            ) : (
              <span> Une confirmation détaillée et la facture ont été transmises à <strong className="text-white">{confirmedOrder.email}</strong>.</span>
            )}
          </p>

          {/* COD Notice Box */}
          {isCod && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs text-left mb-6 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Confirmation téléphonique par le transporteur</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90 font-sans">
                Notre livreur ou notre équipe logistique prendra contact avec vous par téléphone au <strong className="text-white">{confirmedOrder.phone}</strong> avant la livraison pour confirmer l’adresse exacte et l’heure de passage.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-mono pt-1">
                <Banknote className="w-4 h-4 text-amber-400" />
                <span>Montant en espèces à préparer : <strong className="text-white text-xs">{formatPrice(confirmedOrder.totalPaid)}</strong></span>
              </div>
            </div>
          )}

          {/* Detailed Receipt Card */}
          <div className="p-6 rounded-3xl bg-[#121214] border border-white/10 text-left font-mono text-xs space-y-4 mb-8 shadow-2xl">
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Numéro de Commande</span>
              <span className="text-cyan-300 font-bold">{confirmedOrder.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Méthode de Paiement</span>
              <span className="text-neutral-200 font-semibold">{confirmedOrder.methodLabel}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Statut de la Commande</span>
              <span
                className={`font-bold uppercase ${
                  isCod ? 'text-amber-300' : 'text-emerald-400'
                }`}
              >
                {isCod ? 'En attente de paiement' : 'Payée & Confirmée'}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Téléphone de Contact</span>
              <span className="text-neutral-200">{confirmedOrder.phone}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Adresse de Livraison</span>
              <span className="text-neutral-200 text-right max-w-xs truncate">{confirmedOrder.address}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Délai de Livraison</span>
              <span className="text-neutral-200 capitalize">
                {confirmedOrder.estimatedDeliveryTime || '24h à 48h ouvrées'}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1">
              <span className="text-white">
                {isCod ? 'Montant à Payer à la Livraison' : 'Montant Total Réglé'}
              </span>
              <span className="text-cyan-300">{formatPrice(confirmedOrder.totalPaid)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <button
                onClick={() => navigateTo('account')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Consulter mes Commandes</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigateTo('signup')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Créer un compte pour suivre ma livraison
              </button>
            )}
            <button
              onClick={() => navigateTo('home')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Retour à l’Accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. MAIN CHECKOUT SCREEN
  return (
    <div className="py-10 bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <button
              onClick={() => navigateTo('cart')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour au Panier</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-white">
              Paiement & Commande
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Chiffrement TLS 256 bits & Vérification Logistique Sécurisée</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: FORM INPUTS & PAYMENT PROCESSORS */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Coordonnées de Contact */}
            <div className="p-6 rounded-3xl bg-[#121214]/80 border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-white uppercase flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <span>Coordonnées Client</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Adresse E-mail</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">
                    Téléphone Portable <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+212 6 XX XX XX XX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                    Nécessaire pour l'appel du livreur avant remise du colis
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Adresse de Livraison */}
            <div className="p-6 rounded-3xl bg-[#121214]/80 border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-white uppercase flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <span>Adresse de Livraison</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Nom</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Adresse Complète (Rue, Numéro)</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ex: 15 Boulevard d'Anfa, Résidence Al Manar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">
                    Pays de Destination
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Morocco">Maroc (Paiement à la livraison éligible)</option>
                    <option value="France">France (International)</option>
                    <option value="Spain">Espagne (International)</option>
                    <option value="Belgium">Belgique (International)</option>
                    <option value="United States">États-Unis (International)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">
                    Ville <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    list="morocco-cities-datalist"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Casablanca, Rabat, Marrakech..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                  <datalist id="morocco-cities-datalist">
                    <option value="Casablanca" />
                    <option value="Rabat" />
                    <option value="Marrakech" />
                    <option value="Tanger" />
                    <option value="Agadir" />
                    <option value="Fès" />
                    <option value="Meknès" />
                    <option value="Oujda" />
                    <option value="Kenitra" />
                    <option value="Tétouan" />
                    <option value="Mohammedia" />
                    <option value="El Jadida" />
                    <option value="Safi" />
                    <option value="Nador" />
                    <option value="Béni Mellal" />
                    <option value="Salé" />
                    <option value="Témara" />
                    <option value="Khouribga" />
                    <option value="Dakhla" />
                    <option value="Laâyoune" />
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Région / Quartier</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Ex: Maarif / Gauthier"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Code Postal (Optionnel)</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="20000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Mode d'expédition */}
            <div className="p-6 rounded-3xl bg-[#121214]/80 border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-white uppercase flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs flex items-center justify-center font-mono">
                  3
                </span>
                <span>Mode d'Expédition</span>
              </h2>

              <div className="space-y-3">
                {[
                  {
                    id: 'standard',
                    name: 'Livraison Standard Sécurisée',
                    time: '2–3 jours ouvrés',
                    price: shippingCosts.standard === 0 ? 'GRATUIT' : formatPrice(shippingCosts.standard),
                  },
                  {
                    id: 'express',
                    name: 'Livraison Express Prioritaire',
                    time: '24–48 heures',
                    price: formatPrice(shippingCosts.express),
                  },
                  {
                    id: 'overnight',
                    name: 'Livraison 24h Chrono',
                    time: 'Le lendemain avant 13h00',
                    price: formatPrice(shippingCosts.overnight),
                  },
                ].map((del) => (
                  <label
                    key={del.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === del.id
                        ? 'border-cyan-400 bg-white/5'
                        : 'border-white/5 bg-neutral-950/60 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={shippingMethod === del.id}
                        onChange={() => setShippingMethod(del.id)}
                        className="accent-cyan-400"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{del.name}</div>
                        <div className="text-[11px] text-neutral-400">{del.time}</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {del.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Choix du Moyen de Paiement */}
            <div className="p-6 rounded-3xl bg-[#121214]/80 border border-white/10 space-y-5">
              <h2 className="text-base font-bold text-white uppercase flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs flex items-center justify-center font-mono">
                  4
                </span>
                <span>Moyens de Paiement Disponibles</span>
              </h2>

              {/* 3 TABS DE SÉLECTION DONT PAIEMENT À LA LIVRAISON (COD) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. Cash on Delivery (Paiement à la livraison) */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentTab('cod')}
                  className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedPaymentTab === 'cod'
                      ? 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/10'
                      : 'border-white/5 bg-neutral-950 text-neutral-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <Banknote className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="text-[11px] text-center">Paiement Livraison</span>
                </button>

                {/* 2. Apple Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentTab('apple-pay')}
                  className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedPaymentTab === 'apple-pay'
                      ? 'border-white bg-white text-black shadow-lg'
                      : 'border-white/5 bg-neutral-950 text-neutral-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] text-center"> Apple Pay</span>
                </button>

                {/* 3. PayPal */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentTab('paypal')}
                  className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedPaymentTab === 'paypal'
                      ? 'border-blue-500 bg-blue-600/20 text-blue-300 shadow-lg'
                      : 'border-white/5 bg-neutral-950 text-neutral-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <span className="italic font-bold font-serif text-sm">PayPal</span>
                  <span className="text-[10px] text-neutral-400">En ligne</span>
                </button>
              </div>

              {/* Contenu spécifique selon le mode de paiement sélectionné */}
              <div className="pt-2">
                {/* A. PAIEMENT À LA LIVRAISON (COD) */}
                {selectedPaymentTab === 'cod' && (
                  <CashOnDeliverySection
                    cartItems={cart}
                    shippingMethod={shippingMethod}
                    promoCode={appliedPromo}
                    shippingAddress={formData}
                    user={user}
                    totalAmount={finalCheckoutTotal}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => addToast(err.message, 'error')}
                  />
                )}

                {/* B. APPLE PAY */}
                {selectedPaymentTab === 'apple-pay' && (
                  <div>
                    {!isStripeConfigured ? (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                        Configuration requise : Apple Pay nécessite un compte marchand Stripe configuré et un domaine vérifié par Apple.
                      </div>
                    ) : stripePromise && stripeClientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                        <ApplePayButton
                          clientSecret={stripeClientSecret}
                          orderId={serverOrderId}
                          totalAmount={finalCheckoutTotal}
                          currency="mad"
                          onSuccess={handlePaymentSuccess}
                          onError={(err) => addToast(err.message, 'error')}
                        />
                      </Elements>
                    ) : (
                      <div className="p-4 rounded-xl bg-neutral-900 text-xs text-neutral-400">
                        Initialisation de la session Apple Pay...
                      </div>
                    )}
                  </div>
                )}

                {/* D. PAYPAL */}
                {selectedPaymentTab === 'paypal' && (
                  <div>
                    <PayPalSection
                      cartItems={cart}
                      shippingMethod={shippingMethod}
                      promoCode={appliedPromo}
                      shippingAddress={formData}
                      user={user}
                      onSuccess={handlePaymentSuccess}
                      onError={(err) => addToast(err.message, 'error')}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 5. Section d'information Cartes Cadeaux Google Play */}
            <GooglePlayInfoSection />
          </div>

          {/* RIGHT: STICKY ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#121214]/80 border border-white/10 sticky top-24 space-y-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-base font-bold text-white uppercase pb-4 border-b border-white/5">
                Récapitulatif de Commande ({cart.length} Articles)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-white/10 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">{item.product.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          Quantité : {item.quantity} • {item.selectedColor.name}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-mono text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Sous-total Produits</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-cyan-400">
                    <span>Remise Appliquée ({appliedPromo?.label || 'Code Promo'})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Frais d'Expédition</span>
                  <span>{activeShippingCost === 0 ? 'GRATUIT' : formatPrice(activeShippingCost)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>TVA & Taxes Marocaines</span>
                  <span>Incluses (TTC)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/5">
                  <span>
                    {selectedPaymentTab === 'cod' ? 'Total à Régler à la Livraison' : 'Total à Payer'}
                  </span>
                  <span className="text-cyan-300">{formatPrice(finalCheckoutTotal)}</span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-white/5 text-[11px] font-mono text-neutral-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Garantie Veltrix 2 Ans & Satisfait ou Remboursé</span>
                </div>
                <p className="text-[10px] text-neutral-500 leading-relaxed font-sans">
                  {selectedPaymentTab === 'cod'
                    ? 'Paiement sécurisé en espèces à la livraison. Aucun paiement préalable. Facture délivrée à la réception.'
                    : 'Paiement en ligne 100% sécurisé et chiffré sans conservation de données sensibles.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
