'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronLeft, CheckCircle2, AlertCircle, Users, Database, Clock,
  DollarSign, BarChart3, Shield, Zap, FileText, ArrowRight, Layers,
  TrendingUp, Globe, Cpu, Star, AlertTriangle, ChevronDown, ChevronUp,
  GitBranch, Rocket, Play,
} from 'lucide-react';

const USE_CASES_CATALOG = [
  // POC-ready
  { id: 'iet-revenue',   label: 'Missouri Revenue & Rate Base Dashboard',      phase: 'poc',  domain: 'Missouri Revenue',  weeks: 0.5, icon: TrendingUp },
  { id: 'orders-backlog',label: 'ESA Contracted Load & Pipeline Monitor',     phase: 'poc',  domain: 'Missouri Revenue',  weeks: 0.5, icon: BarChart3  },
  { id: 'ebitda-bridge', label: 'EPS Bridge & Margin Decomposition',          phase: 'poc',  domain: 'Missouri Revenue',  weeks: 0.5, icon: DollarSign },
  { id: 'ofse-revenue',  label: 'Illinois Electric & Gas Revenue Performance',phase: 'poc',  domain: 'Illinois Revenue',  weeks: 0.5, icon: TrendingUp },
  { id: 'cost-bridge',   label: 'EBITDA Cost Bridge & Productivity Tracking', phase: 'poc',  domain: 'Cost & Ops',        weeks: 0.5, icon: Shield     },
  { id: 'scenario-oil',  label: 'Scenario Modeling: Rate Case & ESA Demand Cycles',phase:'poc', domain: 'Planning',      weeks: 0.5, icon: Shield     },
  { id: 'nlq-qa',        label: 'Natural Language Financial Q&A',             phase: 'poc',  domain: 'AI',                weeks: 0.5, icon: Cpu        },
  // Pilot-ready
  { id: 'iet-geo',       label: 'Missouri/Illinois Revenue by Customer Class', phase: 'pilot',domain: 'Missouri Revenue',  weeks: 1.0, icon: Globe      },
  { id: 'ofse-rig',      label: 'Load Growth & ESA Demand Correlation',       phase: 'pilot',domain: 'Illinois Revenue',   weeks: 1.0, icon: BarChart3  },
  { id: 'supply-chain',  label: 'Supply Chain & Procurement Intelligence',   phase: 'pilot',domain: 'Cost & Ops',    weeks: 1.5, icon: Globe      },
  { id: 'ebitda-fcst',   label: '18-Month Rolling EBITDA Forecast',          phase: 'pilot',domain: 'Planning',      weeks: 1.5, icon: BarChart3  },
  { id: 'fx-hedge',      label: 'FX Exposure & Hedging P&L Analysis',        phase: 'pilot',domain: 'Planning',      weeks: 1.0, icon: DollarSign },
  { id: 'mor-auto',      label: 'Automated Monthly Operating Report',        phase: 'pilot',domain: 'Reporting',      weeks: 1.5, icon: FileText   },
  { id: 'ai-commentary', label: 'AI-Driven Variance Commentary Generation',  phase: 'pilot',domain: 'AI',            weeks: 1.0, icon: Cpu        },
  { id: 'anomaly-alerts',label: 'Anomaly Detection & Proactive Alerts',      phase: 'pilot',domain: 'AI',            weeks: 1.0, icon: AlertCircle},
  { id: 'close-tracker', label: 'Financial Close Tracker & Agentic Escalation',phase:'pilot',domain: 'AI',           weeks: 1.0, icon: CheckCircle2},
  // Production
  { id: 'board-report',  label: 'Board-Level Reporting Automation',          phase: 'production',domain: 'Reporting', weeks: 2.0, icon: FileText   },
  { id: 'earnings-prep', label: 'Earnings Call Preparation & Guidance Variance',phase:'production',domain:'Reporting',weeks: 2.0, icon: BarChart3  },
  { id: 'aftermarket',   label: 'AMI & Smart Grid Revenue Optimization',     phase:'production',domain: 'Missouri Revenue', weeks: 2.0, icon: TrendingUp },
  { id: 'rnd-tracking',  label: 'R&D and Technology Investment Tracking',    phase: 'production',domain: 'Cost & Ops', weeks: 1.5, icon: Cpu        },
] as const;

