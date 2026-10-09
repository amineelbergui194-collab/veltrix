import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../data/products';
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
      className="group relative rounded-3xl bg-[#141416]/90 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-[#B600A8]/20 font-kanit"
    >
      {/* CARD TOP / IMAGE CONTAINER */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#0C0C0C]/80 border-b border-white/5 flex items-center justify-center p-6">
        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border shadow-sm ${
                product.badge === 'BEST SELLER' || product.badge === 'FLAGSHIP'
                  ? 'bg-white/10 text-white border-white/20'
                  : product.badge === 'NEW'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-neutral-300 border-white/10'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B600A8]/20 text-[#FF66EA] border border-[#B600A8]/30">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3.5 right-3.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            wishlisted
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
              : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="max-h-[85%] max-w-[85%] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Quick View Button */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0C0C0C]/90 hover:bg-white text-neutral-200 hover:text-[#0C0C0C] text-xs font-semibold backdrop-blur-md border border-white/20 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 cursor-pointer z-10 uppercase tracking-wider whitespace-nowrap"
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
            <span className="font-mono text-[10px] text-[#BBCCD7] uppercase tracking-widest font-semibold">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-mono text-white text-xs font-bold">
                {product.rating}
              </span>
              <span className="text-neutral-500 text-[10px]">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-[#FF66EA] transition-colors line-clamp-1 uppercase tracking-tight">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-neutral-400 font-light mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs font-mono text-neutral-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Add To Cart Button */}
          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className={`p-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-500 text-[#0C0C0C]'
                : 'bg-white/5 hover:bg-white text-white hover:text-[#0C0C0C] border border-white/10 hover:border-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-[11px] px-1">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="text-[11px] px-1 hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
