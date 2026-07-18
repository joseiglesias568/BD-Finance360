import { Heart } from 'lucide-react';
import type { ConsoleConfig } from '@/components/console/types';

export const northAmericaConfig: ConsoleConfig = {
  id: 'north-america-performance',
  title: 'Health Care Benefits Performance',
  subtitle: 'Medical benefit ratio, Medicare Advantage margin recovery, HCB membership, and Aetna commercial health plan performance',
  icon: Heart,
  segment: 'hcb',

  heroKPIs: [
    { id: 'revenue', label: 'HCB Revenue', metricKey: 'HCB Revenue', format: 'currency' },
    { id: 'comp-sales', label: 'Medical Benefit Ratio', metricKey: 'Medical Benefit Ratio', format: 'percent' },
    { id: 'trasm', label: 'HCB AOI', metricKey: 'HCB AOI', format: 'currency' },
    { id: 'op-margin', label: 'HCB Operating Margin', metricKey: 'HCB Operating Margin', format: 'percent' },
  ],

  primaryFilters: [
    {
      id: 'segment',
      label: 'Plan Type',
      type: 'pills',
      options: [
        { value: 'All', label: 'All Plans' },
        { value: 'MA', label: 'Medicare Advantage' },
        { value: 'Medicaid', label: 'Medicaid' },
        { value: 'Commercial', label: 'Commercial Group' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'period',
      label: 'Period',
      type: 'pills',
      options: [
        { value: 'M', label: 'Monthly' },
        { value: 'Q', label: 'Quarterly' },
        { value: 'TTM', label: 'Trailing 12M' },
      ],
      defaultValue: 'Q',
    },
    {
      id: 'comparison',
      label: 'Compare',
      type: 'select',
      options: [
        { value: 'YoY', label: 'vs Last Year' },
        { value: 'QoQ', label: 'vs Last Quarter' },
        { value: 'Plan', label: 'vs Plan' },
        { value: 'Peers', label: 'vs Industry (MBR)' },
      ],
      defaultValue: 'YoY',
    },
  ],

  secondaryFilters: [
    {
      id: 'geography',
      label: 'Market',
      type: 'select',
      options: [
        { value: 'All', label: 'All Markets' },
        { value: 'National', label: 'National Accounts' },
        { value: 'Regional', label: 'Regional Markets' },
        { value: 'Individual', label: 'Individual & Exchange' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'planTier',
      label: 'MA Star Rating',
      type: 'select',
      options: [
        { value: 'All', label: 'All Plans' },
        { value: 'FiveStar', label: '5-Star Plans' },
        { value: 'FourPlusStar', label: '4+ Star Plans' },
        { value: 'BelowFour', label: 'Below 4 Star' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'valueView',
      label: 'View',
      type: 'pills',
      options: [
        { value: 'Total $', label: 'Total $' },
        { value: 'PMPM', label: 'Per Member (PMPM)' },
      ],
      defaultValue: 'Total $',
    },
  ],
};
