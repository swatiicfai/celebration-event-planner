import React from 'react';

/**
 * Global App Router loading state for seamless Next.js Suspense transitions.
 */
export default function Loading(): React.ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex items-center justify-center bg-slate-50"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-700">
          Loading Celebration Assistant...
        </p>
        <span className="sr-only">Loading application resources</span>
      </div>
    </div>
  );
}

