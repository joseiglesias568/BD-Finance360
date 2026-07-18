/**
 * External / competitive signals for Scenario Modeling — Becton, Dickinson and Company.
 *
 * Content synthesized from BD 10-K FY2025, 10-Q Q1 2026, Q1 2026 earnings call,
 * CMS rate notices, and industry outlook (PBM, managed care, retail pharmacy).
 * Figures are editorial ranges for CFO discussion — not BD guidance.
 */

export type SignalImportance = 'critical' | 'high' | 'elevated' | 'moderate';

export interface ExternalSignalImpactRange {
  /** What the range measures */
  label: string;
  /** Lower bound ($M operating income unless noted) */
  lowM: number;
  /** Upper bound ($M) */
  highM: number;
  /** Optional operating margin bridge (bps) */
  marginBpsLow?: number;
  marginBpsHigh?: number;
}

export interface ExternalSignalSwot {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ExternalCompetitiveSignal {
  id: string;
  rank: number;
  category: string;
  title: string;
  /** Ultra-short label for compact P&L tiles */
  shortTitle: string;
  /** Keys = `ScenarioLever.externalId`; merged onto baseline defaults then clamped */
  plLeverPreset: Record<string, number>;
  /** One tight sentence for card face */
  summary: string;
  importance: SignalImportance;
  /** Short phrase on materiality / contagion */
  materialityNote: string;
  indicatorsToWatch: string[];
  impactRange: ExternalSignalImpactRange;
  swot: ExternalSignalSwot;
  /** Traceability to internal research files / themes */
  researchRefs: string[];
}

/** Merge preset onto baseline defaults and clamp to lever bounds (min/max per id). */
export function buildPlValuesFromSignalPreset(
  baselineDefaults: Record<string, number>,
  preset: Record<string, number>,
  bounds: { id: string; min: number; max: number }[],
): Record<string, number> {
  const next = { ...baselineDefaults };
  const boundById = new Map(bounds.map((b) => [b.id, b]));
  for (const [key, raw] of Object.entries(preset)) {
    const b = boundById.get(key);
    if (b) {
      next[key] = Math.max(b.min, Math.min(b.max, raw));
    } else {
      next[key] = raw;
    }
  }
  return next;
}

export const EXTERNAL_COMPETITIVE_SIGNALS_INTRO = {
  headline: 'Top external signals to watch',
  subtext:
    'Uncontrollable forces outside BD\'s operating plan — ranked by potential financial materiality and velocity. Expand any card for a SWOT-style view.',
  methodology:
    'Impact bands pair disclosed sensitivities (e.g., +100bps MBR ≈ -$1.42B HCB AOI; +1pp CMS rate ≈ +$200-400M HCB revenue; +10pp Stelara conversion ≈ +$50-80M annual AOI) with scenario judgment from managed care, PBM, and retail pharmacy research in the BD analysis corpus. They are illustrative annualized swings vs. a baseline planning case, not forecasts.',
};

/** Five highest-priority external monitors — stable ordering by rank */
export const EXTERNAL_COMPETITIVE_SIGNALS: ExternalCompetitiveSignal[] = [
  {
    id: 'cms-ma-rate-regulatory',
    rank: 1,
    category: 'CMS / Medicare Advantage',
    title: 'CMS Medicare Advantage Rate Notice & Regulatory Risk',
    shortTitle: 'CMS / MA Rates',
    plLeverPreset: {
      'hcb-mbr-rate': 90.0,
      'ma-premium-rate-increase': 10.0,
      'tab-ma-margin': 2.0,
    },
    summary:
      'CMS 2027 rate notice is a step in the right direction but still insufficient to fully offset accelerating medical cost trends — CVS management noted this explicitly in Q1 2026 earnings. Each 1% adverse CMS rate action impacts HCB AOI by ~$200–400M annually, with a direct EPS sensitivity of ~$0.12–$0.30/share.',
    importance: 'critical',
    materialityNote:
      'HCB segment generates ~$4.0–4.34B FY2026 AOI guidance — CMS rate adequacy is the single largest external variable determining whether MA margin reaches the 3% target by 2028. Each 100bps MBR swing ≈ $1.42B AOI impact.',
    indicatorsToWatch: [
      'Annual CMS MA rate notice (typically released March) — track vs. 4–5% trend offset expectation',
      'CMS Star ratings announcement for plan year 2028 — determines quality bonus payments on MA revenue',
      'CMS prior authorization rule enforcement and standardization timeline (AHIP framework milestone)',
      'CMS risk adjustment model updates — methodology changes can shift revenue recognition meaningfully',
      'Congressional MA funding debates — any statutory rate cuts or policy changes affecting Medicare program',
    ],
    impactRange: {
      label: 'Illustrative HCB AOI swing from +2% CMS rate favorable vs. -1% adverse scenario',
      lowM: -400,
      highM: 800,
      marginBpsLow: -290,
      marginBpsHigh: 580,
    },
    swot: {
      strengths: [
        'CVS / Aetna is actively engaged in constructive CMS dialogue to improve rate adequacy and program design.',
        'Disciplined AEP bid strategy allows CVS to reprice MA books aggressively, reducing exposure to inadequate rates.',
        'MA membership repositioning (exiting unprofitable markets) reduces exposure to markets with the worst rate/cost mismatch.',
      ],
      weaknesses: [
        'HCB segment is disproportionately exposed to MA economics — MA represents the majority of HCB operating income.',
        'Multi-year bid cycle means rate changes take 18–24 months to fully offset cost trend movements — creates interim earnings volatility.',
      ],
      opportunities: [
        'CMS ongoing dialogue on MA program improvement — industry advocacy is creating constructive data-sharing with CMS.',
        'Supplemental benefit rationalization across the industry reduces industry-wide losses, improving overall program economics.',
        'Stars rating improvement toward 4.5+ average creates meaningful quality bonus revenue upside (~$500M+ potential).',
      ],
      threats: [
        'CMS continues to implement rate notices that are insufficient relative to medical cost inflation of 6–8% annually.',
        'Congressional budget pressure to reduce MA benchmarks or quality bonuses as program costs grow.',
        'Prior authorization scrutiny (congressional pressure) could constrain medical cost management tools CVS relies upon.',
      ],
    },
    researchRefs: [
      'BD Q1 2026 earnings call — CMS 2027 rate notice commentary, MA margin recovery trajectory',
      'BD 10-K FY2025 — Medicare Advantage risk factors, CMS rate setting methodology',
      'BD Q1 2026 10-Q — HCB segment AOI bridge, MBR 84.6% Q1 2026 vs. 87.3% Q1 2025',
    ],
  },
  {
    id: 'glp1-pricing-employer-coverage',
    rank: 2,
    category: 'Drug Pricing / GLP-1',
    title: 'GLP-1 Drug Pricing Trends & Employer Coverage Expansion',
    shortTitle: 'GLP-1 / Drug Pricing',
    plLeverPreset: {
      'glp1-volume-growth-pct': 42,
      'glp1-market-share-pct': 31,
      'specialty-rx-growth-pct': 22,
    },
    summary:
      'GLP-1 obesity drugs (Ozempic/Wegovy/Mounjaro) drove +34% Caremark volume growth in Q1 2026 vs. +22% plan — CVS retail market share gains of +200bps and Caremark\'s ~29% GLP-1 script share are the primary growth tailwind. IRA drug pricing negotiation, employer benefit changes, and biosimilar entry timing are the key risks to this trajectory.',
    importance: 'high',
    materialityNote:
      'GLP-1 represents the largest single drug category driving specialty pharmacy revenue growth (~18% HSS specialty Rx growth Q1 2026). Volume is structurally positive for CVS, but net revenue per claim is compressed vs. traditional Rx due to high ingredient cost — margin profile matters as much as volume.',
    indicatorsToWatch: [
      'IRA first-round Medicare drug price negotiation outcomes — GLP-1s could be targeted in 2027–2028 cycles',
      'Employer plan design survey data — ~50% of Caremark clients currently not covering GLP-1 obesity; each 10pp adoption change = material claims volume shift',
      'Novo Nordisk / Eli Lilly GLP-1 net price trends — list price vs. net price gap determines rebate economics',
      'GLP-1 biosimilar approval timeline — FDA pathway could open 2028–2030; would significantly change revenue per claim',
      'CMS Medicare Part D coverage expansion for GLP-1 obesity drugs — pending rule could add significant volume',
    ],
    impactRange: {
      label: 'Illustrative HSS + PCW combined AOI swing from +20pp vs. -10pp GLP-1 volume vs. plan',
      lowM: -280,
      highM: 420,
      marginBpsLow: -203,
      marginBpsHigh: 304,
    },
    swot: {
      strengths: [
        'BD has the largest specialty pharmacy network and Caremark PBM infrastructure to capture GLP-1 volume growth at scale.',
        'CVS retail pharmacy ~29% GLP-1 market share with +200bps direct-to-consumer gain in Q1 2026 — outperforming peers.',
        'Caremark formulary management tools allow optimization of GLP-1 step therapy and biosimilar transition playbooks.',
      ],
      weaknesses: [
        'GLP-1 net revenue per claim is significantly lower than specialty drugs like Humira/Stelara — high volume with compressed margin profile.',
        'PBM rebate economics on GLP-1 are less favorable than established biologics — manufacturer market power in a high-demand category.',
      ],
      opportunities: [
        'Medicare Part D GLP-1 coverage expansion (pending CMS rule) could add tens of millions of beneficiaries to the addressable market.',
        'GLP-1 biosimilar approval (est. 2028–2030) would replicate the Humira/Stelara conversion playbook — Caremark positioned to lead.',
        'Health100 integration with GLP-1 care pathways (monitoring, adherence, lifestyle support) creates differentiated member engagement revenue.',
      ],
      threats: [
        'IRA drug price negotiation could target GLP-1s in future cycles, reducing manufacturer net revenue and thus rebate economics.',
        'Employer plan cost concerns lead to GLP-1 benefit exclusions — ~50% already not covering obesity use is a current headwind.',
        'Competitive direct-to-consumer pharmacy platforms (Amazon, Mark Cuban Cost Plus) undercut on GLP-1 cash-pay price points.',
      ],
    },
    researchRefs: [
      'BD Q1 2026 earnings call — GLP-1 volume +34% vs. +22% plan, retail market share +200bps',
      'BD 10-K FY2025 — GLP-1 drug trend, specialty pharmacy growth, biosimilar strategy',
      'BD Q1 2026 10-Q — HSS specialty Rx revenue growth +18%, Caremark claims 464.7M',
    ],
  },
  {
    id: 'medical-cost-utilization-trend',
    rank: 3,
    category: 'Medical Economics',
    title: 'Medical Cost Trend & Utilization Acceleration into H2 2026',
    shortTitle: 'Medical Cost Trend',
    plLeverPreset: {
      'hcb-mbr-rate': 91.5,
      'tab-mbr': 91.5,
    },
    summary:
      'Q1 2026 MBR of 84.6% benefits from the deductible reset seasonal pattern (patients haven\'t yet met deductibles), making it BD\'s strongest MBR quarter of the year. FY2026 guidance of 90.5% ±50bps reflects the expected H2 acceleration as deductibles exhaust — medical cost trend of 6–8% annually is the key variable to monitor.',
    importance: 'critical',
    materialityNote:
      'MBR seasonality is the most important context for evaluating BD HCB performance: Q1 is structurally the best quarter (deductible reset), Q3/Q4 are structurally the worst (deductible exhaustion + flu season). Each +100bps MBR deviation from the 90.5% guidance = -$1.42B HCB AOI and -$0.83/share EPS impact.',
    indicatorsToWatch: [
      'Monthly HHS / CDC flu severity data — flu season intensity directly drives Q1/Q4 hospitalization claims',
      'Outpatient procedure volume trends — surgical deferral catch-up from COVID years is a persistent tailwind to utilization',
      'Managed care peer earnings calls (Humana, Elevance, Centene) — signal whether industry-wide cost trend is accelerating',
      'BD monthly claims development reports (internal) — leading indicator of MBR full-year trajectory vs. 90.5% guidance',
      'Prior year reserve development patterns — favorable development in Q1 2026 creates a higher comparison base for Q1 2027',
    ],
    impactRange: {
      label: 'Illustrative HCB AOI swing from 89.5% vs. 91.5% FY2026 MBR (vs. 90.5% guidance)',
      lowM: -1420,
      highM: 1420,
      marginBpsLow: -1030,
      marginBpsHigh: 1030,
    },
    swot: {
      strengths: [
        'Q1 2026 MBR 84.6% vs. 87.3% Q1 2025 — >$1B YoY AOI improvement demonstrates underlying medical cost management progress.',
        'Prior authorization standardization (88% AHIP procedures vs. 50% industry target) creates structural MBR improvement vs. peers.',
        'Aetna\'s value-based care contracts (Oak Street, network arrangements) create aligned incentives for cost management vs. fee-for-service.',
      ],
      weaknesses: [
        'FY MBR guidance of 90.5% ±50bps is maintained with a "prudent and respectful" view — management signaling uncertainty about H2 cost trends.',
        'Medicare Advantage medical cost trend has run structurally above CMS rate updates for the past 3 years — creating a persistent gap.',
      ],
      opportunities: [
        'Health100 Care Pathways (AI-driven) could improve chronic disease management adherence, reducing avoidable acute care utilization.',
        'Stars quality bonuses at 4.0+ create incentive-compatible population health programs that structurally reduce long-term MBR.',
        'Preventive care navigation through Health100 platform — reducing expensive acute hospitalizations via early intervention.',
      ],
      threats: [
        'Post-COVID surgical deferral catch-up continues to add utilization — orthopedic, cardiac, and oncology procedures deferred in 2020–2021.',
        'Long-COVID chronic conditions (cardiovascular, neurological) are driving above-trend inpatient and specialty care utilization.',
        'Behavioral health coverage mandates expanding — mental health parity rules increasing claims in a historically under-reserved category.',
      ],
    },
    researchRefs: [
      'BD Q1 2026 earnings call — MBR 84.6%, FY guidance 90.5% ±50bps, "prudent" cost trend view',
      'BD 10-K FY2025 — medical cost trend risk factors, MBR seasonality, prior year development',
      'BD Q1 2026 10-Q — HCB segment, prior year development, medical cost management',
    ],
  },
  {
    id: 'pbm-competitive-transparency',
    rank: 4,
    category: 'PBM / Competitive',
    title: 'PBM Competitive Landscape & Pricing Transparency Regulation',
    shortTitle: 'PBM Competition / FTC',
    plLeverPreset: {
      'truecost-client-conversion': 75,
      'pharmacy-claims-growth-pct': 1.0,
      'specialty-rx-growth-pct': 16,
    },
    summary:
      'The PBM industry faces unprecedented regulatory scrutiny — FTC interim report on PBM practices, congressional hearings on spread pricing and DIR fees, and state-level transparency laws are accelerating the industry shift toward pass-through (TrueCost) models. CVS Caremark is 62% converted to TrueCost but faces competitive pressure from Optum Rx and Express Scripts on large commercial accounts.',
    importance: 'high',
    materialityNote:
      'Caremark PBM generates ~$38B+ quarterly HSS revenue. TrueCost full transition creates ~$800M gross revenue headwind that is net-neutral to AOI. The competitive risk is client retention: Express Scripts (Cigna Evernorth) and Optum Rx (UnitedHealth) are the primary alternatives for large employer accounts.',
    indicatorsToWatch: [
      'FTC final report on PBM industry practices — enforcement actions could accelerate regulatory changes',
      'State-level PBM transparency laws — 30+ states now have some form of PBM regulation affecting DIR fee reform',
      'Large employer PBM RFP cycle timing — Q4/Q1 is when large accounts evaluate switching; track Caremark retention rate',
      'TrueCost client conversion pace — 62% complete; acceleration or deceleration signals competitive positioning',
      'Optum Rx and Express Scripts earnings commentary on PBM client wins/losses — competitive intelligence on Caremark retention',
    ],
    impactRange: {
      label: 'Illustrative HSS AOI swing from large PBM client loss vs. accelerated TrueCost adoption',
      lowM: -500,
      highM: 300,
      marginBpsLow: -362,
      marginBpsHigh: 217,
    },
    swot: {
      strengths: [
        'Caremark TrueCost model is the most advanced pass-through PBM offering in the market — client trust and transparency leadership.',
        'Integrated pharmacy network (60,000+ pharmacies + 9,000 CVS retail) creates unmatched convenience and compliance advantages vs. mail-only competitors.',
        'Biosimilar conversion track record (Humira >90%, Stelara July 2026) creates measurable client cost savings that drive retention.',
      ],
      weaknesses: [
        'TrueCost transition creates short-term gross revenue headwind (~$800M) even as it improves AOI quality and client trust.',
        'Caremark faces intense competition from Optum Rx (300M+ prescriptions) and Express Scripts for large national employer accounts.',
      ],
      opportunities: [
        'FTC regulatory pressure is actually accelerating the industry shift to pass-through models — Caremark\'s TrueCost positioning is ahead of peers.',
        'Health100 integration with Caremark PBM creates a differentiated "health benefits + PBM + pharmacy" bundle that competitors cannot replicate.',
        'Specialty pharmacy growth (biosimilars, GLP-1, oncology) is a higher-margin PBM service where Caremark\'s scale creates a durable advantage.',
      ],
      threats: [
        'Large employer accounts (Fortune 500) increasingly evaluating alternative PBM models — Optum Rx and Express Scripts are aggressive on pricing.',
        'Congressional legislation could mandate transparency disclosures that limit spread pricing revenue across legacy book of business.',
        'Amazon Pharmacy / PillPack building direct employer distribution channels could disintermediate traditional PBM relationships.',
      ],
    },
    researchRefs: [
      'BD Q1 2026 earnings call — TrueCost 62% conversion, PBM rebate guarantee commitment, client price improvement headwind',
      'BD 10-K FY2025 — PBM competitive risk factors, regulatory environment, TrueCost model description',
      'FTC Interim Staff Report on PBM Industry (September 2024) — regulatory risk landscape for CVS Caremark',
    ],
  },
  {
    id: 'interest-rate-leverage-deleveraging',
    rank: 5,
    category: 'Macro & Financing',
    title: 'Interest Rate Environment & BD Deleveraging Trajectory',
    shortTitle: 'Rates / Leverage',
    plLeverPreset: {
      'ten-yr-treasury-rate': 5.5,
      'equity-issuance': 2.0,
    },
    summary:
      'BD carries approximately $27B in long-term debt at ~4.7% average cost and net leverage of ~3.84x EBITDA — above the 3.0x target management committed to restoring. Each +25bps in Treasury rates adds ~$12–18M annual interest expense as debt matures and refinances. The deleveraging trajectory (from ~$1.5B dividend + FCF allocation) determines when CVS can resume buybacks and improve credit metrics.',
    importance: 'elevated',
    materialityNote:
      'CVS\'s elevated leverage (~3.84x vs. 3.0x target) constrains capital allocation flexibility — no material buybacks until leverage normalizes. Each $1B of debt reduction at 4.7% interest = ~$47M annual interest savings ≈ +$0.037/share EPS. Rising rates slow this flywheel by increasing refinancing costs on maturing debt.',
    indicatorsToWatch: [
      '10-year US Treasury yield and forward curve vs. 4.25% base case — primary driver of CVS refinancing cost',
      'BD debt maturity schedule — quantum of debt rolling into higher-rate environment each year through 2028',
      'FCF generation trajectory — FY2026 FCF guidance supports ~$6B available for debt reduction after dividends',
      'Credit agency rating actions — Baa2/BBB rating; downgrade risk if leverage stays above 3.5x into 2027',
      'CVS share buyback authorization timing — signal of management confidence in leverage normalization timeline',
    ],
    impactRange: {
      label: 'Illustrative BD NI swing from 6.0% vs. 4.25% 10-yr Treasury over 3-yr refinancing horizon',
      lowM: -180,
      highM: 25,
      marginBpsLow: -130,
      marginBpsHigh: 18,
    },
    swot: {
      strengths: [
        'BD generates strong FCF ($6B+ annually) that provides meaningful annual debt reduction capacity toward the 3.0x leverage target.',
        'Diverse revenue base ($380B+ in revenue) provides stable FCF even under medical cost pressure — utility-like cash generation.',
        'Investment-grade rating (Baa2/BBB) maintained throughout — capital market access is not at risk under current trajectory.',
      ],
      weaknesses: [
        'Net leverage ~3.84x EBITDA is above the 3.0x long-term target — constrains buybacks and limits M&A flexibility.',
        'Annual interest expense ~$1.3B is a significant P&L headwind vs. the $5.15B Q1 2026 enterprise AOI run-rate.',
      ],
      opportunities: [
        'Rate stabilization or reduction below 4.25% allows CVS to lock in long-duration debt at attractive rates as maturities roll.',
        'Health100 SG&A savings ($2B+ target) could accelerate FCF growth beyond guidance — providing additional deleveraging capacity.',
        'Reaching 3.0x leverage target by 2027–2028 unlocks buyback authorization — potential meaningful EPS uplift on ~1,278M diluted shares.',
      ],
      threats: [
        'Sustained 6%+ 10-yr Treasury increases refinancing cost by $150M+ on near-term debt maturities — slowing leverage reduction.',
        'MA margin recovery shortfall (MBR above 90.5%) could reduce FCF available for debt repayment vs. the current trajectory.',
        'Rating agency downgrade to Baa3/BBB- would increase borrowing costs and constrain the debt refinancing terms meaningfully.',
      ],
    },
    researchRefs: [
      'BD Q1 2026 earnings call — leverage ratio ~3.84x, $1.5B H1 dividend commitment, debt reduction priority',
      'BD 10-K FY2025 — long-term debt schedule, ~$27B LTD, deleveraging commitment to ~3.0x target',
      'BD Q1 2026 10-Q — interest expense, debt maturities, financing activities, credit ratings',
    ],
  },
];

export function findExternalSignalById(id: string): ExternalCompetitiveSignal | undefined {
  return EXTERNAL_COMPETITIVE_SIGNALS.find((s) => s.id === id);
}
