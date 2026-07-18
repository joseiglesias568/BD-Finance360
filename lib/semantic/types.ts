// ════════════════════════════════════════════════════════════════════════════
// AMEREN CORPORATION — BUSINESS ARCHITECTURE — TYPE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════

export interface SemanticMetric {
    id: string;
    name: string;
    description: string;
    unit: 'currency' | 'percent' | 'count' | 'ratio' | 'time' | 'score' | 'index' | 'text';
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'semi-annual' | 'event';
    currentValue?: string;
    target?: string;
    direction: 'higher_is_better' | 'lower_is_better' | 'on_target';
}

export interface SemanticDriver {
    id: string;
    name: string;
    description: string;
    metrics?: SemanticMetric[];
    children?: SemanticDriver[];
    crossReferences?: string[]; // IDs of related drivers in other consoles
}

// Segment categories for Becton, Dickinson and Company:
//   - 'consumer'      : BD Care Benefits (electric distribution, ~$15.8B rate base)
//   - 'business'      : BD Services (Illinois electric distribution, ~$5.0B rate base)
//   - 'network'       : CVS Pharmacy (Illinois gas distribution, ~$4.2B rate base)
//   - 'strategy'      : Strategic initiatives, ESA load growth, clean energy transition
//   - 'finance'       : Financial performance, capital allocation, FFO/debt
//   - 'corporate'     : Corporate functions (people, brand, risk)
//   - 'cross-cutting' : Cross-functional (regulatory, sustainability, ATXI transmission)
export interface SemanticConsole {
    id: string;
    title: string;
    category: string;
    segment: 'consumer' | 'business' | 'network' | 'strategy' | 'finance' | 'corporate' | 'cross-cutting' | 'iet' | 'ofse';
    objective: string;
    drivers: SemanticDriver[];
}
