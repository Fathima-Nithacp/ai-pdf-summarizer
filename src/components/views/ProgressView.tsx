import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  Flame,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { StudentProfile, SubjectItem, AppNavSection } from '../../types';

interface ProgressViewProps {
  profile: StudentProfile;
  subjects: SubjectItem[];
  onNavigate: (section: AppNavSection, payload?: any) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  subjects,
  onNavigate,
}) => {
  const quizScores = [
    { name: 'Artificial Intelligence', score: 85, color: 'bg-violet-500' },
    { name: 'Computer Networks', score: 72, color: 'bg-blue-500' },
    { name: 'Machine Learning', score: 80, color: 'bg-emerald-500' },
    { name: 'Operating Systems', score: 88, color: 'bg-amber-500' },
    { name: 'DBMS', score: 65, color: 'bg-rose-500' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>Your Study Progress</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          "What have I studied and what should I study next?"
        </p>
      </div>

      {/* Top 3 Core Metrics (Section 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1: Overall Progress (78%) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              78%
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2.5">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: '78%' }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Based on completed modules & quizzes
            </p>
          </div>
        </div>

        {/* Metric 2: Study Time (This week: 8h 35m) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Study Time
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              {profile.weeklyStudyHours}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              This week • +1h 45m from last week
            </p>
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded w-fit">
              <span>Goal: 10h / week</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Current Streak (5 days) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              🔥
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              {profile.streakDays} Days
            </div>
            <p className="text-[11px] text-amber-800 font-medium mt-1">
              Top 10% consistency among CSE students
            </p>
            <div className="flex items-center gap-1 mt-2.5">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <span
                  key={idx}
                  className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    idx < profile.streakDays
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Split: Quiz Performance + Topics Completed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Quiz Performance (Section 11: AI 85%, Networks 72%, ML 80%) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Quiz Performance
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Average 80%</span>
          </div>

          <div className="space-y-3.5">
            {quizScores.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{item.name}</span>
                  <span className="font-mono font-bold text-slate-900">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-300`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('quiz')}
            className="w-full mt-2 py-2 text-center text-xs font-bold text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
          >
            Take Another Quiz →
          </button>
        </div>

        {/* Right: Topics Completed (24 / 30) + What to study next */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Topics Completed
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                24 / 30
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(24 / 30) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                6 topics remaining across enrolled subjects
              </p>
            </div>

            {/* AI Recommendation: What Should I Study Next? (Section 11) */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>What should I study next?</span>
              </div>
              <p className="text-xs text-indigo-900/90 leading-relaxed">
                Your Computer Networks score is at 72%. We recommend reviewing <strong className="font-bold">TCP 3-Way Handshake</strong> and <strong className="font-bold">Subnetting</strong> before your upcoming test.
              </p>
              <button
                onClick={() => onNavigate('tutor', { subject: 'Computer Networks', prompt: 'Teach me TCP 3-way handshake and CIDR subnetting with examples' })}
                className="mt-1 text-xs font-bold text-indigo-700 hover:text-indigo-950 inline-flex items-center gap-1"
              >
                <span>Review with AI Tutor</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
