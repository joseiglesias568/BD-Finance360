'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2, Clock, Database, Layers, Zap, Shield, Users,
  ChevronRight, ArrowRight, AlertCircle, BarChart3, Cpu, Globe,
  FileText, GitBranch, Play, Rocket, TrendingUp, Calendar,
} from 'lucide-react';

interface Deliverable { text: string; critical?: boolean; }
interface PhaseWeek { label: string; activities: string[]; }
interface Phase {
  id: string; number: number; name: string; duration: string; durationShort: string;
  tagline: string; objective: string; deliverables: Deliverable[]; weeks: PhaseWeek[];
  investment: 'Minimal' | 'Low' | 'Medium' | 'High'; accentColor: string; bgColor: string;
  borderColor: string; icon: React.ElementType; dataSourceCount: string; keyRisk: string;
}
interface WorkstreamRow { name: string; icon: React.ElementType; demo: string; poc: string; pilot: string; production: string; }
interface ComplexityFactor { type: string; examples: string; delta: string; complexity: 'Low' | 'Medium' | 'High' | 'Very High'; }

const PHASES: Phase[] = [
  {
    id: 'demo', number: 1, name: 'Demo', duration: '3 – 4 Days', durationShort: '3–4 days',
    tagline: 'Art of the possible',
    objective: 'Deploy a fully branded Finance360 instance with synthetic data to demonstrate the end-to-end capability set — AI insights, scenario modeling, executive dashboards, and agentic workflows — in a live, interactive environment.',
    deliverables: [
      { text: 'Branded Finance360 environment deployed to cloud', critical: true },
      { text: 'Synthetic KPI data seeded across all dashboards' },
      { text: '3–5 executive dashboard modules configured' },
      { text: 'AI Q&A and scenario modeling demo scripts' },
      { text: 'Stakeholder walkthrough and recorded session' },
      { text: 'POC scoping worksheet and data intake template', critical: true },
    ],
    weeks: [
      { label: 'Day 1', activities: ['Cloud deployment', 'Branding & config', 'Credentials setup'] },
      { label: 'Days 2–3', activities: ['Synthetic data seeding', 'Dashboard tuning', 'AI prompt calibration'] },
      { label: 'Day 4', activities: ['Stakeholder walkthrough', 'Feedback session', 'POC scoping'] },
    ],
    investment: 'Minimal', accentColor: '#6B7280', bgColor: 'bg-gray-50', borderColor: 'border-gray-300', icon: Play,
    dataSourceCount: '0 (synthetic)', keyRisk: 'Stakeholder availability for Day 4 walkthrough',
  },
  {
    id: 'poc', number: 2, name: 'Proof of Concept', duration: '3 – 4 Weeks', durationShort: '3–4 weeks',
    tagline: 'Real data, limited scope',
    objective: 'Validate core use cases using client-provided static data extracts from 2–4 priority sources. Deliver a working prototype with real financials, calibrated KPIs, and AI insights grounded in actual BD utility business context.',
    deliverables: [
      { text: '2–4 data sources ingested from client-provided extracts', critical: true },
      { text: 'KPI definitions mapped to AEE data model (EPS, rate base, PISA, FFO/debt)' },
      { text: 'Executive summary and segment dashboards on real data', critical: true },
      { text: 'Scenario modeling calibrated to actual financials' },
      { text: 'AI insights validated against known business narratives' },
      { text: 'User acceptance testing with 3–5 end users' },
      { text: 'POC sign-off and Pilot scoping workshop' },
    ],
    weeks: [
      { label: 'Week 1', activities: ['Data discovery & profiling', 'Extract templates sent', 'Environment provisioning', 'Data intake & mapping'] },
      { label: 'Week 2', activities: ['Data ingestion & QA', 'KPI configuration', 'Dashboard build against real data', 'AI prompt grounding'] },
      { label: 'Week 3', activities: ['Scenario model calibration', 'AI insights validation', 'UAT with end users', 'Refinement iterations'] },
      { label: 'Week 4', activities: ['Stakeholder review', 'POC sign-off', 'Pilot architecture workshop', 'Investment approval'] },
    ],
    investment: 'Low', accentColor: '#F59E0B', bgColor: 'bg-amber-50', borderColor: 'border-amber-300', icon: GitBranch,
    dataSourceCount: '2 – 4 (static extracts)', keyRisk: 'Timely receipt of clean, documented data extracts from client',
  },
  {
    id: 'pilot', number: 3, name: 'Pilot', duration: '3 – 4 Months', durationShort: '3–4 months',
    tagline: 'Live data, defined user group',
    objective: 'Deploy a production-like environment with automated data pipelines, SSO, and the full dashboard and agentic capability suite for a defined pilot user group (15–50 users). Validate operational performance and change management approach.',
    deliverables: [
      { text: '5–8 data source integrations with automated refresh', critical: true },
      { text: 'Production-grade cloud infrastructure (IaC)' },
      { text: 'SSO / enterprise identity integration', critical: true },
      { text: 'Role-based access control (RBAC)' },
      { text: 'Full dashboard and console suite' },
      { text: 'Agentic analytics and AI workflow automation', critical: true },
      { text: 'Data lineage and audit trail' },
      { text: 'Pilot user training and enablement materials' },
      { text: 'Performance testing and security review' },
      { text: 'Lessons learned and Production business case' },
    ],
    weeks: [
      { label: 'Month 1', activities: ['Tech architecture finalization', 'Data pipeline design & build', 'SSO integration', 'RBAC framework', 'Infra-as-code setup'] },
      { label: 'Month 2', activities: ['Core integrations live', 'Automated pipelines tested', 'Full dashboard suite', 'Agentic capabilities build', 'Security hardening'] },
      { label: 'Month 3', activities: ['Pilot go-live (15–50 users)', 'Hypercare support', 'Performance monitoring', 'User training program', 'UAT sign-off'] },
      { label: 'Month 4', activities: ['Optimization sprint', 'Lessons learned', 'Production readiness review', 'Enterprise scaling plan'] },
    ],
    investment: 'Medium', accentColor: '#3B82F6', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', icon: Rocket,
    dataSourceCount: '5 – 8 (automated pipelines)', keyRisk: 'IT/data team availability for integration work and SSO configuration',
  },
  {
    id: 'production', number: 4, name: 'Production', duration: '3 – 4 Quarters', durationShort: '3–4 quarters',
    tagline: 'Enterprise-wide deployment',
    objective: 'Scale to the full enterprise user base with complete data ecosystem integration, advanced agentic capabilities, governance frameworks, and ongoing model optimization. Establish Finance360 as the system of intelligence for BD financial decision-making.',
    deliverables: [
      { text: 'All priority data sources live with SLA-backed pipelines', critical: true },
      { text: 'Enterprise-wide user onboarding and change management' },
      { text: 'Advanced agentic workflows (forecasting, anomaly detection, commentary generation)', critical: true },
      { text: 'Predictive analytics and ML model deployment' },
      { text: 'Data governance, cataloging, and master data management' },
      { text: 'Executive and board-level reporting automation', critical: true },
      { text: 'Continuous model monitoring and retraining pipeline' },
      { text: 'Vendor/partner integrations (SAP write-back, planning tools)' },
      { text: 'Capability expansion roadmap and innovation backlog' },
    ],
    weeks: [
      { label: 'Q1', activities: ['Enterprise integrations', 'Production hardening', 'Full access controls', 'Exec dashboard automation'] },
      { label: 'Q2', activities: ['All use cases deployed', 'Monitoring & alerting live', 'Advanced AI agents', 'Optimization sprint'] },
      { label: 'Q3', activities: ['Predictive analytics', 'ML model deployment', 'Additional use cases', 'Governance framework'] },
      { label: 'Q4', activities: ['Performance review', 'Roadmap planning', 'Capability expansion', 'Value realization report'] },
    ],
    investment: 'High', accentColor: '#1c519c', bgColor: 'bg-gray-900', borderColor: 'border-gray-800', icon: TrendingUp,
    dataSourceCount: '10+ (full ecosystem)', keyRisk: 'Change management, executive sponsorship continuity, data quality at scale',
  },
];

