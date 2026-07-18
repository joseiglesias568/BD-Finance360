// Natural-language scenario parser for Becton, Dickinson and Company.
// Outputs lever IDs that match the seeded ScenarioLever table
// (prisma/seeds/08-scenarios.ts) so values flow through /api/scenario into
// lib/scenario-engine.ts without translation.
//
// Lever vocabulary (externalId → unit, range, default):
//   hcb-mbr                       % MBR      [88.0, 94.0]  default 90.5  (lower is better)
//   medical-membership             M members  [24.0, 28.0]  default 26.0  (higher is better)
//   ma-margin-recovery             % margin   [0.0,  4.0]   default 1.5   (higher is better)
//   prior-auth-approval-rate       % PA apvl  [85.0, 99.0]  default 95.0
//   pharmacy-client-price-improvement  $M     [0, 2000]     default 800   (lower is better — headwind)
//   biosimilar-conversion-rate     %          [50, 95]      default 85    (higher is better)
//   pharmacy-claims-volume         B claims   [1.7, 2.0]    default 1.84  (higher is better)
//   glp1-client-coverage-rate      %          [30, 80]      default 50
//   same-store-rx-growth           %          [0.0, 10.0]   default 7.0   (higher is better)
//   pcw-reimbursement-pressure     bps        [-200, 50]    default -80   (less negative is better)
//   interest-rate-10yr-yield       % UST 10yr [3.0, 6.5]    default 4.5   (lower is better)
//   health100-adoption             %          [0, 25]       default 5     (higher is better)

export interface ParsedScenario {
    levers: Record<string, number>;
    explanation: string;
}

