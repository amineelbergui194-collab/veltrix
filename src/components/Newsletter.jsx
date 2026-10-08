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
    <section className="py-20 bg-neutral-950 border-b border-neutral-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Access</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Stay Ahead of the Tech.
        </h2>

        {/* Text */}
        <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
          Sign up for exclusive offers, new arrivals and the latest Veltrix updates. Get an instant 10% discount on your first order.
        </p>

        {/* Form */}
        {isSubscribed ? (
          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-cyan-500/40 max-w-md mx-auto flex items-center justify-center gap-3 text-cyan-300 font-medium">
            <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0" />
            <div className="text-left text-sm">
              <div className="font-bold text-white">You're officially on the VIP list!</div>
              <div className="text-xs text-neutral-400">Use promo code <strong className="text-cyan-300 font-mono">VELTRIX10</strong> at checkout.</div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
          >
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-sm tracking-wide transition-all duration-300 shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] font-mono text-neutral-500 mt-4">
          No spam, ever. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
};
