'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Play, Clock, Users, CheckCircle2, ChevronLeft, BarChart3, Cpu, Database,
  TrendingUp, Shield, FileText, Star, AlertCircle, Calendar, Zap, ArrowRight,
} from 'lucide-react';

const AGENDA = [
  {
    time: '9:00 – 9:20', slot: 'Opening & Framing', owner: 'Delivery Lead', type: 'plenary',
    activities: ['Introductions and session goals', 'Finance360 product overview — 3-minute video', 'Agenda walkthrough and rules of engagement'],
    output: null,
  },
  {
    time: '9:20 – 10:00', slot: 'Executive Dashboard & AI Overview', owner: 'Solutions Architect', type: 'demo',
    activities: [
      'Live walkthrough: Executive Summary, CFO tiles, and KPI narrative',
      'AI Q&A — natural language financial queries against BD utility financial data model',
      'Scenario modeling demonstration: rate case & ESA demand stress test and EPS sensitivity',
    ],
    output: 'Q&A capture sheet — stakeholder questions logged for POC scoping',
  },
  {
    time: '10:00 – 10:40', slot: 'Business Console Deep-Dives', owner: 'Solutions Architect', type: 'demo',
    activities: [
      'Missouri Revenue & Rate Base console — rate base growth, PISA deferral, margin bridge',
      'Illinois Electric & Gas Revenue Performance — BD Services and CVS Pharmacy revenue by customer class',
      'ESA Contracted Load & Pipeline Dashboard — new ESA contracts vs. pipeline, load by region',
      'Risks & Opportunities register and waterfall',
    ],
    output: null,
  },
  { time: '10:40 – 11:00', slot: 'Break', owner: '', type: 'break', activities: [], output: null },
  {
    time: '11:00 – 11:40', slot: 'Agentic Capabilities & Planning', owner: 'AI Lead', type: 'demo',
    activities: [
      'AI agents: automated commentary generation, anomaly detection, alert routing',
      'Planning & Forecasting: 18-month rolling EBITDA forecast and bridge walk by segment',
      'Presentation Hub: auto-generated MOR deck from live data',
      'Financial Close Tracker: agentic milestone management',
    ],
    output: null,
  },
  {
    time: '11:40 – 12:20', slot: 'Use Case Workshop', owner: 'Delivery Lead + Client', type: 'workshop',
    activities: [
      'Prioritize top 5 Finance360 use cases for your organization',
      'Map current pain points to platform capabilities',
      'Identify data sources and owners for POC scope',
      'Define success criteria for POC and Pilot phases',
    ],
    output: 'Use Case Priority Matrix — top 5 use cases ranked by value and feasibility',
  },
  {
    time: '12:20 – 12:50', slot: 'POC Scoping & Data Discovery', owner: 'Data Architect + Client', type: 'workshop',
    activities: [
      'Walk through Data Intake Template — field-by-field with client data owners',
      'Identify 2–4 priority data sources for POC extraction (SAP S/4HANA, Orders OMS, planning tool)',
      'Clarify data access, extract format, and refresh cadence',
      'Confirm IT/data team contacts and availability',
    ],
    output: 'Completed POC Data Intake Template with source contacts and field-level notes',
  },
  {
    time: '12:50 – 1:00', slot: 'Wrap-Up & Next Steps', owner: 'Delivery Lead', type: 'plenary',
    activities: ['Review session outputs and action items', 'Confirm POC kickoff date and timeline', 'Distribution of data extract templates to client team'],
    output: 'Action item log with owners and due dates',
  },
];

const MODULES = [
  { id: 'exec',     label: 'Executive Summary & CFO Tiles',                    icon: BarChart3,   recommended: true  },
  { id: 'consoles', label: 'Business Consoles (MO/IED/CVS Pharmacy/ATXI, ESA, Load)',  icon: TrendingUp,  recommended: true  },
  { id: 'ai-qna',   label: 'AI Q&A & Natural Language Search',                 icon: Cpu,         recommended: true  },
  { id: 'scenario', label: 'Scenario Modeling & Rate Case / ESA Stress Testing', icon: Shield,      recommended: true  },
  { id: 'ro',       label: 'Risks & Opportunities Register',                   icon: AlertCircle, recommended: false },
  { id: 'forecast', label: '18-Month Rolling EPS/Rate Base Forecast',           icon: TrendingUp,  recommended: false },
  { id: 'agents',   label: 'Agentic Workflows & Automation',                   icon: Zap,         recommended: false },
  { id: 'mor',      label: 'Monthly Operating Report Builder',                 icon: FileText,    recommended: false },
  { id: 'close',    label: 'Financial Close Tracker',                          icon: CheckCircle2,recommended: false },
  { id: 'data',     label: 'Data Foundation & Lineage',                        icon: Database,    recommended: false },
];

const PREWORK = [
  { group: 'Client (Data/Finance Team)', items: [
    'Identify 2–3 sample financial reports or dashboards currently used by the CFO/FP&A team',
    'Prepare a list of the top 5–10 recurring questions your finance team struggles to answer quickly',
    'Pull a sample of your segment P&L (Missouri and IED/CVS Pharmacy/ATXI) and cost center hierarchy',
    'Document your primary financial system of record (SAP S/4HANA version, data extract format)',
    'Identify who owns each major data source (ERP, Orders/OMS, backlog, CRM, planning tool)',
  ]},
  { group: 'Client (IT/Architecture Team)', items: [
    'Confirm cloud platform preference (AWS, Azure, GCP) and any enterprise standards',
    'Identify SSO/IdP in use (Okta, Entra ID, Ping) for future integration planning',
    'Note any data security or sovereignty requirements that would affect architecture',
    'Check firewall/VPN requirements for accessing a cloud-hosted demo environment',
  ]},
  { group: 'Accenture Delivery Team', items: [
    'Pre-configure Finance360 with BD branding, synthetic utility KPI data, and scripted AI scenarios',
    'Prepare live demo environment and backup recorded walkthrough',
    'Distribute pre-read one-pager and agenda to all attendees 48 hours in advance',
    'Send Use Case Priority Matrix template and Data Intake Template for pre-review',
  ]},
];

