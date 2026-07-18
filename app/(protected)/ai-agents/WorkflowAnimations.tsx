'use client';

import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    BarChart3,
    Bell,
    Brain,
    CheckCircle,
    Cloud,
    Database,
    FileText,
    Filter,
    Layers,
    Network,
    Pause,
    Play,
    Search,
    Settings,
    Shield,
    Sparkles,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

interface WorkflowStep {
    id: string;
    name: string;
    icon: any;
    description: string;
    agents: string[];
    data?: string;
}

interface Workflow {
    id: string;
    title: string;
    description: string;
    userQuery: string;
    steps: WorkflowStep[];
    result: string;
    category: 'insights' | 'reporting' | 'planning' | 'analysis' | 'automation';
}

const workflows: Workflow[] = [
    // INSIGHTS CATEGORY
    {
        id: 'home-dashboard-insights',
        title: 'Home Dashboard Personalized Insights',
        description: 'AI-powered personalized insights with recommendations delivered on insight cards',
        userQuery: 'User lands on home page and sees personalized insight cards',
        category: 'insights',
        steps: [
            {
                id: 'data-aggregation',
                name: 'Data Aggregation',
                icon: Database,
                description: 'Integrated Data Aggregator pulls data from multiple sources',
                agents: ['Integrated Data Aggregator'],
                data: 'Consolidated data from SAP, ERP, data lake'
            },
            {
                id: 'performance-consolidation',
                name: 'Performance Consolidation',
                icon: Layers,
                description: 'Performance Data Consolidator aggregates KPI metrics',
                agents: ['Performance Data Consolidator'],
                data: 'KPI metrics across 14 business dimensions'
            },
            {
                id: 'ai-insights',
                name: 'AI Insights Generation',
                icon: Brain,
                description: 'AI Insights Agent analyzes data and generates recommendations',
                agents: ['AI Insights Agent'],
                data: 'AI-generated insights and action recommendations'
            },
            {
                id: 'decision-support',
                name: 'Decision Support',
                icon: Brain,
                description: 'Decision Support Analyst provides actionable recommendations',
                agents: ['Decision Support Analyst'],
                data: 'Strategic recommendations tied to business outcomes'
            },
            {
                id: 'dashboard-builder',
                name: 'Dashboard Building',
                icon: BarChart3,
                description: 'KPI Dashboard Builder formats insights for presentation',
                agents: ['KPI Dashboard Builder'],
                data: 'Formatted insight cards ready for display'
            },
            {
                id: 'surface-insights',
                name: 'Surface Insights',
                icon: Sparkles,
                description: 'Insights displayed on personalized home dashboard',
                agents: [],
                data: '14 insight cards with KPIs and AI recommendations'
            }
        ],
        result: 'User sees personalized insight cards with KPIs and AI recommendations on home dashboard'
    },
    {
        id: 'ai-search-question',
        title: 'AI Search & Question Understanding',
        description: 'Intent-based question understanding with tailored presentation (not chat)',
        userQuery: 'What is driving our market share decline?',
        category: 'insights',
        steps: [
            {
                id: 'query-received',
                name: 'Query Received',
                icon: Search,
                description: 'User submits natural language question',
                agents: ['AI Insights Agent'],
                data: 'Natural language query: "What is driving our market share decline?"'
            },
            {
                id: 'intent-understanding',
                name: 'Intent Understanding',
                icon: Brain,
                description: 'AI Insights Agent understands intent and identifies relevant data sources',
                agents: ['AI Insights Agent'],
                data: 'Query intent: Market analysis, requires driver analysis'
            },
            {
                id: 'data-retrieval',
                name: 'Data Retrieval',
                icon: Database,
                description: 'Integrated Data Aggregator retrieves relevant data',
                agents: ['Integrated Data Aggregator'],
                data: 'Market share data, competitive data, sales data'
            },
            {
                id: 'driver-analysis',
                name: 'Driver Analysis',
                icon: TrendingUp,
                description: 'Business Driver Analyzer identifies key drivers',
                agents: ['Business Driver Analyzer'],
                data: 'Key drivers: leasing revenue growth, AUM growth, FM contract wins'
            },
            {
                id: 'insight-generation',
                name: 'Insight Generation',
                icon: Brain,
                description: 'AI Insights Agent generates key findings and recommendations',
                agents: ['AI Insights Agent'],
                data: 'Key findings, trends, business drivers, recommendations'
            },
            {
                id: 'visualization-prep',
                name: 'Visualization Preparation',
                icon: BarChart3,
                description: 'Orchestration Agent prepares tailored visualizations',
                agents: ['Orchestration Agent'],
                data: 'Curated data visuals, trend charts, driver analysis'
            },
            {
                id: 'present-tailored',
                name: 'Tailored Presentation',
                icon: Sparkles,
                description: 'Results presented in tailored format with transparency indicators',
                agents: [],
                data: 'Key findings, visualizations, recommendations, data quality indicators'
            }
        ],
        result: 'User sees tailored presentation with key findings, curated visuals, business drivers, and recommendations with data quality transparency'
    },
    {
        id: 'executive-summary',
        title: 'Executive Summary Generation',
        description: 'AI-powered executive briefing with insights and recommendations',
        userQuery: 'Generate executive summary for upcoming briefing',
        category: 'reporting',
        steps: [
            {
                id: 'data-aggregation',
                name: 'Data Aggregation',
                icon: Database,
                description: 'Integrated Data Aggregator pulls comprehensive data',
                agents: ['Integrated Data Aggregator'],
                data: 'Financials, operational metrics, market data across all dimensions'
            },
            {
                id: 'kpi-consolidation',
                name: 'KPI Consolidation',
                icon: Layers,
                description: 'Performance Data Consolidator aggregates key KPIs',
                agents: ['Performance Data Consolidator'],
                data: 'Consolidated KPIs: Revenue, EBIT, Market Share, etc.'
            },
            {
                id: 'ai-insights',
                name: 'AI Insights Generation',
                icon: Brain,
                description: 'AI Insights Agent generates insights and recommendations',
                agents: ['AI Insights Agent'],
                data: 'What\'s going well, what\'s okay, what needs attention'
            },
            {
                id: 'executive-briefing',
                name: 'Executive Briefing Creation',
                icon: FileText,
                description: 'Management Commentary Writer creates executive briefing',
                agents: ['Management Commentary Writer'],
                data: 'AI executive briefing with key insights'
            },
            {
                id: 'curated-insights',
                name: 'Curated Insights',
                icon: Sparkles,
                description: 'Strategic Financial Analyzer curates insights by category',
                agents: ['Strategic Financial Analyzer'],
                data: 'Overview insights, decision insights, risk highlights'
            },
            {
                id: 'dashboard-build',
                name: 'Dashboard Building',
                icon: BarChart3,
                description: 'KPI Dashboard Builder formats executive dashboard',
                agents: ['KPI Dashboard Builder'],
                data: 'Formatted executive summary with KPIs and insights'
            },
            {
                id: 'export-prep',
                name: 'Export Preparation',
                icon: FileText,
                description: 'Model Report Publisher prepares export options',
                agents: ['Model Report Publisher'],
                data: 'Ready for PowerPoint, PDF export'
            },
            {
                id: 'surface-summary',
                name: 'Surface Executive Summary',
                icon: Sparkles,
                description: 'Executive summary displayed with all insights',
                agents: [],
                data: 'Complete executive summary ready for briefing'
            }
        ],
        result: 'Executive Summary page displays AI-generated briefing with KPIs, insights, recommendations, and export options'
    },
    // REPORTING CATEGORY
    {
        id: 'business-narrative',
        title: 'Business Narrative Creation',
        description: 'AI narrative agent generates initial narrative, then commentary agent adds human insights',
        userQuery: 'Generate business narrative for Market & Demand console',
        category: 'reporting',
        steps: [
            {
                id: 'data-collection',
                name: 'Data Collection',
                icon: Database,
                description: 'Integrated Data Aggregator pulls market and demand data',
                agents: ['Integrated Data Aggregator'],
                data: 'Market share, demand trends, competitive data, sales metrics'
            },
            {
                id: 'performance-consolidation',
                name: 'Performance Consolidation',
                icon: Layers,
                description: 'Performance Data Consolidator aggregates metrics',
                agents: ['Performance Data Consolidator'],
                data: 'Consolidated KPIs and metrics for market & demand'
            },
            {
                id: 'narrative-generation',
                name: 'AI Narrative Generation',
                icon: FileText,
                description: 'Management Commentary Writer generates initial narrative from data',
                agents: ['Management Commentary Writer'],
                data: 'AI-generated narrative based on data insights'
            },
            {
                id: 'commentary-retrieval',
                name: 'Commentary Retrieval',
                icon: Users,
                description: 'Commentary Agent retrieves user-submitted comments from field',
                agents: ['Commentary Agent'],
                data: 'Human insights from sales teams, operations, regional managers'
            },
            {
                id: 'narrative-enhancement',
                name: 'Narrative Enhancement',
                icon: Sparkles,
                description: 'Commentary Agent combines AI narrative with human commentary',
                agents: ['Commentary Agent'],
                data: 'Enhanced narrative combining data insights with field context'
            },
            {
                id: 'contextual-enrichment',
                name: 'Contextual Enrichment',
                icon: Brain,
                description: 'AI Insights Agent adds strategic context and recommendations',
                agents: ['AI Insights Agent'],
                data: 'Richer contextualized narrative with strategic insights'
            },
            {
                id: 'surface-narrative',
                name: 'Surface Narrative',
                icon: FileText,
                description: 'Complete narrative displayed in Business Narrative tab',
                agents: [],
                data: 'Rich narrative combining AI insights with human commentary'
            }
        ],
        result: 'Business Narrative tab displays rich contextualized narrative combining AI-generated insights with human commentary from field teams'
    },
    {
        id: 'variance-commentary',
        title: 'Variance Commentary Generation',
        description: 'AI generates initial variance comments, user can modify and sign-off',
        userQuery: 'Generate variance commentary for Q4 vs Q3 comparison',
        category: 'reporting',
        steps: [
            {
                id: 'variance-calculation',
                name: 'Variance Calculation',
                icon: BarChart3,
                description: 'Variance Reporting Analyst calculates variances between periods',
                agents: ['Variance Reporting Analyst'],
                data: 'Q4 vs Q3 variances by dimension and driver'
            },
            {
                id: 'driver-analysis',
                name: 'Driver Analysis',
                icon: TrendingUp,
                description: 'Business Driver Analyzer identifies variance drivers',
                agents: ['Business Driver Analyzer'],
                data: 'Key drivers explaining variances'
            },
            {
                id: 'ai-commentary',
                name: 'AI Commentary Generation',
                icon: FileText,
                description: 'Variance Commentator generates initial AI commentary',
                agents: ['Variance Commentator'],
                data: 'AI-generated variance explanations'
            },
            {
                id: 'user-review',
                name: 'User Review & Edit',
                icon: Users,
                description: 'User reviews and modifies AI-generated comments',
                agents: [],
                data: 'User-modified commentary with additional context'
            },
            {
                id: 'save-commentary',
                name: 'Save Commentary',
                icon: FileText,
                description: 'Commentary saved with traceability',
                agents: ['Commentary Agent'],
                data: 'Saved commentary with user attribution and timestamp'
            },
            {
                id: 'sign-off',
                name: 'Sign-Off Process',
                icon: Shield,
                description: 'User signs off on final commentary',
                agents: [],
                data: 'Signed-off commentary ready for distribution'
            },
            {
                id: 'surface-commentary',
                name: 'Surface Commentary',
                icon: FileText,
                description: 'Final commentary displayed in Bridge/Variance tab',
                agents: [],
                data: 'Final variance commentary with traceability'
            }
        ],
        result: 'Bridge/Variance tab displays AI-generated variance commentary that user can modify, save, and sign-off with full traceability'
    },
    {
        id: 'monthly-report',
        title: 'Monthly Operating Report (MOR)',
        description: 'Comprehensive monthly financial reporting and analysis',
        userQuery: 'Generate Monthly Operating Report for current period',
        category: 'reporting',
        steps: [
            {
                id: 'data-aggregation',
                name: 'Data Aggregation',
                icon: Database,
                description: 'Integrated Data Aggregator pulls financial and operational data',
                agents: ['Integrated Data Aggregator'],
                data: 'Financials, operational metrics, market data'
            },
            {
                id: 'performance-consolidation',
                name: 'Performance Consolidation',
                icon: Layers,
                description: 'Performance Data Consolidator aggregates KPIs',
                agents: ['Performance Data Consolidator'],
                data: 'Consolidated performance metrics'
            },
            {
                id: 'variance-analysis',
                name: 'Variance Analysis',
                icon: BarChart3,
                description: 'Variance Reporting Analyst calculates variances',
                agents: ['Variance Reporting Analyst'],
                data: 'Period-over-period variances'
            },
            {
                id: 'commentary-generation',
                name: 'Commentary Generation',
                icon: FileText,
                description: 'Variance Commentator and Management Commentary Writer generate narratives',
                agents: ['Variance Commentator', 'Management Commentary Writer'],
                data: 'AI-generated commentary and explanations'
            },
            {
                id: 'report-building',
                name: 'Report Building',
                icon: FileText,
                description: 'Operational Reporter and Model Report Publisher format report',
                agents: ['Operational Reporter', 'Model Report Publisher'],
                data: 'Formatted MOR with sections and visualizations'
            },
            {
                id: 'surface-mor',
                name: 'Surface MOR',
                icon: Sparkles,
                description: 'Monthly Operating Report displayed',
                agents: [],
                data: 'Complete MOR ready for review and distribution'
            }
        ],
        result: 'Monthly Operating Report displayed with financials, variances, commentary, and visualizations'
    },
    // PLANNING CATEGORY
    {
        id: 'scenario-modeling',
        title: 'Scenario Modeling & What-If Analysis',
        description: 'Driver-based scenario modeling with P&L impact calculation',
        userQuery: 'What if tariffs increase by 25%? Show P&L impact',
        category: 'planning',
        steps: [
            {
                id: 'scenario-definition',
                name: 'Scenario Parameter Definition',
                icon: Settings,
                description: 'Scenario Parameter Definer sets up tariff scenario parameters',
                agents: ['Scenario Parameter Definer'],
                data: 'Tariff increase: 25%, affected products, regions'
            },
            {
                id: 'baseline-retrieval',
                name: 'Baseline Retrieval',
                icon: Database,
                description: 'Integrated Data Aggregator retrieves current financial baseline',
                agents: ['Integrated Data Aggregator'],
                data: 'Current P&L, financials, cost structure'
            },
            {
                id: 'scenario-modeling',
                name: 'Scenario Modeling',
                icon: TrendingUp,
                description: 'Scenario Modeler applies what-if rules and calculates impacts',
                agents: ['Scenario Modeler'],
                data: 'P&L impact calculations, driver changes'
            },
            {
                id: 'validation',
                name: 'Scenario Validation',
                icon: Shield,
                description: 'Scenario Validator checks scenario completeness and consistency',
                agents: ['Scenario Validator'],
                data: 'Validated scenario with impact calculations'
            },
            {
                id: 'finalization',
                name: 'Scenario Finalization',
                icon: CheckCircle,
                description: 'Scenario Finalizer locks scenario version',
                agents: ['Scenario Finalizer'],
                data: 'Finalized scenario ready for comparison'
            },
            {
                id: 'results-analysis',
                name: 'Results Analysis',
                icon: BarChart3,
                description: 'Model Results Analyzer compares baseline vs scenario',
                agents: ['Model Results Analyzer'],
                data: 'Comparative analysis: baseline vs 25% tariff scenario'
            },
            {
                id: 'surface-scenario',
                name: 'Surface Scenario Results',
                icon: Sparkles,
                description: 'Scenario results displayed with P&L impact',
                agents: [],
                data: 'Scenario comparison view with detailed P&L impact'
            }
        ],
        result: 'Scenario Modeling page displays tariff scenario with P&L impact, comparison views, and option for Monte Carlo or optimization analysis'
    },
    {
        id: 'monte-carlo',
        title: 'Monte Carlo Simulation',
        description: 'Run thousands of simulations to understand statistical significance',
        userQuery: 'Run Monte Carlo simulation on tariff scenario',
        category: 'planning',
        steps: [
            {
                id: 'parameter-setup',
                name: 'Parameter Setup',
                icon: Settings,
                description: 'Scenario Parameter Definer sets up parameter ranges',
                agents: ['Scenario Parameter Definer'],
                data: 'Parameter distributions: tariff 20-30%, volume variations, cost ranges'
            },
            {
                id: 'simulation-execution',
                name: 'Simulation Execution',
                icon: TrendingUp,
                description: 'Scenario Modeler runs thousands of simulations',
                agents: ['Scenario Modeler'],
                data: '10,000+ simulation runs with varying inputs'
            },
            {
                id: 'statistical-analysis',
                name: 'Statistical Analysis',
                icon: BarChart3,
                description: 'Model Results Analyzer calculates statistical significance',
                agents: ['Model Results Analyzer'],
                data: 'Probability distributions, confidence intervals, likelihood metrics'
            },
            {
                id: 'surface-probability',
                name: 'Surface Probability Results',
                icon: Sparkles,
                description: 'Probability results displayed showing likelihood of outcomes',
                agents: [],
                data: 'Probability charts showing likelihood of different P&L outcomes'
            }
        ],
        result: 'Monte Carlo results show probability distributions and likelihood of different P&L outcomes based on thousands of simulations'
    },
    {
        id: 'optimization',
        title: 'Optimization Engine',
        description: 'Identify levers to achieve target profit or revenue',
        userQuery: 'What levers can achieve $5M additional profit?',
        category: 'planning',
        steps: [
            {
                id: 'target-definition',
                name: 'Target Definition',
                icon: Target,
                description: 'User defines optimization target: $5M additional profit',
                agents: [],
                data: 'Target: $5M profit increase'
            },
            {
                id: 'lever-identification',
                name: 'Lever Identification',
                icon: TrendingUp,
                description: 'Value Driver Analyzer identifies available levers',
                agents: ['Value Driver Analyzer'],
                data: 'Available levers: pricing, volume, cost reduction, mix optimization'
            },
            {
                id: 'optimization-modeling',
                name: 'Optimization Modeling',
                icon: Zap,
                description: 'Scenario Modeler calculates optimal lever combinations',
                agents: ['Scenario Modeler'],
                data: 'Optimal combinations of levers to achieve target'
            },
            {
                id: 'options-presentation',
                name: 'Options Presentation',
                icon: BarChart3,
                description: 'Decision Support Analyst presents optimization options',
                agents: ['Decision Support Analyst'],
                data: 'Multiple lever combination options with trade-offs'
            },
            {
                id: 'surface-options',
                name: 'Surface Optimization Options',
                icon: Sparkles,
                description: 'Optimization options displayed showing levers and impacts',
                agents: [],
                data: 'Optimization results showing lever combinations and their impacts'
            }
        ],
        result: 'Optimization Engine displays multiple lever combination options to achieve $5M profit target with trade-off analysis'
    },
    {
        id: 'budget-planning',
        title: 'Budget Planning & Management',
        description: 'Budget creation, consolidation, validation, and variance analysis',
        userQuery: 'Create annual budget for FY 2025',
        category: 'planning',
        steps: [
            {
                id: 'template-setup',
                name: 'Budget Template Setup',
                icon: FileText,
                description: 'Budget Template Manager creates budget structure',
                agents: ['Budget Template Manager'],
                data: 'Budget template with hierarchies and dimensions'
            },
            {
                id: 'data-loading',
                name: 'Budget Data Loading',
                icon: Database,
                description: 'Budget Loader loads historical and planning data',
                agents: ['Budget Loader'],
                data: 'Historical budgets, actuals, planning assumptions'
            },
            {
                id: 'budget-consolidation',
                name: 'Budget Consolidation',
                icon: Layers,
                description: 'Budget Consolidator consolidates across entities',
                agents: ['Budget Consolidator'],
                data: 'Consolidated budget across all entities'
            },
            {
                id: 'validation',
                name: 'Budget Validation',
                icon: Shield,
                description: 'Budget Validator validates completeness and compliance',
                agents: ['Budget Validator'],
                data: 'Validated budget ready for review'
            },
            {
                id: 'variance-analysis',
                name: 'Variance Analysis Setup',
                icon: TrendingDown,
                description: 'Budget Variance Analyzer sets up variance tracking',
                agents: ['Budget Variance Analyzer'],
                data: 'Variance tracking framework configured'
            },
            {
                id: 'communication',
                name: 'Plan Communication',
                icon: Sparkles,
                description: 'Plan Communication Manager distributes budget',
                agents: ['Plan Communication Manager'],
                data: 'Budget distributed to stakeholders'
            },
            {
                id: 'surface-budget',
                name: 'Surface Budget',
                icon: Sparkles,
                description: 'Budget displayed in planning interface',
                agents: [],
                data: 'Complete budget ready for review and approval'
            }
        ],
        result: 'Budget displayed with full consolidation, validation, and variance tracking capabilities'
    },
    // ANALYSIS CATEGORY
    {
        id: 'ad-hoc-sandbox',
        title: 'Ad Hoc Analysis Sandbox',
        description: 'Custom views for ad hoc analysis with traceability and potential to become standard',
        userQuery: 'Create custom view for regional profitability analysis',
        category: 'analysis',
        steps: [
            {
                id: 'user-request',
                name: 'User Request',
                icon: Users,
                description: 'User requests custom analysis view',
                agents: [],
                data: 'Request: Regional profitability analysis by product line'
            },
            {
                id: 'ad-hoc-analysis',
                name: 'Ad Hoc Analysis',
                icon: Search,
                description: 'Ad Hoc Analyzer executes custom query',
                agents: ['Ad Hoc Analyzer'],
                data: 'Custom query results: Regional profitability data'
            },
            {
                id: 'data-retrieval',
                name: 'Data Retrieval',
                icon: Database,
                description: 'Integrated Data Aggregator retrieves required data',
                agents: ['Integrated Data Aggregator'],
                data: 'Regional sales, costs, profitability by product line'
            },
            {
                id: 'view-creation',
                name: 'Custom View Creation',
                icon: Layers,
                description: 'User creates custom view with filters and visualizations',
                agents: [],
                data: 'Custom view: Regional profitability dashboard'
            },
            {
                id: 'traceability',
                name: 'Traceability & Metadata',
                icon: Shield,
                description: 'Audit Agent records view creation and metadata',
                agents: ['Audit Agent'],
                data: 'View metadata: creator, date, data sources, filters'
            },
            {
                id: 'usage-tracking',
                name: 'Usage Tracking',
                icon: Activity,
                description: 'System tracks view usage and sharing',
                agents: [],
                data: 'Usage metrics: views, shares, users'
            },
            {
                id: 'promotion-potential',
                name: 'Promotion to Standard',
                icon: TrendingUp,
                description: 'Highly-used views flagged for promotion to standard',
                agents: [],
                data: 'View flagged: 50+ users, high usage - candidate for standard view'
            },
            {
                id: 'surface-sandbox',
                name: 'Surface Sandbox View',
                icon: Sparkles,
                description: 'Custom view displayed in Sandbox/Custom tab',
                agents: [],
                data: 'Custom regional profitability view ready for use'
            }
        ],
        result: 'Custom view created in Sandbox with full traceability. Highly-used views can be promoted to standard views'
    },
    {
        id: 'business-consoles-analysis',
        title: 'Business Insight Consoles Analysis',
        description: 'Specialized analytics consoles with driver analysis and performance insights',
        userQuery: 'Analyze Market & Demand performance drivers',
        category: 'analysis',
        steps: [
            {
                id: 'data-aggregation',
                name: 'Data Aggregation',
                icon: Database,
                description: 'Integrated Data Aggregator pulls console-specific data',
                agents: ['Integrated Data Aggregator'],
                data: 'Market data, demand data, competitive intelligence'
            },
            {
                id: 'driver-analysis',
                name: 'Driver Analysis',
                icon: TrendingUp,
                description: 'Business Driver Analyzer identifies key performance drivers',
                agents: ['Business Driver Analyzer'],
                data: 'Key drivers: market share, pricing, volume, customer acquisition'
            },
            {
                id: 'value-driver-analysis',
                name: 'Value Driver Analysis',
                icon: Sparkles,
                description: 'Value Driver Analyzer links drivers to value creation',
                agents: ['Value Driver Analyzer'],
                data: 'Driver-to-value mappings and impact analysis'
            },
            {
                id: 'gap-analysis',
                name: 'Performance Gap Analysis',
                icon: TrendingDown,
                description: 'Performance Gap Analyzer identifies gaps and causes',
                agents: ['Performance Gap Analyzer'],
                data: 'Performance gaps, root causes, impact quantification'
            },
            {
                id: 'strategic-analysis',
                name: 'Strategic Analysis',
                icon: Brain,
                description: 'Strategic Financial Analyzer and Strategic Initiative Analyzer provide insights',
                agents: ['Strategic Financial Analyzer', 'Strategic Initiative Analyzer'],
                data: 'Strategic insights, initiative ROI, recommendations'
            },
            {
                id: 'decision-support',
                name: 'Decision Support',
                icon: Brain,
                description: 'Decision Support Analyst provides actionable recommendations',
                agents: ['Decision Support Analyst'],
                data: 'Decision alternatives and recommendations'
            },
            {
                id: 'surface-console',
                name: 'Surface Console Insights',
                icon: Sparkles,
                description: 'Console insights displayed across tabs',
                agents: [],
                data: 'Complete console with executive summary, analytics, narrative, data view'
            }
        ],
        result: 'Business Insight Console displays comprehensive analysis with driver insights, gaps, strategic recommendations, and decision support'
    },
    // AUTOMATION CATEGORY
    {
        id: 'alert-engine',
        title: 'AI Alert Engine',
        description: '24/7 monitoring system that triggers alerts and notifications',
        userQuery: 'Monitor for negative revenue or excessive costs',
        category: 'automation',
        steps: [
            {
                id: 'continuous-monitoring',
                name: 'Continuous Monitoring',
                icon: Activity,
                description: 'Alert Agent continuously monitors KPIs and metrics',
                agents: ['Alert Agent'],
                data: 'Real-time KPI monitoring: revenue, costs, margins, volumes'
            },
            {
                id: 'threshold-detection',
                name: 'Threshold Detection',
                icon: Bell,
                description: 'Alert Agent detects threshold breaches or anomalies',
                agents: ['Alert Agent'],
                data: 'Detected: Negative revenue in Region X, Excessive costs in Product Y'
            },
            {
                id: 'alert-analysis',
                name: 'Alert Analysis',
                icon: Brain,
                description: 'AI Insights Agent analyzes alert context and severity',
                agents: ['AI Insights Agent'],
                data: 'Alert severity, context, potential impact, recommended actions'
            },
            {
                id: 'notification-prep',
                name: 'Notification Preparation',
                icon: Users,
                description: 'Notification Agent formats alert message',
                agents: ['Notification Agent'],
                data: 'Formatted alert message with details and actions'
            },
            {
                id: 'multi-channel-delivery',
                name: 'Multi-Channel Delivery',
                icon: Zap,
                description: 'Notification Agent delivers via Teams, Slack, Email, SMS',
                agents: ['Notification Agent'],
                data: 'Alert delivered via user preferred channels'
            },
            {
                id: 'action-tracking',
                name: 'Action Tracking',
                icon: Target,
                description: 'Action Plan Builder tracks alert actions taken',
                agents: ['Action Plan Builder'],
                data: 'Action items created and tracked for alert resolution'
            },
            {
                id: 'surface-alerts',
                name: 'Surface Alerts',
                icon: Bell,
                description: 'Alerts displayed in Alert Engine interface',
                agents: [],
                data: 'Active alerts with status, severity, and actions'
            }
        ],
        result: 'Alert Engine displays active alerts with 24/7 monitoring, multi-channel notifications, and action tracking'
    }
];

