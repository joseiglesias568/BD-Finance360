import { motion } from 'framer-motion';
import {
    AlertCircle,
    BarChart3,
    Brain,
    Calendar,
    ChevronRight,
    Clock,
    Lightbulb,
    MessageSquare,
    Target,
    Users,
    Zap
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ConsolePageData } from './types';

interface BusinessNarrativeProps {
    dbData?: ConsolePageData;
}

export default function BusinessNarrative({ dbData }: BusinessNarrativeProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('current-quarter');
    const [commentaryMode, setCommentaryMode] = useState<'analytics' | 'user'>('analytics');

    // Market Story Chapters - Analytics Based (built from DB data)
    const analyticsStory = useMemo(() => {
        const narrative = dbData?.narrative;
        const market = dbData?.market;
        const financials = dbData?.financials;
        const strategic = dbData?.strategic;
        const quarters = financials?.quarters ?? [];
        const latestQ = financials?.latestQuarter;

        // Executive summary
        const executiveSummary = {
            title: "Delta Revenue & Financial Executive Overview",
            period: latestQ?.quarter ?? "Q4 FY2025",
            narrative: narrative?.narrative ??
                `BD is the largest integrated health care company in the U.S., serving 90M+ Americans with Health Care Benefits, Health Services (Caremark PBM), and Pharmacy & Consumer Wellness. ` +
                `Latest quarter adjusted revenue of $${latestQ?.revenue?.toFixed(1) ?? '100.4'}B with ${latestQ?.feeRevenueGrowth ?? 6.2}% YoY growth.`,
            keyTakeaways: narrative?.keyAchievements?.length
                ? narrative.keyAchievements
                : [
                    `Fee revenue growth at ${latestQ?.feeRevenueGrowth ?? 5.4}% in ${latestQ?.quarter ?? 'Q4'}`,
                    `Annual revenue of $${financials?.annualRevenue?.toFixed(1) ?? '37.2'}B`,
                    `Operating margin at ${financials?.annualOperatingMargin?.toFixed(1) ?? '15.8'}%`,
                    ...(narrative?.concerns ?? []).slice(0, 1)
                ]
        };

        // Market evolution timeline from quarterly data
        const timeline = quarters.length > 0
            ? quarters.map((q) => ({
                period: q.quarter,
                event: `Revenue: $${q.revenue.toFixed(1)}B | Organic Growth: ${q.feeRevenueGrowth >= 0 ? '+' : ''}${q.feeRevenueGrowth}% | EPS: $${q.eps.toFixed(2)}`,
                impact: `${q.revenueYoY >= 0 ? '+' : ''}${q.revenueYoY}% YoY revenue growth`,
                status: q.revenueYoY >= 0 ? 'positive' : 'negative'
            }))
            : [
                { period: "Q1 FY25", event: "BD Finance360 platform launched — integrated health services reporting", impact: "Strategic re-platform initiated", status: "negative" },
                { period: "Q2 FY25", event: "Health100 SG&A cost transformation program announced — $2B cumulative FY27 target", impact: "Adj. EPS improves as savings realized", status: "positive" },
                { period: "Q3 FY25", event: "Stelara biosimilar adoption accelerating through Caremark PBM", impact: "Health Services margin expanding", status: "positive" },
                { period: "Q4 FY25", event: "MA repricing actions for FY26 cycle — targeting 200–300 bps MBR improvement", impact: "+6.2% revenue growth Q1 FY26, Adj. EPS $2.57 (+14.2% YoY)", status: "positive" }
            ];

        // Competitive landscape from market data
        const strengths = market?.marketDrivers?.length
            ? market.marketDrivers
            : ["Largest integrated health care company in the U.S.", "Aetna MA platform — 26M+ medical members", "Caremark PBM — 90M+ lives managed, leading specialty Rx network", "9,000+ retail pharmacies + Oak Street Health clinic footprint"];
        const weaknesses = market?.marketChallenges?.length
            ? market.marketChallenges
            : ["Integration complexity", "Capital markets cyclicality", "EMEA macro headwinds", "Talent retention pressure"];
        const competitorMoves = market?.competitors?.length
            ? market.competitors.slice(0, 3).map((c) => ({
                competitor: c.name,
                recentAction: c.strengths?.[0] ?? 'Competitive expansion',
                marketImpact: `${c.marketShare}% market share (${c.yoyChange >= 0 ? '+' : ''}${c.yoyChange}% YoY)`,
                ourResponse: c.strengths?.[1] ?? 'Strategic response in progress'
            }))
            : [
                { competitor: "UnitedHealth Group", recentAction: "Optum Health expansion — 90K+ employed/affiliated physicians", marketImpact: "Vertically integrated care model scaling", ourResponse: "Oak Street Health + Aetna MA integration — value-based care differentiation" },
                { competitor: "Humana", recentAction: "MA market exits in unprofitable counties — MBR discipline", marketImpact: "MA pricing rational in key markets", ourResponse: "Aetna MA repricing targeting 200–300 bps MBR improvement for FY27" },
                { competitor: "Elevance Health", recentAction: "Carelon Health specialty services buildout", marketImpact: "Vertically integrated specialty care competing with Caremark", ourResponse: "Caremark PBM + specialty pharmacy scale and biosimilar program leadership" }
            ];

        // Future outlook from strategic forward outlook
        const scenarios = strategic?.forwardOutlook?.length
            ? strategic.forwardOutlook.map((fo, idx) => ({
                name: fo.period,
                probability: idx === 0 ? 60 : idx === 1 ? 25 : 15,
                marketShare: `${market?.marketShareTarget ?? 9.0}%`,
                revenue: `$${fo.revenuePlan.toFixed(1)}B`,
                keyAssumptions: fo.keyAssumptions
            }))
            : [
                { name: "Base Case", probability: 60, marketShare: "9.0%", revenue: "$42.5B", keyAssumptions: ["Fee revenue growth stabilizes at +5-7%", "Capital markets recovery maintains momentum", "AUM reaches $160B"] },
                { name: "Optimistic", probability: 25, marketShare: "10.2%", revenue: "$45B", keyAssumptions: ["Chart Integration synergies drive +$1.5B run-rate", "CTS orders reach $2B+", "AI cost transformation delivers $1B+"] },
                { name: "Pessimistic", probability: 15, marketShare: "7.8%", revenue: "$39B", keyAssumptions: ["CRE downturn reduces transaction volumes", "Interest rate shock impacts valuations", "Talent attrition accelerates"] }
            ];

        return {
            executiveSummary,
            marketEvolution: { title: "How We Got Here", timeline },
            competitiveLandscape: {
                title: "Competitive Dynamics",
                ourPosition: { strengths, weaknesses },
                competitorMoves
            },
            futureOutlook: { title: "Where We're Heading", scenarios }
        };
    }, [dbData]);

    // Market Story Chapters - User Commentary Based
    const userCommentaryStory = {
        executiveSummary: {
            title: "Delta Revenue & Market Overview - Enhanced with Field Context",
            period: "Q4 FY2025",
            narrative: "Based on health care market leadership insights, the +6.2% revenue growth in Q1 FY26 reflects broad-based performance across all three segments. HCB premium revenue growth is driven by Aetna MA rate actions, while Health Services specialty Rx volume acceleration and Stelara biosimilar substitution are improving Caremark PBM margins. The Health100 SG&A transformation is tracking ahead of plan. PCW pharmacy script volumes remain positive, though front-store retail traffic continues to face headwinds.",
            keyTakeaways: [
                "Health Care Benefits MBR 84.6% — favorable vs. FY26 plan, but Q2 inpatient claims trending 140 bps adverse",
                "Health Services specialty Rx volume +18% YoY — Stelara biosimilar substitution driving $450M+ annualized savings",
                "Pharmacy & Consumer Wellness pharmacy scripts positive — front-store retail traffic headwinds partially offsetting",
                "Health100 SG&A savings program $500M+ realized in FY25 — on track for $2B cumulative FY27 target"
            ],
            userInsights: [
                { contributor: "HCB Finance SVP", insight: "Aetna MA repricing for FY27 is our most important near-term lever. Early actuarial signals are encouraging on the 200–300 bps MBR target." },
                { contributor: "Health Services Finance Director", insight: "GLP-1 volume is the wildcard. Stelara biosimilar acceleration is our best offset — we need to push the formulary incentive program harder." },
                { contributor: "PCW Finance VP", insight: "Pharmacy scripts are solid. HealthHUB and Minute Clinic are generating incremental foot traffic that the core retail P&L doesn't fully capture yet." }
            ]
        },
        marketEvolution: {
            title: "The Real Story Behind the Numbers",
            timeline: [
                {
                    period: "Q1 FY25",
                    event: "CEO David Joyner and CFO Brian Newman outline Health100 transformation strategy",
                    impact: "Revenue growth steady; SG&A reduction program underway",
                    status: "negative",
                    context: "Leadership deliberately prioritized Health100 SG&A discipline over near-term investment. Internal teams report confidence in the $2B cumulative savings target as transformation initiatives launch on schedule."
                },
                {
                    period: "Q2 FY25",
                    event: "Caremark biosimilar substitution program accelerated — Stelara conversion incentives launched",
                    impact: "Health Services margin expands as biosimilar adoption rises",
                    status: "positive",
                    context: "The Stelara biosimilar program is the clearest margin lever in Health Services. PBM formulary team reports plan sponsor adoption faster than expected — $300M+ run-rate savings already visible."
                },
                {
                    period: "Q3 FY25",
                    event: "MA repricing actuarial filings submitted for FY26–FY27 plan years",
                    impact: "HCB MBR improvement expected from repricing — Q4 FY25 MBR tracking favorably",
                    status: "positive",
                    context: "Actuarial team reports FY27 MA rate filings reflect a 200–300 bps MBR improvement target. Early Q4 claims data is confirming the repricing is taking hold in the right market segments."
                },
                {
                    period: "Q4 FY25",
                    event: "Oak Street Health clinic expansion — 200+ locations milestone reached",
                    impact: "+6.2% revenue growth Q1 FY26, Adj. EPS $2.57 (+14.2% YoY)",
                    status: "positive",
                    context: "Oak Street Health integration milestone is ahead of schedule. Value-based care model is driving lower MA inpatient utilization in enrolled member cohorts — early validation of the vertical integration thesis."
                }
            ]
        },
        regionalDynamics: {
            title: "Ground Truth from Segment Leaders",
            regions: [
                {
                    region: "Health Care Benefits",
                    performance: "MBR 84.6% (Q1 FY26)",
                    marketShare: 35,
                    narrative: "Aetna MA repricing actions are the story. Q1 MBR favorable vs. plan, but Q2 inpatient utilization tracking 140 bps adverse. Care management enrollment in Oak Street Health-integrated markets showing early MBR benefit. MA Star Ratings watch is the key near-term risk.",
                    challenges: ["Q2 MA inpatient utilization trend adverse vs. plan", "CMS Star Ratings — quality bonus revenue at risk"],
                    opportunities: ["FY27 MA repricing 200–300 bps MBR improvement", "Oak Street Health value-based care MBR lift in enrolled markets"]
                },
                {
                    region: "Health Services",
                    performance: "+18% specialty Rx YoY",
                    marketShare: 30,
                    narrative: "Caremark PBM specialty volume acceleration is the dominant story. GLP-1 script growth +34% vs. plan of +22% — positive for revenue but compressing specialty margin. Stelara biosimilar substitution is the key offset. PBM client retention is strong; three large plan sponsors are on active watch.",
                    challenges: ["GLP-1 drug cost surge compressing PBM specialty margin", "Stelara biosimilar conversion lagging 8% below target"],
                    opportunities: ["Biosimilar incentive program acceleration — $180M AOI recovery potential", "GLP-1 rebate renegotiation with manufacturers"]
                },
                {
                    region: "Pharmacy & Consumer Wellness",
                    performance: "Pharmacy scripts positive; front-store pressured",
                    marketShare: 25,
                    narrative: "PCW pharmacy script volumes remain positive driven by specialty fills and 90-day supply growth. Front-store retail traffic is the headwind — CVS is actively differentiating through HealthHUB and Minute Clinic to drive incremental pharmacy visits and health services revenue.",
                    challenges: ["Front-store retail traffic below plan (-4.9% revenue Q1)", "LTC pharmacy competitive pressure in senior living segment"],
                    opportunities: ["HealthHUB format driving pharmacy visit frequency", "Minute Clinic expansion into chronic disease management"]
                }
            ]
        },
        competitiveLandscape: {
            title: "Competitive Intelligence from the Field",
            strengths: [
                "Largest integrated health care company — HCB + PBM + retail pharmacy flywheel creates unique cross-sell advantage",
                "Caremark PBM scale — 90M+ lives managed, leading specialty Rx network and biosimilar program",
                "Oak Street Health + Aetna MA integration — value-based care model lowering inpatient utilization",
                "Health100 SG&A transformation — $2B+ cumulative savings creating structural cost advantage"
            ],
            weaknesses: [
                "Net leverage ~4.2x — post-Aetna/Oak Street acquisition debt constrains capital allocation flexibility",
                "MA medical cost ratio — inpatient utilization trends volatile and difficult to predict quarter-to-quarter",
                "PCW front-store retail headwinds — consumer discretionary spend pressure in pharmacy retail",
                "CMS Star Ratings — quality bonus revenue dependent on clinical quality metrics outside direct financial control"
            ],
            competitiveIntel: [
                "UnitedHealth Optum Health employing/affiliating 90K+ physicians — vertical integration model scaling",
                "Humana exiting unprofitable MA markets — MA pricing environment rationalizing",
                "Elevance Health Carelon specialty services competing directly with Caremark PBM",
                "Walgreens Boots Alliance restructuring retail pharmacy footprint — CVS PCW gaining script share"
            ],
            competitorMoves: [
                {
                    competitor: "UnitedHealth Group",
                    recentAction: "Optum Health expansion — 90K+ employed/affiliated physicians across 150+ markets",
                    marketImpact: "Deepest vertical integration in U.S. health care — closing UHG/Optum/UHC flywheel",
                    ourResponse: "Oak Street Health + Aetna MA integration — value-based care model differentiation in Medicare market",
                    insiderContext: "Optum's physician network scale is a sustained structural advantage in MA. Our Oak Street Health integration is the most important long-term countermove — need to accelerate clinic openings."
                },
                {
                    competitor: "Humana",
                    recentAction: "Strategic MA market exits — withdrawing from unprofitable counties to improve MBR",
                    marketImpact: "MA pricing becoming more rational; Humana MBR discipline improving competitive dynamics",
                    ourResponse: "Aetna MA repricing actions for FY27 — targeting 200–300 bps MBR improvement; selective market rationalization under consideration",
                    insiderContext: "Humana's market discipline is a positive signal for MA economics broadly. Their exits are creating member migration opportunities for Aetna in select markets."
                },
                {
                    competitor: "Elevance Health",
                    recentAction: "Carelon Health specialty services expansion — competing with PBM/specialty pharmacy incumbents",
                    marketImpact: "Vertically integrated specialty care creates new Caremark PBM competitive pressure",
                    ourResponse: "Caremark PBM biosimilar program scale and specialty Rx network differentiation; GLP-1 formulary management as new competitive moat",
                    insiderContext: "Carelon is the most direct competitive threat to Caremark's specialty margin. Our biosimilar substitution program and GLP-1 formulary management are the key differentiators we need to accelerate."
                }
            ]
        },
        futureOutlook: {
            title: "The View from the Trenches",
            scenarios: [
                {
                    name: "Base Case (Field Adjusted)",
                    probability: 60,
                    marketShare: "~22% U.S. managed care",
                    revenue: "≥$405B FY26",
                    keyAssumptions: [
                        "HCB MBR 85.5% FY26 — MA repricing partially offsets Q2 adverse claims trend",
                        "Health Services specialty Rx growth +15% YoY — Stelara biosimilar substitution offset $350M+",
                        "Health100 SG&A savings $700M+ realized in FY26 — on track to $2B cumulative FY27",
                        "PCW pharmacy scripts +3% — front-store headwinds persist but HealthHUB driving incremental visits"
                    ],
                    fieldInsights: "Segment finance leaders cautiously optimistic. HCB MBR trajectory is the biggest variable — Q2 claims data will be the first real test of the repricing effectiveness."
                },
                {
                    name: "Optimistic (If We Execute)",
                    probability: 25,
                    marketShare: "~23% U.S. managed care",
                    revenue: "$410B+ FY26",
                    keyAssumptions: [
                        "HCB MBR 84.5% — MA repricing exceeds plan, care management enrollment accelerates",
                        "GLP-1 rebate renegotiation and biosimilar acceleration recover $300M+ of specialty margin",
                        "Health100 savings ahead of plan — $800M+ FY26 realization drives EPS upside",
                        "Oak Street Health MBR benefit materializes faster than consensus expects"
                    ],
                    fieldInsights: "Achievable if Aetna MA repricing exceeds the 200-300 bps target and biosimilar program acceleration fully offsets GLP-1 cost pressure in Health Services."
                },
                {
                    name: "Pessimistic (Risk Case)",
                    probability: 15,
                    marketShare: "~21% U.S. managed care",
                    revenue: "$400B–$405B FY26",
                    keyAssumptions: [
                        "HCB MBR 86.5%+ — inpatient utilization trend persists through H2, repricing insufficient",
                        "GLP-1 cost surge sustains 180+ days — EPS impact -$0.10 or worse",
                        "CMS Star Ratings downgrade — $300M+ quality bonus revenue at risk in FY27",
                        "Health100 savings delayed — integration complexity slows realization timeline"
                    ],
                    fieldInsights: "Finance teams flagging Q2 inpatient claims trajectory as the key early warning indicator. If MBR does not begin improving by Q3, FY26 EPS guidance downside revision becomes likely."
                }
            ]
        }
    };

    const marketStory = commentaryMode === 'analytics' ? analyticsStory : userCommentaryStory;

    // Strategic Themes — from DB strategic initiatives when available
    const strategicThemes = useMemo(() => {
        const initiatives = dbData?.strategic?.initiatives;
        if (initiatives && initiatives.length > 0) {
            return initiatives.map((init) => ({
                theme: init.name,
                description: init.description,
                progress: init.progress,
                initiatives: init.milestones?.map(m => m.name) ?? [],
                metrics: {
                    current: init.kpis?.[0]
                        ? `${init.kpis[0].actual} ${init.kpis[0].label}`
                        : `${init.progress}% complete`,
                    target: init.kpis?.[0]
                        ? `${init.kpis[0].target} ${init.kpis[0].label}`
                        : `$${init.budget}M budget`,
                    trend: init.status === 'on-track' || init.status === 'completed' ? 'positive' : 'negative'
                }
            }));
        }
        // Fallback
        return [
            {
                theme: "Health100 SG&A Cost Transformation",
                description: "Drive $2B cumulative SG&A savings by FY27 through workforce optimization and technology consolidation",
                progress: 65,
                initiatives: ["Workforce optimization program — 2,900 roles reduced FY25", "Technology platform consolidation across HCB/Health Services/PCW", "Procurement savings and vendor contract renegotiation"],
                metrics: { current: "$500M+ FY25 realized savings", target: "$2B cumulative by FY27", trend: "positive" }
            },
            {
                theme: "MA Repricing & HCB MBR Improvement",
                description: "Restore HCB Medical Benefit Ratio to sustainable levels through MA repricing and care management",
                progress: 55,
                initiatives: ["FY27 MA rate filing targeting 200–300 bps MBR improvement", "Oak Street Health care management integration for MA members", "Prior authorization enhancement to reduce unnecessary inpatient utilization"],
                metrics: { current: "Q1 FY26 MBR 84.6%", target: "FY27 MBR <85.0%", trend: "positive" }
            },
            {
                theme: "Health Services Specialty Pharmacy Growth",
                description: "Accelerate Caremark PBM specialty Rx volume and biosimilar substitution to compound margin",
                progress: 72,
                initiatives: ["Stelara biosimilar incentive program — targeting 90-day full adoption", "GLP-1 manufacturer rebate renegotiation", "Specialty Rx network expansion in oncology and rare disease"],
                metrics: { current: "Specialty Rx +18% YoY", target: "Specialty Rx +20%+ by FY27 with biosimilar offset", trend: "positive" }
            }
        ];
    }, [dbData]);

    return (
        <div className="space-y-6">
            {/* Header with Period Selector */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Business Narrative</h2>
                <div className="flex items-center space-x-4">
                    {/* Commentary Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setCommentaryMode('analytics')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${commentaryMode === 'analytics'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Brain className="w-4 h-4" />
                                <span>AI Analytics Commentary</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setCommentaryMode('user')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${commentaryMode === 'user'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="w-4 h-4" />
                                <span>AI User Commentary</span>
                            </div>
                        </button>
                    </div>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="text-sm bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1c519c]"
                    >
                        <option value="current-quarter">Current Quarter (Q4 FY25)</option>
                        <option value="ytd">Year to Date</option>
                        <option value="last-year">Last 12 Months</option>
                    </select>
                </div>
            </div>

            {/* Executive Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{marketStory.executiveSummary.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{marketStory.executiveSummary.period}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Updated 2 hours ago</span>
                    </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                    {marketStory.executiveSummary.narrative}
                </p>

                <div className="bg-[#F0F0F0] rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2 text-[#1c519c]" />
                        Key Takeaways
                    </h4>
                    <ul className="space-y-2">
                        {marketStory.executiveSummary.keyTakeaways.map((takeaway, index) => (
                            <li key={index} className="flex items-start">
                                <ChevronRight className="w-4 h-4 text-[#1c519c] mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{takeaway}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* User Insights - Only show in user commentary mode */}
                {commentaryMode === 'user' && 'userInsights' in marketStory.executiveSummary && (
                    <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                            <Users className="w-4 h-4 mr-2 text-yellow-600" />
                            Direct Insights from the Field
                        </h4>
                        <ul className="space-y-2">
                            {(marketStory.executiveSummary as any).userInsights.map((insight: any, index: number) => (
                                <li key={index} className="text-sm">
                                    <span className="font-medium text-gray-700">{insight.contributor}:</span>
                                    <span className="text-gray-600 ml-2">&ldquo;{insight.insight}&rdquo;</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </motion.div>

            {/* Market Evolution Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-[#1c519c]" />
                    {marketStory.marketEvolution.title}
                </h3>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                    {/* Timeline events */}
                    <div className="space-y-6">
                        {marketStory.marketEvolution.timeline.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex items-start"
                            >
                                <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${event.status === 'positive' ? 'bg-emerald-100' : 'bg-red-100'
                                    }`}>
                                    <div className={`w-3 h-3 rounded-full ${event.status === 'positive' ? 'bg-[#1c519c]' : 'bg-red-500'
                                        }`}></div>
                                </div>
                                <div className="ml-6 flex-1">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-gray-900">{event.period}</h4>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${event.status === 'positive'
                                                ? 'bg-emerald-100 text-[#1c519c]'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {event.impact}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{event.event}</p>
                                        {/* Show context in user commentary mode */}
                                        {'context' in event && event.context && (
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                <p className="text-xs text-gray-600 italic">
                                                    <MessageSquare className="w-3 h-3 inline mr-1" />
                                                    {event.context}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Competitive Landscape */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-[#1c519c]" />
                    {marketStory.competitiveLandscape.title}
                </h3>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Our Strengths</h4>
                        <ul className="space-y-2">
                            {('ourPosition' in marketStory.competitiveLandscape
                                ? marketStory.competitiveLandscape.ourPosition.strengths
                                : marketStory.competitiveLandscape.strengths
                            ).map((strength: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1c519c] mt-1.5 mr-2 flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Areas for Improvement</h4>
                        <ul className="space-y-2">
                            {('ourPosition' in marketStory.competitiveLandscape
                                ? marketStory.competitiveLandscape.ourPosition.weaknesses
                                : marketStory.competitiveLandscape.weaknesses
                            ).map((weakness: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700">{weakness}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Competitor Moves */}
                <div className="border-t pt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Recent Competitor Actions</h4>
                    <div className="space-y-4">
                        {marketStory.competitiveLandscape.competitorMoves.map((move, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-sm font-semibold text-gray-900">{move.competitor}</h5>
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{move.recentAction}</p>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <span className="text-gray-500">Market Impact:</span>
                                        <p className="text-gray-700 mt-1">{move.marketImpact}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Our Response:</span>
                                        <p className="text-[#1c519c] font-medium mt-1">{move.ourResponse}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Strategic Themes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-[#1c519c]" />
                    Strategic Themes & Progress
                </h3>

                <div className="space-y-6">
                    {strategicThemes.map((theme, index) => (
                        <div key={index} className="border rounded-lg p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">{theme.theme}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                                </div>
                                <span className="text-sm font-medium text-gray-900">{theme.progress}%</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div
                                    className="bg-[#1c519c] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${theme.progress}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-700 mb-2">Key Initiatives</p>
                                    <ul className="space-y-1">
                                        {theme.initiatives.map((initiative, idx) => (
                                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                                                <ChevronRight className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0" />
                                                {initiative}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-700 mb-2">Performance Metrics</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Current:</span>
                                            <span className="text-xs font-medium text-gray-900">{theme.metrics.current}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Target:</span>
                                            <span className="text-xs font-medium text-[#1c519c]">{theme.metrics.target}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Trend:</span>
                                            <span className={`text-xs font-medium ${theme.metrics.trend === 'positive' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {theme.metrics.trend === 'positive' ? 'Improving' : 'Declining'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Future Outlook Scenarios */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-[#1c519c]" />
                    {marketStory.futureOutlook.title}
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    {marketStory.futureOutlook.scenarios.map((scenario, index) => (
                        <div
                            key={index}
                            className={`border rounded-lg p-4 ${scenario.name.includes('Base') ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-gray-900">{scenario.name}</h4>
                                <span className="text-xs font-medium text-gray-600">{scenario.probability}% probability</span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500">Market Share</p>
                                    <p className="text-lg font-bold text-gray-900">{scenario.marketShare}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Revenue Forecast</p>
                                    <p className="text-lg font-bold text-gray-900">{scenario.revenue}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-700 mb-2">Key Assumptions</p>
                                <ul className="space-y-1">
                                    {scenario.keyAssumptions.map((assumption, idx) => (
                                        <li key={idx} className="text-xs text-gray-600">&#8226; {assumption}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}