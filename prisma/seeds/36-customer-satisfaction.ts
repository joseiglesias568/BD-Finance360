import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 36: Customer Satisfaction — Becton, Dickinson and Company (BDX) by Segment
//
// 6 customer segments × 5 quarters (Q1 FY25 through Q1 FY26) = 30 records
//
// BD Fiscal Year: ends September 30
//   Q1 FY25 = Oct-Dec 2024  |  Q2 FY25 = Jan-Mar 2025
//   Q3 FY25 = Apr-Jun 2025  |  Q4 FY25 = Jul-Sep 2025
//   Q1 FY26 = Oct-Dec 2025
//
// Customer Segments:
//   1. IDN / Large Health Systems         — enterprise BD accounts; high-touch specialist support
//   2. Community Hospitals                — mid-size; distributor-served; pricing/availability drivers
//   3. BioPharma / Drug Manufacturer      — highest satisfaction; B2B supply relationships
//   4. GPO & Distributor Partners         — Cardinal Health, Medline, Owens & Minor
//   5. Government & Institutional (VA/DOD)— federal contract compliance; FSS program
//   6. Field Service & Technical Support  — post-sale service; Alaris preventive maintenance
//
// Key satisfaction themes FY26:
//   - Alaris satisfaction recovering as consent decree remediation progresses
//   - PureWick and diagnostics satisfaction consistently high
//   - GLP-1 syringe clients (BioPharma) especially satisfied with capacity commitments
//   - Service satisfaction slightly impacted by consent decree workload on field team
// =============================================================================

export async function seedCustomerSatisfaction(
    prisma: PrismaClient,
    companyId: number,
    allPeriods: Record<string, { id: number }>,
) {
    console.log('Seeding BD customer satisfaction metrics by segment...');

    const quarters = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'];

    // Per-quarter arrays: [Q1 FY25, Q2 FY25, Q3 FY25, Q4 FY25, Q1 FY26]
    const segments = [
        {
            productLine: 'IDN / Large Health Systems',
            // Enterprise BD accounts; high-touch clinical specialist support
            // Alaris satisfaction recovering; PureWick and diagnostics satisfaction high
            // Q1 FY26 stable: consent decree remediation progress communicated proactively
            npsScore:       [32, 33, 34, 35, 35],
            csatScore:      [74, 75, 76, 77, 77],
            // waitTimeSatisfaction: clinical support response time and order processing satisfaction
            waitTimeSatisfaction: [68, 70, 71, 72, 72],
            // orderAccuracy: order fulfillment accuracy rate (% error-free)
            orderAccuracy:  [98.5, 98.6, 98.7, 98.8, 98.8],
            sampleSize:     [850, 850, 850, 850, 850],
        },
        {
            productLine: 'Community Hospitals',
            // Mid-size hospitals; distributor-served mostly; satisfaction tracks product
            // availability and pricing; Alaris constraint period impacted scores
            npsScore:       [26, 27, 28, 29, 28],
            csatScore:      [70, 71, 72, 73, 72],
            // waitTimeSatisfaction: distributor order lead time and BD support responsiveness
            waitTimeSatisfaction: [62, 63, 65, 66, 65],
            // orderAccuracy: fill rate and order accuracy through distributor channel
            orderAccuracy:  [97.8, 97.9, 98.0, 98.1, 98.0],
            sampleSize:     [1200, 1200, 1200, 1200, 1200],
        },
        {
            productLine: 'BioPharma / Drug Manufacturer Clients',
            // Highest satisfaction segment; B2B supply relationships; delivery reliability >99.5% target
            // GLP-1 syringe clients especially satisfied with capacity commitment and supply chain
            npsScore:       [46, 47, 48, 50, 50],
            csatScore:      [82, 83, 84, 85, 86],
            // waitTimeSatisfaction: supply delivery on-time performance and technical support
            waitTimeSatisfaction: [88, 89, 90, 91, 92],
            // orderAccuracy: fill rate (>99.5% target) and quality compliance rate
            orderAccuracy:  [99.5, 99.6, 99.6, 99.7, 99.7],
            sampleSize:     [320, 320, 320, 320, 320],
        },
        {
            productLine: 'GPO & Distributor Partners',
            // Key distribution partners: Cardinal Health, Medline, Owens & Minor
            // Order fill rate >97%; pricing and contract flexibility key satisfaction drivers
            npsScore:       [30, 31, 32, 33, 33],
            csatScore:      [72, 73, 74, 75, 75],
            // waitTimeSatisfaction: order processing speed and logistics performance
            waitTimeSatisfaction: [70, 71, 72, 73, 73],
            // orderAccuracy: fill rate across GPO/distributor orders
            orderAccuracy:  [97.2, 97.4, 97.5, 97.6, 97.6],
            sampleSize:     [580, 580, 580, 580, 580],
        },
        {
            productLine: 'Government & Institutional (VA/DOD)',
            // Federal contract compliance; VA/DOD procurement satisfaction tracks on-time delivery
            // and regulatory compliance; FSS pricing program competitive
            npsScore:       [22, 23, 24, 25, 25],
            csatScore:      [68, 69, 70, 71, 71],
            // waitTimeSatisfaction: government procurement cycle time and compliance satisfaction
            waitTimeSatisfaction: [64, 65, 66, 67, 67],
            // orderAccuracy: federal contract fill rate and compliance accuracy
            orderAccuracy:  [98.8, 98.9, 99.0, 99.0, 99.0],
            sampleSize:     [480, 480, 480, 480, 480],
        },
        {
            productLine: 'Field Service & Technical Support',
            // Post-sale service satisfaction; BD service engineers
            // Alaris preventive maintenance; response time <4 hours for critical device calls
            // Satisfaction slightly impacted by consent decree workload on field service team
            npsScore:       [38, 39, 40, 41, 40],
            csatScore:      [80, 81, 82, 83, 82],
            // waitTimeSatisfaction: response time satisfaction for technical support calls
            waitTimeSatisfaction: [78, 79, 80, 81, 80],
            // orderAccuracy: service call resolution rate on first visit (%)
            orderAccuracy:  [94.5, 95.0, 95.5, 96.0, 95.5],
            sampleSize:     [2200, 2200, 2200, 2200, 2200],
        },
    ];

    const records = [];
    for (const seg of segments) {
        for (let qi = 0; qi < quarters.length; qi++) {
            const periodRecord = allPeriods[quarters[qi]];
            if (!periodRecord) continue;
            records.push({
                companyId,
                periodId: periodRecord.id,
                region: seg.productLine,
                npsScore: seg.npsScore[qi],
                csatScore: seg.csatScore[qi],
                waitTimeSatisfaction: seg.waitTimeSatisfaction[qi],
                orderAccuracy: seg.orderAccuracy[qi],
                sampleSize: seg.sampleSize[qi],
            });
        }
    }

    await prisma.customerSatisfaction.createMany({ data: records });
    console.log(`  ✓ ${records.length} CustomerSatisfaction records seeded for BD`);
}
