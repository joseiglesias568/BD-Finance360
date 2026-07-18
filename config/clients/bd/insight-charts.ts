// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/insight-charts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q2-26] [CITED:EC-Q2-26]
// [DERIVED] = math from cited  [INTERPOLATED] = extrapolated  [ASSUMED] = estimate
// All revenue values in $M.
// ─────────────────────────────────────────────────────────────────────
import { InsightChartsConfig } from '../../types';

export const insightCharts: InsightChartsConfig = {
  charts: [
    // 1. Segment Revenue Contribution — FY2025 Full Year
    {
      id: 1,
      title: 'Segment Revenue Contribution',
      subtitle: 'FY2025 — $M by Segment (4 Segments, New Structure)',
      chartType: 'horizontalBar',
      data: [
        { name: 'Medical Essentials', share: 33.5 },     // $6,098M / $18,195M [DERIVED]
        { name: 'Interventional', share: 28.7 },          // $5,217M / $18,195M [DERIVED]
        { name: 'Connected Care', share: 25.0 },          // $4,556M / $18,195M [DERIVED]
        { name: 'BioPharma Systems', share: 12.8 },       // $2,324M / $18,195M [DERIVED]
      ],
      trendData: [
        { q: "Q1 FY25", medEss: 1524, connCare: 1100, bioPharma: 581, interv: 1127 }, // [INTERPOLATED]
        { q: "Q2 FY25", medEss: 1575, connCare: 1140, bioPharma: 598, interv: 1167 }, // [INTERPOLATED]
        { q: "Q3 FY25", medEss: 1516, connCare: 1164, bioPharma: 582, interv: 1438 }, // [INTERPOLATED]
        { q: "Q4 FY25", medEss: 1483, connCare: 1152, bioPharma: 563, interv: 1485 }, // [INTERPOLATED]
        { q: "Q1 FY26", medEss: 1490, connCare: 1152, bioPharma: 560, interv: 1284 }, // [INTERPOLATED — Q1 $4,486M total]
        { q: "Q2 FY26", medEss: 1548, connCare: 1186, bioPharma: 573, interv: 1407 }, // [INTERPOLATED — Q2 $4,714M total]
      ],
    },

    // 2. Organic Revenue Growth by Segment — Q2 FY26
    {
      id: 2,
      title: 'Organic Revenue Growth by Segment (FXN)',
      subtitle: '% FXN — Q2 FY26 Actual vs FY2026 Target',
      chartType: 'composedBar',
      data: [
        { q: 'Medical Essentials', comp: 1.7, target: 2.0 },   // Q2 FY26 actual vs target [CITED:EC-Q2-26]
        { q: 'Connected Care', comp: 3.2, target: 5.0 },        // Q2 FY26 actual vs target [CITED:EC-Q2-26]
        { q: 'BioPharma Systems', comp: -1.8, target: 3.0 },    // Q2 FY26 actual vs target [CITED:EC-Q2-26]
        { q: 'Interventional', comp: 5.3, target: 6.0 },        // Q2 FY26 actual vs target [CITED:EC-Q2-26]
        { q: 'Total Enterprise', comp: 2.6, target: 3.5 },      // Q2 FY26 actual vs target [CITED:EC-Q2-26]
      ],
      breakdowns: {
        ticket: '+2.6% FXN Q2 FY26',
        traffic: 'Interventional +5.3%; BioPharma -1.8% headwind',
        revenue: 'FY2026 target: +3.5% FXN',
        margin: 'China VoBP -14% FXN on affected categories',
      },
    },

    // 3. Total Revenue by Quarter — Continuing Operations
    {
      id: 3,
      title: 'Total Revenue by Quarter',
      subtitle: '$M — Continuing Operations (BD Fiscal Year ends Sep 30)',
      chartType: 'composedBar',
      data: [
        { q: 'Q1 FY25', comp: 4332, target: 4280 },    // [INTERPOLATED]
        { q: 'Q2 FY25', comp: 4480, target: 4430 },    // [INTERPOLATED]
        { q: 'Q3 FY25', comp: 4700, target: 4650 },    // [INTERPOLATED]
        { q: 'Q4 FY25', comp: 4683, target: 4640 },    // [INTERPOLATED]
        { q: 'Q1 FY26', comp: 4486, target: 4470 },    // [CITED:EC-Q2-26]
        { q: 'Q2 FY26', comp: 4714, target: 4680 },    // [CITED:EC-Q2-26]
      ],
      breakdowns: {
        ticket: '$4,714M Q2 FY26',
        traffic: '+5.2% reported (+2.6% FXN organic)',
        revenue: 'FY2026 est. ~$18,933M (+4% reported)',
        margin: 'FX translation adding ~260bps vs organic rate',
      },
    },

    // 4. Adjusted EPS by Quarter vs Guidance
    {
      id: 4,
      title: 'Adjusted Diluted EPS vs FY2026 Guidance',
      subtitle: '$ per share — quarterly (BD fiscal quarters)',
      chartType: 'composedBar',
      data: [
        { q: 'Q1 FY25', comp: 2.97, target: 2.90 },    // [INTERPOLATED]
        { q: 'Q2 FY25', comp: 3.06, target: 2.95 },    // [INTERPOLATED]
        { q: 'Q3 FY25', comp: 3.18, target: 3.05 },    // [INTERPOLATED]
        { q: 'Q4 FY25', comp: 2.69, target: 2.60 },    // [INTERPOLATED — seasonally lower Q4]
        { q: 'Q1 FY26', comp: 3.35, target: 3.15 },    // [CITED:EC-Q2-26]
        { q: 'Q2 FY26', comp: 3.58, target: 3.40 },    // [CITED:EC-Q2-26]
      ],
      breakdowns: {
        ticket: '$3.58 Q2 FY26',
        traffic: 'H1 FY26 YTD ~$6.93 adj. EPS',
        revenue: 'FY2026 guidance: $12.52–$12.72',
        margin: 'FY25 restated basis $11.90 New BD',
      },
    },

    // 5. Adjusted Operating Margin by Quarter
    {
      id: 5,
      title: 'Adjusted Operating Margin Trend',
      subtitle: '% — Quarterly Trend vs 25% FY2026 Target',
      chartType: 'composedBar',
      data: [
        { q: 'Q1 FY25', comp: 25.0, target: 24.5 },    // [INTERPOLATED]
        { q: 'Q2 FY25', comp: 25.0, target: 24.5 },    // [INTERPOLATED]
        { q: 'Q3 FY25', comp: 25.0, target: 24.8 },    // [INTERPOLATED]
        { q: 'Q4 FY25', comp: 25.0, target: 24.8 },    // [INTERPOLATED]
        { q: 'Q1 FY26', comp: 23.5, target: 24.5 },    // [INTERPOLATED — lower seasonality]
        { q: 'Q2 FY26', comp: 24.2, target: 25.0 },    // [CITED:EC-Q2-26]
      ],
      breakdowns: {
        ticket: '24.2% Q2 FY26',
        traffic: 'BD Excellence $150M run-rate savings achieved',
        revenue: 'FY2026 target: ~25% adj. operating margin',
        margin: 'Long-term target 25.5%+ as BD Excellence delivers $200M',
      },
    },

    // 6. Free Cash Flow — Quarterly and YTD
    {
      id: 6,
      title: 'Free Cash Flow — Quarterly vs $3.0B FY26 Target',
      subtitle: '$M — Quarterly FCF (BD fiscal year ends Sep 30)',
      chartType: 'composedBar',
      data: [
        { q: 'Q1 FY25', comp: 580, target: 600 },    // [INTERPOLATED]
        { q: 'Q2 FY25', comp: 740, target: 720 },    // [INTERPOLATED]
        { q: 'Q3 FY25', comp: 810, target: 800 },    // [INTERPOLATED]
        { q: 'Q4 FY25', comp: 670, target: 680 },    // [INTERPOLATED]
        { q: 'Q1 FY26', comp: 490, target: 520 },    // [INTERPOLATED — H1 FY26 $1,095M total]
        { q: 'Q2 FY26', comp: 605, target: 620 },    // [DERIVED: H1 $1,095M - Q1 $490M est.]
      ],
      breakdowns: {
        ticket: 'H1 FY26 FCF: $1,095M',
        traffic: 'On track for $3.0B FY26 target',
        revenue: 'FCF supports debt paydown + ASR execution',
        margin: 'Net leverage path: 2.9x → 2.5x target by FY27',
      },
    },
  ],
};
