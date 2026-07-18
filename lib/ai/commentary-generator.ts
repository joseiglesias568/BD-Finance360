// ════════════════════════════════════════════════════════════════════════════
// COMMENTARY GENERATOR
// ════════════════════════════════════════════════════════════════════════════
// Generates 700-1,000 deterministic human commentary entries aligned to the
// semantic driver/metric architecture. Each entry is authored by one of 8
// personas and maps to specific consoles, drivers, and KPIs.
// ════════════════════════════════════════════════════════════════════════════

import { allSemanticConsoles } from '../semantic';
import type { SemanticConsole, SemanticDriver, SemanticMetric } from '../semantic';
import { SemanticEngine } from '../semantic/engine';
import type { ComputedDriver, ComputedMetric } from '../semantic/engine';

// ════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════

export interface CommentarySeed {
    companyId: number;
    externalId: string;
    title: string;
    content: string;
    contentPlain: string;
    authorName: string;
    authorRole: string;
    category: string;
    tags: string[];
    relatedKPIs: string[];
    relatedConsoles: string[];
    relatedDrivers: string[];
    linkedInsightId: null;
    fiscalPeriod: string;
    periodType: 'quarter' | 'year';
    status: 'published';
    priority: 'critical' | 'high' | 'medium' | 'low';
    commentaryType: 'analysis' | 'action-item' | 'risk-flag' | 'context' | 'recommendation';
    driverId: null;
    aggregationLevel: 'manual';
    isAiGenerated: false;
    sourceCommentaryIds: [];
    createdAt: string;
    updatedAt: string;
}

// ════════════════════════════════════════════════════════════════════════════
// PERSONAS
// ════════════════════════════════════════════════════════════════════════════

interface Persona {
    name: string;
    role: string;
    categories: string[];
    voiceTraits: string[];
    focusAreas: string[];
}

const PERSONAS: Persona[] = [
    {
        name: 'Sarah Johnson',
        role: 'VP, Financial Planning & Analysis',
        categories: ['Financial Performance', 'Revenue & Market'],
        voiceTraits: ['analytical', 'detail-oriented', 'data-driven'],
        focusAreas: ['margin analysis', 'cost structure', 'variance explanation', 'forecast accuracy'],
    },
    {
        name: 'Michael Chen',
        role: 'Director, Treasury & Risk Management',
        categories: ['Risk & Sustainability', 'Financial Performance'],
        voiceTraits: ['cautious', 'risk-aware', 'quantitative'],
        focusAreas: ['debt management', 'hedging', 'compliance', 'liquidity'],
    },
    {
        name: 'Leonard P. Singh',
        role: 'CFO, Becton, Dickinson and Company',
        categories: ['Financial Performance', 'Revenue & Market', 'Strategic'],
        voiceTraits: ['strategic', 'concise', 'board-level'],
        focusAreas: ['P&L impact', 'capital allocation', 'shareholder value', 'long-term targets'],
    },
    {
        name: 'Lisa Wang',
        role: 'VP, Regulatory Affairs',
        categories: ['Revenue & Market'],
        voiceTraits: ['regulatory-savvy', 'policy-oriented', 'compliance-focused'],
        focusAreas: ['rate case strategy', 'regulatory recovery', 'PISA/PPRA', 'Illinois MYRP', 'FERC formula rate'],
    },
    {
        name: 'David Park',
        role: 'VP, Missouri Operations',
        categories: ['Operations & Service Delivery'],
        voiceTraits: ['operational', 'hands-on', 'efficiency-focused'],
        focusAreas: ['electric distribution', 'Missouri grid reliability', 'SAIFI/CAIDI', 'data center load', 'summer peak management'],
    },
    {
        name: 'Amanda Foster',
        role: 'VP, Digital & Platform',
        categories: ['Digital & Customer'],
        voiceTraits: ['tech-forward', 'customer-centric', 'data-first'],
        focusAreas: ['client engagement', 'digital platform adoption', 'CRM analytics', 'personalization'],
    },
    {
        name: 'James Wilson',
        role: 'Director, Supply Chain',
        categories: ['Operations & Service Delivery', 'Risk & Compliance'],
        voiceTraits: ['logistics-minded', 'cost-conscious', 'efficiency-driven'],
        focusAreas: ['commodity costs', 'supply chain efficiency', 'sustainability', 'vendor management'],
    },
    {
        name: 'Priya Sharma',
        role: 'VP, Human Resources',
        categories: ['People & Culture'],
        voiceTraits: ['people-first', 'empathetic', 'retention-focused'],
        focusAreas: ['workforce investment', 'retention', 'training', 'benefits', 'employee engagement'],
    },
];

// ════════════════════════════════════════════════════════════════════════════
// CATEGORY MAPPING
// ════════════════════════════════════════════════════════════════════════════

