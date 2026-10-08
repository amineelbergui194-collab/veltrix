import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
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
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Header = () => {
  const {
    currentView,
    navigateTo,
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAccountOpen,
    setIsContactOpen,
    setActiveCategoryFilter
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home', category: null },
    { label: 'Shop', view: 'shop', category: 'all' },
    { label: 'AirPods', view: 'shop', category: 'airpods' },
    { label: 'Headphones', view: 'shop', category: 'headphones' },
    { label: 'Apple Watch', view: 'shop', category: 'apple-watch' },
    { label: 'Cables & Adapters', view: 'shop', category: 'cables-adapters' },
    { label: 'Accessories', view: 'shop', category: 'accessories' },
    { label: 'Contact', action: () => setIsContactOpen(true) },
  ];

  const handleNavClick = (link) => {
    if (link.action) {
      link.action();
    } else {
      navigateTo(link.view, null, link.category);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. ANNOUNCEMENT BAR */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-neutral-300 text-xs py-2 px-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0 text-center font-medium tracking-wide">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Premium Tech Accessories — Upgrade Your Everyday.</span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-neutral-400 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => navigateTo('shop')}>
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Free Express Shipping Over $50
            </span>
            <span className="text-neutral-700">|</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => setIsContactOpen(true)}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 30-Day Risk-Free Trial
            </span>
          </div>
        </div>
      </div>

      {/* 2. STICKY HEADER */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800/80 shadow-2xl shadow-black/50 py-3.5'
            : 'bg-neutral-950/60 backdrop-blur-md border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/60 rounded-lg transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* BRAND LOGO */}
            <div className="flex items-center">
              <button
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2.5 group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-white flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-300">
                  <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-white via-neutral-100 to-cyan-300 font-mono text-lg tracking-tighter">
                      V
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black tracking-widest text-white group-hover:text-cyan-400 transition-colors">
                    VELTRIX
                  </span>
                  <span className="hidden sm:block text-[9px] font-mono tracking-widest text-neutral-400 uppercase -mt-1">
                    Upgrade Your Everyday
                  </span>
                </div>
              </button>
            </div>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === link.view && (!link.category || link.category === 'all')
                      ? 'text-white bg-neutral-900/90 border border-neutral-700/60'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* HEADER ICONS & ACTIONS */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-neutral-300 hover:text-white hover:bg-neutral-850 rounded-xl transition-all relative group"
                aria-label="Search tech accessories"
                title="Search (Ctrl + K)"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* Account Icon */}
              <button
                onClick={() => setIsAccountOpen(true)}
                className="p-2.5 text-neutral-300 hover:text-white hover:bg-neutral-850 rounded-xl transition-all relative group hidden sm:flex"
                aria-label="User Account"
                title="Account"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* Wishlist Icon with Counter */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-2.5 text-neutral-300 hover:text-white hover:bg-neutral-850 rounded-xl transition-all relative group"
                aria-label="View Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] font-bold flex items-center justify-center font-mono">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Icon with Counter */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 pl-3 pr-3.5 text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl transition-all relative flex items-center gap-2 group shadow-sm hover:border-cyan-500/50"
                aria-label="View Shopping Cart"
                title="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold font-mono">
                  {cartItemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE HAMBURGER MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-neutral-950 border-r border-neutral-800 text-white h-full flex flex-col z-10 p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-mono font-bold text-sm">
                  V
                </div>
                <span className="font-extrabold tracking-wider text-lg">VELTRIX</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-xs uppercase tracking-wider text-neutral-500 font-mono mb-2">
                Navigation
              </p>
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className="flex items-center justify-between py-3 px-3 text-left font-medium text-neutral-200 hover:text-cyan-400 hover:bg-neutral-900 rounded-lg transition-colors text-sm"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-neutral-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAccountOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 text-neutral-200 hover:text-white border border-neutral-800 text-sm font-medium"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Account & Orders</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('shop');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-neutral-950 font-bold text-sm shadow-lg shadow-cyan-500/20"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
