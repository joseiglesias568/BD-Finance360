'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import type { DriverMatrixRow } from '../types';

interface DriverMatrixProps {
  drivers: DriverMatrixRow[];
  onSelectDriver?: (driverId: string) => void;
}

const TrendIcon = ({ direction }: { direction: string }) => {
  if (direction === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
  if (direction === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-gray-400" />;
};

const statusLeftBorder: Record<string, string> = {
  good: 'hover:border-l-emerald-500',
  warning: 'hover:border-l-amber-500',
  critical: 'hover:border-l-red-500',
};

export default function DriverMatrix({ drivers, onSelectDriver }: DriverMatrixProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Driver Area</div>
          <div className="col-span-2 text-center">Health</div>
          <div className="col-span-2 text-center">Trend</div>
          <div className="col-span-2 text-center">Gap to Target</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {drivers.map((driver, idx) => (
          <motion.button
            key={driver.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.25 }}
            onClick={() => onSelectDriver?.(driver.id)}
            className={`w-full text-left px-5 py-3.5 grid grid-cols-12 gap-4 items-center transition-all
              border-l-4 border-l-transparent ${statusLeftBorder[driver.status] || ''}
              hover:bg-gray-50/80 cursor-pointer group`}
          >
            {/* Driver Name */}
            <div className="col-span-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#1c519c] group-hover:text-[#1c519c] transition-colors">
                  {driver.name}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1c519c] transition-colors" />
              </div>
              {driver.subDrivers && driver.subDrivers.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  {driver.subDrivers.slice(0, 3).map((sd) => (
                    <span key={sd} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                      {sd}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Health Score */}
            <div className="col-span-2 flex justify-center">
              <div className="relative w-10 h-10">
                <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke={driver.status === 'critical' ? '#EF4444' : driver.status === 'warning' ? '#F59E0B' : '#10B981'}
                    strokeWidth="3"
                    strokeDasharray={`${((isNaN(driver.score) ? 0 : driver.score) / 100) * 94.2} 94.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#1c519c]">
                  {isNaN(driver.score) ? '–' : driver.score}
                </span>
              </div>
            </div>

            {/* Trend */}
            <div className="col-span-2 flex items-center justify-center gap-1.5">
              <TrendIcon direction={driver.trendDirection} />
              <span className={`text-sm font-medium ${
                driver.trendDirection === 'up' ? 'text-emerald-600' :
                driver.trendDirection === 'down' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {driver.trend}
              </span>
            </div>

            {/* Gap */}
            <div className="col-span-2 text-center">
              <span className={`text-sm font-semibold ${
                driver.gap.startsWith('+') ? 'text-emerald-600' :
                driver.gap.startsWith('-') ? 'text-red-500' : 'text-gray-600'
              }`}>
                {driver.gap}
              </span>
            </div>

            {/* Status */}
            <div className="col-span-2 flex justify-end">
              <StatusBadge status={driver.status} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
