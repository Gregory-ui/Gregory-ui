import React, { useState, useEffect, useCallback, useRef } from 'react';

import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { HistorySidebar } from './components/HistorySidebar';
import { ConfirmationModal } from './components/ConfirmationModal';
import { LicenseModal } from './components/LicenseModal';
import { Toast } from './components/Toast';
import { CameraCapture } from './components/CameraCapture';
import { InstallIcon, CloseIcon, ArrowRightIcon, MagnifyingGlassIcon } from './components/icons';
import { fileToDataParts } from './utils/fileUtils';
import { analyzeCoinOrBanknote } from './services/geminiService';
import { AnalysisData } from './types';
import { useApp, useHistory } from './contexts/AppContext';


const MAX_IMAGES = 4;
const uploaderLabels = ['Awers (Przód)', 'Rewers (Tył)', 'Dodatkowe / Detal 1', 'Dodatkowe / Detal 2'];

const useTouchGestures = (imageRef: React.RefObject<HTMLImageElement>) => {
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const gesture = useRef({
        isPanning: false,
        isPinching: false,
        initialDistance: 0,
        initialScale: 1,
        initialPanPoint: { x: 0, y: 0 },
        initialTransform: { x: 0, y: 0 },
    });

    const getDistance = (touches: React.TouchList) => {
        return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    };

    const getMidpoint = (touches: React.TouchList) => {
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2,
        };
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
        const touches = e.touches;
        gesture.current.initialTransform = { x: transform.x, y: transform.y };
        
        if (touches.length === 2) {
            gesture.current.isPinching = true;
            gesture.current.isPanning = false;
            gesture.current.initialDistance = getDistance(touches);
            gesture.current.initialScale = transform.scale;
        } else if (touches.length === 1) {
            gesture.current.isPanning = true;
            gesture.current.isPinching = false;
            gesture.current.initialPanPoint = { x: touches[0].clientX, y: touches[0].clientY };
        }
    };
    
    const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
        e.preventDefault();
        const touches = e.touches;

        if (gesture.current.isPinching && touches.length === 2) {
            const newDistance = getDistance(touches);
            const newScale = gesture.current.initialScale * (newDistance / gesture.current.initialDistance);
            const clampedScale = Math.max(1, Math.min(newScale, 5));

            if (clampedScale === 1) {
                setTransform({ scale: 1, x: 0, y: 0 });
            } else {
                setTransform(prev => ({ ...prev, scale: clampedScale }));
            }
        } else if (gesture.current.isPanning && touches.length === 1 && transform.scale > 1) {
            const dx = touches[0].clientX - gesture.current.initialPanPoint.x;
            const dy = touches[0].clientY - gesture.current.initialPanPoint.y;

            if (imageRef.current) {
                const rect = imageRef.current.getBoundingClientRect();
                
                const overflowX = Math.max(0, (rect.width * transform.scale - rect.width) / 2);
                const overflowY = Math.max(0, (rect.height * transform.scale - rect.height) / 2);

                const newX = Math.max(-overflowX, Math.min(gesture.current.initialTransform.x + dx, overflowX));
                const newY = Math.max(-overflowY, Math.min(gesture.current.initialTransform.y + dy, overflowY));

                setTransform(prev => ({ ...prev, x: newX, y: newY }));
            }
        }
    };
    
    const handleTouchEnd = (e: React.TouchEvent<HTMLImageElement>) => {
        if (e.touches.length > 0) {
            handleTouchStart(e as unknown as React.TouchEvent<HTMLImageElement>);
        } else {
            gesture.current.isPanning = false;
            gesture.current.isPinching = false;
        }
    };

    const resetTransform = useCallback(() => {
        setTransform({ scale: 1, x: 0, y: 0 });
        gesture.current.isPanning = false;
        gesture.current.isPinching = false;
    }, []);

    const handlers = {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
    };
    
    return { transform, handlers, resetTransform };
};


interface ImageLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ imageUrl, onClose }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const { transform, handlers, resetTransform } = useTouchGestures(imageRef);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    useEffect(() => {
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      if (imageUrl) {
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscKey);
        resetTransform();
      } else {
        document.body.style.overflow = 'auto';
      }
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleEscKey);
        if (imageUrl && imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageUrl);
        }
      };
    }, [imageUrl, onClose, resetTransform]);

    if (!imageUrl) {
      return null;
    }
  
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div 
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {isTouchDevice ? (
             <img
                ref={imageRef}
                src={imageUrl} 
                alt="Powiększony podgląd" 
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    touchAction: 'none',
                    transition: transform.scale === 1 ? 'transform 0.2s ease-out' : 'none',
                }}
                {...handlers}
            />
          ) : (
             <div className="relative overflow-auto max-w-full max-h-full rounded-lg">
                <img 
                    src={imageUrl} 
                    alt="Powiększony podgląd" 
                    className="block w-auto h-auto max-w-none rounded-lg" 
                />
            </div>
          )}
        </div>
         <div className="absolute top-4 right-4 z-[51] flex flex-col gap-2">
            <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
                aria-label="Zamknij powiększenie"
            >
                <CloseIcon className="w-6 h-6" />
            </button>
            {isTouchDevice && transform.scale > 1 && (
                 <button
                    onClick={resetTransform}
                    className="p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors text-xs font-bold"
                    aria-label="Resetuj powiększenie"
                >
                    1x
                </button>
            )}
        </div>
      </div>
    );
};

