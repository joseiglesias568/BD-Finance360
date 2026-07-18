import { getActiveCompanyId, getCommentary, getPersonalizedInsights, getConsoleDriverTree } from '@/lib/db/repositories';
import CommentaryClient from './CommentaryClient';

export const dynamic = 'force-dynamic';

export default async function CommentaryPage() {
  const companyId = await getActiveCompanyId();
  const [commentary, insights, consoleTrees] = await Promise.all([
    getCommentary(companyId),
    getPersonalizedInsights(companyId),
    getConsoleDriverTree(companyId),
  ]);

  return <CommentaryClient commentary={commentary} insights={insights} consoleTrees={consoleTrees} />;
}
