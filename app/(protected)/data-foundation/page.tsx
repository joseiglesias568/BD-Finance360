'use client';

import { motion } from 'framer-motion';
import {
    ArrowRight,
    BarChart2,
    BookOpen,
    CheckCircle,
    ChevronRight,
    Clock,
    Database,
    Eye,
    FileText,
    Globe,
    Key,
    Layers,
    Lock,
    MessageSquare,
    RefreshCw,
    Shield,
    Sparkles,
    Tag,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const dataTypes = [
    {
        category: 'Structured · Internal',
        color: '#003B2C',
        bg: '#F0F0F0',
        icon: Database,
        tagline: 'The numbers your teams already produce.',
        description: 'Financial results, cost records, operational metrics, and workforce data generated inside Becton, Dickinson and Company every day. This is the most trusted source — produced by people who own the outcomes.',
        examples: [
            { label: 'Financial systems', detail: 'General ledger, revenue actuals, cost center detail, balance sheet' },
            { label: 'Revenue management', detail: 'Pharmacy dispensing revenue, Aetna premium revenue by plan type, Caremark PBM fee revenue by client' },
            { label: 'Operations', detail: 'Pharmacy fill rates, Oak Street clinic utilization, Signify Health home visit volume by geography' },
            { label: 'Workforce', detail: 'Headcount, FTE by function, pharmacist labor cost by store cluster and region' },
        ],
    },
    {
        category: 'Structured · External',
        color: '#0070C0',
        bg: '#EFF6FF',
        icon: Globe,
        tagline: 'Market signals your teams need to interpret.',
        description: 'Numbers that exist outside Becton, Dickinson and Company\'s walls — from public filings, markets, and third-party data providers — that give context to your own performance.',
        examples: [
            { label: 'Public filings', detail: 'Peer health care 10-K / 10-Q revenue, MCR, and margin data (UnitedHealth, Cigna, Elevance, Humana, Centene)' },
            { label: 'Pharmaceutical market data', detail: 'Drug pricing benchmarks, GLP-1 utilization trends, specialty pharmacy market share' },
            { label: 'Market & macro', detail: 'CMS Medicare Advantage star ratings, PBM industry benchmarks, health care inflation indices' },
            { label: 'Regulatory engagement data', detail: 'CMS Medicare Advantage rate notices, state insurance filing trends, PBM spread pricing legislation tracker' },
        ],
    },
    {
        category: 'Unstructured · Internal',
        color: '#7C3AED',
        bg: '#F5F3FF',
        icon: MessageSquare,
        tagline: 'The knowledge locked in documents and conversations.',
        description: 'Narrative, context, and institutional knowledge that doesn\'t fit in a cell of a spreadsheet — but often explains why the numbers look the way they do.',
        examples: [
            { label: 'Management commentary', detail: 'Board presentations, CFO briefings, QBR narratives, earnings call transcripts' },
            { label: 'Contracts & agreements', detail: 'Codeshare and JV terms, lease agreements, labor contract provisions' },
            { label: 'Operational reports', detail: 'Irregular operations write-ups, MRO work orders, audit findings' },
            { label: 'Internal communications', detail: 'Project notes, decision logs, strategy memos, town hall Q&A' },
        ],
    },
    {
        category: 'Unstructured · External',
        color: '#065F46',
        bg: '#ECFDF5',
        icon: FileText,
        tagline: 'The world\'s view of your industry and your company.',
        description: 'Analyst reports, news, regulatory filings, and research that your finance team reads manually — now readable by AI at scale.',
        examples: [
            { label: 'SEC filings (text)', detail: 'MD&A sections, risk factor language, footnotes from competitor 10-Ks' },
            { label: 'Analyst research', detail: 'AlphaSense reports, sell-side earnings previews, consensus estimates' },
            { label: 'Industry news', detail: 'Drug pricing legislation, MA plan exits, pharmacy benefit manager regulations, CMS announcements' },
            { label: 'Regulatory filings', detail: 'CMS RADV audit results, state PBM legislation, HHS formulary transparency requirements' },
        ],
    },
];

const foundationSteps = [
    {
        step: '1',
        title: 'Agree on what matters — before you build anything.',
        icon: BookOpen,
        color: '#003B2C',
        detail: 'The most common mistake is starting with technology. Start with questions instead: What decisions need better data? Who makes them? How often? What would "good" look like? This conversation — between finance, operations, and data teams — defines the scope and prevents wasted effort.',
        output: 'A prioritised list of decisions to support, and the data needed for each.',
    },
    {
        step: '2',
        title: 'Map what you have — honestly.',
        icon: Eye,
        color: '#0070C0',
        detail: 'Audit the sources that already exist. Where does network cost data live? Is there one system or six? Who owns it? Is the definition of "operating income" the same in finance and in operations? This inventory almost always reveals duplication, gaps, and conflicting definitions that need to be resolved before anything is built.',
        output: 'A data inventory: sources, owners, quality ratings, and definition gaps.',
    },
    {
        step: '3',
        title: 'Build a curated layer — not a data warehouse.',
        icon: Layers,
        color: '#7C3AED',
        detail: 'Rather than copying every system into one giant database, build a curated set of "data products" — clean, certified, purpose-built datasets that serve specific business domains. A Finance data product. A Network Operations product. A Loyalty product. Each has an owner, a quality standard, and a clear contract with its consumers.',
        output: 'Domain data products: certified, owned, versioned, and documented.',
    },
    {
        step: '4',
        title: 'Connect to the tools your teams actually use.',
        icon: Zap,
        color: '#B45309',
        detail: 'Data that sits in a system nobody opens has no value. Connect the curated layer to dashboards, planning tools, AI engines, and the analyst\'s familiar spreadsheet — so the same trusted source powers everything. A change upstream flows downstream automatically. No more copy-paste, no more version conflicts.',
        output: 'Dashboards, AI outputs, and planning models all reading from one source.',
    },
    {
        step: '5',
        title: 'Govern it like the asset it is.',
        icon: Shield,
        color: '#9F1239',
        detail: 'Data that isn\'t maintained degrades. Set up ownership, quality monitoring, change notifications, and a lifecycle policy. When a definition changes — or a source system is retired — the people who depend on that data are notified and the product is updated. This is what separates a data foundation from a one-time project.',
        output: 'A living data platform with clear ownership and ongoing SLAs.',
    },
];

const maturityStages = [
    {
        stage: 'Stage 1',
        name: 'Connected',
        icon: Database,
        color: '#6B7280',
        bg: '#F3F4F6',
        milestone: 'Source systems are accessible. Raw data can be extracted.',
        unlocks: [
            'Basic reporting from source systems',
            'Manual data pulls for one-off analysis',
            'Spreadsheet-based consolidation',
        ],
        blocked: 'Analytics are slow, inconsistent, and depend on individuals.',
    },
    {
        stage: 'Stage 2',
        name: 'Cleansed',
        icon: CheckCircle,
        color: '#0070C0',
        bg: '#EFF6FF',
        milestone: 'Definitions are agreed. Quality issues are identified and resolved.',
        unlocks: [
            'A single agreed definition of revenue, cost, and margin',
            'Automated consolidation replacing manual spreadsheets',
            'First reliable dashboards finance can trust',
        ],
        blocked: 'Speed is better but analysis is still backward-looking.',
    },
    {
        stage: 'Stage 3',
        name: 'Curated',
        icon: Tag,
        color: '#7C3AED',
        bg: '#F5F3FF',
        milestone: 'Domain data products exist with owners, quality scores, and documentation.',
        unlocks: [
            'Finance, Operations, Loyalty data products serving specific teams',
            'Self-service analytics — business users can answer their own questions',
            'Planning tools reading from certified data',
            'External data (competitor, market) joined to internal data',
        ],
        blocked: 'Analysis is still largely descriptive — what happened, not why.',
    },
    {
        stage: 'Stage 4',
        name: 'Activated',
        icon: Sparkles,
        color: '#B45309',
        bg: '#FFFBEB',
        milestone: 'AI and advanced analytics can run on curated, trusted data.',
        unlocks: [
            'AI-generated insights, narratives, and anomaly alerts',
            'Scenario modeling with real sensitivity data',
            'Predictive: forward projections and early-warning signals',
            'Natural language queries against financial data',
        ],
        blocked: 'Scale: insights are generated but governance hasn\'t kept pace.',
    },
    {
        stage: 'Stage 5',
        name: 'Governed',
        icon: Shield,
        color: '#065F46',
        bg: '#ECFDF5',
        milestone: 'Data is treated as a managed corporate asset with lifecycle, ownership, and SLAs.',
        unlocks: [
            'Regulatory and audit-ready data lineage',
            'New use cases launch in weeks, not months',
            'Data products are reused across teams, not rebuilt',
            'Finance leads data investment decisions, not just IT',
        ],
        blocked: '— This is the destination.',
    },
];

const governancePillars = [
    {
        icon: Users,
        title: 'Ownership — not just access.',
        color: '#003B2C',
        desc: 'Every data product has a named business owner — not just a technical custodian. The Finance data product is owned by Finance. The Revenue Management product is owned by Revenue Management. Ownership means accountability for quality, documentation, and change management.',
    },
    {
        icon: Eye,
        title: 'Quality you can see.',
        color: '#0070C0',
        desc: 'Data quality isn\'t assumed — it\'s measured. Completeness, freshness, consistency, and accuracy are monitored continuously. When a metric drops below its threshold, the owner is notified before a business user discovers the problem in a report.',
    },
    {
        icon: Tag,
        title: 'Everything tagged and traceable.',
        color: '#7C3AED',
        desc: 'Every piece of data in a governed platform has a lineage: where it came from, how it was transformed, and who approved it. When an auditor asks "where did this number come from?", the answer is a click away — not a week of archaeology.',
    },
    {
        icon: Lock,
        title: 'Access that matches sensitivity.',
        color: '#9F1239',
        desc: 'Not every analyst needs every dataset. Governance defines who can see what — and logs who accessed it. Sensitive data (individual compensation, unreleased financials, competitive strategy) stays protected without making the rest of the platform bureaucratic.',
    },
    {
        icon: RefreshCw,
        title: 'Lifecycle management — including retirement.',
        color: '#B45309',
        desc: 'Data products that are no longer accurate, relevant, or used are retired — not left to rot and confuse. When a source system is replaced or a metric definition changes, downstream consumers are notified and given a migration path.',
    },
    {
        icon: TrendingUp,
        title: 'Investment tracked like any other asset.',
        color: '#065F46',
        desc: 'A governed organization tracks the cost, usage, and business value of its data investments. Which data products are used most? Which AI features depend on which datasets? This visibility allows leadership to make rational investment decisions about what to build next.',
    },
];

// ─── Component ───────────────────────────────────────────────────────────────

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DataFoundationPage() {
    return (
        <div className="bg-gray-50 min-h-screen">

            {/* ── Hero ── */}
            <div className="bg-gradient-to-br from-[#003B2C] to-[#003B2C] text-white">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <motion.div initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Database className="w-5 h-5 text-[#009AC7]" />
                            <span className="text-sm font-medium text-[#009AC7] uppercase tracking-widest">Data Foundation</span>
                        </div>
                        <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                            Before the AI can work,<br />
                            <span className="text-[#009AC7]">the data has to be right.</span>
                        </h1>
                        <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
                            Every insight, alert, and narrative in Finance360 is only as good as the data underneath it. This page explains what data is needed, how a trustworthy foundation is built, how an organisation moves along the maturity curve — and what it takes to treat data as a permanent corporate asset rather than a one-time project.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5, delay: 0.15 }}
                        className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {[
                            { value: '4', label: 'Data categories' },
                            { value: '5', label: 'Foundation steps' },
                            { value: '5', label: 'Maturity stages' },
                            { value: '6', label: 'Governance pillars' },
                        ].map(s => (
                            <div key={s.label} className="bg-white/10 rounded-xl p-4 border border-white/10">
                                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                                <p className="text-xs text-white/50 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">

                {/* ── Section 1: What Data Goes In ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#003B2C] uppercase tracking-widest mb-1">Section 1</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Four categories of data — all of them matter.</h2>
                        <p className="text-gray-500 text-sm max-w-2xl mb-8">Finance360 draws on all four. The structured data gives you the numbers. The unstructured data gives you the story behind them. Internal data tells you what happened. External data tells you whether it was good.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {dataTypes.map((dt, i) => {
                            const Icon = dt.icon;
                            return (
                                <motion.div
                                    key={dt.category}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={fade} transition={{ duration: 0.35, delay: i * 0.07 }}
                                    className="bg-white rounded-2xl border border-gray-200 p-6"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: dt.bg }}>
                                            <Icon className="w-5 h-5" style={{ color: dt.color }} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: dt.color }}>{dt.category}</span>
                                            <p className="text-sm font-bold text-gray-900 leading-snug">{dt.tagline}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{dt.description}</p>
                                    <div className="space-y-2 border-t border-gray-100 pt-4">
                                        {dt.examples.map(ex => (
                                            <div key={ex.label} className="flex items-start gap-2.5">
                                                <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: dt.color }} />
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-800">{ex.label} </span>
                                                    <span className="text-xs text-gray-400">— {ex.detail}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── Section 2: Building the Foundation ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#003B2C] uppercase tracking-widest mb-1">Section 2</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Five steps to a foundation that holds.</h2>
                        <p className="text-gray-500 text-sm max-w-2xl mb-8">The sequence matters. Organisations that skip to step 4 — buying a tool before agreeing on definitions — almost always rebuild. These steps aren't a technology project. They're a business discipline.</p>
                    </motion.div>

                    <div className="space-y-4">
                        {foundationSteps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.step}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={fade} transition={{ duration: 0.3, delay: i * 0.07 }}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-5"
                                >
                                    <div className="shrink-0 flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg" style={{ backgroundColor: step.color }}>
                                            {step.step}
                                        </div>
                                        {i < foundationSteps.length - 1 && (
                                            <div className="w-0.5 flex-1 min-h-[24px] bg-gray-200 rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className="w-4 h-4" style={{ color: step.color }} />
                                            <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{step.detail}</p>
                                        <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: step.color }} />
                                            <p className="text-xs font-medium text-gray-700">{step.output}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── Section 3: Maturity Curve ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#003B2C] uppercase tracking-widest mb-1">Section 3</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">The maturity curve — and what gets unlocked at each stage.</h2>
                        <p className="text-gray-500 text-sm max-w-2xl mb-4">No organisation jumps from raw data to AI in one step. Each stage builds on the one before it. The good news: value is captured at every milestone — you don't have to reach Stage 5 before the investment pays off.</p>
                        <div className="flex items-center gap-2 mb-8 px-4 py-2.5 bg-[#F0F0F0] rounded-lg w-fit">
                            <TrendingUp className="w-4 h-4 text-[#003B2C]" />
                            <span className="text-xs font-medium text-[#003B2C]">Finance360 is currently operating at Stage 4 — Activated — for Becton, Dickinson and Company's core financial domains.</span>
                        </div>
                    </motion.div>

                    {/* Progress track */}
                    <div className="relative mb-6 hidden md:block">
                        <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gradient-to-r from-gray-300 via-[#7C3AED] to-[#065F46] rounded-full" />
                        <div className="flex justify-between px-[5%]">
                            {maturityStages.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div key={s.stage} className="flex flex-col items-center gap-1.5">
                                        <div className="w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm" style={{ backgroundColor: s.color }}>
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide text-center">{s.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {maturityStages.map((s, i) => {
                            const Icon = s.icon;
                            const isCurrentOrBeyond = i >= 3;
                            return (
                                <motion.div
                                    key={s.stage}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={fade} transition={{ duration: 0.3, delay: i * 0.06 }}
                                    className={`rounded-2xl border p-5 ${isCurrentOrBeyond ? 'border-[#003B2C]/20 bg-[#F0F0F0]/30' : 'bg-white border-gray-200'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                                            <Icon className="w-5 h-5" style={{ color: s.color }} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.stage}</span>
                                                <span className="text-base font-bold text-gray-900">{s.name}</span>
                                                {i === 3 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#003B2C] text-white">Current — Finance360</span>}
                                            </div>
                                            <p className="text-xs text-gray-500 italic mb-3">Milestone: {s.milestone}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">What becomes possible</p>
                                                    <div className="space-y-1.5">
                                                        {s.unlocks.map(u => (
                                                            <div key={u} className="flex items-start gap-2">
                                                                <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: s.color }} />
                                                                <span className="text-xs text-gray-700">{u}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Still constrained by</p>
                                                    <p className="text-xs text-gray-600 leading-relaxed">{s.blocked}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── Section 4: Governance ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#003B2C] uppercase tracking-widest mb-1">Section 4</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Data as a permanent asset — not a one-time project.</h2>
                        <p className="text-gray-500 text-sm max-w-2xl mb-8">A network has a maintenance schedule. A building has a facilities team. Data needs the same ongoing care — or it quietly degrades until someone notices the reports don't match reality. These six pillars are what a mature data organisation operates continuously.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {governancePillars.map((g, i) => {
                            const Icon = g.icon;
                            return (
                                <motion.div
                                    key={g.title}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={fade} transition={{ duration: 0.3, delay: i * 0.06 }}
                                    className="bg-white rounded-2xl border border-gray-200 p-5"
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${g.color}15` }}>
                                        <Icon className="w-5 h-5" style={{ color: g.color }} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 mb-2">{g.title}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{g.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── Where Finance360 sits today ── */}
                <motion.section
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl border border-gray-200 p-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#F0F0F0] flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-[#003B2C]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Where BD Finance360 sits today.</h3>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">Finance360 was built on a curated data foundation aligned to Stages 3–4 of the maturity curve. Here's what that means in practice for this platform:</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { icon: Database, label: 'Structured financial data', detail: 'Q1 FY25 – Q1 FY26 quarterly results, P&L, bridge items, and KPIs are certified and cited to 10-K / 10-Q filings.', color: '#003B2C' },
                            { icon: Globe, label: 'External data joined in', detail: 'Peer utility revenue, FERC filings, Missouri PSC rate case data, and regulated utility industry benchmarks are sourced and tagged alongside internal data.', color: '#0070C0' },
                            { icon: FileText, label: 'Unstructured data activated', detail: '800+ AI-generated insights and 35+ commentary entries drawn from earnings transcripts, press releases, and conference decks.', color: '#7C3AED' },
                            { icon: Shield, label: 'Provenance as governance', detail: 'Every value is tagged [CITED], [DERIVED], [INTERPOLATED], or [ASSUMED] — a lightweight but effective governance layer for a demo platform.', color: '#9F1239' },
                            { icon: Key, label: 'Next step: Stage 5', detail: 'Moving to full governance means assigning data product owners, setting quality SLAs, and connecting to BD\'s live operational and regulatory systems rather than seed data.', color: '#065F46' },
                            { icon: Clock, label: 'Production path', detail: 'Live Neon/Databricks integration, automated Edgar ingestion for peer utility filings, and real-time MISO and FERC data feeds are the natural next builds.', color: '#B45309' },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 mb-0.5">{item.label}</p>
                                        <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.section>

                {/* ── CTA ── */}
                <motion.section
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-[#003B2C] to-[#003B2C] rounded-3xl p-10 text-white text-center"
                >
                    <Database className="w-8 h-8 text-[#009AC7] mx-auto mb-4" />
                    <h3 className="text-2xl font-extrabold mb-3">The foundation is what makes the rest credible.</h3>
                    <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed mb-8">
                        AI can only be trusted when the data it reads can be trusted. The work of building and maintaining a data foundation is not glamorous — but it is the difference between a dashboard people believe and one they work around.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { label: 'How AI Works Here', href: '/ai-overview' },
                            { label: 'AI Insights & Commentary', href: '/commentary' },
                            { label: 'Executive Summary', href: '/executive-summary' },
                            { label: 'Analytics Sandbox', href: '/sandbox' },
                        ].map(l => (
                            <a
                                key={l.label}
                                href={l.href}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-medium transition-colors"
                            >
                                {l.label}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        ))}
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
