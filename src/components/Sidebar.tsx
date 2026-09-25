import React from 'react';
import {
  Home,
  BookOpen,
  Bot,
  FileText,
  HelpCircle,
  Layers,
  Calendar,
  BarChart3,
  Upload,
  Settings,
  Flame,
  GraduationCap
} from 'lucide-react';
import { AppNavSection, StudentProfile } from '../types';

interface SidebarProps {
  currentSection: AppNavSection;
  onNavigate: (section: AppNavSection) => void;
  profile: StudentProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  profile,
}) => {
  const navItems: Array<{
    id: AppNavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'tutor', label: 'AI Tutor', icon: Bot, badge: 'AI' },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'materials', label: 'Materials & PDFs', icon: Upload },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-20">
      {/* Brand & Student Banner */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  Study<span className="text-indigo-600">AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Personal Study Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Quick Streak Widget */}
        <div className="px-4 pt-3 pb-1">
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  {profile.streakDays} Day Streak
                </p>
                <p className="text-[10px] text-amber-700/80">
                  Keep it going today!
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Settings */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            currentSection === 'settings'
              ? 'bg-slate-100 text-slate-900'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings & Preferences</span>
        </button>

        {/* Mini Student Card */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-slate-800 truncate">
              {profile.name}
            </h5>
            <p className="text-[10px] text-slate-400 truncate">
              {profile.year} • CS
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
