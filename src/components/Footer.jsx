import React from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  ArrowUp
} from 'lucide-react';

export const Footer = () => {
  const {
    navigateTo,
    setIsContactOpen,
    setIsFaqOpen,
    setIsTrackingOpen,
    setIsAboutOpen
  } = useShop();
  const { isAuthenticated } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0C0C0C] text-neutral-400 pt-20 pb-12 border-t border-white/5 font-kanit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 mb-4 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-accent-gradient flex items-center justify-center p-0.5 shadow-lg shadow-[#B600A8]/20">
                <div className="w-full h-full bg-[#0C0C0C] rounded-[14px] flex items-center justify-center">
                  <span className="font-extrabold text-white text-base">
                    V
                  </span>
                </div>
              </div>
              <span className="text-2xl font-black tracking-widest text-white group-hover:text-[#FF66EA] transition-colors uppercase">
                VELTRIX
              </span>
            </button>

            <p className="text-sm font-semibold text-neutral-200 mb-2 uppercase tracking-wide">
              VELTRIX — Upgrade Your Everyday.
            </p>
            <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6 max-w-sm">
              Engineered electronics, spatial acoustics, and GaN power accessories designed for refined listening and high-speed everyday capability.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Follow Veltrix on Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#tiktok"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Follow Veltrix on TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.54c0 1.94-.52 3.86-1.55 5.51-1.52 2.44-4.04 4.07-6.91 4.39-2.85.31-5.74-.69-7.79-2.71-2.07-2.04-3.03-4.99-2.61-7.87.41-2.85 2.1-5.32 4.62-6.63 1.57-.82 3.37-1.14 5.14-.95v4.11c-1.15-.22-2.38-.05-3.41.5-1.04.56-1.78 1.55-2.04 2.71-.27 1.19-.01 2.45.69 3.44.71 1 1.83 1.62 3.06 1.68 1.23.05 2.45-.45 3.25-1.39.56-.66.86-1.52.85-2.4V.02h.65z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('shop', null, 'airpods')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AirPods In-Ear
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', null, 'headphones')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Over-Ear Headphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', null, 'apple-watch')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Apple Watch Wearables
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', null, 'cables-adapters')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  GaN Chargers & 100W Cables
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', null, 'accessories')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  MagSafe Essentials
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Account & Membership */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Account & Auth
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigateTo(isAuthenticated ? 'account' : 'login')}
                  className="hover:text-white transition-colors cursor-pointer text-[#BBCCD7]"
                >
                  {isAuthenticated ? 'My Member Portal' : 'Sign In to Account'}
                </button>
              </li>
              {!isAuthenticated && (
                <li>
                  <button
                    onClick={() => navigateTo('signup')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Create Account
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => navigateTo('forgot-password')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Password Recovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Order Telemetry
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Guarantee */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Support & Guarantee
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Engineering Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsFaqOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Compatibility FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  30-Day Risk-Free Trial
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  2-Year Hardware Warranty
                </button>
              </li>
            </ul>

            {/* Security Badge */}
            <div className="mt-6 p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] flex items-center gap-2 text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-[#FF66EA] shrink-0" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-neutral-400">
          <div>
            © 2026 VELTRIX TECH INC. All rights reserved.
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-mono">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              Apple Pay
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              Visa
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              MasterCard
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              COD Available
            </span>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer uppercase text-[11px] font-semibold"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