const DATA_SOURCES_CATALOG = [
  { id: 'erp',         label: 'ERP / SAP S/4HANA',                    pocWeeks: 1.5, pilotWeeks: 3.0, category: 'Financial',    complexity: 'High'   },
  { id: 'orders',      label: 'Orders Management System (OMS)',        pocWeeks: 1.5, pilotWeeks: 3.0, category: 'Operational',  complexity: 'High'   },
  { id: 'crm',         label: 'CRM / Salesforce Pipeline',             pocWeeks: 1.0, pilotWeeks: 2.5, category: 'Operational',  complexity: 'Medium' },
  { id: 'planning',    label: 'Planning & Budgeting Tool',             pocWeeks: 1.0, pilotWeeks: 2.5, category: 'Financial',    complexity: 'High'   },
  { id: 'treasury',    label: 'Treasury & FX Hedging Platform',        pocWeeks: 0.5, pilotWeeks: 1.5, category: 'Financial',    complexity: 'Medium' },
  { id: 'hris',        label: 'HRIS / Workforce Analytics',            pocWeeks: 0.5, pilotWeeks: 1.5, category: 'People',       complexity: 'Medium' },
  { id: 'procurement', label: 'Procurement & Supply Chain (SAP Ariba)',pocWeeks: 1.0, pilotWeeks: 2.5, category: 'Operational',  complexity: 'High'   },
  { id: 'market',      label: 'External Market & Energy Data',         pocWeeks: 0.5, pilotWeeks: 1.0, category: 'External',     complexity: 'Low'    },
];

const COMPLEXITY_COLOR = { Low: 'text-emerald-600 bg-emerald-50', Medium: 'text-amber-700 bg-amber-50', High: 'text-red-600 bg-red-50' };

interface PhaseState { useCases: Set<string>; dataSources: Set<string>; userCount: number; }
interface PocOptions  { dedicated: boolean; aiScope: 'basic'|'full'; feedbackRounds: number }
interface PilotOptions { sso: boolean; rbac: 'simple'|'complex'; mobile: boolean; agenticDepth: 'basic'|'advanced'; securityReview: boolean }
interface ProdOptions  { multiRegion: boolean; erpWriteback: boolean; mlPredictive: boolean; governanceFramework: boolean; managedService: boolean }

const PHASES = ['poc','pilot','production'] as const;
type Phase = typeof PHASES[number];

