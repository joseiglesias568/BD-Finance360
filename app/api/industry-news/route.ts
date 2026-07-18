import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import type { IndustryNewsItem } from '@/lib/industry-news';
import { INDUSTRY_NEWS_FALLBACK } from '@/lib/industry-news';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const parser = new Parser({
  timeout: 12_000,
  headers: {
    'User-Agent': 'Finance360/1.0 (+internal; MedTech industry news ticker)',
    Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
  },
});

const FEEDS: { url: string; source: string }[] = [
  {
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(
      '("BD" OR "Becton Dickinson" OR "Becton, Dickinson" OR "BDX" OR "medical device" OR "MedTech" OR "GLP-1 device" OR "China VoBP" OR "Alaris" OR "BD Alaris" OR "BioPharma Systems" OR "prefillable syringe" OR "drug delivery device" OR "infusion pump") ("medical technology" OR "hospital" OR "surgical" OR "interventional" OR "connected care" OR "Medtronic" OR "Abbott" OR "Stryker")',
    )}&hl=en-US&gl=US&ceid=US:en`,
    source: 'Google News',
  },
  { url: 'https://www.medtechdive.com/feeds/news/', source: 'MedTech Dive' },
];

function normalizeTitle(title: string): string {
  return title.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 120);
}

function parseDate(raw?: string): string | null {
  if (!raw) return null;
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}

async function loadFeed(url: string, source: string): Promise<IndustryNewsItem[]> {
  try {
    const feed = await Promise.race([
      parser.parseURL(url),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('RSS timeout')), 14_000),
      ),
    ]);
    const items = feed.items ?? [];
    return items
      .map((it) => {
        const title = (it.title ?? '').trim();
        const link = String(it.link ?? (it as { guid?: string }).guid ?? '')
          .trim()
          .replace(/^permalink\s*/i, '');
        if (!title || !link || !/^https?:\/\//i.test(link)) return null;
        const publishedAt =
          parseDate(it.isoDate) ?? parseDate(it.pubDate ?? undefined) ?? null;
        return { title, link, source, publishedAt } satisfies IndustryNewsItem;
      })
      .filter(Boolean) as IndustryNewsItem[];
  } catch (e) {
    logger.warn('Industry news RSS fetch failed', {
      url,
      source,
      error: e instanceof Error ? e.message : 'unknown',
    });
    return [];
  }
}

// =============================================================================
// GET /api/industry-news
//
// Aggregates public RSS feeds (no third-party API key). Cached briefly at the
// edge hint below; failures fall back to editorial offline items.
// =============================================================================

export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = checkRateLimit(`industry-news:${ip}`, 45, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', items: INDUSTRY_NEWS_FALLBACK, fallback: true },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 45) },
    );
  }

  const headers = {
    'Cache-Control': 'private, max-age=120, stale-while-revalidate=300',
    ...getRateLimitHeaders(rateLimitResult, 45),
  };

  try {
    const batches = await Promise.all(FEEDS.map((f) => loadFeed(f.url, f.source)));
    const merged = batches.flat();

    const seen = new Set<string>();
    const unique: IndustryNewsItem[] = [];
    for (const item of merged) {
      const key = normalizeTitle(item.title);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }

    unique.sort((a, b) => {
      const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return tb - ta;
    });

    const items = unique.slice(0, 24);
    const payload =
      items.length > 0
        ? {
            items,
            fallback: false,
            sources: FEEDS.map((f) => f.source),
            disclaimer:
              'Headlines are from public RSS sources for situational awareness only — not verified by Becton, Dickinson and Company.',
          }
        : {
            items: INDUSTRY_NEWS_FALLBACK,
            fallback: true,
            sources: [] as string[],
            disclaimer:
              'Live feeds unavailable; showing editorial placeholders. Headlines are not verified by Becton, Dickinson and Company.',
          };

    return NextResponse.json(payload, { headers });
  } catch (error) {
    logger.error('Industry news API error', {
      error: error instanceof Error ? error.message : 'unknown',
    });
    return NextResponse.json(
      {
        items: INDUSTRY_NEWS_FALLBACK,
        fallback: true,
        sources: [],
        disclaimer:
          'Live feeds unavailable; showing editorial placeholders. Headlines are not verified by Becton, Dickinson and Company.',
      },
      { headers },
    );
  }
}
