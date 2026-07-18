'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, ChevronLeft, CheckCircle2, BarChart3, Shield, TrendingUp,
  Calendar, DollarSign, Zap, FileText, Clock, Star, Globe, ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface RaciRow { activity: string; cfo: string; fpaSponsor: string; dataOwner: string; it: string; accenture: string; }
interface SuccessMetric { category: string; metric: string; baseline: string; poc: string; pilot: string; production: string; }
interface RoiInput { id: string; label: string; unit: string; defaultValue: number; step: number; min: number; max: number; impactPerUnit: number; description: string; }

const RACI: RaciRow[] = [
  { activity: 'Program charter & vision approval',             cfo: 'A', fpaSponsor: 'R', dataOwner: 'C', it: 'C', accenture: 'C' },
  { activity: 'Use case prioritization',                       cfo: 'C', fpaSponsor: 'A', dataOwner: 'R', it: 'I', accenture: 'R' },
  { activity: 'Data extract provision (POC)',                  cfo: 'I', fpaSponsor: 'A', dataOwner: 'R', it: 'C', accenture: 'C' },
  { activity: 'Platform architecture & cloud setup',           cfo: 'I', fpaSponsor: 'I', dataOwner: 'I', it: 'A', accenture: 'R' },
  { activity: 'KPI definition & validation (EBITDA/Orders)',   cfo: 'C', fpaSponsor: 'A', dataOwner: 'R', it: 'I', accenture: 'C' },
  { activity: 'Security & access control design',              cfo: 'I', fpaSponsor: 'C', dataOwner: 'I', it: 'A', accenture: 'R' },
  { activity: 'User acceptance testing (UAT)',                 cfo: 'I', fpaSponsor: 'A', dataOwner: 'R', it: 'C', accenture: 'C' },
  { activity: 'AI prompt calibration & validation',            cfo: 'C', fpaSponsor: 'A', dataOwner: 'R', it: 'I', accenture: 'R' },
  { activity: 'Change management & training',                  cfo: 'C', fpaSponsor: 'A', dataOwner: 'C', it: 'I', accenture: 'R' },
  { activity: 'Phase gate go/no-go decisions',                 cfo: 'A', fpaSponsor: 'R', dataOwner: 'C', it: 'C', accenture: 'C' },
  { activity: 'Ongoing KPI certification & governance',        cfo: 'I', fpaSponsor: 'A', dataOwner: 'R', it: 'C', accenture: 'I' },
  { activity: 'Vendor/contract management (Accenture)',        cfo: 'A', fpaSponsor: 'R', dataOwner: 'I', it: 'C', accenture: 'I' },
];

const SUCCESS_METRICS: SuccessMetric[] = [
  { category: 'Time to Insight',  metric: 'MOR preparation time (days)',                         baseline: '8–12',      poc: '—',      pilot: '3–4',      production: '< 1'       },
  { category: 'Time to Insight',  metric: 'EBITDA variance explained (hours to root cause)',      baseline: '4–8 hrs',   poc: '< 2 hr', pilot: '< 30 min', production: 'Real-time' },
  { category: 'Data Quality',     metric: 'KPI data freshness (hours after close)',               baseline: '24–48 hrs', poc: '24 hrs', pilot: '4–8 hrs',  production: '< 2 hrs'   },
  { category: 'Data Quality',     metric: '% certified metrics with documented lineage',          baseline: '~20%',      poc: '60%',    pilot: '85%',      production: '> 95%'     },
  { category: 'User Adoption',    metric: 'Finance360 weekly active users (pilot group)',         baseline: '0',         poc: '3–5',    pilot: '20–35',    production: '100%+ of target' },
  { category: 'User Adoption',    metric: 'User NPS score (quarterly survey)',                    baseline: '—',         poc: '—',      pilot: '> 35',     production: '> 50'      },
  { category: 'Business Impact',  metric: 'AI Q&A queries displacing analyst requests/week',     baseline: '0',         poc: '10–20',  pilot: '50–100',   production: '200+'      },
  { category: 'Business Impact',  metric: 'Orders forecast accuracy (MAPE)',                     baseline: '—',         poc: '—',      pilot: '< 5%',     production: '< 3%'      },
  { category: 'Financial',        metric: 'FP&A productivity savings (hrs/analyst/month)',       baseline: '0',         poc: '—',      pilot: '15–20',    production: '30–40'     },
  { category: 'Financial',        metric: 'Risk-adjusted ROI (cumulative)',                      baseline: '—',         poc: '—',      pilot: '1.2–1.5x', production: '3–5x'     },
];

