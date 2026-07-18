'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Database, ChevronLeft, ArrowRight, CheckCircle2,
  Clock, Shield, Zap, FileText, Globe, BarChart3,
} from 'lucide-react';

interface DataSource {
  id: string; name: string; category: string; description: string;
  deltaExample: string; useCases: string[]; extractFormat: string;
  refreshCadence: string; typicalReadiness: 'High' | 'Medium' | 'Low';
  accessMethod: string; keyFields: string[];
}

interface ReadinessDimension {
  id: string; label: string; icon: React.ElementType;
  description: string; questions: string[]; redFlags: string[];
}

const DATA_SOURCES: DataSource[] = [
  {
    id: 'erp', name: 'ERP / Financial System', category: 'Financial',
    description: 'System of record for all financial transactions, P&L, cost centers, intercompany, and legal entity reporting.',
    deltaExample: 'SAP S/4HANA — Missouri/IED/CVS Pharmacy/ATXI segment P&L, EBITDA by cost center, G&A, intercompany, and adjusted earnings lines',
    useCases: ['EBITDA Bridge', 'Cost Decomposition', 'MOR Automation', 'Earnings Prep'],
    extractFormat: 'JDBC/ODBC connector preferred; SAP BW/SAC extract as fallback',
    refreshCadence: 'Daily (actuals); Monthly (close)',
    typicalReadiness: 'High',
    accessMethod: 'SAP API / JDBC connector / BW extract',
    keyFields: ['GL Account', 'Cost Center', 'Legal Entity', 'Segment (MO/IED/CVS Pharmacy/ATXI)', 'Period', 'Amount', 'Currency'],
  },
  {
    id: 'orders', name: 'Orders Management System (OMS)', category: 'Operational',
    description: 'Central source for orders intake, backlog, cancellations, book-to-bill, and revenue recognition schedule by segment and geography.',
    deltaExample: 'Missouri/IED/CVS Pharmacy/ATXI revenue by rate class, ESA contracted load, by quarter',
    useCases: ['ESA Contracted Load & Pipeline Monitor', 'Revenue Bridge', 'Segment Dashboard', 'NLQ Financial Q&A'],
    extractFormat: 'Salesforce API or nightly extract via SFTP',
    refreshCadence: 'Daily (new orders); Weekly (backlog summary)',
    typicalReadiness: 'Medium',
    accessMethod: 'API or SFTP extract',
    keyFields: ['Order ID', 'Segment', 'Sub-segment', 'Geography', 'Date', 'Order Value', 'Backlog Status', 'Expected Revenue Quarter'],
  },
  {
    id: 'crm', name: 'CRM / Sales Pipeline', category: 'Operational',
    description: 'Sales pipeline, win/loss rates, account-level opportunity value, and commercial coverage ratios by segment and region.',
    deltaExample: 'Salesforce CRM — ESA pipeline by customer class, load growth opportunity by region, win rates vs. peers',
    useCases: ['Pipeline Coverage Analysis', 'Geographic Revenue Forecast', 'Scenario Modeling'],
    extractFormat: 'Salesforce API or structured export',
    refreshCadence: 'Daily (pipeline stage updates); Weekly (summary)',
    typicalReadiness: 'Medium',
    accessMethod: 'Salesforce API — requires CRM admin approval for Finance360 integration',
    keyFields: ['Opportunity ID', 'Account', 'Stage', 'Value', 'Probability', 'Expected Close Date', 'Segment', 'Region'],
  },
  {
    id: 'planning', name: 'Planning & Budgeting Tool', category: 'Financial',
    description: 'Annual operating plan (AOP), rolling forecast, and scenario model data — budget vs. actuals basis for variance analysis.',
    deltaExample: 'Anaplan / SAP BPC — AOP by segment (MO/IED/CVS Pharmacy/ATXI), rolling EBITDA forecast, orders plan and cost targets',
    useCases: ['EBITDA Bridge', '18-Month Forecast', 'Scenario Modeling', 'Board Reporting'],
    extractFormat: 'Anaplan API or structured export from planning cubes',
    refreshCadence: 'Monthly (budget refresh); Quarterly (reforecast)',
    typicalReadiness: 'Medium',
    accessMethod: 'Planning tool API or structured extract',
    keyFields: ['Scenario', 'Period', 'Segment', 'P&L Line', 'Plan Amount', 'Forecast Amount', 'Variance'],
  },
  {
    id: 'treasury', name: 'Treasury & FX Hedging Platform', category: 'Financial',
    description: 'Multi-currency exposure by segment and region, hedge portfolio mark-to-market, and effective FX impact on adjusted EBITDA.',
    deltaExample: 'BD Treasury system — FX hedge positions by currency pair, MTM value, translation vs. transaction exposure by segment',
    useCases: ['FX Exposure Analysis', 'EBITDA Decomposition', 'Scenario Modeling', 'Risks & Opportunities'],
    extractFormat: 'Treasury system export or structured API',
    refreshCadence: 'Daily (mark-to-market); Monthly (actuals close)',
    typicalReadiness: 'Medium',
    accessMethod: 'Treasury/risk management system export — Finance & Treasury approval required',
    keyFields: ['Date', 'Currency Pair', 'Hedge Type', 'Notional Amount', 'MTM Value', 'Exposure (USD domestic only)', 'Settlement Date'],
  },
  {
    id: 'hris', name: 'HRIS / Workforce Analytics', category: 'People',
    description: 'Headcount, labor cost, and productivity metrics by segment, function, and geography. Links to EBITDA cost bridge.',
    deltaExample: 'Workday / SAP SuccessFactors — utility segment headcount by state, labor cost trends, productivity (customers per employee)',
    useCases: ['Cost Bridge Analysis', 'Productivity Tracking', 'Scenario Modeling'],
    extractFormat: 'Workday/SuccessFactors API or structured HR data extract',
    refreshCadence: 'Monthly (headcount/cost reporting)',
    typicalReadiness: 'Medium',
    accessMethod: 'HR system API — requires HRIS team and legal review for compensation data sharing',
    keyFields: ['Employee ID (anonymized)', 'Segment', 'Function', 'Location', 'FTE Count', 'Cost Category', 'Period'],
  },
  {
    id: 'procurement', name: 'Procurement & Supply Chain', category: 'Operational',
    description: 'Supplier spend, purchase orders, savings vs. targets, and materials cost indices by category and segment.',
    deltaExample: 'SAP Ariba / MM — materials spend by category (steel, electronics, chemicals), supplier lead times, savings realization',
    useCases: ['Cost Bridge Analysis', 'Supply Chain Intelligence', 'Scenario Modeling'],
    extractFormat: 'SAP Ariba API or S/4HANA MM module extract',
    refreshCadence: 'Weekly (purchase orders); Monthly (spend analytics)',
    typicalReadiness: 'Low',
    accessMethod: 'SAP Ariba/MM API — requires Procurement and IT team coordination',
    keyFields: ['PO Number', 'Supplier', 'Category', 'Segment', 'Amount', 'Savings vs. Target', 'Lead Time', 'Period'],
  },
  {
    id: 'market', name: 'External Market & Energy Data', category: 'External',
    description: 'Load forecast data, MISO market prices, rate case benchmarks, competitor data, and clean energy transition indicators for scenario assumptions.',
    deltaExample: 'EIA load forecast data, MISO market data, S&P Global Platts, Bloomberg commodity feeds',
    useCases: ['Scenario Modeling', '18-Month Forecast', 'Competitive Intelligence', 'Risks & Opportunities'],
    extractFormat: 'API feeds (Rystad, Bloomberg, EIA) or manual quarterly upload',
    refreshCadence: 'Daily (rig count, commodity prices); Monthly (industry forecasts)',
    typicalReadiness: 'High',
    accessMethod: 'Third-party data APIs or structured Excel/JSON uploads',
    keyFields: ['Date', 'Indicator', 'Value', 'Source', 'Geography', 'Commodity/Segment'],
  },
];