const CATEGORY_MAP: Record<string, string> = {
    'revenue-market': 'Revenue & Market',
    'store-operations': 'Operations & Service Delivery',
    'digital-customer': 'Digital & Customer',
    'people-culture': 'People & Culture',
    'financial': 'Financial Performance',
    'risk-sustainability': 'Risk & Compliance',
};

// ════════════════════════════════════════════════════════════════════════════
// SEEDED RANDOM NUMBER GENERATOR
// ════════════════════════════════════════════════════════════════════════════
// Deterministic PRNG (Mulberry32) to produce consistent output across runs.

function createSeededRng(seed: number): () => number {
    let state = seed | 0;
    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        hash = ((hash << 5) - hash + ch) | 0;
    }
    return hash;
}

// ════════════════════════════════════════════════════════════════════════════
// HELPER UTILITIES
// ════════════════════════════════════════════════════════════════════════════

function generateUUID(rng: () => number): string {
    const hex = '0123456789abcdef';
    let uuid = '';
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4';
        } else if (i === 19) {
            uuid += hex[(Math.floor(rng() * 4) + 8)];
        } else {
            uuid += hex[Math.floor(rng() * 16)];
        }
    }
    return uuid;
}

function stripMarkdown(md: string): string {
    return md
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^[-*]\s+/gm, '- ')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .trim();
}

function pickWeighted<T>(rng: () => number, items: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = rng() * total;
    for (let i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r <= 0) return items[i];
    }
    return items[items.length - 1];
}

function pickRandom<T>(rng: () => number, arr: T[]): T {
    return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(rng: () => number, arr: T[], n: number): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(n, shuffled.length));
}

/** Collect all metrics from a driver and its immediate children (not full recursion). */
function collectDriverMetrics(driver: SemanticDriver): SemanticMetric[] {
    const result: SemanticMetric[] = driver.metrics ? [...driver.metrics] : [];
    if (driver.children) {
        for (const child of driver.children) {
            if (child.metrics) {
                result.push(...child.metrics);
            }
        }
    }
    return result;
}

/** Generate an ISO date string between two timestamps. */
function randomDate(rng: () => number, startMs: number, endMs: number): string {
    const ms = startMs + Math.floor(rng() * (endMs - startMs));
    return new Date(ms).toISOString();
}

// ════════════════════════════════════════════════════════════════════════════
// FISCAL PERIODS
// ════════════════════════════════════════════════════════════════════════════

const FISCAL_PERIODS = [
    { period: 'Q4 FY25', periodType: 'quarter' as const, dateRangeStart: new Date('2025-10-01').getTime(), dateRangeEnd: new Date('2025-12-15').getTime() },
    { period: 'Q1 FY26', periodType: 'quarter' as const, dateRangeStart: new Date('2026-01-05').getTime(), dateRangeEnd: new Date('2026-02-28').getTime() },
];

// ════════════════════════════════════════════════════════════════════════════
// COMMENTARY TYPE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════

type CommentaryType = 'analysis' | 'action-item' | 'risk-flag' | 'context' | 'recommendation';

const COMMENTARY_TYPE_WEIGHTS: Record<CommentaryType, number> = {
    'analysis': 30,
    'action-item': 20,
    'risk-flag': 15,
    'context': 15,
    'recommendation': 20,
};

const COMMENTARY_TYPES: CommentaryType[] = Object.keys(COMMENTARY_TYPE_WEIGHTS) as CommentaryType[];
const COMMENTARY_WEIGHTS: number[] = COMMENTARY_TYPES.map(t => COMMENTARY_TYPE_WEIGHTS[t]);

// ════════════════════════════════════════════════════════════════════════════
// PRIORITY DISTRIBUTION: ~8% critical, ~25% high, ~45% medium, ~22% low
// ════════════════════════════════════════════════════════════════════════════

type Priority = 'critical' | 'high' | 'medium' | 'low';

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const PRIORITY_WEIGHTS: number[] = [8, 25, 45, 22];

// ════════════════════════════════════════════════════════════════════════════
// CONTENT GENERATION TEMPLATES
// ════════════════════════════════════════════════════════════════════════════

interface ContentContext {
    persona: Persona;
    console: SemanticConsole;
    driver: SemanticDriver;
    metrics: SemanticMetric[];
    computedDriver?: ComputedDriver;
    computedMetrics: ComputedMetric[];
    commentaryType: CommentaryType;
    fiscalPeriod: string;
    rng: () => number;
}

// ---------------------------------------------------------------------------
// Title templates by commentary type
// ---------------------------------------------------------------------------

