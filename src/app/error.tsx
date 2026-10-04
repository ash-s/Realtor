'use client';

import React, { useEffect } from 'react';
import { RotateCcw, Home, TreePine } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js App Router error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAF9] text-stone-900 font-sans">
      <div className="max-w-md w-full bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white mx-auto flex items-center justify-center shadow-sm">
          <TreePine className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            PlotTerra Platform
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            A temporary display issue occurred while rendering this view. You can reload the state or return to the main explorer.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <Link
            href="/"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition"
          >
            <Home className="w-4 h-4" />
            <span>Go to Explorer</span>
          </Link>
        </div>

        {error.digest && (
          <p className="text-[10px] text-stone-400 font-mono">
            Ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
