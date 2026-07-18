import { Smartphone } from 'lucide-react';
import type { ConsoleConfig } from '@/components/console/types';

export const digitalLoyaltyConfig: ConsoleConfig = {
  id: 'digital-loyalty',
  title: 'Digital Health & Member Experience',
  subtitle: 'Health100 adoption, member portal engagement, ExtraCare+ loyalty, digital Rx delivery, and MinuteClinic digital scheduling',
  icon: Smartphone,
  segment: 'digital-health',

  heroKPIs: [
    { id: 'platform-users', label: 'Health100 Members', metricKey: 'Health100 Members', format: 'compact' },
    { id: 'proptech-adoption', label: 'Digital Adoption Rate', metricKey: 'Digital Adoption Rate', format: 'percent' },
    { id: 'platform-revenue', label: 'ExtraCare+ Active Members', metricKey: 'ExtraCare+ Members', format: 'compact' },
    { id: 'client-onboardings', label: 'Digital Rx Fill Rate', metricKey: 'Digital Rx Fill Rate', format: 'percent' },
  ],

  primaryFilters: [
    {
      id: 'segment',
      label: 'Program',
      type: 'pills',
      options: [
        { value: 'All', label: 'All Programs' },
        { value: 'Health100', label: 'Health100' },
        { value: 'ExtraCare', label: 'ExtraCare+' },
        { value: 'DigitalRx', label: 'Digital Pharmacy' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'period',
      label: 'Period',
      type: 'pills',
      options: [
        { value: 'W', label: 'Weekly' },
        { value: 'M', label: 'Monthly' },
        { value: 'Q', label: 'Quarterly' },
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
      ],
      defaultValue: 'YoY',
    },
  ],

  secondaryFilters: [
    {
      id: 'memberTier',
      label: 'Member Tier',
      type: 'select',
      options: [
        { value: 'All', label: 'All Tiers' },
        { value: 'Medicare', label: 'Medicare Advantage' },
        { value: 'Commercial', label: 'Commercial / Employer' },
        { value: 'Medicaid', label: 'Medicaid' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'channel',
      label: 'Channel',
      type: 'select',
      options: [
        { value: 'All', label: 'All Channels' },
        { value: 'MobileApp', label: 'BD App' },
        { value: 'Web', label: 'MyAetna / CVS.com' },
        { value: 'MinuteClinic', label: 'MinuteClinic Digital' },
      ],
      defaultValue: 'All',
    },
    {
      id: 'ageGroup',
      label: 'Member Age Group',
      type: 'select',
      options: [
        { value: 'All', label: 'All Ages' },
        { value: 'Under45', label: 'Under 45' },
        { value: '45to64', label: '45–64' },
        { value: '65Plus', label: '65+ (Medicare)' },
      ],
      defaultValue: 'All',
    },
  ],
};
