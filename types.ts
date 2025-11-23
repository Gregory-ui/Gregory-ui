export interface AnalysisData {
  title: string;
  introduction?: string;
  identification: string;
  condition: string;
  errors: string;
  valuation: string;
  summary: string;
  groundingChunks?: any[];
}

export interface HistoryEntry {
  id: string;
  result: AnalysisData;
  timestamp: number;
  fileNames: string[];
  additionalInfo: string;
  imageDataUrls: string[]; // Thumbnails (base64 data URLs) for UI display
  imageBlobs?: Blob[]; // Full-size images stored efficiently as Blobs
  // Deprecated, will be migrated to imageBlobs on load
  originalImageDataUrls?: string[]; 
  analysisType: 'moneta' | 'banknot';
}