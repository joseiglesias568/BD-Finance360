// ============================================================
// Client Configuration Types
// All client-specific data is typed here for consistency
// ============================================================

// --- BRANDING ---
export interface BrandColors {
  primary: string;       // Main brand color (hex)
  primaryDark: string;   // Dark variant
  primaryLight: string;  // Light variant / soft background
  primaryAlt: string;    // Alternate primary shade
  navBg: string;         // Navigation/header background
  navBgLight: string;    // Navigation lighter shade
  accent: string;        // Accent color
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export interface BrandingConfig {
  companyName: string;
  ticker: string;
  platformName: string;
  tagline: string;
  subtitle: string;
  logoPath: string;
  logoAlt: string;
  copyrightHolder: string;
  copyrightYear: number;
  poweredBy: string;
  designedBy: string;
  ceo: string;
  cfo: string;
  /** Persona title shown in shell (e.g. Chief Financial Officer) */
  cfoTitle: string;
  fiscalYearEnd: string;
  industry: string;
  headquarters: string;
  colors: BrandColors;
}

// --- FINANCIAL DATA ---
export interface QuarterData {
  quarter: string;       // e.g., "Q1 2025"
  revenue: number;       // in billions
  revenueYoY: number;    // percentage change
  operatingIncome: number;
  operatingMargin: number;
  eps: number;
  feeRevenueGrowth: number;      // organic fee revenue growth (%)
  netNewClients?: number;         // net new client mandates won
  leasingRevenue?: number;        // Advisory: leasing revenue in billions
  propertySalesRevenue?: number;  // Advisory: property sales revenue in billions
  aum?: number;                   // REI: assets under management in billions
  loanServicingPortfolio?: number; // Advisory: loan servicing portfolio in billions
  /** When present (e.g. merged from seed provenance), adjusted revenue YoY % alongside GAAP `revenueYoY`. */
  adjustedRevenueYoY?: number;
}

export interface SegmentData {
  name: string;
  revenue: number;       // in billions
  revenuePercent: number; // percent of total
  yoyChange: number;     // percentage
  operatingMargin?: number;
  description: string;
}

export interface PLLineItem {
  label: string;
  actual: number;        // in millions or billions
  plan: number;
  priorYear: number;
  variance: number;
  variancePercent: number;
}

export interface BridgeItem {
  label: string;
  impact: number;        // in millions, positive = favorable
  description: string;
  category: 'volume' | 'mix' | 'pricing' | 'cost' | 'fx' | 'other';
}

/** Optional headline metrics for the exec dashboard — often adjusted/non-GAAP where cited in seed research. */
export interface ExecutiveDisplayMetrics {
  adjustedRevenueYoYPercent?: number;
  premiumProductRevenueYoYPercent?: number;
  adjustedOperatingMarginPercent?: number;
  adjustedEpsDollars?: number;
  /** Near-term FCF proxy for hero tile ($B). */
  freeCashFlowQuarterlyBillions?: number;
  /** Short caption under revenue headline (e.g. GAAP vs adjusted). */
  revenueFootnote?: string;
}

export interface FinancialConfig {
  // Annual data
  fiscalYear: string;
  annualRevenue: number;          // billions
  annualRevenueYoY: number;       // percent
  annualOperatingIncome: number;  // billions
  annualOperatingMargin: number;  // percent
  annualNetIncome: number;        // billions
  annualEPS: number;

  // Quarterly data
  quarters: QuarterData[];
  latestQuarter: QuarterData;

  // Segments
  segments: SegmentData[];

  // P&L Summary (most recent period)
  plSummary: {
    revenue: PLLineItem;
    cogs: PLLineItem;
    grossProfit: PLLineItem;
    operatingExpenses: PLLineItem;
    operatingIncome: PLLineItem;
    netIncome: PLLineItem;
  };

  // Revenue Bridge
  revenueBridge: BridgeItem[];

  // Key Financial Ratios
  ratios: {
    currentRatio: number;
    currentRatioTarget?: number;
    debtToEquity: number;
    debtToEquityTarget?: number;
    returnOnEquity: number;
    returnOnAssets: number;
    returnOnAssetsTarget?: number;
    freeCashFlow: number;      // billions
    freeCashFlowTarget?: number; // billions
    dividendPerShare: number;
  };

