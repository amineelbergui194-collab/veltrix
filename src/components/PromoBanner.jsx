import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';

export const PromoBanner = () => {
  const { navigateTo } = useShop();

  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-[#0C0C0C] border-b border-white/5 font-kanit">
      {/* Background with Dark Atmospheric Image & Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/jbl-headphones.jpg"
          alt="Veltrix Sound and Precision Hardware"
          className="w-full h-full object-cover object-center opacity-20 filter grayscale contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0C] via-[#0C0C0C]/90 to-[#0C0C0C]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(182,0,168,0.15)_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FF66EA] text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architected for Tomorrow</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.05] uppercase mb-6">
            Your Tech.{' '}
            <span className="text-gradient">
              Upgraded.
            </span>
          </h2>

          {/* Text */}
          <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed mb-8">
            Discover our latest collection of audio, charging and smart accessories. Built to withstand daily intensity while elevating your personal workstation and audio environment.
          </p>

          {/* Key pillars pill row */}
          <div className="flex flex-wrap items-center gap-3 mb-10 text-xs text-neutral-300">
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF66EA]" /> Studio Sound
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> MFi & GaN Safety
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B600A8]"></span> 2-Year Warranty
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigateTo('shop', null, 'all')}
            className="btn-accent-gradient px-8 py-4 text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer inline-flex items-center gap-3 shadow-2xl group"
          >
            <span>Shop the Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
