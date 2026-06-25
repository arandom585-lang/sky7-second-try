import { motion } from 'motion/react';
import { BookOpen, Users, Briefcase, Heart, ArrowUpRight } from 'lucide-react';

const servicesData = [
  {
    id: 's1',
    title: 'Business Education',
    description: 'Practical curriculum on financial management, investment models, and scaling structures.',
    icon: BookOpen,
    color: 'from-[#173B8C] to-blue-500',
  },
  {
    id: 's2',
    title: 'Leadership Training',
    description: 'Structured seminars on organizational psychology, team building, and performance coaching.',
    icon: Users,
    color: 'from-purple-600 to-indigo-500',
  },
  {
    id: 's3',
    title: 'Creating Business Owners',
    description: 'Transforming direct distributors into franchise owners with custom corporate setups.',
    icon: Briefcase,
    color: 'from-cyan-600 to-blue-500',
  },
  {
    id: 's4',
    title: 'Community Support',
    description: 'Direct resource deployment, school kit distributions, and localized social support programs.',
    icon: Heart,
    color: 'from-rose-600 to-pink-500',
  },
];

export default function ServicesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-slate-50/50" id="intro-services-section">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center max-w-2xl mx-auto"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C]">Action Blueprint</span>
          <h2 className="mt-3 text-[28px] font-black tracking-[-0.03em] text-[#111827] sm:text-[32px] lg:text-[36px] font-display">
            What We Do
          </h2>
          <p className="mt-4 text-sm text-[#6B7280]">
            Building long-term entrepreneurial infrastructure and social development models.
          </p>
        </motion.div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map(({ id, title, description, icon: Icon, color }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ 
                y: -6, 
                borderColor: 'rgba(23, 59, 140, 0.25)',
                boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08)'
              }}
              className="group relative rounded-[24px] border border-slate-100 bg-white p-8 shadow-[0_10px_25px_-15px_rgba(15,23,42,0.04)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon block */}
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-md shadow-slate-100 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-5.5 w-5.5 text-white" />
                </div>
                
                <h3 className="mt-6 text-lg font-bold tracking-tight text-[#111827] font-display group-hover:text-[#173B8C] transition-colors">
                  {title}
                </h3>
                
                <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                  {description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-1 text-xs font-semibold text-[#173B8C] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span>Explore program</span>
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
