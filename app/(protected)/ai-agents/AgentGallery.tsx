'use client';

import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    BarChart3,
    Brain,
    Calculator,
    Calendar,
    CheckCircle,
    Cloud,
    Database,
    Eye,
    FileText,
    Layers,
    Network,
    PieChart,
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
import { useState } from 'react';

interface Agent {
    id: string;
    name: string;
    abbreviation: string;
    category: 'orchestrator' | 'super' | 'utility';
    description: string;
    icon: any;
    responsibilities: string[];
    status: 'active' | 'idle'; // active = used in workflows, idle = not used
    workflows: string[]; // Which workflows use this agent
    sapAlternative?: boolean;
}

// Define all FP&A workflows in the platform
export const workflows = [
    {
        id: 'home-dashboard',
        name: 'Home Dashboard & Personalized Insights',
        description: 'AI-powered personalized insights and KPIs delivered to users',
        agents: ['orchestrator', 'id', 'pd', 'kd', 'ha', 'ds']
    },
    {
        id: 'executive-summary',
        name: 'Executive Summary',
        description: 'High-level executive dashboard with KPIs, insights, and narratives',
        agents: ['orchestrator', 'id', 'pd', 'kd', 'mc', 'vc', 'vr', 'ha', 'ds', 'sf-analyzer']
    },
    {
        id: 'monthly-report',
        name: 'Monthly Operating Report (MOR)',
        description: 'Comprehensive monthly financial reporting and analysis',
        agents: ['orchestrator', 'id', 'pd', 'vr', 'vc', 'mc', 'or', 'mr']
    },
    {
        id: 'business-consoles',
        name: 'Business Insight Consoles',
        description: 'Specialized analytics consoles for different business dimensions',
        agents: ['orchestrator', 'id', 'bd', 'vd', 'pg-gap', 'si', 'sf-analyzer', 'ds', 'ha', 'mra']
    },
    {
        id: 'budget-planning',
        name: 'Budget Planning & Management',
        description: 'Budget creation, consolidation, validation, and variance analysis',
        agents: ['orchestrator', 'bt', 'bl', 'bc', 'bv', 'bva', 'vc', 'vr', 'pc']
    },
    {
        id: 'forecasting',
        name: 'Forecasting Workflows',
        description: 'Bottom-up forecasting, rolling forecasts, and forecast accuracy tracking',
        agents: ['orchestrator', 'bf', 'fc', 'fe', 'fr', 'fu', 'fa', 'ef', 'id']
    },
    {
        id: 'scenario-modeling',
        name: 'Scenario Modeling & What-If Analysis',
        description: 'Create and analyze scenarios, long-range planning scenarios',
        agents: ['orchestrator', 'sm', 'sp', 'sf', 'sv', 'sm-lr', 'is', 'mra']
    },
    {
        id: 'long-range-planning',
        name: 'Long Range Planning (LRP)',
        description: 'Multi-year planning, roll-forward, and template management',
        agents: ['orchestrator', 'tm', 'lr', 'sm-lr', 'lf', 'pg', 'ip']
    },
    {
        id: 'integrated-planning',
        name: 'Connected Enterprise Planning',
        description: 'Integrated planning across functions and departments',
        agents: ['orchestrator', 'ip', 'id', 'is', 'pc', 'pg']
    },
    {
        id: 'report-hub',
        name: 'Report Hub & Distribution',
        description: 'Report publishing, distribution, and management',
        agents: ['orchestrator', 'mr', 'or', 'kd', 'pc']
    },
    {
        id: 'month-end-close',
        name: 'Month-end Close Process',
        description: 'Month-end closing activities, adjustments, and commentary',
        agents: ['orchestrator', 'id', 'pd', 'mc', 'vc', 'ca', 'ap']
    },
    {
        id: 'ad-hoc-analysis',
        name: 'Ad Hoc Analysis & Reporting',
        description: 'On-demand analysis, custom reports, and flexible queries',
        agents: ['orchestrator', 'ha', 'ds', 'mra', 'or']
    },
    {
        id: 'action-planning',
        name: 'Action Planning & Execution',
        description: 'Action plan creation, tracking, and corrective actions',
        agents: ['orchestrator', 'ap', 'ca', 'ds', 'pg-gap']
    },
    {
        id: 'annual-planning',
        name: 'Annual Planning & Review',
        description: 'Annual plan creation, review, and approval',
        agents: ['orchestrator', 'ap-reviewer', 'bt', 'pc', 'pg', 'ip']
    },
    {
        id: 'specialized-planning',
        name: 'Specialized Planning (CAPEX, OPEX, Revenue)',
        description: 'CAPEX planning, OPEX planning, Revenue & Workforce planning',
        agents: ['orchestrator', 'ci', 'op', 'rw', 'id']
    }
];

