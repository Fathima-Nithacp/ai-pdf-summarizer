export interface StudentProfile {
  name: string;
  major: string;
  year: string;
  enrolledSubjects: string[];
  streakDays: number;
  weeklyStudyHours: string;
  todayStudyMinutes: number;
  isSetupComplete: boolean;
}

export interface SubjectModule {
  id: string;
  moduleNumber: number;
  title: string;
  topics: string[];
  progressPercent: number;
  status: 'completed' | 'in_progress' | 'not_started';
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  icon: string;
  color: string;
  progressPercent: number;
  modules: SubjectModule[];
  materialsCount: number;
  notesCount: number;
  quizzesCount: number;
  flashcardsCount: number;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  completed: boolean;
}

export interface NoteConcept {
  id: string;
  title: string;
  explanation: string;
}

export interface NoteExample {
  concept: string;
  example: string;
}

export interface StructuredNote {
  id: string;
  subject: string;
  moduleName: string;
  title: string;
  importantConcepts: NoteConcept[];
  rememberBox: string;
  examples: NoteExample[];
  dateCreated: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  userSelected?: string;
}

export interface QuizSession {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  score: number;
  isCompleted: boolean;
}

export interface PlanTask {
  id: string;
  title: string;
  durationMin: number;
  type: 'study' | 'quiz' | 'revision' | 'rest';
  completed: boolean;
}

export interface PlanDay {
  dayLabel: string;
  date: string;
  focusTopic: string;
  tasks: PlanTask[];
}

export interface StudyPlan {
  subject: string;
  examDate: string;
  dailyHours: number;
  totalDays: number;
  dailySchedule: PlanDay[];
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  subjectTag?: string;
}

// PDF Material types
export interface DocumentPage {
  pageNumber: number;
  text: string;
}

export interface KeyConcept {
  id: string;
  title: string;
  explanation: string;
  relevance?: string;
}

export interface SummaryData {
  executiveSummary: string;
  shortSummary: string;
  detailedSummary: string;
  keyConcepts: KeyConcept[];
  keyTakeaways: string[];
  topics: string[];
  estimatedReadingTimeMinutes: number;
}

export interface ExamQuestion {
  id: string;
  category: '3 Mark' | '5 Mark' | '9 Mark' | 'MCQ' | string;
  marks: number;
  question: string;
  difficulty: string;
  options?: string[];
  correctAnswer?: string;
  keyPointsRequired?: string[];
  modelAnswer: string;
  gradingCriteria?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject?: string;
  category?: string;
  hint?: string;
  mastered?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  citations?: string[];
  suggestedQuestions?: string[];
}

export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  pageCount: number;
  uploadDate: string;
  subjectId?: string;
  fullText: string;
  pages: DocumentPage[];
  summary?: SummaryData;
  examQuestions?: ExamQuestion[];
  flashcards?: Flashcard[];
  chatHistory?: ChatMessage[];
  isSample?: boolean;
}

export type ActiveTab = 'summary' | 'key-points' | 'ask-ai' | 'exam-prep' | 'flashcards' | 'notes';
export type AppView = 'home' | 'dashboard' | 'history' | 'settings';

export interface UploadProgressState {
  isUploading: boolean;
  fileName: string;
  fileSize: string;
  progress: number;
  stage: 'uploaded' | 'extracted' | 'analyzing' | 'generated' | 'ready';
  statusMessage: string;
  error?: string;
}

export type AppNavSection =
  | 'home'
  | 'subjects'
  | 'tutor'
  | 'notes'
  | 'quiz'
  | 'flashcards'
  | 'planner'
  | 'progress'
  | 'materials'
  | 'settings';
