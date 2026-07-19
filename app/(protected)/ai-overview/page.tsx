'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    BarChart2,
    BookOpen,
    Brain,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    Database,
    Eye,
    FileText,
    GitMerge,
    Rocket,
    Lock,
    MapPin,
    MessageSquare,
    MousePointerClick,
    RefreshCw,
    Search,
    Shield,
    Sparkles,
    TrendingUp,
    Users,
    X,
    Zap,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const agents = [
    {
        id: 'orchestrator',
        name: 'The Team Lead',
        role: 'Orchestrator Agent',
        color: '#1c519c',
        bg: '#F0F0F0',
        icon: Brain,
        plain: 'Reads your request, decides which specialists to call, and assembles the final answer — like a project manager who never sleeps.',
        handles: ['Executive Summary', 'Scenario Modeling', 'Monthly Report'],
    },
    {
        id: 'analyst',
        name: 'The Number Cruncher',
        role: 'Financial Analysis Agent',
        color: '#0070C0',
        bg: '#EFF6FF',
        icon: BarChart2,
        plain: 'Digs into the quarterly figures, spots trends across revenue, margin, and cost — and flags anything that moved more than expected.',
        handles: ['Revenue bridge', 'Variance analysis', 'KPI trends'],
    },
    {
        id: 'storyteller',
        name: 'The Storyteller',
        role: 'Commentary Agent',
        color: '#7C3AED',
        bg: '#F5F3FF',
        icon: MessageSquare,
        plain: 'Turns numbers into plain-English narratives. Writes the briefing text, insight cards, and executive summaries you read on each dashboard.',
        handles: ['AI Financial Snapshot', 'Insight cards', 'Briefing narrative'],
    },
    {
        id: 'watchdog',
        name: 'The Watchdog',
        role: 'Anomaly Detection Agent',
        color: '#B45309',
        bg: '#FFFBEB',
        icon: AlertTriangle,
        plain: 'Monitors every metric continuously. When something falls outside its normal range — BD segment revenue below plan, BioPharma Systems GLP-1 volume shortfall, or China VoBP headwind exceeding forecast — it fires an alert immediately.',
        handles: ['AI Alerts', 'Risk flags', 'Threshold monitoring'],
    },
    {
        id: 'researcher',
        name: 'The Researcher',
        role: 'Semantic Search Agent',
        color: '#065F46',
        bg: '#ECFDF5',
        icon: Search,
        plain: 'Powers the AI Search bar. Understands questions in plain English and finds the right figures, narratives, and supporting data instantly.',
        handles: ['AI Search', 'Data retrieval', 'Document lookup'],
    },
    {
        id: 'guardian',
        name: 'The Gatekeeper',
        role: 'Data Integrity Agent',
        color: '#9F1239',
        bg: '#FFF1F2',
        icon: Shield,
        plain: 'Every piece of data gets a source tag before it leaves the pipeline. This agent verifies citations trace back to a 10-K, 10-Q, or earnings release — never thin air.',
        handles: ['Provenance tagging', 'Source validation', 'Audit trail'],
    },
];

const workflowSteps = [
    { icon: Database, label: 'Source Data Arrives', sub: '10-K · 10-Q · Earnings releases · Internal metrics', color: '#1c519c' },
    { icon: Shield, label: 'Guardian validates & tags', sub: 'Every value gets a [CITED] or [DERIVED] label', color: '#9F1239' },
    { icon: Brain, label: 'Team Lead routes the request', sub: 'Decides which specialists are needed', color: '#1c519c' },
    { icon: BarChart2, label: 'Specialists do the work', sub: 'Crunch numbers · Write narrative · Detect anomalies', color: '#0070C0' },
    { icon: Eye, label: 'Human checkpoint', sub: 'Finance team reviews, edits, and approves', color: '#065F46' },
    { icon: Sparkles, label: 'Output to dashboard', sub: 'Insight cards · Charts · Alerts · Briefings', color: '#7C3AED' },
];

const appSpotlights = [
    {
        page: 'Executive Summary',
        href: '/executive-summary',
        color: '#1c519c',
        bg: '#F0F0F0',
        icon: TrendingUp,
        aiFeatures: [
            { label: 'AI Financial Snapshot', desc: 'Storyteller agent writes the hero briefing text from live quarterly data' },
            { label: 'Insight cards', desc: 'Each lane (Commercial, Ops, Financial, Risk) surfaces 2-5 AI-tagged insights' },
            { label: 'Revenue & margin charts', desc: 'Number Cruncher populates from 10-K/10-Q seed with automatic fallback' },
        ],
    },
    {
        page: 'Commentary & Insights',
        href: '/commentary',
        color: '#7C3AED',
        bg: '#F5F3FF',
        icon: MessageSquare,
        aiFeatures: [
            { label: '800+ AI-generated entries', desc: 'Storyteller created narratives across 7 business outcome categories' },
            { label: 'Executive attribution', desc: 'Key quotes tied to Christopher J. DelOrefice, Tom Polen, and other BD leaders' },
            { label: 'Human-editable', desc: 'Finance team can flag, edit, or add commentary directly' },
        ],
    },
    {
        page: 'AI Alerts',
        href: '/ai-alerts',
        color: '#B45309',
        bg: '#FFFBEB',
        icon: AlertTriangle,
        aiFeatures: [
            { label: '25 live anomaly monitors', desc: 'Watchdog tracks BD segment organic growth, BioPharma Systems GLP-1 demand, Alaris ramp rate, and China VoBP headwind in real time' },
            { label: 'Severity tiers', desc: 'Critical · High · Medium thresholds tuned to health care industry benchmarks' },
            { label: 'Auto-routed to owner', desc: 'Each alert tagged with the responsible business function' },
        ],
    },
    {
        page: 'Scenario Modeling',
        href: '/scenario-modeling',
        color: '#0070C0',
        bg: '#EFF6FF',
        icon: GitMerge,
        aiFeatures: [
            { label: 'Driver analytics', desc: 'Number Cruncher models BD GLP-1 device demand acceleration, China VoBP headwind scenarios, and Alaris market return scenarios simultaneously' },
            { label: 'AI narrative summary', desc: 'Storyteller writes a plain-English read-out of each scenario result' },
            { label: 'External signals', desc: 'Industry news and macro indicators surface inside the modeling workspace' },
        ],
    },
];

