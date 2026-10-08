import React from 'react';
import { ShieldCheck, Truck, Sparkles, Headphones, Lock, CheckCircle2 } from 'lucide-react';

export const WhyVeltrix = () => {
  const trustItems = [
    {
      icon: Lock,
      title: 'Secure Checkout',
      description: 'Shop with confidence through a secure checkout experience featuring 256-bit SSL encryption and verified payment channels.',
      accent: 'text-cyan-400',
      borderGlow: 'group-hover:border-cyan-500/40'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Get your technology essentials delivered quickly. Orders are dispatched within 24 hours with reliable tracked delivery.',
      accent: 'text-blue-400',
      borderGlow: 'group-hover:border-blue-500/40'
    },
    {
      icon: Sparkles,
      title: 'Quality Products',
      description: 'Carefully selected products and accessories engineered with rigorous quality benchmarks and stress-tested durability.',
      accent: 'text-purple-400',
      borderGlow: 'group-hover:border-purple-500/40'
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: "We're here to help whenever you need us. Our dedicated technical support specialists provide rapid, knowledgeable answers.",
      accent: 'text-emerald-400',
      borderGlow: 'group-hover:border-emerald-500/40'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-neutral-950 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Veltrix Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Choose Veltrix?
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2">
            Every product in our catalog meets uncompromising standards of performance, safety, and modern design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`group p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 ${item.borderGlow} transition-all duration-300 flex flex-col justify-between hover:bg-neutral-900/70 hover:-translate-y-1`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-neutral-850 border border-neutral-750 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${item.accent}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-850 flex items-center gap-1.5 text-[11px] font-mono text-neutral-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Veltrix Certified Promise</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
