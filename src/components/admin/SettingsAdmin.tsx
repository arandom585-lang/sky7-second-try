import React, { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Sliders } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import ImageUploader from './ImageUploader';

interface SettingsAdminProps {
  settings: WebsiteSettings | null;
  onSave: (settings: WebsiteSettings) => Promise<any>;
}

export default function SettingsAdmin({
  settings,
  onSave,
}: SettingsAdminProps) {
  const [formState, setFormState] = useState<WebsiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sync state when props arrive
  useEffect(() => {
    if (settings) {
      setFormState({ ...settings });
    }
  }, [settings]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;
    setIsLoading(true);
    setSuccessMessage('');
    try {
      await onSave(formState);
      setSuccessMessage('Website configuration settings successfully saved!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formState) {
    return (
      <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 text-center font-mono text-xs text-slate-500">
        Loading site configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left" id="admin-settings-management">
      
      {/* Tab Header Info */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold font-display text-white">General Website Settings</h2>
        <p className="text-slate-400 text-xs mt-1">Configure company naming, brand assets, site headers, color palettes, and SEO meta.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 font-mono animate-pulse">
          ✓ {successMessage}
        </div>
      )}

      {/* Settings form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl font-sans text-xs">
        
        {/* Naming and Brand asset uploads */}
        <div className="bg-[#090d1f]/40 border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2 mb-2">
            <SettingsIcon className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Brand Properties</h3>
          </div>

          <div className="space-y-1 max-w-lg">
            <label className="text-[10px] font-mono text-slate-500 uppercase">Company Name</label>
            <input
              type="text"
              required
              value={formState.company_name}
              onChange={e => setFormState({ ...formState, company_name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            {/* Logo upload */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Custom Brand Logo</span>
              <ImageUploader
                value={formState.logo_url || ''}
                onChange={url => setFormState({ ...formState, logo_url: url })}
                bucketName="gallery-images"
              />
            </div>

            {/* Favicon upload */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Browser Favicon Icon</span>
              <ImageUploader
                value={formState.favicon_url || ''}
                onChange={url => setFormState({ ...formState, favicon_url: url })}
                bucketName="gallery-images"
                rounded={true}
              />
            </div>

          </div>
        </div>

        {/* Styling Theme Colors */}
        <div className="bg-[#090d1f]/40 border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Brand Styling Palettes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Primary color */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase block">Primary Layout Color (Navy Base)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formState.theme_primary || '#173B8C'}
                  onChange={e => setFormState({ ...formState, theme_primary: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formState.theme_primary || '#173B8C'}
                  onChange={e => setFormState({ ...formState, theme_primary: e.target.value })}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-xs text-slate-300 w-32 focus:outline-none"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase block">Secondary / Glow Color (Gold Accent)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formState.theme_secondary || '#D4AF37'}
                  onChange={e => setFormState({ ...formState, theme_secondary: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formState.theme_secondary || '#D4AF37'}
                  onChange={e => setFormState({ ...formState, theme_secondary: e.target.value })}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-xs text-slate-300 w-32 focus:outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* SEO Meta Headers */}
        <div className="bg-[#090d1f]/40 border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Search Engine Optimization (SEO)</h3>
          </div>

          {/* Meta Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase">Meta Title Header</label>
            <input
              type="text"
              value={formState.meta_title || ''}
              onChange={e => setFormState({ ...formState, meta_title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase">Meta Description Body</label>
            <textarea
              rows={3}
              value={formState.meta_description || ''}
              onChange={e => setFormState({ ...formState, meta_description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none resize-none"
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
            <span>{isLoading ? 'Saving Configurations...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