const SEMANTIC_GROUPS: Record<string, string[]> = {
    // Medical Benefit Ratio — key HCB profitability metric
    hcbMbr: [
        'medical benefit ratio', 'mbr', 'medical loss ratio', 'mlr',
        'medical costs', 'medical cost', 'medical claims', 'inpatient', 'utilization',
        'hospitalization', 'prior auth', 'claims surge', 'medical trend',
        'adverse development', 'favorable development', 'healthcare utilization',
        'aetna medical', 'hcb medical', 'benefit ratio', 'claims cost',
        'medical inflation', 'cost trend', 'inpatient surge', 'outpatient surge',
    ],

    // Medicare Advantage — margin recovery and CMS rate cycle
    maMargin: [
        'medicare advantage', 'ma margin', 'ma repricing', 'cms rate', 'cms benchmark',
        'star ratings', 'star rating', 'aep', 'annual enrollment period',
        'ma recovery', 'medicare repricing', 'ma segment', 'ma performance',
        'quality bonus', 'risk adjustment', 'ma plan', 'medicare', 'advantage plan',
        'cms', 'ma rate', 'ma growth', 'ma profitability',
    ],

    // Medical Membership — Aetna total covered lives
    medicalMembership: [
        'medical membership', 'membership', 'members', 'enrollment', 'insured lives',
        'covered lives', 'aetna members', 'aetna membership', 'plan enrollment',
        'member growth', 'member loss', 'disenrollment', 'new members',
        'member base', 'total members', 'lives managed',
    ],

    // Prior Authorization — approval rate and care management
    priorAuth: [
        'prior authorization', 'prior auth', 'pa rate', 'authorization rate',
        'pa approval', 'denial rate', 'prior approval', 'care authorization',
        'clinical review', 'auth rate', 'authorization approval', 'pa impact',
    ],

    // Biosimilar adoption — Stelara/Humira conversion for Caremark
    biosimilar: [
        'biosimilar', 'stelara', 'ustekinumab', 'biologic conversion',
        'formulary exclusion', 'biosimilar adoption', 'humira', 'biologic',
        'brand to biosimilar', 'reference biologic', 'biosimilar penetration',
        'caremark formulary', 'specialty formulary', 'adalimumab', 'biosimilar conversion',
        'biologic substitution', 'biosimilar rate',
    ],

    // Pharmacy client pricing — HSS pricing headwind (lower is better)
    pharmacyClientPrice: [
        'pharmacy client', 'client price improvement', 'truecost', 'net cost pbm',
        'pbm pricing', 'rebate', 'rebate pass-through', 'pricing headwind',
        'hss headwind', 'pharmacy pricing', 'client rebate', 'price improvement',
        'pharmacy contract', 'pbm contract', 'client contract price', 'transparent pricing',
    ],

    // Pharmacy claims volume — Caremark total script volume
    pharmacyClaims: [
        'pharmacy claims', 'claims volume', 'prescription claims', 'caremark claims',
        'dispensing volume', 'script volume', 'rx volume', 'pbm volume',
        'total scripts', 'claim count', 'pharmacy volume', 'caremark volume',
    ],

    // GLP-1 employer coverage — obesity drug formulary decisions
    glp1Coverage: [
        'glp-1', 'glp1', 'wegovy', 'ozempic', 'zepbound', 'semaglutide', 'tirzepatide',
        'weight loss', 'obesity', 'anti-obesity', 'glp coverage', 'employer glp',
        'glp-1 coverage', 'glp-1 formulary', 'obesity drug', 'weight management drug',
        'glp-1 employer', 'obesity medication', 'diabetes glp',
    ],

    // PCW same-store Rx growth — retail pharmacy prescription volume
    sameStoreRx: [
        'same store', 'same-store rx', 'prescription growth', 'pcw growth',
        'retail pharmacy growth', 'retail rx', 'store prescriptions', 'rx growth',
        'walgreens', 'rite aid', 'pharmacy store', 'prescription volume',
        'front store', 'pcw prescriptions', 'pharmacy retail', 'cvs pharmacy growth',
        'pcw revenue', 'retail pharmacy', 'store growth', 'pharmacy volume',
    ],

    // PCW reimbursement — generic/brand reimbursement rate pressure
    pcwReimbursement: [
        'reimbursement', 'dir fee', 'generic reimbursement', 'payer negotiation',
        'pharmacy reimbursement', 'mac pricing', 'reimbursement pressure',
        'costvantage', 'pbm terms', 'reimbursement rate', 'drug reimbursement',
        'payer rate', 'pharmacy payer', 'reimbursement headwind', 'payment rate',
    ],

    // Interest rate / leverage — treasury yield and debt cost
    interestRate: [
        'interest rate', 'treasury', 'fed rate', 'borrowing cost', 'leverage',
        'debt cost', 'rate hike', 'rate cut', 'refinancing', 'credit spread',
        'interest expense', 'net leverage', 'debt reduction', 'deleveraging',
        '10-year yield', 'usT yield', 'fed funds', 'monetary policy', 'rate environment',
    ],

    // Health100 / digital / Oak Street — transformation program
    health100: [
        'health100', 'health 100', 'digital health', 'care coordination',
        'integrated health', 'value-based care', 'oak street', 'minuteclinic',
        'digital member', 'health platform', 'pharmacy forward', 'digital platform',
        'health100 adoption', 'member digital', 'care management', 'preventive care',
        'digital engagement', 'healthhub', 'virtual care', 'digital transformation',
    ],
};

const calculateMatchScore = (text: string, groupKey: string): number => {
    const group = SEMANTIC_GROUPS[groupKey];
    if (!group) return 0;
    const lowerText = text.toLowerCase();
    let score = 0;
    group.forEach(term => {
        if (lowerText.includes(term.toLowerCase())) {
            score += term.split(' ').length;
        }
    });
    return score;
};

const extractPercentage = (text: string): number | null => {
    const match = text.match(/(-?\d+(?:\.\d+)?)\s*%/);
    if (match) {
        const value = parseFloat(match[1]);
        if (!isNaN(value)) return value;
    }
    return null;
};

const extractDollarAmount = (text: string): { value: number; unit: 'M' | 'B' } | null => {
    const billionMatch = text.match(/\$\s*(-?\d+(?:\.\d+)?)\s*(?:b|bn|billion)\b/i);
    if (billionMatch) return { value: parseFloat(billionMatch[1]), unit: 'B' };
    const millionMatch = text.match(/\$\s*(-?\d+(?:\.\d+)?)\s*(?:m|mn|million)\b/i);
    if (millionMatch) return { value: parseFloat(millionMatch[1]), unit: 'M' };
    return null;
};

const extractBasisPoints = (text: string): number | null => {
    const bpsMatch = text.match(/(-?\d+(?:\.\d+)?)\s*(?:bps|basis points?)\b/i);
    if (bpsMatch) return parseFloat(bpsMatch[1]);
    return null;
};

