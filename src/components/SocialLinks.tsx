import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Facebook, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { db } from '../supabaseService';
import { ContactDetails } from '../types';

export default function SocialLinks() {
  const [contacts, setContacts] = useState<ContactDetails | null>(null);

  useEffect(() => {
    async function loadSocials() {
      try {
        const data = await db.getContactDetails();
        setContacts(data);
      } catch (err) {
        console.error('Error fetching socials in SocialLinks:', err);
      }
    }
    loadSocials();
  }, []);

  const fbUrl = contacts?.facebook_url || 'https://facebook.com/sky7';
  const igUrl = contacts?.instagram_url || 'https://instagram.com/sky7';
  const liUrl = contacts?.linkedin_url || 'https://linkedin.com/company/sky7';
  const ytUrl = contacts?.youtube_url || 'https://youtube.com/sky7';
  const waUrl = `https://wa.me/${contacts?.whatsapp || '919999999999'}`;

  const socialLinks = [
    {
      id: 's-fb',
      name: 'Facebook',
      link: fbUrl,
      icon: Facebook,
      color: 'hover:text-blue-600 hover:bg-blue-50/50 hover:border-blue-200',
    },
    {
      id: 's-ig',
      name: 'Instagram',
      link: igUrl,
      icon: Instagram,
      color: 'hover:text-pink-600 hover:bg-pink-50/50 hover:border-pink-200',
    },
    {
      id: 's-li',
      name: 'LinkedIn',
      link: liUrl,
      icon: Linkedin,
      color: 'hover:text-blue-700 hover:bg-blue-50/50 hover:border-blue-300',
    },
    {
      id: 's-yt',
      name: 'YouTube',
      link: ytUrl,
      icon: Youtube,
      color: 'hover:text-red-650 hover:bg-red-50/50 hover:border-red-200',
    },
    {
      id: 's-wa',
      name: 'WhatsApp',
      link: waUrl,
      icon: MessageCircle,
      color: 'hover:text-emerald-600 hover:bg-emerald-50/50 hover:border-emerald-200',
    },
  ];

  return (
    <div className="space-y-2.5 text-left" id="social-links-panel">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#173B8C]">Follow Our Journey</span>
      <div className="flex flex-wrap gap-2.5">
        {socialLinks.map(({ id, name, link, icon: Icon, color }) => (
          <motion.a
            key={id}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.06 }}
            className={`grid h-10 w-10 place-items-center rounded-lg bg-white border border-slate-100 shadow-[0_6px_15px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] text-[#6B7280] transition-all duration-300 cursor-pointer ${color}`}
            title={name}
          >
            <Icon className="h-4.5 w-4.5" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
