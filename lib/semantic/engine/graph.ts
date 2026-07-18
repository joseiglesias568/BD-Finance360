// ════════════════════════════════════════════════════════════════════════════
// SEMANTIC ENGINE — DRIVER GRAPH
// ════════════════════════════════════════════════════════════════════════════
// Directed graph of all driver relationships: parent→child and cross-console
// references. Supports BFS traversal, path finding, topological sort,
// and impact propagation for what-if analysis.
// ════════════════════════════════════════════════════════════════════════════

import type { SemanticConsole, SemanticDriver } from '../types';
import type { DriverEdge, GraphNode } from './types';

export class DriverGraph {
  /** Adjacency list: driverId → outgoing edges */
  private adjacency: Map<string, DriverEdge[]> = new Map();
  /** Reverse adjacency: driverId → incoming edges (for upstream traversal) */
  private reverseAdjacency: Map<string, DriverEdge[]> = new Map();
  /** Node metadata */
  private nodes: Map<string, GraphNode> = new Map();
  /** Console lookup: consoleId → console title */
  private consoleTitles: Map<string, string> = new Map();

  constructor(consoles: SemanticConsole[]) {
    this.buildFromConsoles(consoles);
  }

  // ── Graph Construction ──────────────────────────────────────────────────

  private buildFromConsoles(consoles: SemanticConsole[]): void {
    for (const console of consoles) {
      this.consoleTitles.set(console.id, console.title);
      for (const driver of console.drivers) {
        this.indexDriver(driver, console.id, null, 0);
      }
    }

    // Second pass: resolve cross-references (requires all nodes indexed)
    for (const console of consoles) {
      for (const driver of console.drivers) {
        this.indexCrossReferences(driver, console.id);
      }
    }
  }

  private indexDriver(
    driver: SemanticDriver,
    consoleId: string,
    parentId: string | null,
    depth: number
  ): void {
    const metricIds = (driver.metrics ?? []).map(m => m.id);

    this.nodes.set(driver.id, {
      id: driver.id,
      name: driver.name,
      consoleId,
      depth,
      parentId,
      metricIds,
    });

    // Ensure adjacency lists exist
    if (!this.adjacency.has(driver.id)) {
      this.adjacency.set(driver.id, []);
    }
    if (!this.reverseAdjacency.has(driver.id)) {
      this.reverseAdjacency.set(driver.id, []);
    }

    if (driver.children && driver.children.length > 0) {
      const defaultWeight = 1 / driver.children.length;

      for (const child of driver.children) {
        const edge: DriverEdge = {
          from: driver.id,
          to: child.id,
          type: 'parent-child',
          weight: defaultWeight,
          direction: 'positive',
        };

        this.addEdge(edge);
        this.indexDriver(child, consoleId, driver.id, depth + 1);
      }
    }
  }

  private indexCrossReferences(driver: SemanticDriver, consoleId: string): void {
    if (driver.crossReferences) {
      for (const refId of driver.crossReferences) {
        const targetNode = this.nodes.get(refId);
        if (targetNode) {
          const edge: DriverEdge = {
            from: driver.id,
            to: refId,
            type: 'cross-reference',
            weight: 0.5, // Default moderate weight for cross-refs
            direction: 'positive',
            targetConsoleId: targetNode.consoleId,
          };
          this.addEdge(edge);
        }
      }
    }

    // Recurse into children
    if (driver.children) {
      for (const child of driver.children) {
        this.indexCrossReferences(child, consoleId);
      }
    }
  }

  private addEdge(edge: DriverEdge): void {
    const forward = this.adjacency.get(edge.from) ?? [];
    // Avoid duplicate edges
    if (!forward.some(e => e.to === edge.to && e.type === edge.type)) {
      forward.push(edge);
      this.adjacency.set(edge.from, forward);
    }

    const reverse = this.reverseAdjacency.get(edge.to) ?? [];
    if (!reverse.some(e => e.from === edge.from && e.type === edge.type)) {
      reverse.push(edge);
      this.reverseAdjacency.set(edge.to, reverse);
    }
  }

  // ── Node Lookups ────────────────────────────────────────────────────────

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  getConsoleName(consoleId: string): string {
    return this.consoleTitles.get(consoleId) ?? consoleId;
  }

  getAllNodeIds(): string[] {
    return Array.from(this.nodes.keys());
  }

  getNodeCount(): number {
    return this.nodes.size;
  }

  getEdgeCount(): number {
    let count = 0;
    for (const edges of Array.from(this.adjacency.values())) {
      count += edges.length;
    }
    return count;
  }

  // ── Direct Relationships ────────────────────────────────────────────────

  /** Get immediate children of a driver */
  getChildren(driverId: string): DriverEdge[] {
    return (this.adjacency.get(driverId) ?? [])
      .filter(e => e.type === 'parent-child');
  }

