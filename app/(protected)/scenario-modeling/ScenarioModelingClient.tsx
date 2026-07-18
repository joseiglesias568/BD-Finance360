'use client';

import type { ScenarioConfig } from '@/config/types';
import { formatNumber as sharedFormatNumber } from '@/lib/engines';
import type { FrontierPoint, LeverMarginalOi } from '@/lib/scenario/allocation-frontier';
import type { MonteCarloResults, PLImpactResult } from '@/lib/scenario-engine';
import {
    buildPlValuesFromSignalPreset,
    findExternalSignalById,
} from '@/lib/scenario/external-competitive-signals';
import {
    glp1DemandTab as strategyInvestmentTab,
    chinaVoBPTab as realEstatePortfolioTab,
    alarisRampTab as globalMarketsTab,
    fxInterestTab as digitalPlatformTab,
} from '@/config/clients/bd/scenario-tabs';
import type { ScenarioTabConfig } from '@/config/clients/bd/scenario-tabs';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    Building2,
    ChevronDown,
    ChevronRight,
    DollarSign,
    GitBranch,
    Globe,
    Lightbulb,
    Loader,
    Play,
    Radar,
    RefreshCw,
    Rocket,
    Save,
    Send,
    Shield,
    Sliders,
    Smartphone,
    Sparkles,
    Target,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { parseScenarioFromText } from './scenario-parser';
import StrategyInvestmentTab from './tabs/StrategyInvestmentTab';
import RealEstatePortfolioTab from './tabs/StorePortfolioTab';
import GlobalMarketsTab from './tabs/ChinaInternationalTab';
import DigitalPlatformTab from './tabs/DigitalRewardsTab';
import ExternalSignalsPlStrip from './ExternalSignalsPlStrip';
import IndustryNewsTicker from './IndustryNewsTicker';
import ScenarioRiskFrontierCard from './ScenarioRiskFrontierCard';
import DriverAnalyticsTab from './tabs/DriverAnalyticsTab';
import ExternalSignalsTab from './tabs/ExternalSignalsTab';

interface Lever {
    id: string;
    name: string;
    category: string;
    currentValue: number;
    minValue: number;
    maxValue: number;
    unit: string;
    step: number;
    impact: 'high' | 'medium' | 'low';
}

interface ScenarioModelingClientProps {
    scenarioConfig: ScenarioConfig;
}

type AnalysisTab =
    | 'pl-impact'
    | 'strategy-investment'
    | 'real-estate-portfolio'
    | 'global-markets'
    | 'digital-platform'
    | 'external-signals'
    | 'driver-analytics';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ScenarioSummary {
    executiveSummary: string;
    keyInsights: string[];
    risks: string[];
    strategicImplication: string;
    confidenceLevel: 'high' | 'moderate' | 'low';
    confidenceRationale: string;
}

// Alias shared formatting engine
const formatNumber = sharedFormatNumber;

// Tab-specific configs
const TAB_CONFIGS: Record<
    Exclude<AnalysisTab, 'pl-impact' | 'external-signals' | 'driver-analytics'>,
    ScenarioTabConfig
> = {
    'strategy-investment': strategyInvestmentTab,
    'real-estate-portfolio': realEstatePortfolioTab,
    'global-markets': globalMarketsTab,
    'digital-platform': digitalPlatformTab,
};

// Tab-specific placeholder text for the scenario input
const TAB_PLACEHOLDERS: Record<AnalysisTab, string> = {
    'pl-impact': 'e.g., What if HCB MBR improves to 89.5% in H2 2026 and GLP-1 employer coverage drops to 40%?',
    'strategy-investment': 'e.g., What if MA margin recovery reaches 2.5% by 2027 and Stelara biosimilar conversion hits 90%?',
    'real-estate-portfolio': 'e.g., What if same-store Rx growth accelerates to 9% on Walgreens share gains and reimbursement holds flat?',
    'global-markets': 'e.g., What if pharmacy client price improvement headwind narrows to $600M and claims volume grows to 1.9B?',
    'digital-platform': 'e.g., What if Health100 reaches 15% member adoption and Oak Street integration accelerates value-based care savings?',
    'external-signals':
        'Tip: use other tabs to move levers — this view is read-only external/competitive context.',
    'driver-analytics':
        'Explore the CFO driver cascade, correlations, and lead/lag framing — quantitative sliders stay on P&L Impact.',
};