const extractCount = (text: string): number | null => {
    const countMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:million|M)\s+(?:members?|lives?|patients?)/i);
    if (countMatch) return parseFloat(countMatch[1]);
    return null;
};

const containsAny = (text: string, keywords: string[]): boolean => {
    const lowerText = text.toLowerCase();
    return keywords.some(kw => lowerText.includes(kw.toLowerCase()));
};

const isIncrease = (text: string): boolean =>
    containsAny(text, ['increase', 'rise', 'up', 'higher', 'grow', 'improve',
                        'gain', 'expand', 'boost', 'accelerate', 'recover', 'surge',
                        'strong', 'positive', 'bull', 'upside', 'favorable', 'better']);

const isDecrease = (text: string): boolean =>
    containsAny(text, ['decrease', 'decline', 'down', 'lower', 'fall', 'drop', 'reduce',
                        'cut', 'weak', 'slump', 'miss', 'disappoint', 'slow', 'bear',
                        'downside', 'headwind', 'pullback', 'delay', 'adverse', 'worsen',
                        'unfavorable', 'pressure', 'deteriorat', 'compress']);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// Lever ranges — must exactly match externalId/min/max in prisma/seeds/08-scenarios.ts
const RANGES: Record<string, [number, number]> = {
    'hcb-mbr':                        [88.0, 94.0],
    'medical-membership':             [24.0, 28.0],
    'ma-margin-recovery':             [0.0,  4.0],
    'prior-auth-approval-rate':       [85.0, 99.0],
    'pharmacy-client-price-improvement': [0, 2000],
    'biosimilar-conversion-rate':     [50, 95],
    'pharmacy-claims-volume':         [1.7, 2.0],
    'glp1-client-coverage-rate':      [30, 80],
    'same-store-rx-growth':           [0.0, 10.0],
    'pcw-reimbursement-pressure':     [-200, 50],
    'interest-rate-10yr-yield':       [3.0, 6.5],
    'health100-adoption':             [0, 25],
};

const DEFAULTS: Record<string, number> = {
    'hcb-mbr':                        90.5,
    'medical-membership':             26.0,
    'ma-margin-recovery':             1.5,
    'prior-auth-approval-rate':       95.0,
    'pharmacy-client-price-improvement': 800,
    'biosimilar-conversion-rate':     85,
    'pharmacy-claims-volume':         1.84,
    'glp1-client-coverage-rate':      50,
    'same-store-rx-growth':           7.0,
    'pcw-reimbursement-pressure':     -80,
    'interest-rate-10yr-yield':       4.5,
    'health100-adoption':             5,
};

const set = (levers: Record<string, number>, id: string, value: number) => {
    const [min, max] = RANGES[id] ?? [-9999, 9999];
    levers[id] = clamp(value, min, max);
};

