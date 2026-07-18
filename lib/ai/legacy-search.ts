import type { AIResponse } from './search-types';

// ── AI Response Generator ──────────────────────────────────────────────────────

/**
 * @deprecated Use the AI Chat panel (/api/chat) powered by Vercel AI SDK instead.
 * This function returns hardcoded responses and will be removed in a future release.
 * The AI Chat panel provides real-time, context-aware responses from the database.
 */
export const generateAIResponse = (query: string): AIResponse => {
    const lowerQuery = query.toLowerCase();

    // Market share related queries
    if (lowerQuery.includes('market share') || lowerQuery.includes('losing share')) {
        return {
            summary: "BD Care Benefits/Illinois service territory market position, rate base $28.8B consolidated; stable amid regulated utility peer competition",
            keyFindings: [
                {
                    title: "Primary Driver: WEC Energy Wisconsin Expansion",
                    detail: "WEC Energy expanding Wisconsin rate base, Evergy growing Kansas/Missouri grid — putting competitive pressure on regulatory positioning in Midwest utility markets",
                    confidence: 94
                },
                {
                    title: "Regional Impact",
                    detail: "Missouri service territory showing strongest load growth (+4.1% kWh YoY), while Illinois electric and gas segments remain stable with ATXI transmission growing share",
                    confidence: 92
                },
                {
                    title: "Missouri Rate Base Leadership",
                    detail: "BD leads in Missouri data center ESA contracts (2.2 GW binding, 4.25 GW pipeline) — rate base market share growing vs Evergy in Missouri corridor",
                    confidence: 88
                }
            ],
            visualizations: {
                marketShareTrend: {
                    type: 'line',
                    title: 'Missouri Rate Base Growth Trend (12 Months)',
                    data: [
                        { month: 'Jan', value: 27.8, benchmark: 28.0 },
                        { month: 'Feb', value: 27.9, benchmark: 28.0 },
                        { month: 'Mar', value: 28.0, benchmark: 28.1 },
                        { month: 'Apr', value: 28.1, benchmark: 28.2 },
                        { month: 'May', value: 28.2, benchmark: 28.3 },
                        { month: 'Jun', value: 28.3, benchmark: 28.4 },
                        { month: 'Jul', value: 28.4, benchmark: 28.5 },
                        { month: 'Aug', value: 28.5, benchmark: 28.6 },
                        { month: 'Sep', value: 28.6, benchmark: 28.7 },
                        { month: 'Oct', value: 28.7, benchmark: 28.8 },
                        { month: 'Nov', value: 28.8, benchmark: 28.9 },
                        { month: 'Dec', value: 28.8, benchmark: 28.9 }
                    ]
                },
                regionalBreakdown: {
                    type: 'bar',
                    title: 'Segment Organic Revenue Growth',
                    data: [
                        { region: 'Missouri Electric', change: 4.2, share: 50 },
                        { region: 'Illinois Electric', change: 2.1, share: 24 },
                        { region: 'Illinois Gas', change: 3.8, share: 17 },
                        { region: 'ATXI Transmission', change: 5.8, share: 9 }
                    ]
                },
                competitorAnalysis: {
                    type: 'pie',
                    title: 'Midwest Utility Rate Base Market Attribution',
                    data: [
                        { name: 'WEC Energy Expansion', value: 45, color: '#ef4444' },
                        { name: 'Evergy Growth', value: 25, color: '#f59e0b' },
                        { name: 'PPL Corp Expansion', value: 15, color: '#eab308' },
                        { name: 'Eversource & Other', value: 15, color: '#84cc16' }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Market & Competitive",
                    drivers: ["Missouri Rate Base Leadership", "ESA Load Renewals", "ATXI Transmission Orders"],
                    impact: "High"
                },
                {
                    category: "Competitive",
                    drivers: ["WEC Energy Rate Base Growth", "Evergy Missouri Presence", "Xcel Energy Expansion"],
                    impact: "Medium"
                }
            ],
            recommendations: [
                "Defend Missouri load share through ESA renewals and Finance360 digital differentiation",
                "Accelerate ESA data center contract signings to revenue ahead of grid capacity constraints",
                "Leverage Missouri rate base CAGR (13.6%) in PISA-supported regulatory positioning",
                "Target ATXI transmission expansion synergies to create unique grid + generation bundling"
            ],
            dataSource: "Fin360 Data Platform + Market Intelligence",
            lastUpdated: "Real-time analysis",
            dataQuality: {
                completeness: 98,
                accuracy: 95,
                timeliness: 100,
                methodology: "Combines internal performance data with third-party utility market research"
            }
        };
    }

    // Capital markets / investment / orders queries
    else if (lowerQuery.includes('capital markets') || lowerQuery.includes('orders') || lowerQuery.includes('backlog') || lowerQuery.includes('rpo')) {
        return {
            summary: "BD Care Benefits revenue $1,087M, Illinois revenue $519M, ATXI $196M; total Q1 FY26 revenue $2,176M; Missouri rate base growth tracking 13.6% CAGR in Q1 2026",
            keyFindings: [
                {
                    title: "ESA Data Center Contract Surge",
                    detail: "ESA contracted load 2.2 GW binding in Q1 2026, 4.25 GW pipeline — AI data center demand for grid-scale power is the primary driver; each 1 GW ≈ +$280M Missouri revenue",
                    confidence: 96
                },
                {
                    title: "Missouri Rate Base Growth Tracking 13.6% CAGR",
                    detail: "Missouri rate base growth tracking 13.6% CAGR in Q1 2026 signals strong future revenue recognition — PISA 85% deferral and PPRA fuel cost protection underpin growth",
                    confidence: 94
                },
                {
                    title: "Missouri Rate Case Pipeline",
                    detail: "Rate case $446M filed; PISA supports infrastructure investment recovery — each approved rate case increment adds sustained revenue to the Missouri base",
                    confidence: 91
                }
            ],
            visualizations: {
                coldMixProgress: {
                    type: 'gauge',
                    title: 'Missouri Rate Base CAGR',
                    data: {
                        current: 13.6,
                        target: 12.0,
                        benchmark: 13.0
                    }
                },
                categoryBreakdown: {
                    type: 'bar',
                    title: 'Revenue by Segment (Q1 FY26)',
                    data: [
                        { segment: 'Missouri Electric', coverage: 85, demand: 90 },
                        { segment: 'Illinois Electric', coverage: 92, demand: 95 },
                        { segment: 'Illinois Gas', coverage: 78, demand: 82 },
                        { segment: 'ATXI Transmission', coverage: 65, demand: 72 }
                    ]
                },
                daypartGrowth: {
                    type: 'comparison',
                    title: 'Revenue by Segment (Q1 FY26)',
                    data: [
                        { company: 'Missouri Electric', stations: 1087, growth: '+4.1%' },
                        { company: 'Illinois Electric & Gas', stations: 519, growth: '+2.1%' },
                        { company: 'ATXI Transmission', stations: 196, growth: '+5.8%' },
                        { company: 'Total AEE', stations: 2176, growth: '+3.5%' }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Missouri Rate Base Growth",
                    drivers: ["ESA Data Center Contracts", "Missouri kWh Load Growth", "PISA Infrastructure Recovery"],
                    impact: "Critical"
                },
                {
                    category: "Consolidated Rate Base",
                    drivers: ["ATXI Transmission Expansion", "Illinois Grid Modernization", "Rate Case Settlement"],
                    impact: "High"
                }
            ],
            recommendations: [
                "Resolve grid interconnection constraints to convert record ESA pipeline to contracted load",
                "Prioritize Missouri rate case monitoring — every $446M increment supports rate base growth",
                "Accelerate ATXI transmission revenue recognition through proactive FERC project execution",
                "Develop Illinois grid modernization roadmap to bundle electric and gas segment investment"
            ],
            dataSource: "AEE Form 10-Q Q1 2026 + Earnings Supplement",
            lastUpdated: "Updated 2 hours ago",
            dataQuality: {
                completeness: 96,
                accuracy: 94,
                timeliness: 95,
                methodology: "Direct from AEE investor relations and SEC filings"
            }
        };
    }

    // Natural gas / commodity / kWh growth queries
    else if (lowerQuery.includes('natural gas') || lowerQuery.includes('gas price') || lowerQuery.includes('commodity') || lowerQuery.includes('kwh growth')) {
        return {
            summary: "Natural gas spot $2.80/MMBtu in Q2 2026; Missouri kWh growth +4.1% YoY supporting revenue; PPRA fuel cost protection limits downside; utility revenue has ~12-month ramp from ESA signings",
            keyFindings: [
                {
                    title: "Natural Gas Price Environment",
                    detail: "Natural gas spot ~$2.80/MMBtu supports Missouri generation cost recovery above PPRA threshold — FERC regulatory protection and fuel clause provide revenue floor",
                    confidence: 89
                },
                {
                    title: "Missouri vs Illinois Load Divergence",
                    detail: "Missouri kWh growth +4.1% YoY (Q1 2026 avg) vs Illinois load growth +1.2% YoY — ESA data center contracts make Missouri load growth the primary revenue driver",
                    confidence: 92
                },
                {
                    title: "ESA Revenue Sensitivity",
                    detail: "Each +1 GW ESA contracted ≈ +$280M Missouri annual revenue with ~12-month ramp; below-threshold kWh growth triggers rate case relief through PISA deferral mechanism",
                    confidence: 87
                }
            ],
            visualizations: {
                commodityTrend: {
                    type: 'line',
                    title: 'Natural Gas Spot vs Missouri kWh Growth',
                    data: [
                        { month: 'Jan', value: 2.95, benchmark: 3.8 },
                        { month: 'Feb', value: 2.88, benchmark: 4.0 },
                        { month: 'Mar', value: 2.80, benchmark: 4.1 },
                        { month: 'Apr', value: 2.75, benchmark: 4.2 },
                        { month: 'May', value: 2.78, benchmark: 4.3 },
                        { month: 'Jun', value: 2.82, benchmark: 4.4 }
                    ]
                },
                costBreakdown: {
                    type: 'bar',
                    title: 'Revenue Sensitivity by Segment',
                    data: [
                        { region: 'Missouri Electric', change: 4.1, share: 50 },
                        { region: 'Illinois Electric', change: 1.2, share: 24 },
                        { region: 'Illinois Gas', change: 3.2, share: 17 },
                        { region: 'ATXI Transmission', change: 5.8, share: 9 }
                    ]
                },
                hedgingCoverage: {
                    type: 'pie',
                    title: 'Revenue by Segment (Q1 FY26)',
                    data: [
                        { name: 'Missouri Electric', value: 50, color: '#003087' },
                        { name: 'Illinois Electric', value: 24, color: '#f59e0b' },
                        { name: 'Illinois Gas', value: 17, color: '#10b981' },
                        { name: 'ATXI Transmission', value: 9, color: '#3b82f6' }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Market Environment",
                    drivers: ["Natural Gas Spot Price", "Missouri kWh Growth", "Data Center Load Additions"],
                    impact: "Critical"
                },
                {
                    category: "Missouri Performance",
                    drivers: ["ESA Contract Ramp", "Rate Case Recovery", "PPRA Fuel Protection"],
                    impact: "High"
                }
            ],
            recommendations: [
                "Maintain Missouri rate case downside scenario at 70% settlement for Board risk committee",
                "Accelerate Illinois Electric load recovery strategy — management guides H2 2026 improvement",
                "Develop PPRA analysis for natural gas price impact on Missouri revenue and EBITDA",
                "Monitor FERC transmission decisions as primary rate base floor mechanism"
            ],
            dataSource: "EIA Natural Gas Data + AEE Missouri Revenue Sensitivity Analysis",
            lastUpdated: "Real-time monitoring",
            dataQuality: {
                completeness: 94,
                accuracy: 93,
                timeliness: 100,
                methodology: "EIA commodity data combined with AEE Missouri revenue sensitivity model"
            }
        };
    }

    // Financial Performance queries
    else if (lowerQuery.includes('ebit') || lowerQuery.includes('margin') || lowerQuery.includes('profitability')) {
        return {
            summary: "BD Adj. EBITDA margin ~34% in Q1 2026 — Missouri margin ~35%, Illinois Electric & Gas margin ~22%; FY2026 EPS guidance $5.25–$5.45",
            keyFindings: [
                {
                    title: "Missouri Margin Leading",
                    detail: "Missouri EBITDA margin ~35% in Q1 2026 — driven by rate base growth and ESA data center load; rate case PISA deferral target ≥85% recovery",
                    confidence: 96
                },
                {
                    title: "Illinois Margin Gap to Missouri",
                    detail: "Illinois Electric & Gas EBITDA margin ~22% vs Missouri benchmark ~35% — regulatory lag and multi-year rate case timing are the primary headwinds; FY2026 target improvement",
                    confidence: 94
                },
                {
                    title: "Consolidated EPS Expansion Path",
                    detail: "Missouri mix shift to 50% of consolidated revenue is the structural EPS expansion driver — ESA data center revenue additions expected to sustain EPS growth $5.25–$5.45 guidance",
                    confidence: 91
                }
            ],
            visualizations: {
                marginWaterfall: {
                    type: 'waterfall',
                    title: 'Adj. EBITDA Margin Bridge YoY (Q1 FY26 vs Q1 FY25)',
                    data: [
                        { category: 'Prior Year', value: 32.5 },
                        { category: 'Missouri Revenue Growth', value: 1.2 },
                        { category: 'ESA Load Mix Shift', value: 0.8 },
                        { category: 'ATXI Margin Expansion', value: 0.3 },
                        { category: 'Illinois Regulatory Lag', value: -0.4 },
                        { category: 'O&M Increases', value: -0.2 },
                        { category: 'Other', value: -0.2 },
                        { category: 'Current Year', value: 34.0 }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Financial Performance",
                    drivers: ["Missouri Revenue Mix", "Illinois O&M Reduction", "ATXI Operating Leverage"],
                    impact: "High"
                }
            ],
            recommendations: [
                "Close Illinois margin gap through accelerated grid modernization rate case filings",
                "Drive Missouri margin toward target via ESA/data center load mix improvement",
                "Quantify post-rate-case consolidated EBITDA margin trajectory for investor communications",
                "Bridge GAAP EPS vs Adj. EPS each quarter — Q1 FY26 reported $1.18 beat consensus"
            ],
            dataSource: "AEE Q1 2026 Non-GAAP Financial Reporting",
            lastUpdated: "Real-time",
            dataQuality: {
                completeness: 99,
                accuracy: 97,
                timeliness: 100,
                methodology: "Automated financial consolidation with daily updates from ERP"
            }
        };
    }

    // Cash Flow queries
    else if (lowerQuery.includes('cash') || lowerQuery.includes('liquidity') || lowerQuery.includes('working capital') || lowerQuery.includes('fcf')) {
        return {
            summary: "BD FFO/debt 16–17% target; FY2026 EPS guidance $5.25–$5.45; rate base capital program supports regulated utility cash generation; FFO/debt is the primary credit metric anchor",
            keyFindings: [
                {
                    title: "FFO/Debt Generation",
                    detail: "FFO/debt 16–17% target in FY2026 — regulated utility cash generation anchored by Missouri rate base CAGR 13.6%; capex program $28.8B rate base supports sustained FFO",
                    confidence: 93
                },
                {
                    title: "Capital Program Financing",
                    detail: "Multi-year capital program financed through equity issuance and regulated debt — each rate case settlement provides additional revenue to service incremental capex",
                    confidence: 95
                },
                {
                    title: "Credit Metric Maintenance Path",
                    detail: "FFO/debt 16–17% vs Moody's threshold; Missouri rate case $446M + PISA deferral + ESA revenue additions = path to sustained investment-grade credit metrics",
                    confidence: 90
                }
            ],
            visualizations: {
                cashFlowTrend: {
                    type: 'bar',
                    title: 'Quarterly Operating Cash Flow ($M) — AEE FY2026',
                    data: [
                        { quarter: 'Q1 FY26', operating: 520, capex: -380, free: 140 },
                        { quarter: 'Q2 FY26E', operating: 680, capex: -390, free: 290 },
                        { quarter: 'Q3 FY26E', operating: 750, capex: -400, free: 350 },
                        { quarter: 'Q4 FY26E', operating: 810, capex: -410, free: 400 }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Cash Management",
                    drivers: ["Adj. EBITDA Generation", "Rate Case Recovery", "ESA Revenue Ramp"],
                    impact: "Critical"
                }
            ],
            recommendations: [
                "Model quarterly FCF bridge: Adj. EBITDA → working capital → capex → interest expense → FCF",
                "Prioritize Missouri rate case settlement timing as primary credit metric catalyst",
                "Maintain dividend growth consistent with EPS $5.25–$5.45 guidance and FFO/debt 16–17% target",
                "Track ESA data center revenue ramp vs capex program to determine FCF inflection point"
            ],
            dataSource: "AEE Treasury Management + Q1 2026 Cash Flow Statement",
            lastUpdated: "Daily close",
            dataQuality: {
                completeness: 98,
                accuracy: 97,
                timeliness: 100,
                methodology: "Real-time cash positioning with daily bank reconciliation"
            }
        };
    }

    // Operational Excellence queries
    else if (lowerQuery.includes('quality') || lowerQuery.includes('operations') || lowerQuery.includes('efficiency')) {
        return {
            summary: "BD operational execution improving — utility O&M savings program underway, Missouri electric delivery efficiency gaining leverage, AMI smart meter platform expanding digital grid scale",
            keyFindings: [
                {
                    title: "Missouri Delivery Execution",
                    detail: "Missouri EBITDA margin ~35% in Q1 2026 — electric grid and generation efficiency driving operating leverage on +4.1% kWh growth",
                    confidence: 94
                },
                {
                    title: "Utility O&M Savings Program",
                    detail: "O&M efficiency program targeting $80M in annual savings — targeting efficiency improvements to sustain EPS guidance $5.25–$5.45 and FFO/debt 16–17%",
                    confidence: 91
                },
                {
                    title: "AMI Smart Meter Digital Scale",
                    detail: "AMI smart meters deployed across 1.4M+ Missouri and Illinois customers — Finance360 digital platform improving grid operations and demand response efficiency",
                    confidence: 90
                }
            ],
            visualizations: {
                storeEfficiency: {
                    type: 'stacked',
                    title: 'Operational Efficiency Components',
                    data: [
                        { month: 'Jan', availability: 94, performance: 91, quality: 99 },
                        { month: 'Feb', availability: 95, performance: 92, quality: 99 },
                        { month: 'Mar', availability: 96, performance: 93, quality: 99.5 },
                        { month: 'Current', availability: 97, performance: 94, quality: 99.8 }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Operational Excellence",
                    drivers: ["Platform Leverage", "Technology Automation", "Talent Optimization"],
                    impact: "High"
                }
            ],
            recommendations: [
                "Accelerate utility O&M savings to sustain Moody's FFO/debt 16–17% credit metric",
                "Resolve grid interconnection constraints to improve ESA data center delivery execution",
                "Expand AMI smart meter coverage — each 100K additional meters adds recurring efficiency savings",
                "Drive Missouri-to-Illinois revenue ratio improvement — Missouri mix improvement adds margin durability"
            ],
            dataSource: "AEE Operations Analytics + Segment P&L",
            lastUpdated: "Real-time",
            dataQuality: {
                completeness: 97,
                accuracy: 96,
                timeliness: 100,
                methodology: "Real-time operational data from grid service and generation systems"
            }
        };
    }

    // Risk & Compliance queries
    else if (lowerQuery.includes('risk') || lowerQuery.includes('compliance') || lowerQuery.includes('audit')) {
        return {
            summary: "BD enterprise risk: 6 active risks monitored — Missouri rate case outcome, ESA grid interconnection constraints, natural gas price volatility, Illinois regulatory lag, FFO/debt credit metric, compliance score 97.8%",
            keyFindings: [
                {
                    title: "Top Risk: Missouri Rate Case Regulatory Outcome",
                    detail: "Missouri rate case $446M filed pending MoPSC approval — partial settlement or denial would significantly impact AEE Missouri revenue and PISA deferral strategy",
                    confidence: 88
                },
                {
                    title: "Natural Gas Price Downside Risk",
                    detail: "Natural gas spike >$4.50/MMBtu would strain Missouri fuel cost recovery with ~1-quarter lag to PPRA adjustment, potentially causing earnings headwind — PPRA protection is the key mitigant",
                    confidence: 92
                },
                {
                    title: "FFO/Debt Credit Metric",
                    detail: "FFO/debt 16–17% target vs Moody's 15% floor — requires disciplined capex program execution and rate case recovery; ESA revenue additions are the upside catalyst",
                    confidence: 90
                }
            ],
            visualizations: {
                riskHeatmap: {
                    type: 'heatmap',
                    title: 'BD Enterprise Risk Matrix (Q2 2026)',
                    data: [
                        { risk: 'Missouri Rate Case Regulatory Risk', impact: 5, likelihood: 2, trend: 'stable' },
                        { risk: 'Natural Gas Price Spike (>$4.50/MMBtu)', impact: 4, likelihood: 3, trend: 'stable' },
                        { risk: 'FFO/Debt Credit Metric ~16%', impact: 4, likelihood: 4, trend: 'improving' },
                        { risk: 'Illinois Regulatory Lag', impact: 3, likelihood: 3, trend: 'improving' },
                        { risk: 'ESA Grid Interconnection Constraints', impact: 3, likelihood: 4, trend: 'stable' }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Risk Management",
                    drivers: ["Rate Case Settlement Risk", "Natural Gas Price Sensitivity", "Credit Metric Management"],
                    impact: "Critical"
                }
            ],
            recommendations: [
                "Develop Missouri rate case contingency plan — include scenario where settlement is 70% of filed $446M",
                "Maintain natural gas >$4.50/MMBtu downside scenario for Board risk committee quarterly review",
                "Align ESA revenue ramp timeline with FFO/debt credit covenant monitoring",
                "Strengthen Illinois regulatory relationship management to accelerate grid modernization recovery"
            ],
            dataSource: "AEE GRC Platform + Enterprise Risk Register",
            lastUpdated: "Weekly risk review",
            dataQuality: {
                completeness: 95,
                accuracy: 93,
                timeliness: 92,
                methodology: "Integrated risk assessment with predictive scenario analytics"
            }
        };
    }

    // Segment / product mix queries
    else if (lowerQuery.includes('product mix') || lowerQuery.includes('segment') || lowerQuery.includes('service line') || lowerQuery.includes('missouri') || lowerQuery.includes('illinois')) {
        return {
            summary: "BD revenue: Missouri Electric 49.9% ($1,087M, +4.1% kWh YoY) and Illinois Electric & Gas 23.9% ($519M, +2.1% YoY) in Q1 2026 — Missouri ESA load growth driving blended margin expansion",
            keyFindings: [
                {
                    title: "Missouri Revenue Composition",
                    detail: "Missouri Q1 2026: Electric revenue $1,087M driven by ESA data center contracts 2.2 GW binding and residential/commercial load growth — ESA fastest-growing revenue category",
                    confidence: 96
                },
                {
                    title: "Illinois Electric & Gas Revenue Composition",
                    detail: "Illinois Electric & Gas Q1 2026: $519M combined — BD Services electric and CVS Pharmacy gas segments; grid modernization rate cases are primary revenue growth driver",
                    confidence: 94
                },
                {
                    title: "Missouri Mix Shift Structural Driver",
                    detail: "Missouri share of AEE revenue growing from 47% (Q1 FY25) to 50% (Q1 FY26) — ESA pipeline 4.25 GW expected to sustain growth; Missouri margin ~35% vs Illinois ~22% drives blended expansion",
                    confidence: 95
                }
            ],
            visualizations: {
                portfolioMix: {
                    type: 'donut',
                    title: 'Revenue by Business Segment (Q1 FY26)',
                    data: [
                        { segment: 'Missouri Electric', value: 50, revenue: '$1,087M' },
                        { segment: 'Illinois Electric & Gas', value: 24, revenue: '$519M' },
                        { segment: 'ATXI Transmission', value: 9, revenue: '$196M' },
                        { segment: 'Other/Corp', value: 17, revenue: '$374M' }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Revenue Mix",
                    drivers: ["Missouri ESA Load Growth", "Illinois Grid Modernization", "ATXI Transmission Expansion"],
                    impact: "High"
                },
                {
                    category: "Margin Impact",
                    drivers: ["Missouri vs Illinois Mix Shift", "ATXI Services Growth", "Utility O&M Savings"],
                    impact: "Critical"
                }
            ],
            recommendations: [
                "Accelerate ESA data center contract conversion to revenue — highest growth revenue category",
                "Drive ATXI transmission revenue as % of consolidated revenue — improves margin durability",
                "Develop combined segment reporting framework highlighting Missouri ESA growth story",
                "Highlight Missouri mix shift as structural blended margin expansion story in investor communications"
            ],
            dataSource: "AEE Segment Reporting + Q1 2026 10-Q",
            lastUpdated: "Weekly refresh",
            dataQuality: {
                completeness: 97,
                accuracy: 96,
                timeliness: 96,
                methodology: "Integrated segment revenue and margin data from financial consolidation"
            }
        };
    }

    // ESA / data center / energy transition queries
    else if (lowerQuery.includes('esa') || lowerQuery.includes('data center') || lowerQuery.includes('transmission') || lowerQuery.includes('atxi') || lowerQuery.includes('energy transition')) {
        return {
            summary: "BD Care Benefits Electric Q1 2026 revenue $1,087M — ESA binding 2.2 GW + pipeline 4.25 GW; ATXI transmission growing +5.8% YoY; Missouri clean energy transition commands leading Midwest utility position",
            keyFindings: [
                {
                    title: "Missouri ESA Data Center Leadership",
                    detail: "Missouri Electric revenue $1,087M in Q1 2026; BD leads Midwest in data center ESA contracts — 2.2 GW binding, 4.25 GW pipeline; each 1 GW ≈ +$280M annual Missouri revenue",
                    confidence: 96
                },
                {
                    title: "ATXI Transmission Revenue Growing",
                    detail: "ATXI transmission revenue $196M (+5.8% YoY) — FERC-regulated transmission investment growing as % of consolidated revenue; target: sustained 8–10% CAGR through grid expansion",
                    confidence: 93
                },
                {
                    title: "Missouri Clean Energy Transition",
                    detail: "Missouri renewable additions + PISA rate mechanism + ESA data center contracts = complete clean energy growth scope — unique competitive position vs WEC Energy and Evergy",
                    confidence: 90
                }
            ],
            visualizations: {
                storeGrowthTrend: {
                    type: 'area',
                    title: 'Missouri Electric Revenue Trend ($M)',
                    data: [
                        { month: 'Q1 FY25', actual: 1044, plan: 1020, capacity: 1100 },
                        { month: 'Q2 FY25', actual: 1055, plan: 1040, capacity: 1120 },
                        { month: 'Q3 FY25', actual: 1065, plan: 1050, capacity: 1130 },
                        { month: 'Q4 FY25', actual: 1072, plan: 1060, capacity: 1150 },
                        { month: 'Q1 FY26', actual: 1087, plan: 1070, capacity: 1180 }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Missouri Electric Revenue",
                    drivers: ["ESA Data Center Pipeline", "ATXI Installed Base Growth", "Rate Case Settlement"],
                    impact: "Critical"
                },
                {
                    category: "Energy Transition",
                    drivers: ["Solar & Wind Additions", "Battery Storage Deployment", "Grid Modernization"],
                    impact: "High"
                }
            ],
            recommendations: [
                "Prioritize ESA data center pipeline conversion — 4.25 GW pipeline represents $1.2B+ potential annual Missouri revenue",
                "Accelerate ATXI transmission penetration of MISO grid — target 10%+ of consolidated AEE revenue",
                "Develop Missouri clean energy integration roadmap for combined solar + grid + storage bundling",
                "Expand energy transition offerings: solar, battery storage, demand response, grid modernization"
            ],
            dataSource: "Missouri Segment P&L + ESA Market Intelligence",
            lastUpdated: "Real-time",
            dataQuality: {
                completeness: 97,
                accuracy: 96,
                timeliness: 100,
                methodology: "Direct from Missouri Electric revenue reporting and ESA contract tracking"
            }
        };
    }

    // Competitor / competitive queries
    else if (lowerQuery.includes('competitor') || lowerQuery.includes('competitive') || lowerQuery.includes('market position') || lowerQuery.includes('wec energy') || lowerQuery.includes('evergy')) {
        return {
            summary: "BD leading Midwest regulated utility with $28.8B consolidated rate base; WEC Energy at $28B rate base; Evergy at $16B; PPL Corp is key multi-state peer",
            keyFindings: [
                {
                    title: "Missouri Rate Base Leadership",
                    detail: "Leading Missouri-Illinois regulated utility with $28.8B consolidated rate base and ESA data center contracts accelerating; Missouri EBITDA margin ~35% vs PPL Corp ~30%",
                    confidence: 94
                },
                {
                    title: "WEC Energy Competition",
                    detail: "WEC Energy at $28B rate base and ~33% EBITDA margin — AEE Illinois margin gap of ~11pp to Missouri is a key strategic priority; WEC expanding Wisconsin grid investment",
                    confidence: 92
                },
                {
                    title: "Competitive Advantages",
                    detail: "BD leads in Missouri data center ESA contracts (2.2 GW binding, 4.25 GW pipeline) and ATXI transmission — Missouri rate base CAGR 13.6% creates unique multi-state regulated growth offering",
                    confidence: 96
                }
            ],
            visualizations: {
                competitiveShare: {
                    type: 'radar',
                    title: 'Competitive Position by Segment (Illustrative)',
                    data: [
                        { segment: 'Missouri Rate Base', companyA: 75, companyB: 15, companyC: 10, companyD: 0 },
                        { segment: 'Data Center ESA', companyA: 55, companyB: 25, companyC: 12, companyD: 8 },
                        { segment: 'Transmission Growth', companyA: 40, companyB: 35, companyC: 20, companyD: 5 },
                        { segment: 'Illinois Grid', companyA: 35, companyB: 30, companyC: 20, companyD: 15 }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Competitive Strategy",
                    drivers: ["Missouri Rate Base Leadership", "ESA Load Defense", "ATXI Transmission Growth"],
                    impact: "High"
                },
                {
                    category: "Market & Demand",
                    drivers: ["Data Center ESA Pipeline", "Missouri kWh Growth Trends", "Grid AI Demand"],
                    impact: "Critical"
                }
            ],
            recommendations: [
                "Defend Missouri rate base leadership through ESA renewals — unique bundled grid + generation offering",
                "Accelerate ESA contract signings to defend Missouri load share vs Evergy and WEC Energy",
                "Differentiate ATXI transmission growth vs Xcel Energy through MISO project delivery speed and reliability",
                "Leverage Finance360 digital platform to increase Missouri customer engagement vs peers"
            ],
            dataSource: "Midwest Utility Market Intelligence + AEE Competitive Analysis",
            lastUpdated: "Weekly",
            dataQuality: {
                completeness: 95,
                accuracy: 93,
                timeliness: 98,
                methodology: "Third-party utility market data combined with internal competitive intelligence"
            }
        };
    }

    // Sustainability & ESG queries
    else if (lowerQuery.includes('sustainability') || lowerQuery.includes('esg') || lowerQuery.includes('carbon') || lowerQuery.includes('renewable') || lowerQuery.includes('clean energy')) {
        return {
            summary: "BD advancing clean energy transition through Missouri solar/wind additions, battery storage, grid modernization, and 2030 emissions reduction targets — ESG embedded in Missouri rate base growth strategy",
            keyFindings: [
                {
                    title: "Missouri Clean Energy Portfolio",
                    detail: "Missouri Clean Energy Plan includes solar, wind, and battery storage additions — clean energy investment growing alongside ESA data center power; each GW of renewable added supports rate base CAGR 13.6%",
                    confidence: 91
                },
                {
                    title: "Grid Modernization & AMI Deployment",
                    detail: "BD AMI smart meter platform deployed across Missouri and Illinois — addresses grid efficiency, demand response, and customer energy management, a growing regulatory and ESG differentiator",
                    confidence: 88
                },
                {
                    title: "Operational Emissions Targets",
                    detail: "BD targeting 50% reduction in Scope 1+2 emissions by 2030 from 2005 baseline — renewable generation additions and coal retirement plan are primary pathways",
                    confidence: 90
                }
            ],
            visualizations: {
                carbonPath: {
                    type: 'pathway',
                    title: 'BD Operational Emissions Reduction Pathway (% of 2005 Baseline)',
                    data: [
                        { year: 2005, emissions: 100, target: 100 },
                        { year: 2015, emissions: 75, target: 78 },
                        { year: 2020, emissions: 62, target: 65 },
                        { year: 2025, emissions: 55, target: 55 },
                        { year: 2028, emissions: 52, target: 52 },
                        { year: 2030, emissions: 50, target: 50 }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "ESG Strategy",
                    drivers: ["Missouri Clean Energy Portfolio", "AMI Grid Modernization", "Coal Retirement Plan"],
                    impact: "High"
                },
                {
                    category: "Customer & Regulatory Value",
                    drivers: ["Renewable Energy Demand", "Clean Energy Rate Cases", "Missouri Customer ESG Goals"],
                    impact: "Critical"
                }
            ],
            recommendations: [
                "Expand Missouri clean energy portfolio: solar, wind, battery storage, demand response",
                "Deploy AMI smart meters across full Missouri and Illinois service territory as grid efficiency differentiator",
                "Develop sustainability-linked KPIs for Missouri rate cases to align with ESA customer ESG targets",
                "Publish clean energy revenue contribution as % of total Missouri revenue to demonstrate strategic progress"
            ],
            dataSource: "AEE ESG Reporting Platform + Missouri Segment Data",
            lastUpdated: "Quarterly",
            dataQuality: {
                completeness: 93,
                accuracy: 94,
                timeliness: 92,
                methodology: "Third-party verified ESG metrics combined with Missouri segment reporting"
            }
        };
    }

    // Digital / technology queries
    else if (lowerQuery.includes('digital') || lowerQuery.includes('technology') || lowerQuery.includes('platform') || lowerQuery.includes('ami') || lowerQuery.includes('smart meter')) {
        return {
            summary: "BD digital grid platform: AMI Smart Meters (1.4M+ customers), Finance360 digital analytics (utility operations), grid condition monitoring — Missouri/Illinois digital differentiation vs WEC Energy and Evergy",
            keyFindings: [
                {
                    title: "AMI Smart Meter Scale",
                    detail: "AMI smart meter platform deployed across 1.4M+ Missouri and Illinois customers — largest AMI deployment in Midwest regulated utility serving ESA data center load management",
                    confidence: 92
                },
                {
                    title: "Finance360 Digital Operations",
                    detail: "Finance360 enables remote grid monitoring and operations analytics — reduces utility O&M costs and improves customer uptime, expanding as a digital operations platform",
                    confidence: 88
                },
                {
                    title: "Grid Condition Monitoring",
                    detail: "Grid asset condition monitoring platform serves Missouri and Illinois transmission/distribution reliability — integrated into ATXI service agreements as a digital upsell",
                    confidence: 90
                }
            ],
            visualizations: {
                digitalGrowth: {
                    type: 'growth',
                    title: 'AMI Smart Meter Platform Customers (000s)',
                    data: [
                        { quarter: 'Q1-25', wellsCovered: 1150, revenue: 180 },
                        { quarter: 'Q2-25', wellsCovered: 1220, revenue: 210 },
                        { quarter: 'Q3-25', wellsCovered: 1290, revenue: 240 },
                        { quarter: 'Q4-25', wellsCovered: 1360, revenue: 270 },
                        { quarter: 'Q1-26', wellsCovered: 1400, revenue: 300 }
                    ]
                }
            },
            relatedDrivers: [
                {
                    category: "Digital Grid",
                    drivers: ["AMI Smart Meter Adoption", "Finance360 Operations Analytics", "Grid IIoT Monitoring"],
                    impact: "High"
                },
                {
                    category: "Missouri Digital",
                    drivers: ["ESA Demand Response Services", "Remote Grid Monitoring", "Predictive Maintenance"],
                    impact: "Critical"
                }
            ],
            recommendations: [
                "Accelerate AMI smart meter deployment — target 2M+ customers to create dominant Missouri/Illinois scale advantage",
                "Bundle Finance360 analytics with Missouri ESA contracts to increase customer engagement and recurring value",
                "Expand grid condition monitoring into ATXI transmission service agreements for digital margin uplift",
                "Develop Finance360 integration showing digital Missouri revenue contribution to CFO dashboard"
            ],
            dataSource: "AEE Digital Technology Platform Analytics",
            lastUpdated: "Real-time",
            dataQuality: {
                completeness: 94,
                accuracy: 92,
                timeliness: 100,
                methodology: "Real-time platform telemetry and AMI customer coverage analytics"
            }
        };
    }

    // Default intelligent response
    else {
        return {
            summary: "I've analyzed your query across Becton, Dickinson and Company Finance360 business intelligence systems. Here are the most relevant insights:",
            keyFindings: [
                {
                    title: "Business Performance",
                    detail: "AEE Q1 FY26: Total revenue $2,176M (+3.5% YoY), Missouri kWh growth +4.1% YoY, Adj. EPS $1.18 (beat consensus), ESA binding 2.2 GW",
                    confidence: 97
                },
                {
                    title: "Missouri Rate Base Strength",
                    detail: "Missouri rate base CAGR 13.6%, ESA pipeline 4.25 GW, rate case $446M filed — ESA data center load (each 1 GW ≈ +$280M revenue) is the headline growth driver",
                    confidence: 95
                },
                {
                    title: "Strategic Milestones",
                    detail: "Rate base $28.8B consolidated; EPS guidance $5.25–$5.45; FFO/debt 16–17%; PISA 85% deferral and PPRA fuel cost protection underpin Missouri rate base CAGR",
                    confidence: 93
                }
            ],
            relatedDrivers: [
                {
                    category: "Multiple Business Consoles",
                    drivers: ["Missouri Performance Console", "Illinois Performance Console", "Financial Performance Console"],
                    impact: "Varies"
                }
            ],
            recommendations: [
                "Review Missouri or Illinois Business Console for segment-specific analysis",
                "Set up alerts for critical AEE KPIs: Missouri rate base CAGR, natural gas spot price, ESA contracted GW",
                "Schedule deep-dive analysis session with CFO (Leonard P. Singh) priorities in mind"
            ],
            dataSource: "Becton, Dickinson and Company Finance360 Integrated Business Intelligence Platform",
            lastUpdated: "Real-time"
        };
    }
};
