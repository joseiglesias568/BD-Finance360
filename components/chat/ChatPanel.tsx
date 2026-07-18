'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ChatVisualization from './ChatVisualization';
import AIFeedback from '@/components/feedback/AIFeedback';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const SUGGESTED_PROMPTS = [
  'How is our revenue trending this quarter?',
  'What are the key risks facing Delta?',
  'Summarize our premium revenue performance',
  'Show me a chart of quarterly revenue trends',
];

export default function ChatPanel({ isOpen, onClose, initialQuery }: ChatPanelProps) {
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSetInitialQuery = useRef(false);

  const isLoading = status === 'submitted' || status === 'streaming';

  // Set initial query when panel opens
  useEffect(() => {
    if (isOpen && initialQuery && !hasSetInitialQuery.current) {
      setInputValue(initialQuery);
      hasSetInitialQuery.current = true;
    }
    if (!isOpen) {
      hasSetInitialQuery.current = false;
    }
  }, [isOpen, initialQuery]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue });
    setInputValue('');
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  // Render message parts with visualization support
  const renderMessageParts = (parts: any[] | undefined) => {
    if (!parts) return null;
    return parts.map((part: any, i: number) => {
      if (part.type === 'text') return <span key={i}>{part.text}</span>;

      // Handle tool invocations (Vercel AI SDK v6 format)
      if (part.type === 'tool-invocation') {
        if (part.toolInvocation?.toolName === 'generateVisualization' && part.toolInvocation?.state === 'result') {
          return <ChatVisualization key={i} spec={part.toolInvocation.result} />;
        }
        const toolName = part.toolInvocation?.toolName || 'data';
        if (part.toolInvocation?.state === 'result') return null; // Hide completed tool results (data already used by AI)
        return (
          <span key={i} className="flex items-center gap-1.5 text-xs text-gray-500 italic my-1">
            <span className="w-3 h-3 border-2 border-[#003B2C] border-t-transparent rounded-full animate-spin inline-block" />
            Querying {toolName}...
          </span>
        );
      }

      // Fallback for older SDK format
      if (typeof part.type === 'string' && part.type.startsWith('tool-')) {
        const toolName = part.type.replace(/^tool-/, '');
        return (
          <span key={i} className="block text-xs text-gray-500 italic my-1">
            Querying {toolName}...
          </span>
        );
      }
      return null;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#003B2C] text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h2 className="font-semibold text-sm">Delta Finance360 AI</h2>
                <span className="text-[9px] font-medium px-1.5 py-0.5 bg-white/20 rounded">Claude</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#F0F0F0] flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[#003B2C]" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Ask me anything</h3>
                  <p className="text-xs text-gray-500 mb-6">
                    I can query Delta financial data, analyze KPIs, generate charts, and provide strategic insights.
                  </p>
                  <div className="space-y-2">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSuggestedPrompt(prompt)}
                        className="block w-full text-left px-3 py-2 text-xs text-gray-600 bg-gray-50 hover:bg-[#F0F0F0]/50 rounded-lg transition-colors border border-gray-100"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${message.role === 'user' ? '' : 'flex flex-col'}`}>
                    <div
                      className={`rounded-xl px-3.5 py-2.5 text-sm ${
                        message.role === 'user'
                          ? 'bg-[#003B2C] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {renderMessageParts(message.parts)}
                      </div>
                    </div>
                    {/* Feedback for assistant messages */}
                    {message.role === 'assistant' && (
                      <div className="mt-1 ml-1">
                        <AIFeedback contentId={message.id} contentType="chat-message" size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#003B2C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#003B2C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#003B2C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                  {error.message || 'Failed to get response. Please try again.'}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about Delta financials..."
                  className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003B2C]/30 focus:border-[#003B2C]/30"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2.5 bg-[#003B2C] hover:bg-[#007A3D] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                Powered by Claude. AI responses may not always be accurate. Verify critical data.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
