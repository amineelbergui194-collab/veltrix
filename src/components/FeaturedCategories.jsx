import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FeaturedCategories = () => {
  const { navigateTo } = useShop();

  return (
    <section id="featured-categories" className="py-16 sm:py-24 bg-neutral-950 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Ecosystem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Categories
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl">
              Precision-crafted audio, intelligent wearables, and next-generation power accessories.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop', null, 'all')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-cyan-400 transition-colors group cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5 Categories Grid: 2 top large cards, 3 bottom cards for a high-end designer layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat, index) => {
            // First two categories take 3 columns each on lg (half width), remaining three take 2 columns each (one-third width)
            const colSpan = index < 2 ? 'lg:col-span-3' : 'lg:col-span-2';

            return (
              <div
                key={cat.id}
                className={`relative group rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 transition-all duration-500 flex flex-col justify-between ${colSpan}`}
              >
                {/* Image Container with Dark Ambient Overlay */}
                <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-neutral-900 flex items-center justify-center p-6">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-90 pointer-events-none" />
                  
                  {/* Category Item Count Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-neutral-950/80 border border-neutral-800 text-[11px] font-mono text-neutral-300 backdrop-blur-md">
                      {cat.count}
                    </span>
                  </div>
                </div>

                {/* Content Overlay / Card Bottom */}
                <div className="p-6 relative z-10 -mt-20">
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-neutral-400 mt-2 mb-6 line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>

                  <button
                    onClick={() => navigateTo('shop', null, cat.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-3 px-5 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-white text-white hover:text-neutral-950 border border-neutral-700/80 font-semibold text-xs tracking-wide uppercase transition-all duration-300 group/btn cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
