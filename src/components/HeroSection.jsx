import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, formatPrice } from '../data/products';
import { PrimaryButton } from './ui/PrimaryButton';
import { SecondaryButton } from './ui/SecondaryButton';
import { Magnet } from './ui/Magnet';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Volume2,
  Watch,
  BatteryCharging,
  Eye,
  Check
} from 'lucide-react';

export const HeroSection = () => {
  const { navigateTo, addToCart, setQuickViewProduct } = useShop();

  const heroShowcaseItems = [
    {
      product: PRODUCTS[0], // AirPods Pro 2
      badge: 'AUDIO FLAGSHIP',
      icon: Volume2,
      specTitle: '2x Active Noise Cancellation',
      specSubtitle: 'H2 Silicon • MagSafe USB-C Acoustic Enclosure',
      glow: 'from-[#B600A8]/20 via-[#7621B0]/15 to-transparent',
      tag: 'Next-Gen Acoustic Fidelity',
      statLabel: 'Acoustic Precision',
      statVal: '48kHz / 24-Bit',
    },
    {
      product: PRODUCTS[2], // Horizon Over-Ear ANC
      badge: 'STUDIO REFERENCE',
      icon: Sparkles,
      specTitle: '60h Continuous Runtime',
      specSubtitle: '45mm Titanium Neodymium Diaphragms',
      glow: 'from-[#7621B0]/20 via-[#18011F]/20 to-transparent',
      tag: 'Extended Listening Endurance',
      statLabel: 'Battery Life',
      statVal: '60 Hours',
    },
    {
      product: PRODUCTS[7], // Apple Watch Ultra 2
      badge: 'RUGGED AEROSPACE',
      icon: Watch,
      specTitle: 'Aerospace Grade 49mm Titanium',
      specSubtitle: '3000-Nit Sapphire Crystal • Dual-GPS',
      glow: 'from-[#BE4C00]/20 via-[#B600A8]/15 to-transparent',
      tag: 'Mil-Spec Extreme Durability',
      statLabel: 'Depth Rating',
      statVal: '100m Submersion',
    },
    {
      product: PRODUCTS[4], // USB-C 100W Cable
      badge: 'ULTRA POWER DELIVERY',
      icon: BatteryCharging,
      specTitle: '100W Fast Charging 3.0',
      specSubtitle: 'Kevlar Reinforced Core • E-Marker IC',
      glow: 'from-[#FF8A3D]/20 via-[#7621B0]/15 to-transparent',
      tag: 'Ballistic Fiber Strength',
      statLabel: 'Power Delivery',
      statVal: '100W PD 3.0',
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const activeHero = heroShowcaseItems[activeIdx];
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(activeHero.product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center bg-[#0C0C0C] text-[#D7E2EA] font-kanit pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden border-b border-white/5">
      {/* Background Cinematic Radial Lights & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(182,0,168,0.12)_0%,transparent_70%)] blur-2xl" />
        <div className="absolute bottom-10 right-10 w-[550px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(118,33,176,0.12)_0%,transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: HERO HEADLINE & ACTIONS */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs tracking-widest uppercase font-semibold text-[#FF66EA] mb-6 shadow-inner"
            >
              <span className="w-2 h-2 rounded-full bg-[#B600A8] animate-pulse" />
              <span className="text-white">VELTRIX 2026 COLLECTION</span>
              <span className="text-neutral-500">•</span>
              <span className="text-[#BBCCD7]">ENGINEERED AUDIO & POWER</span>
            </motion.div>

            {/* Oversized Heading with Gradient Text */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.2rem,7.5vw,7.5rem)] font-extrabold uppercase tracking-tight text-gradient leading-[1.02] mb-6"
            >
              UPGRADE YOUR <br />
              <span className="text-gradient-silver">EVERYDAY.</span>
            </motion.h1>

            {/* Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-xl text-neutral-400 font-light max-w-xl leading-relaxed mb-10"
            >
              Immerse yourself in precision-crafted acoustics, 100W intelligent power delivery, and aerospace titanium wearables. Designed for flawless fidelity and daily refinement.
            </motion.p>

            {/* CTAs: Gradient Pill Button & Secondary Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12"
            >
              <Magnet radius={100} strength={0.25}>
                <PrimaryButton
                  onClick={() => navigateTo('shop')}
                  size="lg"
                  icon={ArrowRight}
                >
                  Explore Hardware
                </PrimaryButton>
              </Magnet>

              <SecondaryButton
                onClick={() => {
                  const section = document.getElementById('featured-content');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                  else navigateTo('shop');
                }}
                size="lg"
              >
                Discover Ecosystem
              </SecondaryButton>
            </motion.div>

            {/* Micro Feature Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-lg text-left"
            >
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-white block">
                  100%
                </span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-light">
                  Acoustic Benchmarked
                </span>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#FF66EA] block">
                  24H
                </span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-light">
                  Priority Dispatch
                </span>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white block">
                  30 Days
                </span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-light">
                  Risk-Free Trial
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: 3D-INSPIRED HARDWARE SHOWCASE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative w-full"
          >
            {/* Interactive Hardware Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
              {heroShowcaseItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={item.badge}
                    onClick={() => setActiveIdx(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#0C0C0C] shadow-lg shadow-white/20'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.product.category}</span>
                  </button>
                );
              })}
            </div>

            {/* SHOWCASE CARD */}
            <div className="relative rounded-3xl bg-[#121214]/90 border border-white/10 overflow-hidden backdrop-blur-2xl shadow-2xl p-6 sm:p-7 transition-all duration-500 group">
              {/* Radial Backdrop Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${activeHero.glow} transition-colors duration-700 pointer-events-none`}
              />

              <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-mono font-bold tracking-widest text-[#FF66EA] border border-white/10 uppercase">
                    {activeHero.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span className="font-mono text-[11px]">Ready to Dispatch</span>
                  </div>
                </div>

                {/* Main Product Image Visual Container */}
                <div
                  onClick={() => navigateTo('product-detail', activeHero.product)}
                  className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-[#0C0C0C]/80 border border-white/5 flex items-center justify-center p-6 cursor-pointer group/img"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeHero.product.id}
                      src={activeHero.product.images[0]}
                      alt={activeHero.product.name}
                      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="max-h-full max-w-[85%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] group-hover/img:scale-108 transition-transform duration-700"
                    />
                  </AnimatePresence>

                  {/* Spec Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[11px] font-mono bg-[#0C0C0C]/90 text-neutral-300 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                      {activeHero.specTitle}
                    </span>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3
                      onClick={() => navigateTo('product-detail', activeHero.product)}
                      className="text-xl font-bold uppercase tracking-tight text-white hover:text-[#FF66EA] transition-colors cursor-pointer"
                    >
                      {activeHero.product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-light line-clamp-1 mt-0.5">
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

                {/* Micro Stat */}
                <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Zap className="w-3.5 h-3.5 text-[#FF66EA]" />
                    <span>{activeHero.statLabel}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{activeHero.statVal}</span>
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setQuickViewProduct(activeHero.product)}
                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-500 text-[#0C0C0C]'
                        : 'btn-accent-gradient text-white'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <span>Add to Cart</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const Hero = HeroSection;
