import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { S7Logo } from './S7Logo';
import { db } from '../supabaseService';
import { WebsiteSettings } from '../types';

const navLinks = [
  { name: 'About', hash: '#about', path: '/about' },
  { name: 'Branches', hash: '#branches', path: '/branches' },
  { name: 'Products', hash: '#products', path: '/products' },
  { name: 'Intro', hash: '#intro', path: '/intro' },
  { name: 'Contact', hash: '#contact', path: '/contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  
  // Set default initial state to 'about' to keep at least one navigation item active at all times
  const [activeSection, setActiveSection] = useState('about');

  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const activeEntriesRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());
  const menuContainerRef = useRef<HTMLDivElement>(null);
  
  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
  });

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

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Update sliding underline style dynamically based on the active section and route
  useEffect(() => {
    const updateUnderline = () => {
      if (!menuContainerRef.current) return;
      const activeLinkEl = menuContainerRef.current.querySelector('.nav-link-active') as HTMLElement;
      if (activeLinkEl) {
        setUnderlineStyle({
          left: activeLinkEl.offsetLeft + 16, // internal padding offset clearance
          width: activeLinkEl.offsetWidth - 32, // internal padding offset width clearance
          opacity: 1,
        });
      } else {
        setUnderlineStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateUnderline();

    // Use a small delay on load/mount to ensure offsets are correct after layout settlement
    const timer = setTimeout(updateUnderline, 150);

    window.addEventListener('resize', updateUnderline);
    return () => {
      window.removeEventListener('resize', updateUnderline);
      clearTimeout(timer);
    };
  }, [activeSection, location.pathname]);

  // Scroll Spy Effect for the single page scroll experience on homepage
  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    const sectionIds = ['about', 'branches', 'products', 'intro', 'contact'];
    const sectionElements = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) {
        return;
      }

      // Track currently visible entries meeting the 20% intersection threshold
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          activeEntriesRef.current.set(id, entry);
        } else {
          activeEntriesRef.current.delete(id);
        }
      });

      // Find the intersecting section closest to the vertical center of the viewport
      let closestSection = '';
      let minDistance = Infinity;
      const viewportCenter = window.innerHeight / 2;

      activeEntriesRef.current.forEach((entry, id) => {
        const rect = entry.target.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = id;
        }
      });

      // Only update if we found a valid candidate section.
      // This maintains the previous active highlight during transitions
      if (closestSection) {
        setActiveSection(closestSection);
      }
    };

    // Instantiate IntersectionObserver with requested specifications
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0.2
    });

    sectionElements.forEach((el) => observer.observe(el));

    // Fallback scroll spy listener for extreme bounds (very top and very bottom of document)
    const handleSpyScroll = () => {
      if (isScrollingRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );

      // Force Contact active within 150px of page bottom
      if (windowHeight + scrollY >= documentHeight - 150) {
        setActiveSection('contact');
      } else if (scrollY < 50) {
        // Force About active at the very top
        setActiveSection('about');
      }
    };

    window.addEventListener('scroll', handleSpyScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleSpyScroll);
    };
  }, [location.pathname]);

  // Click scrolling logic with instant active update & scroll spy bypass
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    const id = hash.replace('#', '');
    
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        // Immediately highlight the clicked item
        setActiveSection(id);
        
        // Temporarily bypass IntersectionObserver updates for 1000ms (scroll duration clearance)
        isScrollingRef.current = true;
        if (scrollTimeoutRef.current) {
          window.clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = window.setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);

        // Smooth scroll to the target section
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update URL hash without causing component remounts
        window.history.pushState(null, '', hash);
      }
    }
  };

  const handleNavLinkClickMobile = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    handleNavLinkClick(e, hash);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4" id="main-navbar">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`relative mx-auto max-w-[1400px] rounded-[9999px] border bg-white/80 backdrop-blur-md transition-all duration-300 ${
          isScrolled
            ? 'border-slate-200/60 shadow-[0_12px_36px_rgba(15,23,42,0.12)]'
            : 'border-slate-200/40 shadow-[0_8px_24px_rgba(15,23,42,0.06)]'
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

          <div ref={menuContainerRef} className="relative hidden items-center justify-center gap-1 lg:flex" id="desktop-nav-menu">
            {/* Sliding Underline Indicator Element */}
            <div
              style={underlineStyle}
              className="absolute bottom-[6px] h-0.5 bg-[#173B8C] transition-all duration-300 ease-out rounded-full pointer-events-none z-0"
            />

            {navLinks.map((link) => {
              const currentSection = activeSection;
              const isActive = location.pathname === '/'
                ? currentSection === link.hash.replace('#', '')
                : location.pathname === link.path;

              return (
                <Link
                  key={link.hash}
                  to={`/${link.hash}`}
                  onClick={(e) => handleNavLinkClick(e, link.hash)}
                  className={`nav-link-item group relative rounded-full px-4 py-2.5 text-sm transition-colors duration-300 z-10 ${
                    isActive ? 'nav-link-active text-[#173B8C] font-medium' : 'text-slate-500 font-normal hover:text-slate-950'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden justify-self-end lg:block">
            <Link
              to="/#contact"
              onClick={(e) => handleNavLinkClick(e, '#contact')}
              className="group inline-flex items-center gap-2 rounded-[9999px] bg-[#173B8C] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(23,59,140,0.22)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#102e70] hover:shadow-[0_12px_28px_rgba(23,59,140,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B8C]/40 focus-visible:ring-offset-4 animate-none"
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
                    const currentSection = activeSection;
                    const isActive = location.pathname === '/'
                      ? currentSection === link.hash.replace('#', '')
                      : location.pathname === link.path;

                    return (
                      <motion.div
                        key={link.hash}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.035, duration: 0.25 }}
                      >
                        <Link
                          to={`/${link.hash}`}
                          onClick={(e) => handleNavLinkClickMobile(e, link.hash)}
                          className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${
                            isActive
                              ? 'bg-blue-50/50 text-[#173B8C]'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                          }`}
                        >
                          <div className="relative">
                            <span className={`relative z-10 transition-all duration-300 ${isActive ? 'text-[#173B8C] font-medium' : 'text-slate-600 font-normal'}`}>{link.name}</span>
                            <span
                              className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-[#173B8C] transition-transform duration-300 origin-left ${
                                isActive ? 'scale-x-100' : 'scale-x-0'
                              }`}
                            />
                          </div>
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#173B8C]" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <Link
                  to="/#contact"
                  onClick={(e) => handleNavLinkClickMobile(e, '#contact')}
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
