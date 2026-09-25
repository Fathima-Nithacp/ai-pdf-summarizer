import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Bookmark, Copy, Check, MessageSquare } from 'lucide-react';
import { DocumentItem } from '../types';

interface PdfViewerProps {
  document: DocumentItem;
  currentPage: number;
  onPageChange: (page: number) => void;
  onAskAboutPage?: (pageNumber: number, pageText: string) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  document,
  currentPage,
  onPageChange,
  onAskAboutPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);

  const activePageObj = useMemo(() => {
    return (
      document.pages.find((p) => p.pageNumber === currentPage) ||
      document.pages[0] || { pageNumber: 1, text: document.fullText }
    );
  }, [document, currentPage]);

  const searchResultsCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const regex = new RegExp(searchQuery.trim(), 'gi');
    return (document.fullText.match(regex) || []).length;
  }, [document.fullText, searchQuery]);

  const handleCopyPage = () => {
    if (activePageObj) {
      navigator.clipboard.writeText(activePageObj.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const highlightSearchText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5 font-medium">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/70 border-r border-slate-200 rounded-l-2xl overflow-hidden">
      {/* Top Document Header & Toolbar */}
      <div className="p-3 bg-white border-b border-slate-200 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-800 truncate" title={document.name}>
                {document.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {document.pageCount} {document.pageCount === 1 ? 'page' : 'pages'} • {document.size}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-500 w-9 text-center font-medium">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar & Page Nav */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in PDF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
            {searchResultsCount > 0 && (
              <span className="absolute right-2 top-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                {searchResultsCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200 shrink-0">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 rounded text-slate-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium px-1.5 text-slate-700">
              {currentPage} / {document.pageCount}
            </span>
            <button
              disabled={currentPage >= document.pageCount}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 rounded text-slate-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main split: Page list on left + active page content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thumbnails / Page strip */}
        <div className="w-20 sm:w-28 bg-white border-r border-slate-200 overflow-y-auto p-2 space-y-2 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 pb-1 border-b border-slate-100">
            Pages
          </div>
          {document.pages.map((p) => {
            const isActive = p.pageNumber === currentPage;
            return (
              <button
                key={p.pageNumber}
                onClick={() => onPageChange(p.pageNumber)}
                className={`w-full text-left p-1.5 rounded-lg transition-all border ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-700">
                  <span>Page {p.pageNumber}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </div>
                <div className="h-14 bg-slate-50 rounded border border-slate-100 p-1 text-[8px] text-slate-400 overflow-hidden select-none line-clamp-4 leading-tight font-serif">
                  {p.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Page Sheet View */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 transition-transform origin-top"
            style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}
          >
            {/* Page Header inside Document Sheet */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">
                Page {activePageObj.pageNumber} of {document.pageCount}
              </span>
              <div className="flex items-center gap-2">
                {onAskAboutPage && (
                  <button
                    onClick={() => onAskAboutPage(activePageObj.pageNumber, activePageObj.text)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask AI about this page</span>
                  </button>
                )}
                <button
                  onClick={handleCopyPage}
                  className="flex items-center gap-1 px-2 py-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="Copy page text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Rendered Text Content */}
            <div className="text-slate-800 leading-relaxed font-sans whitespace-pre-wrap selection:bg-indigo-100">
              {highlightSearchText(activePageObj.text, searchQuery)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
