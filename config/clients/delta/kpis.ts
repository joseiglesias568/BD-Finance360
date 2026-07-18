// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/kpis.ts
//
// Provenance Legend (block-above cluster comments throughout):
// [CITED:10K-FY25]    — Delta FY2025 Form 10-K (filed Feb 10, 2026)
// [CITED:10Q-Q1-26]   — Delta Q1 2026 Form 10-Q (filed Apr 8, 2026)
// [CITED:JPM-2026]    — Delta JPM Industrials Conference deck (Mar 17, 2026)
// [DERIVED]           — Computed from cited values; math shown inline
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Numerical values in this file are sourced from Delta Air Lines public
// disclosures: Form 10-K (FY 2025); Form 10-Q (Q1 2026); Q1 2026 earnings
// press release and transcript; JPM Industrials Conference deck (Mar 17,
// 2026); December Quarter Supplemental.
//
// DISCLAIMER
// Where Delta does not publicly disclose a target, threshold, or forward-
// looking metric, values are estimated using industry benchmarks (McKinsey
// State of Aviation 2025), peer disclosures, or arithmetic from cited
// values. Targets without an explicit Delta-stated anchor are flagged in
// inline comments. KPI consoleId values are mapped to the new Delta
// console schema (see lib/semantic/consoles.ts).
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { KPIConfig } from '../../types';

