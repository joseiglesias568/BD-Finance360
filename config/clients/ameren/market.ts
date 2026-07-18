// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/market.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// BD Q1 2026 earnings call, IR slides, 10-Q, and 10-K.
// Peer data from public filings and AlphaSense research (May 2026).
// ─────────────────────────────────────────────────────────────────────
import { MarketConfig } from '../../types';

export const market: MarketConfig = {
  totalMarketSize: '~$4.5T total U.S. health care spend; Managed care + pharmacy benefit + retail pharmacy TAM',
  companyMarketShare: 6.8,              // CVS ~$72B market cap / ~$1T managed care + pharmacy market cap [ASSUMED]
  marketShareTarget: 7.2,
  marketShareYoY: 0.3,
  segmentGrowth: 6.2,                   // FY2026 revenue guidance growth rate [DERIVED]

  competitors: [
    {
      name: 'UnitedHealth Group / Optum (UNH)',
      marketShare: 18.5,               // UNH largest managed care by revenue and market cap [ASSUMED]
      yoyChange: 0.5,
      strengths: [
        'Largest integrated health care company — Optum (PBM + care delivery + analytics) + UnitedHealthcare (insurance)',
        'Scale advantage: >300M prescriptions, 67,000 physician practice Optum Care, 2,000+ MinuteClinics equivalent',
        'Optum Health value-based care model more advanced than Oak Street comparables',
        'Strongest commercial employer retention and largest group insurance book',
        'Data/analytics advantage through Optum Insight and claims data across 200M+ member-years',
      ],
    },
    {
      name: 'Cigna Group / Express Scripts (CI)',
      marketShare: 8.2,
      yoyChange: 0.1,
      strengths: [
        'Express Scripts is the largest PBM by prescription volume — direct competitive threat to Caremark',
        'Cigna Evernorth health services segment competes directly with BD Services',
        'Less vertically integrated pharmacy at retail — narrower scope than CVS footprint',
        'Strong commercial employer relationships; competitive in large group benefit administration',
        'Specialty pharmacy (Accredo) and home delivery pharmacy (Express Scripts) as primary channels',
      ],
    },
    {
      name: 'Humana (HUM)',
      marketShare: 6.1,
      yoyChange: -0.3,
      strengths: [
        'Pure-play Medicare Advantage competitor — most direct Aetna MA rival',
        'CenterWell (primary care) competes directly with Oak Street Health',
        'Strong individual MA market presence; Stars ratings historically competitive with Aetna',
        'Humana facing similar MA medical cost pressures — industry-wide challenge',
        'Less diversified than CVS (no retail pharmacy, smaller PBM) — single-segment risk',
      ],
    },
    {
      name: 'Elevance Health / IngenioRx (ELV)',
      marketShare: 9.5,
      yoyChange: 0.2,
      strengths: [
        'Second-largest commercial managed care plan by membership; strong Blue Cross Blue Shield licensee network',
        'IngenioRx PBM growing — competes with Caremark for commercial employer PBM mandates',
        'Medicaid managed care strength — large Medicaid membership footprint across states',
        'Less exposed to Medicare Advantage margin pressure — more diversified revenue mix',
        'Carelon health services division competing in care delivery; narrower vs Oak Street scale',
      ],
    },
    {
      name: 'Walgreens Boots Alliance (WBA)',
      marketShare: 4.2,
      yoyChange: -0.8,
      strengths: [
        'Most direct retail pharmacy competitor — ~8,700 U.S. Walgreens locations vs ~9,000 CVS',
        'VillageMD primary care partnership competes with BDHUB / MinuteClinic model',
        'WBA in significant financial distress — restructuring underway; potential competitive weakening',
        'Rite Aid pharmacy assets absorbed partially by CVS (competitive opportunity from WBA decline)',
        'Pharmacy script share declining vs CVS — CVS >29% and growing vs WBA',
      ],
    },
  ],

  forwardOutlook: [
    {
      period: 'Q2 2026',
      revenueGrowth: 5.5,
      marginExpansion: 0.3,
      keyDrivers: [
        'HCB: full-year MBR tracking to 90.5% guidance (Q1 Q was below due to PYD)',
        'HSS: Q2 AOI lower due to Q1 pull-forward reversal; ex-timing, tracking to full-year guide',
        'PCW: Stelara biosimilar conversion begins July 1 — H2 benefit',
        '60-40 H1/H2 earnings seasonality (H1 weighted)',
      ],
    },
    {
      period: 'H2 2026',
      revenueGrowth: 5.0,
      marginExpansion: 0.2,
      keyDrivers: [
        'Stelara biosimilar conversion benefit in H2 — cost savings flow to clients and member AOI',
        'Health100 platform launch — consumer engagement begins',
        'MA medical cost trends monitored carefully; CMS 2027 rate planning underway',
        'Leverage ratio continued improvement toward BBB target',
      ],
    },
    {
      period: 'FY2027',
      revenueGrowth: 6.0,
      marginExpansion: 0.5,
      keyDrivers: [
        'MA margin meaningful progress toward 3% target — year 3 of multi-year recovery',
        'Health100 member engagement driving retention and lower total cost of care',
        'CMS 2027 MA rates — step in right direction needed for sustainability',
        'Mid-teens EPS CAGR trajectory; balance sheet deleveraging opens capital return options',
      ],
    },
    {
      period: 'FY2028 Target',
      revenueGrowth: 6.5,
      marginExpansion: 1.2,
      keyDrivers: [
        'Medicare Advantage target margin 3% achieved',
        'Mid-teens adjusted EPS CAGR through 2028 — management commitment',
        'Health100 at scale — consumer data and engagement driving integrated care value',
        'Tennessee PBM legislation impact resolved',
        'Leverage ratio at BBB target — share repurchase program potential reactivation',
      ],
    },
  ],

  volumeTrends: [
    {
      period: 'Q1 2025',
      revenue: 94.6,
      volume: 464.2,
      averageRevenue: 2.25,
    },
    {
      period: 'Q2 2025',
      revenue: 91.5,
      volume: 455.0,
      averageRevenue: 2.10,
    },
    {
      period: 'Q3 2025',
      revenue: 94.0,
      volume: 460.0,
      averageRevenue: 2.15,
    },
    {
      period: 'Q4 2025',
      revenue: 97.0,
      volume: 465.0,
      averageRevenue: 2.20,
    },
    {
      period: 'Q1 2026',
      revenue: 100.4,
      volume: 464.7,
      averageRevenue: 2.57,
    },
  ],
};