const PHASE_META = {
  poc:        { label: 'Proof of Concept', short: 'POC',        color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-300', icon: GitBranch  },
  pilot:      { label: 'Pilot',            short: 'Pilot',       color: '#3B82F6', bg: 'bg-blue-50',  border: 'border-blue-300',  icon: Rocket     },
  production: { label: 'Production',       short: 'Production',  color: '#003B2C', bg: 'bg-gray-900', border: 'border-gray-800',  icon: TrendingUp },
} as const;

function phaseUCs(phase: Phase) {
  if (phase === 'pilot')      return USE_CASES_CATALOG.filter(u => u.phase === 'poc' || u.phase === 'pilot');
  if (phase === 'production') return USE_CASES_CATALOG;
  return USE_CASES_CATALOG.filter(u => u.phase === 'poc');
}

function calcTimeline(phase: Phase, ps: PhaseState, poc: PocOptions, pilot: PilotOptions, prod: ProdOptions) {
  let base = phase === 'poc' ? 3 : phase === 'pilot' ? 10 : 26;
  let breakdown: { label: string; weeks: number }[] = [{ label: 'Base duration', weeks: base }];
  const ucs = Array.from(ps.useCases).map(id => USE_CASES_CATALOG.find(u => u.id === id)!).filter(Boolean);
  const dss = DATA_SOURCES_CATALOG.filter(d => ps.dataSources.has(d.id));

  if (phase === 'poc') {
    ucs.forEach(u => { if (u.phase === 'poc') { base += u.weeks; breakdown.push({ label: `UC: ${u.label.split(' ').slice(0,4).join(' ')}…`, weeks: u.weeks }); } });
    dss.forEach(d => { base += d.pocWeeks; breakdown.push({ label: `Data: ${d.label.split(' ').slice(0,3).join(' ')}…`, weeks: d.pocWeeks }); });
    if (poc.dedicated)           { base += 0.5; breakdown.push({ label: 'Dedicated env setup', weeks: 0.5 }); }
    if (poc.aiScope === 'full')  { base += 1;   breakdown.push({ label: 'Full agentic AI scope', weeks: 1 }); }
    if (poc.feedbackRounds > 1)  { const w = (poc.feedbackRounds - 1) * 0.5; base += w; breakdown.push({ label: `+${poc.feedbackRounds-1} feedback rounds`, weeks: w }); }
  } else if (phase === 'pilot') {
    ucs.filter(u=>u.phase==='poc'||u.phase==='pilot').forEach(u => { base += u.weeks * 0.6; breakdown.push({ label: `UC: ${u.label.split(' ').slice(0,4).join(' ')}…`, weeks: Math.round(u.weeks * 0.6 * 10)/10 }); });
    dss.forEach(d => { base += d.pilotWeeks; breakdown.push({ label: `Integration: ${d.label.split(' ').slice(0,3).join(' ')}…`, weeks: d.pilotWeeks }); });
    if (pilot.sso)                        { base += 1.5; breakdown.push({ label: 'SSO / IdP integration', weeks: 1.5 }); }
    if (pilot.rbac === 'complex')         { base += 1.5; breakdown.push({ label: 'Complex RBAC design', weeks: 1.5 }); }
    if (pilot.mobile)                     { base += 1;   breakdown.push({ label: 'Mobile / responsive build', weeks: 1 }); }
    if (pilot.agenticDepth === 'advanced'){ base += 2;   breakdown.push({ label: 'Advanced agentic capabilities', weeks: 2 }); }
    if (pilot.securityReview)             { base += 2;   breakdown.push({ label: 'Formal security review', weeks: 2 }); }
    if (ps.userCount > 20)                { const w = Math.ceil((ps.userCount - 20) / 10) * 0.5; base += w; breakdown.push({ label: `Change mgmt (${ps.userCount} users)`, weeks: w }); }
  } else {
    dss.forEach(d => { const w = d.pilotWeeks * 1.2; base += w; breakdown.push({ label: `Prod integration: ${d.label.split(' ').slice(0,3).join(' ')}…`, weeks: Math.round(w*10)/10 }); });
    if (prod.multiRegion)         { base += 4; breakdown.push({ label: 'Multi-region deployment', weeks: 4 }); }
    if (prod.erpWriteback)        { base += 3; breakdown.push({ label: 'SAP write-back integration', weeks: 3 }); }
    if (prod.mlPredictive)        { base += 4; breakdown.push({ label: 'ML / predictive analytics', weeks: 4 }); }
    if (prod.governanceFramework) { base += 2; breakdown.push({ label: 'Governance & data catalog', weeks: 2 }); }
    if (prod.managedService)      { base += 2; breakdown.push({ label: 'Managed service transition', weeks: 2 }); }
    if (ps.userCount > 100)       { const w = Math.ceil((ps.userCount - 100) / 100) * 1.5; base += w; breakdown.push({ label: `Enterprise rollout (${ps.userCount} users)`, weeks: w }); }
  }
  return { total: Math.ceil(base * 2) / 2, breakdown };
}

function calcInvestment(phase: Phase, ps: PhaseState, poc: PocOptions, pilot: PilotOptions, prod: ProdOptions) {
  let base = phase === 'poc' ? 100 : phase === 'pilot' ? 500 : 1500;
  const dss = DATA_SOURCES_CATALOG.filter(d => ps.dataSources.has(d.id));
  const ucs = Array.from(ps.useCases);
  if (phase === 'poc') { base += dss.length * 20; base += ucs.length * 10; if (poc.dedicated) base += 15; if (poc.aiScope === 'full') base += 25; }
  else if (phase === 'pilot') { base += dss.length * 55; base += ucs.length * 18; if (pilot.sso) base += 30; if (pilot.agenticDepth === 'advanced') base += 75; if (pilot.securityReview) base += 25; if (pilot.mobile) base += 40; base += Math.max(0, ps.userCount - 20) * 0.8; }
  else { base += dss.length * 80; base += ucs.length * 30; if (prod.multiRegion) base += 150; if (prod.erpWriteback) base += 100; if (prod.mlPredictive) base += 200; if (prod.managedService) base += 180; base += Math.max(0, ps.userCount - 100) * 0.5; }
  return { low: Math.round(base * 0.85 / 25) * 25, high: Math.round(base * 1.25 / 25) * 25 };
}

function calcTeam(phase: Phase, ps: PhaseState, pilot: PilotOptions) {
  if (phase === 'poc') return [{ role: 'Engagement / PM', fte: 0.5 }, { role: 'Platform Engineer', fte: 1 }, { role: 'Data / KPI Analyst', fte: 1 }, { role: 'AI / Prompt Engineer', fte: 0.5 }];
  if (phase === 'pilot') {
    const team = [{ role: 'Engagement Manager', fte: 0.75 }, { role: 'Platform Engineer (×2)', fte: 2 }, { role: 'Data Engineer', fte: 1 }, { role: 'AI / Agentic Engineer', fte: pilot.agenticDepth === 'advanced' ? 1.5 : 1 }, { role: 'UX / Frontend', fte: 0.5 }, { role: 'Change Management Lead', fte: 0.5 }];
    if (pilot.securityReview) team.push({ role: 'Security Architect (part-time)', fte: 0.25 });
    return team;
  }
  return [{ role: 'Engagement Director', fte: 0.5 }, { role: 'Delivery Manager', fte: 1 }, { role: 'Platform / Cloud Engineers (×2)', fte: 2 }, { role: 'Data Engineers (×2)', fte: 2 }, { role: 'AI / ML Engineers (×2)', fte: 2 }, { role: 'UX / Product', fte: 1 }, { role: 'Security Architect', fte: 0.5 }, { role: 'Change & Training Lead', fte: 1 }, { role: 'Data Governance Specialist', fte: 0.5 }];
}

const GATE_CRITERIA: Record<Phase, string[]> = {
  poc: [
    'All selected use cases demonstrated on real client data with KPIs validated by Finance/FP&A team',
    'At least 3 named end-users have completed UAT and provided written feedback',
    'POC data model documented and signed off by Data Steward (EPS, rate base, PISA, FFO/debt definitions reconciled to source)',
    'AI/agentic outputs reviewed and accuracy confirmed against known business narratives',
    'Pilot scope, timeline, and budget approved by Executive Sponsor',
    'Data extract templates for Pilot phase distributed to client IT/data team',
  ],
  pilot: [
    'All pilot data sources live with automated refresh pipelines and SLA met for ≥2 weeks',
    'SSO and RBAC configured and tested for all pilot user roles',
    'Pilot user NPS ≥35 and weekly active usage ≥70% of target cohort',
    'Security review completed and all high/critical findings remediated',
    'Performance benchmarks met: P95 dashboard load <3s, AI Q&A <8s',
    'Formal lessons-learned documented and incorporated into Production plan',
    'Production business case with ROI model approved by Executive Sponsor and CIO',
  ],
  production: [
    'All production data sources live with monitored pipelines and SLA-backed refresh',
    'Enterprise IAM / SSO rolled out to 100% of target user base',
    'Full use case suite operational with certified KPI metrics and documented lineage',
    'Monitoring, alerting, and on-call support model operational',
    'Change management and training program complete for all user groups',
    'Governance framework: data catalog, metric certification, and change control process live',
    'Post-implementation value review completed at 90 days confirming ROI hypothesis',
  ],
};

const RISKS: Record<Phase, { risk: string; mitigation: string; severity: 'High'|'Med'|'Low' }[]> = {
  poc: [
    { risk: 'SAP S/4HANA extract complexity and authorization scope exceeds POC timeline', mitigation: 'Pre-qualify SAP data access in Demo Workshop; agree on basis/GL field extraction scope upfront with IT', severity: 'High' },
    { risk: 'BD EPS and MCR KPI definitions differ between Finance360 model and source system of record', mitigation: 'Mandatory data dictionary review in Week 1; document reconciliation log for all segment-level KPIs', severity: 'High' },
    { risk: 'Stakeholder availability insufficient for UAT and feedback cycles', mitigation: 'Lock UAT dates at project kickoff; identify backup approvers for each functional area', severity: 'Med' },
    { risk: 'AI outputs not grounded in BD pharmacy and health care business context', mitigation: 'Allocate dedicated AI calibration sprint in Week 2; validate against 10+ known historical narratives', severity: 'Med' },
  ],
  pilot: [
    { risk: 'IT team bandwidth insufficient to support SAP API/connector setup alongside BAU', mitigation: 'Agree IT resource commitment (hours/week) in charter; escalate to Steering Committee if slipping', severity: 'High' },
    { risk: 'Orders OMS integration more complex than anticipated due to multi-system order lifecycle', mitigation: 'Conduct Orders OMS technical discovery in Month 1; plan for fallback extract-based path if API unavailable', severity: 'High' },
    { risk: 'Data quality issues in SAP cause EPS bridge calculation discrepancies', mitigation: 'Implement data quality monitoring dashboard; establish data issue triage SLA with source owners', severity: 'High' },
    { risk: 'Low pilot user adoption due to change fatigue or competing priorities', mitigation: 'Executive sponsor personally champions the pilot; embed Finance360 into existing MOR workflow', severity: 'Med' },
    { risk: 'Security review identifies architecture changes required post-build', mitigation: 'Conduct security architecture review in Month 1 (design phase) not Month 3 (near go-live)', severity: 'Med' },
    { risk: 'Treasury/FX data sensitivity creates data governance delays', mitigation: 'Engage Treasury and Legal early; agree on anonymization/aggregation approach before integration begins', severity: 'Low' },
  ],
  production: [
    { risk: 'Enterprise-wide change management under-resourced across BD three-segment structure', mitigation: 'Dedicated change lead from project inception; phased rollout by segment and region with champions network', severity: 'High' },
    { risk: 'Data governance gaps at scale lead to EPS/rate base certification disputes between segments', mitigation: 'Establish Finance360 Data Governance Council with quarterly certification reviews before Production launch', severity: 'High' },
    { risk: 'SAP write-back or planning tool integration creates data integrity risk', mitigation: 'Mandatory reconciliation testing period and dual-run before decommissioning source system workflows', severity: 'High' },
    { risk: 'Ongoing model drift in ML/predictive features reduces orders forecast accuracy', mitigation: 'Automated model monitoring pipeline; quarterly retraining cadence with accuracy SLA thresholds', severity: 'Med' },
    { risk: 'Executive sponsorship continuity risk (CFO/CIO transition)', mitigation: 'Distribute sponsor responsibilities across 3+ executives; document program value early and visibly', severity: 'Med' },
  ],
};

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="h-4 w-4 text-gray-400" />
      <div><h3 className="text-sm font-bold text-gray-900">{title}</h3>{subtitle && <p className="text-[10px] text-gray-400">{subtitle}</p>}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all ${checked ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}>
      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${checked ? 'bg-white' : 'border-2 border-gray-300'}`} />
      {label}
    </button>
  );
}

function SeverityDot({ s }: { s: 'High'|'Med'|'Low' }) {
  const c = s === 'High' ? 'bg-red-500' : s === 'Med' ? 'bg-amber-500' : 'bg-gray-300';
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${c}`} />;
}

