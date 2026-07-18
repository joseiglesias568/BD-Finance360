// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/alerts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// Alert thresholds calibrated against Becton, Dickinson and Company disclosed
// performance bands and FY2026 guidance ($7.30–$7.50 adj. EPS;
// MBR 90.5% ±50bps; HSS AOI ≥$7.25B; PCW AOI ≥$6.18B).
// ─────────────────────────────────────────────────────────────────────
import { AlertsConfig } from '../../types';

export const alerts: AlertsConfig = {
  templates: [
    // ═══════════════════════════════════════════
    // EPS & GUIDANCE
    // ═══════════════════════════════════════════
    {
      id: 'eps-guidance-risk',
      title: 'Quarterly Adj. EPS Below $1.83 Run-Rate (Guidance Floor Risk)',
      category: 'EPS & Guidance',
      threshold: 'Quarterly adj. EPS < $1.83 (annualizes to <$7.30, below FY2026 guidance floor)',
      parsedThreshold: 1.83,
      parsedUnit: '$ quarterly adj. EPS',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'Adj. EPS quarterly run-rate below $1.83 puts FY2026 guidance floor of $7.30 at risk. Q1 2026 actual $2.57 — strong start provides cushion given 60-40 H1/H2 seasonality, but H2 has lower weighting. Monitor MBR, HSS AOI timing adjustments, and PCW reimbursement pressure.',
      suggestedActions: [
        'Decompose by segment: HCB MBR trend vs 90.5% full-year guidance',
        'HSS: verify Q2 pull-forward reversal is within expected range',
        'PCW: check same-store Rx growth and reimbursement headwinds',
        'Review Stelara biosimilar conversion tracking vs July 1 target',
        'Assess whether MA medical cost trends are worsening beyond prior year development',
      ],
    },
    {
      id: 'eps-guidance-beat',
      title: 'Quarterly Adj. EPS Above $1.88 (Guidance Ceiling Beat)',
      category: 'EPS & Guidance',
      threshold: 'Quarterly adj. EPS > $1.88 (annualizes to >$7.50, above FY2026 guidance ceiling)',
      parsedThreshold: 1.88,
      parsedUnit: '$ quarterly adj. EPS',
      severity: 'info',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Exceeds',
      description: 'Adj. EPS run-rate above $1.88 puts FY2026 above $7.50 guidance ceiling. Prepare management communications on guidance raise. Note 60-40 H1/H2 seasonality — H1 run-rate alone should not trigger full-year raise without understanding H2 dynamics.',
      suggestedActions: [
        'Confirm beat is structural (MBR improvement, AOI) vs one-time prior year development',
        'Assess whether Stelara biosimilar conversion is ahead of schedule',
        'Prepare guidance revision analysis for CFO review — mid-teens EPS CAGR messaging',
        'Check HSS timing adjustments — is pull-forward sustainable or one-time',
        'Prepare next earnings call messaging on upside drivers',
      ],
    },

    // ═══════════════════════════════════════════
    // HEALTH CARE BENEFITS — MBR
    // ═══════════════════════════════════════════
    {
      id: 'mbr-deterioration',
      title: 'HCB Medical Benefit Ratio Above 91.0% (Guidance Upper Bound)',
      category: 'Health Care Benefits',
      threshold: 'Quarterly MBR > 91.0% (above 90.5% guidance +50bps tolerance)',
      parsedThreshold: 91.0,
      parsedUnit: '% MBR',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Exceeds',
      description: 'MBR above 91.0% breaches the upper bound of FY2026 guidance (90.5% ±50bps). Each 100bps MBR increase vs plan ≈ −$1.42B HCB AOI / −$0.83/share EPS impact. Q1 2026 benefited from favorable prior year development — full-year MBR maintained at 90.5%. Underlying medical cost trends remain above historical levels across the industry.',
      suggestedActions: [
        'Decompose MBR by government (MA, Medicaid) vs commercial business',
        'Assess whether prior year development reversal is driving Q2+ MBR normalization',
        'Review MA geographic mix — are unprofitable markets properly exited post-AEP?',
        'Check medical cost trend vs CMS rate adequacy for 2027 planning',
        'Evaluate prior authorization effectiveness — are PA approvals matching cost outcomes?',
      ],
    },
    {
      id: 'mbr-outperformance',
      title: 'HCB Medical Benefit Ratio Below 90.0% (Tracking Above Plan)',
      category: 'Health Care Benefits',
      threshold: 'Quarterly MBR < 90.0% (below 90.5% guidance, favorable outperformance)',
      parsedThreshold: 90.0,
      parsedUnit: '% MBR',
      severity: 'info',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'MBR below 90.0% suggests favorable medical cost trends or prior year development above expectations. Q1 2026: 84.6% — well below the full-year 90.5% guidance. Management maintaining prudent view — any single-quarter MBR outperformance should be verified before flowing into guidance upgrades.',
      suggestedActions: [
        'Confirm whether MBR beat is driven by prior year development (one-time) or underlying trend (structural)',
        'Assess pockets of outperformance across lines (commercial, MA, Medicaid)',
        'Evaluate if medical cost management improvements justify guidance range revision',
        'Monitor for adverse development reversal in subsequent quarters',
        'Prepare communications on MA margin recovery trajectory toward 3% by 2028',
      ],
    },
    {
      id: 'membership-decline',
      title: 'Medical Membership Below 25.5M (Below Guidance)',
      category: 'Health Care Benefits',
      threshold: 'Medical membership < 25.5M (below FY2026 guidance ~26.0M)',
      parsedThreshold: 25.5,
      parsedUnit: 'M medical members',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Falls below',
      description: 'Medical membership below 25.5M would be more than 500K below FY2026 guidance of ~26.0M. Each 0.5M member loss ≈ −$2.7B annual HCB revenue and −$225M AOI (at 8.4% margin). ACA individual exchange exit was intentional — any incremental decline beyond plan would be concerning.',
      suggestedActions: [
        'Identify which membership category is declining (MA, Medicaid, commercial)',
        'Assess commercial fee-based membership trends — is retention improving?',
        'Review AEP 2026 results — was membership decline larger than expected?',
        'Evaluate competitive dynamics vs UnitedHealth MA offerings in key markets',
        'Assess whether intentional market exits are performing as planned',
      ],
    },

    // ═══════════════════════════════════════════
    // HEALTH SERVICES — CAREMARK
    // ═══════════════════════════════════════════
    {
      id: 'hss-aoi-risk',
      title: 'HSS Quarterly AOI Below $1.81B (Below $7.25B Annual Run-Rate)',
      category: 'Health Services',
      threshold: 'HSS quarterly adj. operating income < $1.81B (annualizes to <$7.25B FY2026 guidance)',
      parsedThreshold: 1.81,
      parsedUnit: '$B quarterly HSS AOI',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'HSS AOI below $1.81B quarterly puts FY2026 guidance of ≥$7.25B at risk. Q1 2026 was $1.49B — below run-rate — but this reflected Q1 pull-forward from Q2 timing and pharmacy client price improvements. Ex-timing, Q1 beat expectations. Monitor Q2-Q4 trajectory carefully.',
      suggestedActions: [
        'Verify Q2 pull-forward reversal is accounted for in HSS AOI tracking',
        'Check pharmacy client price improvement (rebate guarantee) execution vs 2026 commitments',
        'Monitor Stelara biosimilar conversion rate — H2 benefit should support HSS AOI',
        'Review Oak Street Health performance vs expected growth trajectory',
        'Assess specialty pharmacy drug mix and purchasing economics trends',
      ],
    },
    {
      id: 'biosimilar-conversion-miss',
      title: 'Stelara Biosimilar Conversion Rate Below 75% (Below Plan)',
      category: 'Health Services',
      threshold: 'Stelara biosimilar conversion rate < 75% by Q3 2026',
      parsedThreshold: 75,
      parsedUnit: '% biosimilar conversion',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Falls below',
      description: 'Stelara biosimilar exclusion effective July 1, 2026. Target: ~85–90% conversion (replicating Humira). Below 75% conversion would underperform the Humira benchmark and reduce client savings and Caremark competitive value proposition. Each 10ppt conversion shortfall ≈ −$300-500M client savings at risk.',
      suggestedActions: [
        'Review patient-level conversion data by formulary tier and prescriber specialty',
        'Assess whether patient experience (frictionless OOP cost) is matching Humira model',
        'Check biosimilar manufacturer supply reliability — any availability issues?',
        'Evaluate prescriber education and clinical support programs',
        'Communicate conversion progress to employer clients at scheduled reviews',
      ],
    },
    {
      id: 'pharmacy-claims-shortfall',
      title: 'Pharmacy Claims Volume Below 460M (Quarterly Shortfall)',
      category: 'Health Services',
      threshold: 'Caremark quarterly pharmacy claims < 460M (implies FY below ≥1.84B guidance)',
      parsedThreshold: 460,
      parsedUnit: 'M quarterly pharmacy claims',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Falls below',
      description: 'Pharmacy claims below 460M quarterly would put FY2026 at risk of missing ≥1.84B guidance. Volume has been flat (~464M per quarter Q1 2025/Q1 2026). Note: revenue growth driven by mix, not volume — claims count is a volume-quality indicator, not a revenue driver at this level.',
      suggestedActions: [
        'Check for any client losses or book runoff in HSS PBM book',
        'Verify GLP-1 formulary management is not inadvertently suppressing claims volume',
        'Review new client wins for 2026 benefit year — are they ramping as expected?',
        'Assess mail-order and specialty pharmacy growth vs retail channel shifts',
      ],
    },

    // ═══════════════════════════════════════════
    // PHARMACY & CONSUMER WELLNESS
    // ═══════════════════════════════════════════
    {
      id: 'pcw-aoi-risk',
      title: 'PCW Quarterly AOI Below $1.55B (Below $6.18B Annual Run-Rate)',
      category: 'Pharmacy & Consumer Wellness',
      threshold: 'PCW quarterly adj. operating income < $1.55B (annualizes to <$6.18B guidance)',
      parsedThreshold: 1.55,
      parsedUnit: '$B quarterly PCW AOI',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'PCW AOI below $1.55B quarterly puts FY2026 guidance of ≥$6.18B at risk. Q1 2026 was $1.20B — impacted by weather/seasonal illness disruption and greater weather disruption. Q1 is typically a seasonally weaker quarter for PCW; underlying performance exceeded expectations in Q1 2026.',
      suggestedActions: [
        'Decompose PCW AOI: reimbursement pressure vs script volume vs front-store vs weather',
        'Verify same-store Rx growth is tracking toward 7%+ full-year target',
        'Check Rite Aid asset integration contribution vs expected ramp',
        'Assess CostVantage model performance — is cost-plus margin neutralizing branded drug headwind?',
        'Review GLP-1 DTC channel growth — is +200bps share gain maintaining?',
      ],
    },
    {
      id: 'rx-volume-shortfall',
      title: 'Same-Store Prescription Growth Below 5% (Tracking Below Target)',
      category: 'Pharmacy & Consumer Wellness',
      threshold: 'Same-store prescription volume growth < 5% (below 7% Q1 2026 run-rate)',
      parsedThreshold: 5.0,
      parsedUnit: '% same-store Rx growth',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Falls below',
      description: 'Same-store Rx growth below 5% would represent a deceleration from Q1 2026\'s +7% and indicate underlying weakness in PCW script volumes. Key watch: Rite Aid asset contribution lapping, GLP-1 DTC share, HealthHUB patient capture, and competitive dynamics vs Walgreens.',
      suggestedActions: [
        'Identify whether slowdown is market-wide (industry) or CVS-specific (share loss)',
        'Assess Walgreens restructuring impact — are CVS locations absorbing WBA runoff?',
        'Review HealthHUB and MinuteClinic prescription capture rates',
        'Check GLP-1 DTC market trends — any competitive entrant disrupting share gains?',
        'Monitor Rite Aid asset conversion performance vs expected contribution',
      ],
    },

    // ═══════════════════════════════════════════
    // BALANCE SHEET & CAPITAL
    // ═══════════════════════════════════════════
    {
      id: 'leverage-deterioration',
      title: 'Leverage Ratio Above 4.0x (Deteriorating from Q1 2026 Level)',
      category: 'Capital Structure',
      threshold: 'Net debt / EBITDA leverage ratio > 4.0x (above Q1 2026 3.84x level)',
      parsedThreshold: 4.0,
      parsedUnit: 'x net debt / EBITDA',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Exceeds',
      description: 'Leverage ratio above 4.0x would be a deterioration from Q1 2026 level of 3.84x and move further from BBB target. This would likely delay any capital return expansion (share repurchase) and may trigger negative credit watch. Share repurchase is already suspended — leverage deterioration would extend the timeline.',
      suggestedActions: [
        'Identify source of leverage increase: EBITDA decline or debt increase',
        'Review CFO trajectory — ≥$9.5B FY2026 guidance must be maintained for deleveraging',
        'Assess whether dividend coverage remains comfortable',
        'Review debt maturity schedule — any near-term refinancing at unfavorable rates?',
        'Communicate leverage trajectory to rating agencies proactively',
      ],
    },
    {
      id: 'cfo-shortfall',
      title: 'YTD Cash Flow from Operations Below $4.2B (Q1 2026 Level)',
      category: 'Capital Structure',
      threshold: 'YTD cash flow from operations below Q1 2026 actual $4.2B',
      parsedThreshold: 4.2,
      parsedUnit: '$B YTD CFO',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Falls below',
      description: 'CFO below $4.2B would be below Q1 2026 levels and put FY2026 ≥$9.5B guidance at risk. CFO improvement was driven primarily by working capital improvements per management commentary. Monitor accounts receivable and payable dynamics in pharmacy and insurance segments.',
      suggestedActions: [
        'Decompose CFO vs Q1 2026: AOI, working capital, taxes paid',
        'Verify insurance premium receivable collections are on track',
        'Check pharmacy rebate settlement timing — any delays affecting cash?',
        'Review capex planning — any unexpected spend reducing net free cash flow?',
        'Assess dividend coverage ratio vs $850M quarterly run-rate',
      ],
    },
  ],

  reports: [
    {
      id: 'weekly-enterprise',
      name: 'BD Weekly Enterprise Pulse',
      schedule: 'weekly',
      recipients: ['CFO', 'Segment Presidents', 'Finance Leadership'],
      sections: [
        'Enterprise AOI vs. run-rate ($15.53–$15.87B FY2026 guidance)',
        'HCB: MBR tracker vs. 90.5% guidance; membership trends',
        'HSS: pharmacy claims; biosimilar conversion (Stelara); rebate guarantee tracking',
        'PCW: same-store Rx growth; script share; reimbursement environment',
        'Cash flow from operations vs. ≥$9.5B FY2026 guidance',
        'Leverage ratio trend vs. BBB target',
      ],
    },
    {
      id: 'monthly-segment',
      name: 'Segment Performance Monthly Package',
      schedule: 'monthly',
      recipients: ['CFO', 'Segment FP&A'],
      sections: [
        'Health Care Benefits: MBR bridges, membership waterfall, MA margin trajectory',
        'Health Services: Caremark claims, drug trend, biosimilar conversion, Oak Street KPIs',
        'Pharmacy & Consumer Wellness: store-level Rx volumes, script share, PCW AOI bridge',
        'Enterprise: EPS bridge vs. FY2026 guidance, CFO reconciliation, leverage dashboard',
      ],
    },
  ],
};
