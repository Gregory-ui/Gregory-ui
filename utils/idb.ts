import { HistoryEntry } from '../types';

const DB_NAME = 'NumiscanHistoryDB';
const DB_VERSION = 1;
const STORE_NAME = 'analysisHistory';
const KEY = 'userHistory';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error("Nie udało się otworzyć bazy danych IndexedDB."));
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveHistoryToDB(history: HistoryEntry[]): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(history, KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(new Error("Nie udało się zapisać historii do bazy danych."));
  });
}

export async function loadHistoryFromDB(): Promise<HistoryEntry[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(KEY);
    request.onsuccess = () => {
        // Zwróć pustą tablicę, jeśli w bazie nie ma jeszcze historii
        resolve(request.result || []); 
    };
    request.onerror = () => reject(new Error("Nie udało się załadować historii z bazy danych."));
  });
}

export async function clearHistoryDB(): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    // Użyj `clear()`, aby usunąć wszystkie wpisy ze sklepu
    const request = store.clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(new Error("Nie udało się wyczyścić historii w bazie danych."));
  });
}
