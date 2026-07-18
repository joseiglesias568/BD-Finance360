// ════════════════════════════════════════════════════════════════════════════
// SEMANTIC ENGINE — ORCHESTRATOR
// ════════════════════════════════════════════════════════════════════════════
// Central singleton that wires together the driver graph, formula engine,
// data connectors, and what-if engine. Provides:
//   - O(1) driver/metric lookups (vs O(n) linear scans in the old code)
//   - Computed metrics with numeric values, gaps, and health scores
//   - Graph traversal for cross-console relationship exploration
//   - What-if scenario modeling
//   - Backward-compatible exports matching existing function signatures
//   - AI-optimized semantic context generation
// ════════════════════════════════════════════════════════════════════════════

import type { SemanticMetric, SemanticDriver, SemanticConsole } from '../types';
import type {
  ComputedMetric,
  ComputedDriver,
  ComputedConsole,
  CrossReference,
  NumericValue,
  FormulaContext,
  WhatIfAssumption,
  WhatIfScenario,
  SemanticEngineConfig,
  DataConnector,
  MetricUnit,
} from './types';
import { allSemanticConsoles } from '../index';
import { DriverGraph } from './graph';
import { FormulaRegistry, evaluateFormula, getComputationOrder, getFormulaDescriptions } from './formulas';
import { WhatIfEngine } from './what-if';
import { StaticConnector } from './connectors/static-connector';
import {
  parseDisplayValue,
  parseTargetRange,
  computeGap,
  computeHealthScore,
  inferStatus,
  formatValue,
} from './formatter';

export class SemanticEngine {
  // ── Singleton ───────────────────────────────────────────────────────────
  private static _instance: SemanticEngine | null = null;

  static getInstance(config?: SemanticEngineConfig): SemanticEngine {
    if (!SemanticEngine._instance) {
      SemanticEngine._instance = new SemanticEngine(config);
    }
    return SemanticEngine._instance;
  }

  static resetInstance(): void {
    SemanticEngine._instance = null;
  }

  // ── Internal State ──────────────────────────────────────────────────────
  private graph: DriverGraph;
  private formulas: FormulaRegistry;
  private whatIf: WhatIfEngine;
  private connector: DataConnector;

  /** O(1) lookup caches */
  private driverIndex: Map<string, SemanticDriver> = new Map();
  private metricIndex: Map<string, { metric: SemanticMetric; driverId: string; consoleId: string }> = new Map();
  private driverConsoleMap: Map<string, string> = new Map(); // driverId → consoleId
  private consoleIndex: Map<string, SemanticConsole> = new Map();

  /** Computed values cache */
  private computedMetrics: Map<string, ComputedMetric> = new Map();
  private computedDrivers: Map<string, ComputedDriver> = new Map();
  private baseContext: FormulaContext = new Map();

  // ── Constructor ─────────────────────────────────────────────────────────

  private constructor(config?: SemanticEngineConfig) {
    // Build graph from all consoles
    this.graph = new DriverGraph(allSemanticConsoles);

    // Initialize formula registry
    this.formulas = new FormulaRegistry();

    // Set up data connector
    this.connector = config?.connector ?? new StaticConnector(allSemanticConsoles);

    // Initialize what-if engine
    this.whatIf = new WhatIfEngine(
      this.graph,
      this.formulas,
      config?.maxWhatIfDepth ?? 6
    );

    // Build O(1) lookup indexes
    this.buildIndexes();

    // Build base context (all metric values)
    this.buildBaseContext();

    // Compute all metrics
    this.computeAllMetrics();
  }

  // ── Index Building ──────────────────────────────────────────────────────

  private buildIndexes(): void {
    for (const console of allSemanticConsoles) {
      this.consoleIndex.set(console.id, console);
      for (const driver of console.drivers) {
        this.indexDriverRecursive(driver, console.id);
      }
    }
  }

  private indexDriverRecursive(driver: SemanticDriver, consoleId: string): void {
    this.driverIndex.set(driver.id, driver);
    this.driverConsoleMap.set(driver.id, consoleId);

    if (driver.metrics) {
      for (const metric of driver.metrics) {
        this.metricIndex.set(metric.id, {
          metric,
          driverId: driver.id,
          consoleId,
        });
      }
    }

    if (driver.children) {
      for (const child of driver.children) {
        this.indexDriverRecursive(child, consoleId);
      }
    }
  }

  private buildBaseContext(): void {
    for (const [metricId, entry] of Array.from(this.metricIndex.entries())) {
      const value = this.connector.getMetricValue(metricId);
      if (value) {
        this.baseContext.set(metricId, value.raw);
      }
    }
  }

