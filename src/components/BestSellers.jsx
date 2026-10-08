import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { ArrowRight, Flame } from 'lucide-react';

export const BestSellers = () => {
  const { navigateTo } = useShop();

  // Filter 8 flagship best sellers
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-neutral-950 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Best Sellers
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl">
              Engineered for everyday excellence. Discover the most popular audio, charging, and wearable hardware loved by tech enthusiasts.
            </p>
          </div>

          <button
            onClick={() => navigateTo('shop', null, 'all')}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-cyan-400 transition-colors group cursor-pointer"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid: 4 columns on large screens, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
