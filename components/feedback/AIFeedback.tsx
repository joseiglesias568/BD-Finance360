'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIFeedbackProps {
  contentId: string;
  contentType: string;
  size?: 'sm' | 'md';
  onFeedback?: (feedback: { contentId: string; contentType: string; rating: 'up' | 'down'; comment?: string }) => void;
}

export default function AIFeedback({ contentId, contentType, size = 'sm', onFeedback }: AIFeedbackProps) {
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (value: 'up' | 'down') => {
    setRating(value);
    if (value === 'up') {
      setShowComment(false);
      setSubmitted(true);
      onFeedback?.({ contentId, contentType, rating: 'up' });
    } else {
      setShowComment(true);
    }
  };

  const handleSubmitComment = () => {
    setSubmitted(true);
    setShowComment(false);
    onFeedback?.({ contentId, contentType, rating: 'down', comment });
  };

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const btnPadding = size === 'sm' ? 'p-1' : 'p-1.5';

  if (submitted) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] text-gray-400 italic"
      >
        Thanks for your feedback
      </motion.span>
    );
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => handleRating('up')}
          className={`${btnPadding} rounded transition-all duration-150 ${
            rating === 'up'
              ? 'text-[#1c519c] bg-[#F0F0F0]'
              : 'text-gray-300 hover:text-[#1c519c] hover:bg-[#F0F0F0]/50'
          }`}
          title="Helpful"
        >
          <ThumbsUp className={iconSize} />
        </button>
        <button
          onClick={() => handleRating('down')}
          className={`${btnPadding} rounded transition-all duration-150 ${
            rating === 'down'
              ? 'text-red-500 bg-red-50'
              : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
          }`}
          title="Not helpful"
        >
          <ThumbsDown className={iconSize} />
        </button>
      </div>

      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 pt-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What could be improved?"
                className="w-full text-xs p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#1c519c]/30 bg-white"
                rows={2}
                autoFocus
              />
              <button
                onClick={handleSubmitComment}
                className="flex items-center gap-1 px-3 py-1 bg-[#1c519c] text-white text-xs rounded-lg hover:bg-[#1c519c] transition-colors"
              >
                <Send className="w-3 h-3" />
                Submit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
