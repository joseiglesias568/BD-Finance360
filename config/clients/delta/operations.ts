// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/operations.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Numerical values in this file are sourced from Delta Air Lines public
// disclosures: Form 10-K (FY 2025); Form 10-Q (Q1 2026); Q1 2026 earnings
// press release; JPM Industrials Conference deck. Industry benchmarks
// from McKinsey "State of Aviation 2025" and IATA 2026 outlook.
//
// DISCLAIMER
// Where Delta does not publicly disclose hub-by-hub metrics or facility-
// level financials, values are estimated from public destination/hub
// commentary. UI parameter values (status thresholds, target levels) are
// operational settings, not Delta-disclosed figures.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { OperationsConfig } from '../../types';

export const operations: OperationsConfig = {
  totalLocations: 300,               // 300+ destinations served (10-K)
  locationGrowth: 5,                 // net new May 2026 routes (BOS-MAD, BOS-NCE, JFK-OPO, JFK-OLB, JFK-SNA)
  locationGrowthPercent: 1.7,

  // Hubs and key markets — Delta's core/coastal hub framework (10-K)
  locations: [
    {
      name: 'Atlanta (ATL) — Global Headquarters & Largest Hub',
      type: 'Core Hub + HQ',
      region: 'Domestic',
      metrics: [
        { label: 'Daily Departures', value: '~1,000', target: '1,050', status: 'good' },
        { label: 'Destinations Served', value: '~225', target: '230', status: 'good' },
        { label: 'Sky Club Locations', value: '6+', target: 'Maintain', status: 'good' },     // 3 renovated in Q1 2026
        { label: 'On-Time Performance', value: '#1 N.A.', target: 'Maintain', status: 'good' },
      ],
    },
    {
      name: 'Detroit (DTW)',
      type: 'Core Hub',
      region: 'Domestic',
      metrics: [
        { label: 'Daily Departures', value: '~400', target: '425', status: 'good' },
        { label: 'Pacific Connection Strength', value: 'Primary East Asia gateway', target: 'Maintain', status: 'good' },
        { label: 'Local Share', value: 'High', target: 'Maintain', status: 'good' },
        { label: 'Loyalty Penetration', value: 'High', target: 'Maintain', status: 'good' },
      ],
    },
    {
      name: 'Minneapolis-St. Paul (MSP)',
      type: 'Core Hub',
      region: 'Domestic',
      metrics: [
        { label: 'Daily Departures', value: '~400', target: '420', status: 'good' },
        { label: 'Local Share', value: 'High', target: 'Maintain', status: 'good' },
        { label: 'Cost Position', value: 'Competitive', target: 'Maintain', status: 'good' },
        { label: 'Operating Margin Profile', value: 'Strong', target: 'Maintain', status: 'good' },
      ],
    },
    {
      name: 'Salt Lake City (SLC)',
      type: 'Core Hub',
      region: 'Domestic',
      metrics: [
        { label: 'Daily Departures', value: '~330', target: '340', status: 'good' },
        { label: 'New 2025 Pacific Route', value: 'SLC-ICN with Korean Air', target: 'Establish', status: 'good' },
        { label: 'Western US Coverage', value: 'Primary', target: 'Maintain', status: 'good' },
        { label: 'Connecting Traffic Share', value: 'High', target: 'Maintain', status: 'good' },
      ],
    },
    {
      name: 'New York (JFK + LGA)',
      type: 'Coastal Hub',
      region: 'Domestic',
      metrics: [
        { label: 'Slot Position (JFK + LGA + Reagan)', value: 'Strong', target: 'Maintain', status: 'good' },
        { label: 'Corporate Share', value: 'Top market', target: 'Grow', status: 'good' },
        { label: 'Premium Cabin Demand', value: 'Strong', target: 'Maintain', status: 'good' },
        { label: 'New May 2026 Routes (JFK)', value: '+OPO, OLB, SNA', target: 'Launch', status: 'good' },
      ],
    },
    {
      name: 'Los Angeles (LAX)',
      type: 'Coastal Hub',
      region: 'Domestic',
      metrics: [
        { label: 'Daily Departures', value: '~155', target: '170', status: 'warning' },
        { label: 'Premium Mix', value: 'High', target: 'Maintain', status: 'good' },
        { label: 'New Florida Routes (Winter)', value: 'PBI, TPA, MCO on A321neo', target: 'Launch', status: 'good' },
        { label: 'Corporate Coastal Strength', value: 'Top market', target: 'Grow', status: 'good' },
      ],
    },
    {
      name: 'Boston (BOS)',
      type: 'Coastal Hub',
      region: 'Domestic',
      metrics: [
        { label: 'Daily Departures', value: '~150', target: '165', status: 'warning' },
        { label: 'New Atlantic Routes (May 2026)', value: 'BOS-MAD, BOS-NCE', target: 'Launch', status: 'good' },
        { label: 'Corporate Mix', value: 'High', target: 'Grow', status: 'good' },
        { label: 'Premium Cabin Demand', value: 'Growing', target: 'Maintain', status: 'good' },
      ],
    },
    {
      name: 'Seattle (SEA)',
      type: 'Coastal Hub',
      region: 'Domestic',
      metrics: [
        { label: 'Daily Departures', value: '~160', target: '170', status: 'good' },
        { label: 'Pacific NW + Asia Connection', value: 'Primary', target: 'Maintain', status: 'good' },
        { label: 'Corporate Mix (Tech)', value: 'High', target: 'Grow', status: 'good' },
        { label: 'Competitive Position vs Alaska', value: 'Stable', target: 'Maintain', status: 'good' },
      ],
    },
    {
      name: 'Amsterdam (AMS) — Atlantic JV Hub',
      type: 'International JV Hub',
      region: 'Atlantic',
      metrics: [
        { label: 'JV Partner', value: 'Air France-KLM', target: 'Maintain', status: 'good' },
        { label: 'Schiphol Noise Litigation', value: 'Active', target: 'Resolve', status: 'warning' },
        { label: 'Premium Mix', value: 'Highest of intl entities', target: 'Grow', status: 'good' },
        { label: 'Frequencies vs Pre-COVID', value: 'Recovered', target: 'Maintain', status: 'good' },
      ],
    },
    {
      name: 'Seoul-Incheon (ICN) — Pacific JV Hub',
      type: 'International JV Hub',
      region: 'Pacific',
      metrics: [
        { label: 'JV Partner', value: 'Korean Air (~15% Hanjin-KAL)', target: 'Maintain', status: 'good' },
        { label: 'New 2025 Route', value: 'SLC-ICN', target: 'Maintain', status: 'good' },
        { label: 'Pacific Regional Growth', value: '+10% in 2025', target: 'Sustain', status: 'good' },
        { label: 'Premium Demand', value: 'Strong', target: 'Maintain', status: 'good' },
      ],
    },
  ],

  // Supply chain reframed for airline — fuel sourcing, aircraft delivery,
  // MRO turnaround, parts and SAF
  supplyChain: [
    { label: 'Jet Fuel from Trainer Refinery', value: '~75%', target: '~75%', trend: 'flat', status: 'good' },                  // 10-K refinery section
    { label: 'Trainer Refinery Throughput', value: '~200K bpd', target: '~200K bpd', trend: 'flat', status: 'good' },
    { label: 'Q2 2026 Refinery Benefit (forward curve)', value: '~$300M', target: 'Variable', trend: 'up', status: 'good' },     // Q1 2026 transcript
    { label: 'Aircraft Delivered Q1 2026', value: '8', target: '~30/yr', trend: 'flat', status: 'good' },                        // press release
    { label: 'Aircraft Order Book (firm)', value: '343', target: 'Replacement', trend: 'up', status: 'good' },                   // 10-Q
    { label: 'Aircraft Order Book (options)', value: '126', target: 'Optionality', trend: 'flat', status: 'good' },
    { label: 'Aircraft Avg Age (mainline)', value: '15.0 yr', target: '<14 yr', trend: 'flat', status: 'warning' },               // 10-Q
    { label: 'SAF as % of Fuel Use', value: '<1%', target: 'Per EU/UK mandates', trend: 'up', status: 'warning' },                // industry context
  ],

  digitalMetrics: [
    { label: 'Delta Sync Customer Logins', value: '110M+', description: 'Expected 2026 (CEO commentary). Partners: AmEx, T-Mobile, YouTube Premium, Paramount+, NYT.' },
    { label: 'Free Wi-Fi Enabled Aircraft', value: '1,200+', description: 'Q1 2026; 1,000th milestone Dec 2025. Free for SkyMiles members.' },
    { label: 'Delta Concierge AI (Beta)', value: 'Apr 2026', description: 'GenAI virtual assistant in Delta app — voice + text natural language. Beta to select SkyMiles members.' },
    { label: 'AWS Cloud Migration', value: 'Mostly complete', description: 'Most technology infrastructure on AWS as of 2025-26 (announced 2022).' },
    { label: 'Operational AI Use Cases', value: 'Bag routing, gating, maintenance', description: 'AI deployed in hub bag routing/distribution, on-time gating decisions, predictive maintenance.' },
    { label: 'Amazon Leo LEO Wi-Fi', value: '500 aircraft, 2028', description: 'Initial install starting 2028; next-generation low-Earth-orbit satellite Wi-Fi.' },
  ],

  // Airline-specific KPIs (industry-standard unit economics) with peer benchmarks
  industryKPIs: [
    {
      label: 'TRASM (Total Revenue per ASM, adj.)',
      value: '19.56¢',                           // FY 2025
      target: '20.50¢',                          // est. — implied by guidance trajectory
      benchmark: '~17¢ (industry avg)',          // est. industry avg from McKinsey/IATA
      description: 'Adjusted total unit revenue. Q1 2026 = 20.53¢ adj (+8.2%).',
    },
    {
      label: 'CASM-Ex (Non-Fuel Unit Cost, new basis)',
      value: '13.61¢',                           // FY 2025 new basis
      target: '14.0¢',                           // est. — Delta targets low-single-digit annual growth
      benchmark: '~13¢ (legacy avg)',            // est.
      description: 'Non-fuel unit cost excluding MRO. FY 2025 13.61¢ (+2.1% vs 2024 13.33¢). Q1 2026 15.13¢ reflecting capacity discipline + crew recovery.',
    },
    {
      label: 'Load Factor',
      value: '84%',                              // FY 2025
      target: '85%',                             // est. (FY 2024 reading)
      benchmark: '~83% (US legacy)',
      description: 'FY 2025 load factor down 1 pt YoY on capacity ahead of RPMs. Q1 2026 81.6%.',
    },
    {
      label: 'Yield (Passenger mile yield)',
      value: '20.74¢',                           // FY 2025
      target: '21.50¢',                          // est.
      benchmark: '~19¢ (industry avg)',
      description: 'FY 2025 yield 20.74¢ vs 20.68¢ FY 2024. Q1 2026 21.78¢ (+6%).',
    },
    {
      label: 'On-Time Performance',
      value: '#1 N.A.',
      target: 'Maintain #1',
      benchmark: '78% (US industry avg)',        // McKinsey 2025
      description: 'Cirium #1 most on-time North American airline 5 consecutive years.',
    },
    {
      label: 'Fuel Efficiency Improvement',
      value: '55M gal saved',                    // 10-K
      target: '1% annual fuel-burn savings',
      benchmark: 'N/A',
      description: 'FY 2025 saved 55M gallons jet fuel vs 2019 baseline (>$125M annual savings); exceeded near-term 1% target.',
    },
  ],

  peopleMetrics: [
    {
      label: 'Full-Time Equivalent Employees',
      value: '103,000',                          // 10-K
      target: 'Stable',
      trend: 'flat',
      status: 'good',
      description: 'YE 2025 ~103,000 FTE. ~100,000 US-based. ~20% unionized (primarily pilots).',
    },
    {
      label: 'Profit-Sharing Paid (FY 2025 perf.)',
      value: '$1.3B',
      target: 'Variable',
      trend: 'flat',
      status: 'good',
      description: 'Paid Feb 2026 for FY 2025 performance. More than rest of US industry combined per management.',
    },
    {
      label: 'Fortune Best Companies to Work For',
      value: '#9 (2026)',                        // up from #15 in 2025
      target: 'Top 10',
      trend: 'up',
      status: 'good',
      description: 'Up from #15 in 2025. Only ranked airline. 7 consecutive years on the list.',
    },
    {
      label: 'Forbes World\'s Best Employers',
      value: '#2 (2025)',
      target: 'Top 5',
      trend: 'up',
      status: 'good',
      description: 'Forbes 2025 World\'s Best Employers ranking.',
    },
    {
      label: 'Pilot Workforce (ALPA)',
      value: '17,260',                           // 10-K
      target: 'Stable',
      trend: 'flat',
      status: 'warning',
      description: 'ALPA collective bargaining agreement amendable Dec 31, 2026 — next major labor negotiation. 4% pay raise effective Jan 1, 2026.',
    },
    {
      label: 'Shared Rewards Program',
      value: '$67M',                             // 10-K
      target: 'Variable',
      trend: 'flat',
      status: 'good',
      description: 'Operational performance bonus program. FY 2025 employees earned $67M.',
    },
  ],

  customerExperience: [
    {
      label: 'Cirium On-Time Ranking (N.A.)',
      value: '#1',
      target: 'Maintain',
      trend: 'flat',
      status: 'good',
      description: '#1 most on-time North American airline 5 consecutive years (through 2025).',
    },
    {
      label: 'Business Travel News Corporate Survey',
      value: '#1',
      target: 'Maintain',
      trend: 'flat',
      status: 'good',
      description: '#1 corporate-travel airline 15 consecutive years per Business Travel News annual survey.',
    },
    {
      label: 'SkyMiles Loyalty Program (On Point Loyalty 2026)',
      value: 'World #1',
      target: 'Maintain',
      trend: 'flat',
      status: 'good',
      description: 'Ranked world\'s most valuable airline loyalty program in On Point Loyalty\'s Top 100 Most Valuable Airline Loyalty Programs 2026.',
    },
    {
      label: 'Skytrax Airline Staff Service (N.A.)',
      value: '#1',
      target: 'Maintain',
      trend: 'flat',
      status: 'good',
      description: 'Skytrax Best Airline Staff Service in North America (customer-feedback-based).',
    },
    {
      label: 'Customers Served (FY 2025)',
      value: '200M+',
      target: 'Grow',
      trend: 'up',
      status: 'good',
      description: 'FY 2025 served 200M+ customers safely and reliably (10-K).',
    },
    {
      label: 'Q1 2026 Corporate Sales',
      value: 'Quarterly Record',
      target: 'Continue',
      trend: 'up',
      status: 'good',
      description: 'Q1 2026 corporate sales hit a quarterly record with double-digit growth across all sectors (Banking, Aerospace & Defense, Tech leading). 85% of surveyed corporate clients expect Q2 2026 spend up or flat.',
    },
  ],
};
