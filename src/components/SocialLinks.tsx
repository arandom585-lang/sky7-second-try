import { motion } from 'motion/react';
import { Facebook, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';

const socialLinks = [
  {
    id: 's-fb',
    name: 'Facebook',
    link: 'https://facebook.com/sky7',
    icon: Facebook,
    color: 'hover:text-blue-600 hover:bg-blue-50/50 hover:border-blue-200',
  },
  {
    id: 's-ig',
    name: 'Instagram',
    link: 'https://instagram.com/sky7',
    icon: Instagram,
    color: 'hover:text-pink-600 hover:bg-pink-50/50 hover:border-pink-200',
  },
  {
    id: 's-li',
    name: 'LinkedIn',
    link: 'https://linkedin.com/company/sky7',
    icon: Linkedin,
    color: 'hover:text-blue-700 hover:bg-blue-50/50 hover:border-blue-300',
  },
  {
    id: 's-yt',
    name: 'YouTube',
    link: 'https://youtube.com/sky7',
    icon: Youtube,
    color: 'hover:text-red-650 hover:bg-red-50/50 hover:border-red-200',
  },
  {
    id: 's-wa',
    name: 'WhatsApp',
    link: 'https://wa.me/919999999999',
    icon: MessageCircle,
    color: 'hover:text-emerald-600 hover:bg-emerald-50/50 hover:border-emerald-200',
  },
];

export default function SocialLinks() {
  return (
    <div className="space-y-4 text-left" id="social-links-panel">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#173B8C]">Follow Our Journey</span>
      <div className="flex flex-wrap gap-3">
        {socialLinks.map(({ id, name, link, icon: Icon, color }) => (
          <motion.a
            key={id}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, scale: 1.06 }}
            className={`grid h-12 w-12 place-items-center rounded-xl bg-white border border-slate-100 shadow-[0_8px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_30px_rgba(15,23,42,0.08)] text-[#6B7280] transition-all duration-300 cursor-pointer ${color}`}
            title={name}
          >
            <Icon className="h-5 w-5" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
