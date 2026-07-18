import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 22: BD Product Category Revenue Mix & Sales Occasion Profile
//
// Part 1 — ProductCategoryPerformance (BD Product Category Revenue Mix)
//   6 BD product categories x 2 channels (Direct Hospital, Distributor/GPO) + Consolidated
//   x 11 quarters
//   Key narrative: BioPharma Systems GLP-1 tailwind; PureWick fast growth;
//   Alaris consent decree headwind then recovery; Specimen Collection stable.
//
// Part 2 — DaypartPerformance (BD Sales Occasion Profile)
//   4 BD sales occasion types x 2 channels (Direct Hospital, Distributor/GPO) x 11 quarters
//   Key narrative: Pharma/Biotech Manufacturing driving growth on GLP-1;
//   Acute Care recovering as Alaris returns; Ambulatory growing faster than acute.
//
// Quarters: Q1-Q4 FY24, Q1-Q4 FY25, Q1-Q3 FY26  (11 total)
// BD fiscal year: Q1=Oct-Dec, Q2=Jan-Mar, Q3=Apr-Jun, Q4=Jul-Sep
// =============================================================================

const ALL_QUARTERS = [
  'Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24',
  'Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25',
  'Q1 FY26', 'Q2 FY26', 'Q3 FY26',
];

// BD total revenue ($M) by quarter
const QUARTERLY_REVENUE: Record<string, number> = {
  'Q1 FY24': 4580, 'Q2 FY24': 4650, 'Q3 FY24': 4720, 'Q4 FY24': 4920,
  'Q1 FY25': 4655, 'Q2 FY25': 4680, 'Q3 FY25': 4740, 'Q4 FY25': 4820,
  'Q1 FY26': 4630, 'Q2 FY26': 4714, 'Q3 FY26': 4850,
};

// Direct Hospital ~42% of revenue; Distributor/GPO ~58%
// Direct hospital channel slightly higher Q4 (capital equipment year-end); Q1 lower (budget resets)
function channelShare(quarter: string): { retail: number; mail: number } {
  const q = ALL_QUARTERS.indexOf(quarter);
  const qNum = (q % 4) + 1;
  if (qNum === 4) return { retail: 0.44, mail: 0.56 }; // Q4: higher direct on capital equipment
  if (qNum === 1) return { retail: 0.40, mail: 0.60 }; // Q1: lower direct (budget resets)
  return { retail: 0.42, mail: 0.58 };
}

function qi(quarter: string): number {
  return ALL_QUARTERS.indexOf(quarter);
}

function lerp(startVal: number, endVal: number, q: number, maxQ: number = 10): number {
  return startVal + (endVal - startVal) * (q / maxQ);
}

function jitter(value: number, seed: number, magnitude: number = 0.008): number {
  const hash = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  const noise = (hash - Math.floor(hash)) * 2 - 1;
  return +(value * (1 + noise * magnitude)).toFixed(2);
}

// =============================================================================
// PART 1: BD Product Category Revenue Mix
// =============================================================================

interface DrugCategoryDef {
  name: string;
  retailMix: [number, number];       // % of Direct Hospital revenue [start Q1 FY24, end Q3 FY26]
  mailMix: [number, number];         // % of Distributor/GPO revenue
  retailYoY: [number, number];       // YoY revenue growth % Direct Hospital
  mailYoY: [number, number];         // YoY revenue growth % Distributor/GPO
  retailTicket: [number, number];    // average selling price per unit — Direct Hospital ($)
  mailTicket: [number, number];      // average selling price per unit — Distributor/GPO ($)
  retailGrossMargin: [number, number]; // Direct Hospital gross margin %
  mailGrossMargin: [number, number];   // Distributor/GPO gross margin %
  retailCustomization: [number, number] | null;  // % with multi-year supply agreements
  mailCustomization: [number, number] | null;    // % with GPO contract coverage
  retailUnitsPerTxn: [number, number] | null;    // units per order (Direct Hospital)
  mailUnitsPerTxn: [number, number] | null;      // units per order (Distributor/GPO)
}