  // ── Metric Computation ──────────────────────────────────────────────────

  private computeAllMetrics(): void {
    // First pass: compute from static/database values
    for (const [metricId, entry] of Array.from(this.metricIndex.entries())) {
      const computed = this.computeSingleMetric(metricId, entry.metric);
      this.computedMetrics.set(metricId, computed);
    }

    // Second pass: evaluate formulas in dependency order
    const order = getComputationOrder(this.formulas);
    for (const metricId of order) {
      const formula = this.formulas.get(metricId);
      if (!formula) continue;

      const result = evaluateFormula(formula.expression, this.baseContext);
      if (result !== null) {
        // Update the base context with the computed value
        this.baseContext.set(metricId, result);

        // If the metric exists, update its computed version
        const existing = this.computedMetrics.get(metricId);
        if (existing) {
          existing.value = {
            raw: result,
            unit: existing.unit,
            display: formatValue(result, existing.unit),
          };
          existing.source = 'computed';
          existing.formula = formula.expression;

          // Recompute gap with updated value
          if (existing.target) {
            const targetRange = parseTargetRange(existing.target.display, existing.unit);
            if (targetRange) {
              existing.gap = computeGap(existing.value, targetRange, existing.direction);
              existing.status = existing.gap.status;
            }
          }
        }
      }
    }
  }

  private computeSingleMetric(metricId: string, metric: SemanticMetric): ComputedMetric {
    const value = this.connector.getMetricValue(metricId);
    const parsedValue: NumericValue = value ?? {
      raw: 0,
      unit: metric.unit,
      display: metric.currentValue ?? 'N/A',
    };

    const targetRange = parseTargetRange(metric.target, metric.unit);
    let gap = undefined;
    let status: ComputedMetric['status'] = 'warning';

    if (targetRange && value) {
      const gapResult = computeGap(parsedValue, targetRange, metric.direction);
      gap = gapResult;
      status = gapResult.status;
    } else if (value) {
      status = inferStatus(parsedValue, metric.direction);
    }

    return {
      id: metricId,
      name: metric.name,
      description: metric.description,
      value: parsedValue,
      target: targetRange ? {
        raw: targetRange.midpoint,
        unit: metric.unit,
        display: metric.target ?? '',
      } : undefined,
      gap,
      direction: metric.direction,
      status,
      source: 'static',
      frequency: metric.frequency,
      unit: metric.unit,
    };
  }

  // ── Core Queries (O(1) lookups) ─────────────────────────────────────────

  /** Get a computed driver by ID */
  getDriver(id: string): ComputedDriver | undefined {
    // Build on demand
    if (!this.computedDrivers.has(id)) {
      const raw = this.driverIndex.get(id);
      if (!raw) return undefined;
      const consoleId = this.driverConsoleMap.get(id) ?? '';
      const computed = this.buildComputedDriver(raw, consoleId, 0, []);
      this.computedDrivers.set(id, computed);
    }
    return this.computedDrivers.get(id);
  }

  /** Get a computed metric by ID */
  getMetric(id: string): ComputedMetric | undefined {
    return this.computedMetrics.get(id);
  }

  /** Get a computed console */
  getConsole(id: string): ComputedConsole | undefined {
    const raw = this.consoleIndex.get(id);
    if (!raw) return undefined;
    return this.buildComputedConsole(raw);
  }

  /** Search drivers by query string */
  searchDrivers(query: string): ComputedDriver[] {
    const q = query.toLowerCase();
    const results: ComputedDriver[] = [];

    for (const [id, driver] of Array.from(this.driverIndex.entries())) {
      if (
        driver.name.toLowerCase().includes(q) ||
        driver.description.toLowerCase().includes(q) ||
        id.toLowerCase().includes(q)
      ) {
        const computed = this.getDriver(id);
        if (computed) results.push(computed);
      }
    }

    return results.slice(0, 25);
  }

  /** Search metrics by query string */
  searchMetrics(query: string): ComputedMetric[] {
    const q = query.toLowerCase();
    const results: ComputedMetric[] = [];

    for (const [id, entry] of Array.from(this.metricIndex.entries())) {
      if (
        entry.metric.name.toLowerCase().includes(q) ||
        entry.metric.description.toLowerCase().includes(q) ||
        id.toLowerCase().includes(q)
      ) {
        const computed = this.computedMetrics.get(id);
        if (computed) results.push(computed);
      }
    }

    return results.slice(0, 25);
  }

  // ── Computed Driver Builder ─────────────────────────────────────────────