  // Working Capital
  workingCapital: {
    dso: number;  // days sales outstanding
    dsoTarget: number;
    inventoryDays: number;
    inventoryDaysTarget: number;
    dpo: number;  // days payable outstanding
    dpoTarget: number;
  };

  // Detailed P&L baseline for scenario engine (all values in $M)
  // Single source of truth shared across scenario modeling and other pages
  scenarioBaseline: ScenarioBaselinePL;

  /** Dashboard hero / disclosure-oriented metrics when DB rows omit adjusted figures (Delta seed). */
  executiveDisplayMetrics?: ExecutiveDisplayMetrics;
}

// --- KPI DATA ---
export interface KPIMetric {
  label: string;
  value: string | number;
  unit: string;          // e.g., "%", "B", "M", "K", "pts"
  target?: string | number;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;    // e.g., "+2.8%", "-0.3pp"
  status: 'good' | 'warning' | 'critical';
  description?: string;
  consoleId?: string;          // business console this KPI belongs to
  consoleName?: string;        // display name for the business console
  architectureCategory?: string; // architecture grouping (e.g., 'revenue-market', 'store-operations')
  variancePercent?: number;    // variance vs target as percentage
}

export interface KPIConfig {
  // Primary KPIs shown on executive dashboard
  primaryKPIs: KPIMetric[];

  // Secondary/operational KPIs
  operationalKPIs: KPIMetric[];

  // Digital/customer KPIs
  digitalKPIs: KPIMetric[];

  // Financial KPIs
  financialKPIs: KPIMetric[];
}

// --- OPERATIONS ---
export interface Location {
  name: string;
  type: string;          // e.g., "Roasting Facility", "Regional HQ", "Property Cluster"
  region: string;
  metrics: {
    label: string;
    value: string | number;
    target?: string | number;
    status: 'good' | 'warning' | 'critical';
  }[];
}

export interface SupplyChainMetric {
  label: string;
  value: string | number;
  target: string | number;
  trend: 'up' | 'down' | 'flat';
  status: 'good' | 'warning' | 'critical';
}

export interface OperationsConfig {
  // Property/location count
  totalLocations: number;
  locationGrowth: number;  // net new
  locationGrowthPercent: number;

  // Key locations/facilities
  locations: Location[];

  // Supply chain
  supplyChain: SupplyChainMetric[];

  // Digital/technology metrics
  digitalMetrics: {
    label: string;
    value: string | number;
    description: string;
  }[];

  // Operational KPIs specific to the industry
  industryKPIs: {
    label: string;
    value: string | number;
    target?: string | number;
    benchmark?: string | number;
    description: string;
  }[];

  // People & Culture metrics
  peopleMetrics?: {
    label: string;
    value: string | number;
    target?: string | number;
    trend: 'up' | 'down' | 'flat';
    status: 'good' | 'warning' | 'critical';
    description: string;
  }[];

