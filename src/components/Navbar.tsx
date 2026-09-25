import React from 'react';
import { BookOpen, History, Settings, FileText, Upload, Sparkles, LayoutDashboard } from 'lucide-react';
import { AppView, DocumentItem } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activeDoc: DocumentItem | null;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeDoc,
  onOpenUpload,
  onOpenSettings,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  PDF<span className="text-indigo-600">.AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Study AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Summarizer & Exam Companion
              </p>
            </div>
          </button>

          {/* Quick Active Document Link */}
          {activeDoc && currentView !== 'dashboard' && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-medium border border-indigo-200/70 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span className="max-w-[160px] truncate">{activeDoc.name}</span>
              <span className="bg-indigo-200/70 text-indigo-900 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                Active
              </span>
            </button>
          )}
        </div>

        {/* Center / Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'home'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </button>

          {activeDoc && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              <span>Workspace</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('history')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'history'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action buttons & Avatar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm hover:shadow transition-all duration-150"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload PDF</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User profile avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};
