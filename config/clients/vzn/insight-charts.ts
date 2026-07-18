// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/insight-charts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { InsightChartsConfig } from '../../types';

export const insightCharts: InsightChartsConfig = {
  charts: [
    // 1. US Wireless Service Revenue Market Share (FY2025)
    {
      id: 1,
      title: 'US Wireless Service Revenue Share',
      subtitle: 'FY 2025',
      chartType: 'horizontalBar',
      data: [
        { name: 'Verizon (VZ)', share: 32.8 },      // $80.4B / ~$245B US wireless service est.
        { name: 'AT&T (T)', share: 27.5 },           // ~$67.4B wireless service
        { name: 'T-Mobile (TMUS)', share: 27.0 },    // ~$66B wireless service
        { name: 'Dish/MVNO/Other', share: 12.7 },
      ],
      trendData: [
        { q: "Q2'25", verizon: 33.0, att: 27.5 },
        { q: "Q3'25", verizon: 32.9, att: 27.5 },
        { q: "Q4'25", verizon: 32.8, att: 27.6 },
        { q: "Q1'26", verizon: 32.6, att: 27.7 },
      ],
    },

    // 2. Wireless Service Revenue Growth (YoY %)
    {
      id: 2,
      title: 'Wireless Service Revenue Growth',
      subtitle: '% YoY',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 2.1, target: 2.5 },
        { q: "Q2'25", comp: 2.4, target: 2.5 },
        { q: "Q3'25", comp: 2.5, target: 2.5 },
        { q: "Q4'25", comp: 2.7, target: 2.5 },
        { q: "Q1'26", comp: 2.7, target: 2.4 },
        { q: "Q2'26E", comp: 2.5, target: 2.4 },
        { q: "Q3'26E", comp: 2.6, target: 2.4 },
      ],
      breakdowns: {
        ticket: '+2.7%',           // Q1 2026 wireless service growth
        traffic: '+339K',          // FWA net adds
        morning: '+55K',           // postpaid phone net adds
        afternoon: '+1.5%',        // total revenue growth (incl. Frontier)
      },
    },

    // 3. Fixed Broadband Subscribers (FWA + Fios, $M)
    {
      id: 3,
      title: 'Fixed Broadband Subscribers',
      subtitle: 'Millions (FWA + Fios)',
      chartType: 'stackedBar',
      data: [
        { q: "Q1'25", fwa: 3.9, fios: 6.7 },
        { q: "Q2'25", fwa: 4.4, fios: 6.7 },
        { q: "Q3'25", fwa: 4.8, fios: 6.7 },
        { q: "Q4'25", fwa: 5.4, fios: 6.7 },
        { q: "Q1'26", fwa: 5.7, fios: 10.0 },   // Frontier adds ~3.3M Fios
        { q: "Q2'26E", fwa: 5.9, fios: 10.1 },
        { q: "Q3'26E", fwa: 6.1, fios: 10.2 },
      ],
    },

    // 4. Adj. EBITDA & Margin Trend
    {
      id: 4,
      title: 'Adj. EBITDA & Margin Trend',
      subtitle: '$B and % (Quarterly)',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 37.8, target: 38.5 },
        { q: "Q2'25", comp: 38.5, target: 38.5 },
        { q: "Q3'25", comp: 39.1, target: 38.5 },
        { q: "Q4'25", comp: 39.0, target: 38.5 },
        { q: "Q1'26", comp: 39.0, target: 39.5 },
        { q: "Q2'26E", comp: 39.5, target: 39.5 },
        { q: "Q3'26E", comp: 40.0, target: 39.5 },
      ],
      breakdowns: {
        ticket: '$13.4B',          // Q1 2026 adj. EBITDA
        traffic: '39.0%',          // Q1 2026 adj. EBITDA margin
        morning: '$1.5B',          // Frontier synergy run-rate target
        afternoon: '$21.5B+',      // FY2026 FCF guidance
      },
    },

    // 5. Postpaid Net Adds Trend (Thousands)
    {
      id: 5,
      title: 'Postpaid Phone Net Adds',
      subtitle: 'Thousands (Quarterly)',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: -68, target: 0 },
        { q: "Q2'25", comp: 148, target: 100 },
        { q: "Q3'25", comp: 239, target: 150 },
        { q: "Q4'25", comp: 568, target: 200 },
        { q: "Q1'26", comp: 55,  target: 50 },
        { q: "Q2'26E", comp: 150, target: 100 },
        { q: "Q3'26E", comp: 200, target: 150 },
      ],
      breakdowns: {
        ticket: '+55K',            // Q1 2026 — first positive Q1 since 2013
        traffic: '0.89%',          // Q1 2026 postpaid phone churn
        morning: '~116M',          // total postpaid connections
        afternoon: '+$1/mo ARPA',  // trajectory note
      },
    },

    // 6. Net Leverage Trend (Net Debt / Adj. EBITDA)
    {
      id: 6,
      title: 'Net Leverage Trajectory',
      subtitle: 'Net Debt / Adj. EBITDA (x)',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 2.2, target: 2.3 },
        { q: "Q2'25", comp: 2.2, target: 2.2 },
        { q: "Q3'25", comp: 2.2, target: 2.2 },
        { q: "Q4'25", comp: 2.2, target: 2.2 },
        { q: "Q1'26", comp: 2.5, target: 2.4 },  // Frontier close adds $20B debt
        { q: "Q2'26E", comp: 2.4, target: 2.35 },
        { q: "Q3'26E", comp: 2.3, target: 2.3 },
      ],
      breakdowns: {
        ticket: '2.5x Q1 2026',
        traffic: '≤2.25x YE target',
        morning: '$21.5B FCF',
        afternoon: '18yr dividend streak',
      },
    },

    // 7. FY2026 Revenue Segment Breakdown
    {
      id: 7,
      title: 'Revenue by Segment',
      subtitle: 'FY2025 Full Year ($B)',
      chartType: 'horizontalBar',
      data: [
        { name: 'Consumer Wireless Service', share: 60.0 },   // $80.4B / $134B
        { name: 'Consumer Broadband & Equipment', share: 11.9 },
        { name: 'Business Solutions', share: 22.4 },
        { name: 'Corporate & Other', share: 5.7 },
      ],
      trendData: [
        { q: "Q2'25", wireless: 59.8, broadband: 11.7 },
        { q: "Q3'25", wireless: 60.0, broadband: 11.8 },
        { q: "Q4'25", wireless: 60.2, broadband: 11.9 },
        { q: "Q1'26", wireless: 60.3, broadband: 11.1 },
      ],
    },

    // 8. FWA vs T-Mobile Home Internet Net Adds
    {
      id: 8,
      title: 'FWA Net Adds — Verizon vs T-Mobile',
      subtitle: 'Thousands per Quarter',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 308,  target: 300 },   // Verizon Q1 2025
        { q: "Q2'25", comp: 391,  target: 350 },
        { q: "Q3'25", comp: 363,  target: 350 },
        { q: "Q4'25", comp: 557,  target: 450 },
        { q: "Q1'26", comp: 339,  target: 300 },
        { q: "Q2'26E", comp: 200, target: 200 },
        { q: "Q3'26E", comp: 175, target: 175 },
      ],
      breakdowns: {
        ticket: '+339K Q1 2026',           // Verizon Q1 actual
        traffic: '~500K (T-Mobile Q1)',    // T-Mobile Q1 2026
        morning: '5.7M total subs',        // Verizon cumulative
        afternoon: '~7M total (T-Mobile)', // T-Mobile cumulative
      },
    },
  ],
};
