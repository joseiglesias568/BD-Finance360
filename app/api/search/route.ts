import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import prisma from '@/lib/db/prisma';
import { getActiveCompanyId } from '@/lib/db/repositories';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const MAX_QUERY_LENGTH = 500;

// Universal search across all DB tables — designed for AI consumption
// GET /api/search?q=revenue&companyId=auto
export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const start = Date.now();

  // Rate limit: 60 requests per minute
  const rateLimitResult = checkRateLimit(`search:${ip}`, 60, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 60) }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') ?? '';
    const companyIdParam = searchParams.get('companyId');

    if (!query.trim()) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    if (query.length > MAX_QUERY_LENGTH) {
      return NextResponse.json({ error: `Query must be under ${MAX_QUERY_LENGTH} characters` }, { status: 400 });
    }

    if (companyIdParam && (isNaN(Number(companyIdParam)) || Number(companyIdParam) < 1)) {
      return NextResponse.json({ error: 'Invalid companyId parameter' }, { status: 400 });
    }

    const companyId = companyIdParam ? Number(companyIdParam) : await getActiveCompanyId();
    const q = query.toLowerCase();

    // Search across all major tables in parallel
    const [
      insights,
      kpiDefs,
      financials,
      segments,
      quarterlyResults,
      bridgeItems,
      initiatives,
      risks,
      outlook,
      competitors,
      marketData,
      alertTemplates,
      reportTemplates,
      consoles,
      supplyChain,
      closeTasks,
    ] = await Promise.all([
      prisma.personalizedInsight.findMany({
        where: {
          companyId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.kPIDefinition.findMany({
        where: {
          companyId,
          OR: [
            { label: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          values: {
            where: { dataType: 'actual' },
            include: { period: true },
            orderBy: { period: { year: 'desc' } },
            take: 5,
          },
        },
      }),
      prisma.financialStatement.findMany({
        where: {
          companyId,
          OR: [
            { label: { contains: query, mode: 'insensitive' } },
            { lineItem: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { period: true },
        orderBy: { period: { year: 'desc' } },
      }),
      prisma.businessSegment.findMany({
        where: {
          companyId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          segmentResults: {
            include: { period: true },
            orderBy: { period: { year: 'desc' } },
            take: 5,
          },
        },
      }),
      prisma.quarterlyResult.findMany({
        where: { period: { companyId } },
        include: { period: true },
        orderBy: { period: { year: 'desc' } },
      }),
      prisma.revenueBridgeItem.findMany({
        where: {
          companyId,
          OR: [
            { label: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { period: true },
      }),
      prisma.strategicInitiative.findMany({
        where: {
          companyId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { milestones: true, kpis: true },
      }),
      prisma.riskItem.findMany({
        where: {
          companyId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { mitigation: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.forwardOutlook.findMany({
        where: { companyId },
      }),
      prisma.competitor.findMany({
        where: {
          companyId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.marketData.findMany({
        where: { companyId },
      }),
      prisma.alertTemplate.findMany({
        where: {
          companyId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.reportTemplate.findMany({
        where: {
          companyId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.businessConsole.findMany({
        where: {
          companyId,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { objective: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          drivers: {
            where: { parentDriverId: null },
            include: { children: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      prisma.supplyChainMetric.findMany({
        where: {
          companyId,
          OR: [
            { label: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.closeTask.findMany({
        where: {
          companyId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { phase: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    // Build a structured response with relevance scoring
    const results = {
      query,
      timestamp: new Date().toISOString(),
      totalResults:
        insights.length + kpiDefs.length + financials.length + segments.length +
        bridgeItems.length + initiatives.length + risks.length + competitors.length +
        alertTemplates.length + reportTemplates.length + consoles.length +
        supplyChain.length + closeTasks.length,
      sections: {
        ...(insights.length > 0 && {
          insights: {
            count: insights.length,
            data: insights.map(i => ({
              title: i.title,
              category: i.category,
              summary: i.summary,
              kpiValue: i.kpiValue,
              trend: i.trendDirection,
              priority: i.priority,
              confidence: i.confidenceScore,
              consoleLink: i.consoleLink,
              recommendations: i.recommendations,
            })),
          },
        }),
        ...(kpiDefs.length > 0 && {
          kpis: {
            count: kpiDefs.length,
            data: kpiDefs.map(k => ({
              label: k.label,
              category: k.category,
              unit: k.unit,
              description: k.description,
              timeSeries: k.values.map(v => ({
                period: v.period.label,
                value: v.value,
                target: v.target,
                trend: v.trend,
                status: v.status,
              })),
            })),
          },
        }),
        ...(financials.length > 0 && {
          financials: {
            count: financials.length,
            data: financials.map(f => ({
              lineItem: f.lineItem,
              label: f.label,
              period: f.period.label,
              actual: f.actual,
              plan: f.plan,
              priorYear: f.priorYear,
              variance: f.variance,
              variancePercent: f.variancePercent,
            })),
          },
        }),
        ...(segments.length > 0 && {
          segments: {
            count: segments.length,
            data: segments.map(s => ({
              name: s.name,
              description: s.description,
              revenuePercent: s.revenuePercent,
              results: s.segmentResults.map(r => ({
                period: r.period.label,
                revenue: r.revenue,
                yoyChange: r.yoyChange,
                operatingMargin: r.operatingMargin,
              })),
            })),
          },
        }),
        ...(quarterlyResults.length > 0 && q.match(/quarter|revenue|margin|eps|comp/) && {
          quarterlyResults: {
            count: quarterlyResults.length,
            data: quarterlyResults.map(qr => ({
              period: qr.period.label,
              revenue: qr.revenue,
              revenueYoY: qr.revenueYoY,
              operatingIncome: qr.operatingIncome,
              operatingMargin: qr.operatingMargin,
              eps: qr.eps,
              feeRevenueGrowth: qr.compStoreSales,
            })),
          },
        }),
        ...(bridgeItems.length > 0 && {
          revenueBridge: {
            count: bridgeItems.length,
            data: bridgeItems.map(b => ({
              label: b.label,
              impact: b.impact,
              description: b.description,
              category: b.category,
              period: b.period.label,
            })),
          },
        }),
        ...(initiatives.length > 0 && {
          initiatives: {
            count: initiatives.length,
            data: initiatives.map(i => ({
              name: i.name,
              description: i.description,
              status: i.status,
              progress: i.progress,
              budget: i.budget,
              spent: i.spent,
              milestones: i.milestones,
              kpis: i.kpis,
            })),
          },
        }),
        ...(risks.length > 0 && {
          risks: {
            count: risks.length,
            data: risks.map(r => ({
              title: r.title,
              category: r.category,
              severity: r.severity,
              likelihood: r.likelihood,
              impact: r.impact,
              mitigation: r.mitigation,
            })),
          },
        }),
        ...(marketData.length > 0 && q.match(/market|share|competitor/) && {
          market: {
            data: marketData.map(m => ({
              totalMarketSize: m.totalMarketSize,
              companyMarketShare: m.companyMarketShare,
              marketShareTarget: m.marketShareTarget,
              segmentGrowth: m.segmentGrowth,
              drivers: m.marketDrivers,
              challenges: m.marketChallenges,
            })),
            competitors: competitors.map(c => ({
              name: c.name,
              marketShare: c.marketShare,
              yoyChange: c.yoyChange,
              strengths: c.strengths,
            })),
          },
        }),
        ...(outlook.length > 0 && q.match(/forecast|outlook|forward|guidance/) && {
          outlook: {
            data: outlook.map(o => ({
              period: o.period,
              revenueForecast: o.revenueForecast,
              revenuePlan: o.revenuePlan,
              marginForecast: o.marginForecast,
              marginPlan: o.marginPlan,
              keyAssumptions: o.keyAssumptions,
            })),
          },
        }),
        ...(alertTemplates.length > 0 && {
          alerts: {
            count: alertTemplates.length,
            data: alertTemplates.map(a => ({
              title: a.title,
              category: a.category,
              severity: a.severity,
              threshold: a.threshold,
              description: a.description,
              suggestedActions: a.suggestedActions,
            })),
          },
        }),
        ...(reportTemplates.length > 0 && {
          reports: {
            count: reportTemplates.length,
            data: reportTemplates.map(r => ({
              name: r.name,
              category: r.category,
              frequency: r.frequency,
              description: r.description,
              department: r.department,
            })),
          },
        }),
        ...(consoles.length > 0 && {
          consoles: {
            count: consoles.length,
            data: consoles.map(c => ({
              title: c.title,
              category: c.category,
              objective: c.objective,
              keyDrivers: c.drivers.map(d => ({
                name: d.name,
                subDrivers: d.children.map(child => child.name),
              })),
            })),
          },
        }),
        ...(supplyChain.length > 0 && {
          supplyChain: {
            count: supplyChain.length,
            data: supplyChain.map(sc => ({
              label: sc.label,
              value: sc.value,
              target: sc.target,
              trend: sc.trend,
              status: sc.status,
            })),
          },
        }),
      },
    };

    logger.info('Search API request', { ip, query, totalResults: results.totalResults, durationMs: Date.now() - start });

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'private, no-store',
        ...getRateLimitHeaders(rateLimitResult, 60),
      },
    });
  } catch (error) {
    logger.error('Search API error', { ip, error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