const DRUG_CATEGORIES: DrugCategoryDef[] = [
  // 1. Prefillable Syringes & Drug Delivery (Pharmaceutical Systems)
  //    GLP-1 demand surge — pharma customers scaling manufacturing capacity
  //    BD supplies prefillable syringes for Ozempic, Mounjaro, Wegovy, Zepbound
  //    Long-term supply agreements secured with major GLP-1 manufacturers
  {
    name: 'Prefillable Syringes & Drug Delivery',
    retailMix: [16.0, 20.0],   // growing share as GLP-1 pharma customers increase direct orders
    mailMix: [18.0, 22.0],     // GPO/distributor channel also growing as pharma volumes scale
    retailYoY: [4.0, 9.0],     // accelerating on GLP-1 manufacturing demand
    mailYoY: [4.5, 10.0],
    retailTicket: [12, 16],    // per unit $ — high volume syringe supply
    mailTicket: [11, 15],
    retailGrossMargin: [60.0, 64.0], // high margin — long-term pharma supply contracts
    mailGrossMargin: [55.0, 58.0],
    retailCustomization: [72.0, 82.0], // % with multi-year pharma supply agreements
    mailCustomization: [68.0, 78.0],
    retailUnitsPerTxn: [5000, 8000],   // units per order (thousands)
    mailUnitsPerTxn: [10000, 15000],
  },
  // 2. Infusion Systems & Accessories (BD Alaris)
  //    BD Alaris consent decree headwind (78% remediated Q2 FY26); recovering
  //    Smart pump systems + annual software licenses; significant recurring revenue
  //    Excellence Unleashed driving Alaris market re-entry and next-gen development
  {
    name: 'Infusion Systems & Accessories',
    retailMix: [18.0, 17.0],   // slight share decline on Alaris constraints, recovering
    mailMix: [12.0, 11.0],     // distributor channel limited on Alaris (primarily direct)
    retailYoY: [-2.0, 4.0],    // negative early (consent decree), recovering as remediation progresses
    mailYoY: [-1.5, 3.5],
    retailTicket: [3500, 4200], // Alaris pump system + annual software license ($)
    mailTicket: [2800, 3500],   // distributor channel (accessories and consumables)
    retailGrossMargin: [45.0, 52.0], // improving as software mix increases and volumes recover
    mailGrossMargin: [38.0, 44.0],
    retailCustomization: [85.0, 90.0], // % with service and software maintenance contract
    mailCustomization: [70.0, 78.0],
    retailUnitsPerTxn: [2, 4],   // Alaris systems per direct hospital order
    mailUnitsPerTxn: [1, 3],
  },
  // 3. Specimen Collection & Diagnostics (Vacutainer, BD MAX, BD Phoenix)
  //    Stable core business; Vacutainer dominant in blood collection globally
  //    BD MAX molecular diagnostics growing; point-of-care expansion
  //    China VoBP headwind on specimen collection products
  {
    name: 'Specimen Collection & Diagnostics',
    retailMix: [22.0, 21.0],   // slight share decline as higher-growth categories expand
    mailMix: [25.0, 24.0],     // large distributor/GPO channel (hospitals buy via GPO)
    retailYoY: [2.5, 4.0],     // stable with molecular diagnostics growth offsetting VoBP
    mailYoY: [2.0, 3.5],
    retailTicket: [8, 10],     // per unit — Vacutainer tubes, needles; high volume
    mailTicket: [7, 9],
    retailGrossMargin: [48.0, 51.0],
    mailGrossMargin: [42.0, 45.0],
    retailCustomization: [45.0, 52.0], // % under hospital IDN/GPO supply agreements
    mailCustomization: [60.0, 68.0],
    retailUnitsPerTxn: [500, 800],     // units per direct hospital order (thousands)
    mailUnitsPerTxn: [2000, 3000],
  },
  // 4. Vascular Access & Catheters (Interventional + Medical Essentials vascular)
  //    IV catheters, central venous access, PICCs; growing on interventional innovation
  //    BD PosiFlush, BD Nexiva vascular access products gaining market share
  {
    name: 'Vascular Access & Catheters',
    retailMix: [15.0, 15.5],   // stable to slight growth
    mailMix: [18.0, 18.5],
    retailYoY: [3.0, 5.0],     // market share gains driving above-market growth
    mailYoY: [2.8, 4.5],
    retailTicket: [45, 60],    // avg selling price per device ($)
    mailTicket: [38, 52],
    retailGrossMargin: [52.0, 55.0],
    mailGrossMargin: [46.0, 50.0],
    retailCustomization: [55.0, 63.0], // % with bundled supply agreements
    mailCustomization: [65.0, 73.0],
    retailUnitsPerTxn: [50, 80],       // devices per order
    mailUnitsPerTxn: [200, 350],
  },
  // 5. PureWick & Continence Products
  //    PureWick external catheter — fast-growing product; strong reorder dynamics
  //    Expanding beyond ICU into long-term care, home health, ambulatory
  //    Positive clinical outcomes driving hospital formulary inclusion
  {
    name: 'PureWick & Continence Products',
    retailMix: [8.0, 10.5],    // growing share of direct hospital revenue
    mailMix: [5.0, 7.0],       // distributor channel growing as LTC/home health expands
    retailYoY: [18.0, 28.0],   // fast-growing product line; hospital adoption accelerating
    mailYoY: [15.0, 24.0],
    retailTicket: [28, 35],    // per unit (single-use external catheter system)
    mailTicket: [24, 30],
    retailGrossMargin: [55.0, 60.0], // favorable margin — branded differentiated product
    mailGrossMargin: [48.0, 54.0],
    retailCustomization: [32.0, 45.0], // % with hospital formulary adoption agreements
    mailCustomization: [42.0, 55.0],
    retailUnitsPerTxn: [120, 200],     // units per order
    mailUnitsPerTxn: [500, 900],
  },
  // 6. Medication Management & Smart Pumps Software
  //    BD Pyxis medication dispensing systems; BD Alaris software platform
  //    High-margin recurring software and service revenue; BD Rowa pharmacy robotics
  //    Transition from hardware to software-driven recurring revenue model
  {
    name: 'Medication Management & Smart Pumps Software',
    retailMix: [21.0, 16.0],   // hardware component declining; software/recurring growing
    mailMix: [22.0, 17.5],
    retailYoY: [1.0, 5.0],     // overall modest growth; software component growing faster
    mailYoY: [0.8, 4.5],
    retailTicket: [1200, 1800], // annual software license + hardware maintenance ($)
    mailTicket: [900, 1400],
    retailGrossMargin: [42.0, 50.0], // improving as software mix increases
    mailGrossMargin: [36.0, 43.0],
    retailCustomization: [90.0, 95.0], // nearly universal service and software contracts
    mailCustomization: [82.0, 88.0],
    retailUnitsPerTxn: [1, 2],   // system or license per order
    mailUnitsPerTxn: [1, 2],
  },
];

