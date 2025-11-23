import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { App } from '@capacitor/app';
import { CloseIcon, LoaderIcon } from './icons';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const openCameraWithPermissions = async () => {
      // This check is crucial for Capacitor apps
      if (!Capacitor.isPluginAvailable('Camera')) {
        setError('Funkcjonalność aparatu nie jest dostępna w tym środowisku.');
        setIsLoading(false);
        return;
      }

      try {
        // 1. Check current permission status
        let permissions = await Camera.checkPermissions();

        // 2. If permission is not determined, request it
        if (permissions.camera === 'prompt' || permissions.camera === 'prompt-with-rationale') {
          permissions = await Camera.requestPermissions();
        }

        // 3. If permission is not granted, show an error and guide the user
        if (permissions.camera !== 'granted') {
          setError('Odmówiono dostępu do kamery. Zezwól na dostęp w ustawieniach aplikacji, aby kontynuować.');
          setIsLoading(false);
          return;
        }

        // 4. Permission is granted, open the native camera
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
        });

        // 5. Process the captured image
        if (image.webPath) {
          const response = await fetch(image.webPath);
          const blob = await response.blob();
          const fileName = `capture-${new Date().toISOString()}.jpg`;
          const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
          onCapture(file);
        } else {
          // This case handles when the user backs out of the camera without taking a picture
          onClose();
        }
      } catch (err) {
        // This catch block handles user cancellation and other unexpected errors
        console.log('Camera operation cancelled or failed:', err);
        onClose();
      }
    };

    openCameraWithPermissions();
    // This effect should only run once when the component mounts to open the camera.
    // By using an empty dependency array [], we prevent this effect from re-running
    // if the parent component re-renders. Re-triggering the camera plugin can cause
    // it to close unexpectedly on Android. Callbacks are wrapped in useCallback
    // in the parent, but this provides an extra layer of stability.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenSettings = async () => {
    try {
      // This native-only feature opens the app's settings page on the device
      await (App as any).openAppSettings();
    } catch (e) {
      console.error("Failed to open app settings", e);
      setError("Nie można automatycznie otworzyć ustawień. Zmień uprawnienia ręcznie w ustawieniach systemowych swojego urządzenia.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full h-full max-w-4xl max-h-full flex flex-col items-center justify-center">
        {(isLoading || error) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20 p-8">
            {isLoading ? (
              <>
                <LoaderIcon className="w-12 h-12 text-amber-500 animate-spin" />
                <p className="mt-4">Inicjalizacja aparatu...</p>
              </>
            ) : (
              <div className="bg-red-900/80 p-6 sm:p-8 rounded-lg max-w-sm">
                <p className="font-semibold text-lg mb-2">Błąd Dostępu do Kamery</p>
                <p className="text-sm">{error}</p>
                {Capacitor.isNativePlatform() && (
                  <button
                    onClick={handleOpenSettings}
                    className="mt-6 py-2 px-6 bg-amber-500/80 hover:bg-amber-500 text-slate-900 font-semibold rounded-md transition-colors"
                  >
                    Otwórz Ustawienia Aplikacji
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
            aria-label="Zamknij"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
