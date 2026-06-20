import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, ArrowRight, Shield, Globe, Award, Zap, Cpu, MessageSquare, CheckCircle } from 'lucide-react';
import { db } from '../supabaseService';
import { HomeContent, Product, Review } from '../types';

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For 3D Parallax interactive container
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function loadData() {
      try {
        const [homeRes, prodRes, revRes] = await Promise.all([
          db.getHomeContent(),
          db.getProducts(),
          db.getReviews(),
        ]);
        setContent(homeRes);
        setProducts(prodRes.slice(0, 3)); // show top 3
        setReviews(revRes);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5; // range: -0.5 to 0.5
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050e1d] flex items-center justify-center pt-20" id="home-spinner">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-[#D4AF37] animate-spin" />
          <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest animate-pulse">
            Syncing S7 Ecosystem Network...
          </span>
        </div>
      </div>
    );
  }

  const safeContent = content || {
    hero_title: 'Building the Future of Digital Connected Ecosystems',
    hero_subtitle: 'A unified operational technology system for modern multi-sector industries.',
    hero_description: 'We integrate advanced machine intelligence, eco-friendly physical design, and secure distributed protocols.',
    partner_button_text: 'Become a Partner',
    explore_button_text: 'Explore Opportunities',
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-slate-100" id="home-page-container">
      {/* 3D Parallax Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="home-3d-hero"
      >
        {/* Futuristic Grid Overlay Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,27,51,0.4),#050e1d)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a1b33_1px,transparent_1px),linear-gradient(to_bottom,#0a1b33_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 z-0" />

        {/* Ambient colored blobs reacting to mouse for depth */}
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-[100px] transition-transform duration-500 pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#0A1B33]/25 blur-[100px] transition-transform duration-500 pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * -50}px, ${mousePosition.y * -50}px)`,
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 w-full pt-10">
          {/* Hero text */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>SKY SEVEN Connected Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display leading-[1.05] tracking-tight text-white">
              Unified <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-white to-amber-500">Intelligence</span> <br/>for Modern Assets
            </h1>

            <p className="text-base text-slate-400 leading-relaxed max-w-lg">
              {safeContent.hero_description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-[#D4AF37] text-[#050e1d] font-mono uppercase tracking-wider text-xs font-black rounded-xl shadow-lg shadow-[#D4AF37]/10 hover:bg-[#c29f2e] hover:scale-102 transition-all text-center flex items-center justify-center gap-2"
              >
                <span>{safeContent.partner_button_text}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-mono uppercase tracking-wider text-xs font-black rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>{safeContent.explore_button_text}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive 3D Ecosystem Visualization from template */}
          <div className="lg:col-span-6 h-full flex items-center justify-center relative min-h-[450px]">
            <div className="relative w-80 h-80">
              {/* Inner Orb blur effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/15 to-[#0A1B33]/40 blur-2xl animate-pulse"></div>
              
              {/* Central high-tech stable metrics display */}
              <div className="absolute inset-10 rounded-full border border-[#D4AF37]/20 flex flex-col items-center justify-center backdrop-blur-xl bg-[#0a1b33]/40 shadow-2xl">
                 <div className="text-center">
                    <div className="text-4xl font-black text-white tracking-tighter">98.4%</div>
                    <div className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-mono font-bold mt-1">Ecosystem SLA</div>
                 </div>
              </div>
              
              {/* Interlocking rotating dashed rings */}
              <div className="absolute -inset-8 border border-dashed border-white/10 rounded-full animate-[spin_25s_linear_infinite] pointer-events-none"></div>
              <div className="absolute -inset-16 border border-dashed border-[#D4AF37]/10 rounded-full animate-[spin_40s_linear_infinite] [animation-direction:reverse] pointer-events-none"></div>
              <div className="absolute -inset-24 border border-white/5 rounded-full pointer-events-none"></div>
              
              {/* Floating Node 1: branches */}
              <div 
                className="absolute top-0 right-0 w-36 h-18 bg-[#0a1b33]/60 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl flex items-center gap-3 transition-transform duration-500 hover:scale-105"
                style={{
                  transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 font-bold uppercase font-mono tracking-wider">Branches</div>
                  <div className="text-xs font-bold text-white truncate">12 Active</div>
                </div>
              </div>
              
              {/* Floating Node 2: dynamic products count */}
              <div 
                className="absolute bottom-10 -left-20 w-40 h-18 bg-[#0a1b33]/60 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl flex items-center gap-3 transition-transform duration-500 hover:scale-105"
                style={{
                  transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <span className="text-emerald-400 text-xs font-bold font-mono">✔</span>
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 font-bold uppercase font-mono tracking-wider">Inventory</div>
                  <div className="text-xs font-bold text-white truncate">842 SKU Live</div>
                </div>
              </div>

              {/* Floating Node 3: Realtime telemetry speed */}
              <div 
                className="absolute -bottom-8 right-12 w-32 h-16 bg-[#0a1b33]/60 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl flex items-center gap-2.5 transition-transform duration-500 hover:scale-105"
                style={{
                  transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * -20}px)`
                }}
              >
                <div className="w-7.5 h-7.5 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-[#D4AF37] animate-bounce" />
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] text-slate-500 font-bold uppercase font-mono tracking-wider">Latency</div>
                  <div className="text-xs font-bold text-[#D4AF37]">12ms Ok</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Corporate Pillars Section */}
      <section className="py-20 bg-transparent relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-inner" id="home-pillars">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-display text-white">
            Operate with absolute reliability
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            SKY SEVEN delivers high-density system designs engineered for industrial integration, secure hardware handshakes, and smart utility scaling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0a1b33]/30 border border-white/5 p-8 rounded-2xl hover:border-[#D4AF37]/35 hover:bg-[#0a1b33]/50 transition-all hover:scale-[1.02] duration-300 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-2">Cryptographic Hardware Security</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every edge node carries hardwired secure elements. Intercepts and unauthorized tampering triggers automated airgapped data seals.
            </p>
          </div>

          <div className="bg-[#0a1b33]/30 border border-white/5 p-8 rounded-2xl hover:border-[#D4AF37]/35 hover:bg-[#0a1b33]/50 transition-all hover:scale-[1.02] duration-300 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-2">Global Routing Resiliency</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dynamically maps active telemetry routes across commercial satellite constellations and regional fiber paths to ensure uninterrupted data supply.
            </p>
          </div>

          <div className="bg-[#0a1b33]/30 border border-white/5 p-8 rounded-2xl hover:border-emerald-550/25 hover:bg-[#0a1b33]/50 transition-all hover:scale-[1.02] duration-300 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-2">Proactive Energy Management</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Configures custom smart batteries to harvest grid capacities during cheap tariffs, discharging stored capacity to support high-workloads.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 border-t border-white/5 bg-transparent relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home-featured-products">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight font-display text-white">
              Pioneering Technologies
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Discover our latest hardware and software systems available for enterprise deployment.
            </p>
          </div>
          <Link
            to="/products"
            className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold text-[#D4AF37] hover:text-amber-500 transition-colors"
          >
            <span>View Full Portfolio</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-850 text-center font-mono text-slate-500 text-sm">
            No products published in the directory yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-slate-900/30 border border-slate-850 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-950">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute top-3 left-3 bg-[#050e1d]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider text-[#D4AF37] border border-white/5">
                    {product.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold font-display text-slate-100 group-hover:text-white transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block uppercase">Hardware Rate</span>
                      <span className="text-sm font-semibold text-[#D4AF37]">{product.price}</span>
                    </div>
                    <Link
                      to={`/contact?subject=Order:${product.name}`}
                      className="inline-flex items-center text-xs font-semibold text-[#D4AF37] hover:underline hover:scale-102 transition-all"
                    >
                      <span>Inquire Now</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 border-t border-slate-900 bg-slate-950 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in" id="home-reviews">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-display text-white">
            Trusted by Leaders of Heavy Industry
          </h2>
          <p className="mt-4 text-slate-400 text-sm">
            Ecosystem validations from regional directors, vice presidents of infrastructure, and chief scientists.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-850 text-center font-mono text-slate-500 text-sm">
            No testimonials filed in the directory yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#0a1b33]/15 border border-white/5 p-8 rounded-2xl flex flex-col justify-between backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="flex gap-1" id={`rating-${review.id}`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? 'text-[#D4AF37]' : 'text-slate-700'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "{review.text}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.image_url}
                      alt={review.author}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover bg-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{review.author}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {review.role}, {review.company}
                      </span>
                    </div>
                  </div>
                  {review.verified && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Corporate Ecosystem Action CTA */}
      <section className="py-20 border-t border-white/5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[radial-gradient(ellipse_at_center,rgba(10,27,51,0.3),#050e1d)]" id="home-cta">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Ready to expand your operational capability?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Get in touch with our partnerships office to request hardware test units, developer API sandboxes, or custom micro-grid financial projections.
          </p>
          <div className="pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase bg-[#D4AF37] text-[#050e1d] hover:bg-[#c29f2e] hover:scale-[1.01] transition-all font-display shadow-lg shadow-[#D4AF37]/10"
            >
              <span>Connect with a Solutions Engineer</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
