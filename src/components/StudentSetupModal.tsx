import React, { useState } from 'react';
import { X, Check, GraduationCap, ArrowRight, User } from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const StudentSetupModal: React.FC<StudentSetupModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(initialProfile.name || 'Fathima');
  const [major, setMajor] = useState(initialProfile.major || 'Computer Science & Engineering');
  const [year, setYear] = useState(initialProfile.year || '2nd Year');
  const [enrolled, setEnrolled] = useState<string[]>(
    initialProfile.enrolledSubjects || ['Artificial Intelligence', 'Computer Networks', 'Machine Learning']
  );

  if (!isOpen) return null;

  const subjectOptions = [
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Networks',
    'DBMS',
    'Operating Systems',
    'Software Engineering',
    'Data Structures & Algorithms',
  ];

  const toggleSubject = (sub: string) => {
    setEnrolled((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleSave = () => {
    onSaveProfile({
      ...initialProfile,
      name: name.trim() || 'Student',
      major,
      year,
      enrolledSubjects: enrolled.length > 0 ? enrolled : ['Computer Networks'],
      isSetupComplete: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <h3 className="font-extrabold text-slate-900 text-lg">
              Welcome! Student Setup
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4 text-xs">
          {/* Student Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fathima"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* What are you studying? */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              What are you studying?
            </label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electrical & Electronics">Electrical & Electronics</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>

          {/* What is your year? */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              What is your year?
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* What are you currently studying? */}
          <div>
            <label className="block text-slate-700 font-bold mb-2">
              What are you currently studying?
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {subjectOptions.map((sub) => {
                const isSelected = enrolled.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{sub}</span>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="w-full px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-1.5"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