const ROI_INPUTS: RoiInput[] = [
  { id: 'analysts', label: 'FP&A / Finance Analysts', unit: 'FTEs', defaultValue: 15, step: 1, min: 3, max: 100, impactPerUnit: 0.18, description: '~30 hrs/month saved per analyst at fully loaded cost' },
  { id: 'ebitda_margin', label: 'EBITDA Margin Improvement', unit: '0.1pp increment', defaultValue: 2, step: 1, min: 0, max: 10, impactPerUnit: 25, description: 'Each 0.1pp improvement on ~$25B revenue base ≈ +$25M EBITDA' },
  { id: 'orders_win', label: 'Orders Win Rate Improvement', unit: '0.5pp increment', defaultValue: 1, step: 1, min: 0, max: 8, impactPerUnit: 40, description: 'Each 0.5pp win rate gain on ~$8B orders pipeline ≈ +$40M orders' },
  { id: 'close_days', label: 'Close Cycle Reduction', unit: 'days saved', defaultValue: 2, step: 1, min: 0, max: 10, impactPerUnit: 0.05, description: 'Earlier close enables faster action on variances and guidance updates' },
];

const GOVERNANCE_CADENCE = [
  { freq: 'Weekly',    forum: 'Delivery Team Standup',    attendees: 'Accenture PM + Client FP&A Lead',       topics: ['Sprint progress', 'Blocker escalation', 'Data issues'] },
  { freq: 'Bi-weekly', forum: 'Working Group Review',     attendees: 'Data Steward + IT + Accenture Architect', topics: ['Integration status', 'Data quality review', 'UAT feedback'] },
  { freq: 'Monthly',   forum: 'Steering Committee',       attendees: 'CFO Sponsor + CIO + Accenture Lead',     topics: ['Phase milestones', 'Go/no-go decisions', 'Budget & scope', 'Risk review'] },
  { freq: 'Quarterly', forum: 'Executive Sponsor Review', attendees: 'CFO + Accenture Account Lead',           topics: ['ROI tracking', 'Phase gate approval', 'Roadmap alignment', 'Value realization'] },
];

const CATEGORY_COLOR: Record<string, string> = {
  'Time to Insight': 'text-blue-600 bg-blue-50', 'Data Quality': 'text-amber-700 bg-amber-50',
  'User Adoption': 'text-emerald-700 bg-emerald-50', 'Business Impact': 'text-purple-700 bg-purple-50', 'Financial': 'text-gray-700 bg-gray-100',
};

const RACI_CELL: Record<string, { bg: string; text: string; label: string }> = {
  R: { bg: 'bg-gray-800', text: 'text-white',    label: 'R' },
  A: { bg: 'bg-blue-600', text: 'text-white',    label: 'A' },
  C: { bg: 'bg-amber-100',text: 'text-amber-800',label: 'C' },
  I: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'I' },
};

