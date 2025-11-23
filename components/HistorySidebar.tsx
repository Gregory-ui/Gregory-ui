import React, { useState, useRef } from 'react';
import { HistoryEntry } from '../types';
import { useApp, useHistory } from '../contexts/AppContext';
import { 
    CollectionBookIcon,
    DownloadIcon, 
    ImportIcon, 
    TrashIcon, 
    LoaderIcon,
    CloseIcon,
    InfoIcon,
    KeyIcon,
    EyeIcon,
} from './icons';

interface HistorySidebarProps {
    onClose: () => void;
    onOpenLicenseInfo: () => void;
}

const HistoryItem: React.FC<{
    entry: HistoryEntry;
    isSelected: boolean;
}> = ({ entry, isSelected }) => {
    const { selectHistoryEntry, deleteHistoryEntry, exportHistoryEntry } = useHistory();
    
    const identificationText = entry.result.title || entry.result.identification?.split('\n')[0]?.replace(/\*\*/g, '') || 'Analiza bez tytułu';
    const date = new Date(entry.timestamp).toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const handleLiClick = (e: React.MouseEvent<HTMLLIElement>) => {
        // Jeśli kliknięcie nastąpiło na przycisku (lub wewnątrz niego), nie rób nic.
        // Pozwól, aby własny handler onClick przycisku wykonał swoje zadanie.
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        selectHistoryEntry(entry.id);
    };

    return (
        <li
            onClick={handleLiClick}
            className={`group relative flex items-center p-2.5 rounded-md transition-colors cursor-pointer ${
                isSelected ? 'bg-amber-500/20' : 'hover:bg-slate-700/60'
            }`}
        >
            <div className="flex-shrink-0 w-16 h-12 bg-slate-900 rounded overflow-hidden mr-3 flex items-center justify-center">
                {entry.imageDataUrls[0] ? (
                    <img src={entry.imageDataUrls[0]} alt="Miniatura" className="w-full h-full object-contain" />
                ) : (
                    <span className="text-slate-500 text-xs">Brak<br/>foto</span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate" title={identificationText}>
                    {identificationText}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{date}</p>
            </div>
            
            <div className={`
                flex items-center gap-1 ml-2
                md:absolute md:top-1/2 md:-translate-y-1/2 md:right-2.5 md:ml-0 md:gap-0.5
                md:opacity-0 md:group-hover:opacity-100 md:transition-opacity
            `}>
                 <button 
                    onClick={() => exportHistoryEntry(entry.id)}
                    title="Eksportuj wpis"
                    aria-label="Eksportuj wpis"
                    className="p-2.5 md:p-1.5 rounded-full text-slate-300 bg-slate-700/60 md:bg-slate-800/90 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <ImportIcon className="w-5 h-5 md:w-4 md:h-4" />
                </button>
                <button 
                    onClick={() => deleteHistoryEntry(entry.id)}
                    title="Usuń wpis"
                    aria-label="Usuń wpis"
                    className="p-2.5 md:p-1.5 rounded-full text-slate-300 bg-slate-700/60 md:bg-slate-800/90 hover:bg-red-500 md:hover:bg-red-600 hover:text-white transition-colors"
                >
                    <TrashIcon className="w-5 h-5 md:w-4 md:h-4" />
                </button>
            </div>
        </li>
    );
};

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ onClose, onOpenLicenseInfo }) => {
    const { apiKey, setApiKey } = useApp();
    const { 
        history, 
        selectedHistoryId, 
        isLoadingHistory,
        clearHistory,
        exportAllHistory,
        importHistory
    } = useHistory();

    const [isKeyVisible, setIsKeyVisible] = useState(false);
    const sidebarRef = useRef<HTMLElement>(null);
    const importFileRef = useRef<HTMLInputElement>(null);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleImportClick = () => {
        importFileRef.current?.click();
    };
  
    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            importHistory(file);
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (window.innerWidth >= 768) return;
        setTouchStartX(e.targetTouches[0].clientX);
        setTouchCurrentX(e.targetTouches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || touchStartX === null) return;
        setTouchCurrentX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!isDragging || touchStartX === null || touchCurrentX === null) return;
        const deltaX = touchCurrentX - touchStartX;
        const sidebarWidth = sidebarRef.current?.offsetWidth || window.innerWidth;
        if (deltaX < -(sidebarWidth * 0.3)) {
            onClose();
        }
        setIsDragging(false);
        setTouchStartX(null);
        setTouchCurrentX(null);
    };
    
    const getTransformStyle = () => {
        if (!isDragging || touchStartX === null || touchCurrentX === null) {
            return {};
        }
        const deltaX = touchCurrentX - touchStartX;
        if (deltaX < 0) {
            return {
                transform: `translateX(${deltaX}px)`,
                transition: 'none',
            };
        }
        return {};
    };

    return (
        <aside 
            ref={sidebarRef}
            className="w-screen md:w-80 bg-slate-800/70 backdrop-blur-sm border-r border-slate-700/80 flex flex-col h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={getTransformStyle()}
        >
             <input 
                type="file"
                ref={importFileRef}
                className="hidden"
                accept="application/json"
                onChange={handleFileImport}
            />

            <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-700/80">
                <div className="flex items-center gap-3">
                    <CollectionBookIcon className="w-6 h-6" />
                    <h2 className="text-lg font-bold text-amber-400">Historia Analiz</h2>
                </div>
                 <button 
                    onClick={onClose} 
                    className="p-1.5 md:hidden rounded-full bg-slate-700/80 hover:bg-red-700 text-slate-200 hover:text-white transition-colors" 
                    aria-label="Zamknij historię"
                 >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-2">
                {isLoadingHistory ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <LoaderIcon className="w-8 h-8 animate-spin text-amber-500" />
                        <p className="mt-3 text-sm">Ładowanie historii...</p>
                    </div>
                ) : history.length > 0 ? (
                    <ul className="space-y-1.5">
                        {history.map(entry => (
                            <HistoryItem 
                                key={entry.id}
                                entry={entry}
                                isSelected={selectedHistoryId === entry.id}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 px-4">
                        <p className="text-sm">Twoja historia analiz jest pusta.</p>
                        <p className="text-xs mt-1">Wyniki pojawią się tutaj po przeprowadzeniu pierwszej analizy.</p>
                    </div>
                )}
            </div>

            <footer className="flex-shrink-0 p-4 border-t border-slate-700/80 bg-slate-900/50">
                 <div className="mb-4">
                    <label htmlFor="api-key-input" className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <KeyIcon className="w-5 h-5 text-amber-400" />
                        <span>Klucz API Gemini</span>
                    </label>
                    <div className="relative">
                        <input
                            id="api-key-input"
                            type={isKeyVisible ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 pr-10 text-sm focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Wklej swój klucz API..."
                        />
                        <button
                            onClick={() => setIsKeyVisible(!isKeyVisible)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200"
                            title={isKeyVisible ? 'Ukryj klucz' : 'Pokaż klucz'}
                        >
                            <EyeIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Twój klucz jest zapisywany tylko w Twojej przeglądarce.
                    </p>
                </div>
            
                <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleImportClick}
                            disabled={isLoadingHistory}
                            className="flex items-center justify-center gap-2 py-2 px-3 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            <span>Importuj</span>
                        </button>
                        <button
                            onClick={exportAllHistory}
                            disabled={isLoadingHistory || history.length === 0}
                            className="flex items-center justify-center gap-2 py-2 px-3 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ImportIcon className="w-4 h-4" />
                            <span>Eksportuj</span>
                        </button>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold bg-red-800/70 hover:bg-red-800 text-red-200 rounded-md transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" />
                            <span>Wyczyść całą historię</span>
                        </button>
                    )}
                </div>
                
                <div className="text-center mt-4">
                    <button
                        onClick={onOpenLicenseInfo}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors underline"
                    >
                        <InfoIcon className="w-4 h-4" />
                        <span>Informacje o licencji i oprogramowaniu</span>
                    </button>
                </div>
            </footer>
        </aside>
    );
};