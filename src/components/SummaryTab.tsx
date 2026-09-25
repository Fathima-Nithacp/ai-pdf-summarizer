import React, { useState } from 'react';
import { Copy, Check, Download, Sparkles, Clock, Tag, RefreshCw, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { SummaryData, DocumentItem } from '../types';
import { generateSummaryApi } from '../utils/api';

interface SummaryTabProps {
  document: DocumentItem;
  onUpdateSummary: (summary: SummaryData) => void;
  onAskAi: (question: string) => void;
  onGenerateExamQuestions: () => void;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
  document,
  onUpdateSummary,
  onAskAi,
  onGenerateExamQuestions,
}) => {
  const [summaryMode, setSummaryMode] = useState<'standard' | 'short' | 'detailed'>('standard');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  const summary = document.summary;

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No Summary Available</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          Click below to let AI read and structure the summary for {document.name}.
        </p>
        <button
          onClick={async () => {
            setIsRegenerating(true);
            try {
              const res = await generateSummaryApi(document.name, document.fullText, 'standard');
              onUpdateSummary(res);
            } finally {
              setIsRegenerating(false);
            }
          }}
          disabled={isRegenerating}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
        >
          {isRegenerating ? 'Generating...' : 'Generate AI Summary'}
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    const textToCopy =
      summaryMode === 'short'
        ? summary.shortSummary
        : summaryMode === 'detailed'
        ? summary.detailedSummary
        : `${summary.executiveSummary}\n\nKey Concepts:\n` +
          summary.keyConcepts.map((c, i) => `${i + 1}. ${c.title}\n${c.explanation}`).join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `# Summary: ${document.name}

## Executive Summary
${summary.executiveSummary}

## Short Summary
${summary.shortSummary}

## Key Concepts
${summary.keyConcepts.map((c, i) => `### ${i + 1}. ${c.title}\n${c.explanation}\n*Relevance: ${c.relevance || 'Core concept'}*`).join('\n\n')}

## Detailed Breakdown
${summary.detailedSummary}

## Key Takeaways
${summary.keyTakeaways.map((t) => `- ${t}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.name.replace(/\.[^/.]+$/, '')}_Summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header controls: Switch modes + Copy + Download */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setSummaryMode('standard')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              summaryMode === 'standard'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSummaryMode('short')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              summaryMode === 'short'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Short Summary
          </button>
          <button
            onClick={() => setSummaryMode('detailed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              summaryMode === 'detailed'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Detailed Analysis
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Notes</span>
          </button>
        </div>
      </div>

      {/* Meta tags & Reading time */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>~{summary.estimatedReadingTimeMinutes || 5} min read</span>
        </span>
        {summary.topics?.slice(0, 4).map((topic, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-indigo-700 bg-indigo-50 border border-indigo-200/50 px-2 py-0.5 rounded-md font-medium text-[11px]"
          >
            <Tag className="w-2.5 h-2.5 opacity-60" />
            {topic}
          </span>
        ))}
      </div>

      {/* Main Content Area based on mode */}
      {summaryMode === 'short' ? (
        <div className="p-6 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border border-indigo-100 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Elevator Pitch / Quick Take</span>
          </div>
          <p className="text-slate-800 text-sm leading-relaxed font-medium">
            {summary.shortSummary}
          </p>
        </div>
      ) : summaryMode === 'detailed' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs prose prose-slate max-w-none text-xs sm:text-sm">
          <div className="text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
            {summary.detailedSummary}
          </div>
        </div>
      ) : (
        /* Standard Overview: Executive Summary + Key Concepts */
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              Executive Summary
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {summary.executiveSummary}
            </p>
          </div>

          {/* Key Concepts (as requested in Section 5) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Key Concepts Explained
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {summary.keyConcepts.length} core concepts
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-1">
              {summary.keyConcepts.map((concept, index) => {
                const isExpanded = expandedConcept === concept.id || expandedConcept === null;
                return (
                  <div
                    key={concept.id || index}
                    className="p-4 bg-white border border-slate-200/90 rounded-xl hover:border-indigo-300 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100/70 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {concept.title}
                        </h4>
                      </div>

                      <button
                        onClick={() =>
                          onAskAi(`Explain the concept of "${concept.title}" from this document in simple words with examples.`)
                        }
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline shrink-0"
                      >
                        Ask AI about this →
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed pl-8">
                      {concept.explanation}
                    </p>

                    {concept.relevance && (
                      <div className="mt-2 pl-8 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-500">Why it matters:</span>
                        <span>{concept.relevance}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Quick Action CTAs (as drawn in user ASCII: [Ask AI] [Generate Questions]) */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border">
        <div>
          <h4 className="text-xs font-bold text-slate-800">
            Ready to test your understanding?
          </h4>
          <p className="text-[11px] text-slate-500">
            Ask the AI questions or generate university-grade exam problems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAskAi('Give me a high-level walkthrough of this entire document.')}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
          >
            Ask AI
          </button>
          <button
            onClick={onGenerateExamQuestions}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Generate Questions
          </button>
        </div>
      </div>
    </div>
  );
};
