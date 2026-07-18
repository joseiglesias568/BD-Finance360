'use client';

import { Sparkles } from 'lucide-react';
import { MeetingConfig } from '@/lib/meetings-config';

interface AISlideSuggestionsProps {
  meeting: MeetingConfig;
  checkedSlides: Set<number>;
  slideOrder: number[];
  onToggleSlide: (idx: number) => void;
}

export default function AISlideSuggestions({ meeting, checkedSlides, slideOrder, onToggleSlide }: AISlideSuggestionsProps) {
  const unchecked = slideOrder.filter(i => i >= 0 && !checkedSlides.has(i));
  if (unchecked.length === 0) return null;

  // Build suggestions based on logic
  const suggestions: { slideIdx: number; reason: string }[] = [];

  // If "Decisions & Next Steps" is unchecked, always suggest it
  const decisionsIdx = slideOrder.find(i => i >= 0 && meeting.slides[i]?.id === 'mor-actions');
  if (decisionsIdx !== undefined && !checkedSlides.has(decisionsIdx)) {
    suggestions.push({ slideIdx: decisionsIdx, reason: 'Always include decisions for actionable outcomes' });
  }

  // If "Risks" is unchecked but "Guidance" is checked
  const risksIdx = slideOrder.find(i => i >= 0 && meeting.slides[i]?.id === 'mor-risks');
  const guidanceIdx = slideOrder.find(i => i >= 0 && meeting.slides[i]?.id === 'mor-outlook');
  if (risksIdx !== undefined && !checkedSlides.has(risksIdx) && guidanceIdx !== undefined && checkedSlides.has(guidanceIdx)) {
    suggestions.push({ slideIdx: risksIdx, reason: 'Risk context strengthens guidance discussion' });
  }

  // If Exec Summary is unchecked
  const execIdx = slideOrder.find(i => i >= 0 && meeting.slides[i]?.id === 'mor-exec');
  if (execIdx !== undefined && !checkedSlides.has(execIdx)) {
    suggestions.push({ slideIdx: execIdx, reason: 'Sets the narrative for the entire meeting' });
  }

  // If fewer than 6 slides selected
  if (checkedSlides.size < 6 && suggestions.length === 0) {
    const firstUnchecked = unchecked[0];
    if (firstUnchecked !== undefined) {
      suggestions.push({ slideIdx: firstUnchecked, reason: 'Add more slides for a comprehensive review' });
    }
  }

  if (suggestions.length === 0) return null;

  return (
    <div style={{
      margin: '8px 10px',
      padding: '10px 12px',
      background: 'linear-gradient(135deg, #f0faf5, #f5f8f6)',
      border: '1px solid #F0F0F0',
      borderRadius: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
        <Sparkles size={11} style={{ color: '#003B2C' }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: '#003B2C', textTransform: 'uppercase', letterSpacing: '0.03em' }}>AI Suggests</span>
      </div>
      {suggestions.slice(0, 2).map(s => {
        const title = meeting.slides[s.slideIdx]?.title || 'Untitled';
        return (
          <div
            key={s.slideIdx}
            onClick={() => onToggleSlide(s.slideIdx)}
            style={{
              display: 'flex', flexDirection: 'column', gap: 2,
              padding: '6px 8px', marginBottom: 4,
              background: '#fff', borderRadius: 6,
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = '#003B2C')}
            onMouseOut={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#003B2C' }}>+ {title}</div>
            <div style={{ fontSize: 9, color: '#6B7280' }}>{s.reason}</div>
          </div>
        );
      })}
    </div>
  );
}