const READINESS_DIMENSIONS: ReadinessDimension[] = [
  { id: 'availability', label: 'Data Availability', icon: Database, description: 'Is the data captured and stored in a queryable system today?',
    questions: ['Does this data exist in a system you can extract from (not just Excel files)?', 'Is at least 12 months of historical data available?', 'Is data available at the granularity required (daily/segment-level vs. monthly aggregate)?'],
    redFlags: ['Data only exists in emails or manually maintained spreadsheets', 'Less than 6 months of history available', 'Only available at annual/aggregate level'] },
  { id: 'quality', label: 'Data Quality', icon: CheckCircle2, description: 'Is the data accurate, complete, and consistently structured?',
    questions: ['Have data quality issues been identified and documented for this source?', 'Is there a known error rate or completeness gap in this dataset?', 'Are field definitions and business rules documented (data dictionary exists)?'],
    redFlags: ['Known completeness gaps >10%', 'No data dictionary or field definitions', 'Significant restatements occur regularly'] },
  { id: 'access', label: 'Technical Access', icon: Zap, description: 'Can Finance360 connect to or receive this data programmatically?',
    questions: ['Is there an API, JDBC/ODBC connector, or extract mechanism available?', 'What approvals are needed to grant data access to a cloud environment?', 'Is the data behind a firewall or VPN that requires special connectivity setup?'],
    redFlags: ['No programmatic extract capability exists', 'Multi-layer security approval process (>6 weeks)', 'Vendor restricts data export contractually'] },
  { id: 'governance', label: 'Data Governance', icon: Shield, description: 'Is there a clear owner, documented definitions, and appropriate handling rules?',
    questions: ['Is there a named data owner/steward for this source who can validate definitions?', 'Are there data classification or sensitivity requirements (confidential financial, commercial sensitivity)?', 'Is there a data sharing agreement or DPA required?'],
    redFlags: ['No identified data owner', 'Commercially sensitive data without appropriate controls', 'Legal/privacy review likely to extend timeline significantly'] },
  { id: 'latency', label: 'Refresh Latency', icon: Clock, description: 'How current does the data need to be for your priority use cases?',
    questions: ['What reporting cadence do your use cases require — real-time, daily, or monthly close?', 'Is the source system capable of providing data at that cadence without performance impact?', 'Are there SLA commitments on data freshness from the source system team?'],
    redFlags: ['Use case requires real-time but source only supports monthly extract', 'Batch window conflicts with business reporting deadlines', 'No SLA on extract delivery'] },
];

