import React, { useEffect, useState } from 'react';
import { InfoIcon, CloseIcon } from './icons';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const inTimer = setTimeout(() => setIsVisible(true), 50);

    // This timer will hide the toast after the specified duration.
    const outTimer = setTimeout(() => {
      // Animate out
      setIsVisible(false);
      // Wait for animation to finish before calling onClose to unmount
      const closeTimer = setTimeout(onClose, 300); 
      return () => clearTimeout(closeTimer);
    }, duration);

    // Cleanup function to clear timeouts if the component unmounts
    // or if the effect re-runs due to a dependency change.
    return () => {
        clearTimeout(inTimer);
        clearTimeout(outTimer);
    }
  }, [message, onClose, duration]); // Added 'message' to the dependency array.

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to finish before unmounting
    const closeTimer = setTimeout(onClose, 300);
    return () => clearTimeout(closeTimer);
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 z-[100] w-full max-w-sm p-4 rounded-lg shadow-2xl bg-slate-700 border border-slate-600 transition-all duration-300 ease-in-out
                 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <InfoIcon className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 text-sm text-slate-200">
          {message}
        </div>
        <div className="flex-shrink-0">
          <button onClick={handleClose} className="p-1 -m-1 rounded-full hover:bg-slate-600 transition-colors" aria-label="Zamknij powiadomienie">
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};