  /** Get the parent edge for a driver (if not top-level) */
  getParent(driverId: string): DriverEdge | null {
    const incoming = (this.reverseAdjacency.get(driverId) ?? [])
      .filter(e => e.type === 'parent-child');
    return incoming.length > 0 ? incoming[0] : null;
  }

  /** Get cross-reference edges from a driver */
  getCrossRefs(driverId: string): DriverEdge[] {
    return (this.adjacency.get(driverId) ?? [])
      .filter(e => e.type === 'cross-reference');
  }

  /** Get all edges pointing TO this driver (incoming cross-refs + parent) */
  getIncoming(driverId: string): DriverEdge[] {
    return this.reverseAdjacency.get(driverId) ?? [];
  }

  /** Get all outgoing edges from this driver */
  getOutgoing(driverId: string): DriverEdge[] {
    return this.adjacency.get(driverId) ?? [];
  }

  // ── Path Traversal ──────────────────────────────────────────────────────

  /** Get all ancestor IDs from this driver up to the root (parent chain) */
  getAncestors(driverId: string): string[] {
    const ancestors: string[] = [];
    let current = driverId;

    while (true) {
      const parentEdge = this.getParent(current);
      if (!parentEdge) break;
      ancestors.push(parentEdge.from);
      current = parentEdge.from;
    }

    return ancestors;
  }

  /** Get the full path from root to this driver */
  getPathToRoot(driverId: string): string[] {
    return [...this.getAncestors(driverId).reverse(), driverId];
  }

  /** Get all descendant IDs (recursive children) */
  getDescendants(driverId: string): string[] {
    const descendants: string[] = [];
    const stack = [driverId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const children = this.getChildren(current);
      for (const child of children) {
        descendants.push(child.to);
        stack.push(child.to);
      }
    }

    return descendants;
  }

  // ── BFS Traversal ───────────────────────────────────────────────────────

  /**
   * BFS from a driver, following edges up to maxDepth.
   * Follows both parent-child and cross-reference edges.
   * Returns edges encountered during traversal.
   */
  getRelatedDrivers(driverId: string, maxDepth: number = 2): DriverEdge[] {
    const visited = new Set<string>([driverId]);
    const result: DriverEdge[] = [];
    let frontier = [driverId];

    for (let depth = 0; depth < maxDepth && frontier.length > 0; depth++) {
      const nextFrontier: string[] = [];

      for (const nodeId of frontier) {
        // Follow all outgoing edges
        const outgoing = this.getOutgoing(nodeId);
        for (const edge of outgoing) {
          if (!visited.has(edge.to)) {
            visited.add(edge.to);
            result.push(edge);
            nextFrontier.push(edge.to);
          }
        }

        // Also follow incoming cross-references (bidirectional for cross-refs)
        const incoming = this.getIncoming(nodeId)
          .filter(e => e.type === 'cross-reference');
        for (const edge of incoming) {
          if (!visited.has(edge.from)) {
            visited.add(edge.from);
            result.push(edge);
            nextFrontier.push(edge.from);
          }
        }
      }

      frontier = nextFrontier;
    }

    return result;
  }

  /**
   * Find the shortest path between two drivers using BFS.
   * Returns driver IDs in order, or empty array if no path exists.
   */
  getImpactPath(fromId: string, toId: string): string[] {
    if (fromId === toId) return [fromId];

    const visited = new Set<string>([fromId]);
    const parent = new Map<string, string>();
    let frontier = [fromId];

    while (frontier.length > 0) {
      const nextFrontier: string[] = [];

      for (const nodeId of frontier) {
        const neighbors = [
          ...this.getOutgoing(nodeId).map(e => e.to),
          ...this.getIncoming(nodeId).map(e => e.from),
        ];

        for (const neighbor of neighbors) {
          if (visited.has(neighbor)) continue;
          visited.add(neighbor);
          parent.set(neighbor, nodeId);

          if (neighbor === toId) {
            // Reconstruct path
            const path: string[] = [toId];
            let current = toId;
            while (parent.has(current)) {
              current = parent.get(current)!;
              path.unshift(current);
            }
            return path;
          }

          nextFrontier.push(neighbor);
        }
      }

      frontier = nextFrontier;
    }

    return []; // No path found
  }

  // ── Upstream Impact Traversal ───────────────────────────────────────────

  /**
   * Walk UPSTREAM from a driver, collecting parent chain edges.
   * Used by what-if to propagate changes upward to P&L KPIs.
   * Returns edges in bottom-up order.
   */
  getUpstreamChain(driverId: string): DriverEdge[] {
    const chain: DriverEdge[] = [];
    let current = driverId;

    while (true) {
      const parentEdge = this.getParent(current);
      if (!parentEdge) break;
      chain.push(parentEdge);
      current = parentEdge.from;
    }

    return chain;
  }

