import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { db } from '../supabaseService';
import { ContactDetails } from '../types';

export default function ContactInfo() {
  const [contacts, setContacts] = useState<ContactDetails | null>(null);

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await db.getContactDetails();
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
  const whatsappNum = contacts?.whatsapp || '919999999999';
  const mapsUrl = contacts?.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(locationVal)}`;

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
      link: mapsUrl,
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
    <div className="space-y-5 text-left" id="contact-info-panel">
      {/* Introduction text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-[-0.035em] text-[#111827] font-display">
          Let's Connect
        </h2>
        <p className="text-sm leading-6 text-[#6B7280]">
          We are always open to discussing new ideas, partnerships, business opportunities, and collaborations. Feel free to reach out.
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-2.5">
        {detailsList.map(({ id, title, value, link, icon: Icon, color }) => (
          <motion.a
            key={id}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.01 }}
            className="flex items-center gap-4 p-3.5 rounded-[16px] bg-white border border-slate-100 shadow-[0_6px_15px_-8px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.08)] hover:border-[#173B8C]/15 transition-all duration-300 cursor-pointer"
          >
            {/* Icon Block */}
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${color} shrink-0`}>
              <Icon className="h-4.5 w-4.5" />
            </div>

            {/* Label / Value */}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">{title}</span>
              <span className="text-xs sm:text-sm font-semibold text-[#111827] mt-0.5 block">{value}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
