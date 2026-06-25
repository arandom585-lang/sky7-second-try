import React, { useEffect, useState, useRef, useCallback } from 'react';
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

// Ordered section IDs matching navLinks exactly
const SECTION_IDS = ['about', 'branches', 'products', 'intro', 'contact'];

// Navbar height to compensate in scroll offset calculations
const NAVBAR_HEIGHT = 80;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [activeSection, setActiveSection] = useState('about');

  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Ref to hold the pending click-locked section so scrollspy doesn't override it
  // until the user's programmatic scroll settles on the target section.
  const clickLockedSectionRef = useRef<string | null>(null);
  const clickLockTimerRef = useRef<number | null>(null);

  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // ─── Settings fetch ────────────────────────────────────────────────────────
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

  // ─── Scroll shadow ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Close mobile menu on route change ────────────────────────────────────
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // ─── Sliding underline position ───────────────────────────────────────────
  const updateUnderline = useCallback(() => {
    if (!menuContainerRef.current) return;
    const activeLinkEl = menuContainerRef.current.querySelector('.nav-link-active') as HTMLElement | null;
    if (activeLinkEl) {
      setUnderlineStyle({
        left: activeLinkEl.offsetLeft + 16,
        width: activeLinkEl.offsetWidth - 32,
        opacity: 1,
      });
    } else {
      setUnderlineStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, []);

  useEffect(() => {
    updateUnderline();
    // Re-measure after fonts/layout settle
    const t = setTimeout(updateUnderline, 150);
    window.addEventListener('resize', updateUnderline);
    return () => {
      window.removeEventListener('resize', updateUnderline);
      clearTimeout(t);
    };
  }, [activeSection, location.pathname, updateUnderline]);

  // ─── ScrollSpy (homepage only) ────────────────────────────────────────────
  useEffect(() => {
    if (location.pathname !== '/') return;

    // Determines which section is most dominant in the viewport right now
    // by comparing each section's position relative to the viewport top.
    // We pick the last section whose top edge is at or above the trigger line.
    const getActiveSectionByScroll = (): string => {
      const triggerLine = NAVBAR_HEIGHT + 40; // px from viewport top

      let active = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Section top is at or above the trigger line → it has scrolled into view
        if (rect.top <= triggerLine) {
          active = id;
        }
      }
      return active;
    };

    // ── IntersectionObserver for smooth, event-driven updates ───────────────
    // We observe all sections and on every change we re-run the position
    // calculation. Using a tight rootMargin keeps updates snappy.
    const handleIntersection = () => {
      // Skip if a click-scroll lock is active
      if (clickLockedSectionRef.current) return;
      const section = getActiveSectionByScroll();
      setActiveSection(section);
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      // Top: compensate for fixed navbar; Bottom: small bottom margin
      // Wide threshold array means observer fires often as sections scroll through
      rootMargin: `-${NAVBAR_HEIGHT}px 0px -20% 0px`,
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
    });

    const elements: HTMLElement[] = [];
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    // ── Scroll listener as secondary fallback ───────────────────────────────
    // Provides real-time updates during fast scrolling where IntersectionObserver
    // may fire less often. Throttled with rAF to stay performant.
    let rafId: number | null = null;
    const handleScroll = () => {
      if (clickLockedSectionRef.current) return;
      if (rafId !== null) return; // already scheduled
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const section = getActiveSectionByScroll();
        setActiveSection(section);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation on mount
    const section = getActiveSectionByScroll();
    setActiveSection(section);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  // ─── Click handler ─────────────────────────────────────────────────────────
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    const id = hash.replace('#', '');

    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (!element) return;

      // Immediately set active state — don't wait for scroll
      setActiveSection(id);

      // Lock the scrollspy so it doesn't override the click state while
      // the smooth scroll animation is in flight.
      if (clickLockTimerRef.current !== null) {
        window.clearTimeout(clickLockTimerRef.current);
      }
      clickLockedSectionRef.current = id;

      // Calculate target scroll position accounting for navbar height
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const scrollTarget = Math.max(0, elementTop - NAVBAR_HEIGHT + 8);

      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });

      // Update URL hash without reloading
      window.history.pushState(null, '', hash);

      // Release lock after scroll animation is expected to finish.
      // 1200ms is generous enough for long-page scrolls.
      clickLockTimerRef.current = window.setTimeout(() => {
        clickLockedSectionRef.current = null;
        clickLockTimerRef.current = null;
        // Re-sync active state to actual scroll position after lock releases
        const SECTION_IDS_local = ['about', 'branches', 'products', 'intro', 'contact'];
        const triggerLine = NAVBAR_HEIGHT + 40;
        let active = SECTION_IDS_local[0];
        for (const sid of SECTION_IDS_local) {
          const el = document.getElementById(sid);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerLine) active = sid;
        }
        setActiveSection(active);
      }, 1200);
    }
  };

  const handleNavLinkClickMobile = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    handleNavLinkClick(e, hash);
    setIsMenuOpen(false);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (clickLockTimerRef.current !== null) {
        window.clearTimeout(clickLockTimerRef.current);
      }
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4" id="main-navbar">
      <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`nav-menu relative mx-auto max-w-[1400px] rounded-[9999px] border bg-white/80 backdrop-blur-md transition-all duration-300 ${
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
            {/* Sliding Underline Indicator */}
            <div
              className="absolute bottom-[6px] h-0.5 bg-[#173B8C] rounded-full pointer-events-none z-0"
              style={{
                ...underlineStyle,
                transition: 'left 250ms cubic-bezier(0.4,0,0.2,1), width 250ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease',
              }}
            />

            {navLinks.map((link) => {
              const isActive = location.pathname === '/'
                ? activeSection === link.hash.replace('#', '')
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
                    const isActive = location.pathname === '/'
                      ? activeSection === link.hash.replace('#', '')
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