function buildProductCategoryRecords(
  companyId: number,
  periodMap: Record<string, { id: number }>,
) {
  const records: Array<{
    companyId: number;
    periodId: number;
    category: string;
    segment: string;
    revenue: number;
    revenueYoY: number;
    mixPercent: number;
    mixChange: number;
    averageTicket: number;
    grossMarginPct: number;
    customizationRate: number | null;
    unitsPerTransaction: number | null;
  }> = [];

  const availableQuarters = ALL_QUARTERS.filter((q) => periodMap[q]);

  for (const quarter of availableQuarters) {
    const periodId = periodMap[quarter].id;
    const q = qi(quarter);
    const totalRev = QUARTERLY_REVENUE[quarter];
    const shares = channelShare(quarter);
    // Total BD revenue split by channel
    const directHospitalRev = totalRev * shares.retail;
    const distributorRev = totalRev * shares.mail;
    const seed = q * 1000;

    for (let ci = 0; ci < DRUG_CATEGORIES.length; ci++) {
      const dc = DRUG_CATEGORIES[ci];

      // Direct Hospital channel
      const rMixPct = lerp(dc.retailMix[0], dc.retailMix[1], q);
      const rCatRev = jitter(directHospitalRev * rMixPct / 100, seed + ci * 100 + 1);
      const rYoY = +lerp(dc.retailYoY[0], dc.retailYoY[1], q).toFixed(1);
      const rTicket = +lerp(dc.retailTicket[0], dc.retailTicket[1], q).toFixed(2);
      const rGM = +lerp(dc.retailGrossMargin[0], dc.retailGrossMargin[1], q).toFixed(1);
      const rCustom = dc.retailCustomization
        ? +lerp(dc.retailCustomization[0], dc.retailCustomization[1], q).toFixed(1)
        : null;
      const rUnits = dc.retailUnitsPerTxn
        ? +lerp(dc.retailUnitsPerTxn[0], dc.retailUnitsPerTxn[1], q).toFixed(2)
        : null;

      const rMixPrev = q > 0 ? lerp(dc.retailMix[0], dc.retailMix[1], q - 4 < 0 ? 0 : q - 4) : dc.retailMix[0];
      const rMixChangeBps = +((rMixPct - rMixPrev) * 100).toFixed(0);

      records.push({
        companyId, periodId, category: dc.name, segment: 'Direct Hospital',
        revenue: rCatRev, revenueYoY: rYoY, mixPercent: +rMixPct.toFixed(1),
        mixChange: rMixChangeBps, averageTicket: rTicket, grossMarginPct: rGM,
        customizationRate: rCustom, unitsPerTransaction: rUnits,
      });

      // Distributor/GPO channel
      const mMixPct = lerp(dc.mailMix[0], dc.mailMix[1], q);
      const mCatRev = jitter(distributorRev * mMixPct / 100, seed + ci * 100 + 2);
      const mYoY = +lerp(dc.mailYoY[0], dc.mailYoY[1], q).toFixed(1);
      const mTicket = +lerp(dc.mailTicket[0], dc.mailTicket[1], q).toFixed(2);
      const mGM = +lerp(dc.mailGrossMargin[0], dc.mailGrossMargin[1], q).toFixed(1);
      const mCustom = dc.mailCustomization
        ? +lerp(dc.mailCustomization[0], dc.mailCustomization[1], q).toFixed(1)
        : null;
      const mUnits = dc.mailUnitsPerTxn
        ? +lerp(dc.mailUnitsPerTxn[0], dc.mailUnitsPerTxn[1], q).toFixed(2)
        : null;

      const mMixPrev = q > 0 ? lerp(dc.mailMix[0], dc.mailMix[1], q - 4 < 0 ? 0 : q - 4) : dc.mailMix[0];
      const mMixChangeBps = +((mMixPct - mMixPrev) * 100).toFixed(0);

      records.push({
        companyId, periodId, category: dc.name, segment: 'Distributor/GPO',
        revenue: mCatRev, revenueYoY: mYoY, mixPercent: +mMixPct.toFixed(1),
        mixChange: mMixChangeBps, averageTicket: mTicket, grossMarginPct: mGM,
        customizationRate: mCustom, unitsPerTransaction: mUnits,
      });

      // Consolidated (blend direct + distributor)
      const consRev = +(rCatRev + mCatRev).toFixed(2);
      const totalBDRev = directHospitalRev + distributorRev;
      const consMixPct = totalBDRev > 0 ? +(consRev / totalBDRev * 100).toFixed(1) : 0;
      const rWt = directHospitalRev / totalBDRev;
      const mWt = distributorRev / totalBDRev;
      const consYoY = +(rWt * rYoY + mWt * mYoY).toFixed(1);
      const consTicket = +(rWt * rTicket + mWt * mTicket).toFixed(2);
      const consGM = +(rWt * rGM + mWt * mGM).toFixed(1);
      const consMixChange = +(rWt * rMixChangeBps + mWt * mMixChangeBps).toFixed(0);

      let consCustom: number | null = null;
      if (rCustom !== null && mCustom !== null) {
        consCustom = +(rWt * rCustom + mWt * mCustom).toFixed(1);
      } else if (rCustom !== null) {
        consCustom = rCustom;
      } else if (mCustom !== null) {
        consCustom = mCustom;
      }

      let consUnits: number | null = null;
      if (rUnits !== null) {
        consUnits = rUnits; // use direct hospital units as primary metric
      }

      records.push({
        companyId, periodId, category: dc.name, segment: 'Consolidated',
        revenue: consRev, revenueYoY: consYoY, mixPercent: consMixPct,
        mixChange: +consMixChange, averageTicket: consTicket, grossMarginPct: consGM,
        customizationRate: consCustom, unitsPerTransaction: consUnits,
      });
    }
  }
  return records;
}

