import React, { useState, useEffect } from 'react';
import {
  AppNavSection,
  StudentProfile,
  SubjectItem,
  StudyTask,
  StructuredNote,
  QuizQuestion,
  StudyPlan,
  Flashcard,
  DocumentItem
} from './types';
import {
  DEFAULT_STUDENT_PROFILE,
  DEFAULT_SUBJECTS,
  DEFAULT_TASKS,
  DEFAULT_STRUCTURED_NOTES,
  DEFAULT_QUIZ_QUESTIONS,
  DEFAULT_FLASHCARDS,
  DEFAULT_STUDY_PLAN
} from './data/studentData';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { Sidebar } from './components/Sidebar';
import { StudentHeader } from './components/StudentHeader';
import { HomeDashboardView } from './components/views/HomeDashboardView';
import { SubjectsView } from './components/views/SubjectsView';
import { AiTutorView } from './components/views/AiTutorView';
import { NotesView } from './components/views/NotesView';
import { QuizView } from './components/views/QuizView';
import { FlashcardsView } from './components/views/FlashcardsView';
import { PlannerView } from './components/views/PlannerView';
import { ProgressView } from './components/views/ProgressView';
import { MaterialsView } from './components/views/MaterialsView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { UploadModal } from './components/UploadModal';
import { StudentSetupModal } from './components/StudentSetupModal';
import { WelcomeModal } from './components/WelcomeModal';
import { SettingsModal } from './components/SettingsModal';
import { Home, BookOpen, Bot, BarChart3, Layers } from 'lucide-react';

const STORAGE_PREFIX = 'study_ai_';

