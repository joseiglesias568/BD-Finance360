# Finance360 — New Client Setup Instructions

**Version:** 3.0 (Added: driver analytics FOUR-file requirement; CFOTiles operationalKPIs non-existence; DriverAnalyticsTab default state leak; HomeClient Strategic Execution sectionSubtitle; Executive Summary Revenue tile label audit)  
**Last updated:** 2026-05-18  
**Authors:** Eric Merrill + Claude Code

> This document supersedes the original 8-step Finance360 prompt process and the retrospective-only version (05 - Revised Rebadging Guide). It is the single, complete, copy-paste-ready reference for onboarding any new client to Finance360 — whether the client is in the same industry as the current template or a completely new one.

---

## How to Use This Document

1. Read **Two Paths** and **Pre-Flight Checklist** before starting anything.
2. Copy and paste each step's code block into your AI agent (Claude Code or Cursor Agent) in order.
3. Replace all `[BRACKETED ITEMS]` with actual client details before pasting.
4. Complete each step in order — each builds on the prior step.
5. After every session, check off items in the **Gotcha Checklist** at the end.

---

## Two Paths

### Path A — Same industry, new client
*Example: Move from Delta Air Lines to United Airlines*

The data schema, metric names, business console structure, and industry-specific terminology are already compatible. Focus effort on: company identity, seed data values, competitor set, and brand colors. Steps 1–4 are lighter; Step 5 (seed data) is the main work.

**Estimated agent sessions:** 2–3  
**Highest-risk step:** Seed data accuracy (public filings must be read carefully for the new carrier)

### Path B — New client, new industry *(primary path)*
*Example: Move from Delta Air Lines (airlines) to a pharmaceutical company*

The metric schema, console names, KPI definitions, driver trees, and nearly all seed data content must be reconceived for the new industry. Data structure changes may be needed in Prisma. Metric filtering strings in chart components must be audited and replaced.

**Estimated agent sessions:** 4–6  
**Highest-risk steps:** Step 4 (config/semantic layer redesign), Step 5 (seed data from scratch), Step 7B (component audit)

---

## Pre-Flight Checklist — Have These Ready Before Step 1

| Item | Path A (Same industry) | Path B (New industry) |
|---|---|---|
| Client full legal name | ✓ | ✓ |
| Ticker symbol | ✓ | ✓ |
| Client slug (lowercase, no spaces — used in code) | ✓ | ✓ |
| GitHub repo URL (new, empty repo) | ✓ | ✓ |
| Neon DB connection string — pooled URL | ✓ | ✓ |
| Neon DB connection string — direct/unpooled URL | ✓ | ✓ |
| App password | ✓ | ✓ |
| Anthropic API key | ✓ | ✓ |
| Primary brand color hex | ✓ | ✓ |
| Secondary/accent brand color hex | ✓ | ✓ |
| CEO name | ✓ | ✓ |
| CFO name | ✓ | ✓ |
| Fiscal year end | ✓ | ✓ |
| Investor relations PDFs (10-K, 10-Q, earnings transcripts) | ✓ | ✓ |
| AlphaSense access (for Steps 3A/3B research enrichment — place exported PDFs in CLIENT - Investor Relations/ before running Step 3A) | recommended | recommended |
| List of 4–6 peer competitors with tickers | ✓ | ✓ |
| Vercel account access | ✓ | ✓ |
| Industry-specific KPI names (e.g., CASM-Ex, EBITDAR, ARPU) | ✓ — same | **Required — research first** |
| Segment/division structure (how they report revenue) | ✓ | **Required — research first** |
| Decision: which business consoles map to which segments? | ✓ | **Required — pre-plan** |

---

## STEP 1 — Copy and Initialize the Template

```
I need to create a new Finance360 client instance. Please:

1. Create a copy of the current project folder. Name the new folder:
   "[CLIENT NAME] - AI Powered Management Reporting"

   Exclude these directories:
   - node_modules/
   - .next/
   - .git/
   - .claude/slide-images/

2. Initialize a fresh git repo in the new folder (git init)

3. Add the GitHub remote:
   git remote add origin [GITHUB REPO URL]

4. Remove the .env file (we configure credentials next)

5. Empty "CLIENT - Investor Relations/" and "CLIENT - Reference Materials/"
   (keep folders and README.md files, but remove any client-specific documents)

6. Create "CLIENT - Research & Analysis/" folder

7. Create the file vercel.json in the project root with this content —
   do NOT skip this, it prevents a known build cache issue on Vercel:

   {
     "buildCommand": "npm run build",
     "installCommand": "npm ci",
     "framework": "nextjs",
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Frame-Options", "value": "DENY" },
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
           { "key": "X-DNS-Prefetch-Control", "value": "on" }
         ]
       }
     ]
   }

8. Verify prisma.config.ts uses process.env (not Prisma's env() function) for
   DATABASE_URL_UNPOOLED. The file should look like:

   import "dotenv/config";
   import { defineConfig } from "prisma/config";

   export default defineConfig({
     schema: "prisma/schema.prisma",
     migrations: { path: "prisma/migrations" },
     engine: "classic",
     datasource: {
       url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
     },
   });

   If it uses env("DATABASE_URL_UNPOOLED"), update it now. This prevents
   CI/CD build failures when DATABASE_URL_UNPOOLED is not in the environment.

9. Confirm folder structure is intact and give me a summary.
```

---

## STEP 2 — Configure Connections & Environment

```
Let's configure the environment for [CLIENT NAME]:

- GitHub repo: [PASTE GITHUB URL]
- Neon Database pooled URL: [PASTE NEON POOLED URL]
- Neon Database direct URL: [PASTE NEON DIRECT URL]
- App password: [PASTE APP PASSWORD OR "generate a secure one"]
- Anthropic API key: [PASTE API KEY OR "use the same key"]

Please:
1. Create .env using .env.example as template, populating with credentials above.
   Include BOTH DATABASE_URL (pooled, with pgbouncer=true) and
   DATABASE_URL_UNPOOLED (direct, no pooler). Both are required.

2. Run npm install

3. Test the database connection (npx prisma db push --dry-run or equivalent)

4. Confirm all connections are working

Do NOT push to GitHub yet — we have a lot of work to do first.
```

---

## STEP 3A — Client Research: Internal Documents

> **AlphaSense workflow:** Before running this step, export the relevant documents
> from AlphaSense (10-K, 10-Q, earnings call transcripts, analyst reports, competitive
> intelligence filings) and place them in "CLIENT - Investor Relations/". AlphaSense's
> Smart Summaries and company-specific search are especially useful for extracting
> exact metric names, segment structures, and competitor language as used in official
> filings — which is critical for the metric-string matching in Step 4 and Step 5.
> Store all AlphaSense exports in the client-specific project folder only; never
> mix research materials across clients.

```
Now let's build our understanding of [CLIENT NAME]. I've placed their investor
relations documents in the "CLIENT - Investor Relations/" folder. These include:

- [LIST EACH DOCUMENT, e.g.:]
- [Q3 2025 Earnings Call Transcript]
- [Q4 2025 Press Release]
- [2025 10-K Annual Filing]
- [etc.]

Please analyze ALL of these documents thoroughly. I need you to:

1. Understand the company's business model, revenue segments, and organizational structure
2. Identify key financial metrics, KPIs, and performance drivers they report on
3. Map out their business segments/divisions and how they report results
4. Note the executive leadership team (CEO, CFO, etc.) and their strategic priorities
5. Identify industry-specific terminology and metrics they use
6. Understand their fiscal year structure (calendar year vs. fiscal year) and reporting cadence
7. Note any strategic initiatives, risks, or transformation programs mentioned
8. Understand their geographic footprint and how they break down regional performance
9. Identify their revenue recognition model and key cost structure elements
10. Note any M&A activity, divestitures, or structural changes

Create a comprehensive research document and save it as
"CLIENT - Research & Analysis/01 - Internal Document Analysis.md" in the project root.

Structure it with clear sections for:
- Company Overview
- Business Segments & Revenue Breakdown
- Financial Profile (revenue scale, margins, growth rates)
- Key Metrics & KPIs (what they report to investors)
- Business Drivers (what moves their numbers)
- Executive Leadership
- Strategic Priorities & Initiatives
- Geographic Footprint
- Industry-Specific Considerations
- Risks & Headwinds

Do not make any code changes yet — this is research only.
```

---

## STEP 3B — Client Research: External Enrichment

```
Now enrich our research with external sources. Using web search and publicly available
information about [CLIENT NAME] (ticker: [TICKER SYMBOL]), I need you to:

1. Research their competitive landscape — who are the top 3-5 competitors and how does
   [CLIENT NAME] compare on key metrics?
2. Find their most recent analyst consensus estimates (revenue, EPS, growth projections)
3. Understand industry benchmarks and where [CLIENT NAME] sits relative to peers
4. Identify macro trends affecting their industry (regulatory, economic, technological)
5. Research their technology stack, digital transformation, and operational initiatives
6. Find any recent news, M&A activity, leadership changes, or strategic shifts
7. Understand their brand identity — colors, visual style, positioning
8. Research their organizational structure in more detail if available

Update the existing research document — rename it to
"CLIENT - Research & Analysis/01 - Comprehensive Client Analysis.md"

Add new sections for:
- Competitive Landscape & Peer Comparison
- Industry Benchmarks
- Macro Environment & Trends
- Recent Developments & News
- Analyst Consensus & Market Expectations
- Brand Identity Notes (colors, visual style — we'll use this in Step 6)

ADDITIONAL REQUIREMENTS:

9. Document the EXACT names competitors use in public filings and how they
   are commonly abbreviated. We will use these exact names in code — mismatches
   cause charts to silently show no data. Format as a table:
   | Full name | Ticker | Common abbreviation | How to key in code |

10. List the industry-specific metric names with their exact spelling as used
    in public filings. For example:
    - Airlines: CASM-Ex, TRASM, ASMs, Load Factor, Completion Factor
    - Banking: NIM, CET1, ROTE, NCO rate
    - Pharma: R&D-to-revenue %, pipeline stage count, NAS market share
    These exact spellings will be used as metric name keys in the database.
    Mismatches between seed data and component filters = blank charts.

11. Note the competitor color palette convention if one exists in the industry
    (e.g., airline logos are strongly associated with specific colors — use
    official brand hex values for competitor color maps).

Still no code changes — research only.
```

---

## STEP 4 — Update the Semantic Layer & Configuration

```
Using all the research we've compiled in "CLIENT - Research & Analysis/",
it's time to update the semantic layer and client configuration so the entire platform
reflects [CLIENT NAME]'s business.

Please update the following, in this order:

1. RENAME THE CONFIG FOLDER:
   - Rename config/clients/[PREVIOUS-SLUG]/ to config/clients/[CLIENT-SLUG]/
     (e.g., "bp" for British Petroleum, "msft" for Microsoft)
   - Update the index.ts export name accordingly (e.g., deltaConfig -> [slug]Config)

2. UPDATE BRANDING CONFIG (config/clients/[CLIENT-SLUG]/branding.ts):
   - companyName: [CLIENT NAME full legal name]
   - ticker: [TICKER]
   - platformName: '[CLIENT NAME] Finance360'
   - tagline: keep as 'AI-Powered Management Reporting'
   - CEO, CFO names from our research
   - fiscalYearEnd, industry, headquarters from our research
   - Colors: use placeholder values for now (we'll finalize in Step 6)

3. UPDATE ALL OTHER CONFIG FILES in config/clients/[CLIENT-SLUG]/:
   - financials.ts — update P&L line items, revenue segments, cost categories
     to match [CLIENT NAME]'s actual financial structure
   - kpis.ts — replace with [CLIENT NAME]'s actual KPIs from our research
   - operations.ts — update operational metrics relevant to [CLIENT NAME]'s industry
   - strategic.ts — update strategic initiatives and pillars
   - market.ts — update market/competitive data structure
   - alerts.ts — update alert thresholds and categories
   - reports.ts — update report definitions
   - scenarios.ts & scenario-tabs.ts — update scenario modeling parameters
   - hypotheses.ts — update hypothesis testing parameters
   - monthEnd.ts & month-end-extra.ts — update month-end close procedures
   - insight-charts.ts — update insight visualization configs

4. UPDATE THE SEMANTIC LAYER (lib/semantic/):
   - Update consoles.ts — redefine business consoles to match [CLIENT NAME]'s
     actual business segments (e.g., replace "North America Performance" with
     relevant segment names)
   - Update the semantic engine types and formulas
   - Ensure driver trees and KPI hierarchies align with our research

5. UPDATE ALL IMPORTS:
   - Search the entire codebase for references to the previous client slug in
     imports, config references, and variable names — update them all to [CLIENT-SLUG]
   - Check: config/clients/ references, any hardcoded previous-client strings

6. UPDATE AI SYSTEM PROMPT (lib/ai/system-prompt.ts):
   - Make sure the AI understands it's now serving [CLIENT NAME]
   - Update any previous-client-specific context in the prompt

ADDITIONAL TASKS:

7. PATH B ONLY — INDUSTRY METRIC MAPPING:
   In config/types.ts, review QuarterData, KPIConfig, SegmentData, and
   MarketConfig interfaces. For a new industry, identify which field names
   need to be renamed or extended. Document any schema changes needed
   BEFORE touching seed files. Changes here cascade to:
   - All seed files
   - lib/db/repositories/financials.ts
   - lib/engines/exec-overview-financials.ts
   - Chart components that reference field names like q.feeRevenueGrowth

8. AUDIT COMPONENT-LEVEL METRIC STRINGS:
   Search the codebase for hardcoded metric name strings used as data filter
   keys in chart components. These are NOT caught by a general name search:
   rg "Office Count|Organic Revenue Growth|Fee Revenue|Comp Sales|AUM|
       Active Clients|Average Fee Rate|Property Performance|Deal Cycle|
       Service Line Mix|Office Footprint|Client Accounts" --type tsx --type ts

   Replace each with the equivalent metric for [CLIENT NAME]'s industry.
   Document the mapping in the research folder:
   | Old metric string | New ([CLIENT]) metric string |

9. AUDIT COMPETITOR COLOR MAPS:
   Search for COMPETITOR_COLORS or similar objects in app/ and components/.
   These contain hardcoded competitor names as keys. Replace with the correct
   peer set for [CLIENT NAME]. Include ALL naming variants the database may use
   (e.g., "Alaska Airlines (AS)" and "Alaska Airlines (ALK)" are both needed
   as aliases for the same color).

10. AUDIT REGIONAL SPOTLIGHT HARDCODED ARRAYS:
    Search for arrays like `const apacCompetitors = [...]` or `const usCompetitors`.
    These are hardcoded competitor name strings that filter database records.
    Replace with the correct peer names for [CLIENT NAME]'s regional structure.

After each major section (1-10), give me a progress update. Take your time —
accuracy matters more than speed here.
```

---

## STEP 5 — Update the Database (Seeds)

