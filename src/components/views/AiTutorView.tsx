import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  FileText,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { TutorMessage, SubjectItem } from '../../types';
import { sendChatMessageApi } from '../../utils/api';

interface AiTutorViewProps {
  subjects: SubjectItem[];
  initialSubject?: string;
  initialPrompt?: string;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({
  subjects,
  initialSubject,
  initialPrompt,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'All Subjects');
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'tutor-welcome',
      role: 'model',
      text: 'Hi Fathima! What would you like to learn today? 😊 Ask me anything about your subjects or choose a quick prompt below.',
      timestamp: 'Just now',
      suggestedPrompts: [
        'Explain TCP in simple words',
        'How does A* search work?',
        'What is context switching in OS?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string, promptPrefix?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const fullMessage = promptPrefix ? `${promptPrefix}: ${query}` : query;

    const userMsg: TutorMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      text: fullMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const subjectContext = selectedSubject !== 'All Subjects' ? `Context: Student is studying ${selectedSubject}.` : '';

      const res = await sendChatMessageApi(
        selectedSubject,
        subjectContext,
        newHistory.map((m) => ({ role: m.role, text: m.text })),
        fullMessage
      );

      const aiMsg: TutorMessage = {
        id: 'ai-' + Date.now(),
        role: 'model',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: res.suggestedQuestions,
      };

      setMessages([...newHistory, aiMsg]);
    } catch (err: any) {
      console.error('Tutor error:', err);
      const errorMsg: TutorMessage = {
        id: 'err-' + Date.now(),
        role: 'model',
        text: 'I ran into a temporary issue retrieving the explanation. Please try asking again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickAction = (mode: string) => {
    const currentInput = input.trim();
    if (!currentInput) {
      if (mode === 'Explain Simply') {
        handleSendMessage('Explain TCP in simple words');
      } else if (mode === 'Give Example') {
        handleSendMessage('Give me a real-world example of client-server network architecture');
      } else if (mode === 'Quiz Me') {
        handleSendMessage('Quiz me on 3 important questions from Computer Networks');
      } else if (mode === 'Explain for Exam') {
        handleSendMessage('Explain Process Scheduling for a university exam with 5 key points');
      } else if (mode === 'Make Short Notes') {
        handleSendMessage('Make short revision notes for the OSI 7-layer model');
      }
      return;
    }

    if (mode === 'Explain Simply') {
      handleSendMessage(currentInput, 'Please explain this concept in simple words with a plain analogy');
    } else if (mode === 'Give Example') {
      handleSendMessage(currentInput, 'Give a clear real-world everyday example of');
    } else if (mode === 'Quiz Me') {
      handleSendMessage(currentInput, 'Quiz me with an active recall question about');
    } else if (mode === 'Explain for Exam') {
      handleSendMessage(currentInput, 'Explain this in an exam-oriented format with definitions and marking scheme');
    } else if (mode === 'Make Short Notes') {
      handleSendMessage(currentInput, 'Create concise, bulleted revision notes for');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full bg-slate-50/50">
      {/* Top Subject Switcher & Reset */}
      <div className="px-6 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>StudyAI Personal Tutor</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded font-semibold border border-emerald-200/60">
                Online
              </span>
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-slate-400">Subject context:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-[11px] font-bold text-indigo-700 bg-indigo-50/80 border border-indigo-200/60 rounded px-2 py-0.5 outline-none"
              >
                <option value="All Subjects">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset conversation with AI Tutor?')) {
              setMessages([
                {
                  id: 'reset',
                  role: 'model',
                  text: 'Hi Fathima! Chat reset. What would you like to explore next?',
                  timestamp: 'Just now',
                },
              ]);
            }
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs flex items-center gap-1"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Thread (Section 6) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col gap-1 min-w-0 max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-2xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                </div>

                <div
                  className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-600 p-0.5"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Suggested follow-up prompt chips */}
                {!isUser && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1 pt-1">
                    {msg.suggestedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(p)}
                        className="text-[11px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-lg px-2.5 py-1 text-left transition-colors font-medium"
                      >
                        {p} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 rounded-tl-xs shadow-2xs flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span>AI Tutor is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick AI Buttons (Section 6: [Explain Simply] [Give Example] [Quiz Me] [Explain for Exam] [Make Short Notes]) */}
      <div className="px-4 py-2 bg-white/80 border-t border-slate-200/60 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Quick AI:
          </span>
          {[
            'Explain Simply',
            'Give Example',
            'Quiz Me',
            'Explain for Exam',
            'Make Short Notes',
          ].map((btn) => (
            <button
              key={btn}
              onClick={() => handleQuickAction(btn)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 font-semibold transition-colors"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask anything about your study material..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
