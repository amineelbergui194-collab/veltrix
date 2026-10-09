import React from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft, ShieldCheck, Zap, Sparkles, Headphones } from 'lucide-react';

export const AuthLayout = ({
  children,
  title,
  subtitle,
  badgeText = 'VELTRIX AUTHENTICATION',
}) => {
  const { navigateTo } = useShop();

  return (
    <div className="min-h-screen w-full bg-[#0C0C0C] text-[#D7E2EA] flex flex-col justify-between font-kanit relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#B600A8]/10 blur-[150px] rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-[#7621B0]/15 blur-[160px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Top Header / Nav back */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center p-0.5 shadow-lg shadow-[#B600A8]/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0C0C0C] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-white text-base">V</span>
            </div>
          </div>
          <span className="text-xl font-bold tracking-widest text-white group-hover:text-[#BBCCD7] transition-colors">
            VELTRIX
          </span>
        </button>

        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer py-2 px-3 rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>
      </header>

      {/* Main Container: Split-screen on lg, centered card on mobile/tablet */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Form Card */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md bg-[#121214]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-10 shadow-2xl shadow-black/80 relative"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-[#BBCCD7] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8] animate-pulse" />
                <span>{badgeText}</span>
              </div>

              {/* Title & Subtitle */}
              {title && (
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-gradient mb-3 leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-400 font-light leading-relaxed mb-8">
                  {subtitle}
                </p>
              )}

              {/* Form Content */}
              {children}
            </motion.div>
          </div>

          {/* Right Column: Decorative Visual / Creative 3D Showcase (Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center items-start pl-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg"
            >
              {/* Visual Ambient Card */}
              <div className="rounded-3xl bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border border-white/10 p-8 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B600A8]/20 blur-[90px] rounded-full pointer-events-none" />

                <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#FF66EA] uppercase mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>The Veltrix Ecosystem</span>
                </div>

                <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-4">
                  Elevate Every Interaction.
                </h2>

                <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                  Sign in to unlock prioritized expedited dispatch, cloud-saved order telemetry, custom sound profile calibrations, and your Obsidian Insider benefits.
                </p>

                {/* 3 Value Pillars */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-[#18011F] border border-[#B600A8]/40 flex items-center justify-center text-[#FF66EA] shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Instant Order Telemetry</div>
                      <div className="text-xs text-neutral-400">Real-time carrier tracking & one-tap reorders</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-[#18011F] border border-[#7621B0]/40 flex items-center justify-center text-[#BBCCD7] shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">2-Year Hardware Warranty</div>
                      <div className="text-xs text-neutral-400">Automated serial protection & priority replacement</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-[#18011F] border border-[#BE4C00]/40 flex items-center justify-center text-[#FF8A3D] shrink-0">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Exclusive Member Access</div>
                      <div className="text-xs text-neutral-400">VIP drops, early access to new limited editions</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-white/5 text-center text-xs text-neutral-400 font-light">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 VELTRIX TECH. All rights reserved.</div>
          <div className="flex items-center gap-6 text-neutral-400">
            <span>Encrypted 256-Bit SSL</span>
            <span>•</span>
            <span>Supabase Auth</span>
            <span>•</span>
            <span>Zero Tracking Logs</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
