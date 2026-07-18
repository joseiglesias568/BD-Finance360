import type { LucideIcon } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ImpactedMetric {
    metric: string;
    value: string;
    trend: 'positive' | 'negative' | 'stable';
}

export interface PersonalizedInsight {
    id: number;
    title: string;
    kpi: string;
    kpiLabel: string;
    insight: string;
    trend: 'up' | 'down';
    value: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
    valueColor: string;
    action: string;
    category: string;
    // Enhanced data fields (optional – not all insights carry them)
    confidenceScore?: number;
    dataSource?: string;
    lastUpdated?: string;
    aiRecommendations?: string[];
    impactedMetrics?: ImpactedMetric[];
    historicalContext?: string;
    predictiveInsight?: string;
    dataQuality?: string;
    modelAccuracy?: string;
    consoleLink?: string;
    consoleAvailable?: boolean;
}

export interface KeyFinding {
    title: string;
    detail: string;
    confidence: number;
}

export interface RelatedDriver {
    category: string;
    drivers: string[];
    impact: string;
}

export interface DataQuality {
    completeness: number;
    accuracy: number;
    timeliness: number;
    methodology: string;
}

export interface AIResponse {
    summary: string;
    keyFindings: KeyFinding[];
    visualizations?: Record<string, any>;
    relatedDrivers: RelatedDriver[];
    recommendations: string[];
    dataSource: string;
    lastUpdated: string;
    dataQuality?: DataQuality;
}