// ── Scenario 1: GLP-1 Demand Acceleration ───────────────────────────────────

const glp1Scenario = {
    id: 'glp1',
    label: 'GLP-1 Demand Acceleration',
    tagline: 'BioPharma Systems upside as GLP-1 drug manufacturers accelerate prefillable device procurement',
    triggerIcon: TrendingUp,
    triggerIconColor: '#1c519c',
    scenario: 'GLP-1 Device Demand Acceleration — Revised Scenario Analysis',
    trigger: {
        time: '8:32 AM',
        who: 'Sarah Kim, VP FP&A — BioPharma Systems',
        message: '"GLP-1 drug manufacturers just reported Q2 production volumes 30% above consensus estimates. Our BioPharma Systems order book is tracking $85M above Q3 plan for prefillable syringes and auto-injectors. I need an updated revenue and EPS impact model for BD — favorable, base, and upside scenarios — so we can update guidance framing for the CFO by 10 AM."',
    },
    steps: [
        {
            time: '8:32:01',
            agent: 'The Team Lead',
            agentColor: '#1c519c',
            agentBg: '#F0F0F0',
            icon: Brain,
            action: 'Reads & routes the request',
            detail: 'Parses Sarah\'s message. Identifies three tasks: (1) retrieve current BioPharma Systems baseline revenue and Q3 order book, (2) run three-scenario P&L model with GLP-1 device demand upside, (3) draft CFO-ready narrative with EPS sensitivities. Routes to specialists.',
            output: null,
        },
        {
            time: '8:32:03',
            agent: 'The Gatekeeper',
            agentColor: '#9F1239',
            agentBg: '#FFF1F2',
            icon: Shield,
            action: 'Validates source data',
            detail: 'Pulls current BD BioPharma Systems metrics: Q2 FY26 BioPharma Systems revenue $1,242M [CITED:BD-10Q-Q2-26]; GLP-1 device category growth +28% YoY [CITED:BD-EC-Q2-26]; Q3 order book +$85M above plan [INTERNAL]; FY26 adj. EPS guidance ~$13.25–$13.50 [CITED:BD-EC-Q2-26]. Tags each value.',
            output: '4 values cited · 0 gaps · BD Simplify savings confirmed as fixed-cost offset',
        },
        {
            time: '8:32:06',
            agent: 'The Number Cruncher',
            agentColor: '#0070C0',
            agentBg: '#EFF6FF',
            icon: BarChart2,
            action: 'Runs the GLP-1 demand scenario model',
            detail: 'Applies BD disclosed sensitivities: each $100M incremental BioPharma Systems revenue ≈ +$25M adj. OI at 25% segment margin; each $25M adj. OI ≈ +$0.06 Adj. EPS (16.5% tax, 282M shares). Builds three scenarios: (A) Base: Q3 +$85M as planned; (B) Upside: full-year $250M above plan; (C) Acceleration: FY27 ramp drives $500M+ above plan.',
            output: null,
        },
        {
            time: '8:32:10',
            agent: 'The Number Cruncher',
            agentColor: '#0070C0',
            agentBg: '#EFF6FF',
            icon: RefreshCw,
            action: 'Monte Carlo simulation — 10,000 iterations',
            detail: 'Randomizes GLP-1 drug manufacturer production ramp rate, prefillable syringe yield rates, BD capacity utilization, and competitive share dynamics. Surfaces probabilistic EPS range for each scenario.',
            output: 'Base (+$85M Q3): FY26 Adj. EPS +$0.12 · Within guidance range\nUpside (+$250M FY26): FY26 Adj. EPS +$0.35 · Above guidance midpoint\nAcceleration (+$500M FY27): FY27 Adj. EPS +$0.70 · Material guidance beat potential',
        },
        {
            time: '8:32:16',
            agent: 'The Watchdog',
            agentColor: '#B45309',
            agentBg: '#FFFBEB',
            icon: AlertTriangle,
            action: 'Checks capacity constraints',
            detail: 'Compares order book demand against BD manufacturing capacity for prefillable syringes. Current utilization 82%; the $250M upside scenario requires 94% utilization — approaching capacity ceiling. Flags supply risk and triggers capacity investment analysis.',
            output: '⚠ Upside scenario: Prefillable syringe capacity at 94% — supply constraint risk\n✅ Base scenario: Within normal capacity utilization (86%)\n📋 Acceleration scenario: CapEx investment required; included in FY27 plan review',
        },
        {
            time: '8:32:20',
            agent: 'The Storyteller',
            agentColor: '#7C3AED',
            agentBg: '#F5F3FF',
            icon: MessageSquare,
            action: 'Writes the CFO briefing narrative',
            detail: 'Drafts three scenario summaries, exec headline, capacity risk call-out, and recommended action — all anchored to cited values. Formatted for CFO review by 10 AM deadline.',
            output: '"GLP-1 demand acceleration adds $0.12–$0.35 Adj. EPS upside to FY26 guidance. Capacity management at ~$250M+ upside requires monitoring. Recommend flagging prefillable capacity investment with Global Manufacturing in Q3 ops review."',
        },
        {
            time: '8:32:24',
            agent: 'The Team Lead',
            agentColor: '#1c519c',
            agentBg: '#F0F0F0',
            icon: Sparkles,
            action: 'Assembles and publishes the full output',
            detail: 'Combines model results, capacity flags, and narrative. Pushes to Scenario Modeling dashboard, updates EPM bridge walk with BioPharma Systems upside bar, queues narrative for Executive Summary.',
            output: null,
        },
        {
            time: '8:32:27',
            agent: 'Alert fires',
            agentColor: '#B45309',
            agentBg: '#FFFBEB',
            icon: Zap,
            action: 'Sarah receives the notification',
            detail: '"GLP-1 scenario analysis complete — BioPharma Systems demand model updated. Capacity constraint flag raised on upside scenario. Narrative ready for CFO review. Dashboards live." Total elapsed: 26 seconds.',
            output: null,
        },
        {
            time: '9:55 AM',
            agent: 'Sarah Kim, VP FP&A',
            agentColor: '#374151',
            agentBg: '#F3F4F6',
            icon: Eye,
            action: 'Human review — 83 minutes',
            detail: 'Sarah reviews the model, adjusts one assumption (Q4 capacity ramp timeline extended by 6 weeks based on Manufacturing input), approves the narrative, and forwards to CFO Christopher J. DelOrefice.',
            output: 'CFO briefing delivered by 10:00 AM — exactly on deadline.',
        },
    ],
    outcomes: [
        { icon: Clock, label: 'Agent work time', value: '26 seconds', sub: 'From request to published output', color: '#1c519c' },
        { icon: TrendingUp, label: 'EPS upside modeled', value: '$0.12–$0.70 range', sub: 'Base, upside, and acceleration scenarios', color: '#0070C0' },
        { icon: CheckCircle, label: 'Delivered to CFO', value: 'On time', sub: 'Human review: 83 minutes', color: '#065F46' },
    ],
    analysisSummary: {
        headline: 'GLP-1 Demand Acceleration — AI Briefing',
        generated: 'Generated 8:32:27 AM · 26-second agent run',
        sections: [
            {
                title: 'Request Overview',
                items: [
                    { label: 'Requested by', value: 'Sarah Kim, VP FP&A — BioPharma Systems, 8:32 AM' },
                    { label: 'Trigger event', value: 'GLP-1 manufacturer Q2 production volumes 30% above consensus; BD Q3 order book +$85M above plan' },
                    { label: 'Scope', value: 'BioPharma Systems revenue and BD adj. EPS impact under 3 GLP-1 demand scenarios' },
                    { label: 'Sensitivity applied', value: 'Each $100M BioPharma Systems revenue ≈ +$25M adj. OI at 25% margin · +$0.06 Adj. EPS (16.5% tax, 282M shares)' },
                ],
            },
            {
                title: 'Scenario Results (10,000-Iteration Monte Carlo)',
                items: [
                    { label: 'Base (+$85M Q3)', value: 'FY26 Adj. EPS +$0.12 · Within guidance range · Capacity at 86%' },
                    { label: 'Upside (+$250M FY26)', value: 'FY26 Adj. EPS +$0.35 · Above guidance midpoint · Capacity at 94% — monitor' },
                    { label: 'Acceleration (+$500M FY27)', value: 'FY27 Adj. EPS +$0.70 · Material beat · CapEx investment required' },
                    { label: 'Risk flag', value: 'Prefillable syringe capacity constraint at upside/acceleration scenarios — supply risk flagged' },
                ],
            },
        ],
    },
};

