import React from 'react';
import { BookOpen, Sparkles, Check, ArrowRight, X, GraduationCap } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onGetStarted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 p-8 sm:p-10 text-center relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo / Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            Study<span className="text-indigo-600">AI</span>
          </span>
        </div>

        {/* Hero Headings */}
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study smarter, not harder.
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Your personal AI study assistant tailored to your university curriculum and study pace.
          </p>
        </div>

        {/* Main CTA */}
        <button
          onClick={onGetStarted}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all inline-flex items-center justify-center gap-2 mb-8"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Feature Checkmarks (Section 1) */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-600 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-600 font-bold">✓</span>
            <span>AI Tutor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-600 font-bold">✓</span>
            <span>Smart Notes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-600 font-bold">✓</span>
            <span>Quizzes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-600 font-bold">✓</span>
            <span>Flashcards</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-600 font-bold">✓</span>
            <span>Study Planner</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-600 font-bold">✓</span>
            <span>Progress Stats</span>
          </div>
        </div>
      </div>
    </div>
  );
};
