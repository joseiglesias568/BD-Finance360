import { notFound } from 'next/navigation';
import { getActiveCompanyId, getBusinessConsoles } from '@/lib/db/repositories';
import ConsoleDetailClient from './ConsoleDetailClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { consoleid: string };
}

export default async function ConsoleDetailPage({ params }: Props) {
  const companyId = await getActiveCompanyId();
  const consoles = await getBusinessConsoles(companyId);

  // Match by slug (segment field) or by title-derived slug
  const slug = params.consoleid;
  const console = consoles.find(
    c =>
      c.segment === slug ||
      c.segment.toLowerCase() === slug ||
      c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );

  if (!console) notFound();

  return <ConsoleDetailClient console={console} consoleid={slug} />;
}
