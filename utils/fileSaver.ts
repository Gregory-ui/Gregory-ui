import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { blobToDataUrl } from './fileUtils';

// Type definitions to avoid TypeScript errors in environments without the API.
interface CustomFileSystemFileHandle {
  createWritable(): Promise<CustomFileSystemWritableFileStream>;
}
interface CustomFileSystemWritableFileStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

export type SaveMethod = 'native' | 'picker' | 'share' | 'legacy' | 'cancelled';

/**
 * Saves a file by converting it to a data URL and using the native Share sheet.
 * This is for Capacitor native apps (Android/iOS) and avoids filesystem permissions.
 */
const saveFileNative = async (blob: Blob, fileName: string): Promise<void> => {
  try {
    console.log('[NativeSave] Krok 1: Konwersja bloba do data URL...');
    // We need the full data URL, including the mime type and prefix.
    const dataUrl = await blobToDataUrl(blob);
    console.log('[NativeSave] Krok 2: Konwersja pomyślna. Uruchamianie natywnego udostępniania...');
    
    // Use the data URL directly. This avoids filesystem permissions issues on Android.
    await Share.share({
      title: `Zapisz plik: ${fileName}`, // For email subject etc.
      dialogTitle: `Udostępnij: ${fileName}`, // For the chooser dialog title
      text: `Plik: ${fileName}`,
      url: dataUrl,
    });
    console.log('[NativeSave] Krok 3: Natywne udostępnianie zakończone.');

  } catch (error: any) {
    if (error?.message?.includes('Share cancelled') || error?.message?.includes('User cancelled')) {
      console.log('[NativeSave] Udostępnianie anulowane przez użytkownika.');
      throw new DOMException('User cancelled the share dialog.', 'AbortError');
    }
    console.error('[NativeSave] Błąd udostępniania pliku:', error);

    let detailedError = 'Nie udało się udostępnić pliku na urządzeniu mobilnym.';
    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
        detailedError += ` Błąd: ${error.message}`;
    }
    throw new Error(detailedError);
  }
};


/**
 * Triggers a file download using a legacy anchor tag method.
 * This is the ultimate fallback.
 */
const triggerLegacyDownload = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


/**
 * Saves a file by intelligently choosing the best method for the current platform.
 * It returns the method used for saving, or 'cancelled' if the user aborted the action.
 * @param blobProvider - A function that returns a Promise resolving to the Blob to save.
 * @param fileName - The suggested file name for the download.
 * @returns A promise that resolves with the method used for saving.
 */
export const saveFile = async (
  blobProvider: () => Promise<Blob>,
  fileName: string,
): Promise<SaveMethod> => {
  try {
    // --- Priority 2: Modern Desktop Browser ("Save As...") ---
    // This is the only method that requires user interaction *before* data generation.
    // We try it first to avoid unnecessary blob creation.
    if (
      'showSaveFilePicker' in window &&
      window.self === window.top &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ) {
      try {
        const handle: CustomFileSystemFileHandle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          }],
        });
        // If user selected a location, now we generate the blob.
        const blob = await blobProvider();
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return 'picker';
      } catch (err) {
        // If the user cancels, we re-throw to the outer catch block.
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw err;
        }
        // For other errors (like sandbox permission denied), we don't throw;
        // we let it fall through to the other methods.
      }
    }

    // If the picker was unavailable or failed, we now generate the blob once
    // for all remaining fallback methods.
    const blob = await blobProvider();

    // --- Priority 1: Native Mobile App ---
    if (Capacitor.isNativePlatform()) {
      await saveFileNative(blob, fileName);
      return 'native';
    }

    // --- Priority 3: Modern Mobile Browser (Share Sheet) ---
    const file = new File([blob], fileName, { type: blob.type });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: fileName });
        return 'share';
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw err; // Re-throw to the outer catch.
        }
        // Fall through for other errors (e.g., permission denied in sandbox).
      }
    }

    // --- Priority 4: Legacy Fallback Download ---
    triggerLegacyDownload(blob, fileName);
    return 'legacy';

  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.log('Save/Share operation cancelled by user.');
      return 'cancelled';
    }
    // This will catch errors from blobProvider or unhandled save method errors.
    // The caller (App.tsx) should handle displaying the error message.
    console.error("Failed to save file:", err);
    throw err;
  }
};