import React, { useState, useEffect } from 'react';
import { AppView, DocumentItem } from './types';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { UploadModal } from './components/UploadModal';
import { SettingsModal } from './components/SettingsModal';

const LOCAL_STORAGE_KEY = 'pdf_ai_documents_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return SAMPLE_DOCUMENTS;
  });

  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [documents]);

  const activeDoc = documents.find((d) => d.id === activeDocId) || null;

  const handleDocumentReady = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
    setActiveDocId(newDoc.id);
    setCurrentView('dashboard');
  };

  const handleOpenDoc = (doc: DocumentItem) => {
    setActiveDocId(doc.id);
    setCurrentView('dashboard');
  };

  const handleDeleteDoc = (id: string) => {
    if (window.confirm('Are you sure you want to remove this document from history?')) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (activeDocId === id) {
        setActiveDocId(null);
        setCurrentView('home');
      }
    }
  };

  const handleRenameDoc = (id: string, newName: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name: newName } : d))
    );
  };

  const handleResetSamples = () => {
    setDocuments(SAMPLE_DOCUMENTS);
    setActiveDocId(SAMPLE_DOCUMENTS[0].id);
  };

  const handleUpdateActiveDoc = (updated: DocumentItem) => {
    setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeDoc={activeDoc}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        historyCount={documents.length}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomeView
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onSelectSampleDoc={(doc) => {
              setActiveDocId(doc.id);
              setCurrentView('dashboard');
            }}
            sampleDocs={documents.filter((d) => d.isSample)}
          />
        )}

        {currentView === 'dashboard' && (
          activeDoc ? (
            <DashboardView
              document={activeDoc}
              onUpdateDocument={handleUpdateActiveDoc}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
              <h3 className="text-lg font-bold text-slate-800">No Document Selected</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Please upload a PDF or choose a document from History.
              </p>
              <button
                onClick={() => setCurrentView('home')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
              >
                Back to Home
              </button>
            </div>
          )
        )}

        {currentView === 'history' && (
          <HistoryView
            documents={documents}
            onOpenDoc={handleOpenDoc}
            onDeleteDoc={handleDeleteDoc}
            onRenameDoc={handleRenameDoc}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onLoadSamples={handleResetSamples}
          />
        )}
      </main>

      {/* Upload Flow Modal with animated progress indicator */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentReady={handleDocumentReady}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetSamples={handleResetSamples}
      />
    </div>
  );
}