function generateTitle(ctx: ContentContext): string {
    const { commentaryType, driver, console: con, rng } = ctx;

    const analysisTemplates = [
        `${driver.name}: Performance Deep Dive`,
        `${driver.name} — Quarterly Analysis`,
        `${con.title} ${driver.name} Review`,
        `Performance Assessment: ${driver.name}`,
        `${driver.name} Variance Analysis`,
        `Trend Analysis: ${driver.name}`,
        `${driver.name} Results Summary`,
    ];

    const actionTemplates = [
        `Action Required: ${driver.name} Improvement Plan`,
        `${driver.name} — Immediate Actions Needed`,
        `Corrective Actions: ${driver.name}`,
        `${driver.name} Acceleration Initiative`,
        `Priority Actions for ${driver.name}`,
        `${driver.name} Remediation Steps`,
    ];

    const riskTemplates = [
        `Risk Alert: ${driver.name} Underperformance`,
        `${driver.name} — Risk Assessment Update`,
        `Emerging Risk: ${driver.name} Trends`,
        `${driver.name} Exposure Analysis`,
        `Watchlist: ${driver.name} Trajectory`,
        `${driver.name} Downside Scenario`,
    ];

    const contextTemplates = [
        `Market Context: ${driver.name}`,
        `${driver.name} — Industry Backdrop`,
        `Contextual Factors Affecting ${driver.name}`,
        `${driver.name}: What the Numbers Tell Us`,
        `Background: ${driver.name} Dynamics`,
        `${driver.name} in Perspective`,
    ];

    const recTemplates = [
        `Recommendation: ${driver.name} Strategy`,
        `${driver.name} — Proposed Path Forward`,
        `Strategic Recommendation: ${driver.name}`,
        `${driver.name} Optimization Proposal`,
        `Forward Plan: ${driver.name}`,
        `${driver.name} Enhancement Roadmap`,
    ];

    const templateMap: Record<CommentaryType, string[]> = {
        'analysis': analysisTemplates,
        'action-item': actionTemplates,
        'risk-flag': riskTemplates,
        'context': contextTemplates,
        'recommendation': recTemplates,
    };

    return pickRandom(rng, templateMap[commentaryType]);
}

// ---------------------------------------------------------------------------
// Metric reference snippets
// ---------------------------------------------------------------------------

function formatMetricRef(metric: SemanticMetric, computed?: ComputedMetric): string {
    const value = computed?.value.display ?? metric.currentValue;
    if (!value) return metric.name;
    const statusTag = computed?.status ? ` [${computed.status.toUpperCase()}]` : '';
    return `${metric.name} at **${value}**${statusTag}`;
}

function formatMetricTarget(metric: SemanticMetric, computed?: ComputedMetric): string {
    const target = computed?.target?.display ?? metric.target;
    if (!target) return '';
    const gapStr = computed?.gap ? `, gap: ${computed.gap.display}` : '';
    return ` (target: ${target}${gapStr})`;
}

// ---------------------------------------------------------------------------
// Variance and movement generators
// ---------------------------------------------------------------------------

const POSITIVE_MOVEMENTS = [
    '+2.3% QoQ', '+150bps YoY', '+4.1% vs prior quarter', '+$18M vs plan',
    '+0.8pp sequential improvement', '+3.2% ahead of forecast', '+$45M favorable to budget',
    'up 180bps from Q3', '+5.7% on a constant-currency basis', '+$22M incremental contribution',
];

const NEGATIVE_MOVEMENTS = [
    '-1.8% QoQ', '-90bps YoY', '-2.4% vs prior quarter', '-$12M vs plan',
    '-0.5pp sequential decline', '-1.6% behind forecast', '-$28M unfavorable to budget',
    'down 120bps from Q3', '-3.1% on a reported basis', '-$15M headwind',
];

const NEUTRAL_MOVEMENTS = [
    'flat QoQ', 'in line with expectations', 'tracking to plan within 50bps',
    'broadly stable on a sequential basis', 'consistent with prior quarter trends',
];

function pickMovement(rng: () => number, direction: 'positive' | 'negative' | 'neutral'): string {
    if (direction === 'positive') return pickRandom(rng, POSITIVE_MOVEMENTS);
    if (direction === 'negative') return pickRandom(rng, NEGATIVE_MOVEMENTS);
    return pickRandom(rng, NEUTRAL_MOVEMENTS);
}

// ---------------------------------------------------------------------------
// Driver-aware content fragments
// ---------------------------------------------------------------------------

const FORWARD_STATEMENTS = [
    'We expect continued momentum through Q2 as seasonal tailwinds materialize.',
    'Looking ahead, the trajectory suggests we can close the gap to target by end of fiscal year.',
    'If current trends persist, we project full-year results will land within guidance range.',
    'Management is targeting accelerated improvement in the back half of the fiscal year.',
    'The pipeline of initiatives currently in execution should begin yielding measurable results by Q2 FY26.',
    'Our base case assumption is that performance stabilizes in the near term before inflecting upward in H2.',
    'Early indicators from January and February suggest the trend is bending in the right direction.',
    'We are cautiously optimistic that the interventions launched in Q4 will drive incremental improvement.',
    'The team has set a target of returning to the **+4-6%** growth corridor by Q3 FY26.',
    'We are monitoring weekly KPIs closely and will escalate to the leadership team if the trajectory does not improve within the next 30 days.',
];

