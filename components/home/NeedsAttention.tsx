'use client';

import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    Bell,
    Target,
} from 'lucide-react';
import type { AlertTemplate } from '@/config/types';

interface CriticalAction {
    id: number;
    title: string;
    priority: string;
    urgency: string;
    dueDate: string;
    description: string;
    financialImpact: string;
    category: string;
}

interface NeedsAttentionProps {
    alerts: AlertTemplate[];
    actions: CriticalAction[];
}

export default function NeedsAttention({ alerts, actions }: NeedsAttentionProps) {
    // Top 2 critical/warning alerts
    const urgentAlerts = alerts
        .filter(a => a.severity === 'critical' || a.severity === 'warning')
        .slice(0, 2);

    // Top 2 high-urgency actions
    const urgentActions = actions
        .filter(a => a.urgency === 'critical' || a.urgency === 'high')
        .slice(0, 2);

    const items = [
        ...urgentAlerts.map(a => ({
            id: `alert-${a.id}`,
            type: 'alert' as const,
            title: a.title,
            description: a.description,
            severity: a.severity,
            category: a.category,
            link: '/ai-alerts',
        })),
        ...urgentActions.map(a => ({
            id: `action-${a.id}`,
            type: 'action' as const,
            title: a.title,
            description: a.description,
            severity: a.urgency === 'critical' ? 'critical' : 'warning',
            category: a.category,
            link: '/executive-summary',
        })),
    ].slice(0, 4);

    if (items.length === 0) return null;

    return (
        <div>
            <div className="flex items-center space-x-2 mb-4">
                <Bell className="w-5 h-5 text-[#1c519c]" />
                <h2 className="text-lg font-bold text-gray-900">Needs Your Attention</h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    {items.length}
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item, idx) => (
                    <motion.a
                        key={item.id}
                        href={item.link}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`block bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-all cursor-pointer border-l-4 ${
                            item.severity === 'critical'
                                ? 'border-l-red-500 border-gray-200'
                                : 'border-l-amber-400 border-gray-200'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className={`p-1.5 rounded-lg ${
                                item.type === 'alert' ? 'bg-red-50' : 'bg-amber-50'
                            }`}>
                                {item.type === 'alert' ? (
                                    <AlertTriangle className={`w-4 h-4 ${item.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
                                ) : (
                                    <Target className={`w-4 h-4 ${item.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
                                )}
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                item.severity === 'critical'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                            }`}>
                                {item.type === 'alert' ? 'Alert' : 'Action'}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center text-xs text-[#1c519c] font-medium">
                            View <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
