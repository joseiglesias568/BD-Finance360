'use client';

import { useState, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { Sparkles, X, RefreshCw } from 'lucide-react';
import AIFeedback from '@/components/feedback/AIFeedback';
import { motion, AnimatePresence } from 'framer-motion';

interface AISlideAssistantProps {
  slideTitle: string;
  slideIndex: number;
  keyData?: Record<string, string>;
}

export default function AISlideAssistant({ slideTitle, slideIndex, keyData }: AISlideAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const transport = new TextStreamChatTransport({ api: '/api/chat' });
  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Build the prompt from slide context
  const buildPrompt = useCallback(() => {
    const dataContext = keyData
      ? Object.entries(keyData).slice(0, 10).map(([k, v]) => `${k}: ${v}`).join(', ')
      : '';

    return `Generate 4 concise, data-driven talking points for a CFO presenting the "${slideTitle}" slide in a Monthly Operating Review meeting. ${dataContext ? `Key data points: ${dataContext}.` : ''} Be specific, action-oriented, and reference numbers where possible. Format as a numbered list. Each point should be 1-2 sentences max.`;
  }, [slideTitle, keyData]);

  const handleGenerate = useCallback(() => {
    setIsOpen(true);
    setHasGenerated(true);
    sendMessage({ text: buildPrompt() });
  }, [buildPrompt, sendMessage]);

  const handleRegenerate = useCallback(() => {
    sendMessage({ text: buildPrompt() });
  }, [buildPrompt, sendMessage]);

  // Extract the latest assistant message
  const latestResponse = messages.filter(m => m.role === 'assistant').pop();

  return (
    <div style={{ position: 'relative', marginTop: 8 }}>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={handleGenerate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #003B2C, #003B2C)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          <Sparkles size={12} />
          AI Talking Points
        </button>
      )}

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 8,
              background: 'linear-gradient(135deg, #f0faf5, #f8fafb)',
              border: '1px solid #F0F0F0',
              borderRadius: 12,
              padding: '14px 18px',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={13} style={{ color: '#003B2C' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#003B2C' }}>AI Talking Points</span>
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: '2px 6px',
                    background: '#F0F0F0', color: '#003B2C', borderRadius: 4,
                  }}>
                    Claude
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '3px 8px', fontSize: 10, fontWeight: 600,
                      color: '#003B2C', background: '#F0F0F0',
                      border: 'none', borderRadius: 4, cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.5 : 1,
                    }}
                  >
                    <RefreshCw size={10} className={isLoading ? 'animate-spin' : ''} /> Regenerate
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center',
                      padding: '3px 6px', fontSize: 10,
                      color: '#6B7280', background: 'transparent',
                      border: 'none', borderRadius: 4, cursor: 'pointer',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Content */}
              {isLoading && !latestResponse && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: '50%', background: '#003B2C',
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        opacity: 0.4,
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: '#6B7280' }}>Generating talking points...</span>
                </div>
              )}

              {latestResponse && (
                <>
                  <div style={{
                    fontSize: 12, lineHeight: 1.6, color: '#374151',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {latestResponse.parts?.map((part, i) => {
                      if (part.type === 'text') return <span key={i}>{part.text}</span>;
                      return null;
                    }) ?? (latestResponse as any).content}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                    <AIFeedback contentId={`slide-${slideIndex}-talking-points`} contentType="talking-point" size="sm" />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
