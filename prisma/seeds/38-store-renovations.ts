import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 38: Becton, Dickinson and Company (BDX) — Capital Investment Programs
//
// Reinterprets StoreRenovation as BD capital investment programs.
// 4 programs × 3 quarters (Q4 FY25, Q1 FY26, Q2 FY26) = 12 records
//
// BD Fiscal Year: ends September 30
//   Q4 FY25 = Jul-Sep 2025
//   Q1 FY26 = Oct-Dec 2025
//   Q2 FY26 = Jan-Mar 2026
//
// Programs:
//   1. Alaris Manufacturing Quality System Modernization  — consent decree remediation
//   2. Pharmaceutical Systems GLP-1 Capacity Expansion    — $180M new syringe lines
//   3. Excellence Unleashed Facility Optimization          — cost-out automation
//   4. BD Rowa Pro Pharmacy Automation Rollout             — European pharmacy robotics
//
// Unit convention (uses model fields 'storesComplete / storesInProgress / storesPlanned'):
//   Program 1: manufacturing cells/lines modernized
//   Program 2: production lines qualified/installed
//   Program 3: facility optimization projects completed
//   Program 4: hospital pharmacy installations completed
//
// avgCost: $K per unit
// avgRevenueUplift: % revenue increase per unit post-completion
// avgThroughputImprovement: % improvement in operational metric
// =============================================================================

