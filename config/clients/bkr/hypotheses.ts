// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/hypotheses.ts
//
// Hypotheses are analytical questions framed against Baker Hughes's actual
// business model. Statistical results are estimated for demonstration.
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { HypothesesConfig } from '../../types';

export const hypotheses: HypothesesConfig = {
  hypotheses: [
    {
      id: 1,
      title: 'IET Book-to-Bill Predicts Revenue Growth 4–6 Quarters Forward',
      hypothesis:
        'Quarters in which IET book-to-bill exceeds 1.3x are followed by IET revenue growth ≥12% YoY within 4–6 quarters, controlling for macroeconomic conditions.',
      result: 'supported',
      pValue: 0.004,
      effectSize: 'IET revenue growth +14.4% YoY in Q1 2026 following sustained book-to-bill >1.3x in 2024–2025',
      details:
        'Analysis of IET order intake vs subsequent revenue recognition confirms a strong leading relationship with a 4–6 quarter lag — consistent with the long-cycle nature of LNG equipment and gas turbine deliveries. Q1 2026 IET revenue +14.4% YoY ($3,350M) followed a period of strong 2024–2025 order intake. The IET RPO of $33.1B (record) provides extraordinary forward visibility: 58% recognized within 2 years. The relationship is strongest for GTE (gas turbomachinery) which has the longest lead times and clearest order-to-delivery cycle.',
      confidence: 99.6,
    },
    {
      id: 2,
      title: 'GTS Services Revenue Growth Accelerates as GTE Installed Base Compounds',
      hypothesis:
        'Each $1B increase in cumulative GTE (Gas Technology Equipment) installed base is associated with ≥$80M incremental annual GTS (Gas Technology Services) revenue within 24 months of equipment delivery.',
      result: 'supported',
      pValue: 0.002,
      effectSize: 'GTS revenue +34% YoY ($791M Q1 2026 vs $592M Q1 2025) on growing GTE fleet delivering LTSA revenue',
      details:
        'Gas Technology Services revenue growth significantly outpaced GTE growth in Q1 2026 (+34% vs +14%), consistent with the installed base flywheel: as more GTE trains are delivered and commissioned, long-term service agreements (LTSAs) generate high-margin recurring revenue. The GTS/GTE revenue ratio has improved from ~35% (2023) toward ~47% (Q1 2026), approaching the levels seen at more mature industrial equipment companies. Management commentary on "services becoming an increasingly larger portion of IET" is statistically supported. The hypothesis underpins BKR\'s Horizon 2 IET margin target (>21% EBITDA margin) — a higher services mix carries structurally better margins than equipment-only revenue.',
      confidence: 99.8,
    },
    {
      id: 3,
      title: 'OFSE Margin is More Sensitive to Volume Than Price',
      hypothesis:
        'A 10% decline in OFSE revenue driven by volume (rig count, activity levels) causes ≥2x greater OFSE EBITDA margin compression than a 10% revenue decline driven by pricing pressure alone.',
      result: 'supported',
      pValue: 0.018,
      effectSize: 'SPC divestiture volume reduction -$170M/quarter caused ~30bps OFSE margin pressure despite stable pricing',
      details:
        'OFSE cost structure is approximately 55–60% variable (field labor, materials, subcontractors) and 40–45% fixed (service centers, equipment maintenance, corporate). Volume declines from rig count drops or divestitures reduce revenue without proportional cost reduction, compressing margins. Pricing pressure (competitive discounting) is partially offset by material cost reduction. Q1 2026 evidence: SPC divestiture removed ~$170M revenue but only ~$50M EBITDA (EBITDA margin of removed business was lower than segment average), explaining most of the OFSE margin decline. This supports the strategic rationale for portfolio simplification — removing lower-margin businesses improves remaining OFSE margin even as total OFSE revenue declines.',
      confidence: 98.2,
    },
    {
      id: 4,
      title: 'International Rig Count is a Better Predictor of BKR OFSE Revenue Than Domestic Rig Count',
      hypothesis:
        'Changes in international rig count explain ≥2x more variance in quarterly BKR OFSE revenue than changes in North American rig count, reflecting BKR\'s 71% international revenue mix.',
      result: 'supported',
      pValue: 0.006,
      effectSize: 'International rig count +20% YoY vs NA -7% — OFSE international growth partially offsets NA softness (R² differential: 0.68 vs 0.31)',
      details:
        'Q1 2026 provides a natural experiment: international rig count +20% YoY (1,083 vs 903) while NA rig count -7% (749 vs 803). Net OFSE revenue was -7.5% YoY, driven primarily by the SPC divestiture (-$170M structural) and Middle East disruptions (-19% regional YoY), not by rig count changes per se. Regression analysis confirms international rig activity explains approximately 68% of OFSE international revenue variance (R²=0.68) while NA rig count explains only 31% of OFSE NA variance. This finding supports BKR\'s strategic emphasis on international OFSE and NOC relationships over NA E&P exposure — the international markets are larger, less volatile per barrel, and better correlated to BKR\'s actual revenue base.',
      confidence: 99.4,
    },
    {
      id: 5,
      title: 'CTS Data Center Orders Show Stronger Quarterly Persistence Than LNG Equipment Orders',
      hypothesis:
        'Quarterly CTS orders show lower quarter-to-quarter coefficient of variation than GTE orders, reflecting the more continuous nature of hyperscaler procurement vs lumpy LNG FID-driven equipment orders.',
      result: 'inconclusive',
      pValue: 0.072,
      effectSize: 'Limited data: CTS order history only 2–3 quarters with >$500M; GTE has multi-year history',
      details:
        'The hypothesis is directionally plausible — hyperscalers like Microsoft, Google, and Amazon are procuring aeroderivative turbines in a rolling fashion aligned to data center construction pipelines, while LNG equipment orders tend to cluster around FID events. However, Q1 2026 is the first quarter of truly transformative CTS order volumes ($1,257M vs $148M Q1 2025). There is insufficient history to robustly test quarterly persistence. Current data shows extreme Q1 2026 CTS concentration, which could reflect a one-time catch-up in hyperscaler procurement. Longer data windows (Q2–Q4 2026) are required to test whether CTS orders are genuinely persistent or lumpy. The aeroderivative supply constraint also introduces supply-side lumpiness that may dominate demand-side patterns.',
      confidence: 92.8,
    },
    {
      id: 6,
      title: 'Portfolio Simplification (Divestitures) Improves Remaining Business EBITDA Margin',
      hypothesis:
        'Each major divestiture of a non-core business at BKR is followed by an improvement in the remaining segment EBITDA margin within 2–4 quarters, as fixed costs are rationalized faster than revenue is lost.',
      result: 'supported',
      pValue: 0.009,
      effectSize: 'IET margin +310bps YoY Q1 2026 following IS divestiture (PSI→Crane); OFSE margin flat/down driven by SPC volume impact, partially offset by cost-out',
      details:
        'The 2024–2026 portfolio simplification program (PSI → Crane, SPC → Cactus JV, Waygate → Hexagon) demonstrates that businesses sold were below-average margin contributors. IET Industrial Solutions (PSI) carried margins well below GTE/GTS; its removal structurally improved IET margin even as total IET revenue declined slightly from the divestiture. OFSE SPC divestiture impact is more complex — SPC was lower-margin than OFSE average, but also had low fixed costs, so the margin impact is smaller and negative short-term. The overall portfolio simplification thesis is supported: remaining BKR is higher-quality earnings. The $3B+ in divestiture proceeds also directly funds Chart Industries acquisition, enabling the IET expansion strategy without increasing leverage beyond ~2.0x.',
      confidence: 99.1,
    },
  ],
};
