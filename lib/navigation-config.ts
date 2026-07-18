// Navigation configuration for the horizontal top nav
// Defines the dropdown structure: Executive, Consoles, Tools, EPM, Report Hub

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
  comingSoon?: boolean;
}

export interface NavCategory {
  name: string;
  items: NavDropdownItem[];
}

export interface NavItem {
  label: string;
  href?: string;            // Direct link (no dropdown)
  items?: NavDropdownItem[]; // Dropdown items
  megaMenuColumns?: NavCategory[][]; // Mega-menu: columns of categorized items
}

export const mainNavigation: NavItem[] = [
  {
    label: 'Executive',
    items: [
      {
        label: 'Executive Summary',
        href: '/executive-summary',
        description: 'Strategic overview and key decisions',
      },
      {
        label: 'Monthly Operating Report',
        href: '/monthly-report',
        description: 'Comprehensive monthly analysis',
      },
      {
        label: 'Meeting Hub',
        href: '/build-presentation',
        description: 'AI-powered deck builder',
      },
      {
        label: 'Financial Close Tracker',
        href: '/financial-close',
        description: 'Agentic close process flow — milestones, escalations, and sign-off gates',
      },
    ],
  },
  {
    label: 'Business Consoles',
    megaMenuColumns: [
      [
        {
          name: 'BD Segments',
          items: [
            { label: 'Medical Essentials Console', href: '/business-consoles/medical-essentials' },
            { label: 'Connected Care Console', href: '/business-consoles/connected-care' },
            { label: 'BioPharma Systems Console', href: '/business-consoles/biopharma-systems' },
            { label: 'Interventional Console', href: '/business-consoles/interventional' },
            { label: 'Competitive Intelligence', href: '/competitive-intelligence' },
          ],
        },
      ],
      [
        {
          name: 'Strategy',
          items: [
            { label: 'Strategy Execution', href: '/business-consoles/strategy-execution' },
          ],
        },
        {
          name: 'Financial',
          items: [
            { label: 'Financial Performance & Treasury', href: '/business-consoles/financial-performance', comingSoon: true },
            { label: 'Capital Structure & Leverage', href: '/business-consoles/capital-allocation', comingSoon: true },
          ],
        },
      ],
      [
        {
          name: 'Risk',
          items: [
            { label: 'Risk, Compliance & ESG', href: '/business-consoles/risk-compliance', comingSoon: true },
          ],
        },
      ],
    ],
  },
  {
    label: 'Analytics & Reporting',
    items: [
      {
        label: 'Report Hub',
        href: '/report-hub',
        description: 'Centralized report library and distribution for BD MedTech financial analytics',
      },
      {
        label: 'Competitive Intelligence',
        href: '/competitive-intelligence',
        description: 'MedTech competitor benchmarking, segment market share analysis, and strategic positioning vs. Medtronic, Abbott, Stryker, and Edwards',
      },
      {
        label: 'Scenario Modeling',
        href: '/scenario-modeling',
        description: 'What-if analysis for GLP-1 demand, China VoBP headwind, Alaris market return, and organic revenue growth scenarios',
      },
      {
        label: 'Sandbox',
        href: '/sandbox',
        description: 'Experimental analytics environment for BD MedTech financial data exploration',
      },
    ],
  },
  {
    label: 'Planning & Forecasting',
    items: [
      {
        label: '18-Month Rolling Forecast',
        href: '/epm/ml-forecasting',
        description: 'Full P&L cascade with ML-predicted revenue, organic growth, segment margin, and COGS drivers',
      },
      {
        label: 'Quarterly Bridge Walk',
        href: '/epm/bridge-walks',
        description: 'Forecast vs actuals waterfall by P&L line across Medical Essentials, Connected Care, BioPharma Systems, and Interventional',
      },
      {
        label: 'Fiscal Year Plan',
        href: '/epm/fiscal-year-plan',
        description: 'Annual plan vs YTD actuals and full-year projection by segment — organic growth, adjusted operating margin, and free cash flow',
      },
      {
        label: 'Short-Term Planning',
        href: '/epm/short-term-planning',
        description: 'Interactive 0-6 month planning with segment revenue and operating income driver adjustments',
      },
      {
        label: 'Long-Term Planning',
        href: '/epm/long-term-planning',
        description: '12-36 month strategic planning — China VoBP recovery, Alaris ramp, GLP-1 volume growth, and leverage reduction',
      },
      {
        label: 'Cost Index Tracking',
        href: '/commodity-tracking',
        description: 'COGS input cost tracker, manufacturing cost indices, commodity exposure, and BD Simplify program savings',
      },
      {
        label: 'Risks & Opportunities',
        href: '/epm/risks-opportunities',
        description: 'Management adjustments to ML forecast with R&O waterfall for BD business cycles and segment seasonality',
      },
    ],
  },
  {
    label: 'AI',
    items: [
      {
        label: 'How AI Works Here',
        href: '/ai-overview',
        description: 'Visual overview of the AI agent team, workflows, and data guardrails',
      },
      {
        label: 'The Data Foundation',
        href: '/data-foundation',
        description: 'What data is needed, how the foundation is built, and the maturity curve to AI-ready analytics',
      },
      {
        label: 'Data Lineage & Source Audit',
        href: '/data-lineage',
        description: 'Confidence ratings, source citations, and lineage for every major financial figure on this platform',
      },
      {
        label: 'AI Search',
        href: '/ai-search',
        description: 'Natural language financial search and analysis',
      },
      {
        label: 'AI Alerts',
        href: '/ai-alerts',
        description: 'Intelligent anomaly detection and notifications',
      },
      {
        label: 'AI Insight / Human Commentary',
        href: '/commentary',
        description: 'AI-generated narrative commentary and analysis',
      },
      {
        label: 'How to Get Started',
        href: '/implementation-roadmap',
        description: 'Illustrative roadmap from Demo to Production — data, platform, UX, and agentic capability workstreams',
      },
      {
        label: 'Deployment Scoping Worksheet',
        href: '/implementation-roadmap/scoping-worksheet',
        description: 'Interactive POC / Pilot / Production scoping tool — timeline, investment, and team estimates based on your use case and data scope',
      },
    ],
  },
];
