'use client';

import type { AlertsConfig, AlertTemplate as DBAlertTemplate } from '@/config/types';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    Brain,
    ChevronDown,
    ChevronRight,
    Clock,
    Building2,
    Cpu,
    DollarSign,
    Globe,
    LineChart,
    Mail,
    MessageSquare,
    Plus,
    Settings,
    Smartphone,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
    Wallet,
    Zap
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import AIFeedback from '@/components/feedback/AIFeedback';

interface Alert {
    id: string;
    name: string;
    type: 'threshold' | 'forecast' | 'anomaly' | 'trend';
    category: string;
    driver: string;
    conditionText: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    channels: string[];
    enabled: boolean;
    lastTriggered?: string;
    suggestedActions?: string[];
}

interface AlertTemplateUI {
    id: string;
    name: string;
    icon: LucideIcon;
    category: string;
    description: string;
    defaultThreshold: number;
    unit: string;
    driver: string;
    alertType: string;
    suggestedActions: string[];
}

// Map category to icon
const categoryIconMap: Record<string, LucideIcon> = {
    'Revenue & Comps': TrendingDown,
    'Margin & Profitability': DollarSign,
    'Cost & Commodity': BarChart3,
    'Cash Flow & Capital': Wallet,
    'Digital & Platform': Smartphone,
    'Property Operations': Building2,
    'International Markets': Globe,
    'Predictive Analytics': Brain,
    // Legacy fallbacks
    'Revenue & Market': TrendingDown,
    'Financial Performance': DollarSign,
    'Digital & Customer': Users,
    'Property & Operations': Building2,
};

// Map alert type to icon
const alertTypeIconMap: Record<string, LucideIcon> = {
    threshold: Target,
    forecast: LineChart,
    anomaly: Activity,
    trend: TrendingUp,
};

// Simulated lastTriggered dates for demo — makes the system feel alive
const triggeredDates: Record<string, string> = {
    'comp-sales-decline': '2 hours ago',
    'transaction-trend-reversal': '6 hours ago',
    'margin-compression': '1 day ago',
    'labor-cost-breach': '3 days ago',
    'platform-engagement-drop': '2 days ago',
    'throughput-degradation': '5 hours ago',
    'emea-market-alert': 'Resolved 4 days ago',
    'revenue-forecast-confidence': '12 hours ago',
    'cost-index-forecast': '1 day ago',
    'anomaly-detection': '3 hours ago',
};

// Map DB templates to active alerts
function dbTemplateToAlert(t: DBAlertTemplate, idx: number): Alert {
    const severityMap: Record<string, Alert['severity']> = { critical: 'critical', warning: 'high', info: 'medium' };

    // Use the raw threshold string — it's already a clean, human-readable condition
    const conditionText = t.threshold;

    return {
        id: t.id,
        name: t.title,
        type: (t.alertType as Alert['type']) ?? 'threshold',
        category: t.category,
        driver: t.title.replace(' Alert', '').replace(' Decline', ''),
        conditionText,
        severity: severityMap[t.severity] ?? 'medium',
        frequency: (t.frequency as Alert['frequency']) ?? 'weekly',
        channels: t.severity === 'critical'
            ? ['email', 'app', 'slack']
            : t.alertType === 'forecast'
                ? ['email', 'app', 'slack']
                : ['email', 'app'],
        enabled: true,
        lastTriggered: triggeredDates[t.id],
        suggestedActions: t.suggestedActions,
    };
}

// Map DB template to UI template
function dbTemplateToUI(t: DBAlertTemplate): AlertTemplateUI {
    return {
        id: t.id,
        name: t.title,
        icon: categoryIconMap[t.category] ?? Bell,
        category: t.category,
        description: t.description,
        defaultThreshold: t.parsedThreshold,
        unit: t.parsedUnit,
        driver: t.title.replace(' Alert', ''),
        alertType: t.alertType ?? 'threshold',
        suggestedActions: t.suggestedActions,
    };
}

