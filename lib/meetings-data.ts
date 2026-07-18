// =============================================================================
// Dynamic Meeting Data — Resolves {{placeholders}} in meeting templates
// Fetches current-period data from the database and interpolates into memos
// =============================================================================

import {
  getActiveCompanyId,
  getFinancials,
  getKPIs,
  getOperations,
  getStrategic,
} from '@/lib/db/repositories';
import {
  calculateMargin,
  roundFinancial,
  formatBillions,
  formatPercent,
  formatNumber,
  formatBasisPoints,
} from '@/lib/engines';
import { meetings, type MeetingConfig } from './meetings-config';
import type { FinancialConfig, KPIConfig, OperationsConfig, StrategicConfig } from '@/config/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A record of placeholder keys to their resolved string values */
export type PlaceholderMap = Record<string, string>;

/** Meeting config with all {{placeholders}} resolved to real values */
export type ResolvedMeetingConfig = MeetingConfig;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Formatting aliases using shared engines
const fmtB = (value: number) => formatBillions(value, 1);
const fmtPctSigned = (value: number) => formatPercent(value, 1, true);
const fmtPct = (value: number) => formatPercent(value, 1, false);
const fmtNum = (value: number) => formatNumber(Math.round(value), 0);
const fmtBps = formatBasisPoints;

/** Safely get a KPI value by label from any KPI category */
function findKPI(kpis: KPIConfig, label: string): string {
  const allKPIs = [
    ...kpis.primaryKPIs,
    ...kpis.operationalKPIs,
    ...kpis.digitalKPIs,
    ...kpis.financialKPIs,
  ];
  const match = allKPIs.find(
    (k) => k.label.toLowerCase() === label.toLowerCase()
  );
  if (!match) return '';
  // Return the raw value as string
  return String(match.value);
}

/** Safely get a KPI trend value by label */
function findKPITrend(kpis: KPIConfig, label: string): string {
  const allKPIs = [
    ...kpis.primaryKPIs,
    ...kpis.operationalKPIs,
    ...kpis.digitalKPIs,
    ...kpis.financialKPIs,
  ];
  const match = allKPIs.find(
    (k) => k.label.toLowerCase() === label.toLowerCase()
  );
  return match?.trendValue ?? '';
}

/** Find a segment by partial name match */
function findSegment(financials: FinancialConfig, partialName: string) {
  return financials.segments.find((s) =>
    s.name.toLowerCase().includes(partialName.toLowerCase())
  );
}

// ---------------------------------------------------------------------------
// Build placeholder map from live data
// ---------------------------------------------------------------------------

function buildPlaceholderMap(
  financials: FinancialConfig,
  kpis: KPIConfig,
  operations: OperationsConfig,
  strategic: StrategicConfig
): PlaceholderMap {
  const latest = financials.latestQuarter;
  const naSegment = findSegment(financials, 'advisory') ?? findSegment(financials, 'north america');
  const intlSegment = findSegment(financials, 'building') ?? findSegment(financials, 'international');
  const channelSegment =
    findSegment(financials, 'investment') ?? findSegment(financials, 'channel') ?? findSegment(financials, 'other');

  // Compute margin YoY change in bps from quarters if available
  const priorYearQuarter = financials.quarters.length >= 5
    ? financials.quarters[financials.quarters.length - 5]
    : undefined;
  const marginBpsChange = priorYearQuarter
    ? roundFinancial(latest.operatingMargin - priorYearQuarter.operatingMargin, 1) * 10
    : 0;

  // Compute COGS as % of revenue from P&L
  const cogsActual = financials.plSummary.cogs.actual;
  const revenueActual = financials.plSummary.revenue.actual;
  const cogsPercent = calculateMargin(Math.abs(cogsActual), revenueActual);
  const cogsPriorYear = financials.plSummary.cogs.priorYear;
  const revenuePriorYear = financials.plSummary.revenue.priorYear;
  const cogsPctPriorYear = calculateMargin(Math.abs(cogsPriorYear), revenuePriorYear);
  const cogsBpsChange = Math.round((cogsPercent - cogsPctPriorYear) * 10);

  // Forward outlook from strategic data
  const nextYearOutlook = strategic.forwardOutlook[0];
  const revenueForecast = nextYearOutlook?.revenueForcast ?? financials.annualRevenue;

  // Annual EPS from financials
  const annualEPS = financials.annualEPS;

  // Net new mandate wins from latest quarter
  const netNewClients = latest.netNewClients ?? operations.locationGrowth;

  // Build comprehensive map of all placeholders
  const map: PlaceholderMap = {
    // ---- Consolidated / Latest Quarter ----
    'consolidated_revenue': fmtB(latest.revenue),
    'consolidated_revenue_yoy': fmtPctSigned(latest.revenueYoY),
    'operating_margin': fmtPct(latest.operatingMargin),
    'operating_margin_bps_yoy': fmtBps(marginBpsChange),
    'organic_growth': fmtPctSigned(latest.feeRevenueGrowth),
    'eps': `$${latest.eps}`,
    'fiscal_quarter': latest.quarter,

    // ---- Domestic Mainline Revenue Segment ----
    'na_revenue': naSegment ? fmtB(naSegment.revenue) : '',
    'na_revenue_yoy': naSegment ? fmtPctSigned(naSegment.yoyChange) : '',
    'advisory_growth': findKPI(kpis, 'Advisory Organic Growth') || findKPI(kpis, 'NA Organic Growth') || (naSegment ? fmtPctSigned(naSegment.yoyChange) : ''),

    // ---- Building Operations Segment ----
    'intl_revenue': intlSegment ? fmtB(intlSegment.revenue) : '',
    'intl_revenue_yoy': intlSegment ? fmtPctSigned(intlSegment.yoyChange) : '',

    // ---- Cargo & Other Revenue Segment ----
    'channel_revenue': channelSegment ? fmtB(channelSegment.revenue) : '',
    'channel_revenue_yoy': channelSegment ? fmtPctSigned(channelSegment.yoyChange) : '',

    // ---- Revenue Decomposition ----
    'transaction_growth': findKPI(kpis, 'Transaction Volume Growth') || findKPI(kpis, 'Transaction Growth') || findKPITrend(kpis, 'Transactions'),
    'ticket_growth': findKPI(kpis, 'Fee Rate Growth') || findKPI(kpis, 'Ticket Growth') || findKPITrend(kpis, 'Average Fee'),

    // ---- Digital / AUM ----
    'aum_total': findKPI(kpis, 'AUM') || findKPI(kpis, 'AmEx Remuneration'),
    'aum_growth_yoy': findKPITrend(kpis, 'AUM') || findKPITrend(kpis, 'AmEx Remuneration'),
    'digital_adoption_pct': findKPI(kpis, 'Digital Platform Adoption') || findKPI(kpis, 'PropTech Adoption'),

    // ---- Mandate Development ----
    'net_new_mandates': fmtNum(netNewClients),
    'total_office_count': fmtNum(operations.totalLocations),
    'mandate_growth_pct': fmtPctSigned(operations.locationGrowthPercent),

    // ---- Supply Chain / COGS ----
    'cogs_pct_revenue': fmtPct(cogsPercent),
    'cogs_bps_yoy': fmtBps(cogsBpsChange),

    // ---- Annual / Guidance ----
    'annual_revenue': fmtB(financials.annualRevenue),
    'annual_revenue_yoy': fmtPctSigned(financials.annualRevenueYoY),
    'annual_operating_margin': fmtPct(financials.annualOperatingMargin),
    'annual_eps': `$${annualEPS}`,
    'revenue_forecast': fmtB(revenueForecast),
    'free_cash_flow': fmtB(financials.ratios.freeCashFlow),
    'dividend_per_share': `$${financials.ratios.dividendPerShare}`,
    'roe': fmtPct(financials.ratios.returnOnEquity),

    // ---- G&A (derived from P&L if available) ----
    'ga_pct_revenue': revenueActual > 0
      ? fmtPct(
          calculateMargin(
            Math.abs(financials.plSummary.operatingExpenses.actual) - Math.abs(cogsActual),
            revenueActual,
          )
        )
      : '',
  };

  return map;
}

