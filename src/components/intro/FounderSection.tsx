import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Sparkles } from 'lucide-react';
import { db } from '../../supabaseService';
import { Founder } from '../../types';

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
  const formattedNamePart = nameWithoutPrefix
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-transparent" id="founder-section">
      <div className="mx-auto max-w-[1400px]">
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

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.045em] leading-[1.05] font-display">
              <span className="text-[#102a43]">MR. </span>
              <span className="bg-gradient-to-r from-slate-500 to-slate-400 bg-clip-text text-transparent inline-block">
                {formattedNamePart}
              </span>
            </h1>

            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              {founder.role}
            </p>

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
      </div>
    </section>
  );
}
