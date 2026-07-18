// =============================================================================
// Risks & Opportunities Adjustment Engine
// Calculates probability-weighted forecast adjustments from R&O register
// Becton, Dickinson and Company regulated electric and gas utility context
// =============================================================================

export interface ROItem {
  id: string;
  type: 'risk' | 'opportunity';
  title: string;
  probabilityPct: number;     // 0-100
  impactAmount: number;       // $M (positive = increase forecast, negative = decrease)
  expectedValue: number;      // probability x impact
  category: string;           // "Revenue", "Cost", "Operational", "Market"
  owner: string;              // "CFO", "VP Operations", etc.
  plLineAffected: string;     // "Revenue", "Cost of Sales", "Operating Expenses"
  trend: 'increasing' | 'stable' | 'decreasing';
  description: string;
}

export interface ROAdjustmentResult {
  mlForecast: number;         // $M annual revenue baseline
  totalRiskImpact: number;    // $M total expected downside
  totalOppImpact: number;     // $M total expected upside
  adjustedForecast: number;   // ML + risks + opportunities
  bestCase: number;           // ML + all opportunities at 100%
  worstCase: number;          // ML - all risks at 100%
  expectedCase: number;       // ML + probability-weighted net
  waterfall: { label: string; impact: number; type: 'risk' | 'opportunity' }[];
}

// =============================================================================
// MOCK R&O DATA
// =============================================================================

const RISK_ITEMS: ROItem[] = [
  {
    id: 'r1', type: 'risk', title: 'Commercial Real Estate Downturn',
    probabilityPct: 55, impactAmount: -1800, expectedValue: -990,
    category: 'Market', owner: 'Chief Economist', plLineAffected: 'Revenue',
    trend: 'stable', description: 'Prolonged office vacancy rates above 18% and cap rate expansion reduce advisory and leasing fee volumes by $1.8B',
  },
  {
    id: 'r2', type: 'risk', title: 'Interest Rate Volatility',
    probabilityPct: 65, impactAmount: -1400, expectedValue: -910,
    category: 'Market', owner: 'CFO', plLineAffected: 'Revenue',
    trend: 'increasing', description: 'Fed rate uncertainty suppresses capital markets deal flow — investment sales and origination volumes decline by $1.4B',
  },
  {
    id: 'r3', type: 'risk', title: 'Key Client FM Contract Losses',
    probabilityPct: 35, impactAmount: -1200, expectedValue: -420,
    category: 'Revenue', owner: 'President, Building Operations', plLineAffected: 'Revenue',
    trend: 'stable', description: 'Loss of 3-4 mega FM contracts at renewal due to competitive pressure from JLL and C&W — $1.2B ACV at risk',
  },
  {
    id: 'r4', type: 'risk', title: 'Personnel Cost Escalation',
    probabilityPct: 60, impactAmount: -850, expectedValue: -510,
    category: 'Cost', owner: 'CHRO', plLineAffected: 'Cost of Sales',
    trend: 'increasing', description: 'Talent war for CRE professionals drives compensation up — broker retention costs and FM staffing pressures add $850M',
  },
  {
    id: 'r5', type: 'risk', title: 'Integration Execution Risk',
    probabilityPct: 40, impactAmount: -650, expectedValue: -260,
    category: 'Operational', owner: 'COO', plLineAffected: 'Operating Expenses',
    trend: 'decreasing', description: 'T&T and Industrious integrations take longer than planned — $650M in delayed synergies and incremental integration costs',
  },
  {
    id: 'r6', type: 'risk', title: 'Geopolitical & Regulatory Risk',
    probabilityPct: 25, impactAmount: -580, expectedValue: -145,
    category: 'Market', owner: 'General Counsel', plLineAffected: 'Revenue',
    trend: 'stable', description: 'Cross-border investment restrictions, ESG reporting mandates, and trade tensions reduce international advisory revenue by $580M',
  },
];

