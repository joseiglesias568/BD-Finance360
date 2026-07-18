'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    BarChart2,
    Brain,
    CalendarDays,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    Database,
    Eye,
    FileText,
    MessageSquare,
    RefreshCw,
    Shield,
    Sparkles,
    Users,
    X,
    Zap,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityStatus = 'complete' | 'in-progress' | 'pending' | 'escalated';
type Lane = 'ai' | 'owners' | 'controller';

interface Activity {
    id: string;
    day: number;
    lane: Lane;
    title: string;
    owner: string;
    ownerColor: string;
    ownerBg: string;
    icon: React.ElementType;
    status: ActivityStatus;
    timing: string;
    criteria: string[];
    detail: string;
    output?: string;
    escalation?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const days = [
    { num: 1, label: 'Day 1', sub: 'Data Ingestion & Reconciliation', color: '#0070C0' },
    { num: 2, label: 'Day 2', sub: 'Variance Resolution', color: '#7C3AED' },
    { num: 3, label: 'Day 3', sub: 'Review & Challenge', color: '#B45309' },
    { num: 4, label: 'Day 4', sub: 'Consolidation & Sign-Off', color: '#065F46' },
    { num: 5, label: 'Day 5', sub: 'Publish & Distribute', color: '#003B2C' },
];

const laneConfig: Record<Lane, { label: string; sub: string; color: string; bg: string }> = {
    ai: { label: 'Agentic Layer', sub: 'AI agent team', color: '#0070C0', bg: '#EFF6FF' },
    owners: { label: 'Finance Owners', sub: 'Segment & function controllers', color: '#7C3AED', bg: '#F5F3FF' },
    controller: { label: 'Controller & CFO', sub: 'Review, challenge & sign-off', color: '#065F46', bg: '#ECFDF5' },
};

const activities: Activity[] = [
    // Day 1 — AI
    {
        id: 'd1-ingest',
        day: 1,
        lane: 'ai',
        title: 'GL & Sub-Ledger Ingestion',
        owner: 'The Gatekeeper',
        ownerColor: '#9F1239',
        ownerBg: '#FFF1F2',
        icon: Database,
        status: 'complete',
        timing: '7:00 – 7:04 AM',
        criteria: [
            'All 18 P&L lines populated from GL trial balance',
            'Intercompany eliminations net to zero',
            'Prior-month closing entries confirmed posted',
            'Every value tagged [CITED: GL-March-26]',
        ],
        detail: 'Gatekeeper pulls actuals from the GL trial balance, AP sub-ledger, and payroll system. Validates control totals, intercompany netting, and closing entry status before releasing data downstream.',
        output: '18 lines ingested · 0 out-of-balance · 2 IC entries verified',
    },
    {
        id: 'd1-recon',
        day: 1,
        lane: 'ai',
        title: 'P&L Reconciliation vs. Plan',
        owner: 'The Number Cruncher',
        ownerColor: '#0070C0',
        ownerBg: '#EFF6FF',
        icon: BarChart2,
        status: 'complete',
        timing: '7:04 – 7:14 AM',
        criteria: [
            'Variance $M and % computed for all 18 lines',
            'Policy matrix applied: >$50M absolute or >5% relative',
            'Combined test applied for lines with base <$200M',
            'Bridge walk generated for each line item',
        ],
        detail: 'Number Cruncher computes actual-vs.-plan deltas for every P&L line and applies the variance policy matrix to identify escalation candidates. Bridge walk generated automatically for all lines.',
        output: '18 lines reconciled · 4 policy breaches identified',
    },
    {
        id: 'd1-escalate',
        day: 1,
        lane: 'ai',
        title: 'Escalation Routing',
        owner: 'The Watchdog + Team Lead',
        ownerColor: '#B45309',
        ownerBg: '#FFFBEB',
        icon: AlertTriangle,
        status: 'complete',
        timing: '7:14 – 7:22 AM',
        escalation: true,
        criteria: [
            '4 breach items scored by severity × strategic significance',
            'Finance owner assigned per org-chart mapping',
            'Escalation payload sent with variance detail + EPM link',
            'Commentary SLA set: 4-hour response window',
        ],
        detail: 'Watchdog scores each breach item. Team Lead routes structured escalation notifications to Missouri Finance, Illinois Finance, Transmission Finance, and Corporate Finance. Each owner receives variance detail, EPM bridge link, and commentary deadline.',
        output: '4 escalations routed · SLA: 4 hrs · All links pre-populated',
    },
    // Day 1 — AI: Draft commentary
    {
        id: 'd1-draft',
        day: 1,
        lane: 'ai',
        title: 'Draft Close Commentary (14 lines)',
        owner: 'The Storyteller',
        ownerColor: '#7C3AED',
        ownerBg: '#F5F3FF',
        icon: MessageSquare,
        status: 'complete',
        timing: '7:22 AM',
        criteria: [
            'Commentary drafted for all 14 in-policy lines',
            '4 escalated lines receive [PENDING OWNER REVIEW] placeholder',
            'All figures anchored to cited GL actuals',
            'Package structurally complete for Controller staging',
        ],
        detail: 'Storyteller drafts variance explanations for all 14 in-policy lines immediately. Escalated lines receive structured placeholder commentary so the package is stage-ready pending owner input.',
        output: '14 lines complete · 4 placeholders staged · 0 estimated figures',
    },
    // Day 2 — Finance Owners
    {
        id: 'd2-owners',
        day: 2,
        lane: 'owners',
        title: 'Owner Commentary Submission',
        owner: 'Finance Owners (×4)',
        ownerColor: '#374151',
        ownerBg: '#F3F4F6',
        icon: Users,
        status: 'complete',
        timing: 'By 11:30 AM',
        criteria: [
            'All 4 owners submit causal explanation within SLA',
            'Sub-component breakdowns provided where applicable',
            'Forward-look sentences included for each variance',
            'Owner submits via Finance360 (logged, version-controlled)',
        ],
        detail: 'Three owners submit commentary directly in Finance360 by the 4-hour SLA. Missouri Finance requests a fuel cost sub-split ($62M emergency spot purchases + $33M MISO capacity charges). This triggers an agent revision cycle.',
    },
    // Day 2 — AI: Incorporate feedback
    {
        id: 'd2-revise',
        day: 2,
        lane: 'ai',
        title: 'Incorporate Owner Feedback',
        owner: 'Number Cruncher + Storyteller',
        ownerColor: '#0070C0',
        ownerBg: '#EFF6FF',
        icon: RefreshCw,
        status: 'complete',
        timing: '11:35 AM',
        criteria: [
            'Sub-component split validates against trial balance total',
            'Bridge walk re-drawn with two separate bars',
            'Commentary revised to reflect owner framing',
            '3 surfaces (bridge, table, commentary) synced simultaneously',
        ],
        detail: 'Number Cruncher validates the $74M + $44M sub-split against the GL total, re-draws the EPM bridge, and propagates the update to the reconciliation table. Storyteller revises the commentary narrative to incorporate the owner\'s framing and forward look.',
        output: 'Bridge re-drawn · 3 surfaces synced in <2 seconds · All 4 lines [READY FOR SIGN-OFF]',
    },
    // Day 3 — Controller
    {
        id: 'd3-review',
        day: 3,
        lane: 'controller',
        title: 'Controller Pre-Read Review',
        owner: 'Jordan Walsh, Controller',
        ownerColor: '#065F46',
        ownerBg: '#ECFDF5',
        icon: Eye,
        status: 'complete',
        timing: 'Morning session',
        criteria: [
            'All 18 commentary lines reviewed',
            'Escalated items challenged for completeness and precision',
            'In-line edits made directly in Finance360',
            'Open questions logged with owner tag for resolution',
        ],
        detail: 'Controller reviews the full package. Reviews 14 pre-cleared lines quickly; focuses challenge time on the 4 escalated items. Edits Equipment Revenue commentary in-line ("seasonal" → "upgrade-cycle"). Approves 3 items; sends one back for additional sensitivity context.',
    },
    // Day 3 — AI: Sensitivity
    {
        id: 'd3-sensitivity',
        day: 3,
        lane: 'ai',
        title: 'Sensitivity & Re-Run on Open Item',
        owner: 'The Number Cruncher',
        ownerColor: '#0070C0',
        ownerBg: '#EFF6FF',
        icon: BarChart2,
        status: 'complete',
        timing: 'Same day',
        criteria: [
            'Additional sensitivity analysis run on Chart Integration Costs',
            'Q2–Q4 forward impact modeled under two synergy scope scenarios',
            'Commentary updated with quantified forward-look range',
            'Re-submitted to Controller for clearance',
        ],
        detail: 'Number Cruncher runs Chart Integration Cost sensitivity under two synergy capture scenarios. Storyteller adds a quantified forward range to the commentary. Updated item returned to Controller within the hour.',
        output: 'Chart Integration: Q2 synergy run-rate range $38M–$52M annualized | cleared same day',
    },
    // Day 3 — Controller: CFO pre-read
    {
        id: 'd3-cfo-pkg',
        day: 3,
        lane: 'controller',
        title: 'CFO Pre-Read Package Staged',
        owner: 'Jordan Walsh + Storyteller',
        ownerColor: '#065F46',
        ownerBg: '#ECFDF5',
        icon: FileText,
        status: 'complete',
        timing: 'Afternoon',
        criteria: [
            'Executive variance summary written (top 5 items)',
            'Bridge walk for total operating income included',
            'All commentary approved by Controller before staging',
            'Deck auto-populated in Meeting Hub',
        ],
        detail: 'Storyteller generates the CFO pre-read: executive summary of top 5 variances, the full operating income bridge walk, and key forward-look signals. Controller reviews and approves. Deck auto-populated in Meeting Hub for the CFO\'s review.',
    },
    // Day 4 — Controller/CFO
    {
        id: 'd4-cfo-review',
        day: 4,
        lane: 'controller',
        title: 'CFO Review & Challenge',
        owner: 'CFO + FP&A Leadership',
        ownerColor: '#065F46',
        ownerBg: '#ECFDF5',
        icon: Eye,
        status: 'complete',
        timing: 'Morning',
        criteria: [
            'CFO reviews pre-read and raises questions in Finance360',
            'Responses logged and addressed within 2 hours',
            'All variance explanations confirmed final',
            'No open review items by end of session',
        ],
        detail: 'CFO reviews the pre-read package in Finance360. Raises two questions on the Missouri revenue shortfall variance. FP&A responds within the tool — responses logged with timestamps and version-controlled against the commentary package.',
    },
    // Day 4 — AI: Final consolidation
    {
        id: 'd4-consolidate',
        day: 4,
        lane: 'ai',
        title: 'Cross-Segment Consolidation',
        owner: 'The Number Cruncher',
        ownerColor: '#0070C0',
        ownerBg: '#EFF6FF',
        icon: RefreshCw,
        status: 'complete',
        timing: 'Afternoon',
        criteria: [
            'Missouri, Illinois, Transmission, and Corporate segment bridges merged',
            'Total company operating income bridge locked',
            'EPS bridge computed with current share count',
            'All bridges reconcile to GL control totals',
        ],
        detail: 'Number Cruncher merges Missouri, Illinois, Transmission, and Corporate segment variance bridges into the total company view. EPS bridge computed using current diluted share count. All totals validated against GL control totals before locks.',
        output: 'Total OI bridge locked · EPS bridge complete · All segments reconcile',
    },
    // Day 4 — Controller sign-off
    {
        id: 'd4-signoff',
        day: 4,
        lane: 'controller',
        title: 'Controller Final Sign-Off',
        owner: 'Jordan Walsh, Controller',
        ownerColor: '#065F46',
        ownerBg: '#ECFDF5',
        icon: CheckCircle,
        status: 'complete',
        timing: 'End of day',
        criteria: [
            'All 18 lines approved in Finance360',
            'Audit log written: approver, timestamp, commentary version',
            'In-line edits preserved in version history',
            'No open items — close package locked',
        ],
        detail: 'Controller reviews the consolidated package, confirms all CFO questions resolved, and clicks "Approve & Sign Off." Finance360 writes an immutable audit log recording the approver identity, timestamp, and exact text version of every approved commentary line.',
        output: 'Package locked · Audit trail complete · Delivered ahead of deadline',
    },
    // Day 5 — AI: Publish
    {
        id: 'd5-publish',
        day: 5,
        lane: 'ai',
        title: 'Dashboard Refresh with Actuals',
        owner: 'Team Lead + Gatekeeper',
        ownerColor: '#003B2C',
        ownerBg: '#F0F0F0',
        icon: Sparkles,
        status: 'complete',
        timing: 'Morning',
        criteria: [
            'All dashboards refreshed with locked March actuals',
            'Executive Summary updated with close commentary',
            'AI Alerts reset to reflect new actuals baseline',
            'Bridge walks archived for audit and future reference',
        ],
        detail: 'Team Lead coordinates the publish cycle. Gatekeeper re-tags all locked values as [FINAL: GL-March-26]. Dashboards refresh automatically. Executive Summary, Business Consoles, and EPM modules all update. AI Alert thresholds recalibrated to the new actuals baseline.',
        output: 'All surfaces live · Actuals baseline recalibrated · Dashboards current',
    },
    // Day 5 — Controller: Distribute
    {
        id: 'd5-distribute',
        day: 5,
        lane: 'controller',
        title: 'Close Report Distribution',
        owner: 'FP&A + Controller Office',
        ownerColor: '#065F46',
        ownerBg: '#ECFDF5',
        icon: FileText,
        status: 'complete',
        timing: 'By noon',
        criteria: [
            'Close package distributed to CFO, Business Presidents, IR',
            'Board summary extract prepared',
            'Lessons-learned log updated with close timeline metrics',
            'Next close calendar confirmed and pre-populated in Finance360',
        ],
        detail: 'The approved close report is distributed to stakeholders via Finance360\'s distribution list. Board summary extract generated automatically. Controller Office logs close cycle metrics (elapsed days, escalation count, revision cycles) for continuous improvement.',
    },
];

const statusConfig: Record<ActivityStatus, { label: string; color: string; bg: string; dot: string }> = {
    complete: { label: 'Complete', color: '#065F46', bg: '#DCFCE7', dot: 'bg-emerald-500' },
    'in-progress': { label: 'In Progress', color: '#0070C0', bg: '#DBEAFE', dot: 'bg-blue-500' },
    escalated: { label: 'Escalated', color: '#B45309', bg: '#FEF3C7', dot: 'bg-amber-500' },
    pending: { label: 'Pending', color: '#6B7280', bg: '#F3F4F6', dot: 'bg-gray-400' },
};

const closeKPIs = [
    { label: 'Close Cycle', value: '5 days', sub: 'Day 1–5, March 2026', color: '#003B2C' },
    { label: 'Lines Reconciled', value: '18', sub: 'All P&L lines, 100% coverage', color: '#0070C0' },
    { label: 'Escalations', value: '4', sub: 'Policy-breach variances raised', color: '#B45309' },
    { label: 'Time to Sign-Off', value: 'Day 4', sub: 'Ahead of Day 5 deadline', color: '#065F46' },
    { label: 'AI Cycle Time', value: '<25 sec', sub: 'Full reconciliation + routing', color: '#7C3AED' },
    { label: 'Audit Coverage', value: '100%', sub: 'Every line version-logged', color: '#065F46' },
];

// ─── Component ───────────────────────────────────────────────────────────────

const fade = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function FinancialClosePage() {
    const [selected, setSelected] = useState<Activity | null>(null);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);

