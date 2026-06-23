import React from 'react';
import { 
  MapPin, 
  ShoppingBag, 
  MessageSquare, 
  Star, 
  Users, 
  TrendingUp, 
  Clock, 
  Settings as SettingsIcon,
  ShieldAlert,
  Image as ImageIcon
} from 'lucide-react';
import { Branch, Product, Review, Founder, SuccessStory, TeamMember, MediaLibraryItem } from '../../types';

interface DashboardProps {
  branches: Branch[];
  products: Product[];
  testimonials: Review[]; // testimonials / reviews
  reviews: SuccessStory[]; // success stories or stars review
  teamMembers: TeamMember[];
  media?: MediaLibraryItem[];
  onNavigateTab: (tab: string) => void;
}

export default function Dashboard({
  branches = [],
  products = [],
  testimonials = [],
  reviews = [],
  teamMembers = [],
  media = [],
  onNavigateTab
}: DashboardProps) {
  // Compute metrics count
  const stats = [
    { 
      id: 'branches',
      label: 'Total Branches', 
      value: branches.length, 
      icon: MapPin, 
      color: 'from-blue-500/10 to-indigo-500/5 text-blue-400 border-blue-500/20' 
    },
    { 
      id: 'products',
      label: 'Total Products', 
      value: products.length, 
      icon: ShoppingBag, 
      color: 'from-[#D4AF37]/10 to-amber-500/5 text-[#D4AF37] border-[#D4AF37]/20' 
    },
    { 
      id: 'testimonials',
      label: 'Total Testimonials', 
      value: testimonials.length, 
      icon: MessageSquare, 
      color: 'from-emerald-500/10 to-teal-500/5 text-emerald-400 border-emerald-500/20' 
    },
    { 
      id: 'reviews',
      label: 'Total Reviews', 
      value: reviews.length, 
      icon: Star, 
      color: 'from-purple-500/10 to-pink-500/5 text-purple-400 border-purple-500/20' 
    },
    { 
      id: 'team',
      label: 'Founders / Team', 
      value: teamMembers.length, 
      icon: Users, 
      color: 'from-cyan-500/10 to-teal-500/5 text-cyan-400 border-cyan-500/20' 
    },
    { 
      id: 'media',
      label: 'Media Library', 
      value: media.length, 
      icon: ImageIcon, 
      color: 'from-rose-500/10 to-pink-500/5 text-rose-450 border-rose-500/20' 
    },
  ];

  return (
    <div className="space-y-8 text-left" id="admin-dashboard-vitals">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-[#020617] p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">System Operations Overview</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            Welcome back to the SKY7 Administrator Console. Here you can edit website content blocks, manage product entries, and keep directories synced in real-time.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      </div>

      {/* Grid of overview metrics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => onNavigateTab(stat.id === 'reviews' ? 'stories' : stat.id)}
              className={`p-5 bg-gradient-to-br rounded-2xl border text-left flex items-start justify-between shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all cursor-pointer ${stat.color}`}
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block font-bold">{stat.label}</span>
                <span className="text-2xl font-black text-white block leading-none font-sans">{stat.value}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5 shadow-inner shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid: Actions & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Links Column */}
        <div className="lg:col-span-7 bg-[#090d1f]/40 border border-slate-800/80 p-6 rounded-3xl shadow-lg space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Administrative Actions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Register Branch Hub', tab: 'branches', desc: 'Add new geographical office coordinates' },
              { label: 'Catalog Product Item', tab: 'products', desc: 'Publish water or service offerings' },
              { label: 'Founders & Team Registry', tab: 'team', desc: 'Deploy or edit bios, roles & departments' },
              { label: 'Review Site Settings', tab: 'settings', desc: 'Modify headers, logos, and SEO meta' },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigateTab(link.tab)}
                className="p-4 bg-slate-950/60 hover:bg-slate-900 border border-slate-800/50 hover:border-slate-700/60 rounded-2xl text-left transition-all cursor-pointer space-y-1"
              >
                <span className="text-xs font-bold text-[#D4AF37] block font-display">{link.label}</span>
                <span className="text-[10px] text-slate-500 block font-mono leading-normal">{link.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Operational Status Column */}
        <div className="lg:col-span-5 bg-[#090d1f]/40 border border-slate-800/80 p-6 rounded-3xl shadow-lg space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Operational Vitals</h3>
          </div>

          <div className="space-y-4 font-mono text-[11px]">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-850">
              <span className="text-slate-400">Database Connection</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-[9px]">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-850">
              <span className="text-slate-400">Storage Service</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-[9px]">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-850">
              <span className="text-slate-400">Contact Channels</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-[9px]">
                Synchronized
              </span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-850">
              <span className="text-slate-400">Sync Status</span>
              <span className="text-[#D4AF37]">Real-time Sync</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
