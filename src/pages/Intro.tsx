import { motion } from 'motion/react';
import FounderSection from '../components/intro/FounderSection';
import ServicesShowcase from '../components/ServicesShowcase';
import CommunityHero from '../components/intro/CommunityHero';
import TestimonialsSection from '../components/intro/TestimonialsSection';
import SuccessStories from '../components/intro/SuccessStories';
import FinalCTA from '../components/intro/FinalCTA';

export default function Intro({ isSinglePage = false }: { isSinglePage?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isSinglePage ? 'pt-16 pb-10' : 'min-h-screen pt-24 pb-10'} bg-transparent text-[#111827] relative overflow-hidden`}
      id={isSinglePage ? "intro" : "intro-page"}
    >
      {/* Background ambient light overlays */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-50/20 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-purple-50/20 blur-3xl pointer-events-none -z-10" />

      {/* Title / Hero Entry Panel */}
      <header className="px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#173B8C]">
            Corporate Presentation
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.055em] text-[#111827] font-display leading-[1.05]">
            Corporate Story & <br className="hidden sm:block" /> Community Impact
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            Welcome to the Globus ecosystem. Discover our founder's story, professional roles, partner benefits, and community support blueprints.
          </p>
        </motion.div>
      </header>

      {/* 1. FOUNDER SECTION */}
      <FounderSection />

      {/* 2. SERVICES SECTION & 3. SCROLLING IMAGE SHOWCASE (moved from About Page) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ServicesShowcase hideHeader={true} />
      </div>

      {/* 4. COMMUNITY IMPACT SECTION */}
      <CommunityHero />

      {/* 5. TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* 6. SUCCESS STORIES SECTION */}
      <SuccessStories />

      {/* 7. FINAL CTA BANNER */}
      <FinalCTA />
    </motion.div>
  );
}

