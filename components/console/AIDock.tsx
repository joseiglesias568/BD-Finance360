'use client';

import { useState } from 'react';
import { Sparkles, Send, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIDockProps {
  consoleTitle: string;
  onSubmit?: (query: string) => void;
}

export default function AIDock({ consoleTitle, onSubmit }: AIDockProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  const handleSubmit = () => {
    if (!query.trim()) return;
    const q = query.trim();
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQuery('');
    setIsExpanded(true);
    onSubmit?.(q);

    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Based on the ${consoleTitle} data, here's what I found regarding "${q}": This analysis draws from the latest quarterly performance data and driver metrics. For deeper analysis, try asking about specific drivers or time periods.`,
        },
      ]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="pointer-events-auto">
          <AnimatePresence>
            {isExpanded && messages.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-b-0 border-gray-200 rounded-t-xl shadow-2xl overflow-hidden max-h-[300px]"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/50">
                  <span className="text-xs font-medium text-gray-500">AI Conversation</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setMessages([]); setIsExpanded(false); }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto max-h-[240px]">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-[#1c519c] text-white'
                          : 'bg-[#F0F0F0]/40 text-[#1c519c] border border-[#1c519c]/10'
                      }`}>
                        {msg.role === 'ai' && (
                          <div className="flex items-center gap-1 mb-1">
                            <Sparkles className="w-3 h-3 text-[#1c519c]" />
                            <span className="text-[10px] font-semibold text-[#1c519c]">AI</span>
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input bar */}
          <div className="bg-white border border-gray-200 rounded-t-xl shadow-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-[#F0F0F0]/50 rounded-lg">
                <Sparkles className="w-4 h-4 text-[#1c519c]" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={`Ask about ${consoleTitle.toLowerCase()}...`}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
              />
              {messages.length > 0 && !isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={!query.trim()}
                className="p-2 bg-[#1c519c] text-white rounded-lg hover:bg-[#1c519c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
