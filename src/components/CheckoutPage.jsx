import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../data/products';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  ArrowLeft
} from 'lucide-react';

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

  // Form Fields
  const [formData, setFormData] = useState({
    email: 'tech.enthusiast@veltrix.com',
    phone: '+212 6 00 00 00 00',
    firstName: 'Karim',
    lastName: 'El Amrani',
    address: '15 Boulevard d\'Anfa',
    apartment: 'Appt 12',
    city: 'Casablanca',
    state: 'Grand Casablanca',
    zip: '20000',
    country: 'Morocco',
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard', 'express', 'overnight'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'apple-pay', 'paypal'

  // Card details
  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    name: 'Karim El Amrani',
    expiry: '12/28',
    cvc: '883',
  });

  // Order Placement State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  // Shipping cost options in DH
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

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = 'VELT-' + Math.floor(100000 + Math.random() * 900000);
      setConfirmedOrderId(generatedId);
      setOrderComplete(true);
      clearCart();
      addToast(`Order ${generatedId} confirmed! Check your email for shipping tracking.`, 'success');
    }, 1500);
  };

  // ORDER SUCCESS SCREEN
  if (orderComplete) {
    return (
      <div className="py-20 bg-neutral-950 text-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            Payment Confirmed
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-2">
            Thank you for your order!
          </h1>
          <p className="text-neutral-400 text-sm max-w-md mx-auto mb-8">
            We have dispatched a receipt and tracking confirmation to{' '}
            <strong className="text-white">{formData.email}</strong>.
          </p>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-left font-mono text-xs sm:text-sm space-y-4 mb-8">
            <div className="flex justify-between border-b border-neutral-800 pb-3">
              <span className="text-neutral-400">Order Reference</span>
              <span className="text-cyan-300 font-bold">{confirmedOrderId}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-3">
              <span className="text-neutral-400">Delivery Address</span>
              <span className="text-neutral-200 text-right">
                {formData.address}, {formData.city}, {formData.state} {formData.zip}
              </span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-3">
              <span className="text-neutral-400">Shipping Service</span>
              <span className="text-neutral-200 capitalize">
                {shippingMethod} Delivery ({shippingMethod === 'standard' ? '3-5 Days' : shippingMethod === 'express' ? '1-2 Days' : 'Next Day'})
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1">
              <span className="text-white">Total Paid</span>
              <span className="text-cyan-300">{formatPrice(finalCheckoutTotal)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('home')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT FORM SCREEN
  return (
    <div className="py-10 bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Trust Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
          <div>
            <button
              onClick={() => navigateTo('cart')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Cart</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Express Checkout
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>256-Bit SSL Encrypted & PCI Compliant</span>
          </div>
        </div>

        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: CHECKOUT INPUTS */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Quick One-Touch Payment Mockups */}
            <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-3">
                Express Digital Checkout
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('apple-pay');
                    addToast('Apple Pay selected', 'info');
                  }}
                  className={`py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    paymentMethod === 'apple-pay'
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 text-white border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span> Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('paypal');
                    addToast('PayPal selected', 'info');
                  }}
                  className={`py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-neutral-900 text-white border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span className="italic">PayPal</span>
                </button>
              </div>
            </div>

            {/* 2. Contact Information */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <span>Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Email Address</label>
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
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Phone Number</label>
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

            {/* 3. Shipping Address */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <span>Shipping Address</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">First Name</label>
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
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Last Name</label>
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
                <label className="block text-xs font-mono text-neutral-400 mb-1">Street Address</label>
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
                  <label className="block text-xs font-mono text-neutral-400 mb-1">City</label>
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
                  <label className="block text-xs font-mono text-neutral-400 mb-1">State</label>
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
                  <label className="block text-xs font-mono text-neutral-400 mb-1">ZIP Code</label>
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

            {/* 4. Delivery Method */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs flex items-center justify-center font-mono">
                  3
                </span>
                <span>Delivery Options</span>
              </h2>

              <div className="space-y-3">
                {[
                  {
                    id: 'standard',
                    name: 'Standard Insured Delivery',
                    time: '3–5 business days',
                    price: shippingCosts.standard === 0 ? 'FREE' : formatPrice(shippingCosts.standard),
                  },
                  {
                    id: 'express',
                    name: 'Express Priority Air',
                    time: '1–2 business days',
                    price: formatPrice(shippingCosts.express),
                  },
                  {
                    id: 'overnight',
                    name: 'Next-Day Rush Priority',
                    time: 'Tomorrow by 10:30 AM',
                    price: formatPrice(shippingCosts.overnight),
                  },
                ].map((del) => (
                  <label
                    key={del.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === del.id
                        ? 'border-cyan-400 bg-neutral-900/80'
                        : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
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

            {/* 5. Payment Details */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs flex items-center justify-center font-mono">
                  4
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-cyan-400 bg-neutral-900 text-white'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  Credit / Debit Card
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Expiration</label>
                      <input
                        type="text"
                        required
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Security Code (CVC)</label>
                      <input
                        type="text"
                        required
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        placeholder="CVC"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: STICKY ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 sticky top-24 space-y-6">
              <h3 className="text-base font-bold text-white pb-4 border-b border-neutral-800">
                Order Review ({cart.length} Products)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">{item.product.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          Qty: {item.quantity} • {item.selectedColor.name}
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
              <div className="space-y-2 border-t border-neutral-800 pt-4 text-xs font-mono text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-cyan-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Shipping</span>
                  <span>{activeShippingCost === 0 ? 'FREE' : formatPrice(activeShippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Grand Total</span>
                  <span className="text-cyan-300">{formatPrice(finalCheckoutTotal)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    Authorizing Secure Payment...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Complete Order — {formatPrice(finalCheckoutTotal)}</span>
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>30-Day Money Back Guarantee</span>
                </div>
                <p className="text-[10px] text-neutral-500">
                  By placing this order, you agree to Veltrix terms of service and warranty policies.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