  private buildComputedDriver(
    driver: SemanticDriver,
    consoleId: string,
    depth: number,
    parentPath: string[]
  ): ComputedDriver {
    const path = [...parentPath, driver.name];

    // Compute metrics
    const metrics: ComputedMetric[] = [];
    if (driver.metrics) {
      for (const m of driver.metrics) {
        const computed = this.computedMetrics.get(m.id);
        if (computed) metrics.push(computed);
      }
    }

    // Compute children
    const children: ComputedDriver[] = [];
    if (driver.children) {
      for (const child of driver.children) {
        children.push(this.buildComputedDriver(child, consoleId, depth + 1, path));
      }
    }

    // Resolve cross-references
    const crossRefs = this.resolveCrossReferences(driver);

    // Compute health score
    const healthScore = computeHealthScore(metrics);

    // Get causal weight from graph
    const parentEdge = this.graph.getParent(driver.id);

    return {
      id: driver.id,
      name: driver.name,
      description: driver.description,
      consoleId,
      metrics,
      children,
      crossReferences: crossRefs,
      causalWeight: parentEdge?.weight,
      impactDirection: parentEdge?.direction,
      healthScore,
      depth,
      path,
    };
  }

  private buildComputedConsole(console: SemanticConsole): ComputedConsole {
    const drivers = console.drivers.map(d =>
      this.buildComputedDriver(d, console.id, 0, [console.title])
    );

    // Aggregate stats
    let totalDrivers = 0;
    let totalMetrics = 0;
    let healthSum = 0;
    let healthCount = 0;
    let criticalCount = 0;
    let warningCount = 0;

    const countRecursive = (d: ComputedDriver) => {
      totalDrivers++;
      totalMetrics += d.metrics.length;
      if (d.metrics.length > 0) {
        healthSum += d.healthScore;
        healthCount++;
      }
      for (const m of d.metrics) {
        if (m.status === 'critical') criticalCount++;
        else if (m.status === 'warning') warningCount++;
      }
      for (const child of d.children) countRecursive(child);
    };
    drivers.forEach(countRecursive);

    return {
      id: console.id,
      title: console.title,
      category: console.category,
      segment: console.segment,
      objective: console.objective,
      drivers,
      totalDrivers,
      totalMetrics,
      avgHealthScore: healthCount > 0 ? Math.round(healthSum / healthCount) : 50,
      criticalCount,
      warningCount,
    };
  }

  // ── Cross-Reference Resolution ──────────────────────────────────────────

  private resolveCrossReferences(driver: SemanticDriver): CrossReference[] {
    if (!driver.crossReferences) return [];

    const refs: CrossReference[] = [];
    const sourceConsoleId = this.driverConsoleMap.get(driver.id) ?? '';

    for (const refId of driver.crossReferences) {
      const targetDriver = this.driverIndex.get(refId);
      const targetConsoleId = this.driverConsoleMap.get(refId);

      if (targetDriver && targetConsoleId) {
        const targetConsole = this.consoleIndex.get(targetConsoleId);
        refs.push({
          sourceDriverId: driver.id,
          sourceDriverName: driver.name,
          sourceConsoleId,
          targetDriverId: refId,
          targetDriverName: targetDriver.name,
          targetConsoleId,
          targetConsoleName: targetConsole?.title ?? targetConsoleId,
          relationship: 'related',
          weight: 0.5,
        });
      }
    }

    return refs;
  }

  // ── Graph Traversal ─────────────────────────────────────────────────────

  /** Get related drivers via graph traversal (includes cross-console links) */
  getRelatedDrivers(driverId: string, depth: number = 2): ComputedDriver[] {
    const edges = this.graph.getRelatedDrivers(driverId, depth);
    const relatedIds = new Set(edges.map(e => [e.from, e.to]).flat());
    relatedIds.delete(driverId);

    return Array.from(relatedIds)
      .map(id => this.getDriver(id))
      .filter((d): d is ComputedDriver => d !== undefined);
  }

  /** Get the full impact chain between two drivers */
  getImpactChain(fromId: string, toId: string): ComputedDriver[] {
    const path = this.graph.getImpactPath(fromId, toId);
    return path
      .map(id => this.getDriver(id))
      .filter((d): d is ComputedDriver => d !== undefined);
  }

  /** Get all cross-console links for a driver */
  getCrossConsoleLinks(driverId: string): CrossReference[] {
    const driver = this.driverIndex.get(driverId);
    if (!driver) return [];
    return this.resolveCrossReferences(driver);
  }