export const parseScenarioFromText = (text: string): ParsedScenario => {
    const lower = text.toLowerCase();
    const levers: Record<string, number> = {};
    const explanations: string[] = [];

    const pct = extractPercentage(lower);
    const dollar = extractDollarAmount(lower);
    const bps = extractBasisPoints(lower);
    const memberCount = extractCount(lower);

    const scores: Record<string, number> = {};
    Object.keys(SEMANTIC_GROUPS).forEach(g => { scores[g] = calculateMatchScore(lower, g); });

    const hasIncrease = isIncrease(lower);
    const hasDecrease = isDecrease(lower);
    // direction: +1 = favorable outcome described; -1 = adverse/worsening
    const direction = hasDecrease && !hasIncrease ? -1 : 1;

    // 1. HCB MBR — lower is favorable; parse "MBR improves/worsens", specific % values
    if (scores.hcbMbr > 0) {
        let mbrValue: number;
        if (pct !== null && pct >= 80 && pct <= 96) {
            // User cited a specific MBR percentage
            mbrValue = clamp(pct, 88.0, 94.0);
        } else if (bps !== null) {
            // User cited basis points change (e.g., "MBR improves 150bps")
            mbrValue = clamp(DEFAULTS['hcb-mbr'] - direction * bps / 100, 88.0, 94.0);
        } else if (direction > 0) {
            // Favorable/improvement scenario
            mbrValue = containsAny(lower, ['100', 'one hundred', '150', '200', 'two hundred']) ? 89.0 : 89.5;
        } else {
            // Adverse/worsening scenario
            mbrValue = containsAny(lower, ['severe', 'surge', 'extreme', '200']) ? 92.5 : 91.5;
        }
        set(levers, 'hcb-mbr', mbrValue);
        const change = mbrValue - DEFAULTS['hcb-mbr'];
        explanations.push(`Set HCB MBR to ${mbrValue}% (${change >= 0 ? '+' : ''}${change.toFixed(1)}pp vs 90.5% guidance — each 100bps ≈ ±$1.42B HCB AOI)`);

        // MA margin tends to move with MBR improvement
        if (direction > 0) {
            set(levers, 'ma-margin-recovery', clamp(DEFAULTS['ma-margin-recovery'] + 0.5, 0, 4));
        }
    }

    // 2. MA Margin Recovery
    if (scores.maMargin > 1 && !scores.hcbMbr) {
        let maMargin: number;
        if (pct !== null && pct >= 0 && pct <= 5) {
            maMargin = clamp(pct, 0, 4);
        } else if (direction > 0) {
            maMargin = containsAny(lower, ['target', '3', 'three', 'recover']) ? 3.0 : 2.5;
        } else {
            maMargin = 0.5;
        }
        set(levers, 'ma-margin-recovery', maMargin);
        explanations.push(`Set MA segment operating margin to ${maMargin}% (each +0.5pp ≈ +$350-500M annual AOI)`);
    }

    // 3. Medical Membership
    if (scores.medicalMembership > 1) {
        let membership: number;
        if (memberCount !== null) {
            membership = clamp(memberCount, 24.0, 28.0);
        } else if (pct !== null) {
            membership = clamp(DEFAULTS['medical-membership'] * (1 + direction * pct / 100), 24.0, 28.0);
        } else {
            membership = direction > 0 ? 26.5 : 25.5;
        }
        set(levers, 'medical-membership', Math.round(membership * 4) / 4); // snap to 0.25M step
        explanations.push(`Set Aetna medical membership to ${levers['medical-membership']}M (each +0.5M ≈ +$2.7B HCB revenue)`);
    }

    // 4. Prior Authorization Approval Rate
    if (scores.priorAuth > 1) {
        let paRate: number;
        if (pct !== null && pct >= 80 && pct <= 99) {
            paRate = clamp(pct, 85, 99);
        } else if (direction > 0) {
            paRate = 97; // higher approval = more care approved = higher costs
        } else {
            paRate = 92; // tighter approvals = lower costs but more regulatory risk
        }
        set(levers, 'prior-auth-approval-rate', paRate);
        explanations.push(`Set prior authorization approval rate to ${paRate}% (each 1pp ≈ 20-30bps medical cost trend impact)`);
    }

    // 5. Biosimilar Conversion Rate — higher is favorable
    if (scores.biosimilar > 0) {
        let biosimRate: number;
        if (pct !== null && pct >= 50 && pct <= 95) {
            biosimRate = clamp(pct, 50, 95);
        } else if (direction > 0) {
            biosimRate = containsAny(lower, ['90', 'ninety', 'exceed', 'above']) ? 92 : 88;
        } else {
            biosimRate = containsAny(lower, ['slow', 'miss', 'below', 'fail']) ? 65 : 75;
        }
        set(levers, 'biosimilar-conversion-rate', biosimRate);
        explanations.push(`Set Stelara biosimilar conversion to ${biosimRate}% (each 10pp below 85% ≈ -$300-500M client savings at risk)`);
    }

    // 6. Pharmacy Client Price Improvement Headwind — lower is favorable
    if (scores.pharmacyClientPrice > 1) {
        let headwind: number;
        if (dollar) {
            headwind = dollar.unit === 'B' ? dollar.value * 1000 : dollar.value;
        } else if (direction > 0) {
            headwind = containsAny(lower, ['narrow', 'reduce', 'improve', 'less']) ? 500 : 650;
        } else {
            headwind = containsAny(lower, ['increase', 'widen', 'worse', 'more']) ? 1100 : 950;
        }
        set(levers, 'pharmacy-client-price-improvement', clamp(headwind, 0, 2000));
        explanations.push(`Set pharmacy client price improvement headwind to $${Math.round(levers['pharmacy-client-price-improvement'])}M (FY26 plan: $800M)`);
    }

    // 7. Pharmacy Claims Volume — higher is favorable
    if (scores.pharmacyClaims > 0) {
        let claimsVol: number;
        if (dollar) {
            // If user says "$X billion claims" interpret as volume
            claimsVol = dollar.unit === 'B' ? clamp(dollar.value, 1.7, 2.0) : 1.84;
        } else if (direction > 0) {
            claimsVol = 1.92;
        } else {
            claimsVol = 1.76;
        }
        set(levers, 'pharmacy-claims-volume', claimsVol);
        explanations.push(`Set Caremark pharmacy claims to ${levers['pharmacy-claims-volume']}B (each 50M additional ≈ +$1.2-1.5B HSS revenue)`);
    }

    // 8. GLP-1 Client Coverage Rate
    if (scores.glp1Coverage > 0) {
        let glp1Rate: number;
        if (pct !== null && pct >= 30 && pct <= 80) {
            glp1Rate = clamp(pct, 30, 80);
        } else if (direction > 0) {
            glp1Rate = 65; // more employers covering obesity GLP-1
        } else {
            glp1Rate = 35; // employers dropping obesity GLP-1 coverage
        }
        set(levers, 'glp1-client-coverage-rate', glp1Rate);
        // GLP-1 employer coverage also affects HCB MBR (more GLP-1 = lower MA hospitalization)
        if (!levers['hcb-mbr']) {
            const mbrEffect = direction > 0 ? -0.3 : 0.2; // higher coverage = slight MBR improvement
            set(levers, 'hcb-mbr', clamp(DEFAULTS['hcb-mbr'] + mbrEffect, 88, 94));
        }
        explanations.push(`Set GLP-1 employer coverage to ${glp1Rate}% of Caremark clients (higher = more specialty Rx revenue; lower = reduced drug spend)`);
    }

    // 9. PCW Same-Store Rx Growth — higher is favorable
    if (scores.sameStoreRx > 0) {
        let ssRxGrowth: number;
        if (pct !== null && pct >= 0 && pct <= 12) {
            ssRxGrowth = clamp(pct, 0, 10);
        } else if (direction > 0) {
            ssRxGrowth = containsAny(lower, ['accelerate', 'strong', 'gain', 'walgreen']) ? 9.0 : 8.0;
        } else {
            ssRxGrowth = 4.0;
        }
        set(levers, 'same-store-rx-growth', ssRxGrowth);
        explanations.push(`Set PCW same-store Rx growth to ${levers['same-store-rx-growth']}% (each +1% ≈ +$1.36B annual PCW revenue)`);
    }

    // 10. PCW Reimbursement Pressure — less negative is favorable
    if (scores.pcwReimbursement > 0) {
        let reimBps: number;
        if (bps !== null) {
            reimBps = direction > 0 ? clamp(bps, -200, 50) : clamp(-bps, -200, 50);
        } else if (direction > 0) {
            reimBps = -30; // less pressure than -80bp plan
        } else {
            reimBps = -140; // more pressure than plan
        }
        set(levers, 'pcw-reimbursement-pressure', reimBps);
        explanations.push(`Set PCW reimbursement rate change to ${levers['pcw-reimbursement-pressure']}bps (plan: -80bps; each additional -50bps ≈ -$300M annual PCW revenue)`);
    }

    // 11. Interest Rate — lower is favorable given ~$60B LTD
    if (scores.interestRate > 0) {
        let yield10yr: number;
        if (pct !== null && pct >= 2.0 && pct <= 7.0) {
            yield10yr = clamp(pct, 3.0, 6.5);
        } else if (direction > 0) {
            // Rate cut scenario
            yield10yr = containsAny(lower, ['100', 'one hundred', 'full point']) ? 3.5 : 4.0;
        } else {
            // Rate hike scenario
            yield10yr = containsAny(lower, ['100', 'one hundred', 'full point']) ? 5.5 : 5.0;
        }
        set(levers, 'interest-rate-10yr-yield', yield10yr);
        const delta = yield10yr - DEFAULTS['interest-rate-10yr-yield'];
        explanations.push(`Set 10-yr Treasury yield to ${yield10yr}% (${delta >= 0 ? '+' : ''}${delta.toFixed(2)}pp; each +100bps ≈ -$0.04 Adj. EPS on new debt)`);
    }

    // 12. Health100 Digital Adoption — higher is favorable
    if (scores.health100 > 0) {
        let adoption: number;
        if (pct !== null && pct >= 0 && pct <= 25) {
            adoption = clamp(pct, 0, 25);
        } else if (direction > 0) {
            adoption = containsAny(lower, ['accelerate', 'strong', '15', 'fifteen']) ? 15 : 10;
        } else {
            adoption = 3;
        }
        set(levers, 'health100-adoption', adoption);
        explanations.push(`Set Health100 member adoption to ${adoption}% of Aetna members (~${Math.round(adoption * 260)}K enrolled; 10%+ unlocks $500M+ cross-sell opportunity)`);
    }

    // BROAD MACRO SCENARIO — when no specific lever matched
    if (Object.keys(levers).length === 0) {
        if (containsAny(lower, ['recession', 'downturn', 'slowdown', 'crash', 'crisis'])) {
            set(levers, 'hcb-mbr', 92.5);
            set(levers, 'medical-membership', 25.0);
            set(levers, 'same-store-rx-growth', 3.0);
            set(levers, 'interest-rate-10yr-yield', 3.5); // rate cuts in downturn
            explanations.push('Modeled macro downturn: elevated MBR (92.5%), membership decline, slower PCW Rx growth, Fed rate cuts');
        } else if (containsAny(lower, ['recovery', 'expansion', 'upside', 'bull', 'favorable'])) {
            set(levers, 'hcb-mbr', 89.0);
            set(levers, 'medical-membership', 27.0);
            set(levers, 'biosimilar-conversion-rate', 90);
            set(levers, 'same-store-rx-growth', 9.0);
            explanations.push('Modeled upside scenario: improved MBR (89.0%), membership growth, strong biosimilar conversion, PCW Rx acceleration');
        } else if (containsAny(lower, ['glp', 'obesity', 'wegovy', 'ozempic'])) {
            set(levers, 'glp1-client-coverage-rate', 70);
            set(levers, 'same-store-rx-growth', 9.0);
            set(levers, 'hcb-mbr', 90.0); // GLP-1 improves MA hospitalization over time
            explanations.push('Modeled GLP-1 acceleration: high employer coverage (70%), PCW retail Rx uplift, gradual MBR benefit');
        }
    }

    // FALLBACK: apply highest-scoring concept
    if (Object.keys(levers).length === 0) {
        const sorted = Object.entries(scores)
            .filter(([, s]) => s > 0)
            .sort(([, a], [, b]) => b - a);

        if (sorted.length > 0) {
            const [topConcept] = sorted[0];
            const conceptToLever: Record<string, string> = {
                hcbMbr: 'hcb-mbr',
                maMargin: 'ma-margin-recovery',
                medicalMembership: 'medical-membership',
                priorAuth: 'prior-auth-approval-rate',
                biosimilar: 'biosimilar-conversion-rate',
                pharmacyClientPrice: 'pharmacy-client-price-improvement',
                pharmacyClaims: 'pharmacy-claims-volume',
                glp1Coverage: 'glp1-client-coverage-rate',
                sameStoreRx: 'same-store-rx-growth',
                pcwReimbursement: 'pcw-reimbursement-pressure',
                interestRate: 'interest-rate-10yr-yield',
                health100: 'health100-adoption',
            };
            const leverId = conceptToLever[topConcept];
            if (leverId) {
                const def = DEFAULTS[leverId];
                const [min, max] = RANGES[leverId];
                const range = max - min;
                const adjVal = direction > 0
                    ? clamp(def + range * 0.15, min, max)
                    : clamp(def - range * 0.15, min, max);
                set(levers, leverId, adjVal);
                explanations.push(`Inferred ${direction > 0 ? 'favorable' : 'adverse'} adjustment to ${leverId.replace(/-/g, ' ')} (${adjVal.toFixed(2)} vs default ${def})`);
            }
        }
    }

    const explanation = explanations.length > 0
        ? explanations.join('. ')
        : 'Analyzed scenario and adjusted relevant levers based on key BD factors identified.';

    return { levers, explanation };
};
