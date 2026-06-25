import { motion } from 'motion/react';
import FounderSection from '../components/intro/FounderSection';
import LeadershipTeamSection from '../components/intro/LeadershipTeamSection';

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
          <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-black tracking-[-0.04em] text-[#111827] font-display leading-[1.15]">
            Corporate Story & <br className="hidden sm:block" /> Community Impact
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            Welcome to the Globus ecosystem. Discover our founder's story, professional roles, partner benefits, and community support blueprints.
          </p>
        </motion.div>
      </header>

      {/* 1. FOUNDER SECTION */}
      <FounderSection />

      {/* LEADERSHIP TEAM SECTION */}
      <LeadershipTeamSection />

      {/* 2. SERVICES SECTION & 3. SCROLLING IMAGE SHOWCASE (moved from About Page) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 2. GALLERY SECTION */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Card 1: Leadership Campaign */}
  <div className="relative rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-shadow duration-300">
    <img src="/images/services/leadership-seminar.jpeg" alt="Leadership seminar delivered to professionals" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold uppercase text-white">Leadership Campaign</div>
    <div className="absolute bottom-3 left-3 text-white space-y-1">
      <h3 className="text-lg font-semibold leading-snug">Leadership Campaign</h3>
      <p className="text-sm leading-snug max-w-xs">Empowering leaders through insightful seminars and workshops that drive impactful change.</p>
    </div>
  </div>
  {/* Card 2: Business Education */}
  <div className="relative rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-shadow duration-300">
    <img src="/images/services/business-outreach-group.jpeg" alt="Business education session with participants" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold uppercase text-white">Business Education</div>
    <div className="absolute bottom-3 left-3 text-white space-y-1">
      <h3 className="text-lg font-semibold leading-snug">Business Education</h3>
      <p className="text-sm leading-snug max-w-xs">Delivering business education sessions and workshops to inspire entrepreneurship and growth.</p>
    </div>
  </div>
  {/* Card 3: School Support 1 */}
  <div className="relative rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-shadow duration-300">
    <img src="/images/services/school-kit-distribution.jpeg" alt="School kit distribution during a community programme" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold uppercase text-white">School Support</div>
    <div className="absolute bottom-3 left-3 text-white space-y-1">
      <h3 className="text-lg font-semibold leading-snug">School Support</h3>
      <p className="text-sm leading-snug max-w-xs">Providing essential supplies and support to schools to foster learning environments.</p>
    </div>
  </div>
  {/* Card 4: School Support 2 */}
  <div className="relative rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-shadow duration-300">
    <img src="/images/services/community-school-support.jpeg" alt="School children receiving backpacks through community support" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold uppercase text-white">School Support</div>
    <div className="absolute bottom-3 left-3 text-white space-y-1">
      <h3 className="text-lg font-semibold leading-snug">School Support</h3>
      <p className="text-sm leading-snug max-w-xs">Engaging communities to back school initiatives and improve student wellbeing.</p>
    </div>
  </div>
</div>
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