const CAUSAL_PHRASES = [
    'This was primarily driven by',
    'The key contributors include',
    'Several factors contributed to this outcome:',
    'Root cause analysis points to',
    'Performance was influenced by',
    'The main drivers behind this result are',
    'This movement is attributable to',
    'A combination of factors explain this shift:',
];

// ---------------------------------------------------------------------------
// Persona-specific content phrases
// ---------------------------------------------------------------------------

function getPersonaOpenings(persona: Persona, rng: () => number): string[] {
    const openersByRole: Record<string, string[]> = {
        'VP, Financial Planning & Analysis': [
            'From an FP&A standpoint,',
            'Our variance analysis indicates that',
            'Looking at the underlying financials,',
            'The P&L walk shows',
            'Bridge analysis reveals that',
        ],
        'Director, Treasury & Risk Management': [
            'From a risk management perspective,',
            'Our hedging position suggests',
            'Treasury analysis confirms that',
            'The exposure assessment indicates',
            'Our risk models flag',
        ],
        'CFO': [
            'At the enterprise level,',
            'From a shareholder value perspective,',
            'The board should note that',
            'Our capital allocation framework suggests',
            'I want to highlight for the leadership team that',
        ],
        'VP, Regulatory Affairs': [
            'From a regulatory standpoint,',
            'Our rate case analysis indicates',
            'The regulatory framework suggests',
            'Commission filings show',
            'Regulatory intelligence confirms',
        ],
        'VP, Missouri Operations': [
            'On the operations side,',
            'Field reports confirm that',
            'Our grid performance data shows',
            'Operational metrics indicate',
            'From an execution standpoint,',
        ],
        'VP, Digital & Platform': [
            'On the digital front,',
            'Our platform analytics show',
            'Client behavioral data indicates',
            'From a digital engagement perspective,',
            'The platform data reveals',
        ],
        'Director, Supply Chain': [
            'From a supply chain perspective,',
            'Commodity market analysis shows',
            'Our procurement data indicates',
            'Supply chain visibility suggests',
            'Logistics performance data shows',
        ],
        'VP, Human Resources': [
            'From a people perspective,',
            'Our employee engagement data shows',
            'Workforce analytics indicate that',
            'The employee experience survey reveals',
            'Retention metrics suggest that',
        ],
    };

    return openersByRole[persona.role] || ['Analysis indicates that'];
}

// ---------------------------------------------------------------------------
// Markdown content generator
// ---------------------------------------------------------------------------

function generateContent(ctx: ContentContext): string {
    const { persona, driver, metrics, computedMetrics, computedDriver, commentaryType, fiscalPeriod, rng } = ctx;
    const opener = pickRandom(rng, getPersonaOpenings(persona, rng));

    // Build metric references using computed values when available
    const metricRefs = metrics.length > 0
        ? metrics.slice(0, 3).map(m => {
            const computed = computedMetrics.find(cm => cm.id === m.id);
            return formatMetricRef(m, computed) + formatMetricTarget(m, computed);
          })
        : [`${driver.name} performance`];

    // Use computed health score to determine movement direction instead of random
    const healthScore = computedDriver?.healthScore;
    let moveDir: 'positive' | 'negative' | 'neutral';
    if (healthScore !== undefined) {
        moveDir = healthScore >= 70 ? 'positive' : healthScore >= 40 ? 'neutral' : 'negative';
    } else {
        moveDir = rng() < 0.45 ? 'positive' : rng() < 0.75 ? 'negative' : 'neutral';
    }
    const movement = pickMovement(rng, moveDir);
    const cause = pickRandom(rng, CAUSAL_PHRASES);
    const forward = pickRandom(rng, FORWARD_STATEMENTS);

    switch (commentaryType) {
        case 'analysis':
            return generateAnalysis(opener, metricRefs, movement, cause, forward, ctx);
        case 'action-item':
            return generateActionItem(opener, metricRefs, movement, cause, ctx);
        case 'risk-flag':
            return generateRiskFlag(opener, metricRefs, movement, cause, ctx);
        case 'context':
            return generateContext(opener, metricRefs, movement, cause, forward, ctx);
        case 'recommendation':
            return generateRecommendation(opener, metricRefs, movement, cause, forward, ctx);
    }
}

