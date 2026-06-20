import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';
import SocialLinks from '../components/SocialLinks';

export default function Contact() {
  const location = useLocation();

  // Parse query arguments in url
  const queryParams = new URLSearchParams(location.search);
  const initialSubject = queryParams.get('subject') || '';
  const initialMessage = initialSubject ? `Inquiry regarding: ${initialSubject.replace(/_/g, ' ')}\n\n` : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F8FAFC] text-[#111827] pt-24 pb-20 relative overflow-hidden"
      id="contact-page"
    >
      {/* Decorative ambient gradient blooms */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-50/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] rounded-full bg-indigo-50/30 blur-3xl pointer-events-none -z-10" />

      {/* 1. CONTACT HERO SECTION */}
      <section className="px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto" aria-labelledby="contact-hero-heading">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#173B8C]">
            <Mail className="w-3.5 h-3.5" />
            Get In Touch
          </span>
          <h1 id="contact-hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.055em] text-[#111827] font-display leading-[1.05]">
            Connect with SKY7
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            Share your details and our team will connect with you on WhatsApp.
          </p>
        </motion.div>
      </section>

      {/* 2. MAIN 2-COLUMN SECTION (Contact Form & Info Column) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <ContactForm initialMessage={initialMessage} />
          </div>

          {/* Right Column: Info Cards & Socials */}
          <div className="lg:col-span-5 space-y-10">
            <ContactInfo />
            <div className="pt-6 border-t border-slate-100">
              <SocialLinks />
            </div>
          </div>

        </div>
      </section>
    </motion.div>
  );
}

