'use client';

import { motion } from 'framer-motion';
import {
    BarChart3,
    Brain,
    Calculator,
    Cloud,
    Database,
    FileText,
    Globe,
    Layers,
    Server,
    Shield,
    Sparkles,
    Target,
    Zap,
    Eye,
    Lock,
} from 'lucide-react';

interface Technology {
    name: string;
    icon: any;
}

interface TechLayer {
    name: string;
    description: string;
    technologies: Technology[];
    gradient: string;
}

interface StrategicPillar {
    name: string;
    description: string;
    icon: any;
}

const techLayers: TechLayer[] = [
    {
        name: 'Experience Layer',
        description: 'Web app, BI reports, and EPM modules — the finance front door',
        technologies: [
            { name: 'Next.js 14', icon: Globe },
            { name: 'Recharts', icon: BarChart3 },
            { name: 'Tailwind CSS', icon: Eye },
        ],
        gradient: 'from-[#003B2C] to-[#003B2C]',
    },
    {
        name: 'Cognitive and Orchestration',
        description: 'AI/ML capabilities powering insight generation and chat',
        technologies: [
            { name: 'Anthropic Claude', icon: Brain },
            { name: 'Vercel AI SDK', icon: Sparkles },
            { name: 'Semantic Model', icon: Zap },
        ],
        gradient: 'from-[#003B2C] to-[#007A3D]',
    },
    {
        name: 'Integration & Data Layer',
        description: 'ORM, data access, and semantic model for querying structured data',
        technologies: [
            { name: 'Prisma ORM', icon: Database },
            { name: 'Neon Postgres', icon: Cloud },
        ],
        gradient: 'from-[#003B2C] to-[#003B2C]',
    },
    {
        name: 'Native Finance Apps',
        description: 'Fit-for-purpose finance solutions and planning tools',
        technologies: [
            { name: 'Anaplan', icon: Calculator },
            { name: 'SAP / Oracle ERP', icon: Server },
            { name: 'Blackline', icon: Shield },
        ],
        gradient: 'from-[#007A3D] to-[#003B2C]',
    },
    {
        name: 'Enterprise Core Systems',
        description: 'Systems of record for enterprise data (ERP, CRM, POS)',
        technologies: [
            { name: 'Oracle ERP', icon: Database },
            { name: 'Salesforce CRM', icon: Server },
        ],
        gradient: 'from-[#003B2C] to-[#003B2C]',
    },
];

const strategicPillars: StrategicPillar[] = [
    {
        name: 'Deliver Finance Front Door',
        description: 'Enable diverse consumers through a common, adaptable experience layer developed on top of a trusted foundation',
        icon: Target,
    },
    {
        name: 'Define AI-First Architecture',
        description: 'Architect Data Products to accelerate activation of AI outcomes and generate operational efficiency and cost savings',
        icon: Brain,
    },
    {
        name: 'Prototype Foundational Data Hub',
        description: 'Agile development of data products with effective collaboration between Business, Tech, AI and Data teams',
        icon: Database,
    },
    {
        name: 'Document Core Data',
        description: 'Composable architecture with plug-and-play apps for planning, forecasting, consolidation, and analysis',
        icon: FileText,
    },
    {
        name: 'Design Trust Into Governance',
        description: 'Secure, explainable and governed data. Resilience against disruption, with full compliance and auditability',
        icon: Lock,
    },
];

export default function TechStack() {
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
                        <Layers className="w-6 h-6 text-[#003B2C]" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Delta — Enabled by the Modern Digital Core
                        </h2>
                        <p className="text-gray-600">
                            The Digital Core isn&apos;t just systems — it&apos;s the finance brain: one truth, AI-first, modular, and always-on.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                            {techLayers.map((layer) => (
                                <div key={layer.name} className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-[#003B2C]">{layer.technologies.length}</div>
                                    <div className="text-xs text-gray-500 mt-1">{layer.name.split(' ')[0]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content: Layers + Pillars */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tech Layers - Left Side */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Technology Layers</h3>
                    {techLayers.map((layer, index) => {
                        return (
                            <motion.div
                                key={layer.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
                            >
                                <div className={`h-2 bg-gradient-to-r ${layer.gradient}`} />
                                <div className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-[#003B2C] text-white flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{layer.name}</h4>
                                                <p className="text-sm text-gray-500 mt-0.5">{layer.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4 ml-11">
                                        {layer.technologies.map((tech) => {
                                            const TechIcon = tech.icon;
                                            return (
                                                <div
                                                    key={tech.name}
                                                    className="flex items-center space-x-2 px-3 py-2 bg-[#F0F0F0] rounded-lg"
                                                >
                                                    <TechIcon className="w-4 h-4 text-[#003B2C]" />
                                                    <span className="text-sm font-medium text-[#003B2C]">{tech.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Strategic Pillars - Right Side */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Pillars</h3>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                    >
                        <div className="h-2 bg-gradient-to-r from-[#003B2C] to-[#003B2C]" />
                        <div className="p-5 space-y-0">
                            {strategicPillars.map((pillar, index) => {
                                const PillarIcon = pillar.icon;
                                return (
                                    <div key={pillar.name}>
                                        <div className="flex items-start space-x-3 py-4">
                                            <div className="p-2 bg-gradient-to-br from-[#003B2C] to-[#003B2C] rounded-lg flex-shrink-0">
                                                <PillarIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 text-sm">{pillar.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{pillar.description}</p>
                                            </div>
                                        </div>
                                        {index < strategicPillars.length - 1 && (
                                            <div className="border-b border-gray-100" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-4 p-4 bg-[#F0F0F0]/30 rounded-lg border border-[#003B2C]/10"
                    >
                        <p className="text-xs text-gray-500 italic">
                            *Example applications used across the Finance tech stack. Additional technologies may be considered across these layers as requirements evolve.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