const ATTENDEES = [
  { role: 'CFO / Finance Executive',          why: 'Validate strategic relevance and set use case priorities',        required: true  },
  { role: 'VP / Director FP&A',               why: 'Evaluate analytical depth and data model fit',                    required: true  },
  { role: 'Finance Data Owner / Controller',  why: 'Assess data availability and KPI definitions',                    required: true  },
  { role: 'IT / Data Architecture Lead',      why: 'Review integration approach and security posture',                required: true  },
  { role: 'Missouri / Illinois Finance Lead',  why: 'Validate segment KPIs, ESA contracted load logic, and EPS drivers', required: false },
  { role: 'Chief Data / Analytics Officer',   why: 'Align on AI/agentic capabilities and data governance strategy',   required: false },
];

const TYPE_STYLE: Record<string, string> = {
  plenary: 'bg-gray-100 text-gray-600', demo: 'bg-blue-50 text-blue-700',
  workshop: 'bg-amber-50 text-amber-700', break: 'bg-gray-50 text-gray-400',
};

export default function DemoWorkshopClient() {
  const [selectedModules, setSelectedModules] = useState<Set<string>>(
    new Set(MODULES.filter(m => m.recommended).map(m => m.id))
  );
  const toggle = (id: string) => {
    setSelectedModules(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  return (
    <div className="space-y-7 pb-12">
      <Link href="/implementation-roadmap" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Roadmap
      </Link>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Play className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 1 of 4</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">Half-day Workshop</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Schedule a Demo Workshop</h1>
            <p className="text-xs text-gray-500 mt-0.5">4-hour interactive session — live Finance360 walkthrough tailored to BD use cases and stakeholder audience</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: 'Duration', value: '4 hours' },
          { icon: Users, label: 'Attendees', value: '4 – 8 people' },
          { icon: Calendar, label: 'Lead Time', value: '5 – 7 business days' },
          { icon: Star, label: 'Outputs', value: '3 scoping documents' },
        ].map(({ icon: Icon, label, value }, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Icon className="h-4 w-4 text-gray-600" /></div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-sm font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Configure Your Demo Agenda</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select the Finance360 modules you want covered — recommended modules pre-selected</p>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">{selectedModules.size} of {MODULES.length} modules</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MODULES.map(m => {
            const Icon = m.icon;
            const selected = selectedModules.has(m.id);
            return (
              <button key={m.id} onClick={() => toggle(m.id)}
                className={`flex items-center gap-3 text-left p-3 rounded-lg border transition-all ${selected ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Icon className={`h-3.5 w-3.5 ${selected ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${selected ? 'text-gray-900' : 'text-gray-500'}`}>{m.label}</p>
                </div>
                {m.recommended && <span className="text-[9px] bg-amber-50 text-amber-600 font-semibold px-1.5 py-0.5 rounded flex-shrink-0">Rec.</span>}
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selected ? 'bg-gray-800 border-gray-800' : 'border-gray-300'}`}>
                  {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Workshop Agenda</h2>
        <div className="space-y-2">
          {AGENDA.map((slot, i) => (
            <div key={i} className={`rounded-lg border p-3 ${slot.type === 'break' ? 'border-dashed border-gray-200' : 'border-gray-100'}`}>
              <div className="flex items-start gap-3">
                <div className="w-24 flex-shrink-0"><p className="text-[10px] font-mono font-semibold text-gray-500">{slot.time}</p></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-xs font-semibold text-gray-900">{slot.slot}</p>
                    {slot.type !== 'break' && <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${TYPE_STYLE[slot.type]}`}>{slot.type}</span>}
                    {slot.owner && <span className="text-[10px] text-gray-400">{slot.owner}</span>}
                  </div>
                  {slot.activities.length > 0 && (
                    <ul className="space-y-0.5 mt-1.5">
                      {slot.activities.map((a, j) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <div className="h-1 w-1 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600">{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {slot.output && (
                    <div className="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded px-2 py-1.5">
                      <Star className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-amber-700 font-medium">{slot.output}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Pre-Work Checklist</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {PREWORK.map((group, i) => (
            <div key={i}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{group.group}</p>
              <ul className="space-y-2">
                {group.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded border-2 border-gray-200 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Recommended Attendees</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Role</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Why Attend</th>
                <th className="text-center py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Required</th>
              </tr>
            </thead>
            <tbody>
              {ATTENDEES.map((a, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-800">{a.role}</td>
                  <td className="py-2 px-3 text-gray-500">{a.why}</td>
                  <td className="py-2 px-3 text-center">
                    {a.required ? <span className="inline-block w-4 h-4 rounded-full bg-gray-800" /> : <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-300" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">Ready to schedule?</p>
          <p className="text-gray-400 text-xs mt-0.5">Contact your Accenture Finance & Risk account team to book a session within 5–7 business days.</p>
        </div>
        <Link href="/implementation-roadmap/use-case-priorities"
          className="flex items-center gap-2 bg-white text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
          Next: Use Case Priorities <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}
