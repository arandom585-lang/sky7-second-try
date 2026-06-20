import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Copy, Check, Trash2, X } from 'lucide-react';

interface MediaLibraryProps {
  onUploadMedia: (file: File) => Promise<string>;
}

interface MediaAsset {
  url: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export default function MediaLibrary({ onUploadMedia }: MediaLibraryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  // Preview buffers
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load persistent library list from LocalStorage
  useEffect(() => {
    const data = localStorage.getItem('s7_media_library');
    if (data) {
      try {
        setAssets(JSON.parse(data));
      } catch {
        // use default empty list
      }
    } else {
      // Seed with some default system images
      const defaults: MediaAsset[] = [
        { url: '/images/founder_sudhakar.jpg', name: 'founder_sudhakar.jpg', size: '242 KB', uploadedAt: new Date().toLocaleString() },
        { url: '/images/sky_seven_water.jpg', name: 'sky_seven_water.jpg', size: '185 KB', uploadedAt: new Date().toLocaleString() },
      ];
      setAssets(defaults);
      localStorage.setItem('s7_media_library', JSON.stringify(defaults));
    }
  }, []);

  const saveAssetsToStorage = (newAssets: MediaAsset[]) => {
    setAssets(newAssets);
    localStorage.setItem('s7_media_library', JSON.stringify(newAssets));
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadConfirm = async () => {
    if (!previewFile) return;
    setIsUploading(true);
    try {
      const publicUrl = await onUploadMedia(previewFile);
      const sizeStr = (previewFile.size / 1024).toFixed(0) + ' KB';
      const newAsset: MediaAsset = {
        url: publicUrl,
        name: previewFile.name,
        size: sizeStr,
        uploadedAt: new Date().toLocaleString()
      };
      const updated = [newAsset, ...assets];
      saveAssetsToStorage(updated);
      
      // Clean up buffers
      setPreviewFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = (urlToDelete: string) => {
    if (window.confirm('Remove this media asset from directory?')) {
      const updated = assets.filter(a => a.url !== urlToDelete);
      saveAssetsToStorage(updated);
    }
  };

  return (
    <div className="space-y-6 text-left" id="admin-media-library">
      
      {/* Header section */}
      <div className="border-b border-slate-800 pb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Media Assets Library</h2>
          <p className="text-slate-400 text-xs mt-1">Upload, preview, and extract path anchors for image assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload panel */}
        <div className="lg:col-span-4 bg-[#090d1f]/40 border border-slate-800/80 p-6 rounded-3xl space-y-5 text-xs font-sans">
          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Upload Panel</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-2xl p-6 text-center transition-colors relative cursor-pointer group">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleSelectFile}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <ImageIcon className="w-8 h-8 text-slate-550 group-hover:text-slate-400 mb-2 transition-colors" />
              <span className="text-[10px] font-mono text-slate-400 block font-bold">SELECT IMAGE FILE</span>
              <span className="text-[9px] text-slate-650 block mt-1">Supports PNG, JPG, WEBP, GIF</span>
            </div>

            {/* Upload preview dialog */}
            {previewUrl && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-4 animate-in fade-in slide-in-from-top-4 duration-250">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Image Preview before save</span>
                  <button 
                    onClick={() => { setPreviewFile(null); setPreviewUrl(null); }}
                    className="text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-center bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                  <img src={previewUrl} alt="Preview" className="max-h-32 rounded object-contain" />
                </div>

                <div className="text-[10px] font-mono text-slate-500 space-y-1">
                  <div className="truncate">File: <span className="text-slate-350">{previewFile?.name}</span></div>
                  <div>Size: <span className="text-slate-350">{(previewFile ? (previewFile.size / 1024).toFixed(0) : 0)} KB</span></div>
                </div>

                <button
                  onClick={handleUploadConfirm}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-950 font-mono font-bold uppercase text-[10px] hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? 'Uploading file...' : 'Save to Library'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assets Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Document Library Index</span>
            <span className="text-[10px] font-mono text-slate-500">{assets.length} items cataloged</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div 
                key={asset.url}
                className="bg-[#090d1f]/40 border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between gap-3 group relative shadow-md hover:border-slate-700/60 transition-all hover:scale-[1.01]"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-900 flex items-center justify-center">
                  <img src={asset.url} alt={asset.name} className="max-h-full max-w-full object-contain" />
                </div>

                {/* Details and Actions */}
                <div className="space-y-2 text-left">
                  <div className="truncate font-bold text-white text-[11px] font-display" title={asset.name}>
                    {asset.name}
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>{asset.size}</span>
                    <span className="text-slate-600">•</span>
                    <span>Image</span>
                  </div>
                </div>

                {/* Actions HUD panel */}
                <div className="flex gap-1.5 pt-2 border-t border-slate-900/60">
                  <button
                    onClick={() => handleCopy(asset.url)}
                    className="flex-grow flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[10px] font-mono font-bold uppercase tracking-wider"
                    title="Copy Image URL Link"
                  >
                    {copiedUrl === asset.url ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(asset.url)}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-500 hover:text-red-400 hover:border-red-950/20 hover:bg-red-950/15 transition-colors cursor-pointer"
                    title="Remove File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
