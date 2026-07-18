import { Building2 } from 'lucide-react';
import type { ConsoleConfig } from '@/components/console/types';

export const storeOperationsConfig: ConsoleConfig = {
  id: 'store-operations',
  title: 'PCW & Pharmacy Operations',
  subtitle: 'Same-store Rx growth, GLP-1 volume, HealthHUB clinical services, MinuteClinic visits, and reimbursement trend',
  icon: Building2,
  segment: 'pcw',

  heroKPIs: [
    { id: 'completion', label: 'Same-Store Rx Growth', metricKey: 'Same-Store Rx Growth', format: 'percent' },
    { id: 'otp', label: 'Annual Rx Volume', metricKey: 'Annual Rx Volume', format: 'compact' },
    { id: 'casm-ex', label: 'GLP-1 Market Share', metricKey: 'GLP-1 Market Share', format: 'percent' },
    { id: 'utilization', label: 'PCW AOI', metricKey: 'PCW AOI', format: 'currency' },
  ],

  primaryFilters: [
    {
      id: 'hub',
      label: 'Region',
      type: 'pills',
      options: [
        { value: 'All', label: 'All Regions' },
        { value: 'Northeast', label: 'Northeast' },
        { value: 'Southeast', label: 'Southeast' },
        { value: 'Midwest', label: 'Midwest' },
        { value: 'Southwest', label: 'Southwest' },
        { value: 'West', label: 'West' },
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
        { value: 'Peers', label: 'vs Industry' },
      ],
      defaultValue: 'YoY',
    },
  ],

  secondaryFilters: [
    {
      id: 'storeFormat',
      label: 'Store Format',
      type: 'select',
      options: [
        { value: 'All', label: 'All Formats' },
        { value: 'HealthHUB', label: 'HealthHUB' },
        { value: 'Standard', label: 'Standard Pharmacy' },
        { value: 'MinuteClinic', label: 'MinuteClinic Locations' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'drugCategory',
      label: 'Drug Category',
      type: 'select',
      options: [
        { value: 'All', label: 'All Categories' },
        { value: 'Generic', label: 'Generic Rx' },
        { value: 'Brand', label: 'Brand Rx' },
        { value: 'GLP1', label: 'GLP-1 / Weight Loss' },
        { value: 'Specialty', label: 'Specialty Rx' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'valueView',
      label: 'View',
      type: 'pills',
      options: [
        { value: 'Total $', label: 'Total $' },
        { value: 'Per Store', label: 'Per Store' },
      ],
      defaultValue: 'Total $',
    },
  ],
};
