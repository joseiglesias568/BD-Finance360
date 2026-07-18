'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft, Pencil, Check, X, Search } from 'lucide-react';

interface Thread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

interface ThreadSidebarProps {
  threads: Thread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewChat: () => void;
  onDeleteThread: (id: string) => void;
  onRenameThread: (id: string, title: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function groupByDate(threads: Thread[]): Record<string, Thread[]> {
  const groups: Record<string, Thread[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  for (const thread of threads) {
    const date = new Date(thread.updatedAt);
    let label: string;
    if (date >= today) label = 'Today';
    else if (date >= yesterday) label = 'Yesterday';
    else if (date >= weekAgo) label = 'Previous 7 Days';
    else label = 'Older';
    if (!groups[label]) groups[label] = [];
    groups[label].push(thread);
  }
  return groups;
}

export default function ThreadSidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onNewChat,
  onDeleteThread,
  onRenameThread,
  isCollapsed,
  onToggleCollapse,
}: ThreadSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = searchQuery
    ? threads.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : threads;

  const grouped = groupByDate(filteredThreads);
  const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];

  const startRename = (thread: Thread) => {
    setEditingId(thread.id);
    setEditTitle(thread.title);
  };

  const confirmRename = () => {
    if (editingId && editTitle.trim()) {
      onRenameThread(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  if (isCollapsed) {
    return (
      <div className="w-14 border-r border-gray-200/50 bg-[#003B2C] flex flex-col items-center py-4 gap-3">
        <button onClick={onToggleCollapse} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="Expand sidebar">
          <PanelLeft className="w-5 h-5" />
        </button>
        <button onClick={onNewChat} className="p-2 rounded-lg bg-[#003B2C] hover:bg-[#007A3D] text-white transition-colors shadow-sm" title="New chat">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-gray-200/50 bg-[#003B2C] flex flex-col h-full">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-white/10">
        <button onClick={onToggleCollapse} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="Collapse sidebar">
          <PanelLeftClose className="w-5 h-5" />
        </button>
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-3 py-2 bg-[#003B2C] hover:bg-[#007A3D] text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Search */}
      {threads.length > 3 && (
        <div className="px-3 pt-3 pb-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#003B2C] focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      )}

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {filteredThreads.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-sm text-white/40 font-medium">
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </p>
            <p className="text-xs text-white/25 mt-1">
              {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
            </p>
          </div>
        ) : (
          groupOrder.map(label => {
            const group = grouped[label];
            if (!group || group.length === 0) return null;
            return (
              <div key={label} className="mb-1">
                <p className="px-4 py-2 text-[10px] font-semibold text-white/30 uppercase tracking-wider">{label}</p>
                <AnimatePresence>
                  {group.map(thread => (
                    <motion.div
                      key={thread.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="group relative px-2"
                    >
                      {editingId === thread.id ? (
                        <div className="flex items-center gap-1 px-2 py-2">
                          <input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') setEditingId(null); }}
                            className="flex-1 px-2.5 py-1.5 text-xs bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#003B2C]"
                            autoFocus
                          />
                          <button onClick={confirmRename} className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded hover:bg-white/5"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-white/40 hover:text-white/60 rounded hover:bg-white/5"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSelectThread(thread.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 relative ${
                            activeThreadId === thread.id
                              ? 'bg-white/15 text-white shadow-sm'
                              : 'text-white/70 hover:bg-white/8 hover:text-white'
                          }`}
                        >
                          <span className="block truncate pr-14 font-medium text-[13px]">{thread.title}</span>
                          <span className="text-[10px] text-white/30 mt-0.5 block">
                            {thread.messageCount} message{thread.messageCount !== 1 ? 's' : ''}
                          </span>
                          {/* Actions on hover */}
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5">
                            <span
                              role="button"
                              onClick={e => { e.stopPropagation(); startRename(thread); }}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 cursor-pointer transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                            </span>
                            <span
                              role="button"
                              onClick={e => { e.stopPropagation(); onDeleteThread(thread.id); }}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </span>
                          </span>
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Footer - clean, minimal */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
          <p className="text-[10px] text-white/20">AI-powered analytics</p>
        </div>
      </div>
    </div>
  );
}
