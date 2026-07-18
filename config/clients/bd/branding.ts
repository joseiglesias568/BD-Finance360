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
  //   BD Green:     #00A651 — primary brand; nav, buttons, active links
  //   Dark Green:   #007A3D — deep green for hover / nav bg
  //   BD Blue:      #005A8B — secondary brand accent
  //   Light Green:  #E6F5EC — background tints, card highlights
  colors: {
    primary: '#00A651',        // BD Green
    primaryDark: '#007A3D',    // Dark BD Green
    primaryLight: '#E6F5EC',   // Light green tint
    primaryAlt: '#005A8B',     // BD Blue (secondary)
    navBg: '#003B2C',          // Dark nav background
    navBgLight: '#004F3A',     // Slightly lighter nav
    accent: '#00A651',         // Accent/action color
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
};
