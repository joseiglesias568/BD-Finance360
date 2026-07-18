'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BarChart3, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ClipboardList, Copy, FileText, FileUp, GripVertical, Link2, MessageSquare, Monitor, PenLine, Search, Send, StickyNote, Upload, X } from 'lucide-react';
import { MeetingConfig } from '@/lib/meetings-config';
import type { PlaceholderMap } from '@/lib/meetings-data';
import type { FinancialConfig, KPIConfig, OperationsConfig, StrategicConfig, MarketConfig } from '@/config/types';
import { MOR_SLIDE_COMPONENTS } from './slides/MORSlides';
import AISlideAssistant from './AISlideAssistant';
import ChatPanel from '@/components/chat/ChatPanel';
import AISlideSuggestions from './AISlideSuggestions';
import './meeting-viewer.css';

export interface FullData {
  financials: FinancialConfig | null;
  kpis: KPIConfig | null;
  operations: OperationsConfig | null;
  strategic: StrategicConfig | null;
  market: MarketConfig | null;
}

interface MeetingViewerProps {
  meeting: MeetingConfig;
  placeholders?: PlaceholderMap;
  fullData?: FullData;
}

/* ═══════════════════════════════════════════════════
   PERIOD HELPERS — derive from placeholder data or
   fall back to meeting.nextDate / default values
   ═══════════════════════════════════════════════════ */
function buildPeriods(placeholders?: PlaceholderMap): { label: string; isCurrent: boolean }[] {
  // If we have a resolved fiscal_quarter, use it as the current label
  const currentQ = placeholders?.fiscal_quarter;
  if (currentQ) {
    // Attempt to generate a rolling 4-quarter list from the current quarter string
    // Expected format: "Q2 FY26", "Q1 FY25", etc.
    const match = currentQ.match(/^Q(\d)\s+FY(\d{2})$/);
    if (match) {
      const quarters: { label: string; isCurrent: boolean }[] = [];
      let q = parseInt(match[1], 10);
      let fy = parseInt(match[2], 10);
      for (let i = 0; i < 4; i++) {
        // Month mapping for Delta fiscal calendar (Jan start):
        // Q1 = Oct-Dec → Dec YYYY, Q2 = Jan-Mar → Mar YYYY,
        // Q3 = Apr-Jun → Jun YYYY, Q4 = Jul-Sep → Sep YYYY
        const monthMap: Record<number, string> = { 1: 'Dec', 2: 'Mar', 3: 'Jun', 4: 'Sep' };
        // Calendar year: FY26 Q1 ends Dec 2025, Q2 ends Mar 2026, etc.
        const calYear = q <= 1 ? 2000 + fy - 1 : 2000 + fy;
        const label = `Q${q} FY${fy} \u00B7 ${monthMap[q]} ${calYear}`;
        quarters.push({ label, isCurrent: i === 0 });
        // Step back one quarter
        q--;
        if (q < 1) { q = 4; fy--; }
      }
      return quarters;
    }
  }
  // Fallback: static default
  return [
    { label: 'Q2 FY26 \u00B7 Mar 2026', isCurrent: true },
    { label: 'Q1 FY26 \u00B7 Dec 2025', isCurrent: false },
    { label: 'Q4 FY25 \u00B7 Sep 2025', isCurrent: false },
    { label: 'Q3 FY25 \u00B7 Jun 2025', isCurrent: false },
  ];
}

/* ═══════════════════════════════════════════════════
   UPLOADED SLIDE TYPE
   ═══════════════════════════════════════════════════ */
interface UploadedSlide {
  id: string;
  title: string;
  imageUrl: string;
  fileName: string;
}

