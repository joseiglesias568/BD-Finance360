'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ArrowDown,
    BarChart3,
    Brain,
    Calculator,
    Database,
    FileSpreadsheet,
    Globe,
    HelpCircle,
    Layers,
    Monitor,
    Server,
    Shield,
    Sparkles,
    ExternalLink,
} from 'lucide-react';

interface ArchitectureSection {
    name: string;
    items: { label: string; href?: string }[];
    icon: any;
}

interface ArchitectureRow {
    name: string;
    icon: any;
    gradient: string;
    layerKey: string;
    sections: ArchitectureSection[];
}

interface KeyConsideration {
    id: number;
    question: string;
    boldTerms: string;
}

interface LayerStatus {
    score: number;
    status: 'healthy' | 'warning' | 'critical';
    label: string;
}

interface PlatformHealth {
    overall: { score: number; status: string };
    layers: {
        layer1: LayerStatus & { details: Record<string, number> };
        layer2: LayerStatus & { details: Record<string, number> };
        layer3: LayerStatus & { details: Record<string, number> };
        layer4: LayerStatus & { details: Record<string, number> };
    };
}

const architectureRows: ArchitectureRow[] = [
    {
        name: 'Consumption Layer',
        icon: Monitor,
        gradient: 'from-[#1c519c] to-[#1c519c]',
        layerKey: 'layer4',
        sections: [
            {
                name: 'Web App',
                items: [
                    { label: 'Exec Summary', href: '/executive-summary' },
                    { label: 'Finance Business Consoles', href: '/business-consoles' },
                    { label: 'Insights & Commentary', href: '/ai-alerts' },
                ],
                icon: Globe,
            },
            {
                name: 'BI Reports',
                items: [
                    { label: 'Reports', href: '/report-hub' },
                    { label: 'Self-Servicing', href: '/report-hub' },
                    { label: 'Sandbox', href: '/sandbox' },
                ],
                icon: BarChart3,
            },
            {
                name: 'EPM',
                items: [
                    { label: 'ML Forecasting', href: '/epm/ml-forecasting' },
                    { label: 'Bridge Walks', href: '/epm/bridge-walks' },
                    { label: 'In-Cycle Reporting', href: '/epm/in-cycle-reporting' },
                    { label: 'Forecast Simulations', href: '/epm/forecast-simulations' },
                    { label: 'Planning & Budgeting', href: '/epm/planning-budgeting' },
                ],
                icon: Calculator,
            },
        ],
    },
    {
        name: 'Data and Analytics Products',
        icon: Brain,
        gradient: 'from-[#1c519c] to-[#1c519c]',
        layerKey: 'layer3',
        sections: [
            {
                name: 'AI & Analytics',
                items: [
                    { label: 'Semantic Models', href: '/business-consoles' },
                    { label: 'What-if Engines', href: '/scenario-modeling' },
                    { label: 'ML Models', href: '/epm/ml-forecasting' },
                    { label: 'Finance Data Products', href: '/report-hub' },
                    { label: 'AI Business Insight Engine' },
                ],
                icon: Sparkles,
            },
        ],
    },
    {
        name: 'Finance Data Lake',
        icon: Database,
        gradient: 'from-[#1c519c] to-[#1c519c]',
        layerKey: 'layer2',
        sections: [
            {
                name: 'Data Platform',
                items: [
                    { label: 'Data Landing Zone' },
                    { label: 'Bronze, Silver, Gold Data Layers' },
                    { label: 'Master Data Management' },
                    { label: 'Data Quality Checks' },
                    { label: 'Security & Governance' },
                ],
                icon: Layers,
            },
        ],
    },
    {
        name: 'Data Inputs',
        icon: Server,
        gradient: 'from-[#1c519c] to-[#1c519c]',
        layerKey: 'layer1',
        sections: [
            {
                name: 'Source Systems',
                items: [
                    { label: 'ERP (Oracle)' },
                    { label: 'CRM (Salesforce)' },
                    { label: 'POS Systems' },
                    { label: 'PropTech Platform' },
                    { label: '3rd Party (Bloomberg)' },
                    { label: 'Excel & Treasury' },
                ],
                icon: FileSpreadsheet,
            },
        ],
    },
];

const keyConsiderations: KeyConsideration[] = [
    {
        id: 1,
        question: 'Will driver calculations be performed in the data or EPM layer?',
        boldTerms: 'driver calculations',
    },
    {
        id: 2,
        question: 'What is the reporting strategy across the different environments?',
        boldTerms: 'reporting strategy',
    },
    {
        id: 3,
        question: 'Will consolidations be performed in EPM or the data platform?',
        boldTerms: 'consolidations',
    },
    {
        id: 4,
        question: 'Will integrations be built directly between apps or to the data lake?',
        boldTerms: 'integrations',
    },
];

const statusColor = (status: string) => {
    switch (status) {
        case 'healthy': return 'bg-emerald-400';
        case 'warning': return 'bg-amber-400';
        case 'critical': return 'bg-red-400';
        default: return 'bg-gray-400';
    }
};

