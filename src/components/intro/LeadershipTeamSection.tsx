import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Briefcase } from 'lucide-react';
import { db } from '../../supabaseService';
import { TeamMember } from '../../types';

export default function LeadershipTeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const list = await db.getTeamMembers();
        if (list) {
          // Filter to include only co-founder and team_member, excluding founder
          const filtered = list.filter(
            (m) => m.type === 'co-founder' || m.type === 'team_member'
          );
          // Sort by display_order
          filtered.sort((a, b) => a.display_order - b.display_order);
          setMembers(filtered);
        }
      } catch (err) {
        console.error('Error loading leadership team members:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  if (loading || members.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-transparent" id="leadership-team-section">
      <div className="mx-auto max-w-[1200px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#173B8C]">
              Vision Enablers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.045em] text-[#102a43] font-display">
              Leadership Team
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              The people helping drive the SKY7 vision forward.
            </p>
          </motion.div>
        </div>

        {/* Vertical Stacked Cards */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.005 }}
              className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-[0_12px_30px_-15px_rgba(15,23,42,0.03)] hover:border-blue-200 hover:shadow-[0_20px_45px_-15px_rgba(59,130,246,0.06)] transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8"
            >
              {/* Profile Image container */}
              <div className="relative group shrink-0 w-24 h-24 sm:w-32 sm:h-32">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <img
                  src={member.image_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600'}
                  alt={member.name}
                  className="relative w-full h-full object-cover rounded-2xl sm:rounded-3xl border border-slate-100/80 shadow-sm"
                />
              </div>

              {/* Text details */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-tight">
                    {member.name}
                  </h3>
                  
                  {member.department && (
                    <span className="inline-flex items-center gap-1 self-center sm:self-auto rounded-full bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      <Briefcase className="w-2.5 h-2.5" />
                      {member.department}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold tracking-wider text-blue-500 uppercase">
                  {member.role}
                </p>

                {member.bio && (
                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-sans mt-2">
                    {member.bio}
                  </p>
                )}

                {/* LinkedIn Link (if available) */}
                {member.linkedin_url && (
                  <div className="pt-2 flex justify-center sm:justify-start">
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-blue-500 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