export default function MeetingViewer({ meeting, placeholders = {}, fullData }: MeetingViewerProps) {
  const router = useRouter();

  // Derive period options from resolved data
  const PERIODS = useMemo(() => buildPeriods(placeholders), [placeholders]);

  // Slide state
  const [slideOrder, setSlideOrder] = useState(() => meeting.slides.map((_, i) => i));
  const [checkedSlides, setCheckedSlides] = useState(() =>
    new Set(meeting.slides.filter(s => s.checked).map((_, i) => i))
  );
  const [currentView, setCurrentView] = useState(0);

  // Upload state
  const [uploadedSlides, setUploadedSlides] = useState<UploadedSlide[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [periodOpen, setPeriodOpen] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(PERIODS[0]?.label ?? '');
  const [memoOpen, setMemoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [belowCanvasOpen, setBelowCanvasOpen] = useState(true);
  const [presNotesVisible, setPresNotesVisible] = useState(true);

  // Sync period selection when PERIODS updates (e.g., when placeholder data loads)
  useEffect(() => {
    if (PERIODS.length > 0 && !PERIODS.some(p => p.label === currentPeriod)) {
      setCurrentPeriod(PERIODS[0].label);
    }
  }, [PERIODS]);
  const [presOpen, setPresOpen] = useState(false);
  const [presIdx, setPresIdx] = useState(0);
  const [presTimer, setPresTimer] = useState(0);
  const presTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [presIdle, setPresIdle] = useState(false);
  const presIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [editHintVisible, setEditHintVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Notes state
  const [slideNotes, setSlideNotes] = useState<Record<number, string>>({});
  const [meetingNotes, setMeetingNotes] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [notesSaveStatus, setNotesSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search state (closing slide)
  const [closingSearch, setClosingSearch] = useState('');

  // Drag state
  const [dragSrcPos, setDragSrcPos] = useState<number | null>(null);

  // Refs
  const mainRef = useRef<HTMLDivElement>(null);
  const presContentRef = useRef<HTMLDivElement>(null);

  // Get slide components for the meeting (these accept an optional `data` prop)
  const slideComponents = meeting.slug === 'monthly-operating-review' ? MOR_SLIDE_COMPONENTS : {};

  // Total slides = meeting slides + uploaded slides
  const totalSlideCount = meeting.slides.length + uploadedSlides.length;

  /* ═══ TOAST ═══ */
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }, []);

  /* ═══ EDIT HINT ═══ */
  useEffect(() => {
    setEditHintVisible(true);
    const t = setTimeout(() => setEditHintVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  /* ═══ NOTES AUTO-SAVE ═══ */
  const triggerAutoSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setNotesSaveStatus('saving');
    saveTimerRef.current = setTimeout(() => {
      setNotesSaveStatus('saved');
      setTimeout(() => setNotesSaveStatus('idle'), 2000);
    }, 800);
  }, []);

  /* ═══ NAVIGATION ═══ */
  const goToSlide = useCallback((pos: number) => {
    if (pos < 0 || pos >= slideOrder.length) return;
    setCurrentView(pos);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [slideOrder.length]);

  const nextSlide = useCallback(() => goToSlide(currentView + 1), [goToSlide, currentView]);
  const prevSlide = useCallback(() => goToSlide(currentView - 1), [goToSlide, currentView]);

  /* ═══ CHECKBOX TOGGLE ═══ */
  const toggleCheck = useCallback((slideIdx: number) => {
    setCheckedSlides(prev => {
      const next = new Set(prev);
      if (next.has(slideIdx)) next.delete(slideIdx);
      else next.add(slideIdx);
      return next;
    });
  }, []);

  /* ═══ DRAG & DROP ═══ */
  const handleDragStart = useCallback((pos: number, e: React.DragEvent) => {
    setDragSrcPos(pos);
    e.dataTransfer.effectAllowed = 'move';
    (e.currentTarget as HTMLElement).classList.add('dragging');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const item = (e.target as HTMLElement).closest('.mv-agenda-item') as HTMLElement;
    if (!item) return;
    document.querySelectorAll('.drag-over-top,.drag-over-bottom').forEach(el => {
      el.classList.remove('drag-over-top', 'drag-over-bottom');
    });
    const rect = item.getBoundingClientRect();
    if (e.clientY < rect.top + rect.height / 2) {
      item.classList.add('drag-over-top');
    } else {
      item.classList.add('drag-over-bottom');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    document.querySelectorAll('.drag-over-top,.drag-over-bottom').forEach(el => {
      el.classList.remove('drag-over-top', 'drag-over-bottom');
    });
    const item = (e.target as HTMLElement).closest('.mv-agenda-item') as HTMLElement;
    if (!item || dragSrcPos === null) return;

    let targetPos = parseInt(item.dataset.pos || '0');
    const rect = item.getBoundingClientRect();
    if (e.clientY > rect.top + rect.height / 2) targetPos++;

    if (targetPos === dragSrcPos || targetPos === dragSrcPos + 1) {
      setDragSrcPos(null);
      return;
    }

    setSlideOrder(prev => {
      const next = [...prev];
      const moved = next.splice(dragSrcPos, 1)[0];
      const insertAt = targetPos > dragSrcPos ? targetPos - 1 : targetPos;
      next.splice(insertAt, 0, moved);
      return next;
    });

    setCurrentView(prev => {
      if (prev === dragSrcPos) {
        const insertAt = targetPos > dragSrcPos ? targetPos - 1 : targetPos;
        return insertAt;
      }
      if (dragSrcPos < prev && targetPos > prev) return prev - 1;
      if (dragSrcPos > prev && targetPos <= prev) return prev + 1;
      return prev;
    });

    setDragSrcPos(null);
  }, [dragSrcPos]);

  const handleDragEnd = useCallback(() => {
    setDragSrcPos(null);
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over-top,.drag-over-bottom').forEach(el => {
      el.classList.remove('drag-over-top', 'drag-over-bottom');
    });
  }, []);

  /* ═══ UPLOAD SLIDE ═══ */
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';
      const isPPTX = file.name.endsWith('.pptx') || file.name.endsWith('.ppt');

      if (!isImage && !isPDF && !isPPTX) {
        showToast(`Unsupported file type: ${file.name}`);
        return;
      }

      const newId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const imageUrl = ev.target?.result as string;
          const uploaded: UploadedSlide = { id: newId, title, imageUrl, fileName: file.name };
          setUploadedSlides(prev => [...prev, uploaded]);

          // Add to slide order (use negative indices for uploaded slides)
          const uploadIdx = -(uploadedSlides.length + 1);
          setSlideOrder(prev => [...prev, uploadIdx]);
          setCheckedSlides(prev => { const next = new Set(prev); next.add(uploadIdx); return next; });
          showToast(`Uploaded: ${file.name}`);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDF/PPTX, show a placeholder
        const uploaded: UploadedSlide = { id: newId, title, imageUrl: '', fileName: file.name };
        setUploadedSlides(prev => [...prev, uploaded]);
        const uploadIdx = -(uploadedSlides.length + 1);
        setSlideOrder(prev => [...prev, uploadIdx]);
        setCheckedSlides(prev => { const next = new Set(prev); next.add(uploadIdx); return next; });
        showToast(`Uploaded: ${file.name}`);
      }
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [uploadedSlides.length, showToast]);

  /* ═══ SHARE / COPY LINK ═══ */
  const handleShareLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard');
    } catch {
      showToast('Could not copy link');
    }
  }, [showToast]);

  /* ═══ KEYBOARD NAV ═══ */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.getAttribute('contenteditable') === 'true') return;
      if ((e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'Escape') {
        if (presOpen) { setPresOpen(false); return; }
        if (memoOpen) { setMemoOpen(false); return; }
      }

      if (presOpen) {
        const totalPresSlides = getPresSlides().length + 1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
          e.preventDefault();
          setPresIdx(p => Math.min(p + 1, totalPresSlides - 1));
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          setPresIdx(p => Math.max(p - 1, 0));
        }
      } else if (!memoOpen) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nextSlide(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prevSlide(); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [presOpen, memoOpen, nextSlide, prevSlide]);

  /* ═══ PERIOD DROPDOWN CLOSE ═══ */
  useEffect(() => {
    const close = () => setPeriodOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  /* ═══ INLINE EDITING ═══ */
  useEffect(() => {
    if (!editMode) return;
    // Make contenteditable elements in main content editable
    const main = mainRef.current;
    if (!main) return;

    const editableSelectors = [
      '.mv-section-title',
      '.mv-kpi-value',
      '.mv-kpi-sub',
      '.mv-commentary-bullet',
      '.mv-commentary-item',
      '.mv-data-table td',
    ];

    const elements = main.querySelectorAll(editableSelectors.join(','));
    elements.forEach(el => {
      el.setAttribute('contenteditable', 'true');
      el.classList.add('mv-editable');
    });

    return () => {
      elements.forEach(el => {
        el.removeAttribute('contenteditable');
        el.classList.remove('mv-editable');
      });
    };
  }, [editMode, currentView]);

  /* ═══ PRESENTATION MODE ═══ */
  const getPresSlides = useCallback(() => {
    return slideOrder.filter(i => checkedSlides.has(i));
  }, [slideOrder, checkedSlides]);

  const enterPresentation = useCallback(() => {
    const slides = getPresSlides();
    if (slides.length === 0) {
      showToast('No slides selected for presentation');
      return;
    }
    setPresIdx(0);
    setPresTimer(0);
    setPresOpen(true);
    presTimerRef.current = setInterval(() => setPresTimer(t => t + 1), 1000);
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, [getPresSlides, showToast]);

  const exitPresentation = useCallback(() => {
    setPresOpen(false);
    setPresIdle(false);
    if (presTimerRef.current) { clearInterval(presTimerRef.current); presTimerRef.current = null; }
    if (presIdleTimerRef.current) { clearTimeout(presIdleTimerRef.current); presIdleTimerRef.current = null; }
    if (document.fullscreenElement) document.exitFullscreen?.();
  }, []);

  const handlePresMouseMove = useCallback(() => {
    setPresIdle(false);
    if (presIdleTimerRef.current) clearTimeout(presIdleTimerRef.current);
    presIdleTimerRef.current = setTimeout(() => setPresIdle(true), 3000);
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement && presOpen) {
        setPresOpen(false);
        if (presTimerRef.current) { clearInterval(presTimerRef.current); presTimerRef.current = null; }
      }
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [presOpen]);

  /* ═══ HELPERS ═══ */
  const getSlideTitle = (idx: number) => {
    if (idx >= 0) return meeting.slides[idx]?.title || 'Untitled';
    // Uploaded slide
    const uploadIdx = Math.abs(idx) - 1;
    return uploadedSlides[uploadIdx]?.title || 'Uploaded Slide';
  };

  const getSlideId = (idx: number) => {
    if (idx >= 0) return meeting.slides[idx]?.id || `slide-${idx}`;
    const uploadIdx = Math.abs(idx) - 1;
    return uploadedSlides[uploadIdx]?.id || `upload-${idx}`;
  };

  /* ═══ RENDER CURRENT SLIDE ═══ */
  const currentSlideIdx = slideOrder[currentView];
  const isUploadedSlide = currentSlideIdx < 0;
  const currentSlide = isUploadedSlide ? null : meeting.slides[currentSlideIdx];
  const currentUploadedSlide = isUploadedSlide ? uploadedSlides[Math.abs(currentSlideIdx) - 1] : null;
  const SlideComponent = currentSlide ? slideComponents[currentSlide?.id] : undefined;

  const selectedCount = checkedSlides.size;
  const progressPct = ((currentView + 1) / slideOrder.length * 100);

  /* ═══ SLIDE CATEGORY COLORS ═══ */
  const SLIDE_CATEGORY_COLORS: Record<string, string> = {
    // Opening
    'mor-title': '#003B2C', 'mor-exec': '#003B2C',
    // Financial
    'mor-revenue': '#003B2C', 'mor-segments': '#003B2C', 'mor-comps': '#003B2C', 'mor-margin': '#003B2C',
    // Growth & Digital
    'mor-digital': '#007A3D', 'mor-stores': '#007A3D', 'mor-menu': '#007A3D',
    // Operations & People
    'mor-supply': '#E8A317', 'mor-cx': '#E8A317', 'mor-people': '#E8A317',
    // Market
    'mor-compete': '#2563EB', 'mor-intl': '#2563EB',
    // Risk & Strategy
    'mor-risks': '#C62828', 'mor-strategy': '#C62828', 'mor-outlook': '#C62828',
    // Closing
    'mor-actions': '#8C95A6', 'mor-appendix': '#8C95A6',
  };

  /* ═══ PRESENTATION SLIDES ═══ */
  const presSlides = getPresSlides();
  const presTotalPages = presSlides.length + 1;

  const renderSlideContent = (slideIdx: number) => {
    if (slideIdx < 0) {
      // Uploaded slide
      const uploadIdx = Math.abs(slideIdx) - 1;
      const uploaded = uploadedSlides[uploadIdx];
      if (!uploaded) return null;
      return (
        <div className="mv-card" style={{ padding: 20, textAlign: 'center' }}>
          {uploaded.imageUrl ? (
            <img
              src={uploaded.imageUrl}
              alt={uploaded.title}
              style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 8, border: '1px solid #E0E4EA' }}
            />
          ) : (
            <div style={{ padding: 40, color: '#8C95A6' }}>
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><FileUp size={40} strokeWidth={1.5} /></div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{uploaded.fileName}</p>
              <p style={{ fontSize: 12 }}>Document preview not available. File has been attached to this presentation.</p>
            </div>
          )}
        </div>
      );
    }
    const slide = meeting.slides[slideIdx];
    const Comp = slideComponents[slide?.id];
    if (Comp) return <Comp data={placeholders} fullData={fullData} />;
    return (
      <div className="mv-card" style={{ padding: 40, textAlign: 'center', color: '#8C95A6' }}>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><BarChart3 size={40} strokeWidth={1.5} /></div>
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{slide?.title}</p>
        <p style={{ fontSize: 12 }}>
          Data-connected content will be generated here based on the latest Delta data.
        </p>
      </div>
    );
  };

  const renderPresContent = () => {
    if (presIdx < presSlides.length) {
      const slideIdx = presSlides[presIdx];
      const slide = slideIdx >= 0 ? meeting.slides[slideIdx] : null;
      const title = getSlideTitle(slideIdx);
      return (
        <div className="mv-section" key={getSlideId(slideIdx)}>
          {slide?.id !== 'mor-title' && (
            <div className="mv-section-header">
              <div className="mv-section-number">Section {presIdx + 1} of {presSlides.length}</div>
              <h1 className="mv-section-title">{title}</h1>
              <div className="mv-section-meta">
                <span>{meeting.audienceLabel}</span>
                <span>{currentPeriod}</span>
              </div>
            </div>
          )}
          <div className="mv-section-body">
            {renderSlideContent(slideIdx)}
          </div>
          {slide?.id !== 'mor-title' && (
            <div className="mv-section-footer">
              <span>Becton, Dickinson and Company — Confidential</span>
              <span>{currentPeriod}</span>
            </div>
          )}
        </div>
      );
    }
    // Closing slide with search
    return (
      <div className="mv-closing">
        <div className="mv-closing-title">Thank You</div>
        <div className="mv-closing-sub">
            Questions? Search the Delta Finance360 platform for deeper analytics and insights.
        </div>
        <div className="mv-closing-search">
          <Search size={16} style={{ color: '#8C95A6', flexShrink: 0 }} />
          <input
            type="text"
            className="mv-closing-search-input"
            placeholder="Ask a question or search across Delta Finance360..."
            value={closingSearch}
            onChange={e => setClosingSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && closingSearch.trim()) {
                exitPresentation();
                showToast(`Searching: "${closingSearch}"`);
              }
            }}
          />
        </div>
        <button className="mv-closing-explore" onClick={exitPresentation} style={{ marginTop: 24 }}>
          Return to Meeting View
        </button>
      </div>
    );
  };

  /* ═══ MEMO CONTENT ═══ */
  const renderMemo = () => {
    const selectedSlides = slideOrder.filter(i => checkedSlides.has(i));
    return (
      <div className="mv-memo-inner">
        <div className="mv-memo-brand">
          <div className="mv-memo-brand-title">
            <span style={{ width: 28, height: 28, borderRadius: 6, background: '#003B2C', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>SB</span>
            Delta
          </div>
          <div className="mv-memo-brand-sub">{meeting.audienceLabel}</div>
        </div>

        <div className="mv-memo-header">
          <div className="mv-memo-header-title">{meeting.name} — Meeting Memo</div>
          <div className="mv-memo-meta">
            <span className="label">To:</span><span><strong>Chief Financial Officer</strong></span>
            <span className="label">From:</span><span>Financial Planning &amp; Analysis</span>
            <span className="label">Date:</span><span>{meeting.nextDate}</span>
            <span className="label">Re:</span><span><strong>{currentPeriod} — {selectedSlides.length}-Topic Briefing</strong></span>
          </div>
        </div>

        <div>
          {selectedSlides.length === 0 ? (
            <p style={{ color: '#8C95A6', textAlign: 'center', padding: '40px 0' }}>No slides selected.</p>
          ) : (
            selectedSlides.map((slideIdx, i) => {
              const title = getSlideTitle(slideIdx);
              const memo = slideIdx >= 0 ? meeting.slides[slideIdx]?.memo : `Uploaded slide: ${getSlideTitle(slideIdx)}`;
              return (
                <div key={getSlideId(slideIdx)} className="mv-memo-section">
                  <div className="mv-memo-section-title">
                    <span className="mv-memo-section-num">{i + 1}</span>
                    <span>{title}</span>
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: memo }} />
                </div>
              );
            })
          )}

          {selectedSlides.length > 0 && (
            <div className="mv-memo-bottom-line">
              <strong>Bottom Line:</strong> This briefing covers {selectedSlides.length} topics. The presentation will go deeper — this memo ensures we can focus discussion time on decisions and actions.
            </div>
          )}
        </div>

        <div className="mv-memo-cta-bar">
          <p>Ready to dive deeper? View the full presentation materials.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="mv-memo-cta-btn" onClick={() => { setMemoOpen(false); enterPresentation(); }}>
              View Presentation →
            </button>
            <button
              className="mv-memo-cta-btn"
              style={{ background: '#003B2C' }}
              onClick={() => {
                showToast('Memo sent to CFO Office · Finance Leadership Team');
                setTimeout(() => setMemoOpen(false), 1200);
              }}
            >
              <Send size={14} /> Send Memo
            </button>
            <button
              className="mv-memo-cta-btn"
              style={{ background: 'transparent', color: '#003B2C', border: '1px solid #003B2C' }}
              onClick={handleShareLink}
            >
              <Copy size={14} /> Copy Link
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${notesOpen ? 'mv-notes-open' : ''} ${sidebarCollapsed ? 'mv-sidebar-collapsed' : ''}`}>
      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.pptx,.ppt"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* ═══ MEETING HEADER ═══ */}
      <div className="mv-meeting-header">
        <div className="mv-meeting-title-area">
          <button className="mv-back-btn" onClick={() => router.push('/build-presentation')}>
            <ArrowLeft size={12} /> Hub
          </button>
          <div className="mv-period-wrap" onClick={e => e.stopPropagation()}>
            <button className="mv-period-btn" onClick={() => setPeriodOpen(!periodOpen)}>
              {currentPeriod} <ChevronDown size={10} style={{ opacity: 0.7 }} />
            </button>
            <div className={`mv-period-menu ${periodOpen ? 'open' : ''}`}>
              <div className="mv-period-menu-label">
                {(() => {
                  const fyMatch = PERIODS[0]?.label.match(/FY(\d{2})/);
                  return fyMatch ? `FY20${fyMatch[1]}` : 'Fiscal Year';
                })()}
              </div>
              {PERIODS.map(p => (
                <div
                  key={p.label}
                  className={`mv-period-menu-item ${currentPeriod === p.label ? 'active' : ''}`}
                  onClick={() => { setCurrentPeriod(p.label); setPeriodOpen(false); showToast(`Switched to ${p.label}`); }}
                >
                  {p.label}
                  {p.isCurrent && <span className="mv-period-badge">Current</span>}
                </div>
              ))}
            </div>
          </div>
          <span className="mv-meeting-badge">{meeting.cadence}</span>
          <span className="mv-meeting-title">{meeting.shortName}</span>
          <span className="mv-meeting-subtitle">{meeting.audienceLabel}</span>
        </div>

        <div className="mv-header-actions">
          <button className="mv-header-btn" onClick={handleShareLink}>
            <Link2 size={12} /> Share
          </button>
          <button className="mv-header-btn" onClick={() => setNotesOpen(!notesOpen)}>
            <StickyNote size={12} /> Notes
          </button>
          <button className="mv-header-btn" onClick={() => setChatOpen(!chatOpen)}>
            <MessageSquare size={12} /> Chat
          </button>
          <button className="mv-header-btn" onClick={() => setMemoOpen(true)}>
            <FileText size={12} /> Memo
          </button>
          <button
            className={`mv-header-btn ${editMode ? 'mv-edit-active' : ''}`}
            onClick={() => { setEditMode(!editMode); showToast(editMode ? 'Edit mode off' : 'Edit mode on — click any text to edit'); }}
          >
            <PenLine size={12} /> {editMode ? 'Editing' : 'Edit'}
          </button>
          <button className="mv-header-btn primary" onClick={enterPresentation}>
            <Monitor size={12} /> Present
          </button>
        </div>
      </div>

      {/* ═══ PROGRESS BAR ═══ */}
      <div className="mv-progress-wrap">
        <div className="mv-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      {/* ═══ SIDEBAR ═══ */}
      <div className="mv-sidebar">
        {/* Collapse toggle */}
        <button
          className="mv-sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div className="mv-sidebar-top">
          <div className="mv-sidebar-label">Agenda</div>
        </div>

        {/* Slide list */}
        <div className="mv-sidebar-list">
          {slideOrder.map((slideIdx, pos) => {
            const title = getSlideTitle(slideIdx);
            const isUploaded = slideIdx < 0;
            const slideId = getSlideId(slideIdx);
            const categoryColor = SLIDE_CATEGORY_COLORS[slideId] || (isUploaded ? '#8C95A6' : '#E0E4EA');
            return (
              <div
                key={slideId}
                className={`mv-agenda-item ${pos === currentView ? 'active' : ''}`}
                data-pos={pos}
                draggable={!sidebarCollapsed}
                onDragStart={(e) => handleDragStart(pos, e)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                onClick={(e) => {
                  if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).classList.contains('mv-agenda-drag')) return;
                  goToSlide(pos);
                }}
                style={{ borderLeftColor: categoryColor }}
              >
                <span className="mv-agenda-drag" title="Drag to reorder"><GripVertical size={14} /></span>
                <input
                  type="checkbox"
                  className="mv-agenda-cb"
                  checked={checkedSlides.has(slideIdx)}
                  onChange={() => toggleCheck(slideIdx)}
                  onClick={e => e.stopPropagation()}
                />
                <div className={`mv-agenda-num ${isUploaded ? 'mv-agenda-num-uploaded' : ''}`}>
                  {isUploaded ? <Upload size={10} /> : pos + 1}
                </div>
                <span className="mv-agenda-title">{title}</span>
              </div>
            );
          })}
        </div>

        {/* AI Slide Suggestions */}
        <div className="mv-ai-suggestions-wrap">
          <AISlideSuggestions
            meeting={meeting}
            checkedSlides={checkedSlides}
            slideOrder={slideOrder}
            onToggleSlide={toggleCheck}
          />
        </div>

        {/* Upload — at bottom */}
        <div className="mv-upload-area">
          <button className="mv-upload-btn" onClick={handleUploadClick}>
            <div className="mv-upload-btn-icon"><Upload size={13} /></div>
            <div className="mv-upload-btn-text">Upload Slide</div>
          </button>
        </div>

        <div className="mv-sidebar-footer">
          {selectedCount} of {slideOrder.length} selected
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="mv-main" ref={mainRef}>
        <div className="mv-slide-canvas-wrapper">
          <div className="mv-slide-canvas">
            <div className="mv-slide-canvas-inner">
              <AnimatePresence mode="wait">
                {currentSlideIdx !== undefined && (
                  <motion.div
                    key={getSlideId(currentSlideIdx)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="mv-section"
                  >
                    {/* Hide section header for title slide — it has its own centered layout */}
                    {currentSlide?.id !== 'mor-title' && (
                      <div className="mv-section-header">
                        <div className="mv-section-number">Section {currentView + 1} of {slideOrder.length}</div>
                        <h1 className="mv-section-title">{getSlideTitle(currentSlideIdx)}</h1>
                        {currentSlide?.subtitle && (
                          <div className="mv-section-subtitle">{currentSlide.subtitle}</div>
                        )}
                        <div className="mv-section-meta">
                          <span>{meeting.audienceLabel}</span>
                          <span>{currentPeriod}</span>
                        </div>
                      </div>
                    )}

                    <div className="mv-section-body">
                      {renderSlideContent(currentSlideIdx)}
                    </div>

                    <div className="mv-section-footer">
                      <span>Becton, Dickinson and Company — Confidential</span>
                      <span>{currentPeriod}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* Below canvas — Collapsible panel with AI Talking Points + Slide Notes */}
        {currentSlideIdx >= 0 && (
          <div className="mv-below-canvas">
            <button
              className="mv-below-canvas-toggle"
              onClick={() => setBelowCanvasOpen(!belowCanvasOpen)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <StickyNote size={12} />
                <span>Slide Notes &amp; AI Talking Points</span>
              </span>
              {belowCanvasOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {belowCanvasOpen && (
              <div className="mv-below-canvas-body">
                <div className="mv-below-canvas-notes">
                  <label className="mv-below-canvas-label">Key Talking Points</label>
                  <textarea
                    className="mv-below-canvas-textarea"
                    placeholder={`Add your talking points for "${getSlideTitle(currentSlideIdx)}"...`}
                    value={slideNotes[currentSlideIdx] || ''}
                    onChange={e => {
                      setSlideNotes(prev => ({ ...prev, [currentSlideIdx]: e.target.value }));
                      triggerAutoSave();
                    }}
                    rows={3}
                  />
                </div>
                <div className="mv-below-canvas-ai">
                  <AISlideAssistant
                    slideTitle={getSlideTitle(currentSlideIdx)}
                    slideIndex={currentSlideIdx}
                    keyData={placeholders}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ BOTTOM NAV ═══ */}
      <div className="mv-bottom-nav">
        <button className="mv-nav-btn" onClick={prevSlide} disabled={currentView === 0}>
          <ChevronLeft size={14} /> Previous
        </button>
        <div className="mv-nav-counter">
          <strong>{currentView + 1}</strong> of {slideOrder.length}
        </div>
        <button
          className={`mv-nav-btn ${currentView < slideOrder.length - 1 ? 'primary' : ''}`}
          onClick={nextSlide}
          disabled={currentView === slideOrder.length - 1}
        >
          {currentView === slideOrder.length - 1 ? 'End of Meeting' : <>Next <ChevronRight size={14} /></>}
        </button>
      </div>

      {/* ═══ NOTES PANEL ═══ */}
      <div className={`mv-notes-panel ${notesOpen ? 'open' : ''}`}>
        <div className="mv-notes-panel-header">
          <div className="mv-notes-panel-title">
            <StickyNote size={14} /> Meeting Notes
            {notesSaveStatus === 'saving' && <span className="mv-notes-save-indicator mv-saving">Saving...</span>}
            {notesSaveStatus === 'saved' && <span className="mv-notes-save-indicator mv-saved">Saved</span>}
          </div>
          <button className="mv-notes-panel-close" onClick={() => setNotesOpen(false)}>
            <X size={14} />
          </button>
        </div>
        <div className="mv-notes-body">
          <div className="mv-notes-section-label">Slide Notes</div>
          <textarea
            className="mv-notes-textarea"
            placeholder={`Notes for: ${getSlideTitle(currentSlideIdx)}...`}
            value={slideNotes[currentSlideIdx] || ''}
            onChange={e => {
              setSlideNotes(prev => ({ ...prev, [currentSlideIdx]: e.target.value }));
              triggerAutoSave();
            }}
          />

          <div className="mv-notes-section-label">Meeting Notes</div>
          <textarea
            className="mv-notes-textarea"
            placeholder="General meeting notes..."
            value={meetingNotes}
            onChange={e => { setMeetingNotes(e.target.value); triggerAutoSave(); }}
          />

          <div className="mv-notes-section-label">Action Items</div>
          <textarea
            className="mv-notes-textarea"
            placeholder="Action items and follow-ups..."
            value={actionNotes}
            onChange={e => { setActionNotes(e.target.value); triggerAutoSave(); }}
          />

          {/* Save to Commentary Engine */}
          <button
            className="mv-save-to-commentary"
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#003B2C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            onClick={async () => {
              const parts: string[] = [];
              if (meetingNotes.trim()) parts.push(`## Meeting Notes\n\n${meetingNotes}`);
              if (actionNotes.trim()) parts.push(`## Action Items\n\n${actionNotes}`);
              const slideNotesEntries = Object.entries(slideNotes).filter(([, v]) => v.trim());
              if (slideNotesEntries.length > 0) {
                parts.push(`## Slide Notes\n\n${slideNotesEntries.map(([idx, note]) => `**Slide ${Number(idx) + 1}:** ${note}`).join('\n\n')}`);
              }
              if (parts.length === 0) return;
              try {
                await fetch('/api/commentary', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    title: `Meeting Notes: ${meeting.name}`,
                    content: parts.join('\n\n'),
                    category: 'Strategic',
                    commentaryType: 'context',
                    priority: 'medium',
                    tags: ['meeting-notes', meeting.slug],
                  }),
                });
                showToast('Notes saved to Commentary Engine');
              } catch {
                showToast('Failed to save — try again');
              }
            }}
          >
            Save to Commentary Engine
          </button>
        </div>
      </div>

      {/* ═══ MEMO OVERLAY ═══ */}
      <div className={`mv-memo-overlay ${memoOpen ? 'active' : ''}`}>
        <button className="mv-memo-overlay-close" onClick={() => setMemoOpen(false)}><X size={16} /></button>
        <div className="mv-memo-overlay-content">
          {renderMemo()}
        </div>
      </div>

      {/* ═══ PRESENTATION OVERLAY ═══ */}
      <div
        className={`mv-pres-overlay ${presOpen ? 'active' : ''} ${presIdle ? 'mv-pres-idle' : ''}`}
        onMouseMove={handlePresMouseMove}
      >
        {/* Progress bar at top */}
        <div className="mv-pres-progress mv-pres-controls">
          <div className="mv-pres-progress-fill" style={{ width: `${((presIdx + 1) / presTotalPages) * 100}%` }} />
        </div>
        <button className="mv-pres-close mv-pres-controls" onClick={exitPresentation}><X size={18} /></button>
        <button className="mv-pres-arrow left mv-pres-controls" onClick={() => setPresIdx(p => Math.max(p - 1, 0))} disabled={presIdx === 0}><ChevronLeft size={20} /></button>
        <button className="mv-pres-arrow right mv-pres-controls" onClick={() => setPresIdx(p => Math.min(p + 1, presTotalPages - 1))} disabled={presIdx === presTotalPages - 1}><ChevronRight size={20} /></button>
        <div className="mv-pres-counter mv-pres-controls">
          {presIdx + 1} / {presTotalPages}
          <span className="mv-pres-timer">{String(Math.floor(presTimer / 60)).padStart(2, '0')}:{String(presTimer % 60).padStart(2, '0')}</span>
        </div>
        <div className="mv-pres-slide-frame">
          <div className="mv-pres-slide-inner" ref={presContentRef}>
            <AnimatePresence mode="wait">
              {presOpen && (
                <motion.div
                  key={`pres-${presIdx}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderPresContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Speaker notes toggle */}
        {presOpen && presIdx < presSlides.length && (
          <>
            <button
              className="mv-pres-notes-toggle mv-pres-controls"
              onClick={() => setPresNotesVisible(!presNotesVisible)}
              title={presNotesVisible ? 'Hide speaker notes' : 'Show speaker notes'}
            >
              <StickyNote size={14} />
            </button>
            {presNotesVisible && slideNotes[presSlides[presIdx]] && (
              <div className="mv-pres-speaker-notes mv-pres-controls">
                <strong>Speaker Notes:</strong> {slideNotes[presSlides[presIdx]]}
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ TOAST ═══ */}
      <div className={`mv-toast ${toast ? 'visible' : ''}`}>{toast}</div>

      {/* ═══ EDIT HINT ═══ */}
      <div className={`mv-edit-hint ${editHintVisible ? 'visible' : ''}`}>
        Click any text to edit · Drag slides to reorder
      </div>

      {/* ═══ AI CHAT PANEL ═══ */}
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialQuery={`I'm reviewing "${getSlideTitle(currentSlideIdx)}" for the Monthly Operating Review. What should I highlight?`}
      />
    </div>
  );
}
