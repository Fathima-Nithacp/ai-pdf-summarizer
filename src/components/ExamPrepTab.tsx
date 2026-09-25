import React, { useState } from 'react';
import { GraduationCap, Sparkles, Filter, CheckCircle2, XCircle, ChevronDown, ChevronUp, Printer, RefreshCw, Loader2, Award } from 'lucide-react';
import { ExamQuestion, DocumentItem } from '../types';
import { generateExamQuestionsApi } from '../utils/api';
import confetti from 'canvas-confetti';

interface ExamPrepTabProps {
  document: DocumentItem;
  onUpdateQuestions: (questions: ExamQuestion[]) => void;
}

export const ExamPrepTab: React.FC<ExamPrepTabProps> = ({
  document,
  onUpdateQuestions,
}) => {
  const [questionType, setQuestionType] = useState<string>('mixed');
  const [questionCount, setQuestionCount] = useState<number>(6);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [userSelectedOptions, setUserSelectedOptions] = useState<Record<string, string>>({});

  const questions = document.examQuestions || [];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateExamQuestionsApi(
        document.name,
        document.fullText,
        questionType,
        questionCount,
        difficulty
      );
      if (res.questions && res.questions.length > 0) {
        onUpdateQuestions(res.questions);
        setRevealedAnswers({});
        setUserSelectedOptions({});
      }
    } catch (err) {
      console.error('Failed to generate exam questions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectOption = (questionId: string, option: string, isCorrect: boolean) => {
    setUserSelectedOptions((prev) => ({ ...prev, [questionId]: option }));
    if (isCorrect) {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 },
      });
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterCategory === 'all') return true;
    return q.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Header & Generator Config */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Exam Question Generator
              </h3>
              <p className="text-xs text-slate-500">
                Generate KTU / University style questions with model answers & marking schemes.
              </p>
            </div>
          </div>

          {questions.length > 0 && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Question Paper</span>
            </button>
          )}
        </div>

        {/* Config Selectors (as requested in Section 7) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          {/* Question Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Question Type
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'mixed', label: 'Mixed Paper' },
                { id: '3_mark', label: '3 Mark' },
                { id: '5_mark', label: '5 Mark' },
                { id: '9_mark', label: '9 Mark' },
                { id: 'mcq', label: 'MCQs' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setQuestionType(t.id)}
                  className={`px-2 py-1.5 rounded-lg border text-left transition-colors font-medium ${
                    questionType === t.id
                      ? 'border-violet-500 bg-violet-50 text-violet-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
            >
              <option value={4}>4 Questions</option>
              <option value={6}>6 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
            >
              <option value="easy">Easy (Definitions & Direct Facts)</option>
              <option value="medium">Medium (Standard University Standard)</option>
              <option value="hard">Hard (Advanced Reasoning & Derivations)</option>
            </select>
          </div>
        </div>

        {/* Generate CTA */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting Questions with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Questions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      {questions.length > 0 && (
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200 overflow-x-auto text-xs font-medium">
          <span className="text-slate-400 mr-2 text-[11px] uppercase font-bold">Filter:</span>
          {['all', '3 Mark', '5 Mark', '9 Mark', 'MCQ'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? `All (${questions.length})` : cat}
            </button>
          ))}
        </div>
      )}

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
          <p className="text-xs text-slate-500">
            No questions matching filter. Select a different filter or click Generate Questions above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const isRevealed = !!revealedAnswers[q.id];
            const isMCQ = q.category.toUpperCase().includes('MCQ') || (q.options && q.options.length > 0);
            const userChoice = userSelectedOptions[q.id];

            return (
              <div
                key={q.id || idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300"
              >
                {/* Question Header & Category Badge */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        q.category.includes('3')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : q.category.includes('5')
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : q.category.includes('9')
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {q.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({q.marks} {q.marks === 1 ? 'Mark' : 'Marks'})
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400">
                    Difficulty: {q.difficulty || 'Medium'}
                  </span>
                </div>

                {/* Question Prompt */}
                <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-3">
                  {q.question}
                </h4>

                {/* MCQ Options Interactivity */}
                {isMCQ && q.options && (
                  <div className="space-y-2 mb-4">
                    {q.options.map((option, optIdx) => {
                      const isSelected = userChoice === option;
                      const isCorrect = q.correctAnswer && option.startsWith(q.correctAnswer.charAt(0));

                      let btnStyle = 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700';
                      if (userChoice) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-medium';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-500 bg-rose-50 text-rose-800 font-medium';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, option, Boolean(isCorrect))}
                          className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {userChoice && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {userChoice && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Toggle Model Answer & Grading scheme */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900 transition-colors"
                  >
                    <span>{isRevealed ? 'Hide Model Answer & Rubric' : 'Show Model Answer & Grading Rubric'}</span>
                    {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expandable Model Answer Box */}
                {isRevealed && (
                  <div className="mt-3 p-4 rounded-xl bg-violet-50/50 border border-violet-100 space-y-3 text-xs animate-fade-in">
                    <div>
                      <h5 className="font-bold text-violet-900 mb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-violet-600" />
                        Model Answer:
                      </h5>
                      <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {q.modelAnswer}
                      </p>
                    </div>

                    {q.keyPointsRequired && q.keyPointsRequired.length > 0 && (
                      <div className="pt-2 border-t border-violet-200/50">
                        <h6 className="font-bold text-violet-900 mb-1">
                          Key Points Required for Full Marks:
                        </h6>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                          {q.keyPointsRequired.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {q.gradingCriteria && (
                      <div className="pt-2 border-t border-violet-200/50 text-[11px] text-violet-900/80">
                        <span className="font-bold">Grading Scheme: </span>
                        {q.gradingCriteria}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