function App() {
  // Global state from contexts
  const { apiKey, toastMessage, setToastMessage, isLicenseModalOpen, setIsLicenseModalOpen, installPrompt, handleInstallClick } = useApp();
  const { history, selectedHistoryId, selectHistoryEntry, addHistoryEntry, clearHistory, exportAllHistory } = useHistory();

  // Local state for the main form/analysis view
  const [images, setImages] = useState<(File | null)[]>(Array(MAX_IMAGES).fill(null));
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>(Array(MAX_IMAGES).fill(null));
  const [analysisType, setAnalysisType] = useState<'moneta' | 'banknot'>('moneta');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisData | null>(null);
  
  // UI state
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [isClearConfirmVisible, setIsClearConfirmVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTargetIndex, setCameraTargetIndex] = useState<number | null>(null);

  // Refs for gesture control
  const mobileSidebarRef = useRef<HTMLDivElement>(null);
  const swipeOpenRef = useRef({
    startX: 0,
    currentX: 0,
    isSwiping: false,
    sidebarInitialStyle: { transform: '', transition: '' }
  });

  const hasImages = images.some(img => img !== null);
  const isViewingHistory = selectedHistoryId !== null;

  const resetState = useCallback((clearSelection = true) => {
    previewUrls.forEach(url => {
        if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
    });

    setImages(Array(MAX_IMAGES).fill(null));
    setPreviewUrls(Array(MAX_IMAGES).fill(null));
    setAdditionalInfo('');
    setResult(null);
    setError(null);
    if(clearSelection) {
        selectHistoryEntry(null);
    }
  }, [previewUrls, selectHistoryEntry]);

  // Sync form with selected history entry
  useEffect(() => {
    if (selectedHistoryId) {
        const entry = history.find(e => e.id === selectedHistoryId);
        if (entry) {
            resetState(false); // Reset form but don't clear selection
            setResult(entry.result);
            setAdditionalInfo(entry.additionalInfo);
            setAnalysisType(entry.analysisType);
            const newPreviewUrls = Array(MAX_IMAGES).fill(null);
            if (entry.imageBlobs) {
                entry.imageBlobs.forEach((blob, i) => {
                    newPreviewUrls[i] = URL.createObjectURL(blob);
                });
            }
            setPreviewUrls(newPreviewUrls);
        }
    }
  }, [selectedHistoryId, history, resetState]);


  const handleOpenCamera = (index: number) => {
    setError(null);
    setCameraTargetIndex(index);
    setIsCameraOpen(true);
  };

  const handleImageSelect = useCallback((file: File | null, index: number) => {
    setImages(currentImages => {
        const newImages = [...currentImages];
        newImages[index] = file;
        return newImages;
    });
    setPreviewUrls(currentUrls => {
        const newUrls = [...currentUrls];
        if (currentUrls[index] && currentUrls[index]?.startsWith('blob:')) {
            URL.revokeObjectURL(currentUrls[index]!);
        }
        newUrls[index] = file ? URL.createObjectURL(file) : null;
        return newUrls;
    });
    if (file) {
      selectHistoryEntry(null);
    }
  }, [selectHistoryEntry]);

  const handleSubmit = async () => {
    const validImages = images.filter((img): img is File => img !== null);
    if (validImages.length === 0) {
      setError("Proszę dodać przynajmniej jedno zdjęcie do analizy.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    selectHistoryEntry(null);

    try {
      const imagePartsPromises = validImages.map(file => fileToDataParts(file));
      const imageData = await Promise.all(imagePartsPromises);
      const imageParts = imageData.map(d => ({
        inlineData: { mimeType: d.mimeType, data: d.base64 },
      }));

      const analysisResult = await analyzeCoinOrBanknote(imageParts, additionalInfo, analysisType, apiKey);
      
      setResult(analysisResult);
      
      await addHistoryEntry({
        result: analysisResult,
        fileNames: validImages.map(f => f.name),
        additionalInfo,
        imageBlobs: validImages,
        analysisType,
      });

    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Wystąpił nieznany błąd.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewClick = (index: number) => {
    let fullImageUrl: string | null = null;
    if (isViewingHistory) {
        const entry = history.find(e => e.id === selectedHistoryId);
        const blob = entry?.imageBlobs?.[index];
        if (blob) {
            fullImageUrl = URL.createObjectURL(blob);
        }
    } else {
        fullImageUrl = previewUrls[index];
    }
    if (fullImageUrl) {
        setLightboxImageUrl(fullImageUrl);
    }
  };

  const handleMainTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (e.targetTouches[0].clientX < 120 && !isSidebarOpen && mobileSidebarRef.current) {
        swipeOpenRef.current.isSwiping = true;
        swipeOpenRef.current.startX = e.targetTouches[0].clientX;
        swipeOpenRef.current.currentX = e.targetTouches[0].clientX;
        swipeOpenRef.current.sidebarInitialStyle.transition = mobileSidebarRef.current.style.transition;
    }
  };
  
  const handleMainTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!swipeOpenRef.current.isSwiping || !mobileSidebarRef.current) return;

    swipeOpenRef.current.currentX = e.targetTouches[0].clientX;
    const deltaX = swipeOpenRef.current.currentX - swipeOpenRef.current.startX;
    
    if (deltaX > 0) {
        e.preventDefault();
        const sidebarWidth = mobileSidebarRef.current.offsetWidth;
        const newTranslateX = Math.min(0, -sidebarWidth + deltaX);
        mobileSidebarRef.current.style.transform = `translateX(${newTranslateX}px)`;
        mobileSidebarRef.current.style.transition = 'none';
    }
  };

  const handleMainTouchEnd = () => {
    if (!swipeOpenRef.current.isSwiping || !mobileSidebarRef.current) return;

    const deltaX = swipeOpenRef.current.currentX - swipeOpenRef.current.startX;
    const sidebarWidth = mobileSidebarRef.current.offsetWidth;
    
    mobileSidebarRef.current.style.transition = swipeOpenRef.current.sidebarInitialStyle.transition || 'transform 0.3s ease-in-out';
    mobileSidebarRef.current.style.transform = '';
    
    if (deltaX > sidebarWidth / 3) {
      setIsSidebarOpen(true);
    }
    
    swipeOpenRef.current.isSwiping = false;
  };
  
  const handleCameraClose = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  const handleCameraCapture = useCallback((file: File) => {
    if (cameraTargetIndex !== null) {
        handleImageSelect(file, cameraTargetIndex);
    }
    setIsCameraOpen(false);
  }, [cameraTargetIndex, handleImageSelect]);


  return (
    <div className="md:flex h-screen bg-slate-900 text-slate-200 font-sans">
      {/* Mobile Sidebar (Drawer) */}
      <div 
        ref={mobileSidebarRef}
        className={`fixed inset-y-0 left-0 z-40 transform ${isSidebarOpen ? 'translateX(0)' : '-translate-x-full'} 
                   transition-transform duration-300 ease-in-out md:hidden`}
      >
        <HistorySidebar onClose={() => setIsSidebarOpen(false)} onOpenLicenseInfo={() => setIsLicenseModalOpen(true)} />
      </div>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block md:flex-shrink-0">
        <HistorySidebar onClose={() => {}} onOpenLicenseInfo={() => setIsLicenseModalOpen(true)} />
      </div>
        
        <main 
          className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto"
          onTouchStart={handleMainTouchStart}
          onTouchMove={handleMainTouchMove}
          onTouchEnd={handleMainTouchEnd}
        >
            <div className="max-w-4xl mx-auto w-full">
                {/* Header */}
                <header className="flex-shrink-0 flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setIsSidebarOpen(true)} className="p-2 md:hidden" aria-label="Otwórz historię">
                        <ArrowRightIcon className="w-6 h-6" />
                      </button>
                      <MagnifyingGlassIcon className="w-14 h-14" />
                      <div>
                          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
                              <span className="text-amber-400">NumiScan</span>AI
                          </h1>
                          <p className="text-xs sm:text-sm text-slate-400">Twój numizmatyczny i notafilistyczny asystent AI</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {installPrompt && (
                           <button 
                                onClick={handleInstallClick}
                                className="text-sm py-2 px-3 sm:px-4 bg-amber-500/80 hover:bg-amber-500 text-slate-900 font-semibold rounded-md transition-colors flex items-center gap-2"
                                title="Zainstaluj aplikację"
                           >
                               <InstallIcon className="w-4 h-4 hidden sm:block" />
                               <span>Zainstaluj</span>
                           </button>
                        )}
                        <button 
                            onClick={() => resetState(true)}
                            className="text-sm py-2 px-3 sm:px-4 bg-slate-700/70 hover:bg-slate-700 rounded-md transition-colors"
                        >
                            Nowa Analiza
                        </button>
                    </div>
                </header>

                {/* Control Panel */}
                <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg border border-slate-700/80">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {Array.from({ length: MAX_IMAGES }).map((_, index) => (
                            <ImageUploader 
                                key={index}
                                label={uploaderLabels[index]}
                                onImageSelect={(file) => handleImageSelect(file, index)}
                                onOpenCamera={() => handleOpenCamera(index)}
                                previewUrl={previewUrls[index]}
                                disabled={isLoading}
                                onPreviewClick={previewUrls[index] ? () => handlePreviewClick(index) : undefined}
                            />
                        ))}
                    </div>

                    {isViewingHistory && !hasImages && <p className="text-xs text-center mb-4 -mt-2 text-slate-500">Przeglądasz analizę z historii. Kliknij "Nowa Analiza", aby dodać nowe zdjęcia.</p>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 flex gap-1 bg-slate-900 p-1 rounded-md">
                            {(['moneta', 'banknot'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setAnalysisType(type)}
                                disabled={isLoading || isViewingHistory}
                                className={`w-full py-2 rounded text-sm font-semibold transition-colors ${
                                    analysisType === type ? 'bg-amber-400 text-slate-900' : 'bg-transparent text-slate-300 hover:bg-slate-700/50'
                                }`}
                            >
                                <span className="capitalize">{type}</span>
                            </button>
                            ))}
                        </div>
                        
                        <div className="md:col-span-2">
                            <button 
                                onClick={handleSubmit} 
                                disabled={isLoading || !hasImages || isViewingHistory}
                                className="w-full h-full py-2 px-6 font-semibold text-slate-900 bg-amber-400 rounded-md hover:bg-amber-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Analizowanie...' : 'Uruchom Analizę'}
                            </button>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="additionalInfo" className="block text-xs font-medium text-slate-300 mb-2 mt-2">
                                Dodatkowe informacje (opcjonalnie) / Additional information (optional)
                            </label>
                            <textarea
                                id="additionalInfo"
                                rows={4}
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                disabled={isLoading || isViewingHistory}
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-[11px] focus:ring-amber-500 focus:border-amber-500"
                                placeholder={`PL: Wskaż interesujące Cię obszary (np. błędy, uszkodzenia). Dodaj powiększenia detali, aby poprawić analizę.\nEN: Point out areas of interest (e.g., errors, damage). Add close-ups of details to improve the analysis.\nES: Señala áreas de interés (p. ej., errores, daños). Agrega primeros planos de detalles para mejorar el análisis.`}
                            />
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                PL: Możesz poprosić o analizę w innym języku (np. "proszę o analizę po angielsku").<br />
                                EN: You can request analysis in another language (e.g., "please analyze in English").<br />
                                ES: Puedes pedir el análisis en otro idioma (p. ej., "analizar en español").
                            </p>
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                 <div className="mt-6">
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md text-sm mb-6" role="alert">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold mb-1">Wystąpił błąd</p>
                                    <p>{error}</p>
                                </div>
                                <button onClick={() => setError(null)} className="p-1 -mt-1 -mr-1 text-red-300 hover:text-red-100" aria-label="Zamknij">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                        </div>
                    )}
                    {(result || isLoading) && (
                        <div className="bg-slate-800/50 rounded-lg border border-slate-700/80 p-6 min-h-[200px]">
                            <AnalysisResult result={result} isLoading={isLoading} />
                        </div>
                    )}
                 </div>
            </div>
        </main>
        
        {isCameraOpen && cameraTargetIndex !== null && (
            <CameraCapture
                onClose={handleCameraClose}
                onCapture={handleCameraCapture}
            />
        )}
        
        <ImageLightbox imageUrl={lightboxImageUrl} onClose={() => setLightboxImageUrl(null)} />
        <ConfirmationModal
            isOpen={isClearConfirmVisible}
            onClose={() => setIsClearConfirmVisible(false)}
            onConfirm={() => {
                clearHistory();
                resetState();
                setIsClearConfirmVisible(false);
            }}
            onExport={() => {
                exportAllHistory();
                setIsClearConfirmVisible(false);
            }}
        />
        <LicenseModal 
            isOpen={isLicenseModalOpen}
            onClose={() => setIsLicenseModalOpen(false)}
        />
        {toastMessage && (
            <Toast 
            message={toastMessage} 
            onClose={() => setToastMessage(null)} 
            />
        )}
    </div>
  );
}

export default App;
