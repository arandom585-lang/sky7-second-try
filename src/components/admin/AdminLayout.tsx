import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  ShoppingBag, 
  User, 
  MessageSquare, 
  Award, 
  Mail, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Bell, 
  Search, 
  ShieldCheck,
  Users
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { ADMIN_EMAIL } from '../../authService';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  adminEmail?: string;
  settings?: WebsiteSettings | null;
}

const menuItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'branches', label: 'Branches', icon: MapPin },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'team', label: 'Founders & Team', icon: Users },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'stories', label: 'Success Stories', icon: Award },
  { id: 'contact', label: 'Contact Details', icon: Mail },
  { id: 'media', label: 'Media Library', icon: ImageIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function AdminLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  onLogout,
  adminEmail = ADMIN_EMAIL,
  settings = null
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row relative" id="admin-workspace">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-[#090d1f] border-b lg:border-b-0 lg:border-r border-slate-800 lg:fixed lg:top-0 lg:bottom-0 z-30 flex flex-col justify-between shrink-0" id="admin-sidebar">
        <div>
          {/* Logo Heading Header */}
          <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
            {settings?.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.company_name || 'Logo'} 
                className="w-9 h-9 object-contain rounded-lg bg-white p-1 border border-slate-200/50" 
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C5A043] to-[#0B1B3D] flex items-center justify-center shadow-md shadow-[#C5A043]/10">
                <span className="font-extrabold text-xs text-white">S7</span>
              </div>
            )}
            <div>
              <h2 className="text-sm font-bold text-white leading-none font-display">
                {settings?.company_name || 'SKY7'} Dashboard
              </h2>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#C5A043] uppercase mt-1 block">Control Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] lg:max-h-[calc(100vh-140px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-bold tracking-wide uppercase transition-all cursor-pointer text-left border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-900/40 to-indigo-950/20 text-[#C5A043] border-blue-500/25 shadow-inner'
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C5A043]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Sign out button */}
        <div className="p-4 border-t border-slate-800/60">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-mono font-bold tracking-widest uppercase border border-slate-800 hover:border-red-900/50 text-slate-400 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-grow lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/60 bg-[#090d1f]/60 backdrop-blur-md flex items-center justify-between px-6 sm:px-8 sticky top-0 z-20" id="admin-topbar">
          {/* Active section caption */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Secured Console
            </span>
            <span className="text-slate-600 font-mono text-xs">/</span>
            <span className="text-xs font-mono font-bold text-[#C5A043] uppercase tracking-wider">
              {activeTab}
            </span>
          </div>

          {/* Right side widgets: Search, alerts, profile */}
          <div className="flex items-center gap-5">
            {/* Search simulation input */}
            <div className="hidden md:flex items-center gap-2.5 bg-slate-950 border border-slate-850 px-3.5 py-1.5 rounded-full w-60">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent text-xs text-slate-300 w-full focus:outline-none placeholder-slate-600 font-mono"
              />
            </div>

            {/* Notification alert bells */}
            <button className="relative p-1.5 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </button>

            {/* Administrative Account chip */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700 shadow-sm shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[10px] font-mono font-bold text-[#C5A043] block leading-none">ROOT ACCESS</span>
                <span className="text-[9px] font-mono text-slate-400 block mt-1 leading-none">{adminEmail}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main section mount grid container */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8 relative">
          {children}
        </main>
      </div>

    </div>
  );
}
