import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedText } from './ui/AnimatedText';
import { Sparkles } from 'lucide-react';

export const AboutSection = () => {
  const floatingImages = [
    {
      url: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
      alt: 'Orbital Acoustic Element',
      position: 'top-8 left-6 sm:left-16',
      size: 'w-14 sm:w-20',
      delay: 0,
      duration: 5,
    },
    {
      url: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
      alt: 'Geometric Hardware Crystal',
      position: 'top-14 right-6 sm:right-20',
      size: 'w-16 sm:w-24',
      delay: 1,
      duration: 6,
    },
    {
      url: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
      alt: 'Modular Engineering Block',
      position: 'bottom-16 left-8 sm:left-24',
      size: 'w-12 sm:w-16',
      delay: 1.5,
      duration: 5.5,
    },
    {
      url: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
      alt: 'Precision Torus Component',
      position: 'bottom-12 right-8 sm:right-28',
      size: 'w-16 sm:w-22',
      delay: 0.5,
      duration: 6.5,
    },
  ];

  return (
    <section className="relative py-28 sm:py-36 bg-[#0C0C0C] text-[#D7E2EA] font-kanit overflow-hidden border-b border-white/5">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(182,0,168,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating 3D Elements from Figma Reference */}
      {floatingImages.map((item, idx) => (
        <motion.div
          key={idx}
          className={`absolute ${item.position} ${item.size} pointer-events-none z-10 opacity-70 hover:opacity-100 transition-opacity`}
          animate={{
            y: [0, -14, 0],
            rotate: [0, idx % 2 === 0 ? 6 : -6, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src={item.url}
            alt={item.alt}
            loading="lazy"
            className="w-full h-auto drop-shadow-[0_15px_30px_rgba(182,0,168,0.3)]"
            onError={(e) => {
              // Hide silently if cross-origin figma site asset is unavailable
              e.currentTarget.style.display = 'none';
            }}
          />
        </motion.div>
      ))}

      <div className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center z-20">
        {/* Subtle pill tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-[#FF66EA] mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Veltrix Philosophy</span>
        </motion.div>

        {/* Oversized Gradient Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-gradient mb-8 leading-[1.08]"
        >
          Engineered For Supremacy. Crafted For Everyday Life.
        </motion.h2>

        {/* Scroll-triggered character/word text reveal */}
        <div className="text-lg sm:text-2xl text-neutral-300 font-light leading-relaxed max-w-3xl mx-auto mb-12">
          <AnimatedText
            text="We discard unnecessary gimmickry to focus entirely on tactile precision, studio-grade acoustics, and indestructible aerospace materials. Every curve, driver, and semiconductor in the Veltrix ecosystem is tuned to bring uncompromising harmony to your digital existence."
            staggerDelay={0.015}
          />
        </div>

        {/* 3 Core Engineering Tenets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10 text-left"
        >
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xl font-bold font-mono text-white mb-1">0.02% THD</div>
            <div className="text-xs font-semibold text-[#FF66EA] uppercase tracking-wider mb-2">Acoustic Purity</div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Total harmonic distortion is virtually undetectable, preserving artist-mastered dynamics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xl font-bold font-mono text-white mb-1">Grade 5 Ti</div>
            <div className="text-xs font-semibold text-[#BBCCD7] uppercase tracking-wider mb-2">Titanium Alloys</div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Aerospace-grade metallurgy delivers featherweight comfort with rugged physical endurance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xl font-bold font-mono text-white mb-1">GaN III</div>
            <div className="text-xs font-semibold text-[#FF8A3D] uppercase tracking-wider mb-2">Semiconductors</div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Gallium nitride power stages achieve 96% thermal efficiency and ultra-fast charging speeds.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
