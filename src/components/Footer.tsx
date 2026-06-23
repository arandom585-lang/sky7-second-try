import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Database } from 'lucide-react';
import { db, isSupabaseConfigured } from '../supabaseService';
import { S7Logo } from './S7Logo';
import { WebsiteSettings, ContactDetails } from '../types';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [contacts, setContacts] = useState<ContactDetails | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, contactsRes] = await Promise.all([
          db.getSettings(),
          db.getContactDetails()
        ]);
        setSettings(settingsRes);
        setContacts(contactsRes);
      } catch (err) {
        console.error('Error fetching data for Footer:', err);
      }
    }
    loadData();
  }, []);

  // Safe Fallbacks
  const companyName = contacts?.company_name || settings?.company_name || 'SKY SEVEN';
  const emailVal = contacts?.email || 'hq@skyseven.com';
  const phoneVal = contacts?.phone || '+1 (408) 555-0100';
  const addressVal = contacts?.address || '100 Global Tower, Suite 450, Tech District, Cupertino, CA 95014';

  return (
    <footer id="main-footer" className="bg-white/80 border-t border-slate-200 text-slate-600 relative z-20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-5 space-y-4">
            <Link to="/" id="footer-logo-link" className="hover:opacity-95 transition-opacity inline-block">
              {settings?.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={companyName} 
                  className="h-8 object-contain" 
                />
              ) : (
                <S7Logo className="h-8" variant="dark" />
              )}
            </Link>
            <p className="text-xs text-slate-450 leading-relaxed max-w-sm">
              Securing enterprise operations with intelligent, physical energy, and soft networking nodes. Connecting regional capabilities into a global high-resiliency ecosystem.
            </p>
            <div className="pt-2 text-xs flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]'}`} />
              <div className="font-mono text-slate-500 text-[10px] flex items-center gap-1.5">
                <span>Ecosystem DB:</span>
                <span className={isSupabaseConfigured ? 'text-emerald-400 font-bold' : 'text-[#D4AF37]'}>
                  {isSupabaseConfigured ? 'Supabase Synchronized' : 'Sandbox Store (Offline)'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold text-[#0A1B33] tracking-wider uppercase font-mono">
              Ecosystem Map
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/intro" className="hover:text-[#D4AF37] transition-colors">
                  Presentation Video
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#D4AF37] transition-colors">
                  Technology Portfolio
                </Link>
              </li>
              <li>
                <Link to="/branches" className="hover:text-[#D4AF37] transition-colors">
                  Enterprise Branches
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D4AF37] transition-colors">
                  Corporate Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-[#0A1B33] tracking-wider uppercase font-mono">
              Corporate Headquarters
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <span>{addressVal}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a href={`mailto:${emailVal}`} className="hover:text-[#D4AF37] transition-colors truncate max-w-full">
                  {emailVal}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a href={`tel:${phoneVal}`} className="hover:text-[#D4AF37] transition-colors">
                  {phoneVal}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} {companyName} Ecosystem Operations. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>SLA Stable</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
