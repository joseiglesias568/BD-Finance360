// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/insight-charts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { InsightChartsConfig } from '../../types';

export const insightCharts: InsightChartsConfig = {
  charts: [
    // 1. IET vs OFSE Segment Revenue Split (Q1 2026)
    {
      id: 1,
      title: 'IET vs OFSE Segment Revenue',
      subtitle: 'Q1 2026 — % of Total',
      chartType: 'horizontalBar',
      data: [
        { name: 'IET (Industrial & Energy Technology)', share: 50.9 },  // $3,350M / $6,587M [CITED:10Q-Q1-26]
        { name: 'OFSE (Oilfield Services & Equipment)', share: 49.1 },  // $3,237M / $6,587M [CITED:10Q-Q1-26]
      ],
      trendData: [
        { q: "Q1'25", iet: 45.6, ofse: 54.4 },   // Q1 2025: IET $2,928M / $6,427M [CITED:10Q-Q1-26]
        { q: "Q2'25", iet: 47.0, ofse: 53.0 },   // est. [INTERPOLATED]
        { q: "Q3'25", iet: 48.5, ofse: 51.5 },   // est. [INTERPOLATED]
        { q: "Q4'25", iet: 49.5, ofse: 50.5 },   // est. [INTERPOLATED]
        { q: "Q1'26", iet: 50.9, ofse: 49.1 },   // Q1 2026 actual [CITED:10Q-Q1-26]
      ],
    },

    // 2. IET Book-to-Bill Ratio (Quarterly)
    {
      id: 2,
      title: 'IET Book-to-Bill Ratio',
      subtitle: 'Orders / Revenue (x)',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 1.12, target: 1.0 },   // est. [ASSUMED]
        { q: "Q2'25", comp: 1.18, target: 1.0 },   // est. [ASSUMED]
        { q: "Q3'25", comp: 1.25, target: 1.0 },   // est. [ASSUMED]
        { q: "Q4'25", comp: 1.35, target: 1.0 },   // est. [ASSUMED]
        { q: "Q1'26", comp: 1.46, target: 1.3 },   // Q1 2026: $4,887M orders / $3,350M rev [CITED:10Q-Q1-26]
        { q: "Q2'26E", comp: 1.30, target: 1.3 },  // est. [ASSUMED]
        { q: "Q3'26E", comp: 1.28, target: 1.3 },  // est. [ASSUMED]
      ],
      breakdowns: {
        ticket: '1.46x Q1 2026',          // Q1 2026 actual book-to-bill
        traffic: '$4.9B Q1 orders',        // Q1 2026 IET orders
        morning: '$33.1B RPO',             // IET RPO record March 31, 2026
        afternoon: '>$14.5B FY2026 target', // IET orders guidance
      },
    },

    // 3. Adj. EBITDA & Margin by Segment (Quarterly)
    {
      id: 3,
      title: 'Adj. EBITDA Margin by Segment',
      subtitle: '% (IET vs OFSE, Quarterly)',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 17.1, target: 18.5 },   // IET margin Q1 2025 [CITED:10Q-Q1-26]
        { q: "Q2'25", comp: 18.0, target: 18.5 },   // est. [INTERPOLATED]
        { q: "Q3'25", comp: 19.2, target: 18.5 },   // est. [INTERPOLATED]
        { q: "Q4'25", comp: 19.8, target: 18.5 },   // est. [INTERPOLATED]
        { q: "Q1'26", comp: 20.2, target: 20.0 },   // IET margin Q1 2026 [CITED:10Q-Q1-26]
        { q: "Q2'26E", comp: 20.5, target: 20.5 },  // est. [ASSUMED]
        { q: "Q3'26E", comp: 21.0, target: 21.0 },  // est. [ASSUMED]
      ],
      breakdowns: {
        ticket: '20.2% IET Q1 2026',      // IET margin Q1 2026
        traffic: '17.5% OFSE Q1 2026',    // OFSE margin Q1 2026
        morning: '+310bps IET YoY',        // IET margin expansion
        afternoon: '≥$2.7B IET FY2026',   // IET guidance
      },
    },

    // 4. IET RPO (Remaining Performance Obligations) Trend
    {
      id: 4,
      title: 'IET Remaining Performance Obligations',
      subtitle: '$B (Record High)',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 29.5, target: 30.0 },   // est. [ASSUMED]
        { q: "Q2'25", comp: 30.5, target: 31.0 },   // est. [ASSUMED]
        { q: "Q3'25", comp: 31.2, target: 32.0 },   // est. [ASSUMED]
        { q: "Q4'25", comp: 32.4, target: 33.0 },   // Dec 31, 2025 [CITED:10Q-Q1-26]
        { q: "Q1'26", comp: 33.1, target: 33.0 },   // March 31, 2026 record [CITED:10Q-Q1-26]
        { q: "Q2'26E", comp: 34.0, target: 34.0 },  // est. with Chart [ASSUMED]
        { q: "Q3'26E", comp: 35.0, target: 35.0 },  // est. [ASSUMED]
      ],
      breakdowns: {
        ticket: '$33.1B record Q1 2026',
        traffic: '58% recognized <2 yrs',
        morning: '>$40B Horizon 2 target',
        afternoon: '$36.1B total RPO (incl. OFSE)',
      },
    },

    // 5. CTS Orders — Data Center Power Surge
    {
      id: 5,
      title: 'Climate Technology Solutions Orders',
      subtitle: '$M Quarterly (Data Center Power)',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 148,  target: 500 },   // Q1 2025 CTS orders [CITED:10Q-Q1-26]
        { q: "Q2'25", comp: 320,  target: 500 },   // est. [ASSUMED]
        { q: "Q3'25", comp: 480,  target: 600 },   // est. [ASSUMED]
        { q: "Q4'25", comp: 690,  target: 750 },   // est. [ASSUMED]
        { q: "Q1'26", comp: 1257, target: 1000 },  // Q1 2026 actual (9x YoY) [CITED:10Q-Q1-26]
        { q: "Q2'26E", comp: 1000, target: 1000 }, // est. — mgmt target $1B+ [ASSUMED]
        { q: "Q3'26E", comp: 1100, target: 1000 }, // est. [ASSUMED]
      ],
      breakdowns: {
        ticket: '$1,257M Q1 2026',
        traffic: '9x YoY surge',
        morning: '$1B+/quarter target',
        afternoon: 'Data center + CCUS + H2',
      },
    },

    // 6. Net Leverage Trajectory (Pre and Post Chart)
    {
      id: 6,
      title: 'Net Leverage Trajectory',
      subtitle: 'Net Debt / Adj. EBITDA (x)',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 0.8, target: 1.0 },    // est. pre-Chart notes [ASSUMED]
        { q: "Q2'25", comp: 0.6, target: 1.0 },    // est. [ASSUMED]
        { q: "Q3'25", comp: 0.5, target: 1.0 },    // est. [ASSUMED]
        { q: "Q4'25", comp: 0.4, target: 1.0 },    // est. [ASSUMED]
        { q: "Q1'26", comp: 0.3, target: 2.0 },    // Q1 2026 pre-Chart 0.3x [CITED:EC-Q1-26]
        { q: "Q2'26E", comp: 2.1, target: 2.0 },   // post-Chart close ~2.0x [ASSUMED]
        { q: "Q3'26E", comp: 1.9, target: 1.8 },   // FCF deleveraging [ASSUMED]
      ],
      breakdowns: {
        ticket: '0.3x Q1 2026 (pre-Chart)',
        traffic: '~2.0x post-Chart close',
        morning: '$9.885B acq. notes',
        afternoon: 'Investment grade target',
      },
    },

    // 7. OFSE Revenue by Region (Q1 2026)
    {
      id: 7,
      title: 'OFSE Revenue by Region',
      subtitle: 'Q1 2026 ($M)',
      chartType: 'horizontalBar',
      data: [
        { name: 'Middle East & Asia', share: 35.6 },   // $1,152M / $3,237M [CITED:10Q-Q1-26]
        { name: 'North America', share: 28.6 },        // $927M / $3,237M [CITED:10Q-Q1-26]
        { name: 'Latin America', share: 18.5 },        // $600M / $3,237M [CITED:10Q-Q1-26]
        { name: 'Europe / CIS / SSA', share: 17.2 },   // $558M / $3,237M [CITED:10Q-Q1-26]
      ],
      trendData: [
        { q: "Q2'25", meAsia: 38.0, na: 29.0 },
        { q: "Q3'25", meAsia: 37.0, na: 29.5 },
        { q: "Q4'25", meAsia: 36.5, na: 29.0 },
        { q: "Q1'26", meAsia: 35.6, na: 28.6 },
      ],
    },

    // 8. Total Orders — IET vs OFSE ($B Quarterly)
    {
      id: 8,
      title: 'Total Orders — IET vs OFSE',
      subtitle: '$B per Quarter',
      chartType: 'stackedBar',
      data: [
        { q: "Q1'25", iet: 3.17, ofse: 3.27 },   // est. [ASSUMED]
        { q: "Q2'25", iet: 3.50, ofse: 3.30 },   // est. [ASSUMED]
        { q: "Q3'25", iet: 3.80, ofse: 3.25 },   // est. [ASSUMED]
        { q: "Q4'25", iet: 3.50, ofse: 3.40 },   // est. [ASSUMED]
        { q: "Q1'26", iet: 4.887, ofse: 3.272 }, // Q1 2026 actual [CITED:10Q-Q1-26]
        { q: "Q2'26E", iet: 3.70, ofse: 3.40 },  // est. [ASSUMED]
        { q: "Q3'26E", iet: 3.50, ofse: 3.50 },  // est. [ASSUMED]
      ],
      breakdowns: {
        ticket: '$8.16B Q1 2026 total',
        traffic: '+26% YoY total orders',
        morning: '$4.9B IET (+54% YoY)',
        afternoon: 'CTS $1.26B (9x YoY)',
      },
    },
  ],
};
