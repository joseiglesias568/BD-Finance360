# Delta Finance360

**AI-Powered Management Reporting Platform for Delta Air Lines**

An enterprise financial intelligence and management reporting demo built with Next.js 14, Prisma, and Claude AI — configured for Delta Air Lines (NYSE: DAL).

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (Neon recommended for serverless)
- Anthropic API key (for AI features)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)

# 3. Push database schema
npx prisma db push

# 4. Seed Delta data
npx prisma db seed

# 5. Start development server
npm run dev
```

Visit **http://localhost:3001**

**Login password:** configured via `APP_PASSWORD` in `.env`

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon or local) |
| `APP_PASSWORD` | Login password for the demo platform |
| `APP_SECRET` | 64-char random hex for JWT session signing |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key for AI features |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide Icons |
| **Database** | PostgreSQL via Prisma ORM |
| **AI** | Anthropic Claude (claude-3-5-sonnet) |
| **Auth** | Cookie-based session (JWT) |
| **Fonts** | Inter (Google Fonts via Next.js) |

---

## Project Structure

```
app/
├── login/                      # Login page
├── executive-summary/          # AI financial snapshot + pillars
├── monthly-report/             # Monthly Operating Report (CEO Scorecard)
├── report-hub/                 # Report library (48 reports)
├── build-presentation/         # AI-powered deck builder
├── business-consoles/
│   ├── north-america-performance/   # Revenue & Margin Performance
│   ├── international-performance/   # International Revenue
│   ├── digital-loyalty/             # Delta Sync & Loyalty
│   ├── store-operations/            # Operations & Reliability
│   └── strategy-execution/          # JPM Value Creation Strategy
├── epm/
│   ├── ml-forecasting/         # 18-Month Rolling Forecast
│   ├── bridge-walks/           # Quarterly Bridge Walk
│   ├── fiscal-year-plan/       # FY26 Plan vs Actuals
│   ├── short-term-planning/    # 0-6 Month Planning
│   ├── long-term-planning/     # 12-36 Month Strategic
│   └── risks-opportunities/    # R&O Waterfall
├── ai-alerts/                  # AI anomaly detection
├── ai-search/                  # Natural language financial search
├── commentary/                 # AI Insights + Human Commentary
├── competitive-intelligence/   # Airline market share
├── commodity-tracking/         # Fuel, SAF, FX indices
├── scenario-modeling/          # What-if P&L modeling
├── month-end-close/            # Close command center
└── sandbox/                    # Data exploration

