import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Bot,
  Edit2,
  Sparkles,
  Plus,
  Loader2,
  Trash2,
  Bookmark
} from 'lucide-react';
import { StructuredNote, SubjectItem } from '../../types';
import { generateNotesApi } from '../../utils/api';

interface NotesViewProps {
  notes: StructuredNote[];
  subjects: SubjectItem[];
  onAddNote: (note: StructuredNote) => void;
  onDeleteNote: (id: string) => void;
  onAskAiAboutNote: (prompt: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  subjects,
  onAddNote,
  onDeleteNote,
  onAskAiAboutNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // New Note Generator form state
  const [newSubject, setNewSubject] = useState(subjects[0]?.name || 'Computer Networks');
  const [newModule, setNewModule] = useState('Module 1: Architecture');
  const [newTopic, setNewTopic] = useState('');

  const currentNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleCopyNote = (note: StructuredNote) => {
    const text = `# ${note.subject} - ${note.moduleName}
## ${note.title}

📌 Important Concepts:
${note.importantConcepts.map((c, i) => `${i + 1}. ${c.title}\n${c.explanation}`).join('\n\n')}

⭐ Remember:
${note.rememberBox}

📖 Examples:
${note.examples.map((e) => `• ${e.concept} → ${e.example}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadNote = (note: StructuredNote) => {
    const text = `# ${note.subject} - ${note.moduleName}\n## ${note.title}\n\n📌 Important Concepts:\n${note.importantConcepts.map((c, i) => `${i + 1}. ${c.title}\n${c.explanation}`).join('\n\n')}\n\n⭐ Remember:\n${note.rememberBox}\n\n📖 Examples:\n${note.examples.map((e) => `• ${e.concept} → ${e.example}`).join('\n')}\n`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, '_')}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    setIsGenerating(true);
    try {
      const generated = await generateNotesApi(newSubject, newModule, newTopic.trim());
      onAddNote(generated);
      setSelectedNoteId(generated.id);
      setIsCreating(false);
      setNewTopic('');
    } catch (err) {
      console.error('Failed to generate note:', err);
      alert('Could not generate notes. Please check connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-teal-600" />
            <span>AI Smart Notes</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Structured, clutter-free notes with core definitions, remember boxes, and real-world examples.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Note with AI</span>
        </button>
      </div>

      {/* Main split: Note sidebar list + Note detail viewer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: List of notes */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            My Notes ({notes.length})
          </span>
          <div className="space-y-2">
            {notes.map((note) => {
              const isActive = note.id === currentNote?.id;
              return (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isActive
                      ? 'border-teal-500 bg-teal-50/60 shadow-2xs'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-teal-700 uppercase">
                      {note.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {note.dateCreated}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {note.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {note.moduleName}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 columns: Structured Note Display (Section 7) */}
        {currentNote ? (
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
            {/* Header info & Action Buttons (Section 7: [ Edit ] [ Copy ] [ Download ] [ Ask AI ]) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {currentNote.subject} • {currentNote.moduleName}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1.5">
                  {currentNote.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopyNote(currentNote)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                  title="Copy"
                >
                  {copiedId === currentNote.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === currentNote.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleDownloadNote(currentNote)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                  title="Download Markdown"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => onAskAiAboutNote(`Explain the key concepts of "${currentNote.title}" in ${currentNote.subject}`)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>

            {/* 📌 Important Concepts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>📌 Important Concepts</span>
              </h4>

              <div className="space-y-3">
                {currentNote.importantConcepts.map((concept, i) => (
                  <div key={concept.id || i} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                    <h5 className="text-xs font-bold text-slate-900">
                      {concept.title}
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                      {concept.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ⭐ Remember Box (Section 7) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <span>⭐ Remember</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
                {currentNote.rememberBox}
              </p>
            </div>

            {/* 📖 Example Box (Section 7) */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <span>📖 Real-World Examples</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 text-xs">
                {currentNote.examples.map((ex, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-start gap-2">
                    <span className="font-bold text-blue-700 shrink-0">{ex.concept} →</span>
                    <span className="text-slate-700">{ex.example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 p-12 text-center bg-white rounded-3xl border border-slate-200">
            <p className="text-xs text-slate-500">No notes yet. Click above to generate notes!</p>
          </div>
        )}
      </div>

      {/* Generate Note Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 p-6 sm:p-8">
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Generate Notes with AI
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter any topic and AI will structure it with concepts, remember rules, and examples.
            </p>

            <form onSubmit={handleGenerateNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Module / Section</label>
                <input
                  type="text"
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  placeholder="e.g. Module 2: Transport Layer"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic Name</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. TCP vs UDP Protocols or A* Search Algorithm"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTopic.trim() || isGenerating}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Writing Notes...</span>
                    </>
                  ) : (
                    <span>Generate Notes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
