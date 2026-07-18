import { getActiveCompanyId } from '@/lib/db/repositories';
import prisma from '@/lib/db/prisma';
import CommodityTrackingClient from './CommodityTrackingClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Commodity Tracking | Delta',
};

export default async function CommodityTrackingPage() {
    const companyId = await getActiveCompanyId();

    const commodities = await prisma.commodityPrice.findMany({
        where: { companyId },
        orderBy: { periodLabel: 'asc' },
    });

    // Group by commodity name
    const grouped: Record<string, typeof commodities> = {};
    for (const row of commodities) {
        if (!grouped[row.commodity]) grouped[row.commodity] = [];
        grouped[row.commodity].push(row);
    }

    return (
        <CommodityTrackingClient commodityGroups={grouped} />
    );
}
