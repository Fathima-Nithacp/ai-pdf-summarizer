import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, BookOpen, Layers, Bot, ArrowRight, CornerDownLeft } from 'lucide-react';
import { StructuredNote, Flashcard, SubjectItem, DocumentItem, AppNavSection } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: StructuredNote[];
  flashcards: Flashcard[];
  subjects: SubjectItem[];
  documents: DocumentItem[];
  onNavigateToSection: (section: AppNavSection, payload?: any) => void;
  onAskAiFromSearch: (prompt: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  notes,
  flashcards,
  subjects,
  documents,
  onNavigateToSection,
  onAskAiFromSearch,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          n.importantConcepts.some((c) => c.title.toLowerCase().includes(q) || c.explanation.toLowerCase().includes(q))
      )
    : [];

  const matchedFlashcards = q
    ? flashcards.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          (f.category && f.category.toLowerCase().includes(q))
      )
    : [];

  const matchedSubjects = q
    ? subjects.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.modules.some((m) => m.title.toLowerCase().includes(q) || m.topics.some((t) => t.toLowerCase().includes(q)))
      )
    : [];

  const matchedDocuments = q
    ? documents.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.fullText.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchedNotes.length > 0 ||
    matchedFlashcards.length > 0 ||
    matchedSubjects.length > 0 ||
    matchedDocuments.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a topic, definition, or subject (e.g. 'TCP', 'A* Search')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded bg-slate-100"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {query ? (
            <>
              {/* Ask AI direct prompt chip */}
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-indigo-950">Ask AI Tutor:</span>
                    <span className="text-indigo-800 ml-1">"Explain {query} in simple words"</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onAskAiFromSearch(`Explain ${query} in simple words with examples.`);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
                >
                  Ask AI →
                </button>
              </div>

              {/* Matched Documents */}
              {matchedDocuments.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Study Materials & PDFs ({matchedDocuments.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {matchedDocuments.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          onNavigateToSection('materials', doc);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800">{doc.name}</span>
                        <span className="text-[11px] text-slate-400">Open material →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Notes */}
              {matchedNotes.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Smart Notes ({matchedNotes.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {matchedNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => {
                          onNavigateToSection('notes', note);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{note.title}</p>
                          <p className="text-[11px] text-slate-400">{note.subject} • {note.moduleName}</p>
                        </div>
                        <span className="text-[11px] text-indigo-600 font-semibold">View note →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Flashcards */}
              {matchedFlashcards.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span>Flashcards ({matchedFlashcards.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {matchedFlashcards.map((fc) => (
                      <button
                        key={fc.id}
                        onClick={() => {
                          onNavigateToSection('flashcards', fc);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
                      >
                        <p className="font-semibold text-slate-800">{fc.question}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{fc.answer}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!hasResults && (
                <div className="text-center py-8 text-slate-400">
                  <p>No matching notes or flashcards for "{query}".</p>
                  <p className="text-[11px] mt-1">Try asking the AI Tutor above!</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <p className="font-medium text-slate-600">Quick Searches</p>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-sm mx-auto">
                {['TCP', 'A* Search', 'Paging', 'ACID', 'OSI Model', 'Minimax'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
