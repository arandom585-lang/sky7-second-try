import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, ADMIN_EMAIL } from '../authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Layers, Shield, FileText, Key, Mail, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccessfullyAuthorized, setIsSuccessfullyAuthorized] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const session = authService.getCurrentSession();
      if (session?.role === 'admin') {
        navigate('/admin');
        return;
      }
    }

    let mounted = true;
    async function checkSession() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && mounted) {
            const userEmail = session.user.email || '';
            const isUserAdmin = session.user.user_metadata?.role === 'admin' || 
                                session.user.user_metadata?.is_admin === true || 
                                userEmail === ADMIN_EMAIL;
            
            console.log('[AdminLogin.checkSession] Debug Auth Info:', {
              'Current User Email': userEmail,
              'Current User Role': session.user.user_metadata?.role || 'user',
              'Current Session': 'Active',
              'Authorization Result': isUserAdmin ? 'AUTHORIZED' : 'UNAUTHORIZED'
            });

            if (!isUserAdmin && userEmail.includes('admin')) {
              console.log('[AdminLogin.checkSession] Authorization failed because email ' + userEmail + ' is not the configured admin email (' + ADMIN_EMAIL + ') and user_metadata role is not admin.');
            }

            if (isUserAdmin) {
              const userSession = {
                email: userEmail,
                id: session.user.id,
                role: 'admin' as const,
              };
              localStorage.setItem('corporate_auth_session', JSON.stringify(userSession));
              navigate('/admin');
            }
          }
        } catch (err) {
          console.error('Failed to restore session on login page mount:', err);
        }
      }
    }

    checkSession();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const session = await login(email, password);
      const isAuthorized = session.role === 'admin';
      
      console.log('[AdminLogin.handleLogin] Debug Auth Info:', {
        'Current User Email': session.email,
        'Current User Role': session.role,
        'Current Session': 'Active',
        'Authorization Result': isAuthorized ? 'AUTHORIZED' : 'UNAUTHORIZED'
      });

      if (!isAuthorized) {
        console.log('[AdminLogin.handleLogin] Authorization failed because resolved role is "' + session.role + '" instead of "admin".');
        setError('Unauthorized access. This area is restricted to administrators.');
        return;
      }
      setIsSuccessfullyAuthorized(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Login handshake failed. Verify corporate credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative z-10" id="admin-login-page">
      <div className="max-w-md w-full space-y-8 bg-[#050e1d]/50 border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#0B1B3D] flex items-center justify-center mx-auto shadow-lg shadow-[#4F8CFF]/10">
            <span className="font-extrabold text-xs text-white">S7</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">Admin Console Access</h2>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">
              SKY SEVEN Operational Hub
            </p>
          </div>
        </div>

        {isSuccessfullyAuthorized ? (
          <div className="py-10 text-center space-y-4" id="login-auth-success">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white block">Credentials Decrypted!</span>
              <span className="text-xs text-slate-400 block mt-1">Booting dashboard cluster...</span>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLogin} id="portal-form">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs text-rose-400 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Administrative Name</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@corporate.com"
                  className="w-full bg-[#050e1d]/70 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#4F8CFF] focus:ring-1 focus:ring-[#4F8CFF]/20 transition-all font-sans"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-500" />
                  <span>Decryption Passcode</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#050e1d]/70 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#4F8CFF] focus:ring-1 focus:ring-[#4F8CFF]/20 transition-all font-sans"
                />
              </div>
            </div>

            {/* CTA action button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-widest bg-[#4F8CFF] text-[#050e1d] hover:bg-blue-600 disabled:opacity-50 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#4F8CFF]/10 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Decrypting security locks...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
