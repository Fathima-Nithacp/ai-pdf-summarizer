import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Award,
  Loader2,
  ChevronRight,
  Flame
} from 'lucide-react';
import { QuizQuestion, SubjectItem } from '../../types';
import { generateQuizApi } from '../../utils/api';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  subjects: SubjectItem[];
  initialSubject?: string;
  defaultQuestions: QuizQuestion[];
}

export const QuizView: React.FC<QuizViewProps> = ({
  subjects,
  initialSubject,
  defaultQuestions,
}) => {
  // Mode: 'config' | 'playing' | 'completed' | 'review'
  const [mode, setMode] = useState<'config' | 'playing' | 'completed'>('config');
  
  // Config form
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || subjects[0]?.name || 'Computer Networks');
  const [selectedTopic, setSelectedTopic] = useState('Module 1: Architecture & Protocols');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionType, setQuestionType] = useState('mcq');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>(defaultQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    try {
      const res = await generateQuizApi(selectedSubject, selectedTopic, count, difficulty, questionType);
      if (res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setCurrentIndex(0);
        setUserAnswers({});
        setShowExplanation(false);
        setMode('playing');
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      // Fallback to existing questions
      setCurrentIndex(0);
      setUserAnswers({});
      setShowExplanation(false);
      setMode('playing');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (userAnswers[currentQuestion.id]) return; // already answered this question

    const isCorrect = option.startsWith(currentQuestion.correctAnswer.charAt(0)) || option === currentQuestion.correctAnswer;
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
    setShowExplanation(true);

    if (isCorrect) {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.7 },
      });
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q) => {
        const ans = userAnswers[q.id];
        if (ans && (ans.startsWith(q.correctAnswer.charAt(0)) || ans === q.correctAnswer)) {
          correct++;
        }
      });
      const pct = (correct / questions.length) * 100;
      if (pct >= 70) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
      setMode('completed');
    }
  };

  // Score stats
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans && (ans.startsWith(q.correctAnswer.charAt(0)) || ans === q.correctAnswer)) {
        correct++;
      }
    });
    return {
      correct,
      wrong: questions.length - correct,
      percent: Math.round((correct / questions.length) * 100),
    };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* View Header */}
      <div className="pb-4 border-b border-slate-200/80 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-violet-600" />
            <span>AI Quiz Master</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Test your knowledge with university-standard MCQs and instant active feedback.
          </p>
        </div>

        {mode !== 'config' && (
          <button
            onClick={() => setMode('config')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200"
          >
            New Quiz Setup
          </button>
        )}
      </div>

      {/* Screen 1: Quiz Creator (Section 8: Create Quiz) */}
      {mode === 'config' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6 max-w-2xl mx-auto">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Create Custom Quiz
            </h3>
            <p className="text-xs text-slate-500">
              Pick a subject and topic to test yourself.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Subject */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Topic / Module</label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="e.g. Module 1: Architecture or TCP vs UDP"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>

            {/* Number of Questions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Number of Questions</label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>

              {/* Question Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Format</label>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="qtype"
                      checked={questionType === 'mcq'}
                      onChange={() => setQuestionType('mcq')}
                      className="text-violet-600"
                    />
                    <span className="font-semibold text-slate-700">MCQ</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="qtype"
                      checked={questionType === 'true_false'}
                      onChange={() => setQuestionType('true_false')}
                      className="text-violet-600"
                    />
                    <span className="font-semibold text-slate-700">True/False</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Difficulty (Section 8: Easy, Medium, Hard) */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 px-3 rounded-xl border text-center font-bold capitalize transition-all ${
                      difficulty === diff
                        ? 'border-violet-600 bg-violet-50 text-violet-800 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleStartQuiz}
              disabled={isGenerating}
              className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-500/25 transition-all inline-flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Quiz Questions...</span>
                </>
              ) : (
                <>
                  <span>Start Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Interactive Question Runner (Section 8) */}
      {mode === 'playing' && currentQuestion && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6 max-w-2xl mx-auto">
          {/* Progress Header (Section 8: Question 3 / 10) */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              Question {currentIndex + 1} / {questions.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 font-bold">
              {selectedSubject}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, optIdx) => {
              const userChoice = userAnswers[currentQuestion.id];
              const isSelected = userChoice === option;
              const isCorrect =
                option.startsWith(currentQuestion.correctAnswer.charAt(0)) ||
                option === currentQuestion.correctAnswer;

              let style = 'border-slate-200/90 bg-white hover:border-violet-300 text-slate-800';
              if (userChoice) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected) {
                  style = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                } else {
                  style = 'border-slate-200 bg-slate-50 text-slate-400';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(option)}
                  disabled={Boolean(userChoice)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all ${style}`}
                >
                  <span>{option}</span>
                  {userChoice && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {userChoice && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs animate-fade-in">
              <span className="font-bold text-slate-900 block">Explanation:</span>
              <p className="text-slate-700 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!userAnswers[currentQuestion.id]}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-bold text-xs shadow-2xs transition-all inline-flex items-center gap-1.5"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Screen 3: Quiz Complete (Section 8) */}
      {mode === 'completed' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-2xs text-center space-y-6 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-2xs">
            🎉
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Quiz Complete!
            </h3>
            <p className="text-xs text-slate-400">
              {selectedSubject} • {selectedTopic}
            </p>
          </div>

          {/* Score Box (Section 8: Your Score 8 / 10 | 80% | ✓ Correct: 8 ✗ Wrong: 2) */}
          {(() => {
            const score = calculateScore();
            return (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Score
                </span>
                <div className="text-4xl font-extrabold text-slate-900 font-mono">
                  {score.correct} / {questions.length}
                </div>
                <div className="text-lg font-bold text-violet-700 font-mono">
                  {score.percent}%
                </div>

                <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-200 text-xs font-bold">
                  <span className="text-emerald-600">✓ Correct: {score.correct}</span>
                  <span className="text-rose-500">✗ Wrong: {score.wrong}</span>
                </div>
              </div>
            );
          })()}

          {/* Action buttons (Section 8: [ Review Answers ] [ Try Again ]) */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setShowExplanation(true);
                setMode('playing');
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
            >
              Review Answers
            </button>
            <button
              onClick={() => {
                setUserAnswers({});
                setCurrentIndex(0);
                setShowExplanation(false);
                setMode('playing');
              }}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-2xs"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
