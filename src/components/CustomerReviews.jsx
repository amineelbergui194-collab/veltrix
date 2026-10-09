import React, { useState } from 'react';
import { CUSTOMER_REVIEWS } from '../data/products';
import { Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CustomerReviews = () => {
  const { addToast } = useShop();
  const [likes, setLikes] = useState({});

  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    addToast('Thank you for voting this review helpful!', 'info');
  };

  return (
    <section className="py-20 sm:py-28 bg-[#0C0C0C] border-b border-white/5 font-kanit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#FF66EA] uppercase tracking-widest font-semibold mb-3">
            <Star className="w-3.5 h-3.5 fill-[#FF66EA] text-[#FF66EA]" />
            <span>Verified User Impressions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Loved By Audiophiles & Creators
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light mt-2">
            See how tech professionals, designers, and everyday commuters elevate their digital routines with Veltrix gear.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-[#141416]/80 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono uppercase font-bold">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>

                {/* Review Quote Text */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light mb-6">
                  "{rev.text}"
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                      {rev.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 font-light">
                      {rev.role}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLike(rev.id)}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
                    title="Mark helpful"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">{likes[rev.id] || 12}</span>
                  </button>
                </div>

                {/* Product Purchased Tag */}
                <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-[#BBCCD7] font-mono uppercase tracking-wider">
                  Purchased: {rev.product}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
