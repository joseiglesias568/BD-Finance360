'use client';

import React, { useMemo } from 'react';

export interface WaterfallBar {
  label: string;
  value: number;
  type: 'total' | 'positive' | 'negative' | 'subtotal' | 'risk' | 'mitigation';
}

interface WaterfallChartProps {
  data: WaterfallBar[];
  height?: number;
  labelHeight?: number;
  unit?: string;
  legend?: { label: string; type: string }[];
  annotation?: { text: string; style: 'warning' | 'info' | 'accent'; position?: 'center' | 'right' };
  sectionLabels?: { text: string; startIdx: number; endIdx: number }[];
}

const BAR_COLORS: Record<string, string> = {
  total: '#003B2C',
  positive: '#003B2C',
  negative: '#C62828',
  subtotal: '#6BA38E',
  risk: 'repeating-linear-gradient(45deg, #C62828, #C62828 4px, #e04545 4px, #e04545 8px)',
  mitigation: '#0B8043',
};

const LEGEND_COLORS: Record<string, string> = {
  total: '#003B2C',
  positive: '#003B2C',
  negative: '#C62828',
  subtotal: '#6BA38E',
  risk: '#C62828',
  mitigation: '#0B8043',
};

export default function WaterfallChart({
  data,
  height = 240,
  labelHeight = 65,
  unit = '$',
  legend,
  annotation,
  sectionLabels,
}: WaterfallChartProps) {
  const computed = useMemo(() => {
    let running = 0;
    const bars = data.map((d) => {
      let base: number, top: number;
      if (d.type === 'total' || d.type === 'subtotal') {
        base = 0;
        top = d.value;
        running = d.value;
      } else {
        base = running;
        running += d.value;
        top = running;
      }
      return { ...d, base, top, running };
    });

    const allVals = bars.flatMap(b => [b.base, b.top]);
    const maxVal = Math.max(...allVals, 0);
    const minVal = Math.min(...allVals, 0);
    const range = maxVal - minVal || 1;

    return { bars, maxVal, minVal, range };
  }, [data]);

  const { bars, minVal, range } = computed;
  const scale = height / range;

  const formatValue = (v: number) => {
    const abs = Math.abs(v);
    const formatted = abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(1);
    if (v < 0) return `(${unit}${formatted})`;
    return `${unit}${formatted}`;
  };

  return (
    <div className="mv-card" style={{ padding: '20px 24px' }}>
      {/* Header row: unit label + legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#8C95A6', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {unit} in Billions
        </div>
        {legend && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {legend.map(l => (
              <span key={l.label} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11 }}>
                <span style={{
                  width: 12, height: 12, borderRadius: 2, display: 'inline-block',
                  background: l.type === 'risk'
                    ? 'repeating-linear-gradient(45deg, #C62828, #C62828 2px, #e04545 2px, #e04545 4px)'
                    : LEGEND_COLORS[l.type] || '#8C95A6',
                }} />
                {l.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Section labels */}
      {sectionLabels && (
        <div style={{ display: 'flex', textAlign: 'center', marginBottom: 8 }}>
          {sectionLabels.map((sl, i) => {
            const startPct = (sl.startIdx / data.length) * 100;
            const widthPct = ((sl.endIdx - sl.startIdx + 1) / data.length) * 100;
            return (
              <React.Fragment key={sl.text}>
                {i > 0 && (
                  <span style={{ color: '#E0E4EA', alignSelf: 'center', margin: '0 8px' }}>│</span>
                )}
                <span style={{
                  flex: `0 0 ${widthPct}%`,
                  fontSize: 10, fontWeight: 600, color: '#5F6B7A',
                  background: '#F5F7FA', padding: '3px 14px', borderRadius: 9999,
                  border: '1px solid #E0E4EA', whiteSpace: 'nowrap',
                }}>
                  {sl.text}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'flex-end',
        height: height + labelHeight + 30,
        paddingBottom: labelHeight, paddingTop: 30,
      }}>
        {bars.map((d, i) => {
          const barBottom = (Math.min(d.base, d.top) - minVal) * scale;
          const barHeight = Math.max(Math.abs(d.top - d.base) * scale, 2);
          const isRisk = d.type === 'risk';
          const barBg = isRisk ? undefined : (BAR_COLORS[d.type] || '#8C95A6');
          const barStyle = isRisk ? BAR_COLORS.risk : undefined;
          const valueInside = barHeight > 28;

          return (
            <div key={`${d.label}-${i}`} style={{ flex: 1, position: 'relative', height }}>
              {/* Connector line */}
              {i > 0 && d.type !== 'total' && bars[i - 1].type !== 'total' && (
                <div style={{
                  position: 'absolute',
                  bottom: (bars[i - 1].running - minVal) * scale,
                  left: '-50%', width: '60%',
                  borderTop: '1.5px dashed #E0E4EA',
                  pointerEvents: 'none', zIndex: 1,
                }} />
              )}

              {/* Bar */}
              <div
                className="mv-waterfall-bar"
                style={{
                  position: 'absolute',
                  bottom: barBottom, height: barHeight,
                  left: '50%', transform: 'translateX(-50%)',
                  width: '70%', maxWidth: 56,
                  borderRadius: '4px 4px 0 0',
                  background: barStyle || barBg,
                  cursor: 'default',
                }}
                title={`${d.label.replace(/\n/g, ' ')}: ${formatValue(d.value)}B`}
              />

              {/* Value label */}
              <div style={{
                position: 'absolute',
                left: 0, right: 0,
                bottom: valueInside
                  ? barBottom + barHeight / 2 - 7
                  : barBottom + barHeight + 4,
                fontSize: 11, fontWeight: 700,
                whiteSpace: 'nowrap', textAlign: 'center',
                color: valueInside ? '#fff' : '#003087',
                pointerEvents: 'none',
              }}>
                {formatValue(d.value)}
              </div>

              {/* Category label */}
              <div style={{
                position: 'absolute',
                bottom: -labelHeight, height: labelHeight,
                width: '100%',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                paddingTop: 6,
                fontSize: 10, fontWeight: 500, color: '#5F6B7A',
                lineHeight: 1.25, textAlign: 'center',
              }}>
                <span dangerouslySetInnerHTML={{ __html: d.label.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Annotation */}
      {annotation && (
        <div style={{
          textAlign: annotation.position === 'right' ? 'right' : 'center',
          marginTop: -48, position: 'relative', zIndex: 2,
          paddingRight: annotation.position === 'right' ? 12 : 0,
        }}>
          <span style={{
            display: 'inline-block',
            background: annotation.style === 'warning' ? '#FFF8E1'
              : annotation.style === 'info' ? '#E8F5EE'
              : '#F0F0F0',
            border: `1px ${annotation.style === 'info' ? 'dashed' : 'solid'} ${
              annotation.style === 'warning' ? '#E8A317'
              : annotation.style === 'info' ? '#003B2C'
              : '#003B2C'
            }`,
            borderRadius: 4, padding: '4px 14px',
            fontSize: 11, fontWeight: 600,
            color: annotation.style === 'warning' ? '#8B6914' : '#003B2C',
          }}>
            {annotation.text}
          </span>
        </div>
      )}
    </div>
  );
}
