'use client';

import DriverTreeNav from '../shared/DriverTreeNav';
import type { DriverNode } from '../shared/DriverTreeNav';
import DriverDetail from '../shared/DriverDetail';
import type { DriverDetailData } from '../shared/DriverDetail';

interface DriversTabProps {
  driverTree: DriverNode[];
  selectedDriverId: string | null;
  onSelectDriver: (id: string) => void;
  getDriverDetail: (id: string) => DriverDetailData | null;
}

export default function DriversTab({ driverTree, selectedDriverId, onSelectDriver, getDriverDetail }: DriversTabProps) {
  const detail = selectedDriverId ? getDriverDetail(selectedDriverId) : null;

  return (
    <div className="flex gap-4 min-h-[600px]">
      {/* Left: Driver Tree Navigator */}
      <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-y-auto max-h-[calc(100vh-220px)] sticky top-[140px]">
        <DriverTreeNav
          drivers={driverTree}
          selectedId={selectedDriverId}
          onSelect={onSelectDriver}
        />
      </div>

      {/* Right: Driver Detail Panel */}
      <div className="flex-1 min-w-0">
        <DriverDetail driver={detail} />
      </div>
    </div>
  );
}
