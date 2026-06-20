import { motion } from 'motion/react';
import { Landmark, TrendingUp, Gamepad2, ArrowRight } from 'lucide-react';

const expertiseData = [
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

export default function ExpertiseSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-slate-50/50" id="expertise-section">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center max-w-2xl mx-auto"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C]">Professional Roles</span>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-[#111827] sm:text-4xl lg:text-5xl font-display">
            EXPERTISE & ROLES
          </h2>
          <p className="mt-4 text-sm text-[#6B7280] leading-6">
            Bridging complex financial architecture with interactive community training and modern asset design.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertiseData.map(({ id, title, description, icon: Icon, gradient }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ 
                y: -6, 
                borderColor: 'rgba(23, 59, 140, 0.2)',
                boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08)'
              }}
              className="group rounded-[24px] border border-slate-100 bg-white p-8 shadow-[0_12px_28px_-15px_rgba(15,23,42,0.04)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon block */}
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md shadow-slate-100 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-5.5 w-5.5 text-white" />
                </div>
                
                <h3 className="mt-6 text-lg font-bold tracking-tight text-[#111827] font-display group-hover:text-[#173B8C] transition-colors">
                  {title}
                </h3>
                
                <p className="mt-3.5 text-sm leading-6 text-[#6B7280]">
                  {description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-[#173B8C] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5 translate-x-[-2px] group-hover:translate-x-0 transition-transform duration-200" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
