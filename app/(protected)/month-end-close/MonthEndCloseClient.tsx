'use client';

import {
    AlertCircle,
    AlertTriangle,
    BarChart3,
    Bell,
    Brain,
    Calculator,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Edit2,
    FileCheck,
    FileText,
    GitBranch,
    Lock,
    MessageSquare,
    Plus,
    Shield,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import type { MonthEndConfig, MonthEndExtraConfig } from '@/config/types';

// ---- Props ----
interface MonthEndCloseClientProps {
    monthEnd: MonthEndConfig;
    monthEndExtra: MonthEndExtraConfig;
    /** Pre-computed on the server from monthEnd.tasks */
    completionPercent: number;
    /** Pre-computed: pending-approval count for journal entries */
    jePendingApproval: number;
    /** Pre-computed: automation percentage for journal entries */
    jeAutomatedPct: number;
    /** Pre-computed close period label (e.g. "February 2026") */
    closePeriod: string;
}

// ---- Static UI data that is NOT in the database ----

const closeTabs = [
    { id: 'overview', name: 'Process Overview', icon: GitBranch },
    { id: 'journal-entries', name: 'Journal Entries', icon: Calculator },
    { id: 'financial-results', name: 'Financial Results', icon: BarChart3 },
    { id: 'adjustments', name: 'Adjustments', icon: Edit2 },
    { id: 'commentary', name: 'Commentary', icon: MessageSquare },
    { id: 'controls', name: 'Controls & Approvals', icon: Shield }
];

// NOTE: phaseDisplayMap, recentEntries, volumeTrend, financialResults,
// and adjustmentQueue are now provided via props.monthEndExtra from the
// backend config layer. See config/clients/bkr/month-end-extra.ts

// ---- Component ----

export default function MonthEndCloseClient({ monthEnd, monthEndExtra, completionPercent, jePendingApproval, jeAutomatedPct, closePeriod }: MonthEndCloseClientProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedView, setSelectedView] = useState('pl');
    const [savedCommentaryIds, setSavedCommentaryIds] = useState<Set<number>>(new Set());
    const [savingCommentaryIdx, setSavingCommentaryIdx] = useState<number | null>(null);

    // Destructure config data from backend
    const { phaseDisplayMap, recentEntries, volumeTrend, financialResults, adjustmentQueue } = monthEndExtra;

    // Build process phases from DB data, enriched with display metadata
    const processPhases = monthEnd.phases.map((phaseName) => {
        const display = phaseDisplayMap[phaseName] || {
            id: phaseName.toLowerCase().replace(/\s+/g, '-'),
            days: '',
            status: 'pending',
            progress: 0,
        };
        return { ...display, name: phaseName };
    });

    // Derive task counts from DB tasks
    const completedTasks = monthEnd.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = monthEnd.tasks.length;

    // Use DB journal entry stats
    const jeTotal = monthEnd.journalEntries.total;
    const jeTotalAmount = monthEnd.journalEntries.totalAmount;
    const jeAutomated = monthEnd.journalEntries.automated;
    const jeManual = monthEnd.journalEntries.manual;

    // Derive close period information from task dueDates
    // dueDates are stored as "Day N" strings — extract the day numbers
    const dayNumbers = monthEnd.tasks
        .map(t => {
            const match = t.dueDate.match(/(\d+)/);
            return match ? parseInt(match[1], 10) : NaN;
        })
        .filter(n => !isNaN(n));
    const totalCloseDays = dayNumbers.length > 0 ? Math.max(...dayNumbers) : 10;
    // Compute current day from completion progress
    const currentDay = Math.max(1, Math.round((completionPercent / 100) * totalCloseDays));
    const daysRemaining = Math.max(0, totalCloseDays - currentDay);
    const closeMonth = closePeriod;
    const closeStatus = completionPercent >= 90 ? 'Almost Done' : completionPercent >= 50 ? 'On Track' : 'In Progress';

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gradient-to-br from-[#003B2C] to-[#003B2C] rounded-lg shadow-lg">
                                <Calculator className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Month-End Close Command Center</h1>
                                <p className="text-sm text-gray-600">{closeMonth} &bull; Day {currentDay} of {totalCloseDays} &bull; {closeStatus}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                                <Bell className="w-4 h-4" />
                                <span>Alerts (3)</span>
                            </button>
                            <button className="px-4 py-1.5 text-sm bg-[#003B2C] text-white rounded-lg font-semibold hover:bg-[#003B2C] transition-all flex items-center space-x-2">
                                <FileCheck className="w-4 h-4" />
                                <span>Close Checklist</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto">
                        {closeTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-[#003B2C] text-[#003B2C]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                {/* Process Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Overall Progress */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Close Progress</h3>
                            <div className="space-y-4">
                                {processPhases.map((phase) => (
                                    <div key={phase.id} className="flex items-center space-x-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-900">{phase.name}</span>
                                                <span className="text-xs text-gray-500">{phase.days}</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${phase.status === 'completed' ? 'bg-[#003B2C]' :
                                                            phase.status === 'in-progress' ? 'bg-emerald-400' :
                                                                'bg-gray-300'
                                                        }`}
                                                    style={{ width: `${phase.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-24 text-right">
                                            {phase.status === 'completed' && <CheckCircle className="w-5 h-5 text-[#003B2C] inline" />}
                                            {phase.status === 'in-progress' && <Clock className="w-5 h-5 text-emerald-400 inline" />}
                                            {phase.status === 'pending' && <AlertCircle className="w-5 h-5 text-gray-400 inline" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Key Metrics - uses DB data */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Tasks Completed</span>
                                    <CheckCircle className="w-4 h-4 text-[#003B2C]" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{completedTasks}/{totalTasks}</p>
                                <p className="text-xs text-gray-500 mt-1">{completionPercent}% complete</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Journal Entries</span>
                                    <Calculator className="w-4 h-4 text-emerald-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{jeTotal}</p>
                                <p className="text-xs text-gray-500 mt-1">${(jeTotalAmount / 1000000).toFixed(0)}M total amount</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Automated</span>
                                    <Zap className="w-4 h-4 text-[#003B2C]" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{jeAutomated}</p>
                                <p className="text-xs text-gray-500 mt-1">{jeManual} manual entries</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Days to Close</span>
                                    <Calendar className="w-4 h-4 text-[#003B2C]" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{currentDay}</p>
                                <p className="text-xs text-gray-500 mt-1">{daysRemaining} remaining</p>
                            </div>
                        </div>

                        {/* Critical Items */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Critical Path Items</h3>
                                <span className="text-sm text-red-600 font-medium">3 items need attention</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Deferred revenue accrual revision pending</p>
                                        <p className="text-xs text-gray-600 mt-1">$18M impact - Client prepayment breakage estimate requires VP Finance approval by EOD</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Mobile payment & gift card reconciliation in progress</p>
                                        <p className="text-xs text-gray-600 mt-1">65% complete - blocking property revenue finalization</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">FX revaluation draft pending for international entities</p>
                                        <p className="text-xs text-gray-600 mt-1">Treasury team finalizing EUR, GBP, JPY, and CNY exposures</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Journal Entries Tab */}
                {activeTab === 'journal-entries' && (
                    <div className="space-y-6">
                        {/* JE Summary - uses DB data */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Total Entries</span>
                                    <FileText className="w-4 h-4 text-emerald-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{jeTotal}</p>
                                <p className="text-xs text-[#003B2C] mt-1">+1.1% vs last month</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Total Amount</span>
                                    <DollarSign className="w-4 h-4 text-[#003B2C]" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">${(jeTotalAmount / 1000000).toFixed(0)}M</p>
                                <p className="text-xs text-gray-500 mt-1">Gross value</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Automated</span>
                                    <Zap className="w-4 h-4 text-[#003B2C]" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{jeAutomatedPct}%</p>
                                <p className="text-xs text-gray-500 mt-1">{jeAutomated} entries</p>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Pending</span>
                                    <Clock className="w-4 h-4 text-orange-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{jePendingApproval}</p>
                                <p className="text-xs text-orange-600 mt-1">Requires approval</p>
                            </div>
                        </div>

                        {/* JE Volume Trend */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Journal Entry Volume Trend</h3>
                            <div className="h-48 flex items-end space-x-4">
                                {volumeTrend.map((month) => (
                                    <div key={month.month} className="flex-1 flex flex-col items-center">
                                        <div className="w-full bg-[#F0F0F0] rounded-t" style={{
                                            height: `${(month.count / 300) * 100}%`
                                        }}>
                                            <div className="text-xs font-medium text-center pt-2 text-[#003B2C]">{month.count}</div>
                                        </div>
                                        <div className="text-xs text-gray-600 mt-2">{month.month}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Journal Entries */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Journal Entries</h3>
                                <button className="text-sm text-[#003B2C] hover:text-[#003B2C] font-medium">View All</button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recentEntries.map((entry) => (
                                    <div key={entry.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm font-medium text-gray-900">{entry.id}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${entry.type === 'Recurring' ? 'bg-emerald-100 text-emerald-700' :
                                                            entry.type === 'Manual' ? 'bg-gray-100 text-gray-700' :
                                                                'bg-[#F0F0F0] text-[#003B2C]'
                                                        }`}>
                                                        {entry.type}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${entry.status === 'Posted' ? 'bg-emerald-100 text-emerald-700' :
                                                            entry.status === 'Pending Approval' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {entry.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                    <span>Preparer: {entry.preparer}</span>
                                                    <span>Approver: {entry.approver}</span>
                                                    <span>Post Date: {entry.postDate}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-lg font-semibold ${entry.amount >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                                                    ${Math.abs(entry.amount / 1000000).toFixed(1)}M
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Financial Results Tab - uses DB trialBalance for the table */}
                {activeTab === 'financial-results' && (
                    <div className="space-y-6">
                        {/* View Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
                                <button
                                    onClick={() => setSelectedView('pl')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedView === 'pl'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    P&L Statement
                                </button>
                                <button
                                    onClick={() => setSelectedView('bs')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedView === 'bs'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Balance Sheet
                                </button>
                                {monthEnd.trialBalance.length > 0 && (
                                    <button
                                        onClick={() => setSelectedView('tb')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedView === 'tb'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Trial Balance
                                    </button>
                                )}
                            </div>
                            <button className="px-3 py-2 text-sm bg-[#003B2C] text-white rounded-lg font-medium hover:bg-[#003B2C] transition-all">
                                Export Results
                            </button>
                        </div>

                        {/* P&L View */}
                        {selectedView === 'pl' && (
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Profit & Loss Statement</h3>
                                    <p className="text-sm text-gray-600">{closeMonth} (in millions)</p>
                                </div>
                                <div className="p-4">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-sm text-gray-600 border-b">
                                                <th className="text-left py-2">Line Item</th>
                                                <th className="text-right py-2">Actual</th>
                                                <th className="text-right py-2">Prior Month</th>
                                                <th className="text-right py-2">Var %</th>
                                                <th className="text-right py-2">Budget</th>
                                                <th className="text-right py-2">Var %</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {Object.entries(financialResults.pl).map(([key, values]) => {
                                                const actualVsPrior = ((values.actual - values.prior) / Math.abs(values.prior)) * 100;
                                                const actualVsBudget = ((values.actual - values.budget) / Math.abs(values.budget)) * 100;
                                                const label = key === 'netRevenues' ? 'Net Revenues' :
                                                    key === 'costOfGoodsSold' ? 'Cost of Goods Sold' :
                                                    key === 'storeOperatingExpenses' ? 'Property Operating Expenses' :
                                                    key === 'gaExpenses' ? 'G&A Expenses' :
                                                    key === 'depreciationAmortization' ? 'Depreciation & Amortization' :
                                                    key === 'operatingIncome' ? 'Operating Income' :
                                                    key === 'netIncome' ? 'Net Income' : key;
                                                return (
                                                    <tr key={key} className={`text-sm ${key === 'operatingIncome' || key === 'netIncome' ? 'font-semibold bg-gray-50' : ''}`}>
                                                        <td className="py-3 font-medium text-gray-900">
                                                            {label}
                                                        </td>
                                                        <td className="text-right py-3 font-medium">
                                                            ${(values.actual / 1000000).toFixed(0)}
                                                        </td>
                                                        <td className="text-right py-3 text-gray-600">
                                                            ${(values.prior / 1000000).toFixed(0)}
                                                        </td>
                                                        <td className={`text-right py-3 font-medium ${actualVsPrior >= 0 ? 'text-[#003B2C]' : 'text-red-600'
                                                            }`}>
                                                            {actualVsPrior >= 0 ? '+' : ''}{actualVsPrior.toFixed(1)}%
                                                        </td>
                                                        <td className="text-right py-3 text-gray-600">
                                                            ${(values.budget / 1000000).toFixed(0)}
                                                        </td>
                                                        <td className={`text-right py-3 font-medium ${actualVsBudget >= 0 ? 'text-[#003B2C]' : 'text-red-600'
                                                            }`}>
                                                            {actualVsBudget >= 0 ? '+' : ''}{actualVsBudget.toFixed(1)}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Balance Sheet View */}
                        {selectedView === 'bs' && (
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Balance Sheet</h3>
                                    <p className="text-sm text-gray-600">As of {closeMonth} (in billions)</p>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-6">
                                        {Object.entries(financialResults.bs).map(([key, values]) => {
                                            const change = values.current - values.prior;
                                            const changePercent = (change / Math.abs(values.prior)) * 100;
                                            const label = key === 'totalAssets' ? 'Total Assets' :
                                                key === 'totalLiabilities' ? 'Total Liabilities' :
                                                key === 'stockholdersDeficit' ? "Stockholders' Deficit" : key;
                                            return (
                                                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {label}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Change: ${(change / 1000000000).toFixed(1)}B ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%)
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-lg font-semibold ${values.current < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                            {values.current < 0 ? '-' : ''}${(Math.abs(values.current) / 1000000000).toFixed(1)}B
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Prior: {values.prior < 0 ? '-' : ''}${(Math.abs(values.prior) / 1000000000).toFixed(1)}B
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Trial Balance View - from DB */}
                        {selectedView === 'tb' && monthEnd.trialBalance.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Trial Balance</h3>
                                    <p className="text-sm text-gray-600">{closeMonth} (in millions)</p>
                                </div>
                                <div className="p-4">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-sm text-gray-600 border-b">
                                                <th className="text-left py-2">Account</th>
                                                <th className="text-right py-2">Actual</th>
                                                <th className="text-right py-2">Prior Month</th>
                                                <th className="text-right py-2">Var %</th>
                                                <th className="text-right py-2">Budget</th>
                                                <th className="text-right py-2">Var %</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {monthEnd.trialBalance.map((row, idx) => {
                                                const varVsPrior = row.priorMonth !== 0
                                                    ? ((row.actual - row.priorMonth) / Math.abs(row.priorMonth)) * 100
                                                    : 0;
                                                const varVsBudget = row.budget !== 0
                                                    ? ((row.actual - row.budget) / Math.abs(row.budget)) * 100
                                                    : 0;
                                                return (
                                                    <tr key={idx} className="text-sm">
                                                        <td className="py-3 font-medium text-gray-900">{row.label}</td>
                                                        <td className="text-right py-3 font-medium">
                                                            ${(row.actual / 1000000).toFixed(0)}
                                                        </td>
                                                        <td className="text-right py-3 text-gray-600">
                                                            ${(row.priorMonth / 1000000).toFixed(0)}
                                                        </td>
                                                        <td className={`text-right py-3 font-medium ${varVsPrior >= 0 ? 'text-[#003B2C]' : 'text-red-600'}`}>
                                                            {varVsPrior >= 0 ? '+' : ''}{varVsPrior.toFixed(1)}%
                                                        </td>
                                                        <td className="text-right py-3 text-gray-600">
                                                            ${(row.budget / 1000000).toFixed(0)}
                                                        </td>
                                                        <td className={`text-right py-3 font-medium ${varVsBudget >= 0 ? 'text-[#003B2C]' : 'text-red-600'}`}>
                                                            {varVsBudget >= 0 ? '+' : ''}{varVsBudget.toFixed(1)}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Adjustments Tab */}
                {activeTab === 'adjustments' && (
                    <div className="space-y-6">
                        {/* Adjustments Summary */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Adjustments Queue</h3>
                                <button className="px-3 py-1.5 text-sm bg-[#003B2C] text-white rounded-lg font-medium hover:bg-[#003B2C] transition-all flex items-center space-x-2">
                                    <Plus className="w-4 h-4" />
                                    <span>New Adjustment</span>
                                </button>
                            </div>
                            <div className="space-y-3">
                                {adjustmentQueue.map((adj) => (
                                    <div key={adj.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm font-medium text-gray-900">{adj.id}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${adj.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                            adj.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {adj.priority}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${adj.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                            'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {adj.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-1">{adj.description}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                    <span>Deadline: {adj.deadline}</span>
                                                    <span>Preparer: {adj.preparer}</span>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-sm text-gray-600">P&L Impact</p>
                                                <p className={`text-lg font-semibold ${adj.impact.pl >= 0 ? 'text-[#003B2C]' : 'text-red-600'}`}>
                                                    {adj.impact.pl >= 0 ? '+' : ''}${(adj.impact.pl / 1000000).toFixed(1)}M
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Commentary Tab */}
                {activeTab === 'commentary' && (
                    <div className="space-y-6">
                        {/* AI Commentary Engine */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <Brain className="w-6 h-6 text-[#003B2C]" />
                                    <h3 className="text-lg font-semibold text-gray-900">AI-Generated Commentary</h3>
                                </div>
                                <button className="px-3 py-1.5 text-sm bg-[#003B2C] text-white rounded-lg font-medium hover:bg-[#003B2C] transition-all">
                                    Regenerate All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {(() => {
                                    const pl = financialResults.pl;
                                    const revActual = pl.netRevenues.actual;
                                    const revPrior = pl.netRevenues.prior;
                                    const revChange = revPrior !== 0 ? ((revActual - revPrior) / Math.abs(revPrior) * 100).toFixed(1) : '0.0';
                                    const oiActual = pl.operatingIncome.actual;
                                    const oiPrior = pl.operatingIncome.prior;
                                    const oiMargin = revActual !== 0 ? ((oiActual / revActual) * 100).toFixed(1) : '0.0';
                                    const oiPriorMargin = revPrior !== 0 ? ((oiPrior / revPrior) * 100).toFixed(1) : '0.0';
                                    const marginBps = Math.round((parseFloat(oiMargin) - parseFloat(oiPriorMargin)) * 100);

                                    const commentaryItems = [
                                        {
                                            title: 'Revenue Performance',
                                            text: `Net revenues ${parseFloat(revChange) >= 0 ? 'increased' : 'decreased'} ${Math.abs(parseFloat(revChange))}% vs prior month to $${(revActual / 1000000).toFixed(1)}M. Budget variance of ${((revActual - pl.netRevenues.budget) / Math.abs(pl.netRevenues.budget) * 100).toFixed(1)}% reflects ${revActual >= pl.netRevenues.budget ? 'above-plan' : 'below-plan'} performance.`,
                                        },
                                        {
                                            title: 'Operating Margin Analysis',
                                            text: `Operating income of $${(oiActual / 1000000).toFixed(0)}M represents a ${oiMargin}% margin, ${marginBps >= 0 ? 'up' : 'down'} ${Math.abs(marginBps)}bps vs prior month. Net income came in at $${(pl.netIncome.actual / 1000000).toFixed(0)}M, ${pl.netIncome.actual >= pl.netIncome.budget ? 'ahead of' : 'behind'} budget.`,
                                        },
                                    ];

                                    return commentaryItems.map((item, idx) => (
                                        <div key={idx} className="p-4 bg-[#F0F0F0] rounded-lg border border-emerald-200">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 mb-2">{item.title}</p>
                                                    <p className="text-sm text-gray-700">{item.text}</p>
                                                </div>
                                                <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center space-x-3 mt-3">
                                                <button
                                                    onClick={async () => {
                                                        setSavingCommentaryIdx(idx);
                                                        try {
                                                            const res = await fetch('/api/commentary', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    title: `Month-End: ${item.title}`,
                                                                    content: item.text,
                                                                    category: 'Financial Performance',
                                                                    commentaryType: 'analysis',
                                                                    priority: 'high',
                                                                    fiscalPeriod: closePeriod,
                                                                    relatedConsoles: ['financial-performance'],
                                                                    tags: ['month-end-close', item.title.toLowerCase().replace(/\s+/g, '-')],
                                                                    authorName: 'AI Commentary Engine',
                                                                    authorRole: 'Month-End Close',
                                                                    isAiGenerated: true,
                                                                }),
                                                            });
                                                            if (res.ok) setSavedCommentaryIds(prev => new Set([...Array.from(prev), idx]));
                                                        } finally {
                                                            setSavingCommentaryIdx(null);
                                                        }
                                                    }}
                                                    disabled={savedCommentaryIds.has(idx) || savingCommentaryIdx === idx}
                                                    className="text-xs text-[#003B2C] hover:text-[#003B2C] font-medium disabled:text-gray-400 disabled:cursor-default"
                                                >
                                                    {savedCommentaryIds.has(idx) ? '✓ Saved to Commentary Engine' : savingCommentaryIdx === idx ? 'Saving...' : 'Save to Commentary Engine'}
                                                </button>
                                                <button className="text-xs text-gray-600 hover:text-gray-700 font-medium">Edit</button>
                                                <button className="text-xs text-gray-600 hover:text-gray-700 font-medium">Regenerate</button>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls & Approvals Tab */}
                {activeTab === 'controls' && (
                    <div className="space-y-6">
                        {/* Approval Workflow */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflow Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-[#003B2C]" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Property Revenue Reconciliation</p>
                                            <p className="text-xs text-gray-600">Approved by Property Accounting Manager at 2:30 PM</p>
                                        </div>
                                    </div>
                                    <Lock className="w-4 h-4 text-[#003B2C]" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-[#003B2C]" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Partnership Fee Revenue Recognition</p>
                                            <p className="text-xs text-gray-600">Approved by Revenue Accounting at 4:15 PM</p>
                                        </div>
                                    </div>
                                    <Lock className="w-4 h-4 text-[#003B2C]" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Deferred Revenue Accrual Adjustment</p>
                                            <p className="text-xs text-gray-600">Pending VP Finance approval</p>
                                        </div>
                                    </div>
                                    <Shield className="w-4 h-4 text-orange-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Partner Benefits Accrual</p>
                                            <p className="text-xs text-gray-600">Pending VP Finance approval</p>
                                        </div>
                                    </div>
                                    <Shield className="w-4 h-4 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
