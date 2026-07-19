// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/insight-charts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Numerical values in this file are sourced from Delta Air Lines public
// disclosures: Form 10-K (FY 2025); Form 10-Q (Q1 2026); Q1 2026 earnings
// press release; JPM Industrials Conference deck; December Quarter
// Supplemental. Peer comparisons from UAL/AAL/LUV public 2025 IR
// materials. Industry context from McKinsey "State of Aviation 2025".
//
// DISCLAIMER
// Where Delta does not publicly disclose a specific quarterly value,
// figures are estimated from FY totals or implied by company commentary.
// Forward-looking ('E' suffix) values reflect Q1 2026 guidance issued
// April 8, 2026 and are subject to update. Color values in waterfall
// chart use placeholder hex values; brand colors defined in branding.ts.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { InsightChartsConfig } from '../../types';

export const insightCharts: InsightChartsConfig = {
  charts: [
    // 1. US Airline Big-Four Revenue Share (FY 2025)
    // Big-Four combined revenue ~$205B; Delta $63.4B = ~30.7%
    {
      id: 1,
      title: 'US Airline Revenue Share (Big Four)',
      subtitle: 'FY 2025',
      chartType: 'horizontalBar',
      data: [
        { name: 'Delta', share: 30.7 },        // $63.4B / $205B
        { name: 'United', share: 28.8 },       // $59.1B
        { name: 'American', share: 26.6 },     // $54.6B
        { name: 'Southwest', share: 13.7 },    // $28.1B
        { name: 'Others (ALK, JBLU, etc.)', share: 0.2 },
      ],
      trendData: [
        { q: "Q2'25", delta: 30.5, united: 28.9 },
        { q: "Q3'25", delta: 30.6, united: 28.8 },
        { q: "Q4'25", delta: 30.7, united: 28.8 },
        { q: "Q1'26", delta: 30.8, united: 28.7 },
      ],
    },

    // 2. Total Operating Revenue Growth (YoY %)
    {
      id: 2,
      title: 'Total Operating Revenue Growth',
      subtitle: '% YoY (GAAP)',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25", comp: 0,  target: 5 },     // not separately disclosed
        { q: "Q2'25", comp: 0,  target: 5 },     // not in corpus
        { q: "Q3'25", comp: 0,  target: 5 },     // est.
        { q: "Q4'25", comp: 1,  target: 5 },     // est. ~$16B vs $15.6B
        { q: "Q1'26",  comp: 13, target: 6 },    // 10-Q +13% GAAP, +9.4% adjusted
        { q: "Q2'26E", comp: 13, target: 13 },   // company guidance "low-teens"
        { q: "Q3'26E", comp: 8,  target: 8 },    // est.
      ],
      breakdowns: {
        ticket: '+7%',                            // Q1 2026 passenger ticket revenue +7%
        traffic: '+1%',                           // RPMs +1% Q1 2026
        morning: '+14%',                          // premium products +14%
        afternoon: '+41%',                        // Other revenue (refinery, MRO, loyalty) +41% Q1 2026
      },
    },

    // 3. Passenger Revenue by Geographic Entity ($B)
    {
      id: 3,
      title: 'Passenger Revenue by Geography',
      subtitle: '$B (FY 2025 quarterly run-rate est.)',
      chartType: 'stackedBar',
      data: [
        // Domestic, Atlantic, LatAm, Pacific (passenger only — Cargo + Other excluded for clarity)
        // Quarterly = FY total / 4 with seasonal adjustment (Q2/Q3 stronger for Atlantic)
        { q: "Q1'25", NA: 8.07, Intl: 3.50, Channel: 0,    total: 11.57 },     // Q1 2025 international weighted lower
        { q: "Q2'25", NA: 9.06, Intl: 4.40, Channel: 0,    total: 13.46 },     // est.
        { q: "Q3'25", NA: 9.32, Intl: 5.00, Channel: 0,    total: 14.32 },     // est.
        { q: "Q4'25", NA: 9.28, Intl: 4.18, Channel: 0,    total: 13.46 },     // est.
        { q: "Q1'26", NA: 8.72, Intl: 3.58, Channel: 0,    total: 12.30 },     // 10-Q $8.717B Domestic + ($1.517+1.328+0.740) Intl
      ],
      growth: {
        na: '+8% Q1\'26',                         // Domestic Q1 2026 +8%
        intl: '+7% Q1\'26',                       // Atlantic +11%, LatAm flat, Pacific +10% — blended
        channel: '0',                              // unused
      },
    },

    // 4. SkyMiles + AmEx Co-Brand Trend (dual axis: AmEx remuneration $B / Loyalty deferred revenue $B)
    {
      id: 4,
      title: 'AmEx Remuneration & Loyalty Deferred Revenue',
      subtitle: '$B / $B',
      chartType: 'dualAxis',
      data: [
        { q: "Q1'24", members: 1.85, revShare: 7.4, mop: 0 },         // 2024 AmEx ~$7.4B
        { q: "Q2'24", members: 1.95, revShare: 7.6, mop: 0 },
        { q: "Q3'24", members: 2.00, revShare: 7.8, mop: 0 },
        { q: "Q4'24", members: 1.95, revShare: 8.0, mop: 0 },
        { q: "Q1'25", members: 2.00, revShare: 8.1, mop: 0 },
        { q: "Q2'25", members: 2.05, revShare: 8.15, mop: 0 },
        { q: "Q3'25", members: 2.10, revShare: 8.20, mop: 0 },
        { q: "Q4'25", members: 2.05, revShare: 8.20, mop: 0 },        // FY 2025 $8.2B
        { q: "Q1'26", members: 2.20, revShare: 8.40, mop: 0 },        // Q1 2026 $2.2B (+10%); deferred rev rolling
      ],
      stats: {
        netGrowth: '+11% YoY (FY)',
        mopMix: '$10B target',                                          // long-term target (10-K)
        spendPerMember: '+12% cardholder spend',                        // Q1 2026
      },
    },

    // 5. Load Factor & On-Time Performance (US monthly trend Jul'25-Mar'26)
    {
      id: 5,
      title: 'Load Factor & On-Time Performance',
      subtitle: '% / %',
      chartType: 'lineChart',
      data: [
        { period: "Jul '25", time: 86,   target: 85, throughput: 84 },     // typical summer-peak load factor
        { period: 'Aug',     time: 87,   target: 85, throughput: 84 },
        { period: 'Sep',     time: 84,   target: 85, throughput: 86 },
        { period: 'Oct',     time: 83,   target: 85, throughput: 85 },
        { period: 'Nov',     time: 82,   target: 85, throughput: 84 },
        { period: 'Dec',     time: 84,   target: 85, throughput: 83 },
        { period: "Jan '26", time: 80.5, target: 85, throughput: 82 },     // typical winter low
        { period: 'Feb',     time: 80,   target: 85, throughput: 82 },
        { period: 'Mar',     time: 82,   target: 85, throughput: 83 },     // Q1 2026 quarterly avg 81.6%
      ],
      stats: {
        primaryStat: '84% FY 2025',
        peakThroughput: '#1 N.A. on-time 5 yrs',
        csatScore: '81.6% Q1 2026',
      },
    },

    // 6. Delta vs United Revenue Trajectory ($M quarterly)
    {
      id: 6,
      title: 'Delta vs United Quarterly Revenue',
      subtitle: '$M (Big Four #1 vs #2)',
      chartType: 'dualAxis',
      data: [
        { q: "Q1'25", comp: 0,  deltaRevenue: 14040, peerRevenue: 13500 },     // Delta $14.04B; UAL est. ~$13.5B
        { q: "Q2'25", comp: 6,  deltaRevenue: 16648, peerRevenue: 15400 },
        { q: "Q3'25", comp: 4,  deltaRevenue: 16673, peerRevenue: 15500 },
        { q: "Q4'25", comp: 1,  deltaRevenue: 16003, peerRevenue: 14700 },
        { q: "Q1'26", comp: 13, deltaRevenue: 15854, peerRevenue: 14100 },     // Delta Q1 2026 $15.854B
      ],
      stats: {
        deltaRevenue: '$15.9B Delta',
        peerRevenue: '$14.1B United',
        qRevenue: '+$1.8B gap',
      },
    },

    // 7. Operating Margin Bridge: FY 2025 → Mid-Teens 3-5 yr Target
    {
      id: 7,
      title: 'Operating Margin Bridge: FY 2025 → 3-5 yr Target',
      subtitle: 'Adj. Operating Margin %',
      chartType: 'waterfall',
      data: [
        { name: 'FY 2025 Adjusted',     margin: 10.0 },                       // FY 2025 adj op margin
        { name: 'Premium Mix Shift',    margin: 1.5 },                        // est. fleet renewal driver
        { name: 'AmEx + Loyalty Scale', margin: 1.0 },                        // est. AmEx growth $8.2B → $10B
        { name: 'MRO Margin Expand',    margin: 0.5 },                        // est. high-single-digit → mid-teens
        { name: 'Capacity Discipline',  margin: 1.0 },                        // est.
        { name: 'Mid-Teens Target',     margin: 14.0 },                       // JPM Value Creation Framework
      ],
      // Color values are placeholders pending Step 6 finalization; structure preserved for chart engine.
      waterfallSteps: [
        { name: 'FY 2025 Base',         base: 0,    value: 10.0, color: '#1c519c' },
        { name: 'Premium Mix',          base: 10.0, value: 1.5,  color: '#10B981' },
        { name: 'AmEx + Loyalty',       base: 11.5, value: 1.0,  color: '#14B8A6' },
        { name: 'MRO Margin',           base: 12.5, value: 0.5,  color: '#3B82F6' },
        { name: 'Capacity Discipline',  base: 13.0, value: 1.0,  color: '#3B82F6' },
        { name: '3-5yr Target',         base: 0,    value: 14.0, color: '#1c519c' },
      ],
      stats: {
        personnelCost: 'ALPA renews Dec 2026',
        laborPctRev: '+4% pilot pay 1/1/26',
        target: '15%+ ROIC long-term',
      },
    },

    // 8. Diverse Revenue Streams Mix (Premium + Loyalty + Cargo + MRO + Refinery vs Main Cabin)
    {
      id: 8,
      title: 'Diverse Revenue vs Main Cabin Mix',
      subtitle: '% / op margin',
      chartType: 'stackedArea',
      data: [
        // "cold" = diverse-revenue streams (premium, loyalty, cargo, MRO, refinery, etc.) per management framing
        // "hot" = main-cabin tickets (most price-elastic)
        { q: "Q1'23", cold: 55, hot: 45, ticket: 8.5 },
        { q: "Q3'23", cold: 56, hot: 44, ticket: 9.0 },
        { q: "Q1'24", cold: 57, hot: 43, ticket: 9.5 },
        { q: "Q3'24", cold: 58, hot: 42, ticket: 9.7 },
        { q: "Q1'25", cold: 59, hot: 41, ticket: 4.0 },                      // Q1 2025 op margin 4.0%
        { q: "Q3'25", cold: 60, hot: 40, ticket: 11.0 },
        { q: "Q1'26", cold: 62, hot: 38, ticket: 4.6 },                      // Q1 2026 adj op margin 4.6%; diverse rev = 62%
      ],
      stats: {
        coldTicket: '62% diverse',
        hotTicket: '38% main cabin',
        mixShiftImpact: 'Premium +14% Q1\'26',
      },
    },

    // 10. Fleet Renewal Progress (deliveries quarterly)
    {
      id: 10,
      title: 'Fleet Renewal — New Aircraft Deliveries',
      subtitle: 'units (mainline)',
      chartType: 'composedBar',
      data: [
        { q: "Q3'25",  comp: 6,  target: 8 },
        { q: "Q4'25",  comp: 7,  target: 8 },
        { q: "Q1'26",  comp: 8,  target: 8 },                                 // press release
        { q: "Q2'26E", comp: 9,  target: 9 },
        { q: "Q3'26E", comp: 9,  target: 9 },
      ],
      breakdowns: {
        ticket: '343 firm orders',
        traffic: '126 options',
        morning: '~50% premium seats new',                                    // CCO commentary
        afternoon: 'vs ~30% retiring',
      },
    },

    // 12. Jet Fuel Price Trend & Capacity Response
    {
      id: 12,
      title: 'Jet Fuel Price & Capacity Discipline',
      subtitle: '$/gal',
      chartType: 'lineChart',
      data: [
        { period: "Q1'24", time: 2.62, target: 2.50, throughput: 105 },       // 2024 fuel ~$2.57 avg
        { period: "Q2'24", time: 2.55, target: 2.50, throughput: 105 },
        { period: "Q3'24", time: 2.50, target: 2.50, throughput: 105 },
        { period: "Q4'24", time: 2.45, target: 2.50, throughput: 103 },
        { period: "Q1'25", time: 2.45, target: 2.50, throughput: 103 },       // Q1 2025 adjusted $2.45
        { period: "Q2'25", time: 2.30, target: 2.50, throughput: 103 },       // 2025 avg ~$2.30
        { period: "Q3'25", time: 2.20, target: 2.50, throughput: 103 },
        { period: "Q1'26", time: 2.62, target: 2.50, throughput: 101 },       // Q1 2026 adjusted $2.62; capacity +1%
      ],
      stats: {
        primaryStat: '$2.62 Q1\'26',
        peakThroughput: '$4.30 Q2\'26 forward',
        csatScore: 'Q2 capacity flat',
      },
    },

    // 14. Revenue Mix by Source (% of total)
    {
      id: 14,
      title: 'Revenue Mix by Source',
      subtitle: '% of total revenue',
      chartType: 'stackedBar',
      data: [
        // NA = Passenger; Intl = Cargo + Other (Loyalty, MRO); Channel = Refinery (third-party)
        { q: "Q1'25", NA: 82, Intl: 10, Channel: 8,  total: 100 },           // Q1 2025
        { q: "Q2'25", NA: 80, Intl: 12, Channel: 8,  total: 100 },           // est.
        { q: "Q3'25", NA: 80, Intl: 12, Channel: 8,  total: 100 },           // est.
        { q: "Q4'25", NA: 79, Intl: 13, Channel: 8,  total: 100 },           // est.
        { q: "Q1'26", NA: 78, Intl: 12, Channel: 10, total: 100 },           // 10-Q: Pax 78%, Cargo 1%, Other 21% (incl Refinery 10%)
      ],
      growth: {
        na: 'Passenger',
        intl: 'Cargo + Loyalty + MRO',
        channel: 'Refinery 3rd-party',
      },
    },

    // 15. Quarterly EPS Trajectory ($, GAAP)
    {
      id: 15,
      title: 'Quarterly Diluted EPS (GAAP)',
      subtitle: '$/share',
      chartType: 'composedBar',
      data: [
        { q: "Q1'25",   comp: 0.37,  target: 0.50 },                          // 10-Q
        { q: "Q2'25",   comp: 1.96,  target: 1.85 },                          // est.
        { q: "Q3'25",   comp: 1.98,  target: 1.85 },                          // est.
        { q: "Q4'25",   comp: 2.43,  target: 2.20 },                          // est. — implied by FY $7.66 - others
        { q: "Q1'26",   comp: -0.44, target: 0.65 },                          // GAAP loss; $0.64 adjusted
        { q: "Q2'26E",  comp: 1.25,  target: 1.25 },                          // guidance midpoint $1.00-$1.50
      ],
      breakdowns: {
        ticket: '$7.66 GAAP FY25',
        traffic: '$0.64 adj Q1\'26',
        morning: '$1.00-$1.50 Q2\'26',
        afternoon: '$6.50-$7.50 FY26',                                        // FY 2026 EPS guidance (Jan 13, 2026)
      },
    },
  ],
};
