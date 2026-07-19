// v2
// Runtime data comes from DB via lib/db/repositories/company.ts
// Also used directly by login page (no auth context for DB access)
import { BrandingConfig } from '../../types';

export const branding: BrandingConfig = {
  companyName: 'Becton, Dickinson and Company',
  ticker: 'BDX',
  platformName: 'BD Finance360',
  tagline: 'AI-Powered Management Reporting',
  subtitle: 'Real-time analytics and reporting for Becton, Dickinson and Company',
  logoPath: '/logo.svg',
  logoAlt: 'BD Finance360',
  copyrightHolder: 'Becton, Dickinson and Company',
  copyrightYear: 2026,
  poweredBy: 'Accenture',
  designedBy: 'Accenture',
  ceo: 'Thomas E. Polen',
  cfo: 'Christopher J. DelOrefice',
  cfoTitle: 'Executive Vice President & Chief Financial Officer',
  fiscalYearEnd: 'September 30',
  industry: 'Medical Technology',
  headquarters: 'Franklin Lakes, New Jersey',
  // BD official brand colors (Finance360 implementation)
  //   BD Green:     #1c519c — globe icon green
  //   BD Navy:      #1B3A6B — primary navy blue (dominant in presentations)
  //   BD Orange:    #E87722 — accent/highlight color
  //   BD Light Blue:#4A90D9 — secondary highlight
  colors: {
    primary: '#1c519c',        // BD Blue (from official logo)
    primaryDark: '#163d78',    // Darker BD Blue
    primaryLight: '#e8f0fb',   // Light blue tint
    primaryAlt: '#e6421e',     // BD Red (globe accent)
    navBg: '#1c519c',          // BD Blue nav background
    navBgLight: '#2460b5',     // Slightly lighter BD Blue
    accent: '#e6421e',         // BD Red accent
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#4A90D9',
  },
};
