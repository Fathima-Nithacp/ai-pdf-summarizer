import React, { useRef, useState } from 'react';
import { FileText, Upload, Sparkles, Check, ArrowRight, BookOpen, Layers, HelpCircle, GraduationCap } from 'lucide-react';
import { DocumentItem } from '../types';

interface HomeViewProps {
  onOpenUploadModal: () => void;
  onSelectSampleDoc: (doc: DocumentItem) => void;
  sampleDocs: DocumentItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenUploadModal,
  onSelectSampleDoc,
  sampleDocs,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Center Hero and Upload Box */}
      <div className="max-w-3xl mx-auto w-full text-center space-y-8 my-auto">
        {/* Hero Headings */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Study & Revision Workspace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Turn PDFs into <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">simple notes</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-normal">
            Upload your PDF and let AI summarize it, generate active recall flashcards, draft exam questions, and answer your questions instantly.
          </p>
        </div>

        {/* Drag & Drop Upload Card matching User ASCII Mockup */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            onOpenUploadModal();
          }}
          onClick={onOpenUploadModal}
          className={`cursor-pointer max-w-lg mx-auto bg-white rounded-3xl border-2 border-dashed p-10 sm:p-12 transition-all duration-200 shadow-sm hover:shadow-md group ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/40 scale-[0.99]'
              : 'border-slate-300/90 hover:border-indigo-400 bg-white'
          }`}
        >
          {/* File Icon */}
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-200">
            <FileText className="w-10 h-10" />
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Drag & Drop PDF
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Supports textbook chapters, lecture notes, or research papers
          </p>

          <div className="flex items-center gap-3 w-40 mx-auto my-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              OR
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenUploadModal();
            }}
            className="mt-3 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
          >
            Upload PDF
          </button>
        </div>

        {/* Feature Checkmarks (as shown in user ASCII diagram) */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 pt-2">
          <div className="flex items-center gap-1.5 text-indigo-950">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</span>
            <span>Summaries</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-950">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</span>
            <span>Key Points</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-950">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</span>
            <span>Q&A Chat</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-950">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</span>
            <span>Flashcards</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-950">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</span>
            <span>Exam Prep</span>
          </div>
        </div>

        {/* One-click Sample Explore Section */}
        {sampleDocs.length > 0 && (
          <div className="pt-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Or explore pre-analyzed sample study materials:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {sampleDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onSelectSampleDoc(doc)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-medium shadow-xs transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{doc.name}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <footer className="text-center text-xs text-slate-400 pt-10">
        PDF.AI • Built for students, engineers, and researchers
      </footer>
    </div>
  );
};