const READINESS_COLOR = { High: 'bg-emerald-100 text-emerald-700', Medium: 'bg-amber-50 text-amber-700', Low: 'bg-red-50 text-red-700' };

export default function DataReadinessClient() {
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  const setScore = (sourceId: string, dimId: string, val: number) => {
    setScores(prev => ({ ...prev, [sourceId]: { ...(prev[sourceId] ?? {}), [dimId]: val } }));
  };

  const sourceScore = (sourceId: string) => {
    const s = scores[sourceId];
    if (!s) return null;
    const vals = Object.values(s);
    if (vals.length === 0) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const scoreColor = (s: number | null) => {
    if (s === null) return 'text-gray-300';
    if (s >= 4) return 'text-emerald-600';
    if (s >= 3) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-7 pb-12">
      <Link href="/implementation-roadmap" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Roadmap
      </Link>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 3 of 4</span>
            <h1 className="text-xl font-bold text-gray-900">Appoint a Data Steward & Assess Readiness</h1>
            <p className="text-xs text-gray-500 mt-0.5">Score each priority data source across 5 readiness dimensions — surfaces blockers before POC kickoff</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {READINESS_DIMENSIONS.map(dim => {
          const Icon = dim.icon;
          return (
            <div key={dim.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <Icon className="h-4 w-4 text-gray-400 mb-2" />
              <p className="text-xs font-bold text-gray-900">{dim.label}</p>
              <p className="text-[10px] text-gray-500 mt-1 leading-snug">{dim.description}</p>
            </div>
          );
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">Data Source Readiness Scorecard</h2>
          <p className="text-[10px] text-gray-400">Rate each source 1 (Not Ready) – 5 (Fully Ready) per dimension</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide w-44">Data Source</th>
                {READINESS_DIMENSIONS.map(d => (
                  <th key={d.id} className="text-center py-2 px-2 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">{d.label.split(' ')[0]}</th>
                ))}
                <th className="text-center py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Score</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-500 text-[10px] uppercase tracking-wide">Typical</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map(src => {
                const avgScore = sourceScore(src.id);
                return (
                  <tr key={src.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3"><p className="font-medium text-gray-800">{src.name}</p><p className="text-[9px] text-gray-400">{src.category}</p></td>
                    {READINESS_DIMENSIONS.map(dim => (
                      <td key={dim.id} className="py-2 px-2 text-center">
                        <select value={scores[src.id]?.[dim.id] ?? ''} onChange={e => setScore(src.id, dim.id, Number(e.target.value))}
                          className="w-10 text-[10px] text-center border border-gray-200 rounded px-0.5 py-0.5 bg-white cursor-pointer">
                          <option value="">–</option>
                          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </td>
                    ))}
                    <td className={`py-2 px-3 text-center font-bold text-sm ${scoreColor(avgScore)}`}>{avgScore !== null ? avgScore.toFixed(1) : '—'}</td>
                    <td className="py-2 px-3"><span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${READINESS_COLOR[src.typicalReadiness]}`}>{src.typicalReadiness}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">Scores 1–2: Blocker (resolve before POC) · 3: Manageable risk · 4–5: Ready to proceed</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Data Source Reference Guide</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {DATA_SOURCES.map(src => (
            <div key={src.id} className="rounded-lg border border-gray-100 p-4 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-900">{src.name}</p>
                  <p className="text-[10px] text-gray-400">{src.category} · {src.accessMethod}</p>
                </div>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${READINESS_COLOR[src.typicalReadiness]}`}>{src.typicalReadiness} readiness</span>
              </div>
              <p className="text-[10px] text-gray-600 leading-snug mb-2">{src.deltaExample}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] mb-2">
                <div><span className="text-gray-400">Format: </span><span className="text-gray-700">{src.extractFormat.split(';')[0]}</span></div>
                <div><span className="text-gray-400">Cadence: </span><span className="text-gray-700">{src.refreshCadence.split(';')[0]}</span></div>
              </div>
              <div className="mb-2">
                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Key Fields</p>
                <div className="flex flex-wrap gap-1">{src.keyFields.map((f, i) => <span key={i} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{f}</span>)}</div>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Enables Use Cases</p>
                <div className="flex flex-wrap gap-1">{src.useCases.map((u, i) => <span key={i} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{u}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Data Steward Responsibilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: FileText, title: 'POC', items: ['Provide extract templates populated with sample data (SAP/Orders OMS)', 'Validate KPI definitions and business rules (EPS, rate base, PISA, FFO/debt)', 'Identify data quality issues before ingestion', 'Sign off on KPI values in Finance360 vs. source system'] },
            { icon: Zap, title: 'Pilot', items: ['Support API/connector setup with IT team', 'Maintain data dictionary and field mappings', 'Review automated pipeline output daily (first 2 weeks)', 'Escalate data quality issues to source system owners'] },
            { icon: Globe, title: 'Production', items: ['Own data quality SLAs for Finance360 consumers', 'Approve changes to metric definitions and calculations', 'Participate in quarterly data governance reviews', 'Champion Finance360 adoption with finance peers'] },
          ].map(({ icon: Icon, title, items }, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-xs font-bold text-gray-700">{title} Phase</p>
              </div>
              <ul className="space-y-1.5">
                {items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-gray-300 flex-shrink-0 mt-0.5" />
                    <span className="text-[10px] text-gray-600 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-gray-900 rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm">Data sources assessed</p>
          <p className="text-gray-400 text-xs mt-0.5">Now secure executive sponsorship and define the program governance structure.</p>
        </div>
        <Link href="/implementation-roadmap/executive-alignment"
          className="flex items-center gap-2 bg-white text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
          Next: Executive Alignment <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}
