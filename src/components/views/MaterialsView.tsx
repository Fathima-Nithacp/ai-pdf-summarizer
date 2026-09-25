import React, { useState } from 'react';
import {
  FileText,
  Upload,
  ArrowRight,
  Trash2,
  Sparkles,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { PdfViewer } from '../PdfViewer';
import { SummaryTab } from '../SummaryTab';
import { KeyPointsTab } from '../KeyPointsTab';
import { ExamPrepTab } from '../ExamPrepTab';
import { FlashcardsTab } from '../FlashcardsTab';

interface MaterialsViewProps {
  documents: DocumentItem[];
  activeDocument: DocumentItem | null;
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenUpload: () => void;
  onDeleteDocument: (id: string) => void;
  onUpdateDocument: (doc: DocumentItem) => void;
  onAskAiTutor: (prompt: string) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  documents,
  activeDocument,
  onSelectDocument,
  onOpenUpload,
  onDeleteDocument,
  onUpdateDocument,
  onAskAiTutor,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'keypoints' | 'examprep' | 'flashcards'>('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPdfPanelOpen, setIsPdfPanelOpen] = useState(true);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Top Document selector bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Material:
          </span>
          {documents.map((doc) => {
            const isSelected = activeDocument?.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => {
                  onSelectDocument(doc);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="max-w-[140px] truncate">{doc.name}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/60 whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Upload Material</span>
          </button>
        </div>

        {/* Action button */}
        {activeDocument && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPdfPanelOpen(!isPdfPanelOpen)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 text-xs"
              title={isPdfPanelOpen ? 'Hide PDF' : 'Show PDF'}
            >
              {isPdfPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {activeDocument ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: PDF Viewer */}
          {isPdfPanelOpen && (
            <div className="w-full md:w-[45%] lg:w-[42%] h-full shrink-0 border-r border-slate-200">
              <PdfViewer
                document={activeDocument}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onAskAboutPage={(page, text) => {
                  onAskAiTutor(`Please analyze Page ${page} of ${activeDocument.name}: ${text.slice(0, 1000)}`);
                }}
              />
            </div>
          )}

          {/* Right: AI Tools Tabs */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            <div className="px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-bold">
              {[
                { id: 'summary', label: 'Summary' },
                { id: 'keypoints', label: 'Key Points' },
                { id: 'examprep', label: 'Exam Questions' },
                { id: 'flashcards', label: 'Flashcards' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden">
              {activeTab === 'summary' && (
                <SummaryTab
                  document={activeDocument}
                  onUpdateSummary={(summary) => onUpdateDocument({ ...activeDocument, summary })}
                  onAskAi={(q) => onAskAiTutor(q)}
                  onGenerateExamQuestions={() => setActiveTab('examprep')}
                />
              )}
              {activeTab === 'keypoints' && (
                <KeyPointsTab
                  document={activeDocument}
                  onGoToExam={() => setActiveTab('examprep')}
                  onGoToFlashcards={() => setActiveTab('flashcards')}
                />
              )}
              {activeTab === 'examprep' && (
                <ExamPrepTab
                  document={activeDocument}
                  onUpdateQuestions={(examQuestions) => onUpdateDocument({ ...activeDocument, examQuestions })}
                />
              )}
              {activeTab === 'flashcards' && (
                <FlashcardsTab
                  document={activeDocument}
                  onUpdateFlashcards={(flashcards) => onUpdateDocument({ ...activeDocument, flashcards })}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Upload Prompt View matching Section 5 */
        <div className="p-8 max-w-xl mx-auto my-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900">
              Add Study Material
            </h3>
            <p className="text-xs text-slate-500">
              Supported formats: PDF, TXT, DOCX
            </p>
          </div>

          <div
            onClick={onOpenUpload}
            className="cursor-pointer border-2 border-dashed border-slate-300 rounded-3xl p-8 hover:border-indigo-400 bg-white hover:bg-indigo-50/20 transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Drag PDF here
            </p>
            <div className="flex items-center gap-3 w-32 mx-auto">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">OR</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Upload PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
