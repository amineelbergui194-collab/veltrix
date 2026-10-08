import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Search, X, ArrowRight, Sparkles, Star } from 'lucide-react';

export const SearchModal = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    navigateTo,
    setActiveCategoryFilter
  } = useShop();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener (Ctrl + K or Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const popularSearches = ['AirPods Pro', '100W Cable', 'Apple Watch', 'GaN Charger', 'Over-Ear Headphones'];

  const results = query.trim()
    ? PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }).slice(0, 5)
    : [];

  const handleSelectProduct = (product) => {
    setIsSearchOpen(false);
    setQuery('');
    navigateTo('product-detail', product);
  };

  const handlePopularClick = (term) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl text-white shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search audio, chargers, Apple Watch, cables..."
            className="flex-1 bg-transparent text-base sm:text-lg text-white placeholder-neutral-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400">
            ESC
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {/* Quick Suggestions when empty */}
          {!query.trim() && (
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-3">
                Trending Searches
              </span>
              <div className="flex flex-wrap gap-2 mb-6">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularClick(term)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-3">
                Top Categories
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'AirPods & Earbuds', slug: 'airpods' },
                  { name: 'Over-Ear Headphones', slug: 'headphones' },
                  { name: 'Apple Watch & Straps', slug: 'apple-watch' },
                  { name: 'Charging Cables', slug: 'cables-adapters' },
                  { name: 'GaN Power Adapters', slug: 'cables-adapters' },
                  { name: 'Magnetic Accessories', slug: 'accessories' },
                ].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('shop', null, cat.slug);
                    }}
                    className="p-2.5 rounded-xl bg-neutral-900/50 hover:bg-neutral-850 border border-neutral-850 text-left text-xs font-medium text-neutral-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query.trim() && results.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-neutral-400 block mb-2">
                Found {results.length} Matches
              </span>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="p-3 rounded-xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-750 flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {product.category} • ${product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {query.trim() && results.length === 0 && (
            <div className="py-12 text-center text-neutral-400">
              <p className="text-sm font-semibold text-neutral-300">No products found for "{query}"</p>
              <p className="text-xs text-neutral-500 mt-1">Try searching for keywords like "AirPods", "Cables", or "JBL".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
