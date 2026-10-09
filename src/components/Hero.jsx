import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, formatPrice } from '../data/products';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Volume2,
  Watch,
  BatteryCharging,
  Eye,
  Check
} from 'lucide-react';

export const Hero = () => {
  const { navigateTo, addToCart, setQuickViewProduct } = useShop();

  // Featured flagship items for interactive showcase switcher
  const heroItems = [
    {
      product: PRODUCTS[0], // AirPods Pro 2
      badge: 'AUDIO FLAGSHIP',
      icon: Volume2,
      tag: 'Next-Gen Acoustic Fidelity',
      statLabel: 'Noise Reduction',
      statVal: '2x Active ANC',
      highlightSpec: 'MagSafe USB-C Case • H2 Precision Audio',
      bgGlow: 'from-cyan-500/15 via-blue-600/10 to-transparent'
    },
    {
      product: PRODUCTS[2], // Veltrix Horizon ANC
      badge: 'STUDIO OVER-EAR',
      icon: Sparkles,
      tag: '60h Extended Endurance',
      statLabel: 'Battery Runtime',
      statVal: '60 Hours',
      highlightSpec: '45mm Titanium Neodymium Diaphragms',
      bgGlow: 'from-purple-500/15 via-indigo-600/10 to-transparent'
    },
    {
      product: PRODUCTS[7], // Apple Watch Ultra 2
      badge: 'RUGGED WEARABLE',
      icon: Watch,
      tag: 'Aerospace Grade 49mm',
      statLabel: 'Water Resistance',
      statVal: '100m Depth',
      highlightSpec: '3000-Nit Sapphire Display • Dual-GPS',
      bgGlow: 'from-amber-500/15 via-orange-600/10 to-transparent'
    },
    {
      product: PRODUCTS[4], // USB-C 100W Cable
      badge: 'ULTRA CONNECTIVITY',
      icon: BatteryCharging,
      tag: 'Kevlar Reinforced Core',
      statLabel: 'Max Power Delivery',
      statVal: '100W PD 3.0',
      highlightSpec: 'E-Marker Intelligent Chip • 2-Meter Length',
      bgGlow: 'from-emerald-500/15 via-teal-600/10 to-transparent'
    }
  ];

  const [activeTab, setActiveTab] = useState(0);
  const activeHero = heroItems[activeTab];

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 border-b border-neutral-900">
      {/* Background radial gradients & subtle tech mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: HERO HEADLINE & ACTIONS */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono mb-6 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="font-semibold text-white tracking-wider uppercase">Veltrix Engineering</span>
              <span className="text-neutral-500">•</span>
              <span className="text-cyan-400">2026 Collection</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 font-sans">
              Upgrade Your <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-cyan-400">
                Everyday.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-neutral-400 max-w-xl font-normal leading-relaxed mb-8">
              Discover premium audio, charging and smart accessories designed for the way you live. Engineered for peak performance, timeless aesthetics, and ultimate reliability.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12">
              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-white/10 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const catSection = document.getElementById('featured-categories');
                  if (catSection) {
                    catSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigateTo('shop');
                  }
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-200 hover:text-white border border-neutral-800 hover:border-neutral-700 font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Collection</span>
              </button>
            </div>

            {/* Micro Feature Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-850 w-full max-w-lg">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">100%</span>
                <span className="text-xs text-neutral-400">Tested Quality</span>
              </div>
              <div className="flex flex-col border-l border-neutral-850 pl-4">
                <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">24h</span>
                <span className="text-xs text-neutral-400">Fast Dispatch</span>
              </div>
              <div className="flex flex-col border-l border-neutral-850 pl-4">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">30 Days</span>
                <span className="text-xs text-neutral-400">Risk-Free Trial</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE HARDWARE SHOWCASE */}
          <div className="lg:col-span-5 relative w-full">
            {/* Interactive Device Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
              {heroItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeTab === idx;
                return (
                  <button
                    key={item.badge}
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-neutral-800 text-white border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-neutral-900/70 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850 border border-neutral-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-neutral-500'}`} />
                    <span>{item.product.category}</span>
                  </button>
                );
              })}
            </div>

            {/* SHOWCASE CARD */}
            <div className="relative rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden backdrop-blur-xl shadow-2xl p-6 transition-all duration-500 group">
              {/* Radial backdrop */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${activeHero.bgGlow} transition-colors duration-500`}
              />

              {/* Product Visual Presentation */}
              <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-neutral-800/90 text-[10px] font-mono font-bold tracking-wider text-cyan-300 border border-neutral-700/60">
                    {activeHero.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    <span>Ready to Ship</span>
                  </div>
                </div>

                {/* Main Product Image Container */}
                <div
                  className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-center p-4 cursor-pointer group/img"
                  onClick={() => navigateTo('product-detail', activeHero.product)}
                >
                  <img
                    src={activeHero.product.images[0]}
                    alt={activeHero.product.name}
                    className="w-full h-full object-contain p-2 rounded-lg group-hover/img:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Floating Quick Action Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-xs font-mono bg-neutral-900/90 text-neutral-200 px-3 py-1.5 rounded-lg border border-neutral-700 backdrop-blur-md">
                      {activeHero.highlightSpec}
                    </span>
                  </div>
                </div>

                {/* Product Info Bar */}
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3
                      onClick={() => navigateTo('product-detail', activeHero.product)}
                      className="text-lg font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      {activeHero.product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                      {activeHero.product.subtitle}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold font-mono text-white">
                      {formatPrice(activeHero.product.price)}
                    </div>
                    {activeHero.product.originalPrice && (
                      <span className="text-xs font-mono text-neutral-500 line-through">
                        {formatPrice(activeHero.product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Spec Highlight Pill */}
                <div className="mt-4 p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-neutral-400">{activeHero.statLabel}</span>
                  </div>
                  <span className="font-mono font-bold text-neutral-100">{activeHero.statVal}</span>
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setQuickViewProduct(activeHero.product)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                  <button
                    onClick={() => addToCart(activeHero.product, 1)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
