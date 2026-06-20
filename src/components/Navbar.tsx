import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { S7Logo } from './S7Logo';
import { db } from '../supabaseService';
import { WebsiteSettings } from '../types';

const navLinks = [
  { name: 'About', path: '/about' },
  { name: 'Branch', path: '/branches' },
  { name: 'Products', path: '/products' },
  { name: 'Intro', path: '/intro' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await db.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings in Navbar:', err);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4" id="main-navbar">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`relative mx-auto max-w-[1400px] rounded-[9999px] border bg-white transition-all duration-300 ${
          isScrolled
            ? 'border-slate-200 shadow-[0_14px_40px_rgba(15,23,42,0.12)]'
            : 'border-slate-200/80 shadow-[0_8px_28px_rgba(15,23,42,0.08)]'
        }`}
        aria-label="Main navigation"
      >
        <div className="grid h-[70px] grid-cols-[1fr_auto] items-center px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          <Link
            to="/"
            className="justify-self-start select-none cursor-pointer"
            aria-label={settings?.company_name || 'SKY SEVEN'}
          >
            {settings?.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.company_name || 'Logo'} 
                className="h-[38px] sm:h-[44px] lg:h-[48px] object-contain" 
              />
            ) : (
              <S7Logo className="h-[38px] sm:h-[44px] lg:h-[48px]" variant="dark" />
            )}
          </Link>

          <div className="hidden items-center justify-center gap-1 lg:flex" id="desktop-nav-menu">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative rounded-full px-4 py-2.5 text-sm font-medium tracking-[-0.01em] transition-colors duration-300 ${
                    isActive ? 'text-[#173B8C]' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span
                    className={`absolute inset-x-4 bottom-1.5 h-0.5 origin-center rounded-full bg-[#173B8C] transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden justify-self-end lg:block">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-[9999px] bg-[#173B8C] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(23,59,140,0.22)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#102e70] hover:shadow-[0_12px_28px_rgba(23,59,140,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B8C]/40 focus-visible:ring-offset-4"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-full bg-[#173B8C] text-white transition-all duration-300 hover:scale-105 hover:bg-[#102e70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B8C]/40 focus-visible:ring-offset-4 lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                transition={{ duration: 0.18 }}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mx-3 mb-3 border-t border-slate-100 px-2 pb-2 pt-3 sm:mx-5">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.path;

                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.035, duration: 0.25 }}
                      >
                        <Link
                          to={link.path}
                          className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                            isActive
                              ? 'bg-blue-50 text-[#173B8C]'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                          }`}
                        >
                          <span>{link.name}</span>
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#173B8C]" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <Link
                  to="/contact"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-[9999px] bg-[#173B8C] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/15 transition-all duration-300 hover:bg-[#102e70]"
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
