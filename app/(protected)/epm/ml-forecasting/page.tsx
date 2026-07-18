import { getActiveCompanyId, getMLForecastData } from '@/lib/db/repositories';
import MLForecastingClient from './MLForecastingClient';

export const dynamic = 'force-dynamic';

export default async function MLForecastingPage() {
  const companyId = await getActiveCompanyId();
  const forecastData = await getMLForecastData(companyId);

  return <MLForecastingClient data={forecastData} />;
}