  // Customer Experience metrics
  customerExperience?: {
    label: string;
    value: string | number;
    target?: string | number;
    trend: 'up' | 'down' | 'flat';
    status: 'good' | 'warning' | 'critical';
    description: string;
  }[];
}

// --- SCENARIOS ---
export interface ScenarioLever {
  id: string;
  name: string;
  category: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;          // "%", "$M", etc.
  description: string;
  impact?: 'high' | 'medium' | 'low';
}

export interface PreBuiltScenario {
  id: string;
  name: string;
  description: string;
  icon: string;          // lucide icon name
  confidence: number;    // 0-100
  revenueImpact: number; // in millions
  marginImpact: number;  // basis points
  keyAssumptions: string[];
  leverSettings: Record<string, number>;
}

export interface ScenarioBaselinePL {
  segments: { name: string; revenue: number }[];
  cogs: { personnelCosts: number; subcontractorCosts: number; facilityCosts: number };
  opex: { technologyCosts: number; marketing: number; professionalDev: number; sga: number; otherOpEx: number };
  interestExpense: number;
  otherIncome: number;
  taxRate: number;
  dAndA: number;
  revenuePerClient: number;
  flowThrough: { transactionalPctOfRevenue: number; resilientPctOfRevenue: number };
  sensitivity: Record<string, number>;
  monteCarlo: { volatilityFactor: number; baseOperatingMargin: number; netIncomeConversion: number };
}

export interface ScenarioConfig {
  levers: ScenarioLever[];
  preBuiltScenarios: PreBuiltScenario[];
  baselineRevenue: number;  // billions
  baselineMargin: number;   // percent
  baselinePL?: ScenarioBaselinePL;
}

// --- STRATEGIC ---
export interface StrategicInitiative {
  id: string;
  name: string;
  description: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  budget: number;        // millions
  spent: number;         // millions
  progress: number;      // 0-100
  milestones: {
    name: string;
    date: string;
    status: 'completed' | 'in-progress' | 'planned';
  }[];
  kpis: {
    label: string;
    target: string | number;
    actual: string | number;
    status: 'good' | 'warning' | 'critical';
  }[];
}

export interface RiskItem {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
  impact: string;
  mitigation: string;
  owner: string;
}

export interface ForwardOutlookItem {
  period: string;
  revenueForcast: number;
  revenuePlan: number;
  marginForecast: number;
  marginPlan: number;
  keyAssumptions: string[];
}

export interface StrategicConfig {
  initiatives: StrategicInitiative[];
  risks: RiskItem[];
  forwardOutlook: ForwardOutlookItem[];
  keyOpportunities: {
    title: string;
    revenueImpact: string;
    description: string;
    timeline: string;
  }[];
}

// --- MARKET ---
export interface CompetitorData {
  name: string;
  marketShare: number;
  yoyChange: number;
  strengths: string[];
}

export interface MarketConfig {
  totalMarketSize: string;  // e.g., "$100B"
  companyMarketShare: number;
  marketShareTarget: number;
  marketShareYoY: number;
  segmentGrowth: number;
  competitors: CompetitorData[];
  marketDrivers: string[];
  marketChallenges: string[];
  regionalBreakdown: {
    region: string;
    revenue: number;
    growth: number;
    keyInsight: string;
  }[];
}

// --- ALERTS ---
export interface AlertTemplate {
  id: string;
  title: string;
  category: string;
  threshold: string;
  parsedThreshold: number;   // numeric threshold extracted from threshold string
  parsedUnit: string;        // unit extracted from threshold string (e.g., "% QoQ", "%")
  severity: 'critical' | 'warning' | 'info';
  description: string;
  suggestedActions: string[];
  alertType?: 'threshold' | 'anomaly' | 'forecast' | 'trend';   // intelligence type behind the alert
  frequency?: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';  // how often monitored
  conditionPrefix?: string;  // e.g., "Falls below", "Exceeds", "Predicted to reach"
}

export interface AlertsConfig {
  templates: AlertTemplate[];
}

// --- REPORTS ---
export interface ReportKeyMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;
}

export interface ReportChartConfig {
  type: 'bar' | 'line' | 'area' | 'pie' | 'composed';
  title: string;
  data: Record<string, string | number>[];
}

export interface ReportTableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  frequency: string;
  description: string;
  lastGenerated?: string;
  format: string;            // e.g., 'Excel', 'PowerBI', 'Tableau', 'PDF'
  department: string;        // e.g., 'Finance', 'Property Operations', 'Digital'
  owner: string;             // report owner / responsible team
  rating: number;            // user rating 1.0-5.0
  views: number;             // total views
  isNew: boolean;            // recently added report
  isTrending: boolean;       // report is trending (high recent views)

  // Business alignment — connects reports to console architecture
  relatedConsoleId?: string;       // slug of parent console (e.g., 'north-america-performance')
  relatedReportIds?: string[];     // cross-reference to sibling reports
  dataSource?: string;             // 'POS System', 'SAP S/4HANA', 'PropTech Platform', etc.
  accessLevel?: string;            // 'All Finance', 'Leadership Only', 'Confidential'
  audience?: string[];             // ['FP&A', 'CFO', 'Property Ops Manager']
  tags?: string[];                 // searchable cross-cutting tags

  // Detail page content
  executiveSummary?: string;       // 2-3 sentence summary for detail page
  aiInsight?: string;              // AI-generated latest finding
  recommendations?: string[];      // AI recommendations
  keyMetrics?: ReportKeyMetric[];  // 4-6 headline KPIs for overview tab
  chartData?: ReportChartConfig[]; // 1-2 charts for data tab
  tableData?: ReportTableData;     // data table for data tab

  // Scheduling
  nextUpdate?: string;             // 'Every Monday 6:00 AM' or 'Mar 15, 2026'
}

