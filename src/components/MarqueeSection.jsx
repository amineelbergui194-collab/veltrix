import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const MarqueeSection = () => {
  const { navigateTo } = useShop();

  // Curated hardware showcase tiles for the two marquee rows
  const rowOneItems = [
    {
      id: 'm1',
      title: 'AirPods Pro 2 USB-C',
      tag: 'Flagship Audio',
      spec: '2x ANC • Spatial Audio',
      image: '/images/airpods-pro.png',
      badge: 'PRO SERIES',
      productId: 'airpods-pro-2'
    },
    {
      id: 'm2',
      title: 'Apple Watch Ultra 2',
      tag: '49mm Titanium',
      spec: '3000-Nit Sapphire • 100m Depth',
      image: '/images/apple-watch-collection.png',
      badge: 'AEROSPACE',
      productId: 'apple-watch-ultra-edition'
    },
    {
      id: 'm3',
      title: 'Studio Horizon ANC',
      tag: 'Over-Ear Reference',
      spec: '45mm Titanium Drivers • 60h Run',
      image: '/images/jbl-headphones.jpg',
      badge: 'HI-RES ACOUSTICS',
      productId: 'soundpulse-anc-over-ear'
    },
    {
      id: 'm4',
      title: '100W Kevlar Braided Cable',
      tag: 'Ultra Fast Charging',
      spec: 'E-Marker IC • 20,000 Bends',
      image: '/images/usbc-cable.jpg',
      badge: '100W PD 3.0',
      productId: 'usbc-fast-charging-cable-100w'
    },
    {
      id: 'm5',
      title: '65W GaN Dual Adapter',
      tag: 'Thermal Guard IC',
      spec: 'Dual Port • 70% Smaller',
      image: '/images/power-adapter.jpg',
      badge: 'GaN III TECH',
      productId: 'gan-fast-charger-65w'
    },
    {
      id: 'm6',
      title: 'AirPods 4 ANC Edition',
      tag: 'Open-Ear Active Cancel',
      spec: 'H2 Silicon • Wireless Qi',
      image: '/images/airpods-pro.png',
      badge: 'NEW 2026',
      productId: 'airpods-4-active-noise-cancellation'
    },
    {
      id: 'm7',
      title: 'Apple Watch Series 10',
      tag: 'Slim Jet Black',
      spec: 'Wide-Angle OLED • Sleep Apnea',
      image: '/images/apple-watch-collection.png',
      badge: 'SERIES 10',
      productId: 'apple-watch-series-10-aluminum'
    },
  ];

  const rowTwoItems = [
    {
      id: 'm8',
      title: 'MagSafe Wireless Charger 15W',
      tag: 'Precision Magnetic Alignment',
      spec: 'Fast Inductive Charging',
      image: '/images/power-adapter.jpg',
      badge: 'MAGNETIC',
      productId: 'magsafe-wireless-charger-15w'
    },
    {
      id: 'm9',
      title: 'AirPods Max Studio Matte',
      tag: 'Lossless Audio via USB-C',
      spec: 'Digital Crown • Memory Foam',
      image: '/images/jbl-headphones.jpg',
      badge: 'STUDIO GRADE',
      productId: 'airpods-max-usb-c'
    },
    {
      id: 'm10',
      title: 'Titanium Rugged Watch Band',
      tag: 'Grade 2 Titanium Links',
      spec: 'DLC Scratch Protection',
      image: '/images/apple-watch-collection.png',
      badge: 'TITANIUM',
      productId: 'rugged-ocean-silicone-band'
    },
    {
      id: 'm11',
      title: 'AirPods 3 Spatial Edition',
      tag: 'Contoured Ergonomic Fit',
      spec: 'Lightning / MagSafe Support',
      image: '/images/airpods-pro.png',
      badge: 'EVERYDAY CARRY',
      productId: 'airpods-3rd-generation'
    },
    {
      id: 'm12',
      title: 'Dual Port 35W Compact Adapter',
      tag: 'Foldable Prongs',
      spec: 'Power Delivery Dynamic Split',
      image: '/images/power-adapter.jpg',
      badge: 'COMPACT',
      productId: 'dual-usb-c-35w-compact-adapter'
    },
    {
      id: 'm13',
      title: '3-in-1 Foldable MagSafe Dock',
      tag: 'Travel Dock Station',
      spec: 'iPhone + Watch + AirPods',
      image: '/images/usbc-cable.jpg',
      badge: 'TRAVEL ESSENTIAL',
      productId: 'magnetic-3in1-foldable-travel-dock'
    },
  ];

  const handleCardClick = (productId) => {
    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) {
      navigateTo('product-detail', found);
    } else {
      navigateTo('shop');
    }
  };

  return (
    <section className="py-20 bg-[#0C0C0C] overflow-hidden border-b border-white/5 relative">
      {/* Subtle section label */}
      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-kanit font-semibold uppercase tracking-widest text-[#FF66EA] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Showreel</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white font-kanit">
            Hardware Gallery
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 font-kanit max-w-md">
          Explore our precision-engineered tech portfolio. Designed for flawless fidelity, aerospace resilience, and fast charging.
        </p>
      </div>

      {/* Marquee Wrapper with Pause on Hover */}
      <div className="marquee-group space-y-6">
        {/* ROW 1: Moves Left */}
        <div className="flex overflow-hidden select-none">
          <div className="flex gap-6 animate-marquee-left shrink-0">
            {[...rowOneItems, ...rowOneItems].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => handleCardClick(item.productId)}
                className="w-[320px] sm:w-[420px] h-[220px] sm:h-[270px] shrink-0 rounded-3xl bg-[#141416]/90 border border-white/10 hover:border-white/30 p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#B600A8]/20"
              >
                {/* Background ambient lighting */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#B600A8]/10 rounded-full blur-2xl group-hover:bg-[#B600A8]/20 transition-all pointer-events-none" />

                {/* Top Badge & Tag */}
                <div className="flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-widest uppercase text-[#BBCCD7]">
                    {item.badge}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-kanit uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>

                {/* Central Image Showcase */}
                <div className="relative w-full h-24 sm:h-32 flex items-center justify-center my-auto">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="max-h-full max-w-[70%] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Bottom Details */}
                <div className="flex items-end justify-between z-10 pt-2 border-t border-white/5">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FF66EA] transition-colors font-kanit">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-kanit">
                      {item.spec}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white text-white group-hover:text-[#0C0C0C] flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Moves Right */}
        <div className="flex overflow-hidden select-none">
          <div className="flex gap-6 animate-marquee-right shrink-0">
            {[...rowTwoItems, ...rowTwoItems].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => handleCardClick(item.productId)}
                className="w-[320px] sm:w-[420px] h-[220px] sm:h-[270px] shrink-0 rounded-3xl bg-[#141416]/90 border border-white/10 hover:border-white/30 p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#7621B0]/20"
              >
                {/* Background ambient lighting */}
                <div className="absolute bottom-0 right-0 w-36 h-36 bg-[#7621B0]/10 rounded-full blur-2xl group-hover:bg-[#7621B0]/20 transition-all pointer-events-none" />

                {/* Top Badge & Tag */}
                <div className="flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF8A3D]">
                    {item.badge}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-kanit uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>

                {/* Central Image Showcase */}
                <div className="relative w-full h-24 sm:h-32 flex items-center justify-center my-auto">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="max-h-full max-w-[70%] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Bottom Details */}
                <div className="flex items-end justify-between z-10 pt-2 border-t border-white/5">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FF8A3D] transition-colors font-kanit">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-kanit">
                      {item.spec}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white text-white group-hover:text-[#0C0C0C] flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
