import React, { useState } from 'react';
import { Layers, RotateCcw, Shuffle, ChevronLeft, ChevronRight, CheckCircle2, HelpCircle, Sparkles, RefreshCw, LayoutGrid, Eye, Check } from 'lucide-react';
import { Flashcard, DocumentItem } from '../types';
import { generateFlashcardsApi } from '../utils/api';
import confetti from 'canvas-confetti';

interface FlashcardsTabProps {
  document: DocumentItem;
  onUpdateFlashcards: (cards: Flashcard[]) => void;
}

export const FlashcardsTab: React.FC<FlashcardsTabProps> = ({
  document,
  onUpdateFlashcards,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGridView, setShowGridView] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const flashcards = document.flashcards || [];
  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      setCurrentIndex(flashcards.length - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    onUpdateFlashcards(shuffled);
    setCurrentIndex(0);
  };

  const handleToggleMastered = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (next.size === flashcards.length && flashcards.length > 0) {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
      return next;
    });
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateFlashcardsApi(document.name, document.fullText, 10);
      if (res.flashcards && res.flashcards.length > 0) {
        onUpdateFlashcards(res.flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setMasteredIds(new Set());
      }
    } catch (err) {
      console.error('Failed to regenerate flashcards:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No Flashcards Created Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          Generate spaced repetition active recall cards from {document.name}.
        </p>
        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
        >
          {isGenerating ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </div>
    );
  }

  const isCurrentMastered = currentCard ? masteredIds.has(currentCard.id) : false;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Header & Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Recall Flashcards</h3>
            <p className="text-xs text-slate-400">
              {masteredIds.size} of {flashcards.length} mastered
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGridView(!showGridView)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1.5"
            title="Toggle View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">{showGridView ? 'Card Mode' : 'All Cards'}</span>
          </button>

          <button
            onClick={handleShuffle}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1"
            title="Shuffle deck"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1"
            title="Regenerate cards"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {showGridView ? (
        /* All Cards Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {flashcards.map((card, idx) => {
            const mastered = masteredIds.has(card.id);
            return (
              <div
                key={card.id || idx}
                className={`p-4 rounded-xl border transition-all ${
                  mastered
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Card #{idx + 1} • {card.category || 'Concept'}
                  </span>
                  <button
                    onClick={() => handleToggleMastered(card.id)}
                    className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full ${
                      mastered
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>{mastered ? 'Mastered' : 'Mark Known'}</span>
                  </button>
                </div>
                <h5 className="text-xs font-bold text-slate-900 mb-1.5">{card.question}</h5>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {card.answer}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Flip Card interactive view matching User ASCII mockup */
        <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full py-2">
          {/* Card counter */}
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              FLASHCARD {currentIndex + 1} / {flashcards.length}
            </span>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full h-80 rounded-2xl cursor-pointer p-8 flex flex-col justify-between transition-all duration-300 transform select-none relative shadow-md border ${
              isFlipped
                ? 'bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/50 border-indigo-200'
                : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-lg'
            }`}
          >
            {/* Top Card Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {currentCard.category || 'Core Question'}
              </span>

              <button
                onClick={(e) => handleToggleMastered(currentCard.id, e)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                  isCurrentMastered
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCurrentMastered ? 'Mastered' : 'Mark Mastered'}</span>
              </button>
            </div>

            {/* Middle Prompt / Answer */}
            <div className="text-center my-auto px-4">
              {isFlipped ? (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                    Answer:
                  </span>
                  <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                    {currentCard.answer}
                  </p>
                  {currentCard.hint && (
                    <p className="text-xs text-slate-400 italic pt-2">
                      Hint: {currentCard.hint}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {currentCard.question}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="text-center pt-2 border-t border-slate-100/80 text-xs text-slate-400 flex items-center justify-center gap-1">
              <RotateCcw className="w-3 h-3 text-indigo-500" />
              <span>{isFlipped ? 'Click card to flip back' : 'Click card to reveal answer'}</span>
            </div>
          </div>

          {/* Navigation Controls: ← Previous Next → */}
          <div className="flex items-center justify-between w-full mt-6 px-4">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => handleToggleMastered(currentCard.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl transition-colors ${
                isCurrentMastered
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isCurrentMastered ? '✓ Mastered' : '+ Mark as known'}
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
