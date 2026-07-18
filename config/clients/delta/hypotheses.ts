// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/hypotheses.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Hypotheses are illustrative analytical questions framed against Delta's
// actual business model. Numerical results (p-values, effect sizes,
// confidence intervals) are estimated for demonstration — they are NOT
// computed from Delta-disclosed data.
//
// DISCLAIMER
// Real hypothesis testing would run against transactional data in the
// platform. These seed hypotheses are scaffolding so the sandbox surface
// has plausible Delta-relevant content. Premise framing is grounded in
// Delta's disclosed strategy (premium mix, AmEx co-brand, fleet renewal,
// refinery hedge, MRO growth) but the statistical results are simulated.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { HypothesesConfig } from '../../types';

export const hypotheses: HypothesesConfig = {
  hypotheses: [
    {
      id: 1,
      title: 'Premium Cabin Mix Drives Unit Revenue Premium',
      hypothesis:
        'Routes flown with new aircraft (≥45% premium seats) produce sustained TRASM uplift versus equivalent routes flown with older aircraft (~30% premium seats), independent of yield management actions.',
      result: 'supported',
      pValue: 0.002,
      effectSize: '+1.4¢ TRASM uplift per route',
      details:
        'Cross-route analysis comparing identical city pairs across the fleet renewal program shows a statistically significant TRASM premium of approximately 1.4¢ for routes operated on next-generation aircraft. Effect persists after controlling for season, day-of-week, capacity adjustments, and competitor capacity. Premium products grew +14% in Q1 2026 versus +1% main cabin, consistent with the directional finding.',
      confidence: 99.6,
    },
    {
      id: 2,
      title: 'AmEx Card Spend Predicts Future Loyalty Travel',
      hypothesis:
        'Cardholders with double-digit annual spend growth on Delta-AmEx co-brand products are >2x more likely to redeem SkyMiles for paid travel within 12 months than the cardholder average.',
      result: 'supported',
      pValue: 0.001,
      effectSize: '2.3x redemption likelihood',
      details:
        'AmEx remuneration grew +11% to $8.2B in FY 2025 with double-digit spend growth on the cardholder portfolio. Cardholders in the top growth quartile show materially higher redemption rates. Approximately 12% of revenue passenger miles flown in 2025 were award redemptions (~35M tickets), and the high-spend cohort skews disproportionately to this volume.',
      confidence: 99.9,
    },
    {
      id: 3,
      title: 'Refinery Crack Spread Hedge Effectiveness',
      hypothesis:
        'During periods of jet-fuel price spikes (>20% sequential increase), Trainer refinery operating margin expansion offsets at least 30% of incremental airline-segment fuel cost.',
      result: 'inconclusive',
      pValue: 0.092,
      effectSize: 'Offset varies 15-45% by event',
      details:
        'Mixed evidence. Q2 2026 management guidance projects ~$300M refinery benefit against >$2B incremental fuel headwind (~15% offset). Historical events show offsets ranging 15-45% depending on crack spread dynamics and Monroe inventory positioning. Hypothesis is directionally supported but the 30% threshold is not statistically robust given the small number of comparable spike events in the historical sample.',
      confidence: 90.8,
    },
    {
      id: 4,
      title: 'Capacity Discipline Improves Margin in High-Fuel Quarters',
      hypothesis:
        'In quarters where capacity growth (ASMs) is held below industry average during fuel spikes, Delta achieves higher operating margin expansion than peer carriers maintaining capacity growth.',
      result: 'supported',
      pValue: 0.014,
      effectSize: '+150-250bps operating margin advantage',
      details:
        'Q1 2026 demonstrates the pattern: Delta capacity +1% versus rising fuel; 9.4% adjusted revenue growth on a 1% ASM increase implies ~8% unit revenue gain. Off-peak/red-eye trim playbook (15-20% less valuable than peak per CCO) consistently surfaces during fuel events. Peer comparison shows Delta and United exceeded 11% adjusted pre-tax margin in 2025 versus ~6% for American — discipline differential is meaningful.',
      confidence: 98.6,
    },
    {
      id: 5,
      title: 'MRO Engine Backlog Converts at Mid-Teens Operating Margin',
      hypothesis:
        'As Delta TechOps third-party MRO scales toward $1.2B FY 2026 revenue, operating margin converges to mid-teens, consistent with global engine MRO benchmarks.',
      result: 'supported',
      pValue: 0.021,
      effectSize: '+800-1000bps margin expansion at scale',
      details:
        'FY 2025 MRO revenue $822M (+25% YoY) at high-single-digit operating margin per Dec quarter supplemental. Heavier work scopes (LEAP-1A/B engines, full overhaul capability) carry higher margin per engine-hour than airframe checks. Trajectory toward $1.2B FY 2026 (>50% growth) plus mix shift to engine work supports mid-teens long-term margin per management guidance. Effect is well-supported by the disclosed three-year revenue and margin trajectory.',
      confidence: 97.9,
    },
  ],
};
