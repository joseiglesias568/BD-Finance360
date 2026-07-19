'use client';

interface PlanningSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  defaultValue: number;
}

export default function PlanningSlider({
  label, value, min, max, step, unit, onChange, defaultValue,
}: PlanningSliderProps) {
  const isChanged = Math.abs(value - defaultValue) > step * 0.1;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-bold tabular-nums ${isChanged ? 'text-[#1c519c]' : 'text-gray-900'}`}>
            {unit === '$M' || unit === '$B' ? `${unit === '$B' ? '$' : '$'}${value.toFixed(unit === '$B' ? 1 : 0)}${unit === '$B' ? 'B' : 'M'}` :
             unit === '%' ? `${value.toFixed(1)}%` :
             unit === 'stores' ? value.toLocaleString() :
             `${value}`}
          </span>
          {isChanged && (
            <button
              onClick={() => onChange(defaultValue)}
              className="text-[9px] text-gray-400 hover:text-gray-600 px-1 py-0.5 rounded border border-gray-200"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #1c519c 0%, #1c519c ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-gray-400">
        <span>{unit === '%' ? `${min}%` : unit === '$B' ? `$${min}B` : `${min}`}</span>
        <span>{unit === '%' ? `${max}%` : unit === '$B' ? `$${max}B` : `${max}`}</span>
      </div>
    </div>
  );
}
