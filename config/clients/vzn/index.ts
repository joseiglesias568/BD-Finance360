import { ClientConfig } from '../../types';
import { alerts } from './alerts';
import { branding } from './branding';
import { financials } from './financials';
import { hypotheses } from './hypotheses';
import { insightCharts } from './insight-charts';
import { kpis } from './kpis';
import { market } from './market';
import { monthEnd } from './monthEnd';
import { monthEndExtra } from './month-end-extra';
import { operations } from './operations';
import { reports } from './reports';
import { scenarios } from './scenarios';
import { strategic } from './strategic';

export const vznConfig: ClientConfig = {
  branding,
  financials,
  kpis,
  operations,
  scenarios,
  strategic,
  market,
  alerts,
  reports,
  monthEnd,
  insightCharts,
  hypotheses,
  monthEndExtra,
};

export default vznConfig;
