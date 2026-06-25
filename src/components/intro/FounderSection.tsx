import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Landmark, TrendingUp, Gamepad2, ArrowRight, Sparkles } from 'lucide-react';
import { db } from '../../supabaseService';
import { Founder } from '../../types';

const expertiseCards = [
  {
    id: 'e1',
    title: 'Financial Advisor',
    description: 'Providing strategic wealth advice, asset allocation frameworks, and structured financial models for enterprises.',
    icon: Landmark,
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'e2',
    title: 'Sales & Business Trainer',
    description: 'Empowering teams with elite marketing concepts, closing protocols, and customer relationship transformations.',
    icon: TrendingUp,
    gradient: 'from-indigo-600 to-purple-500',
  },
  {
    id: 'e3',
    title: 'Cashflow Game Trainer',
    description: 'Guiding partners in interactive wealth simulations to build real-world cashflow optimization principles.',
    icon: Gamepad2,
    gradient: 'from-emerald-600 to-teal-500',
  },
];

export default function FounderSection() {
  const fallbackFounder: Founder = {
    id: 'fallback-founder',
    name: 'Mr. Sudhakar',
    role: 'Managing Director - SKY7',
    bio: 'Mr. Sudhakar is a business leader focused on creating real opportunities and structured growth systems. He is passionate about empowering individuals and building a community of entrepreneurs to grow, earn, and achieve their dreams.',
    image_url: '/images/founder_sudhakar.jpg',
    linkedin_url: '',
    achievement_count: '100+',
    achievement_text: 'Successful Entrepreneurs Worldwide',
  };

  const [founder, setFounder] = useState<Founder>(fallbackFounder);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFounder() {
      try {
        const list = await db.getFounders();
        if (list && list.length > 0) {
          const primary = list.find((f) => f.id === 'f1') || list[0];
          setFounder(primary);
        } else {
          setFounder(fallbackFounder);
        }
      } catch (err) {
        console.error('Error loading founder spotlight details:', err);
        setFounder(fallbackFounder);
      } finally {
        setLoading(false);
      }
    }
    loadFounder();
  }, []);

  if (loading) {
    return null;
  }

  const nameWithoutPrefix = founder.name.replace(/^mr\.?\s*/i, '').trim();
  const upperCaseName = nameWithoutPrefix.toUpperCase();

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-transparent" id="founder-section">
      <div className="mx-auto max-w-[1400px]">

        {/* ── Founder intro: two-column layout ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Founder Spotlight
            </div>

            <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-black tracking-[-0.04em] leading-[1.15] font-display text-[#102a43] uppercase">
              MR. {upperCaseName}
            </h1>

            {/* Professional roles list */}
            <div className="flex flex-col space-y-1 sm:space-y-1.5 text-left">
              <span className="text-sm sm:text-base font-semibold text-[#102a43] leading-[1.45] tracking-wide">
                Professional Speaker
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#102a43] leading-[1.45] tracking-wide">
                Managing Director of SKY7 India
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#102a43] leading-[1.45] tracking-wide">
                Financial Advisor
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#102a43] leading-[1.45] tracking-wide">
                Sales &amp; Business Trainer
              </span>
            </div>

            <p className="text-lg font-bold text-[#173B8C] leading-relaxed max-w-2xl border-l-4 border-[#173B8C] pl-4 font-display">
              "Building a strong business ecosystem by helping people grow and succeed."
            </p>

            <p className="text-base text-[#6B7280] leading-8 max-w-2xl">
              {founder.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-2xl">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-5 rounded-2xl border border-slate-100 bg-white shadow-[0_12px_25px_-12px_rgba(15,23,42,0.05)] flex items-start gap-4"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#173B8C]">
                  <Award className="h-5.5 w-5.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">He has created</span>
                  <h4 className="text-xl font-black text-[#111827] tracking-tight mt-0.5">{founder.achievement_count || '100+'}</h4>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-normal">{founder.achievement_text || 'Successful Entrepreneurs Worldwide'}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Founder photo */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative group max-w-sm sm:max-w-md w-full">
              <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-[#173B8C] to-cyan-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500" />
              <motion.div
                className="relative overflow-hidden rounded-[32px] border border-white bg-white shadow-2xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5 }}
                  src={founder.image_url}
                  alt={founder.name}
                  className="w-full aspect-[4/5] object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Expertise Cards — compact, centered, ~40–50px below intro ── */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {expertiseCards.map(({ id, title, description, icon: Icon, gradient }, index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{
                  y: -4,
                  borderColor: 'rgba(23, 59, 140, 0.18)',
                  boxShadow: '0 16px_36px -10px rgba(15, 23, 42, 0.10)',
                }}
                className="group rounded-[18px] border border-slate-100 bg-white p-5 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.06)] transition-all duration-[250ms] flex flex-col items-center text-center max-w-[340px] mx-auto w-full"
              >
                {/* Icon block */}
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md shadow-slate-100 transition-transform duration-[250ms] group-hover:scale-110 shrink-0`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <h3 className="mt-3.5 text-[18px] font-semibold leading-[1.3] tracking-tight text-[#111827] font-display group-hover:text-[#173B8C] transition-colors duration-[250ms]">
                  {title}
                </h3>

                <p className="mt-2 text-[13px] leading-[1.55] text-[#6B7280]">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
