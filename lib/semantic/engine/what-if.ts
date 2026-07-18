// ════════════════════════════════════════════════════════════════════════════
// SEMANTIC ENGINE — WHAT-IF ANALYSIS ENGINE
// ════════════════════════════════════════════════════════════════════════════
// Runs scenario modeling by propagating metric changes through the driver
// graph. Given an assumption (e.g., "comp transactions improve by 3%"),
// walks upstream through the tree applying causal weights and elasticity
// factors to compute the impact on parent KPIs like revenue and margin.
// ════════════════════════════════════════════════════════════════════════════

import type {
  NumericValue,
  WhatIfAssumption,
  WhatIfResult,
  WhatIfScenario,
  FormulaContext,
} from './types';
import type { DriverGraph } from './graph';
import type { FormulaRegistry } from './formulas';
import { evaluateFormula } from './formulas';
import { formatValue } from './formatter';

export class WhatIfEngine {
  private graph: DriverGraph;
  private formulas: FormulaRegistry;
  private maxDepth: number;

  constructor(graph: DriverGraph, formulas: FormulaRegistry, maxDepth: number = 6) {
    this.graph = graph;
    this.formulas = formulas;
    this.maxDepth = maxDepth;
  }

  /**
   * Run a what-if scenario with one or more assumptions.
   * Returns the full set of impacted metrics with projected values.
   */
  createScenario(
    name: string,
    assumptions: WhatIfAssumption[],
    baseContext: FormulaContext
  ): WhatIfScenario {
    const results: WhatIfResult[] = [];
    const scenarioContext = new Map(baseContext);

    // Apply each assumption and propagate
    for (const assumption of assumptions) {
      // Update the context with the new value
      scenarioContext.set(assumption.metricId, assumption.newValue.raw);

      // Propagate upstream
      const impacts = this.propagateUpstream(
        assumption.metricId,
        assumption.changePercent,
        scenarioContext,
        baseContext
      );
      results.push(...impacts);
    }

    // Deduplicate results (same metric may be impacted by multiple assumptions)
    const dedupedResults = this.deduplicateResults(results);

    // Compute summary P&L impacts
    const summary = this.computeSummary(dedupedResults, baseContext);

    return {
      id: `whatif-${Date.now()}`,
      name,
      assumptions,
      results: dedupedResults,
      summary,
      timestamp: Date.now(),
    };
  }

  /**
   * Propagate a metric change upstream through the driver tree.
   * At each level: compute the parent's new value based on the change,
   * applying causal weights.
   */
  private propagateUpstream(
    metricId: string,
    changePercent: number,
    scenarioContext: FormulaContext,
    baseContext: FormulaContext
  ): WhatIfResult[] {
    const results: WhatIfResult[] = [];

    // Find which driver owns this metric
    const allNodes = this.graph.getAllNodeIds();
    let ownerDriverId: string | null = null;
    for (const nodeId of allNodes) {
      const node = this.graph.getNode(nodeId);
      if (node && node.metricIds.includes(metricId)) {
        ownerDriverId = nodeId;
        break;
      }
    }

    if (!ownerDriverId) return results;

    // Walk upstream through parent chain
    const visited = new Set<string>();
    let currentDriverId = ownerDriverId;
    let currentChangePercent = changePercent;
    const impactPath: string[] = [ownerDriverId];

    for (let depth = 0; depth < this.maxDepth; depth++) {
      const parentEdge = this.graph.getParent(currentDriverId);
      if (!parentEdge || visited.has(parentEdge.from)) break;

      visited.add(parentEdge.from);
      const parentNode = this.graph.getNode(parentEdge.from);
      if (!parentNode) break;

      impactPath.push(parentEdge.from);

      // The parent's change is weighted by the causal weight of the child
      const weightedChange = currentChangePercent * parentEdge.weight;

      // For each metric on the parent, compute impact
      for (const parentMetricId of parentNode.metricIds) {
        const formula = this.formulas.get(parentMetricId);
        const baseValue = baseContext.get(parentMetricId);

        if (baseValue !== undefined) {
          // Try formula-based computation first
          let projectedRaw: number;
          if (formula) {
            const computed = evaluateFormula(formula.expression, scenarioContext);
            projectedRaw = computed ?? baseValue * (1 + weightedChange / 100);
          } else {
            // Fallback: apply weighted percentage change
            projectedRaw = baseValue * (1 + weightedChange / 100);
          }

          // Update scenario context for next level
          scenarioContext.set(parentMetricId, projectedRaw);

          const node = this.graph.getNode(parentEdge.from);
          const unit = formula?.outputUnit ?? 'percent';
          const impact = projectedRaw - baseValue;

          results.push({
            driverId: parentEdge.from,
            driverName: node?.name ?? parentEdge.from,
            metricId: parentMetricId,
            metricName: parentMetricId, // Will be enriched by engine
            originalValue: {
              raw: baseValue,
              unit,
              display: formatValue(baseValue, unit),
            },
            projectedValue: {
              raw: projectedRaw,
              unit,
              display: formatValue(projectedRaw, unit, { showSign: false }),
            },
            impact: {
              raw: impact,
              unit,
              display: formatValue(impact, unit, { showSign: true }),
            },
            impactPath: [...impactPath],
            confidence: this.computeConfidence(impactPath),
          });
        }
      }

      currentDriverId = parentEdge.from;
      currentChangePercent = weightedChange;
    }

    // Also propagate through cross-references
    const crossRefResults = this.propagateCrossRefs(
      ownerDriverId,
      changePercent,
      scenarioContext,
      baseContext,
      visited
    );
    results.push(...crossRefResults);

    return results;
  }