function SummaryView({ phases, poc, pilot, prod }: { phases: Record<Phase, PhaseState>; poc: PocOptions; pilot: PilotOptions; prod: ProdOptions; }) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-500">Cross-phase view of your scoping selections — illustrative estimates based on inputs.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PHASES.map(phase => {
          const ps = phases[phase];
          const meta = PHASE_META[phase];
          const { total } = calcTimeline(phase, ps, poc, pilot, prod);
          const { low, high } = calcInvestment(phase, ps, poc, pilot, prod);
          const team = calcTeam(phase, ps, pilot);
          const totalFte = team.reduce((s, t) => s + t.fte, 0);
          const isProduction = phase === 'production';
          return (
            <div key={phase} className={`rounded-xl border-2 overflow-hidden ${meta.border}`}>
              <div className={`p-4 ${isProduction ? 'bg-gray-900' : meta.bg}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: isProduction ? '#9CA3AF' : meta.color }}>{meta.label}</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { label: 'Duration', value: `${total} wks` }, { label: 'Investment', value: `$${low}K–$${high}K` },
                    { label: 'Use Cases', value: `${ps.useCases.size} selected` }, { label: 'Data Sources', value: `${ps.dataSources.size} selected` },
                    { label: 'Users', value: `${ps.userCount}` }, { label: 'Team (FTEs)', value: `${totalFte.toFixed(1)}` },
                  ].map(({ label, value }, i) => (
                    <div key={i}>
                      <p className={`text-[9px] uppercase tracking-wide ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
                      <p className={`text-xs font-bold ${isProduction ? 'text-white' : 'text-gray-900'}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              {ps.useCases.size > 0 && (
                <div className={`p-3 ${isProduction ? 'bg-gray-800' : 'bg-white'}`}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: isProduction ? '#6B7280' : '#9CA3AF' }}>Use Cases</p>
                  <ul className="space-y-1">
                    {Array.from(ps.useCases).slice(0, 5).map(id => {
                      const uc = USE_CASES_CATALOG.find(u => u.id === id);
                      return uc ? <li key={id} className="flex items-center gap-1.5"><CheckCircle2 className={`h-3 w-3 flex-shrink-0 ${isProduction ? 'text-gray-500' : 'text-gray-300'}`} /><span className={`text-[10px] leading-snug ${isProduction ? 'text-gray-400' : 'text-gray-600'}`}>{uc.label}</span></li> : null;
                    })}
                    {ps.useCases.size > 5 && <li className={`text-[10px] ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>+{ps.useCases.size - 5} more</li>}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Cumulative Timeline</h3>
        <div className="space-y-3">
          {PHASES.map((phase, i) => {
            const ps = phases[phase]; const meta = PHASE_META[phase];
            const { total } = calcTimeline(phase, ps, poc, pilot, prod);
            const pct = Math.min(100, (total / 52) * 100);
            return (
              <div key={phase} className="grid grid-cols-[100px_1fr_60px] items-center gap-3">
                <span className="text-xs font-semibold text-gray-700">{meta.label}</span>
                <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="h-full rounded-full" style={{ backgroundColor: meta.color === '#003B2C' ? '#1F2937' : meta.color }} />
                </div>
                <span className="text-xs font-bold text-gray-700 text-right">{total} wks</span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-400 mt-3">Phases may overlap by 2–4 weeks during transition / handoff. Total elapsed time from Demo to Production: typically 12–18 months.</p>
      </div>
    </div>
  );
}

function PhaseWorksheet({ phase, ps, setPsField, poc, setPoc, pilot, setPilot, prod, setProd }: {
  phase: Phase; ps: PhaseState; setPsField: (k: keyof PhaseState, v: any) => void;
  poc: PocOptions; setPoc: (v: PocOptions) => void; pilot: PilotOptions; setPilot: (v: PilotOptions) => void; prod: ProdOptions; setProd: (v: ProdOptions) => void;
}) {
  const meta = PHASE_META[phase];
  const isProduction = phase === 'production';
  const { total, breakdown } = calcTimeline(phase, ps, poc, pilot, prod);
  const { low, high } = calcInvestment(phase, ps, poc, pilot, prod);
  const team = calcTeam(phase, ps, pilot);
  const totalFte = team.reduce((s, t) => s + t.fte, 0);
  const availableUCs = phaseUCs(phase);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const toggleUC = (id: string) => { const s = new Set(ps.useCases);   s.has(id) ? s.delete(id) : s.add(id); setPsField('useCases',   s); };
  const toggleDS = (id: string) => { const s = new Set(ps.dataSources); s.has(id) ? s.delete(id) : s.add(id); setPsField('dataSources', s); };

  return (
    <div className="space-y-5">
      <div className={`rounded-xl border-2 p-5 ${meta.border} ${isProduction ? 'bg-gray-900' : meta.bg}`}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: isProduction ? '#9CA3AF' : meta.color }}>Estimated Scope Output — updates as you fill in the worksheet below</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className={`text-[10px] ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>Est. Duration</p>
            <p className={`text-2xl font-black ${isProduction ? 'text-white' : 'text-gray-900'}`}>{total}<span className="text-sm font-normal ml-1">wks</span></p>
            <button onClick={() => setShowBreakdown(v => !v)} className={`text-[10px] flex items-center gap-0.5 mt-0.5 ${isProduction ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'}`}>
              {showBreakdown ? 'Hide' : 'See'} breakdown {showBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
          <div>
            <p className={`text-[10px] ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>Illus. Investment</p>
            <p className={`text-lg font-black ${isProduction ? 'text-white' : 'text-gray-900'}`}>${low}K<span className="text-sm font-normal">–</span>${high}K</p>
            <p className={`text-[9px] ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>illustrative range</p>
          </div>
          <div>
            <p className={`text-[10px] ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>Delivery Team</p>
            <p className={`text-2xl font-black ${isProduction ? 'text-white' : 'text-gray-900'}`}>{totalFte.toFixed(1)}<span className="text-sm font-normal ml-1">FTEs</span></p>
            <p className={`text-[9px] ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>{team.length} roles</p>
          </div>
          <div>
            <p className={`text-[10px] ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>Scope</p>
            <p className={`text-lg font-black ${isProduction ? 'text-white' : 'text-gray-900'}`}>{ps.useCases.size} UCs · {ps.dataSources.size} DSs</p>
            <p className={`text-[9px] ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>{ps.userCount} users</p>
          </div>
        </div>
        <AnimatePresence>
          {showBreakdown && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-gray-200/20">
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isProduction ? 'text-gray-500' : 'text-gray-400'}`}>Timeline Breakdown</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {breakdown.map((b, i) => (
                  <div key={i} className={`text-[10px] px-2 py-1.5 rounded flex items-center justify-between gap-2 ${isProduction ? 'bg-gray-800' : 'bg-white/70'}`}>
                    <span className={isProduction ? 'text-gray-400' : 'text-gray-600'}>{b.label}</span>
                    <span className={`font-bold flex-shrink-0 ${isProduction ? 'text-white' : 'text-gray-800'}`}>+{b.weeks}w</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionHeader icon={BarChart3} title="1. Use Cases in Scope" subtitle={`Select the Finance360 capabilities targeted for ${meta.label}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableUCs.map(uc => {
            const Icon = uc.icon; const sel = ps.useCases.has(uc.id); const isNewInThisPhase = uc.phase === phase;
            return (
              <button key={uc.id} onClick={() => toggleUC(uc.id)}
                className={`text-left rounded-lg border p-3 flex items-start gap-3 transition-all ${sel ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${sel ? 'bg-gray-800' : 'bg-gray-100'}`}><Icon className={`h-3.5 w-3.5 ${sel ? 'text-white' : 'text-gray-400'}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-medium text-gray-800">{uc.label}</p>
                    {isNewInThisPhase && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${meta.color}20`, color: meta.color === '#003B2C' ? '#374151' : meta.color }}>New in {meta.short}</span>}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">+{uc.weeks}w est.</p>
                </div>
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 ${sel ? 'bg-gray-800 border-gray-800' : 'border-gray-300'}`}>{sel && <CheckCircle2 className="h-3 w-3 text-white m-auto" />}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionHeader icon={Database} title="2. Data Sources in Scope" subtitle={phase === 'poc' ? 'Select sources for static extract ingestion' : 'Select sources for automated pipeline integration'} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DATA_SOURCES_CATALOG.map(ds => {
            const sel = ps.dataSources.has(ds.id); const weeks = phase === 'poc' ? ds.pocWeeks : ds.pilotWeeks;
            return (
              <button key={ds.id} onClick={() => toggleDS(ds.id)}
                className={`text-left rounded-lg border p-3 flex items-start gap-3 transition-all ${sel ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${sel ? 'bg-gray-800' : 'bg-gray-100'}`}><Database className={`h-3.5 w-3.5 ${sel ? 'text-white' : 'text-gray-400'}`} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-medium text-gray-800">{ds.label}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${COMPLEXITY_COLOR[ds.complexity as keyof typeof COMPLEXITY_COLOR]}`}>{ds.complexity}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{ds.category} · +{weeks}w est.</p>
                </div>
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 ${sel ? 'bg-gray-800 border-gray-800' : 'border-gray-300'}`}>{sel && <CheckCircle2 className="h-3 w-3 text-white m-auto" />}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionHeader icon={Users} title="3. Users & Audience" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-2"><p className="text-xs font-semibold text-gray-700">Target User Count</p><span className="text-xl font-black text-gray-900">{ps.userCount}</span></div>
            <input type="range" min={phase === 'poc' ? 3 : phase === 'pilot' ? 10 : 50} max={phase === 'poc' ? 15 : phase === 'pilot' ? 75 : 500} step={phase === 'poc' ? 1 : phase === 'pilot' ? 5 : 25}
              value={ps.userCount} onChange={e => setPsField('userCount', Number(e.target.value))} className="w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-gray-800 cursor-pointer" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>{phase === 'poc' ? '3' : phase === 'pilot' ? '10' : '50'}</span><span>{phase === 'poc' ? '15' : phase === 'pilot' ? '75' : '500'}</span></div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-700 mb-2">Audience Type</p>
            {(phase === 'poc' ? ['CFO / Finance Leadership', 'FP&A Team', 'Data Steward / Controller']
              : phase === 'pilot' ? ['Finance Leadership', 'FP&A / Analytics', 'Segment Finance Leads', 'Data & IT Teams']
              : ['Finance Leadership', 'FP&A / Analytics', 'Segment Finance (MO/IED/AILN/ATXI)', 'Investor Relations', 'Exec / Board', 'IT / Data Teams']
            ).map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600"><Users className="h-3 w-3 text-gray-300 flex-shrink-0" />{a}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionHeader icon={Layers} title={`4. ${meta.label} Options`} subtitle="Additional scope decisions that affect timeline and investment" />
        <div className="flex flex-wrap gap-2">
          {phase === 'poc' && <>
            <Toggle checked={poc.dedicated} onChange={v => setPoc({ ...poc, dedicated: v })} label="Dedicated cloud environment" />
            <Toggle checked={poc.aiScope === 'full'} onChange={v => setPoc({ ...poc, aiScope: v ? 'full' : 'basic' })} label="Full agentic AI scope (vs. basic Q&A demo)" />
            {[1,2,3].map(n => (<button key={n} onClick={() => setPoc({ ...poc, feedbackRounds: n })} className={`text-xs px-3 py-2 rounded-lg border transition-all ${poc.feedbackRounds === n ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{n} feedback round{n > 1 ? 's' : ''}</button>))}
          </>}
          {phase === 'pilot' && <>
            <Toggle checked={pilot.sso} onChange={v => setPilot({ ...pilot, sso: v })} label="SSO / IdP integration" />
            <Toggle checked={pilot.rbac === 'complex'} onChange={v => setPilot({ ...pilot, rbac: v ? 'complex' : 'simple' })} label="Complex RBAC (multi-segment hierarchy)" />
            <Toggle checked={pilot.mobile} onChange={v => setPilot({ ...pilot, mobile: v })} label="Mobile / responsive optimization" />
            <Toggle checked={pilot.agenticDepth === 'advanced'} onChange={v => setPilot({ ...pilot, agenticDepth: v ? 'advanced' : 'basic' })} label="Advanced agentic capabilities" />
            <Toggle checked={pilot.securityReview} onChange={v => setPilot({ ...pilot, securityReview: v })} label="Formal security review / pen test" />
          </>}
          {phase === 'production' && <>
            <Toggle checked={prod.multiRegion} onChange={v => setProd({ ...prod, multiRegion: v })} label="Multi-region deployment" />
            <Toggle checked={prod.erpWriteback} onChange={v => setProd({ ...prod, erpWriteback: v })} label="SAP write-back integration" />
            <Toggle checked={prod.mlPredictive} onChange={v => setProd({ ...prod, mlPredictive: v })} label="ML / predictive analytics models" />
            <Toggle checked={prod.governanceFramework} onChange={v => setProd({ ...prod, governanceFramework: v })} label="Governance framework & data catalog" />
            <Toggle checked={prod.managedService} onChange={v => setProd({ ...prod, managedService: v })} label="Accenture managed service (post-go-live)" />
          </>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionHeader icon={Users} title="5. Delivery Team Composition" subtitle="Accenture FTEs based on scope selections" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {team.map((t, i) => (<div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-100"><p className="text-[10px] text-gray-400 font-medium">{t.role}</p><p className="text-lg font-black text-gray-900">{t.fte}<span className="text-xs font-normal ml-1">FTE</span></p></div>))}
        </div>
        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-amber-700">Client team also required: <strong>Data Steward (30–50% time)</strong>, <strong>FP&A Lead (20–30%)</strong>, <strong>IT/Arch contact (20–30%)</strong>{phase !== 'poc' && ', Change Management Lead (25%)'}. Accenture FTEs above assume client resources are committed.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionHeader icon={CheckCircle2} title="6. Phase Gate Criteria (Go / No-Go)" subtitle={`All criteria should be met before advancing from ${meta.label} to the next phase`} />
        <ul className="space-y-2">
          {GATE_CRITERIA[phase].map((c, i) => (<li key={i} className="flex items-start gap-2"><div className="w-4 h-4 rounded border-2 border-gray-200 flex-shrink-0 mt-0.5" /><p className="text-xs text-gray-700">{c}</p></li>))}
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionHeader icon={AlertTriangle} title="7. Key Risks & Mitigations" />
        <div className="space-y-2">
          {RISKS[phase].map((r, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-start gap-2 mb-1.5">
                <SeverityDot s={r.severity} />
                <p className="text-xs font-semibold text-gray-800">{r.risk}</p>
                <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${r.severity === 'High' ? 'bg-red-50 text-red-600' : r.severity === 'Med' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{r.severity}</span>
              </div>
              <p className="text-[10px] text-gray-500 ml-3.5">↳ {r.mitigation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TABS = [...PHASES, 'summary'] as const;
type Tab = typeof TABS[number];

export default function ScopingWorksheetClient() {
  const [activeTab, setActiveTab] = useState<Tab>('poc');
  const [pocState,   setPocState]   = useState<PhaseState>({ useCases: new Set(['iet-revenue','orders-backlog','ebitda-bridge','ofse-revenue','nlq-qa']), dataSources: new Set(['erp','orders','planning']), userCount: 5 });
  const [pilotState, setPilotState] = useState<PhaseState>({ useCases: new Set(['iet-revenue','orders-backlog','ebitda-bridge','ofse-revenue','cost-bridge','scenario-oil','ebitda-fcst','mor-auto','ai-commentary']), dataSources: new Set(['erp','orders','crm','planning','treasury']), userCount: 25 });
  const [prodState,  setProdState]  = useState<PhaseState>({ useCases: new Set(USE_CASES_CATALOG.filter(u=>u.phase!=='production').map(u=>u.id)), dataSources: new Set(DATA_SOURCES_CATALOG.map(d=>d.id)), userCount: 150 });
  const [poc,  setPoc]  = useState<PocOptions>({ dedicated: false, aiScope: 'basic', feedbackRounds: 2 });
  const [pilot,setPilot]= useState<PilotOptions>({ sso: true, rbac: 'simple', mobile: false, agenticDepth: 'basic', securityReview: true });
  const [prod, setProd] = useState<ProdOptions>({ multiRegion: true, erpWriteback: false, mlPredictive: true, governanceFramework: true, managedService: false });

  const patchState = (setter: React.Dispatch<React.SetStateAction<PhaseState>>) => (k: keyof PhaseState, v: any) => setter(prev => ({ ...prev, [k]: v }));
  const tabLabel: Record<Tab, string> = { poc: 'POC Worksheet', pilot: 'Pilot Worksheet', production: 'Production Worksheet', summary: 'Summary View' };

  return (
    <div className="space-y-6 pb-12">
      <Link href="/implementation-roadmap" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"><ChevronLeft className="h-3.5 w-3.5" /> Back to Roadmap</Link>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><FileText className="h-5 w-5 text-gray-700" /></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Interactive Worksheet</span>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">Illustrative</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Deployment Scoping Worksheet</h1>
            <p className="text-xs text-gray-500 mt-0.5">Select your use cases, data sources, and scope options — get a live timeline, investment, and team estimate per phase</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-full overflow-x-auto">
        {TABS.map(tab => {
          const meta = tab !== 'summary' ? PHASE_META[tab] : null;
          const Icon = tab === 'summary' ? BarChart3 : meta!.icon;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold flex-shrink-0 transition-all ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icon className="h-3.5 w-3.5" />{tabLabel[tab]}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
          {activeTab === 'poc'        && <PhaseWorksheet phase="poc"        ps={pocState}   setPsField={patchState(setPocState)}   poc={poc} setPoc={setPoc} pilot={pilot} setPilot={setPilot} prod={prod} setProd={setProd} />}
          {activeTab === 'pilot'      && <PhaseWorksheet phase="pilot"      ps={pilotState} setPsField={patchState(setPilotState)} poc={poc} setPoc={setPoc} pilot={pilot} setPilot={setPilot} prod={prod} setProd={setProd} />}
          {activeTab === 'production' && <PhaseWorksheet phase="production" ps={prodState}  setPsField={patchState(setProdState)}  poc={poc} setPoc={setPoc} pilot={pilot} setPilot={setPilot} prod={prod} setProd={setProd} />}
          {activeTab === 'summary'    && <SummaryView phases={{ poc: pocState, pilot: pilotState, production: prodState }} poc={poc} pilot={pilot} prod={prod} />}
        </motion.div>
      </AnimatePresence>

      <div className="bg-gray-900 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-white font-bold text-sm">Scoping complete?</p>
          <p className="text-gray-400 text-xs mt-0.5">Review the Summary View, then share with your Accenture team to begin formal SOW preparation.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('summary')} className="flex items-center gap-2 bg-white text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
            View Summary <BarChart3 className="h-3.5 w-3.5" />
          </button>
          <Link href="/implementation-roadmap/executive-alignment" className="flex items-center gap-2 bg-gray-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-600 transition-colors">
            Executive Alignment <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