```
Now let's update the database layer to reflect [CLIENT NAME].

IMPORTANT: Use our research document "CLIENT - Research & Analysis/01 - Comprehensive
Client Analysis.md" as the source of truth for all data values.

1. UPDATE ALL SEED FILES in prisma/seeds/, working in order:

   - 01-company.ts: Company name, ticker, industry, fiscal year, headquarters, etc.
   - 02-fiscal-periods.ts: Align to [CLIENT NAME]'s fiscal calendar
     (calendar year ending Dec 31? Different fiscal year?)
   - 03-financials.ts: Replace with [CLIENT NAME]'s financial structure —
     revenue segments, cost lines, margins based on our research
   - 04-kpis.ts: [CLIENT NAME]'s actual KPIs with realistic target values
   - 05-operations.ts: Operational metrics for [CLIENT NAME]'s industry
   - 06-strategic.ts: Strategic initiatives and execution tracking
   - 07-market.ts: Market data, competitive positioning
   - 08-scenarios.ts: Scenario templates relevant to [CLIENT NAME]
   - 09-alerts-reports.ts: Alert thresholds and report definitions
   - 10-month-end.ts through the final seed file: Update ALL remaining
     seed files with [CLIENT NAME]-appropriate data

   For seed files that don't directly apply to [CLIENT NAME]'s business model:
   - Adapt them to an equivalent concept in [CLIENT NAME]'s business, OR
   - Keep the file structure but set data to empty arrays / minimal placeholders
   - Add a comment explaining what this maps to for [CLIENT NAME]

2. UPDATE SCHEMA IF NEEDED (Path B only):
   - Review prisma/schema.prisma for any model changes needed
   - Only modify if [CLIENT NAME] has fundamentally different data structures

3. RUN MIGRATION AND SEED:
   - npx prisma migrate reset (clear and rebuild the database)
   - npx prisma db seed (populate with [CLIENT NAME] data)
   - Verify the seed completed without errors

4. VALIDATE THE DATA:
   - Run sample queries against key tables to confirm data looks right
   - Check that company name, financial data, KPIs are all [CLIENT NAME]
   - Verify row counts are reasonable

ADDITIONAL REQUIREMENTS:

5. DELETE-BEFORE-CREATE FOR REFERENCE DATA TABLES:
   For seed files that create records that persist across re-seeds
   (especially businessSegment, businessConsole, fiscalPeriod, competitor*),
   the seed file MUST delete existing records before creating new ones:

   await prisma.businessSegment.deleteMany({ where: { companyId } });
   // then create new segments

   If you skip this, old records (including any legacy data from the template client)
   will co-exist with new records. Charts that read "all segments for companyId"
   will show BOTH old and new — which breaks the exec summary segment tile
   and competitive charts.

6. VALIDATE ensureExecutiveOverviewFinancials ENGINE:
   After seeding, open lib/engines/exec-overview-financials.ts and verify:
   a. `segments` is set to always use seed config (not DB):
      segments: [...seed.segments],   // never use DB segments for exec overview
   b. The enrichQuartersFromSeed function back-fills operatingIncome, eps,
      and operatingMargin from seed when DB rows have 0 values.
   c. The engine's seed quarter labels match the DB period labels
      (DB uses "Q1 FY25" format; seed may use "Q1 2025" — they must match
      or enrichment silently does nothing).

7. VALIDATE ZERO-REVENUE EXTENDED PERIODS:
   If your seed files include "extended period" rows, verify that revenue
   chart functions filter out zero-revenue quarters:

   function buildRevenueTrend(fin: FinancialConfig) {
     return (fin.quarters ?? [])
       .filter(q => q.revenue > 0)   // ← REQUIRED: prevents blank charts
       .map(q => ({ ... }));
   }

   Without this filter, extended-period rows with revenue=0 cause the
   financial performance chart to appear blank even when data exists.

8. CHECK METRIC NAME CONSISTENCY:
   After seeding, run this query against your Neon DB to see what metric
   names actually exist in competitorQuarterlyMetric:
   SELECT DISTINCT "metricName" FROM "CompetitorQuarterlyMetric";

   Compare these exact strings against what your chart components filter
   on (e.g., m.metricName === 'Office Count'). Any mismatch = blank chart.
   Update component filters OR seed file metric names to match.

9. EXTENDED PERIODS SEED (seed 19) — CRITICAL CROSS-CLIENT RISK:
   Seed 19 adds enrichment fiscal periods (FY24 history + near-future forecasts)
   to QuarterlyResult with non-zero revenue values. If getFinancials resolves
   latestQPeriod as the last item in the sorted periods array, these forecast
   periods (e.g., Q2 FY26, Q3 FY26) become the "latest quarter" — causing all
   Financial Performance plan vs actual tiles to show $0 actuals and a flat
   P&L variance chart, and the Forward Outlook trajectory chart to show
   duplicate 2026 labels instead of extending into future years.

   REQUIRED FIX in lib/db/repositories/financials.ts:
   Determine latestQPeriod by querying FinancialStatement for the most recent
   period with revenue.actual > 0:

   const latestActualPLRow = await prisma.financialStatement.findFirst({
     where: { companyId, lineItem: 'revenue', actual: { gt: 0 } },
     include: { period: true },
     orderBy: [{ period: { year: 'desc' } }, { period: { quarter: 'desc' } }],
   });
   const latestQPeriod = latestActualPLRow?.period ?? quarterPeriods[quarterPeriods.length - 1];

   ALSO REQUIRED: slice the quarters array at latestQPeriod to prevent
   seed-19 forecast values (which may carry the template client's industry data)
   from appearing in trend charts:

   const latestActualIdx = allQuarters.findIndex(q => q.quarter === latestQPeriod?.label);
   const quarters = latestActualIdx >= 0
     ? allQuarters.slice(0, latestActualIdx + 1)
     : allQuarters;

   IMPORTANT: seed 19 was written for the template client's industry. When
   adapting to a new client, rewrite seed 19 completely with industry-appropriate
   FY24 history and near-term forecast revenue values. Do not inherit the
   template's values — they will silently corrupt quarterly trend charts.

10. FORWARD OUTLOOK PERIOD LABELS — MUST MATCH DB SEED LABELS EXACTLY:
    Seed 06 (strategic.ts) seeds forwardOutlook periods with labels like 'Q2 FY26'.
    The config/clients/[CLIENT-SLUG]/strategic.ts file also defines forwardOutlook
    periods for future periods not yet seeded (e.g., Q3 FY26, Q4 FY26, Q1 FY27).
    The getStrategic repository merges config periods into DB data using exact
    label matching — if the labels differ, the merge silently fails and you get
    duplicate or missing periods in the Forward Outlook trajectory chart.

    Use the SAME label format throughout — 'Q# FY##' for quarters, 'FY##' for
    annual. Never use 'Q2 FY 2026', 'FY 2026 Full Year', or other variants.
    The forward outlook config should extend at least 6 quarters beyond the
    last actual period (e.g., if last actual is Q1 FY26, provide through Q3 FY27).

11. FISCALYEARMETRIC UNIT TYPE — STRICT UNION ENFORCEMENT:
    lib/epm/fiscal-year-data.ts defines FiscalYearMetric with a strict unit type:
      unit: '$M' | '%' | '$/share' | 'count'

    The '$B' value is NOT in the union. Attempting to seed a metric with
    `unit: '$B'` causes a TypeScript build error. Fix: scale the numeric value
    to millions and use `unit: '$M'` instead.
      e.g., { metric: 'IET Order Intake ($B)', plan: 3.1, unit: '$B' }  ← BREAKS
            { metric: 'IET Order Intake ($M)', plan: 3100, unit: '$M' }  ← CORRECT
    Also applies to any new unit values not in the original union — either add
    them to the union type OR scale values to fit an existing unit.

12. PARALLEL BACKGROUND AGENT STRATEGY FOR SEED REWRITES (KEY EFFICIENCY WIN):
    For a 30–40 file seed rewrite (the most time-consuming step in Path B),
    the fastest approach is launching 3–5 background agents in parallel, each
    responsible for a logical grouping of seed files:

    Agent group A: seeds 01–07 (company, fiscal, financials, KPIs, operations, strategic, market)
    Agent group B: seeds 08–12 (scenarios, alerts/reports, month-end, extended periods, consoles)
    Agent group C: seeds 13–20+ (if present — competitor metrics, industry data, etc.)

    Each agent prompt should:
    - Specify the exact file paths to rewrite
    - Include the client research document as context
    - Reference the TypeScript interface types for each seed model
    - Instruct deletion-before-creation for reference tables (see item 5 above)

    This approach reduced BKR seed rewrite time from an estimated 6–8 sequential
    sessions to a single parallel session. Monitor agent outputs for TypeScript
    type errors — these are the most common failure mode (e.g., unit: '$B' above).

Give me a detailed summary of every seed file updated and any issues encountered.
```

---

## STEP 6 — Brand the Front End

