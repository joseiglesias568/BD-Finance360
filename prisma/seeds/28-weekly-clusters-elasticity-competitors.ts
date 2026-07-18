import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 28: Weekly Snapshots, Business Segment Clusters, Elasticity Factors,
//          Competitor Quarterly Metrics — Becton, Dickinson and Company (NYSE: BDX)
// =============================================================================

export async function seedAnalyticalData(
    prisma: PrismaClient,
    companyId: number,
    allPeriods: Record<string, { id: number }>,
) {
    console.log('Seeding analytical data (weekly snapshots, segment clusters, elasticity, competitors) for BD...');

    // =========================================================================
    // TABLE 1: WeeklySnapshot — 50 records (10 weeks × 5 metrics)
    // Q2 FY26 (Jan 5 – Mar 9, 2026) — BD fiscal Q2 ends March 31
    // Q2 FY26 total revenue $4,714M / 13 weeks ≈ $363M/week
    // =========================================================================

    const weekDefs = [
        { weekNumber: 1,  weekLabel: 'Week of Jan 5, 2026',  weekStartDate: '2026-01-05' },
        { weekNumber: 2,  weekLabel: 'Week of Jan 12, 2026', weekStartDate: '2026-01-12' },
        { weekNumber: 3,  weekLabel: 'Week of Jan 19, 2026', weekStartDate: '2026-01-19' },
        { weekNumber: 4,  weekLabel: 'Week of Jan 26, 2026', weekStartDate: '2026-01-26' },
        { weekNumber: 5,  weekLabel: 'Week of Feb 2, 2026',  weekStartDate: '2026-02-02' },
        { weekNumber: 6,  weekLabel: 'Week of Feb 9, 2026',  weekStartDate: '2026-02-09' },
        { weekNumber: 7,  weekLabel: 'Week of Feb 16, 2026', weekStartDate: '2026-02-16' },
        { weekNumber: 8,  weekLabel: 'Week of Feb 23, 2026', weekStartDate: '2026-02-23' },
        { weekNumber: 9,  weekLabel: 'Week of Mar 2, 2026',  weekStartDate: '2026-03-02' },
        { weekNumber: 10, weekLabel: 'Week of Mar 9, 2026',  weekStartDate: '2026-03-09' },
    ];

    // 5 metrics × 10 weeks — values reflect BD operations in Q2 FY26
    const metricSeries: Array<{
        metricName: string;
        values: number[];
        yoyValues: number[];
        statuses: ('good' | 'warning' | 'alert')[];
    }> = [
        {
            // Total Net Revenue ($M/week) — Q2 FY26 $4,714M / 13 weeks ≈ $363M
            // Jan slow start, builds through March; Q2 FY25 ~$4,594M / 13 ≈ $354M
            metricName: 'Total Net Revenue ($M/week)',
            values:    [348, 354, 358, 362, 365, 368, 366, 363, 360, 358],
            yoyValues: [338, 344, 348, 352, 355, 358, 356, 353, 350, 348],
            statuses:  ['good','good','good','good','good','good','good','good','good','good'],
        },
        {
            // Connected Care Revenue ($M/week) — Q2 FY26 ~$880M / 13 ≈ $68M; +12% FXN beat
            // Strong Alaris re-commercialization momentum in Jan-Feb; slight Q3 pull-back
            metricName: 'Connected Care Revenue ($M/week)',
            values:    [62, 64, 66, 68, 70, 72, 73, 74, 75, 74],
            yoyValues: [56, 57, 58, 60, 61, 62, 63, 64, 65, 64],
            statuses:  ['good','good','good','good','good','good','good','good','good','good'],
        },
        {
            // BioPharma Systems Revenue ($M/week) — Q2 FY26 ~$1,098M / 13 ≈ $84M
            // Declining trend as China VoBP headwind deepens through quarter
            metricName: 'BioPharma Systems Revenue ($M/week)',
            values:    [90, 89, 88, 86, 85, 83, 82, 81, 80, 79],
            yoyValues: [96, 95, 95, 94, 93, 92, 91, 90, 89, 88],
            statuses:  ['good','good','good','warning','warning','warning','warning','warning','alert','alert'],
        },
        {
            // Interventional Revenue ($M/week) — Q2 FY26 ~$664M / 13 ≈ $51M; +5.2% FXN
            // Stable growth; surgery volumes steady; Feb stronger on elective procedure catch-up
            metricName: 'Interventional Revenue ($M/week)',
            values:    [48, 50, 51, 52, 53, 54, 53, 52, 52, 51],
            yoyValues: [46, 47, 48, 49, 50, 51, 50, 49, 49, 48],
            statuses:  ['good','good','good','good','good','good','good','good','good','good'],
        },
        {
            // BD Alaris Remediation Progress (% of US installed base fully remediated)
            // Weekly tracking milestone; targeting 95% by Sep 30, 2026
            metricName: 'BD Alaris Remediation Progress (% complete)',
            values:    [72, 73, 74, 74, 75, 76, 77, 77, 78, 78],
            yoyValues: [45, 46, 48, 49, 51, 52, 54, 55, 57, 58],
            statuses:  ['good','good','good','good','good','good','good','good','good','good'],
        },
    ];

    const weeklySnapshotData = [];
    for (const metric of metricSeries) {
        for (let i = 0; i < weekDefs.length; i++) {
            const week = weekDefs[i];
            const statusMap: Record<string, string> = { good: 'on_track', warning: 'watch', alert: 'at_risk' };
            weeklySnapshotData.push({
                companyId,
                weekNumber: week.weekNumber,
                weekLabel: week.weekLabel,
                weekStartDate: week.weekStartDate,
                metricName: metric.metricName,
                value: metric.values[i],
                yoyValue: metric.yoyValues[i],
                status: statusMap[metric.statuses[i]] ?? 'on_track',
            });
        }
    }

    await prisma.weeklySnapshot.createMany({ data: weeklySnapshotData });
    console.log(`  ✓ ${weeklySnapshotData.length} WeeklySnapshot records`);

    // =========================================================================
    // TABLE 2: StoreCluster — 40 records (8 business segments × 5 quarters)
    // Q1 FY25 through Q1 FY26 — reinterpreted as BD SegmentCluster data
    // BD fiscal: Q1 FY25 = Oct-Dec 2024; Q1 FY26 = Oct-Dec 2025
    // =========================================================================

    const quarters = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'];

    // Per-quarter arrays: [Q1 FY25, Q2 FY25, Q3 FY25, Q4 FY25, Q1 FY26]
    const segmentClusters = [
        {
            clusterName: 'Medical Essentials',
            clusterType: 'consumer' as const,
            // Largest segment ~40% revenue; medication management, infusion, IV catheters
            // ~6,500 hospital/health system accounts; ~$2.05B/quarter
            storeCount:       [6320, 6380, 6420, 6460, 6500],
            revenue:          [2020, 2050, 2080, 2120, 2090],
            revenueShare:     [40.2, 40.5, 40.8, 41.2, 41.8],
            avgRevenue:       [319, 321, 324, 328, 322],
            yoyGrowth:        [3.2, 3.5, 3.8, 4.2, 3.5],
            compSales:        [2.2, 2.5, 2.8, 3.2, 2.5],
            satisfactionScore:[78, 79, 79, 80, 80],
            churnRate:        [4.2, 4.1, 4.0, 3.9, 3.8],
            digitalAdoption:  [52, 55, 58, 61, 64],
        },
        {
            clusterName: 'Connected Care',
            clusterType: 'business' as const,
            // Fastest-growing segment; Alaris infusion pumps, Pyxis dispensing, informatics
            // ~4,200 health system accounts; ~$820M-$880M/quarter; accelerating post-consent decree
            storeCount:       [4050, 4100, 4140, 4180, 4200],
            revenue:          [810, 830, 845, 860, 880],
            revenueShare:     [16.1, 16.4, 16.6, 16.7, 17.6],
            avgRevenue:       [200, 202, 204, 206, 210],
            yoyGrowth:        [7.8, 8.2, 9.5, 8.9, 10.5],
            compSales:        [5.8, 6.2, 7.5, 6.9, 8.5],
            satisfactionScore:[75, 76, 77, 78, 80],
            churnRate:        [3.8, 3.6, 3.5, 3.4, 3.2],
            digitalAdoption:  [68, 71, 74, 77, 80],
        },
        {
            clusterName: 'BioPharma Systems',
            clusterType: 'business' as const,
            // Prefilled syringes, drug containers, delivery components for pharma mfrs
            // ~1,800 pharma manufacturer customers globally; China VoBP headwind accelerating
            storeCount:       [1780, 1790, 1800, 1805, 1800],
            revenue:          [1150, 1120, 1080, 1090, 1050],
            revenueShare:     [22.9, 22.1, 21.2, 21.2, 21.0],
            avgRevenue:       [646, 626, 600, 604, 583],
            yoyGrowth:        [3.8, 2.5, -1.2, -2.8, -8.8],
            compSales:        [2.8, 1.5, -2.2, -3.8, -9.8],
            satisfactionScore:[82, 82, 81, 80, 79],
            churnRate:        [2.8, 2.9, 3.1, 3.2, 3.5],
            digitalAdoption:  [72, 74, 76, 78, 80],
        },
        {
            clusterName: 'Interventional',
            clusterType: 'consumer' as const,
            // Surgery, peripheral intervention, urology — procedure-enabling devices
            // ~3,500 hospital/ASC accounts; ~$650-672M/quarter; steady above-market growth
            storeCount:       [3380, 3420, 3460, 3490, 3500],
            revenue:          [640, 655, 660, 668, 672],
            revenueShare:     [12.7, 12.9, 12.9, 13.0, 13.4],
            avgRevenue:       [189, 191, 191, 191, 192],
            yoyGrowth:        [5.8, 6.2, 6.8, 6.8, 6.8],
            compSales:        [4.8, 5.2, 5.8, 5.8, 5.8],
            satisfactionScore:[80, 81, 81, 82, 83],
            churnRate:        [3.5, 3.4, 3.3, 3.2, 3.1],
            digitalAdoption:  [58, 61, 64, 67, 70],
        },
        {
            clusterName: 'US Geography',
            clusterType: 'business' as const,
            // Domestic US; ~40% of BD revenue; Alaris re-commercialization + Pyxis share gains
            // ~8,500 hospital/ASC/pharma accounts
            storeCount:       [8280, 8340, 8400, 8450, 8500],
            revenue:          [2020, 2060, 2090, 2120, 2140],
            revenueShare:     [40.2, 40.7, 41.0, 41.2, 42.8],
            avgRevenue:       [244, 247, 249, 251, 252],
            yoyGrowth:        [5.2, 5.8, 6.2, 5.8, 5.0],
            compSales:        [4.2, 4.8, 5.2, 4.8, 4.0],
            satisfactionScore:[79, 80, 80, 81, 82],
            churnRate:        [3.8, 3.7, 3.6, 3.5, 3.4],
            digitalAdoption:  [62, 65, 68, 71, 74],
        },
        {
            clusterName: 'EMEA Region',
            clusterType: 'business' as const,
            // Europe, Middle East, Africa; ~27% of BD revenue; stable growth; FX headwind
            // ~5,200 hospital/pharma accounts across 50+ countries
            storeCount:       [5080, 5120, 5160, 5190, 5200],
            revenue:          [1360, 1380, 1395, 1410, 1400],
            revenueShare:     [27.0, 27.2, 27.4, 27.4, 28.0],
            avgRevenue:       [268, 269, 270, 272, 269],
            yoyGrowth:        [5.0, 5.5, 5.8, 5.5, 4.8],
            compSales:        [4.0, 4.5, 4.8, 4.5, 3.8],
            satisfactionScore:[77, 78, 78, 79, 79],
            churnRate:        [4.2, 4.1, 4.0, 3.9, 3.8],
            digitalAdoption:  [58, 61, 64, 67, 70],
        },
        {
            clusterName: 'Asia Pacific ex-China',
            clusterType: 'consumer' as const,
            // Japan, Australia, India, Southeast Asia; ~18% of revenue; India-led growth
            // ~3,100 accounts; growing faster than corporate average ex-China
            storeCount:       [3020, 3050, 3080, 3100, 3100],
            revenue:          [910, 930, 945, 958, 970],
            revenueShare:     [18.1, 18.4, 18.5, 18.6, 19.4],
            avgRevenue:       [301, 305, 307, 309, 313],
            yoyGrowth:        [7.8, 8.5, 9.2, 8.8, 8.0],
            compSales:        [5.8, 6.5, 7.2, 6.8, 6.0],
            satisfactionScore:[76, 77, 78, 78, 79],
            churnRate:        [4.5, 4.4, 4.3, 4.2, 4.1],
            digitalAdoption:  [48, 51, 54, 57, 60],
        },
        {
            clusterName: 'China Region',
            clusterType: 'consumer' as const,
            // China; ~10% of revenue pre-VoBP; VoBP pricing resets accelerating headwind
            // ~2,400 accounts; declining revenue per account; mix shift toward premium
            storeCount:       [2450, 2440, 2420, 2400, 2380],
            revenue:          [295, 285, 256, 238, 215],
            revenueShare:     [5.9, 5.6, 5.0, 4.6, 4.3],
            avgRevenue:       [120, 117, 106, 99, 90],
            yoyGrowth:        [-2.1, -4.5, -9.8, -14.2, -18.8],
            compSales:        [-3.1, -5.5, -10.8, -15.2, -19.8],
            satisfactionScore:[71, 70, 69, 68, 68],
            churnRate:        [5.2, 6.1, 7.8, 9.2, 10.5],
            digitalAdoption:  [65, 67, 69, 71, 73],
        },
    ];

    const clusterData = [];
    for (const seg of segmentClusters) {
        for (let qi = 0; qi < quarters.length; qi++) {
            const periodRecord = allPeriods[quarters[qi]];
            if (!periodRecord) continue;
            clusterData.push({
                companyId,
                periodId: periodRecord.id,
                clusterName: seg.clusterName,
                storeCount: seg.storeCount[qi],
                pctOfPortfolio: seg.revenueShare[qi],
                avgRevenue: seg.avgRevenue[qi],
                avgTicket: 0,
                avgDailyTxns: 0,
                compSales: seg.compSales[qi],
                operatingMargin: 0,
                rewardsPct: 0,
                mobileOrderPct: 0,
                laborCostPct: 0,
            });
        }
    }

    await prisma.storeCluster.createMany({ data: clusterData });
    console.log(`  ✓ ${clusterData.length} StoreCluster (SegmentCluster) records`);

    // =========================================================================
    // TABLE 3: ElasticityFactor — 25 records
    // Key BD medtech revenue, margin, and strategic elasticity relationships
    // =========================================================================

    const elasticityData = [
        {
            companyId,
            metricA: 'China VoBP Pricing Reset (% discount to prior list price)',
            metricB: 'BioPharma Systems China Revenue ($M annual impact)',
            segment: 'BD — BioPharma Systems (China)',
            elasticity: -18.0,
            elasticityUnit: '$M annual BioPharma Systems revenue reduction per 10% VoBP discount',
            confidence: 0.88,
            explanation: 'Each 10% VoBP pricing discount applied to BD BioPharma Systems products in China = approximately -$18M annual revenue impact on China BioPharma Systems. Q2 FY26 China VoBP discounts of 40-60% vs. prior list prices imply approximately -$72-$108M annual BioPharma Systems China revenue reduction vs. pre-VoBP baseline. China represented approximately $480M of annual BioPharma Systems revenue pre-VoBP; at -40% average pricing reset, steady-state revenue is approximately $290M — a structural $190M reduction from peak.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'FX Headwind to Organic Growth (bps reported vs FXN)',
            metricB: 'BD Adjusted EPS Impact ($ per share)',
            segment: 'BD Consolidated (International)',
            elasticity: -0.04,
            elasticityUnit: '$/share adjusted EPS per 100bps FX headwind on revenue',
            confidence: 0.90,
            explanation: 'Each 100bps of FX headwind (reported vs. FXN organic growth) reduces BD adjusted EPS by approximately -$0.04/share. BD generates approximately 58% of revenue internationally. Q2 FY26 FX headwind of -220bps vs. -150bps plan = additional -70bps = approximately -$0.03/share EPS vs. plan from currency alone. EUR/USD is the most significant currency pair (Europe ~27% of revenue); 5-cent EUR move = approximately -100bps FX headwind = -$0.04/share EPS.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'BD Alaris Remediation Completion (% of US installed base)',
            metricB: 'Connected Care Re-commercialization Revenue Recovery ($M annual)',
            segment: 'BD — Connected Care',
            elasticity: 8.5,
            elasticityUnit: '$M annual Connected Care revenue recovery per 1% additional remediation completion',
            confidence: 0.85,
            explanation: 'Each additional 1% of the Alaris US installed base remediated = approximately $8.5M incremental annual Connected Care revenue recovery as previously restricted marketing activities resume and new hospital accounts can be re-engaged. Full consent decree closure (95-100% remediation) = potential $120-180M annual revenue above current restricted-marketing baseline. At 78% remediated as of Q2 FY26, BD is approximately $185M below the full re-commercialization revenue potential achievable at consent decree closure.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'Organic Revenue Growth (% FXN)',
            metricB: 'BD Adjusted EPS ($)',
            segment: 'BD Consolidated',
            elasticity: 0.055,
            elasticityUnit: '$/share adjusted EPS per 100bps organic revenue growth',
            confidence: 0.92,
            explanation: '+100bps of FXN organic revenue growth = approximately +$0.055/share adjusted EPS (assuming approximately 25% flow-through to operating income and 15% effective tax rate on 263M diluted shares). BD Q2 FY26 organic growth of +2.6% FXN — each 100bps improvement toward the BD long-term target of +5-6% FXN = approximately +$0.055/share EPS. The full recovery from current 2.6% to 5.0% would add approximately +$0.13/share EPS above current trajectory.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'Adjusted Operating Margin Improvement (bps)',
            metricB: 'BD Adjusted EPS ($)',
            segment: 'BD Consolidated',
            elasticity: 0.0053,
            elasticityUnit: '$/share adjusted EPS per 10bps adjusted operating margin improvement',
            confidence: 0.94,
            explanation: 'Each 10bps improvement in BD adjusted operating margin = approximately +$0.005/share adjusted EPS on approximately $20B revenue base at 15% effective tax rate and 263M diluted shares. Q2 FY26 adj op margin of 24.2% vs. 25.3% prior year (-110bps) = approximately -$0.058/share YoY from margin compression alone. Management target of 25.0%+ by FY26 year-end (+80bps from Q2) = approximately +$0.042/share H2 contribution from margin recovery.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'R&D Spend (% of revenue)',
            metricB: 'Organic Revenue Growth Pipeline Contribution (%, 5-year forward)',
            segment: 'BD Consolidated — R&D',
            elasticity: 0.8,
            elasticityUnit: '% organic growth contribution per 100bps R&D intensity increase (5-yr lag)',
            confidence: 0.72,
            explanation: '+100bps of R&D as a % of revenue, sustained for 3 years, generates approximately +80bps of incremental organic revenue growth contribution 5 years forward (based on BD historical R&D productivity from FY15-FY25 and industry benchmarks). BD R&D at 6.8% of revenue in Q1 FY26 vs. 6.0% average FY20-FY24 = approximately +80bps additional growth contribution by FY29-FY30. The key uncertainty is clinical/regulatory success rate (BD historical medtech FDA clearance rate: approximately 78% for PMA/510k submissions).',
            period: 'Q1 FY26',
        },
        {
            companyId,
            metricA: 'Net Debt to EBITDA Ratio (x)',
            metricB: 'Annual Interest Expense ($M)',
            segment: 'BD Consolidated',
            elasticity: 118.0,
            elasticityUnit: '$M additional interest per 0.1x leverage increase on $11.8B net debt',
            confidence: 0.96,
            explanation: '+0.1x net leverage = approximately +$118M annual interest expense at BD\'s $11.8B net debt and 5.0-5.2% weighted average interest rate. Q2 FY26 leverage of 2.9x vs. 2.5x target = $400M excess debt × 5.1% = approximately +$20M additional annual interest vs. target. Each $500M of debt repayment at 5.1% coupon saves approximately $25.5M annual interest = approximately $0.07/share EPS. Deleveraging to 2.5x from 2.9x requires approximately $800M additional net debt reduction — achievable from H2 FY26 free cash flow.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'Pricing Contribution to Organic Growth (bps)',
            metricB: 'Adjusted Gross Margin (bps improvement)',
            segment: 'BD Consolidated',
            elasticity: 0.8,
            elasticityUnit: 'bps gross margin improvement per 100bps pricing contribution',
            confidence: 0.88,
            explanation: '+100bps of net price realization in organic growth = approximately +80bps gross margin improvement (assuming pricing flows through at approximately 80% margin rate as it is captured before variable cost uplift). BD Q3 FY25 +220bps pricing = approximately +176bps gross margin contribution, partially offset by raw material inflation (-120bps). Pricing is the highest-quality organic growth driver — pure margin contribution vs. volume growth which carries variable cost dilution.',
            period: 'Q3 FY25',
        },
        {
            companyId,
            metricA: 'China Revenue Mix (% of BD Total Revenue)',
            metricB: 'Consolidated Organic Revenue Growth (bps)',
            segment: 'BD Consolidated — China Exposure',
            elasticity: -1.0,
            elasticityUnit: 'bps consolidated organic growth per 1% China as % of total revenue at -10% China growth rate',
            confidence: 0.90,
            explanation: 'At a China organic revenue decline of -10% FXN, each 1% of China revenue as a share of total BD revenue = approximately -10bps of consolidated organic growth headwind. China currently approximately 5-6% of BD revenue → -10% China growth = approximately -50 to -60bps consolidated organic headwind. As China revenue mix declines from VoBP attrition, this structural headwind diminishes. Each $100M of China revenue reduction (from volume or pricing) at 10% negative growth removes approximately -5bps of consolidated organic growth headwind.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'GLP-1 Drug Delivery Component Demand Growth (%)',
            metricB: 'BioPharma Systems Revenue Growth (bps contribution)',
            segment: 'BD — BioPharma Systems (GLP-1)',
            elasticity: 25.0,
            elasticityUnit: 'bps BioPharma Systems revenue growth per 10% GLP-1 component demand increase',
            confidence: 0.82,
            explanation: '+10% GLP-1 drug delivery component demand growth = approximately +250bps of BioPharma Systems organic revenue growth contribution. BD holds estimated 35-40% share of prefilled pen and autoinjector component supply to Novo Nordisk and Eli Lilly. Q2 FY25 GLP-1 component revenue of approximately $120M growing at +28% = +700bps of BioPharma growth offset to China VoBP headwind. GLP-1 component demand is expected to grow 20-25% annually through FY28 as global obesity indication penetration expands.',
            period: 'Q2 FY25',
        },
        {
            companyId,
            metricA: 'US Hospital Capital Spending Growth (%)',
            metricB: 'BD Connected Care and Interventional Revenue Growth (bps)',
            segment: 'BD — Connected Care / Interventional',
            elasticity: 35.0,
            elasticityUnit: 'bps revenue growth per 1% US hospital capital spending increase',
            confidence: 0.80,
            explanation: '+1% US hospital capital spending growth = approximately +35bps of BD Connected Care + Interventional combined revenue growth, reflecting BD\'s significant exposure to hospital capital budgets through infusion pump, dispensing cabinet, and surgical equipment sales. 2025 AHA survey showed US hospital capital spending +4.2% YoY — consistent with +6.8% Connected Care growth observed. Recession risk (hospital budget tightening) represents the primary domestic demand risk for the capital equipment portions of BD\'s portfolio.',
            period: 'Q1 FY26',
        },
        {
            companyId,
            metricA: 'Pyxis MedStation Market Share Change (bps)',
            metricB: 'Connected Care Annual Revenue Impact ($M)',
            segment: 'BD — Connected Care (Pyxis)',
            elasticity: 0.85,
            elasticityUnit: '$M annual revenue per 10bps US ADC market share gain',
            confidence: 0.84,
            explanation: 'Each 10bps of US automated dispensing cabinet (ADC) market share gain = approximately $0.85M incremental annual Connected Care revenue ($8.5B estimated US ADC market at retail list; BD approximately 42% share). BD Q2 FY25 market share increased to 42.1% from 40.8% YoY = +130bps = approximately +$11M annual revenue. Full recovery to pre-consent decree 44% share = +290bps = approximately +$25M additional annual revenue at current market size. ADC switching costs are high (5-7 year replacement cycles, pharmacy workflow integration) — share once gained is highly durable.',
            period: 'Q2 FY25',
        },
        {
            companyId,
            metricA: 'BD Alaris Remediation Annual COGS Charge ($M)',
            metricB: 'BD Adjusted Operating Margin (bps per $100M charge)',
            segment: 'BD — Connected Care / Regulatory',
            elasticity: -50.0,
            elasticityUnit: 'bps adjusted operating margin drag per $100M remediation COGS charge (if included in adj. metrics)',
            confidence: 0.92,
            explanation: '$100M of BD Alaris remediation COGS charges = approximately -50bps adjusted operating margin drag (on approximately $20B revenue base). The $160M budgeted FY26 remediation charge creates approximately -80bps of gross margin headwind that is reflected in adjusted operating margin guidance. At consent decree closure (FY27 expected), the approximately $160M annual remediation cost ceases, providing approximately +80bps gross margin recovery = approximately +$0.46/share EPS tailwind in FY27 from cost abatement alone.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'Share Repurchase Annual Spend ($B)',
            metricB: 'Diluted Share Count Reduction (M shares per year)',
            segment: 'BD Consolidated — Capital Allocation',
            elasticity: -9.5,
            elasticityUnit: 'M share reduction per $1B annual buyback at ~$215/share average price',
            confidence: 0.95,
            explanation: '$1B of annual share repurchases at approximately $215/share = approximately 4.7M shares retired, reducing BD\'s approximately 263M diluted share count by approximately 1.8% annually. BD FY25 buyback pace of approximately $1.8B = approximately 8.4M share reduction = approximately 3.2% annual dilution offset. Each 1% diluted share count reduction = approximately +$0.13/share adjusted EPS accretion (at $13.90 midpoint EPS). The compounding effect of buybacks makes share repurchase the most efficient per-dollar EPS accretion lever below 2.5x leverage.',
            period: 'Q2 FY25',
        },
        {
            companyId,
            metricA: 'Emerging Markets Revenue Growth (%)',
            metricB: 'BD International Revenue Mix Improvement (bps China offset)',
            segment: 'BD — International (Emerging Markets)',
            elasticity: 8.0,
            elasticityUnit: 'bps China headwind offset per 100bps emerging market growth outperformance vs. plan',
            confidence: 0.78,
            explanation: 'Each 100bps of emerging markets outperformance vs. plan (at current approximately 12% emerging market revenue mix) = approximately 8bps of China headwind offset to consolidated organic growth (emerging markets at 12% mix vs. China at approximately 6%). India (+15% FXN), Middle East (+11%), Latin America (+7%) collectively at +10.5% FXN growth vs. 9% plan = approximately +150bps outperformance = approximately +12bps consolidated organic growth offset. Emerging market strategy provides structural diversification from China VoBP and US hospital cycle risks.',
            period: 'Q3 FY25',
        },
        {
            companyId,
            metricA: 'Interventional Segment Revenue Growth (% FXN)',
            metricB: 'BD Consolidated Adjusted Operating Margin (bps)',
            segment: 'BD — Interventional',
            elasticity: 2.5,
            elasticityUnit: 'bps consolidated adj op margin improvement per 100bps Interventional organic growth',
            confidence: 0.80,
            explanation: '+100bps Interventional FXN organic growth = approximately +2.5bps consolidated adjusted operating margin (Interventional approximately 2.5% of consolidated revenue per 100bps growth; Interventional segment margin approximately 23% vs. consolidated approximately 24.2% — favorable mix at this margin level). Interventional growing at +6-7% FXN (300-400bps above corporate average) contributes approximately +7.5-10bps annual margin mix benefit to consolidated results, partially offsetting the unfavorable BioPharma Systems mix from China VoBP.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'BD Manufacturing Productivity (BD Excellence program savings $M)',
            metricB: 'Adjusted Gross Margin (bps annual improvement)',
            segment: 'BD Consolidated — Manufacturing',
            elasticity: 0.5,
            elasticityUnit: 'bps gross margin per $10M annual manufacturing productivity savings',
            confidence: 0.85,
            explanation: '$10M of annual manufacturing productivity savings from BD Excellence lean/continuous improvement initiatives = approximately +5bps adjusted gross margin (on approximately $20B revenue). BD Excellence program targets $200-250M annual productivity savings by FY27 (up from approximately $150M in FY25) — contributing approximately +10-12.5bps annual gross margin improvement from operations. Productivity gains are highest in Medical Essentials and BioPharma Systems manufacturing, where scale enables standardization benefits.',
            period: 'Q4 FY25',
        },
        {
            companyId,
            metricA: 'FX-Neutral Organic Revenue Growth vs. Reported Revenue Growth (bps gap)',
            metricB: 'Reported Adjusted EPS Growth vs. FXN Adjusted EPS Growth (bps gap)',
            segment: 'BD Consolidated — FX Translation',
            elasticity: 0.45,
            elasticityUnit: 'bps reported EPS growth dilution per 100bps FX organic-vs-reported gap',
            confidence: 0.88,
            explanation: 'A 100bps gap between FXN organic growth and reported revenue growth (FX headwind) translates to approximately 45bps of reported EPS growth dilution vs. FXN EPS growth (at approximately 58% international revenue mix and 78% operating income conversion of international revenue). Q2 FY26 FX headwind of -220bps on revenue = approximately -100bps of reported adjusted EPS growth vs. FXN EPS growth. Full-year FY26 guidance includes -200 to -250bps FX headwind on revenue = approximately -90 to -110bps reported vs. FXN EPS growth dilution.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'Waters Medical Systems Spin-Off Revenue Removal ($B annual)',
            metricB: 'BD Pro Forma Adjusted Operating Margin (bps improvement)',
            segment: 'BD Consolidated — Portfolio Optimization',
            elasticity: 50.0,
            elasticityUnit: 'bps adj op margin improvement per $1B of lower-margin business removed via spin-off',
            confidence: 0.82,
            explanation: 'The Waters Medical Systems spin-off removed approximately $2.2B of annual revenue at approximately 18-20% adjusted operating margin vs. BD consolidated approximately 24-25%. Removing $2.2B of 18-20% margin revenue from a approximately $22B base improves blended margin by approximately 30-40bps mechanically. The full portfolio realization of the spin-off is estimated at approximately +200-300bps adjusted operating margin improvement by FY27-FY29 as integration savings, focused R&D, and commercial efficiency benefits compound into the leaner post-spin BD structure.',
            period: 'Q1 FY26',
        },
        {
            companyId,
            metricA: 'BD Alaris Consent Decree Closure (binary event: 0 = open, 1 = closed)',
            metricB: 'Connected Care Annual Revenue Uplift ($M)',
            segment: 'BD — Connected Care / Regulatory',
            elasticity: 180.0,
            elasticityUnit: '$M annual Connected Care revenue unlocked at consent decree closure',
            confidence: 0.75,
            explanation: 'BD Alaris consent decree closure (expected Q4 FY26 / Q1 FY27) is estimated to unlock approximately $180M of annual Connected Care revenue currently restricted by marketing limitations, hospital account restrictions, and brand perception overhang. At consent decree closure: (1) BD can actively market to all US hospital accounts without restriction; (2) GPO contract restrictions associated with the consent decree are removed; (3) brand perception recovery as the "consent decree resolved" message replaces the "unresolved compliance issue" perception. The $180M estimate is based on the approximately 25% of US hospitals that BD classifies as "consent decree-constrained accounts" and the average Connected Care revenue per account of approximately $210K annually.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'International Pricing Power vs. Local Inflation (% net real price)',
            metricB: 'EMEA Adjusted Operating Margin (bps)',
            segment: 'BD — International (EMEA)',
            elasticity: 15.0,
            elasticityUnit: 'bps EMEA margin per 100bps real pricing above local inflation',
            confidence: 0.78,
            explanation: 'Each 100bps of BD pricing realization above local market inflation (net real price) in EMEA = approximately +15bps EMEA adjusted operating margin (at approximately 25% EMEA contribution margin). Germany, France, and the UK all implement reference pricing mechanisms that cap branded medical device annual pricing increases; BD typically achieves 0-2% net real pricing in EU due to HTA pricing constraints, vs. +2-3% in the US. The pricing gap between US (+2.5% real) and EU (0.5% real) is a structural margin dilution driver for EMEA operations.',
            period: 'Q4 FY25',
        },
        {
            companyId,
            metricA: 'BD Dividend Annual Per Share Growth (%)',
            metricB: 'Free Cash Flow Payout Ratio (%)',
            segment: 'BD Consolidated — Capital Return',
            elasticity: 0.4,
            elasticityUnit: '% FCF payout ratio change per 1% annual dividend growth (at $2.6B FCF guidance)',
            confidence: 0.92,
            explanation: '+1% annual dividend growth = approximately +0.4% FCF payout ratio at BD\'s $2.6B FY26 FCF guidance midpoint and approximately $1.0B annual dividend cost. BD targets approximately 35-40% FCF payout ratio through FY28. Current yield approximately 1.8% at approximately $215/share with $3.80 annualized dividend. 52-year consecutive annual dividend growth streak requires maintaining increases even at moderate FCF; the planned 4-5% annual growth pace maintains FCF payout within the target range while preserving capital for debt reduction and buybacks.',
            period: 'Q2 FY25',
        },
        {
            companyId,
            metricA: 'Omnicell / Baxter Competitor Market Share (US ADC + infusion)',
            metricB: 'BD Connected Care Revenue at Risk ($M)',
            segment: 'BD — Connected Care (Competitive)',
            elasticity: -8.5,
            elasticityUnit: '$M BD Connected Care revenue at risk per 100bps competitor share gain',
            confidence: 0.74,
            explanation: 'Each 100bps of competitor ADC/infusion market share gain (by Omnicell or Baxter Sigma Spectrum) = approximately -$8.5M BD Connected Care revenue at risk through account displacement or new account loss. BD\'s Alaris consent decree created a multi-year window where Baxter gained approximately 300bps of infusion pump market share (2021-2024). At consent decree closure, BD begins the process of recapturing approximately 2-3% of displaced market share = approximately +$170-255M additional annual Connected Care revenue opportunity over FY27-FY30.',
            period: 'Q2 FY26',
        },
        {
            companyId,
            metricA: 'mRNA Vaccine Production Volumes (global dose index)',
            metricB: 'BD Prefilled Syringe and Vial Closure Revenue ($M quarterly)',
            segment: 'BD — BioPharma Systems (Vaccines)',
            elasticity: 0.15,
            elasticityUnit: '$M quarterly BioPharma revenue per 1% global mRNA vaccine dose production growth',
            confidence: 0.70,
            explanation: '+1% global mRNA vaccine dose production = approximately +$0.15M quarterly BD BioPharma Systems revenue from prefilled syringe and vial closure demand. mRNA vaccine production declined approximately 45% in 2023-2024 from the 2021-2022 COVID peak, creating a $80-100M annual headwind to BD BioPharma Systems vs. peak levels. Recovery of mRNA vaccine demand to 2022 levels (driven by seasonal COVID boosters, flu, RSV, new oncology applications) could add approximately $60-80M BioPharma annual revenue. The GLP-1 component demand partially offsets this headwind structurally.',
            period: 'Q3 FY25',
        },
        {
            companyId,
            metricA: 'BD Enterprise Diagnostics Revenue Growth (% FXN)',
            metricB: 'Medical Essentials Segment Revenue Mix Improvement (bps)',
            segment: 'BD — Medical Essentials (Diagnostics)',
            elasticity: 0.8,
            elasticityUnit: 'bps Medical Essentials mix improvement per 100bps diagnostics growth above segment average',
            confidence: 0.76,
            explanation: 'BD Enterprise Diagnostics (lab automation, molecular diagnostics, BD MAX) growing 100bps above the Medical Essentials segment average = approximately +0.8bps Medical Essentials gross margin mix improvement, as diagnostic instruments and reagents carry approximately 60-65% gross margin vs. 48-52% for medical consumables. BD diagnostics grew +6.2% FXN in FY25 vs. Medical Essentials +4.2% = +200bps outperformance = approximately +1.6bps segment gross margin annual mix improvement, contributing modestly to the BD consolidated gross margin expansion trajectory.',
            period: 'Q4 FY25',
        },
    ];

    await prisma.elasticityFactor.createMany({
        data: elasticityData.map((item: Record<string, unknown>) => ({
            companyId: item.companyId,
            driverMetric: item.metricA,
            impactedMetric: item.metricB,
            elasticity: item.elasticity as number,
            elasticityUnit: item.elasticityUnit,
            direction: (item.elasticity as number) >= 0 ? 'positive' : 'negative',
            confidence: item.confidence,
            description: item.explanation,
            segment: item.segment,
        })),
    });
    console.log(`  ✓ ${elasticityData.length} ElasticityFactor records`);

    // =========================================================================
    // TABLE 4: CompetitorQuarterlyMetric — 100 records
    // 5 competitors × 5 quarters × 4 metrics
    // Quarters: Q1 FY25 through Q1 FY26 (BD fiscal periods)
    // Metric names must match database filters exactly
    // =========================================================================

    const competitorDefs = [
        {
            // Medtronic — largest diversified medtech; cardiac, neuromodulation, surgical robotics
            // Closest large-cap peer; directly competes in infusion therapy and surgical specialties
            name: 'Medtronic (MDT)',
            revenue:          [7980, 8020, 8060, 8100, 8100],
            adjEps:           [1.30, 1.32, 1.34, 1.36, 1.35],
            adjOpMargin:      [23.5, 23.8, 24.0, 24.2, 24.0],
            organicGrowth:    [4.5, 4.2, 4.8, 4.2, 3.5],
        },
        {
            // Abbott — diversified medtech + diagnostics + nutrition; direct BDX competitor
            // Competes in diagnostics, vascular, diabetes care; margin profile similar to BD
            name: 'Abbott (ABT)',
            revenue:          [5560, 5620, 5680, 5730, 5700],
            adjEps:           [1.03, 1.06, 1.09, 1.12, 1.09],
            adjOpMargin:      [21.5, 21.8, 22.0, 22.2, 22.0],
            organicGrowth:    [6.5, 7.0, 7.5, 6.8, 5.5],
        },
        {
            // Stryker — orthopedics, surgical robotics, instruments; Mako robotic platform
            // Competes in surgical and interventional categories; higher growth and margin than BD
            name: 'Stryker (SYK)',
            revenue:          [5380, 5580, 5800, 6200, 5800],
            adjEps:           [3.38, 3.50, 3.60, 4.10, 3.60],
            adjOpMargin:      [25.5, 25.8, 26.0, 26.5, 26.0],
            organicGrowth:    [10.2, 10.5, 11.0, 10.8, 8.5],
        },
        {
            // Boston Scientific — interventional cardiology, electrophysiology, urology
            // High-growth medtech; strong WATCHMAN, Farapulse, and Axis platforms
            name: 'Boston Scientific (BSX)',
            revenue:          [4080, 4180, 4300, 4420, 4300],
            adjEps:           [0.62, 0.65, 0.69, 0.73, 0.69],
            adjOpMargin:      [26.5, 27.2, 28.0, 28.5, 28.0],
            organicGrowth:    [14.5, 14.8, 16.0, 15.5, 12.0],
        },
        {
            // Baxter — infusion pumps (Sigma Spectrum), IV solutions, renal care
            // Most direct Alaris competitor; IV solutions and infusion systems overlap directly
            name: 'Baxter (BAX)',
            revenue:          [2840, 2870, 2900, 2930, 2900],
            adjEps:           [0.34, 0.36, 0.38, 0.40, 0.38],
            adjOpMargin:      [13.5, 13.8, 14.0, 14.2, 14.0],
            organicGrowth:    [3.0, 3.2, 3.5, 3.2, 2.5],
        },
    ];

    const competitorMetrics = [
        { name: 'Total Revenue',             unit: '$M',     getData: (c: typeof competitorDefs[0], qi: number) => c.revenue[qi] },
        { name: 'Adjusted EPS',              unit: '$/share',getData: (c: typeof competitorDefs[0], qi: number) => c.adjEps[qi] },
        { name: 'Adjusted Operating Margin', unit: '%',      getData: (c: typeof competitorDefs[0], qi: number) => c.adjOpMargin[qi] },
        { name: 'Organic Revenue Growth',    unit: '% FXN',  getData: (c: typeof competitorDefs[0], qi: number) => c.organicGrowth[qi] },
    ];

    const competitorData = [];
    for (const comp of competitorDefs) {
        for (let qi = 0; qi < quarters.length; qi++) {
            const periodRecord = allPeriods[quarters[qi]];
            if (!periodRecord) continue;

            for (const metric of competitorMetrics) {
                const value = metric.getData(comp, qi);
                const baseValue = metric.getData(comp, 0); // Q1 FY25 baseline
                const yoyChange = baseValue !== 0
                    ? parseFloat(((value - baseValue) / Math.abs(baseValue) * 100).toFixed(1))
                    : 0;

                competitorData.push({
                    companyId,
                    periodId: periodRecord.id,
                    competitorName: comp.name,
                    metricName: metric.name,
                    value,
                    yoyChange,
                    unit: metric.unit,
                });
            }
        }
    }

    await prisma.competitorQuarterlyMetric.createMany({ data: competitorData });
    console.log(`  ✓ ${competitorData.length} CompetitorQuarterlyMetric records`);

    const total = weeklySnapshotData.length + clusterData.length + elasticityData.length + competitorData.length;
    console.log(`BD analytical data seeded: ${total} total records`);
}
