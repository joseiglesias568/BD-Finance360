'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Brain,
  Check,
  Clipboard,
  LineChart,
  Send,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatVisualization from '@/components/chat/ChatVisualization';
import AIFeedback from '@/components/feedback/AIFeedback';
import ThreadSidebar from './ThreadSidebar';

interface Thread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

interface SavedMessage {
  id: string;
  role: string;
  content: string;
  metadata: unknown;
  createdAt: string;
}

const SUGGESTED_PROMPTS = [
  {
    icon: TrendingUp,
    text: 'How is the Finance2030 strategy performing against targets?',
    subtitle: 'Strategy execution',
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: BarChart3,
    text: "What's driving the fee revenue growth recovery in Q1 FY26?",
    subtitle: 'Fee revenue analysis',
    gradient: 'from-blue-500/10 to-blue-500/5',
    iconBg: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: Brain,
    text: 'How does our APAC performance compare to JLL?',
    subtitle: 'Competitive analysis',
    gradient: 'from-amber-500/10 to-amber-500/5',
    iconBg: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: LineChart,
    text: "What's our interest rate hedging position and operating cost exposure?",
    subtitle: 'Cost index exposure',
    gradient: 'from-purple-500/10 to-purple-500/5',
    iconBg: 'bg-purple-500/10 text-purple-600',
  },
];

const FOLLOW_UP_SUGGESTIONS = [
  'What are the key drivers behind this?',
  'Compare advisory vs building operations segment performance trends',
  'Show FM platform deployment progress and efficiency improvement',
  "What's the total FX headwind impact on International this quarter?",
  'Which property type delivers the highest fee revenue per square foot?',
];

// Markdown components for premium rendering
const markdownComponents = {
  p: ({ children }: any) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
  h1: ({ children }: any) => <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0 text-[#1c519c]">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0 text-[#1c519c]">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-[#1c519c]">{children}</h3>,
  ul: ({ children }: any) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
  li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }: any) => <strong className="font-semibold text-[#1c519c]">{children}</strong>,
  em: ({ children }: any) => <em className="italic">{children}</em>,
  code: ({ children, className }: any) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className="block bg-gray-900 text-gray-100 rounded-lg p-3 text-xs font-mono overflow-x-auto my-3">
          {children}
        </code>
      );
    }
    return <code className="bg-[#F0F0F0]/50 text-[#1c519c] px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>;
  },
  pre: ({ children }: any) => <pre className="my-3">{children}</pre>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-[3px] border-[#1c519c]/30 pl-4 italic text-gray-600 my-3">{children}</blockquote>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-gray-200">
      <table className="min-w-full text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-[#F0F0F0]/30">{children}</thead>,
  th: ({ children }: any) => <th className="px-3 py-2 text-left font-semibold text-[#1c519c] border-b border-gray-200">{children}</th>,
  td: ({ children }: any) => <td className="px-3 py-2 border-b border-gray-100">{children}</td>,
  hr: () => <hr className="my-4 border-gray-200" />,
};

