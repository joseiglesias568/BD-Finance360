import { calculatePctComplete } from '@/lib/engines';
import prisma from '../prisma';
import type {
  MonthEndConfig,
  MonthEndExtraConfig,
  PhaseDisplay,
  MonthEndFinancialResults,
} from '@/config/types';

export async function getMonthEnd(companyId: number = 1): Promise<MonthEndConfig> {
  // Get close tasks
  const tasks = await prisma.closeTask.findMany({
    where: { companyId },
    orderBy: { id: 'asc' },
  });

  // Extract unique phases in order
  const phaseOrder: string[] = [];
  for (const task of tasks) {
    if (!phaseOrder.includes(task.phase)) {
      phaseOrder.push(task.phase);
    }
  }

  // Get journal entry stats
  const jeStats = await prisma.journalEntryStats.findUnique({
    where: { companyId },
  });

  // Get trial balance
  const trialBalance = await prisma.trialBalanceItem.findMany({
    where: { companyId },
    orderBy: { id: 'asc' },
  });

  return {
    phases: phaseOrder,
    tasks: tasks.map(t => ({
      id: t.externalId,
      phase: t.phase,
      name: t.name,
      status: t.status as 'completed' | 'in-progress' | 'pending' | 'blocked',
      owner: t.owner,
      dueDate: t.dueDate,
    })),
    journalEntries: {
      total: jeStats?.total ?? 0,
      totalAmount: jeStats?.totalAmount ?? 0,
      automated: jeStats?.automated ?? 0,
      manual: jeStats?.manual ?? 0,
    },
    trialBalance: trialBalance.map(tb => ({
      label: tb.label,
      actual: tb.actual,
      priorMonth: tb.priorMonth,
      budget: tb.budget,
    })),
  };
}

