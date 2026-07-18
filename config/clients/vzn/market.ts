// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/market.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Verizon public disclosures (FY2025 10-K, Q1 2026 10-Q) plus peer
// financials: T-Mobile Q1 2026 earnings, AT&T Q1 2026 earnings, Charter
// public filings. Industry benchmarks from analyst consensus (May 2026).
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { MarketConfig } from '../../types';

export const market: MarketConfig = {
  totalMarketSize: '~$420B US telecom services',
  // Verizon $134B FY2025 / ~$420B US telecom addressable = ~32%
  companyMarketShare: 31.9,
  marketShareTarget: 33.0,           // est. — implied by FWA/fiber expansion into new geographies
  marketShareYoY: 0.3,               // est. — Frontier acquisition added ~$5.5B annualized revenue
  segmentGrowth: 2.5,                // US wireless service revenue CAGR ~2–3% per analyst consensus

  competitors: [
    {
      name: 'AT&T (T)',
      marketShare: 31.2,              // $126B FY2025 / $420B est.
      yoyChange: 0.1,
      strengths: [
        'Fiber build targeting 30M+ passings by end-2026; ~9.5M fiber subs Q1 2026',
        'Wireless service revenue +2.9% Q1 2026; postpaid phone net adds +294K',
        'FirstNet public safety network — exclusive with US government contract',
        'WarnerMedia separation complete; pure-play telecom/fiber thesis',
      ],
    },
    {
      name: 'T-Mobile (TMUS)',
      marketShare: 22.0,              // $92B FY2025 / $420B est. (wireless-focused; smaller total revenue base)
      yoyChange: 1.5,
      strengths: [
        'Best mid-band 5G coverage (~95% of US population) vs Verizon ~75%',
        'FWA fastest-growing: 500K+ net adds Q1 2026; ~7M total FWA subs',
        'Postpaid phone net adds +1.3M Q1 2026 — consistently outpacing peers',
        'Lowest cost position; aggressive value pricing (Un-carrier strategy)',
      ],
    },
    {
      name: 'Charter / Spectrum (CHTR)',
      marketShare: 8.7,               // $35.5B FY2025 broadband + cable / $420B
      yoyChange: -0.2,                // broadband subs declining from wireless competition
      strengths: [
        'Spectrum Mobile ~10M+ lines (MVNO on Verizon network — revenue risk if they switch)',
        'Cox merger FCC approved Feb 27, 2026; pending California CPUC (deadline Sep 15, 2026)',
        'Post-merger: ~32M internet subs, ~$70B revenue — formidable broadband competitor',
        'Dense urban/suburban footprint in key markets (NY, LA, TX, FL)',
      ],
    },
    {
      name: 'Comcast / Xfinity (CMCSA)',
      marketShare: 7.4,               // $31B broadband + cable estimated portion
      yoyChange: -0.3,
      strengths: [
        'Largest US broadband provider ~31M internet subs',
        'Xfinity Mobile 7M+ lines (MVNO on Verizon network)',
        'NBCUniversal content portfolio — differentiated bundling',
        'Peacock streaming and broadband/streaming bundle strategy',
      ],
    },
    {
      name: 'Dish / EchoStar (DISH)',
      marketShare: 1.8,               // small wireless market share; financially distressed
      yoyChange: -0.5,
      strengths: [
        'Spectrum holdings (700 MHz band) and 5G build obligations (FCC compliance risk)',
        'MVNO and wholesale capacity to other carriers',
        'Low-cost Boost Mobile prepaid brand',
        'Potential spectrum transaction target for larger carriers',
      ],
    },
  ],

  marketDrivers: [
    'Wireless service revenue growth driven by premium plan adoption (myPlan, Unlimited Ultimate) — ARPA +1–2% annually',
    'Fixed Wireless Access (FWA) secular shift: ~16M US households switching from cable broadband to wireless home internet by 2028',
    'C-Band densification unlocking Verizon Home broadband quality parity with fiber — key FWA retention driver',
    'Frontier integration synergies: $1.5B run-rate by Year 3; cross-sell wireless → fiber in 31 states + DC now available',
    'Enterprise private networks (CBRS/C-Band): $1B+ pipeline; manufacturing, healthcare, logistics sectors leading',
    'AI cost transformation: network automation reducing field-force dispatch; chatbot + AI deflecting 30%+ of care contacts',
    'IoT connectivity: fleet telematics, smart city, healthcare monitoring driving Business segment low-single-digit growth',
    'Postpaid phone net adds turned positive Q1 2026 — first since 2013 — signaling competitive momentum inflection',
  ],

  marketChallenges: [
    'T-Mobile mid-band 5G coverage gap: T-Mobile at ~95% vs Verizon ~75% — C-Band densification must close gap',
    'ARPA pressure: T-Mobile value pricing forces Verizon to offer competitive promotions; headwinds to ARPA expansion',
    'Charter/Comcast MVNO dependency: Spectrum Mobile and Xfinity Mobile run on Verizon network — if they build own or switch, MVNO revenue risk',
    'Charter+Cox merger (pending): combined entity ~32M broadband subs and ~17M mobile lines is materially stronger cable/wireless competitor',
    'Debt leverage post-Frontier: ~2.5x Net Debt/EBITDA limits financial flexibility vs pre-acquisition ~2.2x; rating agency scrutiny',
    'Frontier integration execution risk: complex OSS/BSS migration across 31 states; customer re-branding by Q1 2027 deadline',
    'Postpaid phone market saturation: US wireless penetration >115%; net adds require taking share, not growing market',
    'ACP expiry impact: ~10M low-income broadband households lost subsidy — some FWA subscriber headwind in 2025–2026',
  ],

  regionalBreakdown: [
    {
      region: 'Northeast & Mid-Atlantic (Core Fios)',
      revenue: 52.0,                  // est. FY2025 (Verizon does not break out by geography)
      growth: 1.8,
      keyInsight:
        'Traditional Verizon Fios territory: NY, NJ, PA, MA, RI, CT, VA, MD, DC. ' +
        'Highest fiber penetration rate ~43% of passings. Legacy enterprise and government accounts. ' +
        'Most competitive market with Comcast, Optimum, cable/fiber overbuild.',
    },
    {
      region: 'National Wireless (Consumer + Business)',
      revenue: 60.0,                  // est. FY2025 wireless service revenue
      growth: 2.7,
      keyInsight:
        'Nationwide postpaid wireless is core revenue engine: ~116M total postpaid connections. ' +
        'Q1 2026 postpaid phone net adds +55K — first positive Q1 in 13 years. ' +
        'myPlan adoption driving ARPA. T-Mobile most aggressive competitor for switching.',
    },
    {
      region: 'Frontier Expansion (31 States + DC)',
      revenue: 5.5,                   // est. Frontier annualized revenue run-rate
      growth: 4.0,
      keyInsight:
        'Frontier acquisition (closed January 22, 2026) added ~25M fiber passings across 31 states + DC. ' +
        'States include CA, TX, FL, CT, NY, IN, WV and 24 others. ' +
        'FY2026 priority: network integration (target Q3 2026) and cross-sell wireless to Frontier broadband base.',
    },
    {
      region: 'Fixed Wireless Access (National)',
      revenue: 3.4,                   // est. FY2025 FWA revenue (5.7M subs × ~$50/mo × 12 = $3.4B)
      growth: 22.0,
      keyInsight:
        'FWA is highest-growth segment. 5.7M subs Q1 2026; FY2026 target +700K–800K net adds. ' +
        'Primarily rural and suburban markets underserved by fiber (complement to Fios territory). ' +
        'T-Mobile leading FWA race (~7M subs); Verizon #2 with better C-Band capacity long-term.',
    },
  ],
};