function generateAnalysis(
    opener: string,
    metricRefs: string[],
    movement: string,
    cause: string,
    forward: string,
    ctx: ContentContext,
): string {
    const { driver, fiscalPeriod, rng, console: con } = ctx;
    const metricsJoined = metricRefs.join(', ');

    const para1Variants = [
        `${opener} ${driver.name} came in at **${movement}** for ${fiscalPeriod}. Key metrics tracked include ${metricsJoined}. ${cause} a combination of volume and pricing dynamics across the ${con.title} console.`,
        `${opener} the ${driver.name} results for ${fiscalPeriod} reflect **${movement}** performance. We observed ${metricsJoined} during the period. ${cause} underlying shifts in the business mix and execution cadence.`,
        `${opener} ${fiscalPeriod} results for ${driver.name} show **${movement}**. The key data points are ${metricsJoined}. ${cause} both cyclical trends and discrete operational initiatives.`,
    ];

    const para2Variants = [
        `Decomposing the variance further, we see that the primary swing factor was ${pickRandom(rng, ctx.persona.focusAreas)}. The year-over-year comparison is distorted somewhat by the prior-year lap, but adjusting for that, underlying trends are ${rng() > 0.5 ? 'encouraging' : 'mixed'}.`,
        `When we drill into the driver tree, the top contributing factors are concentrated in ${pickRandom(rng, ctx.persona.focusAreas)}. Sequential improvement is evident when adjusting for seasonal patterns, though we remain below our internal targets.`,
        `The quarter-over-quarter trajectory shows ${rng() > 0.5 ? 'stabilization' : 'modest volatility'}. Our internal benchmarking against the ${con.title} targets indicates a gap of approximately **${Math.floor(rng() * 200 + 50)}bps** that needs to be addressed.`,
    ];

    const para3Variants = [
        `${forward}`,
        `${forward} We will continue to monitor the weekly flash reports and provide an updated assessment at the next business review.`,
        `Net assessment: ${rng() > 0.5 ? 'Cautiously positive' : 'Neutral with upside potential'}. ${forward}`,
    ];

    return `${pickRandom(rng, para1Variants)}\n\n${pickRandom(rng, para2Variants)}\n\n${pickRandom(rng, para3Variants)}`;
}

function generateActionItem(
    opener: string,
    metricRefs: string[],
    movement: string,
    cause: string,
    ctx: ContentContext,
): string {
    const { driver, fiscalPeriod, rng, persona } = ctx;
    const focus = pickRandom(rng, persona.focusAreas);

    const actionItems = [
        `Conduct a deep-dive diagnostic on ${driver.name} by end of week to quantify the exact gap to target`,
        `Engage cross-functional stakeholders from ${focus} to develop a 30-day acceleration plan`,
        `Escalate the ${driver.name} trajectory to the monthly business review for leadership visibility`,
        `Implement weekly flash reporting cadence for ${driver.name} to track intervention effectiveness`,
        `Commission a root-cause analysis with the analytics team to isolate the top 3 contributing factors`,
        `Develop scenario models for best-case and worst-case ${driver.name} outcomes through Q2 FY26`,
        `Review resource allocation for ${focus} initiatives and propose rebalancing if needed`,
        `Benchmark ${driver.name} performance against the top-quartile peer set to identify best practices`,
        `Schedule a war room session with regional leads to align on corrective actions within 2 weeks`,
        `Prepare an executive brief for the CFO summarizing ${driver.name} trends and proposed interventions`,
    ];

    const selected = pickN(rng, actionItems, 3 + Math.floor(rng() * 2));

    const para1 = `${opener} ${driver.name} performance for ${fiscalPeriod} at **${movement}** requires immediate attention. Current metrics show ${metricRefs[0]}. ${cause} execution gaps that we need to address proactively.`;

    const bulletList = selected.map(a => `- ${a}`).join('\n');

    const para3 = `Ownership for these actions falls to the ${focus} team with a target completion date of ${rng() > 0.5 ? '2 weeks' : '30 days'} from today. I will track progress against these items in the next review cycle.`;

    return `${para1}\n\n**Recommended Actions:**\n${bulletList}\n\n${para3}`;
}

function generateRiskFlag(
    opener: string,
    metricRefs: string[],
    movement: string,
    cause: string,
    ctx: ContentContext,
): string {
    const { driver, fiscalPeriod, rng, console: con } = ctx;

    const riskFactors = [
        'macroeconomic headwinds including consumer sentiment softening',
        'competitive pressure intensifying in our core markets',
        'regulatory changes that could impact operating costs',
        'supply chain disruptions affecting service levels',
        'foreign exchange volatility creating earnings translation risk',
        'labor market tightness driving wage inflation above plan',
        'commodity price spikes threatening margin targets',
        'technology platform migration risks during the transition period',
        'customer behavior shifts toward lower-margin channels',
        'geopolitical uncertainty in key international markets',
    ];

    const selectedRisks = pickN(rng, riskFactors, 2);

    const para1 = `${opener} I am flagging a ${ctx.rng() > 0.6 ? 'material' : 'developing'} risk related to ${driver.name} within the ${con.title} console. ${fiscalPeriod} results at **${movement}** are tracking below our risk threshold. Current readings show ${metricRefs.join('; ')}.`;

    const para2 = `${cause} ${selectedRisks[0]} combined with ${selectedRisks[1]}. The risk-adjusted scenario suggests a potential **${Math.floor(rng() * 150 + 50)}bps** margin impact if these trends persist unaddressed through Q2 FY26. Our sensitivity analysis indicates that each **100bps** deterioration in ${driver.name} translates to approximately **$${Math.floor(rng() * 40 + 10)}M** in annualized EBITDA impact.`;

    const para3Variants = [
        `Mitigation recommendation: activate the contingency plan outlined in the Q4 risk register and convene an ad-hoc risk committee review within the next 7 days.`,
        `I recommend we elevate this to the enterprise risk dashboard and include it in the next Board risk report. The probability-weighted downside scenario warrants management attention.`,
        `This item has been added to the active risk watchlist. I will provide weekly status updates and recommend triggering our pre-defined mitigation protocols if the trend does not reverse within 2 reporting cycles.`,
    ];

    return `${para1}\n\n${para2}\n\n${pickRandom(rng, para3Variants)}`;
}

