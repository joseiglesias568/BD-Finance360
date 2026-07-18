// ════════════════════════════════════════════════════════════════════════════
// DELTA AIR LINES BUSINESS ARCHITECTURE — BARREL FILE
// ════════════════════════════════════════════════════════════════════════════
// Re-exports all types, console data, aggregation array, and utility functions.
// 14 MECE business consoles representing Delta's airline business architecture.
// ════════════════════════════════════════════════════════════════════════════

export * from './types';
export {
    northAmericaPerformance,
    internationalPerformance,
    channelDevelopment,
    competitiveIntelligence,
    storeOperations,
    storeDevelopment,
    menuProductStrategy,
    supplyChain,
    digitalLoyalty,
    brandMarketing,
    partnerExperience,
    financialPerformance,
    capitalAllocation,
    riskComplianceSustainability,
    allSemanticConsoles,
} from './consoles';

import type { SemanticMetric, SemanticDriver } from './types';

// ════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS (delegated to SemanticEngine for O(1) lookups)
// ════════════════════════════════════════════════════════════════════════════
// These functions maintain backward compatibility with all existing consumers.
// Internally they delegate to SemanticEngine's cached hash maps instead of
// the previous O(n) recursive scans.
// ════════════════════════════════════════════════════════════════════════════

import { SemanticEngine } from './engine';

/** Get a flat array of every driver node across all 14 consoles (O(1) via engine cache) */
export function getAllDrivers(): SemanticDriver[] {
    return SemanticEngine.getInstance().getAllDriversFlat();
}

/** Get a flat array of every metric across all 14 consoles (O(1) via engine cache) */
export function getAllMetrics(): SemanticMetric[] {
    return SemanticEngine.getInstance().getAllMetricsFlat();
}

/** Look up a driver by its unique ID (O(1) via engine hash map) */
export function getDriverById(id: string): SemanticDriver | undefined {
    return SemanticEngine.getInstance().getDriverByIdCompat(id);
}

/** Get all cross-references for a given driver ID (O(1) via engine) */
export function getCrossReferences(driverId: string): SemanticDriver[] {
    return SemanticEngine.getInstance().getCrossRefsCompat(driverId);
}

/** Summary statistics for the entire semantic model (enhanced with engine stats) */
export function getModelStatistics() {
    return SemanticEngine.getInstance().getModelStats();
}

// ════════════════════════════════════════════════════════════════════════════
// RE-EXPORT: Semantic Computation Engine
// ════════════════════════════════════════════════════════════════════════════
export * from './engine';
