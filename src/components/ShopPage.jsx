import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const ShopPage = () => {
  const {
    activeCategoryFilter,
    setActiveCategoryFilter,
    navigateTo
  } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all'); // 'all', 'under-35', '35-100', '100-300', '300-plus'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState('all'); // 'all', '4.8', '4.9'
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-low', 'price-high', 'newest'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter Categories list
  const categoryFilters = [
    { id: 'all', name: 'All Categories' },
    { id: 'airpods', name: 'AirPods' },
    { id: 'headphones', name: 'Headphones' },
    { id: 'apple-watch', name: 'Apple Watch' },
    { id: 'cables-adapters', name: 'Cables & Adapters' },
    { id: 'accessories', name: 'Accessories' },
  ];

  const resetFilters = () => {
    setActiveCategoryFilter('all');
    setSearchTerm('');
    setPriceRange('all');
    setInStockOnly(false);
    setMinRating('all');
    setSortBy('popular');
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category
      if (activeCategoryFilter !== 'all') {
        if (activeCategoryFilter === 'cables') {
          if (!item.name.toLowerCase().includes('cable')) return false;
        } else if (activeCategoryFilter === 'adapters') {
          if (!item.name.toLowerCase().includes('adapter') && !item.name.toLowerCase().includes('charger')) return false;
        } else if (item.categorySlug !== activeCategoryFilter) {
          return false;
        }
      }

      // Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSub = item.subtitle.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesName && !matchesSub && !matchesCat && !matchesDesc) return false;
      }

      // Price filter
      if (priceRange === 'under-100' && item.price >= 100) return false;
      if (priceRange === '100-150' && (item.price < 100 || item.price > 150)) return false;
      if (priceRange === '150-250' && (item.price < 150 || item.price > 250)) return false;
      if (priceRange === '250-plus' && item.price < 250) return false;

      // Availability
      if (inStockOnly && !item.inStock) return false;

      // Rating
      if (minRating === '4.8' && item.rating < 4.8) return false;
      if (minRating === '4.9' && item.rating < 4.9) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      // 'popular'
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount;
    });
  }, [activeCategoryFilter, searchTerm, priceRange, inStockOnly, minRating, sortBy]);

  const activeFiltersCount =
    (activeCategoryFilter !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minRating !== 'all' ? 1 : 0);

  return (
    <div className="py-10 bg-[#0C0C0C] min-h-screen text-[#D7E2EA] font-kanit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-cyan-400">Shop Catalog</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Complete Tech Collection
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                Showing {filteredProducts.length} of {PRODUCTS.length} premium tech accessories
              </p>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Filters & Sorting ({activeFiltersCount})</span>
            </button>
          </div>
        </div>

        {/* Top Control Bar: Search & Quick Sorting */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, keywords, specs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400 whitespace-nowrap hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-medium text-neutral-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="popular">Popularity / Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTERS (Desktop & Mobile) */}
          <aside
            className={`lg:col-span-1 space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <span>Filter Products</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-neutral-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div className="py-4 border-b border-neutral-850">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        activeCategoryFilter === cat.id
                          ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {activeCategoryFilter === cat.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Price Range Filter */}
              <div className="py-4 border-b border-neutral-850">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Price Range
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-100', label: 'Under 100 DH' },
                    { id: '100-150', label: '100 DH — 150 DH' },
                    { id: '150-250', label: '150 DH — 250 DH' },
                    { id: '250-plus', label: '250 DH & Above' },
                  ].map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2.5 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                        className="accent-cyan-400"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Availability Filter */}
              <div className="py-4 border-b border-neutral-850">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Availability
                </h4>
                <label className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-cyan-400 rounded"
                  />
                  <span>In Stock Only ({PRODUCTS.filter(p => p.inStock).length})</span>
                </label>
              </div>

              {/* 4. Rating Filter */}
              <div className="pt-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Minimum Rating
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { id: 'all', label: 'All Ratings' },
                    { id: '4.8', label: '4.8 Stars & Above' },
                    { id: '4.9', label: '4.9 Stars & Above' },
                  ].map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-2.5 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === r.id}
                        onChange={() => setMinRating(r.id)}
                        className="accent-cyan-400"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800 p-8">
                <Sparkles className="w-10 h-10 text-neutral-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No products match your criteria</h3>
                <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
                  Try adjusting your search terms, category filters, or price range brackets.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
