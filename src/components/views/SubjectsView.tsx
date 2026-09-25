import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Bot,
  HelpCircle,
  FileText,
  Layers,
  Upload,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { SubjectItem, AppNavSection } from '../../types';

interface SubjectsViewProps {
  subjects: SubjectItem[];
  onNavigate: (section: AppNavSection, payload?: any) => void;
  onOpenUpload: () => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  onNavigate,
  onOpenUpload,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>My Subjects</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Explore syllabus modules, notes, quizzes, and flashcards organized by subject.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Subject Cards Grid (Section 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center font-bold text-sm shadow-2xs`}>
                    {sub.icon === 'bot' ? '🤖' : sub.icon === 'network' ? '🌐' : sub.icon === 'cpu' ? '🧠' : sub.icon === 'terminal' ? '💻' : '🗄️'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {sub.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      {sub.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar (Section 4: Progress: 45% █████░░░░░) */}
              <div className="space-y-1.5 py-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500 text-[11px]">Progress</span>
                  <span className="font-bold text-slate-900">{sub.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${sub.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Counts Badge strip */}
              <div className="grid grid-cols-4 gap-1 text-center pt-3 text-[10px] font-semibold text-slate-500">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="block font-bold text-slate-800">{sub.modules.length}</span>
                  <span>Modules</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="block font-bold text-slate-800">{sub.notesCount}</span>
                  <span>Notes</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="block font-bold text-slate-800">{sub.quizzesCount}</span>
                  <span>Quizzes</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="block font-bold text-slate-800">{sub.flashcardsCount}</span>
                  <span>Cards</span>
                </div>
              </div>
            </div>

            {/* Actions: Study button */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedSubject(sub)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                Modules & Content
              </button>
              <button
                onClick={() => onNavigate('tutor', { subject: sub.name, prompt: `Teach me the most important concepts in ${sub.name}` })}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subject Detailed Module Drawer / Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-100 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedSubject.color} text-white flex items-center justify-center font-bold text-base`}>
                  {selectedSubject.icon === 'bot' ? '🤖' : selectedSubject.icon === 'network' ? '🌐' : selectedSubject.icon === 'cpu' ? '🧠' : selectedSubject.icon === 'terminal' ? '💻' : '🗄️'}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {selectedSubject.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedSubject.code} • {selectedSubject.progressPercent}% syllabus mastered
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Quick Study Action Strip */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => {
                  onNavigate('tutor', { subject: selectedSubject.name });
                  setSelectedSubject(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ask AI Tutor</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('quiz', { subject: selectedSubject.name });
                  setSelectedSubject(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-violet-50 hover:text-violet-600"
              >
                <HelpCircle className="w-3.5 h-3.5 text-violet-600" />
                <span>Take Quiz</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('flashcards', { subject: selectedSubject.name });
                  setSelectedSubject(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-amber-50 hover:text-amber-600"
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Flashcards</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('notes', { subject: selectedSubject.name });
                  setSelectedSubject(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-teal-50 hover:text-teal-600"
              >
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>Notes</span>
              </button>
            </div>

            {/* Modules List */}
            <div className="p-6 overflow-y-auto space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Syllabus Modules ({selectedSubject.modules.length})
              </h4>

              {selectedSubject.modules.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center">
                        M{m.moduleNumber}
                      </span>
                      <h5 className="text-xs font-bold text-slate-800">{m.title}</h5>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : m.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {m.status === 'completed' ? '✓ Completed' : m.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
