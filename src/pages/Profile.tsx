import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService, UserProfile } from '../lib/profileService';
import { User, Mail, Save, RefreshCw, AlertCircle, CheckCircle2, Clock, Phone, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const data = await profileService.getProfile(user.id);
        if (mounted) {
          if (data) {
            setProfile(data);
            setFullName(data.full_name || '');
            setPhone(data.phone || '');
            setCompanyName(data.company_name || '');
          } else {
            setError('Profile record not found. Let us seed or update it below.');
            // Seed a transient profile object for UI editing
            setProfile({
              id: user.id,
              email: user.email,
              full_name: '',
              phone: '',
              company_name: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }
      } catch (err: any) {
        console.error('[ProfilePage] Error fetching profile:', err);
        if (mounted) {
          setError(err?.message || 'Failed to load profile settings. Please try again.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);
    console.log('[ProfilePage] Submitting profile update...');

    try {
      const updated = await profileService.updateProfile({
        id: user.id,
        email: user.email,
        full_name: fullName.trim(),
        phone: phone.trim(),
        company_name: companyName.trim()
      });
      setProfile(updated);
      setFullName(updated.full_name || '');
      setPhone(updated.phone || '');
      setCompanyName(updated.company_name || '');
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('[ProfilePage] Error updating profile:', err);
      setError(err?.message || 'Failed to update profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f3] flex flex-col items-center justify-center relative z-50">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#C5A043] animate-spin mx-auto" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#0B1B3D]">
            Loading profile credentials...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f3] text-[#0B1B3D] flex flex-col relative z-10" id="user-profile-page">
      {/* Navbar filler */}
      <div className="h-[75px] sm:h-[84px] lg:h-[90px]" />

      {/* Decorative Blur Spheres */}
      <div className="absolute top-[10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-[#C5A043]/10 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-[#0B1B3D]/5 blur-[100px] pointer-events-none -z-10" />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8 sm:px-6">
        <div className="space-y-8">
          
          {/* Breadcrumb / Navigation helper */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
              <Link to="/dashboard" className="hover:text-[#0B1B3D] transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="text-[#C5A043]">Profile settings</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-md">
            {/* Header section */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1B3D] flex items-center gap-2.5">
                <User className="w-6 h-6 text-[#C5A043]" />
                <span>Account Profile Details</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Update your personal information below. These credentials govern authorization signatures across the SKY SEVEN enterprise clusters.
              </p>
            </div>

            {/* Notification messages */}
            {error && (
              <div className="mb-6 bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-600 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-600 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Full Legal Name</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1B3D] focus:outline-none focus:border-[#C5A043] focus:ring-1 focus:ring-[#C5A043]/20 transition-all font-sans"
                  />
                </div>

                {/* Email address (readonly) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address (Read-only)</span>
                  </label>
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={profile?.email || user?.email || ''}
                    className="w-full bg-slate-100/50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm text-slate-400 cursor-not-allowed font-sans select-none"
                  />
                </div>

                {/* Phone field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 99999 99999"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1B3D] focus:outline-none focus:border-[#C5A043] focus:ring-1 focus:ring-[#C5A043]/20 transition-all font-sans"
                  />
                </div>

                {/* Company Name field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Company Name</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. SKY SEVEN Ventures"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0B1B3D] focus:outline-none focus:border-[#C5A043] focus:ring-1 focus:ring-[#C5A043]/20 transition-all font-sans"
                  />
                </div>

              </div>

              {/* Metadata log info */}
              {profile && (
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span>Created: {new Date(profile.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span>Updated: {new Date(profile.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-widest bg-[#0B1B3D] text-white hover:bg-[#102e70] disabled:opacity-50 hover:scale-[1.01] hover:shadow-lg transition-all cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
