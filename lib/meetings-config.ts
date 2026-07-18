// Meeting configuration for the Presentation Hub
// Defines standard recurring financial meetings with metadata and slide definitions
//
// Dynamic values use {{placeholder}} syntax and are resolved at runtime
// by lib/meetings-data.ts using live database values. If a placeholder cannot
// be resolved, the raw {{token}} is left in place as a fallback indicator.

export type MeetingCadence = 'Monthly' | 'Quarterly' | 'Annual';
export type MeetingStatus = 'Ready' | 'In Prep' | 'Upcoming';

export interface SlideDefinition {
  id: string;
  title: string;
  subtitle?: string;
  memo: string;
  checked: boolean;
}

export interface MeetingConfig {
  slug: string;
  name: string;
  shortName: string;
  cadence: MeetingCadence;
  description: string;
  nextDate: string;
  status: MeetingStatus;
  icon: string; // lucide icon name
  audienceLabel: string;
  slides: SlideDefinition[];
}

export const meetings: MeetingConfig[] = [
  {
    slug: 'monthly-operating-review',
    name: 'Monthly Operating Review (MOR)',
    shortName: 'MOR',
    cadence: 'Monthly',
    description: 'CFO review of P&L performance, segment results, and key operating metrics across Health Care Benefits, Health Services, and Pharmacy & Consumer Wellness segments.',
    nextDate: 'Mar 18, 2026',
    status: 'Ready',
    icon: 'BarChart3',
    audienceLabel: 'Executive · CFO Review',
    slides: [
      { id: 'mor-title', title: 'Title Slide', subtitle: 'Monthly Operating Review', memo: 'Opening title slide with meeting metadata, attendees, and agenda overview.', checked: true },
      { id: 'mor-exec', title: 'Executive Summary', subtitle: 'Q2 FY2026 — Tracking Ahead of Plan', memo: '{{fiscal_quarter}} consolidated revenue of <strong>{{consolidated_revenue}}</strong> (<span class="memo-positive">{{consolidated_revenue_yoy}} YoY</span>), driven by Domestic Mainline Revenue fee revenue growth of {{advisory_growth}}. Operating margin at <strong>{{operating_margin}}</strong>, expanding {{operating_margin_bps_yoy}} YoY. AUM reached <strong>{{aum_total}}</strong>. Finance360 initiatives tracking ahead of plan.', checked: true },
      { id: 'mor-revenue', title: 'Revenue Overview', subtitle: 'Quarterly revenue trend and P&L summary', memo: 'Consolidated revenue trending upward with <span class="memo-positive">+6.8% YoY growth</span>. P&L summary shows improving gross margin and operating leverage. Revenue mix shifting toward higher-margin advisory and investment management fees.', checked: true },
      { id: 'mor-segments', title: 'Revenue by Segment', subtitle: 'Domestic Mainline Revenue leads growth; Building Ops expanding', memo: 'Domestic Mainline Revenue revenue of <strong>{{na_revenue}}</strong> (<span class="memo-positive">{{na_revenue_yoy}} YoY</span>), Building Operations at <strong>{{intl_revenue}}</strong> (<span class="memo-positive">{{intl_revenue_yoy}}</span>), Cargo & Other Revenue at <strong>{{channel_revenue}}</strong> (<span class="memo-negative">{{channel_revenue_yoy}}</span>). Capital markets recovery accelerating after prior quarter softness.', checked: true },
      { id: 'mor-comps', title: 'Fee Revenue Growth', subtitle: 'Volume-driven growth with leasing leading', memo: 'Global fee revenue growth of <strong>{{organic_growth}}</strong> — driven by <strong>{{transaction_growth}} volume growth</strong> and <strong>{{ticket_growth}} fee rate improvement</strong>. Americas leading at {{advisory_growth}}. Capital markets and leasing continue to drive mix shift.', checked: true },
      { id: 'mor-margin', title: 'Operating Margin Analysis', subtitle: 'Margin walk — revenue leverage and operational efficiencies driving expansion', memo: 'Consolidated operating margin of <strong>{{operating_margin}}</strong> (<span class="memo-positive">{{operating_margin_bps_yoy}} YoY</span>). Revenue leverage and outsourcing efficiencies offset by compensation investments. Finance360 transformation initiatives contributing to savings.', checked: true },
      { id: 'mor-digital', title: 'Digital & Grid Modernization', subtitle: 'AMI deployment and data center ESA growth — {{aum_total}} consolidated rate base', memo: 'Consolidated rate base at <strong>{{aum_total}}</strong> (<span class="memo-positive">{{aum_growth_yoy}} YoY</span>). Data center ESA contracted load at <strong>{{digital_adoption_pct}} of FY2026 target</strong>. AMI smart meter deployment supporting customer digital self-service adoption.', checked: true },
      { id: 'mor-stores', title: 'Office & Acquisition Pipeline', subtitle: '+{{net_new_mandates}} new mandates globally; Industrious integration on track', memo: 'New mandates won: <strong>{{net_new_mandates}} in Q2</strong>. Total global office count at <strong>{{total_office_count}}</strong>. Industrious flex space integration on track with strong fee revenue lift in integrated locations.', checked: true },
      { id: 'mor-menu', title: 'Service Innovation & Pipeline', subtitle: 'Leasing and capital markets advisory driving growth', memo: 'Leasing volume at $42B, capital markets advisory showing +8pp YoY growth. Cross-sell rate improving to 34%. Service line expansion into sustainability advisory and digital twin capabilities.', checked: true },
      { id: 'mor-supply', title: 'Cost Structure & Delivery', subtitle: 'Cost walk — shared services savings and platform automation offsetting inflation', memo: 'Cost of services as % of revenue at <strong>{{cogs_pct_revenue}}</strong> (<span class="memo-positive">{{cogs_bps_yoy}} YoY</span>). Compensation costs managed through FY2026. Platform automation driving efficiency improvement.', checked: true },
      { id: 'mor-cx', title: 'Client Experience', subtitle: 'NPS, CSAT, and service delivery performance scorecard', memo: 'Client satisfaction improving across key touchpoints. NPS at 62, CSAT at 4.5/5.0. Service response times improving with digital platform deployment. SLA compliance at 97.1%.', checked: true },
      { id: 'mor-people', title: 'People & Culture', subtitle: 'Employee satisfaction, retention, and development metrics', memo: 'Employee satisfaction at 78% with upward trend. Producer retention improving by 4pp YoY. Training completion at 89%. Internal promotion rate at 42%. Employee NPS tracking at industry-leading levels.', checked: true },
      { id: 'mor-compete', title: 'Regulatory & Competitive Landscape', subtitle: 'MCR and MA star ratings vs. health plan peers', memo: 'BD MA MCR 90.4% vs. UnitedHealth 85.1% — key priority for recovery. Aetna MA stars: 4.0 weighted avg, above CMS threshold for bonus payments. Key competitive dynamics: UnitedHealth market share pressure in commercial; Cigna PBM competition in specialty; Humana MA overlap in South/Southeast markets.', checked: true },
      { id: 'mor-intl', title: 'Global Markets Deep-Dive', subtitle: '6 key regions — revenue, growth, and strategic insights', memo: 'Global segment showing strong momentum with EMEA recovering. APAC markets accelerating. Latin America pipeline growing. Middle East investment activity increasing.', checked: true },
      { id: 'mor-risks', title: 'Risk Assessment', subtitle: 'Balanced risk profile — $0.6B downside range vs $1.3B upside potential', memo: 'Key risks: airline market cycle uncertainty (<span class="memo-negative">$150-200M revenue risk</span>), talent cost inflation, and interest rate volatility. Opportunities: capital markets rebound (<span class="memo-positive">+$300M potential</span>), Industrious scale-up, and digital platform monetization.', checked: true },
      { id: 'mor-strategy', title: 'Strategic Initiatives Tracker', subtitle: '6 active initiatives under Finance360 strategy', memo: 'Six strategic initiatives tracked against budget and milestones. Finance360 platform at 65% progress, Industrious integration at 45%. Total program spend of $1.8B with $985M deployed. Three initiatives on-track, two need attention.', checked: true },
      { id: 'mor-outlook', title: 'Forward Outlook & Guidance', subtitle: 'Internal forecast favorable across all key metrics vs. Street', memo: 'Internal revenue forecast of <strong>{{revenue_forecast}}</strong> vs. Street consensus. EPS guidance of <strong>{{annual_eps}}</strong>. Key swing factor: airline market recovery trajectory and capital markets volumes.', checked: true },
      { id: 'mor-actions', title: 'Decisions & Next Steps', subtitle: '3 decisions required by April 10 — 5 active action items', memo: '5 active action items. <strong>Near-term priorities:</strong> Q3 fee pricing strategy approval (Mar 25), Industrious expansion acceleration decision (Apr 1), and EMEA market deep-dive with Global Ops team (Apr 5).', checked: true },
      { id: 'mor-appendix', title: 'Appendix & Q&A', subtitle: 'Additional data, platform links, and open discussion', memo: 'Supplementary materials and deep-dive links to BD Finance360 platform modules. Open floor for questions and discussion.', checked: true },
    ],
  },
  {
    slug: 'earnings-call-prep',
    name: 'Earnings Call Prep',
    shortName: 'Earnings Prep',
    cadence: 'Quarterly',
    description: 'Pre-earnings analysis with guidance vs. consensus comparison, talking points, and Q&A preparation for the quarterly earnings call.',
    nextDate: 'Apr 22, 2026',
    status: 'In Prep',
    icon: 'Mic',
    audienceLabel: 'Executive · Investor Relations',
    slides: [
      { id: 'ec-0', title: 'Earnings Overview', memo: 'Quarterly earnings summary and key highlights.', checked: true },
      { id: 'ec-1', title: 'Revenue Walk', memo: 'Revenue bridge from prior year to current quarter.', checked: true },
      { id: 'ec-2', title: 'EPS Bridge', memo: 'Earnings per share walk with key drivers.', checked: true },
      { id: 'ec-3', title: 'Guidance Update', memo: 'Updated full-year guidance and assumptions.', checked: true },
      { id: 'ec-4', title: 'Analyst Q&A Prep', memo: 'Anticipated questions and recommended responses.', checked: true },
    ],
  },
  {
    slug: 'board-of-directors-update',
    name: 'Board of Directors Update',
    shortName: 'Board Update',
    cadence: 'Quarterly',
    description: 'Board-ready financial summary, strategic progress update, and key governance items for the quarterly board meeting.',
    nextDate: 'May 12, 2026',
    status: 'Upcoming',
    icon: 'Users',
    audienceLabel: 'Board · Governance',
    slides: [
      { id: 'bd-0', title: 'CEO Strategic Update', memo: 'Finance360 strategy progress and milestones.', checked: true },
      { id: 'bd-1', title: 'Financial Performance', memo: 'Consolidated P&L and segment highlights.', checked: true },
      { id: 'bd-2', title: 'Capital Returns', memo: 'Dividend and share repurchase program update.', checked: true },
      { id: 'bd-3', title: 'Risk Dashboard', memo: 'Enterprise risk register and key mitigation actions.', checked: true },
      { id: 'bd-4', title: 'ESG & Sustainability', memo: 'ESG framework, sustainability targets, and progress.', checked: true },
    ],
  },
  {
    slug: 'capital-allocation-review',
    name: 'Capital Allocation Review',
    shortName: 'CapEx Review',
    cadence: 'Quarterly',
    description: 'CapEx tracking, acquisition pipeline ROI analysis, technology investments, and capital deployment priorities.',
    nextDate: 'Apr 8, 2026',
    status: 'Upcoming',
    icon: 'PiggyBank',
    audienceLabel: 'Finance · Capital Planning',
    slides: [
      { id: 'ca-0', title: 'CapEx Summary', memo: 'Year-to-date capital expenditure vs. budget.', checked: true },
      { id: 'ca-1', title: 'Acquisition Pipeline ROI', memo: 'Acquisition and integration return metrics.', checked: true },
      { id: 'ca-2', title: 'Technology Investments', memo: 'Digital platform, operations analytics, and AI investments.', checked: true },
      { id: 'ca-3', title: 'Free Cash Flow', memo: 'FCF generation and allocation priorities.', checked: true },
    ],
  },
  {
    slug: 'annual-budget-planning',
    name: 'Annual Budget Planning (AOP)',
    shortName: 'AOP',
    cadence: 'Annual',
    description: 'Next fiscal year budget build, assumptions, segment targets, and investment priorities for the annual operating plan.',
    nextDate: 'Jul 2026',
    status: 'Upcoming',
    icon: 'Calculator',
    audienceLabel: 'Finance · FP&A',
    slides: [
      { id: 'aop-0', title: 'Planning Assumptions', memo: 'Macro and airline market assumptions for FY2027.', checked: true },
      { id: 'aop-1', title: 'Revenue Targets', memo: 'Segment revenue builds and growth assumptions.', checked: true },
      { id: 'aop-2', title: 'Cost Structure', memo: 'Compensation, cost of services, G&A, and investment targets.', checked: true },
      { id: 'aop-3', title: 'Margin Targets', memo: 'Operating margin walk and improvement levers.', checked: true },
    ],
  },
  {
    slug: 'investor-day-prep',
    name: 'Investor Day Prep',
    shortName: 'Investor Day',
    cadence: 'Annual',
    description: 'Long-range strategic plan, three-year financial framework, and segment deep-dives for the annual investor conference.',
    nextDate: 'Sep 2026',
    status: 'Upcoming',
    icon: 'TrendingUp',
    audienceLabel: 'Executive · Investor Relations',
    slides: [
      { id: 'inv-0', title: 'Strategic Vision', memo: 'CEO long-range vision and strategic pillars.', checked: true },
      { id: 'inv-1', title: 'Three-Year Financial Framework', memo: 'Revenue, margin, and EPS targets through FY2029.', checked: true },
      { id: 'inv-2', title: 'Growth Algorithm', memo: 'Organic growth, M&A pipeline, and margin expansion drivers.', checked: true },
      { id: 'inv-3', title: 'Digital & Innovation', memo: 'Digital roadmap and innovation pipeline.', checked: true },
    ],
  },
];

export function getMeetingBySlug(slug: string): MeetingConfig | undefined {
  return meetings.find(m => m.slug === slug);
}
