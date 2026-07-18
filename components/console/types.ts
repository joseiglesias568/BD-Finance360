import type { LucideIcon } from 'lucide-react';

// =============================================================================
// Console Template Configuration Types
// Used by ConsoleShell to render any business console generically
// =============================================================================

/** Filter definition for the console filter bar */
export interface FilterDef {
  id: string;
  label: string;
  type: 'select' | 'toggle' | 'pills';
  options: { value: string; label: string }[];
  defaultValue: string;
}

/** Hero KPI configuration for the Overview tab */
export interface HeroKPIDef {
  id: string;
  label: string;
  metricKey: string;        // Key to look up in KPIConfig
  format?: 'currency' | 'percent' | 'number' | 'compact';
  sparklineData?: number[];
  targetLabel?: string;
}

/** Tab configuration */
export interface ConsoleTabDef {
  id: string;
  label: string;
  icon: LucideIcon;
  enabled: boolean;
}

/** Main console configuration - one per console instance */
export interface ConsoleConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  segment: string;

  /** Which KPIs to show in the hero strip */
  heroKPIs: HeroKPIDef[];

  /** Primary filters (always visible) */
  primaryFilters: FilterDef[];

  /** Secondary filters (expandable) */
  secondaryFilters: FilterDef[];

  /** Tab overrides */
  tabs?: ConsoleTabDef[];
}

/** Filter state passed to tab components */
export interface ConsoleFilters {
  [key: string]: string;
}

/** AI Pulse insight item */
export interface PulseInsight {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'positive';
  headline: string;
  detail: string;
  action?: string;
  actionTab?: string;
}

/** Driver matrix row for the Overview tab */
export interface DriverMatrixRow {
  id: string;
  name: string;
  score: number;       // 0-100 health score
  trend: string;       // e.g., "+2.3%" or "-1.0%"
  trendDirection: 'up' | 'down' | 'flat';
  gap: string;         // e.g., "-3pp" or "+1.2M"
  status: 'good' | 'warning' | 'critical';
  subDrivers?: string[];
}

/** Bridge item for the Bridge tab */
export interface BridgeCommentary {
  id: string;
  component: string;
  value: number;         // $M
  percentImpact: string;
  aiSuggestion: string;
  userCommentary?: string;
  author?: string;
  date?: string;
  status: 'draft' | 'submitted' | 'approved' | 'signed-off';
  subItems?: { name: string; value: number; description: string }[];
}
