import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, ShieldAlert } from 'lucide-react';
import { db } from '../supabaseService';

interface ContactFormProps {
  initialMessage?: string;
}

export default function ContactForm({ initialMessage = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: initialMessage,
  });

  useEffect(() => {
    if (initialMessage) {
      setFormData((prev) => ({ ...prev, message: initialMessage }));
    }
  }, [initialMessage]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;

    if (!name || !email || !phone || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Save submission to the database/localStorage to preserve administrative logs
      await db.addSubmission({
        name,
        email,
        company: `Phone: ${phone}`,
        message: message,
        type: 'Other',
      });

      setSuccess(true);

      // 2. Construct formatted WhatsApp message
      const formattedMessage = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;
      const whatsappNumber = '919999999999'; // Default India dummy contact number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;

      // 3. Open WhatsApp in new tab
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsSubmitting(false);
      }, 800);

    } catch (err: any) {
      setError(err?.message || 'Inquiry submission failed. Please verify your connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
      id="contact-form-card"
    >
      {success ? (
        <div className="py-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-[#111827] font-display">Inquiry Registered!</h3>
          <p className="text-sm text-[#6B7280] max-w-sm mx-auto leading-relaxed">
            Redirecting to WhatsApp to complete your message handshake...
          </p>
          <div className="pt-6">
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({ name: '', email: '', phone: '', message: '' });
              }}
              className="px-6 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#173B8C] transition-all cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" id="contact-inner-form">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-2 text-xs text-rose-600">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wide">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4.5 py-3.5 text-sm text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#173B8C] focus:ring-1 focus:ring-[#173B8C]/20 transition-all font-sans"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wide">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4.5 py-3.5 text-sm text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#173B8C] focus:ring-1 focus:ring-[#173B8C]/20 transition-all font-sans"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wide">Phone Number *</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4.5 py-3.5 text-sm text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#173B8C] focus:ring-1 focus:ring-[#173B8C]/20 transition-all font-sans"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wide">Message *</label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your inquiry..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4.5 py-3.5 text-sm text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#173B8C] focus:ring-1 focus:ring-[#173B8C]/20 transition-all font-sans resize-none"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-[#173B8C] to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
          >
            <Send className="w-4 h-4 text-white" />
            <span>{isSubmitting ? 'Opening WhatsApp...' : 'Send Message'}</span>
          </motion.button>
        </form>
      )}
    </motion.div>
  );
}