  /** Get upstream drivers (parent chain) */
  getUpstream(driverId: string): ComputedDriver[] {
    const ancestors = this.graph.getAncestors(driverId);
    return ancestors
      .map(id => this.getDriver(id))
      .filter((d): d is ComputedDriver => d !== undefined);
  }

  /** Get downstream drivers (all descendants) */
  getDownstream(driverId: string): ComputedDriver[] {
    const descendants = this.graph.getDescendants(driverId);
    return descendants
      .map(id => this.getDriver(id))
      .filter((d): d is ComputedDriver => d !== undefined);
  }

  // ── What-If Analysis ────────────────────────────────────────────────────

  /** Run a what-if scenario */
  whatIfAnalysis(assumptions: WhatIfAssumption[]): WhatIfScenario {
    const name = assumptions.map(a =>
      `${a.metricId}: ${a.originalValue.display} → ${a.newValue.display}`
    ).join('; ');

    return this.whatIf.createScenario(name, assumptions, this.baseContext);
  }

  /** Helper to create a what-if assumption from simple inputs */
  createAssumption(
    metricId: string,
    newRawValue: number
  ): WhatIfAssumption | null {
    const computed = this.computedMetrics.get(metricId);
    if (!computed) return null;

    const changePercent = computed.value.raw !== 0
      ? ((newRawValue - computed.value.raw) / Math.abs(computed.value.raw)) * 100
      : 0;

    const entry = this.metricIndex.get(metricId);
    const driverId = entry?.driverId ?? '';

    return {
      driverId,
      metricId,
      originalValue: computed.value,
      newValue: {
        raw: newRawValue,
        unit: computed.unit,
        display: formatValue(newRawValue, computed.unit),
      },
      changePercent,
    };
  }

  // ── Backward-Compatible Exports ─────────────────────────────────────────

  /** Same shape as existing getAllDrivers() */
  getAllDriversFlat(): SemanticDriver[] {
    return Array.from(this.driverIndex.values());
  }

  /** Same shape as existing getAllMetrics() */
  getAllMetricsFlat(): SemanticMetric[] {
    return Array.from(this.metricIndex.values()).map(e => e.metric);
  }

  /** Same shape as existing getDriverById() */
  getDriverByIdCompat(id: string): SemanticDriver | undefined {
    return this.driverIndex.get(id);
  }

  /** Same shape as existing getCrossReferences() */
  getCrossRefsCompat(driverId: string): SemanticDriver[] {
    const driver = this.driverIndex.get(driverId);
    if (!driver?.crossReferences) return [];
    return driver.crossReferences
      .map(refId => this.driverIndex.get(refId))
      .filter((d): d is SemanticDriver => d !== undefined);
  }

  /** Same shape as existing getModelStatistics() */
  getModelStats() {
    const graphStats = this.graph.getStatistics();
    let crossRefCount = 0;
    for (const driver of Array.from(this.driverIndex.values())) {
      crossRefCount += driver.crossReferences?.length ?? 0;
    }

    return {
      totalConsoles: allSemanticConsoles.length,
      totalDriverNodes: this.driverIndex.size,
      totalMetrics: this.metricIndex.size,
      totalCrossReferences: crossRefCount,
      totalFormulas: this.formulas.getAll().length,
      graphEdges: graphStats.totalEdges,
      maxTreeDepth: graphStats.maxDepth,
      avgBranchingFactor: Number(graphStats.avgBranchingFactor.toFixed(2)),
      byCategory: {
        'Revenue & Market': allSemanticConsoles.filter(c => c.category === 'revenue-market').length,
        'Operations': allSemanticConsoles.filter(c => c.category === 'operations').length,
        'Digital & Client': allSemanticConsoles.filter(c => c.category === 'digital-client').length,
        'People': allSemanticConsoles.filter(c => c.category === 'people').length,
        'Financial': allSemanticConsoles.filter(c => c.category === 'financial').length,
        'Risk & ESG': allSemanticConsoles.filter(c => c.category === 'risk').length,
      },
      bySegment: {
        'consumer': allSemanticConsoles.filter(c => c.segment === 'consumer').length,
        'business': allSemanticConsoles.filter(c => c.segment === 'business').length,
        'network': allSemanticConsoles.filter(c => c.segment === 'network').length,
        'strategy': allSemanticConsoles.filter(c => c.segment === 'strategy').length,
        'finance': allSemanticConsoles.filter(c => c.segment === 'finance').length,
        'corporate': allSemanticConsoles.filter(c => c.segment === 'corporate').length,
        'cross-cutting': allSemanticConsoles.filter(c => c.segment === 'cross-cutting').length,
      },
    };
  }

  // ── AI-Optimized Context ────────────────────────────────────────────────