    const getActivitiesForCell = (day: number, lane: Lane) =>
        activities.filter(a => a.day === day && a.lane === lane);

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* ── Hero ── */}
            <div className="bg-gradient-to-br from-[#003B2C] to-[#003B2C] text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <motion.div initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <CalendarDays className="w-5 h-5 text-[#009AC7]" />
                            <span className="text-sm font-medium text-[#009AC7] uppercase tracking-widest">Agentic Close Process</span>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold mb-2 leading-tight">
                                    Financial Close Tracker
                                </h1>
                                <p className="text-white/60 text-sm max-w-2xl">
                                    Annotated process flow for the agentic month-end close — showing daily milestones, success criteria, escalation checkpoints, and human sign-off gates across the five-day close cycle.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-sm font-semibold text-white">March 2026 · Close Complete</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* KPI bar */}
                    <motion.div
                        initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5, delay: 0.15 }}
                        className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-3"
                    >
                        {closeKPIs.map(k => (
                            <div key={k.label} className="bg-white/10 rounded-xl p-3 border border-white/10">
                                <p className="text-xl font-extrabold text-white">{k.value}</p>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-0.5">{k.label}</p>
                                <p className="text-[10px] text-white/30 mt-0.5 leading-snug">{k.sub}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Day progress bar */}
                    <motion.div
                        initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5, delay: 0.25 }}
                        className="mt-6"
                    >
                        <div className="flex items-center gap-0">
                            {days.map((d, i) => (
                                <div key={d.num} className="flex items-center flex-1">
                                    <div className="flex-1">
                                        <div className="h-1.5 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="mx-2 flex flex-col items-center">
                                        <div className="w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center border-2 border-white">
                                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-[9px] font-bold text-white/50 mt-1 uppercase tracking-widest">{d.label}</span>
                                    </div>
                                    {i < days.length - 1 && (
                                        <div className="flex-1">
                                            <div className="h-1.5 rounded-full bg-emerald-400" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

                {/* ── Section header ── */}
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                    <p className="text-xs font-bold text-[#003B2C] uppercase tracking-widest mb-1">Process Flow — Swimlane View</p>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Five-day close: who does what, when.</h2>
                    <p className="text-gray-500 text-sm max-w-3xl">
                        Three swim lanes — Agentic Layer, Finance Owners, and Controller & CFO — across five close days. Click any activity for success criteria and detail.
                    </p>
                </motion.div>

                {/* ── Swimlane grid ── */}
                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm"
                >
                    {/* Column headers — days */}
                    <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '160px repeat(5, 1fr)' }}>
                        <div className="px-4 py-3 bg-gray-50 border-r border-gray-200">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Swim lane</p>
                        </div>
                        {days.map((d, i) => (
                            <div
                                key={d.num}
                                className={`px-3 py-3 ${i < days.length - 1 ? 'border-r border-gray-200' : ''}`}
                                style={{ backgroundColor: `${d.color}08` }}
                            >
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: d.color }}>
                                        {d.num}
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">{d.label}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-snug">{d.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Swimlane rows */}
                    {(Object.keys(laneConfig) as Lane[]).map((lane, laneIdx) => {
                        const lc = laneConfig[lane];
                        return (
                            <div
                                key={lane}
                                className={`grid ${laneIdx < 2 ? 'border-b border-gray-200' : ''}`}
                                style={{ gridTemplateColumns: '160px repeat(5, 1fr)' }}
                            >
                                {/* Lane label */}
                                <div className="px-4 py-4 bg-gray-50 border-r border-gray-200 flex flex-col justify-start">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5" style={{ backgroundColor: lc.bg }}>
                                        {lane === 'ai' && <Brain className="w-3.5 h-3.5" style={{ color: lc.color }} />}
                                        {lane === 'owners' && <Users className="w-3.5 h-3.5" style={{ color: lc.color }} />}
                                        {lane === 'controller' && <Eye className="w-3.5 h-3.5" style={{ color: lc.color }} />}
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-700 leading-snug">{lc.label}</p>
                                    <p className="text-[9px] text-gray-400 mt-0.5 leading-snug">{lc.sub}</p>
                                </div>

                                {/* Activity cells — one per day */}
                                {days.map((d, dayIdx) => {
                                    const cellActivities = getActivitiesForCell(d.num, lane);
                                    return (
                                        <div
                                            key={d.num}
                                            className={`p-2 space-y-2 ${dayIdx < days.length - 1 ? 'border-r border-gray-100' : ''} min-h-[140px]`}
                                        >
                                            {cellActivities.map(act => {
                                                const Icon = act.icon;
                                                const sc = statusConfig[act.status];
                                                const isSelected = selected?.id === act.id;
                                                return (
                                                    <button
                                                        key={act.id}
                                                        onClick={() => setSelected(isSelected ? null : act)}
                                                        className={`w-full text-left rounded-xl border p-2.5 transition-all ${
                                                            isSelected
                                                                ? 'border-[#003B2C] shadow-md ring-1 ring-[#003B2C]/20 bg-white'
                                                                : act.escalation
                                                                    ? 'border-amber-200 bg-amber-50 hover:border-amber-300 hover:shadow-sm'
                                                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: act.ownerBg }}>
                                                                <Icon className="w-3 h-3" style={{ color: act.ownerColor }} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10px] font-bold text-gray-800 leading-snug">{act.title}</p>
                                                                <p className="text-[9px] text-gray-400 mt-0.5 truncate">{act.owner}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <span
                                                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                                                style={{ color: sc.color, backgroundColor: sc.bg }}
                                                            >
                                                                {sc.label}
                                                            </span>
                                                            <span className="text-[8px] text-gray-300">{act.timing.split('–')[0]}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </motion.div>

                {/* ── Activity detail modal ── */}
                <AnimatePresence>
                    {selected && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                                onClick={() => setSelected(null)}
                            />

                            {/* Modal */}
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div
                                    className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden pointer-events-auto"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {/* Modal header */}
                                    <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: selected.ownerBg }}>
                                                {(() => { const Icon = selected.icon; return <Icon className="w-5 h-5" style={{ color: selected.ownerColor }} />; })()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Day {selected.day} · {laneConfig[selected.lane].label}
                                                    </span>
                                                    {selected.escalation && (
                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                            Escalation checkpoint
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-bold text-gray-900">{selected.title}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: selected.ownerColor, backgroundColor: selected.ownerBg }}>
                                                        {selected.owner}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        {selected.timing}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelected(null)}
                                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-4"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Detail narrative */}
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">What happens</p>
                                            <p className="text-sm text-gray-600 leading-relaxed">{selected.detail}</p>
                                            {selected.output && (
                                                <div className="mt-3 bg-gray-900 rounded-xl px-4 py-3">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Output</p>
                                                    <p className="text-[11px] font-mono text-emerald-400 whitespace-pre-line leading-relaxed">{selected.output}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Success criteria checklist */}
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Success criteria</p>
                                            <div className="space-y-2">
                                                {selected.criteria.map((c, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                        <p className="text-sm text-gray-700 leading-snug">{c}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* ── Day-by-day activity log ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#003B2C] uppercase tracking-widest mb-1">Daily Activity Log</p>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">What happens each day — expanded.</h2>
                        <p className="text-gray-500 text-sm max-w-3xl mb-6">
                            Click any day to expand the full activity sequence with timing and success criteria.
                        </p>
                    </motion.div>

                    <div className="space-y-3">
                        {days.map((d, i) => {
                            const dayActivities = activities.filter(a => a.day === d.num);
                            const isOpen = expandedDay === d.num;
                            return (
                                <motion.div
                                    key={d.num}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={fade} transition={{ duration: 0.35, delay: i * 0.06 }}
                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedDay(isOpen ? null : d.num)}
                                        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-extrabold"
                                            style={{ backgroundColor: d.color }}
                                        >
                                            {d.num}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-gray-900">{d.label}</p>
                                                <span className="text-xs font-medium text-gray-400">— {d.sub}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-gray-400">{dayActivities.length} activities</span>
                                                <span className="text-[10px] text-gray-300">·</span>
                                                {dayActivities.some(a => a.escalation) && (
                                                    <span className="text-[10px] font-bold text-amber-600">Escalation checkpoint</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                                Complete
                                            </span>
                                            {isOpen
                                                ? <ChevronDown className="w-4 h-4 text-gray-400" />
                                                : <ChevronRight className="w-4 h-4 text-gray-400" />
                                            }
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="expanded"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                                                    {dayActivities.map(act => {
                                                        const Icon = act.icon;
                                                        const sc = statusConfig[act.status];
                                                        const lc = laneConfig[act.lane];
                                                        return (
                                                            <div
                                                                key={act.id}
                                                                className={`flex gap-4 rounded-xl border p-4 ${act.escalation ? 'border-amber-200 bg-amber-50/50' : 'border-gray-100 bg-gray-50/50'}`}
                                                            >
                                                                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: act.ownerBg }}>
                                                                    <Icon className="w-4 h-4" style={{ color: act.ownerColor }} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                                                                        <p className="text-sm font-bold text-gray-900">{act.title}</p>
                                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: lc.color, backgroundColor: lc.bg }}>{lc.label}</span>
                                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: sc.color, backgroundColor: sc.bg }}>{sc.label}</span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 mb-2">{act.detail}</p>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                                        {act.criteria.map((c, ci) => (
                                                                            <div key={ci} className="flex items-start gap-1.5">
                                                                                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                                                                <p className="text-[10px] text-gray-600 leading-snug">{c}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {act.output && (
                                                                        <div className="mt-2 bg-gray-900 rounded-lg px-3 py-2">
                                                                            <p className="text-[10px] font-mono text-emerald-400 whitespace-pre-line">{act.output}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="shrink-0 text-right">
                                                                    <p className="text-[10px] text-gray-400 font-mono">{act.timing}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── Escalation policy reference ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#003B2C] uppercase tracking-widest mb-1">Escalation Policy</p>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">What triggers a human escalation.</h2>
                        <p className="text-gray-500 text-sm max-w-3xl mb-6">
                            Any variance that meets one or more of these criteria is automatically escalated — commentary cannot be signed off until a finance owner responds.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                threshold: '>$50M absolute',
                                label: 'Absolute dollar threshold',
                                desc: 'Any P&L line where the plan-vs-actual variance exceeds $50M in either direction.',
                                color: '#B45309',
                                bg: '#FFFBEB',
                                icon: AlertTriangle,
                            },
                            {
                                threshold: '>5% relative',
                                label: 'Percentage threshold',
                                desc: 'Any line where the variance exceeds 5% of the plan value, regardless of dollar size.',
                                color: '#B45309',
                                bg: '#FFFBEB',
                                icon: BarChart2,
                            },
                            {
                                threshold: 'Combined test',
                                label: 'Small-line combined test',
                                desc: 'For lines with plan <$200M: escalate if variance exceeds both $20M and 3% simultaneously.',
                                color: '#7C3AED',
                                bg: '#F5F3FF',
                                icon: Zap,
                            },
                            {
                                threshold: 'Strategic flag',
                                label: 'Strategic significance override',
                                desc: 'Team Lead can escalate any item it identifies as strategically significant regardless of dollar threshold.',
                                color: '#003B2C',
                                bg: '#F0F0F0',
                                icon: Brain,
                            },
                        ].map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <motion.div
                                    key={p.threshold}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={fade} transition={{ duration: 0.35, delay: i * 0.06 }}
                                    className="bg-white rounded-2xl border border-gray-200 p-5"
                                >
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: p.bg }}>
                                        <Icon className="w-4 h-4" style={{ color: p.color }} />
                                    </div>
                                    <p className="text-base font-extrabold mb-0.5" style={{ color: p.color }}>{p.threshold}</p>
                                    <p className="text-xs font-bold text-gray-700 mb-1">{p.label}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── Closing note ── */}
                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-[#003B2C] to-[#003B2C] rounded-3xl p-8 text-white flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-[#009AC7]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-extrabold mb-1">The agents handle the mechanics. You handle the judgment.</h3>
                        <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
                            Every data pull, variance calculation, bridge update, and commentary draft is completed by the agent team in seconds. Every escalation, challenge, edit, and sign-off remains in human hands — with a full audit trail capturing who approved what, when, and which version.
                        </p>
                    </div>
                    <a
                        href="/ai-overview"
                        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-colors"
                    >
                        How AI works here
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>

            </div>
        </div>
    );
}