```
Let's make the front end authentically [CLIENT NAME]. Reference the "Brand Identity Notes"
section from our research document.

1. LOGO:
   - Search for and download [CLIENT NAME]'s official logo
     (SVG strongly preferred, PNG as fallback)
   - Save as public/logo.svg and public/logo.png (replacing the previous client's logos)
   - Create a white/light version for the dark nav bar: public/logo-white.svg
   - Keep the Accenture logos as-is (we're the implementer)
   - Update the logoAlt text in branding.ts

2. BRAND COLORS:
   - Using the brand colors from our research, update
     config/clients/[CLIENT-SLUG]/branding.ts:
     - primary: [CLIENT NAME]'s primary brand color
     - primaryDark: darker shade for headers/nav
     - primaryLight: light shade for backgrounds/highlights
     - primaryAlt: secondary brand color
     - navBg: dark color for navigation background
     - navBgLight: slightly lighter nav shade
     - accent: accent/action color
   - Keep success (#10b981), warning (#f59e0b), danger (#ef4444), info (#3b82f6)
     unless they clash with the brand palette

   ⚠️ CRITICAL — BRAND COLORS ARE EMBEDDED IN 100+ FILES, NOT JUST branding.ts:
   The source client's hex codes exist as inline Tailwind arbitrary values
   (e.g., `text-[#003366]`, `bg-[#003366]`) throughout every layer of the
   codebase — page components, shared components, CSS variables, error pages,
   and even config files. Updating branding.ts alone changes nothing visible.

   After updating branding.ts and globals.css, run a global replacement:

   a. Find all files containing the source client's primary hex codes:
      rg "#[SOURCE-PRIMARY-HEX]|#[SOURCE-DARK-HEX]|#[SOURCE-HOVER-HEX]|#[SOURCE-TINT-HEX]" \
         app/ components/ lib/ config/ --type tsx --type ts --type css

   b. Replace ALL instances in a single pass. Use [System.IO.File]::ReadAllText /
      WriteAllText in PowerShell — NOT Get-Content -Raw, which is unreliable for
      directories with Next.js dynamic route segments like [slug] and [id]:

      $content = [System.IO.File]::ReadAllText($fullPath)
      $content = $content -replace '#[SOURCE-PRIMARY]', '#[NEW-PRIMARY]'
      $content = $content -replace '#[SOURCE-DARK]',    '#[NEW-DARK]'
      $content = $content -replace '#[SOURCE-HOVER]',   '#[NEW-HOVER]'
      $content = $content -replace '#[SOURCE-TINT]',    '#[NEW-TINT]'
      [System.IO.File]::WriteAllText($fullPath, $content)

   c. Also update globals.css CSS variables:
      - RGB triplets (e.g., `0 51 102`) used by rgb(var(--primary-navy))
      - HSL values for --primary and --ring shadcn variables
      - rgba() values in glow/box-shadow definitions
      - All "Delta"/"[SOURCE CLIENT]" comments in the CSS variable block

   d. Run the rg search again after replacement — confirm zero matches.

   IMPORTANT: Use official brand hex codes from the client's brand style guide,
   not approximations. A color that looks close in a browser may render off-brand
   in print or on high-DPI displays.

   ⚠️ LOGIN PAGE GRADIENT — HARDCODED LEGACY HEX VALUES NOT CAUGHT BY GLOBAL SEARCH:
   app/(public)/login/page.tsx contains a background gradient with hardcoded hex
   values embedded inside a CSS-in-JS template literal. The outer values use
   `${c.primaryDark}` (which reads from branding.ts correctly), but the INNER
   stops are hardcoded legacy client hex values:

     style={{ background: `linear-gradient(135deg, ${c.primaryDark} 0%, #001848 40%, #002058 60%, ${c.primaryDark} 100%)` }}

   The inline hex values (#001848, #002058 for Verizon navy) are NOT caught by
   a global rg search for the source-client's primary brand hex because they are
   secondary/gradient shades. Search for them explicitly:

     rg "#001848|#002058|#003366|#001F5B" app/(public)/login/page.tsx

   Fix: replace both inline stops with the new client's dark brand shades
   (e.g., #05322B and #04281F for Baker Hughes dark greens).

3. TYPOGRAPHY:
   - If [CLIENT NAME] uses a specific web font, add it via Google Fonts or local files
   - Update globals.css and tailwind.config.ts with the font family
   - If no specific font, keep the current defaults

4. PLATFORM NAMING:
   - Ensure all UI references say "[CLIENT NAME] Finance360" (not previous client name)
   - Update the tagline and subtitle if needed

5. FAVICON & META:
   - Update the favicon to use [CLIENT NAME]'s logo
   - Update public/sitemap.xml with the correct domain if known
   - Update any meta tags in the layout

6. VERIFY:
   - Start the dev server (npm run dev)
   - Take a screenshot of the homepage so I can see the new branding
   - Take a screenshot of the login page as well
```

---

## STEP 7A — Previous Client String Audit

```
Let's do a comprehensive page-by-page audit of the entire application. The goal is to
ensure EVERYTHING shows [CLIENT NAME] data and branding — zero previous-client references
should remain anywhere in the UI.

AUDIT PROCESS — For EACH page:
1. Navigate to the page
2. Take a screenshot
3. Verify all text, labels, KPIs, and data reflect [CLIENT NAME]
4. Verify branding (colors, logo) is consistent
5. Verify data is populating from the database correctly
6. Flag any issues found (missing data, wrong labels, stale references, broken UI)

PAGES TO AUDIT (check each one):

Authentication:
- [ ] Login page

Executive & Home:
- [ ] Homepage / Dashboard
- [ ] Executive Summary

Reports:
- [ ] Monthly Report
- [ ] Report Hub
- [ ] Build Presentation

Business Consoles (note: these may need renaming for [CLIENT NAME]):
- [ ] Console 1
- [ ] Console 2
- [ ] Console 3
- [ ] Console 4
- [ ] Console 5

EPM (Enterprise Performance Management):
- [ ] Bridge Walks
- [ ] Fiscal Year Plan
- [ ] Long-Term Planning
- [ ] ML Forecasting
- [ ] Risks & Opportunities
- [ ] Short-Term Planning

AI Features:
- [ ] AI Alerts
- [ ] AI Search
- [ ] AI Agents
- [ ] Chat interface — ask it a question about [CLIENT NAME] and verify it responds
      with correct context

Analysis & Tools:
- [ ] Commentary
- [ ] Commodity Tracking
- [ ] Competitive Intelligence
- [ ] Month-End Close
- [ ] Scenario Modeling

ALSO CHECK:
- [ ] Search the entire codebase for any remaining strings from the template client
      in user-facing code (excluding git history, node_modules, .next)
- [ ] Verify all API routes return [CLIENT NAME] data (spot-check 3-4 routes)
- [ ] Verify the AI system prompt (lib/ai/system-prompt.ts) references [CLIENT NAME]
- [ ] Check the navigation labels match [CLIENT NAME]'s business segments

ADDITIONAL SEARCH STRINGS (these are NOT caught by a simple name search):
Run these rg searches and fix every match:

# Hardcoded CRE competitor names
rg "JLL|Cushman|Colliers|Newmark|Savills" app/ components/ lib/ config/

# Real estate operational terms
rg "property|advisory|leasing|AUM|fee revenue|deal cycle|office count|
    store renovation|comp sales|net new stores|office footprint" \
   app/ components/ lib/ --ignore-case

# Chart template labels (often missed)
rg "Organic Growth Trend|AUM Growth|Average Fee Rate|Active Clients" app/

# Regional labels
rg "APAC Market|vs\. JLL|vs\. Cushman" app/

# Source client brand hex codes (inline Tailwind — not caught by name search)
rg "#[SOURCE-PRIMARY-HEX]|#[SOURCE-DARK-HEX]|#[SOURCE-HOVER-HEX]" \
   app/ components/ lib/ config/ --type tsx --type ts --type css

# EPM data files — these live in lib/epm/ and are NOT hit by app/ searches
rg "Fuel|fuel|Refinery|refinery|Non-Fuel|Jet|jet|Cargo" lib/epm/
rg "Leasing Revenue|Subcontractor|Capital Markets" lib/epm/

# Scenario signal and driver files — industry-specific content in lib/scenario/
rg "jet fuel|corporate travel|ASM|load factor|completion factor|amex remuneration" \
   lib/scenario/ --ignore-case
rg "fuel.price|load.factor|premium.seat|capacity.growth|completion.factor|casm" \
   lib/scenario-engine.ts lib/scenario/ --ignore-case

# ── NEW IN v2.6 ──────────────────────────────────────────────────────────────

# Custom Dashboard widget IDs — IDs are displayed as chip labels on dashboard cards
# (split on '-' and capitalized), so old-client IDs produce visible brand names in the UI
# Must search widget IDs in widgetChartData keys, savedDashboards[].widgets[], AND availableWidgets[].id
rg "jll|emea|cbre|cushman|colliers|savills|delta|passenger" \
   "app/(protected)/business-consoles" --ignore-case

# Custom Dashboard savedDashboards descriptions — can contain client-specific language
rg "passenger growth|AUM Tracker|deal cycle|cap rate|occupancy rate|sq ft" \
   "app/(protected)/business-consoles" --ignore-case

# Competitive Intelligence Section 6 — hardcoded static JSX panels (NOT data-driven)
# These panels survive all config/seed audits — they are raw JSX with inline data arrays
rg "Pacific.*International|Domestic US Market|Pacific.*Route|APAC.*Hub|international.*route" \
   "app/(protected)/competitive-intelligence" --ignore-case
rg "Delta Share|delta.*market|airline.*market|passenger.*share" \
   "app/(protected)/competitive-intelligence" --ignore-case

# Analytics Sandbox — all string locations that must be updated per client
rg "delta\.financials|vzn\.financials|\.financials\.quarterly" \
   "app/(protected)/sandbox" --ignore-case
rg "Passenger Segments|Hub.*Route Coverage|Route.*Network Performance|TRASM.*Yield|Cabin.*Revenue Mix|Fleet.*Capacity" \
   "app/(protected)/sandbox" --ignore-case
rg "seeded Delta|seeded [A-Z][a-z]+ data|pre-built Delta|pre-built [A-Z][a-z]+ dashboard" \
   "app/(protected)/sandbox" --ignore-case

# AI Overview — verify all three scenarios have analysisSummary defined, and all
# lucide-react icon names used in the file are present in the import statement
# (missing icons cause a TypeScript error that crashes the entire page)
rg "analysisSummary" "app/(protected)/ai-overview/page.tsx"
# Manually verify: every icon name used as JSX element is in the lucide-react import line

# ── NEW IN v2.7 ──────────────────────────────────────────────────────────────

# Home page CFO tagline — hardcoded in HomeClient.tsx, NOT read from branding.ts
# Search for the CFO's name (e.g., "David Bernstein" or "Tony Skiadas") inline in JSX:
rg "CFO\)" "app/(protected)/HomeClient.tsx"
# Fix: update the sectionSubtitle string in HomeTileSection to use the new CFO name.
# The tagline is a plain string literal in the component — grep will find it.

# Scenario Modeling tabs — source-client vzn/ imports survive all config audits
# because they are component-level imports, not config references:
rg "vzn/scenario-tabs|vzn/strategic|vzn/market|vzn/operations" \
   "app/(protected)/scenario-modeling" --type tsx --type ts
# Fix: replace the import block in ScenarioModelingClient.tsx with an inline
# ScenarioTabConfig type + per-tab lever definitions. Then fully rewrite each
# tab component (StrategyInvestmentTab, StorePortfolioTab, etc.) — see Step 7B item 21.

# Four SVG logo files + site.webmanifest — only logo.svg is typically checked;
# the other three SVGs and the webmanifest are missed and the source client's
# branding remains on the login page, browser tab, and PWA install screen:
rg "Verizon|Delta|Carnival|logo-white|logo-icon|favicon" public/
# Required files (ALL four must be rewritten):
#   public/logo-white.svg  — login page dark background + mobile menu dark bg
#                             (CONTAINS LITERAL COMPANY NAME AS SVG <text> ELEMENT
#                              — this is what shows "Verizon" on the login screen)
#   public/logo.svg        — light background pages (onboarding, reports)
#   public/logo-icon.svg   — desktop nav sidebar header + browser favicon ref
#   public/favicon.svg     — browser tab favicon (separate from logo-icon!)
#   public/site.webmanifest— PWA install screen: "name", "description",
#                             "theme_color", "background_color" all must be updated
# Fix site.webmanifest: update name, description, theme_color (#02BC94 for BKR),
# and background_color — these control what appears when the app is installed
# as a PWA on mobile/desktop.

# Management-layout.tsx brand colors — ALL nav/UI brand-color instances in
# management-layout.tsx are hardcoded hex values (e.g., `bg-[#000000]`), NOT
# read from branding.ts. Updating branding.ts changes NOTHING visible in the nav:
rg "#[SOURCE-PRIMARY-HEX]" "app/management-layout.tsx"
# Fix: run a targeted replace_all in management-layout.tsx for every instance
# of the source client's hex code → new client's primary brand color.

# Industry news ticker — three locations must ALL be updated together:
#   app/api/industry-news/route.ts  (FEEDS array: RSS URLs + User-Agent string)
#   lib/industry-news.ts            (FALLBACK_NEWS items + comment)
#   app/(protected)/scenario-modeling/IndustryNewsTicker.tsx  (aria-label, label, footer)
# Leaving any one of these with source-client content produces mismatched labels.
# Replace RSS feed URLs with [CLIENT NAME]'s industry publication feeds.
# Common sources by industry:
#   Telecom: Fierce Wireless (fiercewireless.com/rss/xml) + Google News telecom query
#   Airlines: Simple Flying (simpleflying.com/feed) + Google News aviation query
#   Banking: American Banker RSS + Google News banking/fintech query
#   Pharma: FiercePharma RSS + Google News pharma/biotech query

Fix all matches. Save audit results as:
"CLIENT - Research & Analysis/02 - Platform Audit Results.md"
with a table showing: Page | Status (Pass/Fail) | Issues Found

Then fix ALL issues found and re-verify the failed pages.
```

---

## STEP 7B — Component Architecture Audit

> This step catches issues the string search misses. It is required for Path B and strongly recommended for Path A.

```
Work through each item below:

1. RECHARTS WRAPPER COMPONENTS:
   Search for custom components that wrap a Recharts chart type:
   rg "function.*Chart.*\{" app/ --type tsx

   For each wrapper component rendered inside a <ResponsiveContainer>,
   verify it accepts and forwards width and height props to its inner chart:

   // CORRECT — will render
   function MyChart({ data, width, height }: { data: ...; width?: number; height?: number }) {
     return <ComposedChart data={data} width={width} height={height}>...</ComposedChart>
   }

   // BROKEN — renders at 0x0, chart invisible
   function MyChart({ data }: { data: ... }) {
     return <ComposedChart data={data}>...</ComposedChart>
   }

   ResponsiveContainer injects width/height via React.cloneElement. If the
   direct child is a wrapper component that doesn't forward these props,
   the inner chart has no dimensions and is invisible.

2. DATA PLAYGROUND METRIC STRINGS:
   Open app/(protected)/sandbox/SandboxClient.tsx (or equivalent).
   Audit: catalogEntities, measureOptions, metricOptions, generateChartData,
   and Quick Templates. These are purely client-side strings that must be
   updated for each client — they are NOT caught by DB or config audits.

3. FINANCIAL QoQ OR TREND CHART DATA SOURCES:
   Verify the Financial performance section chart uses data that is
   guaranteed to be populated. Charts that depend on operatingIncome or eps
   from the DB are high-risk — these fields are often 0 in the DB even when
   revenue is correct. Prefer charts that use revenue + operatingMargin,
   both of which are more reliably seeded.

4. BENCHMARKING TABLE COLUMNS:
   Audit table components in competitive intelligence and similar pages for
   column headers and data keys referencing previous-client metrics. A column
   labelled "Office Count" or "Comp Sales" with no data is worse than hiding
   the column entirely — hide columns when you have no data to fill them.

5. NAVIGATION LABELS:
   Open lib/navigation-config.ts. Verify every href and label is appropriate
   for [CLIENT NAME]'s industry. Pay special attention to console names.

6. SYSTEM PROMPT:
   Open lib/ai/system-prompt.ts. Verify the AI is grounded in [CLIENT NAME]
   and understands the correct industry metrics, executive names, and context.

7. BUSINESS CONSOLE PAGE.TSX LOOKUP PREDICATES:
   Each business console page fetches the seeded BusinessConsole record using a
   predicate like:
      consoles.find(c => c.segment.includes('store') || c.title.includes('building'))

   If this predicate does NOT match the seeded console's actual segment and title
   values (from prisma/seeds/12-business-consoles.ts), opsConsole is always null
   and the page falls back to its hard-coded driver tree — which is almost certainly
   the previous client's industry content (e.g., FM/real-estate for a CRE template).
   The data is in the DB but the page cannot find it.

   For EVERY business console page.tsx, verify:
   a. Open 12-business-consoles.ts and find the consoleDefinitions block for that
      console — note the exact `segment:` and `title:` values that are seeded
      (e.g., segment: 'network-ops', title: 'Network Operations')
   b. Open the corresponding page.tsx and confirm the consoles.find() predicate
      will match those exact values (string.includes checks are case-sensitive
      on the lowercased value, so 'network' matches 'network-ops')
   c. Fix any mismatches — a single word difference causes opsConsole = null

   This is also why a console may still show old industry content even after
   seed 12 is correctly updated for the new client.

   ⚠️ BUSINESSCONSOLESCLIENT TRIPLE DATA STRUCTURE — ALL THREE MUST BE UPDATED:
   app/(protected)/business-consoles/BusinessConsolesClient.tsx contains THREE
   separate data structures that all use console TITLE strings as keys. All three
   must be updated together — missing any one causes silent failures:

   a. `titleToSegmentId` — maps console title → URL slug for routing.
      Missing entries fall back to a title-derived slug (OK for [consoleid] pages)
      but WRONG entries cause "Open" to route to a non-existent URL → 404.
      Legacy source-client entries (e.g., 'Consumer Wireless Revenue': 'consumer-wireless')
      MUST be removed — if the DB has any stale source-client console record with
      that title, the "Open" button will 404. Map every new client console title
      to either its exact static-page folder name OR a title-derived slug that
      [consoleid]/page.tsx can find via title matching.

   b. `viewableConsoles` — controls which consoles show an "Open" button vs
      "Coming Soon". Source-client titles here survive all seed/config audits.
      Recommended: add ALL new client console titles so every console is openable
      via the [consoleid] dynamic route (which shows driver data from the DB).

   c. `consoleIconMap` — maps console title → lucide-react icon.
      Missing entries silently fall back to BarChart3, so all unmapped consoles
      show the same generic icon. Not a functional bug but looks unfinished.

   Fix workflow: open prisma/seeds/12-business-consoles.ts, copy all `title:`
   values from consoleDefinitions[], then update all three maps in BusinessConsolesClient.tsx.

   ALSO VERIFY: the catch-all dynamic route file exists at
   app/(protected)/business-consoles/[consoleid]/page.tsx

   Without this file, every /business-consoles/[any-slug] URL returns a 404
   regardless of how correct the seeds or predicate logic are. The file looks
   up the console from DB using params.consoleid matched against seeded
   BusinessConsole.segment values, then renders a ConsoleDetailClient component.
   It is NOT generated automatically — it must be created explicitly for each
   new client instance.

9. lib/scenario-engine.ts — MANDATORY REWRITE FOR PATH B:

   This file is the most dangerous source of silent failures in a new-industry
   conversion. It is not a config file and it is not audited by any component or
   string search — it is a pure computation module that runs server-side.

   Open lib/scenario-engine.ts and verify ALL of the following:

   a. FALLBACK_DEFAULTS — keys must exactly match ScenarioLever.externalId values
      seeded in prisma/seeds/08-scenarios.ts. Mismatched keys silently resolve
      to 0, causing every lever's delta() to return 0 and the P&L to show no
      sensitivity to any slider movement.

   b. Segment lookups in calculateImpact() — every segmentRevenue(bl, '[name]', ...)
      call uses a string that must exactly match the name: values in
      config/clients/[CLIENT-SLUG]/financials.ts → scenarioBaseline.segments[].
      If ANY segment name doesn't match, sharedSegmentRevenue() throws an error,
      the API route returns 500, and the client silently swallows it — producing
      an indefinitely spinning loader on the P&L Impact tab with no error shown.

   c. Lever delta() calls — every delta('lever-id') call must reference a lever ID
      that exists in the new client's seed. Source-client IDs (e.g., 'fuel-price',
      'load-factor', 'premium-seat-mix', 'completion-factor', 'amex-remuneration')
      silently resolve to delta = 0 if they're not in the new seed — causing the
      P&L to appear completely insensitive to those sliders.

   d. Sensitivity constants — replace source-client constants (e.g., fuelPerTenCentsGal,
      loadFactorPerPP) with new-industry equivalents calibrated to investor disclosures
      or earnings call guidance. Document each constant's source.

   For Path B, this file requires a full rewrite. The FALLBACK_DEFAULTS map,
   all segment lookup strings, all lever ID references, and all sensitivity
   constants must be replaced.

10. lib/epm/ DATA FILES — AUDIT ALL FOUR FOR PATH B:

    The following files in lib/epm/ contain hardcoded industry-specific terminology
    that is NOT caught by any component or seed audit:

    - bridge-data.ts: BRIDGE_PL_LINES constant and all plLine: values in bridge
      walk entries. Source-client lines (e.g., 'Non-Fuel Operating Expenses') must
      be replaced with new-industry equivalents (e.g., 'Network Operating Expenses').
      These strings drive the bridge walk selector UI and data filtering.

    - fiscal-year-data.ts: Metric name strings in the metrics[] array (e.g.,
      'Fuel & Related Costs', 'Gross Revenue less Fuel') appear in the Fiscal Year
      Plan table. Replace with the new client's actual P&L line names.

    - pl-forecast-data.ts: REVENUE_DRIVERS, COGS_DRIVERS, and OPEX_DRIVERS arrays
      contain driver label strings that are entirely industry-specific. Replace all
      driver labels and their associated descriptions.

      ⚠️ CRITICAL — PLLineItem CANONICAL TYPE ENFORCEMENT:
      The makeRow() function in pl-forecast-data.ts accepts a PLLineItem parameter.
      PLLineItem is a string union type — only exact literal values from the union
      are valid. If a call like makeRow('Fuel & Related Costs') uses a string NOT
      in the union, TypeScript may silently accept it (depending on how the type is
      applied at the call site) but the row will be invisible in charts that filter
      by type. Always use one of these canonical values:
        'Revenue' | 'Cost of Service' | 'Gross Profit' | 'Labor & Benefits' |
        'Depreciation & Amortization' | 'Maintenance & Other Ops' |
        'Total Operating Expenses' | 'Operating Income' | 'Net Income' | 'EPS'

      ⚠️ BACKSLASH ESCAPING BUG: In some editors/agents, ampersands in string
      literals get written as escaped sequences ('Labor \& Benefits'). TypeScript
      accepts this but the runtime string becomes 'Labor \& Benefits' (with literal
      backslash), which never matches any filter. Write: makeRow('Labor & Benefits')
      — no backslash. After editing, grep for `\&` in pl-forecast-data.ts.

      ⚠️ FINANCIAL CONSTANTS — ALL MUST BE RECALIBRATED FOR NEW CLIENT:
      pl-forecast-data.ts contains several numeric constants at the top that are
      calibrated to the source client's financials. Replace ALL of these:
        - QUARTERLY_REVENUE[] — quarterly revenue actuals for the seeded periods
        - COS_PCT[] (or FUEL_PCT in airline template) — cost of service % per quarter
        - LABOR_BASE / DA_BASE / MAINTENANCE_BASE — quarterly $ base values
        - TAX_RATE — effective tax rate (e.g., 0.24 for Verizon)
        - INTEREST_EXPENSE — quarterly interest expense in $M
        - SHARES_OUTSTANDING — diluted shares in millions (used for EPS bridge)
      Inheriting the source client's constants silently produces a plausible-looking
      but completely wrong P&L — the numbers will be in the right range but wrong
      company. Calibrate from the new client's most recent 10-K or 10-Q.

    - planning-engine.ts: Category labels in SHORT_TERM_LEVERS and LONG_TERM_LEVERS
      (e.g., 'Refinery & Fuel Operations') and any inline comments referencing the
      source client's business. Replace with new-industry equivalents.

    Run this search to find remaining source-client terminology before launch:
    rg "Fuel|fuel|Refinery|refinery|Non-Fuel|Leasing Revenue|Capital Markets Volume" lib/epm/

11. lib/scenario/ SIGNAL AND DRIVER FILES — FULL REPLACEMENT FOR PATH B:

    - external-competitive-signals.ts: Contains 5 competitive signals and an intro
      paragraph. All 5 signals are industry-specific by design (e.g., jet fuel
      pricing, corporate travel demand, ASM yield, labor/OEM/ATC risk, JV
      regulatory immunity). Every signal ID, headline, impact band, and SWOT
      content must be replaced with new-industry signals.

      ⚠️ ENCODING WARNING: When writing large string blocks using an AI agent's
      Edit tool, Unicode curly/smart quotes (U+2018 ' and U+2019 ') can be
      silently substituted for ASCII apostrophes. The TypeScript SWC compiler
      rejects them at build time with "Unexpected character" — the error points
      to character position, not the string. After the agent writes this file,
      verify and fix with PowerShell:

      $c = [System.IO.File]::ReadAllText($path)
      $c = $c -replace [char]0x2018, "'" -replace [char]0x2019, "'"
      [System.IO.File]::WriteAllText($path, $c)

    - driver-analytics-model.ts: Contains the full CFO driver cascade tree
      (DRIVER_ANALYTICS_TREE). Every node label, plBridge description, and
      leverId reference is industry-specific. The tree SHAPE (root → children
      → leaves with plBridge and leverIds) is reusable; all labels and IDs
      must be replaced with new-industry equivalents mapped to the new client's
      seeded lever IDs.

12. EXECUTIVE SUMMARY — HARDCODED OPERATIONAL MINI-METRICS:

    The "AI Financial Snapshot" section on the Executive Summary page contains
    4 tiles. Each tile includes a mix of DB-sourced data AND hardcoded static
    mini-metric bars (small progress bars with labels) embedded directly in JSX.
    These are NOT sourced from any database, config file, or seed — they are
    static strings that survive every data and config audit.

    Locate the 4 tiles in app/(protected)/executive-summary/ExecutiveSummaryClient.tsx
    (typically around the "AI Financial Snapshot" comment). For each tile, read
    the small text label spans (often className="text-[10px] text-white/40") and
    verify the labels are industry-appropriate for [CLIENT NAME]. Common source-
    client holdovers: "Premium Mix", "Completion Factor", "Load Factor",
    "TRASM", "CASM-Ex", "On-Time Performance". Replace with equivalent
    operational KPIs for the new industry.

13. BRIDGETAB TOTALVARIANCE SIGN CONTRACT — CRITICAL FOR CORRECT COLOR CODING:

    BridgeTab (components/console/BridgeTab.tsx) determines whether to render
    the total variance in green (favorable) or red (unfavorable) using:
      totalVariance.startsWith('+') || parseFloat(totalVariance) > 0

    The prop MUST be a signed number string like "+208" or "-1876".
    If you use Math.abs() before converting to string, negative values produce
    "1876" (no sign) → parseFloat("1876") > 0 → TRUE → GREEN for a decline.

    CORRECT pattern in ConsoleDetailClient render:
      totalVariance={totalVariance >= 0 ? `+${Math.round(totalVariance)}` : `${Math.round(totalVariance)}`}

    BROKEN pattern (strips the minus sign):
      totalVariance={`${totalVariance >= 0 ? '+' : ''}${Math.round(Math.abs(totalVariance))}`}

    This bug produces a large negative variance displayed in green — it looks
    deliberately formatted, not broken, so it is easy to miss in review.

14. DB METRIC STRING VALUE PARSING — DO NOT RELY ON variancePercent:

    BusinessConsole driver metrics are seeded with current/target values as
    formatted strings: "$20.78B", "0.89%", "+55K", "$139/mo", "700K–800K".
    The variancePercent column in DBDriverMetric is typically null after seeding
    (the seed populates values, not computed variances). Any code that uses
    `m?.variancePercent ?? 0` for bridge item or chart computations will
    silently produce $0M for every item — charts appear populated but show
    no variance data.

    The fix is a custom parser (parseMetricNum) that handles all string formats
    and converts them to numeric values, then a sensitivity-calibrated function
    (computeImpactM) that converts the parsed delta to quarterly $M impact:

    // Handles B/M/K/% /mo suffixes, range notation (700K–800K → midpoint),
    // tilde prefix (~10.0M), and sign prefixes (+55K)
    function parseMetricNum(s: string): { num: number; suffix: string } { ... }

    // Converts current-vs-target delta to quarterly $M impact
    // Uses industry-calibrated sensitivities (e.g., 1% ARPA change = $200M/qtr)
    function computeImpactM(parsed: ..., suffix: string): number { ... }

    When building ConsoleDetailClient for a new client, define these sensitivities
    based on the new client's investor disclosures and earnings call guidance.
    Document each constant's source so future agents can validate them.

15. COMMODITY TRACKING / COST INDEX PAGE ADAPTATION:

    app/(protected)/commodity-tracking/CommodityTrackingClient.tsx contains a
    chart originally built for spot vs. hedged price comparison (two area lines).
    For industries without spot/hedge price data (telecom, tech, financial services),
    remove the hedged price area and retain a single cost trend line per category:

    - Remove the <Area dataKey="hedge"> and its gradient definition
    - Change the tooltip formatter from dual-label to single-label ("Cost Index")
    - Update section heading from "Price Trends (Spot vs. Hedged)" to a category-
      appropriate label (e.g., "Cost Index Trends")
    - Update the summary tile labels: "Spot Price" → "Current Index",
      "Hedged Price" → a relevant alternative (e.g., "Prior Year", "YoY Change")

    Also update the COGS Impact Simulator:
    - The description text references the source client's cost exposure scale
    - The margin note divisor constant is calibrated to the source client's EBITDA —
      replace with the new client's annual EBITDA or operating expense base:
        cost / [CLIENT_EBITDA_BASE] * 100   // e.g., 1350 for Verizon, 372 for Delta

    Note: the COGS Impact Simulator sliders update the estimated annual impact
    figure in real time via useMemo — no async call required. Confirm this
    behavior is preserved after any adaptation.

8. FORWARD OUTLOOK TRAJECTORY CHART — DUPLICATE PERIOD LABELS:
   The ForwardOutlook component on the Monthly Report page combines two data
   sources on a single time axis:
   - financials.quarters (all QuarterlyResult rows, including seed-19 forecast rows)
   - strategic.forwardOutlook (from seed 06 + config augmentation)

   If the quarters array is not sliced at latestQPeriod (see Step 5, item 9),
   forecast periods from seed 19 (e.g., Q2 FY26, Q3 FY26) will appear in the
   actuals section AND the forwardOutlook section creates additional entries for
   the same labels — producing duplicate X-axis entries and a chart that appears
   to "replay" the same quarters rather than advancing into the future.

   The component fix: filter forwardOutlook to exclude the lastActualLabel from
   the forecast section, use lastActualLabel for the reference line, and filter
   period cards to only show future periods. But the root fix is in getFinancials
   (Step 5, item 9) — once quarters is sliced correctly, the overlap disappears.

16. CUSTOM DASHBOARD WIDGET IDS — CHIP LABEL DISPLAY (NEW IN v2.6):

    In app/(protected)/business-consoles/.../Custom.tsx (or equivalent), dashboard
    card chips display the WIDGET ID (not the display name) split by '-' and
    capitalized. For example: id 'jll-comparison' → chip label "Jll Comparison".

    This means you MUST rename the widget IDs themselves — not just the display
    names — in ALL THREE locations they appear:
    a. widgetChartData — object keys (used as the data lookup key)
    b. savedDashboards[].widgets[] — the string array referencing each widget
    c. availableWidgets[].id — the id property on each widget object

    If you rename only the display name (availableWidgets[].name), the chip label
    on the card still shows the old CRE/airline ID string. Always rename the ID
    first, then verify all three locations are consistent.

    When choosing new IDs: use telecom/industry-appropriate kebab-case strings
    that read sensibly when capitalized and space-joined. Example:
      'jll-comparison'  → 'peer-revenue-comparison'
      'emea-office-map' → 'regional-coverage-map'
      'emea-fee-growth' → 'regional-rev-growth'

17. CUSTOM DASHBOARD SAVED DASHBOARD DESCRIPTIONS:

    savedDashboards[] entries include a description string that is displayed in the
    UI. This description can contain client-specific language (e.g., "passenger
    growth", "AUM tracker") that survives all other audits because it is not a
    metric key and not an ID.

    For each savedDashboards[] entry, audit:
    a. The dashboard name (e.g., 'EMEA Markets Deep Dive' → 'Regional Network Performance')
    b. The description string (e.g., 'Delta passenger growth and load factor trends'
       → 'Verizon postpaid subscriber growth, plan attach rates, ARPU trends...')

    Also audit the template card text in the "Templates" tab if one exists — it
    often contains "pre-built [SOURCE CLIENT] dashboard templates" which must be
    updated. Search: rg "pre-built.*dashboard" app/(protected)/business-consoles

18. COMPETITIVE INTELLIGENCE SECTION 6 — HARDCODED STATIC JSX PANELS:

    The Competitive Intelligence page typically contains a Section 6 with two
    regional spotlight panels (e.g., "Pacific & International Routes" and
    "Domestic US Market" for the airline template). These panels are PURE JSX
    with hardcoded inline data arrays — they are NOT driven by the database,
    seed files, or config. They survive every data audit and every config change.

    For each new client:
    a. Identify the two Section 6 panel headings and their data arrays
    b. Replace BOTH panels completely with industry-appropriate regional panels
       e.g. for telecom: '5G & FWA Coverage Leaders' + 'National Wireless Competition'
    c. The panel data arrays (competitor names, metric values, stat strings) are
       all hardcoded — rewrite them from scratch using research for the new client
    d. Also audit COMPETITOR_COLORS: remove all source-client competitor entries
       and replace with the new client's peer set

19. AI OVERVIEW — PER-SCENARIO ANALYSIS SUMMARY POPUPS AND ACCORDION STEPS:

    As of v2.5, the AI Overview page (/ai-overview) uses:
    a. An analysisSummary modal popup accessible via an 'Analysis Brief' button —
       this must be present on ALL THREE scenarios in the allScenarios object.
       If any scenario is missing analysisSummary, TypeScript union-type inference
       will error when the component tries to read scenario.analysisSummary.*
    b. Accordion-style collapsible step rows — each step shows only timestamp,
       agent badge, and action label when collapsed; detail and output expand on click
       State: Set<number> for multi-expand; reset to new Set() on scenario switch

    When writing a new scenario for a new client, always include the analysisSummary
    block. The structure is:
      analysisSummary: {
        headline: string,
        generated: string,
        sections: Array<{ title: string, items: Array<{ label: string, value: string }> }>
      }

    LUCIDE-REACT IMPORT HYGIENE (critical — missing icon = page crash):
    Every icon used as a JSX element in page.tsx MUST be listed in the
    lucide-react import statement. The TypeScript compiler throws
    "Cannot find name 'IconName'" at build time — the entire page becomes
    unavailable (blank or 500 error). After adding any new icon usage,
    immediately verify the import line includes it.
    
    Search to audit: rg "<[A-Z][a-zA-Z]+\s" app/(protected)/ai-overview/page.tsx
    Cross-reference every result against the import { ... } from 'lucide-react' line.

20. ACTIVITY DETAIL PANELS — MODAL OVERLAY PATTERN:

    (see below)

21. SCENARIO MODELING TAB ARCHITECTURE — FULL REPLACEMENT FOR PATH B (NEW IN v2.7):

    ScenarioModelingClient.tsx imports tab lever configs from a client-specific
    config file (e.g., `config/clients/vzn/scenario-tabs.ts`) using named imports:

      import { wirelessBusinessTab as strategyInvestmentTab, ... }
        from '@/config/clients/vzn/scenario-tabs';
      import type { ScenarioTabConfig } from '@/config/clients/vzn/scenario-tabs';

    For a new industry client, the correct approach is NOT to update vzn/scenario-tabs.ts —
    it is to REMOVE these imports entirely and define the tab lever configs inline in
    ScenarioModelingClient.tsx. This avoids dangling client references and makes the
    lever definitions self-documenting.

    REPLACEMENT PATTERN:

    a. Define a local ScenarioTabConfig interface at the top of ScenarioModelingClient.tsx
       (replaces the imported type). Include at minimum: label, description, levers[].
       Each lever: id, name, description, min, max, default, step, unit, category, impact.

    b. Define each tab's lever config as a const (e.g., strategyInvestmentTab, fleetDeploymentTab)
       using the local interface — no external import needed.

    c. Update TAB_CONFIGS to reference the local consts. The AnalysisTab union type
       and the Exclude<> type annotation all work the same way with the local interface.

    d. REMOVE IRRELEVANT TABS entirely from:
       - The AnalysisTab union type
       - The tabs[] array
       - TAB_CONFIGS
       - TAB_PLACEHOLDERS
       - All render blocks in the JSX (the `{activeTab === 'removed-tab' && ...}` blocks)
       - All import statements at the top of the file

    e. For every remaining tab that had its own component file (StrategyInvestmentTab.tsx,
       StorePortfolioTab.tsx, etc.):
       - COMPLETELY REWRITE the component — do not patch or rename the source client's content
       - Remove all imports from vzn/* config files
       - Define the calculation engine using the new client's industry logic and lever IDs
       - Hardcode any initiative scorecard data or regional breakdowns as local constants
         (they are not driven by the database — they are static display arrays)
       - The props interface stays the same: `leverValues: Record<string, number>` + `onLeverChange`
       - Lever IDs in the component's calculation engine MUST exactly match the lever IDs
         defined in the corresponding tab's config in ScenarioModelingClient.tsx

    f. BRAND COLOR AUDIT in ScenarioModelingClient.tsx — several inline Tailwind colors
       throughout this file reference the source client's brand hex (e.g., `bg-[#000000]`,
       `border-[#000000]`, `from-[#000000]`). These are NOT caught by the global hex search
       because they may be the same as a generic black or a brand-coincident color. Audit:
       - Header icon div: `bg-[#SOURCE-HEX]`
       - Save / Run Scenario buttons: `bg-[#SOURCE-HEX]`
       - Active tab border/text: `border-[#SOURCE-HEX] text-[#SOURCE-HEX]`
       - Chat input focus ring: `focus:ring-[#SOURCE-HEX]`
       - Chat submit button: `bg-[#SOURCE-HEX]`
       - User chat bubble: `bg-[#SOURCE-HEX]`
       - AI summary card: `from-[#SOURCE-HEX] to-[#SOURCE-HEX]`
       - P&L "Operating Income" label: `text-[#SOURCE-HEX]`
       - P&L "Net Income" row background: `bg-[#SOURCE-HEX]`
       - Slider gradient: `#SOURCE-HEX` inside a backtick template literal (NOT Tailwind class)
       Replace ALL with the new client's primary brand hex.

22. DRIVER ANALYTICS — DUAL FILE UPDATE REQUIREMENT (NEW IN v2.7):

    The Driver Analytics heatmap reads from TWO independent files that must BOTH be
    updated when rebranding for a new client. Updating only one produces a partially
    correct heatmap with mismatched axis labels.

    FILE 1: lib/scenario/driver-analytics-model.ts — DRIVER_ANALYTICS_TREE
    This drives the Y-axis of the heatmap (driver row labels) and the driver tree
    sidebar. Every node's `label`, `plBridge`, and group node labels must be
    replaced with the new industry's equivalent. The `id` and `leverIds` values
    must NOT be changed — they are referenced by CORR, CONTRIBUTION_SCORE, and
    all lever delta() calls in the scenario engine.

    FILE 2: lib/scenario/driver-kpi-predictive-heatmap.ts — KPI_COLUMNS + expectNegativeAssociation
    This drives the X-axis of the heatmap (KPI column headers).
    a. Replace ALL entries in the KPI_COLUMNS array with the new client's executive KPIs
       (id, label, executiveLens, pillarWeights)
    b. CRITICAL — expectNegativeAssociation(): every driverId string in this function
       MUST use the actual driver ID from DRIVER_ANALYTICS_TREE (the `id` field),
       NOT a renamed display label. Example: if the tree node still has id: 'casm-ex-growth'
       but was relabeled to 'NCC ex-fuel growth', the check must still say:
         if (driverId === 'casm-ex-growth')   // ← actual ID
       NOT:
         if (driverId === 'ncc-ex-fuel-growth')  // ← renamed label (BROKEN — silently produces wrong colors)
       A mismatch here causes the negative-association color coding to silently fail —
       cells that should show red (e.g., high fuel cost → bad margin) show green instead.

    VERIFICATION: After updating both files, run:
      rg "driverId ===" lib/scenario/driver-kpi-predictive-heatmap.ts
    For each match, confirm the quoted string matches an `id:` value in DRIVER_ANALYTICS_TREE.

23. DRIVER ANALYTICS — FOUR-FILE REQUIREMENT (NEW IN v3.0):

    Item 22 documents two of the four driver analytics files. Two more ALSO require
    full rewrites for every new industry client. Skipping either causes the allocation
    frontier chart and timeseries sparklines to display the previous client's data.

    FILE 3: lib/scenario/driver-analytics-timeseries.ts — SERIES map
    Every key in the SERIES Record<string, ...> is a lever ID from the previous client.
    Each series requires 16 quarterly values (8 actuals + 8 projections) aligned to
    public disclosures. The HIST_LABELS / PROJ_LABELS / SPLIT constants stay the same
    shape; only the SERIES entries change. Failure to rewrite: DriverAnalyticsTrendChart
    renders blank (lever ID not found in SERIES → getDriverTimeseries returns null).

    FILE 4: lib/scenario/allocation-frontier.ts — LEVER_TO_PILLAR + LOWER_IS_IMPROVEMENT + PILLAR_LABEL
    a. LEVER_TO_PILLAR: every lever ID key must be replaced with the new client's lever IDs.
       Unmapped IDs silently fall back to 'productivity_cost' — no error, wrong frontier.
    b. LOWER_IS_IMPROVEMENT: the Set of lever IDs where a HIGHER lever value is adverse.
       Source-client IDs (e.g., 'fuel-price', 'casm-ex-growth', 'gross-leverage') must be
       replaced with the new client's equivalent adverse-direction levers
       (e.g., 'reimbursement-headwind-m' for a health care client).
    c. PILLAR_LABEL: four human-readable pillar descriptions used in chart tooltips.
       Replace 'Revenue & network', 'Productivity & unit cost', 'Loyalty & digital' with
       industry-appropriate equivalents.

    QUICK AUDIT COMMAND:
      rg "fuel-price|casm-ex|gross-leverage|premium-revenue-growth|amex-remuneration" \
         lib/scenario/allocation-frontier.ts lib/scenario/driver-analytics-timeseries.ts
    Any match means source-client content survived.

24. DRIVERANALYTICSTAB DEFAULT STATE — LEVER ID LEAK (NEW IN v3.0):

    app/(protected)/scenario-modeling/tabs/DriverAnalyticsTab.tsx has two pieces of
    hardcoded state that reference the PREVIOUS CLIENT'S lever IDs directly:

    a. useState for `expanded` — initializes a Set with specific tree node IDs:
         useState<Set<string>>(() => new Set(['cfo-root', 'rev-network', 'loyalty-digital', ...]))
       These IDs must match the actual node IDs in DRIVER_ANALYTICS_TREE. If the tree
       was rebuilt with different node IDs, the sidebar renders collapsed (no node
       matches the initial Set) — silently broken, no error.

    b. useState for `selectedId` — defaults to a specific leaf lever ID:
         useState<string | null>('fuel-price')
       If this ID does not exist in the new client's SERIES map or DRIVER_ANALYTICS_TREE,
       the right-hand detail panel renders blank on first load.

    SEARCH:
      rg "useState.*Set\|useState.*null\|useState.*string" \
         "app/(protected)/scenario-modeling/tabs/DriverAnalyticsTab.tsx"
    Update both defaults to IDs that exist in the new client's tree and timeseries map.

25. CFOTILES — operationalKPIs DOES NOT EXIST IN ALL CLIENT CONFIGS (NEW IN v3.0):

    components/home/CFOTiles.tsx contains KPI lookups for three tile slots (casm, asms,
    digital) that reference `kpis.operationalKPIs`:
      const casm = findKPI(kpis.operationalKPIs, 'Rate Base') ?? ...
      const asms = findKPI(kpis.operationalKPIs, 'ESA Contracted Load') ?? ...

    The `operationalKPIs` field only exists in some industry client configs (e.g., utilities).
    For health care, telecom, or any other industry whose config/clients/[slug]/kpis.ts
    defines only `primaryKPIs` and `secondaryKPIs`, every lookup returns undefined and
    the tile silently falls back to the hardcoded default strings from the PREVIOUS client
    (e.g., "Rate Base", "Network Reliability").

    FIX: redirect all three lookups to the correct fields for the new industry:
      const casm   = findKPI(kpis.primaryKPIs, '[LABEL_A]') ?? findKPI(kpis.secondaryKPIs, '[LABEL_B]');
      const asms   = findKPI(kpis.primaryKPIs, '[LABEL_C]') ?? findKPI(kpis.secondaryKPIs, '[LABEL_D]');
      const digital = findKPI(kpis.secondaryKPIs, '[LABEL_E]') ?? findKPI(kpis.primaryKPIs, '[LABEL_F]');

    SEARCH TO DETECT:
      rg "operationalKPIs" components/home/CFOTiles.tsx
    Any match means the bug is present.

26. HOMECLIENT STRATEGIC EXECUTION SUBTITLE + EXECUTIVE SUMMARY REVENUE TILE LABEL (NEW IN v3.0):

    Two additional hardcoded strings in HomeClient.tsx and ExecutiveSummaryClient.tsx
    are NOT caught by a company-name search because they reference industry terminology
    rather than the client's proper name:

    a. HomeClient.tsx — Strategic Execution sectionSubtitle (SEPARATE from the CFO tagline):
       Search: rg "sectionSubtitle" "app/(protected)/HomeClient.tsx"
       The subtitle is a plain string literal describing the strategic execution themes
       (e.g., "Missouri rate base CAGR, ESA data center load growth..."). Replace with
       the new client's equivalent strategic execution themes.
       NOTE: the CFO tagline (item in Step 7A) is a DIFFERENT string — both must be updated.

    b. ExecutiveSummaryClient.tsx — Revenue tile sub-KPI label:
       Search: rg "Wireless service rev\|Premium Mix YoY\|service rev\. YoY" \
                   "app/(protected)/executive-summary/ExecutiveSummaryClient.tsx"
       The label on the third sub-KPI in Tile 1 (Revenue) is hardcoded as a previous-
       client metric name (e.g., "Wireless service rev. YoY"). Replace with the new
       client's equivalent revenue line label (e.g., "Health Services Rev. YoY").

    For pages with swimlane diagrams or card grids where clicking an item shows
    additional detail (e.g., Financial Close Tracker), the preferred UX pattern
    as of v2.6 is a centered modal overlay rather than an inline panel below
    the main view that requires scrolling.

    Implementation pattern:
    - State: const [selected, setSelected] = useState<ActivityType | null>(null)
    - Backdrop: <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => setSelected(null)} />
    - Modal: <motion.div className="fixed inset-0 z-50 flex items-center justify-center
        p-4 pointer-events-none">
        <div className="w-full max-w-2xl bg-white rounded-2xl ... pointer-events-auto"
          onClick={e => e.stopPropagation()}>
          {/* modal content */}
        </div>
      </motion.div>
    - Use AnimatePresence with initial/animate/exit for smooth open/close
    - Backdrop click dismisses; inner div stopPropagation prevents accidental dismiss
    - pointer-events-none on the outer flex wrapper, pointer-events-auto on the card

    Apply this pattern when building or auditing the Financial Close Tracker
    and any similar swimlane or activity-grid page for a new client.
```

---

## STEP 8 — Final Code Quality & Pre-Deploy Polish

```
Final cleanup and deployment preparation for [CLIENT NAME]:

1. DOCUMENTATION:
   - Update README.md with [CLIENT NAME]-specific information
   - Make sure .env.example is generic (no real credentials)
   - Remove TEMPLATE-README.md (only needed in the template folder)

2. CODE QUALITY:
   - Run the full build: npm run build
   - Fix any TypeScript errors or build warnings
   - Run the linter: npm run lint
   - Fix any linting issues
   - Run tests if they exist: npm test

3. FINAL TEMPLATE CLIENT CLEANUP:
   - One last search for any remaining references to the template client name
     and slug in the codebase
   - Check public/ for any template-client-branded images that weren't replaced
   - Verify .claude/ config is clean

4. VERIFY PRISMA.CONFIG.TS:
   Confirm the datasource URL uses process.env (not Prisma's env() function)
   as documented in Step 1 Item 8. This is required for CI/CD to work.

5. PRE-DEPLOY BUILD VALIDATION:
   Before pushing, run a clean build locally:
   Remove-Item -Recurse -Force .next   # Windows
   rm -rf .next                         # Mac/Linux
   npm run build

   A stale .next cache can mask errors. The clean build must exit 0.
   If it fails, fix the errors before proceeding to Step 9.

6. FINAL VISUAL SPOT-CHECK:
   Start the dev server (npm run dev) and manually verify:
   [ ] Executive Summary — Financial performance chart shows data (not blank)
   [ ] Executive Summary — segment tiles show correct [CLIENT NAME] segments
   [ ] Competitive Intelligence — no template-client competitor names in charts
   [ ] Analytics Sandbox — Data Catalog items match [CLIENT NAME]'s business
   [ ] All page titles and subtitles reference [CLIENT NAME]
```

---

## STEP 9 — Vercel Production Deployment

> The original guide skipped production deployment. This step is mandatory.

```
We are ready to deploy [CLIENT NAME] Finance360 to production.

PART A — Verify vercel.json
Confirm vercel.json in the project root contains at minimum:
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "headers": [...]
}
WITHOUT these explicit settings, Vercel's GitHub App may restore a stale
build cache and deploy an empty app (causing 404 on every route). Do not
skip this — even if the file already has headers defined.

PART B — Vercel project setup
Run the following (requires Vercel CLI):
1. npx vercel login       (browser auth — complete in browser)
2. npx vercel link --scope [VERCEL-ORG-SLUG] --yes --project [PROJECT-NAME]
   (creates .vercel/project.json — links to project)
   ⚠️ IMPORTANT: `vercel link` requires --scope (your Vercel org/personal account slug)
   and --project (the exact project name as it appears in the Vercel dashboard).
   Without --scope, the CLI may error: "Provide --scope or --team explicitly."
   The `--force` flag is NOT supported by vercel link — omit it.
   Example: npx vercel link --scope eric-merrills-projects --yes --project finance360-bkr
3. cat .vercel/project.json  (note orgId and projectId)
4. npx vercel env ls production   (verify all env vars are present)

Required env vars in Vercel project (set at vercel.com dashboard if missing):
- DATABASE_URL            (Neon pooled URL, pgbouncer=true)
- DATABASE_URL_UNPOOLED   (Neon direct URL)
- APP_PASSWORD
- APP_SECRET
- ANTHROPIC_API_KEY

PART C — Set Node.js version
In the Vercel dashboard → Project → Settings → General → Node.js Version:
Set to 20.x (matches package.json "engines" field).
Mismatches between the project setting and engines field can cause subtle
runtime errors.

PART D — Initial production deploy
npx vercel --prod --force

The --force flag bypasses any stale build cache. The first production deploy
must always use --force. Subsequent deploys triggered by GitHub push use
normal builds.

PART E — Verify the deployment
1. Open the production URL Vercel reports
2. Confirm login page loads
3. Log in and navigate to Executive Summary
4. Verify Financial performance chart shows data
5. Check Competitive Intelligence — correct peers, no template-client names
6. Open browser DevTools → Network — confirm API routes return 200
7. Record the production URL in the research folder

PART F — Push to GitHub
git add .
git commit -m "feat: initialize [CLIENT NAME] Finance360 — production ready"
git push origin main

After this push, Vercel's GitHub App will deploy automatically on every
future push to main.
```

---

## STEP 10 — GitHub Actions CI/CD (Optional but recommended)

```
To enable automated deployments triggered by git push (without relying
solely on the Vercel GitHub App), set up the GitHub Actions workflow.

NOTE: The Vercel GitHub App and a GitHub Actions workflow MUST NOT both
deploy to production on push to main — they will race and one will
overwrite the other with a potentially broken build.

Choose ONE of the two paths:

PATH 1 (recommended): Rely on Vercel GitHub App only
- Delete .github/workflows/deploy-vercel.yml if it exists, OR
- Set the workflow trigger to workflow_dispatch only (no push trigger)
- The Vercel GitHub App handles all production deployments automatically

PATH 2: Use GitHub Actions only (requires VERCEL_TOKEN secret)
- Disable the Vercel GitHub App in the Vercel dashboard
  (Project → Settings → Git → Disconnect Git Repository)
- Create .github/workflows/deploy-vercel.yml with:

name: Deploy to Vercel
on:
  push:
    branches: [main]
  workflow_dispatch:
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm install --global vercel@latest
      - run: vercel --prod --yes --token=${{ secrets.VERCEL_TOKEN }}

- Add GitHub secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
  (get VERCEL_TOKEN from vercel.com/account/tokens)
  (get ORG_ID and PROJECT_ID from .vercel/project.json after vercel link)

IMPORTANT: Never run npm run build as a separate step before vercel --prod
in the Actions workflow. Let Vercel's servers build — they have access to
the production env vars via the project settings.
```

---

## STEP 11 — Platform Narrative Pages (Strongly recommended for demos)

> These pages dramatically increase demo credibility for non-technical stakeholders.
> There are now FOUR pages in this step. Three live under the AI section of the navigation; one lives under the Executive section.

```
Add four explanatory/narrative pages. Three live under the AI section of the
navigation; one lives under the Executive section. All four are client-agnostic
in structure but require content updates for [CLIENT NAME]-specific terminology.

─────────────────────────────────────────────────────────────────────
PAGE 1: How AI Works Here (/ai-overview)
─────────────────────────────────────────────────────────────────────
File: app/(protected)/ai-overview/page.tsx

This page contains a SCENARIO SELECTOR in Section 4 ("AI in Action").
Three selectable scenarios demonstrate the agent pipeline end-to-end.
All three scenarios must be replaced with [CLIENT NAME]-relevant examples.

For a new client:
1. Update agent names/descriptions if different capabilities are in scope
2. Update the "Where AI Shows Up" spotlight cards (Section 3) to match
   the actual live pages in [CLIENT NAME]'s instance
3. Update quick-stat numbers (insights count, monitors, etc.) in the hero
4. REPLACE ALL THREE SCENARIOS in the `allScenarios` object:
   - Scenario 1 → a high-impact financial event for [CLIENT NAME]
     (e.g. for banking: credit spread widening; for pharma: pipeline trial
     failure; for airlines: fuel shock; for telecom: churn shock analysis)
   - Scenario 2 → an operational/supply-chain/disruption scenario
     (e.g. for retail: supply chain disruption; for telecom: network outage;
     for banking: counterparty risk event)
   - Scenario 3 → the month-end close & variance escalation scenario
     (this scenario is largely industry-agnostic — update the P&L line names,
     policy thresholds, finance owner titles, and controller name; the
     step structure and escalation workflow are reusable across all clients)
   Each scenario object has: id, label, tagline, triggerIcon, triggerIconColor,
   scenario, trigger (time/who/message), steps[], and outcomes[].
   The step pipeline structure (Team Lead → Gatekeeper → Number Cruncher →
   Watchdog → Storyteller → Team Lead → Dashboards → Alert → Human review)
   is industry-agnostic and can be reused — only the specific content,
   metrics, and outputs need to change.

   NOTE: The scenario selector grid is set to `grid-cols-3` for three scenarios.
   If you add or remove scenarios, update the grid class accordingly.
   The `isHuman` check in the step renderer is a string-includes test on
   agent name — add new human actor names when adding new scenarios.

Add to navigation: lib/navigation-config.ts under the AI section.

─────────────────────────────────────────────────────────────────────
PAGE 2: The Data Foundation (/data-foundation)
─────────────────────────────────────────────────────────────────────
File: app/(protected)/data-foundation/page.tsx

For a new client:
1. Update the "Where [CLIENT NAME] sits today" closing panel
2. Update data type examples to [CLIENT NAME]'s sources
   (e.g., for pharma: clinical trial databases, prescription data,
   payer contracts instead of 10-K/fuel curves/earnings transcripts)
3. Keep maturity stages as-is — they are industry-agnostic
4. Update the "next production builds" callout to reflect [CLIENT NAME]'s
   actual data systems
Add to navigation alongside How AI Works Here.

─────────────────────────────────────────────────────────────────────
PAGE 3: Data Lineage & Source Audit (/data-lineage)
─────────────────────────────────────────────────────────────────────
File: app/(protected)/data-lineage/page.tsx

This page documents the confidence level and source citation of every
major financial figure on the platform (CITED / DERIVED / ESTIMATED /
FIXED). It is essential for demo credibility with CFOs and auditors.
It must be updated for [CLIENT NAME]'s specific data sources.

For a new client:
1. Update the hero stats (cited / derived / estimated / fixed counts)
   to reflect the actual counts for [CLIENT NAME]'s data after seeding.

2. Update the source abbreviation key at the bottom of the page to
   reference [CLIENT NAME]'s actual filings:
   - Replace "10-K FY25", "10-Q Q1-26", "Press-Q1-26", "Trans-Q1-26",
     "JPM-2026", "DecSup-26" with [CLIENT NAME]'s equivalent filing
     abbreviations and dates.

3. Update each table section (A–H) row by row:
   - Values: replace with [CLIENT NAME]'s actual figures
   - Sources: update to [CLIENT NAME]'s filing references
   - Confidence tier: re-evaluate for each metric
     (e.g., if [CLIENT NAME] does not file quarterly segment revenue,
     those rows must be marked ESTIMATED, not CITED)

4. Update Section F ("corrected records") if any pre-seeded test
   data was replaced during your rebadging session. Remove the
   "correction notice" callout entirely if no seed errors were found.
   IMPORTANT: No third-party client names should appear on this page.
   Use only "pre-seeded test data" if referencing any inherited values
   that were incorrect.

5. Update the section subtitles (e.g., "Q1 FY26 Actuals" →
   "[CLIENT NAME]'s most recent quarter") where hardcoded period
   labels would confuse a new viewer.

6. Add to navigation: lib/navigation-config.ts under the AI section,
   positioned between The Data Foundation and AI Search.

─────────────────────────────────────────────────────────────────────
PAGE 4: Financial Close Tracker (/financial-close)
─────────────────────────────────────────────────────────────────────
File: app/(protected)/financial-close/page.tsx
Navigation: Executive section (alongside Executive Summary, Monthly Report, Meeting Hub)

This page is a graphical, annotated process flow diagram for the agentic
month-end close — showing the five-day close cycle as a swimlane view with
day-by-day milestone cards, success criteria checklists, escalation checkpoints,
and human sign-off gates. It functions as both a demo narrative tool and a live
close tracker for finance teams.

Page structure:
- Hero: close period label, progress bar (Day 1–5), KPI bar (6 stats)
- Swimlane diagram: 3 lanes (Agentic / Finance Owners / Controller & CFO)
  × 5 day columns, with clickable activity cards that open a detail panel
- Activity detail panel: who/what/when, success criteria checklist, output block
- Day-by-day expandable accordion: full sequence per day with timing
- Escalation policy reference: 4 threshold trigger types

For a new client:
1. Update the `days[]` array subtitles if the close workflow phases differ
   (e.g., if the client has a 7-day close, expand to Day 1–7)
2. Update `activities[]` — replace:
   - P&L line count (18 lines for Verizon → whatever [CLIENT NAME] reports)
   - Variance policy thresholds ($50M / 5% are VZN defaults — recalibrate)
   - Finance owner titles (Network Ops Finance, Consumer Finance, etc.)
   - Controller/CFO actor names (Jordan Walsh → [CLIENT NAME]'s controller)
   - C-Band / Frontier-specific example commentary → [CLIENT] equivalent
3. Update `closeKPIs[]` values (18 lines reconciled, 4 escalations, etc.)
4. The swimlane structure, status config, and escalation policy card types
   are fully reusable — only the content inside activities[] changes
5. Add to nav: lib/navigation-config.ts under the Executive items array,
   after Meeting Hub

NOTE: This page lives under the Executive section of the nav, NOT AI.
The Financial Close Tracker is a finance-team-facing operational tool;
the AI overview and data lineage pages are IT/leadership-facing explanatory tools.
```

---

## STEP 12 — Handoff Documentation

> Create a complete handoff package before ending the engagement.

```
Create the following documents in "[CLIENT NAME] - Research & Analysis/":

1. "03 - Rebadging Checklist & Agent Handoff.md"
   Sections:
   - Approved decisions (what was locked in during this engagement)
   - Completed work (with file-level detail)
   - Remaining items (with priority)
   - Key data reference table (the 10-15 most important numbers, with sources)
   - Instructions for next agent

2. "04 - Session Checkpoint & Agent Handoff.md"
   - Repository snapshot (last commit SHA)
   - Feature inventory (what was built, where it lives)
   - GitHub + Vercel deployment checklist
   - Where the next agent should start (decision tree by task type)
   - Vercel project IDs, production URL, and env var list

3. "05 - Platform Audit Results.md"
   Already created in Step 7A. Ensure it is up to date with all resolved issues.

These three documents allow any future agent to continue work without
rework or re-discovery. Pass "03 - Rebadging Checklist" to every new
agent as the first file they read.
```

---

## End-of-Session Gotcha Checklist

Run this checklist at the END of every rebadging session, before the first production deploy.

```
[ ] vercel.json has buildCommand, installCommand, and framework fields
[ ] prisma.config.ts uses process.env (not Prisma env()) for datasource URL
[ ] All seed files use deleteMany before createMany for reference data tables
[ ] ensureExecutiveOverviewFinancials always uses seed segments (not DB)
[ ] buildRevenueTrend filters out q.revenue === 0
[ ] All Recharts wrapper components accept and forward width/height props
[ ] COMPETITOR_COLORS map matches DB competitor name strings exactly
    (include alias entries for alternate naming conventions)
[ ] Regional spotlight hardcoded competitor arrays use correct peer names
[ ] Data catalog strings in SandboxClient match new industry terminology
[ ] Benchmarking table hides columns that have no data (no empty "--" columns)
[ ] Navigation labels match client's actual business segment names
[ ] AI system prompt references correct company, industry, and metrics
[ ] Node.js version in Vercel project settings = 20.x
[ ] All env vars present in Vercel: DATABASE_URL, DATABASE_URL_UNPOOLED,
    APP_PASSWORD, APP_SECRET, ANTHROPIC_API_KEY
[ ] First production deploy uses vercel --prod --force (bypasses stale cache)
[ ] Only ONE deployment path to production (GitHub App OR Actions, not both)
[ ] Clean local build passes: rm -rf .next && npm run build (or Remove-Item on Windows)
[ ] Zero template-client strings in app/, components/, lib/, config/
[ ] Zero "JLL", "Cushman", "Office Count", "Property Performance",
    "Fee Revenue Growth", "AUM", "Active Clients", "Average Fee Rate",
    "Deal Cycle", "Service Line Mix", "Office Footprint", "Client Accounts"
    in app/, components/, lib/, config/ (run rg for each)
[ ] Global hex search returns zero matches for source-client brand colors —
    run: rg "#[SOURCE-PRIMARY]|#[SOURCE-DARK]|#[SOURCE-HOVER]|#[SOURCE-TINT]"
    across app/ components/ lib/ config/ app/globals.css (inline Tailwind
    arbitrary values are not caught by name-based string searches)
[ ] lib/scenario-engine.ts FALLBACK_DEFAULTS keys match seeded
    ScenarioLever.externalId values in prisma/seeds/08-scenarios.ts exactly
[ ] lib/scenario-engine.ts segment name strings in calculateImpact() match
    config/clients/[CLIENT-SLUG]/financials.ts scenarioBaseline.segments[].name
    exactly — mismatch causes P&L Impact tab to spin indefinitely (silent 500)
[ ] lib/scenario-engine.ts all delta('lever-id') calls reference new client's
    lever IDs only — source-client IDs silently return 0, not an error
[ ] lib/epm/bridge-data.ts: BRIDGE_PL_LINES and all plLine values use new
    industry P&L line names (no 'Non-Fuel Operating Expenses' or airline lines)
[ ] lib/epm/fiscal-year-data.ts: metric name strings in metrics[] use new
    industry terminology (no 'Fuel & Related Costs', 'Gross Revenue less Fuel')
[ ] lib/epm/pl-forecast-data.ts: REVENUE_DRIVERS, COGS_DRIVERS, OPEX_DRIVERS
    all rebuilt for new industry
[ ] lib/epm/planning-engine.ts: lever category labels and comments use new
    industry terminology
[ ] lib/scenario/external-competitive-signals.ts: all 5 signals fully replaced
    for new industry — no airline/fuel/ASM/corporate travel references remain
[ ] lib/scenario/driver-analytics-model.ts: full CFO driver cascade tree rebuilt
    with new-industry metric labels and mapped to new client's seeded lever IDs
[ ] lib/scenario/driver-analytics-timeseries.ts: ALL entries in SERIES replaced
    with new client's lever IDs and 16-point quarterly values (8 actual + 8 projected)
[ ] lib/scenario/allocation-frontier.ts: LEVER_TO_PILLAR keys, LOWER_IS_IMPROVEMENT
    set, and PILLAR_LABEL values all replaced for new industry
[ ] DriverAnalyticsTab.tsx: useState `expanded` Set and `selectedId` default updated
    to new client's actual tree node IDs and lever IDs (old IDs = blank detail panel)
[ ] components/home/CFOTiles.tsx: `casm`/`asms`/`digital` KPI lookups use
    kpis.primaryKPIs / kpis.secondaryKPIs — NOT kpis.operationalKPIs (field absent
    in non-utility configs → silent undefined → source-client fallback strings displayed)
[ ] HomeClient.tsx sectionSubtitle for "Strategic Execution" section updated to
    new client's strategic themes (separate from CFO tagline — both must change)
[ ] ExecutiveSummaryClient.tsx Revenue tile sub-KPI label (e.g., "Wireless service
    rev. YoY") updated to new industry equivalent
[ ] app/(protected)/business-consoles/[consoleid]/page.tsx exists as a
    catch-all dynamic route — without it, all console detail URLs return 404
    regardless of seed or predicate correctness
[ ] Executive Summary AI Financial Snapshot tiles: all 4 tile hardcoded
    mini-metric bar labels (text-[10px] spans in JSX) are industry-appropriate —
    common holdovers: "Premium Mix", "Completion Factor", "Load Factor",
    "On-Time Performance", "TRASM", "CASM-Ex"
[ ] No Unicode curly/smart quotes (U+2018 ' or U+2019 ') in any .ts/.tsx file
    — SWC rejects them at build time with "Unexpected character" pointing to
    character position. Fix: PowerShell replace [char]0x2018 and [char]0x2019
[ ] Executive Summary financial chart shows data (not blank)
[ ] Competitive Intelligence shows correct peers (not CRE firms)
[ ] Analytics Sandbox data catalog uses industry-appropriate terminology
[ ] Monthly Report → Financial Performance tiles show non-zero actuals AND plan values
    (if tiles show $0 actual with a large plan value, latestQPeriod is resolving
    to a seed-19 forecast period — fix getFinancials per Step 5 item 9)
[ ] getFinancials latestQPeriod uses FinancialStatement.actual > 0 lookup,
    NOT quarterPeriods[last] (which resolves to a seed-19 forecast period)
[ ] quarters array in getFinancials is sliced at latestQPeriod.label
    (prevents seed-19 CRE-era values from appearing in quarterly trend charts)
[ ] Forward Outlook trajectory chart does not repeat the same year's quarters —
    actuals end at lastActualLabel; forecast continues into future years
[ ] forwardOutlook periods in config/clients/[slug]/strategic.ts use the exact
    same label format as DB seed ('Q# FY##' and 'FY##', no other variants)
[ ] forwardOutlook config extends at least 6 quarters beyond last actual period
[ ] Each business console page.tsx consoles.find() predicate matches the seeded
    BusinessConsole's actual segment: and title: values from seed 12
    (mismatch = opsConsole null = page shows previous client's hard-coded tree)
[ ] Seed 19 (extended periods) rewritten for new client — not inheriting
    template project's industry revenue values for FY24 and forecast quarters

[ ] AI Overview (/ai-overview): ALL THREE scenarios in allScenarios replaced
    with [CLIENT NAME]-relevant events — Scenario 1 (financial shock),
    Scenario 2 (operational disruption), Scenario 3 (month-end close);
    actor names/titles updated; spotlight cards (Section 3) point to correct
    live pages; scenario selector grid class matches scenario count (grid-cols-3)
[ ] AI Overview: isHuman check in step renderer includes all human actor names
    for the new client (string-includes test — add any new names to the array)
[ ] AI Overview: ALL THREE scenarios have an analysisSummary block defined —
    if any scenario is missing it, TypeScript will error and the page will not load
[ ] AI Overview: every lucide-react icon name used as a JSX element in page.tsx
    is explicitly listed in the import { ... } from 'lucide-react' statement —
    a single missing icon name causes "Cannot find name 'X'" TypeScript error
    and the entire page becomes unavailable (blank/500)
[ ] Financial Close Tracker (/financial-close): activities[] updated for
    [CLIENT NAME] — P&L line count, variance policy thresholds ($M and %),
    finance owner titles, controller/CFO actor names, and example commentary
    content all reflect the new client's actual close structure
[ ] Financial Close Tracker: closeKPIs[] values updated (lines reconciled,
    escalation count, etc.) and added to lib/navigation-config.ts under
    Executive items (not AI items)
[ ] Financial Close Tracker (and any swimlane/activity-grid page): activity
    detail view implemented as a fixed modal overlay (fixed inset-0 z-50,
    backdrop blur, AnimatePresence) — NOT as an inline panel below the swimlane
    that requires the user to scroll down to see it

── CUSTOM DASHBOARDS (Business Consoles / Custom.tsx) ─────────────────────
[ ] Custom Dashboard widget IDs renamed for new client in ALL THREE locations:
    widgetChartData keys, savedDashboards[].widgets[] string arrays, AND
    availableWidgets[].id — renaming only the display name leaves the old ID
    rendering as the chip label on dashboard cards (ID is split on '-' and
    capitalized to produce the chip text, e.g. 'jll-comparison' → "Jll Comparison")
[ ] Custom Dashboard savedDashboards[].name values updated
    (e.g., 'EMEA Markets Deep Dive' → 'Regional Network Performance')
[ ] Custom Dashboard savedDashboards[].description strings audited and updated —
    these can contain client-specific language (e.g., 'passenger growth', 'AUM
    tracker') that survives every data/config audit
[ ] Custom Dashboard widgetChartData chart label arrays updated — axis labels
    and legend keys inside each widget's data object are purely presentational
    strings that are never caught by a metric-name search
[ ] Custom Dashboard template card text updated
    (e.g., 'pre-built Delta dashboard templates' → 'pre-built [CLIENT] dashboard templates')
    Search: rg "pre-built.*dashboard" app/(protected)/business-consoles

── COMPETITIVE INTELLIGENCE ────────────────────────────────────────────────
[ ] Competitive Intelligence COMPETITOR_COLORS map: ALL source-client entries
    removed — for the airline template this means removing Delta, Alaska Airlines
    (×2 variants), JetBlue (×2 variants) and any other airline entries;
    replace with new client's peer set with exact name-string matches
[ ] Competitive Intelligence Section 6 panels: BOTH static JSX panels fully
    replaced with new-industry equivalents — these panels are hardcoded inline
    data arrays and are NOT caught by any seed/config/DB audit
    Source airline examples: 'Pacific & International Routes', 'Domestic US Market'
    Telecom replacements: '5G & FWA Coverage Leaders', 'National Wireless Competition'
[ ] Competitive Intelligence metric filter strings updated
    (e.g., 'Organic Revenue Growth (%)' → 'Revenue Growth (%)',
           'Fleet Size' → 'Postpaid Subscribers (M)')
[ ] Competitive Intelligence benchmarking table column header 'Carrier' / 'Airline'
    renamed to industry-appropriate equivalent (e.g., 'Operator')
[ ] Competitive Intelligence Section 4 heading updated
    (e.g., 'Fleet Size by Quarter' → 'Postpaid Subscribers by Quarter (M)')
[ ] Competitive Intelligence line chart color/width conditional checks updated
    (e.g., === 'Delta' → === '[CLIENT BRAND NAME]' for strokeWidth and dot size)
[ ] Competitive Intelligence market overview card label updated
    (e.g., 'Delta Market Share' → '[CLIENT] Market Share')

── ANALYTICS SANDBOX (SandboxClient.tsx) ───────────────────────────────────
[ ] Sandbox data connection banner: client slug/source string updated
    (e.g., 'delta.financials.quarterly_results' → 'vzn.financials.quarterly_results')
    — appears in 3 places: header span, footer paragraph, table source text
[ ] Sandbox catalogEntities operational items: all 4 operational catalog items
    replaced with new-industry equivalents (source airline entries:
    Route & Network Performance, TRASM & Yield Trends, Cabin & Revenue Mix,
    Fleet & Capacity Metrics)
[ ] Sandbox customer segment filter label updated
    (e.g., 'Passenger Segments' → 'Customer Segments')
[ ] Sandbox coverage/network filter label updated
    (e.g., 'Hub & Route Coverage' → 'Coverage & Network Footprint')
[ ] Sandbox measureOptions and metricOptions updated for new industry
[ ] Sandbox generateChartData map key updated to match renamed metric option
[ ] Sandbox table column header updated to match renamed metric
[ ] Sandbox hypothesis testing description updated
    (e.g., 'seeded Delta data' → 'seeded [CLIENT] data')
[ ] Sandbox Quick Templates: template labels AND metric references updated
[ ] BridgeTab totalVariance prop: signed number string, NO Math.abs() —
    pass as `totalVariance >= 0 ? \`+${Math.round(totalVariance)}\` : \`${Math.round(totalVariance)}\``
    Math.abs() strips the minus sign → parseFloat("1876") > 0 → favorable
    green color for a $1876M unfavorable variance
[ ] ConsoleDetailClient DB metric strings: variancePercent is null after
    seeding — use parseMetricNum() + computeImpactM() to derive bridge item
    values from current/target string values directly; do NOT use
    m?.variancePercent ?? 0 (silently produces $0M for all bridge items)
[ ] lib/epm/pl-forecast-data.ts: all makeRow() calls use canonical PLLineItem
    type strings only — no backslash-escaped ampersands (\&), no invented
    line names not in the PLLineItem union
[ ] lib/epm/pl-forecast-data.ts: all financial constants recalibrated for
    [CLIENT NAME] — QUARTERLY_REVENUE, COS_PCT (or FUEL_PCT), LABOR_BASE,
    DA_BASE, MAINTENANCE_BASE, TAX_RATE, INTEREST_EXPENSE, SHARES_OUTSTANDING
[ ] Commodity Tracking / Cost Index page: if industry has no spot/hedge price
    data, hedged price Area removed; single cost trend line per category;
    tooltip formatter updated; COGS simulator divisor updated to [CLIENT NAME]'s
    EBITDA or operating expense base (not source client's value)
[ ] Data Lineage page (/data-lineage): all table sections updated with
    [CLIENT NAME]'s actual figures, sources, and confidence tiers;
    source abbreviation key updated to [CLIENT NAME]'s filings;
    Section F ("corrected records") removed or updated to reflect
    any seed corrections made during this engagement
[ ] Data Lineage page contains no third-party client names — any
    reference to inherited/incorrect data uses only "pre-seeded test data"
[ ] Data Lineage hero stats (cited/derived/estimated/fixed counts)
    updated to reflect [CLIENT NAME]'s actual data quality profile

── BRANDING — LOGIN PAGE & PUBLIC ASSETS (NEW IN v2.8) ─────────────────────
[ ] public/logo-white.svg rewritten — contains literal company name as SVG
    <text> or <title> element; this is the text visibly showing on the login
    page background. Verify: rg "Verizon|Delta|Carnival" public/logo-white.svg
[ ] public/logo.svg rewritten for new client (light background variant)
[ ] public/logo-icon.svg rewritten for new client (square icon, 200×200)
[ ] public/favicon.svg rewritten for new client (browser tab, 100×100)
[ ] public/site.webmanifest updated: name, short_name, description,
    theme_color, and background_color all reflect new client — controls PWA
    install screen appearance. Check: rg "Verizon|Delta|#CD040B" public/site.webmanifest
[ ] Login page gradient: open app/(public)/login/page.tsx and search for
    hardcoded hex values inside the linear-gradient style template literal
    (rg "#001848|#002058|#003366|#001F5B" app/).
    These inner gradient stops are NOT caught by the global hex search because
    they are secondary shades, not the primary brand hex. Replace with new
    client's dark brand shades.
[ ] DisclaimerModal and any shared modal/overlay components: search for
    hardcoded legacy brand hex values in bullet dots, dividers, or icon colors
    (rg "#CD040B|#98002E|#E31837|#003366" components/) and replace with
    new client's accent color

── BUSINESS CONSOLES INDEX (NEW IN v2.8) ───────────────────────────────────
[ ] BusinessConsolesClient.tsx titleToSegmentId: ALL source-client console
    title entries removed; ALL new client console titles added with correct
    slug (static page folder name or title-derived slug)
[ ] BusinessConsolesClient.tsx viewableConsoles Set: ALL source-client titles
    removed; new client titles added — missing titles show "Coming Soon" even
    when a detail page exists; stale source-client titles show "Open" and 404
[ ] BusinessConsolesClient.tsx consoleIconMap: new client console titles
    mapped to appropriate lucide-react icons (omitting maps just causes all
    unmapped consoles to show generic BarChart3 — not a 404, but looks unfinished)
[ ] All three data structures updated from the same source: prisma/seeds/12-business-consoles.ts
    consoleDefinitions[].title values — copy/paste titles directly to avoid typos

── EPM TYPE SAFETY (NEW IN v2.8) ────────────────────────────────────────────
[ ] lib/epm/fiscal-year-data.ts FiscalYearMetric.unit values: only
    '$M' | '%' | '$/share' | 'count' are valid — '$B' causes TS build error;
    scale metric values to millions and use '$M' instead
```

---

## Same-Industry Shortcut (Path A)

For the same-industry case, the following steps are significantly lighter:

| Step | Full effort required | Same-industry shortcut |
|---|---|---|
| 1 (Initialize) | Full | Full — vercel.json and prisma.config.ts must still be done |
| 2 (Connections) | Full | Full |
| 3A (Internal research) | Full | Full — different company, different filings |
| 3B (External research) | Full | Lighter — same industry benchmarks, just different peer set |
| 4 (Config/semantic layer) | Full (schema may change) | Lighter — same metric names, update values only |
| 5 (Seed data) | Full | Lighter — same seed structure, update values |
| 6 (Branding) | Full | Full — colors, logo, names |
| 7A (String audit) | Full | Same — run all string searches |
| 7B (Component audit) | Full | **Lighter — metric string names probably unchanged** |
| 8 (Code quality) | Full | Full |
| 9 (Vercel deploy) | Full | Full |
| 10 (CI/CD) | Full | Full |
| 11 — Page 1 (AI Overview) | Full — all 3 industry scenarios required | Lighter — reuse pipeline structure, update scenario content and persona names |
| 11 — Page 2 (Data Foundation) | Full | Lighter — update data type examples only |
| 11 — Page 3 (Data Lineage Audit) | **Full** — all table rows, sources, filing abbreviations | Lighter — same industry, update figures and dates |
| 11 — Page 4 (Financial Close Tracker) | Full — P&L lines, thresholds, actor names | Lighter — same workflow structure; update line counts, thresholds, names |
| 12 (Handoff docs) | Full | Full |

**Specifically skip in Path A** (same industry):
- Industry metric mapping (Step 4, task 7) — industry-specific metrics are already in the schema
- Prisma schema changes (Step 5, task 2) — the QuarterData and KPIConfig fields are the same
- Component metric string audit (Step 7B, task 2) — metric names in components are already industry-specific
- AI Overview scenario types (Step 11) — same scenario concepts apply; update values only

**Do NOT skip in Path A** — these are still fully required:
- Delete-before-create in seeds (a different client still has different segments)
- vercel.json and prisma.config.ts fixes (infrastructure issues, not client-specific)
- Competitor color map update (different peer set, same naming convention issue)
- Clean build validation and --force first deploy
- Data Lineage page values, sources, and filing abbreviations — different company = different figures
- AI Overview scenario trigger names and messages — must reference new client's persona/team
- AI Overview: all THREE scenario actor names/titles updated (including month-end close scenario)
- AI Overview: all THREE scenarios have analysisSummary blocks defined
- AI Overview: lucide-react import verified after any icon additions
- Custom Dashboard: widget ID rename in all three locations (widgetChartData, savedDashboards.widgets, availableWidgets.id)
- Custom Dashboard: savedDashboards descriptions audited for client-specific language
- Competitive Intelligence: COMPETITOR_COLORS cleaned of source-client entries; Section 6 static panels fully replaced
- Sandbox: all string locations audited (catalog items, measure/metric options, segment labels, connection banner, hypothesis description, templates)
- Data Lineage third-party name check — no prior client names may appear on the page
- Financial Close Tracker actor names, owner titles, and controller/CFO name — different company
- Financial Close Tracker and any swimlane/grid page: activity detail as modal overlay, not inline scroll-to panel
- pl-forecast-data.ts financial constants (QUARTERLY_REVENUE, COS_PCT, LABOR_BASE, etc.) —
  different company = different financial profile even in the same industry
- BridgeTab totalVariance sign contract — applies regardless of industry; verify no Math.abs() usage

---

## Quick Reference — Client Details Template

Before starting, gather these for your new client:

| Item | Example | Your Client |
|------|---------|-------------|
| Client full name | British Petroleum p.l.c. | _____________ |
| Client short name | BP | _____________ |
| Ticker symbol | BP | _____________ |
| Client slug (for code) | bp | _____________ |
| GitHub repo URL | github.com/org/bp-finance360 | _____________ |
| Neon DB pooled connection string | postgresql://...?pgbouncer=true | _____________ |
| Neon DB direct connection string | postgresql://... (no pooler) | _____________ |
| App password | (secure string) | _____________ |
| Anthropic API key | sk-ant-... | _____________ |
| Investor relations docs | (list of PDFs placed in folder) | _____________ |
| CEO name | Murray Auchincloss | _____________ |
| CFO name | Kate Thomson | _____________ |
| Fiscal year end | December 31 | _____________ |
| Industry | Integrated Oil & Gas | _____________ |
| Headquarters | London, UK | _____________ |
| Primary brand color | #009900 | _____________ |
| Secondary/accent color | #FFCC00 | _____________ |
| Top 4–6 competitors (with tickers) | Shell (SHEL), ExxonMobil (XOM)... | _____________ |

---

## Appendix: Future Automation Variables

*For future implementation — not required for manual rebadging today.*

A fully automated rebadging script would accept the following variables:

```bash
# Client variables — set these before running
# (Example A: Airline template source)
CLIENT_NAME="Delta Air Lines, Inc."
CLIENT_SHORT="Delta"
CLIENT_SLUG="delta"
CLIENT_TICKER="DAL"
CLIENT_CEO="Ed Bastian"
CLIENT_CFO="Erik S. Snell"
CLIENT_INDUSTRY="Commercial Airlines"
CLIENT_HQ="Atlanta, Georgia"
CLIENT_FISCAL_YEAR_END="December 31"
CLIENT_PRIMARY_COLOR="#003366"
CLIENT_SECONDARY_COLOR="#C01933"
CLIENT_GITHUB_URL="https://github.com/org/delta-finance360"
CLIENT_NEON_POOLED_URL="..."
CLIENT_NEON_DIRECT_URL="..."

# Competitor set (pipe-separated for rg searches)
COMPETITOR_NAMES="United Airlines|American Airlines|Southwest Airlines|Alaska Airlines|JetBlue"

# Industry metric strings — CRE template → Airline (Path B example)
declare -A METRIC_MAP=(
  ["Office Count"]="Fleet Size"
  ["Organic Revenue Growth (%)"]="Revenue Growth (%)"
  ["Fee Revenue Growth"]="Other Revenue Growth"
  ["Net New Offices"]="Net New Routes"
  ["AUM"]="AmEx Remuneration"
  ["Active Clients"]="Active SkyMiles Members"
  ["Average Fee Rate"]="Avg Yield TRASM"
  ["Property Performance"]="Route & Network Performance"
  ["Deal Cycle Metrics"]="Fleet & Capacity Metrics"
  ["Service Line Mix"]="Cabin & Revenue Mix"
  ["Office Footprint"]="Hub & Route Coverage"
  ["Client Accounts"]="SkyMiles Member Accounts"
)

# ── TELECOM TEMPLATE REFERENCE (Verizon — validated v2.6) ──────────────────
# Use this as the reference mapping when rebranding FROM the Verizon/telecom
# template to a new telecom client, or FROM the airline template TO telecom.

# CRE/Airline → Telecom metric string mappings (for Step 7A search & replace)
declare -A METRIC_MAP_TELECOM=(
  # From CRE template
  ["Office Count"]="Postpaid Subscribers (M)"
  ["Organic Revenue Growth (%)"]="Revenue Growth (%)"
  ["Fee Revenue Growth"]="Wireless Revenue Growth"
  ["Net New Offices"]="FWA Net Adds"
  ["AUM"]="Network CapEx"
  ["Active Clients"]="Postpaid Phone Net Adds"
  ["Average Fee Rate"]="ARPA ($)"
  ["Property Performance"]="Network Performance Metrics"
  ["Deal Cycle Metrics"]="Spectrum & CapEx Metrics"
  ["Service Line Mix"]="Subscriber & Churn Analytics"
  ["Office Footprint"]="Coverage & Network Footprint"
  ["Client Accounts"]="Consumer Accounts"
  # From airline template
  ["Fleet Size"]="Postpaid Subscribers (M)"
  ["Fleet Size by Quarter"]="Postpaid Subscribers by Quarter (M)"
  ["Passenger Segments"]="Customer Segments"
  ["Hub & Route Coverage"]="Coverage & Network Footprint"
  ["Route & Network Performance"]="Network Performance Metrics"
  ["TRASM & Yield Trends"]="Wireless Service Revenue Trends"
  ["Cabin & Revenue Mix"]="Subscriber & Churn Analytics"
  ["Fleet & Capacity Metrics"]="Spectrum & CapEx Metrics"
  ["Other Revenue Growth"]="Wireless Revenue Growth"
  ["Net New Routes"]="FWA Net Adds"
  ["Other Rev. Growth"]="Wireless Rev. Growth"
  ["Carrier"]="Operator"  # Competitive benchmarking table column header
)

# Telecom competitor set (Verizon peers — update for new telecom client)
COMPETITOR_NAMES_TELECOM="T-Mobile|AT&T|Comcast|Charter|Dish"

# Custom Dashboard widget IDs — telecom replacements (validated v2.6)
# Old CRE ID          → New telecom ID
# 'jll-comparison'    → 'peer-revenue-comparison'
# 'emea-office-map'   → 'regional-coverage-map'
# 'emea-fee-growth'   → 'regional-rev-growth'
# Remember: rename in widgetChartData keys, savedDashboards[].widgets[], AND availableWidgets[].id
```

**Estimated effort to build the automation:** 2–3 additional agent sessions.  
**Primary dependency:** Cursor Agent SDK for research and code-generation steps.

---

## Appendix: Energy Technology / OFS Industry Reference (Baker Hughes — validated v2.8)

*Use this block when rebranding FROM the Verizon/Telecom template TO an
energy technology, oilfield services, or industrial equipment client.*

```bash
# ── ENERGY TECHNOLOGY / OFS TEMPLATE REFERENCE (Baker Hughes — validated v2.8) ──

# Client variables (BKR as reference)
CLIENT_NAME="Baker Hughes Company"
CLIENT_SHORT="Baker Hughes"
CLIENT_SLUG="bkr"
CLIENT_TICKER="BKR"
CLIENT_CEO="Lorenzo Simonelli"
CLIENT_CFO="Nancy Buese"
CLIENT_INDUSTRY="Energy Technology & Oilfield Services"
CLIENT_HQ="Houston, Texas"
CLIENT_FISCAL_YEAR_END="December 31"
CLIENT_PRIMARY_COLOR="#02BC94"       # Baker Hughes Bright Teal
CLIENT_DARK_COLOR="#05322B"          # Baker Hughes Dark Green
CLIENT_DEEP_TEAL="#018374"           # Baker Hughes Deep Teal (primaryDark)

# BKR segments (two primary reporting segments)
# IET — Industrial & Energy Technology (~50% revenue, higher margin)
#   GTE  Gas Technology Equipment   (LNG compressor trains, turbines)
#   GTS  Gas Technology Services    (LTSAs, field service)
#   CTS  Climate Technology Systems (data center cooling, CCUS)
# OFSE — Oilfield Services & Equipment (~50% revenue)
#   Well construction, completion systems, production (ESP/artificial lift)
#   Subsea pressure systems (SSPS), production chemicals

# Competitor set (BKR peers — energy technology + OFS)
COMPETITOR_NAMES_ENERGY="SLB|Halliburton|GE Vernova|Siemens Energy|TechnipFMC|Weatherford"

# Telecom → Energy Technology metric string mappings (for Step 7A search & replace)
declare -A METRIC_MAP_ENERGY=(
  # From telecom/Verizon template
  ["Postpaid Subscribers (M)"]="IET Remaining Performance Obligations (\$B)"
  ["Wireless Revenue Growth"]="IET Revenue Growth (%)"
  ["FWA Net Adds"]="IET Order Intake (\$M)"
  ["Network CapEx"]="Maintenance CapEx"
  ["Postpaid Phone Net Adds"]="OFSE International Contract Wins"
  ["ARPA (\$)"]="GTE Compressor Revenue (\$M)"
  ["Network Performance Metrics"]="OFSE Field Operations Metrics"
  ["Spectrum & CapEx Metrics"]="IET Backlog & Delivery Metrics"
  ["Subscriber & Churn Analytics"]="Production Technology & Adoption"
  ["Coverage & Network Footprint"]="International Rig Count & Coverage"
  ["Consumer Accounts"]="NOC Customer Accounts"
  ["Operator"]="Company"            # Competitive benchmarking table column header
  # From airline template
  ["Fleet Size"]="IET RPO (\$B)"
  ["Load Factor"]="IET Book-to-Bill"
  ["Completion Factor"]="OFSE SLA Compliance (%)"
  ["On-Time Performance"]="Equipment On-Time Delivery (%)"
  ["TRASM"]="GTE Revenue per Compressor Train"
  ["CASM-Ex"]="OFSE Cost per Rig Day"
)

# Key BKR industry metrics (use these exact strings in seed files and component filters)
BKR_KEY_METRICS=(
  "IET Revenue Growth (%)"
  "IET Book-to-Bill"
  "IET RPO (\$B)"
  "OFSE EBITDA Margin (%)"
  "OFSE International Revenue Growth (%)"
  "GTE Order Intake (\$M)"
  "CTS Revenue Growth YoY (%)"
  "Leucipa Wells Monitored"
  "Leucipa ARR (\$M)"
  "Chart Synergy Run-Rate (\$M)"
  "Free Cash Flow (\$M)"
  "Adjusted EPS"
  "Net Debt / EBITDA"
)

# Custom Dashboard widget IDs — energy sector replacements (validated v2.8)
# Old telecom ID              → New energy ID
# 'peer-revenue-comparison'   → 'iet-ofse-revenue-comparison'
# 'regional-coverage-map'     → 'global-ofs-activity-map'
# 'regional-rev-growth'       → 'segment-rev-growth'
# Remember: rename in widgetChartData keys, savedDashboards[].widgets[], AND availableWidgets[].id

# Business console URL slug mappings (BKR — from BusinessConsolesClient.tsx)
# 'IET Revenue & Orders'                    → 'iet-revenue-orders'       (dynamic [consoleid])
# 'OFSE Field Operations'                   → 'ofse-field-operations'    (dynamic [consoleid])
# 'North America Operations'                → 'north-america-performance' (static page)
# 'Competitive Intelligence'                → 'competitive-intelligence' (dynamic [consoleid])
# 'Strategy Execution'                      → 'strategy-execution'       (static page)
# 'Financial Performance & Capital Allocation' → 'financial-performance-capital-allocation'
# 'Leucipa Digital Customer Engagement'     → 'digital-loyalty'          (static page)
# 'LNG Equipment Backlog & Delivery'        → 'lng-equipment-backlog-delivery'
# 'CTS Data Center Growth'                  → 'cts-data-center-growth'
# 'Chart Industries Synergy Tracker'        → 'chart-industries-synergy-tracker'
# 'OFSE International Market Share'         → 'international-performance' (static page)
# 'Safety & Sustainability Performance'     → 'safety-sustainability-performance'
# 'Manufacturing & Supply Chain Excellence' → 'manufacturing-supply-chain-excellence'
# 'Talent & Workforce'                      → 'talent-workforce'

# BKR login page gradient (correct values — reference for future sessions)
# background: linear-gradient(135deg, #018374 0%, #05322B 40%, #04281F 60%, #018374 100%)
# c.primaryDark = #018374 (Deep Teal), middle stops = BKR dark greens

# Competitive Intelligence competitor colors (BKR peers)
# 'SLB (formerly Schlumberger)' → '#0090D4'  (SLB blue)
# 'Baker Hughes'                → '#02BC94'  (BKR teal)
# 'Halliburton'                 → '#E31837'  (HAL red)
# 'GE Vernova'                  → '#1B6CB7'  (GEV blue)
# 'Siemens Energy'              → '#009999'  (SE teal)
# 'TechnipFMC'                  → '#E8891A'  (FTI orange)
```

---

## What's New in v2.9 — Lessons from the KP & BKR Deployments (May 2026)

> These lessons arose during the Kaiser Permanente (KP) and Baker Hughes production deployments.
> They are incorporated into the relevant steps and checklist above. This section summarizes
> what happened, why, and where in the guide the fixes live.

---

### v2.9 Fix 1: DATABASE_URL Not Resolved at Vercel Runtime

**What happened:** After deploying KP and BKR to Vercel, every page returned
"Something went wrong" (Next.js Server Component error). The root cause was that
Vercel's Neon integration stored the connection string under a prefixed environment
variable name (e.g., `KP_STORAGE_DATABASE_URL`) rather than the canonical `DATABASE_URL`
that Prisma's `schema.prisma env("DATABASE_URL")` expects. PrismaClient initialized
before any route handler ran, found `DATABASE_URL` undefined, and every subsequent
DB call threw `PrismaClientInitializationError`.

**The fix** — add a fallback resolution block at the TOP of `lib/db/prisma.ts`,
BEFORE `new PrismaClient()` is called:

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client'

// Resolve DATABASE_URL from Neon integration prefixed env var names.
// Vercel Neon integration may store the URL under BKR_STORAGE_DATABASE_URL
// or AMEREN_STORAGE_DATABASE_URL rather than plain DATABASE_URL.
if (!process.env.DATABASE_URL) {
  const fallback =
    process.env.[CLIENT_SLUG_UPPER]_STORAGE_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL;
  if (fallback) {
    process.env.DATABASE_URL = fallback;
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
export default prisma
```

**Where to check:** After setting up Vercel and before first deploy, go to the Vercel
project → Settings → Environment Variables and verify which variable name the Neon
integration actually created. The prefixed name depends on the Vercel project name —
it may be `KP_STORAGE_DATABASE_URL`, `AMEREN_STORAGE_DATABASE_URL`, or something
different. Update the fallback chain in `prisma.ts` accordingly.

**Added to:** Step 1 pre-flight (verify prisma.ts fallback), Step 9 Part B (verify env var names
in Vercel), End-of-session checklist.

---

### v2.9 Fix 2: `directUrl` in `schema.prisma` Causes P1012 Build Error

**What happened:** Both KP and BKR schemas included `directUrl = env("DATABASE_URL_UNPOOLED")`
in the `datasource db` block. The `DATABASE_URL_UNPOOLED` env var is NOT set in
Vercel production (only in local `.env` for `prisma migrate`). Prisma's schema
validation runs at build time and fails with `P1012` if any required env var is missing.

**The fix** — remove `directUrl` from `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // directUrl = env("DATABASE_URL_UNPOOLED")  ← REMOVE THIS LINE
}
```

`prisma.config.ts` already handles the unpooled URL correctly via `process.env` (not
Prisma's `env()` function), so `prisma migrate` continues to work locally.

**Added to:** Step 1 item 8 (prisma.config.ts check), End-of-session checklist.

---

### v2.9 Fix 3: Multi-Tenant companyId Locks (Tenant Isolation Artifacts)

**What happened:** When cloning from the BKR template, several repository functions
contained `if (companyId !== 1) { return []; }` early-exit guards. These were
written during initial BKR development when multi-tenancy was being validated.
For any non-BKR client (whose `companyId` is 2 or higher), every page returned
empty data even though the seed was correctly populated. The pages didn't error —
they just showed blank charts and empty tables, making the root cause very hard to find.

**The fix** — search ALL repository files for `companyId === 1` or `companyId !== 1`:

```bash
rg "companyId === 1|companyId !== 1" lib/db/repositories/
```

Remove every `if (companyId !== 1) { return ...; }` guard. These guards should never
exist in the deployed template — they are development artifacts.

**Files that contained this bug:** `lib/db/repositories/financial-merge.ts`,
`lib/db/repositories/strategic.ts`. Other repository files may also be affected
after future template updates — run the rg search after every clone.

**Added to:** Step 5 validation section, End-of-session checklist.

---

### v2.9 Fix 4: Hardcoded Period Label in `executive.ts`

**What happened:** `lib/db/repositories/executive.ts` contained a hardcoded default
period label `'Q4 FY25'` used when looking up data for the executive summary. The KP
database was seeded with period label `'Q1 FY26'` — a mismatch that caused the entire
Executive Summary to render empty (no financial data, no KPIs, blank pillars). No
error was thrown; the query simply returned no rows for the wrong period.

**The fix** — replace every hardcoded period string default with a dynamic lookup:

```typescript
// At the top of executive.ts — run once per function call
async function latestPeriodLabel(companyId: number): Promise<string> {
  const latest = await prisma.fiscalPeriod.findFirst({
    where: { companyId },
    orderBy: [{ year: 'desc' }, { quarter: 'desc' }],
    select: { label: true },
  });
  return latest?.label ?? 'Q1 FY26';
}
```

**Applies to:** Any repository function that accepts a default period label.
Search for hardcoded period strings: `rg "'Q[0-9] FY[0-9][0-9]'" lib/db/repositories/`
Replace all hardcoded defaults with `await latestPeriodLabel(companyId)`.

**Added to:** Step 5 validation section, End-of-session checklist.

---

### v2.9 Fix 5: Module-Level Variable Cache for `activeCompanyId`

**What happened:** The original `getActiveCompanyId()` implementation cached the company
ID in a module-level `let` variable. In Vercel's serverless environment, module-level
state can persist across requests within the same Lambda instance. If a test request
with company ID 1 ran first, subsequent requests for company ID 2 would still receive
the cached value of 1, producing blank data for the correct tenant.

**The fix** — remove the module-level cache entirely. Always query fresh:

```typescript
export async function getActiveCompanyId(): Promise<number> {
  const company = await prisma.company.findFirst({ select: { id: true } });
  return company?.id ?? 1;
}
```

The DB round-trip cost is negligible compared to the debugging cost of a stale cache.
Do not re-introduce module-level caching for tenant-sensitive lookups.

**Added to:** Step 5 validation section, End-of-session checklist.

---

### v2.9 Fix 6: `/api/debug` Diagnostic Route

**What happened:** During the KP deployment, pages showed generic "Something went wrong"
errors with no detail. There was no easy way to test which repository functions were
working and which were failing without deploying debug code.

**The recommendation** — add a protected `/api/debug` route that tests all repository
functions and returns a structured pass/fail report. This lets you diagnose data layer
issues in production without `console.log` noise or code changes.

**Pattern:**

```typescript
// app/api/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import all repository functions

export const dynamic = 'force-dynamic';

async function test(name: string, fn: () => Promise<unknown>) {
  try {
    const result = await fn();
    const summary = Array.isArray(result)
      ? `array(${result.length})`
      : result === null ? 'null'
      : typeof result === 'object' ? `object(${Object.keys(result as object).join(',')})`
      : String(result);
    return { name, ok: true, summary };
  } catch (e: unknown) {
    return { name, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.APP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... test all repository functions
  return NextResponse.json({ passed, failed }, { status: 200 });
}
```

**Usage:** `https://[your-deployment].vercel.app/api/debug?secret=[APP_SECRET]`

The route is protected by `APP_SECRET`. A passing deployment returns all functions
in the `passed` array with summaries like `array(14)` or `object(quarters,segments,...)`.
Any failure includes the error message and stack trace prefix.

**Added to:** Step 9 Part E (verify deployment), End-of-session checklist.

---

### v2.9 Canonical Template Designation

**Effective v2.9:** `baker-hughes.vercel.app` (GitHub: `ericmerrillaccenture/BakerHughes`)
is the **canonical template** for all future Finance360 instances, replacing the prior
Verizon/telecom template. For industrials, energy, utilities, and manufacturing clients,
the BKR codebase is the direct clone source. For other industries (healthcare, financial
services, hospitality, etc.), BKR remains the clone source but a Path B conversion
is required.

**Why BKR and not the prior Verizon template:** The BKR instance includes all v2.8 and
v2.9 fixes (DATABASE_URL fallback, directUrl removed, companyId locks resolved, dynamic
period label, debug route), the four SVG logos, all 14 industry-specific business consoles,
and the full energy-sector semantic layer. The Verizon template predates all of these.

---

### v2.9 End-of-Session Checklist Additions

Add these items to the End-of-Session Gotcha Checklist (after existing entries):

```
── DATABASE CONNECTIVITY (NEW IN v2.9) ──────────────────────────────────────
[ ] lib/db/prisma.ts has DATABASE_URL fallback chain BEFORE new PrismaClient():
    process.env.[CLIENT]_STORAGE_DATABASE_URL || process.env.POSTGRES_URL || ...
    Without this, Vercel Neon integration's prefixed env var name causes
    PrismaClientInitializationError on every route (all pages show error boundary)
[ ] prisma/schema.prisma does NOT have directUrl = env("DATABASE_URL_UNPOOLED")
    — this env var is not set in Vercel production and causes P1012 build failure
[ ] After deploying, run /api/debug?secret=[APP_SECRET] and verify ALL repository
    functions appear in "passed" array with non-null/non-empty summaries
[ ] Vercel project → Settings → Environment Variables: verify the exact name
    of the Neon integration env var (may be [CLIENT]_STORAGE_DATABASE_URL, not
    DATABASE_URL); update prisma.ts fallback chain to match if needed

── MULTI-TENANT DATA ISOLATION (NEW IN v2.9) ────────────────────────────────
[ ] Run: rg "companyId === 1|companyId !== 1" lib/db/repositories/
    Every match is a potential tenant lock that will return empty data for
    any client whose DB company record has id != 1. Remove all such guards.
[ ] getActiveCompanyId() queries DB fresh (no module-level 'let' cache) —
    module-level state can persist across serverless Lambda invocations within
    the same instance; a stale company ID silently returns wrong-tenant data
[ ] lib/db/repositories/executive.ts uses latestPeriodLabel() dynamic lookup
    (not a hardcoded 'Q4 FY25' or similar string) — period label must match
    the actual label in the seeded FiscalPeriod table for the new client
[ ] Run: rg "'Q[0-9] FY[0-9][0-9]'" lib/db/repositories/ to find any
    remaining hardcoded period strings; replace all with dynamic lookups
```

---

## Appendix: Utilities / Regulated Energy Industry Reference (v2.9 — Ameren template)

*Use this block when rebranding FROM the Baker Hughes template TO a regulated electric
or gas utility client. Ameren Corporation (AEE) is the reference client for this sector.*

```bash
# ── UTILITIES / REGULATED ENERGY REFERENCE (Ameren — v2.9) ──────────────────

# Client variables (Ameren as reference — verify against current filings)
CLIENT_NAME="Ameren Corporation"
CLIENT_SHORT="Ameren"
CLIENT_SLUG="ameren"
CLIENT_TICKER="AEE"
CLIENT_CEO="Martin J. Lyons"         # Verify — became CEO 2023
CLIENT_CFO="Michael L. Moehn"        # Verify against current filing
CLIENT_INDUSTRY="Regulated Electric & Gas Utility"
CLIENT_HQ="One Ameren Plaza, 1901 Chouteau Ave, St. Louis, MO 63103"
CLIENT_FISCAL_YEAR_END="December 31"
CLIENT_PRIMARY_COLOR="#0063A7"       # Ameren Blue (verify from brand guide)
CLIENT_SECONDARY_COLOR="#78BE20"     # Ameren Green (sustainability accent)

# Ameren segments (four regulated utility subsidiaries)
# AmerenMO  — Ameren Missouri: electric and gas utility (~60% revenue)
#             Regulated by Missouri Public Service Commission (MOPSC)
# AmerenIED — Ameren Illinois Electric Distribution (~25% revenue)
#             Regulated by Illinois Commerce Commission (ICC)
# AmerenING — Ameren Illinois Natural Gas (~10% revenue)
#             Regulated by ICC
# AmerenTX  — Ameren Transmission (ATXI) — interstate transmission
#             Regulated by FERC; ~5% revenue, higher allowed ROE

# Competitor peer set (Midwest/adjacent regulated utilities)
COMPETITOR_NAMES_UTILITIES="Evergy|WEC Energy Group|Alliant Energy|Entergy|Xcel Energy|Eversource"
# Note: Regulated utilities compete less on market share and more on
# regulatory construct, earned vs. allowed ROE, and rate case outcomes.
# Use these peers for capital markets benchmarking, not operational competition.

# BKR → Ameren metric string mappings (for Step 7A search & replace)
declare -A METRIC_MAP_UTILITIES=(
  # From energy tech / BKR template
  ["IET Revenue Growth (%)"]="Regulated Revenue Growth (%)"
  ["IET Book-to-Bill"]="Capital Expenditure Deployment (%)"
  ["IET RPO (\$B)"]="Regulatory Rate Base (\$B)"
  ["OFSE EBITDA Margin (%)"]="Regulated Utility EBITDA Margin (%)"
  ["OFSE International Revenue Growth (%)"]="Missouri Retail Revenue Growth (%)"
  ["GTE Order Intake (\$M)"]="Capital Projects Approved (\$M)"
  ["Leucipa ARR (\$M)"]="Digital Meter Revenue (\$M)"
  ["Free Cash Flow (\$M)"]="Operating Cash Flow (\$M)"
  ["Net Debt / EBITDA"]="Debt / Capitalization (%)"
  ["IET Remaining Performance Obligations (\$B)"]="Regulatory Rate Base (\$B)"
  ["OFSE Field Operations Metrics"]="Grid Reliability Metrics"
  ["IET Backlog & Delivery Metrics"]="Capital Program Delivery Metrics"
  ["Production Technology & Adoption"]="Smart Grid & AMI Adoption"
  ["International Rig Count & Coverage"]="Service Territory & Customer Count"
  ["NOC Customer Accounts"]="Electric and Gas Customer Accounts"
)

# Key Ameren industry metrics (use these exact strings in seed files and filters)
AMEREN_KEY_METRICS=(
  "Regulated Revenue Growth (%)"
  "Earned ROE (%)"                      # vs. allowed ROE in each jurisdiction
  "Allowed ROE (%)"                     # jurisdiction-specific (MO/IL/FERC)
  "Rate Base (\$B)"                     # total across all four segments
  "Rate Base CAGR (%)"                  # 5-year capital investment compound growth
  "Capital Expenditures (\$M)"
  "O&M Expense / Customer (\$)"        # key efficiency metric
  "SAIDI (minutes)"                     # System Average Interruption Duration Index
  "SAIFI (interruptions)"               # System Average Interruption Frequency Index
  "Customer Satisfaction Score"
  "Clean Energy Capacity (MW)"          # solar, wind, storage
  "EPS (diluted)"
  "Dividend per Share (\$)"
  "Payout Ratio (%)"
)

# Business console mapping: BKR consoles → Ameren equivalents
# 'IET Revenue & Orders'                    → 'Missouri Electric Operations'
# 'OFSE Field Operations'                   → 'Illinois Electric Distribution'
# 'North America Operations'                → 'Illinois Natural Gas'
# 'Competitive Intelligence'                → 'Transmission & Infrastructure'
# 'Strategy Execution'                      → 'Clean Energy Transition'
# 'Financial Performance & Capital Allocation' → 'Capital Program & Rate Base'
# 'Leucipa Digital Customer Engagement'     → 'Customer Experience & Digital'
# 'LNG Equipment Backlog & Delivery'        → 'Grid Modernization'
# 'CTS Data Center Growth'                  → 'Energy Efficiency Programs'
# 'Chart Industries Synergy Tracker'        → 'Regulatory Affairs'
# 'OFSE International Market Share'         → 'Sustainability & ESG'
# 'Safety & Sustainability Performance'     → 'Safety & Compliance'
# 'Manufacturing & Supply Chain Excellence' → 'Supply Chain & O&M'
# 'Talent & Workforce'                      → 'Workforce & Culture'

# Competitive Intelligence competitor colors (Ameren utility peers)
# 'Ameren'          → '#0063A7'  (Ameren Blue)
# 'Evergy'          → '#F7941D'  (Evergy Orange)
# 'WEC Energy Group'→ '#004B87'  (WEC Blue)
# 'Alliant Energy'  → '#E8392E'  (Alliant Red)
# 'Entergy'         → '#007DC5'  (Entergy Blue)
# 'Xcel Energy'     → '#0057A8'  (Xcel Blue)

# Utility-specific industry news RSS sources
# FEEDS = [
#   { label: 'Utility Dive', url: 'https://www.utilitydive.com/feeds/news/' },
#   { label: 'Power Magazine', url: 'https://www.powermag.com/feed/' },
#   { label: 'S&P Global Commodity Insights', url: 'Google News: Ameren energy' },
#   { label: 'RTO Insider', url: 'https://www.rtoinsider.com/feed/' },
# ]

# Path B classification note:
# Even though BKR is also "energy," Baker Hughes (oilfield services & energy tech)
# and Ameren (regulated electric/gas utility) are DIFFERENT subsectors. The BKR
# metrics, console content, competitive framing, and scenario levers do NOT
# directly apply to a regulated utility. Treat this as PATH B:
# — Full metric string replacement required (see mapping above)
# — Full seed rewrite required (different KPIs, P&L structure, segment names)
# — Scenario engine rewrite required (regulatory construct, rate case levers,
#   capital deployment levers — NOT oil price, book-to-bill, or OFS cycles)
# — lib/epm/ full rewrite required (no fuel costs, no field service OMS)
# HOWEVER: code architecture, seed file structure, component architecture,
# and deployment pattern are fully reused. The BKR instance is the best
# starting point — just plan for a full Path B content replacement.
```
