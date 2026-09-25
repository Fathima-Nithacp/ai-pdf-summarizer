import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Loader2,
  CalendarDays,
  ArrowRight
} from 'lucide-react';
import { StudyPlan, SubjectItem } from '../../types';
import { generateStudyPlanApi } from '../../utils/api';

interface PlannerViewProps {
  subjects: SubjectItem[];
  currentPlan: StudyPlan;
  onUpdatePlan: (plan: StudyPlan) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  subjects,
  currentPlan,
  onUpdatePlan,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(currentPlan.subject || subjects[0]?.name || 'Artificial Intelligence');
  const [examDate, setExamDate] = useState(currentPlan.examDate || 'October 15');
  const [selectedModules, setSelectedModules] = useState<string[]>(['Module 1', 'Module 2', 'Module 3', 'Module 4']);
  const [dailyHours, setDailyHours] = useState(currentPlan.dailyHours || 2);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSubjectObj = subjects.find((s) => s.name === selectedSubject);

  const toggleModule = (modName: string) => {
    setSelectedModules((prev) =>
      prev.includes(modName) ? prev.filter((m) => m !== modName) : [...prev, modName]
    );
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await generateStudyPlanApi(
        selectedSubject,
        examDate,
        selectedModules,
        dailyHours
      );
      onUpdatePlan(generated);
    } catch (err) {
      console.error('Failed to generate study plan:', err);
      alert('Could not generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTaskCompletion = (dayIdx: number, taskId: string) => {
    const updatedDays = currentPlan.dailySchedule.map((day, dIdx) => {
      if (dIdx !== dayIdx) return day;
      return {
        ...day,
        tasks: day.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      };
    });

    onUpdatePlan({
      ...currentPlan,
      dailySchedule: updatedDays,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <span>AI Exam Study Planner</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Personalized daily revision timetable calibrated to your exam date and study hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Exam Parameters Form (Section 10) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5 h-fit">
          <div className="flex items-center gap-2">
            <span className="text-base">🎯</span>
            <h3 className="font-extrabold text-slate-900 text-sm">
              My Exam Schedule
            </h3>
          </div>

          <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
            {/* Subject */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  const sub = subjects.find((s) => s.name === e.target.value);
                  if (sub) {
                    setSelectedModules(sub.modules.map((m) => `Module ${m.moduleNumber}: ${m.title}`));
                  }
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Exam Date */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Exam Date</label>
              <input
                type="text"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                placeholder="e.g. October 15"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>

            {/* Modules Checkboxes */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">Modules to Cover</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {(activeSubjectObj?.modules || [
                  { id: '1', moduleNumber: 1, title: 'Module 1' },
                  { id: '2', moduleNumber: 2, title: 'Module 2' },
                  { id: '3', moduleNumber: 3, title: 'Module 3' },
                  { id: '4', moduleNumber: 4, title: 'Module 4' },
                ]).map((mod) => {
                  const label = `Module ${mod.moduleNumber}: ${mod.title}`;
                  const isChecked = selectedModules.some((m) => m.includes(`Module ${mod.moduleNumber}`));
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => toggleModule(label)}
                      className={`w-full text-left p-2 rounded-lg border text-[11px] font-medium flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <span className="truncate">{label}</span>
                      <span className="text-indigo-600 font-bold ml-2">
                        {isChecked ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Study Time */}
            <div>
              <div className="flex items-center justify-between mb-1 font-bold text-slate-700">
                <span>Available Study Time:</span>
                <span className="text-indigo-600 font-mono">{dailyHours} hours/day</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={0.5}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Study Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Study Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 2 Columns: Calendar / Daily Study Plan Cards (Section 10) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  📅 Your Study Plan for {currentPlan.subject}
                </h3>
              </div>

              <span className="text-xs font-bold text-slate-400">
                Exam: {currentPlan.examDate}
              </span>
            </div>

            {/* Daily Schedule List (Section 10: Sep 26, Sep 27, Sep 28) */}
            <div className="space-y-4">
              {currentPlan.dailySchedule.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/60 font-mono">
                      {day.dayLabel} ({day.date})
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Focus: {day.focusTopic}
                    </span>
                  </div>

                  {/* Tasks for the day */}
                  <div className="space-y-2 pt-1">
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskCompletion(dayIdx, task.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                          task.completed
                            ? 'bg-slate-100/70 border-slate-200 text-slate-400'
                            : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              task.completed ? 'text-emerald-600' : 'text-slate-300'
                            }`}
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-semibold ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {task.type === 'study' ? '🤖 ' : task.type === 'quiz' ? '🧠 ' : '🔄 '}
                            {task.title}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono font-medium text-slate-400">
                          {task.durationMin} min
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
