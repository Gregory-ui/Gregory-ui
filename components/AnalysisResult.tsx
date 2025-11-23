import React from 'react';
import { LoaderIcon, YouTubeIcon } from './icons';
import { AnalysisData } from '../types';

declare global {
    interface Window {
        marked: any;
    }
}

interface AnalysisResultProps {
  result: AnalysisData | null;
  isLoading: boolean;
}

const MarkdownRenderer: React.FC<{ content: string | undefined }> = ({ content }) => {
    if (!content) return null;
    try {
        const html = window.marked ? window.marked.parse(content) : `<pre>${content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    } catch(e) {
        console.error("Markdown parsing error", e);
        return <pre>{content}</pre>;
    }
};

const DisclaimerFooter: React.FC = () => (
    <footer className="mt-8 pt-6 border-t border-slate-700 text-[11px] text-slate-500">
        <div className="space-y-2">
            <p>
                <strong>Wycena ma charakter orientacyjny i opiera się wyłącznie na analizie zdjęć.</strong> Nie stanowi ekspertyzy numizmatycznej. Ostateczna wartość monety może zostać potwierdzona wyłącznie przez wykwalifikowanego specjalistę podczas fizycznej oceny. Nie ponosimy odpowiedzialności za skutki wykorzystania niniejszej analizy. Korzystasz z niej na własną odpowiedzialność.
            </p>
            <p>
                <em>
                    <strong>The valuation provided is indicative and based solely on image analysis.</strong> It does not constitute a professional numismatic appraisal. Final value can only be confirmed through an in-person expert evaluation. We accept no liability for any consequences resulting from the use of this analysis. You use it at your own risk.
                </em>
            </p>
        </div>
        <div className="mt-4 text-center">
            <a 
                href="https://www.youtube.com/@SklepBibeloty" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-white transition-colors"
                title="Odwiedź kanał YouTube Sklep Bibeloty"
            >
                <YouTubeIcon className="w-5 h-5" />
                <span>Powered | Coin Collections @SklepBibeloty| NumiScanAI | {new Date().getFullYear()}</span>
            </a>
        </div>
    </footer>
);

const analysisSectionsData = (result: AnalysisData) => [
    { title: "1. Identyfikacja", content: result.identification },
    { title: "2. Ocena Stanu Zachowania", content: result.condition },
    { title: "3. Wykrywanie Błędów i Wariantów", content: result.errors },
    { title: "4. Wycena", content: result.valuation },
    { title: "5. Podsumowanie i Wskazówki", content: result.summary },
];

const normalizeUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        // Normalize by removing protocol, www, and trailing slash
        // Keep search and hash as they might be relevant for uniqueness
        const pathname = urlObj.pathname.endsWith('/') ? urlObj.pathname.slice(0, -1) : urlObj.pathname;
        return `${urlObj.hostname.replace(/^www\./, '')}${pathname}${urlObj.search}${urlObj.hash}`;
    } catch {
        // For malformed URLs, just return the original string for comparison
        return url.trim();
    }
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <LoaderIcon className="w-12 h-12 animate-spin text-amber-500" />
        <p className="mt-4 text-lg">AI analizuje i przeszukuje internet...</p>
        <p className="text-sm">To może zająć chwilę.</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-center text-slate-500">
        <p>Wyniki analizy pojawią się tutaj po przesłaniu i przeanalizowaniu zdjęcia.</p>
      </div>
    );
  }

  const allChunks = result.groundingChunks?.filter(chunk => chunk.web && chunk.web.uri && chunk.web.title) || [];
  
  const sections = analysisSectionsData(result);

  // Deduplicate all source links using normalization
  const uniqueNormalizedUris = new Set<string>();
  const uniqueChunks = allChunks.filter(chunk => {
      const normalizedUri = normalizeUrl(chunk.web.uri);
      if (uniqueNormalizedUris.has(normalizedUri)) {
          return false;
      }
      uniqueNormalizedUris.add(normalizedUri);
      return true;
  });

  const finalChunks = uniqueChunks;

  return (
    <>
      <h2 className="text-lg sm:text-xl font-bold text-amber-400 mb-6">{result.title}</h2>
      <div 
        className="prose prose-sm prose-invert prose-slate max-w-none text-xs
                  prose-h3:text-sm
                  prose-strong:text-slate-100 
                  prose-a:text-amber-400 hover:prose-a:text-amber-300
                  prose-blockquote:border-l-amber-500 prose-blockquote:text-slate-400
                  prose-li:marker:text-amber-500"
      >
        {result.introduction && (
            <div className="mb-8 pb-6 border-b border-slate-700">
                <MarkdownRenderer content={result.introduction} />
            </div>
        )}

        {sections.map(section => (
            section.content && (
                <div key={section.title} className="mb-6">
                    <h3 className="!mb-3 text-amber-400 font-bold">{section.title}</h3>
                    <MarkdownRenderer content={section.content} />
                </div>
            )
        ))}

        {finalChunks.length > 0 && (
            <div className="mt-8 pt-5 border-t border-slate-700">
                <h3 className="text-base font-semibold text-slate-100 mb-3">Źródła internetowe</h3>
                <ul className="space-y-2 !p-0">
                    {finalChunks.map((chunk, index) => (
                        <li key={chunk.web.uri + index} className="!m-0 bg-slate-900/70 p-2.5 rounded-lg hover:bg-slate-700/50 transition-colors">
                            <a 
                                href={chunk.web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 group no-underline"
                            >
                                <span className="flex-shrink-0 h-5 w-5 bg-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <span className="text-amber-400 group-hover:text-amber-300 group-hover:underline text-xs font-medium truncate" title={chunk.web.title}>
                                  {chunk.web.title}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
      <DisclaimerFooter />
    </>
  );
};