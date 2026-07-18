import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 31: BD Sales Channel Format Mix — Becton, Dickinson and Company (BDX)
//
// Reinterprets StoreFormatMix as BD's sales channel mix across 6
// channel format types and 5 quarters (Q1 FY25 through Q1 FY26). 30 total records.
//
// BD Fiscal Year: ends September 30
//   Q1 FY25 = Oct-Dec 2024
//   Q2 FY25 = Jan-Mar 2025
//   Q3 FY25 = Apr-Jun 2025
//   Q4 FY25 = Jul-Sep 2025
//   Q1 FY26 = Oct-Dec 2025
//
// Channel formats:
//   1. Direct Hospital Sales               — ~830 sales territories, largest channel
//   2. GPO / Distributor Channel           — ~495 accounts, Cardinal/Medline/O&M
//   3. Government & Institutional          — ~99 accounts, VA/DOD/federal
//   4. International Direct (Developed)    — ~365 territories, EMEA/Canada/Japan
//   5. Digital / eCommerce Platform        — 1 platform, growing rapidly
//   6. BioPharma Custom / Specialty Mfg    — ~30 sites, GLP-1 syringe contracts
// =============================================================================

export async function seedStoreFormatMix(
    prisma: PrismaClient,
    companyId: number,
    allPeriods: Record<string, { id: number }>,
) {
    console.log('Seeding BD sales channel format mix...');

    const quarters = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'];

    // Channel format definitions with per-quarter arrays: [Q1FY25, Q2FY25, Q3FY25, Q4FY25, Q1FY26]
    const formatTypes = [
        {
            format: 'Direct Hospital Sales',
            segment: 'consumer' as const,
            // Core hospital and health system direct sales territories; BD Alaris, PureWick,
            // Vacutainer, HemoSphere; consent decree constrains new Alaris account approvals
            // storeCount = number of active sales territories
            storeCount:  [820, 822, 825, 828, 830],
            pctOfTotal:  [51.5, 51.4, 51.3, 51.2, 51.0],
            // avgRevenue = $M per territory per quarter (blended product portfolio)
            avgRevenue:  [1860, 1880, 1910, 1980, 1850],
            yoyGrowth:   [4.2, 4.5, 4.8, 5.0, 3.8],
            compSales:   [4.0, 4.2, 4.5, 4.8, 3.5],
        },
        {
            format: 'GPO / Distributor Channel',
            segment: 'consumer' as const,
            // Group Purchasing Organization and distributor-served accounts; Vizient, Premier,
            // HealthTrust GPO contracts; Cardinal Health, Medline, Owens & Minor distribution
            // storeCount = number of active distributor/GPO accounts
            storeCount:  [485, 487, 490, 492, 495],
            pctOfTotal:  [30.4, 30.4, 30.5, 30.5, 30.5],
            // avgRevenue = $M per account per quarter
            avgRevenue:  [1620, 1635, 1660, 1720, 1610],
            yoyGrowth:   [3.5, 3.8, 4.0, 4.2, 3.2],
            compSales:   [3.2, 3.5, 3.8, 4.0, 2.8],
        },
        {
            format: 'Government & Institutional',
            segment: 'business' as const,
            // Federal government and institutional accounts; VA, DOD, federal supply schedule;
            // highly recurring revenue; stringent compliance and procurement requirements
            // storeCount = number of active government/institutional accounts
            storeCount:  [95, 96, 97, 98, 99],
            pctOfTotal:  [6.0, 6.0, 6.0, 6.1, 6.1],
            // avgRevenue = $M per account per quarter
            avgRevenue:  [375, 380, 385, 400, 370],
            yoyGrowth:   [2.5, 2.8, 3.0, 3.2, 2.2],
            compSales:   [2.2, 2.5, 2.8, 3.0, 2.0],
        },
        {
            format: 'International Direct (Developed Markets)',
            segment: 'business' as const,
            // Direct sales in EMEA developed markets, Canada, Australia, Japan;
            // FXN growth higher than reported due to EUR/JPY/GBP headwinds; strong underlying demand
            // storeCount = number of international direct sales territories
            storeCount:  [355, 357, 360, 362, 365],
            pctOfTotal:  [10.0, 10.0, 10.0, 9.9, 9.9],
            // avgRevenue = $M per territory per quarter (reported USD, FX headwind included)
            avgRevenue:  [465, 470, 478, 492, 458],
            yoyGrowth:   [3.0, 3.2, 3.5, 3.8, 2.8],
            compSales:   [4.5, 4.8, 5.0, 5.2, 4.2],
        },
        {
            format: 'Digital / eCommerce Platform',
            segment: 'consumer' as const,
            // BD.com and distributor-integrated eCommerce ordering platform;
            // fastest-growing channel; high operating margin on digital orders
            // storeCount = 1 (single unified platform)
            storeCount:  [1, 1, 1, 1, 1],
            pctOfTotal:  [1.3, 1.4, 1.5, 1.6, 1.7],
            // avgRevenue = $M platform total per quarter
            avgRevenue:  [145, 152, 160, 178, 168],
            yoyGrowth:   [18.0, 20.0, 22.0, 25.0, 28.0],
            compSales:   [18.0, 20.0, 22.0, 25.0, 28.0],
        },
        {
            format: 'BioPharma Custom / Specialty Manufacturing',
            segment: 'business' as const,
            // Pharmaceutical Systems dedicated customer lines and contract manufacturing sites;
            // GLP-1 prefillable syringe supply agreements; highest margin channel
            // storeCount = number of manufacturing sites and dedicated customer lines
            storeCount:  [28, 28, 29, 29, 30],
            pctOfTotal:  [0.8, 0.8, 0.7, 0.7, 0.8],
            // avgRevenue = $M per site/line per quarter (bulk pharma supply orders)
            avgRevenue:  [190, 163, 147, 50, 174],
            yoyGrowth:   [5.5, 6.0, 7.5, 9.0, 8.5],
            compSales:   [5.5, 6.0, 7.5, 9.0, 8.5],
        },
    ];

    const records = [];
    for (const fmt of formatTypes) {
        for (let qi = 0; qi < quarters.length; qi++) {
            const periodRecord = allPeriods[quarters[qi]];
            if (!periodRecord) continue;
            records.push({
                companyId,
                periodId: periodRecord.id,
                format: fmt.format,
                segment: fmt.segment,
                storeCount: fmt.storeCount[qi],
                pctOfTotal: fmt.pctOfTotal[qi],
                avgRevenue: fmt.avgRevenue[qi],
                yoyGrowth: fmt.yoyGrowth[qi],
                compSales: fmt.compSales[qi],
            });
        }
    }

    await prisma.storeFormatMix.createMany({ data: records });
    console.log(`  ✓ ${records.length} StoreFormatMix records seeded for BD`);
}
