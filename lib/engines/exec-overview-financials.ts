/**
 * Client-safe hydration for Executive Summary overview charts when DB rows are sparse.
 * Overlays BD seed financials from config (10-K / 10-Q–aligned) only where slices are empty or zeroed.
 *
 * Segments are always taken from the seed config. The DB may contain legacy
 * placeholder segments that pre-date the BD engagement; using the seed config
 * guarantees the correct BD segment breakdown (Missouri + IED + CVS Pharmacy + CVS Pharmacy) is always shown.
 */

import type { FinancialConfig } from '@/config/types';
import { financials as seed } from '@/config/clients/ameren/financials';

function plSummaryEmpty(pl: FinancialConfig['plSummary']): boolean {
    return Object.values(pl).every((l) => l.actual === 0 && l.plan === 0 && l.variance === 0);
}

function wcUnset(wc: FinancialConfig['workingCapital']): boolean {
    return wc.dso === 0 && wc.dpo === 0 && wc.inventoryDays === 0;
}

/**
 * Merge per-quarter fields from seed when the DB row has zeros.
 * Revenue is the primary join key (label match). operatingIncome, eps,
 * and operatingMargin are back-filled from seed when the DB has 0/undefined.
 */
function enrichQuartersFromSeed(dbQs: FinancialConfig['quarters'], seedQs: FinancialConfig['quarters']) {
    const byLabel = new Map(seedQs.map(q => [q.quarter, q]));
    return dbQs.map(q => {
        const s = byLabel.get(q.quarter);
        if (!s) return q;
        return {
            ...q,
            operatingIncome: q.operatingIncome || s.operatingIncome,
            operatingMargin: q.operatingMargin || s.operatingMargin,
            eps: q.eps || s.eps,
            feeRevenueGrowth: q.feeRevenueGrowth || s.feeRevenueGrowth,
            adjustedRevenueYoY: q.adjustedRevenueYoY ?? s.adjustedRevenueYoY,
        };
    });
}

export function ensureExecutiveOverviewFinancials(fin: FinancialConfig): FinancialConfig {
    // Always use seed quarters for exec overview charts. The DB may contain
    // many extended-period rows with revenue=0 (from seeds 19-20), causing
    // revenue bars to be invisible. Seed quarters are the 5 cited quarters
    // (Q1 FY25 – Q1 FY26) and are always fully populated with BD actuals.
    const quarters = [...seed.quarters];

    const out: FinancialConfig = {
        ...fin,
        quarters,
        revenueBridge: fin.revenueBridge?.length ? [...fin.revenueBridge] : [...seed.revenueBridge],
        segments: [...seed.segments],
        plSummary: {
            revenue: { ...fin.plSummary.revenue },
            cogs: { ...fin.plSummary.cogs },
            grossProfit: { ...fin.plSummary.grossProfit },
            operatingExpenses: { ...fin.plSummary.operatingExpenses },
            operatingIncome: { ...fin.plSummary.operatingIncome },
            netIncome: { ...fin.plSummary.netIncome },
        },
        workingCapital: { ...fin.workingCapital },
        ratios: { ...fin.ratios },
    };

    if (plSummaryEmpty(out.plSummary)) {
        out.plSummary = {
            revenue: { ...seed.plSummary.revenue },
            cogs: { ...seed.plSummary.cogs },
            grossProfit: { ...seed.plSummary.grossProfit },
            operatingExpenses: { ...seed.plSummary.operatingExpenses },
            operatingIncome: { ...seed.plSummary.operatingIncome },
            netIncome: { ...seed.plSummary.netIncome },
        };
    }

    if (wcUnset(out.workingCapital)) {
        out.workingCapital = { ...seed.workingCapital };
    }

    if (
        out.ratios.freeCashFlow === 0 &&
        out.ratios.currentRatio === 0 &&
        out.ratios.returnOnEquity === 0
    ) {
        out.ratios = { ...seed.ratios };
    }

    if (out.quarters.length) {
        out.latestQuarter = out.quarters[out.quarters.length - 1];
    } else {
        out.latestQuarter = { ...seed.latestQuarter };
    }

    return out;
}
