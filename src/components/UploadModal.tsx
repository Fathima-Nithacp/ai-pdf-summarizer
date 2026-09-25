import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, CircleDot, AlertCircle, X, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { UploadProgressState, DocumentItem } from '../types';
import { extractTextFromPdfFile, formatFileSize } from '../utils/pdfExtractor';
import { generateSummaryApi, generateExamQuestionsApi, generateFlashcardsApi } from '../utils/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentReady: (doc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentReady,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadState, setUploadState] = useState<UploadProgressState>({
    isUploading: false,
    fileName: '',
    fileSize: '',
    progress: 0,
    stage: 'ready',
    statusMessage: '',
  });

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadState({
        isUploading: false,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        progress: 0,
        stage: 'ready',
        statusMessage: '',
        error: 'Please upload a valid .pdf file.',
      });
      return;
    }

    const fileSizeStr = formatFileSize(file.size);
    setUploadState({
      isUploading: true,
      fileName: file.name,
      fileSize: fileSizeStr,
      progress: 15,
      stage: 'uploaded',
      statusMessage: 'PDF uploaded successfully. Extracting text content...',
      error: undefined,
    });

    try {
      // Step 1: Text extraction via pdfjs
      await new Promise((r) => setTimeout(r, 400));
      setUploadState((s) => ({
        ...s,
        progress: 35,
        stage: 'extracted',
        statusMessage: 'Extracting text and page boundaries...',
      }));

      const extraction = await extractTextFromPdfFile(file);
      
      if (!extraction.fullText || extraction.fullText.trim().length === 0) {
        throw new Error('Could not extract readable text from this PDF. It might be scanned or protected.');
      }

      // Step 2: AI analyzing & summarizing
      setUploadState((s) => ({
        ...s,
        progress: 60,
        stage: 'analyzing',
        statusMessage: `AI analyzing ${extraction.pageCount} pages and core concepts...`,
      }));

      // Generate AI summary
      const summary = await generateSummaryApi(file.name, extraction.fullText, 'standard');

      // Step 3: Quick study pack generation (flashcards + starter exam questions)
      setUploadState((s) => ({
        ...s,
        progress: 85,
        stage: 'generated',
        statusMessage: 'Synthesizing key points, exam questions & flashcards...',
      }));

      let examQuestions = undefined;
      let flashcards = undefined;

      try {
        const [qRes, fcRes] = await Promise.all([
          generateExamQuestionsApi(file.name, extraction.fullText, 'mixed', 5, 'medium'),
          generateFlashcardsApi(file.name, extraction.fullText, 8),
        ]);
        examQuestions = qRes.questions;
        flashcards = fcRes.flashcards;
      } catch (err) {
        console.warn('Optional study material generation deferred:', err);
      }

      setUploadState((s) => ({
        ...s,
        progress: 100,
        stage: 'ready',
        statusMessage: 'Ready! Launching your study workspace...',
      }));

      await new Promise((r) => setTimeout(r, 500));

      const newDoc: DocumentItem = {
        id: 'doc-' + Date.now(),
        name: file.name,
        size: fileSizeStr,
        pageCount: extraction.pageCount,
        uploadDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        fullText: extraction.fullText,
        pages: extraction.pages,
        summary,
        examQuestions,
        flashcards,
        chatHistory: [
          {
            id: 'init-' + Date.now(),
            role: 'model',
            text: `Hello! I have analyzed **${file.name}** (${extraction.pageCount} pages). I am ready to answer your questions, clarify complex concepts, or test your knowledge!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedQuestions: [
              'Summarize the core concepts',
              'Explain the main definitions simply',
              'What are the key exam topics here?',
            ],
          },
        ],
      };

      onDocumentReady(newDoc);
      onClose();
    } catch (error: any) {
      console.error('File processing error:', error);
      setUploadState((s) => ({
        ...s,
        isUploading: false,
        error: error.message || 'An error occurred while processing the PDF. Please try again.',
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              {uploadState.isUploading ? 'Processing Document' : 'Upload PDF Document'}
            </h3>
          </div>
          {!uploadState.isUploading && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {uploadState.isUploading ? (
            /* Upload in progress state matching user ASCII drawing */
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 truncate max-w-[260px]">
                        {uploadState.fileName}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {uploadState.fileSize}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/50">
                    {uploadState.progress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden my-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadState.progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  <span>{uploadState.statusMessage}</span>
                </div>
              </div>

              {/* Status checklist */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Processing pipeline
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>PDF uploaded securely</span>
                  </div>

                  <div
                    className={`flex items-center gap-2.5 font-medium ${
                      uploadState.progress >= 35 ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {uploadState.progress >= 35 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <CircleDot className="w-4 h-4 text-slate-300" />
                    )}
                    <span>Text extracted & parsed</span>
                  </div>

                  <div
                    className={`flex items-center gap-2.5 font-medium ${
                      uploadState.progress >= 60
                        ? uploadState.progress >= 85
                          ? 'text-emerald-600'
                          : 'text-indigo-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {uploadState.progress >= 85 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : uploadState.progress >= 60 ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    ) : (
                      <CircleDot className="w-4 h-4 text-slate-300" />
                    )}
                    <span>AI analyzing key concepts & structure</span>
                  </div>

                  <div
                    className={`flex items-center gap-2.5 font-medium ${
                      uploadState.progress >= 100
                        ? 'text-emerald-600'
                        : uploadState.progress >= 85
                        ? 'text-indigo-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {uploadState.progress >= 100 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : uploadState.progress >= 85 ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    ) : (
                      <CircleDot className="w-4 h-4 text-slate-300" />
                    )}
                    <span>Summary, flashcards & exam questions generated</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Drag and Drop Upload Area */
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleProcessFile(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 flex flex-col items-center justify-center ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>

                <h4 className="text-base font-bold text-slate-800">
                  Drag & Drop PDF here
                </h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Supports lecture notes, textbooks, research papers, study guides (up to 50MB)
                </p>

                <div className="flex items-center gap-3 w-full max-w-[200px] my-1">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    OR
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm hover:shadow transition-all"
                >
                  Choose PDF from Computer
                </button>
              </div>

              {uploadState.error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{uploadState.error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
