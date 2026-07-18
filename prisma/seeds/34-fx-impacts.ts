import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 34: FX Impacts — Becton, Dickinson and Company (BDX)
//
// BD has significant FX exposure (~40% of revenue international).
// Key currency exposures:
//   1. EUR/USD — largest exposure; EMEA ~$1,600M quarterly revenue
//   2. CNY/USD — China VoBP compounds FX headwind; ~10% of total BD revenue
//   3. JPY/USD — Japan weakness continued; ~4% of BD revenue
//   4. Emerging Market Basket (BRL/INR/MXN) — ~8% of BD revenue; limited hedging
//
// 4 FX impact records for period 'Q1 FY26' (Oct-Dec 2025)
// =============================================================================

export async function seedFXImpacts(
    prisma: PrismaClient,
    companyId: number,
    allPeriods: Record<string, { id: number }>,
) {
    console.log('Seeding BD FX impacts (~40% international revenue exposure)...');

    const q1fy26 = allPeriods['Q1 FY26'];
    if (!q1fy26) {
        console.warn('  ⚠ Q1 FY26 period not found — skipping FX impacts seed');
        return;
    }

    // BD has meaningful FX exposure across EMEA, Asia Pacific, and Emerging Markets.
    // ~40% of total revenue is generated outside the United States, with EUR, JPY,
    // CNY, and EM currencies representing the primary translation exposures.
    const fxRecords = [
        {
            companyId,
            periodId: q1fy26.id,
            currencyPair: 'EUR/USD',
            segment: 'EMEA',
            // EUR/USD averaged 1.042 in Q1 FY26 vs 1.088 in Q1 FY25; 46bps USD appreciation
            // creates ~-$92M reported revenue headwind on ~$1,600M EMEA quarterly revenue;
            // 55% hedged at 1.055 partially mitigates; EMEA FXN growth +4.8% vs +2.2% reported.
            revenueImpact: -92,
            operatingImpact: -22,    // $M operating income headwind from EUR translation
            avgRate: 1.042,
            priorYearRate: 1.088,
            hedgedRate: 1.055,
        },
        {
            companyId,
            periodId: q1fy26.id,
            currencyPair: 'CNY/USD',
            segment: 'Asia Pacific',
            // RMB/CNY modest depreciation vs USD adds ~-$35M to reported revenue headwind
            // on top of VoBP pricing pressure; China ~10% of total BD revenue; combined
            // China headwind (price + FX) approximately -$130M in Q1 FY26.
            revenueImpact: -35,
            operatingImpact: -8,     // $M operating income headwind
            avgRate: 7.31,
            priorYearRate: 7.20,
            hedgedRate: 7.28,
        },
        {
            companyId,
            periodId: q1fy26.id,
            currencyPair: 'JPY/USD',
            segment: 'Asia Pacific',
            // JPY/USD weakness continued in Q1 FY26; Japan ~4% of BD revenue; yen at 155.8
            // vs 142.5 prior year creates significant per-unit revenue reduction in USD;
            // Japan is BD Alaris and Biosciences strong market.
            revenueImpact: -28,
            operatingImpact: -7,     // $M operating income headwind
            avgRate: 155.8,
            priorYearRate: 142.5,
            hedgedRate: 152.5,
        },
        {
            companyId,
            periodId: q1fy26.id,
            currencyPair: 'Emerging Market Basket (BRL/INR/MXN)',
            segment: 'Americas / Asia Pacific (EM)',
            // Mixed EM currency basket; Brazil BRL stable; India INR modest depreciation;
            // Mexico MXN slight headwind; EM countries ~8% of BD revenue; lower hedge coverage
            // for EM currencies due to hedging cost/liquidity constraints.
            revenueImpact: -22,
            operatingImpact: -5,     // $M operating income headwind (blended EM basket)
            avgRate: null,
            priorYearRate: null,
            hedgedRate: null,
        },
    ];

    await prisma.fXImpact.createMany({ data: fxRecords });
    console.log(`  ✓ ${fxRecords.length} FXImpact records seeded for BD (~40% international revenue; EUR/CNY/JPY/EM basket exposures)`);
}
