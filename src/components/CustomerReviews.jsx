import React, { useState } from 'react';
import { CUSTOMER_REVIEWS } from '../data/products';
import { Star, CheckCircle, Quote, ThumbsUp, MessageSquare } from 'lucide-react';
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
    <section className="py-16 sm:py-24 bg-neutral-950 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>Real Verified Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Loved by Tech Enthusiasts
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2">
            See how creators, engineers, and everyday tech users elevate their setup with Veltrix gear.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>

                {/* Review Quote Text */}
                <p className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-4 border-t border-neutral-850">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {rev.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      {rev.role}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLike(rev.id)}
                    className="flex items-center gap-1 text-xs text-neutral-500 hover:text-cyan-400 transition-colors p-1"
                    title="Mark helpful"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">{likes[rev.id] || 12}</span>
                  </button>
                </div>

                {/* Product Purchased Tag */}
                <div className="mt-3 inline-block px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-[11px] text-cyan-300/90 font-mono">
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
