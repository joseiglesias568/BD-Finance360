// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/hypotheses.ts
//
// Hypotheses are analytical questions framed against BD's actual business model.
// Statistical results are estimated for demonstration.
// ─────────────────────────────────────────────────────────────────────
import { HypothesesConfig } from '../../types';

export const hypotheses: HypothesesConfig = {
  hypotheses: [
    {
      id: 1,
      title: 'Alaris Return Drives MMS Share Gains in Q3 FY26',
      hypothesis:
        'Completion of BD Alaris customer site remediation is associated with a statistically ' +
        'significant acceleration in Medication Management Solutions (MMS) organic revenue growth ' +
        'within 1–2 quarters of full commercial return, exceeding the +5% FXN target.',
      result: 'partially-supported',
      pValue: 0.038,
      effectSize:
        'Q2 FY26 Connected Care +3.2% FXN (below 5% target) with 78% remediation complete; ' +
        'each incremental 10% remediation completion ≈ +0.25% FXN Connected Care growth',
      details:
        'Analysis of BD Connected Care quarterly organic growth correlated with Alaris remediation ' +
        'completion milestones shows a lagged positive relationship. The causal mechanism: ' +
        '(1) hospital customers with remediated Alaris pumps resume ordering disposables and consumables; ' +
        '(2) new commercial discussions for next-generation Alaris platforms open; ' +
        '(3) installed base expansion accelerates as hospital IT integration completes. ' +
        'The 1–2 quarter lag reflects hospital procurement and integration timelines. ' +
        'Statistical confidence is moderate at p=0.038 given limited quarters of data post-remediation. ' +
        'The hypothesis is expected to gain statistical strength in Q3–Q4 FY26 as completion rate approaches 100%.',
      confidence: 96.2,
    },
    {
      id: 2,
      title: 'BioPharma Systems Growth Accelerates on GLP-1 Device Wins',
      hypothesis:
        'GLP-1 drug manufacturer device contract wins for prefillable syringes and autoinjectors ' +
        'are associated with a ≥3-percentage-point acceleration in BioPharma Systems organic revenue ' +
        'growth within 2–4 quarters of contract execution.',
      result: 'supported',
      pValue: 0.009,
      effectSize:
        'BioPharma Systems historical contract ramp data: each major pharma customer device contract ' +
        'contributes $150–250M in peak annual revenue; ramp occurs over 2–4 quarters post-contract',
      details:
        'Analysis of BD BioPharma Systems historical contract ramp patterns for major prefillable ' +
        'syringe and drug delivery system programs demonstrates a consistent 2–4 quarter lag between ' +
        'contract execution and meaningful revenue contribution. The dynamics: (1) device qualification ' +
        'and regulatory approval timelines typically 6–12 months; (2) initial production orders follow ' +
        'clinical and regulatory clearance; (3) commercial scale ramp occurs over subsequent 4–6 quarters. ' +
        'GLP-1 obesity drugs (Wegovy, Zepbound, Mounjaro) are experiencing unprecedented demand. ' +
        'Drug manufacturers are actively securing device supply chains. BD\'s scale advantage in ' +
        'prefillable syringes (multiple billion units annual capacity) positions it as a critical ' +
        'partner. The +3ppt growth acceleration estimate is based on $400–600M incremental revenue ' +
        'contribution vs current $2,324M BioPharma base — a 17–26% uplift over 3–5 years.',
      confidence: 99.1,
    },
    {
      id: 3,
      title: 'China VoBP Stabilizes by FY27',
      hypothesis:
        'China Volume-Based Procurement program headwinds stabilize at or below -8% FXN ' +
        'by FY2027 as new procurement cycles are priced with BD\'s updated product costs ' +
        'and BD\'s emerging markets offset strategy reaches critical mass.',
      result: 'partially-supported',
      pValue: 0.062,
      effectSize:
        'Directional: prior VoBP cycles in China medical devices have shown 12–18 month headwind ' +
        'periods followed by stabilization as new base prices are established',
      details:
        'Cross-sectional analysis of China medical device VoBP implementation patterns across ' +
        'affected companies (Medtronic, Abbott, BD) shows that the initial year of VoBP implementation ' +
        'creates the largest headwind as prices reset. Subsequent years show stabilization as ' +
        '(1) new product generations not yet subject to VoBP are launched; ' +
        '(2) manufacturers optimize cost structures for the VoBP price point; ' +
        '(3) private hospital and retail channels grow as an offset. ' +
        'BD\'s -14% FXN headwind in Q2 FY26 is near the high end of the initial-year impact range. ' +
        'Statistical confidence is limited at p=0.062 given policy uncertainty and BD-specific portfolio exposure. ' +
        'The FY27 stabilization thesis is supported by precedent but not guaranteed, particularly if ' +
        'VoBP is extended to additional product categories.',
      confidence: 93.8,
    },
    {
      id: 4,
      title: 'Operating Margin Reaches 25.5% by FY27 on BD Excellence',
      hypothesis:
        'BD Excellence $200M cost-out program, combined with revenue mix improvement toward ' +
        'higher-margin segments, is associated with adjusted operating margin reaching 25.5% ' +
        'by the end of FY2027, up from 24.2% in Q2 FY26.',
      result: 'supported',
      pValue: 0.015,
      effectSize:
        '$200M cost-out ÷ ~$19B revenues = ~105bps margin uplift; + mix improvement toward ' +
        'Interventional and BioPharma (est. 30%+ margins) adds ~40bps = ~145bps total = 25.5%+ target',
      details:
        'Multiple regression of BD adjusted operating margin against (1) BD Excellence cost savings ' +
        'run-rate, (2) Interventional revenue share, and (3) BioPharma Systems revenue share ' +
        'confirms the statistical significance of each driver. ' +
        'The $200M run-rate cost savings on a ~$19B revenue base provides ~105bps of gross margin uplift, ' +
        'partially reinvested into R&D (R&D target 6.0% from 5.8%), leaving ~75bps of net margin flow-through. ' +
        'Revenue mix improvement: Interventional growing ~6% FXN vs enterprise ~3% means Interventional ' +
        'share increases from 28.7% to ~30%+ over 2 years; BioPharma recovery adds further mix benefit. ' +
        'Combined, the model projects 25.0% FY26 → 25.5% FY27 → 26.0% FY28. ' +
        'Primary risks to the hypothesis: China VoBP escalation creating margin deleverage, ' +
        'and Alaris-related remediation costs exceeding accruals.',
      confidence: 98.5,
    },
    {
      id: 5,
      title: 'OTIF Service Level is Positively Correlated with IDN Contract Renewal Rates',
      hypothesis:
        'BD On-Time In-Full (OTIF) delivery service level above 92% is associated with ' +
        'statistically higher Integrated Delivery Network (IDN) contract renewal rates, ' +
        'holding product pricing and clinical outcomes constant.',
      result: 'supported',
      pValue: 0.004,
      effectSize:
        'BD OTIF at 93% (record high) — hospital supply chain departments report OTIF as ' +
        'top-3 vendor evaluation criterion; 1% OTIF improvement ≈ +0.5ppt IDN renewal rate',
      details:
        'Hospital supply chain benchmark data and BD CRM win/loss analysis confirm that ' +
        'OTIF performance is a top-3 criterion (alongside price and clinical outcomes) ' +
        'in IDN contract renewal and expansion decisions. ' +
        'For a company like BD with a very broad portfolio across all hospital departments, ' +
        'OTIF represents both a service quality metric and a strategic differentiator. ' +
        'The BD Excellence supply chain initiatives that brought OTIF to 93% (a record) ' +
        'provide a compounding competitive advantage: (1) direct renewal win-rate improvement; ' +
        '(2) cross-sell opportunities as hospital customers expand BD product categories; ' +
        '(3) pricing power maintenance as BD can justify premium vs lower-OTIF competitors. ' +
        'The statistical relationship is strong at p=0.004 across BD\'s IDN contract cohort analysis.',
      confidence: 99.6,
    },
  ],
};
