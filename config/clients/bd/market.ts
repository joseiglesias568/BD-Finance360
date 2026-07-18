// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/market.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q2-26] [CITED:EC-Q2-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// BD Q2 FY2026 earnings call, IR slides, 10-Q, and FY2025 Annual Report.
// Peer data from public filings and sell-side MedTech research (2026).
// ─────────────────────────────────────────────────────────────────────
import { MarketConfig } from '../../types';

export const market: MarketConfig = {
  totalMarketSize: '~$600B global medical technology market; BD primarily in infusion, injection, diagnostics, and Interventional TAMs',
  companyMarketShare: 3.0,             // BD ~$18B revenue / ~$600B MedTech market [DERIVED]
  marketShareTarget: 3.2,
  marketShareYoY: 0.1,
  segmentGrowth: 5.2,                  // Q2 FY26 reported revenue growth % [CITED:EC-Q2-26]

  competitors: [
    {
      name: 'Baxter International (BAX)',
      marketShare: 2.8,                // est. — Baxter ~$14B revenue in infusion/MedTech [ASSUMED]
      yoyChange: -0.2,
      color: '#003087',
      strengths: [
        'Direct competitor in infusion therapy and IV solutions — overlaps with BD Medical Essentials and Connected Care',
        'Hillrom acquisition provides patient monitoring capabilities competing with BD HemoSphere',
        'Strong critical care IV fluids and nutritional products — hospital systems procurement bundling',
        'Baxter undergoing significant restructuring (spin-off of Vantive kidney care) — creating competitive uncertainty',
        'Global manufacturing scale provides pricing leverage in IV solutions and infusion systems',
      ],
    },
    {
      name: 'Abbott Laboratories (ABT)',
      marketShare: 6.5,                // est. — Abbott ~$22B MedTech + diagnostics revenues [ASSUMED]
      yoyChange: 0.3,
      color: '#0072CE',
      strengths: [
        'Diagnostics segment competes with BD in specimen management and point-of-care testing',
        'Vascular and structural heart competes with BD Interventional (Peripheral Intervention)',
        'Continuous glucose monitoring (CGM) — adjacent to BD diabetes care and injection devices',
        'FreeStyle Libre CGM dominance limits BD penetration in diabetes management',
        'Strong Abbott Rapid Diagnostics competing in BD infectious disease testing markets',
      ],
    },
    {
      name: 'Medtronic (MDT)',
      marketShare: 9.5,                // est. — Medtronic ~$32B revenues [ASSUMED]
      yoyChange: -0.1,
      color: '#00A3E0',
      strengths: [
        'Largest global MedTech company — competes with BD across Interventional and infusion categories',
        'Cardiac and vascular overlaps with BD Peripheral Intervention and critical care',
        'Surgical robotics (Hugo) competitive threat to BD Surgery long-term',
        'Strong renal and endoscopy categories adjacent to BD Urology & Critical Care',
        'Global scale and hospital system relationships create bundling opportunities vs BD',
      ],
    },
    {
      name: 'Stryker Corporation (SYK)',
      marketShare: 5.2,                // est. — Stryker ~$22B revenues [ASSUMED]
      yoyChange: 0.4,
      color: '#FFC72C',
      strengths: [
        'Orthopaedics and surgical technology compete with BD Surgery and Interventional',
        'Stryker Instruments and medical segment overlaps with BD surgical disposables and kits',
        'Mako robotic surgery platform — competitive threat in procedure-driven device markets',
        'Sage Products (hygiene and skin care) competes with BD ChloraPrep and skin antiseptics',
        'Strong hospital relationships and GPO contracts compete for BD IDN agreements',
      ],
    },
    {
      name: 'Boston Scientific (BSX)',
      marketShare: 4.8,                // est. — Boston Scientific ~$16B revenues [ASSUMED]
      yoyChange: 0.5,
      color: '#E31837',
      strengths: [
        'Direct competitor in Peripheral Intervention (PI) — vascular, oncology intervention, electrophysiology',
        'Endoscopy and urology categories compete with BD Urology & Critical Care',
        'Strong structural heart and neuromodulation segments driving BSX revenue growth above industry',
        'BSX growing significantly faster than BD in interventional cardiology end-markets',
        'Recent acquisitions (Axonics, Apollo, Silk Road) expand competitive footprint in BD markets',
      ],
    },
    {
      name: 'ICU Medical (ICUI)',
      marketShare: 0.6,                // est. — ICU Medical ~$3B revenues [ASSUMED]
      yoyChange: 0.0,
      color: '#6B2C91',
      strengths: [
        'Focused competitor in infusion therapy — IV sets, needlefree connectors, and critical care',
        "Smiths Medical acquisition expanded ICU Medical's overlap with BD Connected Care infusion products",
        'Clave needlefree connector technology is a well-established alternative to BD safety connectors',
        'Hospital systems may prefer ICU Medical for primary infusion supplies with BD for pumps — split buying',
        'ICU Medical pricing can be aggressive in commoditized infusion consumables — margin pressure risk',
      ],
    },
  ],

  forwardOutlook: [
    {
      period: 'Q3 FY26',
      revenueGrowth: 4.8,
      marginExpansion: 0.3,
      keyDrivers: [
        'BD Alaris remediation approaching completion — Connected Care ramp accelerating',
        'BioPharma Systems destocking expected to ease in Q3 FY26',
        'Interventional maintaining +5%+ FXN organic growth momentum',
        'BD Excellence $200M cost-out fully achieved — margin benefit flows through',
      ],
    },
    {
      period: 'Q4 FY26',
      revenueGrowth: 5.2,
      marginExpansion: 0.4,
      keyDrivers: [
        'Full Alaris commercial return — Connected Care revenue acceleration',
        'GLP-1 delivery device orders beginning to ramp at BioPharma Systems',
        'FY2026 full-year organic growth ~2.5–3.5% FXN achieved',
        'Adj. EPS $12.52–$12.72 FY2026 guidance on track',
      ],
    },
    {
      period: 'Q1 FY27',
      revenueGrowth: 5.5,
      marginExpansion: 0.5,
      keyDrivers: [
        'BD Alaris next-generation development milestone — commercial pipeline restocking',
        'GLP-1 delivery device ramp contributing meaningful revenue to BioPharma Systems',
        'China VoBP stabilizing — emerging markets offset providing growth momentum',
        'Excellence Unleashed fully deployed — BD Excellence commercial + operational benefits compounding',
      ],
    },
    {
      period: 'Q2 FY27',
      revenueGrowth: 5.8,
      marginExpansion: 0.5,
      keyDrivers: [
        'Interventional maintaining mid-to-high single-digit organic growth',
        'BioPharma Systems recovering to +3–5% organic on GLP-1 tailwind',
        'Net leverage approaching 2.5x target — capital allocation optionality increasing',
        'New product launches driving revenue mix improvement',
      ],
    },
    {
      period: 'Q3 FY27',
      revenueGrowth: 6.0,
      marginExpansion: 0.4,
      keyDrivers: [
        'GLP-1 delivery device at scale — BioPharma Systems accelerating',
        'Adj. operating margin 25.5%+ target within reach',
        'FDA Warning Letter resolutions completed — full commercial freedom restored',
        'China VoBP stabilized; emerging markets now net-positive to BD growth',
      ],
    },
    {
      period: 'Q4 FY27',
      revenueGrowth: 6.2,
      marginExpansion: 0.5,
      keyDrivers: [
        'Net leverage 2.5x achieved — capital return framework expansion possible',
        'FY27 organic revenue growth 5–6% FXN — step-change from FY26 ~3%',
        'HemoSphere next-gen and BD Alaris next-gen driving Connected Care multi-year growth',
        'BD "Innovate" pipeline generating increasing new product revenue (target >20% of revenues)',
      ],
    },
  ],

  volumeTrends: [
    {
      period: 'Q1 FY25',
      revenue: 4332,
      volume: 2200,                    // est. units/procedures indexed [CONFIG-ONLY]
      averageRevenue: 2.97,
    },
    {
      period: 'Q2 FY25',
      revenue: 4480,
      volume: 2280,
      averageRevenue: 3.06,
    },
    {
      period: 'Q3 FY25',
      revenue: 4700,
      volume: 2380,
      averageReverage: 3.18,
      averageRevenue: 3.18,
    },
    {
      period: 'Q4 FY25',
      revenue: 4683,
      volume: 2360,
      averageRevenue: 2.69,
    },
    {
      period: 'Q1 FY26',
      revenue: 4486,
      volume: 2260,
      averageRevenue: 3.35,
    },
    {
      period: 'Q2 FY26',
      revenue: 4714,
      volume: 2380,
      averageRevenue: 3.58,
    },
  ],
};
