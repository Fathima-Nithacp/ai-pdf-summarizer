import React from 'react';
import { Search, Bell, Upload, Menu, Sparkles, User, BookOpen } from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentHeaderProps {
  profile: StudentProfile;
  onOpenSearch: () => void;
  onOpenUpload: () => void;
  onOpenProfileSetup: () => void;
  onToggleMobileMenu: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  profile,
  onOpenSearch,
  onOpenUpload,
  onOpenProfileSetup,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Mobile brand & hamburger */}
      <div className="flex items-center gap-2.5 md:hidden">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-extrabold text-base tracking-tight text-slate-900">
          Study<span className="text-indigo-600">AI</span>
        </span>
      </div>

      {/* Global Search Bar (as in Section 12) */}
      <div className="flex-1 max-w-md hidden sm:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-white transition-all text-left group shadow-2xs"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span>Search topics, notes, flashcards, or ask AI (e.g. "TCP")...</span>
          <kbd className="hidden lg:inline ml-auto text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right controls: Upload, Notifications, Student Profile */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 sm:hidden"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenUpload}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/60 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Material</span>
        </button>

        {/* Notification Bell 🔔 */}
        <div className="relative">
          <button
            onClick={() => alert(`🔔 Notifications:\n• Don't forget your daily 30-min Computer Networks session!\n• 2 new flashcards ready for revision in Artificial Intelligence.`)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>
        </div>

        {/* Student Profile (Section 3: 👤 Fathima) */}
        <button
          onClick={onOpenProfileSetup}
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          title="Edit Student Profile"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
            {profile.name.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              👤 {profile.name}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
