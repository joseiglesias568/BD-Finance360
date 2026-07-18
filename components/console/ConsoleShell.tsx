'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, GitBranch, TrendingUp, BarChart3 } from 'lucide-react';
import ConsoleHeader from './ConsoleHeader';
import ConsoleFilterBar from './ConsoleFilterBar';
import ConsoleTabRail from './ConsoleTabRail';

import type { ConsoleConfig, ConsoleFilters, ConsoleTabDef } from './types';

const defaultTabs: ConsoleTabDef[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, enabled: true },
  { id: 'drivers', label: 'Business Drivers', icon: GitBranch, enabled: true },
  { id: 'bridge', label: 'Variance Analysis', icon: TrendingUp, enabled: true },
  { id: 'data', label: 'Standard Trends', icon: BarChart3, enabled: true },
];

interface ConsoleShellProps {
  config: ConsoleConfig;
  children: (props: {
    activeTab: string;
    filters: ConsoleFilters;
    setActiveTab: (tab: string) => void;
    selectedDriverId: string | null;
    setSelectedDriverId: (id: string | null) => void;
  }) => React.ReactNode;
}

export default function ConsoleShell({ config, children }: ConsoleShellProps) {
  const tabs = (config.tabs || defaultTabs).filter((t) => t.enabled);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'overview');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  // Initialize filter state from config defaults
  const [filters, setFilters] = useState<ConsoleFilters>(() => {
    const init: ConsoleFilters = {};
    [...config.primaryFilters, ...config.secondaryFilters].forEach((f) => {
      init[f.id] = f.defaultValue;
    });
    return init;
  });

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleNavigateToDrivers = useCallback((driverId: string) => {
    setSelectedDriverId(driverId);
    setActiveTab('drivers');
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ConsoleHeader
        title={config.title}
        subtitle={config.subtitle}
        icon={config.icon}
        lastUpdated="2h ago"
      />

      <ConsoleFilterBar
        primaryFilters={config.primaryFilters}
        secondaryFilters={config.secondaryFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <ConsoleTabRail
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content Area */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] mx-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children({
            activeTab,
            filters,
            setActiveTab,
            selectedDriverId,
            setSelectedDriverId,
          })}
        </motion.div>
      </div>

    </div>
  );
}