// Alert type badge colors and labels
function getAlertTypeBadge(type: string) {
    switch (type) {
        case 'forecast': return { label: 'ML Forecast', className: 'bg-purple-50 text-purple-700 border-purple-200' };
        case 'anomaly': return { label: 'Anomaly Detection', className: 'bg-blue-50 text-blue-700 border-blue-200' };
        case 'trend': return { label: 'Trend Analysis', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
        default: return { label: 'Threshold', className: 'bg-gray-50 text-gray-600 border-gray-200' };
    }
}

interface AIAlertsClientProps {
    alertsConfig: AlertsConfig;
}

export default function AIAlertsClient({ alertsConfig }: AIAlertsClientProps) {
    // Build templates and initial alerts from DB data
    const alertTemplates = useMemo(() => alertsConfig.templates.map(dbTemplateToUI), [alertsConfig]);
    const initialAlerts = useMemo(() => alertsConfig.templates.map(dbTemplateToAlert), [alertsConfig]);
    const [activeTab, setActiveTab] = useState('my-alerts');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<AlertTemplateUI | null>(null);
    const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const channelOptions = [
        { id: 'app', name: 'In-App', icon: Bell },
        { id: 'email', name: 'Email', icon: Mail },
        { id: 'sms', name: 'SMS', icon: Smartphone },
        { id: 'slack', name: 'Slack', icon: MessageSquare }
    ];

    const categories = useMemo(() => {
        const cats = Array.from(new Set(alerts.map(a => a.category)));
        return ['all', ...cats];
    }, [alerts]);

    const filteredAlerts = useMemo(() => {
        if (categoryFilter === 'all') return alerts;
        return alerts.filter(a => a.category === categoryFilter);
    }, [alerts, categoryFilter]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-red-600 bg-red-50 border-red-200';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        return alertTypeIconMap[type] ?? Bell;
    };

    const toggleAlert = (alertId: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
        ));
    };

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-[#1c519c] to-[#1c519c] rounded-lg shadow-lg">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">AI Alert System</h1>
                                <p className="text-sm text-gray-600">24/7 AI-powered monitoring across financial, operational & predictive signals</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-[#1c519c] text-white rounded-lg font-semibold hover:bg-[#1c519c] transition-all flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Alert</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {['my-alerts', 'templates', 'activity'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                                    ? 'border-[#1c519c] text-[#1c519c]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab === 'my-alerts' ? 'My Alerts' : tab === 'templates' ? 'Alert Templates' : 'Alert Activity'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === 'my-alerts' && (
                    <div className="space-y-4">
                        {/* Active Alerts Summary */}
                        <div className="grid grid-cols-5 gap-4 mb-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Alerts</p>
                                        <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
                                    </div>
                                    <Bell className="w-8 h-8 text-gray-400" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Active</p>
                                        <p className="text-2xl font-bold text-[#1c519c]">
                                            {alerts.filter(a => a.enabled).length}
                                        </p>
                                    </div>
                                    <Activity className="w-8 h-8 text-emerald-400" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Critical</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {alerts.filter(a => a.severity === 'critical').length}
                                        </p>
                                    </div>
                                    <AlertTriangle className="w-8 h-8 text-red-400" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">ML-Powered</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {alerts.filter(a => a.type === 'forecast' || a.type === 'anomaly').length}
                                        </p>
                                    </div>
                                    <Cpu className="w-8 h-8 text-purple-400" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Triggered Today</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {alerts.filter(a => a.lastTriggered && !a.lastTriggered.includes('day') && !a.lastTriggered.includes('Resolved')).length}
                                        </p>
                                    </div>
                                    <Zap className="w-8 h-8 text-orange-400" />
                                </div>
                            </div>
                        </div>

                        {/* Category filter chips */}
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-medium text-gray-500 uppercase">Filter:</span>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${categoryFilter === cat
                                        ? 'bg-[#1c519c] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat === 'all' ? 'All Categories' : cat}
                                </button>
                            ))}
                        </div>

                        {/* Alert List - Table View */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alert</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Severity</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Frequency</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Channels</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAlerts.map((alert) => {
                                        const TypeIcon = getTypeIcon(alert.type);
                                        const CategoryIcon = categoryIconMap[alert.category] ?? Bell;
                                        const isExpanded = expandedAlerts.includes(alert.id);
                                        const typeBadge = getAlertTypeBadge(alert.type);
                                        return (
                                            <React.Fragment key={alert.id}>
                                                <tr className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-[#F0F0F0]/30' : ''}`}
                                                    onClick={() => {
                                                        if (alert.suggestedActions) {
                                                            setExpandedAlerts(prev =>
                                                                prev.includes(alert.id)
                                                                    ? prev.filter(id => id !== alert.id)
                                                                    : [...prev, alert.id]
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <td className="px-3 py-2.5">
                                                        <div className="flex items-center space-x-2">
                                                            <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                                                                <CategoryIcon className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{alert.name}</p>
                                                                {alert.lastTriggered && (
                                                                    <p className="text-xs text-gray-500 flex items-center">
                                                                        <Clock className="w-2.5 h-2.5 mr-1 text-orange-500" />
                                                                        {alert.lastTriggered}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2.5">
                                                        <p className="text-xs text-gray-600">{alert.conditionText}</p>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        <span className={`inline-flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${typeBadge.className}`}>
                                                            <TypeIcon className="w-2.5 h-2.5" />
                                                            <span>{typeBadge.label}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getSeverityColor(alert.severity)}`}>
                                                            {alert.severity}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center text-xs text-gray-600">{alert.frequency}</td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleAlert(alert.id); }}
                                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${alert.enabled ? 'bg-[#1c519c]' : 'bg-gray-200'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${alert.enabled ? 'translate-x-5' : 'translate-x-1'
                                                                    }`}
                                                            />
                                                        </button>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        <div className="flex items-center justify-center space-x-0.5">
                                                            {alert.channels.map(channel => {
                                                                const channelOption = channelOptions.find(c => c.id === channel);
                                                                if (!channelOption) return null;
                                                                const ChannelIcon = channelOption.icon;
                                                                return (
                                                                    <div key={channel} className="p-0.5 bg-gray-100 rounded" title={channelOption.name}>
                                                                        <ChannelIcon className="w-3 h-3 text-gray-600" />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        <div className="flex items-center justify-center space-x-1">
                                                            {alert.suggestedActions && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedAlerts(prev =>
                                                                            prev.includes(alert.id)
                                                                                ? prev.filter(id => id !== alert.id)
                                                                                : [...prev, alert.id]
                                                                        );
                                                                    }}
                                                                    className="p-1 text-[#1c519c] hover:bg-[#F0F0F0] rounded transition-colors"
                                                                    title="AI Suggested Actions"
                                                                >
                                                                    {isExpanded ? (
                                                                        <ChevronDown className="w-3.5 h-3.5" />
                                                                    ) : (
                                                                        <Brain className="w-3.5 h-3.5" />
                                                                    )}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                            >
                                                                <Settings className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Expandable AI Suggested Actions Row */}
                                                {isExpanded && alert.suggestedActions && (
                                                    <tr>
                                                        <td colSpan={8} className="px-3 py-3 bg-[#F0F0F0]/40 border-t border-b border-[#1c519c]/20">
                                                            <div className="flex items-start space-x-2">
                                                                <Brain className="w-4 h-4 text-[#1c519c] mt-0.5 flex-shrink-0" />
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-semibold text-[#1c519c] mb-1.5">AI Suggested Next Actions</p>
                                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                                                                        {alert.suggestedActions.map((action, idx) => (
                                                                            <div key={idx} className="flex items-start space-x-1.5">
                                                                                <span className="text-[10px] font-bold text-[#1c519c] bg-[#F0F0F0] rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                                                                                <span className="text-xs text-gray-700">{action}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="mt-2 flex justify-end">
                                                                        <AIFeedback contentId={`alert-${alert.id}-actions`} contentType="alert-action" size="sm" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="space-y-6">
                        {/* Group templates by category */}
                        {Array.from(new Set(alertTemplates.map(t => t.category))).map(category => {
                            const Icon = categoryIconMap[category] ?? Bell;
                            const categoryTemplates = alertTemplates.filter(t => t.category === category);
                            return (
                                <div key={category}>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Icon className="w-4 h-4 text-[#1c519c]" />
                                        <h3 className="text-sm font-semibold text-gray-900">{category}</h3>
                                        <span className="text-xs text-gray-400">({categoryTemplates.length} templates)</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {categoryTemplates.map((template) => {
                                            const TplIcon = template.icon;
                                            const typeBadge = getAlertTypeBadge(template.alertType);
                                            return (
                                                <motion.div
                                                    key={template.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    whileHover={{ scale: 1.02 }}
                                                    className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-[#1c519c] hover:shadow-lg transition-all"
                                                    onClick={() => {
                                                        setSelectedTemplate(template);
                                                        setShowCreateModal(true);
                                                    }}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className="p-2 bg-[#F0F0F0] rounded-lg">
                                                            <TplIcon className="w-5 h-5 text-[#1c519c]" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                                                            <div className="mt-2 flex items-center space-x-2">
                                                                <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${typeBadge.className}`}>
                                                                    {typeBadge.label}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400">{template.defaultThreshold}{template.unit}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Recent Alert Activity</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Real-time feed of triggered alerts, AI analyses, and resolutions</p>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                                <span className="flex items-center space-x-1 text-red-600"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span>3 active</span></span>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-500">12 events today</span>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {/* Activity: Organic Growth alert triggered */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">Fee Revenue Growth Decline triggered</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-red-600 bg-red-50">critical</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">Americas fee revenue growth declined -2.4% QoQ, driven by capital markets weakness. Transaction volume down -3.1% while average fee rate held flat at +0.7%.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />2 hours ago</span>
                                        <span className="text-[10px] text-[#1c519c] font-medium flex items-center"><Brain className="w-2.5 h-2.5 mr-0.5" />5 AI actions recommended</span>
                                        <span className="text-[10px] text-gray-400">Notified via Email, Slack</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity: Anomaly Detection */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                                    <Activity className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">Anomalous Transaction Pattern Detected</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-purple-600 bg-purple-50 border border-purple-200">ML anomaly</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">Unsupervised model flagged unusual leasing activity surge in Pacific Northwest region -- 3.2 sigma above expected for this time of year. May indicate tech sector office re-entry demand.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />3 hours ago</span>
                                        <span className="text-[10px] text-purple-600 font-medium">Investigating — added to 7-day watchlist</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity: Throughput */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                                    <Building2 className="w-4 h-4 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">SLA Compliance Degradation triggered</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-orange-600 bg-orange-50">high</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">Work order response time averaged 5:23 hours across 287 managed properties, 18% of the portfolio. Highest concentration in metro NYC and Chicago markets.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />5 hours ago</span>
                                        <span className="text-[10px] text-[#1c519c] font-medium flex items-center"><Brain className="w-2.5 h-2.5 mr-0.5" />Property-level drill down available</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity: Transaction ML alert */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                                    <LineChart className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">Transaction Count Trend Reversal triggered</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-purple-600 bg-purple-50 border border-purple-200">ML forecast</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">ML model detected 4th consecutive week of transaction decline in Southeast region. Predictive confidence: 82% probability of continued erosion without intervention.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />6 hours ago</span>
                                        <span className="text-[10px] text-red-600 font-medium">Escalated to Regional VP</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity: Revenue forecast */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                                    <Brain className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">Revenue Forecast Confidence Degradation triggered</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-red-600 bg-red-50">critical</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">Q2 FY26 revenue forecast confidence band widened to ±3.4%, up from ±1.8% last week. Key drivers: consumer sentiment index decline and weather pattern uncertainty in key markets.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />12 hours ago</span>
                                        <span className="text-[10px] text-[#1c519c] font-medium flex items-center"><Brain className="w-2.5 h-2.5 mr-0.5" />Scenario analysis generated</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity: Cost index */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-yellow-50 rounded-lg flex-shrink-0">
                                    <BarChart3 className="w-4 h-4 text-yellow-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">Construction Cost Index Forecast Alert triggered</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-purple-600 bg-purple-50 border border-purple-200">ML forecast</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">Predictive model projects construction cost index to rise 8.2% within 60 days based on materials shortage and labor market tightness. Current hedge coverage: 87% through Q3 FY26.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />1 day ago</span>
                                        <span className="text-[10px] text-gray-500">Shared with Procurement & Treasury</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity: Client engagement drop */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                                    <Users className="w-4 h-4 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">Client Engagement Drop triggered</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-blue-600 bg-blue-50 border border-blue-200">anomaly</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">Active client accounts declined to 12,400 (-2.3% QoQ). Analysis shows standard tier clients driving the decline, with platform engagement frequency down 18% vs. prior quarter.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />2 days ago</span>
                                        <span className="text-[10px] text-[#1c519c] font-medium flex items-center"><Brain className="w-2.5 h-2.5 mr-0.5" />Retention campaign recommended</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity: Operating margin */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                                    <DollarSign className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">Operating Margin Compression triggered</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-red-600 bg-red-50">critical</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">Operating margin at 12.6%, below 13% threshold. Waterfall analysis: labor +90bps pressure, COGS +60bps, partially offset by occupancy leverage -30bps and SG&A savings -40bps.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />1 day ago</span>
                                        <span className="text-[10px] text-red-600 font-medium">CFO briefing scheduled</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity: Labor cost */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                                    <DollarSign className="w-4 h-4 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">Labor Cost Ratio Breach triggered</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-red-600 bg-red-50">critical</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">Workforce cost ratio hit 32.4% of property revenue in week 12. Scheduling model optimization could recover 40-60bps. 127 properties above the 35% individual threshold.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />3 days ago</span>
                                        <span className="text-[10px] text-[#1c519c] font-medium">Property operations review initiated</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity: China resolved */}
                            <div className="p-4 flex items-start space-x-3">
                                <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                                    <Globe className="w-4 h-4 text-[#1c519c]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900">China Market Deterioration alert resolved</p>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-emerald-600 bg-emerald-50">resolved</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5">China organic revenue improved to -3.2% from -5.8%, crossing back within the -5% threshold. Spring Festival client campaigns and new service formats contributed to recovery.</p>
                                    <div className="flex items-center space-x-3 mt-1.5">
                                        <span className="text-[10px] text-gray-400 flex items-center"><Clock className="w-2.5 h-2.5 mr-0.5" />4 days ago</span>
                                        <span className="text-[10px] text-emerald-600 font-medium">Auto-resolved — monitoring continues</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Alert Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedTemplate ? `Create ${selectedTemplate.name} Alert` : 'Create Custom Alert'}
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Alert Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c519c] focus:border-transparent"
                                        defaultValue={selectedTemplate?.name || ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Threshold</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c519c] focus:border-transparent"
                                            defaultValue={selectedTemplate?.defaultThreshold || 0}
                                        />
                                        <span className="text-sm text-gray-600">{selectedTemplate?.unit || '%'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Alert Intelligence Type</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { id: 'threshold', label: 'Threshold', desc: 'Metric crosses a limit' },
                                            { id: 'forecast', label: 'ML Forecast', desc: 'Predicts future state' },
                                            { id: 'anomaly', label: 'Anomaly', desc: 'Detects unusual patterns' },
                                            { id: 'trend', label: 'Trend', desc: 'Sustained direction change' },
                                        ].map(t => (
                                            <label key={t.id} className={`flex flex-col p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedTemplate?.alertType === t.id ? 'border-[#1c519c] bg-[#F0F0F0]/30' : 'border-gray-200'}`}>
                                                <span className="text-xs font-medium text-gray-900">{t.label}</span>
                                                <span className="text-[10px] text-gray-500">{t.desc}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notification Channels</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {channelOptions.map(channel => {
                                            const Icon = channel.icon;
                                            return (
                                                <label key={channel.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input type="checkbox" className="text-[#1c519c]" defaultChecked={channel.id === 'app' || channel.id === 'email'} />
                                                    <Icon className="w-4 h-4 text-gray-600" />
                                                    <span className="text-sm text-gray-700">{channel.name}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setSelectedTemplate(null);
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setSelectedTemplate(null);
                                }}
                                className="px-4 py-2 bg-[#1c519c] text-white rounded-lg font-semibold hover:bg-[#1c519c] transition-all"
                            >
                                Create Alert
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
