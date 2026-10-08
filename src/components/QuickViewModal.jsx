import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Heart,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const QuickViewModal = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo
  } = useShop();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedColor);
    setQuickViewProduct(null);
  };

  const handleFullDetail = () => {
    setQuickViewProduct(null);
    navigateTo('product-detail', product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl text-white shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-900/80 hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Images */}
          <div className="p-6 bg-neutral-900/30 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-850">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-center p-4 mb-4">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 justify-center">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border cursor-pointer ${
                    selectedImage === i ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-neutral-800 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info and Config */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                <span>{product.category}</span>
                <span className="text-emerald-400 font-semibold">In Stock</span>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{product.name}</h2>
              <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{product.subtitle}</p>

              {/* Star rating */}
              <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-4">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-mono font-bold text-white">{product.rating}</span>
                <span className="text-neutral-500">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-neutral-850">
                <span className="text-2xl font-bold font-mono text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-neutral-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Color Finish */}
              <div className="mb-4">
                <span className="block text-[11px] font-mono text-neutral-400 mb-2">
                  Finish: <strong className="text-white">{selectedColor.name}</strong>
                </span>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer ${
                        selectedColor.name === c.name
                          ? 'border-cyan-400 bg-neutral-900 text-white'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <span className="block text-[11px] font-mono text-neutral-400 mb-2">Quantity</span>
                <div className="inline-flex items-center rounded-lg bg-neutral-900 border border-neutral-800 p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-7 h-7 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono text-xs font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-7 h-7 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-neutral-850">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart — ${(product.price * qty).toFixed(2)}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                    wishlisted
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                  <span>{wishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>

                <button
                  onClick={handleFullDetail}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
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
