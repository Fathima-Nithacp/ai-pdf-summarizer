import React, { useState } from 'react';
import { FileText, ArrowRight, Trash2, Edit2, Download, Check, Search, Upload, Plus, Sparkles, BookOpen } from 'lucide-react';
import { DocumentItem } from '../types';

interface HistoryViewProps {
  documents: DocumentItem[];
  onOpenDoc: (doc: DocumentItem) => void;
  onDeleteDoc: (id: string) => void;
  onRenameDoc: (id: string, newName: string) => void;
  onOpenUpload: () => void;
  onLoadSamples: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  documents,
  onOpenDoc,
  onDeleteDoc,
  onRenameDoc,
  onOpenUpload,
  onLoadSamples,
}) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const startRename = (doc: DocumentItem) => {
    setEditingId(doc.id);
    setEditName(doc.name);
  };

  const saveRename = (id: string) => {
    if (editName.trim()) {
      onRenameDoc(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleDownloadSummary = (doc: DocumentItem) => {
    if (!doc.summary) return;
    const content = `# Summary: ${doc.name}\n\n${doc.summary.executiveSummary}\n\n## Key Takeaways:\n${doc.summary.keyTakeaways.map((t) => `- ${t}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.name.replace(/\.[^/.]+$/, '')}_Summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Page Title & Top CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            My Documents & Study History
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access, study, or export your previously analyzed PDF notes and summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadSamples}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            Load Sample Notes
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New PDF</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Filter documents by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
      </div>

      {/* Document Cards List matching User ASCII Mockup */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No documents found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search ? 'No documents matched your filter.' : 'Upload your first PDF or load sample study materials to get started.'}
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
            >
              Upload PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 bg-white border border-slate-200/90 rounded-2xl hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 font-bold text-xs">
                  PDF
                </div>
                <div className="min-w-0">
                  {editingId === doc.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 text-sm font-bold text-slate-900 border border-indigo-400 rounded focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveRename(doc.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {doc.name}
                      </h4>
                      {doc.isSample && (
                        <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.2 rounded">
                          Sample
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-400 mt-0.5">
                    Summary generated • {doc.uploadDate} • {doc.pageCount} pages • {doc.size}
                  </p>

                  {doc.summary && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-1 italic">
                      "{doc.summary.shortSummary || doc.summary.executiveSummary}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => startRename(doc)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Rename Document"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {doc.summary && (
                  <button
                    onClick={() => handleDownloadSummary(doc)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Download Summary"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onDeleteDoc(doc.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenDoc(doc)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