// ── Scenario 2: China VoBP Risk Assessment ──────────────────────────────────

const vobpScenario = {
    id: 'vobp',
    label: 'China VoBP Risk Assessment',
    tagline: 'Downside scenario for accelerated China Volume-Based Procurement expansion across BD product categories',
    triggerIcon: AlertTriangle,
    triggerIconColor: '#B45309',
    scenario: 'China VoBP Expansion — Downside Risk Assessment',
    trigger: {
        time: '2:15 PM',
        who: 'Michael Chen, Director FP&A — International Markets',
        message: '"China NHSA just announced VoBP Round 9 will include additional medical device categories that could impact BD Medical Essentials and Interventional products. Current FY26 plan assumes $150M headwind — preliminary analysis suggests this could reach $220–280M. Can you rerun the VoBP sensitivity model and give me an updated EPS range for the CFO?',
    },
    steps: [
        {
            time: '2:15:01',
            agent: 'The Team Lead',
            agentColor: '#1c519c',
            agentBg: '#F0F0F0',
            icon: Brain,
            action: 'Reads & routes the request',
            detail: 'Parses Michael\'s message. Identifies tasks: (1) pull current China revenue baseline and VoBP exposure by product category, (2) model three VoBP scenarios, (3) draft CFO narrative with EPS range. Routes to specialists.',
            output: null,
        },
        {
            time: '2:15:03',
            agent: 'The Gatekeeper',
            agentColor: '#9F1239',
            agentBg: '#FFF1F2',
            icon: Shield,
            action: 'Validates source data',
            detail: 'Pulls BD China metrics: FY26 China revenue plan ~$1.8B [CITED:BD-EC-Q2-26]; Current VoBP headwind plan $150M [CITED:BD-EC-Q2-26]; Affected categories: injection devices, IV sets, catheters [DERIVED]; BD adj. EPS baseline ~$13.25–$13.50 [CITED:BD-EC-Q2-26].',
            output: '4 values cited · VoBP Round 9 scope unconfirmed [ASSUMED per Michael\'s message]',
        },
        {
            time: '2:15:06',
            agent: 'The Number Cruncher',
            agentColor: '#0070C0',
            agentBg: '#EFF6FF',
            icon: BarChart2,
            action: 'Runs VoBP sensitivity model',
            detail: 'Applies sensitivity: each $100M VoBP revenue headwind ≈ -$25M adj. OI (at 25% China segment margin) ≈ -$0.06 Adj. EPS. Models three scenarios: (A) Plan: $150M headwind as disclosed; (B) Adverse: $220M headwind if Round 9 includes MD categories; (C) Severe: $280M if full scope expansion.',
            output: null,
        },
        {
            time: '2:15:10',
            agent: 'The Number Cruncher',
            agentColor: '#0070C0',
            agentBg: '#EFF6FF',
            icon: RefreshCw,
            action: 'Monte Carlo simulation',
            detail: 'Runs 10,000 iterations randomizing VoBP round scope, BD category exposure overlap, price reduction magnitude, and volume offset from other markets. Emerging market offset partially cushions adverse scenarios.',
            output: 'Plan ($150M headwind): FY26 Adj. EPS at guidance midpoint ~$13.35\nAdverse ($220M): FY26 Adj. EPS -$0.18 vs. guidance · Below guidance floor\nSevere ($280M): FY26 Adj. EPS -$0.35 vs. guidance · Significant guidance risk',
        },
        {
            time: '2:15:16',
            agent: 'The Watchdog',
            agentColor: '#B45309',
            agentBg: '#FFFBEB',
            icon: AlertTriangle,
            action: 'Flags two EPS threshold breaches',
            detail: 'Adverse and severe VoBP scenarios push FY26 EPS below the $13.25 guidance floor. Watchdog logs escalation flags and checks whether emerging market offsets ($45M+ projected) can partially bridge the gap.',
            output: '🔴 Adverse: EPS below guidance floor by $0.07 — CFO escalation triggered\n🔴 Severe: EPS below guidance floor by $0.24 — guidance revision risk\n⚠ Emerging markets offset: $45M partially mitigates adverse scenario',
        },
        {
            time: '2:15:20',
            agent: 'The Storyteller',
            agentColor: '#7C3AED',
            agentBg: '#F5F3FF',
            icon: MessageSquare,
            action: 'Writes the CFO briefing narrative',
            detail: 'Drafts scenario summaries, risk call-out, and recommended actions — anchored to cited data. Frames for CFO review with clear guidance risk assessment.',
            output: '"VoBP Round 9 expansion to $220-280M would put FY26 guidance at risk. Recommend immediate engagement with China country team on Round 9 scope and accelerating emerging markets offset strategy. A $45M+ EMEA/APAC pull-forward could offset the adverse case."',
        },
        {
            time: '2:15:24',
            agent: 'The Team Lead',
            agentColor: '#1c519c',
            agentBg: '#F0F0F0',
            icon: Sparkles,
            action: 'Assembles and publishes',
            detail: 'Publishes VoBP scenario to Scenario Modeling dashboard, updates EPM bridge walk with VoBP sensitivity band, queues narrative for Executive Summary China section.',
            output: null,
        },
        {
            time: '2:15:26',
            agent: 'Alert fires',
            agentColor: '#B45309',
            agentBg: '#FFFBEB',
            icon: Zap,
            action: 'Michael receives the notification',
            detail: '"VoBP risk scenario analysis complete — 2 EPS threshold flags raised. Narrative ready for CFO review. Dashboards updated." Total elapsed: 25 seconds.',
            output: null,
        },
        {
            time: '2:22 PM',
            agent: 'Michael Chen, Director FP&A',
            agentColor: '#374151',
            agentBg: '#F3F4F6',
            icon: Eye,
            action: 'Human review — 7 minutes',
            detail: 'Michael reviews model, confirms assumptions with China Finance team, adjusts emerging markets offset upward by $10M based on updated pipeline data, approves narrative. Forwards to CFO.',
            output: 'CFO briefing delivered by 2:30 PM — actionable guidance risk assessment in hand.',
        },
    ],
    outcomes: [
        { icon: Clock, label: 'Agent work time', value: '25 seconds', sub: 'From request to published output', color: '#1c519c' },
        { icon: AlertTriangle, label: 'EPS risk quantified', value: '-$0.18 to -$0.35', sub: 'Adverse and severe VoBP scenarios', color: '#B45309' },
        { icon: CheckCircle, label: 'Delivered to CFO', value: '7 min post-review', sub: 'Guidance risk assessment complete', color: '#065F46' },
    ],
    analysisSummary: {
        headline: 'China VoBP Risk Assessment — AI Briefing',
        generated: 'Generated 2:15:26 PM · 25-second agent run',
        sections: [
            {
                title: 'Request Overview',
                items: [
                    { label: 'Requested by', value: 'Michael Chen, Director FP&A — International Markets, 2:15 PM' },
                    { label: 'Trigger event', value: 'China NHSA VoBP Round 9 may expand to additional BD medical device categories — headwind risk $220–280M vs. $150M plan' },
                    { label: 'Scope', value: 'BD consolidated EPS impact under 3 VoBP headwind scenarios' },
                    { label: 'Sensitivity applied', value: 'Each $100M VoBP headwind ≈ -$25M adj. OI at 25% margin · -$0.06 Adj. EPS (16.5% tax, 282M shares)' },
                ],
            },
            {
                title: 'Scenario Results',
                items: [
                    { label: 'Plan ($150M headwind)', value: 'FY26 Adj. EPS at guidance midpoint ~$13.35 — no guidance risk' },
                    { label: 'Adverse ($220M)', value: 'FY26 Adj. EPS -$0.18 vs. guidance — below $13.25 guidance floor' },
                    { label: 'Severe ($280M)', value: 'FY26 Adj. EPS -$0.35 vs. guidance — guidance revision risk' },
                    { label: 'Offset', value: 'Emerging markets $45M+ partially cushions adverse case; EMEA pull-forward recommended' },
                ],
            },
        ],
    },
};

