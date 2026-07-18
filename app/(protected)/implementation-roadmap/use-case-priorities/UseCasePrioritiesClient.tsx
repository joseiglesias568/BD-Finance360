'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3, TrendingUp, Database, Cpu, Shield, Users, Globe,
  ChevronLeft, ArrowRight, Star, CheckCircle2, AlertCircle,
  Zap, FileText, DollarSign, Calendar,
} from 'lucide-react';

interface UseCase {
  id: string; title: string; domain: string; description: string;
  value: 1 | 2 | 3; feasibility: 1 | 2 | 3;
  phase: 'poc' | 'pilot' | 'production'; dataSources: string[];
  icon: React.ElementType; starter?: boolean;
}

const USE_CASES: UseCase[] = [
  // Health Care Benefits (Aetna)
  { id: 'uc-1', domain: 'Health Care Benefits', title: 'MA Medical Cost Ratio Dashboard', description: 'Real-time Medicare Advantage MCR by plan type, region, and member cohort with AI-driven variance explanation vs. actuarial targets. Early-warning alerts for cohorts tracking above the 87–88% target.', value: 3, feasibility: 3, phase: 'poc', starter: true, dataSources: ['Claims Processing System', 'Actuarial Models'], icon: TrendingUp },
  { id: 'uc-2', domain: 'Health Care Benefits', title: 'Medical Membership & Retention Monitor', description: 'Real-time membership count, attrition, and pipeline by product type (MA, commercial, Medicaid) and market. Tracks repricing impact, competitive exits, and enrollment trend vs. CMS benchmark.', value: 3, feasibility: 3, phase: 'poc', starter: true, dataSources: ['Membership System', 'CRM / Salesforce', 'CMS Enrollment Data'], icon: BarChart3 },
  { id: 'uc-3', domain: 'Health Care Benefits', title: 'EPS Bridge & Segment Margin Decomposition', description: 'Automated waterfall from prior-period adjusted EPS to current — broken down by HCB MCR, premium revenue, Caremark fee income, Rx volume, SG&A, and interest. Highlights over/under vs. plan.', value: 3, feasibility: 2, phase: 'poc', starter: true, dataSources: ['ERP / Oracle Financials', 'Planning Tool'], icon: DollarSign },
  { id: 'uc-4', domain: 'Health Care Benefits', title: 'Risk Adjustment & RADV Exposure Tracker', description: 'Track HCC coding accuracy, risk score submissions, and RADV audit exposure by market. Model financial sensitivity of +/- 1 point risk score shift on premium revenue.', value: 2, feasibility: 2, phase: 'pilot', dataSources: ['CMS EDGE Server', 'Claims Processing', 'Coding Audit System'], icon: Shield },
  // Health Services (Caremark PBM)
  { id: 'uc-5', domain: 'Health Services', title: 'Specialty Pharmacy Revenue Performance', description: 'Revenue, claims, and margin by drug category (GLP-1, oncology, immunology, rare disease) with dispensing trend, rebate yield, and gross-to-net analysis vs. Caremark targets.', value: 3, feasibility: 2, phase: 'poc', starter: true, dataSources: ['PBM Claims Platform', 'ERP / Oracle Financials'], icon: TrendingUp },
  { id: 'uc-6', domain: 'Health Services', title: 'PBM Client Retention & Pipeline', description: 'Track PBM contract renewals, RFP pipeline coverage, and client revenue at risk vs. secured. Early-warning model for accounts with <18 months to renewal and declining satisfaction scores.', value: 2, feasibility: 2, phase: 'pilot', dataSources: ['CRM / Salesforce', 'Client Performance Data'], icon: BarChart3 },
  // Cost & Operations
  { id: 'uc-7', domain: 'Cost & Operations', title: 'EBITDA Cost Bridge & Productivity Tracking', description: 'Decompose EBITDA cost variance into medical costs, drug costs, labor, SG&A, and productivity initiatives. Surface over-budget cost centers and model impact of GLP-1 utilization or membership mix changes.', value: 3, feasibility: 2, phase: 'poc', starter: true, dataSources: ['ERP / Oracle Financials', 'HRIS / Workday', 'Claims System'], icon: Shield },
  { id: 'uc-8', domain: 'Cost & Operations', title: 'Drug Procurement & Supply Chain Intelligence', description: 'Track specialty drug purchasing costs, manufacturer rebate performance, preferred formulary compliance, and procurement savings vs. targets. Flag at-risk preferred drug positions and biosimilar conversion opportunities.', value: 2, feasibility: 2, phase: 'pilot', dataSources: ['Procurement Platform', 'PBM Formulary System', 'Manufacturer Contracts'], icon: Globe },
  // Financial Planning
  { id: 'uc-9', domain: 'Financial Planning', title: '18-Month Rolling EBITDA Forecast', description: 'ML-powered EBITDA forecast rolling 18 months forward. Decomposes into HCB MCR trajectory, specialty Rx growth, retail Rx volume, SG&A efficiency, and leverage reduction assumptions.', value: 3, feasibility: 2, phase: 'pilot', dataSources: ['ERP', 'Planning Tool', 'Actuarial Models', 'External Market Data'], icon: BarChart3 },
  { id: 'uc-10', domain: 'Financial Planning', title: 'Scenario Modeling: MA MCR & Specialty Rx Cycles', description: 'What-if analysis: MA MCR improvement 88–92%, GLP-1 cost impact on pharmacy margin, Oak Street scale-up pace, and leverage reduction rate. Shows segment EPS and FCF guidance impact by scenario.', value: 3, feasibility: 3, phase: 'poc', dataSources: ['ERP', 'Planning Tool', 'Actuarial Models'], icon: Shield },
  { id: 'uc-11', domain: 'Financial Planning', title: 'Free Cash Flow & Leverage Reduction Tracker', description: 'Track FCF conversion from adjusted net income, debt paydown pace, and path to <3.0x debt/EBITDA target. Model dividend sustainability and buyback capacity at various FCF scenarios.', value: 2, feasibility: 2, phase: 'pilot', dataSources: ['Treasury System', 'ERP', 'Debt Schedule'], icon: DollarSign },
  // Executive Reporting
  { id: 'uc-12', domain: 'Executive Reporting', title: 'Automated Monthly Operating Report (MOR)', description: 'AI-generated MOR deck: CFO narrative, HCB/Health Services/PCW segment performance, variance analysis, risks & opportunities, and forward outlook — assembled from live data in minutes, not days.', value: 3, feasibility: 2, phase: 'pilot', dataSources: ['All financial data sources', 'Planning Tool', 'Membership System'], icon: FileText },
  { id: 'uc-13', domain: 'Executive Reporting', title: 'Earnings Call Preparation & Guidance Variance', description: 'Pre-earnings package: EPS guidance vs. consensus gap analysis, MCR Q&A prep, investor talking points, and analyst sentiment tracking against BD disclosures.', value: 2, feasibility: 2, phase: 'pilot', dataSources: ['ERP', 'IR Data', 'Consensus Estimates API'], icon: TrendingUp },
  // AI & Agentic
  { id: 'uc-14', domain: 'AI & Agentic', title: 'Natural Language Financial Q&A', description: '"What drove the MCR deterioration in Q3 vs. plan?" — AI-grounded answers with citations, drill-down links, and suggested follow-up questions. Reduces analyst queue by 60%+.', value: 3, feasibility: 3, phase: 'poc', starter: true, dataSources: ['ERP', 'Claims System', 'Semantic Layer'], icon: Zap },
  { id: 'uc-15', domain: 'AI & Agentic', title: 'AI-Driven Variance Commentary Generation', description: 'Automated, plain-English commentary for every material variance in the MOR — using AI grounded in prior-period language, management guidance, and current market context.', value: 3, feasibility: 2, phase: 'pilot', dataSources: ['ERP', 'Planning Tool', 'Historical Commentary Corpus'], icon: Cpu },
  { id: 'uc-16', domain: 'AI & Agentic', title: 'Anomaly Detection & Proactive Alerts', description: 'AI monitors 500+ KPI time series for statistical anomalies, MCR spike signals, and membership attrition early warnings. Routes prioritized alerts to relevant finance and actuarial teams.', value: 3, feasibility: 2, phase: 'pilot', dataSources: ['All operational and financial data sources'], icon: AlertCircle },
  { id: 'uc-17', domain: 'AI & Agentic', title: 'Financial Close Tracker & Agentic Escalation', description: 'Agentic financial close workflow: milestone tracking, automated status pings, escalation routing for overdue items, and sign-off gate management across HCB, Health Services, and PCW close teams.', value: 2, feasibility: 2, phase: 'pilot', dataSources: ['ERP Close Modules', 'HRMS', 'Task Management'], icon: CheckCircle2 },
  // Production
  { id: 'uc-18', domain: 'Executive Reporting', title: 'Board-Level Reporting Automation', description: 'Auto-assembled board package: QoQ performance, Oak Street integration milestones, risk register, ESG/health equity metrics, and capital allocation — board-ready in 2 hours vs. 2 weeks.', value: 2, feasibility: 1, phase: 'production', dataSources: ['All sources + GRC + ESG Data'], icon: FileText },
  { id: 'uc-19', domain: 'Health Services', title: 'Oak Street & Signify Health Performance Optimization', description: 'Track Oak Street clinic utilization, cost per visit, quality star ratings, and value-based care savings vs. targets. Monitor Signify Health home visit volume and risk stratification accuracy.', value: 2, feasibility: 1, phase: 'production', dataSources: ['EHR System', 'CMS Quality Data', 'ERP'], icon: TrendingUp },
  { id: 'uc-20', domain: 'Cost & Operations', title: 'Retail Pharmacy Network Optimization', description: 'Track pharmacy-level P&L, same-store script volume, front-of-store margin, and MinuteClinic contribution. AI-driven store clustering to identify optimization candidates for format change or consolidation.', value: 2, feasibility: 1, phase: 'production', dataSources: ['ERP', 'POS System', 'Store Operations Data'], icon: Cpu },
];

