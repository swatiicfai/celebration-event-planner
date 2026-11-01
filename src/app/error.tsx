'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global App Router error recovery boundary for unexpected runtime exceptions.
 */
export default function ErrorBoundaryPage({
  error,
  reset,
}: ErrorProps): React.ReactElement {
  useEffect(() => {
    console.error('Unhandled application exception:', error);
  }, [error]);

  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-slate-50 p-4"
    >
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-600">
          We encountered an unexpected error while loading your celebration planner.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 transition focus:outline-none focus:ring-4 focus:ring-rose-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}

