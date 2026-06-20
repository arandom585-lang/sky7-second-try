import { motion } from 'motion/react';
import { CreditCard, Activity, Gift, MessageSquareCode } from 'lucide-react';

const benefitsData = [
  {
    id: 'b1',
    percentage: '10%',
    title: 'Utility Payments',
    description: 'Get immediate relief on electricity, water, and broadband bill payments processed through the partner grid.',
    icon: CreditCard,
    color: 'text-blue-600 border-blue-100 bg-blue-50/50',
    btnColor: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200/50',
  },
  {
    id: 'b2',
    percentage: '15%',
    title: 'E-Channelling Services',
    description: 'Special access rates on medical scheduling, virtual consultations, and digital health channels.',
    icon: Activity,
    color: 'text-emerald-600 border-emerald-100 bg-emerald-50/50',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50',
  },
  {
    id: 'b3',
    percentage: '12%',
    title: 'Fuel & Logistics Support',
    description: 'Exclusive fuel rebates and dispatch benefits designed for active distributors operating logistical assets.',
    icon: Gift,
    color: 'text-indigo-600 border-indigo-100 bg-indigo-50/50',
    btnColor: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200/50',
  },
];

export default function BenefitsSection() {
  const handleWhatsAppClick = (title: string) => {
    const message = encodeURIComponent(`Hi, I am interested in learning more about the Globus Partner Benefit: ${title}.`);
    window.open(`https://wa.me/94777123456?text=${message}`, '_blank');
  };

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-transparent" id="benefits-section">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center max-w-2xl mx-auto"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C]">Distributor Perks</span>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-[#111827] sm:text-4xl lg:text-5xl font-display">
            Globus Foundation Benefits
          </h2>
          <p className="mt-4 text-sm text-[#6B7280]">
            Exclusive Benefits for Globus Distributors & Partners to fuel daily operations and community growth.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefitsData.map(({ id, percentage, title, description, icon: Icon, color, btnColor }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-[0_15px_40px_-20px_rgba(15,23,42,0.06)] flex flex-col justify-between"
            >
              <div>
                {/* Header elements */}
                <div className="flex items-center justify-between gap-4">
                  <span className={`inline-flex items-center justify-center rounded-2xl border px-3.5 py-1 text-2xl font-black tracking-tight ${color}`}>
                    {percentage}
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#173B8C]">
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                </div>
                
                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#111827] font-display">
                  {title}
                </h3>
                
                <p className="mt-3.5 text-sm leading-6 text-[#6B7280]">
                  {description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => handleWhatsAppClick(title)}
                  className={`w-full py-3.5 px-5 text-xs font-semibold text-white rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${btnColor}`}
                >
                  <MessageSquareCode className="h-4.5 w-4.5" />
                  <span>Claim via WhatsApp</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