const categoryConfig = {
    insights: { icon: Brain, color: 'emerald', bgColor: 'bg-[#F0F0F0]/30', borderColor: 'border-[#F0F0F0]', textColor: 'text-[#003B2C]', badgeBg: 'bg-[#F0F0F0]', badgeText: 'text-[#003B2C]', buttonBg: 'bg-[#003B2C]', label: 'Insights & Discovery' },
    reporting: { icon: FileText, color: 'green', bgColor: 'bg-[#F0F0F0]', borderColor: 'border-[#003B2C]/20', textColor: 'text-[#003B2C]', badgeBg: 'bg-[#F0F0F0]', badgeText: 'text-[#003B2C]', buttonBg: 'bg-[#003B2C]', label: 'Reporting & Narratives' },
    planning: { icon: Target, color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-600', badgeBg: 'bg-green-100', badgeText: 'text-green-800', buttonBg: 'bg-green-600', label: 'Planning & Forecasting' },
    analysis: { icon: BarChart3, color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-600', badgeBg: 'bg-orange-100', badgeText: 'text-orange-800', buttonBg: 'bg-orange-600', label: 'Analysis & Analytics' },
    automation: { icon: Zap, color: 'emerald', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800', buttonBg: 'bg-emerald-600', label: 'Automation & Alerts' }
};

export default function WorkflowAnimations() {
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow>(workflows[0]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeStepIndex, setActiveStepIndex] = useState(-1);
    const [selectedCategory, setSelectedCategory] = useState<'all' | Workflow['category']>('all');
    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
    const isPausedRef = useRef(false);

    const filteredWorkflows = selectedCategory === 'all' 
        ? workflows 
        : workflows.filter(w => w.category === selectedCategory);

    const startAnimation = () => {
        // Clear any existing timeouts
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
        
        setIsAnimating(true);
        setIsPaused(false);
        isPausedRef.current = false;
        setActiveStepIndex(-1);
        
        // Animate through each step with slower timing (3000ms = 3 seconds between steps)
        const stepDelay = 3000;
        selectedWorkflow.steps.forEach((_, index) => {
            const timeoutId = setTimeout(() => {
                if (!isPausedRef.current) {
                    setActiveStepIndex(index);
                }
            }, index * stepDelay);
            timeoutRefs.current.push(timeoutId);
        });

        // End animation after all steps and restart automatically
        const finalTimeoutId = setTimeout(() => {
            if (!isPausedRef.current) {
                // Restart animation automatically
                setTimeout(() => {
                    if (!isPausedRef.current) {
                        startAnimation();
                    }
                }, 1000); // 1 second pause before restart
            }
        }, selectedWorkflow.steps.length * stepDelay);
        timeoutRefs.current.push(finalTimeoutId);
    };

    const pauseAnimation = () => {
        setIsPaused(true);
        isPausedRef.current = true;
        // Clear all pending timeouts
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
    };

    const resumeAnimation = () => {
        setIsPaused(false);
        isPausedRef.current = false;
        // Continue from current step
        if (activeStepIndex < selectedWorkflow.steps.length - 1) {
            const remainingSteps = selectedWorkflow.steps.length - activeStepIndex - 1;
            const stepDelay = 3000;
            
            // Resume from next step
            const currentIndex = activeStepIndex;
            for (let i = 0; i < remainingSteps; i++) {
                const timeoutId = setTimeout(() => {
                    if (!isPausedRef.current) {
                        setActiveStepIndex(currentIndex + 1 + i);
                    }
                }, (i + 1) * stepDelay);
                timeoutRefs.current.push(timeoutId);
            }
            
            // End animation and restart automatically
            const finalTimeoutId = setTimeout(() => {
                if (!isPausedRef.current) {
                    // Restart animation automatically
                    setTimeout(() => {
                        if (!isPausedRef.current) {
                            startAnimation();
                        }
                    }, 1000); // 1 second pause before restart
                }
            }, remainingSteps * stepDelay);
            timeoutRefs.current.push(finalTimeoutId);
        }
    };

    useEffect(() => {
        // Clear timeouts when workflow changes
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
        
        setIsAnimating(false);
        setIsPaused(false);
        isPausedRef.current = false;
        setActiveStepIndex(-1);
        
        // Auto-start animation when workflow is selected
        if (selectedWorkflow) {
            // Small delay to ensure state is updated
            const autoStartTimeout = setTimeout(() => {
                setIsAnimating(true);
                setIsPaused(false);
                isPausedRef.current = false;
                setActiveStepIndex(-1);
                
                // Animate through each step with slower timing (3000ms = 3 seconds between steps)
                const stepDelay = 3000;
                selectedWorkflow.steps.forEach((_, index) => {
                    const timeoutId = setTimeout(() => {
                        if (!isPausedRef.current) {
                            setActiveStepIndex(index);
                        }
                    }, index * stepDelay);
                    timeoutRefs.current.push(timeoutId);
                });

                // End animation after all steps and restart automatically
                const finalTimeoutId = setTimeout(() => {
                    if (!isPausedRef.current) {
                        // Restart animation automatically
                        setTimeout(() => {
                            if (!isPausedRef.current) {
                                setIsAnimating(true);
                                setIsPaused(false);
                                isPausedRef.current = false;
                                setActiveStepIndex(-1);
                                
                                // Restart animation
                                const stepDelay = 3000;
                                selectedWorkflow.steps.forEach((_, index) => {
                                    const timeoutId = setTimeout(() => {
                                        if (!isPausedRef.current) {
                                            setActiveStepIndex(index);
                                        }
                                    }, index * stepDelay);
                                    timeoutRefs.current.push(timeoutId);
                                });

                                // End animation and restart again
                                const restartTimeoutId = setTimeout(() => {
                                    if (!isPausedRef.current) {
                                        setTimeout(() => {
                                            if (!isPausedRef.current) {
                                                startAnimation();
                                            }
                                        }, 1000);
                                    }
                                }, selectedWorkflow.steps.length * stepDelay);
                                timeoutRefs.current.push(restartTimeoutId);
                            }
                        }, 1000); // 1 second pause before restart
                    }
                }, selectedWorkflow.steps.length * stepDelay);
                timeoutRefs.current.push(finalTimeoutId);
            }, 500);
            
            return () => {
                clearTimeout(autoStartTimeout);
                timeoutRefs.current.forEach(clearTimeout);
            };
        }
    }, [selectedWorkflow.id]);

    return (
        <div className="space-y-8">
            {/* Introduction */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            >
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-[#F0F0F0] rounded-lg">
                        <Network className="w-6 h-6 text-[#003B2C]" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delta Workflow Orchestration</h2>
                        <p className="text-gray-600 mb-4">
                            These workflows demonstrate how <strong>AI agents work autonomously behind the scenes</strong> to deliver insights and capabilities across the Delta platform. 
                            Each workflow shows the step-by-step process from user request to final result, highlighting which agents are involved at each stage and where users can interact.
                        </p>
                        <div className="mt-4 p-4 bg-gradient-to-r from-[#F0F0F0]/30 to-[#F0F0F0]/30 rounded-lg border border-[#F0F0F0]">
                            <div className="flex items-start space-x-3">
                                <Zap className="w-5 h-5 text-[#003B2C] mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-gray-700">
                                    <strong className="text-[#003B2C]">Behind the Scenes:</strong> Agents work autonomously to process data, generate insights, and orchestrate workflows. 
                                    <strong className="text-[#003B2C]"> User Interaction Points</strong> are clearly marked where you can review, modify, or approve agent outputs.
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                            {(Object.entries(categoryConfig) as [Workflow['category'], typeof categoryConfig.insights][]).map(([key, config]) => {
                                const Icon = config.icon;
                                const count = workflows.filter(w => w.category === key).length;
                                return (
                                    <div key={key} className={`p-3 rounded-lg border-2 ${config.bgColor} ${config.borderColor}`}>
                                        <Icon className={`w-5 h-5 ${config.textColor} mb-1`} />
                                        <div className="text-lg font-bold text-gray-900">{count}</div>
                                        <div className="text-xs text-gray-600">{config.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Category Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Filter by Category</h2>
                    <span className="text-sm text-gray-600">{filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center space-x-2 ${
                            selectedCategory === 'all'
                                ? 'bg-[#003B2C] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        <span>All Workflows</span>
                    </button>
                    {(Object.entries(categoryConfig) as [Workflow['category'], typeof categoryConfig.insights][]).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedCategory(key)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center space-x-2 ${
                                    selectedCategory === key
                                        ? `${config.buttonBg} text-white`
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{config.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Workflow Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Select Workflow</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWorkflows.map((workflow) => {
                        const categoryInfo = categoryConfig[workflow.category];
                        const CategoryIcon = categoryInfo.icon;
                        return (
                            <button
                                key={workflow.id}
                                onClick={() => setSelectedWorkflow(workflow)}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${
                                    selectedWorkflow.id === workflow.id
                                        ? 'border-[#003B2C] bg-[#F0F0F0]/30 shadow-md'
                                        : 'border-gray-200 hover:border-[#F0F0F0] bg-white'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <CategoryIcon className={`w-5 h-5 ${categoryInfo.textColor}`} />
                                    <span className={`text-xs px-2 py-1 rounded-full ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}>
                                        {categoryInfo.label}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{workflow.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{workflow.description}</p>
                                <div className="mt-2 text-xs text-gray-500">
                                    {workflow.steps.length} steps • {workflow.steps.reduce((acc, step) => acc + step.agents.length, 0)} agent interactions
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Workflow Visualization */}
            {selectedWorkflow && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            {(() => {
                                const categoryInfo = categoryConfig[selectedWorkflow.category];
                                const CategoryIcon = categoryInfo.icon;
                                return <CategoryIcon className={`w-6 h-6 ${categoryInfo.textColor}`} />;
                            })()}
                            <h2 className="text-2xl font-bold text-gray-900">{selectedWorkflow.title}</h2>
                        </div>
                        <p className="text-gray-600 mt-1">{selectedWorkflow.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isAnimating && !isPaused ? (
                            <button
                                onClick={pauseAnimation}
                                className="flex items-center space-x-2 px-6 py-3 bg-[#003B2C] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                            >
                                <Pause className="w-5 h-5" />
                                <span>Pause</span>
                            </button>
                        ) : isAnimating && isPaused ? (
                            <button
                                onClick={resumeAnimation}
                                className="flex items-center space-x-2 px-6 py-3 bg-[#003B2C] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                            >
                                <Play className="w-5 h-5" />
                                <span>Resume</span>
                            </button>
                        ) : (
                            <button
                                onClick={startAnimation}
                                className="flex items-center space-x-2 px-6 py-3 bg-[#003B2C] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                            >
                                <Play className="w-5 h-5" />
                                <span>Show Workflow</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* User Interaction Point */}
                <div className="mb-6">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-[#F0F0F0] to-[#F0F0F0] rounded-lg border-2 border-[#F0F0F0] shadow-md">
                            <Users className="w-5 h-5 text-[#003B2C]" />
                            <div>
                                <div className="text-xs font-semibold text-[#003B2C] uppercase tracking-wide">User Interaction</div>
                                <p className="text-sm text-gray-800 font-medium">&ldquo;{selectedWorkflow.userQuery}&rdquo;</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Split Panel Layout: Steps List on Left, Details on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel: Step List */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 sticky top-4">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Workflow Steps</h3>
                            <div className="space-y-2">
                                {selectedWorkflow && selectedWorkflow.steps && selectedWorkflow.steps.length > 0 ? (
                                    selectedWorkflow.steps.map((step, index) => {
                                        if (!step) return null;
                                        
                                        const Icon = step.icon;
                                        const isActive = activeStepIndex === index;
                                        const isCompleted = activeStepIndex > index;
                                        const isPending = activeStepIndex < index;

                                        return (
                                            <motion.div
                                                key={step.id || index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{
                                                    opacity: isPending ? 0.4 : 1,
                                                    x: 0
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                                                    isActive
                                                        ? 'bg-[#F0F0F0] border-2 border-[#003B2C] shadow-md'
                                                        : isCompleted
                                                        ? 'bg-green-50 border-2 border-green-400'
                                                        : 'bg-white border border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {/* Step Number */}
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                    isActive
                                                        ? 'bg-[#003B2C] text-white'
                                                        : isCompleted
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-400 text-white'
                                                }`}>
                                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                                                </div>
                                                {/* Step Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        {Icon && <Icon className={`w-4 h-4 flex-shrink-0 ${
                                                            isActive ? 'text-[#003B2C]' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                                        }`} />}
                                                        <h4 className={`text-sm font-semibold ${
                                                            isActive ? 'text-[#003B2C]' : isCompleted ? 'text-green-900' : 'text-gray-700'
                                                        }`}>
                                                            {step.name || `Step ${index + 1}`}
                                                        </h4>
                                                    </div>
                                                    {isActive && (
                                                        <motion.div
                                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                            className="text-xs text-[#003B2C] font-medium"
                                                        >
                                                            Processing...
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="text-sm text-gray-500 text-center py-4">No steps available</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Step Details */}
                    <div className="lg:col-span-2">
                        {selectedWorkflow && selectedWorkflow.steps && activeStepIndex >= 0 && activeStepIndex < selectedWorkflow.steps.length ? (
                            <motion.div
                                key={activeStepIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-xl border-2 border-[#003B2C] shadow-lg overflow-hidden"
                            >
                                {(() => {
                                    const step = selectedWorkflow.steps[activeStepIndex];
                                    if (!step) return null;
                                    
                                    const Icon = step.icon;
                                    const hasUserInteraction = step.agents.length === 0;

                                    return (
                                        <>
                                            {/* Step Header */}
                                            <div className="bg-gradient-to-r from-[#F0F0F0]/30 to-[#F0F0F0] px-6 py-5 border-b border-[#F0F0F0]">
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#003B2C] text-white flex items-center justify-center font-bold text-lg shadow-md">
                                                        {activeStepIndex + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <Icon className="w-6 h-6 text-[#003B2C]" />
                                                            <h3 className="text-xl font-bold text-gray-900">{step.name}</h3>
                                                        </div>
                                                        <p className="text-gray-700">{step.description}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Agent Section */}
                                            {step.agents && step.agents.length > 0 && (
                                                <div className="px-6 py-5 bg-[#F0F0F0]/30 border-b border-[#F0F0F0]">
                                                    <div className="flex items-center space-x-2 mb-4">
                                                        <Brain className="w-5 h-5 text-[#003B2C]" />
                                                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                                            AI Agents Working Behind the Scenes
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {step.agents.map((agent) => (
                                                            <motion.div
                                                                key={agent}
                                                                animate={{
                                                                    scale: [1, 1.05, 1]
                                                                }}
                                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                                className="px-4 py-2 rounded-lg bg-[#003B2C] text-white font-medium text-sm flex items-center space-x-2 shadow-md"
                                                            >
                                                                <Sparkles className="w-4 h-4" />
                                                                <span>{agent}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* User Interaction */}
                                            {hasUserInteraction && (
                                                <div className="px-6 py-4 bg-[#F0F0F0] border-b border-[#003B2C]/20">
                                                    <div className="flex items-center space-x-2">
                                                        <Users className="w-5 h-5 text-[#003B2C]" />
                                                        <span className="text-sm font-semibold text-[#003B2C]">
                                                            User Action Required
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Data Flow */}
                                            {step.data && (
                                                <div className="px-6 py-4 bg-[#F0F0F0]/20 border-b border-[#F0F0F0]">
                                                    <div className="flex items-start space-x-3">
                                                        <Database className="w-5 h-5 text-[#003B2C] mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <div className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Data Flow</div>
                                                            <div className="text-sm text-[#003B2C]">{step.data}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Additional Step Details */}
                                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Step Duration/Status */}
                                                    <div className="flex items-start space-x-2">
                                                        <Activity className="w-4 h-4 text-[#003B2C] mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Status</div>
                                                            <div className="text-sm text-gray-900">
                                                                {isPaused ? 'Paused' : 'Processing'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Step Position */}
                                                    <div className="flex items-start space-x-2">
                                                        <Target className="w-4 h-4 text-[#003B2C] mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Progress</div>
                                                            <div className="text-sm text-gray-900">
                                                                Step {activeStepIndex + 1} of {selectedWorkflow.steps.length}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Agent Count Summary */}
                                                {step.agents && step.agents.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <div className="flex items-center space-x-2">
                                                            <Network className="w-4 h-4 text-[#003B2C]" />
                                                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                                                {step.agents.length} AI Agent{step.agents.length !== 1 ? 's' : ''} {step.agents.length > 1 ? 'collaborating' : 'working'} on this step
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    );
                                })()}
                            </motion.div>
                        ) : selectedWorkflow && selectedWorkflow.steps && activeStepIndex >= selectedWorkflow.steps.length ? (
                            /* Final Result */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-green-50 to-[#F0F0F0]/30 rounded-xl border-2 border-green-300 shadow-lg p-6"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <Sparkles className="w-6 h-6 text-green-600" />
                                    <h3 className="text-xl font-bold text-gray-900">Result Delivered</h3>
                                </div>
                                <p className="text-gray-700 mb-4 text-lg">{selectedWorkflow.result}</p>
                                <div className="flex items-center space-x-2 text-sm text-green-800 pt-4 border-t border-green-200">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">
                                        Workflow completed with {selectedWorkflow.steps.reduce((acc, step) => acc + step.agents.length, 0)} agent interaction{selectedWorkflow.steps.reduce((acc, step) => acc + step.agents.length, 0) !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </motion.div>
                        ) : (
                            /* Initial State - No Step Selected */
                            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-12 text-center">
                                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to View Workflow</h3>
                                <p className="text-gray-500">Animation will start automatically</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
