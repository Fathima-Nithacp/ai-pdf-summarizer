import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Copy, Check, CornerDownLeft, RotateCcw, Loader2 } from 'lucide-react';
import { ChatMessage, DocumentItem } from '../types';
import { sendChatMessageApi } from '../utils/api';

interface ChatTabProps {
  document: DocumentItem;
  currentPage: number;
  onUpdateHistory: (history: ChatMessage[]) => void;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  document,
  currentPage,
  onUpdateHistory,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const history = document.chatHistory || [];

  const quickPrompts = [
    'Explain simply',
    'Summarize this page',
    'Give an example',
    'Generate questions',
    'Explain for exam',
    'Key definitions',
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  // Handle external prompts (e.g. from "Ask AI about this page" or concept cards)
  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...history, userMessage];
    onUpdateHistory(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const activePageObj = document.pages.find((p) => p.pageNumber === currentPage);
      const pageContext = activePageObj ? `Page ${activePageObj.pageNumber}: ${activePageObj.text.slice(0, 1500)}` : undefined;

      const response = await sendChatMessageApi(
        document.name,
        document.fullText,
        newHistory.map((m) => ({ role: m.role, text: m.text })),
        message,
        pageContext
      );

      const aiMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        role: 'model',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: response.suggestedQuestions,
      };

      onUpdateHistory([...newHistory, aiMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'model',
        text: 'Sorry, I encountered an issue analyzing that request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onUpdateHistory([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickPromptClick = (prompt: string) => {
    if (prompt === 'Summarize this page') {
      const activePage = document.pages.find((p) => p.pageNumber === currentPage);
      handleSendMessage(`Please summarize Page ${currentPage} of this document in clear, concise bullet points.`);
    } else if (prompt === 'Explain for exam') {
      handleSendMessage('Explain the most critical concept in this document as if preparing for an official university exam (focusing on definitions, marks distribution, and core diagrams/steps).');
    } else {
      handleSendMessage(`${prompt} based on the document.`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Bar */}
      <div className="px-6 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">Ask about this PDF</h3>
            <p className="text-[11px] text-slate-400">
              Grounded exclusively in {document.name}
            </p>
          </div>
        </div>

        {history.length > 1 && (
          <button
            onClick={() => {
              if (window.confirm('Clear conversation history?')) {
                onUpdateHistory([
                  {
                    id: 'reset-' + Date.now(),
                    role: 'model',
                    text: `Chat history cleared. What would you like to know about ${document.name}?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-xs flex items-center gap-1"
            title="Reset Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {history.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col gap-1 min-w-0 max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                </div>

                {/* Footer with timestamp and copy button */}
                <div
                  className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="hover:text-slate-600 p-0.5"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Suggested follow-up chips if AI message */}
                {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-1">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-[11px] text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/60 rounded-lg px-2.5 py-1 text-left transition-colors"
                      >
                        {q} →
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 rounded-tl-xs shadow-xs flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span>Analyzing document context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-white/70 border-t border-slate-200/60 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Prompts:
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPromptClick(prompt)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/70 transition-colors font-medium"
            >
              {prompt}
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
            placeholder="Ask something about this PDF..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