// Render message parts with visualization support
function renderMessageParts(parts: any[] | undefined) {
  if (!parts) return null;
  return parts.map((part: any, i: number) => {
    if (part.type === 'text') {
      return (
        <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {part.text}
        </ReactMarkdown>
      );
    }

    if (part.type === 'tool-invocation') {
      if (part.toolInvocation?.toolName === 'generateVisualization' && part.toolInvocation?.state === 'result') {
        return <ChatVisualization key={i} spec={part.toolInvocation.result} />;
      }
      const toolName = part.toolInvocation?.toolName || 'data';
      if (part.toolInvocation?.state === 'result') return null;
      return (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-[#1c519c]/70 my-2"
        >
          <span className="w-3.5 h-3.5 border-2 border-[#1c519c] border-t-transparent rounded-full animate-spin inline-block" />
          <span className="font-medium">Querying {toolName}...</span>
        </motion.span>
      );
    }

    if (typeof part.type === 'string' && part.type.startsWith('tool-')) {
      const toolName = part.type.replace(/^tool-/, '');
      return (
        <span key={i} className="flex items-center gap-2 text-xs text-[#1c519c]/70 my-2">
          <span className="w-3.5 h-3.5 border-2 border-[#1c519c] border-t-transparent rounded-full animate-spin inline-block" />
          <span className="font-medium">Querying {toolName}...</span>
        </span>
      );
    }
    return null;
  });
}

function formatTimestamp(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-gray-400 hover:text-[#1c519c] hover:bg-[#F0F0F0]/50 transition-all"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#1c519c]" /> : <Clipboard className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function AISearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  // Thread state
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const activeThreadRef = useRef<string | null>(null);
  const [loadedMessages, setLoadedMessages] = useState<SavedMessage[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);

  // Keep ref in sync with state
  useEffect(() => { activeThreadRef.current = activeThreadId; }, [activeThreadId]);

  // Stable transport
  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    []
  );
  const { messages, sendMessage, status, error, setMessages } = useChat({ transport });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasAutoSent = useRef(false);
  const pendingSaveRef = useRef<{ threadId: string; userText: string } | null>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  // Fetch threads
  const fetchThreads = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/threads');
      if (res.ok) setThreads(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  // Load thread messages when switching threads
  useEffect(() => {
    if (!activeThreadId) {
      setLoadedMessages([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/chat/threads/${activeThreadId}`);
        if (res.ok) {
          const data = await res.json();
          setLoadedMessages(data.messages || []);
        }
      } catch { /* ignore */ }
    })();
  }, [activeThreadId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadedMessages]);

  // Focus input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [activeThreadId]);

  // Handle initial query from search bar redirect
  useEffect(() => {
    if (initialQuery && !hasAutoSent.current) {
      hasAutoSent.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist messages to DB when streaming completes
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === 'streaming' && status === 'ready' && pendingSaveRef.current) {
      const { threadId, userText } = pendingSaveRef.current;
      pendingSaveRef.current = null;

      // Extract assistant text from last message
      const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
      const assistantText = lastAssistant?.parts
        ?.filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('') || '';

      if (assistantText) {
        // Save both messages to DB
        Promise.all([
          fetch(`/api/chat/threads/${threadId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'user', content: userText }),
          }),
          fetch(`/api/chat/threads/${threadId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'assistant', content: assistantText }),
          }),
        ]).then(() => fetchThreads());
      }

      // Show follow-up suggestions
      setShowFollowUps(true);
    }
    prevStatus.current = status;
  }, [status, messages, fetchThreads]);

  const handleSendMessage = async (text: string) => {
    setShowFollowUps(false);
    let threadId = activeThreadRef.current;

    // Create thread if none active
    if (!threadId) {
      try {
        const res = await fetch('/api/chat/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: text.length > 60 ? text.slice(0, 57) + '...' : text }),
        });
        if (res.ok) {
          const thread = await res.json();
          threadId = thread.id;
          setActiveThreadId(thread.id);
          activeThreadRef.current = thread.id;
          setLoadedMessages([]);
          fetchThreads();
        }
      } catch { return; }
    }

    // Mark for saving after stream completes
    pendingSaveRef.current = { threadId: threadId!, userText: text };

    // Send via useChat (streaming)
    sendMessage({ text });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue('');
    await handleSendMessage(text);
  };

  const handleNewChat = () => {
    setActiveThreadId(null);
    activeThreadRef.current = null;
    setLoadedMessages([]);
    setMessages([]);
    setInputValue('');
    setShowFollowUps(false);
    router.replace('/ai-search');
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    activeThreadRef.current = id;
    setMessages([]);
    setShowFollowUps(false);
  };

  const handleDeleteThread = async (id: string) => {
    try {
      await fetch(`/api/chat/threads/${id}`, { method: 'DELETE' });
      if (id === activeThreadId) {
        handleNewChat();
      }
      await fetchThreads();
    } catch { /* ignore */ }
  };

  const handleRenameThread = async (id: string, title: string) => {
    try {
      await fetch(`/api/chat/threads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      await fetchThreads();
    } catch { /* ignore */ }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const showLanding = !activeThreadId && messages.length === 0;
  const hasMessages = loadedMessages.length > 0 || messages.length > 0;

  // Get text content of a message for copy
  const getMessageText = (msg: any): string => {
    if (msg.content) return msg.content;
    if (msg.parts) {
      return msg.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('');
    }
    return '';
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] bg-[#FAFBFC]">
      {/* Sidebar */}
      <ThreadSidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onNewChat={handleNewChat}
        onDeleteThread={handleDeleteThread}
        onRenameThread={handleRenameThread}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat content */}
        <div className="flex-1 overflow-y-auto">
          {showLanding ? (
            <div className="max-w-2xl mx-auto px-6 pt-20 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center mb-14"
              >
                {/* Premium icon */}
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1c519c] to-[#1c519c] shadow-xl shadow-[#1c519c]/20" />
                  <div className="absolute inset-0 rounded-3xl flex items-center justify-center">
                    <Sparkles className="w-9 h-9 text-white" />
                  </div>
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#1c519c]/20 to-transparent blur-xl -z-10" />
                </div>
                <h1 className="text-3xl font-bold text-[#1c519c] mb-3 tracking-tight">
                  What can I help you analyze?
                </h1>
                <p className="text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
                  Ask me about financials, KPIs, segment performance, strategic initiatives, or generate visualizations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {SUGGESTED_PROMPTS.map(({ icon: Icon, text, subtitle, gradient, iconBg }, idx) => (
                  <motion.button
                    key={text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.08 }}
                    onClick={() => {
                      setInputValue(text);
                      inputRef.current?.focus();
                    }}
                    className={`group relative flex items-start gap-3.5 p-4 bg-gradient-to-br ${gradient} border border-gray-200/60 rounded-2xl hover:border-[#1c519c]/20 hover:shadow-lg hover:shadow-[#1c519c]/5 transition-all duration-300 text-left`}
                  >
                    <div className={`p-2.5 rounded-xl ${iconBg} flex-shrink-0 transition-transform group-hover:scale-105`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1 block">{subtitle}</span>
                      <span className="text-sm text-gray-700 group-hover:text-[#1c519c] leading-snug block">{text}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
              {/* Previously saved messages from DB */}
              {loadedMessages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'user' ? (
                    <div className="max-w-[75%]">
                      <div className="bg-[#1c519c] text-white rounded-2xl rounded-br-md px-5 py-3 text-sm shadow-sm">
                        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1.5 text-right pr-1">
                        {formatTimestamp(msg.createdAt)}
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%] flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1c519c] to-[#1c519c] flex items-center justify-center shadow-sm">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-[#1c519c]">Delta AI</span>
                          <span className="text-[10px] text-gray-400">{formatTimestamp(msg.createdAt)}</span>
                        </div>
                        <div className="bg-white rounded-2xl rounded-tl-md px-5 py-4 text-sm text-gray-800 border border-gray-100 shadow-sm">
                          <div className="prose-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 ml-1">
                          <CopyButton text={msg.content} />
                          <AIFeedback contentId={msg.id} contentType="chat-message" size="sm" />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Live streaming messages from useChat */}
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'user' ? (
                    <div className="max-w-[75%]">
                      <div className="bg-[#1c519c] text-white rounded-2xl rounded-br-md px-5 py-3 text-sm shadow-sm">
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {message.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || ''}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%] flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1c519c] to-[#1c519c] flex items-center justify-center shadow-sm">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-[#1c519c]">Delta AI</span>
                          {status === 'streaming' && (
                            <span className="text-[10px] text-[#1c519c] font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#1c519c] rounded-full animate-pulse" />
                              Responding
                            </span>
                          )}
                        </div>
                        <div className="bg-white rounded-2xl rounded-tl-md px-5 py-4 text-sm text-gray-800 border border-gray-100 shadow-sm">
                          <div className="prose-sm">
                            {renderMessageParts(message.parts)}
                          </div>
                        </div>
                        {status === 'ready' && (
                          <div className="flex items-center gap-1 mt-1.5 ml-1">
                            <CopyButton text={getMessageText(message)} />
                            <AIFeedback contentId={message.id} contentType="chat-message" size="sm" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Premium loading indicator */}
              {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1c519c] to-[#1c519c] flex items-center justify-center shadow-sm">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-[#1c519c]">Delta AI</span>
                        <span className="text-[10px] text-[#1c519c] font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#1c519c] rounded-full animate-pulse" />
                          Analyzing
                        </span>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-md px-5 py-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[#1c519c]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-[#1c519c]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-[#1c519c]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-xs text-gray-400 ml-1">Searching data sources...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Follow-up suggestions */}
              <AnimatePresence>
                {showFollowUps && !isLoading && hasMessages && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 pl-11"
                  >
                    {FOLLOW_UP_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInputValue(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-[#1c519c] hover:border-[#1c519c]/30 hover:bg-[#F0F0F0]/20 transition-all duration-200 shadow-sm hover:shadow"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 text-lg font-bold">!</span>
                  </div>
                  <div>
                    <p className="font-medium">Something went wrong</p>
                    <p className="text-xs text-red-600 mt-0.5">{error.message || 'Failed to get response. Please try again.'}</p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Premium input area */}
        <div className="p-4 pb-5">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg shadow-gray-900/5 focus-within:ring-2 focus-within:ring-[#1c519c]/20 focus-within:border-[#1c519c]/30 transition-all duration-200">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about financials, KPIs, trends..."
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-none min-h-[24px] max-h-[120px] leading-relaxed"
                  rows={1}
                  disabled={isLoading}
                  style={{ height: 'auto', overflow: 'hidden' }}
                  onInput={e => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2.5 bg-[#1c519c] hover:bg-[#1c519c] text-white rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              AI responses may not always be accurate. Verify critical data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
