'use client';

interface QuarterSelectorProps {
  quarters: string[];
  selected: string;
  onSelect: (q: string) => void;
}

export default function QuarterSelector({ quarters, selected, onSelect }: QuarterSelectorProps) {
  return (
    <div className="flex gap-1.5">
      {quarters.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selected === q
              ? 'bg-[#003B2C] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
