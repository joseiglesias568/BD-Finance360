'use client';

import { Clock, Download, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ConsoleHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onToggleAI?: () => void;
  lastUpdated?: string;
}

export default function ConsoleHeader({ title, subtitle, icon: Icon, onToggleAI, lastUpdated }: ConsoleHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Icon + Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#003B2C] rounded-lg shadow-sm">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#003B2C] leading-tight">{title}</h1>
              <p className="text-xs text-gray-500 leading-tight">{subtitle}</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 mr-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated {lastUpdated}</span>
              </div>
            )}
            {onToggleAI && (
              <button
                onClick={onToggleAI}
                className="p-2 rounded-lg text-[#003B2C] hover:bg-[#F0F0F0]/50 transition-colors"
                title="AI Assistant"
              >
                <Sparkles className="w-4.5 h-4.5" />
              </button>
            )}
            <button
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              title="Export"
            >
              <Download className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
