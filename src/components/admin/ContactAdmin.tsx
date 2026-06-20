import React, { useState, useEffect } from 'react';
import { Save, Mail, Phone, MessageSquare, MapPin, Share2 } from 'lucide-react';
import { ContactInfoData } from '../../types';

interface ContactAdminProps {
  contacts: ContactInfoData | null;
  onSave: (contacts: ContactInfoData) => Promise<any>;
}

export default function ContactAdmin({
  contacts,
  onSave
}: ContactAdminProps) {
  const [formState, setFormState] = useState<ContactInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Hydrate local form state when database values arrive
  useEffect(() => {
    if (contacts) {
      setFormState({ ...contacts });
    }
  }, [contacts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;
    setIsLoading(true);
    setSuccessMsg('');
    try {
      await onSave(formState);
      setSuccessMsg('Corporate contact settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving contact settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formState) {
    return (
      <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 text-center font-mono text-xs text-slate-500">
        Loading contact parameters...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left" id="admin-contact-management">
      
      {/* Header title */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold font-display text-white">Contact & Support Channels</h2>
        <p className="text-slate-400 text-xs mt-1">Configure company telephone routes, messaging addresses, and social links.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 font-mono animate-pulse">
          ✓ {successMsg}
        </div>
      )}

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl font-sans text-xs">
        
        {/* Contact Info Group */}
        <div className="bg-[#090d1f]/40 border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Support Endpoints</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Support Email</label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={e => setFormState({ ...formState, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Telephone (e.g. +91 XXXXX XXXXX)</label>
              <input
                type="text"
                required
                value={formState.phone}
                onChange={e => setFormState({ ...formState, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">WhatsApp (e.g. 919999999999)</label>
              <input
                type="text"
                required
                value={formState.whatsapp_number}
                onChange={e => setFormState({ ...formState, whatsapp_number: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

          </div>

          {/* Physical Address */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-505 uppercase">Corporate Office Address</label>
            <input
              type="text"
              required
              value={formState.address}
              onChange={e => setFormState({ ...formState, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>

        </div>

        {/* Social Media Link Group */}
        <div className="bg-[#090d1f]/40 border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2 mb-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Social Media Anchors</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Facebook */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Facebook URL</label>
              <input
                type="url"
                value={formState.facebook || ''}
                onChange={e => setFormState({ ...formState, facebook: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            {/* Twitter */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Twitter URL</label>
              <input
                type="url"
                value={formState.twitter || ''}
                onChange={e => setFormState({ ...formState, twitter: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            {/* Instagram */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Instagram URL</label>
              <input
                type="url"
                value={formState.instagram || ''}
                onChange={e => setFormState({ ...formState, instagram: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">LinkedIn URL</label>
              <input
                type="url"
                value={formState.linkedin || ''}
                onChange={e => setFormState({ ...formState, linkedin: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

          </div>

          {/* YouTube */}
          <div className="space-y-1 max-w-lg">
            <label className="text-[10px] font-mono text-slate-500 uppercase">YouTube Channel URL</label>
            <input
              type="url"
              value={formState.youtube || ''}
              onChange={e => setFormState({ ...formState, youtube: e.target.value })}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Saving Details...' : 'Save Channels'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