const WORKSTREAMS: WorkstreamRow[] = [
  { name: 'Platform & Infrastructure', icon: Layers, demo: 'Cloud deploy, branding, auth', poc: 'Optimize, staging environment', pilot: 'Production-grade IaC, DR/HA', production: 'Enterprise SLAs, multi-region' },
  { name: 'Data Engineering', icon: Database, demo: 'Synthetic seed data', poc: 'Static extracts → DB ingestion', pilot: 'Automated pipelines, lineage', production: 'Full ecosystem, governance' },
  { name: 'Semantic & KPI Layer', icon: BarChart3, demo: 'Pre-configured metrics', poc: 'Map client data → KPI model', pilot: 'Validated semantic layer', production: 'MDM, certified metrics store' },
  { name: 'UX & Dashboards', icon: FileText, demo: 'Brand config, demo scripts', poc: 'Core dashboards on real data', pilot: 'Full console suite + mobile', production: 'Personalization, self-service' },
  { name: 'Agentic & AI Capabilities', icon: Cpu, demo: 'Scripted AI Q&A demo', poc: 'Grounded insights on real data', pilot: 'Autonomous agents, workflows', production: 'Predictive ML, commentary gen.' },
  { name: 'Security & Governance', icon: Shield, demo: 'Basic auth, demo credentials', poc: 'SSO prep, role design', pilot: 'SSO live, RBAC, audit trail', production: 'Enterprise IAM, data catalog' },
  { name: 'Testing & Quality', icon: CheckCircle2, demo: 'Smoke test, demo rehearsal', poc: 'Data QA, AI validation, UAT', pilot: 'Perf. testing, security review', production: 'Continuous monitoring, SLAs' },
  { name: 'Change Management', icon: Users, demo: 'Stakeholder walkthrough', poc: 'UAT with 3–5 users', pilot: 'Training, pilot community', production: 'Enterprise rollout, CoE' },
];

