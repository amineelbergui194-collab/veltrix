import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export const Navbar = () => {
  const {
    currentView,
    navigateTo,
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsContactOpen,
  } = useShop();

  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4 Primary Navigation Links with Uppercase Typography as requested
  const primaryNavLinks = [
    { label: 'SHOP', view: 'shop', category: 'all' },
    { label: 'AUDIO', view: 'shop', category: 'airpods' },
    { label: 'WEARABLES', view: 'shop', category: 'apple-watch' },
    { label: 'ESSENTIALS', view: 'shop', category: 'cables-adapters' },
  ];

  const handleNavClick = (link) => {
    navigateTo(link.view, null, link.category);
    setMobileMenuOpen(false);
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigateTo('account');
    } else {
      navigateTo('login');
    }
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-[#0C0C0C] border-b border-white/5 text-neutral-300 text-[11px] py-2 px-4 transition-all font-kanit">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0 text-center font-normal tracking-wide">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B600A8] animate-pulse"></span>
            <span className="text-neutral-400">VELTRIX 2026 RELEASES:</span>
            <span className="text-white font-medium">Free Express Delivery on orders over 300 DH</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-neutral-400 text-[11px]">
            <span
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              onClick={() => navigateTo('shop')}
            >
              <Zap className="w-3.5 h-3.5 text-[#FF66EA]" /> GaN & MagSafe Hardware
            </span>
            <span className="text-white/20">|</span>
            <span
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              onClick={() => setIsContactOpen(true)}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 30-Day Risk-Free Trial
            </span>
          </div>
        </div>
      </div>

      {/* 2. CINEMATIC STUDIO STICKY HEADER */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 font-kanit ${
          isScrolled
            ? 'bg-[#0C0C0C]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/80 py-3.5'
            : 'bg-[#0C0C0C]/70 backdrop-blur-md border-b border-white/5 py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* BRAND LOGO */}
            <div className="flex items-center">
              <button
                onClick={() => navigateTo('home')}
                className="flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-accent-gradient flex items-center justify-center p-0.5 shadow-lg shadow-[#B600A8]/20 group-hover:shadow-[#B600A8]/40 transition-all duration-300">
                  <div className="w-full h-full bg-[#0C0C0C] rounded-[14px] flex items-center justify-center">
                    <span className="font-extrabold text-white text-lg tracking-tighter">
                      V
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black tracking-widest text-white group-hover:text-[#FF66EA] transition-colors leading-none block">
                    VELTRIX
                  </span>
                  <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-light block mt-0.5">
                    Upgrade Your Everyday
                  </span>
                </div>
              </button>
            </div>

            {/* 4 EVENLY SPACED PRIMARY NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {primaryNavLinks.map((link) => {
                const isActive =
                  currentView === link.view &&
                  (!link.category || link.category === 'all');
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white bg-white/10 border border-white/15'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* HEADER ACTIONS: SEARCH, WISHLIST, ACCOUNT, CART */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-neutral-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all cursor-pointer"
                aria-label="Search tech accessories"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-2.5 text-neutral-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative cursor-pointer"
                aria-label="View Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B600A8] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Account Button */}
              <button
                onClick={handleAccountClick}
                className="p-2 sm:px-3 sm:py-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer border border-transparent hover:border-white/10"
                aria-label="User Account"
                title={isAuthenticated ? 'My Account' : 'Sign In'}
              >
                <User className="w-4 h-4 text-[#FF66EA]" />
                <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-neutral-200">
                  {isAuthenticated ? (user?.user_metadata?.full_name?.split(' ')[0] || 'Account') : 'Sign In'}
                </span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 pl-3.5 pr-4 text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all relative flex items-center gap-2.5 group cursor-pointer hover:border-white/20"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#FF8A3D] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold font-mono text-white">
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* 3. MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex font-kanit">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-4/5 max-w-sm bg-[#0C0C0C] border-r border-white/10 text-white h-full flex flex-col z-10 p-6 overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center font-bold text-sm">
                    V
                  </div>
                  <span className="font-extrabold tracking-widest text-lg">VELTRIX</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6">
                <p className="text-[10px] uppercase tracking-widest text-[#FF66EA] font-semibold mb-3">
                  Catalog Navigation
                </p>
                <div className="flex flex-col gap-1.5">
                  {primaryNavLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link)}
                      className="flex items-center justify-between py-3 px-4 text-left font-bold text-neutral-200 hover:text-white hover:bg-white/5 rounded-2xl transition-all text-sm uppercase tracking-wider"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-600" />
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsContactOpen(true);
                    }}
                    className="flex items-center justify-between py-3 px-4 text-left font-bold text-neutral-200 hover:text-white hover:bg-white/5 rounded-2xl transition-all text-sm uppercase tracking-wider"
                  >
                    <span>Support & Trial</span>
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAccountClick();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-wider"
                >
                  <User className="w-4 h-4 text-[#FF66EA]" />
                  <span>{isAuthenticated ? 'My Member Portal' : 'Sign In / Register'}</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('shop');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl btn-accent-gradient text-white text-xs font-bold uppercase tracking-wider"
                >
                  <span>Explore 2026 Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Header = Navbar;
