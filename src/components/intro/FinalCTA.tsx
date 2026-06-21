import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8" id="intro-final-cta">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#050D20_0%,#0B132B_50%,#152854_100%)] px-6 py-16 text-white shadow-[0_30px_80px_rgba(11,19,43,0.25)] sm:px-10 sm:py-20 lg:px-16"
      >
        {/* Glow circles */}
        <div className="absolute -right-36 -top-36 h-96 w-96 rounded-full border border-white/5 bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-48 -left-36 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-3xl text-center flex flex-col items-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xl" id="intro-final-cta-badge">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            The Globus Network
          </span>

          {/* Heading */}
          <h2 className="mt-8 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl font-display leading-[1.1]" id="intro-final-cta-heading">
            Join Our Growing Community
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base" id="intro-final-cta-subtitle">
            Become part of the Globus ecosystem and start building your own success story.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/contact?subject=Join%20Community"
                className="w-full sm:w-56 px-8 py-4 bg-white text-[#0B132B] rounded-full font-semibold shadow-xl hover:bg-slate-100 text-center flex items-center justify-center gap-2 transition-all duration-300"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/about"
                className="final-cta-btn-secondary w-full sm:w-56 px-8 py-4 rounded-full border backdrop-blur-md font-semibold text-center flex items-center justify-center gap-2 transition-all duration-300"
              >
                <span>Learn More</span>
              </Link>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
