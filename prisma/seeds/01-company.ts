import { PrismaClient } from '@prisma/client';

// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY2026 earnings (May 2026),
// FY2025 10-K (filed Nov 2025), and public investor relations materials.
// CEO: Thomas E. Polen | CFO: Christopher J. DelOrefice
// MedTech company: Medical Essentials, Connected Care, BioPharma Systems, Interventional.
// Fiscal year ends September 30. Waters Corporation spin-off completed February 2026.

export async function seedCompany(prisma: PrismaClient) {
  const company = await prisma.company.create({
    data: {
      name: 'Becton, Dickinson and Company',
      ticker: 'BDX',
      platformName: 'BD Finance360',
      tagline: 'AI-Powered Management Reporting',
      subtitle: 'Delivering data transparency and modernized reporting',
      logoPath: '/logo.svg',
      logoAlt: 'Becton, Dickinson and Company Logo',
      copyrightHolder: 'Becton, Dickinson and Company',
      copyrightYear: 2026,
      poweredBy: 'Accenture',
      ceo: 'Thomas E. Polen',
      cfo: 'Christopher J. DelOrefice',
      fiscalYearEnd: 'September 30',
      industry: 'Medical Technology',
      headquarters: 'Franklin Lakes, New Jersey',
    },
  });

  // Brand colors per BD brand guidelines.
  // BD Green #1c519c is the primary brand anchor; BD Dark Green #007A37 is the dark variant.
  await prisma.brandColors.create({
    data: {
      companyId: company.id,
      primary: '#1c519c',       // BD Green
      primaryDark: '#007A37',   // Dark Green
      primaryLight: '#E6F6ED',  // Light Green
      primaryAlt: '#0066CC',    // BD Blue
      navBg: '#007A37',         // Nav BG
      navBgLight: '#1c519c',    // Nav BG Light
      accent: '#0066CC',        // BD Blue accent
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3B82F6',
    },
  });

  console.log(`✅ Seeded company: ${company.name} (id: ${company.id})`);
  console.log(`✅ Seeded brand colors`);

  return company;
}
