import React, { useState } from 'react';
import { FileText, Sparkles, BookOpen, Layers, GraduationCap, MessageSquare, ListChecks, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { DocumentItem, ActiveTab, SummaryData, ExamQuestion, Flashcard, ChatMessage } from '../types';
import { PdfViewer } from './PdfViewer';
import { SummaryTab } from './SummaryTab';
import { KeyPointsTab } from './KeyPointsTab';
import { ChatTab } from './ChatTab';
import { ExamPrepTab } from './ExamPrepTab';
import { FlashcardsTab } from './FlashcardsTab';
import { StudyNotesTab } from './StudyNotesTab';

interface DashboardViewProps {
  document: DocumentItem;
  onUpdateDocument: (updated: DocumentItem) => void;
  onOpenUploadModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  document,
  onUpdateDocument,
  onOpenUploadModal,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [chatPromptInput, setChatPromptInput] = useState<string | undefined>(undefined);
  const [isPdfPanelOpen, setIsPdfPanelOpen] = useState(true);

  const handleUpdateSummary = (summary: SummaryData) => {
    onUpdateDocument({ ...document, summary });
  };

  const handleUpdateQuestions = (examQuestions: ExamQuestion[]) => {
    onUpdateDocument({ ...document, examQuestions });
  };

  const handleUpdateFlashcards = (flashcards: Flashcard[]) => {
    onUpdateDocument({ ...document, flashcards });
  };

  const handleUpdateHistory = (chatHistory: ChatMessage[]) => {
    onUpdateDocument({ ...document, chatHistory });
  };

  const handleAskAboutPage = (pageNumber: number, pageText: string) => {
    setActiveTab('ask-ai');
    setChatPromptInput(`Analyze Page ${pageNumber} of this PDF and explain its most critical takeaways, formulas, or concepts in detail.`);
  };

  const handleAskAiGeneral = (question: string) => {
    setActiveTab('ask-ai');
    setChatPromptInput(question);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
      {/* Top Document Workspace Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsPdfPanelOpen(!isPdfPanelOpen)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title={isPdfPanelOpen ? 'Hide PDF Viewer' : 'Show PDF Viewer'}
          >
            {isPdfPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-extrabold text-sm text-slate-900 truncate">
              {document.name}
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              ({document.pageCount} pages)
            </span>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'summary', label: 'Summary', icon: BookOpen },
            { id: 'key-points', label: 'Key Points', icon: ListChecks },
            { id: 'ask-ai', label: 'Ask AI', icon: MessageSquare, badge: 'Q&A' },
            { id: 'exam-prep', label: 'Exam Prep', icon: GraduationCap, badge: 'KTU' },
            { id: 'flashcards', label: 'Flashcards', icon: Layers },
            { id: 'notes', label: 'Study Notes', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1 rounded uppercase font-bold ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: PDF Viewer */}
        {isPdfPanelOpen && (
          <div className="w-full md:w-[45%] lg:w-[42%] h-full shrink-0 border-r border-slate-200">
            <PdfViewer
              document={document}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onAskAboutPage={handleAskAboutPage}
            />
          </div>
        )}

        {/* Right Side: Active AI Workspace Tab */}
        <div className="flex-1 h-full overflow-hidden bg-white flex flex-col">
          {activeTab === 'summary' && (
            <SummaryTab
              document={document}
              onUpdateSummary={handleUpdateSummary}
              onAskAi={handleAskAiGeneral}
              onGenerateExamQuestions={() => setActiveTab('exam-prep')}
            />
          )}

          {activeTab === 'key-points' && (
            <KeyPointsTab
              document={document}
              onGoToExam={() => setActiveTab('exam-prep')}
              onGoToFlashcards={() => setActiveTab('flashcards')}
            />
          )}

          {activeTab === 'ask-ai' && (
            <ChatTab
              document={document}
              currentPage={currentPage}
              onUpdateHistory={handleUpdateHistory}
              externalPrompt={chatPromptInput}
              onClearExternalPrompt={() => setChatPromptInput(undefined)}
            />
          )}

          {activeTab === 'exam-prep' && (
            <ExamPrepTab
              document={document}
              onUpdateQuestions={handleUpdateQuestions}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsTab
              document={document}
              onUpdateFlashcards={handleUpdateFlashcards}
            />
          )}

          {activeTab === 'notes' && (
            <StudyNotesTab document={document} />
          )}
        </div>
      </div>
    </div>
  );
};
