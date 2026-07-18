import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 23: Cost Driver Decomposition — Becton, Dickinson and Company (NYSE: BDX)
//
// BD COST STRUCTURE (% of total revenue approximately):
//   Cost of Products Sold:          ~50-52%  — manufacturing COGS; Excellence Unleashed
//     driving structural improvement; GLP-1 syringe volume improving mix toward BPS
//   Selling and Administrative:     ~24-25%  — SAE; Excellence Unleashed -$200M program
//     ($150M achieved through Q2 FY26); field sales efficiency, digital tools
//   Research and Development:       ~5.5-6%  — sustained investment; Alaris next-gen,
//     GLP-1 device platforms, PureWick next-gen, molecular diagnostics
//   Amortization of Intangibles:    ~4.5-5%  — Bard acquisition ($24B, 2017) intangibles
//     on 12-18 year schedules; declining non-cash GAAP charge
//   Interest Expense:               ~5.5-6%  — ~$270-290M/quarter on ~$16B LTD;
//     net leverage 2.9x → 2.5x target; Bard acquisition debt; avg ~4.8% interest rate
//   China VoBP & Pricing Headwinds: ~1-3%    — China VoBP Rounds 7-9 escalating;
//     Q2 FY26 China FXN -9.8%; pricing pressure ~$95-150M/quarter impact
//   Other Operating Costs:          ~1.8-2.2% — D&A on PP&E, consent decree costs,
//     restructuring, Waters spin-off transaction costs, misc
//
// COVERAGE: 13 quarters × 7 cost lines × 1 segment (Consolidated) = 91 records
// Q1 FY24 → Q1 FY27 (actual through Q2 FY26; forecast Q3-Q4 FY26; projected Q1 FY27)
//
// NARRATIVE ARC:
//   FY2024: Base year; Bard integration synergies delivering; Excellence Unleashed announced;
//     China VoBP emerging; raw material costs at elevated post-COVID levels
//   FY2025: Excellence Unleashed Phase 1; $120M savings achieved FY25; China VoBP rounds
//     intensifying; Alaris consent decree compliance costs; Waters spin-off preparation
//   FY2026: Waters spin-off completed Feb 9 2026; $150M Excellence Unleashed achieved;
//     BioPharma Systems GLP-1 tailwind driving favorable COGS mix; China VoBP -9.8% FXN Q2
//   FY2027: Full $200M Excellence Unleashed target; GLP-1 syringe contract through FY29;
//     manufacturing automation ROI compounding; leverage 2.5x target approached
// =============================================================================

interface QuarterMeta {
  label: string;
  revenue: number; // $M total revenue
}

const QUARTERS: QuarterMeta[] = [
  // FY24 — full year ~$18,870M
  { label: 'Q1 FY24', revenue: 4580 },
  { label: 'Q2 FY24', revenue: 4650 },
  { label: 'Q3 FY24', revenue: 4720 },
  { label: 'Q4 FY24', revenue: 4920 },

  // FY25 — full year ~$18,895M
  { label: 'Q1 FY25', revenue: 4655 },
  { label: 'Q2 FY25', revenue: 4680 },
  { label: 'Q3 FY25', revenue: 4740 },
  { label: 'Q4 FY25', revenue: 4820 },

  // FY26 — Q2 FY26 actual $4,714M; guidance ~$18,900–$19,100M full year
  { label: 'Q1 FY26', revenue: 4630 },
  { label: 'Q2 FY26', revenue: 4714 },
  { label: 'Q3 FY26', revenue: 4850 },
  { label: 'Q4 FY26', revenue: 4920 },

  // FY27 — projection (~$19,400M at ~2.5% YoY; GLP-1 volume + Excellence Unleashed)
  { label: 'Q1 FY27', revenue: 4780 },
];

interface SubcategoryDef {
  costCategory: string;
  costSubcategory: string;
  pctOfRevenue: number[];        // 13 values, one per quarter
  budgetPctOfRevenue: number[];  // original plan/budget
  drivers: string[];             // 13 narrative drivers
}

function r1(n: number): number { return Math.round(n * 10) / 10; }
function r2(n: number): number { return Math.round(n * 100) / 100; }