export default function App() {
  const [currentSection, setCurrentSection] = useState<AppNavSection>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STUDENT_PROFILE;
  });

  // Subjects state
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'subjects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SUBJECTS;
  });

  // Tasks state
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TASKS;
  });

  // Notes state
  const [notes, setNotes] = useState<StructuredNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STRUCTURED_NOTES;
  });

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'flashcards');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FLASHCARDS;
  });

  // Study Plan state
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'plan');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STUDY_PLAN;
  });

  // Uploaded Documents / Materials
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'docs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_DOCUMENTS;
  });

  const [activeDocId, setActiveDocId] = useState<string>(SAMPLE_DOCUMENTS[0].id);

  // Cross-view navigation parameters (e.g. from continue button or search)
  const [tutorContext, setTutorContext] = useState<{ subject?: string; prompt?: string }>({});

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'profile', JSON.stringify(profile));
      localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(tasks));
      localStorage.setItem(STORAGE_PREFIX + 'notes', JSON.stringify(notes));
      localStorage.setItem(STORAGE_PREFIX + 'flashcards', JSON.stringify(flashcards));
      localStorage.setItem(STORAGE_PREFIX + 'plan', JSON.stringify(studyPlan));
      localStorage.setItem(STORAGE_PREFIX + 'docs', JSON.stringify(documents));
    } catch {}
  }, [profile, tasks, notes, flashcards, studyPlan, documents]);

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (title: string, subject: string, durationMinutes: number) => {
    const newTask: StudyTask = {
      id: 'task-' + Date.now(),
      title,
      subject,
      durationMinutes,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDocumentReady = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
    setActiveDocId(newDoc.id);

    // If document has generated flashcards, merge into flashcard library
    if (newDoc.flashcards && newDoc.flashcards.length > 0) {
      setFlashcards((prev) => [...newDoc.flashcards!, ...prev]);
    }

    setCurrentSection('materials');
  };

  const handleNavigate = (section: AppNavSection, payload?: any) => {
    if (section === 'tutor' && payload) {
      setTutorContext(payload);
    }
    if (section === 'materials' && payload?.id) {
      setActiveDocId(payload.id);
    }
    setCurrentSection(section);
    setMobileMenuOpen(false);
  };

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0] || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 antialiased font-sans">
      {/* Desktop Sidebar (Section 13: Sidebar + Main Content) */}
      <div className="hidden md:block">
        <Sidebar
          currentSection={currentSection}
          onNavigate={(sec) => {
            if (sec === 'settings') {
              setIsSettingsOpen(true);
            } else {
              handleNavigate(sec);
            }
          }}
          profile={profile}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 bg-white h-full shadow-2xl">
            <Sidebar
              currentSection={currentSection}
              onNavigate={(sec) => {
                if (sec === 'settings') {
                  setIsSettingsOpen(true);
                } else {
                  handleNavigate(sec);
                }
              }}
              profile={profile}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 md:pb-0">
        {/* Top Header */}
        <StudentHeader
          profile={profile}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenProfileSetup={() => setIsSetupOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* View Routing */}
        <main className="flex-1">
          {currentSection === 'home' && (
            <HomeDashboardView
              profile={profile}
              subjects={subjects}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'subjects' && (
            <SubjectsView
              subjects={subjects}
              onNavigate={handleNavigate}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {currentSection === 'tutor' && (
            <AiTutorView
              subjects={subjects}
              initialSubject={tutorContext.subject}
              initialPrompt={tutorContext.prompt}
            />
          )}

          {currentSection === 'notes' && (
            <NotesView
              notes={notes}
              subjects={subjects}
              onAddNote={(newNote) => setNotes((prev) => [newNote, ...prev])}
              onDeleteNote={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
              onAskAiAboutNote={(prompt) => handleNavigate('tutor', { prompt })}
            />
          )}

          {currentSection === 'quiz' && (
            <QuizView
              subjects={subjects}
              initialSubject={tutorContext.subject}
              defaultQuestions={DEFAULT_QUIZ_QUESTIONS}
            />
          )}

          {currentSection === 'flashcards' && (
            <FlashcardsView
              flashcards={flashcards}
              subjects={subjects}
              onAddFlashcard={(c) => setFlashcards((prev) => [c, ...prev])}
            />
          )}

          {currentSection === 'planner' && (
            <PlannerView
              subjects={subjects}
              currentPlan={studyPlan}
              onUpdatePlan={setStudyPlan}
            />
          )}

          {currentSection === 'progress' && (
            <ProgressView
              profile={profile}
              subjects={subjects}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'materials' && (
            <MaterialsView
              documents={documents}
              activeDocument={activeDoc}
              onSelectDocument={(doc) => setActiveDocId(doc.id)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onDeleteDocument={(id) => setDocuments((prev) => prev.filter((d) => d.id !== id))}
              onUpdateDocument={(updated) =>
                setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
              }
              onAskAiTutor={(prompt) => handleNavigate('tutor', { prompt })}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Section 14: Mobile UI 🏠 📚 🤖 📈) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around py-2 md:hidden">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'tutor', label: 'Tutor', icon: Bot },
          { id: 'flashcards', label: 'Cards', icon: Layers },
          { id: 'progress', label: 'Progress', icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id as AppNavSection)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Global Search Modal (⌘K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        notes={notes}
        flashcards={flashcards}
        subjects={subjects}
        documents={documents}
        onNavigateToSection={handleNavigate}
        onAskAiFromSearch={(prompt) => handleNavigate('tutor', { prompt })}
      />

      {/* Upload Material Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentReady={handleDocumentReady}
      />

      {/* Student Setup Modal */}
      <StudentSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        initialProfile={profile}
        onSaveProfile={setProfile}
      />

      {/* Welcome Splash Modal */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onGetStarted={() => {
          setIsWelcomeOpen(false);
          setIsSetupOpen(true);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetSamples={() => {
          setDocuments(SAMPLE_DOCUMENTS);
          setSubjects(DEFAULT_SUBJECTS);
          setNotes(DEFAULT_STRUCTURED_NOTES);
          setFlashcards(DEFAULT_FLASHCARDS);
          setTasks(DEFAULT_TASKS);
          setProfile(DEFAULT_STUDENT_PROFILE);
        }}
      />
    </div>
  );
}
