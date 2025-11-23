import React, { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onExport: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, onExport }) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div
        className="relative bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirmation-modal-title" className="text-xl font-bold text-amber-400">
          Wyczyścić historię?
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Ta operacja trwale usunie całą historię analiz. Przed kontynuacją zalecamy wykonanie kopii zapasowej.
        </p>

        <div className="mt-6 space-y-3">
            <button
              onClick={onExport}
              className="w-full py-2 px-4 bg-amber-500/80 hover:bg-amber-500 text-slate-900 font-semibold rounded-md transition-colors"
            >
              Eksportuj i Zapisz Kopię
            </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md transition-colors"
          >
            Tak, wyczyść historię
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-slate-700/70 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

