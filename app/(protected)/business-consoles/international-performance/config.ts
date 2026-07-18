import { Package } from 'lucide-react';
import type { ConsoleConfig } from '@/components/console/types';

export const internationalConfig: ConsoleConfig = {
  id: 'international-performance',
  title: 'Health Services & Caremark PBM',
  subtitle: 'Pharmacy claims volume, specialty Rx growth, Stelara biosimilar conversion, TrueCost client transition, and Oak Street expansion',
  icon: Package,
  segment: 'hss',

  heroKPIs: [
    { id: 'intl-revenue', label: 'HSS Revenue', metricKey: 'HSS Revenue', format: 'currency' },
    { id: 'emea-growth', label: 'Pharmacy Claims (M)', metricKey: 'Pharmacy Claims Volume', format: 'compact' },
    { id: 'intl-office-count', label: 'Specialty Rx Growth', metricKey: 'Specialty Rx Growth', format: 'percent' },
    { id: 'fx-impact', label: 'HSS AOI', metricKey: 'HSS AOI', format: 'currency' },
  ],

  primaryFilters: [
    {
      id: 'region',
      label: 'Service Line',
      type: 'pills',
      options: [
        { value: 'All', label: 'All Lines' },
        { value: 'PBM', label: 'Caremark PBM' },
        { value: 'Specialty', label: 'Specialty Pharmacy' },
        { value: 'OakStreet', label: 'Oak Street Health' },
        { value: 'Infusion', label: 'Coram Infusion' },
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
        { value: 'Peers', label: 'vs PBM Peers' },
      ],
      defaultValue: 'YoY',
    },
  ],

  secondaryFilters: [
    {
      id: 'storeType',
      label: 'Drug Category',
      type: 'select',
      options: [
        { value: 'All', label: 'All Categories' },
        { value: 'Specialty', label: 'Specialty / Biosimilar' },
        { value: 'GLP1', label: 'GLP-1 (Ozempic/Wegovy)' },
        { value: 'Oncology', label: 'Oncology' },
        { value: 'Immunology', label: 'Immunology / Stelara' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'clientType',
      label: 'Client Type',
      type: 'pills',
      options: [
        { value: 'All', label: 'All Clients' },
        { value: 'Commercial', label: 'Commercial PBM' },
        { value: 'Government', label: 'Government / Part D' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'valueView',
      label: 'Value',
      type: 'pills',
      options: [
        { value: 'Total $', label: 'Total $' },
        { value: 'Per Claim', label: 'Per Claim' },
      ],
      defaultValue: 'Total $',
    },
  ],
};