// FP&A-specific agents based on the platform requirements
const agents: Agent[] = [
    // Orchestrator Agent - Used in ALL workflows
    {
        id: 'orchestrator',
        name: 'Orchestrator Agent',
        abbreviation: 'OR',
        category: 'orchestrator',
        description: 'Coordinates and executes plans by invoking other agents, manages overall workflow orchestration',
        icon: Network,
        responsibilities: [
            'Coordinate multi-agent workflows',
            'Route requests to appropriate agents',
            'Manage agent lifecycle and priorities',
            'Ensure end-to-end process completion'
        ],
        status: 'active',
        workflows: workflows.map(w => w.id)
    },
    // Super Agents
    {
        id: 'bt',
        name: 'Budget Template Manager',
        abbreviation: 'BT',
        category: 'super',
        description: 'Generates and creates budget template management',
        icon: FileText,
        responsibilities: [
            'Create and manage budget templates',
            'Define budget structures and hierarchies',
            'Maintain template consistency',
            'Support multi-dimensional budgeting'
        ],
        status: 'active',
        workflows: ['budget-planning', 'annual-planning']
    },
    {
        id: 'pc',
        name: 'Plan Communication Manager',
        abbreviation: 'PC',
        category: 'super',
        description: 'Generates and creates plan communication management',
        icon: Sparkles,
        responsibilities: [
            'Coordinate plan communications',
            'Distribute planning documents',
            'Manage stakeholder notifications',
            'Track communication status'
        ],
        status: 'active',
        workflows: ['budget-planning', 'integrated-planning', 'annual-planning', 'report-hub']
    },
    {
        id: 'pg',
        name: 'Planning Guideline Manager',
        abbreviation: 'PG',
        category: 'super',
        description: 'Generates and creates planning guideline management',
        icon: Target,
        responsibilities: [
            'Define planning guidelines',
            'Enforce planning policies',
            'Maintain planning standards',
            'Guide users through planning processes'
        ],
        status: 'active',
        workflows: ['long-range-planning', 'integrated-planning', 'annual-planning'],
        sapAlternative: true
    },
    {
        id: 'tm',
        name: 'LR Template Manager',
        abbreviation: 'TM',
        category: 'super',
        description: 'Generates and creates LRP template management',
        icon: Layers,
        responsibilities: [
            'Manage Long-Range Plan templates',
            'Maintain LRP structure',
            'Support multi-year planning',
            'Ensure template compliance'
        ],
        status: 'active',
        workflows: ['long-range-planning']
    },
    {
        id: 'lr',
        name: 'LRP Roll-Forward Manager',
        abbreviation: 'LR',
        category: 'super',
        description: 'Reviews and validates LRP roll-forward management',
        icon: TrendingUp,
        responsibilities: [
            'Execute roll-forward processes',
            'Validate roll-forward data',
            'Maintain historical continuity',
            'Support annual planning cycles'
        ],
        status: 'active',
        workflows: ['long-range-planning']
    },
    // Utility Agents - Budget & Planning
    {
        id: 'bc',
        name: 'Budget Consolidator',
        abbreviation: 'BC',
        category: 'utility',
        description: 'Generates and creates budget consolidator',
        icon: Layers,
        responsibilities: [
            'Consolidate budgets across entities',
            'Handle currency conversions',
            'Resolve intercompany eliminations',
            'Generate consolidated reports'
        ],
        status: 'active',
        workflows: ['budget-planning']
    },
    {
        id: 'bl',
        name: 'Budget Loader',
        abbreviation: 'BL',
        category: 'utility',
        description: 'Reviews and validates budget loader',
        icon: Database,
        responsibilities: [
            'Load budget data from sources',
            'Validate data integrity',
            'Transform data formats',
            'Handle data exceptions'
        ],
        status: 'active',
        workflows: ['budget-planning']
    },
    {
        id: 'bv',
        name: 'Budget Validator',
        abbreviation: 'BV',
        category: 'utility',
        description: 'Reviews and validates budget validation',
        icon: CheckCircle,
        responsibilities: [
            'Validate budget completeness',
            'Check budget constraints',
            'Verify approval workflows',
            'Ensure compliance with guidelines'
        ],
        status: 'active',
        workflows: ['budget-planning']
    },
    {
        id: 'bva',
        name: 'Budget Variance Analyzer',
        abbreviation: 'BV',
        category: 'utility',
        description: 'Reviews and validates budget variance analysis',
        icon: TrendingDown,
        responsibilities: [
            'Calculate budget variances',
            'Identify variance drivers',
            'Analyze variance trends',
            'Generate variance reports'
        ],
        status: 'active',
        workflows: ['budget-planning']
    },
    // Utility Agents - Forecasting
    {
        id: 'bf',
        name: 'Bottom-Up Forecaster',
        abbreviation: 'BF',
        category: 'utility',
        description: 'Reviews and validates bottom-up forecaster',
        icon: TrendingUp,
        responsibilities: [
            'Process bottom-up forecasts',
            'Aggregate detail-level forecasts',
            'Validate forecast assumptions',
            'Support driver-based forecasting'
        ],
        status: 'active',
        workflows: ['forecasting'],
        sapAlternative: true
    },
    {
        id: 'fc',
        name: 'Forecast Consolidator',
        abbreviation: 'FC',
        category: 'utility',
        description: 'Generates and creates forecast consolidator',
        icon: Layers,
        responsibilities: [
            'Consolidate forecasts across dimensions',
            'Handle forecast hierarchies',
            'Resolve forecast conflicts',
            'Generate consolidated forecasts'
        ],
        status: 'active',
        workflows: ['forecasting'],
        sapAlternative: true
    },
    {
        id: 'fe',
        name: 'Forecast Engine',
        abbreviation: 'FE',
        category: 'utility',
        description: 'Generates and creates forecast engine',
        icon: Zap,
        responsibilities: [
            'Execute forecast models',
            'Apply forecast algorithms',
            'Process time-series data',
            'Generate forecast outputs'
        ],
        status: 'active',
        workflows: ['forecasting'],
        sapAlternative: true
    },
    {
        id: 'fr',
        name: 'Forecast Reviewer',
        abbreviation: 'FR',
        category: 'utility',
        description: 'Reviews and validates forecast reviews',
        icon: Eye,
        responsibilities: [
            'Review forecast accuracy',
            'Validate forecast assumptions',
            'Check forecast completeness',
            'Approve forecast submissions'
        ],
        status: 'active',
        workflows: ['forecasting'],
        sapAlternative: true
    },
    {
        id: 'fu',
        name: 'Forecast Updater',
        abbreviation: 'FU',
        category: 'utility',
        description: 'Reviews and validates forecast updater',
        icon: Activity,
        responsibilities: [
            'Update forecast data',
            'Handle forecast revisions',
            'Maintain forecast history',
            'Sync forecast changes'
        ],
        status: 'active',
        workflows: ['forecasting'],
        sapAlternative: true
    },
    {
        id: 'fa',
        name: 'Forecast Accuracy Tracker',
        abbreviation: 'FA',
        category: 'utility',
        description: 'Monitors and tracks forecast accuracy tracking',
        icon: Target,
        responsibilities: [
            'Track forecast vs actual performance',
            'Calculate accuracy metrics',
            'Identify accuracy trends',
            'Generate accuracy reports'
        ],
        status: 'idle', // Not currently used in workflows
        workflows: [],
        sapAlternative: true
    },
    {
        id: 'ef',
        name: 'Event Forecast Modeler',
        abbreviation: 'EF',
        category: 'utility',
        description: 'Reviews and validates event forecast modeler',
        icon: Calendar,
        responsibilities: [
            'Model event-based forecasts',
            'Incorporate external events',
            'Adjust forecasts for events',
            'Track event impacts'
        ],
        status: 'idle', // Not currently used in workflows
        workflows: [],
        sapAlternative: true
    },
    // Utility Agents - Scenarios
    {
        id: 'sm',
        name: 'Scenario Modeler',
        abbreviation: 'SM',
        category: 'utility',
        description: 'Generates and creates scenario modeler',
        icon: PieChart,
        responsibilities: [
            'Create scenario models',
            'Apply what-if rules',
            'Execute scenario simulations',
            'Compare scenario outcomes'
        ],
        status: 'active',
        workflows: ['scenario-modeling']
    },
    {
        id: 'sm-lr',
        name: 'LR Scenario Modeler',
        abbreviation: 'SM',
        category: 'utility',
        description: 'Processes and handles LR scenario modeler',
        icon: PieChart,
        responsibilities: [
            'Model long-range scenarios',
            'Support multi-year scenarios',
            'Handle scenario complexity',
            'Generate scenario reports'
        ],
        status: 'active',
        workflows: ['scenario-modeling', 'long-range-planning']
    },
    {
        id: 'sp',
        name: 'Scenario Parameter Definer',
        abbreviation: 'SP',
        category: 'utility',
        description: 'Manages scenario parameter definer',
        icon: Settings,
        responsibilities: [
            'Define scenario parameters',
            'Set parameter ranges',
            'Manage parameter dependencies',
            'Validate parameter values'
        ],
        status: 'active',
        workflows: ['scenario-modeling']
    },
    {
        id: 'sf',
        name: 'Scenario Finalizer',
        abbreviation: 'SF',
        category: 'utility',
        description: 'Generates and creates scenario finalizer',
        icon: CheckCircle,
        responsibilities: [
            'Finalize scenario selections',
            'Lock scenario versions',
            'Generate final scenario outputs',
            'Archive scenario data'
        ],
        status: 'active',
        workflows: ['scenario-modeling']
    },
    {
        id: 'sv',
        name: 'Scenario Validator',
        abbreviation: 'SV',
        category: 'utility',
        description: 'Reviews and validates scenario validation',
        icon: Shield,
        responsibilities: [
            'Validate scenario completeness',
            'Check scenario consistency',
            'Verify scenario assumptions',
            'Approve scenario outputs'
        ],
        status: 'active',
        workflows: ['scenario-modeling']
    },
    {
        id: 'is',
        name: 'IEP Scenario Definer',
        abbreviation: 'IS',
        category: 'utility',
        description: 'Generates and creates IEP scenario definer',
        icon: Target,
        responsibilities: [
            'Define Integrated Enterprise Planning scenarios',
            'Link scenarios across functions',
            'Support cross-functional planning',
            'Maintain scenario relationships'
        ],
        status: 'active',
        workflows: ['scenario-modeling', 'integrated-planning']
    },
    {
        id: 'lf',
        name: 'LRP Finalizer',
        abbreviation: 'LF',
        category: 'utility',
        description: 'Reviews and validates LRP finalizer',
        icon: CheckCircle,
        responsibilities: [
            'Finalize long-range plans',
            'Lock LRP versions',
            'Generate final LRP outputs',
            'Archive LRP data'
        ],
        status: 'active',
        workflows: ['long-range-planning']
    },
    // Utility Agents - Analysis & Reporting
    {
        id: 'ha',
        name: 'Ad Hoc Analyzer',
        abbreviation: 'HA',
        category: 'utility',
        description: 'Reviews and validates ad hoc analysis',
        icon: Search,
        responsibilities: [
            'Execute ad hoc queries',
            'Analyze on-demand data',
            'Generate custom reports',
            'Support flexible analysis'
        ],
        status: 'active',
        workflows: ['home-dashboard', 'executive-summary', 'business-consoles', 'ad-hoc-analysis']
    },
    {
        id: 'bd',
        name: 'Business Driver Analyzer',
        abbreviation: 'BD',
        category: 'utility',
        description: 'Reviews and validates business driver analysis',
        icon: TrendingUp,
        responsibilities: [
            'Identify key business drivers',
            'Analyze driver relationships',
            'Quantify driver impacts',
            'Generate driver insights'
        ],
        status: 'active',
        workflows: ['business-consoles']
    },
    {
        id: 'vd',
        name: 'Value Driver Analyzer',
        abbreviation: 'VD',
        category: 'utility',
        description: 'Reviews and validates value driver analysis',
        icon: Sparkles,
        responsibilities: [
            'Analyze value drivers',
            'Link drivers to value creation',
            'Optimize driver mix',
            'Track driver performance'
        ],
        status: 'active',
        workflows: ['business-consoles']
    },
    {
        id: 'pg-gap',
        name: 'Performance Gap Analyzer',
        abbreviation: 'PG',
        category: 'utility',
        description: 'Reviews and validates performance gap analysis',
        icon: TrendingDown,
        responsibilities: [
            'Identify performance gaps',
            'Analyze gap causes',
            'Quantify gap impacts',
            'Recommend gap closure actions'
        ],
        status: 'active',
        workflows: ['business-consoles', 'action-planning']
    },
    {
        id: 'sf-analyzer',
        name: 'Strategic Financial Analyzer',
        abbreviation: 'SF',
        category: 'utility',
        description: 'Reviews and validates strategic financial analysis',
        icon: BarChart3,
        responsibilities: [
            'Analyze strategic financial metrics',
            'Evaluate strategic options',
            'Assess financial implications',
            'Support strategic decision-making'
        ],
        status: 'active',
        workflows: ['executive-summary', 'business-consoles']
    },
    {
        id: 'si',
        name: 'Strategic Initiative Analyzer',
        abbreviation: 'SI',
        category: 'utility',
        description: 'Reviews and validates strategic initiative analysis',
        icon: Target,
        responsibilities: [
            'Analyze strategic initiatives',
            'Assess initiative ROI',
            'Track initiative progress',
            'Generate initiative reports'
        ],
        status: 'active',
        workflows: ['business-consoles']
    },
    {
        id: 'ds',
        name: 'Decision Support Analyst',
        abbreviation: 'DS',
        category: 'utility',
        description: 'Generates and creates decision support analyst',
        icon: Brain,
        responsibilities: [
            'Provide decision support data',
            'Analyze decision alternatives',
            'Generate decision insights',
            'Recommend optimal decisions'
        ],
        status: 'active',
        workflows: ['home-dashboard', 'executive-summary', 'business-consoles', 'ad-hoc-analysis', 'action-planning']
    },
    {
        id: 'mra',
        name: 'Model Results Analyzer',
        abbreviation: 'MR',
        category: 'utility',
        description: 'Reviews and validates model results analysis',
        icon: BarChart3,
        responsibilities: [
            'Analyze model outputs',
            'Validate model results',
            'Interpret model findings',
            'Generate result summaries'
        ],
        status: 'active',
        workflows: ['business-consoles', 'scenario-modeling', 'ad-hoc-analysis']
    },
    // Utility Agents - Data & Integration
    {
        id: 'id',
        name: 'Integrated Data Aggregator',
        abbreviation: 'ID',
        category: 'utility',
        description: 'Manages integrated data aggregator',
        icon: Database,
        responsibilities: [
            'Aggregate data from multiple sources',
            'Integrate disparate data systems',
            'Maintain data consistency',
            'Support unified data views'
        ],
        status: 'active',
        workflows: ['home-dashboard', 'executive-summary', 'monthly-report', 'forecasting', 'integrated-planning', 'month-end-close', 'specialized-planning']
    },
    {
        id: 'ip',
        name: 'Integrated Plan Builder',
        abbreviation: 'IP',
        category: 'utility',
        description: 'Generates and creates integrated plan building',
        icon: Layers,
        responsibilities: [
            'Build integrated plans',
            'Link plans across functions',
            'Synchronize planning data',
            'Maintain plan dependencies'
        ],
        status: 'active',
        workflows: ['long-range-planning', 'integrated-planning', 'annual-planning']
    },
    {
        id: 'pd',
        name: 'Performance Data Consolidator',
        abbreviation: 'PD',
        category: 'utility',
        description: 'Reviews and validates performance data consolidator',
        icon: Layers,
        responsibilities: [
            'Consolidate performance data',
            'Aggregate KPI metrics',
            'Handle data hierarchies',
            'Generate consolidated views'
        ],
        status: 'active',
        workflows: ['home-dashboard', 'executive-summary', 'monthly-report', 'month-end-close']
    },
    // Utility Agents - Reporting & Commentary
    {
        id: 'mc',
        name: 'Management Commentary Writer',
        abbreviation: 'MC',
        category: 'utility',
        description: 'Generates and creates management commentary writer',
        icon: FileText,
        responsibilities: [
            'Generate management commentary',
            'Write narrative explanations',
            'Summarize key findings',
            'Format commentary for reports'
        ],
        status: 'active',
        workflows: ['executive-summary', 'monthly-report', 'month-end-close']
    },
    {
        id: 'vc',
        name: 'Variance Commentator',
        abbreviation: 'VC',
        category: 'utility',
        description: 'Manages variance commentator',
        icon: FileText,
        responsibilities: [
            'Generate variance commentary',
            'Explain variance causes',
            'Provide variance context',
            'Format variance narratives'
        ],
        status: 'active',
        workflows: ['executive-summary', 'monthly-report', 'budget-planning', 'month-end-close']
    },
    {
        id: 'vr',
        name: 'Variance Reporting Analyst',
        abbreviation: 'VR',
        category: 'utility',
        description: 'Generates and creates variance reporting analyst',
        icon: BarChart3,
        responsibilities: [
            'Generate variance reports',
            'Analyze variance trends',
            'Create variance visualizations',
            'Distribute variance reports'
        ],
        status: 'active',
        workflows: ['executive-summary', 'monthly-report', 'budget-planning']
    },
    {
        id: 'mr',
        name: 'Model Report Publisher',
        abbreviation: 'MR',
        category: 'utility',
        description: 'Generates and creates model report publisher',
        icon: FileText,
        responsibilities: [
            'Publish model reports',
            'Format report outputs',
            'Distribute reports to stakeholders',
            'Maintain report archives'
        ],
        status: 'active',
        workflows: ['monthly-report', 'report-hub']
    },
    {
        id: 'or',
        name: 'Operational Reporter',
        abbreviation: 'OR',
        category: 'utility',
        description: 'Generates and creates operational reporter',
        icon: Activity,
        responsibilities: [
            'Generate operational reports',
            'Track operational metrics',
            'Create operational dashboards',
            'Distribute operational insights'
        ],
        status: 'active',
        workflows: ['monthly-report', 'report-hub', 'ad-hoc-analysis']
    },
    {
        id: 'kd',
        name: 'KPI Dashboard Builder',
        abbreviation: 'KD',
        category: 'utility',
        description: 'Generates and creates KPI dashboard building',
        icon: BarChart3,
        responsibilities: [
            'Build KPI dashboards',
            'Define dashboard layouts',
            'Configure KPI visualizations',
            'Maintain dashboard updates'
        ],
        status: 'active',
        workflows: ['home-dashboard', 'executive-summary', 'report-hub']
    },
    // Utility Agents - Specialized Planning
    {
        id: 'ap',
        name: 'Action Plan Builder',
        abbreviation: 'AP',
        category: 'utility',
        description: 'Generates and creates action plan building',
        icon: Target,
        responsibilities: [
            'Build action plans',
            'Define action items',
            'Link actions to objectives',
            'Track action progress'
        ],
        status: 'active',
        workflows: ['action-planning', 'month-end-close']
    },
    {
        id: 'ap-reviewer',
        name: 'Annual Plan Reviewer',
        abbreviation: 'AP',
        category: 'utility',
        description: 'Reviews and validates annual plan reviews',
        icon: Eye,
        responsibilities: [
            'Review annual plans',
            'Validate plan completeness',
            'Check plan compliance',
            'Approve annual plans'
        ],
        status: 'active',
        workflows: ['annual-planning']
    },
    {
        id: 'ci',
        name: 'CAPEX & Investment Planner',
        abbreviation: 'CI',
        category: 'utility',
        description: 'Optimizes and improves CAPEX & investment planner',
        icon: Calculator,
        responsibilities: [
            'Plan capital expenditures',
            'Analyze investment options',
            'Optimize capital allocation',
            'Track CAPEX performance'
        ],
        status: 'active',
        workflows: ['specialized-planning']
    },
    {
        id: 'op',
        name: 'OPEX Planner',
        abbreviation: 'OP',
        category: 'utility',
        description: 'Optimizes and improves OPEX planner',
        icon: Calculator,
        responsibilities: [
            'Plan operating expenses',
            'Optimize OPEX allocation',
            'Track OPEX trends',
            'Support OPEX forecasting'
        ],
        status: 'active',
        workflows: ['specialized-planning']
    },
    {
        id: 'rw',
        name: 'Revenue & Workforce Planner',
        abbreviation: 'RW',
        category: 'utility',
        description: 'Optimizes and improves revenue & workforce planner',
        icon: Users,
        responsibilities: [
            'Plan revenue streams',
            'Plan workforce requirements',
            'Link revenue to workforce',
            'Optimize resource allocation'
        ],
        status: 'active',
        workflows: ['specialized-planning']
    },
    {
        id: 'ca',
        name: 'Corrective Action Identifier',
        abbreviation: 'CA',
        category: 'utility',
        description: 'Manages corrective action identifier',
        icon: Target,
        responsibilities: [
            'Identify needed corrective actions',
            'Prioritize action items',
            'Track action implementation',
            'Monitor action effectiveness'
        ],
        status: 'active',
        workflows: ['action-planning', 'month-end-close']
    }
];