export default function ScenarioModelingClient({ scenarioConfig }: ScenarioModelingClientProps) {
    // Map DB levers to component Lever interface (for P&L Impact tab)
    const plLevers: Lever[] = useMemo(() =>
        scenarioConfig.levers.map(l => ({
            id: l.id,
            name: l.name,
            category: l.category,
            currentValue: l.default,
            minValue: l.min,
            maxValue: l.max,
            unit: l.unit,
            step: l.step,
            impact: (l.category.includes('Revenue') ? 'high' : l.category.includes('Digital') ? 'low' : 'medium') as Lever['impact'],
        })),
        [scenarioConfig.levers]
    );

    const [activeTab, setActiveTab] = useState<AnalysisTab>('pl-impact');

    // P&L Impact lever state
    const [plLeverValues, setPlLeverValues] = useState<Record<string, number>>(
        plLevers.reduce((acc, lever) => ({ ...acc, [lever.id]: lever.currentValue }), {})
    );

    // Tab-specific lever states
    const [tabLeverValues, setTabLeverValues] = useState<Record<string, Record<string, number>>>(() => {
        const initial: Record<string, Record<string, number>> = {};
        Object.entries(TAB_CONFIGS).forEach(([tabId, config]) => {
            initial[tabId] = config.levers.reduce(
                (acc, lever) => ({ ...acc, [lever.id]: lever.default }),
                {} as Record<string, number>
            );
        });
        return initial;
    });

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isProcessingChat, setIsProcessingChat] = useState(false);
    const [showChatDetails, setShowChatDetails] = useState(false);

    // AI Scenario Summary state
    const [scenarioSummary, setScenarioSummary] = useState<ScenarioSummary | null>(null);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [showSummaryDetails, setShowSummaryDetails] = useState(false);

    // P&L impact state — fetched from /api/scenario
    const [impact, setImpact] = useState<PLImpactResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [impactError, setImpactError] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [riskAnalytics, setRiskAnalytics] = useState<{
        simulation: MonteCarloResults | null;
        marginal: LeverMarginalOi[] | null;
        scatter: FrontierPoint[] | null;
    }>({ simulation: null, marginal: null, scatter: null });
    const [riskLoading, setRiskLoading] = useState(false);

    const [pendingExternalSignalModalId, setPendingExternalSignalModalId] = useState<string | null>(null);

    const runRiskAnalytics = useCallback(async () => {
        setRiskLoading(true);
        try {
            const res = await fetch('/api/scenario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leverValues: plLeverValues, mode: 'analytics' }),
            });
            if (!res.ok) return;
            const data = await res.json();
            setRiskAnalytics({
                simulation: data.simulation ?? null,
                marginal: data.frontier?.marginal ?? null,
                scatter: data.frontier?.scatter ?? null,
            });
        } catch {
            // non-blocking
        } finally {
            setRiskLoading(false);
        }
    }, [plLeverValues]);

    const handleSyncExternalSignalPreset = useCallback(
        (signalId: string) => {
            const sig = findExternalSignalById(signalId);
            if (!sig) return;
            const bounds = plLevers.map((l) => ({ id: l.id, min: l.minValue, max: l.maxValue }));
            const baseline = plLevers.reduce(
                (acc, l) => ({ ...acc, [l.id]: l.currentValue }),
                {} as Record<string, number>,
            );
            setPlLeverValues(buildPlValuesFromSignalPreset(baseline, sig.plLeverPreset, bounds));
            setActiveTab('pl-impact');
        },
        [plLevers],
    );

    const handleDeepDiveExternalSignal = useCallback((signalId: string) => {
        setPendingExternalSignalModalId(signalId);
        setActiveTab('external-signals');
    }, []);

    const handlePendingExternalSignalOpened = useCallback(() => {
        setPendingExternalSignalModalId(null);
    }, []);

    // Fetch P&L impact from server whenever lever values change (debounced 300ms)
    const fetchImpact = useCallback(async (values: Record<string, number>) => {
        setIsCalculating(true);
        setImpactError(null);
        try {
            const res = await fetch('/api/scenario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leverValues: values, mode: 'impact' }),
            });
            if (res.ok) {
                const data = await res.json();
                setImpact(data.impact as PLImpactResult);
            } else {
                const body = await res.json().catch(() => ({}));
                setImpactError((body as { error?: string }).error ?? `Server error ${res.status}`);
            }
        } catch {
            setImpactError('Network error — unable to reach server');
        } finally {
            setIsCalculating(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab !== 'pl-impact') return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchImpact(plLeverValues);
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [plLeverValues, fetchImpact, activeTab]);

    // Initial fetch
    useEffect(() => {
        fetchImpact(plLeverValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep P&L lever map aligned with scenario config (e.g. after client navigation / prop refresh).
    useEffect(() => {
        setPlLeverValues((prev) => {
            const next: Record<string, number> = {};
            let changed = false;
            for (const l of plLevers) {
                const raw = prev[l.id];
                const clamped =
                    typeof raw === 'number' && !Number.isNaN(raw)
                        ? Math.max(l.minValue, Math.min(l.maxValue, raw))
                        : l.currentValue;
                next[l.id] = clamped;
                if (!(l.id in prev) || prev[l.id] !== clamped) {
                    changed = true;
                }
            }
            if (!changed && Object.keys(prev).length === plLevers.length) {
                return prev;
            }
            return next;
        });
    }, [plLevers]);

    // ─── Lever Changes ───────────────────────────────────────────────────────
    const handlePlLeverChange = (leverId: string, value: number) => {
        if (!Number.isFinite(value)) return;
        setPlLeverValues(prev => ({ ...prev, [leverId]: value }));
    };

    const handleTabLeverChange = (leverId: string, value: number) => {
        if (!Number.isFinite(value)) return;
        setTabLeverValues(prev => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], [leverId]: value },
        }));
    };

    // ─── AI Scenario Summary ──────────────────────────────────────────────────
    const fetchScenarioSummary = async (
        scenario: string,
        tabId: string,
        tabLabel: string,
        leverAdjustments: Record<string, number | undefined>,
        leverContext: { id: string; name: string; unit: string; default: number }[],
    ) => {
        setIsLoadingSummary(true);
        setScenarioSummary(null);
        try {
            // Build calculated impact context for P&L tab
            let calculatedImpact: Record<string, string> | undefined;
            if (tabId === 'pl-impact' && impact) {
                calculatedImpact = {
                    'Revenue Impact': `$${impact.revenue >= 0 ? '+' : ''}${impact.revenue.toFixed(0)}M`,
                    'Operating Income': `$${impact.operatingIncome >= 0 ? '+' : ''}${impact.operatingIncome.toFixed(0)}M`,
                    'Net Income': `$${impact.netIncome >= 0 ? '+' : ''}${impact.netIncome.toFixed(0)}M`,
                    'Operating Margin': `${impact.operatingMargin.toFixed(1)}%`,
                };
            }

            const res = await fetch('/api/scenario-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario,
                    tabId,
                    tabLabel,
                    leverAdjustments,
                    leverContext,
                    calculatedImpact,
                }),
            });

            if (res.ok) {
                const summary = await res.json();
                setScenarioSummary(summary);
            }
        } catch {
            // Silently fail — summary is a nice-to-have
        } finally {
            setIsLoadingSummary(false);
        }
    };

    // ─── Chat / AI Scenario Parsing ─────────────────────────────────────────
    const handleChatSubmit = async () => {
        if (!chatInput.trim() || isProcessingChat) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: chatInput,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        const inputText = chatInput;
        setChatInput('');
        setIsProcessingChat(true);

        try {
            if (activeTab === 'external-signals') {
                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content:
                        'This tab is a structured read-out of external and competitive signals from the industry analysis corpus. Open any card for SWOT-style detail and illustrative impact bands. To translate narratives into quantified levers, switch to P&L Impact or another modeling tab — natural-language lever parsing runs there.',
                    timestamp: new Date(),
                };
                setChatMessages((prev) => [...prev, assistantMessage]);
                return;
            }

            if (activeTab === 'driver-analytics') {
                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content:
                        'Driver Analytics is a read-only CFO cascade with correlation priors and lead/lag framing. Move scenario levers on **P&L Impact** (or fleet/network/digital tabs); natural-language parsing applies there.',
                    timestamp: new Date(),
                };
                setChatMessages((prev) => [...prev, assistantMessage]);
                return;
            }

            // Determine which levers to send based on active tab
            let leverSpecs: { id: string; name: string; description: string; min: number; max: number; default: number; step: number; unit: string; category: string }[];
            let tabLabel: string;
            let tabDescription: string;

            if (activeTab === 'pl-impact') {
                leverSpecs = plLevers.map(l => ({
                    id: l.id,
                    name: l.name,
                    description: l.category,
                    min: l.minValue,
                    max: l.maxValue,
                    default: l.currentValue,
                    step: l.step,
                    unit: l.unit,
                    category: l.category,
                }));
                tabLabel = 'P&L Impact';
                tabDescription = 'Full P&L flow-through impact modeling across revenue, COGS, and operating expenses';
            } else {
                const tabConfig = TAB_CONFIGS[activeTab];
                leverSpecs = tabConfig.levers.map(l => ({
                    id: l.id,
                    name: l.name,
                    description: l.description,
                    min: l.min,
                    max: l.max,
                    default: l.default,
                    step: l.step,
                    unit: l.unit,
                    category: l.category,
                }));
                tabLabel = tabConfig.label;
                tabDescription = tabConfig.description;
            }

            const res = await fetch('/api/scenario-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario: inputText,
                    tabId: activeTab,
                    tabLabel,
                    tabDescription,
                    levers: leverSpecs,
                }),
            });

            if (!res.ok) {
                throw new Error('AI scenario parsing failed');
            }

            const { explanation, leverAdjustments } = await res.json();

            // Apply lever adjustments
            if (activeTab === 'pl-impact') {
                const newLeverValues: Record<string, number> = { ...plLeverValues };
                Object.entries(leverAdjustments).forEach(([leverId, value]) => {
                    if (value != null) {
                        const lever = plLevers.find(l => l.id === leverId);
                        if (lever) {
                            newLeverValues[leverId] = Math.max(
                                lever.minValue,
                                Math.min(lever.maxValue, value as number)
                            );
                        }
                    }
                });
                setPlLeverValues(newLeverValues);
            } else {
                const tabConfig = TAB_CONFIGS[activeTab];
                setTabLeverValues(prev => {
                    const currentTabValues = { ...prev[activeTab] };
                    Object.entries(leverAdjustments).forEach(([leverId, value]) => {
                        if (value != null) {
                            const lever = tabConfig.levers.find(l => l.id === leverId);
                            if (lever) {
                                currentTabValues[leverId] = Math.max(
                                    lever.min,
                                    Math.min(lever.max, value as number)
                                );
                            }
                        }
                    });
                    return { ...prev, [activeTab]: currentTabValues };
                });
            }

            // Build the assistant message showing what was adjusted
            const adjustedLevers = Object.entries(leverAdjustments).filter(([, v]) => v != null);
            const leverList = adjustedLevers.map(([id, value]) => {
                const allLevers = activeTab === 'pl-impact'
                    ? plLevers
                    : TAB_CONFIGS[activeTab].levers.map(l => ({ id: l.id, name: l.name, unit: l.unit }));
                const lever = allLevers.find(l => l.id === id);
                return `* ${lever?.name ?? id}: ${value}${lever?.unit ?? ''}`;
            }).join('\n');

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `${explanation}\n\nI've adjusted the following levers:\n${leverList}`,
                timestamp: new Date()
            };

            setChatMessages(prev => [...prev, assistantMessage]);

            // Fire AI summary generation (non-blocking)
            const leverCtx = activeTab === 'pl-impact'
                ? plLevers.map(l => ({ id: l.id, name: l.name, unit: l.unit, default: l.currentValue }))
                : TAB_CONFIGS[activeTab].levers.map(l => ({ id: l.id, name: l.name, unit: l.unit, default: l.default }));
            fetchScenarioSummary(inputText, activeTab, tabs.find(t => t.id === activeTab)?.label ?? '', leverAdjustments, leverCtx);
        } catch {
            // Fallback: use local parser for P&L tab
            if (activeTab === 'pl-impact') {
                const { levers, explanation } = parseScenarioFromText(inputText);
                const newLeverValues: Record<string, number> = { ...plLeverValues };
                Object.keys(levers).forEach(leverId => {
                    const lever = plLevers.find(l => l.id === leverId);
                    if (lever) {
                        newLeverValues[leverId] = Math.max(
                            lever.minValue,
                            Math.min(lever.maxValue, levers[leverId])
                        );
                    }
                });
                setPlLeverValues(newLeverValues);

                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `${explanation}\n\nI've adjusted the following levers:\n${Object.entries(levers).map(([id, value]) => {
                        const lever = plLevers.find(l => l.id === id);
                        const unit = lever?.unit ?? '';
                        const sign = value >= 0 ? '+' : '';
                        const formatted = unit === '$M' ? `$${value.toFixed(0)}M`
                            : unit === '$B' ? `$${value.toFixed(0)}B`
                            : unit === 'bps' ? `${sign}${value.toFixed(0)}bps`
                            : `${sign}${value.toFixed(1)}${unit}`;
                        return `* ${lever?.name}: ${formatted}`;
                    }).join('\n')}`,
                    timestamp: new Date()
                };
                setChatMessages(prev => [...prev, assistantMessage]);
            } else {
                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Sorry, I was unable to process that scenario. Please try rephrasing or adjust the levers manually.',
                    timestamp: new Date()
                };
                setChatMessages(prev => [...prev, assistantMessage]);
            }
        } finally {
            setIsProcessingChat(false);
        }
    };

    // ─── Reset ───────────────────────────────────────────────────────────────
    const handleReset = () => {
        if (activeTab === 'pl-impact') {
            setPlLeverValues(plLevers.reduce((acc, lever) => ({ ...acc, [lever.id]: lever.currentValue }), {}));
        } else if (activeTab !== 'external-signals' && activeTab !== 'driver-analytics') {
            const tabConfig = TAB_CONFIGS[activeTab];
            setTabLeverValues(prev => ({
                ...prev,
                [activeTab]: tabConfig.levers.reduce(
                    (acc, lever) => ({ ...acc, [lever.id]: lever.default }),
                    {} as Record<string, number>
                ),
            }));
        }
        setScenarioSummary(null);
        setShowSummaryDetails(false);
        setChatMessages([]);
    };

    // ─── Current Tab Data ────────────────────────────────────────────────────
    const currentLevers =
        activeTab === 'pl-impact'
            ? plLevers
            : activeTab === 'external-signals' || activeTab === 'driver-analytics'
              ? []
              : TAB_CONFIGS[activeTab].levers.map((l) => ({
                    id: l.id,
                    name: l.name,
                    category: l.category,
                    currentValue: l.default,
                    minValue: l.min,
                    maxValue: l.max,
                    unit: l.unit,
                    step: l.step,
                    impact: l.impact,
                }));

    const currentLeverValues =
        activeTab === 'pl-impact'
            ? plLeverValues
            : activeTab === 'external-signals' || activeTab === 'driver-analytics'
              ? {}
              : (tabLeverValues[activeTab] ?? {});

    const handleCurrentLeverChange =
        activeTab === 'pl-impact'
            ? handlePlLeverChange
            : activeTab === 'external-signals' || activeTab === 'driver-analytics'
              ? () => {}
              : handleTabLeverChange;

    // ─── Tab Config ──────────────────────────────────────────────────────────
    const tabs: { id: AnalysisTab; label: string; icon: LucideIcon }[] = [
        { id: 'pl-impact', label: 'P&L Impact', icon: DollarSign },
        { id: 'strategy-investment', label: 'Strategic Investment', icon: Rocket },
        { id: 'real-estate-portfolio', label: 'Strategic Analysis', icon: Building2 },
        { id: 'global-markets', label: 'Global Markets', icon: Globe },
        { id: 'digital-platform', label: 'Digital Platform', icon: Smartphone },
        { id: 'external-signals', label: 'External / Competitive Signals', icon: Radar },
        { id: 'driver-analytics', label: 'Driver Analytics', icon: GitBranch },
    ];

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-[#003B2C] rounded-xl shadow-lg">
                                <Sliders className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Scenario Modeling</h1>
                                <p className="text-gray-600">What-if analysis with P&L impact</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Reset</span>
                            </button>
                            <button className="px-4 py-2 bg-[#003B2C] text-white font-semibold rounded-lg hover:bg-[#003B2C] transition-all flex items-center space-x-2">
                                <Save className="w-4 h-4" />
                                <span>Save</span>
                            </button>
                            <button className="px-6 py-2 bg-[#003B2C] text-white font-semibold rounded-lg hover:bg-[#003B2C] transition-all flex items-center space-x-2">
                                <Play className="w-4 h-4" />
                                <span>Run Scenario</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-6 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-2 border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-[#003B2C] text-[#003B2C] font-semibold'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scenario chat — hidden on External / Competitive Signals (industry wire ticker instead) */}
            {activeTab === 'external-signals' ? (
                <IndustryNewsTicker />
            ) : (
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-3">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Describe the scenario:</label>
                            <div className="flex-1 flex items-center space-x-2">
                                {chatMessages.length > 0 && (
                                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                                        <span className="text-gray-600">Applied:</span>
                                        <span className="font-medium text-gray-900 truncate max-w-[300px]">
                                            {chatMessages[chatMessages.length - 1]?.role === 'assistant'
                                                ? chatMessages[chatMessages.length - 1].content.split('\n')[0]
                                                : 'Processing...'}
                                        </span>
                                        <button
                                            onClick={() => setShowChatDetails(!showChatDetails)}
                                            className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                                            title={showChatDetails ? "Hide details" : "Show details"}
                                        >
                                            <ChevronRight className={`w-4 h-4 transition-transform ${showChatDetails ? 'rotate-90' : ''}`} />
                                        </button>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                                    placeholder={TAB_PLACEHOLDERS[activeTab]}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003B2C] focus:border-transparent"
                                    disabled={isProcessingChat}
                                />
                                <button
                                    onClick={handleChatSubmit}
                                    disabled={!chatInput.trim() || isProcessingChat}
                                    className="px-4 py-2 bg-[#003B2C] text-white font-semibold rounded-lg hover:bg-[#003B2C] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {isProcessingChat ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {showChatDetails && chatMessages.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 pt-3 border-t border-gray-200"
                            >
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {chatMessages.map((message) => (
                                        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-lg p-2 text-sm ${
                                                message.role === 'user'
                                                    ? 'bg-[#003B2C] text-white'
                                                    : 'bg-gray-50 border border-gray-200'
                                            }`}>
                                                <p className="whitespace-pre-wrap">{message.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'driver-analytics' && (
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Driver analytics context</h3>
                        <div className="space-y-4 text-sm text-gray-600">
                            <p>
                                This tab mirrors the BD CFO driver cascade: medical economics &amp; MBR management,
                                pharmacy volume &amp; specialty growth, operating efficiency &amp; Health100 savings, and
                                balance-sheet deleveraging — aligned to the scenario lever taxonomy on{' '}
                                <span className="font-medium text-gray-800">P&amp;L Impact</span>.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    Expand branches below and select a driver leaf for correlation, collinearity bands,
                                    quarterly trends, and lead/lag framing.
                                </li>
                                <li>
                                    Correlation priors are illustrative until empirical series feed this panel.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'pl-impact' && (
                <ExternalSignalsPlStrip
                    onDeepDiveSignal={handleDeepDiveExternalSignal}
                    onSyncPreset={handleSyncExternalSignalPreset}
                    onOpenExternalTab={() => setActiveTab('external-signals')}
                />
            )}


            {/* AI Scenario Analysis Card */}
            <AnimatePresence>
                {(isLoadingSummary || scenarioSummary) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto px-6 pt-6"
                    >
                        <div className="bg-gradient-to-br from-[#003B2C] to-[#003B2C] rounded-xl p-6 shadow-lg text-white">
                            {isLoadingSummary ? (
                                <div className="flex items-center space-x-3 py-4">
                                    <div className="relative">
                                        <Sparkles className="w-5 h-5 text-[#F0F0F0] animate-pulse" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                                        <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
                                    </div>
                                </div>
                            ) : scenarioSummary && (
                                <div className="space-y-3">
                                    {/* Header row - always visible */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Sparkles className="w-5 h-5 text-[#F0F0F0]" />
                                            <h3 className="text-base font-semibold">AI Scenario Analysis</h3>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                scenarioSummary.confidenceLevel === 'high'
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : scenarioSummary.confidenceLevel === 'moderate'
                                                    ? 'bg-amber-500/20 text-amber-300'
                                                    : 'bg-red-500/20 text-red-300'
                                            }`}>
                                                <Shield className="w-3 h-3" />
                                                <span>{scenarioSummary.confidenceLevel} confidence</span>
                                            </div>
                                            <button
                                                onClick={() => setShowSummaryDetails(!showSummaryDetails)}
                                                className="p-1 rounded-md hover:bg-white/10 transition-colors"
                                                title={showSummaryDetails ? 'Collapse details' : 'Expand details'}
                                            >
                                                <motion.div
                                                    animate={{ rotate: showSummaryDetails ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown className="w-4 h-4 text-gray-300" />
                                                </motion.div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Executive Summary - always visible */}
                                    <p className="text-sm text-gray-200 leading-relaxed">
                                        {scenarioSummary.executiveSummary}
                                    </p>

                                    {/* Collapsible details */}
                                    <AnimatePresence initial={false}>
                                        {showSummaryDetails && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-4 pt-1">
                                                    {/* Grid: Insights + Risks */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {/* Key Insights */}
                                                        <div className="bg-white/5 rounded-lg p-4">
                                                            <div className="flex items-center space-x-1.5 mb-2">
                                                                <Lightbulb className="w-3.5 h-3.5 text-[#F0F0F0]" />
                                                                <h4 className="text-xs font-semibold text-[#F0F0F0] uppercase tracking-wide">Key Insights</h4>
                                                            </div>
                                                            <ul className="space-y-1.5">
                                                                {scenarioSummary.keyInsights.map((insight, idx) => (
                                                                    <li key={idx} className="text-xs text-gray-300 flex items-start space-x-2">
                                                                        <span className="text-[#F0F0F0] mt-0.5 shrink-0">+</span>
                                                                        <span>{insight}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Risks */}
                                                        <div className="bg-white/5 rounded-lg p-4">
                                                            <div className="flex items-center space-x-1.5 mb-2">
                                                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                                                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Risks & Considerations</h4>
                                                            </div>
                                                            <ul className="space-y-1.5">
                                                                {scenarioSummary.risks.map((risk, idx) => (
                                                                    <li key={idx} className="text-xs text-gray-300 flex items-start space-x-2">
                                                                        <span className="text-amber-400 mt-0.5 shrink-0">!</span>
                                                                        <span>{risk}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Strategic Recommendation */}
                                                    <div className="flex items-start space-x-2 bg-white/10 rounded-lg p-3">
                                                        <Target className="w-4 h-4 text-[#F0F0F0] mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="text-xs font-semibold text-[#F0F0F0]">Strategic Recommendation: </span>
                                                            <span className="text-xs text-gray-200">{scenarioSummary.strategicImplication}</span>
                                                        </div>
                                                    </div>

                                                    {/* Confidence Rationale */}
                                                    <p className="text-[10px] text-gray-400 italic">
                                                        {scenarioSummary.confidenceRationale}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Expand hint when collapsed */}
                                    {!showSummaryDetails && (
                                        <button
                                            onClick={() => setShowSummaryDetails(true)}
                                            className="flex items-center space-x-1 text-[10px] text-gray-400 hover:text-gray-200 transition-colors"
                                        >
                                            <ChevronDown className="w-3 h-3" />
                                            <span>Show insights, risks & recommendations</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Panel - Adjust Levers (hidden on Driver Analytics — context strip sits above) */}
                    {activeTab !== 'driver-analytics' && (
                    <div className="col-span-5">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {activeTab === 'external-signals' ? 'External context' : 'Adjust Levers'}
                            </h3>
                            {activeTab === 'external-signals' ? (
                                <div className="space-y-4 text-sm text-gray-600">
                                    <p>
                                        These five monitors distill CMS regulatory risk, drug pricing dynamics, medical
                                        cost trend, PBM competitive pressure, and macro financing exposure — themes
                                        documented in the BD research workbook, peer filings, and industry outlook.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>
                                            <span className="font-medium text-gray-800">Read-only</span> — no sliders;
                                            impact bands are illustrative swings vs. a planning baseline.
                                        </li>
                                        <li>
                                            Select a card on the right for{' '}
                                            <span className="font-medium text-gray-800">SWOT</span> framing and leading
                                            indicators.
                                        </li>
                                        <li>
                                            To stress-test quantitatively, use{' '}
                                            <span className="font-medium text-gray-800">P&amp;L Impact</span> (MBR,
                                            specialty Rx, leverage) or domain tabs (MA Recovery, Caremark PBM, Digital Health).
                                        </li>
                                    </ul>
                                    <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                        Competitive Intelligence console covers peer benchmarks; this tab focuses on
                                        uncontrollable externals that sit above BD&#39;s operating plan execution.
                                    </p>
                                </div>
                            ) : (
                            <div className="space-y-4">
                                {currentLevers.map(lever => {
                                    const value = currentLeverValues[lever.id] ?? lever.currentValue;
                                    const defaultVal = lever.currentValue;
                                    // For % deltas (where 0 = neutral), color by sign; for absolute units (bps, $M, $B, %-rate),
                                    // color by deviation from default.
                                    const isPercentDelta = lever.unit === '%' && Math.abs(defaultVal) <= 20;
                                    const isAboveDefault = isPercentDelta ? value > 0 : value > defaultVal;
                                    const isBelowDefault = isPercentDelta ? value < 0 : value < defaultVal;
                                    const formatValue = (v: number): string => {
                                        switch (lever.unit) {
                                            case '%':
                                                return isPercentDelta
                                                    ? `${v > 0 ? '+' : ''}${v}%`
                                                    : `${v}%`;
                                            case 'bps':
                                                return `${v > 0 ? '+' : ''}${v}bps`;
                                            case '$M':
                                                return `$${v}M`;
                                            case '$B':
                                                return `$${v}B`;
                                            default:
                                                return `${v}${lever.unit}`;
                                        }
                                    };
                                    return (
                                        <div key={lever.id}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">{lever.name}</label>
                                                    <p className="text-xs text-gray-500">{lever.category}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`text-sm font-semibold ${
                                                        isAboveDefault ? 'text-green-600' :
                                                        isBelowDefault ? 'text-red-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                        {formatValue(value)}
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        lever.impact === 'high' ? 'bg-red-100 text-red-700' :
                                                        lever.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {lever.impact}
                                                    </span>
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min={lever.minValue}
                                                max={lever.maxValue}
                                                step={lever.step}
                                                value={value}
                                                onChange={(e) => handleCurrentLeverChange(lever.id, parseFloat(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, #e5e7eb ${((value - lever.minValue) / (lever.maxValue - lever.minValue)) * 100
                                                        }%, #003B2C ${((value - lever.minValue) / (lever.maxValue - lever.minValue)) * 100
                                                        }%)`
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* Right Panel - Analysis Results */}
                    <div className={activeTab === 'driver-analytics' ? 'col-span-12' : 'col-span-7'}>
                        <AnimatePresence mode="wait">
                            {/* ─── P&L Impact Tab ─── */}
                            {activeTab === 'pl-impact' && (
                                <motion.div
                                    key="pl-impact"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    {!impact && !impactError ? (
                                        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center justify-center py-12">
                                            <Loader className="w-8 h-8 text-[#003B2C] animate-spin mb-4" />
                                            <p className="text-gray-600">Calculating P&L impact...</p>
                                        </div>
                                    ) : !impact && impactError ? (
                                        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center justify-center py-12">
                                            <p className="text-red-500 text-sm mb-3">{impactError}</p>
                                            <button
                                                onClick={() => fetchImpact(plLeverValues)}
                                                className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    ) : (
                                    <>
                                    {/* Detailed Delta P&L Impact */}
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">BD P&L Flow-Through Impact</h3>
                                        {isCalculating && (
                                            <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500">
                                                <Loader className="w-4 h-4 animate-spin" />
                                                <span>Recalculating...</span>
                                            </div>
                                        )}

                                        {/* Summary Cards */}
                                        <div className="grid grid-cols-4 gap-4 mb-6">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-xs text-gray-600 mb-1">Revenue Impact</p>
                                                <p className={`text-xl font-bold ${impact.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {impact.revenue >= 0 ? '+' : ''}${Math.abs(impact.revenue).toFixed(0)}M
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-xs text-gray-600 mb-1">Operating Income</p>
                                                <p className={`text-xl font-bold ${impact.operatingIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {impact.operatingIncome >= 0 ? '+' : ''}${Math.abs(impact.operatingIncome).toFixed(0)}M
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-xs text-gray-600 mb-1">Net Income Impact</p>
                                                <p className={`text-xl font-bold ${impact.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {impact.netIncome >= 0 ? '+' : ''}${Math.abs(impact.netIncome).toFixed(0)}M
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-xs text-gray-600 mb-1">Operating Margin</p>
                                                <p className="text-xl font-bold text-gray-900">
                                                    {impact.operatingMargin.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Detailed P&L Table */}
                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-3">BD P&L Line Item Details</h4>
                                            <div className="space-y-2">
                                                {/* Revenue */}
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">Net Revenue</p>
                                                        <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseRevenue)}M</p>
                                                    </div>
                                                    <div className="text-right w-32">
                                                        <p className={`text-sm font-semibold ${impact.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.revenue >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.revenue))}M
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ${formatNumber(impact.baseRevenue + impact.revenue)}M
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Revenue Segments */}
                                                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-700">HCB Premium Revenue</p>
                                                            <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseAdvisoryServices)}M</p>
                                                        </div>
                                                        <div className="text-right w-28">
                                                            <p className={`text-xs font-medium ${impact.advisoryServices >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {impact.advisoryServices >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.advisoryServices))}M
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-700">Health Services Revenue</p>
                                                            <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseBuildingOperations)}M</p>
                                                        </div>
                                                        <div className="text-right w-28">
                                                            <p className={`text-xs font-medium ${impact.buildingOperations >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {impact.buildingOperations >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.buildingOperations))}M
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-700">PCW Pharmacy Revenue</p>
                                                            <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseProjectManagement)}M</p>
                                                        </div>
                                                        <div className="text-right w-28">
                                                            <p className={`text-xs font-medium ${impact.projectManagement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {impact.projectManagement >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.projectManagement))}M
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-700">Portfolio & Other Revenue</p>
                                                            <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseRealEstateInvestments)}M</p>
                                                        </div>
                                                        <div className="text-right w-28">
                                                            <p className={`text-xs font-medium ${impact.realEstateInvestments >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {impact.realEstateInvestments >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.realEstateInvestments))}M
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* COGS */}
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">Cost of Services</p>
                                                        <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseCOGS)}M</p>
                                                    </div>
                                                    <div className="text-right w-32">
                                                        <p className={`text-sm font-semibold ${impact.cogs <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.cogs >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.cogs))}M
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ${formatNumber(impact.baseCOGS + impact.cogs)}M
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* COGS Breakdown */}
                                                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                                                    <div className="flex items-center justify-between py-1">
                                                        <p className="text-xs text-gray-700">Personnel Costs</p>
                                                        <p className={`text-xs font-medium ${impact.personnelCosts <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.personnelCosts >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.personnelCosts))}M
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between py-1">
                                                        <p className="text-xs text-gray-700">Subcontractor Costs</p>
                                                        <p className={`text-xs font-medium ${impact.subcontractorCosts <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.subcontractorCosts >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.subcontractorCosts))}M
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between py-1">
                                                        <p className="text-xs text-gray-700">Facility Costs</p>
                                                        <p className={`text-xs font-medium ${impact.facilityCosts <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.facilityCosts >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.facilityCosts))}M
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Gross Profit */}
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100 bg-gray-50 rounded px-3 -mx-3">
                                                    <p className="text-sm font-semibold text-gray-900">Gross Profit</p>
                                                    <div className="text-right w-32">
                                                        <p className={`text-sm font-bold ${impact.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.grossProfit >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.grossProfit))}M
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* OpEx */}
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">Operating Expenses</p>
                                                        <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseOpEx)}M</p>
                                                    </div>
                                                    <div className="text-right w-32">
                                                        <p className={`text-sm font-semibold ${impact.opEx <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.opEx >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.opEx))}M
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ${formatNumber(impact.baseOpEx + impact.opEx)}M
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* OpEx Breakdown */}
                                                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-700">Technology Costs</p>
                                                            <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseTechnologyCosts)}M</p>
                                                        </div>
                                                        <p className={`text-xs font-medium ${impact.technologyCosts <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.technologyCosts >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.technologyCosts))}M
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-700">Marketing</p>
                                                            <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseMarketing)}M</p>
                                                        </div>
                                                        <p className={`text-xs font-medium ${impact.marketing <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.marketing >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.marketing))}M
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-700">Professional Development</p>
                                                            <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseProfessionalDev)}M</p>
                                                        </div>
                                                        <p className={`text-xs font-medium ${impact.professionalDev <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.professionalDev >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.professionalDev))}M
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-700">SG&A</p>
                                                            <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseSGandA)}M</p>
                                                        </div>
                                                        <p className={`text-xs font-medium ${impact.sga <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.sga >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.sga))}M
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between py-1">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-700">Other Operating Expenses</p>
                                                            <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseOtherOpEx)}M</p>
                                                        </div>
                                                        <p className={`text-xs font-medium ${impact.otherOpEx <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.otherOpEx >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.otherOpEx))}M
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Operating Income */}
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100 bg-[#F0F0F0] rounded px-3 -mx-3">
                                                    <div>
                                                        <p className="text-sm font-bold text-[#003B2C]">Operating Income</p>
                                                        <p className="text-xs text-gray-500">Margin: {impact.operatingMargin.toFixed(1)}%</p>
                                                    </div>
                                                    <div className="text-right w-32">
                                                        <p className={`text-sm font-bold ${impact.operatingIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impact.operatingIncome >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.operatingIncome))}M
                                                        </p>
                                                        <p className="text-xs text-gray-600 font-semibold">
                                                            ${formatNumber(impact.baseOperatingIncome + impact.operatingIncome)}M
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Below the Line */}
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">Interest Expense</p>
                                                        <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseInterest)}M</p>
                                                    </div>
                                                    <p className={`text-xs font-medium ${impact.interest <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {impact.interest >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.interest))}M
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">Tax Provision ({impact.baseEBT > 0 ? ((impact.baseTax / impact.baseEBT) * 100).toFixed(1) : '25.0'}%)</p>
                                                        <p className="text-xs text-gray-500">Base: ${formatNumber(impact.baseTax)}M</p>
                                                        <p className="text-[10px] text-slate-500 mt-0.5">
                                                            Incremental provision tracks pre-tax income — neutral tint by design.
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-medium text-slate-600 tabular-nums">
                                                            {impact.tax >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.tax))}M
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Net Income */}
                                                <div className="flex items-center justify-between py-2 bg-[#003B2C] rounded px-3 -mx-3">
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Net Income</p>
                                                        <p className="text-xs text-gray-300">EPS Impact: {impact.netIncome >= 0 ? '+' : ''}{(impact.netIncome / 1278).toFixed(2)}</p>
                                                    </div>
                                                    <div className="text-right w-32">
                                                        <p className={`text-sm font-bold ${impact.netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {impact.netIncome >= 0 ? '+' : ''}${formatNumber(Math.abs(impact.netIncome))}M
                                                        </p>
                                                        <p className="text-xs text-gray-300">
                                                            ${formatNumber(impact.baseNetIncome + impact.netIncome)}M
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <ScenarioRiskFrontierCard
                                        loading={riskLoading}
                                        onRun={runRiskAnalytics}
                                        simulation={riskAnalytics.simulation}
                                        marginal={riskAnalytics.marginal}
                                        frontier={riskAnalytics.scatter}
                                    />
                                    </>
                                    )}
                                </motion.div>
                            )}

                            {/* ─── Strategic Investment Tab ─── */}
                            {activeTab === 'strategy-investment' && (
                                <StrategyInvestmentTab
                                    leverValues={tabLeverValues['strategy-investment'] ?? {}}
                                    onLeverChange={handleTabLeverChange}
                                />
                            )}

                            {/* ─── Real Estate Portfolio Tab ─── */}
                            {activeTab === 'real-estate-portfolio' && (
                                <RealEstatePortfolioTab
                                    leverValues={tabLeverValues['real-estate-portfolio'] ?? {}}
                                    onLeverChange={handleTabLeverChange}
                                />
                            )}

                            {/* ─── Global Markets Tab ─── */}
                            {activeTab === 'global-markets' && (
                                <GlobalMarketsTab
                                    leverValues={tabLeverValues['global-markets'] ?? {}}
                                    onLeverChange={handleTabLeverChange}
                                />
                            )}

                            {/* ─── Digital Platform Tab ─── */}
                            {activeTab === 'digital-platform' && (
                                <DigitalPlatformTab
                                    leverValues={tabLeverValues['digital-platform'] ?? {}}
                                    onLeverChange={handleTabLeverChange}
                                />
                            )}

                            {activeTab === 'driver-analytics' && (
                                <motion.div
                                    key="driver-analytics"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <DriverAnalyticsTab levers={scenarioConfig.levers} />
                                </motion.div>
                            )}

                            {activeTab === 'external-signals' && (
                                <motion.div
                                    key="external-signals"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <ExternalSignalsTab
                                        pendingOpenSignalId={pendingExternalSignalModalId}
                                        onPendingOpenHandled={handlePendingExternalSignalOpened}
                                        onSyncPresetToPl={(signal) => handleSyncExternalSignalPreset(signal.id)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
