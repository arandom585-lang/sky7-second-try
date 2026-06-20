import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck, Clock3, Gem, LockKeyhole, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const universeFeatures = [
  { icon: Gem, title: 'Premium Products', description: 'A curated portfolio selected for exceptional quality.' },
  { icon: BadgeCheck, title: 'Trusted Quality', description: 'Certified standards and dependable performance.' },
  { icon: LockKeyhole, title: 'Secure Shopping', description: 'A protected and transparent customer experience.' },
  { icon: Clock3, title: 'Coming Soon', description: 'New collections and digital store experiences ahead.' },
];

export default function ProductUniverseCTA() {
  return (
    <section className="px-4 pb-24 pt-10 sm:px-6 lg:px-8" id="product-universe" aria-labelledby="product-universe-heading">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#071126_0%,#0B132B_48%,#173B8C_130%)] px-6 py-16 text-white shadow-[0_35px_90px_rgba(11,19,43,0.28)] sm:px-10 sm:py-20 lg:px-16"
      >
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10 bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xl">
            <Store className="h-3.5 w-3.5" />
            The Globus Experience
          </span>
          <h2 id="product-universe-heading" className="mt-7 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Explore Our Product Universe
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Discover a growing ecosystem of premium products, trusted standards, and elevated experiences designed around modern customers.
          </p>
        </div>

        <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {universeFeatures.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-[24px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl transition-colors duration-300 hover:bg-white/[0.11]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-base font-bold text-white">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-300">{description}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative mt-12 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-10 sm:flex-row">
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/contact?subject=Showroom Visit"
              className="inline-flex min-w-52 items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#0B132B] shadow-xl transition-colors duration-300 hover:bg-slate-100"
            >
              Visit Showroom
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex min-w-52 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition-colors duration-300 hover:bg-white/15"
          >
            Visit Store
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider">Coming Soon</span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
