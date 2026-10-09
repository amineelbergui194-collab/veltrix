import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../data/products';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Zap,
  Tag
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
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

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
    setPromoInput('');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const amountNeededForFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / shippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-800 text-white h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold">Shopping Cart</h2>
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono">
              {cartItemCount}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-neutral-900/60 p-3.5 border-b border-neutral-850 text-xs">
          {isFreeShipping ? (
            <div className="flex items-center gap-2 text-cyan-300 font-medium">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>You've unlocked Free Express Shipping!</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-neutral-300 font-mono text-[11px]">
                <span>Add {formatPrice(amountNeededForFreeShipping)} more for Free Shipping</span>
                <span>{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-neutral-400">
              <ShoppingBag className="w-12 h-12 mx-auto text-neutral-600 mb-3" />
              <p className="text-sm font-semibold text-neutral-300">Your cart is currently empty</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Explore our best sellers or curated audio to upgrade your everyday setup.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('shop');
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor.name}-${index}`}
                className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-850 flex gap-3.5 items-start"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-neutral-950 overflow-hidden shrink-0 border border-neutral-800 p-1 flex items-center justify-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor.name)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Finish: {item.selectedColor.name}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-lg bg-neutral-950 border border-neutral-800">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedColor.name,
                            item.quantity - 1
                          )
                        }
                        className="w-6 h-6 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-mono text-xs font-semibold">
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
                        className="w-6 h-6 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-neutral-850 bg-neutral-950 space-y-4">
            {/* Promo Code Input */}
            {appliedPromo ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-mono font-bold">{appliedPromo.code}</span>
                  <span className="text-neutral-400">({appliedPromo.label})</span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-neutral-400 hover:text-white text-[11px] font-mono cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (e.g. VELTRIX10)"
                  className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 uppercase font-mono focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-400 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-cyan-400">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-white">
                  {standardShippingCost === 0 ? 'FREE' : formatPrice(standardShippingCost)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-850 text-sm font-bold text-white">
                <span>Total</span>
                <span className="text-cyan-300">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('cart');
                }}
                className="text-[11px] font-mono text-neutral-400 hover:text-white underline cursor-pointer"
              >
                View full cart page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
