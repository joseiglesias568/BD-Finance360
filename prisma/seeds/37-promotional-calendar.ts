import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 37: Becton, Dickinson and Company (BDX) — Commercial & Events Calendar
//
// 16 events spanning CY2025-CY2027 across 6 categories.
//
// Categories:
//   conference_tradeshow      — HIMSS, AAOS, RSNA industry conferences
//   customer_education        — BD University, Pharma Summit, R&D Day
//   regulatory_milestone      — Alaris consent decree, Waters spin-off milestones
//   contract_renewal_season   — GPO/IDN annual contract renewal cycles
//   product_launch            — BD Rowa Pro, GLP-1 capacity, Alaris Plus
//   fiscal_close_commercial   — Q4 FY25/FY26 fiscal year-end commercial push
// =============================================================================

export async function seedPromotionalCalendar(prisma: PrismaClient, companyId: number) {
    console.log('Seeding BD commercial & events calendar...');

    const events = [
        // =====================================================================
        // CY2025 Events
        // =====================================================================
        {
            companyId,
            campaignName: 'HIMSS Annual Conference 2025',
            startDate: new Date('2025-03-09'),
            endDate: new Date('2025-03-13'),
            category: 'conference_tradeshow',
            // BD Connected Care and Alaris infusion intelligence platform showcase;
            // hospital CIO/CMIO engagement; key Alaris customer meetings on consent decree
            // remediation progress and return-to-market timeline.
            revenueImpact: 2.5,       // % from conference-driven pipeline
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'National',
        },
        {
            companyId,
            campaignName: 'BD Pharmaceutical Systems Customer Summit 2025',
            startDate: new Date('2025-04-14'),
            endDate: new Date('2025-04-15'),
            category: 'customer_education',
            // Annual gathering of 85+ biopharmaceutical manufacturer clients; GLP-1 capacity
            // expansion announcement; prefillable syringe technology roadmap; auto-injector
            // platform preview for FY27.
            revenueImpact: 3.8,
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'National',
        },
        {
            companyId,
            campaignName: 'American Academy of Orthopaedic Surgeons (AAOS) 2025',
            startDate: new Date('2025-04-09'),
            endDate: new Date('2025-04-12'),
            category: 'conference_tradeshow',
            // Interventional segment presence; BD vascular access, surgical products;
            // peripheral vascular and electrophysiology portfolio showcase.
            revenueImpact: 1.5,
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'National',
        },
        {
            companyId,
            campaignName: 'BD Alaris Consent Decree Q3 FY25 Milestone Announcement',
            startDate: new Date('2025-06-15'),
            endDate: new Date('2025-06-15'),
            category: 'regulatory_milestone',
            // FDA milestone: 65% remediation complete; investor update on return-to-market timeline;
            // Alaris Plus system clearance submission planned; customer communication on new
            // account approvals resuming.
            revenueImpact: 0.0,       // milestone, not commercial event
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'Corporate',
        },
        {
            companyId,
            campaignName: 'GPO Contract Renewal Season H2 FY25 (Jul-Sep 2025)',
            startDate: new Date('2025-07-01'),
            endDate: new Date('2025-09-30'),
            category: 'contract_renewal_season',
            // Vizient, Premier, HealthTrust, and Intalere GPO annual contract renewals;
            // BD Medical Essentials and Interventional portfolio renewals; target $2.1B+ GPO
            // revenue under agreement through FY28.
            revenueImpact: 4.2,
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'National',
        },
        {
            companyId,
            campaignName: 'BD Rowa Pharmacy Automation Pro Launch — Europe',
            startDate: new Date('2025-06-23'),
            endDate: new Date('2025-06-23'),
            category: 'product_launch',
            // BD Rowa Pro next-generation pharmacy robotics system European launch at Expopharm;
            // 40% faster throughput; new cloud-connected inventory management; targeting 150+ new
            // hospital pharmacy contracts FY26.
            revenueImpact: 2.8,
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'EMEA',
        },
        {
            companyId,
            campaignName: 'RSNA Annual Meeting (Radiology Society of North America)',
            startDate: new Date('2025-12-01'),
            endDate: new Date('2025-12-04'),
            category: 'conference_tradeshow',
            // BD vascular access and interventional radiology portfolio; HemoSphere hemodynamic
            // monitoring; contrast media delivery; Interventional segment customer meetings.
            revenueImpact: 1.2,
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'National',
        },
        {
            companyId,
            campaignName: 'BD FY25 Fiscal Year-End Commercial Push (Aug-Sep 2025)',
            startDate: new Date('2025-08-01'),
            endDate: new Date('2025-09-30'),
            category: 'fiscal_close_commercial',
            // Q4 FY25 fiscal year-end incentive programs; volume purchase commitments from IDN
            // and GPO customers; stocking orders for Medical Essentials and Pharmaceutical Systems;
            // BD strongest quarter Q4.
            revenueImpact: 5.5,
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'National',
        },
        // =====================================================================
        // CY2026 Events
        // =====================================================================
        {
            companyId,
            campaignName: 'Waters Corporation Spin-Off Completion',
            startDate: new Date('2026-02-09'),
            endDate: new Date('2026-02-09'),
            category: 'regulatory_milestone',
            // BD Life Sciences / Waters Corporation separation completed February 9, 2026;
            // BD portfolio refocused on medtech; ~$4B revenue divested; BD investor re-rating
            // as pure-play medical technology company begins.
            revenueImpact: 0.0,
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'Corporate',
        },
        {
            companyId,
            campaignName: 'HIMSS Annual Conference 2026',
            startDate: new Date('2026-03-10'),
            endDate: new Date('2026-03-14'),
            category: 'conference_tradeshow',
            // BD Connected Care platform showcase; Alaris Plus system demonstration (post-consent
            // decree); BD digital health ecosystem; hospital interoperability and medication safety
            // theme; key customer engagement for Alaris new account pipeline.
            revenueImpact: 3.2,
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'National',
        },
        {
            companyId,
            campaignName: 'BD Alaris Consent Decree Resolution Milestone (Q2 FY26)',
            startDate: new Date('2026-03-31'),
            endDate: new Date('2026-03-31'),
            category: 'regulatory_milestone',
            // 78% remediation milestone achieved Q2 FY26; investor and customer communication
            // on full resolution target Q3 FY26; new account approvals accelerating; return-to-
            // full-market volume recovery timeline confirmed.
            revenueImpact: 0.0,
            transactionLift: null,
            ticketLift: null,
            status: 'complete',
            region: 'Corporate',
        },
        {
            companyId,
            campaignName: 'Pharmaceutical Systems GLP-1 Capacity Expansion — New Line Qualification',
            startDate: new Date('2026-04-01'),
            endDate: new Date('2026-04-30'),
            category: 'product_launch',
            // Qualification and first commercial production on new prefillable syringe lines
            // dedicated to GLP-1 drug delivery; $180M capital investment; 450M additional unit
            // capacity annually; major pharma customer supply agreements activated.
            revenueImpact: 6.5,
            transactionLift: null,
            ticketLift: null,
            status: 'in-progress',
            region: 'National',
        },
        {
            companyId,
            campaignName: 'BD R&D Day / Investor Day 2026',
            startDate: new Date('2026-05-14'),
            endDate: new Date('2026-05-14'),
            category: 'customer_education',
            // Annual investor and analyst day; pipeline updates across 4 segments; Alaris next-gen
            // software roadmap; BioPharma Systems 3-year GLP-1 opportunity sizing; Excellence
            // Unleashed progress; FY26-FY28 financial algorithm.
            revenueImpact: 0.0,
            transactionLift: null,
            ticketLift: null,
            status: 'upcoming',
            region: 'Corporate',
        },
        {
            companyId,
            campaignName: 'BD University Clinical Education Series FY26',
            startDate: new Date('2026-04-01'),
            endDate: new Date('2026-06-30'),
            category: 'customer_education',
            // Quarterly BD University in-hospital clinical education programs; Alaris pump
            // operation and safety training; BD Diagnostics specimen collection best practices;
            // PureWick clinical protocol training; >5,000 clinicians reached annually.
            revenueImpact: 1.8,
            transactionLift: null,
            ticketLift: null,
            status: 'in-progress',
            region: 'National',
        },
        {
            companyId,
            campaignName: 'GPO / IDN Contract Renewal Season H2 FY26 (Jul-Sep 2026)',
            startDate: new Date('2026-07-01'),
            endDate: new Date('2026-09-30'),
            category: 'contract_renewal_season',
            // Major GPO and IDN contract renewals for FY27-FY29 term; post-Alaris consent
            // decree resolution enables full portfolio commitments; target multi-year volume
            // guarantees for Medical Essentials and Connected Care.
            revenueImpact: 4.8,
            transactionLift: null,
            ticketLift: null,
            status: 'upcoming',
            region: 'National',
        },
        {
            companyId,
            campaignName: 'BD FY26 Fiscal Year-End Commercial Push (Aug-Sep 2026)',
            startDate: new Date('2026-08-01'),
            endDate: new Date('2026-09-30'),
            category: 'fiscal_close_commercial',
            // Q4 FY26 fiscal year-end push; post-consent decree Alaris system stocking orders;
            // GLP-1 syringe supply pre-commitments from pharma customers; BD strongest seasonal
            // quarter; Excellence Unleashed savings supporting margin.
            revenueImpact: 6.0,
            transactionLift: null,
            ticketLift: null,
            status: 'upcoming',
            region: 'National',
        },
    ];

    const STATUS_MAP: Record<string, string> = {
        'complete': 'completed',
        'in-progress': 'active',
        'upcoming': 'planned',
        'planned': 'planned',
        'active': 'active',
        'completed': 'completed',
    };
    await prisma.promotionalCalendar.createMany({
        data: events.map(e => ({
            ...e,
            startDate: e.startDate instanceof Date ? (e.startDate as Date).toISOString().split('T')[0] : String(e.startDate),
            endDate: e.endDate instanceof Date ? (e.endDate as Date).toISOString().split('T')[0] : String(e.endDate),
            status: STATUS_MAP[e.status] ?? e.status,
        })),
    });
    console.log(`  ✓ ${events.length} PromotionalCalendar (Commercial Events Calendar) records seeded for BD`);
}