  /**
   * Walk UPSTREAM including cross-references at each level.
   * Returns all edges that could be impacted by a change at driverId.
   */
  getUpstreamImpact(driverId: string, maxDepth: number = 5): DriverEdge[] {
    const result: DriverEdge[] = [];
    const visited = new Set<string>([driverId]);
    let frontier = [driverId];

    for (let depth = 0; depth < maxDepth && frontier.length > 0; depth++) {
      const nextFrontier: string[] = [];

      for (const nodeId of frontier) {
        // Walk up to parent
        const parentEdge = this.getParent(nodeId);
        if (parentEdge && !visited.has(parentEdge.from)) {
          visited.add(parentEdge.from);
          result.push(parentEdge);
          nextFrontier.push(parentEdge.from);
        }

        // Also include incoming cross-references (who references this driver)
        const incomingCrossRefs = this.getIncoming(nodeId)
          .filter(e => e.type === 'cross-reference');
        for (const edge of incomingCrossRefs) {
          if (!visited.has(edge.from)) {
            visited.add(edge.from);
            result.push(edge);
            nextFrontier.push(edge.from);
          }
        }
      }

      frontier = nextFrontier;
    }

    return result;
  }

  // ── Topological Sort ────────────────────────────────────────────────────

  /**
   * Topological sort of all driver nodes (leaves first, roots last).
   * Used by formula engine to determine computation order.
   */
  topologicalSort(): string[] {
    const inDegree = new Map<string, number>();
    for (const id of Array.from(this.nodes.keys())) {
      inDegree.set(id, 0);
    }

    // Count parent-child in-degrees only (not cross-refs)
    for (const edges of Array.from(this.adjacency.values())) {
      for (const edge of edges) {
        if (edge.type === 'parent-child') {
          inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
        }
      }
    }

    // Start with nodes that have no incoming parent-child edges (root drivers)
    const queue: string[] = [];
    const result: string[] = [];

    // Actually we want leaves first → start with nodes that have no children
    const outDegree = new Map<string, number>();
    for (const [id, edges] of Array.from(this.adjacency.entries())) {
      outDegree.set(id, edges.filter(e => e.type === 'parent-child').length);
    }

    // Leaf nodes (no parent-child outgoing edges)
    for (const [id, deg] of Array.from(outDegree.entries())) {
      if (deg === 0) queue.push(id);
    }

    const visited = new Set<string>();
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);
      result.push(nodeId);

      // Process parent (reverse of parent→child edge)
      const parentEdge = this.getParent(nodeId);
      if (parentEdge && !visited.has(parentEdge.from)) {
        // Decrement the parent's unprocessed children count
        const remaining = (outDegree.get(parentEdge.from) ?? 1) - 1;
        outDegree.set(parentEdge.from, remaining);
        if (remaining <= 0) {
          queue.push(parentEdge.from);
        }
      }
    }

    // Add any unvisited nodes (disconnected)
    for (const id of Array.from(this.nodes.keys())) {
      if (!visited.has(id)) result.push(id);
    }

    return result;
  }

  // ── Subgraph Extraction ─────────────────────────────────────────────────

  /**
   * Get a summary of the graph for a specific console.
   */
  getConsoleDriverIds(consoleId: string): string[] {
    const ids: string[] = [];
    for (const [id, node] of Array.from(this.nodes.entries())) {
      if (node.consoleId === consoleId) ids.push(id);
    }
    return ids;
  }

  /**
   * Get cross-console edges (edges where source and target are in different consoles).
   */
  getCrossConsoleEdges(): DriverEdge[] {
    const crossEdges: DriverEdge[] = [];
    for (const edges of Array.from(this.adjacency.values())) {
      for (const edge of edges) {
        if (edge.type === 'cross-reference') {
          crossEdges.push(edge);
        }
      }
    }
    return crossEdges;
  }

  // ── Statistics ──────────────────────────────────────────────────────────

  getStatistics(): {
    totalNodes: number;
    totalEdges: number;
    parentChildEdges: number;
    crossRefEdges: number;
    maxDepth: number;
    avgBranchingFactor: number;
  } {
    let parentChildEdges = 0;
    let crossRefEdges = 0;
    let maxDepth = 0;
    let totalChildren = 0;
    let nodesWithChildren = 0;

    for (const edges of Array.from(this.adjacency.values())) {
      const pcEdges = edges.filter((e: DriverEdge) => e.type === 'parent-child');
      parentChildEdges += pcEdges.length;
      crossRefEdges += edges.length - pcEdges.length;
      if (pcEdges.length > 0) {
        totalChildren += pcEdges.length;
        nodesWithChildren++;
      }
    }

    for (const node of Array.from(this.nodes.values())) {
      if (node.depth > maxDepth) maxDepth = node.depth;
    }

    return {
      totalNodes: this.nodes.size,
      totalEdges: parentChildEdges + crossRefEdges,
      parentChildEdges,
      crossRefEdges,
      maxDepth,
      avgBranchingFactor: nodesWithChildren > 0 ? totalChildren / nodesWithChildren : 0,
    };
  }
}
