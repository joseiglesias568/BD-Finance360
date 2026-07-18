// =============================================================================
// Shared Calculation Engines — Barrel Export
// These engines are the single source of truth for all business calculations.
// Frontend components should NEVER contain duplicate calculation logic.
// =============================================================================

export * from './variance-engine';
export * from './financial-engine';
export * from './statistical-engine';
export * from './health-engine';
export * from './formatting-engine';
