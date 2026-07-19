'use client';

import { AlertCircle } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center max-w-md px-6">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">{error.message || 'Failed to load AI Search.'}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#1c519c] text-white text-sm font-medium rounded-lg hover:bg-[#1c519c] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
