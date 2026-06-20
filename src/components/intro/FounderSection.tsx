import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Briefcase, Sparkles } from 'lucide-react';
import { db } from '../../supabaseService';
import { Founder } from '../../types';

export default function FounderSection() {
  const [founder, setFounder] = useState<Founder | null>(null);

  useEffect(() => {
    async function loadFounder() {
      try {
        const list = await db.getFounders();
        if (list && list.length > 0) {
          const primary = list.find(f => f.id === 'f1') || list[0];
          setFounder(primary);
        }
      } catch (err) {
        console.error('Error loading founder spotlight details:', err);
      }
    }
    loadFounder();
  }, []);

  // Safe Fallback defaults
  const fName = founder?.name || 'Mr. Sudhakar';
  const fRole = founder?.role || 'Managing Director — SKY7';
  const fBio = founder?.bio || 'Mr. Sudhakar is a business leader focused on creating real opportunities and structured growth systems. He is passionate about empowering individuals and building a community of entrepreneurs to grow, earn, and achieve their dreams.';
  const fImage = founder?.image_url || '/images/founder_sudhakar.jpg';
  const fAchievementCount = founder?.achievement_count || '100+';
  const fAchievementText = founder?.achievement_text || 'Successful Entrepreneurs Worldwide';

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-transparent" id="founder-section">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Details */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Founder Spotlight
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.045em] text-[#111827] leading-[1.05] font-display">
              {fName}
            </h1>

            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              {fRole}
            </p>

            <p className="text-lg font-bold text-[#173B8C] leading-relaxed max-w-2xl border-l-4 border-[#173B8C] pl-4 font-display">
              "Building a strong business ecosystem by helping people grow and succeed."
            </p>

            <p className="text-base text-[#6B7280] leading-8 max-w-2xl">
              {fBio}
            </p>

            {/* Achievement Cards */}
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
                  <h4 className="text-xl font-black text-[#111827] tracking-tight mt-0.5">{fAchievementCount}</h4>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-normal">{fAchievementText}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Portrait */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Decorative Backdrop Glow */}
              <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-[#173B8C] to-cyan-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative overflow-hidden rounded-[32px] border border-white bg-white shadow-2xl">
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5 }}
                  src={fImage}
                  alt={fName}
                  className="w-full aspect-[4/5] object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Floating HUD info box */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg flex items-center gap-3">
                  <div className="h-8.5 w-8.5 rounded-lg bg-[#173B8C] flex items-center justify-center text-white">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#111827] truncate max-w-[150px]">{fRole.split('—')[0].trim()}</h5>
                    <span className="text-[10px] text-slate-500 font-medium">SKY7</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
