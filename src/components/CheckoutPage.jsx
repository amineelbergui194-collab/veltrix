import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import { StripeCardForm } from './payment/StripeCardForm';
import { ApplePayButton } from './payment/ApplePayButton';
import { PayPalSection } from './payment/PayPalSection';
import { GooglePlayInfoSection } from './payment/GooglePlayInfoSection';
import { LoadingSpinner } from './ui/LoadingSpinner';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
  ExternalLink,
  Smartphone
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
  const [selectedPaymentTab, setSelectedPaymentTab] = useState('card'); // 'card', 'apple-pay', 'paypal'

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

  // Initialize Stripe PaymentIntent on the server whenever cart or shipping changes
  useEffect(() => {
    let isSubscribed = true;

    if (cart.length === 0 || confirmedOrder) return;

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
  }, [cart, shippingMethod, appliedPromo, formData, user, confirmedOrder]);

  // Handle successful payment
  const handlePaymentSuccess = (paymentResult) => {
    const orderRef = paymentResult.orderId || serverOrderId || 'VELT-2026-CONFIRMED';
    setConfirmedOrder({
      orderId: orderRef,
      transactionId: paymentResult.paymentIntentId || paymentResult.captureId || 'TXN-CONFIRMED',
      method: paymentResult.method || selectedPaymentTab,
      totalPaid: finalCheckoutTotal,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
    });

    clearCart();
    addToast(`Paiement validé avec succès ! Commande ${orderRef} enregistrée.`, 'success');
  };

  // 1. EMPTY CART VIEW
  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="py-24 bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
            <CreditCard className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold uppercase text-white">Votre Panier est Vide</h2>
          <p className="text-xs text-neutral-400">
            Ajoutez des articles au panier avant de procéder au règlement sécurisé.
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

  // 2. ORDER CONFIRMED SCREEN (PART 4: Account linking & confirmed receipt)
  if (confirmedOrder) {
    return (
      <div className="py-16 bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center animate-in fade-in">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 uppercase tracking-widest">
            Paiement Validé & Sécurisé
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mt-4 mb-2 text-white">
            Merci pour votre commande !
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto mb-8">
            Une confirmation détaillée et la facture ont été transmises à{' '}
            <strong className="text-white">{confirmedOrder.email}</strong>.
          </p>

          <div className="p-6 rounded-3xl bg-[#121214] border border-white/10 text-left font-mono text-xs space-y-4 mb-8 shadow-2xl">
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Référence Commande</span>
              <span className="text-cyan-300 font-bold">{confirmedOrder.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Transaction Processeur</span>
              <span className="text-neutral-200">{confirmedOrder.transactionId}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Adresse de Livraison</span>
              <span className="text-neutral-200 text-right">{confirmedOrder.address}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-neutral-400">Mode de Livraison</span>
              <span className="text-neutral-200 capitalize">
                {shippingMethod} (Suivi Colis Prioritaire)
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1">
              <span className="text-white">Montant Total Réglé</span>
              <span className="text-cyan-300">{formatPrice(confirmedOrder.totalPaid)}</span>
            </div>
          </div>

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
              Paiement Sécurisé
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Chiffrement Bancaire TLS 256 bits & Anti-Fraude 3D Secure</span>
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
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Téléphone Portable</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
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
                <label className="block text-xs font-mono text-neutral-400 mb-1">Adresse (Rue, Numéro)</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Ville</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Région</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Code Postal</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleInputChange}
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
                    time: '3–5 jours ouvrés',
                    price: shippingCosts.standard === 0 ? 'GRATUIT' : formatPrice(shippingCosts.standard),
                  },
                  {
                    id: 'express',
                    name: 'Livraison Express Prioritaire',
                    time: '1–2 jours ouvrés',
                    price: formatPrice(shippingCosts.express),
                  },
                  {
                    id: 'overnight',
                    name: 'Livraison 24h Chrono',
                    time: 'Le lendemain avant 12h00',
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

              {/* Tabs de sélection */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentTab('card')}
                  className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedPaymentTab === 'card'
                      ? 'border-cyan-400 bg-white/10 text-white shadow-lg shadow-cyan-500/10'
                      : 'border-white/5 bg-neutral-950 text-neutral-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Carte Bancaire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentTab('apple-pay')}
                  className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedPaymentTab === 'apple-pay'
                      ? 'border-white bg-white text-black shadow-lg'
                      : 'border-white/5 bg-neutral-950 text-neutral-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span> Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentTab('paypal')}
                  className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedPaymentTab === 'paypal'
                      ? 'border-blue-500 bg-blue-600/20 text-blue-300 shadow-lg'
                      : 'border-white/5 bg-neutral-950 text-neutral-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <span className="italic font-bold font-serif">PayPal</span>
                </button>
              </div>

              {/* Contenu spécifique selon le mode de paiement sélectionné */}
              <div className="pt-2">
                {selectedPaymentTab === 'card' && (
                  <div>
                    {!isStripeConfigured ? (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
                        <div className="flex items-center gap-2 font-medium">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Configuration Stripe Requise</span>
                        </div>
                        <p className="text-[11px] text-amber-200/80 leading-relaxed">
                          Pour activer les paiements par carte bancaire en direct, renseignez vos clés <code className="text-white">VITE_STRIPE_PUBLISHABLE_KEY</code> et <code className="text-white">STRIPE_SECRET_KEY</code> dans le fichier <code className="text-white">.env</code>.
                        </p>
                      </div>
                    ) : isInitializingPayment ? (
                      <div className="p-8 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        <span>Sécurisation de la session bancaire en cours...</span>
                      </div>
                    ) : stripePromise && stripeClientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                        <StripeCardForm
                          orderId={serverOrderId}
                          clientSecret={stripeClientSecret}
                          totalFormatted={formatPrice(finalCheckoutTotal)}
                          billingDetails={formData}
                          onSuccess={handlePaymentSuccess}
                          onError={(err) => addToast(err.message, 'error')}
                        />
                      </Elements>
                    ) : (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                        {initError || 'Échec de connexion au serveur de paiement bancaire.'}
                      </div>
                    )}
                  </div>
                )}

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

            {/* 5. Section d'information Cartes Cadeaux Google Play (PART 2.4) */}
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
                  <span>Total à Payer</span>
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
                  Paiement 100% sécurisé sans conservation de données bancaires. Débit uniquement après validation cryptographique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