const DOMAINS = ['All', ...Array.from(new Set(USE_CASES.map(u => u.domain)))];
const VALUE_LABEL = { 1: 'Medium', 2: 'High', 3: 'Very High' } as const;
const FEAS_LABEL  = { 1: 'Complex', 2: 'Moderate', 3: 'Quick Win' } as const;
const PHASE_STYLE = { poc: 'bg-amber-50 text-amber-700', pilot: 'bg-blue-50 text-blue-700', production: 'bg-gray-800 text-white' };
const PHASE_LABEL = { poc: 'POC', pilot: 'Pilot', production: 'Production' } as const;

export default function UseCasePrioritiesClient() {
  const [selected, setSelected] = useState<Set<string>>(new Set(USE_CASES.filter(u => u.starter).map(u => u.id)));
  const [domain, setDomain] = useState('All');

  const toggle = (id: string) => {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const visible = domain === 'All' ? USE_CASES : USE_CASES.filter(u => u.domain === domain);
  const selectedItems = USE_CASES.filter(u => selected.has(u.id));

  return (
    <div className="space-y-7 pb-12">
      <Link href="/implementation-roadmap" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Roadmap
      </Link>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Star className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 2 of 4</span>
            <h1 className="text-xl font-bold text-gray-900">Define Use Case Priorities</h1>
            <p className="text-xs text-gray-500 mt-0.5">Select the Finance360 use cases that map to your highest-value opportunities — recommended starter set pre-selected for BD</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Selected',              value: selected.size,                                              note: 'of 20 use cases' },
          { label: 'POC-Ready',             value: selectedItems.filter(u => u.phase === 'poc').length,        note: 'quick-start candidates' },
          { label: 'High / Very High Value', value: selectedItems.filter(u => u.value >= 2).length,           note: 'value score ≥ High' },
          { label: 'Quick Wins',            value: selectedItems.filter(u => u.feasibility === 3).length,      note: 'fast-to-implement' },
        ].map(({ label, value, note }, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-[10px] text-gray-500">{note}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-1">Prioritization Matrix — Value vs. Feasibility</h2>
        <p className="text-xs text-gray-500 mb-5">Use cases plotted by business value and implementation complexity. Click a tile to toggle selection.</p>
        <div className="relative">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap origin-center" style={{ left: '-28px' }}>Business Value →</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap" style={{ bottom: '-20px' }}>Implementation Speed →</div>
          <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-lg overflow-hidden ml-2">
            {(['Complex', 'Moderate', 'Quick Win'] as const).map((fLabel, fi) => (
              <div key={fi} className="bg-white px-3 py-1.5 text-center"><span className="text-[9px] font-bold uppercase tracking-wide text-gray-400">{fLabel}</span></div>
            ))}
            {([3, 2, 1] as const).map(v => ([1, 2, 3] as const).map(f => {
              const cellUCs = USE_CASES.filter(u => u.value === v && u.feasibility === f);
              const isHot = v >= 2 && f >= 2;
              return (
                <div key={`${v}-${f}`} className={`bg-white min-h-[90px] p-2 ${isHot ? 'bg-emerald-50/40' : ''}`}>
                  {cellUCs.map(uc => {
                    const Icon = uc.icon;
                    const isSelected = selected.has(uc.id);
                    return (
                      <button key={uc.id} onClick={() => toggle(uc.id)}
                        className={`w-full text-left text-[9px] p-1.5 rounded mb-1 flex items-center gap-1.5 transition-all border ${isSelected ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                        <Icon className="h-2.5 w-2.5 flex-shrink-0" />
                        <span className="leading-tight">{uc.title.split(':')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              );
            }))}
          </div>
        </div>
        <div className="mt-8 flex items-center gap-4 text-[10px] text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-800 inline-block" /> Selected</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border border-gray-300 inline-block" /> Not selected</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 inline-block" /> Sweet spot (high value + fast)</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-sm font-bold text-gray-900">Use Case Library</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 flex-wrap">
            {DOMAINS.map(d => (
              <button key={d} onClick={() => setDomain(d)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${domain === d ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {visible.map(uc => {
            const Icon = uc.icon;
            const isSelected = selected.has(uc.id);
            return (
              <button key={uc.id} onClick={() => toggle(uc.id)}
                className={`text-left rounded-lg border p-3 transition-all ${isSelected ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-xs font-semibold text-gray-900">{uc.title}</p>
                      {uc.starter && <span className="text-[9px] bg-amber-50 text-amber-600 font-semibold px-1.5 py-0.5 rounded">Starter</span>}
                    </div>
                    <p className="text-[10px] text-gray-500 leading-snug mb-2">{uc.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${PHASE_STYLE[uc.phase]}`}>{PHASE_LABEL[uc.phase]}</span>
                      <span className="text-[9px] text-gray-500">Value: <strong>{VALUE_LABEL[uc.value]}</strong></span>
                      <span className="text-[9px] text-gray-500">Speed: <strong>{FEAS_LABEL[uc.feasibility]}</strong></span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {uc.dataSources.map((ds, j) => <span key={j} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{ds}</span>)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {selectedItems.filter(u => u.phase === 'poc').length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" /> Your Recommended POC Starter Set
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedItems.filter(u => u.phase === 'poc').map(uc => {
              const Icon = uc.icon;
              return (
                <div key={uc.id} className="bg-white rounded-lg border border-amber-100 p-3 flex items-start gap-2">
                  <Icon className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{uc.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Sources: {uc.dataSources.slice(0, 2).join(', ')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">{selected.size} use cases selected</p>
          <p className="text-gray-400 text-xs mt-0.5">Now identify the data sources and owners needed to support your priority use cases.</p>
        </div>
        <Link href="/implementation-roadmap/data-readiness"
          className="flex items-center gap-2 bg-white text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
          Next: Data Readiness <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}
