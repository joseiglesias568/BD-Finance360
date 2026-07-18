// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/kpis.ts
//
// Provenance Legend:
// [CITED:10K-FY25]    — BD FY2025 Form 10-K (filed Feb 2026)
// [CITED:10Q-Q1-26]   — BD Q1 2026 Form 10-Q (filed May 6, 2026)
// [CITED:EC-Q1-26]    — BD Q1 2026 Earnings Call / IR slides (May 6, 2026)
// [DERIVED]           — Computed from cited values
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// BD Q1 2026 earnings call, IR slides, 10-Q, and 10-K.
// KPI consoleId values map to CVS console schema (lib/semantic/consoles.ts).
// ─────────────────────────────────────────────────────────────────────
import { KPIConfig } from '../../types';

export const kpis: KPIConfig = {
  primaryKPIs: [
    {
      label: 'Adj. EPS — Q1 2026',
      value: 2.57,
      unit: '$',
      target: 7.40,                   // FY2026 guidance midpoint [CITED:EC-Q1-26]
      trend: 'up',
      trendValue: '+14.2% vs $2.25 Q1 2025',
      status: 'good',
      description: 'Q1 2026 adjusted EPS $2.57, up 14.2% from Q1 2025 $2.25. FY2026 guidance raised to $7.30–$7.50 (midpoint $7.40) from prior $7.00–$7.20 — a $0.30 increase or 4%+ raise. Company targets mid-teens adj. EPS CAGR through 2028. Strong start driven primarily by Health Care Benefits improvement of >$1B AOI YoY. 60-40 H1/H2 earnings seasonality expected.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Adj. Operating Income — Q1 2026',
      value: 5.15,
      unit: 'B',
      target: 15.70,                  // FY2026 guidance midpoint $15.53–$15.87B [CITED:EC-Q1-26]
      trend: 'up',
      trendValue: '+12.4% vs $4.58B Q1 2025',
      status: 'good',
      description: 'Q1 2026 adjusted operating income $5.15B (+12.4% YoY). FY2026 enterprise AOI guidance $15.53–$15.87B. Improvement driven by HCB segment (+$1.05B YoY). HSS −7% from pharmacy client price improvements (partially timing); PCW −9% from reimbursement pressure offset by script volume. Segment mix improving toward higher-margin HCB contribution.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Medical Benefit Ratio — Q1 2026',
      value: 84.6,
      unit: '%',
      target: 90.5,                   // FY2026 MBR guidance [CITED:EC-Q1-26]
      trend: 'down',
      trendValue: '−270bps vs 87.3% Q1 2025',
      status: 'good',
      description: 'Q1 2026 MBR 84.6%, down 270bps from Q1 2025 87.3%. MBR lower than full-year guidance of 90.5% ±50bps due to favorable prior year development and core outperformance in medical cost management. Company maintaining prudent 90.5% full-year view — Q1 beat not reflected in updated guidance. Target MA margin of 3% by 2028 remains on track. Lower MBR = better profitability for HCB segment.',
      consoleId: 'health-care-benefits',
      consoleName: 'Health Care Benefits (Aetna)',
      architectureCategory: 'operational',
    },
    {
      label: 'Medical Membership — Q1 2026',
      value: 26.0,
      unit: 'M',
      target: 26.0,                   // FY2026 guidance ~26.0M [CITED:EC-Q1-26]
      trend: 'down',
      trendValue: '−1.1M vs 27.1M Q1 2025',
      status: 'good',
      description: 'Medical membership 26.0M as of Q1 2026, down from 27.1M Q1 2025 due to exit from ACA individual exchange business — a deliberate strategic decision to improve profitability. Sequential decline ~600K primarily from ACA exit, partially offset by commercial fee-based membership growth. FY2026 guidance ~26.0M maintained. 18M commercial members in book. Focus on margin quality over membership quantity.',
      consoleId: 'health-care-benefits',
      consoleName: 'Health Care Benefits (Aetna)',
      architectureCategory: 'operational',
    },
    {
      label: 'Total Revenue — Q1 2026',
      value: 100.4,
      unit: 'B',
      target: 405.0,                  // FY2026 guidance ≥$405B [CITED:EC-Q1-26]
      trend: 'up',
      trendValue: '+6.2% vs $94.6B Q1 2025',
      status: 'good',
      description: 'Q1 2026 total revenues $100.4B (+6.2% YoY), first quarter to exceed $100B. Growth across all three operating segments. FY2026 guidance ≥$405.0B (raised from ≥$400.0B). Health Services largest segment at $48.2B (+11% YoY); HCB $36.0B (+3.4%); PCW $32.0B (+0.3%). Note: segment revenues include inter-segment eliminations — consolidated total reflects those eliminations.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Pharmacy Claims — Q1 2026',
      value: 464.7,
      unit: 'M',
      target: 1840,                   // FY2026 guidance ≥1.84B [CITED:EC-Q1-26]
      trend: 'up',
      trendValue: '+0.1% vs 464.2M Q1 2025',
      status: 'good',
      description: 'Caremark pharmacy claims processed Q1 2026: 464.7M (30-day adjusted, including 90-day as 3×30-day). Flat YoY vs Q1 2025 464.2M — volume stable while drug mix shifts to higher-cost specialty. FY2026 guidance ≥1.84B claims. TrueCost net-cost model transition ongoing. Specialty pharmacy represents ~50% of pharmacy benefit revenues. Biosimilar/generic leverage is primary value creation mechanism.',
      consoleId: 'health-services',
      consoleName: 'Health Services (Caremark)',
      architectureCategory: 'operational',
    },
    {
      label: 'Prescriptions Filled — Q1 2026',
      value: 451.2,
      unit: 'M',
      target: 1865,                   // FY2026 guidance ≥1.865B [CITED:EC-Q1-26]
      trend: 'up',
      trendValue: '+3.6% vs 435.5M Q1 2025',
      status: 'good',
      description: 'CVS retail pharmacy prescriptions filled Q1 2026: 451.2M (+3.6% YoY). Same-store pharmacy scripts +7%. FY2026 guidance ≥1.865B prescriptions. Retail script share >29% — maintained as meaningful growth marker. Driven by Rite Aid asset acquisitions, same-store volume growth, and GLP-1 DTC channel gains (+200bps share growth in GLP-1 category). 90-day prescriptions converted to equivalent 30-day units.',
      consoleId: 'pharmacy-consumer-wellness',
      consoleName: 'Pharmacy & Consumer Wellness',
      architectureCategory: 'operational',
    },
    {
      label: 'Cash Flow from Operations — Q1 2026',
      value: 4.2,
      unit: 'B',
      target: 9.5,                    // FY2026 CFO guidance ≥$9.5B [CITED:EC-Q1-26]
      trend: 'down',
      trendValue: '−$0.4B vs $4.6B Q1 2025',
      status: 'good',
      description: 'Q1 2026 cash flow from operations $4.2B (vs $4.6B Q1 2025). Decline vs prior year primarily working capital timing. FY2026 guidance updated to ≥$9.5B (raised from ≥$9.0B) reflecting improved underlying performance. Q1 2026 returned ~$850M in dividends to shareholders. Share repurchase remains suspended; deleveraging priority. Cash at parent and unrestricted subs: $2.2B.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
  ],

  secondaryKPIs: [
    {
      label: 'GAAP EPS — Q1 2026',
      value: 2.30,
      unit: '$',
      target: 6.34,                   // FY2026 GAAP EPS guidance midpoint $6.24–$6.44 [CITED:EC-Q1-26]
      trend: 'up',
      trendValue: '+63% vs $1.41 Q1 2025',
      status: 'good',
      description: 'Q1 2026 GAAP EPS $2.30, significantly higher than Q1 2025 $1.41 due to reduced goodwill impairment charges and improved segment profitability. FY2026 GAAP EPS guidance $6.24–$6.44. Gap between adj. and GAAP EPS reflects amortization of intangibles from Aetna acquisition, transaction costs, and restructuring charges.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Leverage Ratio — Q1 2026',
      value: 3.84,
      unit: 'x',
      target: 3.0,                    // est. BBB target leverage [ASSUMED]
      trend: 'down',
      trendValue: 'Improving; target BBB rating',
      status: 'warning',
      description: 'Net debt/EBITDA leverage ratio 3.84x at end of Q1 2026. Improving trajectory as AOI grows and debt amortizes. Target: BBB credit rating which implies ~3.0x leverage. Share repurchase suspended until leverage target achieved. Balance sheet deleveraging is management priority for 2026. Strong CFO of ≥$9.5B will drive leverage improvement.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Prior Auth Approval Rate (24h)',
      value: 95.0,
      unit: '%',
      target: 97.0,
      trend: 'up',
      trendValue: '>80% approved in real time',
      status: 'good',
      description: 'Aetna approves >95% of eligible prior authorizations within 24 hours — industry-leading. >80% approved in real time. 88% of procedures standardized per AHIP commitment (industry: 50% by year-end). Aetna has fewest medical services subject to prior authorization in the industry. This is a key operational differentiator reducing administrative burden for providers and improving member experience.',
      consoleId: 'health-care-benefits',
      consoleName: 'Health Care Benefits (Aetna)',
      architectureCategory: 'operational',
    },
    {
      label: 'Quarterly Dividend',
      value: 850,
      unit: 'M',
      target: 850,
      trend: 'flat',
      trendValue: '~$850M/quarter maintained',
      status: 'good',
      description: 'CVS returned ~$850M in dividends to shareholders in Q1 2026. Quarterly dividend maintained as primary capital return mechanism while balance sheet deleverages. Share repurchase program suspended — not in FY2026 guidance. Management will evaluate capital deployment opportunities as leverage improves throughout 2026.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Same-Store Revenue Growth',
      value: 3.0,
      unit: '%',
      target: 4.0,
      trend: 'up',
      trendValue: 'Pharmacy scripts +7% same-store',
      status: 'good',
      description: 'PCW same-store total revenues +~3% in Q1 2026. Same-store pharmacy sales +3%+ YoY driven by drug mix, prescription volumes, and brand inflation. Same-store front store sales +120bps. GLP-1 DTC market +200bps share growth. Rite Aid asset acquisitions contributing incremental volume. Weather and seasonal illness disruption in Q1 partially offset underlying outperformance.',
      consoleId: 'pharmacy-consumer-wellness',
      consoleName: 'Pharmacy & Consumer Wellness',
      architectureCategory: 'operational',
    },
    {
      label: 'Retail Script Share',
      value: 29.0,
      unit: '%',
      target: 30.0,
      trend: 'up',
      trendValue: '>29% — meaningful growth YoY',
      status: 'good',
      description: 'CVS retail pharmacy script share >29% of total U.S. prescriptions filled. Continues to represent meaningful growth compared to Q1 2025. Largest national pharmacy network with ~9,000 locations. GLP-1 DTC channel growing share. Rite Aid pharmacy asset acquisitions adding scripts. HealthHUB and MinuteClinic driving prescription capture from health care delivery touchpoints.',
      consoleId: 'pharmacy-consumer-wellness',
      consoleName: 'Pharmacy & Consumer Wellness',
      architectureCategory: 'operational',
    },
  ],
};
