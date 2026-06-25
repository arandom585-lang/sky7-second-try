import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { db } from '../../supabaseService';
import { Review } from '../../types';

const defaultTestimonials: Review[] = [
  {
    id: 't1',
    author: 'Elena Rostova',
    role: 'Franchise Owner',
    company: 'Rostova Logistics',
    rating: 5,
    text: 'The SKY7 ecosystem provided me with the structured business education and cashflow frameworks that allowed me to launch my own franchise branch within 9 months. The community support is absolutely unparalleled.',
    verified: true,
    date: '2026-05-12',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
  },
  {
    id: 't2',
    author: 'Marcus Vance',
    role: 'Elite Achiever',
    company: 'Vance Corporate Systems',
    rating: 5,
    text: 'Training under the SKY7 Foundation trainers changed how our team structures sales and leadership. We grew our distribution network by 120% in a single quarter.',
    verified: true,
    date: '2026-06-02',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800',
  },
  {
    id: 't3',
    author: 'Sarah Jenkins',
    role: 'Pool Achiever',
    company: 'Jenkins Logistics Solutions',
    rating: 5,
    text: 'As a distributor, the Utilities and E-Channelling benefits save my family significant monthly costs, allowing me to reinvest directly into my business growth.',
    verified: true,
    date: '2026-06-10',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800',
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const list = await db.getReviews(true);
        if (list && list.length > 0) {
          setTestimonials(list);
        } else {
          setTestimonials(defaultTestimonials);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setTestimonials(defaultTestimonials);
      }
    }
    loadTestimonials();
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  if (testimonials.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-slate-50/50" id="testimonials-section">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center max-w-2xl mx-auto"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C]">Social Proof</span>
          <h2 className="mt-3 text-[28px] font-black tracking-[-0.03em] text-[#111827] sm:text-[32px] lg:text-[36px] font-display">
            Trusted by Our Community
          </h2>
          <p className="mt-4 text-sm text-[#6B7280]">
            Success stories are being created every day. See what our leaders say.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative mx-auto max-w-5xl rounded-[32px] border border-white bg-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[380px]">
            
            {/* Left Side: Testimonial Image */}
            <div className="md:col-span-5 relative w-full aspect-[4/3] md:aspect-square overflow-hidden rounded-[24px] border border-slate-100 bg-slate-50 shadow-inner">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={activeTestimonial.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  src={activeTestimonial.image_url}
                  alt={activeTestimonial.author}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </AnimatePresence>
            </div>

            {/* Right Side: Quote Details */}
            <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6 text-left">
              
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeTestimonial.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: activeTestimonial.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg leading-relaxed text-[#111827] italic font-display">
                    "{activeTestimonial.text}"
                  </blockquote>

                  {/* Author Name */}
                  <div className="pt-4 border-t border-slate-50">
                    <h4 className="text-base font-bold text-[#111827]">
                      {activeTestimonial.author}
                    </h4>
                    <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                      {activeTestimonial.role}, {activeTestimonial.company}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Actions */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
                {/* Dot Indicators */}
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setDirection(i > activeIndex ? 1 : -1);
                        setActiveIndex(i);
                      }}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        activeIndex === i ? 'w-6 bg-[#173B8C]' : 'w-2.5 bg-slate-200 hover:bg-slate-350'
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm text-slate-650 cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm text-slate-650 cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
