import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    navigateTo
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-800 text-white h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-lg font-bold">Saved Items</h2>
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono">
              {wishlist.length}
            </span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="py-20 text-center text-neutral-400">
              <Heart className="w-12 h-12 mx-auto text-neutral-700 mb-3" />
              <p className="text-sm font-semibold text-neutral-300">Your wishlist is empty</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Tap the heart icon on any product to save it for later inspection.
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  navigateTo('shop');
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-850 flex gap-3.5 items-center"
              >
                {/* Image */}
                <div
                  className="w-16 h-16 rounded-lg bg-neutral-950 overflow-hidden shrink-0 border border-neutral-800 cursor-pointer"
                  onClick={() => {
                    setIsWishlistOpen(false);
                    navigateTo('product-detail', product);
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4
                      onClick={() => {
                        setIsWishlistOpen(false);
                        navigateTo('product-detail', product);
                      }}
                      className="text-xs sm:text-sm font-bold text-white truncate hover:text-cyan-400 cursor-pointer"
                    >
                      {product.name}
                    </h4>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono font-bold text-xs sm:text-sm text-cyan-300">
                      ${product.price.toFixed(2)}
                    </span>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-cyan-500 hover:text-neutral-950 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 border-t border-neutral-850 bg-neutral-950">
            <button
              onClick={() => {
                wishlistedProducts.forEach((p) => addToCart(p, 1));
                setIsWishlistOpen(false);
              }}
              className="w-full py-3.5 rounded-xl bg-neutral-800 hover:bg-white text-white hover:text-neutral-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Add All to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
