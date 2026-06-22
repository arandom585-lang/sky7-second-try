import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Shield, Mail, Key, RefreshCw, LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { user, login, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear errors when entering the page
    setError(null);
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate, setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      console.warn('[LoginPage] Validation failed: missing fields.');
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    console.log('[LoginPage] Initiating login for email:', email);
    try {
      const session = await login(email, password);
      console.log('[LoginPage] Login successful. Session returned:', session);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[LoginPage] Login exception caught:', err);
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f3] text-[#0B1B3D] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative z-10" id="user-login-page">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#C5A043]/10 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-[#0B1B3D]/5 blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200/60 p-8 rounded-3xl shadow-xl backdrop-blur-sm relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1B3D] to-[#173B8C] flex items-center justify-center mx-auto shadow-md">
              <span className="font-extrabold text-xs text-white">S7</span>
            </div>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1B3D]">Sign In to Your Account</h2>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">
              SKY SEVEN Member Portal
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-600 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. member@sky7.com"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1B3D] focus:outline-none focus:border-[#C5A043] focus:ring-1 focus:ring-[#C5A043]/20 transition-all font-sans"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1B3D] focus:outline-none focus:border-[#C5A043] focus:ring-1 focus:ring-[#C5A043]/20 transition-all font-sans"
              />
            </div>
          </div>

          {/* CTA action button */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-widest bg-[#0B1B3D] text-white hover:bg-[#102e70] disabled:opacity-50 hover:scale-[1.01] hover:shadow-lg transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#C5A043] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Sandbox Simulation Mode Helper */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-slate-500 space-y-1 font-sans leading-relaxed">
          <span className="font-bold text-[#C5A043] block uppercase font-mono tracking-wider text-[10px]">Portal Mode</span>
          <p>
            If Supabase integration is currently in local sandbox simulation mode, you can sign up with any email, or sign in using any mock credentials immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
