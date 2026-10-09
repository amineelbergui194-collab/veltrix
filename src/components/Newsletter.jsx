import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const Newsletter = () => {
  const { addToast } = useShop();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    addToast('Welcome to the Veltrix inner circle! Check your inbox for 10% off code.', 'success');
  };

  return (
    <section className="py-24 bg-[#0C0C0C] border-b border-white/5 relative overflow-hidden font-kanit">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#B600A8]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#FF66EA] uppercase tracking-widest font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Priority Dispatch Access</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
          Stay Ahead of the Hardware Curve.
        </h2>

        {/* Text */}
        <p className="text-base sm:text-lg text-neutral-400 font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Receive confidential alerts for limited hardware editions, titanium accessory drops, and receive an instant 10% discount on your first order.
        </p>

        {/* Form */}
        {isSubscribed ? (
          <div className="p-6 rounded-3xl bg-[#141416]/90 border border-emerald-500/30 max-w-md mx-auto flex items-center justify-center gap-3 text-emerald-300 font-medium">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-left text-sm">
              <div className="font-bold text-white uppercase tracking-tight">You are officially on the VIP roster.</div>
              <div className="text-xs text-neutral-400 font-light mt-0.5">Use promo code <strong className="text-white font-mono">VELTRIX10</strong> at checkout.</div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
          >
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full pl-11 pr-4 py-4 rounded-full bg-[#141416] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#B600A8] focus:ring-1 focus:ring-[#B600A8]/40 transition-all font-kanit"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-full btn-accent-gradient text-white text-xs font-bold uppercase tracking-wider shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#B600A8]/20"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-neutral-500 mt-4 font-light">
          Zero marketing spam. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
};