function FlowArrow() {
    return (
        <div className="flex justify-center py-1">
            <div className="flex flex-col items-center">
                <div className="w-0.5 h-3 bg-[#1c519c]/20" />
                <ArrowDown className="w-5 h-5 text-[#1c519c]/40" />
                <div className="w-0.5 h-3 bg-[#1c519c]/20" />
            </div>
        </div>
    );
}

export default function TechArchitecture() {
    const [health, setHealth] = useState<PlatformHealth | null>(null);

    useEffect(() => {
        fetch('/api/platform-status')
            .then((r) => r.ok ? r.json() : null)
            .then(setHealth)
            .catch(() => null);
    }, []);

    return (
        <div className="space-y-8">
            {/* Platform Health Summary Bar */}
            {health && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-4"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">Platform Health</h3>
                        <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${statusColor(health.overall.status)}`} />
                            <span className="text-sm font-bold text-gray-900">{health.overall.score}%</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {(['layer1', 'layer2', 'layer3', 'layer4'] as const).map((key) => {
                            const layer = health.layers[key];
                            return (
                                <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor(layer.status)}`} />
                                    <div className="min-w-0">
                                        <div className="text-xs text-gray-500 truncate">{layer.label}</div>
                                        <div className="text-sm font-semibold text-gray-900">{layer.score}%</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Introduction */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            >
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-[#F0F0F0] rounded-lg">
                        <Server className="w-6 h-6 text-[#1c519c]" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            4-Layer Enterprise Finance Architecture
                        </h2>
                        <p className="text-gray-600">
                            End-to-end data architecture — from source systems through the finance data lake and analytics products to the consumption layer. Click any item to navigate to its page.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Architecture Rows */}
            <div className="space-y-0">
                {architectureRows.map((row, rowIndex) => {
                    const RowIcon = row.icon;
                    const layerHealth = health?.layers[row.layerKey as keyof typeof health.layers];
                    return (
                        <div key={row.name}>
                            {rowIndex > 0 && <FlowArrow />}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: rowIndex * 0.12 }}
                                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                            >
                                <div className={`h-2 bg-gradient-to-r ${row.gradient}`} />
                                <div className="p-5">
                                    {/* Row Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gradient-to-br from-[#1c519c] to-[#1c519c] rounded-lg">
                                                <RowIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="font-bold text-gray-900">{row.name}</h3>
                                        </div>
                                        {layerHealth && (
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${statusColor(layerHealth.status)}`} />
                                                <span className="text-xs font-medium text-gray-500">{layerHealth.score}%</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sections */}
                                    {row.sections.length > 1 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {row.sections.map((section) => {
                                                const SectionIcon = section.icon;
                                                return (
                                                    <div
                                                        key={section.name}
                                                        className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                                                    >
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <SectionIcon className="w-4 h-4 text-[#1c519c]" />
                                                            <span className="text-sm font-semibold text-gray-800">{section.name}</span>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            {section.items.map((item) => (
                                                                item.href ? (
                                                                    <Link
                                                                        key={item.label}
                                                                        href={item.href}
                                                                        className="flex items-center justify-between text-xs text-[#1c519c] bg-white rounded px-2.5 py-1.5 border border-gray-100 hover:bg-[#F0F0F0]/50 hover:border-[#1c519c]/20 transition-colors group"
                                                                    >
                                                                        <span>{item.label}</span>
                                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    </Link>
                                                                ) : (
                                                                    <div
                                                                        key={item.label}
                                                                        className="text-xs text-gray-600 bg-white rounded px-2.5 py-1.5 border border-gray-100"
                                                                    >
                                                                        {item.label}
                                                                    </div>
                                                                )
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {row.sections[0].items.map((item) => (
                                                item.href ? (
                                                    <Link
                                                        key={item.label}
                                                        href={item.href}
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-[#F0F0F0] rounded-lg hover:bg-[#1c519c]/20 transition-colors group"
                                                    >
                                                        <span className="text-sm font-medium text-[#1c519c]">{item.label}</span>
                                                        <ExternalLink className="w-3 h-3 text-[#1c519c] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                ) : (
                                                    <div
                                                        key={item.label}
                                                        className="flex items-center px-3 py-2 bg-[#F0F0F0] rounded-lg"
                                                    >
                                                        <span className="text-sm font-medium text-[#1c519c]">{item.label}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* Key Considerations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-[#1c519c]" />
                    <span>Key Considerations</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keyConsiderations.map((consideration, index) => (
                        <motion.div
                            key={consideration.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + index * 0.08 }}
                            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-[#1c519c] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    {consideration.id}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {consideration.question}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Footnote */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="p-4 bg-[#F0F0F0]/30 rounded-lg border border-[#1c519c]/10"
            >
                <p className="text-xs text-gray-500 italic">
                    Illustrative and non-exhaustive. Additional technologies may be considered across these layers as requirements evolve.
                </p>
            </motion.div>
        </div>
    );
}
