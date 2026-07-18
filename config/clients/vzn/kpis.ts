// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/kpis.ts
//
// Provenance Legend:
// [CITED:10K-FY25]    — Verizon FY2025 Form 10-K (filed Feb 2026)
// [CITED:10Q-Q1-26]   — Verizon Q1 2026 Form 10-Q (filed Apr 2026)
// [CITED:Press-Q1-26] — Verizon Q1 2026 earnings press release
// [DERIVED]           — Computed from cited values; math shown inline
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Numerical values sourced from Becton, Dickinson and Company public disclosures:
// Form 10-K (FY 2025); Form 10-Q (Q1 2026); Q1 2026 earnings press release
// and transcript; FY2026 guidance (April 2026 earnings call).
// KPI consoleId values map to VZN console schema (lib/semantic/consoles.ts).
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { KPIConfig } from '../../types';

export const kpis: KPIConfig = {
  primaryKPIs: [
    {
      label: 'Wireless Service Revenue',
      value: 20.78,
      unit: 'B',
      target: 21.4,                   // implied by FY2026 guidance +2–2.8% YoY on $80.4B FY2025 base
      trend: 'up',
      trendValue: '+2.7% YoY',
      status: 'good',
      description: 'Q1 2026 wireless service revenue $20,780M (+2.7% YoY). FY2026 guidance: +2.0–2.8% growth. Largest and most closely watched metric for VZN.',
      consoleId: 'consumer-wireless',
      consoleName: 'Consumer Wireless',
      architectureCategory: 'financial',
    },
    {
      label: 'Adjusted EBITDA',
      value: 13.422,
      unit: 'B',
      target: 15.0,                   // annualized run-rate implied by FY2026 guidance ~$60B
      trend: 'up',
      trendValue: 'Record Q1',
      status: 'good',
      description: 'Q1 2026 adjusted EBITDA $13,422M — a quarterly record. FY2026 guidance ~$60B. EBITDA margin ~39% (industry-leading vs peers ~35%).',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Free Cash Flow',
      value: 5.7,
      unit: 'B',
      target: 21.5,                   // FY2026 guidance floor ≥$21.5B
      trend: 'up',
      trendValue: 'Q1 2026',
      status: 'good',
      description: 'Q1 2026 FCF ~$5.7B. FY2026 guidance ≥$21.5B. FCF is primary capital-return and debt-paydown funding source post-Frontier close.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Postpaid Phone Net Adds',
      value: 55,
      unit: 'K',
      target: 200,                    // est. FY2026 implied positive annual adds (guidance confirms positive trajectory)
      trend: 'up',
      trendValue: 'First positive Q1 since 2013',
      status: 'good',
      description: 'Q1 2026 postpaid phone net adds +55K — first positive Q1 since 2013. Signals competitive momentum reversal vs T-Mobile. Total postpaid connections ~116M.',
      consoleId: 'consumer-wireless',
      consoleName: 'Consumer Wireless',
      architectureCategory: 'revenue-market',
    },
    {
      label: 'Net Debt / Adj. EBITDA',
      value: 2.5,
      unit: 'x',
      target: 2.25,                   // year-end 2026 leverage target
      trend: 'down',
      trendValue: 'Deleveraging path',
      status: 'warning',
      description: 'Post-Frontier close net leverage ~2.5x. FY2026 target ≤2.25x. FY2025 pre-Frontier leverage was ~2.2x. Key focus for rating agencies and investors.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'FWA Total Subscribers',
      value: 5.7,
      unit: 'M',
      target: 6.5,                    // implied by 700K–800K FY2026 net add guidance
      trend: 'up',
      trendValue: '+339K Q1 net adds',
      status: 'good',
      description: 'Q1 2026 FWA subscribers 5.7M (+339K net adds). FY2026 net add guidance 700K–800K. FWA is Verizon\'s fastest-growing revenue stream.',
      consoleId: 'broadband-fiber',
      consoleName: 'Broadband & Fiber',
      architectureCategory: 'revenue-market',
    },
  ],

  operationalKPIs: [
    {
      label: 'Postpaid Phone Churn',
      value: 0.89,
      unit: '%',
      target: 0.85,                   // est. — Verizon has not published explicit churn target; 0.85% = AT&T/T-Mobile benchmark
      trend: 'flat',
      trendValue: 'Stable',
      status: 'warning',
      description: 'Q1 2026 postpaid phone churn 0.89% (slightly above AT&T ~0.82% and T-Mobile ~0.82%). Improving from 2024 levels; competitive pressure from T-Mobile pricing.',
      consoleId: 'consumer-wireless',
      consoleName: 'Consumer Wireless',
      architectureCategory: 'capacity-operations',
    },
    {
      label: 'ARPA (Avg Revenue Per Account)',
      value: 139,
      unit: '$/mo',
      target: 142,                    // est. — implied by wireless service revenue growth + account mix
      trend: 'up',
      trendValue: '+~1% YoY',
      status: 'good',
      description: 'Average monthly revenue per postpaid account ~$139. Myplan customization and premium plan adoption driving modest ARPA expansion.',
      consoleId: 'consumer-wireless',
      consoleName: 'Consumer Wireless',
      architectureCategory: 'revenue-market',
    },
    {
      label: 'Fios Internet Subscribers',
      value: 10.0,
      unit: 'M',
      target: 10.8,                   // est. — implied by Frontier integration and organic adds
      trend: 'up',
      trendValue: 'Frontier added ~3.3M',
      status: 'good',
      description: 'Post-Frontier close: ~10.0M Fios Internet subs (prev. ~6.7M). Frontier integration closed January 22, 2026. Largest fiber broadband provider acquisition in US history.',
      consoleId: 'broadband-fiber',
      consoleName: 'Broadband & Fiber',
      architectureCategory: 'capacity-operations',
    },
    {
      label: 'C-Band 5G Population Coverage',
      value: 75,
      unit: '%',
      target: 90,                     // FY2026 target per network roadmap
      trend: 'up',
      trendValue: 'Densification ongoing',
      status: 'warning',
      description: 'C-Band (mid-band 5G) deployed to ~75% of US population (est.). Key enabler for Verizon Home broadband and premium 5G UW products. T-Mobile at ~95% mid-band coverage — gap to close.',
      consoleId: 'network-operations',
      consoleName: 'Network Operations',
      architectureCategory: 'capacity-operations',
    },
    {
      label: 'Total Broadband Connections',
      value: 15.7,
      unit: 'M',
      target: 17.0,                   // est. FY2026 — Fios organic + FWA adds
      trend: 'up',
      trendValue: '+37% vs pre-Frontier',
      status: 'good',
      description: 'Q1 2026 total fixed broadband: ~10.0M Fios + ~5.7M FWA = ~15.7M. Verizon is now the #2 US broadband provider by subs (behind Comcast).',
      consoleId: 'broadband-fiber',
      consoleName: 'Broadband & Fiber',
      architectureCategory: 'capacity-operations',
    },
    {
      label: 'Total Operating Revenue',
      value: 34.44,
      unit: 'B',
      target: 35.5,                   // est. Q1 run-rate on ~$138B FY2026 consensus
      trend: 'up',
      trendValue: '+~1.5% YoY',
      status: 'good',
      description: 'Q1 2026 total revenue $34,440M. Includes Consumer ($24.6B) + Business ($7.5B) + Corporate & Other. Frontier adds ~$1.4B incremental revenue per quarter from Q1 2026.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
  ],

  digitalKPIs: [
    {
      label: 'myVerizon App Active Users',
      value: '75M+',
      unit: '',
      target: '80M',                  // est.
      trend: 'up',
      trendValue: 'Growing YoY',
      status: 'good',
      description: 'myVerizon app enables account management, plan customization (myPlan), device upgrades, and AI-powered support. Key self-serve channel driving lower cost-to-serve.',
      consoleId: 'strategy-execution',
      consoleName: 'Strategy Execution',
      architectureCategory: 'digital-customer',
    },
    {
      label: 'myPlan Adoption Rate',
      value: '55',
      unit: '%',
      target: '70%',                  // est. — management has highlighted myPlan as key ARPA driver
      trend: 'up',
      trendValue: 'Growing quarterly',
      status: 'good',
      description: 'myPlan allows customers to build custom plans with perks (Disney+, Apple One, etc.). Higher ARPA and retention vs legacy unlimited plans. ~55% of consumer postpaid base on myPlan.',
      consoleId: 'consumer-wireless',
      consoleName: 'Consumer Wireless',
      architectureCategory: 'digital-customer',
    },
    {
      label: 'AI-Driven Cost Savings',
      value: '$200M',
      unit: '',
      target: '$1B by 2028',          // management target
      trend: 'up',
      trendValue: 'Phase 1 underway',
      status: 'good',
      description: 'Network automation and AI BSS/OSS transformation. Phase 1 targeting ~$200M in 2026 cost avoidance (network operations, customer care automation). Long-term target $1B+ OpEx reduction by 2028.',
      consoleId: 'strategy-execution',
      consoleName: 'Strategy Execution',
      architectureCategory: 'digital-customer',
    },
    {
      label: 'Spectrum Holdings (C-Band MHz-PoPs)',
      value: 'Industry #1',
      unit: '',
      target: 'Maintain',
      trend: 'flat',
      trendValue: 'Post-Auction 107',
      status: 'good',
      description: 'Verizon holds the largest C-Band spectrum position in the US (~$45B C-Band investment). MHz-PoPs leadership vs AT&T and T-Mobile provides long-term network capacity advantage.',
      consoleId: 'network-operations',
      consoleName: 'Network Operations',
      architectureCategory: 'digital-customer',
    },
  ],

  financialKPIs: [
    {
      label: 'Adjusted EPS',
      value: 1.19,                    // Q1 2026 (est.)
      unit: '$',
      target: 4.97,                   // FY2026 consensus midpoint ($4.95–$4.99 guidance)
      trend: 'up',
      trendValue: 'FY2026 guidance $4.95–$4.99',
      status: 'good',
      description: 'FY2026 adjusted EPS guidance $4.95–$4.99 (vs FY2025 ~$4.59). ~8% YoY growth. Frontier acquisition accretive from Q1 2026.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'CapEx',
      value: 4.1,
      unit: 'B',
      target: 18.0,                   // FY2026 guidance midpoint $17.5B–$18.5B
      trend: 'down',
      trendValue: 'Post-peak C-Band',
      status: 'good',
      description: 'Q1 2026 CapEx ~$4.1B. FY2026 guidance $17.5B–$18.5B. CapEx as % of revenue ~13% (vs 18%+ at C-Band peak). Frontier fiber investment now part of plan.',
      consoleId: 'capital-allocation',
      consoleName: 'Capital Allocation',
      architectureCategory: 'financial',
    },
    {
      label: 'Dividend Per Share (Annual)',
      value: 2.71,
      unit: '$',
      target: 2.77,                   // next annual raise implied by 2% progressive dividend policy
      trend: 'up',
      trendValue: '18 consecutive years of increases',
      status: 'good',
      description: 'FY2026 annual dividend ~$2.71/share ($0.6775 quarterly). 18 consecutive years of dividend increases. ~6.5% yield. No buybacks until leverage target met.',
      consoleId: 'capital-allocation',
      consoleName: 'Capital Allocation',
      architectureCategory: 'financial',
    },
    {
      label: 'Adj. EBITDA Margin',
      value: 39.0,
      unit: '%',
      target: 40.0,                   // est. — Frontier synergies expected to expand margin over 2–3 years
      trend: 'up',
      trendValue: 'Industry-leading',
      status: 'good',
      description: 'Q1 2026 adjusted EBITDA margin ~39%. Industry average ~35%. Verizon\'s margin premium reflects scale, spectrum position, and enterprise mix. Frontier integration expected to be accretive to margin by Year 2.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
  ],
};
