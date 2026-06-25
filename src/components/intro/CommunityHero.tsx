import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export default function CommunityHero() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 overflow-hidden bg-transparent" id="community-hero-section">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-blue-150/20 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-purple-50/30 blur-2xl pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C] shadow-sm mb-8"
        >
          <Heart className="h-3.5 w-3.5 fill-[#173B8C] text-[#173B8C]" />
          Community Services
        </motion.div>

        {/* Large Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[36px] sm:text-[44px] lg:text-[52px] font-black tracking-[-0.04em] text-[#111827] leading-[1.15] font-display"
        >
          More than a community.<br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#173B8C] via-[#1f4ebb] to-cyan-600 bg-clip-text text-transparent">A place for real support.</span>
        </motion.h2>

        {/* Description Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-8 text-[#6B7280] sm:text-lg"
        >
          Globus operates as a collective ecosystem. We believe that true corporate excellence is defined by the elevation of the society around us. Through structured school kit campaigns, localized infrastructure support, and startup funding programs, we deliver direct social impacts that change lives every single day.
        </motion.p>

      </div>
    </section>
  );
}
