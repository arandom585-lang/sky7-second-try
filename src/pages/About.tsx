import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Users, Layers, Globe, Cpu, Zap, Briefcase, Building2, Eye, Rocket, Factory, Package, Boxes, Store, Handshake, Truck, ShoppingBag, Award, Key } from 'lucide-react';
import { db, setSandboxMode } from '../supabaseService';
import { AboutContent } from '../types';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const statsData = [
  { value: '200+', label: 'Active Partners', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { value: '50+', label: 'Business Opportunities', icon: Briefcase, color: 'text-amber-600 bg-amber-50' },
  { value: '9+', label: 'Branches', icon: Building2, color: 'text-emerald-600 bg-emerald-50' },
  { value: '9+', label: 'Business Industries', icon: Layers, color: 'text-indigo-600 bg-indigo-50' }
];

const ecosystemCards = [
  { icon: Factory, title: 'Manufacturers', description: 'Quality products are created and supplied.', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { icon: Package, title: 'Distributors', description: 'Move products efficiently across regions.', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { icon: Boxes, title: 'Dealers', description: 'Supply products to retail outlets.', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { icon: Store, title: 'Retailers', description: 'Deliver products and build customer trust.', color: 'text-pink-600 bg-pink-50 border-pink-100' },
  { icon: Handshake, title: 'Business Partners', description: 'Collaborate to expand opportunities.', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { icon: Rocket, title: 'Entrepreneurs', description: 'Build, scale, and achieve independence.', color: 'text-violet-600 bg-violet-50 border-violet-100' }
];

const opportunityCards = [
  { icon: Factory, title: 'Production & Manufacturing', description: 'Create and manufacture high-quality products.' },
  { icon: Truck, title: 'Distribution & Supply', description: 'Manage and coordinate regional supply chains.' },
  { icon: ShoppingBag, title: 'Sales & Retail', description: 'Sell products directly to customers.' },
  { icon: Cpu, title: 'Digital Services', description: 'Leverage software and platform integrations.' },
  { icon: Handshake, title: 'Business Alliances', description: 'Partner with established businesses.' },
  { icon: Rocket, title: 'Entrepreneur Development', description: 'Grow as a leader and build your own startup.' },
  { icon: Award, title: 'Franchise Opportunities', description: 'Own and operate a verified branch.' },
  { icon: Key, title: 'Ownership Opportunities', description: 'Take partial ownership in ecosystem ventures.' }
];

const successSteps = [
  { id: 1, title: 'Manufacturers', desc: 'Create and manufacture high-quality products.', pos: { left: '12%', bottom: '20%' } },
  { id: 2, title: 'Distributors', desc: 'Manage and coordinate regional supply chains.', pos: { left: '34%', bottom: '45%' } },
  { id: 3, title: 'Dealers', desc: 'Supply products to retail outlets.', pos: { left: '42%', bottom: '38%' } },
  { id: 4, title: 'Retailers', desc: 'Deliver products and build customer trust.', pos: { left: '54%', bottom: '35%' } },
  { id: 5, title: 'Business Partners', desc: 'Collaborate to expand opportunities.', pos: { left: '62%', bottom: '52%' } },
  { id: 6, title: 'Entrepreneurs', desc: 'Grow as a leader and build your own startup.', pos: { left: '76%', bottom: '62%' } },
  { id: 7, title: 'Business Leaders', desc: 'Direct regional expansions and ecosystems.', pos: { left: '90%', bottom: '80%' } },
];

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth || 500;
    let height = canvas.height = canvas.offsetHeight || 580;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 500;
      height = canvas.height = canvas.offsetHeight || 580;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      fadeSpeed: number;
    }> = [];

    const colors = [
      'rgba(255, 193, 7, ', // Gold
      'rgba(6, 182, 212, ', // Cyan
      'rgba(212, 175, 55, ', // Aura Gold
    ];

    const createParticle = (initRandom = false) => {
      let x = 0;
      let y = 0;
      if (initRandom) {
        x = Math.random() * width;
        y = Math.random() * height;
      } else {
        const startOnStairs = Math.random() > 0.4;
        if (startOnStairs) {
          const t = Math.random();
          x = t * width;
          y = height - (t * height);
        } else {
          x = Math.random() * (width * 0.4);
          y = height - Math.random() * (height * 0.2);
        }
      }

      return {
        x,
        y,
        size: Math.random() * 2.5 + 0.8,
        speedX: Math.random() * 0.5 + 0.15,
        speedY: -(Math.random() * 0.6 + 0.3),
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        fadeSpeed: Math.random() * 0.003 + 0.001
      };
    };

    // Initialize
    for (let i = 0; i < 45; i++) {
      particles.push(createParticle(true));
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid lines or nodes
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Draw grid
      for (let i = 0; i < width; i += 80) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
      }
      for (let j = 0; j < height; j += 80) {
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
      }
      ctx.stroke();

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.fadeSpeed;

        if (p.alpha <= 0 || p.y < 0 || p.x > width) {
          particles[i] = createParticle(false);
        } else {
          ctx.fillStyle = p.color + p.alpha + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
}

export default function About({ isSinglePage = false }: { isSinglePage?: boolean }) {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const loadData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const aboutRes = await db.getAboutContent();
      setContent(aboutRes);
    } catch (err: any) {
      console.error('Error loading about data:', err);
      setError(err.message || String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleScrollToOpportunities = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('about-opportunities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % 7);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className={`${isSinglePage ? '' : 'min-h-screen'} bg-[#050e1d] flex items-center justify-center pt-20`} id="about-spinner">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-[#D4AF37] animate-spin" />
          <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest animate-pulse">
            Syncing S7 Corporate Records...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isSinglePage ? '' : 'min-h-screen'} bg-[#050e1d] flex items-center justify-center pt-20 px-4`} id="about-error">
        <div className="relative max-w-md w-full bg-[#050c1e]/80 border border-red-500/20 rounded-[32px] p-8 text-center backdrop-blur-xl shadow-[0_20px_50px_rgba(239,68,68,0.08)] animate-fadeIn">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-[32px] blur opacity-50 -z-10" />

          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
            <Cpu className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold font-display text-white mb-2 uppercase tracking-wider">
            Connection Interrupted
          </h3>
          <p className="text-xs font-mono text-[#D4AF37] mb-4 uppercase tracking-widest">
            S7 Sync: database_error
          </p>
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 mb-6 max-h-32 overflow-y-auto text-left">
            <p className="text-xs font-mono text-slate-400 break-words leading-relaxed">
              {error}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                loadData();
              }}
              className="flex-1 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-bold transition-all duration-300 text-sm cursor-pointer"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                setSandboxMode(true);
                loadData();
              }}
              className="flex-1 px-6 py-3.5 bg-[#D4AF37] hover:bg-[#c59e2b] text-[#050c1e] rounded-full font-bold shadow-lg shadow-amber-500/10 transition-all duration-300 text-sm cursor-pointer"
            >
              Use Sandbox
            </button>
          </div>
        </div>
      </div>
    );
  }

  const safeContent = content || {
    about_title: 'Innovating at Global Scale',
    about_description: 'Founded with the mission to bridge heavy industry with quantum-safe automation, our firm leads enterprise infrastructure evolution. We deploy highly resilient software layers, hardware modules, and strategic partnerships to secure operations on six continents.',
    ecosystem_title: 'Dividends of a Connected Network',
    ecosystem_description: 'The Unified Ecosystem operates continuously from data harvesting up to high-executive decision engines. By joining our connected platform, regional branches operate with local speed while benefiting from collective network learning and shared market resources.',
    opportunities_title: 'Ecosystem Venture Initiatives',
    opportunities_description: 'We actively co-develop projects spanning high-performance IoT grids, grid-level thermal management systems, and smart industrial complexes. Partners gain direct APIs to our pre-built software stack, physical testing yards, and immediate co-marketing programs.',
  };

  return (
    <div className={`${isSinglePage ? '' : 'min-h-screen'} bg-transparent text-slate-100 pt-16 pb-12 relative z-10`} id={isSinglePage ? "about" : "about-page"}>
      {/* 1. PREMIUM FULL-WIDTH CORPORATE ABOUT HERO */}
      <section 
        className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[40px] bg-[#050c1e] text-white shadow-[0_30px_80px_rgba(5,12,30,0.4)] mb-16 min-h-[720px] flex items-center p-6 sm:p-12 lg:p-16 xl:p-20 select-none border border-white/[0.04]" 
        id="about-hero"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Soft glowing ambient light orbs for depth & Tesla-style lighting */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* Cyan Orb - Bottom Left */}
          <div className="absolute -left-20 -bottom-20 w-[420px] h-[420px] rounded-full bg-cyan-500/8 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          {/* Cyan/Blue Orb - Center Right */}
          <div className="absolute right-[20%] top-[40%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[140px] animate-pulse" style={{ animationDuration: '10s' }} />
          {/* Gold Orb - Top Right */}
          <div className="absolute -right-20 -top-20 w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[130px] animate-pulse" style={{ animationDuration: '7s' }} />
        </div>

        {/* Ambient background watermark using the user's glowing growth graph */}
        <motion.div 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          style={{
            x: mousePos.x * -15,
            y: mousePos.y * -15,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          <img
            src="/images/sky7_growth_graph.jpg"
            alt="Sky7 Growth Path"
            className="w-full h-full object-cover opacity-[0.22] mix-blend-screen"
            draggable="false"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050c1e] via-transparent to-[#050c1e]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050c1e] via-transparent to-transparent" />
        </motion.div>

        {/* Cinematic floating particle canvas background */}
        <ParticleCanvas />

        {/* Parallax wrapper for SVG paths, glowing arrows & Active Trackers */}
        <motion.div
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          style={{
            x: mousePos.x * 5,
            y: mousePos.y * 5,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
        >
          {/* SVG Glowing energy connector lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Static base connection path matches the reference zigzag exactly */}
            <path
              d="M 12 80 L 22 55 L 28 60 L 34 55 L 42 62 L 48 54 L 54 65 L 62 48 L 68 54 L 76 38 L 81 42 L 90 20"
              fill="none"
              stroke="rgba(255, 193, 7, 0.12)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Glowing neon moving line */}
            <motion.path
              d="M 12 80 L 22 55 L 28 60 L 34 55 L 42 62 L 48 54 L 54 65 L 62 48 L 68 54 L 76 38 L 81 42 L 90 20"
              fill="none"
              stroke="url(#neonGlowGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ strokeDasharray: "15 90", strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -105 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />

            {/* Glowing Upward Chevrons/Arrows (glowing arrows sliding up the path) */}
            {/* Chevron Group 1 */}
            <g>
              <path
                d="M -4 -3 L 0 0 L -4 3 M 0 -3 L 4 0 L 0 3"
                fill="none"
                stroke="#FFC107"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="drop-shadow-[0_0_5px_rgba(255,193,7,0.7)]"
              >
                <animateMotion
                  path="M 12 80 L 22 55 L 28 60 L 34 55 L 42 62 L 48 54 L 54 65 L 62 48 L 68 54 L 76 38 L 81 42 L 90 20"
                  dur="8s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </path>
            </g>
            {/* Chevron Group 2 - Offset */}
            <g>
              <path
                d="M -4 -3 L 0 0 L -4 3 M 0 -3 L 4 0 L 0 3"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="drop-shadow-[0_0_5px_rgba(6,182,212,0.7)]"
              >
                <animateMotion
                  path="M 12 80 L 22 55 L 28 60 L 34 55 L 42 62 L 48 54 L 54 65 L 62 48 L 68 54 L 76 38 L 81 42 L 90 20"
                  dur="8s"
                  begin="4s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </path>
            </g>

            <defs>
              <linearGradient id="neonGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                <stop offset="50%" stopColor="#FFC107" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Active success tracker beacon */}
          <motion.div
            className="absolute z-20 pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            animate={{
              left: successSteps[activeStepIndex].pos.left,
              bottom: successSteps[activeStepIndex].pos.bottom
            }}
            transition={{
              type: 'spring',
              stiffness: 50,
              damping: 15
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#FFC107] rounded-full blur-md opacity-80 animate-ping scale-150" />
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FFC107] to-amber-300 border border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,193,7,0.5)]">
                <Rocket className="w-2.5 h-2.5 text-[#0A1F5C] animate-pulse" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Parallax wrapper for interactive step hotspots */}
        <motion.div
          className="absolute inset-0 w-full h-full z-20"
          style={{
            x: mousePos.x * 12,
            y: mousePos.y * 12,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
        >
          {successSteps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            const isHovered = hoveredStep === step.id;
            
            return (
              <div
                key={step.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: step.pos.left,
                  bottom: step.pos.bottom
                }}
              >
                {/* Hotspot anchor */}
                <button
                  className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none"
                  onMouseEnter={() => {
                    setHoveredStep(step.id);
                    setActiveStepIndex(idx);
                  }}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Pulse outer rings */}
                  <span className={`absolute inset-0 rounded-full bg-cyan-400/25 transition-transform duration-500 scale-150 ${isActive || isHovered ? 'animate-ping' : 'scale-0 opacity-0 group-hover:scale-120 group-hover:opacity-100'}`} />
                  
                  {/* Gold ring halo */}
                  <span className={`absolute inset-0 rounded-full border border-[#FFC107]/50 transition-transform duration-300 ${isActive || isHovered ? 'scale-110' : 'scale-75 opacity-40 group-hover:scale-100 group-hover:opacity-100'}`} />

                  {/* Core neon circle */}
                  <span className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive || isHovered ? 'bg-[#FFC107] scale-120 shadow-[0_0_12px_rgba(255,193,7,0.8)]' : 'bg-slate-400 group-hover:bg-[#FFC107]'}`} />
                </button>

                {/* Permanent Floating Glassmorphic Label next to each node */}
                <div 
                  className={`absolute left-5.5 top-1/2 -translate-y-1/2 px-2.5 py-1.2 rounded-full border backdrop-blur-md text-[8.5px] font-bold tracking-widest uppercase font-mono shadow-md transition-all duration-300 whitespace-nowrap pointer-events-none select-none ${
                    isActive || isHovered 
                      ? 'bg-amber-500/20 border-[#FFC107]/40 text-[#FFC107] shadow-[0_0_12px_rgba(255,193,7,0.15)] scale-105' 
                      : 'bg-slate-950/40 border-white/5 text-slate-300/80'
                  }`}
                >
                  {step.title}
                </div>

                {/* Glassmorphic detailed tooltip card */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 p-3.5 rounded-xl bg-[#050c1e]/95 border border-white/15 backdrop-blur-md shadow-2xl z-50 text-center pointer-events-none"
                    >
                      {/* Mini header */}
                      <span className="text-[7px] font-bold tracking-[0.2em] text-[#FFC107] uppercase block mb-0.5">
                        Journey Step {step.id}
                      </span>
                      {/* Step title */}
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-display mb-1">
                        {step.title}
                      </h4>
                      {/* Step description */}
                      <p className="text-[9px] text-slate-300 leading-relaxed font-sans font-medium">
                        {step.desc}
                      </p>
                      {/* Decorative arrow */}
                      <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#050c1e] border-r border-b border-white/10 transform rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Peak platform glowing achievements (glowing red dot in reference graph) */}
          <div className="absolute top-[20%] right-[10%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none">
            {/* Glowing Red Dot from reference image */}
            <div className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.8)]"></span>
            </div>
            
            {/* Peak Leadership label */}
            <span className="text-[7px] font-bold text-red-400 tracking-[0.2em] uppercase mt-2">
              PEAK LEADERSHIP
            </span>
          </div>
        </motion.div>

        <div className="relative z-35 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 pointer-events-none">
          {/* Left Column Content Card - Reduced size lg:w-[42%] lg:max-w-[460px] & border-white/5 */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-35 w-full lg:w-[45%] xl:w-[42%] lg:max-w-[460px] flex flex-col justify-center space-y-8 pointer-events-auto bg-slate-950/20 p-6 sm:p-8 rounded-[28px] border border-white/5 backdrop-blur-md shadow-2xl ml-0 lg:ml-6"
            style={{
              x: mousePos.x * 8,
              y: mousePos.y * 8,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 25 }}
          >
            {/* Top Badge */}
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC107] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFC107]"></span>
              </span>
              <span className="text-xs font-bold tracking-[0.25em] text-[#FFC107] uppercase font-mono">
                SKY7 BUSINESS ECOSYSTEM
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-[36px] sm:text-[44px] xl:text-[52px] font-black tracking-tight leading-[1.15] text-white font-display"
            >
              Build Your Future<br />With <span className="text-[#FFC107] relative inline-block">SKY7
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FFC107] rounded-full transform scale-x-75 origin-left"></span>
              </span>
            </motion.h1>

            {/* Subheading & Description */}
            <div className="space-y-4">
              <motion.h3 
                variants={fadeInUp}
                className="text-lg sm:text-xl font-semibold text-slate-100 leading-relaxed font-display"
              >
                Helping people grow, earn, and build their own future.
              </motion.h3>
              <motion.p 
                variants={fadeInUp}
                className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-sans"
              >
                A powerful business ecosystem connecting manufacturers, distributors, dealers, retailers, business partners, and entrepreneurs across India.
              </motion.p>
            </div>

            {/* Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Link to="/contact?subject=Become_a_Partner" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(255, 193, 7, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:px-8 py-4 bg-[#FFC107] text-[#0A1F5C] rounded-full font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Become a Partner
                </motion.button>
              </Link>
              <a 
                href="#about-opportunities" 
                onClick={handleScrollToOpportunities}
                className="w-full sm:w-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:px-8 py-4 border border-white/30 text-white rounded-full font-bold backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Opportunities
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Side: Superhero Entrepreneur Image */}
          <div className="relative z-35 w-full lg:w-[50%] flex justify-center items-center pointer-events-auto mt-8 lg:mt-0">
            {/* Parallax Wrapper */}
            <motion.div 
              className="relative w-full max-w-[450px] lg:max-w-[550px] flex items-center justify-center"
              style={{
                x: mousePos.x * 22,
                y: mousePos.y * 22,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
            >
              {/* Soft Blue Ambient Glow Backlight */}
              <motion.div 
                className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-cyan-500/15 blur-[90px] pointer-events-none"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Gold Accent Glow Backlight */}
              <motion.div 
                className="absolute w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] rounded-full bg-[#FFC107]/12 blur-[80px] pointer-events-none"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Light Rays & Connection Lines SVG background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden scale-110">
                <svg className="w-full h-full min-h-[350px] opacity-40" viewBox="0 0 200 200" fill="none">
                  {/* Subtle ecosystem connection lines */}
                  <g stroke="rgba(6, 182, 212, 0.25)" strokeWidth="0.8">
                    <line x1="40" y1="50" x2="100" y2="25" strokeDasharray="3 3" />
                    <line x1="100" y1="25" x2="160" y2="50" strokeDasharray="3 3" />
                    <line x1="160" y1="50" x2="150" y2="120" strokeDasharray="3 3" />
                    <line x1="150" y1="120" x2="100" y2="175" strokeDasharray="3 3" />
                    <line x1="100" y1="175" x2="50" y2="120" strokeDasharray="3 3" />
                    <line x1="50" y1="120" x2="40" y2="50" strokeDasharray="3 3" />
                    
                    {/* Inner cross connections */}
                    <line x1="40" y1="50" x2="150" y2="120" stroke="rgba(255, 193, 7, 0.15)" strokeDasharray="2 2" />
                    <line x1="160" y1="50" x2="50" y2="120" stroke="rgba(255, 193, 7, 0.15)" strokeDasharray="2 2" />
                    <line x1="100" y1="25" x2="100" y2="175" stroke="rgba(6, 182, 212, 0.15)" strokeDasharray="2 2" />
                  </g>
                  
                  {/* Glowing nodes */}
                  <circle cx="40" cy="50" r="3" fill="#06b6d4" className="animate-pulse" />
                  <circle cx="100" cy="25" r="3.5" fill="#FFC107" />
                  <circle cx="160" cy="50" r="3" fill="#06b6d4" />
                  <circle cx="150" cy="120" r="4" fill="#FFC107" />
                  <circle cx="100" cy="175" r="3" fill="#06b6d4" />
                  <circle cx="50" cy="120" r="3.5" fill="#FFC107" />
                </svg>
              </div>

              {/* Float Wrapper */}
              <motion.div
                className="relative flex items-center justify-center z-10 w-full"
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Character standing upright, transparent rendering */}
                <img
                  src="/images/businessman_superhero.png"
                  alt="Superhero Businessman"
                  className="w-auto h-[400px] sm:h-[500px] lg:h-[580px] xl:h-[620px] object-contain drop-shadow-[0_15px_45px_rgba(6,182,212,0.25)] select-none pointer-events-none"
                  draggable="false"
                />

                {/* Ambient overlay light for premium look */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent mix-blend-color-dodge pointer-events-none rounded-3xl" />
              </motion.div>

              {/* Floating particles around the character */}
              {/* Particle 1 */}
              <motion.div 
                className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400"
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  opacity: [0.3, 0.9, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Particle 2 */}
              <motion.div 
                className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#FFC107]"
                animate={{
                  y: [0, -25, 0],
                  x: [0, -15, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              {/* Particle 3 */}
              <motion.div 
                className="absolute top-1/2 right-1/5 w-1 h-1 rounded-full bg-white"
                animate={{
                  y: [0, -15, 0],
                  x: [0, 8, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
              {/* Particle 4 */}
              <motion.div 
                className="absolute bottom-1/4 left-1/5 w-2 h-2 rounded-full bg-cyan-300"
                animate={{
                  y: [0, -30, 0],
                  x: [0, 12, 0],
                  opacity: [0.1, 0.7, 0.1],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-24">
        {/* Unified Top About Grid & Vision/Mission Group */}
        <div className="space-y-10 sm:space-y-12 lg:space-y-14">
          {/* 2. ABOUT SKY7 SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-center" id={isSinglePage ? "about-sky7-details" : "about-sky7"}>
            {/* Left Column: Information Rows */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Ecosystem Overview</p>
                <h2 className="text-[28px] sm:text-[32px] font-black tracking-tight text-white font-display">
                  About SKY7
                </h2>
              </div>
              
              <div className="space-y-6 pt-2">
                {/* Row 1 */}
                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] shadow-md">
                    <Globe className="h-5.5 w-5.5" />
                  </div>
                  <div className="flex-1 pb-6 border-b border-white/5">
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      SKY7 is a business growth ecosystem that connects entrepreneurs, professionals, startups, and business owners into one structured growth platform.
                    </p>
                  </div>
                </motion.div>

                {/* Row 2 */}
                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] shadow-md">
                    <Users className="h-5.5 w-5.5" />
                  </div>
                  <div className="flex-1 pb-6 border-b border-white/5">
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      We help individuals build opportunities, support business expansion, and guide members toward sustainable growth and success.
                    </p>
                  </div>
                </motion.div>

                {/* Row 3 */}
                <motion.div variants={fadeInUp} className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] shadow-md">
                    <Cpu className="h-5.5 w-5.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Our mission is to help people grow, earn, learn, and build their future through real opportunities, strong networks, and meaningful support.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: Statistics Grid */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-[32px] blur-3xl pointer-events-none" />
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 relative z-10"
              >
                {statsData.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={fadeInUp}
                      whileHover={{ y: -6, scale: 1.015 }}
                      className="stats-card bg-white rounded-[28px] p-4 sm:p-4.5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] border border-slate-100 flex flex-col justify-between items-start hover:shadow-[0_24px_55px_rgba(15,23,42,0.12)]"
                    >
                      <div className={`h-9 w-9 rounded-2xl ${stat.color} flex items-center justify-center shadow-sm`}>
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <div className="mt-5">
                        <span className="text-[28px] sm:text-[32px] font-black text-slate-900 block font-sans tracking-tight">{stat.value}</span>
                        <span className="text-xs font-semibold text-slate-500 block mt-1 tracking-wide uppercase">{stat.label}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* Section 1: Vision & Mission */}
          <section className="py-0" id="about-vision-mission">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
            >
              {/* Left Card: Our Vision */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.015 }}
                className="vision-mission-card bg-gradient-to-br from-[#0A1F5C] to-[#152854] text-white p-6 sm:p-8 md:p-10 rounded-[32px] shadow-2xl flex flex-col justify-between min-h-[280px] sm:min-h-[300px] lg:min-h-[320px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10 space-y-4 lg:space-y-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#FFC107] border border-white/10 shadow-md">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="text-[22px] font-black font-display tracking-tight text-slate-50">Our Vision</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-50 font-medium font-display">
                    To build a strong business ecosystem that delivers high quality products at affordable prices, develops entrepreneurs, and transforms local talent into global opportunities.
                  </p>
                </div>
              </motion.div>

              {/* Right Card: Our Mission */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.015 }}
                className="vision-mission-card bg-[#FFFDF0] text-slate-900 p-6 sm:p-8 md:p-10 rounded-[32px] shadow-2xl flex flex-col justify-between min-h-[280px] sm:min-h-[300px] lg:min-h-[320px] border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10 space-y-4 lg:space-y-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A1F5C]/5 text-[#0A1F5C] border border-[#0A1F5C]/10 shadow-sm">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <h3 className="text-[22px] font-black font-display tracking-tight text-[#0A1F5C]">Our Mission</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-medium font-display">
                    To empower individuals by creating entrepreneurs, supporting manufacturers and producers, and building a powerful local production system that reduces imports and drives exports.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </section>
        </div>

        {/* Section 2: Connected Ecosystem */}
        <section className="py-4 sm:py-6 lg:py-8" id="about-ecosystem">
          <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/10 px-4.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC107] backdrop-blur-xl">
              CONNECTED ECOSYSTEM
            </span>
            <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-black tracking-tight text-white font-display">
              The Sky7 Business Ecosystem
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              A structured system designed to seamlessly connect every stage of the business journey — from production to growth.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ecosystemCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="ecosystem-card bg-white rounded-[28px] py-5 px-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] border border-slate-100 flex flex-col items-center text-center hover:shadow-[0_24px_55px_rgba(15,23,42,0.12)]"
                >
                  <div className={`h-12 w-12 rounded-2xl ${card.color} border flex items-center justify-center shadow-sm mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Section 3: Our Opportunities */}
        <section className="bg-gradient-to-br from-[#0a1b33]/40 to-slate-900/25 border border-white/5 p-8 sm:p-12 md:p-16 rounded-[40px] backdrop-blur-sm relative overflow-hidden" id="about-opportunities">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 space-y-12">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/20 text-xs font-mono text-[#FFC107] uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5 animate-pulse" />
                <span>OUR OPPORTUNITIES</span>
              </div>
              <h2 className="text-[28px] sm:text-[32px] font-black font-display text-white tracking-tight leading-[1.2]">
                Way to Grow & Earn with Sky7
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Multiple ways to grow, earn, and build your own successful business with Sky7.
              </p>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {opportunityCards.map((opp, i) => {
                const Icon = opp.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_12px_24px_rgba(0,0,0,0.2)] flex flex-col justify-between items-start transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                  >
                    <div className="h-10 w-10 rounded-xl bg-white/10 text-[#FFC107] flex items-center justify-center shadow-sm mb-6">
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight font-display mb-2">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Section 4: Premium CTA Section */}
        <section className="relative w-full overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0A1F5C] to-[#152854] text-white p-8 sm:p-12 lg:p-16 text-center shadow-[0_30px_80px_rgba(10,31,92,0.2)] mt-8" id="about-cta">
          {/* Ambient Glows */}
          <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="relative z-10 max-w-3xl mx-auto flex flex-col items-center space-y-6"
          >
            <motion.span 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC107] backdrop-blur-xl about-cta-badge"
            >
              JOIN THE SKY7 ECOSYSTEM
            </motion.span>

            <motion.h2 
              variants={fadeInUp}
              className="text-[28px] sm:text-[32px] lg:text-[36px] font-black tracking-tight text-white font-display leading-[1.2]"
            >
              Build Your Future with <span className="about-cta-highlight">Sky7</span>
            </motion.h2>

            <motion.p 
              variants={fadeInUp}
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto about-cta-description"
            >
              Become part of a powerful business ecosystem connecting manufacturers, distributors, dealers, retailers, business partners, and entrepreneurs across India.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto justify-center"
            >
              <Link to="/contact?subject=Become_a_Partner" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 255, 255, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:px-8 py-4 bg-white text-[#0A1F5C] rounded-full font-bold shadow-lg transition-shadow duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Become a Partner
                </motion.button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:px-8 py-4 border border-white/25 text-white rounded-full font-bold backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer about-cta-btn-secondary"
                >
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
