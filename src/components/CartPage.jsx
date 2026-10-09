import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../data/products';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  ArrowLeft,
  Truck,
  RotateCcw
} from 'lucide-react';

export const CartPage = () => {
  const {
    cart,
    cartItemCount,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    standardShippingCost,
    isFreeShipping,
    shippingThreshold,
    finalTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    navigateTo
  } = useShop();

  const [promoCodeInput, setPromoCodeInput] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    applyPromoCode(promoCodeInput);
    setPromoCodeInput('');
  };

  const amountNeeded = Math.max(0, shippingThreshold - subtotal);
  const freeShippingPct = Math.min(100, (subtotal / shippingThreshold) * 100);

  return (
    <div className="py-12 bg-neutral-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigateTo('shop')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Shopping Cart</h1>
            <p className="text-sm text-neutral-400 mt-1 font-mono">
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your bag
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 p-8 max-w-xl mx-auto">
            <ShoppingBag className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Your cart is currently empty</h2>
            <p className="text-sm text-neutral-400 mb-8">
              Explore our best sellers or curated audio to upgrade your everyday setup.
            </p>
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Alert Banner */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                {isFreeShipping ? (
                  <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Your order qualifies for Free Express Shipping!</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-300 mb-2">
                      <span>Add {formatPrice(amountNeeded)} more for Free Shipping</span>
                      <span>{Math.round(freeShippingPct)}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${freeShippingPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="rounded-2xl bg-neutral-900/40 border border-neutral-800 overflow-hidden">
                <div className="divide-y divide-neutral-850">
                  {cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor.name}-${idx}`}
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Product image & name */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className="w-20 h-20 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0 cursor-pointer p-1.5 flex items-center justify-center"
                          onClick={() => navigateTo('product-detail', item.product)}
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3
                            onClick={() => navigateTo('product-detail', item.product)}
                            className="text-sm sm:text-base font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer"
                          >
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-neutral-400 font-mono mt-0.5">
                            Finish: {item.selectedColor.name}
                          </p>
                          <span className="text-xs font-mono text-neutral-300 sm:hidden block mt-1">
                            {formatPrice(item.product.price)} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center rounded-xl bg-neutral-950 border border-neutral-800 p-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor.name,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-mono font-bold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor.name,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <div className="font-mono font-bold text-base text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor.name)}
                          className="p-2 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4">
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 sticky top-24 space-y-6">
                <h3 className="text-lg font-bold text-white pb-4 border-b border-neutral-800">
                  Order Summary
                </h3>

                {/* Promo code input */}
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Promo Code
                  </label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
                      <div className="flex items-center gap-2 text-cyan-300 font-mono">
                        <Tag className="w-4 h-4" />
                        <span className="font-bold">{appliedPromo.code}</span>
                        <span className="text-neutral-400">({appliedPromo.label})</span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="flex gap-2">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="e.g. VELTRIX10"
                        className="flex-1 px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 uppercase font-mono focus:border-cyan-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-3 text-xs sm:text-sm font-mono border-t border-neutral-800 pt-4 text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-cyan-400">
                      <span>Promo Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Estimated Shipping</span>
                    <span className="text-white">
                      {standardShippingCost === 0 ? 'FREE' : formatPrice(standardShippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-neutral-800 text-base font-bold text-white">
                    <span>Total</span>
                    <span className="text-cyan-300 text-xl">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigateTo('checkout')}
                  className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Guarantees */}
                <div className="pt-4 border-t border-neutral-850 space-y-2 text-xs text-neutral-400 font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>256-bit encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-cyan-400" />
                    <span>30-Day risk-free trial</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
