import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, Compass, Cpu, HelpCircle, Mail, Clock, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    console.log('[DashboardPage] Initiating logout...');
    try {
      await logout();
      console.log('[DashboardPage] Logout successful, redirecting to /login');
      navigate('/login');
    } catch (err) {
      console.error('[DashboardPage] Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f3] text-[#0B1B3D] flex flex-col relative z-10" id="user-dashboard-page">
      {/* Navbar space filler */}
      <div className="h-[75px] sm:h-[84px] lg:h-[90px]" />

      {/* Decorative Blur Spheres */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#C5A043]/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#0B1B3D]/5 blur-[120px] pointer-events-none -z-10" />

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          {/* Header Panel */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1B3D] to-[#173B8C] flex items-center justify-center text-white shadow-md">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1B3D]">
                  Welcome back!
                </h1>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-0.5">
                  Logged in as: <span className="text-[#C5A043] font-bold">{user?.email}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-widest bg-slate-100 hover:bg-slate-200 text-[#0B1B3D] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Card: Account details */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-bold text-[#0B1B3D] text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#C5A043]" />
                  <span>Account Authorization</span>
                </h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Session ID</span>
                  <span className="text-xs font-mono bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg block overflow-x-auto whitespace-nowrap text-slate-600">
                    {user?.id}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Access Role</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {user?.role}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Security Status</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      Encrypted
                    </span>
                  </div>
                </div>
                
                {/* Profile settings link */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Link
                    to="/profile"
                    className="text-xs font-bold font-mono uppercase tracking-widest text-[#C5A043] hover:text-[#0B1B3D] transition-colors"
                  >
                    Edit Profile settings →
                  </Link>
                </div>
              </div>
            </div>

            {/* Middle Card: Workspace & Guides */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6 lg:col-span-2">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-bold text-[#0B1B3D] text-base flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#C5A043]" />
                  <span>Ecosystem Services Explorer</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-100 rounded-2xl p-4 hover:border-[#C5A043]/30 transition-all space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#173B8C] flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#0B1B3D]">Developer Sandbox</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Check branches and corporate projects in real-time, or test API integrations within our sandbox systems.
                  </p>
                </div>

                <div className="border border-slate-100 rounded-2xl p-4 hover:border-[#C5A043]/30 transition-all space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C5A043] flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#0B1B3D]">System Documentation</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Read the architectural specifications for the SKY SEVEN connected node telemetry protocol layer.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