  /** Generate structured semantic context for AI system prompts */
  getSemanticContext(maxDrivers: number = 30, maxMetrics: number = 30): string {
    const stats = this.getModelStats();

    // Top-level driver hierarchy with computed health scores
    const topDrivers = allSemanticConsoles.flatMap(c =>
      c.drivers.map(d => {
        const computed = this.getDriver(d.id);
        const health = computed?.healthScore ?? 50;
        const statusIcon = health >= 70 ? 'GOOD' : health >= 40 ? 'WARN' : 'CRIT';
        const childCount = d.children?.length ?? 0;
        const crossRefs = d.crossReferences?.length ?? 0;
        return `- [${statusIcon}] ${d.name} (${d.id}): ${d.description}${childCount ? ` [${childCount} sub-drivers]` : ''}${crossRefs ? ` [${crossRefs} cross-refs]` : ''} (health: ${health}/100)`;
      })
    ).slice(0, maxDrivers);

    // Metrics with computed values, gaps, and status
    const topMetrics: string[] = [];
    for (const [id, computed] of Array.from(this.computedMetrics.entries())) {
      if (topMetrics.length >= maxMetrics) break;
      const gapStr = computed.gap ? ` gap: ${computed.gap.display}` : '';
      const statusStr = computed.status.toUpperCase();
      topMetrics.push(
        `- [${statusStr}] ${computed.name}: ${computed.value.display} (target: ${computed.target?.display ?? 'N/A'},${gapStr}, ${computed.direction})`
      );
    }

    // Formula descriptions
    const formulaDescs = getFormulaDescriptions(this.formulas);

    // Cross-console relationships
    const crossEdges = this.graph.getCrossConsoleEdges();
    const crossSummary = crossEdges.slice(0, 15).map(e => {
      const fromNode = this.graph.getNode(e.from);
      const toNode = this.graph.getNode(e.to);
      const fromConsole = fromNode ? this.graph.getConsoleName(fromNode.consoleId) : '';
      const toConsole = toNode ? this.graph.getConsoleName(toNode.consoleId) : '';
      return `- ${fromNode?.name ?? e.from} (${fromConsole}) → ${toNode?.name ?? e.to} (${toConsole})`;
    });

    return `## Business Architecture — Semantic Model (${stats.totalConsoles} consoles, ${stats.totalDriverNodes} drivers, ${stats.totalMetrics} metrics)

### Driver Tree (Top Drivers with Health Scores)
${topDrivers.join('\n')}

### Key Metrics (Computed Values with Targets & Gaps)
${topMetrics.join('\n')}

### Business Logic Formulas (${stats.totalFormulas} executable)
${formulaDescs.join('\n')}

### Cross-Console Relationships (${crossEdges.length} total links)
${crossSummary.join('\n')}

### Capabilities
- **Graph traversal**: Use \`exploreDriverGraph\` to walk the driver tree upstream/downstream and across consoles
- **What-if analysis**: Use \`runWhatIfAnalysis\` to model "what if [metric] changes by X%?" and see full P&L impact chain
- **Formula computation**: ${stats.totalFormulas} formulas encode real business logic (e.g., Organic Growth = Fee Revenue + Volume)`;
  }

  /** Get a concise AI summary for a specific driver */
  getDriverSummaryForAI(driverId: string): string {
    const computed = this.getDriver(driverId);
    if (!computed) return `Driver ${driverId} not found`;

    const metrics = computed.metrics.map(m =>
      `  - ${m.name}: ${m.value.display} (target: ${m.target?.display ?? 'N/A'}, status: ${m.status})`
    ).join('\n');

    const children = computed.children.map(c =>
      `  - ${c.name} (health: ${c.healthScore}/100)`
    ).join('\n');

    const crossRefs = computed.crossReferences.map(r =>
      `  - ${r.targetDriverName} (${r.targetConsoleName})`
    ).join('\n');

    return `### ${computed.name}
Console: ${this.graph.getConsoleName(computed.consoleId)}
Path: ${computed.path.join(' → ')}
Health: ${computed.healthScore}/100
${metrics ? `\nMetrics:\n${metrics}` : ''}
${children ? `\nSub-drivers:\n${children}` : ''}
${crossRefs ? `\nCross-references:\n${crossRefs}` : ''}`;
  }

  // ── Accessors ───────────────────────────────────────────────────────────

  getGraph(): DriverGraph {
    return this.graph;
  }

  getFormulas(): FormulaRegistry {
    return this.formulas;
  }

  getBaseContext(): FormulaContext {
    return new Map(this.baseContext);
  }
}
