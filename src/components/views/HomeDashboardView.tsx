import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Circle,
  Plus,
  Bot,
  HelpCircle,
  Layers,
  Sparkles,
  Flame,
  FileText
} from 'lucide-react';
import { StudentProfile, StudyTask, SubjectItem, AppNavSection } from '../../types';

interface HomeDashboardViewProps {
  profile: StudentProfile;
  subjects: SubjectItem[];
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, subject: string, duration: number) => void;
  onNavigate: (section: AppNavSection, payload?: any) => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  profile,
  subjects,
  tasks,
  onToggleTask,
  onAddTask,
  onNavigate,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState(profile.enrolledSubjects[0] || 'Computer Networks');

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), newTaskSubject, 25);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Greeting Banner (Section 3: Good evening! 👋 Ready to study?) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{getTimeGreeting()}, {profile.name}! 👋</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Ready to study? Here is your study breakdown for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 text-xs font-bold flex items-center gap-1.5">
            <span className="text-base">🔥</span>
            <span>{profile.streakDays} Day Streak</span>
          </div>

          <button
            onClick={() => onNavigate('tutor')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards (Section 3: 2h 30m | 65% | 3 Topics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Study Time */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Study Time
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {profile.weeklyStudyHours}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              45m logged today
            </p>
          </div>
        </div>

        {/* Stat 2: Progress */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              65%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
        </div>

        {/* Stat 3: Topics Remaining */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Topics Remaining
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              3 Topics
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Scheduled for today
            </p>
          </div>
        </div>
      </div>

      {/* Continue Learning Banner (Section 3) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-[11px] font-semibold backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Continue Learning</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Computer Networks – Module 1: Architecture & Protocols
            </h3>
            <p className="text-xs text-indigo-200/90 leading-relaxed">
              You left off at Transport Layer (TCP 3-way handshake vs UDP flow control). 3 practice quiz questions pending.
            </p>

            {/* Visual Progress Bar (Section 3: Progress ███████░░░ 70%) */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-indigo-200 mb-1 font-mono font-medium">
                <span>Progress</span>
                <span className="font-bold text-white">70%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onNavigate('tutor', { prompt: 'Explain the TCP 3-way handshake in simple terms with an example' })}
              className="px-5 py-3 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 font-bold text-xs shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Tasks + Quick Subject Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Tasks (Section 3: Today's Tasks) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today's Tasks</h3>
              <p className="text-xs text-slate-400">
                {tasks.filter((t) => t.completed).length} of {tasks.length} completed
              </p>
            </div>

            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 p-1 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* New Task Inline Form */}
          {isAddingTask && (
            <form onSubmit={handleCreateTask} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <input
                type="text"
                placeholder="What do you need to study? (e.g. 'Read AI Heuristics notes')"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600"
                >
                  {profile.enrolledSubjects.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1 rounded text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Task Checklist Items */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  task.completed
                    ? 'border-slate-100 bg-slate-50/60 text-slate-400'
                    : 'border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-slate-50/40 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      task.completed ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                  <span
                    className={`text-xs font-semibold ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {task.subject}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {task.durationMinutes}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Feature Launchers */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Study Tools</h3>
            <p className="text-xs text-slate-400 mb-4">
              Direct access to your AI study suite
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('tutor')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">AI Tutor Chat</h5>
                    <p className="text-[10px] text-slate-400">Ask doubts, get examples</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => onNavigate('quiz')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">AI Quiz Generator</h5>
                    <p className="text-[10px] text-slate-400">Test concepts with MCQs</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-600" />
              </button>

              <button
                onClick={() => onNavigate('flashcards')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Active Recall Cards</h5>
                    <p className="text-[10px] text-slate-400">Flip cards to test memory</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600" />
              </button>

              <button
                onClick={() => onNavigate('notes')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Smart Notes</h5>
                    <p className="text-[10px] text-slate-400">Structured revision guides</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('subjects')}
              className="w-full py-2 rounded-xl text-center text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              View All Subjects →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