const COMPLEXITY_FACTORS: ComplexityFactor[] = [
  { type: 'ERP / Financial System', examples: 'SAP S/4HANA, Oracle Fusion, BD legacy GL systems', delta: '+2 – 4 weeks / system', complexity: 'High' },
  { type: 'Orders & Backlog System', examples: 'SAP CS, Oracle CC&B, BD customer information system', delta: '+2 – 4 weeks / system', complexity: 'High' },
  { type: 'Data Warehouse / Lakehouse', examples: 'Snowflake, Databricks, BigQuery, Teradata', delta: '+1 – 3 weeks / platform', complexity: 'Medium' },
  { type: 'Planning & Budgeting Tool', examples: 'Anaplan, SAP BPC, Oracle PBCS, Adaptive Insights', delta: '+2 – 4 weeks / tool', complexity: 'High' },
  { type: 'Field / Operational Systems', examples: 'TPS/MRO systems, SCADA feeds, field service platforms', delta: '+2 – 4 weeks / source', complexity: 'High' },
  { type: 'Legacy / Flat File Systems', examples: 'Mainframe extracts, Excel/CSV, FTP drops', delta: '+3 – 6 weeks / source', complexity: 'Very High' },
  { type: 'External / Market Data', examples: 'EIA data, MISO market data, S&P Global Platts', delta: '+1 – 2 weeks / source', complexity: 'Low' },
  { type: 'Unstructured / Document Corpus', examples: 'Earnings transcripts, board packages, contract docs', delta: '+2 – 4 weeks / corpus', complexity: 'Medium' },
];

const ASSUMPTIONS = [
  'Client provides documented data definitions, field-level dictionaries, and CSV/Excel extracts for POC',
  'Relevant IT and data team stakeholders are available ≥30% time during integration phases',
  'Cloud-based deployment on AWS, Azure, or GCP (on-premise adds 4–8 weeks for infra provisioning)',
  'Single primary ERP/financial system assumed for base estimates — each additional system is additive',
  'SSO/IdP (Okta, Entra ID, Ping) is available and IT team can support integration within pilot timeline',
  'AI/LLM API access is approved through client security and procurement processes before Pilot',
  'Data is accessible via API, JDBC/ODBC connector, or scheduled extract — no physical media transfers',
  'Estimates assume experienced delivery team of 3–5 FTEs (platform, data, AI/UX engineers)',
];

const NEXT_STEPS = [
  { icon: Calendar, title: 'Schedule a Demo Workshop', desc: '4-hour interactive session — live platform walkthrough tailored to your use cases and stakeholder audience.', href: '/implementation-roadmap/demo-workshop' },
  { icon: FileText, title: 'Define Use Case Priorities', desc: 'Identify 3–5 highest-value analytics and agentic use cases that would drive the strongest business case for POC investment.', href: '/implementation-roadmap/use-case-priorities' },
  { icon: Database, title: 'Appoint a Data Steward', desc: 'Identify the internal data owner who can provide extract templates, field definitions, and sign off on KPI logic.', href: '/implementation-roadmap/data-readiness' },
  { icon: Users, title: 'Align Executive Sponsorship', desc: 'Secure CFO/CIO sponsorship and a 3–5 person pilot steering committee to support Pilot go/no-go decisions.', href: '/implementation-roadmap/executive-alignment' },
];

function InvestmentBadge({ level }: { level: Phase['investment'] }) {
  const config = { Minimal: 'bg-gray-100 text-gray-600', Low: 'bg-amber-50 text-amber-700', Medium: 'bg-blue-50 text-blue-700', High: 'bg-gray-900 text-white' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${config[level]}`}>{level} Investment</span>;
}

function ComplexityDot({ level }: { level: ComplexityFactor['complexity'] }) {
  const config = { Low: 'bg-emerald-500', Medium: 'bg-amber-500', High: 'bg-orange-500', 'Very High': 'bg-red-500' };
  return <span className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full flex-shrink-0 ${config[level]}`} /><span className="text-xs text-gray-600">{level}</span></span>;
}

