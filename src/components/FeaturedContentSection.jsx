import React from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Volume2, Zap, Shield, Sparkles } from 'lucide-react';

export const FeaturedContentSection = () => {
  const { navigateTo } = useShop();

  const services = [
    {
      number: '01',
      title: 'SPATIAL ACOUSTIC ARCHITECTURE',
      subtitle: 'Custom Neodymium Drivers & Active Noise Suppression',
      description:
        'Engineered for true spatial immersion. Dynamic head tracking places sound around you in three-dimensional space, while real-time acoustic microphones cancel out ambient distractions.',
      actionText: 'Explore Audio Lineup',
      category: 'airpods',
      icon: Volume2,
    },
    {
      number: '02',
      title: 'NEXT-GEN GaN & 100W POWER DELIVERY',
      subtitle: 'Intelligent Thermal Safety & Fast Inductive Wireless',
      description:
        'Miniaturized Gallium Nitride semiconductors replace old silicon for 3x cooler operation and instant full-speed recharging across your laptop, phone, and wearables simultaneously.',
      actionText: 'Browse Power & Cables',
      category: 'cables-adapters',
      icon: Zap,
    },
    {
      number: '03',
      title: 'AEROSPACE-GRADE WEARABLE HARDWARE',
      subtitle: 'Titanium Alloys, Sapphire Crystal & 100M Depth Integrity',
      description:
        'Built to withstand rigorous athletic environments and daily metropolitan life alike. Precision mil-spec tolerances, shock mitigation bumpers, and tactile crown controls.',
      actionText: 'Discover Smart Wearables',
      category: 'apple-watch',
      icon: Shield,
    },
    {
      number: '04',
      title: 'CIRCULAR PACKAGING & 2-YEAR WARRANTY',
      subtitle: '100% Recyclable Materials & 30-Day Risk-Free Trial',
      description:
        'Every single Veltrix accessory arrives in minimal zero-plastic unboxing packaging, backed by an ironclad replacement warranty and 30 days to test the hardware in your routine.',
      actionText: 'Read Our Guarantee',
      action: () => alert('Veltrix Guarantee: 30-day money-back trial and 2-year express replacement warranty on all electronics.'),
      icon: Sparkles,
    },
  ];

  return (
    <section className="relative bg-[#FFFFFF] text-[#0C0C0C] font-kanit rounded-t-[3rem] sm:rounded-t-[4.5rem] pt-20 sm:pt-28 pb-24 sm:pb-32 px-6 sm:px-8 z-30 shadow-[0_-25px_50px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 sm:pb-16 border-b border-[#0C0C0C]/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C0C0C]/5 border border-[#0C0C0C]/10 text-xs font-semibold uppercase tracking-widest text-[#0C0C0C] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0C0C0C]" />
              <span>THE VELTRIX ARCHITECTURE</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#0C0C0C] leading-none">
              Four Core Pillars
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#0C0C0C]/70 font-light max-w-md">
            Our hardware ecosystem is governed by strict engineering standards that guarantee lasting performance, safety, and acoustic fidelity.
          </p>
        </div>

        {/* Vertical List of Services / Pillars */}
        <div className="divide-y divide-[#0C0C0C]/10">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center group cursor-pointer"
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.category) navigateTo('shop', null, item.category);
                }}
              >
                {/* Numbered Label */}
                <div className="lg:col-span-2 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-6xl font-black text-[#0C0C0C]/25 group-hover:text-[#0C0C0C] transition-colors font-mono">
                    {item.number}
                  </span>
                  <Icon className="w-5 h-5 text-[#0C0C0C]/40 group-hover:text-[#B600A8] transition-colors" />
                </div>

                {/* Title & Subtitle */}
                <div className="lg:col-span-5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#0C0C0C] group-hover:text-[#7621B0] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0C0C0C]/60 mt-1">
                    {item.subtitle}
                  </p>
                </div>

                {/* Description & Action */}
                <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-start gap-4">
                  <p className="text-sm text-[#0C0C0C]/70 font-light leading-relaxed">
                    {item.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0C0C0C] group-hover:text-[#B600A8] transition-colors group-hover:translate-x-1 duration-200">
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
