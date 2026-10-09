import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../data/products';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ChevronRight
} from 'lucide-react';

const QuickViewDialog = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isWishlisted, navigateTo } = useShop();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedColor);
    onClose();
  };

  const handleFullDetail = () => {
    onClose();
    navigateTo('product-detail', product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#0C0C0C] border border-white/10 rounded-3xl text-white shadow-2xl z-10 overflow-hidden font-kanit">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Images */}
          <div className="p-6 bg-[#141416]/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
            <div className="relative aspect-square w-full rounded-2xl bg-[#0C0C0C] border border-white/5 flex items-center justify-center p-6 mb-4">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain drop-shadow-xl"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 rounded-xl border p-1 bg-[#0C0C0C] transition-all ${
                      selectedImage === idx
                        ? 'border-[#FF66EA] ring-1 ring-[#FF66EA]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[10px] text-[#BBCCD7] uppercase tracking-widest font-bold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-mono text-xs font-bold text-white">
                    {product.rating}
                  </span>
                  <span className="text-neutral-500 text-[10px]">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-1">
                {product.name}
              </h2>
              <p className="text-xs text-neutral-400 font-light mb-4">
                {product.subtitle}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-white/5">
                <span className="text-2xl font-bold font-mono text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-neutral-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Color selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs uppercase font-semibold tracking-wider text-neutral-300 mb-2">
                    Finish: <span className="text-white font-normal">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          selectedColor.name === color.name
                            ? 'border-white scale-110 shadow-md'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs uppercase font-semibold tracking-wider text-neutral-300">
                  Quantity
                </span>
                <div className="flex items-center border border-white/10 rounded-full bg-white/5">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-1 text-sm text-neutral-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-white">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3 py-1 text-sm text-neutral-400 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-full btn-accent-gradient text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#B600A8]/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart — {formatPrice(product.price * qty)}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex-1 py-2.5 rounded-full border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    wishlisted
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                  <span>{wishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>

                <button
                  onClick={handleFullDetail}
                  className="flex-1 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Full Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct } = useShop();

  if (!quickViewProduct) return null;

  return (
    <QuickViewDialog
      product={quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
    />
  );
};
