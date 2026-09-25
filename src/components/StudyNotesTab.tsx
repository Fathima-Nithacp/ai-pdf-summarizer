import React, { useState } from 'react';
import { FileText, Copy, Check, Printer, Download, Sparkles, BookOpen } from 'lucide-react';
import { DocumentItem } from '../types';

interface StudyNotesTabProps {
  document: DocumentItem;
}

export const StudyNotesTab: React.FC<StudyNotesTabProps> = ({ document }) => {
  const [copied, setCopied] = useState(false);
  const summary = document.summary;

  const handleCopy = () => {
    const markdown = `# Study Revision Notes: ${document.name}

## 1. Document Overview
${summary?.executiveSummary || ''}

## 2. Key Takeaways
${summary?.keyTakeaways.map((t) => `- ${t}`).join('\n') || ''}

## 3. Core Concept Definitions
${summary?.keyConcepts.map((c, i) => `### ${i + 1}. ${c.title}\n${c.explanation}\n*Exam Context: ${c.relevance || 'Core concept'}*`).join('\n\n') || ''}

## 4. In-depth Conceptual Breakdown
${summary?.detailedSummary || ''}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Comprehensive Study Notes</h3>
            <p className="text-xs text-slate-400">
              Formatted cheat-sheet ready for exam revision & quick reading
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Notes</span>
          </button>
        </div>
      </div>

      {/* Styled Printable / Readable Sheet */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl mx-auto w-full">
        {/* Title Banner */}
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
            Exam Revision Cheat-Sheet
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2">
            {document.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generated on {document.uploadDate} • {document.pageCount} Pages Analyzed
          </p>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            1. Core Overview
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-3.5 border-l-2 border-slate-100">
            {summary?.executiveSummary}
          </p>
        </section>

        {/* Section 2: Key Takeaways */}
        {summary?.keyTakeaways && (
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              2. Key Takeaways Checklist
            </h3>
            <div className="pl-3.5 border-l-2 border-slate-100 space-y-1.5">
              {summary.keyTakeaways.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="text-teal-600 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Key Concepts */}
        {summary?.keyConcepts && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              3. Definitions & Core Principles
            </h3>
            <div className="grid gap-2.5 sm:grid-cols-2 pl-3.5 border-l-2 border-slate-100">
              {summary.keyConcepts.map((concept, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <h4 className="text-xs font-bold text-slate-900">{concept.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{concept.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Detailed Breakdown */}
        {summary?.detailedSummary && (
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              4. In-Depth Syllabus Walkthrough
            </h3>
            <div className="pl-3.5 border-l-2 border-slate-100 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {summary.detailedSummary}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
