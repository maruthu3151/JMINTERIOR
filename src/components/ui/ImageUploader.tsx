import React, { useState, useRef, DragEvent } from 'react';
import { UploadCloud, X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { uploadFile, validateImageFile } from '../../services/storageService';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  storagePath: string;
  label?: string;
  helpText?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  className?: string;
  accept?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  storagePath,
  label,
  helpText = 'PNG, JPG or WebP up to 10MB',
  aspectRatio = 'video',
  className = '',
  accept = 'image/png, image/jpeg, image/webp, image/svg+xml',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: 'aspect-square max-h-48',
    video: 'aspect-video max-h-56',
    wide: 'aspect-[21/9] max-h-60',
    auto: 'min-h-[140px]',
  }[aspectRatio];

  const handleFile = async (file: File) => {
    setError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      const downloadUrl = await uploadFile(file, storagePath, (pct) => {
        setProgress(pct);
      });
      onChange(downloadUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-semibold text-stone-700 tracking-wide uppercase">
          {label}
        </span>
      )}

      {value ? (
        <div className={`relative w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group ${aspectClasses}`}>
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-stone-900 text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? 'border-wood-600 bg-wood-50/70'
              : 'border-stone-300 hover:border-wood-400 hover:bg-stone-50/50 bg-white'
          } ${aspectClasses}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <div className="w-8 h-8 rounded-full border-2 border-wood-600 border-t-transparent animate-spin" />
              <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-wood-600 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-stone-600 font-medium">
                Uploading to Storage... {progress}%
              </p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-wood-100 text-wood-700 flex items-center justify-center mb-2 shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-stone-800">
                Click to browse or drag & drop
              </p>
              <p className="text-xs text-stone-500 mt-1">{helpText}</p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};
