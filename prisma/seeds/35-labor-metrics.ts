import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 35: Labor Metrics — Becton, Dickinson and Company (BDX) Workforce by Function
//
// 6 workforce functions × 5 quarters (Q1 FY25 through Q1 FY26) = 30 records
//
// BD Fiscal Year: ends September 30
//   Q1 FY25 = Oct-Dec 2024
//   Q2 FY25 = Jan-Mar 2025
//   Q3 FY25 = Apr-Jun 2025
//   Q4 FY25 = Jul-Sep 2025
//   Q1 FY26 = Oct-Dec 2025
//
// BD total workforce: ~65,000 employees globally
//   Manufacturing & Operations:       ~25,000  (largest segment; Excellence Unleashed automation)
//   Field Sales & Clinical Support:   ~15,000  (Alaris specialists, GPO account mgrs)
//   Research & Development:           ~6,000   (Alaris next-gen, GLP-1 devices, BD Rowa Pro)
//   Supply Chain & Distribution:      ~8,000   (Excellence Unleashed optimization)
//   Corporate & Administrative:       ~7,000   (Waters spin-off removed ~800 FTE)
//   Quality & Regulatory Affairs:     ~4,000   (Alaris consent decree team ~350 FTE)
//
// Key Labor Themes FY26:
//   - Excellence Unleashed: automation reducing manufacturing headcount ~2%; SAE reduction
//   - Alaris consent decree: +350 Quality & Regulatory Affairs FTE for remediation team
//   - Waters spin-off (Feb 9, 2026): ~800 corporate FTE divested with Life Sciences segment
//   - TRIR target <0.4 for manufacturing; improving year over year
//   - GLP-1 syringe capacity expansion: ~200 FTE added in Pharmaceutical Systems FY26
// =============================================================================

