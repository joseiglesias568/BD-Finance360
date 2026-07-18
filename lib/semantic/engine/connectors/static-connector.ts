// ════════════════════════════════════════════════════════════════════════════
// STATIC DATA CONNECTOR
// ════════════════════════════════════════════════════════════════════════════
// Reads metric values directly from the static consoles.ts definitions
// by parsing display strings into numeric values. Zero database dependency.
// ════════════════════════════════════════════════════════════════════════════

import type { SemanticConsole, SemanticDriver, SemanticMetric } from '../../types';
import type { DataConnector, NumericValue } from '../types';
import { parseDisplayValue } from '../formatter';

export class StaticConnector implements DataConnector {
  readonly name = 'static';

  /** Flat index: metricId → { metric, driverName } */
  private metricIndex: Map<string, { metric: SemanticMetric; driverName: string }> = new Map();
  /** Flat index: driverId → metric IDs */
  private driverMetricIndex: Map<string, string[]> = new Map();

  constructor(consoles: SemanticConsole[]) {
    this.buildIndex(consoles);
  }

  private buildIndex(consoles: SemanticConsole[]): void {
    for (const console of consoles) {
      for (const driver of console.drivers) {
        this.indexDriver(driver);
      }
    }
  }

  private indexDriver(driver: SemanticDriver): void {
    const metricIds: string[] = [];

    if (driver.metrics) {
      for (const metric of driver.metrics) {
        this.metricIndex.set(metric.id, { metric, driverName: driver.name });
        metricIds.push(metric.id);
      }
    }

    this.driverMetricIndex.set(driver.id, metricIds);

    if (driver.children) {
      for (const child of driver.children) {
        this.indexDriver(child);
      }
    }
  }

  /** Get a single metric value by parsing its display string */
  getMetricValue(metricId: string): NumericValue | null {
    const entry = this.metricIndex.get(metricId);
    if (!entry) return null;
    return parseDisplayValue(entry.metric.currentValue, entry.metric.unit);
  }

  /** Static connector has no time series — returns empty array */
  getMetricTimeSeries(_metricId: string, _periods: number): NumericValue[] {
    return [];
  }

  /** Get all metric values for a driver */
  getDriverMetrics(driverId: string): Map<string, NumericValue> {
    const result = new Map<string, NumericValue>();
    const metricIds = this.driverMetricIndex.get(driverId) ?? [];

    for (const metricId of metricIds) {
      const value = this.getMetricValue(metricId);
      if (value) {
        result.set(metricId, value);
      }
    }

    return result;
  }

  /** Static connector has no elasticity data — returns null */
  getElasticity(_driverMetric: string, _impactedMetric: string): number | null {
    return null;
  }

  /** Get raw metric definition (for metadata access) */
  getMetricDefinition(metricId: string): SemanticMetric | undefined {
    return this.metricIndex.get(metricId)?.metric;
  }

  /** Get total indexed metrics count */
  getMetricCount(): number {
    return this.metricIndex.size;
  }
}