/** Derive extra month-end display config from core data */
export function deriveMonthEndExtra(config: MonthEndConfig): MonthEndExtraConfig {
  // Derive phase display from tasks
  const phaseDisplayMap: Record<string, PhaseDisplay> = {};
  const phaseIndexes = config.phases.reduce((acc, phase, idx) => {
    acc[phase] = idx;
    return acc;
  }, {} as Record<string, number>);

  for (const phase of config.phases) {
    const phaseTasks = config.tasks.filter(t => t.phase === phase);
    const completedCount = phaseTasks.filter(t => t.status === 'completed').length;
    const totalCount = phaseTasks.length;
    const progress = Math.round(calculatePctComplete(completedCount, totalCount));
    const hasInProgress = phaseTasks.some(t => t.status === 'in-progress');
    const allCompleted = totalCount > 0 && completedCount === totalCount;

    const phaseIdx = phaseIndexes[phase] ?? 0;
    const startDay = Math.max(1, phaseIdx * 2 + 1);
    const endDay = startDay + 1;

    phaseDisplayMap[phase] = {
      id: phase.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      days: `${startDay}-${endDay}`,
      status: allCompleted ? 'completed' : hasInProgress ? 'in-progress' : 'pending',
      progress,
    };
  }

  // Derive financial results from trial balance
  const tbMap: Record<string, { actual: number; priorMonth: number; budget: number }> = {};
  for (const tb of config.trialBalance) {
    tbMap[tb.label] = { actual: tb.actual, priorMonth: tb.priorMonth, budget: tb.budget };
  }

  const financialResults: MonthEndFinancialResults = {
    pl: {
      netRevenues: tbMap['Net Revenues'] ? { actual: tbMap['Net Revenues'].actual, prior: tbMap['Net Revenues'].priorMonth, budget: tbMap['Net Revenues'].budget } : { actual: 0, prior: 0, budget: 0 },
      costOfGoodsSold: tbMap['Cost of Goods Sold'] ? { actual: tbMap['Cost of Goods Sold'].actual, prior: tbMap['Cost of Goods Sold'].priorMonth, budget: tbMap['Cost of Goods Sold'].budget } : { actual: 0, prior: 0, budget: 0 },
      operatingExpenses: tbMap['Operating Expenses'] ? { actual: tbMap['Operating Expenses'].actual, prior: tbMap['Operating Expenses'].priorMonth, budget: tbMap['Operating Expenses'].budget } : { actual: 0, prior: 0, budget: 0 },
      gaExpenses: tbMap['G&A Expenses'] ? { actual: tbMap['G&A Expenses'].actual, prior: tbMap['G&A Expenses'].priorMonth, budget: tbMap['G&A Expenses'].budget } : { actual: 0, prior: 0, budget: 0 },
      depreciationAmortization: tbMap['Depreciation & Amortization'] ? { actual: tbMap['Depreciation & Amortization'].actual, prior: tbMap['Depreciation & Amortization'].priorMonth, budget: tbMap['Depreciation & Amortization'].budget } : { actual: 0, prior: 0, budget: 0 },
      operatingIncome: tbMap['Operating Income'] ? { actual: tbMap['Operating Income'].actual, prior: tbMap['Operating Income'].priorMonth, budget: tbMap['Operating Income'].budget } : { actual: 0, prior: 0, budget: 0 },
      netIncome: tbMap['Net Income'] ? { actual: tbMap['Net Income'].actual, prior: tbMap['Net Income'].priorMonth, budget: tbMap['Net Income'].budget } : { actual: 0, prior: 0, budget: 0 },
    },
    bs: {
      totalAssets: tbMap['Total Assets'] ? { current: tbMap['Total Assets'].actual, prior: tbMap['Total Assets'].priorMonth } : { current: 0, prior: 0 },
      totalLiabilities: tbMap['Total Liabilities'] ? { current: tbMap['Total Liabilities'].actual, prior: tbMap['Total Liabilities'].priorMonth } : { current: 0, prior: 0 },
      stockholdersDeficit: tbMap["Stockholders' Deficit"] || tbMap['Stockholders Deficit'] ? {
        current: (tbMap["Stockholders' Deficit"] || tbMap['Stockholders Deficit']).actual,
        prior: (tbMap["Stockholders' Deficit"] || tbMap['Stockholders Deficit']).priorMonth,
      } : { current: 0, prior: 0 },
    },
  };

  // Derive journal entry details from stats (limited placeholder entries based on real counts)
  const jeTotal = config.journalEntries.total;
  const jeAmount = config.journalEntries.totalAmount;
  const recentEntries = [
    {
      id: 'JE-AUTO-001',
      description: 'Automated Revenue Recognition',
      type: 'Recurring',
      amount: Math.round(jeAmount * 0.4 * 1000000),
      status: 'Posted',
      preparer: 'System',
      approver: 'Revenue Accounting',
      postDate: new Date().toISOString().split('T')[0],
    },
    {
      id: 'JE-AUTO-002',
      description: 'Cost Allocation — Property Operations',
      type: 'Recurring',
      amount: Math.round(jeAmount * 0.25 * 1000000),
      status: 'Posted',
      preparer: 'System',
      approver: 'Cost Accounting Manager',
      postDate: new Date().toISOString().split('T')[0],
    },
    {
      id: 'JE-MAN-001',
      description: 'Deferred Revenue Accrual',
      type: 'Manual',
      amount: Math.round(jeAmount * 0.15 * 1000000),
      status: 'Pending Approval',
      preparer: 'Revenue Accounting',
      approver: 'VP Finance',
      postDate: new Date().toISOString().split('T')[0],
    },
    {
      id: 'JE-MAN-002',
      description: 'Intercompany Eliminations',
      type: 'Manual',
      amount: Math.round(jeAmount * 0.1 * 1000000),
      status: 'Draft',
      preparer: 'Consolidation Team',
      approver: 'Corporate Controller',
      postDate: new Date().toISOString().split('T')[0],
    },
  ];

  // Derive volume trend from journal stats (simple proportional representation)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const volumeTrend = Array.from({ length: 5 }, (_, i) => {
    const monthIdx = (now.getMonth() - 4 + i + 12) % 12;
    const factor = 0.92 + (i * 0.02);
    return {
      month: monthNames[monthIdx],
      count: Math.round(jeTotal * factor),
      amount: Math.round(jeAmount * factor * 1000000),
    };
  });

  // Derive adjustments from trial balance variances
  const adjustmentQueue = config.trialBalance
    .filter(tb => {
      const variance = tb.actual - tb.budget;
      return Math.abs(variance) > 5;
    })
    .slice(0, 3)
    .map((tb, idx) => {
      const variance = tb.actual - tb.budget;
      return {
        id: `ADJ-${String(idx + 1).padStart(3, '0')}`,
        description: `${tb.label} — Budget Variance Adjustment`,
        impact: { pl: Math.round(variance * 1000000), bs: Math.round(-variance * 1000000) },
        status: idx === 0 ? 'approved' : 'pending',
        priority: Math.abs(variance) > 20 ? 'high' : 'medium',
        deadline: new Date(Date.now() + (idx + 1) * 86400000).toISOString().split('T')[0],
        preparer: 'Finance Team',
      };
    });

  return {
    phaseDisplayMap,
    recentEntries,
    volumeTrend,
    financialResults,
    adjustmentQueue,
  };
}
