'use client';

import React from 'react';
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

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  onOpenCreateModal,
  onLoadPreset,
  onPrintDossier,
  onExportJSON,
  eventPlan,
  isLoading,
}) => {
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
            {/* Quick Presets Dropdown / Buttons */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              <span className="px-2 text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => onLoadPreset(0)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition disabled:opacity-50"
                title="Load Luxury Wedding Preset"
              >
                💍 Wedding
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset(1)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition disabled:opacity-50"
                title="Load Neon Birthday Preset"
              >
                🎂 Birthday
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset(2)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 hover:shadow-xs transition disabled:opacity-50"
                title="Load Community Fair Preset"
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
                className="text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 border-none rounded-xl px-2.5 py-2 font-medium text-slate-700 focus:ring-2 focus:ring-rose-500 cursor-pointer transition"
              >
                {Object.values(CURRENCY_CONFIGS).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Print / Export Button */}
            {eventPlan && (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={onPrintDossier}
                  aria-label="Print or Save PDF Dossier"
                  title="Print / Save PDF Master Dossier"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-2xs"
                >
                  <Printer className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onExportJSON}
                  aria-label="Export Event JSON"
                  title="Export raw JSON"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-2xs"
                >
                  <Download className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  <span>JSON</span>
                </button>
              </div>
            )}

            {/* Create New Plan Button */}
            <button
              type="button"
              onClick={onOpenCreateModal}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 rounded-xl shadow-md shadow-rose-200 active:scale-95 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xs:inline">New Event Plan</span>
                  <span className="xs:hidden">New</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