function RaciCell({ val }: { val: string }) {
  const s = RACI_CELL[val] ?? { bg: 'bg-white', text: 'text-gray-300', label: '–' };
  return <td className="py-2 px-2 text-center"><span className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold ${s.bg} ${s.text}`}>{s.label}</span></td>;
}

export default function ExecutiveAlignmentClient() {
  const [values, setValues] = useState<Record<string, number>>(Object.fromEntries(ROI_INPUTS.map(r => [r.id, r.defaultValue])));
  const totalRoi = ROI_INPUTS.reduce((sum, r) => sum + (values[r.id] ?? r.defaultValue) * r.impactPerUnit, 0);

  return (
    <div className="space-y-7 pb-12">
      <Link href="/implementation-roadmap" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Roadmap
      </Link>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><Users className="h-5 w-5 text-gray-700" /></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 4 of 4</span>
            <h1 className="text-xl font-bold text-gray-900">Align Executive Sponsorship</h1>
            <p className="text-xs text-gray-500 mt-0.5">Steering committee charter, RACI, success metrics, ROI model, and governance cadence for the Finance360 program</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Steering Committee Charter</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            {[
              { label: 'Purpose', value: 'Provide executive oversight, resolve escalated blockers, and approve phase gate go/no-go decisions for the Finance360 implementation program.' },
              { label: 'Mandate', value: 'Hold Accenture and internal teams accountable to committed milestones, budget, and ROI targets; champion organizational change management at the leadership level.' },
              { label: 'Meeting Cadence', value: 'Monthly during Demo and POC phases; monthly through Pilot; quarterly once Production is live.' },
              { label: 'Decision Rights', value: 'Phase gate approvals, scope changes >10% of budget, data governance policy exceptions, security architecture decisions.' },
            ].map(({ label, value }, i) => (
              <div key={i}><p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p><p className="text-xs text-gray-700 mt-0.5">{value}</p></div>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Recommended Composition</p>
            <div className="space-y-2">
              {[
                { role: 'Executive Sponsor (Chair)', person: 'CFO',                   resp: 'Program champion, final decision authority, ROI accountability' },
                { role: 'Business Co-Sponsor',       person: 'VP Finance / FP&A',     resp: 'Day-to-day sponsor, use case champion, user adoption driver' },
                { role: 'Technology Sponsor',        person: 'CIO / VP Arch',         resp: 'IT integration oversight, security posture, infra decisions' },
                { role: 'Data Governance Lead',      person: 'Chief Data Officer',     resp: 'Data quality standards, governance policies, steward oversight' },
                { role: 'Change Management Lead',    person: 'CHRO or Finance Ops',   resp: 'Adoption program, training, communication strategy' },
                { role: 'Delivery Partner Lead',     person: 'Accenture Engagement Lead', resp: 'Delivery accountability, escalation point, quality assurance' },
              ].map(({ role, person, resp }, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-gray-500">{i + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-bold text-gray-800">{role}</p>
                      <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{person}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">{resp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-bold text-gray-900">RACI Matrix</h2>
          <div className="flex gap-2 ml-2">
            {Object.entries(RACI_CELL).map(([k, v]) => (
              <span key={k} className={`inline-flex items-center gap-1 text-[9px] font-semibold ${v.text}`}>
                <span className={`w-4 h-4 rounded text-center leading-4 ${v.bg} ${v.text}`}>{k}</span>
                {k === 'R' ? 'Responsible' : k === 'A' ? 'Accountable' : k === 'C' ? 'Consulted' : 'Informed'}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Activity</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">CFO</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">FP&A Lead</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Data Owner</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">IT/Arch</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Accenture</th>
              </tr>
            </thead>
            <tbody>
              {RACI.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-700">{row.activity}</td>
                  <RaciCell val={row.cfo} /><RaciCell val={row.fpaSponsor} /><RaciCell val={row.dataOwner} /><RaciCell val={row.it} /><RaciCell val={row.accenture} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Illustrative Business Case</h2>
            <p className="text-xs text-gray-500 mt-0.5">Adjust inputs to model the potential annual value impact — for discussion purposes only</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Estimated Annual Impact</p>
            <p className="text-2xl font-black text-gray-900">${totalRoi.toFixed(0)}M+</p>
            <p className="text-[10px] text-gray-400">across selected levers</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROI_INPUTS.map(r => (
            <div key={r.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-gray-800">{r.label}</p>
                <span className="text-xs font-bold text-gray-900">{values[r.id]}{r.unit.includes('FTE') ? ' ' + r.unit : r.unit.includes('pp') ? 'pp' : r.unit.includes('days') ? ' days' : ' ' + r.unit}</span>
              </div>
              <input type="range" min={r.min} max={r.max} step={r.step} value={values[r.id]}
                onChange={e => setValues(prev => ({ ...prev, [r.id]: Number(e.target.value) }))}
                className="w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-gray-800 cursor-pointer" />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[10px] text-gray-500">{r.description}</p>
                <p className="text-[10px] font-bold text-gray-700 flex-shrink-0 ml-2">+${(values[r.id] * r.impactPerUnit).toFixed(0)}M</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-3 flex items-start gap-1.5">
          <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
          Illustrative estimates only. Actual value realization depends on adoption, data quality, market conditions, and implementation scope. Not a guarantee of financial outcomes.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Program Success Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Metric</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Baseline</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide text-amber-600">POC Target</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide text-blue-600">Pilot Target</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Prod. Target</th>
              </tr>
            </thead>
            <tbody>
              {SUCCESS_METRICS.map((m, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${CATEGORY_COLOR[m.category] ?? 'bg-gray-100 text-gray-600'}`}>{m.category}</span>
                      <span className="font-medium text-gray-800">{m.metric}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right text-gray-500 font-mono">{m.baseline}</td>
                  <td className="py-2 px-3 text-right text-amber-700 font-semibold font-mono">{m.poc || '—'}</td>
                  <td className="py-2 px-3 text-right text-blue-700 font-semibold font-mono">{m.pilot}</td>
                  <td className="py-2 px-3 text-right font-semibold font-mono text-gray-900">{m.production}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Governance Cadence</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GOVERNANCE_CADENCE.map((g, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{g.freq}</p>
              <p className="text-xs font-bold text-gray-900 mb-1">{g.forum}</p>
              <p className="text-[10px] text-gray-500 mb-2">{g.attendees}</p>
              <ul className="space-y-1">
                {g.topics.map((t, j) => (
                  <li key={j} className="flex items-start gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                    <span className="text-[10px] text-gray-600">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-white font-bold text-base mb-1">You're ready to begin.</p>
            <p className="text-gray-400 text-xs max-w-lg">All four foundational steps are addressed. Book your Demo Workshop to kick off the journey from Day 1 to Production — with BD's Finance360 as your intelligent system of record for financial decision-making.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/implementation-roadmap/demo-workshop"
              className="flex items-center gap-2 bg-white text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
              Book Demo Workshop <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/implementation-roadmap" className="flex items-center gap-2 text-gray-400 text-xs hover:text-gray-200 transition-colors">
              Back to Roadmap Overview <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-700">
          {[
            { label: 'Demo → POC',         value: '3–4 days + 3–4 weeks' },
            { label: 'Data Sources (POC)',  value: '2–4 static extracts' },
            { label: 'Full ROI horizon',    value: '3–4 quarters' },
            { label: 'Delivery partner',    value: 'Accenture Finance & Risk' },
          ].map(({ label, value }, i) => (
            <div key={i}>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">{label}</p>
              <p className="text-xs font-bold text-white mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