function generateContext(
    opener: string,
    metricRefs: string[],
    movement: string,
    cause: string,
    forward: string,
    ctx: ContentContext,
): string {
    const { driver, fiscalPeriod, rng, console: con } = ctx;

    const contextFactors = [
        `The broader regulated utility sector saw ${rng() > 0.5 ? 'continued rate base investment momentum as infrastructure spending accelerated across the MISO footprint' : 'moderated capital markets activity as interest rate uncertainty created some financing cost headwinds for utilities'} during the period.`,
        `Data center load growth continued ${rng() > 0.5 ? 'at an exceptional pace, with hyperscaler ESA applications in the Missouri service territory surpassing 5 GW pipeline' : 'to be a primary driver of Missouri electric load growth, with 2.2 GW of binding ESAs executed as of February 2026'}.`,
        `Weather conditions were ${rng() > 0.5 ? 'favorable for the quarter, with above-normal heating degree days supporting CVS Pharmacy gas revenue and Missouri winter electric demand' : 'largely in line with normal, with mild temperatures reducing weather-driven revenue upside vs. plan for the quarter'}.`,
        `The regulatory environment ${rng() > 0.5 ? 'remained constructive, with the Missouri MoPSC rate case process advancing and Illinois ICC signaling support for continued grid modernization investment' : 'introduced some uncertainty as IED earned ROE continued to trail the 9.22% allowed return under the MYRP formula rate'}.`,
        `Macroeconomic conditions including ${rng() > 0.5 ? 'moderating interest rates providing some relief on long-term debt refinancing costs' : 'elevated Henry Hub natural gas prices creating modest headwinds on Missouri generation economics, partially mitigated by the PPRA tracker'} provided the backdrop for this quarter's results.`,
        `Seasonal patterns aligned with historical norms, with ${rng() > 0.5 ? 'Q1 reflecting the winter heating season peak for CVS Pharmacy gas revenues and elevated Missouri electric demand' : 'Q3 expected to be the strongest revenue quarter as summer cooling degree days drive peak electric demand and rate base returns'}.`,
    ];

    const para1 = `${opener} to properly interpret the ${driver.name} results for ${fiscalPeriod} (**${movement}**), it is important to consider the broader operating context. ${metricRefs[0]} should be evaluated against several external factors.`;

    const para2 = pickRandom(rng, contextFactors) + ' ' + pickRandom(rng, contextFactors);

    const para3 = `Within this context, our ${con.title} performance is ${rng() > 0.5 ? 'tracking favorably relative to the industry benchmark' : 'broadly in line with peer performance, though below our internal stretch targets'}. ${forward}`;

    return `${para1}\n\n${para2}\n\n${para3}`;
}

function generateRecommendation(
    opener: string,
    metricRefs: string[],
    movement: string,
    cause: string,
    forward: string,
    ctx: ContentContext,
): string {
    const { driver, fiscalPeriod, rng, persona, console: con } = ctx;
    const focus = pickRandom(rng, persona.focusAreas);

    const recommendations = [
        `Accelerate the rollout of ${focus} initiatives by compressing the timeline from 12 weeks to 8 weeks`,
        `Reallocate **$${Math.floor(rng() * 15 + 5)}M** from lower-priority discretionary spend toward ${driver.name} improvement programs`,
        `Launch a targeted pilot program in our top ${Math.floor(rng() * 50 + 50)} stores to test the proposed intervention before system-wide deployment`,
        `Partner with the analytics team to build a predictive model for ${driver.name} that enables proactive intervention 4-6 weeks ahead of variance`,
        `Establish a dedicated cross-functional task force with weekly cadence to drive ${driver.name} improvements through Q2 FY26`,
        `Renegotiate vendor terms to capture an estimated **${Math.floor(rng() * 200 + 100)}bps** cost improvement on the supply side`,
        `Invest in technology automation that our modeling suggests could improve ${driver.name} throughput by **${Math.floor(rng() * 15 + 5)}%** within 6 months`,
        `Align incentive structures for field leadership to the ${driver.name} KPIs we are trying to move`,
    ];

    const selected = pickN(rng, recommendations, 3);

    const para1 = `${opener} based on the ${fiscalPeriod} results for ${driver.name} (**${movement}**) and my assessment of the ${con.title} trajectory, I am proposing the following strategic recommendations. Key metrics under review include ${metricRefs.join(', ')}.`;

    const bulletList = selected.map((r, i) => `${i + 1}. ${r}`).join('\n');

    const para3 = `Expected impact: if executed on the proposed timeline, these recommendations have the potential to improve ${driver.name} performance by **${Math.floor(rng() * 300 + 100)}bps** over the next two quarters. ${forward}`;

    return `${para1}\n\n**Recommendations:**\n${bulletList}\n\n${para3}`;
}

