// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/hypotheses.ts
//
// Hypotheses are illustrative analytical questions framed against Verizon's
// actual business model. Statistical results are estimated for demonstration.
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { HypothesesConfig } from '../../types';

export const hypotheses: HypothesesConfig = {
  hypotheses: [
    {
      id: 1,
      title: 'C-Band Coverage Drives FWA Subscriber Retention',
      hypothesis:
        'Markets with ≥80% C-Band 5G coverage have materially lower FWA churn rates than markets with <60% C-Band coverage, independent of competitive cable broadband presence.',
      result: 'supported',
      pValue: 0.003,
      effectSize: '-28% relative FWA churn in high-C-Band markets',
      details:
        'Cross-market analysis of FWA subscriber cohorts shows significantly lower churn in C-Band-dense markets. The C-Band performance improvement (lower latency, higher throughput) directly addresses the primary FWA churn driver — customer perception that wireless internet is "not as reliable as cable." Effect is strongest in suburban markets where cable broadband is the primary alternative. Consistent with management commentary that C-Band quality is the key to expanding the FWA addressable market.',
      confidence: 99.7,
    },
    {
      id: 2,
      title: 'myPlan Adoption Reduces Postpaid Churn',
      hypothesis:
        'Postpaid customers on myPlan with ≥2 premium perks (Disney+, Apple One, etc.) have ≥40% lower voluntary churn than comparable customers on legacy unlimited plans.',
      result: 'supported',
      pValue: 0.001,
      effectSize: '-43% voluntary churn for myPlan multi-perk subscribers',
      details:
        'myPlan subscribers who activate 2+ perks create a sticky ecosystem — switching away from Verizon means losing access to bundled entertainment, cloud storage, or travel benefits. Analysis of switching patterns shows the perk-embedded cohort churns at ~0.50% monthly vs ~0.89% for the overall base. This supports the myPlan premium tier adoption strategy as both an ARPA driver and a churn mitigation tool. Management\'s target of 70% myPlan penetration by year-end 2026 appears supported by the retention economics.',
      confidence: 99.9,
    },
    {
      id: 3,
      title: 'Frontier Cross-Sell Rate Exceeds Legacy Fios Cross-Sell Baseline',
      hypothesis:
        'Frontier broadband customers offered Verizon wireless services will show a 12-month take rate at least 1.5x higher than the comparable take rate when Fios first launched in new markets.',
      result: 'inconclusive',
      pValue: 0.087,
      effectSize: '1.2x take rate premium — directionally positive but below 1.5x threshold',
      details:
        'Early data from post-Frontier close cross-sell campaigns (Q1–Q2 2026) shows a take rate premium vs legacy Fios launch baselines, driven by Frontier customer familiarity with Verizon brand and promotional offers. However, statistical confidence is limited by the small number of months since close and regional variation in execution. The 1.5x hypothesis threshold is not yet met at a statistically significant level. Longer data window (Q3–Q4 2026) needed to confirm.',
      confidence: 91.3,
    },
    {
      id: 4,
      title: 'AI Care Deflection Reduces Cost per Contact',
      hypothesis:
        'For every 10 percentage-point improvement in AI chatbot deflection rate (contacts handled without live agent), cost per care contact decreases by ≥15%.',
      result: 'supported',
      pValue: 0.008,
      effectSize: '-18% cost per care contact per 10 pts deflection improvement',
      details:
        'Internal cost-per-contact analysis from AI customer care pilot (2025–2026) shows a consistent relationship between deflection rate and unit cost. AI-handled contacts carry ~20% of the fully-loaded cost of live agent contacts. The Phase 1 deflection rate of ~20% has already produced measurable cost savings. Scale to 30–40% deflection (Phase 2 target) would deliver the majority of the $200M FY2026 AI savings target. Effect is strongest in billing inquiry and service troubleshooting categories.',
      confidence: 99.2,
    },
    {
      id: 5,
      title: 'Multi-Line Household Bundling Reduces ARPA Volatility',
      hypothesis:
        'Postpaid accounts with ≥4 lines show less ARPA volatility quarter-over-quarter than single-line or 2-line accounts, providing a more predictable wireless service revenue base.',
      result: 'supported',
      pValue: 0.004,
      effectSize: '-35% ARPA coefficient of variation for 4+ line accounts',
      details:
        'Multi-line household accounts (4+ lines) demonstrate materially lower ARPA volatility because: (1) household economics make switching multiple lines simultaneously costly; (2) multi-line accounts are more likely to be on myPlan with perk attachments; (3) family account managers are less price-sensitive than individual account holders. This hypothesis supports targeting household bundling promotions as a revenue stability strategy, particularly relevant in the face of T-Mobile competitive pricing pressure on single-line accounts.',
      confidence: 99.6,
    },
    {
      id: 6,
      title: 'Network Reliability NPS Premium vs Competitors',
      hypothesis:
        'In J.D. Power wireless satisfaction survey cohorts, customers who cite "network reliability" as their primary selection criterion are ≥3x more likely to remain a Verizon customer after a competitive solicitation than those who cite "price."',
      result: 'supported',
      pValue: 0.002,
      effectSize: '3.4x retention likelihood for reliability-motivated customers',
      details:
        'Survey-based analysis of Verizon postpaid customer switching decisions confirms that network reliability remains the single strongest predictor of customer loyalty. Reliability-driven customers are largely insulated from T-Mobile\'s Un-carrier pricing promotions. This finding supports Verizon\'s brand strategy of maintaining J.D. Power and RootMetrics quality leadership rather than competing primarily on price — protecting the premium ARPA positioning while accepting lower gross add volume than T-Mobile.',
      confidence: 99.8,
    },
  ],
};
