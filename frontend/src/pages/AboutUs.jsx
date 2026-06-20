import React from 'react';
import { Leaf, Flame, Shield, Globe, Award } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-20 bg-dark text-white">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.4em] text-primary font-bold font-display">The Philosophy</span>
        <h1 className="text-4xl md:text-5xl font-black uppercase font-display leading-tight">
          MOVE BEYOND <br />
          <span className="text-gradient-blue-orange italic">LIMITS</span>
        </h1>
        <p className="text-sm text-grey-light font-light leading-relaxed max-w-xl mx-auto">
          Founded on the tracks of Oregon in 2024, VelocityX was born from a single directive: to dismantle the boundaries between elite performance engineering and premium street culture.
        </p>
      </div>

      {/* Grid imagery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/5] shadow-premium border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"
            alt="VelocityX training focus"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="md:col-span-7 space-y-6">
          <span className="text-xs uppercase tracking-widest text-orange font-bold font-display">Our DNA</span>
          <h2 className="text-2xl md:text-3xl font-black uppercase font-display text-white">ENGINEERED FOR ACTION</h2>
          <p className="text-xs text-grey-light font-light leading-relaxed">
            We don't make casual wear. We design tools for human momentum. Whether it's our carbon-plate propulsion shoes designed for marathon pacing or zero-friction dry-wick tops built for high-intensity power training, every seam, polymer, and thread has to justify its weight.
          </p>
          <p className="text-xs text-grey-light font-light leading-relaxed">
            We collaborate with biomechanical sports scientists, track champions, and materials engineers to push the envelope of carbon fibers, supercritical foams, and moisture-capillary fabrics.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start space-x-2.5">
              <Award size={16} className="text-lime mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Championship Build</h4>
                <p className="text-[10px] text-grey-medium font-light">Endured by professional football clubs and marathon runners.</p>
              </div>
            </div>
            <div className="flex items-start space-x-2.5">
              <Globe size={16} className="text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Circular Logistics</h4>
                <p className="text-[10px] text-grey-medium font-light">Spun from certified recycled ocean plastic yarns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Core Values */}
      <div id="sustainability" className="bg-charcoal p-8 md:p-12 rounded-3xl border border-white/5 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-lime font-bold font-display">Circular Performance</span>
          <h3 className="text-2xl font-black uppercase text-white font-display">OUR GREEN PERFORMANCE INITIATIVES</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 bg-dark/40 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors">
            <Leaf className="text-primary" size={24} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">84% Recycled Polyester</h4>
            <p className="text-[11px] text-grey-light font-light leading-relaxed">
              By reclaiming post-consumer bottles and fish nets from ocean basins, we spin technical microfiber sheets that reduce emissions by 45% compared to virgin oil polyesters.
            </p>
          </div>
          <div className="space-y-3 p-6 bg-dark/40 rounded-2xl border border-white/5 hover:border-orange/50 transition-colors">
            <Flame className="text-orange" size={24} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">0% Virgin Poly Pledge</h4>
            <p className="text-[11px] text-grey-light font-light leading-relaxed">
              We have committed to completely phase out virgin oil polyesters in our footwear by 2027, replacing them with circular biodegradable bio-foams and woven threads.
            </p>
          </div>
          <div className="space-y-3 p-6 bg-dark/40 rounded-2xl border border-white/5 hover:border-lime/50 transition-colors">
            <Globe className="text-lime" size={24} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">100% Carbon-Neutral Shipping</h4>
            <p className="text-[11px] text-grey-light font-light leading-relaxed">
              We trace our logistics corridors from manufacturing centers directly to your door. VelocityX offsets every gram of transit carbon by financing forest reserve plantings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