// ---------------------------------------------------------------------------
// Tag generation
// ---------------------------------------------------------------------------

function generateTags(console: SemanticConsole, driver: SemanticDriver, metrics: SemanticMetric[], rng: () => number): string[] {
    const tags: string[] = [];

    // Console-derived tags
    const consoleTagMap: Record<string, string[]> = {
        'missouri-electric-operations': ['missouri-electric', 'distribution', 'saifi', 'load-growth'],
        'illinois-electric-distribution': ['ied', 'myrp', 'ami', 'grid-modernization'],
        'illinois-natural-gas': ['CVS PCW', 'gas-distribution', 'hdd', 'main-replacement'],
        'regulatory-affairs': ['rate-case', 'mopsc', 'icc', 'pisa', 'ppra'],
        'clean-energy-transition': ['castle-bluff', 'renewables', 'callaway', 'ira-credits'],
        'capital-program-rate-base': ['capex', 'rate-base', 'pisa', 'investment'],
        'transmission-infrastructure': ['CVS Pharmacy', 'ferc', 'miso-lrtp', 'transmission'],
        'supply-chain-om': ['procurement', 'om-efficiency', 'sourcing', 'vendor-mgmt'],
        'customer-experience-digital': ['mycvs', 'digital', 'nps', 'csat'],
        'grid-modernization': ['ami', 'distribution-automation', 'smart-grid', 'da'],
        'workforce-culture': ['talent', 'retention', 'training', 'safety'],
        'energy-efficiency-programs': ['efficiency', 'demand-response', 'conservation'],
        'sustainability-esg': ['esg', 'carbon', 'clean-energy', 'ira'],
        'safety-compliance': ['safety', 'osha', 'nrc', 'compliance'],
    };

    const consoleTags = consoleTagMap[console.id] || [console.id];
    tags.push(...pickN(rng, consoleTags, Math.min(3, consoleTags.length)));

    // Metric-derived tags
    if (metrics.length > 0) {
        const metricTag = metrics[0].name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .slice(0, 2)
            .join('-');
        if (metricTag && !tags.includes(metricTag)) {
            tags.push(metricTag);
        }
    }

    // Driver-derived tag
    const driverTag = driver.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .slice(0, 2)
        .join('-');
    if (driverTag && !tags.includes(driverTag)) {
        tags.push(driverTag);
    }

    return tags.slice(0, 5);
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN GENERATOR
// ════════════════════════════════════════════════════════════════════════════

export function generateAllCommentary(): CommentarySeed[] {
    const results: CommentarySeed[] = [];
    const engine = SemanticEngine.getInstance();

    // Build a mapping from display category -> list of consoles
    const consolesByCategory = new Map<string, SemanticConsole[]>();
    for (const con of allSemanticConsoles) {
        const displayCat = CATEGORY_MAP[con.category] || con.category;
        if (!consolesByCategory.has(displayCat)) {
            consolesByCategory.set(displayCat, []);
        }
        consolesByCategory.get(displayCat)!.push(con);
    }

    // Also add a "Strategic" pseudo-mapping: CFO can generate strategic
    // commentary referencing financial-performance and capital-allocation
    consolesByCategory.set('Strategic', [
        ...allSemanticConsoles.filter(c => c.category === 'financial'),
    ]);

    let globalCounter = 0;

    // Helper to create a single commentary entry
    function createEntry(
        persona: Persona,
        con: SemanticConsole,
        driver: SemanticDriver,
        parentDriverName: string | null,
        metrics: SemanticMetric[],
        category: string,
        rng: () => number,
        entryIndex: number,
    ): CommentarySeed {
        // Look up computed driver and metrics from the engine
        const computedDriver = engine.getDriver(driver.id);
        const computedMetrics = computedDriver?.metrics ?? [];
        globalCounter++;
        const fp = FISCAL_PERIODS[entryIndex % FISCAL_PERIODS.length];
        let commentaryType = pickWeighted(rng, COMMENTARY_TYPES, COMMENTARY_WEIGHTS);
        const priority = pickWeighted(rng, PRIORITIES, PRIORITY_WEIGHTS);
        const displayCategory = category === 'Strategic'
            ? 'Strategic'
            : CATEGORY_MAP[con.category] || con.category;

        // Use computed health to bias commentary type toward risk-flag/action-item for unhealthy drivers
        const health = computedDriver?.healthScore;
        if (health !== undefined && health <= 25) {
            // Override toward risk/action for critically unhealthy drivers
            const riskBias = rng();
            if (riskBias < 0.4) commentaryType = 'risk-flag';
            else if (riskBias < 0.7) commentaryType = 'action-item';
        }

        const ctx: ContentContext = {
            persona,
            console: con,
            driver,
            metrics,
            computedDriver,
            computedMetrics,
            commentaryType,
            fiscalPeriod: fp.period,
            rng,
        };

        const title = generateTitle(ctx);
        const content = generateContent(ctx);
        const contentPlain = stripMarkdown(content);
        const createdAt = randomDate(rng, fp.dateRangeStart, fp.dateRangeEnd);
        const updatedOffset = Math.floor(rng() * 3 * 24 * 60 * 60 * 1000);
        const updatedAt = new Date(new Date(createdAt).getTime() + updatedOffset).toISOString();
        const tags = generateTags(con, driver, metrics, rng);
        const relatedKPIs = metrics.length > 0
            ? metrics.slice(0, 4).map(m => m.name)
            : [driver.name];

        const relatedDriverNames = parentDriverName
            ? [parentDriverName, driver.name]
            : [driver.name];

        return {
            companyId: 1,
            externalId: `gen-commentary-${globalCounter.toString().padStart(5, '0')}-${generateUUID(rng)}`,
            title,
            content,
            contentPlain,
            authorName: persona.name,
            authorRole: persona.role,
            category: displayCategory,
            tags,
            relatedKPIs,
            relatedConsoles: [con.id],
            relatedDrivers: relatedDriverNames,
            linkedInsightId: null,
            fiscalPeriod: fp.period,
            periodType: fp.periodType,
            status: 'published',
            priority,
            commentaryType,
            driverId: null,
            aggregationLevel: 'manual',
            isAiGenerated: false,
            sourceCommentaryIds: [],
            createdAt,
            updatedAt,
        };
    }

    for (const persona of PERSONAS) {
        for (const category of persona.categories) {
            const consoles = consolesByCategory.get(category);
            if (!consoles) continue;

            for (const con of consoles) {
                // === LEVEL 1: Top-level drivers — 1-2 entries each ===
                for (const driver of con.drivers) {
                    const seedKey = `${persona.name}:${con.id}:${driver.id}`;
                    const seedHash = hashString(seedKey);
                    const rng = createSeededRng(seedHash);

                    const metrics = collectDriverMetrics(driver);

                    // Top-level drivers get 1-2 entries (weighted 40/60)
                    const entryCount = pickWeighted(rng, [1, 2], [40, 60]);

                    for (let e = 0; e < entryCount; e++) {
                        results.push(createEntry(persona, con, driver, null, metrics, category, rng, e));
                    }

                    // === LEVEL 2: Child drivers — 1 entry each for ~70% of children ===
                    if (driver.children) {
                        for (const child of driver.children) {
                            const childSeedKey = `${persona.name}:${con.id}:${child.id}`;
                            const childHash = hashString(childSeedKey);
                            const childRng = createSeededRng(childHash);

                            // Include ~70% of child drivers to reach 700-1000 target
                            if (childRng() > 0.70) continue;

                            const childMetrics = collectDriverMetrics(child);

                            results.push(createEntry(persona, con, child, driver.name, childMetrics, category, childRng, 0));
                        }
                    }
                }
            }
        }
    }

    return results;
}

// ════════════════════════════════════════════════════════════════════════════
// SUMMARY STATISTICS (useful for verification)
// ════════════════════════════════════════════════════════════════════════════

export function getCommentaryStatistics(entries: CommentarySeed[]) {
    const byAuthor = new Map<string, number>();
    const byCategory = new Map<string, number>();
    const byType = new Map<string, number>();
    const byPriority = new Map<string, number>();
    const byPeriod = new Map<string, number>();

    for (const e of entries) {
        byAuthor.set(e.authorName, (byAuthor.get(e.authorName) || 0) + 1);
        byCategory.set(e.category, (byCategory.get(e.category) || 0) + 1);
        byType.set(e.commentaryType, (byType.get(e.commentaryType) || 0) + 1);
        byPriority.set(e.priority, (byPriority.get(e.priority) || 0) + 1);
        byPeriod.set(e.fiscalPeriod, (byPeriod.get(e.fiscalPeriod) || 0) + 1);
    }

    return {
        totalEntries: entries.length,
        byAuthor: Object.fromEntries(byAuthor),
        byCategory: Object.fromEntries(byCategory),
        byType: Object.fromEntries(byType),
        byPriority: Object.fromEntries(byPriority),
        byPeriod: Object.fromEntries(byPeriod),
    };
}
