/**
 * Shared types + offline fallback for the MedTech industry news ticker.
 * Live headlines are loaded via `/api/industry-news` (RSS aggregation).
 */

export interface IndustryNewsItem {
    title: string;
    link: string;
    /** Feed label shown in the ticker */
    source: string;
    /** ISO date string when known */
    publishedAt: string | null;
}

/** Shown when RSS feeds are unreachable or return no usable items. */
export const INDUSTRY_NEWS_FALLBACK: IndustryNewsItem[] = [
    {
        title:
            'Offline preview — connect to load live MedTech industry headlines from public RSS (MedTech Dive + Google News).',
        link: 'https://news.google.com/search?q=Becton+Dickinson+BDX+medical+device+MedTech&hl=en-US&gl=US&ceid=US:en',
        source: 'System',
        publishedAt: null,
    },
    {
        title: 'FDA, CMS, and international regulators publish medical device 510(k) clearances, PMA approvals, and reimbursement guidance on an ongoing basis.',
        link: 'https://www.fda.gov/medical-devices/newsroom',
        source: 'Industry note',
        publishedAt: null,
    },
    {
        title: 'BD discusses segment performance (Medical Essentials, Connected Care, BioPharma Systems, Interventional), organic revenue growth, Alaris ramp, and China VoBP headwind each quarter on earnings calls and in SEC filings.',
        link: 'https://investors.bd.com/',
        source: 'Research anchor',
        publishedAt: null,
    },
];
