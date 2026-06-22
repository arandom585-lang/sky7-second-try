import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Shield, Mail, Key, RefreshCw, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const { user, signUp, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setError(null);
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate, setError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      console.warn('[SignupPage] Validation failed: missing fields.');
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      console.warn('[SignupPage] Validation failed: password mismatch.');
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      console.warn('[SignupPage] Validation failed: password too short.');
      setError('Password should be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    console.log('[SignupPage] Initiating signup for email:', email);
    try {
      const session = await signUp(email, password);
      console.log('[SignupPage] Signup request completed. Resulting session:', session);
      
      if (session) {
        console.log('[SignupPage] Direct session received (email verification is disabled in Supabase). Redirecting to /dashboard.');
        navigate('/dashboard');
      } else {
        console.log('[SignupPage] No session returned (email verification is enabled). Showing verification view.');
        setIsSuccess(true);
      }
    } catch (err: any) {
      console.error('[SignupPage] Signup exception caught:', err);
      setError(err?.message || 'Failed to complete signup request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f3] text-[#0B1B3D] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative z-10" id="user-signup-page">
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
            <h2 className="text-2xl font-bold tracking-tight text-[#0B1B3D]">Create Your Account</h2>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">
              SKY SEVEN Member Portal
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4" id="signup-success-view">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-[#0B1B3D] block">
                Account created successfully. Please check your email for verification.
              </span>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-widest text-[#0B1B3D] hover:text-[#C5A043] transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : (
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  <span>Confirm Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C5A043] font-semibold hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
