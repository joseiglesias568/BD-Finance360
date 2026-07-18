'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import type { RiskItem } from '@/config/types';
import { getRiskSeverityClasses } from '@/lib/engines/health-engine';

interface RiskHeatMapProps {
  risks: RiskItem[];
}

const levels = ['low', 'medium', 'high'] as const;
const levelLabels = { low: 'Low', medium: 'Med', high: 'High' };

const cellColors: Record<string, string> = {
  'high-high': 'bg-red-500/20 border-red-300',
  'high-medium': 'bg-red-400/15 border-red-200',
  'medium-high': 'bg-orange-400/15 border-orange-200',
  'medium-medium': 'bg-yellow-300/15 border-yellow-200',
  'low-high': 'bg-yellow-200/15 border-yellow-100',
  'low-medium': 'bg-green-200/15 border-green-100',
  'high-low': 'bg-orange-300/15 border-orange-200',
  'medium-low': 'bg-green-300/15 border-green-100',
  'low-low': 'bg-green-100/20 border-green-100',
};

export default function RiskHeatMap({ risks }: RiskHeatMapProps) {
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);

  const getRisksInCell = (severity: string, likelihood: string) =>
    risks.filter(r => r.severity === severity && r.likelihood === likelihood);

  return (
    <div>
      <div className="flex gap-6">
        {/* Y-axis label */}
        <div className="flex flex-col items-center justify-center w-6">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
            Likelihood
          </span>
        </div>

        <div className="flex-1">
          {/* Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {/* Render rows from high likelihood (top) to low (bottom) */}
            {[...levels].reverse().map(likelihood => (
              levels.map(severity => {
                const cellRisks = getRisksInCell(severity, likelihood);
                const key = `${likelihood}-${severity}`;
                return (
                  <div
                    key={key}
                    className={`min-h-[72px] rounded-lg border p-2 ${cellColors[key] || 'bg-gray-50 border-gray-100'}`}
                  >
                    <div className="flex flex-wrap gap-1">
                      {cellRisks.map(risk => (
                        <button
                          key={risk.id}
                          onClick={() => setSelectedRisk(risk)}
                          className={`text-[10px] font-medium px-2 py-1 rounded-md border transition-all hover:shadow-sm truncate max-w-full ${getRiskSeverityClasses(risk.severity)}`}
                        >
                          {risk.title.length > 30 ? risk.title.slice(0, 28) + '...' : risk.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            ))}
          </div>

          {/* X-axis labels */}
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {levels.map(s => (
              <div key={s} className="text-center text-[10px] font-semibold text-gray-400 uppercase">
                {levelLabels[s]}
              </div>
            ))}
          </div>
          <div className="text-center mt-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Severity</span>
          </div>
        </div>

        {/* Y-axis row labels */}
        <div className="flex flex-col-reverse justify-around w-10">
          {levels.map(l => (
            <span key={l} className="text-[10px] font-semibold text-gray-400 uppercase text-right">
              {levelLabels[l]}
            </span>
          ))}
        </div>
      </div>

      {/* Risk detail overlay */}
      <AnimatePresence>
        {selectedRisk && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="mt-4 bg-white rounded-xl border border-gray-200 shadow-lg p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <h4 className="font-semibold text-gray-900">{selectedRisk.title}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getRiskSeverityClasses(selectedRisk.severity)}`}>
                  {selectedRisk.severity.toUpperCase()}
                </span>
              </div>
              <button onClick={() => setSelectedRisk(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">{selectedRisk.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Severity</p>
                <p className="font-semibold text-gray-900 capitalize">{selectedRisk.severity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Likelihood</p>
                <p className="font-semibold text-gray-900 capitalize">{selectedRisk.likelihood}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Owner</p>
                <p className="font-semibold text-gray-900">{selectedRisk.owner}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Impact</p>
                <p className="font-semibold text-red-600">{selectedRisk.impact}</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-[#F0F0F0]/30 rounded-lg border border-[#003B2C]/10">
              <p className="text-xs font-semibold text-[#003B2C] mb-1">Mitigation Strategy</p>
              <p className="text-sm text-[#003B2C]">{selectedRisk.mitigation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
