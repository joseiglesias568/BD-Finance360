"use client";

import { AlertCircle } from "lucide-react";

export default function Error({ error: _error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-4">
      <AlertCircle className="h-10 w-10 text-red-500" />
      <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
      <p className="text-gray-600 max-w-md">Unable to load executive summary. Please try again.</p>
      <button
        onClick={reset}
        className="px-5 py-2 rounded-md text-white text-sm font-medium"
        style={{ backgroundColor: "#003B2C" }}
      >
        Try Again
      </button>
    </div>
  );
}
