import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Sparkles, BookOpen, ArrowRight, ListChecks } from 'lucide-react';
import { DocumentItem } from '../types';

interface KeyPointsTabProps {
  document: DocumentItem;
  onGoToExam: () => void;
  onGoToFlashcards: () => void;
}

export const KeyPointsTab: React.FC<KeyPointsTabProps> = ({
  document,
  onGoToExam,
  onGoToFlashcards,
}) => {
  const [copied, setCopied] = useState(false);
  const summary = document.summary;

  const keyTakeaways = summary?.keyTakeaways || [
    'Comprehensive conceptual coverage of core topics.',
    'Systematic breakdown of architecture and memory layout.',
    'Clear delineation of algorithms and operational trade-offs.',
  ];

  const handleCopy = () => {
    const text = keyTakeaways.map((item, i) => `${i + 1}. ${item}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-indigo-600" />
            Essential Key Takeaways
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            The core ideas, formulas, and definitions you must remember from this document.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy All'}</span>
        </button>
      </div>

      {/* Takeaway Cards list */}
      <div className="space-y-3">
        {keyTakeaways.map((point, index) => (
          <div
            key={index}
            className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-xs transition-all"
          >
            <div className="mt-0.5 w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/50">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {point}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Key Concepts Grid */}
      {summary?.keyConcepts && summary.keyConcepts.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Core Concept Highlights
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {summary.keyConcepts.map((concept, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:bg-white hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <h5 className="text-xs font-bold text-slate-900">{concept.title}</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {concept.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive study bridge */}
      <div className="pt-4 border-t border-slate-200 grid sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
          <div>
            <h5 className="text-xs font-bold text-indigo-900">Active Recall Flashcards</h5>
            <p className="text-[11px] text-indigo-700/80 mt-1">
              Test your memory on these key points with flip cards.
            </p>
          </div>
          <button
            onClick={onGoToFlashcards}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>Review Flashcards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-100 flex flex-col justify-between">
          <div>
            <h5 className="text-xs font-bold text-violet-900">Exam Question Generator</h5>
            <p className="text-[11px] text-violet-700/80 mt-1">
              Generate 3, 5, or 9 mark questions based on these takeaways.
            </p>
          </div>
          <button
            onClick={onGoToExam}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-800"
          >
            <span>Practice Exam Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