export const kpis: KPIConfig = {
  primaryKPIs: [
    {
      label: 'Total Operating Revenue',
      value: 63.364,
      unit: 'B',
      target: 68.0,                  // Trefis 2026 estimate; Delta has not published an explicit FY revenue target
      trend: 'up',
      trendValue: '+2.8% YoY',
      status: 'good',
      description: 'FY 2025 record revenue $63.4B. Q1 2026 revenue +9.4% adjusted YoY.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Adjusted Operating Margin',
      value: 10.0,
      unit: '%',
      target: 14.0,                  // mid-teens 3-5 yr target (JPM Value Creation Framework, midpoint)
      trend: 'up',
      trendValue: '+0.6 pts vs FY 2024',
      status: 'warning',
      description: 'FY 2025 adjusted operating margin 10.0% (GAAP 9.2%). 3-5 year target mid-teens per JPM Industrials deck.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'After-tax ROIC',
      value: 12.0,
      unit: '%',
      target: 15.0,                  // 15%+ 3-5 yr target (JPM)
      trend: 'up',
      trendValue: 'Industry-leading',
      status: 'good',
      description: 'FY 2025 ROIC 12.0% per JPM deck. Long-term target 15%+. Industry peer average mid-single-digits.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Free Cash Flow',
      value: 4.643,
      unit: 'B',
      target: 4.0,                   // midpoint of $3-5B 3-5 yr target (JPM)
      trend: 'up',
      trendValue: '+35.6% YoY',
      status: 'good',
      description: 'FY 2025 FCF $4.6B (record). 3-year cumulative 2023-2025 = $10.07B. Industry peers (AAL+UAL+LUV) had <$0B combined FCF in 2025.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Adjusted Net Debt',
      value: 13.540,
      unit: 'B',
      target: 12.0,                  // est. — implied by ongoing pay-down trajectory toward 1.0x gross leverage long-term target
      trend: 'down',
      trendValue: '-$3.3B YoY',
      status: 'good',
      description: 'Q1 2026 adjusted net debt $13.5B, below 2019 levels. Investment-grade at all three credit rating agencies.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'AmEx Remuneration',
      value: 8.2,
      unit: 'B',
      target: 10.0,                  // 10-K stated target
      trend: 'up',
      trendValue: '+11% YoY',
      status: 'good',
      description: 'FY 2025 AmEx co-brand remuneration $8.2B. Long-term target $10B "over the next few years" per 10-K. Cardholder spend +12% YoY in Q1 2026.',
      consoleId: 'loyalty-amex',
      consoleName: 'Loyalty & AmEx',
      architectureCategory: 'revenue-market',
    },
  ],

  operationalKPIs: [
    {
      label: 'Available Seat Miles (ASMs)',
      value: '298B',
      unit: '',
      target: '305B',                // est. — implied by ~3% capacity growth pre-Q2 2026 cuts
      trend: 'up',
      trendValue: '+3% YoY',
      status: 'good',
      description: 'FY 2025 capacity 298,045M ASMs (+3% vs 2024). Q2 2026 capacity flat with downward bias until fuel environment improves.',
      consoleId: 'capacity-network',
      consoleName: 'Capacity & Network',
      architectureCategory: 'capacity-operations',
    },
    {
      label: 'Load Factor',
      value: 84.0,
      unit: '%',
      target: 85.0,                  // est. — Delta has not disclosed a load factor target. 85% = FY 2024 reading; typical legacy benchmark
      trend: 'down',
      trendValue: '-1 pt YoY',
      status: 'warning',
      description: 'FY 2025 84% load factor, down 1 pt YoY. Capacity grew faster than RPMs.',
      consoleId: 'capacity-network',
      consoleName: 'Capacity & Network',
      architectureCategory: 'capacity-operations',
    },
    {
      label: 'On-Time Performance',
      value: 'Industry #1',
      unit: '',
      target: 'Maintain #1',
      trend: 'flat',
      trendValue: '5 consecutive years',
      status: 'good',
      description: 'Cirium #1 most on-time North American airline 5 consecutive years (through 2025). 78% industry average per McKinsey 2025.',
      consoleId: 'operations-reliability',
      consoleName: 'Operations & Reliability',
      architectureCategory: 'capacity-operations',
    },
    {
      label: 'Total Revenue per ASM (TRASM, adj)',
      value: 19.56,
      unit: '¢',
      target: 20.50,                 // est. — implied by FY 2026 management commentary on revenue growth + flat to modest capacity
      trend: 'down',
      trendValue: '-0.20¢ YoY',
      status: 'warning',
      description: 'FY 2025 adjusted TRASM 19.56¢ vs 19.76¢ FY 2024. Q1 2026 adjusted TRASM 20.53¢ (+8.2% YoY).',
      consoleId: 'capacity-network',
      consoleName: 'Capacity & Network',
      architectureCategory: 'revenue-market',
    },
    {
      label: 'Non-Fuel CASM (CASM-Ex)',
      value: 13.61,                  // FY 2025 new basis (excl. MRO) per Dec quarter supplemental
      unit: '¢',
      target: 14.00,                 // est. — Delta has guided "long-term target of low-single-digit growth" not absolute level
      trend: 'up',                   // "up" = growth in unit cost is bad
      trendValue: '+2.4% YoY',       // 13.86 vs 13.54 (10-K basis); on new basis 13.61 vs 13.33
      status: 'warning',
      description: 'FY 2025 CASM-Ex 13.61¢ (new basis excluding MRO) vs 13.33¢ FY 2024. Q1 2026 CASM-Ex 15.13¢ (+6% YoY) reflecting capacity discipline + crew-recovery costs.',
      consoleId: 'cost-discipline',
      consoleName: 'Cost Discipline',
      architectureCategory: 'cost-structure',
    },
    {
      label: 'Mainline Aircraft Fleet',
      value: 997,                    // Q1 2026 mainline (10-Q)
      unit: '',
      target: 1050,                  // est. — implied by 343 firm orders + 126 options - retirements over plan horizon
      trend: 'up',
      trendValue: '+8 in Q1 2026',
      status: 'good',
      description: 'Q1 2026 mainline fleet 997 aircraft, avg age 15.0 years. 343 firm orders + 126 options. Plus 325 regional aircraft via Endeavor (wholly owned), SkyWest, Republic.',
      consoleId: 'fleet-modernization',
      consoleName: 'Fleet Modernization',
      architectureCategory: 'capacity-operations',
    },
  ],

  digitalKPIs: [
    {
      label: 'Delta Sync Customer Logins',
      value: '110M+',
      unit: '',
      target: '120M',                // est. — Delta has cited 110M as 2026 expected level
      trend: 'up',
      trendValue: 'On track for 110M in 2026',
      status: 'good',
      description: 'Expected 110M+ Delta Sync customer logins in 2026 (CEO commentary). Partners include AmEx, T-Mobile, YouTube Premium, Paramount+, NYT.',
      consoleId: 'digital-experience',
      consoleName: 'Digital Experience',
      architectureCategory: 'digital-customer',
    },
    {
      label: 'Free Wi-Fi Enabled Aircraft',
      value: '1,200+',
      unit: '',
      target: 'Fleet-wide',
      trend: 'up',
      trendValue: '1,000th milestone Dec 2025',
      status: 'good',
      description: 'Q1 2026: 1,200+ aircraft with free Wi-Fi for SkyMiles members. 1,000th milestone celebrated Dec 2025.',
      consoleId: 'digital-experience',
      consoleName: 'Digital Experience',
      architectureCategory: 'digital-customer',
    },
    {
      label: 'Delta Concierge AI Adoption',
      value: 'Beta',
      unit: '',
      target: 'GA in 2026',
      trend: 'up',
      trendValue: 'Beta rollout April 2026',
      status: 'good',
      description: 'GenAI virtual assistant in Delta app. Voice + text natural language. Beta to select SkyMiles members from April 2026 (CES 2025 announcement).',
      consoleId: 'digital-experience',
      consoleName: 'Digital Experience',
      architectureCategory: 'digital-customer',
    },
    {
      label: 'Cloud Migration (AWS)',
      value: 'Mostly Complete',
      unit: '',
      target: 'Complete',
      trend: 'up',
      trendValue: 'Per company',
      status: 'good',
      description: 'Most technology infrastructure migrated to AWS cloud as of 2025-26. Original commitment announced 2022.',
      consoleId: 'digital-experience',
      consoleName: 'Digital Experience',
      architectureCategory: 'digital-customer',
    },
  ],

  financialKPIs: [
    {
      label: 'Gross Leverage',
      value: 2.4,
      unit: 'x',
      target: 1.0,                   // long-term target (JPM)
      trend: 'down',
      trendValue: '2.4x → 2.0x by 2026E',
      status: 'good',
      description: 'Q1 2026 gross leverage 2.4x (Adjusted Debt / EBITDAR). Long-term target 1.0x. Net leverage 1.5x at YE 2025.',
      consoleId: 'capital-structure',
      consoleName: 'Capital Structure',
      architectureCategory: 'financial',
    },
    {
      label: 'Diluted EPS (GAAP, FY)',
      value: 7.66,
      unit: '$',
      target: 7.00,                  // FY 2026 EPS guidance midpoint $6.50-$7.50 (issued Jan 13, 2026; pre-fuel-spike)
      trend: 'up',
      trendValue: '+44% YoY (FY)',   // FY 2025 $7.66 vs FY 2024 $5.33
      status: 'good',
      description: 'FY 2025 GAAP diluted EPS $7.66. FY 2026 EPS guidance $6.50-$7.50 (issued Jan 13, 2026; not updated post fuel spike).',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Liquidity',
      value: 8.1,
      unit: 'B',
      target: 7.5,                   // est. — Delta does not publish explicit liquidity target
      trend: 'up',
      trendValue: '+$0.7B vs YE 2025',
      status: 'good',
      description: 'Q1 2026 liquidity $8.1B = $5.053B cash + $3.1B undrawn revolver. YE 2025 was $7.4B.',
      consoleId: 'capital-structure',
      consoleName: 'Capital Structure',
      architectureCategory: 'financial',
    },
    {
      label: 'Profit-Sharing Payout',
      value: 1.3,
      unit: 'B',
      target: 1.5,                   // est. — implied by aspirational profit growth + 10%/20% formula
      trend: 'flat',
      trendValue: 'Similar to FY 2024 ($1.4B)',
      status: 'good',
      description: '$1.3B paid Feb 2026 for FY 2025 performance. More than rest of US industry combined per management. Formula: 10% of first $2.5B pre-tax profit + 20% above.',
      consoleId: 'people-culture',
      consoleName: 'People & Culture',
      architectureCategory: 'financial',
    },
    {
      label: 'Dividend Per Share (Annual)',
      value: 0.75,
      unit: '$',
      target: 0.90,                  // est. — implied by ongoing dividend-growth trajectory; Delta raised from $0.15 to $0.1875 in Q3 2025
      trend: 'up',
      trendValue: '+25% in Q3 2025',
      status: 'good',
      description: '$0.1875/quarter × 4. Raised from $0.15 to $0.1875 in Q3 2025 (+25%). Plus $1.0B opportunistic buyback authorization (open through June 2028); zero shares repurchased through Q1 2026.',
      consoleId: 'capital-structure',
      consoleName: 'Capital Structure',
      architectureCategory: 'financial',
    },
    {
      label: 'FY 2026 Q2 Pre-Tax Profit Guidance',
      value: '~$1B',
      unit: '',
      target: '$1.0-1.2B',
      trend: 'flat',
      trendValue: 'Per April 8 guidance',
      status: 'good',
      description: 'Q2 2026 guidance: pre-tax profit ~$1B; operating margin 6-8%; EPS $1.00-$1.50. Reflects fuel doubling + 40-50% recapture target.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
  ],
};
