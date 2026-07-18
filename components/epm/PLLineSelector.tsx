'use client';

interface PLLineSelectorProps {
  lines: string[];
  selected: string;
  onSelect: (line: string) => void;
}

export default function PLLineSelector({ lines, selected, onSelect }: PLLineSelectorProps) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {lines.map((line) => (
        <button
          key={line}
          onClick={() => onSelect(line)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            selected === line
              ? 'bg-[#003B2C] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          {line}
        </button>
      ))}
    </div>
  );
}