const OPPORTUNITY_ITEMS: ROItem[] = [
  {
    id: 'o1', type: 'opportunity', title: 'Data Center & Digital Infrastructure Boom',
    probabilityPct: 80, impactAmount: 1350, expectedValue: 1080,
    category: 'Revenue', owner: 'President, Advisory', plLineAffected: 'Revenue',
    trend: 'increasing', description: 'AI-driven data center demand accelerating — $1.35B incremental advisory, PM, and leasing fees from hyperscaler and colocation clients',
  },
  {
    id: 'o2', type: 'opportunity', title: 'FM Outsourcing Acceleration',
    probabilityPct: 70, impactAmount: 1100, expectedValue: 770,
    category: 'Revenue', owner: 'President, Building Operations', plLineAffected: 'Revenue',
    trend: 'increasing', description: 'Corporate occupiers consolidating FM to single providers — $1.1B in new enterprise-scale outsourcing mandates',
  },
  {
    id: 'o3', type: 'opportunity', title: 'Industrious Flex Office Scale',
    probabilityPct: 55, impactAmount: 950, expectedValue: 523,
    category: 'Revenue', owner: 'President, Cargo & Other Revenue', plLineAffected: 'Revenue',
    trend: 'increasing', description: 'Industrious platform scales to 350+ locations — $950M incremental revenue from flex workspace management fees',
  },
  {
    id: 'o4', type: 'opportunity', title: 'Project Management Cross-Sell',
    probabilityPct: 65, impactAmount: 780, expectedValue: 507,
    category: 'Revenue', owner: 'President, Project Management', plLineAffected: 'Revenue',
    trend: 'stable', description: 'Cross-selling PM services into existing FM client base — $780M from workplace transformation and fit-out projects',
  },
  {
    id: 'o5', type: 'opportunity', title: 'AI & Digital Platform Monetization',
    probabilityPct: 50, impactAmount: 680, expectedValue: 340,
    category: 'Revenue', owner: 'CTO', plLineAffected: 'Revenue',
    trend: 'increasing', description: 'BD Finance360 analytics platform, smart grid digital services, and AI-powered operational analytics generate efficiency and revenue value — $680M+ from digital platform and grid modernization monetization',
  },
  {
    id: 'o6', type: 'opportunity', title: 'Operational Efficiency Program',
    probabilityPct: 70, impactAmount: 520, expectedValue: 364,
    category: 'Cost', owner: 'COO', plLineAffected: 'Cost of Sales',
    trend: 'increasing', description: 'Shared services consolidation, AI-driven process automation, and procurement optimization reduce cost of services by $520M',
  },
];

// =============================================================================
// PUBLIC API
// =============================================================================

export function getROItems(): ROItem[] {
  return [...RISK_ITEMS, ...OPPORTUNITY_ITEMS];
}

export function getRisks(): ROItem[] {
  return [...RISK_ITEMS].sort((a, b) => b.probabilityPct - a.probabilityPct);
}

export function getOpportunities(): ROItem[] {
  return [...OPPORTUNITY_ITEMS].sort((a, b) => b.probabilityPct - a.probabilityPct);
}

export function calculateROAdjustment(mlForecastRevenue: number = 42850): ROAdjustmentResult {
  const risks = getRisks();
  const opportunities = getOpportunities();

  const totalRiskImpact = risks.reduce((sum, r) => sum + r.expectedValue, 0);
  const totalOppImpact = opportunities.reduce((sum, o) => sum + o.expectedValue, 0);

  // Build waterfall items (sorted by absolute expected value)
  const waterfall: ROAdjustmentResult['waterfall'] = [];

  // Add risks (largest expected impact first)
  for (const r of risks.sort((a, b) => a.expectedValue - b.expectedValue)) {
    waterfall.push({ label: r.title, impact: r.expectedValue, type: 'risk' });
  }

  // Add opportunities (largest expected impact first)
  for (const o of opportunities.sort((a, b) => b.expectedValue - a.expectedValue)) {
    waterfall.push({ label: o.title, impact: o.expectedValue, type: 'opportunity' });
  }

  const adjustedForecast = mlForecastRevenue + totalRiskImpact + totalOppImpact;
  const bestCase = mlForecastRevenue + opportunities.reduce((sum, o) => sum + o.impactAmount, 0);
  const worstCase = mlForecastRevenue + risks.reduce((sum, r) => sum + r.impactAmount, 0);

  return {
    mlForecast: mlForecastRevenue,
    totalRiskImpact,
    totalOppImpact,
    adjustedForecast,
    bestCase,
    worstCase,
    expectedCase: adjustedForecast,
    waterfall,
  };
}

export function getTornadoData(): { label: string; low: number; high: number; expected: number }[] {
  const items = getROItems();

  return items
    .map(item => ({
      label: item.title,
      low: item.type === 'risk' ? item.impactAmount : 0,
      high: item.type === 'opportunity' ? item.impactAmount : 0,
      expected: item.expectedValue,
    }))
    .sort((a, b) => Math.abs(b.high - b.low + Math.abs(b.expected)) - Math.abs(a.high - a.low + Math.abs(a.expected)));
}
