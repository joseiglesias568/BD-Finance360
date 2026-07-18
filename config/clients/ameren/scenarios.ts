// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/scenarios.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Becton, Dickinson and Company public disclosures: Form 10-K (FY2025); Form 10-Q
// (Q1 2026); Q1 2026 earnings call / IR slides (May 6, 2026); FY2026 guidance.
// Scenario levers cover the key CVS drivers: Medicare Advantage MBR, medical
// membership, GLP-1 cost trend, biosimilar conversion, PBM margin, interest rates,
// and Health100 platform adoption.
// Baseline = FY2026 management guidance midpoint ($7.40 adj. EPS).
// ─────────────────────────────────────────────────────────────────────
import { ScenarioConfig } from '../../types';

export const scenarios: ScenarioConfig = {
  // FY2026 full-year baseline based on management guidance midpoint
  baselineRevenue: 405.0,             // FY2026 guidance ≥$405B revenue [CITED:EC-Q1-26]
  baselineMargin: 3.8,                // FY2026 adj. net margin % ($7.40 EPS × ~1B shares / $405B) [DERIVED]

  levers: [
    // ─── Health Care Benefits (Aetna) ───
    {
      id: 'hcb-mbr',
      name: 'Health Care Benefits Medical Benefit Ratio (MBR)',
      category: 'Health Care Benefits (Aetna)',
      min: 88.0,
      max: 94.0,
      default: 90.5,                  // FY2026 MBR guidance midpoint [CITED:EC-Q1-26]
      step: 0.5,
      unit: '% MBR',
      description: 'Full-year MBR guidance 90.5% ±50bps. Q1 2026 MBR 84.6% benefited from prior year development and core outperformance; full-year maintained at 90.5%. Each +100bps MBR increase ≈ −$1.42B annual medical cost savings (1% × $142B HCB revenue) → −$0.83B AOI impact (pre-tax) → −$0.63/share EPS. Bear: 93%+ MBR if MA medical cost trends worsen further. Bull: 89% if prior year development persists.',
      impact: 'high',
    },
    {
      id: 'medical-membership',
      name: 'Medical Membership (Total, millions)',
      category: 'Health Care Benefits (Aetna)',
      min: 24.0,
      max: 28.0,
      default: 26.0,                  // FY2026 guidance ~26.0M [CITED:EC-Q1-26]
      step: 0.25,
      unit: 'M members',
      description: 'Total medical membership. Q1 2026: 26.0M (down from 27.1M Q1 2025 due to ACA exchange exit). FY2026 guidance ~26.0M. Each +0.5M members ≈ +$2.7B annual HCB revenue (at ~$5,400 PMPM) → +$225M AOI (at 8.4% margin). Commercial fee-based growth partially offsets government membership shifts. MA membership is the highest-value cohort.',
      impact: 'high',
    },
    {
      id: 'ma-margin-recovery',
      name: 'Medicare Advantage Margin Recovery (% target margin)',
      category: 'Health Care Benefits (Aetna)',
      min: 0.0,
      max: 4.0,
      default: 1.5,                   // est. FY2026 MA margin trajectory toward 3% by 2028 [ASSUMED]
      step: 0.25,
      unit: '% MA adj. margin',
      description: 'Medicare Advantage adjusted operating margin. Target: 3% by 2028 (management reaffirmed on Q1 2026 call). Q1 2026 strong start but still below target. CMS 2027 rates insufficient — company managing through disciplined geographic/product mix, medical cost management, prior auth standardization. Each +0.5% MA margin improvement ≈ +$350M–500M annual AOI (at ~$70B MA premium revenues est.).',
      impact: 'high',
    },
    {
      id: 'prior-auth-approval-rate',
      name: 'Prior Authorization Approval Rate Within 24 Hours (%)',
      category: 'Health Care Benefits (Aetna)',
      min: 88.0,
      max: 99.0,
      default: 95.0,                  // current: >95% approved within 24 hours [CITED:EC-Q1-26]
      step: 1.0,
      unit: '% approved within 24h',
      description: 'Aetna prior authorization approval rate within 24 hours. Current: >95% (industry-leading). >80% approved in real time. 88% of procedures standardized per AHIP commitment (industry: 50% by year-end). Key operational KPI reflecting administrative efficiency and member experience. Each 1% improvement reduces administrative cost burden and friction for providers/members.',
      impact: 'low',
    },

    // ─── Health Services (Caremark / PBM) ───
    {
      id: 'pharmacy-client-price-improvement',
      name: 'Pharmacy Client Price Improvements (HSS AOI Headwind, $M)',
      category: 'Health Services (Caremark)',
      min: 0,
      max: 2000,
      default: 800,                   // est. FY2026 annual HSS AOI headwind from client price improvements [ASSUMED]
      step: 100,
      unit: '$M AOI headwind',
      description: 'Annual headwind from pharmacy client price improvements as CVS transitions to TrueCost net-cost economics. Q1 2026 HSS AOI −7% YoY primarily from these improvements (partially offset by purchasing economics and drug mix). Each $200M reduction in headwind severity ≈ +$200M HSS AOI / +$0.15/share EPS. Management tracking broadly in line with 2026 rebate guarantee commitments.',
      impact: 'high',
    },
    {
      id: 'biosimilar-conversion-rate',
      name: 'Stelara Biosimilar Conversion Rate (%)',
      category: 'Health Services (Caremark)',
      min: 50,
      max: 95,
      default: 85,                    // management targets similar ~90% conversion as Humira [ASSUMED]
      step: 5,
      unit: '% biosimilar conversion',
      description: 'Caremark biosimilar conversion for Stelara (excluded from commercial formularies July 1, 2026). Humira conversion >90% achieved — applying same proven playbook. Each 10% conversion ≈ +$300–500M annual PBM client savings. Bull case: 90%+ like Humira. Bear case: 60–70% if patient/provider resistance delays conversion. Strong Aetna-Caremark integration and frictionless experience model is competitive advantage.',
      impact: 'medium',
    },
    {
      id: 'pharmacy-claims-volume',
      name: 'Annual Pharmacy Claims Processed (billions)',
      category: 'Health Services (Caremark)',
      min: 1.7,
      max: 2.0,
      default: 1.84,                  // FY2026 guidance ≥1.84B [CITED:EC-Q1-26]
      step: 0.05,
      unit: 'B claims',
      description: 'Total annual pharmacy claims processed by Caremark PBM. FY2026 guidance ≥1.84B (Q1 2026: 464.7M). Each 50M additional claims ≈ +$1.2–1.5B HSS revenue at average revenue per claim. Volume growth driven by specialty pharmacy uptake, Oak Street Health scripts, and commercial employer wins for 2027 season.',
      impact: 'medium',
    },
    {
      id: 'glp1-client-coverage-rate',
      name: 'GLP-1 (Obesity) Client Coverage Rate (%)',
      category: 'Health Services (Caremark)',
      min: 30,
      max: 80,
      default: 50,                    // ~50% of clients discontinuing obesity GLP-1 coverage [CITED:EC-Q1-26]
      step: 5,
      unit: '% of clients covering GLP-1 obesity',
      description: 'Percentage of Caremark PBM clients maintaining formulary coverage for GLP-1 medications (obesity indication). Currently ~50% of clients discontinuing obesity coverage due to cost. Higher coverage rate increases pharmacy claims volume and specialty revenues; lower rate reduces trend but shifts members to DTC/retail. Each +10% coverage rate ≈ +$1.5–2.0B specialty pharmacy revenues (GLP-1s are among the highest-cost specialty drugs).',
      impact: 'medium',
    },

    // ─── Pharmacy & Consumer Wellness ───
    {
      id: 'same-store-rx-growth',
      name: 'Same-Store Prescription Volume Growth (%)',
      category: 'Pharmacy & Consumer Wellness',
      min: 0.0,
      max: 10.0,
      default: 7.0,                   // Q1 2026 same-store pharmacy scripts +7% [CITED:EC-Q1-26]
      step: 0.5,
      unit: '% same-store Rx growth',
      description: 'Same-store prescription volume growth at CVS pharmacy locations. Q1 2026: +7% — strong underlying performance. FY2026 full-year guidance ≥1.865B prescriptions filled. Each +1% same-store Rx growth ≈ +$1.36B annual PCW revenue. Driven by aging demographics, Rite Aid asset conversions, GLP-1 DTC market growth (+200bps share gain), and MinuteClinic/HealthHUB patient engagement.',
      impact: 'medium',
    },
    {
      id: 'pcw-reimbursement-pressure',
      name: 'Pharmacy Reimbursement Rate Pressure (bps vs prior year)',
      category: 'Pharmacy & Consumer Wellness',
      min: -200,
      max: 50,
      default: -80,                   // est. ongoing reimbursement pressure [ASSUMED]
      step: 25,
      unit: 'bps reimbursement rate change',
      description: 'Annual change in pharmacy reimbursement rates from PBM/payer negotiations and government programs. Currently negative — ongoing headwind. CostVantage cost-plus model has neutralized branded drug margin volatility but reimbursement pressure from generic drug introductions and regulatory pricing pressure persists. Each −50bps on ~$136.5B PCW revenue ≈ −$682M annual revenue impact → −$300M AOI (at ~44% gross margin).',
      impact: 'medium',
    },

    // ─── Enterprise / Capital Structure ───
    {
      id: 'interest-rate-10yr-yield',
      name: '10-Year Treasury Yield (% for refinancing)',
      category: 'Capital Structure',
      min: 3.5,
      max: 6.5,
      default: 4.5,                   // est. FY2026 avg 10-year yield [ASSUMED]
      step: 0.25,
      unit: '% 10-yr yield',
      description: 'CVS carries significant long-term debt from Aetna acquisition ($69B enterprise value, 2018). Leverage ratio 3.84x as of Q1 2026; target BBB credit rating. Each +50bps on new debt issuance ≈ +$40–60M annual interest expense. Share repurchase suspended; deleveraging is priority. Fed rate cuts would accelerate balance sheet repair and re-rate the stock.',
      impact: 'medium',
    },
    {
      id: 'health100-adoption',
      name: 'Health100 Platform Launch — Member Engagement Rate (%)',
      category: 'Strategic Initiatives',
      min: 0,
      max: 30,
      default: 5,                     // est. first-year adoption post H2 2026 launch [ASSUMED]
      step: 1,
      unit: '% member engagement',
      description: "Health100: AI-native consumer platform launching H2 2026, designed to be the consumer's front door to integrated health care regardless of payer, PBM, pharmacy, or provider banner. Any payer, PBM, pharmacy or provider can connect. Scale: CVS serves 18M+ commercial members plus pharmacy customers. Each 5% engagement rate ≈ +$200–400M estimated enterprise value uplift over 3 years from reduced friction, lower total cost of care, and competitive retention (CONFIG-ONLY: revenue impact not yet modeled).",
      impact: 'medium',
    },
  ],

  preBuiltScenarios: [
    {
      id: 'base-case',
      name: 'Base Case — Guidance Midpoint ($7.40 EPS)',
      description: 'FY2026 adj. EPS $7.40 (guidance midpoint). MBR 90.5%. Medical membership ~26.0M. HSS pharmacy client price improvements tracking to plan. Stelara biosimilar conversion ~85%. Pharmacy claims ≥1.84B. Same-store Rx +7%. 10-year Treasury ~4.5%. Health100 launches H2 2026. Leverage ratio improving toward BBB target.',
      icon: 'target',
      confidence: 65,
      revenueImpact: 0,
      marginImpact: 0,
      keyAssumptions: [
        'FY2026 adj. EPS $7.40 (guidance midpoint $7.30–$7.50)',
        'HCB MBR 90.5% ±50bps — prudent and respectful view on medical cost trends',
        'Medical membership ~26.0M — exit from ACA exchange absorbed',
        'HSS AOI ≥$7.25B — rebate guarantee commitments tracking to plan',
        'Stelara biosimilar exclusion July 1, 2026 — 85% conversion rate target',
        'PCW prescriptions ≥1.865B; same-store Rx +7%',
        '60-40 H1/H2 earnings split; CFO ≥$9.5B',
        '10-year Treasury ~4.5%; leverage ratio improving toward 3.5x',
      ],
      leverSettings: {
        'hcb-mbr': 90.5,
        'medical-membership': 26.0,
        'ma-margin-recovery': 1.5,
        'prior-auth-approval-rate': 95.0,
        'pharmacy-client-price-improvement': 800,
        'biosimilar-conversion-rate': 85,
        'pharmacy-claims-volume': 1.84,
        'glp1-client-coverage-rate': 50,
        'same-store-rx-growth': 7.0,
        'pcw-reimbursement-pressure': -80,
        'interest-rate-10yr-yield': 4.5,
        'health100-adoption': 5,
      },
    },
    {
      id: 'bull-aetna-recovery',
      name: 'Bull — Aetna MA Margin Acceleration',
      description: 'MBR outperforms at 89.0% as prior year development persists and medical cost management exceeds expectations. MA margin toward 2.5% in FY2026 (ahead of schedule to 3% target). Stelara conversion hits 90%+ like Humira. Health100 launch resonates; membership retention improves. Fed cuts support balance sheet. Adj. EPS approaches $8.00+.',
      icon: 'trending-up',
      confidence: 20,
      revenueImpact: 5000,
      marginImpact: 1400,
      keyAssumptions: [
        'HCB MBR 89.0% — prior year development persists + core outperformance',
        'MA margin 2.5% in FY2026; on track to 3% by 2027 (one year ahead)',
        'Stelara biosimilar conversion 92% — replicates Humira playbook fully',
        'Medical membership stable at 26.5M — commercial fee-based growth',
        'HSS pharmacy client improvements narrowing — Q2-Q4 AOI headwind moderates',
        'Same-store Rx +8%; PCW reimbursement pressure eases',
        '10-year Treasury declines to 3.75%; balance sheet deleveraging accelerates',
        'Health100 early engagement drives 2027 membership retention improvements',
      ],
      leverSettings: {
        'hcb-mbr': 89.0,
        'medical-membership': 26.5,
        'ma-margin-recovery': 2.5,
        'prior-auth-approval-rate': 96.0,
        'pharmacy-client-price-improvement': 500,
        'biosimilar-conversion-rate': 92,
        'pharmacy-claims-volume': 1.90,
        'glp1-client-coverage-rate': 55,
        'same-store-rx-growth': 8.0,
        'pcw-reimbursement-pressure': -50,
        'interest-rate-10yr-yield': 3.75,
        'health100-adoption': 10,
      },
    },
    {
      id: 'bear-ma-cost-pressure',
      name: 'Bear — MA Medical Cost Deterioration',
      description: 'MBR worsens to 93%+ as medical cost trends remain elevated above CMS rates. MA margin recovery delayed beyond 2028. GLP-1 costs escalate as more clients restore obesity coverage. HSS pharmacy client pressure more severe than expected. Tennessee PBM legislation creates uncertainty. Adj. EPS falls toward $6.50–6.80.',
      icon: 'trending-down',
      confidence: 15,
      revenueImpact: -8000,
      marginImpact: -2200,
      keyAssumptions: [
        'HCB MBR worsens to 93.0% — medical cost trends above prior year development levels',
        'MA margin negative in FY2026; 3% target pushed to 2029',
        'Medical membership declines to 25.0M — ACA exit plus MA competitive pressure',
        'HSS pharmacy client improvements severe — $1.5B+ AOI headwind',
        'Stelara conversion only 65% — patient/provider resistance higher than expected',
        'GLP-1 client coverage rate rises to 65% — PBM cost management challenged',
        '10-year Treasury 6.0% — higher financing costs; leverage ratio stalls at 3.8x',
        'Tennessee PBM legislation creates operational disruption; legal action pending',
      ],
      leverSettings: {
        'hcb-mbr': 93.0,
        'medical-membership': 25.0,
        'ma-margin-recovery': 0.0,
        'prior-auth-approval-rate': 93.0,
        'pharmacy-client-price-improvement': 1500,
        'biosimilar-conversion-rate': 65,
        'pharmacy-claims-volume': 1.82,
        'glp1-client-coverage-rate': 65,
        'same-store-rx-growth': 5.0,
        'pcw-reimbursement-pressure': -150,
        'interest-rate-10yr-yield': 6.0,
        'health100-adoption': 2,
      },
    },
    {
      id: 'biosimilar-acceleration',
      name: 'Biosimilar Acceleration — Stelara Playbook Executes',
      description: 'Stelara biosimilar exclusion July 1, 2026 delivers 90%+ conversion — replicating Humira success. Caremark captures meaningful client savings while maintaining AOI. Base case on all other levers. Represents execution of the proven biosimilar playbook without incremental headwinds.',
      icon: 'zap',
      confidence: 35,
      revenueImpact: 2000,
      marginImpact: 600,
      keyAssumptions: [
        'Stelara biosimilar conversion 92% by Q3 2026 — Humira playbook replicates',
        'Majority of patients paying $0 out of pocket on biosimilar (frictionless experience)',
        'Caremark retains formulary clients — competitive win vs Express Scripts/OptumRx',
        'HSS AOI headwind moderates as biosimilar economics flow through in H2 2026',
        'All other levers at base case',
        'Aetna-Caremark fully insured integration: point-of-sale rebates to all Aetna members',
      ],
      leverSettings: {
        'hcb-mbr': 90.5,
        'medical-membership': 26.0,
        'ma-margin-recovery': 1.5,
        'prior-auth-approval-rate': 95.0,
        'pharmacy-client-price-improvement': 700,
        'biosimilar-conversion-rate': 92,
        'pharmacy-claims-volume': 1.87,
        'glp1-client-coverage-rate': 50,
        'same-store-rx-growth': 7.0,
        'pcw-reimbursement-pressure': -80,
        'interest-rate-10yr-yield': 4.5,
        'health100-adoption': 5,
      },
    },
    {
      id: 'fed-rate-relief',
      name: 'Fed Rate Relief — Balance Sheet Deleveraging Accelerates',
      description: 'Fed cuts 100–150bps in H2 2026. 10-year Treasury declines to 3.75%. CVS refinances debt at lower cost; leverage ratio falls toward 3.2x. Interest expense savings ~$140M annually. Share repurchase may be reactivated in 2027. Supports multiple expansion and dividend growth trajectory.',
      icon: 'building-2',
      confidence: 25,
      revenueImpact: 500,
      marginImpact: 200,
      keyAssumptions: [
        'Fed cuts 100–150bps by year-end 2026',
        '10-year Treasury declines to 3.75%; CVS refinancing saves ~$140M/year interest',
        'Leverage ratio falls to 3.2x by Q4 2026 — approaching target for capital return expansion',
        'Share repurchase evaluated for 2027 return program',
        'Health care sector multiple expands as discount rate falls',
        'All other levers at base case',
      ],
      leverSettings: {
        'hcb-mbr': 90.5,
        'medical-membership': 26.0,
        'ma-margin-recovery': 1.5,
        'prior-auth-approval-rate': 95.0,
        'pharmacy-client-price-improvement': 800,
        'biosimilar-conversion-rate': 85,
        'pharmacy-claims-volume': 1.84,
        'glp1-client-coverage-rate': 50,
        'same-store-rx-growth': 7.0,
        'pcw-reimbursement-pressure': -80,
        'interest-rate-10yr-yield': 3.75,
        'health100-adoption': 5,
      },
    },
  ],
};