export async function seedStoreRenovations(prisma: PrismaClient, companyId: number) {
    console.log('Seeding BD capital investment program milestones...');

    const programs = [
        // =====================================================================
        // PROGRAM 1: Alaris Manufacturing Quality System Modernization
        // Modernizing BD Alaris manufacturing quality systems as part of FDA consent
        // decree remediation; improving first-pass quality rates, traceability,
        // and manufacturing process controls at Alaris production facilities.
        // Segment: 'Connected Care'
        // Unit: manufacturing cells/lines with modernized quality systems
        // avgCost: $K per manufacturing cell (quality system upgrade, validation, qualification)
        // avgRevenueUplift: % revenue increase from restored market access post-remediation
        // avgThroughputImprovement: % improvement in manufacturing throughput/quality first-pass rate
        // =====================================================================
        {
            renovationType: 'Alaris Manufacturing Quality System Modernization',
            segment: 'Connected Care',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    storesComplete: 12,
                    storesInProgress: 18,
                    storesPlanned: 25,
                    totalTarget: 55,
                    completionPct: 21.8,
                    avgCost: 18500,           // $K per manufacturing cell modernization
                    avgRevenueUplift: 3.5,    // % revenue increase from restored market access
                    avgThroughputImprovement: 28.0, // % manufacturing throughput / quality first-pass rate improvement
                },
                {
                    quarterLabel: 'Q1 FY26',
                    storesComplete: 20,
                    storesInProgress: 15,
                    storesPlanned: 22,
                    totalTarget: 55,
                    completionPct: 36.4,
                    avgCost: 18500,
                    avgRevenueUplift: 3.5,
                    avgThroughputImprovement: 28.0,
                },
                {
                    quarterLabel: 'Q2 FY26',
                    storesComplete: 28,
                    storesInProgress: 12,
                    storesPlanned: 18,
                    totalTarget: 55,
                    completionPct: 50.9,
                    avgCost: 18500,
                    avgRevenueUplift: 3.5,
                    avgThroughputImprovement: 28.0,
                },
            ],
        },
        // =====================================================================
        // PROGRAM 2: Pharmaceutical Systems GLP-1 Capacity Expansion
        // New prefillable syringe production lines dedicated to GLP-1 drug delivery
        // for pharmaceutical manufacturer customers; $180M total capital investment;
        // 450M additional unit capacity annually at full build-out.
        // Segment: 'BioPharma Systems'
        // Unit: production lines qualified and in commercial operation
        // avgCost: $K per production line (equipment, facility, qualification, validation)
        // avgRevenueUplift: % capacity increase enables new GLP-1 supply contracts
        // avgThroughputImprovement: % additional unit capacity per line
        // =====================================================================
        {
            renovationType: 'Pharmaceutical Systems GLP-1 Capacity Expansion',
            segment: 'BioPharma Systems',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    storesComplete: 3,
                    storesInProgress: 5,
                    storesPlanned: 8,
                    totalTarget: 16,
                    completionPct: 18.8,
                    avgCost: 22000,           // $K per production line
                    avgRevenueUplift: 8.5,    // % capacity increase enables new GLP-1 contracts
                    avgThroughputImprovement: 42.0, // % additional unit capacity per line
                },
                {
                    quarterLabel: 'Q1 FY26',
                    storesComplete: 5,
                    storesInProgress: 6,
                    storesPlanned: 7,
                    totalTarget: 16,
                    completionPct: 31.3,
                    avgCost: 22000,
                    avgRevenueUplift: 8.5,
                    avgThroughputImprovement: 42.0,
                },
                {
                    quarterLabel: 'Q2 FY26',
                    storesComplete: 8,
                    storesInProgress: 4,
                    storesPlanned: 4,
                    totalTarget: 16,
                    completionPct: 50.0,
                    avgCost: 22000,
                    avgRevenueUplift: 8.5,
                    avgThroughputImprovement: 42.0,
                },
            ],
        },
        // =====================================================================
        // PROGRAM 3: Excellence Unleashed Facility Optimization
        // Automation, lean manufacturing, and facility rationalization projects
        // across BD manufacturing network; part of $200M cost-out program;
        // reducing headcount, improving throughput, and consolidating footprint.
        // Segment: 'Medical Essentials'
        // Unit: individual facility optimization projects completed
        // avgCost: $K per project (automation equipment, layout, process redesign)
        // avgRevenueUplift: indirect — cost savings improve competitiveness
        // avgThroughputImprovement: % operational efficiency improvement per project
        // =====================================================================
        {
            renovationType: 'Excellence Unleashed Facility Optimization',
            segment: 'Medical Essentials',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    storesComplete: 8,
                    storesInProgress: 12,
                    storesPlanned: 15,
                    totalTarget: 35,
                    completionPct: 22.9,
                    avgCost: 8500,            // $K per facility optimization project
                    avgRevenueUplift: 0.8,    // indirect — cost savings improve competitiveness
                    avgThroughputImprovement: 18.0, // % operational efficiency improvement
                },
                {
                    quarterLabel: 'Q1 FY26',
                    storesComplete: 12,
                    storesInProgress: 10,
                    storesPlanned: 12,
                    totalTarget: 35,
                    completionPct: 34.3,
                    avgCost: 8500,
                    avgRevenueUplift: 0.8,
                    avgThroughputImprovement: 18.0,
                },
                {
                    quarterLabel: 'Q2 FY26',
                    storesComplete: 16,
                    storesInProgress: 8,
                    storesPlanned: 8,
                    totalTarget: 35,
                    completionPct: 45.7,
                    avgCost: 8500,
                    avgRevenueUplift: 0.8,
                    avgThroughputImprovement: 18.0,
                },
            ],
        },
        // =====================================================================
        // PROGRAM 4: BD Rowa Pro Pharmacy Automation Rollout
        // BD Rowa Pro next-generation pharmacy robotics installations at hospital
        // pharmacy departments across Europe and selected US markets; 40% faster
        // throughput than previous generation; cloud-connected inventory management.
        // Segment: 'Connected Care'
        // Unit: individual hospital pharmacy installations completed
        // avgCost: $K per installation (hardware, software, integration, training)
        // avgRevenueUplift: % revenue uplift per new BD Rowa installation
        // avgThroughputImprovement: % pharmacy dispensing throughput improvement
        // =====================================================================
        {
            renovationType: 'BD Rowa Pro Pharmacy Automation Rollout',
            segment: 'Connected Care',
            quarters: [
                {
                    quarterLabel: 'Q4 FY25',
                    storesComplete: 18,
                    storesInProgress: 22,
                    storesPlanned: 30,
                    totalTarget: 70,
                    completionPct: 25.7,
                    avgCost: 12000,           // $K per hospital pharmacy installation
                    avgRevenueUplift: 2.2,    // % revenue uplift per new BD Rowa installation
                    avgThroughputImprovement: 38.0, // % pharmacy dispensing throughput improvement
                },
                {
                    quarterLabel: 'Q1 FY26',
                    storesComplete: 24,
                    storesInProgress: 20,
                    storesPlanned: 28,
                    totalTarget: 70,
                    completionPct: 34.3,
                    avgCost: 12000,
                    avgRevenueUplift: 2.2,
                    avgThroughputImprovement: 38.0,
                },
                {
                    quarterLabel: 'Q2 FY26',
                    storesComplete: 32,
                    storesInProgress: 18,
                    storesPlanned: 24,
                    totalTarget: 70,
                    completionPct: 45.7,
                    avgCost: 12000,
                    avgRevenueUplift: 2.2,
                    avgThroughputImprovement: 38.0,
                },
            ],
        },
    ];

    const records = [];
    for (const program of programs) {
        for (const qtr of program.quarters) {
            records.push({
                companyId,
                renovationType: program.renovationType,
                segment: program.segment,
                quarterLabel: qtr.quarterLabel,
                storesComplete: qtr.storesComplete,
                storesInProgress: qtr.storesInProgress,
                storesPlanned: qtr.storesPlanned,
                totalTarget: qtr.totalTarget,
                completionPct: qtr.completionPct,
                avgCost: qtr.avgCost,
                avgRevenueUplift: qtr.avgRevenueUplift,
                avgThroughputImprovement: qtr.avgThroughputImprovement,
            });
        }
    }

    await prisma.storeRenovation.createMany({ data: records });
    console.log(`  ✓ ${records.length} StoreRenovation (Capital Investment Programs) records seeded for BD`);
}