function PhaseDetailCard({ phase }: { phase: Phase }) {
  const Icon = phase.icon;
  const isProduction = phase.id === 'production';
  return (
    <motion.div key={phase.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
      className={`rounded-xl border-2 overflow-hidden ${phase.borderColor}`}>
      <div className={`px-6 py-4 ${isProduction ? 'bg-gray-900' : phase.bgColor}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: isProduction ? '#fff1' : `${phase.accentColor}20` }}>
              <Icon className="h-5 w-5" style={{ color: isProduction ? '#fff' : phase.accentColor }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: isProduction ? '#9CA3AF' : phase.accentColor }}>Phase {phase.number}</span>
                <InvestmentBadge level={phase.investment} />
              </div>
              <h3 className={`text-lg font-bold ${isProduction ? 'text-white' : 'text-gray-900'}`}>{phase.name}</h3>
              <p className={`text-[11px] font-medium ${isProduction ? 'text-gray-400' : 'text-gray-500'}`}>{phase.tagline}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-black ${isProduction ? 'text-white' : 'text-gray-900'}`}>{phase.duration}</div>
            <div className={`text-[10px] ${isProduction ? 'text-gray-400' : 'text-gray-500'}`}>{phase.dataSourceCount} data sources</div>
          </div>
        </div>
        <p className={`mt-3 text-sm leading-relaxed ${isProduction ? 'text-gray-300' : 'text-gray-600'}`}>{phase.objective}</p>
      </div>
      <div className={`grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 ${isProduction ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-5">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isProduction ? 'text-gray-400' : 'text-gray-400'}`}>Key Deliverables</p>
          <ul className="space-y-2">
            {phase.deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${d.critical ? (isProduction ? 'text-white' : 'text-gray-800') : 'text-gray-300'}`} />
                <span className={`text-xs leading-snug ${d.critical ? (isProduction ? 'text-white font-medium' : 'text-gray-800 font-medium') : (isProduction ? 'text-gray-400' : 'text-gray-500')}`}>{d.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isProduction ? 'text-gray-400' : 'text-gray-400'}`}>
            {phase.id === 'demo' ? 'Daily Plan' : phase.id === 'poc' ? 'Weekly Plan' : phase.id === 'pilot' ? 'Monthly Plan' : 'Quarterly Plan'}
          </p>
          <div className="space-y-3">
            {phase.weeks.map((w, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wide w-16 flex-shrink-0 pt-0.5" style={{ color: isProduction ? '#9CA3AF' : phase.accentColor }}>{w.label}</span>
                <div className="flex flex-wrap gap-1">
                  {w.activities.map((a, j) => (
                    <span key={j} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isProduction ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {phase.keyRisk && (
            <div className={`mt-4 flex items-start gap-1.5 p-2.5 rounded-lg ${isProduction ? 'bg-gray-700' : 'bg-amber-50'}`}>
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
              <p className="text-[10px] text-amber-700"><span className="font-semibold">Key dependency: </span>{phase.keyRisk}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ImplementationRoadmapClient() {
  const [activePhase, setActivePhase] = useState<string>('demo');
  const [showAllWorkstreams, setShowAllWorkstreams] = useState(false);
  const selectedPhase = PHASES.find(p => p.id === activePhase)!;
  const visibleWorkstreams = showAllWorkstreams ? WORKSTREAMS : WORKSTREAMS.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">How to Get Started</h1>
            <p className="text-xs text-gray-500 mt-0.5">Illustrative implementation roadmap — Demo to Production &bull; Finance360 for BD</p>
          </div>
          <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">Illustrative / Template</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PHASES.map((phase) => {
          const Icon = phase.icon;
          const isProduction = phase.id === 'production';
          return (
            <button key={phase.id} onClick={() => setActivePhase(phase.id)}
              className={`relative text-left rounded-xl border-2 p-4 transition-all duration-200 group ${activePhase === phase.id ? isProduction ? 'border-gray-800 bg-gray-900' : 'border-current' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              style={activePhase === phase.id && !isProduction ? { borderColor: phase.accentColor } : {}}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: activePhase === phase.id ? (isProduction ? '#9CA3AF' : phase.accentColor) : '#9CA3AF' }}>Phase {phase.number}</span>
                <Icon className="h-3.5 w-3.5" style={{ color: activePhase === phase.id ? (isProduction ? '#fff' : phase.accentColor) : '#D1D5DB' }} />
              </div>
              <p className={`text-sm font-bold ${activePhase === phase.id ? (isProduction ? 'text-white' : 'text-gray-900') : 'text-gray-700'}`}>{phase.name}</p>
              <p className={`text-xs font-semibold mt-0.5 ${activePhase === phase.id ? (isProduction ? 'text-gray-300' : 'text-gray-700') : 'text-gray-400'}`}>{phase.duration}</p>
              <p className={`text-[10px] mt-1 ${activePhase === phase.id ? (isProduction ? 'text-gray-400' : 'text-gray-500') : 'text-gray-400'}`}>{phase.tagline}</p>
              {activePhase === phase.id && <motion.div layoutId="phase-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl" style={{ backgroundColor: isProduction ? '#fff' : phase.accentColor }} />}
            </button>
          );
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <PhaseDetailCard phase={selectedPhase} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">Delivery Timeline</h2>
          <span className="text-[10px] text-gray-400 ml-1">Base estimates — see complexity multipliers below for adjustments</span>
        </div>
        <div className="space-y-2.5">
          <div className="grid grid-cols-[140px_1fr] gap-2">
            <div />
            <div className="grid grid-cols-4 gap-px">
              {PHASES.map(p => (
                <div key={p.id} className="text-center">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{p.name}</p>
                  <p className="text-[9px] text-gray-300">{p.durationShort}</p>
                </div>
              ))}
            </div>
          </div>
          {WORKSTREAMS.map((ws, i) => {
            const Icon = ws.icon;
            const cells = [ws.demo, ws.poc, ws.pilot, ws.production];
            return (
              <div key={i} className="grid grid-cols-[140px_1fr] gap-2 items-center">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-[10px] font-medium text-gray-600 truncate">{ws.name}</span>
                </div>
                <div className="grid grid-cols-4 gap-px">
                  {cells.map((cell, j) => {
                    const phase = PHASES[j];
                    const isProduction = phase.id === 'production';
                    return (
                      <div key={j} className={`text-[9px] px-2 py-1.5 rounded text-center leading-tight ${isProduction ? 'bg-gray-800 text-gray-300' : ''}`}
                        style={!isProduction ? { backgroundColor: `${phase.accentColor}15`, color: phase.accentColor } : {}}>
                        {cell}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">Data Source Complexity Multipliers</h2>
          <span className="text-[10px] text-gray-400 ml-1">Additive adjustments to base timeline estimates per data source type</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Source Type</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Examples</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Timeline Impact</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Complexity</th>
              </tr>
            </thead>
            <tbody>
              {COMPLEXITY_FACTORS.map((factor, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-800">{factor.type}</td>
                  <td className="py-2 px-3 text-gray-500">{factor.examples}</td>
                  <td className="py-2 px-3 font-semibold text-gray-800 font-mono tabular-nums">{factor.delta}</td>
                  <td className="py-2 px-3"><ComplexityDot level={factor.complexity} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[10px] text-gray-400">* Estimates assume standard API/JDBC connectivity. Proprietary protocols, data quality remediation, or security review cycles may add additional time.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">Simplifying Assumptions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ASSUMPTIONS.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <Link href="/implementation-roadmap/scoping-worksheet"
          className="flex items-center justify-between bg-white border-2 border-gray-200 hover:border-gray-900 rounded-xl p-5 group transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Deployment Scoping Worksheet</p>
              <p className="text-xs text-gray-500 mt-0.5">Interactive POC / Pilot / Production planner — select your use cases and data sources to generate timeline, investment, and team estimates tailored to your scope.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-gray-900 transition-colors flex-shrink-0 ml-4">
            <span>Open Worksheet</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-white" />
          <h2 className="text-sm font-bold text-white">Recommended Next Steps</h2>
        </div>
        <p className="text-xs text-gray-400 mb-5">To initiate the Demo → POC journey, the following four actions are recommended in parallel:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {NEXT_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Link key={i} href={step.href} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-all group block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center"><Icon className="h-3.5 w-3.5 text-white" /></div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Step {i + 1}</span>
                </div>
                <p className="text-xs font-semibold text-white mb-1">{step.title}</p>
                <p className="text-[10px] text-gray-400 leading-relaxed mb-3">{step.desc}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors">
                  <span>Open</span><ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-700">
          <p className="text-[10px] text-gray-500">Finance360 implementation is delivered by Accenture Finance &amp; Risk practice — cloud-native, model-agnostic, and extensible.</p>
          <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
            <span>Begin with a Demo Workshop</span><ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
