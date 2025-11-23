import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon, TrashIcon, ZoomInIcon, CameraIcon } from './icons';

interface ImageUploaderProps {
  label: string;
  onImageSelect: (file: File | null) => void;
  onOpenCamera: () => void;
  previewUrl: string | null;
  disabled?: boolean;
  onPreviewClick?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageSelect, onOpenCamera, previewUrl, disabled, onPreviewClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageSelect(file);
    if (event.target) {
        event.target.value = ''; // Reset input to allow re-uploading the same file
    }
  };

  const handleFileClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };
  
  const handleCameraClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the parent div's click handler
    if (!disabled) {
      onOpenCamera();
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(dragging);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [handleDragEvents, onImageSelect, disabled]);
  
  return (
    <div className="flex flex-col h-full">
        <label className="text-xs sm:text-sm font-semibold text-slate-400 mb-2 text-center">{label}</label>
        <div className="flex-1 min-h-[100px] sm:min-h-[120px]">
            {previewUrl ? (
                <div className="w-full h-full relative group">
                    <div
                    onClick={onPreviewClick}
                    role="button"
                    tabIndex={onPreviewClick ? 0 : -1}
                    onKeyDown={(e) => { if (onPreviewClick && (e.key === 'Enter' || e.key === ' ')) onPreviewClick() }}
                    aria-label="Powiększ obraz"
                    className={`w-full h-full rounded-lg overflow-hidden ${onPreviewClick ? 'cursor-pointer' : ''}`}
                    >
                        <img src={previewUrl} alt="Podgląd" className="w-full h-full object-cover bg-slate-900" />
                        
                        {onPreviewClick && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ZoomInIcon className="w-8 h-8 text-white" />
                            <p className="text-white font-semibold mt-1 text-sm">Powiększ</p>
                        </div>
                        )}
                    </div>
                    {!disabled && (
                        <button
                        onClick={(e) => { e.stopPropagation(); onImageSelect(null); }}
                        className="absolute top-1 right-1 z-10 p-1.5 rounded-full bg-red-600/80 text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                        title="Usuń zdjęcie"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ) : (
                <div
                    onDragEnter={(e) => handleDragEvents(e, true)}
                    onDragLeave={(e) => handleDragEvents(e, false)}
                    onDragOver={(e) => handleDragEvents(e, true)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full h-full p-2 border-2 border-dashed rounded-lg transition-colors duration-300
                    ${disabled ? 'border-slate-700 bg-slate-800/50 cursor-not-allowed' : 
                    isDragging ? 'border-amber-500 bg-slate-700/50 cursor-copy' : 
                    'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'}`}
                >
                    <div 
                    onClick={handleFileClick}
                    className="flex flex-col items-center justify-center text-center cursor-pointer p-2 w-full"
                    >
                    <UploadIcon className="w-8 h-8 mb-2 text-slate-500" />
                    <p className="text-sm text-slate-400">
                        <span className="font-semibold text-amber-400">Kliknij</span> lub upuść
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP</p>
                    </div>
                    <div className="w-full px-2">
                    <div className="border-t border-dashed border-slate-600 my-2"></div>
                    </div>
                    <button 
                    onClick={handleCameraClick}
                    disabled={disabled}
                    className="flex items-center justify-center gap-2 text-sm text-amber-400 hover:text-amber-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors w-full p-1"
                    >
                    <CameraIcon className="w-4 h-4" />
                    Użyj aparatu
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={disabled}
                    />
                </div>
            )}
        </div>
    </div>
  );
};