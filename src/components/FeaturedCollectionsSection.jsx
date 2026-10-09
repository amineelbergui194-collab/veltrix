import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, formatPrice } from '../data/products';
import { Sparkles, ArrowRight, Eye, ShoppingBag, Heart, Star, Check } from 'lucide-react';

export const FeaturedCollectionsSection = () => {
  const {
    navigateTo,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct
  } = useShop();

  const [activeCategory, setActiveCategory] = useState('all');
  const [addedItem, setAddedItem] = useState(null);

  const categories = [
    { id: 'all', label: 'All Releases' },
    { id: 'airpods', label: 'AirPods & In-Ear' },
    { id: 'headphones', label: 'Over-Ear ANC' },
    { id: 'apple-watch', label: 'Apple Watch' },
    { id: 'cables-adapters', label: 'Power & Cables' },
  ];

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS.slice(0, 8)
    : PRODUCTS.filter((p) => p.categorySlug === activeCategory).slice(0, 8);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1600);
  };

  return (
    <section className="relative bg-[#0C0C0C] text-[#D7E2EA] font-kanit rounded-t-[3rem] sm:rounded-t-[4.5rem] -mt-10 sm:-mt-14 pt-20 sm:pt-28 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 z-40 border-t border-white/10 shadow-[0_-25px_50px_rgba(0,0,0,0.8)]">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[#B600A8]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-white/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-[#FF66EA] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Catalog</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gradient leading-none">
              Hardware Editions
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-white text-[#0C0C0C] shadow-lg shadow-white/20'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid with Studio Aesthetic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12">
          {filteredProducts.map((product, idx) => {
            const wishlisted = isWishlisted(product.id);
            const isAdded = addedItem === product.id;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigateTo('product-detail', product)}
                className="group rounded-3xl bg-[#141416]/80 border border-white/10 hover:border-white/30 p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#B600A8]/20 relative overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full rounded-2xl bg-[#0C0C0C]/80 border border-white/5 flex items-center justify-center p-6 overflow-hidden">
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/15 text-white">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                      wishlisted
                        ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                  </button>

                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="max-h-[85%] max-w-[85%] object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Quick View Button Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0C0C0C]/90 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 cursor-pointer z-10 whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>

                {/* Content */}
                <div className="pt-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-neutral-400 uppercase tracking-widest text-[10px] font-semibold">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="text-xs font-mono font-bold text-white">{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#FF66EA] transition-colors line-clamp-1 uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-light line-clamp-1 mt-1">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Price & Cart button */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold font-mono text-white">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs font-mono text-neutral-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`p-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-[#0C0C0C]'
                          : 'bg-white/10 hover:bg-white text-white hover:text-[#0C0C0C] border border-white/15'
                      }`}
                      aria-label="Add to cart"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-[11px] px-1">Added</span>
                        </>
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA to Shop Page */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigateTo('shop')}
            className="btn-accent-gradient px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer inline-flex items-center gap-2 group"
          >
            <span>View All {PRODUCTS.length} Hardware Editions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
