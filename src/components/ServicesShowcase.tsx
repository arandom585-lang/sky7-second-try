import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartHandshake, ChevronLeft, ChevronRight } from 'lucide-react';

const serviceGallery = [
  {
    src: '/images/services/community-outreach-group.jpeg',
    alt: 'Community outreach programme with school children',
    label: 'Community Outreach',
  },
  {
    src: '/images/services/student-support.jpeg',
    alt: 'Educational supplies being presented to a student',
    label: 'Student Support',
  },
  {
    src: '/images/services/leadership-seminar.jpeg',
    alt: 'Leadership seminar delivered to professionals',
    label: 'Leadership Seminars',
  },
  {
    src: '/images/services/school-kit-distribution.jpeg',
    alt: 'School kit distribution during a community programme',
    label: 'Education Support',
  },
  {
    src: '/images/services/community-school-support.jpeg',
    alt: 'School children receiving backpacks through community support',
    label: 'School Initiatives',
  },
  {
    src: '/images/services/education-outreach.jpeg',
    alt: 'Education outreach event with children and volunteers',
    label: 'Social Impact',
  },
  {
    src: '/images/services/professional-training.jpeg',
    alt: 'Professional development training session',
    label: 'Professional Training',
  },
  {
    src: '/images/services/career-development.jpeg',
    alt: 'Career development workshop for young professionals',
    label: 'Career Development',
  },
];

interface ServicesShowcaseProps {
  hideHeader?: boolean;
}

export default function ServicesShowcase({ hideHeader = false }: ServicesShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Handle manual interaction pause
  const triggerManualInteraction = () => {
    setIsPaused(true);
  };

  // Automatically resume after 5 seconds of no manual navigation
  useEffect(() => {
    if (!isPaused) return;

    const timer = setTimeout(() => {
      setIsPaused(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isPaused, activeIndex]);

  const handlePrev = (isAuto = false) => {
    if (!isAuto) triggerManualInteraction();
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? serviceGallery.length - 1 : prev - 1));
  };

  const handleNext = (isAuto = false) => {
    if (!isAuto) triggerManualInteraction();
    setDirection(1);
    setActiveIndex((prev) => (prev === serviceGallery.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    triggerManualInteraction();
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Gestures mapping
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const activeService = serviceGallery[activeIndex];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      id="about-services"
      className="w-full"
      aria-labelledby="services-heading"
    >
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#98700e] uppercase tracking-widest mb-2">
              <HeartHandshake className="w-4 h-4" />
              <span>What We Do</span>
            </div>
            <h2 id="services-heading" className="text-[28px] sm:text-[32px] font-bold font-display text-[#0A1B33]">
              Services
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Creating meaningful impact through community outreach, educational support, and professional development.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest whitespace-nowrap">
            Interactive Slider
          </span>
        </div>
      )}

      {/* Main Slider Shell */}
      <div 
        ref={containerRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="relative mx-auto max-w-3xl w-full rounded-[32px] border border-slate-200/80 bg-white/70 p-4 sm:p-5 shadow-xl shadow-slate-900/5 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#173B8C]/20"
        aria-label="Services image gallery. Use arrow keys to navigate."
      >
        {/* Carousel slide container */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'tween', ease: 'easeInOut', duration: 0.4 },
                opacity: { duration: 0.4 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
            >
              {/* Existing image cards and layout */}
              <figure
                className="relative w-full h-full overflow-hidden rounded-2xl bg-slate-100"
              >
                <img
                  src={activeService.src}
                  alt={activeService.alt}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#07182d]/90 via-[#07182d]/45 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest text-white backdrop-blur-md">
                    {activeService.label}
                  </span>
                </figcaption>
              </figure>
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow (White semi-transparent buttons with modern glassmorphism appearance & light blue hover) */}
          <button
            type="button"
            onClick={() => handlePrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white/20 border border-white/30 backdrop-blur-md text-white shadow-lg cursor-pointer hover:bg-[#EAF3FF]/40 hover:border-[#4F8CFF]/30 hover:text-[#4F8CFF] active:scale-95 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => handleNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white/20 border border-white/30 backdrop-blur-md text-white shadow-lg cursor-pointer hover:bg-[#EAF3FF]/40 hover:border-[#4F8CFF]/30 hover:text-[#4F8CFF] active:scale-95 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Slide Position Counter (Bottom Right Corner) */}
          <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full border border-white/20 bg-[#07182d]/40 backdrop-blur-md text-[10px] sm:text-xs font-mono font-bold text-white shadow-sm select-none">
            {activeIndex + 1} / {serviceGallery.length}
          </div>
        </div>

        {/* Navigation Indicators (Dots Below) */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {serviceGallery.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleDotClick(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === index 
                  ? 'w-6 bg-[#173B8C]' 
                  : 'w-2.5 bg-slate-200 hover:bg-[#4F8CFF]/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
