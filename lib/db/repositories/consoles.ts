import prisma from '../prisma';

export interface DBDriverMetric {
  name: string;
  unit: string;
  currentValue: string;
  target: string;
  direction: string;
  variancePercent?: number;
}

export interface DBConsole {
  id: number;
  title: string;
  category: string;
  segment: string;
  objective: string;
  keyDrivers: {
    name: string;
    subDrivers: string[];
    metrics: DBDriverMetric[];
  }[];
}

export async function getBusinessConsoles(companyId: number = 1): Promise<DBConsole[]> {
  const consoles = await prisma.businessConsole.findMany({
    where: { companyId },
    include: {
      drivers: {
        where: { parentDriverId: null }, // top-level drivers only
        orderBy: { sortOrder: 'asc' },
        include: {
          metrics: true,
          children: {
            orderBy: { sortOrder: 'asc' },
            include: {
              metrics: true,
            },
          },
        },
      },
    },
    orderBy: { id: 'asc' },
  });

  return consoles.map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
    segment: c.segment,
    objective: c.objective,
    keyDrivers: c.drivers.map(d => {
      // Metrics live on sub-drivers (children), not top-level drivers
      // Aggregate first metric from each child to represent the top-level driver
      const childMetrics = d.children.flatMap(child =>
        child.metrics.map(m => ({
          name: m.name,
          unit: m.unit,
          currentValue: m.currentValue,
          target: m.target,
          direction: m.direction,
        }))
      );
      // Also include any direct metrics on this driver
      const directMetrics = d.metrics.map(m => ({
        name: m.name,
        unit: m.unit,
        currentValue: m.currentValue,
        target: m.target,
        direction: m.direction,
      }));
      return {
        name: d.name,
        subDrivers: d.children.map(child => child.name),
        metrics: [...directMetrics, ...childMetrics],
      };
    }),
  }));
}

// ── Driver tree with IDs (for Hierarchy View) ──

export interface DriverTreeNode {
  id: number;
  name: string;
  description: string;
  causalityWeight: number | null;
  impactDirection: string;
  children: DriverTreeNode[];
  metrics: { name: string; currentValue: string; target: string; unit: string }[];
}

export interface ConsoleTree {
  id: number;
  title: string;
  category: string;
  segment: string;
  drivers: DriverTreeNode[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDriverNode(d: any): DriverTreeNode {
  return {
    id: d.id,
    name: d.name,
    description: d.description ?? '',
    causalityWeight: d.causalityWeight,
    impactDirection: d.impactDirection ?? '',
    children: (d.children ?? []).map(mapDriverNode),
    metrics: (d.metrics ?? []).map((m: { name: string; currentValue: string; target: string; unit: string }) => ({
      name: m.name,
      currentValue: m.currentValue,
      target: m.target,
      unit: m.unit,
    })),
  };
}

/** Get all consoles with full driver tree (IDs included) for hierarchy views */
export async function getConsoleDriverTree(companyId: number = 1): Promise<ConsoleTree[]> {
  const consoles = await prisma.businessConsole.findMany({
    where: { companyId },
    include: {
      drivers: {
        where: { parentDriverId: null },
        orderBy: { sortOrder: 'asc' },
        include: {
          metrics: true,
          children: {
            orderBy: { sortOrder: 'asc' },
            include: {
              metrics: true,
              children: {
                orderBy: { sortOrder: 'asc' },
                include: { metrics: true },
              },
            },
          },
        },
      },
    },
    orderBy: { id: 'asc' },
  });

  return consoles.map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
    segment: c.segment,
    drivers: c.drivers.map(mapDriverNode),
  }));
}

/** Get a single console with full driver tree and metrics */
export async function getConsoleWithDrivers(consoleId: number) {
  const console = await prisma.businessConsole.findUnique({
    where: { id: consoleId },
    include: {
      drivers: {
        orderBy: { sortOrder: 'asc' },
        include: {
          metrics: true,
          children: {
            orderBy: { sortOrder: 'asc' },
            include: {
              metrics: true,
            },
          },
        },
      },
    },
  });

  return console;
}
