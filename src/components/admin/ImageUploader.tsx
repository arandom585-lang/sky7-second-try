import React, { useState } from 'react';
import { Upload, Trash2, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { db } from '../../supabaseService';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucketName: 'founders-images' | 'branch-images' | 'product-images' | 'gallery-images';
  rounded?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  bucketName,
  rounded = false,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Check type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, and WEBP are allowed.');
      return false;
    }

    // Check size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds the 5MB limit.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setLoading(true);
    try {
      // In case there is an existing image, delete it from storage first
      if (value) {
        await db.deleteMedia(value, bucketName);
      }

      // Upload new image
      const publicUrl = await db.uploadMedia(file, bucketName);
      onChange(publicUrl);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDelete = async () => {
    if (!value) return;
    
    setLoading(true);
    setError(null);
    try {
      await db.deleteMedia(value, bucketName);
      onChange('');
    } catch (err) {
      console.error('Image deletion failed:', err);
      setError('Failed to delete image from storage.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Preview Container */}
        {value ? (
          <div className="relative shrink-0">
            <img
              src={value}
              alt="Preview"
              className={`object-cover border border-slate-200 bg-slate-55 shadow-sm ${
                rounded ? 'w-20 h-20 rounded-full' : 'w-32 h-20 rounded-xl'
              }`}
            />
            {loading && (
              <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div
            className={`shrink-0 border border-dashed border-slate-300 bg-slate-55 flex items-center justify-center ${
              rounded ? 'w-20 h-20 rounded-full' : 'w-32 h-20 rounded-xl'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-slate-400" />
            )}
          </div>
        )}

        {/* Action Buttons & Input */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              id={`upload-field-${bucketName}`}
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
            
            {value ? (
              <>
                <label
                  htmlFor={`upload-field-${bucketName}`}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-350 cursor-pointer flex items-center gap-1.5 text-slate-700 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Replace</span>
                </label>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-3.5 py-2 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 cursor-pointer flex items-center gap-1.5 text-red-650 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Delete</span>
                </button>
              </>
            ) : (
              <label
                htmlFor={`upload-field-${bucketName}`}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 text-slate-650 text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </label>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            JPG, PNG, or WEBP. Max size 5MB.
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
