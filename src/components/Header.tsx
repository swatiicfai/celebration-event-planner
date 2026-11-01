'use client';

import React, { memo } from 'react';
import { Sparkles, PlusCircle, Printer, Download, RefreshCw } from 'lucide-react';
import { Currency, EventPlan } from '@/types/event';
import { CURRENCY_CONFIGS } from '@/lib/constants';

interface HeaderProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onOpenCreateModal: () => void;
  onLoadPreset: (index: number) => void;
  onPrintDossier: () => void;
  onExportJSON: () => void;
  eventPlan: EventPlan | null;
  isLoading: boolean;
}

/**
 * Top application header providing preset switching, multi-currency conversion,
 * PDF dossier printing, and JSON export capabilities.
 */
export const Header: React.FC<HeaderProps> = memo(function Header({
  currentCurrency,
  onCurrencyChange,
  onOpenCreateModal,
  onLoadPreset,
  onPrintDossier,
  onExportJSON,
  eventPlan,
  isLoading,
}): React.ReactElement {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-rose-900 to-pink-700 bg-clip-text text-transparent">
                  Celebration AI
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  GenAI Event Planner
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Weddings • Birthdays • Community Celebrations
              </p>
            </div>
          </div>

          {/* Quick Preset Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Presets Buttons */}
            <div
              role="group"
              aria-label="Preset event templates"
              className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600"
            >
              <span className="px-2 text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => onLoadPreset(0)}
                disabled={isLoading}
                aria-label="Load Luxury Wedding Preset"
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                💍 Wedding
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset(1)}
                disabled={isLoading}
                aria-label="Load Neon Birthday Preset"
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                🎂 Birthday
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset(2)}
                disabled={isLoading}
                aria-label="Load Community Fair Preset"
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                🏘️ Community
              </button>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center">
              <label htmlFor="currency-select" className="sr-only">
                Select Currency
              </label>
              <select
                id="currency-select"
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-2.5 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                {Object.values(CURRENCY_CONFIGS).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Export Actions */}
            <button
              type="button"
              onClick={onPrintDossier}
              aria-label="Export Master Dossier as PDF"
              title="Export PDF Master Dossier"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <Printer className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              type="button"
              onClick={onExportJSON}
              disabled={!eventPlan}
              aria-label="Export Event Plan as JSON backup"
              title="Export Raw JSON"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span>JSON</span>
            </button>

            {/* Plan New Event Button */}
            <button
              type="button"
              onClick={onOpenCreateModal}
              disabled={isLoading}
              aria-haspopup="dialog"
              aria-label="Open new event planning dialog"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-sm shadow-rose-200 hover:shadow-md transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  <span>New Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});
