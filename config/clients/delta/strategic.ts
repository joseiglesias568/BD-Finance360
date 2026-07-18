// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/strategic.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Initiatives, risks, and outlook are sourced from Delta Air Lines public
// disclosures: Form 10-K (FY 2025); Form 10-Q (Q1 2026); Q1 2026 earnings
// press release and transcript; JPM Industrials Conference deck (3-5 yr
// Value Creation Framework); December Quarter Supplemental.
//
// DISCLAIMER
// Initiative budgets and progress percentages are estimated for
// demonstration — Delta does not publicly disclose initiative-by-initiative
// capital allocation. Risk owners use current named executives where
// publicly known (e.g., CEO Bastian, CFO Snell). Forward-outlook figures
// for Q2 2026 reflect company guidance issued April 8, 2026 and are
// subject to update; full-year FY 2026 outlook reflects Jan 13, 2026
// guidance (now stale post-fuel spike).
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { StrategicConfig } from '../../types';

export const strategic: StrategicConfig = {
  initiatives: [
    {
      id: 'fleet-renewal',
      name: 'Fleet Renewal & Modernization',
      description:
        'Multi-year fleet refresh program. 343 firm aircraft orders + 126 options at 3/31/26. Q1 2026 alone added 95 firm orders (30 Boeing 787-10, 16 Airbus A330-900neo, 15 A350-900, 34 A321neo options exercised). New aircraft carry ~50% premium seat share vs ~30% on retiring aircraft. ' +
        'First US airline to operate Airbus A350-1000.',
      status: 'on-track',
      budget: 15400,                  // $15.4B aircraft purchase commitments at YE 2025 (10-K)
      spent: 4500,                    // FY 2025 capex ~$4.5B (10-K)
      progress: 30,
      milestones: [
        { name: 'A321neo deliveries continuing (34 options exercised Feb 2026)', date: '2026-12-31', status: 'in-progress' },
        { name: 'A330-900neo (16) + A350-900 (15) deliveries begin', date: '2029-06-30', status: 'planned' },
        { name: 'Boeing 787-10 deliveries begin (30 firm + 30 options)', date: '2031-03-31', status: 'planned' },
        { name: 'A350-1000 first US airline operation', date: '2026-12-31', status: 'in-progress' },
      ],
      kpis: [
        { label: 'Mainline Fleet Size', target: 1050, actual: 997, status: 'good' },
        { label: 'Avg Aircraft Age', target: '<14 yrs', actual: '15.0 yrs', status: 'warning' },
        { label: 'Premium Seat Share (new aircraft)', target: '50%+', actual: '50%', status: 'good' },
        { label: 'Q1 2026 Capex', target: '$1.2B', actual: '$1.18B', status: 'good' },
      ],
    },
    {
      id: 'premium-segmentation',
      name: 'Premium Cabin Segmentation & Product Expansion',
      description:
        'Multi-tier premium segmentation across Delta One, First Class, Delta Premium Select, Delta Comfort+. ' +
        'Premium product revenue $22.1B FY 2025 (+7%) and growing toward parity with Main Cabin ($23.4B, -5% YoY). ' +
        'CCO commentary: "well on our journey, on target for where we want to be by the end of the year with the premium segmentation."',
      status: 'on-track',
      budget: 800,                    // est.
      spent: 350,                     // est.
      progress: 60,
      milestones: [
        { name: 'Premium product line refresh launched', date: '2025-09-30', status: 'completed' },
        { name: 'Memory-foam cushions on widebodies', date: '2026-06-30', status: 'in-progress' },
        { name: 'Full premium segmentation rollout', date: '2026-12-31', status: 'in-progress' },
        { name: 'Premium revenue >50% of passenger revenue', date: '2027-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Premium Revenue (FY 2025)', target: '$22.5B', actual: '$22.1B', status: 'good' },
        { label: 'Premium YoY Growth (Q1 2026)', target: '12%', actual: '14%', status: 'good' },
        { label: 'Premium Seat Share Avg', target: '40%', actual: '~37%', status: 'warning' },
      ],
    },
    {
      id: 'amex-loyalty',
      name: 'AmEx Co-Brand & Loyalty Platform Growth',
      description:
        'Scale Delta-AmEx co-brand revenue from $8.2B (FY 2025) to $10B target "over the next few years." ' +
        'Cardholder spend grew double-digit in 2025; cash sales from marketing agreements totaled $8.0B (vs $7.4B 2024). ' +
        'Delta Sync digital platform — 110M customer logins expected 2026. New partnerships: Sphere (Delta SKY360° Club), Amazon Leo LEO Wi-Fi (500 aircraft, 2028).',
      status: 'on-track',
      budget: 600,                    // est.
      spent: 220,                     // est.
      progress: 45,
      milestones: [
        { name: 'AmEx remuneration $8.2B FY 2025', date: '2025-12-31', status: 'completed' },
        { name: 'Delta Sync 110M+ logins target', date: '2026-12-31', status: 'in-progress' },
        { name: 'Sphere Delta SKY360° Club opens', date: '2026-06-30', status: 'in-progress' },
        { name: 'AmEx remuneration $10B target', date: '2028-12-31', status: 'planned' },
        { name: 'Amazon Leo LEO Wi-Fi 500 aircraft', date: '2028-06-30', status: 'planned' },
      ],
      kpis: [
        { label: 'AmEx Remuneration', target: '$10B', actual: '$8.2B', status: 'good' },
        { label: 'Cardholder Spend Growth (Q1 2026)', target: '10%', actual: '12%', status: 'good' },
        { label: 'Loyalty Deferred Revenue Balance', target: '$10B', actual: '$9.3B', status: 'good' },
      ],
    },
    {
      id: 'mro-scale',
      name: 'Delta TechOps Third-Party MRO Scale',
      description:
        'Grow third-party maintenance, repair, and overhaul revenue from $822M (FY 2025) to $1.2B FY 2026 outlook (~50% growth) and beyond, with operating margin expanding from high-single-digit to mid-teens. ' +
        'First and only North American airline MRO with full overhaul capability across both LEAP-1A and LEAP-1B engines.',
      status: 'on-track',
      budget: 250,                    // est.
      spent: 100,                     // est.
      progress: 40,
      milestones: [
        { name: 'LEAP-1A and LEAP-1B full overhaul capability', date: '2026-03-31', status: 'completed' },
        { name: 'Q1 2026 MRO revenue $380M (+152% YoY)', date: '2026-03-31', status: 'completed' },
        { name: 'FY 2026 MRO revenue $1.2B', date: '2026-12-31', status: 'in-progress' },
        { name: 'MRO operating margin mid-teens', date: '2028-12-31', status: 'planned' },
        { name: 'MRO revenue 2x+ FY 2025 base', date: '2030-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'MRO Revenue (FY 2025)', target: '$800M', actual: '$822M', status: 'good' },
        { label: 'FY 2026 MRO Revenue Outlook', target: '$1.2B', actual: '$1.2B', status: 'good' },
        { label: 'MRO Operating Margin', target: 'mid-teens', actual: 'high single-digits', status: 'warning' },
      ],
    },
    {
      id: 'sustainability-net-zero',
      name: 'Sustainability & Net-Zero by 2050',
      description:
        'Three-pillar sustainability strategy: What We Fly (revolutionary aircraft partnerships — JetZero blended wing-body, Maeve hybrid-electric regional, Joby eVTOL), How We Fly (operational efficiency — 55M gallons fuel saved 2025, >$125M annual savings), Fuel We Use (SAF advocacy and procurement). ' +
        'EU SAF mandate active 2025 (2% rising to 70% by 2050); UK adopted 2024.',
      status: 'at-risk',
      budget: 400,                    // est.
      spent: 95,                      // est.
      progress: 25,
      milestones: [
        { name: 'Met 1% fuel-burn-savings near-term target (FY 2025)', date: '2025-12-31', status: 'completed' },
        { name: '55M gallons fuel saved vs 2019 baseline', date: '2025-12-31', status: 'completed' },
        { name: 'JetZero / Maeve / Joby partnerships announced', date: '2025-12-31', status: 'completed' },
        { name: 'CORSIA Phase 1 compliance (2024-2026)', date: '2026-12-31', status: 'in-progress' },
        { name: 'EU SAF mandate compliance ramping', date: '2030-12-31', status: 'in-progress' },
        { name: 'Net-zero airline operations', date: '2050-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Fuel Savings vs 2019 (gal)', target: '50M', actual: '55M', status: 'good' },
        { label: 'Annual Cost Savings (Fuel Eff.)', target: '$120M', actual: '$125M+', status: 'good' },
        { label: 'SAF as % of Fuel Use', target: 'EU 2% min', actual: '<1%', status: 'warning' },
      ],
    },
    {
      id: 'leadership-transformation',
      name: 'Leadership Reorganization (Effective April 1, 2026)',
      description:
        'Largest C-suite reorganization in years (announced March 5, 2026): Peter Carter promoted to President (succeeds Hauenstein, retired Feb 28, 2026); Erik Snell appointed CFO (eff. April 1, 2026); Ranjan Goswami new Chief Marketing & Product Officer (replacing Tillman); Amala Duggirala new CDTO (replacing Samant, retired Mar 1, 2026); Joe Esposito new Chief Commercial Officer; Alain Bellemare adds Chairman of Delta TechOps. ' +
        'John Laughter retiring April 30, 2026 after 30+ years.',
      status: 'on-track',
      budget: 0,
      spent: 0,
      progress: 100,
      milestones: [
        { name: 'Hauenstein retirement', date: '2026-02-28', status: 'completed' },
        { name: 'Samant retirement', date: '2026-03-01', status: 'completed' },
        { name: 'Janki / Snell / Carter / Goswami effective dates', date: '2026-04-01', status: 'completed' },
        { name: 'Laughter retirement', date: '2026-04-30', status: 'in-progress' },
      ],
      kpis: [
        { label: 'Reporting Lines Established', target: '100%', actual: '100%', status: 'good' },
        { label: 'Q1 2026 Earnings Call (first w/ new lineup)', target: 'Apr 8, 2026', actual: 'Apr 8, 2026', status: 'good' },
      ],
    },
  ],

  risks: [
    {
      id: 'fuel-volatility',
      category: 'Market / Cost',
      title: 'Jet Fuel Price Volatility — Middle East Conflict',
      description:
        'Q2 2026 forward fuel curve ~$4.30/gal (vs FY 2025 actual $2.30/gal) driven by Middle East geopolitical conflict. ' +
        '>$2B incremental fuel expense at Q2 forward curve. Fuel-recapture lag historically 60-90 days.',
      severity: 'high',
      likelihood: 'high',
      impact:
        'Q1 2026 GAAP operating margin 3.2% (vs adjusted 4.6%). Q2 2026 guided pre-tax profit ~$1B reflects 40-50% recapture target only. ' +
        'Refinery offset ~$300M expected in Q2 — partial natural hedge but not full.',
      mitigation:
        'Monroe refinery vertical hedge (~$300M Q2 benefit at forward curve). Capacity discipline (Q2 flat with downward bias). ' +
        'Active fuel-recapture (40-50% Q2 target, 100% goal). Industry rationalization thesis benefits Delta share long-term.',
      owner: 'Erik S. Snell (CFO, eff. Apr 1, 2026)',
    },
    {
      id: 'pwa-reliability',
      category: 'Operations / Labor',
      title: 'Pilot Working Agreement Reliability Friction',
      description:
        'Recent contractual changes from 4-year PWA effective Jan 1, 2023 created reliability and recovery degradation, particularly after severe weather. Higher recovery costs flowing into non-fuel CASM (+6% Q1 2026 vs prior +4-5% trend).',
      severity: 'medium',
      likelihood: 'high',
      impact:
        'Non-fuel CASM growth elevated ~1-2 pts above prior pattern. Operational reliability gap vs Delta\'s "industry-leading" brand promise. ' +
        'Active partnership with pilot union to fix; described as "top focus" for COO.',
      mitigation:
        'Direct engagement with ALPA leadership. Operational resilience improvements through summer 2026. Targeted hiring against open requisitions. Confidence in second-half 2026 improvement per management.',
      owner: 'Erik S. Snell (CFO)',
    },
    {
      id: 'alpa-amendable',
      category: 'Labor',
      title: 'ALPA Pilot Contract Amendable Dec 31, 2026',
      description:
        '17,260 Delta pilots represented by ALPA. Current 4-year agreement (effective Jan 1, 2023) becomes amendable Dec 31, 2026. ' +
        'Just-completed 4% pay raise effective Jan 1, 2026 in run-up. Endeavor pilots (1,770) on separate ALPA agreement amendable Jan 1, 2029.',
      severity: 'high',
      likelihood: 'medium',
      impact:
        'Salaries + profit sharing = 33% of opex in FY 2025. Material wage increase in next contract could pressure unit cost trajectory. ' +
        'Railway Labor Act process — strikes only after exhausting mediation, NMB, "cooling-off" period. ' +
        'Reliability friction during negotiation period possible.',
      mitigation:
        'Constructive employee relations posture; profit-sharing program ($1.3B paid Feb 2026 — more than rest of US industry combined). ' +
        '~80% of Delta\'s mainline workforce non-unionized — structural cost flexibility advantage vs peers.',
      owner: 'Allison C. Ausband (Chief People Officer)',
    },
    {
      id: 'aeromexico-antitrust',
      category: 'Regulatory / International',
      title: 'Aeromexico Antitrust Immunity Termination',
      description:
        'DOT issued final order Sep 15, 2025 terminating antitrust immunity for Delta-Aeromexico joint cooperation agreement; ordered wind-down by Jan 1, 2026. ' +
        'Delta and Aeromexico filed petition for judicial review at 11th Circuit. Court granted stay Nov 12, 2025; operations continue under appeal.',
      severity: 'medium',
      likelihood: 'medium',
      impact:
        'US-Mexico JV economics at risk. Delta owns ~19% Grupo Aeromexico equity. ' +
        'Latin America segment is ~6% of passenger revenue — material but not core.',
      mitigation:
        'Appeal pending; Court stay extends operational status quo. Mexico capacity already redirected after Q1 2026 civil unrest in leisure destinations. LATAM JV (Delta owns ~11%) provides South America coverage independent of Mexico exposure.',
      owner: 'Peter W. Carter (President, prev. Chief External Affairs Officer)',
    },
    {
      id: 'cyber-it-resilience',
      category: 'Technology',
      title: 'Cybersecurity & IT Infrastructure Resilience',
      description:
        'AI-enabled cyberattack risk increasing. CrowdStrike outage July 2024 caused ~$380M revenue impact + ~$170M expense impact + ~7,000 cancellations over 5 days — vendor-side IT outage rather than direct cyber breach but illustrative of dependency risk.',
      severity: 'high',
      likelihood: 'medium',
      impact:
        'Major IT incident could disrupt operations for days. Potential customer-data exposure liability. ' +
        '$84.4B asset base + $9.3B loyalty deferred revenue + customer trust at stake.',
      mitigation:
        'NIST + ISO 27001 frameworks. TSA-approved cybersecurity implementation plan. Audit Committee twice-yearly oversight. ' +
        'AWS cloud migration mostly complete (resilience benefit). New CDTO Amala Duggirala leading post-Samant retirement.',
      owner: 'Amala Duggirala (Chief Digital & Technology Officer, eff. 2026)',
    },
    {
      id: 'climate-saf-mandates',
      category: 'Regulatory / Environmental',
      title: 'Climate Regulation & SAF Mandate Cost Ramp',
      description:
        'EU SAF mandate active 2025 (2% rising to 70% by 2050); UK adopted 2024. CORSIA Phase 1 (2024-2026) compliance costs ramping (~$1.7B industry cost in 2026 per IATA). ' +
        'Currently available SAF supply doesn\'t meet even one week of global airline demand.',
      severity: 'medium',
      likelihood: 'high',
      impact:
        'SAF prices remain 2-4x conventional jet fuel. Industry SAF cost projected $4.5B in 2026. ' +
        'PFAS regulation (CERCLA hazardous substance) requires fire-suppression transition at maintenance hangars.',
      mitigation:
        'Net-zero 2050 strategy with three pillars (What We Fly, How We Fly, Fuel We Use). ' +
        'Active SAF advocacy at state/federal/international levels. Partnerships with JetZero, Maeve, Joby for revolutionary aircraft. ' +
        'Monroe refinery sustainability ambitions and SAF expertise sharing.',
      owner: 'Peter W. Carter (President — sustainability portfolio)',
    },
  ],

  // Labels use the same "Q# FY##" and "FY##" format as the DB (seed 06-strategic.ts).
  // Periods already in the DB (Q2 FY26, FY26) are present here for reference;
  // getStrategic merges these with DB values and appends any periods not yet in DB.
  forwardOutlook: [
    {
      period: 'Q2 FY26',
      revenueForcast: 17.50,           // [CITED:Press-Q1-26] "low-teens YoY" on Q2 FY25 $16.648B
      revenuePlan: 17.50,
      marginForecast: 7.0,             // midpoint of 6-8% guidance (April 8, 2026)
      marginPlan: 7.0,
      keyAssumptions: [
        'Total revenue YoY growth low-teens on flat capacity',
        'Operating margin 6-8% (April 8, 2026 guidance)',
        'Diluted EPS $1.00-$1.50; pre-tax profit ~$1B',
        'All-in fuel ~$4.30/gal including ~$300M Monroe refinery benefit',
        'Non-fuel CASM growth similar to Q1 (~6%)',
        'Fuel-recapture target 40-50% of >$2B Q2 incremental headwind',
      ],
    },
    {
      period: 'Q3 FY26',
      revenueForcast: 18.20,           // [INTERPOLATED] summer peak; low-teens YoY on Q3 FY25 $16.673B
      revenuePlan: 18.00,
      marginForecast: 11.0,            // [INTERPOLATED] typical Q3 seasonal strength + fuel-cost recovery
      marginPlan: 12.0,
      keyAssumptions: [
        'Summer peak historically Delta\'s strongest operating quarter',
        'Improved fuel-recapture as bookings roll at higher fares',
        'Atlantic JV peak summer season; premium cabin leadership maintained',
        '"Higher percent recapture as we move into summer" — CEO, April 8 call',
        'Operational reliability improving through summer per management guidance',
        'Capacity re-set for summer based on May–June fuel signals',
      ],
    },
    {
      period: 'Q4 FY26',
      revenueForcast: 17.80,           // [INTERPOLATED] holiday travel + refinery winter premium
      revenuePlan: 17.50,
      marginForecast: 10.5,            // [INTERPOLATED]
      marginPlan: 11.0,
      keyAssumptions: [
        'Holiday travel demand and corporate year-end activity support strong Q4',
        'OneDelta $500M annualized productivity run-rate target due Q3 — Q4 benefits',
        'Gross leverage target 2.0x by year-end; debt repayment a Q4 priority',
        'AmEx remuneration accelerating toward $9B+ run-rate',
        'Pilot contract becomes amendable Dec 31, 2026 — labor relations a key watch',
        'TechOps ATL engine-shop expansion commissioning in Q4',
      ],
    },
    {
      period: 'FY26',
      revenueForcast: 67.0,            // [CITED:JPM-2026] analyst consensus ~$68B; management trajectory
      revenuePlan: 68.0,
      marginForecast: 9.5,             // [INTERPOLATED]
      marginPlan: 10.5,                // pre-fuel-spike Jan 13, 2026 guidance implied higher margin
      keyAssumptions: [
        'EPS guidance $6.50–$7.50 (Jan 13, 2026; not updated post-fuel spike)',
        'Mid-point implies ~20% growth per JPM Value Creation Framework',
        'Free cash flow target $3–4B (3–5 yr range: $3–5B)',
        'TechOps MRO $1.2B+ (>50% growth vs $822M FY25)',
        'AmEx remuneration on track for $9B+ toward $10B target',
        'Long-term operating margin target: mid-teens; ROIC target: 15%+',
      ],
    },
    {
      period: 'Q1 FY27',
      revenueForcast: 16.50,           // [INTERPOLATED] +4% YoY on Q1 FY26 $15.854B GAAP
      revenuePlan: 16.00,
      marginForecast: 8.0,             // [ASSUMED] Q1 seasonally weakest; labor contract a 2027 variable
      marginPlan: 8.5,
      keyAssumptions: [
        'Premium and corporate travel sustain mid-single-digit revenue growth',
        'Pilot contract renewal (ALPA amendable Dec 31, 2026) is primary labor-cost risk',
        'AmEx $10B remuneration target within reach; FY27 contract-renewal cycle',
        'TechOps MRO on trajectory toward $5B long-term run-rate',
        'Fuel assumed normalization to ~$3.00/gal vs elevated FY26 levels',
        'Gross leverage target 1.5x by end of FY27',
      ],
    },
    {
      period: 'Q2 FY27',
      revenueForcast: 19.00,           // [INTERPOLATED] +14% YoY on Q2 FY26 $16.648B base
      revenuePlan: 18.80,
      marginForecast: 13.0,            // [ASSUMED] mid-teens margin trajectory materializing
      marginPlan: 13.5,
      keyAssumptions: [
        'Summer 2027 peak with normalized fuel a significant tailwind to margins',
        'Premium seat mix approaching 40% target — structural margin expansion',
        'Atlantic JV densification and new summer 2027 route portfolio',
        'OneDelta full-year productivity benefit embedded in cost base',
        'Delta One Lounge Atlanta and Seattle openings drive premium positioning',
        'ROIC approaching 15% JPM Value Creation Framework target',
      ],
    },
  ],

  keyOpportunities: [
    {
      title: 'AmEx Remuneration Growth to $10B',
      revenueImpact: '+$1.8B',
      description:
        'AmEx co-brand remuneration $8.2B FY 2025 (+11% YoY). Long-term target $10B "over the next few years" per 10-K. ' +
        'Cardholder spend +12% in Q1 2026; double-digit acquisition continuing. Highest-margin recurring revenue stream.',
      timeline: 'FY 2026-FY 2028',
    },
    {
      title: 'Delta TechOps MRO Scale to $2B+',
      revenueImpact: '+$1.2B',
      description:
        'FY 2025 MRO $822M (+25%) → FY 2026 outlook $1.2B (>50% growth) → multi-year target >2x base. ' +
        'Operating margin expanding from high-single-digit to mid-teens. LEAP-1A/B engine work + airframe checks. ' +
        'First North American airline MRO with full LEAP-1A and LEAP-1B overhaul capability.',
      timeline: 'FY 2026-FY 2030',
    },
    {
      title: 'Premium Cabin Mix Expansion',
      revenueImpact: '+$3.5B',
      description:
        'Premium product revenue $22.1B FY 2025 (+7%) closing in on Main Cabin parity ($23.4B). ' +
        'Fleet renewal increases premium seat share from ~30% (retiring) to ~50% (new aircraft). ' +
        'Q1 2026 premium +14% vs main cabin +1% — structural mix shift accelerating.',
      timeline: 'FY 2026-FY 2029',
    },
    {
      title: 'Industry Consolidation Upside',
      revenueImpact: 'Variable',
      description:
        'CEO framing: "high fuel forces unprofitable competitors into rationalization, consolidation, or exit." ' +
        '2008-11 fuel-driven cycle produced Delta-Northwest. Q1 2026 industry profit concentration: Delta >55% of US industry pre-tax profit. ' +
        'AAL+UAL+LUV combined free cash flow <$0B in 2025 vs Delta $4.6B alone.',
      timeline: 'FY 2026-FY 2028',
    },
    {
      title: 'International Network Expansion',
      revenueImpact: '+$1.5B',
      description:
        'New May 2026 Atlantic routes (BOS-MAD, BOS-NCE, JFK-OPO, JFK-OLB). New 2025 SLC-ICN with Korean Air. ' +
        'Pacific +10% in 2025; Atlantic premium-led growth via Air France-KLM-Virgin Atlantic JV. ' +
        'A350-1000 deliveries (first US airline) enable longer-haul thinner premium routes.',
      timeline: 'FY 2026-FY 2030',
    },
  ],
};
