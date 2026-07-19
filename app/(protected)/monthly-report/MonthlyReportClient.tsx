'use client';

import { motion } from 'framer-motion';
import {
    BarChart3,
    Calendar,
    Check,
    Clock,
    FileText,
    Layers,
    Pencil,
    Target,
    TrendingUp,
    Shield,
    User
} from 'lucide-react';
import { useState } from 'react';
import type { FinancialConfig, KPIConfig, OperationsConfig, StrategicConfig, MarketConfig } from '@/config/types';
import ExecutiveDashboard from './ExecutiveDashboard';
import FinancialPerformance from './FinancialPerformance';
import ForwardOutlook from './ForwardOutlook';
import OperationalPerformance from './OperationalPerformance';
import RiskCompliance from './RiskCompliance';
import StrategicInitiatives from './StrategicInitiatives';

const tabs = [
    { id: 'executive-dashboard', name: 'CEO Scorecard', icon: Layers },
    { id: 'financial-performance', name: 'Financial Performance', icon: BarChart3 },
    { id: 'operational-performance', name: 'Operations & Customer', icon: TrendingUp },
    { id: 'strategic-initiatives', name: 'Strategy Execution', icon: Target },
    { id: 'risk-compliance', name: 'Risk & Market', icon: Shield },
    { id: 'forward-outlook', name: 'Forward Outlook', icon: Calendar }
];

interface MonthlyReportClientProps {
    narrative: {
        overallStatus: string;
        statusColor: string;
        narrative: string;
        keyAchievements: string[];
        concerns: string[];
    } | null;
    criticalActions: Array<{
        id: number;
        title: string;
        priority: string;
        urgency: string;
        owner: string;
        dueDate: string;
        description: string;
        financialImpact: string;
        riskLevel: string;
        status: string;
        category: string;
    }>;
    forwardInsights: Array<{
        id: number;
        type: string;
        title: string;
        insight: string;
        impact: string;
        timeframe: string;
        confidence: string;
    }>;
    financials: FinancialConfig;
    kpis: KPIConfig;
    operations: OperationsConfig;
    strategic: StrategicConfig;
    market: MarketConfig;
}

export default function MonthlyReportClient({ narrative, criticalActions, forwardInsights, financials, kpis, operations, strategic, market }: MonthlyReportClientProps) {
    const [activeTab, setActiveTab] = useState('executive-dashboard');

    // Derive period label from data instead of hardcoding
    const periodLabel = financials?.latestQuarter?.quarter ?? 'Current Period';

    const renderContent = () => {
        switch (activeTab) {
            case 'executive-dashboard':
                return (
                    <ExecutiveDashboard
                        periodLabel={periodLabel}
                        narrative={narrative}
                        criticalActions={criticalActions}
                        forwardInsights={forwardInsights}
                        financials={financials}
                        kpis={kpis}
                    />
                );
            case 'financial-performance':
                return <FinancialPerformance periodLabel={periodLabel} financials={financials} />;
            case 'operational-performance':
                return <OperationalPerformance periodLabel={periodLabel} operations={operations} kpis={kpis} />;
            case 'strategic-initiatives':
                return <StrategicInitiatives periodLabel={periodLabel} strategic={strategic} />;
            case 'risk-compliance':
                return <RiskCompliance periodLabel={periodLabel} strategic={strategic} market={market} />;
            case 'forward-outlook':
                return <ForwardOutlook periodLabel={periodLabel} strategic={strategic} financials={financials} />;
            default:
                return (
                    <ExecutiveDashboard
                        periodLabel={periodLabel}
                        narrative={narrative}
                        criticalActions={criticalActions}
                        forwardInsights={forwardInsights}
                        financials={financials}
                        kpis={kpis}
                    />
                );
        }
    };

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-[#1c519c] to-[#1c519c] rounded-xl shadow-lg shadow-[#1c519c]/20">
                                    <FileText className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Monthly Operating Report</h1>
                                    <p className="text-gray-600 mt-1">
                                        State of the Business &bull; C-Suite Review
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">v3.2 — Final</span>
                                </div>
                                <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                                    <User className="w-3 h-3" />
                                    <span>Prepared by FP&A Team</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Period & Status Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#F0F0F0] border border-[#1c519c]/20 rounded-lg">
                                <Calendar className="w-4 h-4 text-[#1c519c]" />
                                <span className="text-sm font-medium text-[#1c519c]">
                                    {periodLabel} &bull; vs Plan
                                </span>
                            </div>
                            <div className="hidden md:flex items-center space-x-1.5 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>Last edited by Sarah Johnson, Mar 5, 2026</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                                <Check className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-xs font-medium text-green-800">
                                    Published
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 -mb-px overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        group flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                                        ${activeTab === tab.id
                                            ? 'border-[#1c519c] text-[#1c519c]'
                                            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.name}</span>
                                    <span title="Edit in authoring mode"><Pencil className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" /></span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderContent()}
                </motion.div>

                {/* Section attribution */}
                <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1.5">
                        <User className="w-3 h-3" />
                        <span>
                            Section maintained by {activeTab === 'executive-dashboard' ? 'Sarah Johnson, VP Finance' :
                                activeTab === 'financial-performance' ? 'Mike Chen, Sr. Financial Analyst' :
                                activeTab === 'operational-performance' ? 'Lisa Park, Property Analytics Lead' :
                                activeTab === 'strategic-initiatives' ? 'David Kim, Strategy & Planning' :
                                activeTab === 'risk-compliance' ? 'Rachel Torres, Risk & Compliance' :
                                'James Wright, FP&A Manager'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Updated Mar 5, 2026</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Check className="w-3 h-3 text-green-500" />
                            <span>Reviewed & Published</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
