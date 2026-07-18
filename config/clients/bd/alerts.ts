// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/alerts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q2-26] [CITED:EC-Q2-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// Alert thresholds calibrated against BD FY2026 guidance ($12.52–$12.72 adj. EPS;
// ~25% adj. operating margin; $3.0B FCF; 2.5x net leverage target).
// ─────────────────────────────────────────────────────────────────────
import { AlertsConfig } from '../../types';

export const alerts: AlertsConfig = {
  templates: [
    // ═══════════════════════════════════════════
    // REVENUE PERFORMANCE
    // ═══════════════════════════════════════════
    {
      id: 'organic-growth-below-target',
      title: 'Organic Revenue Growth (FXN) Below 2.5% (Guidance Floor Risk)',
      category: 'Revenue Performance',
      threshold: 'Quarterly organic FXN growth < 2.5% (below FY2026 guidance floor)',
      parsedThreshold: 2.5,
      parsedUnit: '% organic FXN growth',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description:
        'Organic growth below 2.5% FXN puts FY2026 full-year guidance at risk. ' +
        'Q2 FY26 actual: +2.6% FXN. China VoBP headwind and BioPharma Systems destocking ' +
        'are the primary risk factors. Monitor Interventional momentum and Connected Care Alaris ramp.',
      suggestedActions: [
        'Decompose by segment: identify whether China VoBP or BioPharma destocking is worsening',
        'Check Interventional growth rate — decline from +5.3% FXN would be most concerning',
        'Review BD Alaris commercial return progress — is the revenue ramp tracking timeline?',
        'Assess China emerging markets offset performance vs plan',
        'Verify BioPharma Systems customer destocking is resolving as expected',
      ],
    },
    {
      id: 'organic-growth-above-guidance',
      title: 'Organic Revenue Growth (FXN) Above 3.5% (Guidance Ceiling Beat)',
      category: 'Revenue Performance',
      threshold: 'Quarterly organic FXN growth > 3.5% (above FY2026 guidance ceiling)',
      parsedThreshold: 3.5,
      parsedUnit: '% organic FXN growth',
      severity: 'info',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Exceeds',
      description:
        'Organic growth above 3.5% FXN would position FY2026 above guidance ceiling. ' +
        'Assess whether upside is structural (Alaris ramp acceleration, GLP-1 demand, ' +
        'Interventional market share gains) or temporal (distributor restocking). ' +
        'Prepare BD Excellence commercial execution messaging.',
      suggestedActions: [
        'Confirm whether BioPharma Systems destocking resolved ahead of schedule',
        'Assess Interventional and Connected Care for sustainable share gains',
        'Evaluate whether FY2026 guidance should be raised — prepare IR messaging',
        'Check GLP-1 delivery device orders — is BioPharma returning to growth?',
        'Review China trajectory — any acceleration in emerging markets offset?',
      ],
    },

    // ═══════════════════════════════════════════
    // ALARIS REMEDIATION
    // ═══════════════════════════════════════════
    {
      id: 'alaris-remediation-delay',
      title: 'BD Alaris Remediation Below 85% by Q3 FY26 (Delay Risk)',
      category: 'Alaris Remediation Progress',
      threshold: 'Customer site remediation completion < 85% by end of Q3 FY26',
      parsedThreshold: 85,
      parsedUnit: '% customer sites remediated',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Falls below',
      description:
        'BD Alaris remediation at 78% as of Q2 FY26. Target 100% by Q4 FY26. ' +
        'Falling below 85% by Q3 would indicate the timeline to full commercial return is slipping, ' +
        'directly impacting Connected Care revenue and the +5% FXN organic growth target. ' +
        'FDA consent decree compliance monitoring is tied to remediation milestones.',
      suggestedActions: [
        'Identify which hospital system customer sites are causing the delay',
        'Assess field service resource adequacy — deploy additional resources if needed',
        'Engage hospital system leadership for scheduling acceleration',
        'Review FDA milestone commitments — ensure consent decree compliance maintained',
        'Model Connected Care revenue impact of 1-quarter delay in full commercial return',
      ],
    },
    {
      id: 'alaris-remediation-ahead',
      title: 'BD Alaris Remediation Above 90% Before Q4 FY26 (Ahead of Schedule)',
      category: 'Alaris Remediation Progress',
      threshold: 'Customer site remediation completion > 90% before Q4 FY26 start',
      parsedThreshold: 90,
      parsedUnit: '% customer sites remediated',
      severity: 'info',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Exceeds',
      description:
        'Remediation above 90% before Q4 FY26 would pull forward Connected Care revenue ramp. ' +
        'Positive signal for H2 FY26 Connected Care growth acceleration and FY2027 run-rate.',
      suggestedActions: [
        'Communicate Alaris ramp acceleration to IR and BD analyst day messaging',
        'Model Connected Care revenue upside from earlier-than-planned commercial return',
        'Prepare commercial launch acceleration plan for remaining hospital customers',
        'Assess Alaris next-generation development timeline — can milestones be advanced?',
      ],
    },

    // ═══════════════════════════════════════════
    // CHINA VoBP IMPACT
    // ═══════════════════════════════════════════
    {
      id: 'china-vobp-worsening',
      title: 'China VoBP Headwind Worsening Beyond -14% FXN',
      category: 'China VoBP Impact',
      threshold: 'China revenue FXN decline worse than -14% (vs Q2 FY26 baseline)',
      parsedThreshold: -14,
      parsedUnit: '% China FXN growth',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Worsens below',
      description:
        'China VoBP headwind was -14% FXN in Q2 FY26. A worsening would indicate ' +
        'expansion of VoBP to additional product categories, threatening Medical Essentials ' +
        'and potentially Connected Care revenues. China is ~10-12% of BD revenue — ' +
        'further deterioration would impact FY2026 total company organic growth.',
      suggestedActions: [
        'Confirm whether new BD product categories are being added to VoBP procurement lists',
        'Engage BD Government Affairs China team for regulatory intelligence',
        'Accelerate emerging markets offset — India, Southeast Asia, LatAm pipeline review',
        'Assess private hospital China channel development for near-term contribution',
        'Review FY2026 guidance sensitivity — model -20% China FXN scenario',
      ],
    },
    {
      id: 'china-vobp-stabilizing',
      title: 'China VoBP Headwind Improving to -8% or Better',
      category: 'China VoBP Impact',
      threshold: 'China revenue FXN decline improves to -8% or better',
      parsedThreshold: -8,
      parsedUnit: '% China FXN growth',
      severity: 'info',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Improves above',
      description:
        'Improvement in China trajectory from -14% to -8% or better would indicate ' +
        'VoBP stabilization or private hospital channel gaining traction. ' +
        'Positive signal for FY2027 organic growth reacceleration.',
      suggestedActions: [
        'Identify the source of improvement: new product cycle, private hospital, or VoBP scope reduction',
        'Model the FY2027 China revenue recovery trajectory',
        'Communicate China stabilization progress to investors at next earnings event',
      ],
    },

    // ═══════════════════════════════════════════
    // MARGIN PERFORMANCE
    // ═══════════════════════════════════════════
    {
      id: 'adj-margin-below-target',
      title: 'Adjusted Operating Margin Below 23.5% (Guidance Floor Risk)',
      category: 'Margin Performance',
      threshold: 'Quarterly adj. operating margin < 23.5% (below ~25% FY2026 target)',
      parsedThreshold: 23.5,
      parsedUnit: '% adj. operating margin',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description:
        'Adjusted operating margin below 23.5% would put full-year FY2026 ~25% guidance at risk. ' +
        'Q2 FY26: 24.2%. Key watch: BD Excellence cost-out program achieving $200M run-rate, ' +
        'volume leverage from revenue growth, and FX headwinds on margin.',
      suggestedActions: [
        'Decompose margin shortfall: gross margin vs SG&A vs R&D vs other',
        'Assess BD Excellence cost-out program delivery — is $200M run-rate at risk?',
        'Check FX translation impact on cost structure vs revenue',
        'Review whether BioPharma Systems volume decline is creating deleverage',
        'Evaluate pricing realization across segments',
      ],
    },
    {
      id: 'adj-margin-outperformance',
      title: 'Adjusted Operating Margin Above 25.5% (Ahead of Target)',
      category: 'Margin Performance',
      threshold: 'Quarterly adj. operating margin > 25.5% (above FY2026 ~25% target)',
      parsedThreshold: 25.5,
      parsedUnit: '% adj. operating margin',
      severity: 'info',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Exceeds',
      description:
        'Margin above 25.5% indicates BD Excellence program is delivering ahead of plan. ' +
        'Assess whether this is sustained structural improvement or timing of cost savings. ' +
        'Prepare messaging on raised long-term margin target.',
      suggestedActions: [
        'Confirm BD Excellence cost-out program delivery is structural vs timing',
        'Assess revenue mix improvement contribution to margin (Interventional, BioPharma)',
        'Evaluate whether FY2027 25.5%+ margin target should be pulled forward',
        'Prepare CFO messaging on margin expansion trajectory',
      ],
    },

    // ═══════════════════════════════════════════
    // REGULATORY MILESTONE TRACKER
    // ═══════════════════════════════════════════
    {
      id: 'fda-warning-letter-new',
      title: 'New FDA Warning Letter Issued to BD',
      category: 'Regulatory Milestone Tracker',
      threshold: 'New FDA Warning Letter issued to any BD facility or product line',
      parsedThreshold: 3,
      parsedUnit: 'active Warning Letters',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Exceeds',
      description:
        'BD currently has 2 active Warning Letters (Dispensing, Specimen Management). ' +
        'A third Warning Letter would represent significant regulatory escalation, ' +
        'impacting commercial activities and investor confidence. ' +
        'Any new FDA enforcement action must be immediately escalated to senior leadership.',
      suggestedActions: [
        'Immediately assess scope of new Warning Letter and affected products',
        'Engage FDA Regulatory Affairs and Quality leadership for response strategy',
        'Assess revenue impact — quantify commercial restrictions',
        'Prepare investor disclosure if material',
        'Accelerate resolution timelines for all active Warning Letters',
      ],
    },
    {
      id: 'warning-letter-resolved',
      title: 'FDA Warning Letter Resolved (Regulatory Milestone)',
      category: 'Regulatory Milestone Tracker',
      threshold: 'FDA Warning Letter formally resolved (close-out letter received)',
      parsedThreshold: 1,
      parsedUnit: 'Warning Letters resolved',
      severity: 'info',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Exceeds',
      description:
        'Resolution of a Warning Letter is a significant positive regulatory milestone for BD. ' +
        'Full commercial freedom in the affected category is restored, ' +
        'enabling accelerated revenue growth and improved hospital customer relationships.',
      suggestedActions: [
        'Issue press release or investor communication on Warning Letter resolution',
        'Assess commercial opportunity unlocked — model revenue ramp in affected category',
        'Ensure quality systems sustain compliance to prevent recurrence',
        'Communicate milestone to BD Excellence quality team as validation of program',
      ],
    },

    // ═══════════════════════════════════════════
    // NET LEVERAGE
    // ═══════════════════════════════════════════
    {
      id: 'leverage-deteriorating',
      title: 'Net Leverage Above 3.0x (Deteriorating from Target Path)',
      category: 'Net Leverage vs 2.5x Target',
      threshold: 'Net debt / adjusted EBITDA leverage ratio > 3.0x',
      parsedThreshold: 3.0,
      parsedUnit: 'x net leverage',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Exceeds',
      description:
        'Net leverage above 3.0x would indicate a worsening from current 2.9x and delay ' +
        'the path to 2.5x target. This could delay ASR execution and capital return expansion. ' +
        'Investment-grade credit rating stability should be monitored carefully.',
      suggestedActions: [
        'Identify source of leverage increase: EBITDA decline or debt increase',
        'Review FCF trajectory — $3.0B FY2026 target must be maintained',
        'Assess debt maturity schedule for near-term refinancing requirements',
        'Communicate leverage trajectory to credit rating agencies proactively',
        'Evaluate whether ASR program should be paused to prioritize debt paydown',
      ],
    },
    {
      id: 'leverage-on-target',
      title: 'Net Leverage Reaches 2.5x Target Ahead of Schedule',
      category: 'Net Leverage vs 2.5x Target',
      threshold: 'Net debt / adjusted EBITDA leverage ratio ≤ 2.5x',
      parsedThreshold: 2.5,
      parsedUnit: 'x net leverage',
      severity: 'info',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Falls below',
      description:
        'Reaching 2.5x net leverage ahead of FY2027 target unlocks capital return ' +
        'framework expansion options including increased buybacks or tuck-in M&A. ' +
        'Prepare capital allocation strategy update for investor communications.',
      suggestedActions: [
        'Prepare capital allocation framework update — share repurchase acceleration or M&A evaluation',
        'Communicate leverage achievement to investors and credit rating agencies',
        'Model EPS accretion from incremental buyback at current share price',
        'Assess tuck-in acquisition pipeline in key growth categories (GLP-1, Interventional)',
      ],
    },

    // ═══════════════════════════════════════════
    // NEW PRODUCT LAUNCH REVENUE
    // ═══════════════════════════════════════════
    {
      id: 'new-product-revenue-below-target',
      title: 'New Product Revenue Below 16% of Total Revenue',
      category: 'New Product Launch Revenue',
      threshold: 'Revenue from products launched in last 3 years < 16% of total revenue',
      parsedThreshold: 16,
      parsedUnit: '% new product revenue',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Falls below',
      description:
        'New product revenue below 16% would indicate pipeline execution slowdown. ' +
        'Current: 18%, target >20%. Key new product contributors: GLP-1 delivery devices, ' +
        'HemoSphere next-gen, BD Alaris updated platform, Interventional new catheters.',
      suggestedActions: [
        'Review R&D pipeline milestone timeline — identify delays in new product launches',
        'Assess commercial launch effectiveness for recently launched products',
        'Evaluate GLP-1 device ramp timing vs forecast',
        'Check Interventional new product adoption rates at hospital customers',
      ],
    },
  ],

  reports: [
    {
      id: 'weekly-enterprise',
      name: 'BD Weekly Enterprise Performance Pulse',
      schedule: 'weekly',
      recipients: ['CFO', 'Segment Presidents', 'Finance Leadership'],
      sections: [
        'Organic revenue growth (FXN) vs. +2.5–3.5% FY2026 guidance',
        'BD Alaris remediation progress tracker: customer sites completed',
        'China VoBP headwind: weekly revenue impact by affected category',
        'Adjusted operating margin vs. ~25% FY2026 target',
        'Free cash flow YTD vs. $3.0B FY2026 target',
        'Net leverage trend vs. 2.5x target',
      ],
    },
    {
      id: 'monthly-segment',
      name: 'Segment Performance Monthly Package',
      schedule: 'monthly',
      recipients: ['CFO', 'Segment FP&A'],
      sections: [
        'Medical Essentials: MDS and Specimen Mgmt organic growth bridges; China VoBP impact',
        'Connected Care: Alaris commercial return progress; HemoSphere; Dispensing remediation',
        'BioPharma Systems: customer destocking status; GLP-1 order pipeline',
        'Interventional: PI, Surgery, UCC organic growth bridges; new product contribution',
        'Enterprise: adj. EPS bridge vs. $12.52–$12.72 FY2026 guidance; FCF reconciliation',
      ],
    },
  ],
};