export async function seedLaborMetrics(
    prisma: PrismaClient,
    companyId: number,
    allPeriods: Record<string, { id: number }>,
) {
    console.log('Seeding BD labor metrics by workforce function...');

    const quarters = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'];

    // Per-quarter arrays: [Q1 FY25, Q2 FY25, Q3 FY25, Q4 FY25, Q1 FY26]
    const workforceFunctions = [
        {
            // ~25,000 manufacturing employees across global BD facilities
            // Excellence Unleashed: automation reducing headcount ~2% over FY25-FY26
            // GLP-1 prefillable syringe capacity expansion adds ~200 FTE in Pharmaceutical Systems
            // TRIR improving toward <0.4 target; safety program investment ongoing
            // Manufacturing sites: US (NJ, MD, NC), Ireland, Singapore, Mexico
            storeId: 'manufacturing-operations',
            storeLabel: 'Manufacturing & Operations',
            region: 'Manufacturing & Operations',
            // headcount at quarter-end; slight reduction from Excellence Unleashed automation
            headcount:       [25200, 25100, 25000, 24800, 24600],
            avgWageRate:     [28.50, 28.80, 29.10, 29.40, 29.70],  // $/hr blended global manufacturing
            // Turnover improving with automation reducing repetitive manual tasks
            turnoverRate:    [9.5, 9.2, 8.8, 8.5, 8.2],
            // Hours per FTE per quarter; standard manufacturing shift schedule
            hoursPerStore:   [488, 480, 492, 490, 486],
            // OT moderate; Excellence Unleashed reducing peak demand volatility
            overtimePct:     [6.2, 5.8, 6.0, 5.5, 5.8],
            // Training elevated: Excellence Unleashed automation training + GLP-1 line qualification
            trainingHours:   [28, 30, 32, 34, 36],
            // Satisfaction improving as automation reduces manual burden
            partnerSatisfaction: [70, 71, 72, 73, 74],
        },
        {
            // ~15,000 field sales and clinical support employees
            // Alaris field specialist headcount maintained despite consent decree
            // GLP-1 pharma account managers added in BioPharma Systems
            // CRM digital tools reducing non-selling time
            storeId: 'field-sales-clinical',
            storeLabel: 'Field Sales & Clinical Support',
            region: 'Field Sales & Clinical Support',
            headcount:       [15200, 15100, 15050, 15000, 14900],
            avgWageRate:     [95000, 96500, 98000, 99500, 101000],  // $/yr blended base + incentive
            turnoverRate:    [8.5, 8.2, 7.8, 7.5, 7.2],
            // Standard field sales hours; clinical support on hospital schedule
            hoursPerStore:   [490, 482, 488, 486, 490],
            overtimePct:     [5.5, 5.0, 5.2, 5.8, 5.2],
            // Clinical protocol training + Alaris system training + digital sales tools
            trainingHours:   [45, 48, 50, 52, 55],
            // Satisfaction stable; field team aligned to mission-driven medtech purpose
            partnerSatisfaction: [74, 75, 76, 77, 77],
        },
        {
            // ~6,000 R&D employees; stable headcount with strategic talent additions
            // Key projects: Alaris next-gen software, BD Rowa Pro, GLP-1 device platforms
            // Competitive STEM talent market managed with equity compensation
            // FY26 R&D budget ~$1,000M
            storeId: 'research-development',
            storeLabel: 'Research & Development',
            region: 'Research & Development',
            headcount:       [5900, 5950, 6000, 6050, 6100],
            avgWageRate:     [125000, 127000, 129000, 131000, 133000],  // $/yr blended
            turnoverRate:    [6.5, 6.2, 5.8, 5.5, 5.2],
            // Standard professional hours; project milestones drive variability
            hoursPerStore:   [492, 485, 490, 488, 492],
            overtimePct:     [7.5, 7.0, 7.2, 8.0, 7.5],
            // CME, patent training, BD Innovation University, device regulatory science
            trainingHours:   [60, 62, 65, 68, 70],
            // High satisfaction; mission-driven innovation culture
            partnerSatisfaction: [78, 79, 80, 81, 80],
        },
        {
            // ~8,000 supply chain and distribution employees
            // Excellence Unleashed: supplier base consolidation from 3,200 to 2,800
            // Distribution center automation underway; cold-chain specialized training
            // Turnover higher than other segments due to distribution center nature
            storeId: 'supply-chain-distribution',
            storeLabel: 'Supply Chain & Distribution',
            region: 'Supply Chain & Distribution',
            headcount:       [8100, 8050, 8000, 7950, 7900],
            avgWageRate:     [58000, 58800, 59600, 60400, 61200],  // $/yr blended
            turnoverRate:    [14.5, 14.0, 13.5, 13.0, 12.5],
            // Distribution and logistics hours; some 24/7 shift operations
            hoursPerStore:   [488, 480, 485, 490, 488],
            // Q4 seasonal peak for BD fiscal year-end volume
            overtimePct:     [7.5, 6.5, 7.0, 10.5, 7.8],
            // Cold-chain, hazmat, supply chain optimization, TRIR safety training
            trainingHours:   [32, 34, 36, 38, 40],
            // Satisfaction moderate; improving with automation reducing physical strain
            partnerSatisfaction: [65, 66, 67, 68, 68],
        },
        {
            // ~7,000 corporate and administrative employees
            // Excellence Unleashed SAE reduction: corporate headcount -5% over FY25-FY26
            // Waters spin-off (Feb 9, 2026) eliminated ~800 corporate FTE
            // Digital finance tools reducing back-office cost
            storeId: 'corporate-admin',
            storeLabel: 'Corporate & Administrative',
            region: 'Corporate & Administrative',
            // Declining with Excellence Unleashed optimization and Waters separation
            headcount:       [7200, 7100, 7000, 6900, 6850],
            avgWageRate:     [105000, 107000, 109000, 111000, 113000],  // $/yr blended
            turnoverRate:    [7.5, 7.2, 6.8, 6.5, 6.2],
            hoursPerStore:   [492, 485, 488, 495, 490],
            // Q1 FY26 elevated OT: fiscal year-end close, proxy, Waters separation planning
            overtimePct:     [8.5, 7.0, 7.5, 10.2, 11.5],
            // Leadership development, compliance, ESG reporting, Excellence Unleashed change mgmt
            trainingHours:   [40, 42, 44, 46, 48],
            // Q1 FY26 slight dip from Waters separation restructuring uncertainty
            partnerSatisfaction: [70, 71, 72, 73, 68],
        },
        {
            // ~4,000 quality and regulatory affairs employees
            // Elevated headcount on Alaris consent decree remediation team (~350 additional FTE)
            // FDA interaction specialists; QMS modernization project
            // 78% remediation milestone reflects this team's work
            // Headcount expected to normalize post-consent decree resolution
            storeId: 'quality-regulatory',
            storeLabel: 'Quality & Regulatory Affairs',
            region: 'Quality & Regulatory Affairs',
            // Growing due to Alaris consent decree team; expected to normalize post-resolution
            headcount:       [3800, 3900, 4000, 4100, 4200],
            avgWageRate:     [115000, 117000, 119000, 121000, 123000],  // $/yr blended
            turnoverRate:    [5.5, 5.2, 4.8, 4.5, 4.2],
            // Standard regulatory professional hours; FDA inspection preparation drives variability
            hoursPerStore:   [490, 482, 488, 492, 490],
            // Elevated OT during FDA site inspections and consent decree milestone preparation
            overtimePct:     [8.0, 7.5, 8.5, 12.0, 9.5],
            // Regulatory science, quality systems, FDA compliance, Alaris remediation protocols
            trainingHours:   [80, 85, 88, 90, 92],
            // High satisfaction; critical mission on Alaris return to market
            partnerSatisfaction: [72, 73, 74, 75, 76],
        },
    ];

    const records = [];
    for (const fn of workforceFunctions) {
        for (let qi = 0; qi < quarters.length; qi++) {
            const periodRecord = allPeriods[quarters[qi]];
            if (!periodRecord) continue;
            records.push({
                companyId,
                periodId: periodRecord.id,
                region: fn.region,
                avgWageRate: fn.avgWageRate[qi],
                turnoverRate: fn.turnoverRate[qi],
                hoursPerStore: fn.hoursPerStore[qi],
                overtimePct: fn.overtimePct[qi],
                trainingHours: fn.trainingHours[qi],
                partnerSatisfaction: fn.partnerSatisfaction[qi],
            });
        }
    }

    await prisma.laborMetric.createMany({ data: records });
    console.log(`  ✓ ${records.length} LaborMetric records seeded for BD`);
}
