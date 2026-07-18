// Runtime data comes from DB via lib/db/repositories/company.ts
// Also used directly by login page (no auth context for DB access)
import { BrandingConfig } from '../../types';

export const branding: BrandingConfig = {
  companyName: 'Baker Hughes Company',
  ticker: 'BKR',
  platformName: 'Baker Hughes Finance360',
  tagline: 'AI-Powered Financial Intelligence',
  subtitle: 'Real-time analytics and reporting for Baker Hughes',
  logoPath: '/logo.svg',
  logoAlt: 'Baker Hughes — Finance360',
  copyrightHolder: 'Baker Hughes Company',
  copyrightYear: 2026,
  poweredBy: 'Accenture',
  designedBy: 'Accenture',
  ceo: 'Lorenzo Simonelli',
  cfo: 'Ahmed Moghal',
  cfoTitle: 'Executive Vice President & Chief Financial Officer',
  fiscalYearEnd: 'December 31',
  industry: 'Energy Technology',
  headquarters: 'Houston, Texas',
  // Baker Hughes official brand colors
  //   Bright Teal:  #02BC94 — primary brand color (Pantone 7465 C)
  //   Dark Green:   #05322B — dark background / wordmark (Pantone 5535 C)
  //   Deep Teal:    #018374 — secondary / hover (Pantone 7716 C)
  //   White:        #FFFFFF — reversed text / light backgrounds
  colors: {
    primary: '#02BC94',      // Baker Hughes Bright Teal
    primaryDark: '#018374',  // Baker Hughes Deep Teal (hover / emphasis)
    primaryLight: '#E0F7F2', // Light tint for card backgrounds
    primaryAlt: '#029E7D',   // Mid-teal variant
    navBg: '#05322B',        // Baker Hughes Dark Green (nav / sidebar)
    navBgLight: '#0A4A3A',   // Slightly lighter dark green for highlights
    accent: '#02BC94',       // Bright Teal accent
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3B82F6',
  },
};