// ── Scenario 3: Alaris Market Return ────────────────────────────────────────

const alarisScenario = {
    id: 'alaris',
    label: 'Alaris Market Return',
    tagline: 'Upside scenario from BD Alaris consent decree resolution and accelerated US infusion market share recapture',
    triggerIcon: Rocket,
    triggerIconColor: '#065F46',
    scenario: 'BD Alaris Market Return — Upside Scenario Analysis',
    trigger: {
        time: '11:05 AM',
        who: 'Jennifer Martinez, Senior Director FP&A — Connected Care',
        message: '"FDA has completed its pre-approval inspection of our Alaris manufacturing sites — no observations. Consent decree remediation appears to be tracking 3-4 months ahead of schedule. Hospital procurement teams are calling asking about timelines. Can you run an Alaris market share recapture model for FY26-FY27 so we have updated revenue and EPS projections ready for investor day?',
    },
    steps: [
        {
            time: '11:05:01',
            agent: 'The Team Lead',
            agentColor: '#1c519c',
            agentBg: '#F0F0F0',
            icon: Brain,
            action: 'Reads & routes the request',
            detail: 'Parses Jennifer\'s message. Identifies tasks: (1) pull Connected Care baseline and Alaris market share data, (2) model three Alaris ramp scenarios, (3) draft investor-day-ready narrative with revenue and EPS projections. Routes to specialists.',
            output: null,
        },
        {
            time: '11:05:03',
            agent: 'The Gatekeeper',
            agentColor: '#9F1239',
            agentBg: '#FFF1F2',
            icon: Shield,
            action: 'Validates source data',
            detail: 'Pulls BD Alaris data: Pre-consent decree US infusion market share ~35% [CITED:BD-10K-FY25]; Current Connected Care revenue run-rate ~$1.7B annually [CITED:BD-10Q-Q2-26]; US infusion pump market ~$2.5B annually [DERIVED]; BD Alaris placements currently ~80/quarter [DERIVED].',
            output: '4 values cited · Consent decree resolution timeline ASSUMED per Jennifer\'s update',
        },
        {
            time: '11:05:07',
            agent: 'The Number Cruncher',
            agentColor: '#0070C0',
            agentBg: '#EFF6FF',
            icon: BarChart2,
            action: 'Runs Alaris market share recapture model',
            detail: 'Models three Alaris ramp scenarios: (A) Base: 150 placements/quarter by Q4 FY26; (B) Upside: 200 placements/quarter by Q3 FY26; (C) Acceleration: 250 placements/quarter and 28% market share by FY27. Each Alaris capital placement ≈ $0.6M revenue + $1.2M 5-year service annuity.',
            output: null,
        },
        {
            time: '11:05:12',
            agent: 'The Number Cruncher',
            agentColor: '#0070C0',
            agentBg: '#EFF6FF',
            icon: RefreshCw,
            action: 'Monte Carlo simulation',
            detail: 'Randomizes FDA approval timing, hospital procurement lag (typically 6-9 months post-approval), competitive response from Baxter/ICU Medical, and BD manufacturing capacity ramp. Builds FY26-FY27 revenue and EPS distributions.',
            output: 'Base (150 placements/Q): FY26 Connected Care +$180M · Adj. EPS +$0.16\nUpside (200 placements/Q): FY26 Connected Care +$280M · Adj. EPS +$0.25\nAcceleration (250 placements/Q, 28% share FY27): FY27 Connected Care +$480M · Adj. EPS +$0.43',
        },
        {
            time: '11:05:18',
            agent: 'The Watchdog',
            agentColor: '#B45309',
            agentBg: '#FFFBEB',
            icon: AlertTriangle,
            action: 'Checks execution risks',
            detail: 'Flags three execution dependencies: (1) FDA formal consent decree lift needed before unrestricted sales — timeline uncertain; (2) Hospital capital budget cycles — Q4 FY26 placements may slip to Q1 FY27; (3) Manufacturing capacity for upside/acceleration scenarios requires CapEx commitment.',
            output: '⚠ FDA consent decree formal lift: required for full market re-entry\n⚠ Hospital procurement cycle lag: 6-9 months typical post-approval\n📋 Manufacturing capacity: upside scenario needs $120M CapEx commitment by Q1 FY26',
        },
        {
            time: '11:05:22',
            agent: 'The Storyteller',
            agentColor: '#7C3AED',
            agentBg: '#F5F3FF',
            icon: MessageSquare,
            action: 'Writes the investor day narrative',
            detail: 'Drafts a forward-looking Alaris recovery narrative with revenue and EPS uplift range, execution dependencies clearly flagged, and three scenario summaries suitable for investor day framing.',
            output: '"BD Alaris market return represents $0.16–$0.43 Adj. EPS upside in FY26–FY27. Base case assumes 150 placements/quarter and 22% US market share recapture by FY27. Execution milestones: FDA formal consent decree resolution, manufacturing capacity ramp, and hospital procurement cycle timing."',
        },
        {
            time: '11:05:26',
            agent: 'The Team Lead',
            agentColor: '#1c519c',
            agentBg: '#F0F0F0',
            icon: Sparkles,
            action: 'Assembles and publishes',
            detail: 'Publishes Alaris scenario to Scenario Modeling dashboard, updates EPM bridge walk with Connected Care upside, queues narrative for Executive Summary and investor day deck.',
            output: null,
        },
        {
            time: '11:05:28',
            agent: 'Alert fires',
            agentColor: '#B45309',
            agentBg: '#FFFBEB',
            icon: Zap,
            action: 'Jennifer receives the notification',
            detail: '"Alaris market return scenario analysis complete — 3 execution risk flags raised. Narrative investor-day ready. Dashboards updated." Total elapsed: 27 seconds.',
            output: null,
        },
        {
            time: '11:18 AM',
            agent: 'Jennifer Martinez, Senior Director FP&A',
            agentColor: '#374151',
            agentBg: '#F3F4F6',
            icon: Eye,
            action: 'Human review — 13 minutes',
            detail: 'Jennifer reviews model, consults with Connected Care commercial team to validate placement timeline assumptions, adjusts base scenario to 140 placements/quarter (more conservative), approves narrative for investor day packet.',
            output: 'Investor day narrative package ready by 11:30 AM.',
        },
    ],
    outcomes: [
        { icon: Clock, label: 'Agent work time', value: '27 seconds', sub: 'From request to published output', color: '#1c519c' },
        { icon: TrendingUp, label: 'EPS upside modeled', value: '$0.16–$0.43', sub: 'Base, upside, acceleration scenarios FY26-FY27', color: '#065F46' },
        { icon: CheckCircle, label: 'Investor day ready', value: '13 min post-review', sub: 'Narrative package complete', color: '#0070C0' },
    ],
    analysisSummary: {
        headline: 'Alaris Market Return — AI Briefing',
        generated: 'Generated 11:05:28 AM · 27-second agent run',
        sections: [
            {
                title: 'Request Overview',
                items: [
                    { label: 'Requested by', value: 'Jennifer Martinez, Sr. Director FP&A — Connected Care, 11:05 AM' },
                    { label: 'Trigger event', value: 'FDA inspection completed with no observations — consent decree resolution tracking 3-4 months ahead of schedule' },
                    { label: 'Scope', value: 'Connected Care revenue and BD adj. EPS uplift under 3 Alaris ramp scenarios (FY26-FY27)' },
                    { label: 'Sensitivity applied', value: 'Each Alaris placement ≈ $0.6M revenue + $1.2M 5-yr service; each $100M Connected Care revenue ≈ +$0.06 Adj. EPS' },
                ],
            },
            {
                title: 'Scenario Results',
                items: [
                    { label: 'Base (150 placements/Q)', value: 'FY26 Connected Care +$180M · Adj. EPS +$0.16' },
                    { label: 'Upside (200 placements/Q)', value: 'FY26 Connected Care +$280M · Adj. EPS +$0.25' },
                    { label: 'Acceleration (250/Q, 28% share)', value: 'FY27 Connected Care +$480M · Adj. EPS +$0.43' },
                    { label: 'Key execution dependencies', value: 'FDA formal consent decree lift · Hospital procurement cycle (6-9 months) · $120M CapEx commitment for upside' },
                ],
            },
        ],
    },
};

