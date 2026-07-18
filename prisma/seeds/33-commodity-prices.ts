import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 33: Becton, Dickinson and Company (BDX) — Manufacturing Input Prices
//
// 7 commodity/input records for period 'Q2 FY26'
//
// BD's key manufacturing cost inputs:
//   1. Medical-Grade Plastics & Polymers        — deflationary; 65% contracted
//   2. Stainless Steel & Precision Metal        — moderating after FY23-24 peak
//   3. Electronic Components & Semiconductors   — deflating post-shortage
//   4. API & Specialty Diagnostic Reagents      — modest inflation; 48% contracted
//   5. Ethylene Oxide (EtO) Sterilization       — rising on EPA facility restrictions
//   6. Global Logistics & Cold-Chain Freight    — normalizing from 2022 peak
//   7. Contract Manufacturing Labor Index       — wage inflation moderating
// =============================================================================

export async function seedCommodityPrices(prisma: PrismaClient, companyId: number) {
    console.log('Seeding BD manufacturing input and commodity prices...');

    const commodities = [
        {
            companyId,
            commodity: 'Medical-Grade Plastics & Polymers',
            unit: 'index (YoY % chg)',
            periodLabel: 'Q2 FY26',
            spotPrice: -4.8,         // YoY deflation in plastic resin costs (%)
            hedgedPrice: -4.2,       // contracted supply agreement pricing
            priorYearPrice: -2.5,    // Q2 FY25 comparison
            hedgeCoverage: 65,       // % of volume under multi-year supply contracts
            yoyChange: -2.3,         // additional improvement from hedging
            forecastNext: -4.5,      // Q3 FY26 forecast
        },
        {
            companyId,
            commodity: 'Stainless Steel & Precision Metal Components',
            unit: 'index (YoY % chg)',
            periodLabel: 'Q2 FY26',
            spotPrice: 2.1,          // modest YoY increase (%)
            hedgedPrice: 1.8,        // forward purchasing contract pricing
            priorYearPrice: 4.5,     // Q2 FY25 comparison (was worse last year)
            hedgeCoverage: 55,       // % of volume under forward purchasing contracts
            yoyChange: -2.4,         // improvement vs. prior year
            forecastNext: 2.0,       // Q3 FY26 forecast
        },
        {
            companyId,
            commodity: 'Electronic Components & Semiconductors',
            unit: 'index (YoY % chg)',
            periodLabel: 'Q2 FY26',
            spotPrice: -8.5,         // significant deflation from shortage peak (%)
            hedgedPrice: -7.2,       // partially hedged through procurement contracts
            priorYearPrice: -12.0,   // Q2 FY25 comparison (improvement moderating)
            hedgeCoverage: 42,       // % of volume spot-purchased
            yoyChange: 3.5,          // year-over-year improvement moderating vs FY25
            forecastNext: -8.0,      // Q3 FY26 forecast
        },
        {
            companyId,
            commodity: 'API & Specialty Diagnostic Reagents',
            unit: 'index (YoY % chg)',
            periodLabel: 'Q2 FY26',
            spotPrice: 3.2,          // modest inflation (%)
            hedgedPrice: 2.8,        // contracted pricing
            priorYearPrice: 2.5,     // Q2 FY25 comparison
            hedgeCoverage: 48,       // % contracted
            yoyChange: 0.7,          // slight acceleration vs. prior year
            forecastNext: 3.5,       // Q3 FY26 forecast
        },
        {
            companyId,
            commodity: 'Ethylene Oxide (EtO) Sterilization Cost Index',
            unit: 'index (YoY % chg)',
            periodLabel: 'Q2 FY26',
            spotPrice: 5.8,          // cost pressure from EPA regulatory restrictions (%)
            hedgedPrice: 4.5,        // partially contracted
            priorYearPrice: 3.2,     // Q2 FY25 comparison
            hedgeCoverage: 38,       // % of external EtO volume under fixed-rate contracts
            yoyChange: 2.6,          // acceleration from EPA capacity tightening
            forecastNext: 6.0,       // Q3 FY26 forecast (continued EPA pressure)
        },
        {
            companyId,
            commodity: 'Global Logistics & Cold-Chain Freight',
            unit: 'index (YoY % chg)',
            periodLabel: 'Q2 FY26',
            spotPrice: -12.5,        // significant normalization from 2022 peak (%)
            hedgedPrice: -10.8,      // partially under fixed-rate contracts
            priorYearPrice: -18.2,   // Q2 FY25 comparison (improvement moderating)
            hedgeCoverage: 30,       // % of volume under fixed-rate contracts
            yoyChange: 5.7,          // year-over-year improvement moderating
            forecastNext: -10.0,     // Q3 FY26 forecast (further normalization slowing)
        },
        {
            companyId,
            commodity: 'Contract Manufacturing Labor Index',
            unit: 'index (YoY % chg)',
            periodLabel: 'Q2 FY26',
            spotPrice: 3.8,          // wage inflation (%)
            hedgedPrice: 3.5,        // partially contracted through multi-year agreements
            priorYearPrice: 4.2,     // Q2 FY25 comparison
            hedgeCoverage: 22,       // % of contract labor under long-term agreements
            yoyChange: -0.4,         // slight improvement; wage inflation moderating
            forecastNext: 3.6,       // Q3 FY26 forecast
        },
    ];

    // Manufacturing cost context notes (for documentation — not stored in model):
    //
    // Medical-Grade Plastics & Polymers: Medical-grade polypropylene and PVC costs declining
    //   from 2022-2023 peak; BD has 65% coverage under multi-year supply agreements through FY28;
    //   favorable for Medical Essentials syringe manufacturing COGS. Deflation expected to
    //   continue at -3 to -5% through FY27 as petrochemical capacity additions outpace demand.
    //
    // Stainless Steel & Precision Metal Components: Needle and surgical instrument steel costs
    //   moderating from FY23-24 elevated levels; forward purchasing contracts providing partial
    //   protection; Interventional segment most exposed at ~18% steel content COGS.
    //
    // Electronic Components & Semiconductors: Semiconductor costs normalized post-2022 shortage;
    //   BD Alaris pump boards, monitoring devices, and BD Rowa robotics benefit; 42% of volume
    //   spot-purchased; FY27 outlook stable to slightly favorable.
    //
    // API & Specialty Diagnostic Reagents: Diagnostic reagent raw materials (antibodies, enzymes,
    //   biochemicals) showing modest inflation; BD Biosciences and BD MAX molecular dx segments
    //   most exposed; 48% contracted; specialty biochemical suppliers consolidating.
    //
    // Ethylene Oxide (EtO) Sterilization Cost Index: EtO sterilization costs rising on EPA
    //   facility restrictions and capacity tightening; BD operates its own EtO facilities but
    //   contracts ~38% externally; Medical Essentials most exposed; electron-beam sterilization
    //   investment underway as alternative.
    //
    // Global Logistics & Cold-Chain Freight: Ocean freight and air cargo rates normalized from
    //   2022 COVID peaks; BD cold-chain logistics for BioPharma Systems products (temperature-
    //   controlled syringes) still carry premium; 30% of volume under fixed-rate contracts;
    //   further normalization expected FY27.
    //
    // Contract Manufacturing Labor Index: Manufacturing labor inflation moderating from FY23-24
    //   peak; BD contract manufacturers in Mexico, Ireland, and Singapore; Excellence Unleashed
    //   automation investments reducing contract labor dependency by 8% in FY26; TRIR below
    //   0.5 maintained.

    await prisma.commodityPrice.createMany({ data: commodities });
    console.log(`  ✓ ${commodities.length} CommodityPrice records seeded for BD`);
}
