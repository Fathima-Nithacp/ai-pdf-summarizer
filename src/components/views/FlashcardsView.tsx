import React, { useState } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shuffle,
  Eye,
  Plus
} from 'lucide-react';
import { Flashcard, SubjectItem } from '../../types';
import confetti from 'canvas-confetti';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  subjects: SubjectItem[];
  onAddFlashcard: (card: Flashcard) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  flashcards,
  subjects,
  onAddFlashcard,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [practiceQueue, setPracticeQueue] = useState<string[]>([]);

  // Filter flashcards by subject if selected
  const activeDeck = flashcards.filter(
    (f) => selectedSubject === 'All' || f.subject === selectedSubject
  );

  const currentCard = activeDeck[currentIndex] || activeDeck[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < activeDeck.length - 1) {
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
      setCurrentIndex(activeDeck.length - 1);
    }
  };

  const handleKnowIt = () => {
    if (!currentCard) return;
    setKnownIds((prev) => new Set([...prev, currentCard.id]));
    setPracticeQueue((prev) => prev.filter((id) => id !== currentCard.id));

    if (knownIds.size + 1 === activeDeck.length) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
    handleNext();
  };

  const handleNeedPractice = () => {
    if (!currentCard) return;
    setKnownIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    setPracticeQueue((prev) => (prev.includes(currentCard.id) ? prev : [...prev, currentCard.id]));
    handleNext();
  };

  if (activeDeck.length === 0) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">No flashcards in this deck</h4>
        <p className="text-xs text-slate-400">Select another subject deck or upload notes.</p>
      </div>
    );
  }

  const isCurrentKnown = currentCard ? knownIds.has(currentCard.id) : false;
  const isCurrentPractice = currentCard ? practiceQueue.includes(currentCard.id) : false;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-600" />
            <span>AI Flashcards</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Active recall with smart repetition for cards you struggle with.
          </p>
        </div>

        {/* Deck Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Deck:</span>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none shadow-2xs"
          >
            <option value="All">All Subjects ({flashcards.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Flashcard Container (Section 9) */}
      <div className="flex flex-col items-center justify-center max-w-lg mx-auto w-full py-4 space-y-6">
        {/* Progress Tracker (Section 9: Flashcard 4 / 15) */}
        <div className="flex items-center justify-between w-full px-2 text-xs font-bold">
          <span className="uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Flashcard {currentIndex + 1} / {activeDeck.length}
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            {knownIds.size} Mastered
          </span>
        </div>

        {/* 3D Flip Card (Section 9: Click to reveal -> shows answer) */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full h-72 sm:h-80 rounded-3xl cursor-pointer p-8 flex flex-col justify-between transition-all duration-300 transform select-none relative shadow-md border ${
            isFlipped
              ? 'bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 border-amber-200'
              : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-lg'
          }`}
        >
          {/* Card Top Label */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {currentCard.subject || currentCard.category || 'Concept'}
            </span>
            {isCurrentKnown && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                ✓ Mastered
              </span>
            )}
            {isCurrentPractice && (
              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                🔄 Need Practice
              </span>
            )}
          </div>

          {/* Card Body */}
          <div className="text-center my-auto px-4">
            {isFlipped ? (
              <div className="space-y-3 animate-fade-in">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Answer:
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed font-sans">
                  {currentCard.answer}
                </p>
                {currentCard.hint && (
                  <p className="text-xs text-slate-400 italic pt-1">
                    Hint: {currentCard.hint}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {currentCard.question}
                </p>
              </div>
            )}
          </div>

          {/* Card Bottom Indicator */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>{isFlipped ? 'Click card to flip back' : 'Click to reveal'}</span>
          </div>
        </div>

        {/* Action Buttons: Know it 👍 | Need practice 🔄 (Section 9) */}
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            onClick={handleNeedPractice}
            className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-2"
          >
            <span>Need practice 🔄</span>
          </button>

          <button
            onClick={handleKnowIt}
            className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <span>Know it 👍</span>
          </button>
        </div>

        {/* Previous / Next Controls (Section 9: ← Previous Next →) */}
        <div className="flex items-center justify-between w-full px-2 pt-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
