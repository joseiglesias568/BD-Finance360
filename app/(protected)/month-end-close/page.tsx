import { getActiveCompanyId, getMonthEnd, deriveMonthEndExtra } from '@/lib/db/repositories';
import { calculatePctComplete, roundFinancial } from '@/lib/engines';
import MonthEndCloseClient from './MonthEndCloseClient';

export const dynamic = 'force-dynamic';

export default async function MonthEndClosePage() {
    const companyId = await getActiveCompanyId();
    const monthEnd = await getMonthEnd(companyId);

    // Derive extra display data from the core month-end config
    const monthEndExtra = deriveMonthEndExtra(monthEnd);

    // Pre-compute derived values on the server
    const completedTasks = monthEnd.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = monthEnd.tasks.length;
    const completionPercent = Math.round(calculatePctComplete(completedTasks, totalTasks));

    const jeTotal = monthEnd.journalEntries.total;
    const jeAutomated = monthEnd.journalEntries.automated;
    const jeManual = monthEnd.journalEntries.manual;
    const jePendingApproval = jeManual > 0 ? Math.max(1, roundFinancial(jeManual * 0.1, 0)) : 0;
    const jeAutomatedPct = Math.round(calculatePctComplete(jeAutomated, jeTotal));

    // Compute close period label (e.g. "November 2025")
    // Use current date minus 1 month since month-end close refers to the prior month
    const closePeriodDate = new Date();
    closePeriodDate.setMonth(closePeriodDate.getMonth() - 1);
    const closePeriod = closePeriodDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <MonthEndCloseClient
            monthEnd={monthEnd}
            monthEndExtra={monthEndExtra}
            completionPercent={completionPercent}
            jePendingApproval={jePendingApproval}
            jeAutomatedPct={jeAutomatedPct}
            closePeriod={closePeriod}
        />
    );
}
