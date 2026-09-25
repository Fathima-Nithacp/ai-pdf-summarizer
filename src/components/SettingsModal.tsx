import React from 'react';
import { Settings, X, Sparkles, Check, RefreshCw, Cpu, BookOpen, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSamples: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetSamples,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Settings & Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-600">
          {/* AI Model Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Active Model
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Running <span className="font-mono text-slate-700 font-semibold">gemini-3.8-flash</span> via server-side Gemini API for low latency and high quality document analysis.
            </p>
          </div>

          {/* Academic Features */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs block">
              Academic Examination System
            </label>
            <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>KTU & University Question Standards</span>
                <span className="text-emerald-600 text-[11px] font-bold">Enabled</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Questions are partitioned into 3 Mark (Short Definitions), 5 Mark (Explanations), and 9 Mark (Comprehensive Essays) with model answers.
              </p>
            </div>
          </div>

          {/* Data & Storage */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800">Reset Sample Notes</h4>
                <p className="text-[11px] text-slate-400">
                  Restore pre-loaded Operating Systems and Computer Networks sample notes.
                </p>
              </div>
              <button
                onClick={() => {
                  onResetSamples();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