export interface ReportsConfig {
  categories: string[];
  reports: ReportTemplate[];
  totalReports: number;
}

// --- MONTH-END CLOSE ---
export interface CloseTask {
  id: string;
  phase: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  owner: string;
  dueDate: string;
}

export interface MonthEndConfig {
  phases: string[];
  tasks: CloseTask[];
  journalEntries: {
    total: number;
    totalAmount: number;  // millions
    automated: number;
    manual: number;
  };
  trialBalance: {
    label: string;
    actual: number;
    priorMonth: number;
    budget: number;
  }[];
}

// --- INSIGHT CHARTS ---
export interface InsightChartDataPoint {
  [key: string]: string | number;
}

export interface InsightChartStats {
  [key: string]: string;
}

export interface InsightChartTrendPoint {
  [key: string]: string | number;
}

export interface WaterfallStep {
  name: string;
  base: number;
  value: number;
  color: string;
}

export interface InsightChartData {
  id: number;
  title: string;
  subtitle: string;
  chartType: 'horizontalBar' | 'composedBar' | 'stackedBar' | 'dualAxis' | 'lineChart' | 'waterfall' | 'stackedArea';
  data: InsightChartDataPoint[];
  trendData?: InsightChartTrendPoint[];
  waterfallSteps?: WaterfallStep[];
  breakdowns?: Record<string, string>;
  stats?: InsightChartStats;
  growth?: Record<string, string>;
}

export interface InsightChartsConfig {
  charts: InsightChartData[];
}

// --- HYPOTHESES ---
export interface HypothesisTest {
  id: number;
  title: string;
  hypothesis: string;
  result: 'supported' | 'rejected' | 'inconclusive';
  pValue: number;
  effectSize: string;
  details: string;
  confidence: number;
}

export interface HypothesesConfig {
  hypotheses: HypothesisTest[];
}

// --- MONTH-END EXTRA ---
export interface PhaseDisplay {
  id: string;
  days: string;
  status: string;
  progress: number;
}

export interface JournalEntryDetail {
  id: string;
  description: string;
  type: string;
  amount: number;
  status: string;
  preparer: string;
  approver: string;
  postDate: string;
}

export interface VolumeTrendPoint {
  month: string;
  count: number;
  amount: number;
}

export interface FinancialLineItem {
  actual: number;
  prior: number;
  budget: number;
}

export interface BalanceSheetLineItem {
  current: number;
  prior: number;
}

export interface MonthEndFinancialResults {
  pl: {
    netRevenues: FinancialLineItem;
    costOfGoodsSold: FinancialLineItem;
    operatingExpenses: FinancialLineItem;
    gaExpenses: FinancialLineItem;
    depreciationAmortization: FinancialLineItem;
    operatingIncome: FinancialLineItem;
    netIncome: FinancialLineItem;
  };
  bs: {
    totalAssets: BalanceSheetLineItem;
    totalLiabilities: BalanceSheetLineItem;
    stockholdersDeficit: BalanceSheetLineItem;
  };
}

export interface AdjustmentEntry {
  id: string;
  description: string;
  impact: { pl: number; bs: number };
  status: string;
  priority: string;
  deadline: string;
  preparer: string;
}

export interface MonthEndExtraConfig {
  phaseDisplayMap: Record<string, PhaseDisplay>;
  recentEntries: JournalEntryDetail[];
  volumeTrend: VolumeTrendPoint[];
  financialResults: MonthEndFinancialResults;
  adjustmentQueue: AdjustmentEntry[];
}

// --- MASTER CONFIG ---
export interface ClientConfig {
  branding: BrandingConfig;
  financials: FinancialConfig;
  kpis: KPIConfig;
  operations: OperationsConfig;
  scenarios: ScenarioConfig;
  strategic: StrategicConfig;
  market: MarketConfig;
  alerts: AlertsConfig;
  reports: ReportsConfig;
  monthEnd: MonthEndConfig;
  insightCharts: InsightChartsConfig;
  hypotheses: HypothesesConfig;
  monthEndExtra: MonthEndExtraConfig;
}