// =============================================================================
// PART 2: BD Sales Occasion Profile
// Replaces prescribing occasion with BD sales occasion type
// =============================================================================

interface PrescribingOccasionDef {
  name: string;
  // Direct Hospital channel metrics
  pcwTxnPct: [number, number];    // % of direct hospital volume in this occasion type
  pcwRevPct: [number, number];    // % of direct hospital revenue
  pcwCompSales: [number, number]; // YoY volume growth in this occasion type
  pcwTicket: [number, number];    // avg order value per occasion ($)
  pcwLaborPct: [number, number];  // clinical specialist cost as % of revenue
  pcwThroughput: [number, number]; // units per rep per quarter
  pcwFoodAttach: [number, number]; // % of occasions with service contract
  // Distributor/GPO channel metrics
  hssTxnPct: [number, number];
  hssRevPct: [number, number];
  hssCompSales: [number, number];
  hssTicket: [number, number];
  hssLaborPct: [number, number];
  hssThroughput: [number, number];
  hssFoodAttach: [number, number];
}

const PRESCRIBING_OCCASIONS: PrescribingOccasionDef[] = [
  // 1. Acute Care / Critical Care Procurement
  //    ICU, ED, perioperative — BD Alaris, vascular access, specimen collection
  //    Recovering as Alaris consent decree progresses (78% remediated Q2 FY26)
  //    High-value capital equipment + high-volume consumables
  {
    name: 'Acute Care / Critical Care Procurement',
    pcwTxnPct: [28.0, 27.5],    // stable to slight decline as ambulatory grows faster
    pcwRevPct: [32.0, 30.5],    // high revenue share on Alaris capital equipment
    pcwCompSales: [2.5, 4.0],   // growing as Alaris returns to market
    pcwTicket: [3200, 4000],    // Alaris + vascular access systems — high-value
    pcwLaborPct: [8.0, 7.5],    // clinical specialists cost
    pcwThroughput: [45, 55],    // units per rep per quarter
    pcwFoodAttach: [82.0, 88.0], // % with service/software maintenance contract
    hssTxnPct: [22.0, 21.5],
    hssRevPct: [26.0, 25.0],
    hssCompSales: [2.0, 3.5],
    hssTicket: [2800, 3500],
    hssLaborPct: [5.0, 4.5],
    hssThroughput: [120, 145],
    hssFoodAttach: [68.0, 74.0],
  },
  // 2. Ambulatory / Outpatient / ASC Procurement
  //    Growing channel as care shifts from inpatient to outpatient
  //    ASC, physician office, infusion center — PureWick, IV therapy, diagnostics
  //    BD Alaris ambulatory infusion pumps; higher growth than acute
  {
    name: 'Ambulatory / Outpatient / ASC Procurement',
    pcwTxnPct: [22.0, 24.0],   // growing share as care shifts outpatient
    pcwRevPct: [18.0, 20.0],
    pcwCompSales: [4.0, 6.5],  // outpatient growing faster than inpatient
    pcwTicket: [850, 1100],    // mix of capital and consumables; lower than acute
    pcwLaborPct: [7.0, 6.5],
    pcwThroughput: [120, 145],
    pcwFoodAttach: [62.0, 70.0],
    hssTxnPct: [26.0, 28.0],
    hssRevPct: [22.0, 24.0],
    hssCompSales: [3.5, 6.0],
    hssTicket: [680, 880],
    hssLaborPct: [4.5, 4.0],
    hssThroughput: [280, 340],
    hssFoodAttach: [52.0, 60.0],
  },
  // 3. Pharmaceutical / Biotech Manufacturing Supply
  //    GLP-1 pharma demand driving fastest growth — prefillable syringes, drug delivery
  //    BD Pharmaceutical Systems: long-term supply agreements with Novo Nordisk, Eli Lilly
  //    Bulk B2B pharma orders; high revenue concentration; long-term contracts
  {
    name: 'Pharmaceutical / Biotech Manufacturing Supply',
    pcwTxnPct: [18.0, 21.0],   // GLP-1 pharma driving growing share
    pcwRevPct: [22.0, 28.0],   // high revenue concentration — bulk syringe supply
    pcwCompSales: [5.0, 11.0], // GLP-1 tailwind; strongest growth occasion
    pcwTicket: [12000, 18000], // bulk pharma supply orders ($)
    pcwLaborPct: [4.5, 4.0],   // B2B pharma; lower clinical touch required
    pcwThroughput: [8, 15],    // large orders per rep per quarter
    pcwFoodAttach: [92.0, 96.0], // long-term supply agreements near-universal
    hssTxnPct: [14.0, 17.0],
    hssRevPct: [18.0, 24.0],
    hssCompSales: [4.5, 10.0],
    hssTicket: [9500, 14000],
    hssLaborPct: [3.5, 3.0],
    hssThroughput: [22, 38],
    hssFoodAttach: [88.0, 94.0],
  },
  // 4. Long-Term Care / Home Health / Government
  //    PureWick home health expansion; government VA/DOD contracts; LTC facilities
  //    Stable to slow growth; government contract renewals key; home health growing
  {
    name: 'Long-Term Care / Home Health / Government',
    pcwTxnPct: [32.0, 27.5],   // stable/declining share as acute and pharma grow faster
    pcwRevPct: [28.0, 21.5],
    pcwCompSales: [1.0, 2.0],  // slow growth; government budget constraints
    pcwTicket: [180, 220],     // avg order value — consumables and smaller devices
    pcwLaborPct: [6.0, 5.5],
    pcwThroughput: [280, 320],
    pcwFoodAttach: [45.0, 52.0],
    hssTxnPct: [38.0, 33.5],
    hssRevPct: [34.0, 27.0],
    hssCompSales: [0.8, 1.8],
    hssTicket: [145, 178],
    hssLaborPct: [4.0, 3.5],
    hssThroughput: [620, 680],
    hssFoodAttach: [38.0, 45.0],
  },
];

