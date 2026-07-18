// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/market.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Numerical values in this file are sourced from Delta Air Lines public
// disclosures: Form 10-K (FY 2025, filed Feb 10, 2026); Form 10-Q (Q1
// 2026, filed Apr 8, 2026); Q1 2026 earnings press release and transcript;
// JPM Industrials Conference deck (Mar 17, 2026). Peer financials from
// United / American / Southwest 2025 IR materials. Industry context from
// McKinsey "State of Aviation 2025" and IATA 2026 outlook.
//
// DISCLAIMER
// Where Delta does not publicly disclose a target, market share figure,
// or forward-looking metric, values are estimated using industry
// benchmarks, peer disclosures (UAL/AAL/LUV), analyst consensus, or
// arithmetic from cited values. UI / scenario-engine parameters are
// operational settings, not Delta-disclosed figures.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { MarketConfig } from '../../types';

export const market: MarketConfig = {
  totalMarketSize: '~$1T+ global / ~$215B US Big Four',
  // Delta's $63.4B FY 2025 revenue / ~$205B Big Four combined
  companyMarketShare: 30.7,
  marketShareTarget: 33.0,         // est. — Delta has not published an explicit US share target
  marketShareYoY: 0.5,             // est. — derived from outpacing peer growth
  segmentGrowth: 4.2,              // IATA: industry RPK growth ~4.2% annually through 2030

  competitors: [
    {
      name: 'United Airlines (UAL)',
      marketShare: 28.8,            // $59.1B / ~$205B Big Four
      yoyChange: 0.3,
      strengths: [
        'Largest international widebody fleet ramp ("United Next" strategy)',
        'Coastal hubs SFO, EWR, IAH; transpacific network depth',
        'Adjusted pre-tax margin 7.8% (FY 2025) — closest peer to Delta',
        'Strong premium product investment (Polaris, Premium Plus)',
      ],
    },
    {
      name: 'American Airlines (AAL)',
      marketShare: 26.6,            // $54.6B / ~$205B
      yoyChange: -0.2,
      strengths: [
        'Largest network scale by destinations served',
        'oneworld alliance; AAdvantage loyalty program',
        'Strong Latin America presence (Miami hub)',
        'Cost discipline programs underway',
      ],
    },
    {
      name: 'Southwest Airlines (LUV)',
      marketShare: 13.7,            // $28.1B / ~$205B
      yoyChange: 0.4,
      strengths: [
        'Strongest brand in domestic leisure',
        'Point-to-point network; non-unionized historically',
        'Cost discipline and operational reliability heritage',
        '2024 transformation: assigned seating, bag fees, premium experimentation',
      ],
    },
    {
      name: 'Alaska Airlines (ALK)',
      marketShare: 5.5,              // est. for the rest after Big Four
      yoyChange: 0.6,
      strengths: [
        'West Coast and Hawaii network (post-Hawaiian merger)',
        'Premium Class hybrid model',
        'oneworld alliance member',
        'Strong customer loyalty in Pacific Northwest',
      ],
    },
    {
      name: 'JetBlue Airways (JBLU)',
      marketShare: 4.4,              // est.
      yoyChange: -0.1,
      strengths: [
        'Mint premium product on transcon and Caribbean',
        'NYC and Boston coastal positioning',
        'Customer service brand in domestic leisure',
        'Cost-conscious mid-market positioning',
      ],
    },
  ],

  marketDrivers: [
    'Premium leisure travel growing — high-income household discretionary spend resilient (McKinsey 2025)',
    'Corporate travel recovery — Q1 2026 corporate sales hit quarterly record at Delta with double-digit growth across all sectors',
    'AmEx co-brand and loyalty programs — Delta target $10B AmEx remuneration vs $8.2B FY 2025',
    'Aircraft supply constraints (~2,000 unit global shortage per McKinsey) supporting yields and load factors',
    'Industry consolidation thesis — high fuel pressuring weak balance sheets toward rationalization (CEO framing repeatedly)',
    'IATA projects industry net margin 3.9% in 2026 ($41B profit) — favorable operating environment for premium-led carriers',
    'Premium-cabin segmentation initiatives — fleet renewal moving premium seat share from ~30% to ~50%',
    'Third-party MRO market — Delta TechOps tracking to $1.2B FY 2026 vs $822M FY 2025',
  ],

  marketChallenges: [
    'Jet fuel volatility — Q2 2026 forward curve ~$4.30/gal vs FY 2025 actual $2.30/gal; Middle East conflict driver',
    'Labor cost pressure — ALPA pilot contract amendable Dec 31, 2026; Monroe USW expires Feb 28, 2026',
    'Aircraft delivery delays — Delta order book deliveries back-loaded to 2029-2031+ (787-10, A350-1000)',
    'Aeromexico antitrust immunity termination (DOT, Sep 2025) — appeal pending; potential JV economics impact',
    'ATC staffing shortages (FAA + EU) — slot constraints at Delta hubs JFK, LGA, Reagan',
    'SAF mandates ramping — EU 2% (2025) rising to 70% (2050); UK adopted 2024',
    'CORSIA Phase 1 compliance costs ramping — IATA estimates $1.7B industry cost in 2026',
    'Pilot Working Agreement implementation creating reliability friction (Delta-specific)',
  ],

  regionalBreakdown: [
    {
      region: 'Domestic',
      revenue: 35.731,             // FY 2025 passenger revenue
      growth: 1.0,                 // +1% YoY
      keyInsight:
        '~71% of passenger revenue. Anchored by core hubs ATL, DTW, MSP, SLC plus coastal hubs BOS, LAX, JFK, LGA, SEA. ' +
        'Premium and corporate driving Q1 2026 +8%; main cabin softer in 2025 but inflected positive in Q1 2026. ' +
        'Coastal markets lead corporate share gains.',
    },
    {
      region: 'Atlantic',
      revenue: 9.270,
      growth: 2.0,
      keyInsight:
        '"Largest and most profitable international entity" per Delta management. ' +
        'Joint venture with Air France-KLM and Virgin Atlantic (Delta owns 49% Virgin Atlantic, 3% Air France-KLM). ' +
        'Premium-led; new May 2026 routes BOS-MAD, BOS-NCE, JFK-OPO, JFK-OLB.',
    },
    {
      region: 'Latin America',
      revenue: 3.980,
      growth: 0.0,
      keyInsight:
        'Aeromexico JV (DOT antitrust immunity terminated Sep 2025; appeal pending under stay). ' +
        'LATAM JV (Delta owns ~11%) covers North-South America. ' +
        'Q1 2026 Mexico leisure weakness from civil unrest in Puerto Vallarta; capacity already redirected.',
    },
    {
      region: 'Pacific',
      revenue: 2.787,
      growth: 10.0,
      keyInsight:
        'Smallest geography (~5% of passenger revenue) but fastest-growing in 2025 (+10%). ' +
        'Korean Air JV (Delta owns ~15% of Hanjin-KAL). New Salt Lake City - Seoul-Incheon route 2025. ' +
        'China capacity increases; Japan and South Korea premium-led demand.',
    },
  ],
};
