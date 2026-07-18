// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/hypotheses.ts
//
// Hypotheses are analytical questions framed against Becton, Dickinson and Company's
// actual business model. Statistical results are estimated for demonstration.
// ─────────────────────────────────────────────────────────────────────
import { HypothesesConfig } from '../../types';

export const hypotheses: HypothesesConfig = {
  hypotheses: [
    {
      id: 1,
      title: 'Medical Benefit Ratio is the Primary Predictor of HCB Segment EPS Contribution',
      hypothesis:
        'A 100bps improvement in the Medical Benefit Ratio (MBR) is associated with a ≥$0.60/share improvement in annual EPS, holding membership and premium rates constant.',
      result: 'supported',
      pValue: 0.001,
      effectSize: 'Q1 2026 MBR 84.6% vs 87.3% Q1 2025: −270bps → +$1.05B AOI improvement ($3.04B vs $1.99B)',
      details:
        'Regression of Aetna HCB AOI on MBR across quarterly periods confirms a statistically significant inverse relationship. At $142B+ HCB annual revenues, each 100bps of MBR improvement ≈ $1.42B pre-tax AOI improvement → ~$0.83/share EPS (at ~25% tax rate and ~1.0B diluted shares). The Q1 2026 270bps MBR improvement vs Q1 2025 is consistent with this: actual AOI improvement was $1.05B on $36B revenue, implying a ~3% MBR delta → $1.08B, which aligns. The full-year MBR guidance of 90.5% ±50bps reflects management\'s prudent view that Q1 favorable prior year development does not persist at the same rate for the full year.',
      confidence: 99.9,
    },
    {
      id: 2,
      title: 'Biosimilar Conversion Rate Leads Caremark AOI Margin Improvement by 1–2 Quarters',
      hypothesis:
        'A 10-percentage-point increase in biosimilar conversion rate (Humira, Stelara) is associated with a ≥$300M improvement in Health Services annual adjusted operating income within 1–2 quarters of the conversion achieving scale.',
      result: 'supported',
      pValue: 0.012,
      effectSize: 'Humira >90% conversion achieved — Caremark AOI margin benefit observable in specialty cost trends',
      details:
        'Analysis of Caremark specialty pharmacy cost trend data following Humira biosimilar formulary actions confirms a 1–2 quarter lag between conversion achieving scale (>70%) and meaningful AOI improvement recognition in Health Services segment. The delay reflects: (1) contract timing for client price adjustments, (2) manufacturer rebate settlement cycles, (3) patient prior authorization completion timelines. Humira conversion >90% validates the causal mechanism. Stelara exclusion effective July 1, 2026 — benefits expected in Q3–Q4 2026 financial results. The ~$300M+ per 10ppt conversion estimate is based on Stelara estimated annual spend at current brand pricing vs biosimilar discount rates.',
      confidence: 98.8,
    },
    {
      id: 3,
      title: 'Prior Authorization Approval Speed is Inversely Correlated with Medical Cost Trend',
      hypothesis:
        'Aetna\'s industry-leading prior authorization approval speed (>95% within 24 hours) is associated with statistically lower unnecessary utilization rates and therefore a lower underlying medical cost trend vs peers.',
      result: 'partially-supported',
      pValue: 0.048,
      effectSize: 'Directional support: Aetna MBR improvement while industry peers face similar cost pressure; PA efficiency a contributing factor',
      details:
        'Cross-sectional comparison of Aetna prior authorization approval rates vs peer managed care plans and corresponding medical cost trends shows a directional negative correlation between PA approval speed and cost trend. The intuition: faster PA (>95% within 24h, >80% real-time) reduces delays in care delivery, reduces duplicate requests, and reduces administrative friction that can incentivize higher-cost care pathways. Aetna also benefits from integrated medical/pharmacy decision-making that peers lack. However, causal identification is difficult — faster PA also reflects lower PA volume overall (Aetna has fewest medical services subject to PA in the industry), which itself is a driver of lower administrative cost burden. Both effects are real and contribute to the MBR improvement narrative.',
      confidence: 95.2,
    },
    {
      id: 4,
      title: 'TrueCost Net-Cost PBM Pricing is Associated with Higher Client Retention Rates',
      hypothesis:
        'Caremark clients on the TrueCost net-cost pricing model exhibit statistically higher contract renewal rates than clients on traditional gross-to-net rebate models, holding book size constant.',
      result: 'supported',
      pValue: 0.021,
      effectSize: 'Caremark maintained ≥$7.25B FY2026 HSS AOI guidance despite pharmacy client price improvements — client base stable',
      details:
        'Analysis of Caremark client retention cohorts pre- and post-TrueCost launch (2+ years ago) shows improved retention among clients who transitioned to net-cost economics. The hypothesis is consistent with the earnings call Q&A: management indicates clients are actively asking for more transparency and the TrueCost model is resonating. The CAA federal regulations and FTC settlement direction reinforce net-cost model as regulatory tailwind. Higher client retention reduces the rebate guarantee headwind that is currently creating HSS AOI pressure — over time, the transition to TrueCost should stabilize the AOI base as gross-to-net timing differences normalize. Q1 2026 timing pull-forward from Q2 also confirms the structural mechanics are working as expected.',
      confidence: 97.9,
    },
    {
      id: 5,
      title: 'Oak Street Health Value-Based Care Reduces Total Cost of Care vs Fee-for-Service',
      hypothesis:
        'Medicare Advantage members receiving primary care through Oak Street Health clinics have a statistically lower total cost of care (including hospitalization rates) than comparable members receiving traditional fee-for-service primary care.',
      result: 'supported',
      pValue: 0.008,
      effectSize: 'Oak Street clinical-led model driving V28 adoption on track; total revenues +15% YoY while maintaining clinical outcomes focus',
      details:
        'Value-based care literature and Oak Street Health internal outcomes data support the hypothesis that patient engagement-focused primary care with aligned financial incentives reduces unnecessary hospitalization and emergency department utilization. Oak Street\'s model: panel physicians with manageable patient loads, proactive chronic disease management, strong relationship with payer (Aetna integration). V28 risk model adoption on track per management commentary. The 15% revenue growth at Oak Street reflects both clinic expansion and improving per-member economics as the model matures. Management is disciplined on growth — "right membership, disciplined growth" is the Oak Street operating philosophy — which suggests they are not sacrificing clinical model for volume.',
      confidence: 99.2,
    },
  ],
};
