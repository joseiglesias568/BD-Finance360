// Runtime data comes from DB via lib/db/repositories/company.ts
// Also used directly by login page (no auth context for DB access)
import { BrandingConfig } from '../../types';

export const branding: BrandingConfig = {
  companyName: 'Becton, Dickinson and Company Inc.',
  ticker: 'VZ',
  platformName: 'BD Finance360',
  tagline: 'AI-Powered Financial Intelligence',
  subtitle: 'Real-time analytics and reporting for Verizon',
  logoPath: '/logo.svg',
  logoAlt: 'Verizon — Finance360',
  copyrightHolder: 'Becton, Dickinson and Company Inc.',
  copyrightYear: 2026,
  poweredBy: 'Accenture',
  designedBy: 'Accenture',
  ceo: 'Hans Vestberg',
  cfo: 'Tony Skiadas',
  cfoTitle: 'Chief Financial Officer',
  fiscalYearEnd: 'December 31',
  industry: 'Telecommunications',
  headquarters: 'New York, New York',
  // Verizon official brand colors
  //   Verizon Red:  #CD040B — primary brand color (Pantone 485 C equivalent)
  //   Black:        #1c519c — secondary
  //   White:        #FFFFFF — reversed text / backgrounds
  colors: {
    primary: '#CD040B',      // Verizon Red
    primaryDark: '#8B0000',  // Dark Red
    primaryLight: '#FDECEA', // Light Red tint
    primaryAlt: '#B0030A',   // Deep Red variant
    navBg: '#1c519c',        // Near-black nav background
    navBgLight: '#2D2D2D',   // Dark nav highlight
    accent: '#CD040B',       // Verizon Red accent
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3B82F6',
  },
};
