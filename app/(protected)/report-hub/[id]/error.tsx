'use client';

interface ReportDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ReportDetailError({ error, reset }: ReportDetailErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Report Unavailable</h2>
        <p className="text-gray-500 text-sm">{error.message || 'Unable to load this report.'}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#003B2C] text-white rounded-lg text-sm font-medium hover:bg-[#007A3D] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
