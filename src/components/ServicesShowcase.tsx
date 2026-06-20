import { motion } from 'motion/react';
import { HeartHandshake } from 'lucide-react';

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
            <h2 id="services-heading" className="text-3xl sm:text-4xl font-bold font-display text-[#0A1B33]">
              Services
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Creating meaningful impact through community outreach, educational support, and professional development.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest whitespace-nowrap">
            Hover to pause
          </span>
        </div>
      )}

      <div
        className="services-gallery-shell rounded-3xl border border-slate-200 bg-white/70 py-4 sm:py-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm"
        tabIndex={0}
        aria-label="Our services photo gallery. Focus or hover to pause the animation."
      >
        <div className="services-gallery-track">
          {[...serviceGallery, ...serviceGallery].map((service, index) => {
            const isDuplicate = index >= serviceGallery.length;

            return (
              <figure
                key={`${service.src}-${index}`}
                className="services-gallery-card group relative w-[78vw] max-w-[360px] sm:w-[360px] h-[290px] sm:h-[360px] shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-md"
                aria-hidden={isDuplicate ? true : undefined}
              >
                <img
                  src={service.src}
                  alt={isDuplicate ? '' : service.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#07182d]/90 via-[#07182d]/45 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest text-white backdrop-blur-md">
                    {service.label}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