const allScenarios = { glp1: glp1Scenario, vobp: vobpScenario, alaris: alarisScenario } as const;
type ScenarioKey = keyof typeof allScenarios;

const guardrails = [
    {
        icon: BookOpen,
        title: 'Every value has a source',
        desc: 'Numbers on this platform are tagged [CITED], [DERIVED], [INTERPOLATED], or [ASSUMED]. Cited values trace to a filed SEC document. Assumed values are clearly marked.',
        color: '#1c519c',
    },
    {
        icon: Eye,
        title: 'Humans stay in the loop',
        desc: 'AI generates; finance professionals approve. Commentary can be edited, flagged, or overridden at any time. No AI output goes to a meeting without a human sign-off.',
        color: '#065F46',
    },
    {
        icon: Lock,
        title: 'Confidence thresholds',
        desc: 'The Watchdog only fires an alert when a metric crosses a statistically meaningful threshold, not a rounding error. Low-confidence results surface as "estimated" not "actual."',
        color: '#9F1239',
    },
    {
        icon: FileText,
        title: 'Full audit trail',
        desc: 'Every AI-generated output logs which agent produced it, when, from which source data version. Finance teams can replay and re-generate any analysis.',
        color: '#7C3AED',
    },
    {
        icon: Users,
        title: 'Peer review before publish',
        desc: 'High-impact outputs (executive briefings, board-ready slides) go through a two-step review: AI draft → finance review → approval — matching existing governance workflows.',
        color: '#B45309',
    },
    {
        icon: Zap,
        title: 'Scope-limited agents',
        desc: 'Each agent is constrained to its own domain. The Storyteller writes narratives but cannot edit source data. The Watchdog flags but cannot change thresholds without human approval.',
        color: '#0070C0',
    },
];

