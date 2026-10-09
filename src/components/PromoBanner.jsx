import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';

export const PromoBanner = () => {
  const { navigateTo } = useShop();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-neutral-950 border-b border-neutral-900">
      {/* Background with Dark Atmospheric Image & Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/jbl-headphones.jpg"
          alt="Veltrix Sound and Precision Hardware"
          className="w-full h-full object-cover object-center opacity-25 filter grayscale contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-cyan-400 text-xs font-mono mb-6 backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest font-semibold">Architected for Tomorrow</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Your Tech.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-white">
              Upgraded.
            </span>
          </h2>

          {/* Text */}
          <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed mb-8">
            Discover our latest collection of audio, charging and smart accessories. Built to withstand daily intensity while elevating your personal workstation and audio environment.
          </p>

          {/* Key pillars pill row */}
          <div className="flex flex-wrap items-center gap-3 mb-10 text-xs text-neutral-300 font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Studio Sound
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> MFi & GaN Safety
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 2-Year Warranty
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigateTo('shop', null, 'all')}
            className="px-8 py-4 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-sm tracking-wide uppercase transition-all duration-300 inline-flex items-center gap-3 shadow-2xl shadow-cyan-500/10 group cursor-pointer"
          >
            <span>Shop the Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
