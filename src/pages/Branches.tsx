import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { db, setSandboxMode } from '../supabaseService';
import { Branch } from '../types';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
}

function AnimatedCounter({ value, suffix = '' }: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(counterRef, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 900;
    const startedAt = performance.now();
    let frame = 0;

    const updateCounter = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) frame = requestAnimationFrame(updateCounter);
    };

    frame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return <span ref={counterRef}>{displayValue}{suffix}</span>;
}

interface BranchCardProps {
  branch: Branch;
  index: number;
}

function BranchCard({ branch, index }: BranchCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const locationLabel = branch.location.split(',').pop()?.trim() || branch.location;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1], delay: Math.min(index * 0.05, 0.15) }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="branch-card group flex h-full min-h-[520px] flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
    >
      <div className="relative h-64 shrink-0 overflow-hidden bg-slate-200">
        <img
          src={branch.image_url}
          alt={`${branch.name} branch`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/75 via-transparent to-black/10" />

        <span className="absolute left-4 top-4 grid h-10 min-w-10 place-items-center rounded-full border border-white/30 bg-white/85 px-3 text-xs font-bold text-[#111827] shadow-lg backdrop-blur-xl">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="absolute bottom-4 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-xl">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{locationLabel}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#173B8C]">
            SKY7 Location
          </p>
          <h3 className="text-xl font-bold tracking-tight text-[#111827]">{branch.name}</h3>
          <div className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-[#6B7280]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span>{branch.address || branch.location}</span>
          </div>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6B7280]">{branch.description}</p>

          <AnimatePresence initial={false}>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.28 }}
                className="overflow-hidden border-t border-slate-100"
              >
                <div className="space-y-2.5 pt-4 text-xs text-[#6B7280]">
                  {branch.phone && (
                    <a href={`tel:${branch.phone}`} className="flex items-center gap-2 transition-colors hover:text-[#173B8C]">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{branch.phone}</span>
                    </a>
                  )}
                  {branch.email && (
                    <a href={`mailto:${branch.email}`} className="flex items-center gap-2 transition-colors hover:text-[#173B8C]">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{branch.email}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails((open) => !open)}
          className="mt-6 inline-flex w-full items-center justify-between rounded-full bg-[#0B132B] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#173B8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B8C]/40 focus-visible:ring-offset-2"
          aria-expanded={showDetails}
        >
          <span>{showDetails ? 'Hide Details' : 'View Details'}</span>
          <ArrowUpRight className={`h-4 w-4 transition-transform duration-300 ${showDetails ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
        </button>
      </div>
    </motion.article>
  );
}

export default function Branches({ isSinglePage = false }: { isSinglePage?: boolean }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBranches = async () => {
    try {
      setError(null);
      setIsLoading(true);
      setBranches(await db.getBranches(true));
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      setError(err.message || String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex ${isSinglePage ? '' : 'min-h-screen'} items-center justify-center bg-[#F7F7F9] pt-24`} id="branches-spinner">
        <div className="flex flex-col items-center gap-4">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-[#173B8C]" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Loading locations</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex ${isSinglePage ? '' : 'min-h-screen'} items-center justify-center bg-[#F7F7F9] pt-24 px-4`} id="branches-error">
        <div className="relative max-w-md w-full bg-white border border-red-200 rounded-[32px] p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)] animate-fadeIn">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/5 to-amber-500/5 rounded-[32px] blur opacity-50 -z-10" />

          <div className="w-16 h-16 rounded-full bg-red-500/5 border border-red-200 flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
            <Building2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-[#111827] mb-2 tracking-tight">
            Connection Interrupted
          </h3>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#173B8C] mb-4">
            S7 Sync: database_error
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 max-h-32 overflow-y-auto text-left">
            <p className="text-xs font-mono text-[#6B7280] break-words leading-relaxed">
              {error}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                loadBranches();
              }}
              className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#111827] rounded-full font-bold transition-all duration-300 text-sm cursor-pointer"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                setSandboxMode(true);
                loadBranches();
              }}
              className="flex-1 px-6 py-3.5 bg-[#0B132B] hover:bg-[#173B8C] text-white rounded-full font-bold shadow-lg shadow-slate-950/10 transition-all duration-300 text-sm cursor-pointer"
            >
              Use Sandbox
            </button>
          </div>
        </div>
      </div>
    );
  }

  const WrapperTag = isSinglePage ? 'section' : 'main';

  return (
    <WrapperTag className={`${isSinglePage ? 'pt-16 pb-20' : 'min-h-screen pt-32 pb-24'} bg-[#F7F7F9] px-4 text-[#111827] sm:px-6 lg:px-8`} id={isSinglePage ? "branches" : "branches-page"}>
      <div className="mx-auto grid max-w-[1400px] items-start gap-10 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)] xl:gap-14">
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-28 overflow-hidden rounded-[32px] border border-white/90 bg-white/65 p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-9"
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#173B8C] shadow-sm">
              <Globe2 className="h-3.5 w-3.5" />
              OUR EXPANSION
            </span>

            <h1 className="mt-7 text-4xl font-black tracking-[-0.04em] text-[#111827] sm:text-5xl">
              SKY7 Branches
            </h1>
            <p className="mt-5 text-sm leading-7 text-[#6B7280]">
              SKY7 is expanding across India with a strong presence of branches and business locations.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-slate-300 via-slate-200 to-transparent" />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                <Building2 className="mb-5 h-5 w-5 text-[#173B8C]" />
                <strong className="block text-lg font-black text-[#111827]">Active Branches</strong>
              </div>
              <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                <TrendingUp className="mb-5 h-5 w-5 text-emerald-600" />
                <strong className="block text-lg font-black text-[#111827]">Growing</strong>
                <span className="mt-2 block text-[11px] leading-4 text-[#6B7280]">Expanding across India every month</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/55 p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0B132B] text-white shadow-md">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1 text-amber-500">
                  {[0, 1, 2, 3, 4].map((star) => <span key={star} className="text-xs">★</span>)}
                </div>
                <p className="text-[11px] font-medium leading-4 text-[#6B7280]">Trusted by customers across India</p>
              </div>
            </div>
          </div>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0"
          aria-labelledby="locations-heading"
        >
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#173B8C]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Nationwide presence
              </div>
              <h2 id="locations-heading" className="text-3xl font-black tracking-[-0.03em] text-[#111827] sm:text-4xl">All Locations</h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                {branches.length} {branches.length === 1 ? 'branch' : 'branches'} across India
              </p>
            </div>

            {branches.length > 1 && (
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="branches-prev grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-[#111827] shadow-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-[#173B8C] hover:text-[#173B8C] disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Previous branches"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="branches-next grid h-11 w-11 place-items-center rounded-full bg-[#0B132B] text-white shadow-lg transition-all duration-300 hover:translate-x-0.5 hover:scale-105 hover:bg-[#173B8C] disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Next branches"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {branches.length === 0 ? (
            <div className="rounded-[28px] border border-white bg-white/70 p-12 text-center shadow-sm backdrop-blur-md">
              <Building2 className="mx-auto mb-4 h-10 w-10 text-slate-300" />
              <p className="text-sm text-[#6B7280]">No branch locations are currently published.</p>
            </div>
          ) : (
            <>
              <Swiper
                modules={[Navigation, Pagination, Autoplay, A11y]}
                spaceBetween={20}
                slidesPerView={1}
                speed={650}
                grabCursor
                watchOverflow
                navigation={{ prevEl: '.branches-prev', nextEl: '.branches-next' }}
                pagination={{ el: '.branches-pagination', clickable: true }}
                autoplay={{ delay: 4800, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1280: { slidesPerView: 3, spaceBetween: 22 },
                }}
                className="branches-swiper !overflow-visible"
              >
                {branches.map((branch, index) => (
                  <SwiperSlide key={branch.id} className="!h-auto pb-4">
                    <BranchCard branch={branch} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="mt-7 flex items-center justify-between gap-4">
                <div className="branches-pagination !static !flex !w-auto items-center gap-1" />
                <div className="hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:flex">
                  <span>Explore locations</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </>
          )}
        </motion.section>
      </div>
    </WrapperTag>
  );
}
