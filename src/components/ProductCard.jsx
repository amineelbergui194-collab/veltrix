import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const {
    navigateTo,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigateTo('product-detail', product)}
      className="group relative rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700/90 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-black/60"
    >
      {/* CARD TOP / IMAGE CONTAINER */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-950/80 flex items-center justify-center p-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border shadow-sm ${
                product.badge === 'BEST SELLER' || product.badge === 'FLAGSHIP'
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : product.badge === 'NEW'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-neutral-800/90 text-neutral-300 border-neutral-700'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer ${
            wishlisted
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
              : 'bg-neutral-900/70 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-700/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image (with hover second angle if available) */}
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick View Button (Shows on hover) */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-neutral-900/90 hover:bg-white text-neutral-200 hover:text-neutral-950 text-xs font-semibold backdrop-blur-md border border-neutral-700/80 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 cursor-pointer z-10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* CARD BOTTOM / CONTENT */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-mono text-neutral-200 text-xs font-bold">
                {product.rating}
              </span>
              <span className="text-neutral-500 text-[11px]">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="mt-5 pt-4 border-t border-neutral-850 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs font-mono text-neutral-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add To Cart Button */}
          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className={`p-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-500 text-neutral-950'
                : 'bg-neutral-800 hover:bg-cyan-500 text-neutral-200 hover:text-neutral-950 border border-neutral-700/80 hover:border-cyan-400 shadow-sm'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
