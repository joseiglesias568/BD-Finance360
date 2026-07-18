// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/insight-charts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [INTERPOLATED] = extrapolated  [ASSUMED] = estimate
// ─────────────────────────────────────────────────────────────────────
import { InsightChartsConfig } from '../../types';

export const insightCharts: InsightChartsConfig = {
  charts: [
    // 1. Segment AOI Contribution — Q1 2026
    {
      id: 1,
      title: 'Segment AOI Contribution',
      subtitle: 'Q1 2026 — Adjusted Operating Income ($B)',
      chartType: 'horizontalBar',
      data: [
        { name: 'Health Care Benefits (Aetna)', share: 59.0 },   // $3.04B / $5.15B [CITED:EC-Q1-26]
        { name: 'Health Services (Caremark)', share: 28.9 },      // $1.49B / $5.15B [DERIVED]
        { name: 'Pharmacy & Consumer Wellness', share: 23.3 },    // $1.20B / $5.15B [DERIVED]
        { name: 'Corporate / Other', share: -11.3 },              // est. corporate drag [ASSUMED]
      ],
      trendData: [
        { q: "Q1'25", hcb: 1.99, hss: 1.60, pcw: 1.31, corp: -0.32 }, // Q1 2025 [CITED:EC-Q1-26]
        { q: "Q2'25", hcb: 0.90, hss: 1.85, pcw: 1.45, corp: -0.40 }, // est. [INTERPOLATED]
        { q: "Q3'25", hcb: 1.10, hss: 1.90, pcw: 1.50, corp: -0.40 }, // est. [INTERPOLATED]
        { q: "Q4'25", hcb: 1.20, hss: 1.90, pcw: 1.55, corp: -0.40 }, // est. [INTERPOLATED]
        { q: "Q1'26", hcb: 3.04, hss: 1.49, pcw: 1.20, corp: -0.58 }, // Q1 2026 [CITED:EC-Q1-26]
      ],
    },

    // 2. Medical Benefit Ratio Trend — HCB Segment
    {
      id: 2,
      title: 'Medical Benefit Ratio (MBR) Trend',
      subtitle: '% — Health Care Benefits (Aetna) | Target: 90.5% FY2026',
      chartType: 'composedBar',
      data: [
        { q: 'Q1 2025', comp: 87.3, target: 90.0 },  // Q1 2025 actual [CITED:EC-Q1-26]
        { q: 'Q2 2025', comp: 91.5, target: 90.5 },  // est. [INTERPOLATED]
        { q: 'Q3 2025', comp: 90.8, target: 90.5 },  // est. [INTERPOLATED]
        { q: 'Q4 2025', comp: 89.5, target: 90.5 },  // est. [INTERPOLATED]
        { q: 'Q1 2026', comp: 84.6, target: 90.5 },  // Q1 2026 actual [CITED:EC-Q1-26]
        { q: 'FY2026G', comp: 90.5, target: 90.5 },  // FY2026 guidance midpoint [CITED:EC-Q1-26]
      ],
      breakdowns: {
        ticket: '84.6% Q1 2026',
        traffic: '−270bps YoY improvement',
        revenue: 'FY2026 guidance: 90.5% ±50bps',
        margin: 'Target MA margin: 3% by 2028',
      },
    },

    // 3. Total Revenue Growth — Quarterly
    {
      id: 3,
      title: 'Total Revenue by Quarter',
      subtitle: '$B — All Segments',
      chartType: 'composedBar',
      data: [
        { q: 'Q1 2025', comp: 94.6, target: 93.0 },   // [CITED:EC-Q1-26]
        { q: 'Q2 2025', comp: 91.5, target: 90.0 },   // [INTERPOLATED]
        { q: 'Q3 2025', comp: 94.0, target: 93.0 },   // [INTERPOLATED]
        { q: 'Q4 2025', comp: 97.0, target: 96.0 },   // [INTERPOLATED]
        { q: 'Q1 2026', comp: 100.4, target: 99.5 },  // [CITED:EC-Q1-26]
      ],
      breakdowns: {
        ticket: '$100.4B Q1 2026',
        traffic: '+6.2% YoY',
        revenue: 'FY2026 guidance: ≥$405.0B',
        margin: 'First quarter to exceed $100B',
      },
    },

    // 4. Adjusted EPS — Quarterly vs Guidance
    {
      id: 4,
      title: 'Adjusted EPS vs Guidance Range',
      subtitle: '$ per share — quarterly actual and annualized run-rate',
      chartType: 'composedBar',
      data: [
        { q: 'Q1 2025', comp: 2.25, target: 1.90 },  // [CITED:EC-Q1-26]
        { q: 'Q2 2025', comp: 1.73, target: 1.70 },  // [INTERPOLATED]
        { q: 'Q3 2025', comp: 1.87, target: 1.80 },  // [INTERPOLATED]
        { q: 'Q4 2025', comp: 2.05, target: 1.90 },  // [INTERPOLATED]
        { q: 'Q1 2026', comp: 2.57, target: 2.25 },  // [CITED:EC-Q1-26]
      ],
      breakdowns: {
        ticket: '$2.57 Q1 2026',
        traffic: '+14.2% YoY',
        revenue: 'FY2026 guidance: $7.30–$7.50',
        margin: 'Mid-teens EPS CAGR target through 2028',
      },
    },

    // 5. Prescriptions Filled — PCW Segment
    {
      id: 5,
      title: 'Prescriptions Filled (30-day adj.)',
      subtitle: 'Millions — Pharmacy & Consumer Wellness',
      chartType: 'composedBar',
      data: [
        { q: 'Q1 2025', comp: 435.5, target: 430 },  // [CITED:EC-Q1-26]
        { q: 'Q2 2025', comp: 450.0, target: 445 },  // [INTERPOLATED]
        { q: 'Q3 2025', comp: 458.0, target: 450 },  // [INTERPOLATED]
        { q: 'Q4 2025', comp: 460.0, target: 455 },  // [INTERPOLATED]
        { q: 'Q1 2026', comp: 451.2, target: 446 },  // [CITED:EC-Q1-26]
      ],
      breakdowns: {
        ticket: '451.2M Q1 2026',
        traffic: '+3.6% YoY',
        revenue: 'FY2026 guidance: ≥1.865B',
        margin: 'Retail script share >29%',
      },
    },

    // 6. Pharmacy Claims Processed — HSS Segment (Caremark)
    {
      id: 6,
      title: 'Caremark Pharmacy Claims Processed',
      subtitle: 'Millions — Health Services (Caremark PBM)',
      chartType: 'composedBar',
      data: [
        { q: 'Q1 2025', comp: 464.2, target: 460 },  // [CITED:EC-Q1-26]
        { q: 'Q2 2025', comp: 460.0, target: 455 },  // [INTERPOLATED]
        { q: 'Q3 2025', comp: 462.0, target: 457 },  // [INTERPOLATED]
        { q: 'Q4 2025', comp: 465.0, target: 460 },  // [INTERPOLATED]
        { q: 'Q1 2026', comp: 464.7, target: 460 },  // [CITED:EC-Q1-26]
      ],
      breakdowns: {
        ticket: '464.7M Q1 2026',
        traffic: '+0.1% YoY (volume; revenue driven by drug mix)',
        revenue: 'FY2026 guidance: ≥1.84B',
        margin: '~50% of revenues from specialty pharmacy',
      },
    },
  ],
};