  /**
   * Propagate changes through cross-console references.
   */
  private propagateCrossRefs(
    driverId: string,
    changePercent: number,
    scenarioContext: FormulaContext,
    baseContext: FormulaContext,
    visited: Set<string>
  ): WhatIfResult[] {
    const results: WhatIfResult[] = [];
    const incoming = this.graph.getIncoming(driverId)
      .filter(e => e.type === 'cross-reference');

    for (const edge of incoming) {
      if (visited.has(edge.from)) continue;
      visited.add(edge.from);

      const node = this.graph.getNode(edge.from);
      if (!node) continue;

      // Cross-reference impact is attenuated (50% default weight)
      const crossRefChange = changePercent * edge.weight;

      for (const metricId of node.metricIds) {
        const baseValue = baseContext.get(metricId);
        if (baseValue === undefined) continue;

        const projectedRaw = baseValue * (1 + crossRefChange / 100);
        scenarioContext.set(metricId, projectedRaw);

        const unit = 'percent'; // Default for cross-ref metrics
        const impact = projectedRaw - baseValue;

        results.push({
          driverId: edge.from,
          driverName: node.name,
          metricId,
          metricName: metricId,
          originalValue: {
            raw: baseValue,
            unit,
            display: formatValue(baseValue, unit),
          },
          projectedValue: {
            raw: projectedRaw,
            unit,
            display: formatValue(projectedRaw, unit),
          },
          impact: {
            raw: impact,
            unit,
            display: formatValue(impact, unit, { showSign: true }),
          },
          impactPath: [driverId, edge.from],
          confidence: edge.weight * 0.7, // Lower confidence for cross-refs
        });
      }
    }

    return results;
  }

  /**
   * Compute confidence as the product of causal weights along the impact path.
   * Longer paths = lower confidence.
   */
  private computeConfidence(path: string[]): number {
    if (path.length <= 1) return 1.0;

    let confidence = 1.0;
    for (let i = 0; i < path.length - 1; i++) {
      const parentEdge = this.graph.getParent(path[i + 1]);
      if (parentEdge) {
        confidence *= parentEdge.weight;
      } else {
        confidence *= 0.5; // Default for unknown relationships
      }
    }

    // Minimum confidence floor
    return Math.max(confidence, 0.1);
  }

  /**
   * Deduplicate results where the same metric is impacted multiple times.
   * Keep the result with the highest confidence.
   */
  private deduplicateResults(results: WhatIfResult[]): WhatIfResult[] {
    const byMetric = new Map<string, WhatIfResult>();

    for (const result of results) {
      const existing = byMetric.get(result.metricId);
      if (!existing || result.confidence > existing.confidence) {
        byMetric.set(result.metricId, result);
      }
    }

    return Array.from(byMetric.values());
  }

  /**
   * Extract summary P&L-level impacts from the results.
   */
  private computeSummary(
    results: WhatIfResult[],
    _baseContext: FormulaContext
  ): WhatIfScenario['summary'] {
    const summary: WhatIfScenario['summary'] = {};

    // Look for revenue impact
    const revenueResult = results.find(r =>
      r.metricId === 'fp-total-revenue' || r.metricId.includes('revenue')
    );
    if (revenueResult) {
      summary.revenueImpact = revenueResult.impact;
    }

    // Look for margin impact (convert to bps)
    const marginResult = results.find(r =>
      r.metricId.includes('margin') || r.metricId.includes('op-margin')
    );
    if (marginResult) {
      summary.marginImpactBps = Math.round(marginResult.impact.raw * 100);
    }

    // Look for EPS impact
    const epsResult = results.find(r =>
      r.metricId.includes('eps') || r.metricId === 'fp-non-gaap-eps'
    );
    if (epsResult) {
      summary.epsImpact = epsResult.impact;
    }

    return summary;
  }
}
