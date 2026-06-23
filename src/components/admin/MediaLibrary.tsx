import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Trash2, 
  X, 
  Search, 
  Filter, 
  Loader2, 
  AlertCircle, 
  FileText, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { MediaLibraryItem } from '../../types';
import { db } from '../../supabaseService';

interface MediaLibraryProps {
  mediaItems: MediaLibraryItem[];
  onRefresh: () => Promise<void>;
  onUploadMedia: (file: File) => Promise<string>;
}

export default function MediaLibrary({ 
  mediaItems = [], 
  onRefresh, 
  onUploadMedia 
}: MediaLibraryProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  // Search and Category Tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');

  // Preview / Form state
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState<'Images' | 'Documents' | 'Icons' | 'Others'>('Images');
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  // Status/Alerts
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);

  // Hidden file inputs refs for replace actions
  const replaceFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setErrorMsg(null);
    setSuccessMsg(null);
    
    // Check format and size
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'pdf'];
    if (!allowed.includes(ext || '')) {
      setErrorMsg('Invalid file format. Allowed formats: JPG, PNG, WEBP, SVG, PDF');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setErrorMsg('File size exceeds the 10MB limit.');
      return;
    }

    setPreviewFile(file);
    // Auto-generate title from filename
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const formattedTitle = nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    setTitle(formattedTitle);
    setAltText(formattedTitle);
    
    // Set category guess based on file extension
    if (ext === 'pdf') {
      setCategory('Documents');
    } else if (ext === 'svg') {
      setCategory('Icons');
    } else {
      setCategory('Images');
    }

    // Set display order
    const maxOrder = mediaItems.reduce((max, item) => (item.display_order || 0) > max ? (item.display_order || 0) : max, 0);
    setDisplayOrder(maxOrder + 1);

    if (file.type.startsWith('image/') || ext === 'svg') {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUploadConfirm = async () => {
    if (!previewFile) return;
    if (!title.trim()) {
      setErrorMsg('Title is required.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Upload to Supabase Storage using 'gallery-images' bucket
      const fileUrl = await onUploadMedia(previewFile);
      
      // 2. Insert record in public.media_library table
      const mediaItem: MediaLibraryItem = {
        id: 'm-' + Date.now(),
        title: title.trim(),
        file_name: previewFile.name,
        file_url: fileUrl,
        file_type: previewFile.type || `application/${previewFile.name.split('.').pop()}`,
        file_size: previewFile.size,
        category: category,
        alt_text: altText.trim(),
        display_order: displayOrder,
        is_active: true
      };

      await db.saveMediaItem(mediaItem);
      
      setSuccessMsg('Media asset uploaded and indexed successfully.');
      
      // Clear forms
      setPreviewFile(null);
      setPreviewUrl(null);
      setTitle('');
      setAltText('');
      setCategory('Images');
      setDisplayOrder(0);

      // Refresh parent state
      await onRefresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to complete media upload.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (item: MediaLibraryItem) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${item.title}"?`)) {
      return;
    }

    setProcessingItemId(item.id);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Delete from database table
      await db.deleteMediaItem(item.id);

      // 2. Delete from Supabase Storage bucket 'gallery-images'
      if (item.file_url && item.file_url.includes('gallery-images')) {
        await db.deleteMedia(item.file_url, 'gallery-images');
      }

      setSuccessMsg('Media asset successfully removed.');
      await onRefresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete media asset.');
    } finally {
      setProcessingItemId(null);
    }
  };

  const handleTriggerReplace = (itemId: string) => {
    replaceFileInputRefs.current[itemId]?.click();
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>, item: MediaLibraryItem) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate file
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'pdf'];
    if (!allowed.includes(ext || '')) {
      setErrorMsg('Invalid file format. Allowed formats: JPG, PNG, WEBP, SVG, PDF');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setErrorMsg('File size exceeds the 10MB limit.');
      return;
    }

    setProcessingItemId(item.id);
    try {
      // 1. Upload new file
      const newFileUrl = await db.uploadMedia(file, 'gallery-images');

      // 2. Delete old file from storage (if it was an uploaded storage object)
      if (item.file_url && item.file_url.includes('gallery-images')) {
        await db.deleteMedia(item.file_url, 'gallery-images');
      }

      // 3. Update database record with new file parameters
      const updatedItem: MediaLibraryItem = {
        ...item,
        file_url: newFileUrl,
        file_name: file.name,
        file_type: file.type || `application/${ext}`,
        file_size: file.size,
        updated_at: new Date().toISOString()
      };

      await db.saveMediaItem(updatedItem);

      setSuccessMsg(`"${item.title}" media file replaced successfully.`);
      await onRefresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to replace media file.');
    } finally {
      setProcessingItemId(null);
      e.target.value = '';
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const renderAssetPreview = (item: MediaLibraryItem) => {
    const isImage = item.file_type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|svg)$/i.test(item.file_name);
    const isPdf = item.file_type === 'application/pdf' || item.file_name.toLowerCase().endsWith('.pdf');
    
    if (isImage) {
      return (
        <img 
          src={item.file_url} 
          alt={item.alt_text || item.title} 
          className="max-h-full max-w-full object-contain" 
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      );
    } else if (isPdf) {
      return (
        <div className="flex flex-col items-center justify-center text-rose-450 gap-1.5 p-4">
          <FileText className="w-10 h-10 text-rose-500" />
          <span className="text-[9px] font-mono tracking-wider font-bold">PDF DOCUMENT</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4">
          <HelpCircle className="w-10 h-10" />
          <span className="text-[9px] font-mono tracking-wider font-bold">ATTACHMENT</span>
        </div>
      );
    }
  };

  // Filter and search
  const filteredAssets = mediaItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategoryTab === 'All' || 
      item.category?.toLowerCase() === activeCategoryTab.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-left" id="admin-media-library">
      
      {/* Header section */}
      <div className="border-b border-slate-800 pb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Media Assets Library</h2>
          <p className="text-slate-400 text-xs mt-1">Upload, preview, and extract path anchors for image assets.</p>
        </div>
      </div>

      {/* Alert banner */}
      {(successMsg || errorMsg) && (
        <div className="space-y-2 animate-in fade-in duration-200">
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-start gap-3 text-xs">
              <Check className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold font-mono uppercase text-[10px] tracking-wider text-emerald-300">Action Successful</p>
                <p className="mt-0.5 text-slate-300">{successMsg}</p>
              </div>
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-start gap-3 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold font-mono uppercase text-[10px] tracking-wider text-red-300">Execution Error</p>
                <p className="mt-0.5 text-slate-350">{errorMsg}</p>
              </div>
            </div>
          )}
        </div>
      )}

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
                accept=".jpg,.jpeg,.png,.webp,.svg,.pdf"
                onChange={handleSelectFile}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              <ImageIcon className="w-8 h-8 text-slate-550 group-hover:text-slate-400 mb-2 transition-colors" />
              <span className="text-[10px] font-mono text-slate-400 block font-bold">SELECT FILE</span>
              <span className="text-[9px] text-slate-500 block mt-1">Supports PNG, JPG, WEBP, SVG, PDF up to 10MB</span>
            </div>

            {/* Upload preview dialog */}
            {previewFile && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-4 animate-in fade-in slide-in-from-top-4 duration-250">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">File Preview & metadata</span>
                  <button 
                    onClick={() => { setPreviewFile(null); setPreviewUrl(null); }}
                    className="text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-pointer"
                    disabled={isProcessing}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {previewUrl ? (
                  <div className="flex justify-center bg-slate-900/60 p-2 rounded-xl border border-slate-900">
                    <img src={previewUrl} alt="Preview" className="max-h-32 rounded object-contain" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-slate-900/60 p-4 rounded-xl border border-slate-900 text-slate-400 gap-1">
                    <FileText className="w-8 h-8 text-slate-500" />
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{previewFile.name.split('.').pop()?.toUpperCase()} Document</span>
                  </div>
                )}

                <div className="text-[10px] font-mono text-slate-500 space-y-1">
                  <div className="truncate">File: <span className="text-slate-350">{previewFile.name}</span></div>
                  <div>Size: <span className="text-slate-350">{formatSize(previewFile.size)}</span></div>
                </div>

                {/* Metadata Fields */}
                <div className="space-y-3 pt-2 border-t border-slate-900">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Founder Profile Photo"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-[11px] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Alt Text</label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="e.g. Corporate portrait of company founder"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-[11px] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-[11px] text-slate-250 focus:outline-none focus:border-[#D4AF37]"
                        disabled={isProcessing}
                      >
                        <option value="Images">Images</option>
                        <option value="Documents">Documents</option>
                        <option value="Icons">Icons</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Display Order</label>
                      <input
                        type="number"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-[11px] text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUploadConfirm}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-950 font-mono font-bold uppercase text-[10px] hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving asset...</span>
                    </>
                  ) : (
                    <span>Save to Library</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assets Grid */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Search and Filters panel */}
          <div className="bg-[#090d1f]/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or filename..."
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'Images', 'Documents', 'Icons', 'Others'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategoryTab === cat
                      ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37]'
                      : 'border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200 bg-slate-950/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Document Library Index</span>
            <span className="text-[10px] font-mono text-slate-500">
              Showing {filteredAssets.length} of {mediaItems.length} items
            </span>
          </div>

          {filteredAssets.length === 0 ? (
            <div className="border border-dashed border-slate-800/80 rounded-3xl p-12 text-center text-slate-500 bg-[#090d1f]/10">
              <ImageIcon className="w-8 h-8 mx-auto text-slate-650 mb-3" />
              <p className="text-xs font-bold text-slate-400 font-display">No media files found</p>
              <p className="text-[10px] text-slate-600 mt-1">Try refining your search keyword or selection category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => {
                const isItemProcessing = processingItemId === asset.id;
                
                return (
                  <div 
                    key={asset.id}
                    className="bg-[#090d1f]/40 border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between gap-3 group relative shadow-md hover:border-slate-700/60 transition-all hover:scale-[1.01]"
                  >
                    {/* Visual Thumbnail */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-900 flex items-center justify-center">
                      {isItemProcessing ? (
                        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
                          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Processing...</span>
                        </div>
                      ) : null}
                      {renderAssetPreview(asset)}

                      {/* Category tag */}
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-slate-950/80 border border-slate-800 text-slate-400">
                        {asset.category || 'Images'}
                      </span>
                    </div>

                    {/* Details and Actions */}
                    <div className="space-y-2 text-left">
                      <div className="truncate font-bold text-white text-[11px] font-display" title={asset.title}>
                        {asset.title}
                      </div>
                      <div className="truncate text-[9px] font-mono text-slate-500" title={asset.file_name}>
                        File: {asset.file_name}
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-600">
                        <span>{formatSize(asset.file_size)}</span>
                        <span>Order: {asset.display_order || 0}</span>
                      </div>
                    </div>

                    {/* Actions HUD panel */}
                    <div className="flex gap-1.5 pt-2 border-t border-slate-900/60 items-center">
                      {/* Copy URL */}
                      <button
                        onClick={() => handleCopy(asset.file_url)}
                        disabled={isItemProcessing}
                        className="flex-grow flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[10px] font-mono font-bold uppercase tracking-wider disabled:opacity-50"
                        title="Copy Public URL"
                      >
                        {copiedUrl === asset.file_url ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      {/* Replace hidden input trigger */}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.svg,.pdf"
                        ref={el => replaceFileInputRefs.current[asset.id] = el}
                        onChange={(e) => handleReplaceFileChange(e, asset)}
                        className="hidden"
                      />

                      <button
                        onClick={() => handleTriggerReplace(asset.id)}
                        disabled={isItemProcessing}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 transition-colors cursor-pointer disabled:opacity-50"
                        title="Replace File"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(asset)}
                        disabled={isItemProcessing}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-500 hover:text-red-400 hover:border-red-950/20 hover:bg-red-950/15 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete File"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