const categoryColors = {
    orchestrator: 'from-[#003B2C] to-[#003B2C]',
    super: 'from-[#003B2C] to-[#003B2C]',
    utility: 'from-[#007A3D] to-[#003B2C]'
};

const statusColors = {
    active: 'bg-green-500',
    idle: 'bg-gray-400'
};

export default function AgentGallery() {
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [filterCategory, setFilterCategory] = useState<'all' | 'orchestrator' | 'super' | 'utility'>('all');

    const filteredAgents = filterCategory === 'all' 
        ? agents 
        : agents.filter(agent => agent.category === filterCategory);

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
                        <Brain className="w-6 h-6 text-[#003B2C]" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delta Agent Ecosystem</h2>
                        <p className="text-gray-600 mb-4">
                            Our platform is powered by a sophisticated network of AI agents specifically designed for Financial Planning & Analysis (FP&A). 
                            These digital team members operate across budgeting, forecasting, scenario modeling, and reporting functions, 
                            transforming Finance from batch-driven processes to continuous, machine-assisted operations.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            <div className="p-4 bg-[#F0F0F0]/30 rounded-lg">
                                <div className="text-2xl font-bold text-[#003B2C]">1</div>
                                <div className="text-sm font-medium text-gray-700 mt-1">Orchestrator</div>
                                <div className="text-xs text-gray-500">Coordinates all workflows</div>
                            </div>
                            <div className="p-4 bg-[#F0F0F0] rounded-lg">
                                <div className="text-2xl font-bold text-[#003B2C]">5</div>
                                <div className="text-sm font-medium text-gray-700 mt-1">Super Agents</div>
                                <div className="text-xs text-gray-500">Handle complex operations</div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-lg">
                                <div className="text-2xl font-bold text-[#003B2C]">{agents.filter(a => a.category === 'utility' && a.status === 'active').length}</div>
                                <div className="text-sm font-medium text-gray-700 mt-1">Active Utility</div>
                                <div className="text-xs text-gray-500">Used in workflows</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600">{agents.filter(a => a.status === 'idle').length}</div>
                                <div className="text-sm font-medium text-gray-700 mt-1">Available Agents</div>
                                <div className="text-xs text-gray-500">Not yet in workflows</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-[#F0F0F0] rounded-lg border border-[#003B2C]/20">
                            <p className="text-sm text-[#003B2C]">
                                <strong>Status Indicators:</strong> <span className="inline-block w-3 h-3 rounded-full bg-green-500 ml-2 mr-1"></span> Green = Used in workflows | <span className="inline-block w-3 h-3 rounded-full bg-gray-400 ml-2 mr-1"></span> Grey = Available but not yet used
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Category Filter */}
            <div className="flex space-x-2">
                {(['all', 'orchestrator', 'super', 'utility'] as const).map((category) => (
                    <button
                        key={category}
                        onClick={() => setFilterCategory(category)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            filterCategory === category
                                ? 'bg-[#003B2C] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        {category === 'all' ? 'All Agents' : category.charAt(0).toUpperCase() + category.slice(1) + ' Agents'}
                    </button>
                ))}
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent, index) => {
                    const Icon = agent.icon;
                    return (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => setSelectedAgent(agent)}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-200 overflow-hidden group"
                        >
                            <div className={`h-2 bg-gradient-to-r ${categoryColors[agent.category]}`} />
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 bg-gradient-to-br ${categoryColors[agent.category]} rounded-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${statusColors[agent.status]}`} title={agent.status === 'active' ? 'Used in workflows' : 'Available but not used'} />
                                        {agent.sapAlternative && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">SAP Alt</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-gray-400 mb-1">{agent.abbreviation}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{agent.name}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agent.description}</p>
                                {agent.workflows.length > 0 && (
                                    <div className="mb-3">
                                        <div className="text-xs text-gray-500 mb-1">Used in {agent.workflows.length} workflow{agent.workflows.length !== 1 ? 's' : ''}</div>
                                    </div>
                                )}
                                <div className="flex items-center text-[#003B2C] text-sm font-medium group-hover:gap-2 transition-all">
                                    <span>View Details</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Agent Detail Modal */}
            {selectedAgent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedAgent(null)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className={`h-2 bg-gradient-to-r ${categoryColors[selectedAgent.category]}`} />
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-4 bg-gradient-to-br ${categoryColors[selectedAgent.category]} rounded-xl`}>
                                        {(() => {
                                            const Icon = selectedAgent.icon;
                                            return <Icon className="w-8 h-8 text-white" />;
                                        })()}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 mb-1">{selectedAgent.abbreviation}</div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedAgent.name}</h2>
                                        <p className="text-sm text-gray-500 capitalize mt-1">{selectedAgent.category} Agent</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAgent(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                                    <p className="text-gray-600">{selectedAgent.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Key Responsibilities</h3>
                                    <ul className="space-y-2">
                                        {selectedAgent.responsibilities.map((resp, idx) => (
                                            <li key={idx} className="flex items-start space-x-2">
                                                <CheckCircle className="w-5 h-5 text-[#003B2C] mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600">{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Status</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-3 h-3 rounded-full ${statusColors[selectedAgent.status]}`} />
                                            <span className="text-gray-600 capitalize">{selectedAgent.status === 'active' ? 'Used in workflows' : 'Available but not used'}</span>
                                        </div>
                                    </div>
                                    {selectedAgent.sapAlternative && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Integration</h3>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">SAP Alternative</span>
                                        </div>
                                    )}
                                </div>

                                {selectedAgent.workflows.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Used in Workflows</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedAgent.workflows.map((workflowId) => {
                                                const workflow = workflows.find(w => w.id === workflowId);
                                                return workflow ? (
                                                    <span key={workflowId} className="px-3 py-1 bg-[#F0F0F0] text-[#003B2C] text-sm rounded-full">
                                                        {workflow.name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