const SUBCATEGORIES: SubcategoryDef[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // COST OF PRODUCTS SOLD — manufacturing COGS ~50-52% of revenue
  // Excellence Unleashed $200M cost-out program driving structural improvement
  // BioPharma Systems GLP-1 volume favorable mix (lowest COGS segment ~38%)
  // Waters spin-off Feb 2026 removing lower-margin business (positive COGS mix)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    costCategory: 'Cost of Products Sold',
    costSubcategory: 'Cost of Products Sold',
    pctOfRevenue:       [52.2, 52.0, 51.8, 51.5, 51.8, 51.6, 51.4, 51.2, 51.5, 50.8, 50.5, 50.2, 50.0],
    budgetPctOfRevenue: [52.0, 51.8, 51.5, 51.2, 51.5, 51.2, 51.0, 50.8, 51.2, 50.5, 50.2, 49.8, 49.5],
    drivers: [
      'Q1 FY24: BD COGS 52.2% — manufacturing efficiency stable; Bard integration synergies delivering modest benefit; raw material costs at 2023 elevated levels; Excellence Unleashed program not yet launched',
      'Q2 FY24: COGS 52.0% — slight improvement on better manufacturing utilization; plastic resin costs moderating from peak; BD global manufacturing network optimization continuing post-Bard integration',
      'Q3 FY24: COGS 51.8% — favorable manufacturing volume leverage in Q3 seasonal pickup; China VoBP pricing emerging but modest impact; supply chain normalization benefiting raw material costs',
      'Q4 FY24: COGS 51.5% — fiscal year-end Q4 volume push drives manufacturing leverage; Excellence Unleashed cost-out program announced; $200M target set for FY25-FY27; favorable mix toward BioPharma Systems',
      'Q1 FY25: COGS 51.8% — Q1 seasonal softness reduces manufacturing leverage; Excellence Unleashed Phase 1 initiated; raw material cost reduction of ~$25M from procurement renegotiations; Alaris consent decree compliance costs embedded',
      'Q2 FY25: COGS 51.6% — Excellence Unleashed delivering first manufacturing savings; $45M cumulative cost-out through Q2 FY25; China VoBP pricing pressure ~$80M headwind on revenue (reduces gross margin denominator)',
      'Q3 FY25: COGS 51.4% — cost-out on track; China VoBP headwind ~$90M; manufacturing automation investments in Pharmaceutical Systems lines for GLP-1 capacity; segment mix shift toward higher-margin BioPharma Systems benefiting COGS%',
      'Q4 FY25: COGS 51.2% — Q4 volume leverage favorable; $120M Excellence Unleashed savings achieved YTD FY25; Pharmaceutical Systems capacity expansion adding fixed cost but improved margins as GLP-1 volumes ramp; Waters spin-off preparation activities',
      'Q1 FY26: COGS 51.5% — Q1 seasonality; Waters spin-off completed Feb 9 2026 (stranded cost elimination in progress); $150M Excellence Unleashed savings achieved; GLP-1 syringe volume growth driving BioPharma Systems favorable COGS mix',
      'Q2 FY26: COGS 50.8% — strong margin improvement; Excellence Unleashed manufacturing savings accelerating; BioPharma Systems GLP-1 tailwind with above-plan volume; China VoBP headwind -9.8% FXN (~$95M) creates revenue headwind but not COGS',
      'Q3 FY26: COGS 50.5% (est.) — Pharmaceutical Systems capacity expansion fully operational; GLP-1 contract volume above plan; manufacturing cost savings on track for $200M full target by FY27; stranded cost from Waters eliminated',
      'Q4 FY26: COGS 50.2% (est.) — Q4 volume leverage + full Excellence Unleashed manufacturing savings; $180M cumulative savings achieved; BioPharma Systems GLP-1 and biologics volume driving favorable mix',
      'Q1 FY27: COGS 50.0% (proj.) — full $200M Excellence Unleashed target achieved; structural COGS improvement; GLP-1 syringe contract secured through FY29; manufacturing automation ROI compounding',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SELLING AND ADMINISTRATIVE EXPENSE — SAE ~24-25% of revenue
  // Excellence Unleashed targeting SAE structural reduction
  // Waters spin-off stranded costs being eliminated; digital tools reducing admin
  // Field sales force efficiency programs; corporate overhead reduction
  // ═══════════════════════════════════════════════════════════════════════════
  {
    costCategory: 'Selling and Administrative Expense',
    costSubcategory: 'Selling and Administrative Expense',
    pctOfRevenue:       [25.2, 25.0, 24.8, 24.5, 24.8, 24.5, 24.2, 24.0, 24.5, 24.2, 24.0, 23.8, 23.5],
    budgetPctOfRevenue: [25.0, 24.8, 24.5, 24.2, 24.5, 24.2, 24.0, 23.8, 24.2, 23.8, 23.5, 23.2, 23.0],
    drivers: [
      'Q1 FY24: SAE 25.2% — BD field sales force at full deployment; integration costs from post-Bard restructuring winding down; corporate overhead stable; digital order management tools beginning deployment',
      'Q2 FY24: SAE 25.0% — modest improvement on field sales efficiency gains; corporate procurement centralization delivering savings; marketing spend below plan in Q2 even quarter',
      'Q3 FY24: SAE 24.8% — Q3 seasonal lower marketing spend; Excellence Unleashed scoping underway; digital tools reducing field rep administrative burden; procurement savings on indirect spend accumulating',
      'Q4 FY24: SAE 24.5% — fiscal year-end volume leverage favorable; Excellence Unleashed SAE reduction component formalized; $200M program includes ~$70M SAE target; severance charges from initial headcount reduction',
      'Q1 FY25: SAE 24.8% — Q1 seasonal deleveraging on lower revenue; Excellence Unleashed Phase 1 SAE actions initiated; corporate headcount reduction commenced; Alaris field specialist costs elevated on consent decree remediation activities',
      'Q2 FY25: SAE 24.5% — Excellence Unleashed SAE savings tracking; corporate G&A reduction ~$30M YTD FY25; digital sales tools reducing rep travel and admin time; Waters spin-off preparation legal/advisory fees partially offsetting',
      'Q3 FY25: SAE 24.2% — SAE improvement visible; Excellence Unleashed delivering corporate overhead savings; field sales reorganization driving efficiency; Waters spin-off transaction costs ~$25M charged to SAE in Q3',
      'Q4 FY25: SAE 24.0% — full year FY25 SAE savings tracking well; $80M cumulative SAE reductions; Waters spin-off stranded cost planning underway; FY26 SAE guidance showing structural improvement path',
      'Q1 FY26: SAE 24.5% — Q1 seasonal step-up; Waters spin-off completed Feb 9 2026 — stranded cost identification and elimination program initiated; Excellence Unleashed SAE savings partially offset by Waters stranded costs (~$20M Q1)',
      'Q2 FY26: SAE 24.2% — stranded cost elimination progressing; Excellence Unleashed SAE savings on track; digital order platform reducing distributor service costs; field sales productivity improving on CRM investment',
      'Q3 FY26: SAE 24.0% (est.) — stranded cost fully eliminated; Excellence Unleashed SAE savings at $110M cumulative; corporate headcount -6% YoY; digital tools reducing rep non-selling time from 35% to 28%',
      'Q4 FY26: SAE 23.8% (est.) — Q4 volume leverage + sustained Excellence Unleashed SAE savings; marketing investment in PureWick DTC partially offsetting; $130M cumulative SAE savings; FY27 SAE guidance below 23.5%',
      'Q1 FY27: SAE 23.5% (proj.) — structural SAE improvement fully embedded; Excellence Unleashed total $200M target inclusive of SAE achieved; BD operating model transformation complete; ongoing digital investment self-funding through efficiency',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RESEARCH AND DEVELOPMENT — R&D ~5.5-6% of revenue
  // Sustained investment across segments; Alaris next-gen, GLP-1 platforms
  // Smart pump software; PureWick next-gen; molecular diagnostics expansion
  // BD innovation pipeline supporting Excellence Unleashed "Innovate" pillar
  // ═══════════════════════════════════════════════════════════════════════════
  {
    costCategory: 'Research and Development',
    costSubcategory: 'Research and Development',
    pctOfRevenue:       [5.8, 5.7, 5.6, 5.5, 5.7, 5.6, 5.5, 5.4, 5.6, 5.5, 5.4, 5.3, 5.2],
    budgetPctOfRevenue: [5.7, 5.6, 5.5, 5.4, 5.6, 5.5, 5.4, 5.3, 5.5, 5.4, 5.3, 5.2, 5.1],
    drivers: [
      'Q1 FY24: R&D 5.8% — BD Alaris next-gen development ongoing; Pharmaceutical Systems GLP-1 device platform investment; BD MAX molecular diagnostics expansion; PureWick clinical studies; BD Rowa next-generation pharmacy robotics',
      'Q2 FY24: R&D 5.7% — Alaris consent decree remediation R&D investments; GLP-1 syringe manufacturing process R&D for higher volumes; BD Pyxis connected medication management platform development',
      'Q3 FY24: R&D 5.6% — Q3 slightly lower as some projects complete phase gates; Interventional new vascular access catheter clinical trials; BD HemoSphere next-generation hemodynamic monitoring development',
      'Q4 FY24: R&D 5.5% — year-end project completion; Excellence Unleashed R&D productivity initiative — rebalancing portfolio to highest-return programs; GLP-1 device platform investments accelerating on pharma customer demand signals',
      'Q1 FY25: R&D 5.7% — Q1 seasonal step-up as new-year projects initiate; Alaris next-gen platform development ramping (post-consent decree path); BD Pharmaceutical Systems biologics delivery device R&D for subcutaneous GLP-1/obesity treatments',
      'Q2 FY25: R&D 5.6% — PureWick next-gen (improved comfort, expanded indication) clinical development; BD diagnostics molecular platform expansion for point-of-care; Interventional peripheral vascular intervention device pipeline',
      'Q3 FY25: R&D 5.5% — Waters spin-off separating some R&D activities; BD core segment R&D focus intensifying; smart pump software platform (Alaris IQ) development; BD flow cytometry next-gen instrument',
      'Q4 FY25: R&D 5.4% — Waters R&D activities transitioning to separate entity; BD R&D portfolio refocused on four continuing segment priorities; GLP-1 dual-chamber syringe for combination products development',
      'Q1 FY26: R&D 5.6% — post-Waters BD R&D fully focused on continuing segments; Alaris next-gen platform (Alaris 2.0) human factors and software testing; BD Pharmaceutical Systems co-development with GLP-1 manufacturers for GLP-2 and obesity pipeline',
      'Q2 FY26: R&D 5.5% — Alaris 2.0 development milestones progressing toward FDA submission; Pharmaceutical Systems capacity expansion R&D for biologics large-volume subcutaneous devices; BD MAX molecular diagnostics panel expansion',
      'Q3 FY26: R&D 5.4% (est.) — R&D productivity improving; Excellence Unleashed portfolio prioritization reducing low-return projects; BD Interventional robotic-assisted vascular intervention early-stage development; PureWick next-gen regulatory submission preparation',
      'Q4 FY26: R&D 5.3% (est.) — R&D efficiency improving on Excellence Unleashed Innovate pillar; Alaris 2.0 pre-submission activities; BD Pharmaceutical Systems long-acting injectable platform for GLP-2 and other biologics',
      'Q1 FY27: R&D 5.2% (proj.) — structural R&D efficiency improvement; BD innovation pipeline strengthened but capital-efficient; GLP-1/GLP-2 device platform R&D generating increased pharma customer co-investment',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AMORTIZATION OF INTANGIBLES — ~4.5-5% of revenue
  // Bard acquisition ($24B, 2017) — customer relationships, technology, trade names
  // On 12-18 year amortization schedules; declining non-cash GAAP charge
  // Key add-back for adjusted EPS (~$0.50-0.60/share/quarter)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    costCategory: 'Amortization of Intangibles',
    costSubcategory: 'Amortization of Intangibles',
    pctOfRevenue:       [5.2, 5.1, 4.9, 4.8, 5.0, 4.8, 4.7, 4.6, 4.8, 4.6, 4.5, 4.4, 4.2],
    budgetPctOfRevenue: [5.1, 5.0, 4.8, 4.7, 4.9, 4.7, 4.6, 4.5, 4.7, 4.5, 4.4, 4.3, 4.1],
    drivers: [
      'Q1 FY24: Amortization ~$238M — Bard acquisition intangibles (customer relationships, developed technology, trade names); 12-18 year schedules; C.R. Bard customer contracts largest component; declining non-cash charge',
      'Q2 FY24: Amortization ~$237M — Bard intangibles continuing on schedule; no new significant acquisition activity; BD Interventional technology intangibles from Bard surgical segment; investor note: ~$0.57/share add-back on adj. EPS basis',
      'Q3 FY24: Amortization ~$231M — Q3 revenue base slightly reduces %; absolute amortization stable; Bard trade name intangibles partially written down in prior year restructuring; schedule declining gradually',
      'Q4 FY24: Amortization ~$236M — year-end finalization; Bard customer relationship intangibles largest declining tranche; FY25 amortization schedule slightly below FY24 as older tranches expire',
      'Q1 FY25: Amortization ~$233M — Bard intangibles continuing decline; 2017 acquisition year 8 of amortization; developed technology and IP components; analyst community focuses on adjusted EPS ex-amortization',
      'Q2 FY25: Amortization ~$225M — quarterly step-down on Bard schedule; Waters spin-off preparation — Waters intangibles will transfer to SpinCo; remaining BD intangibles portfolio becoming cleaner post-spin',
      'Q3 FY25: Amortization ~$223M — BD Interventional surgical intangibles from Bard; Bard vascular intangibles; declining non-cash charge; FY26 guidance shows continuing structural amortization tailwind',
      'Q4 FY25: Amortization ~$222M — full year FY25 amortization below FY24; Waters intangibles separating; BD continuing operations amortization trajectory toward $200M/quarter by FY28',
      'Q1 FY26: Amortization ~$222M — post-Waters spin; BD continuing operations amortization lower (Waters intangibles removed); Bard acquisition intangibles most significant remaining component; FY26 full-year amortization guidance ~$870M',
      'Q2 FY26: Amortization ~$217M — continuing decline on Bard schedule; investor transparency: non-cash amortization add-back ~$0.55/share on adjusted EPS; structural tailwind grows as older Bard tranches expire FY28-FY30',
      'Q3 FY26: Amortization ~$218M (est.) — stable quarterly; Bard trade name and customer relationship intangibles on multi-year decline trajectory; BD R&D capitalized intangibles modest addition',
      'Q4 FY26: Amortization ~$213M (est.) — continued structural decline; FY27 amortization guidance ~$820M — meaningful tailwind vs FY26; Bard large tranches approaching expiration in FY28-FY30 creates material non-cash tailwind',
      'Q1 FY27: Amortization ~$200M (proj.) — structural improvement well underway; Bard intangibles in final high-value years before major tranches expire; adj. EPS tailwind growing as GAAP amortization declines',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTEREST EXPENSE — ~5.5-6% of revenue; ~$270-290M/quarter on ~$16B LTD
  // Bard acquisition debt ($12B initially); avg ~4.8% interest rate
  // Net leverage 2.9x → 2.5x target; deleveraging through FCF ~$1.8-2.0B/year
  // NOTE: 6.0% of ~$4,600M = ~$276M/quarter — reasonable for BD debt load
  // ═══════════════════════════════════════════════════════════════════════════
  {
    costCategory: 'Interest Expense',
    costSubcategory: 'Interest Expense',
    pctOfRevenue:       [6.0, 5.9, 5.8, 5.7, 5.8, 5.7, 5.6, 5.5, 5.7, 5.6, 5.5, 5.4, 5.2],
    budgetPctOfRevenue: [5.9, 5.8, 5.7, 5.6, 5.7, 5.6, 5.5, 5.4, 5.6, 5.5, 5.4, 5.3, 5.1],
    drivers: [
      'Q1 FY24: Interest expense ~$275M on ~$16.2B LTD at avg 4.8% cost; Bard acquisition debt ($12B originated 2017) at fixed rates ~4.5-5.2%; no significant near-term maturities; leverage 3.0x; deleveraging priority',
      'Q2 FY24: Interest expense ~$274M — stable fixed-rate portfolio; floating rate portion minimal; $0.8B maturity refinanced at market rate ~5.0%; slight run-rate step-up; BD credit rating Baa2/BBB; investment-grade maintained',
      'Q3 FY24: Interest expense ~$274M — absolute cost stable; Q3 revenue seasonality modestly reduces %; $15.8B LTD; FCF generation supporting deleveraging plan; leverage 2.95x; near 2.9x target',
      'Q4 FY24: Interest expense ~$280M — year-end revenue seasonality; $1.0B debt repayment during Q4 reducing run-rate entering FY25; leverage 2.9x; BD management reiterates 2.5x target; $200M Excellence Unleashed savings to fund deleveraging',
      'Q1 FY25: Interest expense ~$270M — $1.0B Q4 FY24 debt repayment reducing Q1 FY25 interest run-rate; leverage 2.9x; avg cost ~4.78%; no near-term large maturities; FCF allocation prioritizing leverage reduction toward 2.5x target',
      'Q2 FY25: Interest expense ~$267M — deleveraging progress; $0.8B maturity repaid Q2; leverage declining toward 2.85x; interest cost reduction vs. plan on favorable repayment timing; BD BBB credit rating stable',
      'Q3 FY25: Interest expense ~$265M — debt repayment progress; FCF of ~$500M/quarter supporting ~$2B annual deleveraging capacity; Waters spin-off proceeds to be applied to debt reduction at close',
      'Q4 FY25: Interest expense ~$265M — $1.5B total FY25 debt repayment; leverage ~2.85x; avg borrowing cost ~4.75% on blended portfolio; Waters spin-off completed Feb 9 2026 with net proceeds for deleveraging',
      'Q1 FY26: Interest expense ~$264M — Waters spin-off debt allocation finalized; BD continuing operations debt ~$15.5B; leverage ~2.9x (Waters took portion of SpinCo debt); avg cost ~4.72%; FY26 interest trajectory declining',
      'Q2 FY26: Interest expense ~$264M — cumulative debt repayment reducing absolute interest; leverage 2.9x; BD management target 2.5x by FY28; $1.5B annual deleveraging from FCF; BBB credit; Waters SpinCo debt off BD balance sheet',
      'Q3 FY26: Interest expense ~$266M (est.) — stable run-rate; larger debt repayment planned H2 FY26 from strong Q3-Q4 FCF generation; avg cost ~4.70%; leverage trajectory toward 2.7x by FY26 year-end',
      'Q4 FY26: Interest expense ~$265M (est.) — Q4 FCF strong; $2.0B total FY26 debt repayment; leverage ~2.7x exit FY26; interest structural decline into FY27; 2.5x target within reach FY27-FY28',
      'Q1 FY27: Interest expense ~$249M (proj.) — leverage ~2.65x; cumulative debt repayment reducing absolute interest; avg cost ~4.65% as higher-rate Bard-era debt matures; $200M excellence savings fund additional deleveraging',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHINA VoBP & PRICING HEADWINDS — escalating rounds of procurement reform
  // Expressed as % of total revenue representing the cumulative pricing headwind
  // China VoBP Rounds 7-9 impacting BD diagnostics, specimen collection, infusion
  // Q2 FY26: -9.8% FXN in China; ~$95M headwind on $4,714M total BD revenue
  // Mitigation: non-VoBP innovation, APAC ex-China growth, mix toward BioPharma
  // ═══════════════════════════════════════════════════════════════════════════
  {
    costCategory: 'China VoBP & Pricing Headwinds',
    costSubcategory: 'China VoBP & Pricing Headwinds',
    pctOfRevenue:       [0.5, 0.8, 1.2, 1.5, 1.8, 2.0, 2.2, 2.5, 2.8, 3.1, 3.2, 3.0, 2.8],
    budgetPctOfRevenue: [0.5, 0.8, 1.0, 1.2, 1.5, 1.8, 2.0, 2.2, 2.5, 2.8, 2.9, 2.7, 2.5],
    drivers: [
      'Q1 FY24: China VoBP Round 7 initiating; early-stage pricing pressure on BD diagnostic and specimen collection products; China represents ~6% of BD revenue; VoBP pricing reductions ~10-15% on covered products; manageable at this stage',
      'Q2 FY24: China VoBP Round 7 fully implemented; BD blood collection (Vacutainer) and infusion products in scope; China volume maintained but pricing reduced; BD beginning to shift China product mix toward non-VoBP premium and innovation products',
      'Q3 FY24: VoBP Round 7 full-quarter impact; BD China revenue under pressure; some volume recovery at lower ASP partially offsetting; BD investing in non-VoBP product categories in China (BD MAX molecular diagnostics, premium vascular)',
      'Q4 FY24: China VoBP Round 8 announced; expanded product scope including additional BD Infusion product lines; BD China revenue -8% FXN in Q4; BD management formally calling out China VoBP as key headwind; mitigation plan disclosed',
      'Q1 FY25: China VoBP Round 8 implementations; broader product scope creating additional headwind; BD China -8.5% FXN; BD increasing focus on innovation products not subject to VoBP; India and ASEAN growing to partially offset China pressure',
      'Q2 FY25: VoBP Round 8 fully in force; BD China ~6% of revenue declining; additional ~$80M revenue headwind vs prior year; BD Pharmaceutical Systems (pharma customers primarily non-China) not affected; BioPharma Systems GLP-1 growth offsetting at enterprise level',
      'Q3 FY25: China VoBP headwind intensifying; Round 9 announced covering additional BD categories; BD China FXN -9.0%; BD management communicating 2026 mitigation: innovation-led product refresh, non-VoBP premium, capacity to shift elsewhere; India growing +18%',
      'Q4 FY25: VoBP Round 8 and early Round 9 creating combined ~$95M quarterly headwind on BD total revenue; BD China -9.5% FXN; BD Interventional vascular products in scope of Round 9; non-China APAC growing but insufficient to fully offset China pressure',
      'Q1 FY26: China VoBP Round 9 fully active; BD China -9.2% FXN Q1 FY26; BD APAC total -2.8% because non-China growth partially offsets; BD disclosing China VoBP as $350-400M annual revenue headwind; Waters spin-off removes some China exposure',
      'Q2 FY26: China VoBP peak pressure quarter — BD China -9.8% FXN; total APAC -0.8% reported; BD management states Q2 FY26 China headwind ~$95M; mitigation strategy: innovation bypass (non-VoBP products growing +5% in China), ASEAN +12% FXN, India +18% FXN',
      'Q3 FY26: China VoBP headwind stabilizing — Round 9 fully absorbed; BD innovation product pipeline in China gaining traction; non-VoBP BD products growing; Q3 FY26 China estimated -7% FXN (improvement from -9.8% Q2); APAC ex-China providing meaningful offset',
      'Q4 FY26: China VoBP beginning to stabilize; no new rounds announced; BD China -6% FXN (improving trend); BD China innovation product refresh launching; APAC total returning to modest positive growth; headwind declining as mix improves',
      'Q1 FY27: China VoBP stabilized; BD management guiding for China to return to flat/modest positive FXN in FY27 as VoBP rounds cycle through; BD non-VoBP China innovation revenue growing; APAC composite positive; enterprise headwind declining to ~1.5% of revenue',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OTHER OPERATING COSTS — D&A on PP&E, Alaris consent decree, restructuring
  // Waters spin-off transaction costs; insurance; misc operating costs
  // ~1.8-2.2% of revenue; elevated in FY25-FY26 on Waters-related costs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    costCategory: 'Other Operating Costs',
    costSubcategory: 'Other Operating Costs',
    pctOfRevenue:       [2.2, 2.0, 1.9, 2.2, 2.1, 2.0, 1.9, 2.2, 2.0, 1.9, 1.8, 2.0, 1.8],
    budgetPctOfRevenue: [2.1, 1.9, 1.8, 2.0, 2.0, 1.8, 1.8, 2.0, 1.9, 1.8, 1.7, 1.9, 1.7],
    drivers: [
      'Q1 FY24: D&A on PP&E (~$200M/quarter on global manufacturing facilities); Alaris FDA consent decree remediation activities (Becton facility investments); quality system upgrades; insurance and miscellaneous operating costs',
      'Q2 FY24: Other operating costs stable; manufacturing capital program depreciation growing on new Pharmaceutical Systems capacity (GLP-1 preparation); Alaris consent decree remediation progressing (55% complete); quality management investments',
      'Q3 FY24: Q3 seasonally lower other costs; manufacturing depreciation stable; lower event costs and travel in summer; Alaris consent decree timeline update (65% remediated); no significant restructuring charges',
      'Q4 FY24: Year-end depreciation true-up; Excellence Unleashed restructuring Phase 1 charges (~$45M); manufacturing facility investments generating additional D&A; Waters spin-off pre-planning activities beginning',
      'Q1 FY25: Excellence Unleashed restructuring charges (~$30M Q1); Alaris consent decree compliance costs embedded ($15M/quarter); Waters spin-off transaction advisory and legal costs beginning ($20M Q1); PP&E depreciation stable',
      'Q2 FY25: Waters spin-off transaction costs escalating (~$35M Q2 advisory/legal fees); Alaris consent decree 70% remediated; Excellence Unleashed restructuring Phase 2 ($25M Q2); manufacturing automation capital generating incremental D&A',
      'Q3 FY25: Waters spin-off preparation costs ~$30M Q3; Alaris consent decree 74% remediated; Excellence Unleashed restructuring nearly complete; PP&E D&A stable on global manufacturing network; insurance costs modestly above plan',
      'Q4 FY25: Waters spin-off final preparation — transaction costs ~$40M Q4; year-end restructuring ($30M); PP&E D&A on new Pharmaceutical Systems GLP-1 capacity additions; Alaris consent decree 76% remediated; FY26 costs expected to normalize post-spin',
      'Q1 FY26: Waters spin-off completed Feb 9 2026 — transaction close costs ($25M Q1); stranded cost identification; Alaris consent decree 78% remediated (improving); PP&E D&A normalizing post-Waters asset transfer; miscellaneous costs favorable vs plan',
      'Q2 FY26: Post-Waters other costs declining; consent decree compliance costs (~$12M/quarter, declining as 78% remediated); PP&E D&A stable; no significant restructuring activity; Waters stranded cost elimination delivering savings; clean operating cost base emerging',
      'Q3 FY26: Other costs structurally lower — Waters separation complete; consent decree remediation nearing completion (est. 82%); Excellence Unleashed restructuring complete; PP&E D&A on optimized manufacturing footprint; clean operational quarter',
      'Q4 FY26: Year-end true-up; minor items; Alaris consent decree approaching full remediation (est. 85%+); BD manufacturing footprint optimized post-Waters; FY27 other operating cost guidance ~$370M/quarter (structural reduction)',
      'Q1 FY27: Other costs structurally lower — no Waters transaction costs; Alaris consent decree substantially complete; Excellence Unleashed fully embedded; manufacturing D&A on optimized network; BD operating cost structure at Excellence Unleashed target',
    ],
  },
];

// =============================================================================
// Main seed function
// =============================================================================

export async function seedCostDrivers(
  prisma: PrismaClient,
  companyId: number,
  allPeriods: Record<string, { id: number }>,
) {
  console.log('  Seeding BD (Becton, Dickinson) cost drivers (13 quarters x 7 cost lines)...');

  const records: Array<{
    companyId: number;
    periodId: number;
    segment: string;
    costCategory: string;
    costSubcategory: string;
    amount: number;
    percentOfRevenue: number;
    budget: number;
    varianceToBudget: number;
    yoyChange: number;
    driver: string;
  }> = [];

  for (let qi = 0; qi < QUARTERS.length; qi++) {
    const q = QUARTERS[qi];
    const periodId = allPeriods[q.label]?.id;
    if (!periodId) {
      console.log(`  Skipping ${q.label} — not in periodMap`);
      continue;
    }

    // Revenue from prior year quarter (4 back)
    const priorYearRevenue = qi >= 4 ? QUARTERS[qi - 4].revenue : q.revenue * 0.96;

    for (const sub of SUBCATEGORIES) {
      const pct = sub.pctOfRevenue[qi];
      const budgetPct = sub.budgetPctOfRevenue[qi];
      const costAmount = r1(q.revenue * pct / 100);
      const planAmount = r1(q.revenue * budgetPct / 100);
      const variance = r1(costAmount - planAmount);
      const variancePct = r2(planAmount !== 0 ? (variance / planAmount) * 100 : 0);

      const priorPct = sub.pctOfRevenue[qi >= 4 ? qi - 4 : qi];
      const priorYearAmount = r1(priorYearRevenue * priorPct / 100);
      const yoyChange = r1(costAmount - priorYearAmount);
      const yoyChangePct = r2(priorYearAmount !== 0 ? (yoyChange / priorYearAmount) * 100 : 0);

      // Trend determination
      let trend: string;
      if (yoyChange > 0 && pct > budgetPct) {
        trend = 'unfavorable';
      } else if (yoyChange < 0 || pct < budgetPct) {
        trend = 'favorable';
      } else {
        trend = 'stable';
      }
      void trend; // used for future display logic

      // For forecast quarters (Q3-Q4 FY26, Q1 FY27), actual = plan (no actuals yet)
      const isForecast = qi >= 10; // Q3 FY26 onward
      const actualCostAmount = isForecast ? planAmount : costAmount;
      const actualVariance = isForecast ? 0 : variance;
      const actualVariancePct = isForecast ? 0 : variancePct;
      void actualVariancePct;
      const actualYoyChange = isForecast ? r1(planAmount - priorYearAmount) : yoyChange;
      const actualYoyChangePct = isForecast
        ? r2(priorYearAmount !== 0 ? (actualYoyChange / priorYearAmount) * 100 : 0)
        : yoyChangePct;

      records.push({
        companyId,
        periodId,
        segment: 'Consolidated',
        costCategory: sub.costCategory,
        costSubcategory: sub.costSubcategory,
        amount: actualCostAmount,
        percentOfRevenue: isForecast ? budgetPct : pct,
        budget: planAmount,
        varianceToBudget: actualVariance,
        yoyChange: actualYoyChangePct,
        driver: sub.drivers[qi] ?? '',
      });
    }
  }

  if (records.length > 0) {
    // Insert in batches of 20 to avoid hitting Prisma limits
    const batchSize = 20;
    for (let i = 0; i < records.length; i += batchSize) {
      await prisma.costDriverDetail.createMany({
        data: records.slice(i, i + batchSize),
      });
    }
  }

  console.log(
    `  Seeded ${records.length} BD (Becton, Dickinson) cost driver records ` +
    `(${QUARTERS.length} quarters x ${SUBCATEGORIES.length} cost lines)`,
  );
}
