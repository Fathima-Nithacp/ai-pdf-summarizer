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
  fullText: string;
  pages: DocumentPage[];
  pdfDataUrl?: string; // Base64 or object URL if available for rendering
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
