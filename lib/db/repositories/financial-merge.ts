import type { FinancialConfig, QuarterData } from '@/config/types';
import { calculateOperatingMargin, roundFinancial, sumField } from '@/lib/engines/financial-engine';

function isPlSummaryEmpty(pl: FinancialConfig['plSummary']): boolean {
    return Object.values(pl).every((l) => l.actual === 0 && l.plan === 0 && l.variance === 0 && l.priorYear === 0);
}

function isWorkingCapitalUnset(wc: FinancialConfig['workingCapital']): boolean {
    return wc.dso === 0 && wc.dpo === 0 && wc.inventoryDays === 0;
}

function enrichQuartersFromSeed(dbQuarters: QuarterData[], seedQuarters: QuarterData[]): QuarterData[] {
    const byLabel = new Map(seedQuarters.map((q) => [q.quarter, q]));
    return dbQuarters.map((q) => {
        const s = byLabel.get(q.quarter);
        if (!s?.adjustedRevenueYoY) return q;
        return { ...q, adjustedRevenueYoY: s.adjustedRevenueYoY };
    });
}

function recalcFinancialRollups(fin: FinancialConfig): void {
    if (!fin.quarters?.length) return;
    fin.annualRevenue = roundFinancial(sumField(fin.quarters, 'revenue'));
    fin.annualOperatingIncome = roundFinancial(sumField(fin.quarters, 'operatingIncome'));
    fin.annualOperatingMargin = calculateOperatingMargin(fin.annualOperatingIncome, fin.annualRevenue);
    fin.latestQuarter = fin.quarters[fin.quarters.length - 1];
    fin.annualRevenueYoY = fin.latestQuarter?.revenueYoY ?? fin.annualRevenueYoY;
    if (fin.latestQuarter?.eps !== undefined) {
        fin.annualEPS = roundFinancial(fin.latestQuarter.eps * 4, 2);
    }
    const ni = fin.plSummary?.netIncome?.actual;
    if (ni && ni !== 0) {
        fin.annualNetIncome = roundFinancial((ni * 4) / 1000, 3);
    }
}

/**
 * When Prisma returns sparse rows (fresh DB), overlay Delta seed financials.
 * Only applies full fallback for `companyId === 1` (Delta tenant).
 */
export function mergeFinancialsFromSeed(
    db: FinancialConfig,
    seed: FinancialConfig,
    companyId: number,
): FinancialConfig {
    const out: FinancialConfig = {
        ...db,
        plSummary: { ...db.plSummary },
        ratios: { ...db.ratios },
        workingCapital: { ...db.workingCapital },
    };

    if (out.quarters?.length && !out.latestQuarter?.quarter) {
        out.latestQuarter = out.quarters[out.quarters.length - 1];
    }

    recalcFinancialRollups(out);

    if (companyId !== 1) {
        return out;
    }

    if (!out.quarters?.length) {
        out.quarters = [...seed.quarters];
    } else {
        out.quarters = enrichQuartersFromSeed(out.quarters, seed.quarters);
    }

    if (!out.latestQuarter?.quarter && seed.latestQuarter?.quarter) {
        out.latestQuarter = { ...seed.latestQuarter };
    } else if (out.quarters.length) {
        out.latestQuarter = out.quarters[out.quarters.length - 1];
    }

    if (!out.segments?.length) {
        out.segments = [...seed.segments];
    }

    if (isPlSummaryEmpty(out.plSummary)) {
        out.plSummary = {
            revenue: { ...seed.plSummary.revenue },
            cogs: { ...seed.plSummary.cogs },
            grossProfit: { ...seed.plSummary.grossProfit },
            operatingExpenses: { ...seed.plSummary.operatingExpenses },
            operatingIncome: { ...seed.plSummary.operatingIncome },
            netIncome: { ...seed.plSummary.netIncome },
        };
    }

    if (!out.revenueBridge?.length) {
        out.revenueBridge = [...seed.revenueBridge];
    }

    if (isWorkingCapitalUnset(out.workingCapital)) {
        out.workingCapital = { ...seed.workingCapital };
    }

    const ratiosEmpty =
        out.ratios.freeCashFlow === 0 &&
        out.ratios.currentRatio === 0 &&
        out.ratios.returnOnEquity === 0 &&
        out.ratios.debtToEquity === 0;
    if (ratiosEmpty) {
        out.ratios = { ...seed.ratios };
    }

    if (seed.executiveDisplayMetrics) {
        out.executiveDisplayMetrics = { ...seed.executiveDisplayMetrics };
    }

    if (!out.fiscalYear || out.fiscalYear === 'FY25') {
        out.fiscalYear = seed.fiscalYear;
    }

    recalcFinancialRollups(out);

    return out;
}
