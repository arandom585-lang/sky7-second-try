import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Star } from 'lucide-react';
import { db } from '../../supabaseService';
import { SuccessStory } from '../../types';

const defaultStories: SuccessStory[] = [
  {
    id: 's1',
    name: 'Kenji Takahashi',
    achievement: 'Franchise Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    stars: 5,
  },
  {
    id: 's2',
    name: 'Amanda Seyfried',
    achievement: 'MacBook Achiever',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    stars: 5,
  },
  {
    id: 's3',
    name: 'David Beckham',
    achievement: 'Pool Achiever',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    stars: 5,
  },
  {
    id: 's4',
    name: 'Emily Watson',
    achievement: 'Elite Achiever',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    stars: 5,
  },
  {
    id: 's5',
    name: 'Chris Evans',
    achievement: 'Franchise Owner',
    image: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=200',
    stars: 5,
  },
  {
    id: 's6',
    name: 'Natalie Portman',
    achievement: 'MacBook Achiever',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
    stars: 5,
  },
];

export default function SuccessStories() {
  const [stories, setStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    async function loadStories() {
      try {
        const list = await db.getSuccessStories();
        if (list && list.length > 0) {
          setStories(list);
        } else {
          setStories(defaultStories);
        }
      } catch (err) {
        console.error('Error loading success stories:', err);
        setStories(defaultStories);
      }
    }
    loadStories();
  }, []);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-transparent" id="success-stories-strip">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-left"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C]">Community Milestones</span>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-[#111827] sm:text-4xl font-display">
            Success Stories Strip
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Distributor milestones and elite achievements recorded in our global network.
          </p>
        </motion.div>

        {/* Scrollable container */}
        <div className="relative overflow-x-auto scrollbar-none pb-6 flex gap-6 snap-x select-none">
          {stories.map(({ id, name, achievement, image, stars }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="flex-shrink-0 w-64 bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.06)] flex flex-col items-center text-center snap-center hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)] transition-all duration-300"
            >
              {/* Profile Image with badge */}
              <div className="relative h-20 w-20">
                <img
                  src={image}
                  alt={name}
                  className="h-full w-full object-cover rounded-full border-2 border-slate-55 shadow-md bg-slate-100"
                />
                <span className="absolute -bottom-1.5 -right-1.5 h-6.5 w-6.5 rounded-full bg-[#173B8C] text-white flex items-center justify-center border border-white shadow-sm">
                  <Award className="h-3.5 w-3.5 text-white" />
                </span>
              </div>

              {/* Details */}
              <h4 className="mt-5 text-sm font-bold text-[#111827] font-display truncate w-full">
                {name}
              </h4>
              
              <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-[#173B8C] tracking-wide uppercase">
                {achievement}
              </span>

              {/* Stars */}
              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: stars || 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