// ---------------------------------------------------------------------------
// Interpolation engine
// ---------------------------------------------------------------------------

/**
 * Replace all `{{placeholder}}` tokens in a string with values from the map.
 * Unresolved placeholders are left as-is so the original static text shows.
 */
function interpolate(template: string, values: PlaceholderMap): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const resolved = values[key];
    // If resolved value is empty or undefined, leave the original placeholder
    // so the static fallback text remains readable
    if (resolved === undefined || resolved === '') return match;
    return resolved;
  });
}

/**
 * Resolve all placeholders in a single meeting config
 */
function resolveMeeting(
  meeting: MeetingConfig,
  values: PlaceholderMap
): ResolvedMeetingConfig {
  return {
    ...meeting,
    slides: meeting.slides.map((slide) => ({
      ...slide,
      memo: interpolate(slide.memo, values),
      subtitle: slide.subtitle ? interpolate(slide.subtitle, values) : undefined,
    })),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch live data from the database and resolve all {{placeholders}} in
 * meeting templates. Falls back to the static config if data fetch fails.
 *
 * @param companyId - Company ID for data queries (defaults to active company)
 * @returns Array of MeetingConfig objects with memos populated from DB data
 */
export async function getMeetingsWithData(
  companyId?: number
): Promise<ResolvedMeetingConfig[]> {
  try {
    const id = companyId ?? (await getActiveCompanyId());

    // Fetch all data sources in parallel
    const [financials, kpis, operations, strategic] = await Promise.all([
      getFinancials(id),
      getKPIs(id),
      getOperations(id),
      getStrategic(id),
    ]);

    const values = buildPlaceholderMap(financials, kpis, operations, strategic);

    return meetings.map((m) => resolveMeeting(m, values));
  } catch (error) {
    // If anything fails, return the original static config unchanged
    console.error('[meetings-data] Failed to resolve dynamic values, using static fallback:', error);
    return meetings;
  }
}

/**
 * Resolve a single meeting by slug with live data.
 * Returns undefined if the slug is not found.
 */
export async function getMeetingWithDataBySlug(
  slug: string,
  companyId?: number
): Promise<ResolvedMeetingConfig | undefined> {
  const all = await getMeetingsWithData(companyId);
  return all.find((m) => m.slug === slug);
}

/**
 * Get the raw placeholder map (useful for debugging or custom interpolation).
 */
export async function getMeetingPlaceholders(
  companyId?: number
): Promise<PlaceholderMap> {
  const id = companyId ?? (await getActiveCompanyId());

  const [financials, kpis, operations, strategic] = await Promise.all([
    getFinancials(id),
    getKPIs(id),
    getOperations(id),
    getStrategic(id),
  ]);

  return buildPlaceholderMap(financials, kpis, operations, strategic);
}
