import prisma from '../prisma';
import type { BrandingConfig } from '@/config/types';

export async function getCompanyBranding(companyId: number = 1): Promise<BrandingConfig> {
  const company = await prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    include: { brandColors: true },
  });

  const colors = company.brandColors!;

  return {
    companyName: company.name,
    ticker: company.ticker,
    platformName: company.platformName,
    tagline: company.tagline,
    subtitle: company.subtitle,
    logoPath: company.logoPath,
    logoAlt: company.logoAlt,
    copyrightHolder: company.copyrightHolder,
    copyrightYear: company.copyrightYear,
    poweredBy: company.poweredBy,
    ceo: company.ceo,
    cfo: company.cfo,
    cfoTitle: 'Chief Financial Officer',
    fiscalYearEnd: company.fiscalYearEnd,
    industry: company.industry,
    headquarters: company.headquarters,
    designedBy: '',
    colors: {
      primary: colors.primary,
      primaryDark: colors.primaryDark,
      primaryLight: colors.primaryLight,
      primaryAlt: colors.primaryAlt,
      navBg: colors.navBg,
      navBgLight: colors.navBgLight,
      accent: colors.accent,
      success: colors.success,
      warning: colors.warning,
      danger: colors.danger,
      info: colors.info,
    },
  };
}
