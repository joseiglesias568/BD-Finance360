// v2
// Runtime data comes from DB via lib/db/repositories/company.ts
// Also used directly by login page (no auth context for DB access)
import { BrandingConfig } from '../../types';

export const branding: BrandingConfig = {
  companyName: 'Becton, Dickinson and Company',
  ticker: 'CVS',
  platformName: 'BD Finance360',
  tagline: 'AI-Powered Management Reporting',
  subtitle: 'Real-time analytics and reporting for Becton, Dickinson and Company',
  logoPath: '/logo.svg',
  logoAlt: 'BD — Finance360',
  copyrightHolder: 'Becton, Dickinson and Company',
  copyrightYear: 2026,
  poweredBy: 'Accenture',
  designedBy: 'Accenture',
  ceo: 'J. David Joyner',
  cfo: 'Brian O. Newman',
  cfoTitle: 'Executive Vice President & Chief Financial Officer',
  fiscalYearEnd: 'December 31',
  industry: 'Managed Care / Pharmacy / Health Services',
  headquarters: 'Woonsocket, Rhode Island',
  // BD official brand colors (Finance360 implementation)
  //   Navy Blue:    #003087 — primary brand; nav, buttons, active links
  //   Bright Blue:  #0071BC — secondary brand accent
  //   CVS Red:      #CC0000 — accent, calls-to-action
  //   Light Blue:   #A8D8EA — background tints, card highlights
  colors: {
    primary: '#003087',      // CVS Navy Blue
    primaryDark: '#002060',  // Deeper navy for hover / nav bg
    primaryLight: '#E8F2FA', // Light blue tint for card backgrounds
    primaryAlt: '#0071BC',   // Bright Blue variant
    navBg: '#003087',        // CVS Navy (nav / sidebar)
    navBgLight: '#0071BC',   // Bright Blue for highlights
    accent: '#CC0000',       // CVS Red (retail accent)
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#0071BC',
  },
};