function buildDaypartRecords(
  companyId: number,
  periodMap: Record<string, { id: number }>,
) {
  const records: Array<{
    companyId: number;
    periodId: number;
    daypart: string;
    segment: string;
    transactionPct: number;
    revenuePct: number;
    compSales: number;
    averageTicket: number;
    laborCostPct: number;
    throughputMinutes: number | null;
    foodAttachRate: number | null;
  }> = [];

  const availableQuarters = ALL_QUARTERS.filter((q) => periodMap[q]);

  for (const quarter of availableQuarters) {
    const periodId = periodMap[quarter].id;
    const q = qi(quarter);
    const seed = q * 2000;

    for (let di = 0; di < PRESCRIBING_OCCASIONS.length; di++) {
      const po = PRESCRIBING_OCCASIONS[di];

      // Direct Hospital channel
      const pcwTxnPct = +lerp(po.pcwTxnPct[0], po.pcwTxnPct[1], q).toFixed(1);
      const pcwRevPct = +lerp(po.pcwRevPct[0], po.pcwRevPct[1], q).toFixed(1);
      const pcwComp = +lerp(po.pcwCompSales[0], po.pcwCompSales[1], q).toFixed(1);
      const pcwTicket = +lerp(po.pcwTicket[0], po.pcwTicket[1], q).toFixed(0);
      const pcwLabor = +lerp(po.pcwLaborPct[0], po.pcwLaborPct[1], q).toFixed(1);
      const pcwThru = +lerp(po.pcwThroughput[0], po.pcwThroughput[1], q).toFixed(0);
      const pcwAttach = +lerp(po.pcwFoodAttach[0], po.pcwFoodAttach[1], q).toFixed(1);

      records.push({
        companyId, periodId, daypart: po.name, segment: 'Direct Hospital',
        transactionPct: jitter(pcwTxnPct, seed + di * 50 + 1, 0.005),
        revenuePct: jitter(pcwRevPct, seed + di * 50 + 2, 0.005),
        compSales: pcwComp, averageTicket: +pcwTicket,
        laborCostPct: pcwLabor, throughputMinutes: +pcwThru, foodAttachRate: pcwAttach,
      });

      // Distributor/GPO channel
      const hssTxnPct = +lerp(po.hssTxnPct[0], po.hssTxnPct[1], q).toFixed(1);
      const hssRevPct = +lerp(po.hssRevPct[0], po.hssRevPct[1], q).toFixed(1);
      const hssComp = +lerp(po.hssCompSales[0], po.hssCompSales[1], q).toFixed(1);
      const hssTicket = +lerp(po.hssTicket[0], po.hssTicket[1], q).toFixed(0);
      const hssLabor = +lerp(po.hssLaborPct[0], po.hssLaborPct[1], q).toFixed(1);
      const hssThru = +lerp(po.hssThroughput[0], po.hssThroughput[1], q).toFixed(0);
      const hssAttach = +lerp(po.hssFoodAttach[0], po.hssFoodAttach[1], q).toFixed(1);

      records.push({
        companyId, periodId, daypart: po.name, segment: 'Distributor/GPO',
        transactionPct: jitter(hssTxnPct, seed + di * 50 + 3, 0.005),
        revenuePct: jitter(hssRevPct, seed + di * 50 + 4, 0.005),
        compSales: hssComp, averageTicket: +hssTicket,
        laborCostPct: hssLabor, throughputMinutes: +hssThru, foodAttachRate: hssAttach,
      });
    }
  }
  return records;
}

// =============================================================================
// Main seed function
// =============================================================================

export async function seedProductAndDaypart(
  prisma: PrismaClient,
  companyId: number,
  periodMap: Record<string, { id: number }>,
) {
  const productRecords = buildProductCategoryRecords(companyId, periodMap);
  if (productRecords.length > 0) {
    await prisma.productCategoryPerformance.createMany({ data: productRecords });
  }
  console.log(
    `Seeded ${productRecords.length} BD (Becton, Dickinson) product category revenue records ` +
    `(${ALL_QUARTERS.filter((q) => periodMap[q]).length} quarters x 6 product categories x 3 segments)`,
  );

  const daypartRecords = buildDaypartRecords(companyId, periodMap);
  if (daypartRecords.length > 0) {
    await prisma.daypartPerformance.createMany({ data: daypartRecords });
  }
  console.log(
    `Seeded ${daypartRecords.length} BD (Becton, Dickinson) sales occasion records ` +
    `(${ALL_QUARTERS.filter((q) => periodMap[q]).length} quarters x 4 occasion types x 2 segments)`,
  );
}
