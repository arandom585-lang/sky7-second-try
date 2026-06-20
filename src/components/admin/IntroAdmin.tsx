import React, { useState, useEffect } from 'react';
import { Save, Upload, User, Award, Shield } from 'lucide-react';
import { Founder } from '../../types';

interface IntroAdminProps {
  founders: Founder[];
  onSave: (founder: Founder) => Promise<any>;
  onUploadMedia: (file: File) => Promise<string>;
}

export default function IntroAdmin({
  founders = [],
  onSave,
  onUploadMedia
}: IntroAdminProps) {
  const [founder, setFounder] = useState<Founder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load the founder details (matching ID 'f1' or first founder in list)
  useEffect(() => {
    if (founders.length > 0) {
      const primaryFounder = founders.find(f => f.id === 'f1') || founders[0];
      setFounder({ ...primaryFounder });
    }
  }, [founders]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !founder) return;
    try {
      const publicUrl = await onUploadMedia(file);
      setFounder({ ...founder, image_url: publicUrl });
    } catch (err) {
      console.error('File upload error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!founder) return;
    setIsLoading(true);
    setSuccessMessage('');
    try {
      await onSave(founder);
      setSuccessMessage('Founder biography spotlight updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving founder details', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!founder) {
    return (
      <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 text-center font-mono text-xs text-slate-500">
        Loading founder spotlight parameters...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left" id="admin-intro-management">
      
      {/* Header info */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold font-display text-white">Intro Page Spotlight Management</h2>
        <p className="text-slate-400 text-xs mt-1">Configure profile descriptions, executive designations, achievements, and portraits.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 font-mono animate-pulse">
          ✓ {successMessage}
        </div>
      )}

      {/* Main Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Details form */}
        <div className="lg:col-span-8 bg-[#090d1f]/40 border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-4 font-sans text-xs">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Biography Parameters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Founder Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-550 uppercase">Founder Name</label>
              <input
                type="text"
                required
                value={founder.name}
                onChange={e => setFounder({ ...founder, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Role / Designation */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-550 uppercase">Founder Designation (e.g. Managing Director — SKY7)</label>
              <input
                type="text"
                required
                value={founder.role}
                onChange={e => setFounder({ ...founder, role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* biography */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase">Biography / Biography Summary</label>
            <textarea
              rows={4}
              required
              value={founder.bio}
              onChange={e => setFounder({ ...founder, bio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>

          <div className="border border-slate-850 p-4 rounded-2xl space-y-4">
            <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-bold">Achievement metric card details</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1 space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Metric Value (e.g. 100+)</label>
                <input
                  type="text"
                  required
                  value={founder.achievement_count || ''}
                  onChange={e => setFounder({ ...founder, achievement_count: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Description (e.g. Successful Entrepreneurs Worldwide)</label>
                <input
                  type="text"
                  required
                  value={founder.achievement_text || ''}
                  onChange={e => setFounder({ ...founder, achievement_text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving Changes...' : 'Save Spotlight'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Portrait Preview & Image Upload */}
        <div className="lg:col-span-4 bg-[#090d1f]/40 border border-slate-800/80 p-6 rounded-3xl space-y-4 font-sans text-xs">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Portrait Asset</h3>
          </div>

          {/* Image preview box */}
          <div className="relative group max-w-sm w-full mx-auto">
            <div className="relative overflow-hidden rounded-[24px] border border-slate-800 bg-slate-950 shadow-lg">
              <img 
                src={founder.image_url} 
                alt={founder.name} 
                className="w-full aspect-[4/5] object-cover object-top" 
              />
            </div>
          </div>

          {/* Upload triggers */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Image URL Path</label>
              <input
                type="text"
                value={founder.image_url}
                onChange={e => setFounder({ ...founder, image_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                id="founder-upload-control"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="founder-upload-control" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 cursor-pointer text-slate-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload portrait</span>
              </label>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
