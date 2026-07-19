'use client';

import type { IndustryNewsItem } from '@/lib/industry-news';
import { INDUSTRY_NEWS_FALLBACK } from '@/lib/industry-news';
import { Loader2, Newspaper, Radio } from 'lucide-react';
import { useEffect, useState } from 'react';

function TickerRun({ items }: { items: IndustryNewsItem[] }) {
    if (items.length === 0) return null;

    const buildCells = (keyPrefix: string) =>
        items.map((item, idx) => {
            const href = (item.link ?? '').trim();
            const safeHref = /^https?:\/\//i.test(href) ? href : 'https://news.google.com/';
            return (
            <span
                key={`${keyPrefix}-${idx}-${href.slice(0, 48) || 'nolink'}`}
                className="inline-flex items-center gap-2 px-1 text-[13px] leading-snug text-white/95"
            >
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#009AC7]" aria-hidden />
                <a
                    href={safeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-[28rem] truncate font-medium text-white/95 underline-offset-2 hover:underline"
                >
                    {item.title}
                </a>
                <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-white/45">
                    {item.source}
                </span>
            </span>
            );
        });

    return (
        <div className="min-w-0 flex-1 overflow-hidden">
            <div
                className="group flex w-max max-w-none animate-ticker motion-reduce:animate-none motion-reduce:transform-none hover:[animation-play-state:paused]"
                style={{
                    animationDuration: `${Math.max(28, items.length * 5) * 2}s`,
                }}
            >
                <div className="flex shrink-0 items-center gap-10 pr-10">{buildCells('a')}</div>
                <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
                    {buildCells('b')}
                </div>
            </div>
        </div>
    );
}

export default function IndustryNewsTicker() {
    const [items, setItems] = useState<IndustryNewsItem[] | null>(null);
    const [disclaimer, setDisclaimer] = useState<string>('');
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('/api/industry-news', { credentials: 'same-origin' });
                let data: {
                    items?: IndustryNewsItem[];
                    disclaimer?: string;
                    fallback?: boolean;
                };
                try {
                    data = await res.json();
                } catch {
                    data = {};
                }
                if (cancelled) return;
                if (data.items && data.items.length > 0) {
                    setItems(data.items);
                    setDisclaimer(data.disclaimer ?? '');
                    setLoadError(!res.ok || Boolean(data.fallback));
                } else {
                    setItems(INDUSTRY_NEWS_FALLBACK);
                    setDisclaimer('Could not load live RSS headlines.');
                    setLoadError(true);
                }
            } catch {
                if (cancelled) return;
                setItems(INDUSTRY_NEWS_FALLBACK);
                setDisclaimer('Could not load live RSS headlines.');
                setLoadError(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const displayItems = items ?? [];

    return (
        <div
            className="border-b border-[#001a3d] bg-gradient-to-r from-[#001433] via-[#1c519c] to-[#1c519c] text-white shadow-inner"
            role="region"
            aria-label="MedTech &amp; medical device industry headlines ticker"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
                <div className="flex items-center gap-3">
                    <div className="flex shrink-0 items-center gap-2 border-r border-white/15 pr-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                            <Radio className="h-4 w-4 text-[#009AC7]" aria-hidden />
                        </div>
                        <div className="hidden sm:block leading-tight">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
                                Industry wire
                            </p>
                            <p className="text-[11px] font-semibold text-white/90">MedTech &amp; medical device</p>
                        </div>
                    </div>

                    {items === null ? (
                        <div className="flex flex-1 items-center gap-2 py-1 text-sm text-white/70">
                            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
                            <span>Pulling public RSS feeds…</span>
                        </div>
                    ) : (
                        <TickerRun items={displayItems} />
                    )}
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-1.5 text-[10px] text-white/45">
                    <span className="inline-flex items-center gap-1">
                        <Newspaper className="h-3 w-3" aria-hidden />
                        Sources: Google News RSS + MedTech Dive — situational awareness only.
                    </span>
                    {disclaimer ? <span className="text-white/55">{disclaimer}</span> : null}
                    {loadError && <span className="text-amber-200/90">Offline or cached fallback — live RSS unavailable.</span>}
                </div>
            </div>
        </div>
    );
}
