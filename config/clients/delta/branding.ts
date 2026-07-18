// Runtime data comes from DB via lib/db/repositories/company.ts
// Also used directly by login page (no auth context for DB access)
import { BrandingConfig } from '../../types';

export const branding: BrandingConfig = {
  companyName: 'Delta Air Lines, Inc.',
  ticker: 'DAL',
  platformName: 'Delta Finance360',
  tagline: 'AI-Powered Financial Intelligence',
  subtitle: 'Real-time analytics and reporting for The Delta Difference',
  logoPath: '/logo.svg',
  logoAlt: 'Delta Air Lines — Finance360',
  copyrightHolder: 'Delta Air Lines, Inc.',
  copyrightYear: 2026,
  poweredBy: 'Accenture',
  designedBy: 'Accenture',
  // Erik S. Snell appointed CFO effective April 1, 2026 per the
  // March 5, 2026 leadership announcement.
  ceo: 'Edward H. Bastian',
  cfo: 'Erik Snell',
  cfoTitle: 'Chief Financial Officer',
  fiscalYearEnd: 'December 31',
  industry: 'Airline / Aviation',
  headquarters: 'Atlanta, Georgia',
  // Delta Air Lines official brand colors (Pantone references from brand standards)
  //   Delta Blue: #003B2C (Pantone 654 C) — primary brand color
  //   Delta Red:  #C01933 (Pantone 187 C) — accent/action color
  //   Dark Navy:  #003B2C                  — deep backgrounds
  //   Light Blue: #009AC7                  — secondary accent
  colors: {
    primary: '#003B2C',      // Delta Blue (Pantone 654 C)
    primaryDark: '#003B2C',  // Dark Navy
    primaryLight: '#D6E4F0', // Light Delta Blue tint
    primaryAlt: '#009AC7',   // Delta Light Blue
    navBg: '#003B2C',        // Dark Navy nav background
    navBgLight: '#003B2C',   // Delta Blue nav highlight
    accent: '#C01933',       // Delta Red (Pantone 187 C)
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#009AC7',         // Delta Light Blue
  },
};
