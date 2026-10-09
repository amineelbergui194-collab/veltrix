import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, formatPrice } from '../data/products';
import { ProductCard } from './ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronRight,
  Share2
} from 'lucide-react';

export const ProductDetailPage = () => {
  const {
    selectedProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo,
    addToast
  } = useShop();

  const product = selectedProduct || PRODUCTS[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'shipping', 'reviews'
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newRev = {
      id: 'rev-' + Date.now(),
      author: newReviewAuthor.trim(),
      rating: Number(newReviewRating),
      date: 'Just now',
      verified: true,
      title: 'Customer Review',
      text: newReviewText.trim()
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewText('');
    addToast('Thank you! Your verified review has been published.', 'success');
  };

  // Related products from the same category or bestsellers
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.isBestSeller)
  ).slice(0, 4);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="py-10 bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-8">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <button
            onClick={() => navigateTo('shop', null, product.categorySlug)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-cyan-400 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Hero Grid: Gallery (Left) + Purchase Configuration (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT: LARGE PRODUCT IMAGE GALLERY */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-900 border transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-cyan-400 ring-2 ring-cyan-400/20'
                      : 'border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-neutral-900/60 border border-neutral-800 flex items-center justify-center p-6 group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl transition-transform duration-700 group-hover:scale-105"
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    {product.badge}
                  </span>
                )}
                {discountPercent && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 backdrop-blur-md">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Share & Wishlist in gallery */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  aria-label="Share product"
                  className="p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className={`p-2.5 rounded-xl border backdrop-blur-md transition-colors cursor-pointer ${
                    wishlisted
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                      : 'bg-neutral-900/80 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT CONFIGURATION & PURCHASE ACTIONS */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-cyan-400 uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  In Stock • Dispatches in 24h
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {product.name}
              </h1>
              <p className="text-sm text-neutral-400 mt-1.5">
                {product.subtitle}
              </p>

              {/* Rating & Review Summary */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400'
                          : 'text-neutral-600'
                      }`}
                    />
                  ))}
                  <span className="font-mono text-sm font-bold text-white ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-neutral-600">•</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-mono text-neutral-400 hover:text-cyan-400 underline cursor-pointer"
                >
                  {reviewsList.length} Customer Reviews
                </button>
              </div>

              {/* Price Block */}
              <div className="py-4 border-y border-neutral-800 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg font-mono text-neutral-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Save {formatPrice(product.originalPrice - product.price)} ({discountPercent}%)
                  </span>
                )}
              </div>

              {/* Color Selector */}
              <div className="my-6">
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-neutral-300 font-semibold uppercase">Color Finish</span>
                  <span className="text-cyan-400">{selectedColor.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        selectedColor.name === c.name
                          ? 'border-cyan-400 bg-neutral-900 text-white ring-1 ring-cyan-400'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-xs font-mono uppercase text-neutral-300 font-semibold mb-2">
                  Quantity
                </label>
                <div className="inline-flex items-center rounded-xl bg-neutral-900 border border-neutral-800 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* HIGH VISIBILITY ACTION BUTTONS: Add to Cart & Buy Now */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 group cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Add to Cart — {formatPrice(product.price * quantity)}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
                >
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>Buy Now — Instant Checkout</span>
                </button>
              </div>

              {/* Trust & Guarantee Indicators */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center text-xs">
                <div className="flex flex-col items-center gap-1 text-neutral-300">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold">Free Express</span>
                  <span className="text-[10px] text-neutral-500">Orders 300 DH+</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-neutral-300 border-x border-neutral-800">
                  <RotateCcw className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">30-Day Returns</span>
                  <span className="text-[10px] text-neutral-500">No questions asked</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold">Full Warranty</span>
                  <span className="text-[10px] text-neutral-500">1-2 Year Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED INFORMATION TABS: Specs, Shipping, Reviews */}
        <div className="mt-16 pt-12 border-t border-neutral-900">
          <div className="flex items-center gap-8 border-b border-neutral-800 pb-3">
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Customer Reviews (${reviewsList.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {/* 1. TECHNICAL SPECIFICATIONS TAB */}
            {activeTab === 'specs' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Product Overview</h3>
                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Key Engineering Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-xs sm:text-sm text-neutral-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Hardware Specifications</h3>
                  <div className="rounded-xl overflow-hidden border border-neutral-800">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <tbody>
                        {Object.entries(product.specs).map(([key, val], idx) => (
                          <tr
                            key={key}
                            className={`border-b border-neutral-850 ${
                              idx % 2 === 0 ? 'bg-neutral-900/30' : 'bg-neutral-900/10'
                            }`}
                          >
                            <td className="py-3 px-4 font-mono font-medium text-neutral-400 w-1/3">
                              {key}
                            </td>
                            <td className="py-3 px-4 font-medium text-neutral-200">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SHIPPING & RETURNS TAB */}
            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
                  <div className="flex items-center gap-2.5 mb-4 text-cyan-400 font-bold">
                    <Truck className="w-5 h-5" />
                    <h3 className="text-base text-white">Shipping Policy</h3>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                      <span><strong>Standard Delivery:</strong> 2-4 business days. Free on all orders over 300 DH.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                      <span><strong>Express Priority:</strong> 1-2 business days with live tracking for 35 DH.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                      <span>Orders placed before 2:00 PM EST ship same day from our distribution facility.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
                  <div className="flex items-center gap-2.5 mb-4 text-emerald-400 font-bold">
                    <RotateCcw className="w-5 h-5" />
                    <h3 className="text-base text-white">30-Day Return Guarantee</h3>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2"></span>
                      <span>Test your hardware for 30 days. If not 100% satisfied, initiate a prepaid return.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2"></span>
                      <span>Refunds processed within 48 hours of inspection back to original payment method.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2"></span>
                      <span>Comprehensive warranty covers all manufacturing defects and power performance.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. REVIEWS TAB & ADD REVIEW FORM */}
            {activeTab === 'reviews' && (
              <div className="max-w-4xl space-y-8">
                {/* Review Form */}
                <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <h3 className="text-base font-bold text-white mb-2">Write a Verified Review</h3>
                  <p className="text-xs text-neutral-400 mb-4">Share your setup feedback and everyday experience with {product.name}.</p>
                  <form onSubmit={handleAddReview} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="e.g. Jordan Reed"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1">Rating</label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400"
                        >
                          <option value="5">5 Stars — Flawless Quality</option>
                          <option value="4">4 Stars — Highly Recommend</option>
                          <option value="3">3 Stars — Satisfactory</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">Your Feedback</label>
                      <textarea
                        required
                        rows="3"
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Tell others how this product performs..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-neutral-500">{rev.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{rev.title}</h4>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{rev.text}</p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                        <span>{rev.author}</span>
                        {rev.verified && (
                          <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-20 pt-12 border-t border-neutral-900">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              You May Also Like
            </h2>
            <button
              onClick={() => navigateTo('shop', null, product.categorySlug)}
              className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
            >
              Explore {product.category}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
