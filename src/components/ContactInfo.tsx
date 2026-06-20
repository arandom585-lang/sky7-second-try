import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { db } from '../supabaseService';
import { ContactInfoData } from '../types';

export default function ContactInfo() {
  const [contacts, setContacts] = useState<ContactInfoData | null>(null);

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await db.getContacts();
        setContacts(data);
      } catch (err) {
        console.error('Error fetching contacts in ContactInfo:', err);
      }
    }
    loadContacts();
  }, []);

  // Fallbacks
  const emailVal = contacts?.email || 'info@sky7.com';
  const locationVal = contacts?.address || 'Tamil Nadu, India';
  const phoneVal = contacts?.phone || '+91 XXXXX XXXXX';
  const whatsappNum = contacts?.whatsapp_number || '919999999999';

  const detailsList = [
    {
      id: 'ci-email',
      title: 'Email',
      value: emailVal,
      link: `mailto:${emailVal}`,
      icon: Mail,
      color: 'bg-blue-50 text-[#173B8C]',
    },
    {
      id: 'ci-location',
      title: 'Location',
      value: locationVal,
      link: `https://maps.google.com/?q=${encodeURIComponent(locationVal)}`,
      icon: MapPin,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'ci-whatsapp',
      title: 'WhatsApp',
      value: phoneVal,
      link: `https://wa.me/${whatsappNum}`,
      icon: MessageSquare,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="space-y-8 text-left" id="contact-info-panel">
      {/* Introduction text */}
      <div className="space-y-4">
        <h2 className="text-3xl font-black tracking-[-0.035em] text-[#111827] font-display">
          Let's Connect
        </h2>
        <p className="text-base leading-7 text-[#6B7280]">
          We are always open to discussing new ideas, partnerships, business opportunities, and collaborations. Feel free to reach out.
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {detailsList.map(({ id, title, value, link, icon: Icon, color }) => (
          <motion.a
            key={id}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, scale: 1.01 }}
            className="flex items-center gap-5 p-5 rounded-[20px] bg-white border border-slate-100 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_30px_-10px_rgba(15,23,42,0.08)] hover:border-[#173B8C]/15 transition-all duration-300 cursor-pointer"
          >
            {/* Icon Block */}
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${color} shrink-0`}>
              <Icon className="h-5.5 w-5.5" />
            </div>

            {/* Label / Value */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{title}</span>
              <span className="text-sm font-semibold text-[#111827] mt-0.5 block">{value}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