config/clients/delta/           # Delta-specific configuration
lib/
├── ai/                         # AI system prompt, tools, generators
├── db/repositories/            # Database query layer
├── epm/                        # EPM data (forecast, bridge, fiscal year)
└── engines/                    # Commentary aggregation, scenario engine
prisma/
├── schema.prisma               # Database schema
└── seeds/                      # 38 seed files (~8,000+ records)
```

---

## Data Sources

All financial data is sourced from Delta Air Lines public disclosures:

- **Form 10-K FY2025** (filed Feb 10, 2026) — full-year actuals
- **Form 10-Q Q1 2026** (filed Apr 8, 2026) — Q1 FY26 actuals
- **Q1 2026 Earnings Press Release** (Apr 9, 2026)
- **Q1 2026 Earnings Call Transcript** (Apr 9, 2026)
- **JPM Industrials Conference Deck** (Mar 17, 2026) — value creation framework
- **December Quarter Supplemental** (Jan 13, 2026) — segment reporting

**Key metrics seeded:**
- FY2025: $63.4B revenue, $4.6B FCF, 12.0% ROIC, $7.66 GAAP EPS
- Q1 FY26: $15.854B revenue, $14.2B adj, 4.6% adj margin, $0.64 adj EPS
- 35 narrative commentary entries covering Q1 FY25–FY2026 outlook
- 25 operational anomaly detections (Q1 FY26 window)
- 5 competitor profiles (UAL, AAL, LUV, AS, B6)
- 8 route/network clusters × 5 quarters
- 25 Delta-specific elasticity/sensitivity factors

---

## Key Features

### Executive Dashboard
AI-generated financial snapshot with Delta-specific KPIs, business pillar health, critical actions, and forward insights.

### Monthly Operating Report
CEO Scorecard with live data: $15.854B revenue, 4.6% adj operating margin, #1 OTP, $8.2B AmEx remuneration path to $10B.

### Business Consoles (5 active)
Driver-tree analytics for Revenue & Margin, International, Digital & Loyalty, Operations & Reliability, and Strategy Execution. Each console includes Overview, Business Drivers, Variance Analysis, and Standard Trends tabs.

### EPM Suite
18-month rolling P&L forecast with ML confidence intervals, quarterly bridge walks (Delta-specific drivers: Premium Revenue, TechOps MRO, TRASM, FX), fiscal year plan vs actuals, R&O waterfall.

### AI Features
- **AI Alerts**: 18 configured alert templates (Premium Revenue Decline, CASM-Ex Above Threshold, Network Load Factor, etc.)
- **AI Search**: Natural language queries against Delta financial data
- **Commentary**: 845 AI insights + 364 human commentary entries, all Delta-specific

### Scenario Modeling
What-if P&L modeling with Delta levers: AmEx Remuneration, ASM Capacity, CASM-Ex, Completion Factor, Corporate Sales Growth, Fuel Price.

---

## Running the Seed

```bash
npx prisma db seed
```

Seeds ~8,000+ records across 78 database models including:
- Company profile (Delta Air Lines, Inc. / DAL)
- 5 fiscal periods (Q1 FY25 – Q1 FY26)
- 8 Delta business segments + 4 legacy compatibility aliases
- 35 expanded commentary entries with executive attribution
- 25 anomaly detections (Q1 FY26)
- 48 personalized insights
- 783 AI-generated insights
- 318 generated commentary entries
- Strategy execution: 5 JPM Value Creation Framework pillars × 4 KPIs × 3 quarters

---

## Build & Deploy

```bash
# Production build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

**Deployment:** Optimized for Vercel. Set all environment variables in the Vercel project settings. Ensure `DATABASE_URL` points to a Neon (or other serverless-compatible PostgreSQL) instance.

---

## Known Limitations & Roadmap

| Item | Notes |
|---|---|
| **Logo assets** | `public/logo.svg` is the official Delta Widget+wordmark. `public/logo-white.svg` is the white variant. |
| **Brand colors** | Delta Blue (#003366) and Delta Red (#C01933) are wired in. The app renders primarily in Delta Blue; the legacy green CSS variables have been updated. |
| **Estimated data** | Some financial projections (Q2-Q4 FY26, FY27) are derived from guidance and analyst consensus. Q1-Q4 FY25 and Q1 FY26 are from cited public filings. |
| **Segment aliases** | 4 legacy segment aliases ("Advisory Services", "Building Operations & Experience") persist in the DB for schema compatibility; visible in the Executive Summary segment legend. |
| **AI Search timeout** | The `/ai-search` page may be slow to initially load due to AI context initialization. |
| **EPM Fiscal Year Plan** | YTD data reads from DB financial statements; verify scale on first run after seed. |

---

## Provenance Tagging

All seed files and config follow the approved provenance notation:

```ts
// [CITED:10K-FY25]    — Delta FY2025 Form 10-K
// [CITED:10Q-Q1-26]   — Delta Q1 2026 Form 10-Q
// [CITED:JPM-2026]    — Delta JPM Industrials Conference (Mar 17, 2026)
// [DERIVED]           — Computed from cited values
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter
```

---

## License

Proprietary — built by Accenture for demonstration to Delta Air Lines, Inc.

© 2026 Delta Air Lines, Inc. All rights reserved.