// ─── Component ───────────────────────────────────────────────────────────────

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AIOverviewPage() {
    const [activeScenario, setActiveScenario] = useState<ScenarioKey>('glp1');
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
    const scenario = allScenarios[activeScenario];

    const toggleStep = (i: number) =>
        setExpandedSteps(prev => {
            const next = new Set(prev);
            next.has(i) ? next.delete(i) : next.add(i);
            return next;
        });

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* ── Hero ── */}
            <div className="bg-gradient-to-br from-[#1c519c] to-[#1c519c] text-white">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <motion.div initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-[#009AC7]" />
                            <span className="text-sm font-medium text-[#009AC7] uppercase tracking-widest">AI &amp; Agentic Capabilities</span>
                        </div>
                        <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                            Meet the AI team<br />
                            <span className="text-[#009AC7]">working inside BD Finance360.</span>
                        </h1>
                        <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
                            Behind every insight card, alert, and narrative on this platform, a team of specialised AI agents is doing the heavy lifting — reading filings, crunching numbers, writing plain-English summaries, and flagging anomalies — so your finance team can focus on decisions, not data prep.
                        </p>
                    </motion.div>

                    {/* Quick-stat bar */}
                    <motion.div
                        initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5, delay: 0.15 }}
                        className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {[
                            { value: '6', label: 'Specialised agents' },
                            { value: '800+', label: 'AI-generated insights' },
                            { value: '25', label: 'Live anomaly monitors' },
                            { value: '100%', label: 'Source-cited outputs' },
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

                {/* ── Section 1: The Team ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#1c519c] uppercase tracking-widest mb-1">Section 1</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">The AI team — six roles, one goal.</h2>
                        <p className="text-gray-500 text-sm max-w-2xl mb-8">Think of these agents like specialist team members. Each has a defined job, clear boundaries, and reports back to the orchestrator who coordinates the whole effort.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {agents.map((a, i) => {
                            const Icon = a.icon;
                            return (
                                <motion.div
                                    key={a.id}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={fade} transition={{ duration: 0.35, delay: i * 0.06 }}
                                    className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: a.bg }}>
                                            <Icon className="w-5 h-5" style={{ color: a.color }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{a.name}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">{a.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{a.plain}</p>
                                    <div className="mt-auto pt-3 border-t border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Powers</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {a.handles.map(h => (
                                                <span key={h} className="text-[10px] font-medium px-2 py-0.5 rounded-full border" style={{ color: a.color, borderColor: a.bg, backgroundColor: a.bg }}>
                                                    {h}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── Section 2: How They Work Together ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#1c519c] uppercase tracking-widest mb-1">Section 2</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">How a request moves through the team.</h2>
                        <p className="text-gray-500 text-sm max-w-2xl mb-8">Every time you load a dashboard or ask a question, this six-step sequence runs in the background — in seconds.</p>
                    </motion.div>

                    <div className="relative">
                        {/* connecting line */}
                        <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#1c519c] to-[#7C3AED] hidden md:block" />

                        <div className="space-y-4">
                            {workflowSteps.map((step, i) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial="hidden" whileInView="show" viewport={{ once: true }}
                                        variants={fade} transition={{ duration: 0.35, delay: i * 0.08 }}
                                        className="flex items-start gap-5 bg-white rounded-2xl border border-gray-200 p-5 md:ml-0"
                                    >
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm" style={{ backgroundColor: step.color }}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-gray-400">STEP {i + 1}</span>
                                            </div>
                                            <p className="text-base font-bold text-gray-900">{step.label}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">{step.sub}</p>
                                        </div>
                                        {i < workflowSteps.length - 1 && (
                                            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-5 hidden md:block rotate-90" />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── Section 3: AI in the App ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#1c519c] uppercase tracking-widest mb-1">Section 3</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Where AI shows up — right now.</h2>
                        <p className="text-gray-500 text-sm max-w-2xl mb-8">Every highlighted feature below is live and powered by the agent team. Click any card to go directly to that part of the app.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {appSpotlights.map((spot, i) => {
                            const Icon = spot.icon;
                            return (
                                <motion.a
                                    key={spot.page}
                                    href={spot.href}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={fade} transition={{ duration: 0.35, delay: i * 0.08 }}
                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group block"
                                >
                                    {/* page header mock */}
                                    <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: spot.bg }}>
                                        <div className="flex items-center gap-2.5">
                                            <Icon className="w-5 h-5" style={{ color: spot.color }} />
                                            <span className="text-sm font-bold" style={{ color: spot.color }}>{spot.page}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: spot.color }}>
                                            <span>Open page</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>

                                    {/* mock content strip */}
                                    <div className="px-5 py-1 bg-gray-50 border-b border-gray-100 flex gap-1.5">
                                        {[60, 80, 55, 90].map((w, j) => (
                                            <div key={j} className="h-1.5 rounded-full bg-gray-200" style={{ width: `${w}px` }} />
                                        ))}
                                    </div>

                                    {/* AI feature list */}
                                    <div className="p-5 space-y-3">
                                        {spot.aiFeatures.map(f => (
                                            <div key={f.label} className="flex items-start gap-3">
                                                <div className="mt-0.5 shrink-0">
                                                    <CheckCircle className="w-4 h-4" style={{ color: spot.color }} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                                                    <p className="text-xs text-gray-500 leading-snug">{f.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI badge */}
                                    <div className="px-5 pb-4">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: spot.bg, color: spot.color }}>
                                            <Sparkles className="w-3 h-3" /> AI-powered
                                        </span>
                                    </div>
                                </motion.a>
                            );
                        })}
                    </div>
                </section>

                {/* ── Section 4: Day in the Life ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#1c519c] uppercase tracking-widest mb-1">Section 4 — AI in Action</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">A day in the life.</h2>
                        <p className="text-gray-500 text-sm max-w-2xl mb-6">
                            Follow a real request through the agent pipeline — from the first message to an executive-ready briefing. Choose a scenario to see how the team handles it.
                        </p>
                    </motion.div>

                    {/* ── Scenario Selector ── */}
                    <motion.div
                        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.35 }}
                        className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                        {(Object.values(allScenarios) as typeof glp1Scenario[]).map(s => {
                            const TriggerIcon = s.triggerIcon;
                            const isActive = activeScenario === s.id;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => { setActiveScenario(s.id as ScenarioKey); setShowSummaryModal(false); setExpandedSteps(new Set()); }}
                                    className={`text-left rounded-2xl border-2 p-4 transition-all ${
                                        isActive
                                            ? 'border-[#1c519c] bg-[#F0F0F0] shadow-sm'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                            style={{ backgroundColor: isActive ? `${s.triggerIconColor}20` : '#F3F4F6' }}
                                        >
                                            <TriggerIcon className="w-4 h-4" style={{ color: isActive ? s.triggerIconColor : '#9CA3AF' }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className={`text-sm font-bold truncate ${isActive ? 'text-[#1c519c]' : 'text-gray-700'}`}>
                                                    {s.label}
                                                </p>
                                                {isActive && (
                                                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1c519c] text-white">
                                                        Viewing
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 leading-snug">{s.tagline}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </motion.div>

                    {/* Trigger card */}
                    <motion.div
                        key={`trigger-${activeScenario}`}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                        className="mb-6 bg-gradient-to-r from-[#1c519c] to-[#1c519c] rounded-2xl p-6 text-white"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                                <MousePointerClick className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Human trigger</span>
                                    <span className="text-xs font-mono text-white/40">{scenario.trigger.time}</span>
                                    <span className="text-xs font-medium text-[#009AC7]">{scenario.trigger.who}</span>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                                    <p className="text-sm text-white/90 leading-relaxed italic">{scenario.trigger.message}</p>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    {(() => { const TI = scenario.triggerIcon; return <TI className="w-3.5 h-3.5 text-amber-400" />; })()}
                                    <span className="text-xs text-amber-300 font-medium">Scenario: {scenario.scenario}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Timeline steps */}
                    <motion.div
                        key={`steps-${activeScenario}`}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.05 }}
                    >
                        <div className="relative">
                            <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#1c519c] via-[#7C3AED] to-[#065F46]" />
                            <div className="space-y-2">
                                {scenario.steps.map((step, i) => {
                                    const Icon = step.icon;
                                    const isHuman = step.agent.includes('Sarah') || step.agent.includes('Marcus') || step.agent.includes('Priya') || step.agent.includes('Jordan') || step.agent === 'Finance Owners' || step.agent === 'Dashboards update' || step.agent === 'Alert fires';
                                    const isExpanded = expandedSteps.has(i);
                                    const hasOutput = !!step.output;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial="hidden" whileInView="show" viewport={{ once: true }}
                                            variants={fade} transition={{ duration: 0.3, delay: i * 0.04 }}
                                            className="flex gap-4"
                                        >
                                            {/* timeline dot */}
                                            <div className="w-16 shrink-0 flex flex-col items-center pt-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white z-10 shrink-0" style={{ backgroundColor: step.agentColor }}>
                                                    <Icon className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            </div>

                                            {/* accordion card */}
                                            <div className={`flex-1 mb-1 rounded-2xl border overflow-hidden transition-shadow ${isExpanded ? 'shadow-sm' : ''} ${isHuman ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
                                                {/* header row — always visible, clickable */}
                                                <button
                                                    onClick={() => toggleStep(i)}
                                                    className={`w-full flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left transition-colors ${isHuman ? 'hover:bg-gray-100/70' : 'hover:bg-gray-50'}`}
                                                >
                                                    <span className="text-[10px] font-mono text-gray-400 shrink-0">{step.time}</span>
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: step.agentBg, color: step.agentColor }}>
                                                        {step.agent}
                                                    </span>
                                                    <span className="text-xs font-semibold text-gray-700 flex-1 min-w-0">{step.action}</span>
                                                    <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                                        {hasOutput && !isExpanded && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Has output" />
                                                        )}
                                                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </button>

                                                {/* expandable body */}
                                                <AnimatePresence initial={false}>
                                                    {isExpanded && (
                                                        <motion.div
                                                            key="body"
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className={`px-4 pb-4 border-t ${isHuman ? 'border-gray-200' : 'border-gray-100'}`}>
                                                                <p className="text-sm text-gray-600 leading-relaxed pt-3">{step.detail}</p>
                                                                {step.output && (
                                                                    <div className="mt-3 bg-gray-900 rounded-lg px-3 py-2">
                                                                        <p className="text-[11px] font-mono text-emerald-400 whitespace-pre-line leading-relaxed">{step.output}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Outcome summary */}
                    <motion.div
                        key={`outcomes-${activeScenario}`}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
                        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {scenario.outcomes.map(s => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}15` }}>
                                        <Icon className="w-5 h-5" style={{ color: s.color }} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{s.label}</p>
                                        <p className="text-sm font-bold text-gray-900">{s.value}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Analysis Summary button — shown for all scenarios */}
                    <motion.div
                        key={`summary-btn-${activeScenario}`}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.2 }}
                        className="mt-5 flex justify-center"
                    >
                        <button
                            onClick={() => setShowSummaryModal(true)}
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#1c519c] text-white text-sm font-semibold shadow-md hover:bg-[#1c519c] transition-all"
                        >
                            <FileText className="w-4 h-4" />
                            View AI Analysis Brief
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </section>

                {/* ── Analysis Summary Modal ── */}
                {showSummaryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowSummaryModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal header */}
                            <div className="sticky top-0 bg-gradient-to-r from-[#1c519c] to-[#1c519c] text-white rounded-t-2xl px-6 py-5 flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="w-4 h-4 text-[#009AC7]" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#009AC7]">AI Analysis Brief</span>
                                    </div>
                                    <h3 className="text-base font-bold leading-snug">{scenario.analysisSummary.headline}</h3>
                                    <p className="text-xs text-white/50 mt-0.5">{scenario.analysisSummary.generated}</p>
                                </div>
                                <button onClick={() => setShowSummaryModal(false)} className="ml-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0">
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="p-6 space-y-5">
                                {scenario.analysisSummary.sections.map((section, si) => (
                                    <div key={si}>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{section.title}</h4>
                                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                                            {section.items.map((item, ii) => (
                                                <div key={ii} className={`flex items-start gap-3 px-4 py-3 ${ii < section.items.length - 1 ? 'border-b border-gray-100' : ''} ${ii % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}>
                                                    <span className="text-xs font-semibold text-gray-500 w-44 shrink-0 pt-0.5">{item.label}</span>
                                                    <span className="text-sm text-gray-800 leading-snug">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-100">
                                    All values tagged [CITED], [DERIVED], or [ASSUMED]. {scenario.analysisSummary.generated}. Generated by the BD Finance360 agentic team.
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ── Section 5: Guardrails ── */}
                <section>
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}>
                        <p className="text-xs font-bold text-[#1c519c] uppercase tracking-widest mb-1">Section 5</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Six guardrails keeping the data honest.</h2>
                        <p className="text-gray-500 text-sm max-w-2xl mb-8">AI moves fast. These controls make sure it moves accurately — and that your finance team stays in charge.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {guardrails.map((g, i) => {
                            const Icon = g.icon;
                            return (
                                <motion.div
                                    key={g.title}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={fade} transition={{ duration: 0.35, delay: i * 0.06 }}
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

                {/* ── Closing CTA ── */}
                <motion.section
                    initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-[#1c519c] to-[#1c519c] rounded-3xl p-10 text-white text-center"
                >
                    <Sparkles className="w-8 h-8 text-[#009AC7] mx-auto mb-4" />
                    <h3 className="text-2xl font-extrabold mb-3">The agents work. You decide.</h3>
                    <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed mb-8">
                        Every AI output in Finance360 is a starting point, not a final answer. The system surfaces what matters; your finance team determines what it means and what to do about it.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { label: 'Executive Summary', href: '/executive-summary' },
                            { label: 'Commentary', href: '/commentary' },
                            { label: 'AI Alerts', href: '/ai-alerts' },
                            { label: 'AI Search', href: '/ai-search' },
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
