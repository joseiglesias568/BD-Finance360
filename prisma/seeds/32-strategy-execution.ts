import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 32: Strategy Execution — Becton, Dickinson and Company (BDX)
//
// 5 pillars × 4 KPIs × 3 quarters = 60 records
// Quarters: Q4 FY25, Q1 FY26, Q2 FY26
//
// BD Fiscal Year: ends September 30
//   Q4 FY25 = Jul-Sep 2025
//   Q1 FY26 = Oct-Dec 2025
//   Q2 FY26 = Jan-Mar 2026
//
// Pillars:
//   1. Alaris Return to Market & Infusion Leadership
//   2. GLP-1 & Pharmaceutical Systems Growth
//   3. Excellence Unleashed Cost Transformation
//   4. China & Emerging Markets Resilience
//   5. Financial Discipline & Capital Allocation
// =============================================================================

export async function seedStrategyExecution(prisma: PrismaClient, companyId: number) {
    console.log('Seeding BD strategy execution KPIs...');

    type Status = 'on-track' | 'at-risk' | 'warning' | 'complete' | 'ahead';

    interface StrategyKPI {
        pillar: string;
        kpiName: string;
        baseline: number;
        target: number;
        unit: string;
        quarters: Array<{
            quarterLabel: string;
            current: number;
            status: Status;
            commentary: string;
        }>;
    }

    const kpis: StrategyKPI[] = [

        // =====================================================================
        // PILLAR 1: Alaris Return to Market & Infusion Leadership
        // =====================================================================
        {
            pillar: 'Alaris Return to Market & Infusion Leadership',
            kpiName: 'Alaris Consent Decree Remediation %',
            baseline: 50.0,
            target: 100.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 70.0,
                    status: 'on-track',
                    commentary: '70% remediation; FDA milestone acknowledged; full resolution Q3 FY26 target',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 75.0,
                    status: 'on-track',
                    commentary: '75% remediation; 340 site visits complete; FDA dialogue constructive',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 78.0,
                    status: 'on-track',
                    commentary: '78% remediated as of Q2 FY26; on track for full resolution Q3 FY26',
                },
            ],
        },
        {
            pillar: 'Alaris Return to Market & Infusion Leadership',
            kpiName: 'Alaris New System Placements (units/quarter)',
            baseline: 800,
            target: 1800,
            unit: 'units',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 920,
                    status: 'at-risk',
                    commentary: 'Placements improving but below 1,100 plan; consent decree limits new accounts',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 980,
                    status: 'at-risk',
                    commentary: 'Placements below 1,200 plan; existing accounts prioritized during decree period',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 1050,
                    status: 'on-track',
                    commentary: 'Volume recovery accelerating as 78% remediation enables new account approvals',
                },
            ],
        },
        {
            pillar: 'Alaris Return to Market & Infusion Leadership',
            kpiName: 'Alaris Software Annual Revenue ($M)',
            baseline: 180,
            target: 320,
            unit: '$M',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 210,
                    status: 'on-track',
                    commentary: 'Software revenue growing as installed base renews; recurring revenue model improving',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 225,
                    status: 'on-track',
                    commentary: 'Q1 software renewals above plan; Alaris intelligence platform adoption 42% of installed base',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 238,
                    status: 'on-track',
                    commentary: 'Software revenue above plan; connected care digital platform driving higher ASPs',
                },
            ],
        },
        {
            pillar: 'Alaris Return to Market & Infusion Leadership',
            kpiName: 'Connected Care Organic Revenue Growth (FXN%)',
            baseline: -2.0,
            target: 5.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 0.8,
                    status: 'at-risk',
                    commentary: 'Growth recovering from consent decree constraint; below 2.5% plan',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 1.2,
                    status: 'at-risk',
                    commentary: 'Below 2.0% plan; Alaris volume ramp slower than modeled in Q1 FY26',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 1.8,
                    status: 'at-risk',
                    commentary: 'Improving but below 3.0% Q2 plan; full return to market pending consent decree resolution',
                },
            ],
        },

        // =====================================================================
        // PILLAR 2: GLP-1 & Pharmaceutical Systems Growth
        // =====================================================================
        {
            pillar: 'GLP-1 & Pharmaceutical Systems Growth',
            kpiName: 'BioPharma Systems FXN Revenue Growth (%)',
            baseline: 3.0,
            target: 8.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 5.8,
                    status: 'on-track',
                    commentary: 'Strong GLP-1 prefillable syringe demand driving above-plan growth; capacity utilization rising',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 5.5,
                    status: 'on-track',
                    commentary: 'Pharma Systems FXN growth on track; new customer wins activating; GLP-1 volume ramp continues',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 8.2,
                    status: 'ahead',
                    commentary: 'Q2 FY26 BioPharma Systems above target at 8.2% FXN; GLP-1 syringe demand accelerating; new capacity line qualified',
                },
            ],
        },
        {
            pillar: 'GLP-1 & Pharmaceutical Systems Growth',
            kpiName: 'Prefillable Syringe Capacity Utilization (%)',
            baseline: 72.0,
            target: 90.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 78.0,
                    status: 'on-track',
                    commentary: 'Capacity utilization increasing as GLP-1 supply agreements ramp; new line qualification underway',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 82.0,
                    status: 'on-track',
                    commentary: 'Utilization above plan at 82%; $180M capital investment in new lines proceeding on schedule',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 87.0,
                    status: 'on-track',
                    commentary: 'Utilization at 87%; approaching 90% target as GLP-1 pharma customers activate volume commitments',
                },
            ],
        },
        {
            pillar: 'GLP-1 & Pharmaceutical Systems Growth',
            kpiName: 'New Pharma Customer Wins (cumulative since FY25)',
            baseline: 0,
            target: 15,
            unit: 'accounts',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 6,
                    status: 'on-track',
                    commentary: '6 new pharmaceutical manufacturer accounts signed since FY25; GLP-1 and injectable insulin focus',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 9,
                    status: 'on-track',
                    commentary: '9 cumulative wins; 3 new accounts in Q1 FY26 including two top-10 pharma; pipeline robust',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 12,
                    status: 'on-track',
                    commentary: '12 cumulative wins; on track for 15-account target; GLP-1 market expansion driving demand for BD Pharmaceutical Systems',
                },
            ],
        },
        {
            pillar: 'GLP-1 & Pharmaceutical Systems Growth',
            kpiName: 'Pharmaceutical Systems Gross Margin (%)',
            baseline: 58.0,
            target: 65.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 61.2,
                    status: 'on-track',
                    commentary: 'BioPharma Systems gross margin above baseline; volume leverage and favorable mix driving improvement',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 62.5,
                    status: 'on-track',
                    commentary: 'Gross margin expanding; GLP-1 dedicated lines carry premium margins; cost efficiency improving',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 63.8,
                    status: 'on-track',
                    commentary: 'Margin at 63.8%; on track for 65% target; specialty pharmaceutical systems mix driving expansion',
                },
            ],
        },

        // =====================================================================
        // PILLAR 3: Excellence Unleashed Cost Transformation
        // =====================================================================
        {
            pillar: 'Excellence Unleashed Cost Transformation',
            kpiName: 'Cumulative Cost-Out Savings ($M vs $200M target)',
            baseline: 0,
            target: 200,
            unit: '$M',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 120,
                    status: 'on-track',
                    commentary: '$120M cumulative savings delivered; manufacturing efficiency and SAE reduction on track',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 150,
                    status: 'on-track',
                    commentary: '$150M cumulative savings; 75% of $200M target achieved; procurement and automation driving incremental savings',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 168,
                    status: 'on-track',
                    commentary: '$168M cumulative savings through Q2 FY26; $32M remaining to reach $200M target by FY26 year-end',
                },
            ],
        },
        {
            pillar: 'Excellence Unleashed Cost Transformation',
            kpiName: 'COGS % of Revenue',
            baseline: 52.5,
            target: 50.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 51.2,
                    status: 'on-track',
                    commentary: 'COGS ratio improving; manufacturing efficiency gains and favorable input cost environment contributing',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 51.5,
                    status: 'on-track',
                    commentary: 'Slight Q1 seasonal pressure; full-year trajectory intact toward 50% target',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 50.8,
                    status: 'on-track',
                    commentary: 'COGS ratio approaching target; plastic resin deflation and automation savings materializing',
                },
            ],
        },
        {
            pillar: 'Excellence Unleashed Cost Transformation',
            kpiName: 'SAE % of Revenue',
            baseline: 25.0,
            target: 23.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 24.0,
                    status: 'on-track',
                    commentary: 'SAE reduction on track; corporate headcount optimization and shared services consolidation progressing',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 24.5,
                    status: 'on-track',
                    commentary: 'Q1 FY26 SAE at 24.5%; Waters spin-off removes ~800 corporate FTE; digital finance tools reducing back-office cost',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 24.2,
                    status: 'on-track',
                    commentary: 'SAE improving; Excellence Unleashed SG&A savings flowing through; on track for 23% target',
                },
            ],
        },
        {
            pillar: 'Excellence Unleashed Cost Transformation',
            kpiName: 'Adjusted Operating Margin (%)',
            baseline: 23.0,
            target: 25.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 24.5,
                    status: 'on-track',
                    commentary: 'Adj. op margin 24.5% in Q4 FY25; strong seasonal quarter; cost savings materializing',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 23.8,
                    status: 'on-track',
                    commentary: 'Q1 FY26 adj. op margin 23.8%; seasonally softer Q1 typical; full-year guidance ~25% maintained',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 24.2,
                    status: 'on-track',
                    commentary: 'Q2 FY26 adj. op margin 24.2%; on track for full-year ~25% guidance midpoint',
                },
            ],
        },

        // =====================================================================
        // PILLAR 4: China & Emerging Markets Resilience
        // =====================================================================
        {
            pillar: 'China & Emerging Markets Resilience',
            kpiName: 'China Revenue FXN Growth (%)',
            baseline: 5.0,
            target: 2.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: -5.5,
                    status: 'warning',
                    commentary: 'China VoBP pricing pressure accelerating; -5.5% FXN growth in Q4 FY25; government tender resets impacting Medical Essentials',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: -7.8,
                    status: 'warning',
                    commentary: 'China FXN growth -7.8% in Q1 FY26; VoBP rounds expanding to additional product categories; mitigation investments underway',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: -9.8,
                    status: 'at-risk',
                    commentary: 'China FXN -9.8% in Q2 FY26; VoBP pricing compression -30% to -50% on tendered products; non-VoBP innovation pipeline critical to offset',
                },
            ],
        },
        {
            pillar: 'China & Emerging Markets Resilience',
            kpiName: 'VoBP Mitigation Revenue ($M)',
            baseline: 0,
            target: 80,
            unit: '$M',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 35,
                    status: 'at-risk',
                    commentary: '$35M of revenue protected through non-VoBP innovation products and new categories; below $45M plan',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 42,
                    status: 'at-risk',
                    commentary: '$42M mitigation revenue; new product registrations in China progressing; below $55M plan',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 50,
                    status: 'at-risk',
                    commentary: '$50M mitigation revenue; non-VoBP channel building; BD Rowa and Pharmaceutical Systems China offset partially mitigating Essentials VoBP drag',
                },
            ],
        },
        {
            pillar: 'China & Emerging Markets Resilience',
            kpiName: 'Emerging Markets Ex-China FXN Growth (%)',
            baseline: 3.0,
            target: 8.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 6.5,
                    status: 'on-track',
                    commentary: 'EM ex-China FXN growth 6.5%; India, Southeast Asia, Latin America offsetting China weakness',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 7.2,
                    status: 'on-track',
                    commentary: 'EM ex-China 7.2% FXN growth; India diagnostics and Medical Essentials strong; Brazil and Mexico solid',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 7.8,
                    status: 'on-track',
                    commentary: 'EM ex-China approaching 8% target; BD investing in local commercial infrastructure in high-growth EM markets',
                },
            ],
        },
        {
            pillar: 'China & Emerging Markets Resilience',
            kpiName: 'Asia Pacific Segment Adjusted Operating Margin (%)',
            baseline: 20.0,
            target: 22.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 21.0,
                    status: 'on-track',
                    commentary: 'Asia Pacific adj. op margin 21.0%; China VoBP diluting segment margin; EM growth partially offsetting',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 20.5,
                    status: 'on-track',
                    commentary: 'Margin at 20.5%; China headwinds pressuring segment; cost controls and mix management limiting downside',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 20.8,
                    status: 'on-track',
                    commentary: 'Segment margin recovering toward 22% target as EM growth mix improves and China VoBP impact stabilizes',
                },
            ],
        },

        // =====================================================================
        // PILLAR 5: Financial Discipline & Capital Allocation
        // =====================================================================
        {
            pillar: 'Financial Discipline & Capital Allocation',
            kpiName: 'Net Leverage Ratio (x)',
            baseline: 3.2,
            target: 2.5,
            unit: 'x',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 3.0,
                    status: 'on-track',
                    commentary: 'Net leverage 3.0x at FY25 year-end; Waters spin-off proceeds applied to debt reduction; trajectory toward 2.5x target',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 2.95,
                    status: 'on-track',
                    commentary: 'Net leverage 2.95x in Q1 FY26; Waters separation (Feb 9, 2026) completes portfolio refocus; deleveraging on track',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 2.90,
                    status: 'on-track',
                    commentary: 'Net leverage 2.90x through Q2 FY26; on track for 2.5x target; strong FCF generation supporting debt reduction',
                },
            ],
        },
        {
            pillar: 'Financial Discipline & Capital Allocation',
            kpiName: 'Free Cash Flow ($M quarterly)',
            baseline: 240,
            target: 700,
            unit: '$M',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 680,
                    status: 'on-track',
                    commentary: 'Q4 FY25 FCF $680M; seasonally strong quarter as BD fiscal year-end; working capital favorable',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 290,
                    status: 'on-track',
                    commentary: 'Q1 FY26 FCF $290M; seasonally softer first quarter; inventory build for Q2 peak; on full-year track',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 310,
                    status: 'on-track',
                    commentary: 'Q2 FY26 FCF $310M; H1 FCF $600M; full-year FCF guidance on track; capital allocation toward debt and GLP-1 capacity',
                },
            ],
        },
        {
            pillar: 'Financial Discipline & Capital Allocation',
            kpiName: 'Adjusted Operating Margin YTD (%)',
            baseline: 23.0,
            target: 25.0,
            unit: '%',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 24.5,
                    status: 'on-track',
                    commentary: 'FY25 full-year adj. op margin 24.5%; Excellence Unleashed savings and revenue growth supporting expansion',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 23.8,
                    status: 'on-track',
                    commentary: 'Q1 FY26 adj. op margin 23.8% YTD; seasonal Q1 pattern typical; FY26 full-year guidance ~25% maintained',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 24.2,
                    status: 'on-track',
                    commentary: 'H1 FY26 adj. op margin 24.2% YTD; on track for FY26 ~25% guidance; H2 seasonally stronger',
                },
            ],
        },
        {
            pillar: 'Financial Discipline & Capital Allocation',
            kpiName: 'Adjusted Diluted EPS ($)',
            baseline: 11.50,
            target: 12.72,
            unit: '$',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    current: 3.35,
                    status: 'on-track',
                    commentary: 'Q4 FY25 actual; on track for FY25 full-year ~$12.50',
                },
                {
                    quarterLabel: 'Q1 FY26',
                    current: 2.90,
                    status: 'on-track',
                    commentary: 'Q1 FY26 actual; seasonal Q1 typical; FY26 guidance $12.52-$12.72',
                },
                {
                    quarterLabel: 'Q2 FY26',
                    current: 2.90,
                    status: 'on-track',
                    commentary: 'Q2 FY26 actual; H1 run-rate consistent with FY26 guidance',
                },
            ],
        },
    ];

    const records = [];
    for (const kpi of kpis) {
        for (const qtr of kpi.quarters) {
            records.push({
                companyId,
                pillar: kpi.pillar,
                kpiName: kpi.kpiName,
                baseline: kpi.baseline,
                target: kpi.target,
                current: qtr.current,
                unit: kpi.unit,
                status: qtr.status,
                commentary: qtr.commentary,
                quarterLabel: qtr.quarterLabel,
            });
        }
    }

    await prisma.strategyExecution.createMany({ data: records });
    console.log(`  ✓ ${records.length} StrategyExecution records seeded for BD`);
}
