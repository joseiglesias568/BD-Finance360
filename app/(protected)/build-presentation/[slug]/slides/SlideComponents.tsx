'use client';

import React from 'react';
import { AlertTriangle, Info, Zap } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   TORNADO / RISK-OPPORTUNITY CHART
   ═══════════════════════════════════════════════════ */
interface TornadoRow {
  category: string;
  risk: number;
  opportunity: number;
  note?: string;
}

export function TornadoChart({ data, title }: { data: TornadoRow[]; title?: string }) {
  const maxVal = Math.max(...data.flatMap(d => [Math.abs(d.risk), d.opportunity]));

  return (
    <div className="mv-card" style={{ padding: 20 }}>
      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#003B2C' }}>{title}</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 11 }}>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 12, height: 12, background: '#C62828', borderRadius: 2, display: 'inline-block' }} /> Risk
            </span>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 12, height: 12, background: '#003B2C', borderRadius: 2, display: 'inline-block' }} /> Opportunity
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '140px 1fr 30px 1fr 140px',
        alignItems: 'center', padding: '4px 0', borderBottom: '2px solid #E0E4EA', marginBottom: 4,
      }}>
        <div style={{ fontSize: 11, color: '#8C95A6', textTransform: 'uppercase', fontWeight: 600, textAlign: 'right', paddingRight: 12 }}>Category</div>
        <div style={{ textAlign: 'right', fontSize: 11, color: '#C62828', fontWeight: 600 }}>← RISK</div>
        <div />
        <div style={{ fontSize: 11, color: '#003B2C', fontWeight: 600 }}>OPPORTUNITY →</div>
        <div />
      </div>

      {data.map((row, i) => {
        const riskPct = maxVal > 0 ? (Math.abs(row.risk) / maxVal * 100) : 0;
        const oppPct = maxVal > 0 ? (row.opportunity / maxVal * 100) : 0;
        return (
          <div key={row.category} style={{
            display: 'grid', gridTemplateColumns: '140px 1fr 30px 1fr 140px',
            alignItems: 'center', padding: '7px 0',
            borderBottom: i < data.length - 1 ? '1px solid #EBEEF3' : 'none',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#003087', textAlign: 'right', paddingRight: 12 }}>
              {row.category}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                width: `${riskPct}%`, minWidth: row.risk !== 0 ? 2 : 0,
                height: 26, borderRadius: 4,
                background: '#C62828',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#fff',
              }}>
                {riskPct > 15 ? `$(${Math.abs(row.risk).toFixed(1)})B` : ''}
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: 10, color: '#8C95A6' }}>|</div>
            <div>
              <div style={{
                width: `${oppPct}%`, minWidth: row.opportunity > 0 ? 2 : 0,
                height: 26, borderRadius: 4,
                background: '#003B2C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#fff',
              }}>
                {oppPct > 15 ? `+$${row.opportunity.toFixed(1)}B` : ''}
              </div>
            </div>
            <div style={{ paddingLeft: 8, fontSize: 10, color: '#8C95A6' }}>{row.note}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   RANGE SUMMARY BAR
   ═══════════════════════════════════════════════════ */
interface RangeSummaryProps {
  baselineLabel: string;
  baselineValue: string;
  resultLabel: string;
  resultValue: string;
  low: string;
  high: string;
  fillLeft?: number;  // % from left
  fillRight?: number; // % from right
}

export function RangeSummary({ baselineLabel, baselineValue, resultLabel, resultValue, low, high, fillLeft = 15, fillRight = 5 }: RangeSummaryProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 20px',
      background: '#F5F7FA', borderRadius: 8,
      border: '1px solid #E0E4EA', marginTop: 16,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#5F6B7A' }}>{baselineLabel}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#003087' }}>{baselineValue}</div>
      </div>
      <div style={{ flex: 1, padding: '0 20px' }}>
        <div style={{
          height: 10, background: '#E0E4EA', borderRadius: 5,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${fillLeft}%`, right: `${fillRight}%`,
            background: 'linear-gradient(90deg, #C62828, #003B2C 50%, #0B8043)',
            borderRadius: 5,
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, fontWeight: 600 }}>
          <span style={{ color: '#C62828' }}>Low: {low}</span>
          <span style={{ color: '#0B8043' }}>High: {high}</span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#5F6B7A' }}>{resultLabel}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#003B2C' }}>{resultValue}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ALERT BANNER
   ═══════════════════════════════════════════════════ */
export function AlertBanner({ children, type = 'warning' }: { children: React.ReactNode; type?: 'warning' | 'info' | 'positive' }) {
  const styles = {
    warning: { bg: '#FFF8E1', border: '#E8A317', color: '#8B6914', icon: <AlertTriangle size={14} /> },
    info: { bg: '#E8F5EE', border: '#003B2C', color: '#003B2C', icon: <Info size={14} /> },
    positive: { bg: '#E6F4EA', border: '#0B8043', color: '#0B8043', icon: <Zap size={14} /> },
  }[type];

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 18px', borderRadius: 10,
      fontSize: 13, fontWeight: 600, lineHeight: 1.5,
      marginBottom: 20,
      background: styles.bg,
      border: `1px solid ${styles.border}`,
      borderLeft: `4px solid ${styles.border}`,
      color: styles.color,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1, display: 'flex' }}>{styles.icon}</span>
      <span>{children}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CALLOUT CARD (positive/negative highlight)
   ═══════════════════════════════════════════════════ */
export function CalloutCard({ title, children, type = 'positive' }: { title: string; children: React.ReactNode; type?: 'positive' | 'negative' }) {
  const isPositive = type === 'positive';
  const styles = isPositive
    ? { bg: 'linear-gradient(135deg, #E6F4EA, #f0faf4)', border: '#0B8043', color: '#0B8043', icon: <Zap size={14} /> }
    : { bg: 'linear-gradient(135deg, #FDECEA, #fef4f2)', border: '#C62828', color: '#C62828', icon: <AlertTriangle size={14} /> };

  return (
    <div style={{
      background: styles.bg,
      border: `1px solid ${styles.border}22`,
      borderLeft: `4px solid ${styles.border}`,
      borderRadius: 12,
      padding: '16px 20px',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: styles.color, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{styles.icon}</span> {title}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.55, color: '#3a3f4b' }}>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATUS PILL
   ═══════════════════════════════════════════════════ */
export function StatusPill({ status }: { status: 'Favorable' | 'Watch' | 'At Risk' | 'In Progress' | 'Not Started' | 'On Track' }) {
  const styles: Record<string, { bg: string; color: string; dot: string }> = {
    Favorable: { bg: '#E6F4EA', color: '#0B8043', dot: '#0B8043' },
    'On Track': { bg: '#E6F4EA', color: '#0B8043', dot: '#0B8043' },
    Watch: { bg: '#FFF8E1', color: '#8B6914', dot: '#E8A317' },
    'In Progress': { bg: '#FFF8E1', color: '#8B6914', dot: '#E8A317' },
    'At Risk': { bg: '#FDECEA', color: '#C62828', dot: '#C62828' },
    'Not Started': { bg: '#E8F0FE', color: '#3b82f6', dot: '#3b82f6' },
  };
  const s = styles[status] || styles.Watch;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 9999,
      fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}
