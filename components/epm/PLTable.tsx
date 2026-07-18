'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { PLLineItem, PLForecastRow, PLPeriod } from '@/lib/epm/pl-forecast-data';
import { BOLD_LINES, INDENT_LINES, COMPUTED_LINES } from '@/lib/epm/pl-forecast-data';

interface PLTableProps {
  rows: PLForecastRow[];
  periods: PLPeriod[];
  selectedLine?: PLLineItem | null;
  onRowClick?: (lineItem: PLLineItem) => void;
}

function formatCell(value: number, lineItem: PLLineItem): string {
  if (lineItem === 'EPS') return `$${value.toFixed(2)}`;
  if (Math.abs(value) >= 10000) return `$${(value / 1000).toFixed(1)}B`;
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}M`;
}

function getConfidenceDot(confidence: number): string {
  if (confidence >= 90) return 'bg-emerald-400';
  if (confidence >= 75) return 'bg-amber-400';
  return 'bg-red-400';
}

export default function PLTable({ rows, periods, selectedLine, onRowClick }: PLTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-600 sticky left-0 bg-gray-50 z-10 min-w-[180px]">
              P&L Line Item
            </th>
            {periods.map((p) => (
              <th
                key={p.label}
                className={`text-right py-2 px-2.5 font-semibold min-w-[85px] ${
                  p.isHistorical ? 'text-gray-400 bg-gray-50' :
                  p.isCurrent ? 'text-amber-700 bg-amber-50/50' :
                  'text-gray-600 bg-white'
                }`}
              >
                {p.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isBold = BOLD_LINES.includes(row.lineItem);
            const isIndent = INDENT_LINES.includes(row.lineItem);
            const isComputed = COMPUTED_LINES.includes(row.lineItem);
            const isSelected = selectedLine === row.lineItem;
            const hasDrivers = !isComputed && row.lineItem !== 'EPS';
            const isClickable = onRowClick && hasDrivers;

            return (
              <motion.tr
                key={row.lineItem}
                className={`border-b border-gray-100 transition-colors ${
                  isSelected ? 'bg-[#003B2C]/5 border-l-2 border-l-[#003B2C]' :
                  hoveredRow === row.lineItem && isClickable ? 'bg-gray-50' : ''
                } ${isClickable ? 'cursor-pointer' : ''} ${
                  row.lineItem === 'Gross Profit' || row.lineItem === 'Operating Income'
                    ? 'border-t border-t-gray-300' : ''
                }`}
                onMouseEnter={() => setHoveredRow(row.lineItem)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => isClickable && onRowClick?.(row.lineItem)}
              >
                <td className={`py-2 px-3 sticky left-0 bg-white z-10 ${
                  isBold ? 'font-bold text-gray-900' : 'text-gray-700'
                } ${isIndent ? 'pl-6' : ''} ${isSelected ? 'bg-[#003B2C]/5' : ''}`}>
                  <div className="flex items-center gap-1.5">
                    {isClickable && (
                      <ChevronRight className={`h-3 w-3 transition-transform ${isSelected ? 'rotate-90 text-[#003B2C]' : 'text-gray-300'}`} />
                    )}
                    {row.lineItem}
                  </div>
                </td>
                {periods.map((p) => {
                  const val = row.values[p.label];
                  const conf = row.confidence[p.label];
                  return (
                    <td
                      key={p.label}
                      className={`py-2 px-2.5 text-right font-mono tabular-nums ${
                        isBold ? 'font-bold text-gray-900' : 'text-gray-700'
                      } ${p.isHistorical ? 'bg-gray-50/50' : p.isCurrent ? 'bg-amber-50/30' : ''
                      } ${isSelected ? 'bg-[#003B2C]/5' : ''}`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>{formatCell(val, row.lineItem)}</span>
                        {p.isForecast && conf < 100 && (
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${getConfidenceDot(conf)}`} />
                        )}
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
