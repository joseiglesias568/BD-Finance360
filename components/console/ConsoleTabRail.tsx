'use client';

import type { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ConsoleTabRailProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ConsoleTabRail({ tabs, activeTab, onTabChange }: ConsoleTabRailProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-[52px] z-[9]">
      <div className="px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-all whitespace-nowrap
                  ${isActive
                    ? 'border-[#003B2C] text-[#003B2C]'
                    : 'border-transparent text-gray-500 hover:text-[#003B2C] hover:border-gray-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
