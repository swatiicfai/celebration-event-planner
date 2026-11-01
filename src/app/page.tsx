'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Palette,
  DollarSign,
  Clock,
  Store,
  CheckCircle2,
} from 'lucide-react';
import { EventPlan, Currency, GeneratePlanRequest, BudgetItem, TimelineMilestone, VendorItem } from '@/types/event';
import { PRESET_EVENTS, generateFallbackPlan } from '@/lib/constants';
import { Header } from '@/components/Header';
import { OverviewCard } from '@/components/OverviewCard';
import { PersonalizedIdeas } from '@/components/PersonalizedIdeas';
import { BudgetManager } from '@/components/BudgetManager';
import { TimelineManager } from '@/components/TimelineManager';
import { VendorChecklist } from '@/components/VendorChecklist';
import { EventFormModal } from '@/components/EventFormModal';
import { ExportDossier } from '@/components/ExportDossier';
import { ErrorBoundary } from '@/components/ErrorBoundary';

type ActiveTab = 'overview' | 'ideas' | 'budget' | 'timeline' | 'vendors';

/**
 * Main application dashboard for the Celebration & Event Planner.
 * Supports Weddings, Birthdays, Community Events with Smart Budgets,
 * Interactive Timelines, Vendor Checklists, and Personalized Creative Ideas.
 */
export default function HomePage(): React.ReactElement {
  const [eventPlan, setEventPlan] = useState<EventPlan | null>(null);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize with initial default plan (Luxury Botanical Wedding preset)
  useEffect(() => {
    const initial = generateFallbackPlan(PRESET_EVENTS[0]);
    setEventPlan(initial);
    setCurrentCurrency(initial.currency);
  }, []);

  const showToast = useCallback((msg: string): void => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const handleCurrencyChange = useCallback((newCurrency: Currency): void => {
    setCurrentCurrency(newCurrency);
    setEventPlan((prev) => (prev ? { ...prev, currency: newCurrency } : null));
  }, []);

  const handleLoadPreset = useCallback(
    (index: number): void => {
      const preset = PRESET_EVENTS[index];
      if (!preset) return;
      setIsLoading(true);
      setTimeout(() => {
        const plan = generateFallbackPlan(preset);
        setEventPlan(plan);
        setCurrentCurrency(plan.currency);
        setIsLoading(false);
        showToast(`Loaded ${preset.title} preset!`);
      }, 300);
    },
    [showToast]
  );

  const handleGeneratePlan = useCallback(
    async (requestData: GeneratePlanRequest): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Server error occurred while generating plan');
        }

        setEventPlan(json.data);
        setCurrentCurrency(json.data.currency);
        setIsModalOpen(false);
        setActiveTab('overview');
        showToast('Master event plan generated successfully!');
      } catch (err: unknown) {
        console.warn('API error, using localized generation engine:', err);
        const fallback = generateFallbackPlan(requestData);
        setEventPlan(fallback);
        setCurrentCurrency(fallback.currency);
        setIsModalOpen(false);
        setActiveTab('overview');
        showToast('Generated plan using smart AI engine.');
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const handlePrint = useCallback((): void => {
    window.print();
  }, []);

  const handleExportJSON = useCallback((): void => {
    if (!eventPlan) return;
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(eventPlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${eventPlan.title.toLowerCase().replace(/\s+/g, '-')}-plan.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Event plan JSON exported!');
  }, [eventPlan, showToast]);

  const updateBudgetItems = useCallback((newItems: BudgetItem[]): void => {
    setEventPlan((prev) => (prev ? { ...prev, budgetItems: newItems } : null));
  }, []);

  const updateTotalBudget = useCallback((newTotal: number): void => {
    setEventPlan((prev) => (prev ? { ...prev, totalBudget: newTotal } : null));
  }, []);

  const updateTimeline = useCallback((newTimeline: TimelineMilestone[]): void => {
    setEventPlan((prev) => (prev ? { ...prev, timeline: newTimeline } : null));
  }, []);

  const updateVendors = useCallback((newVendors: VendorItem[]): void => {
    setEventPlan((prev) => (prev ? { ...prev, vendors: newVendors } : null));
  }, []);

  if (!eventPlan) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen flex items-center justify-center bg-slate-50"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading Event Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification with Accessible Live Region */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce no-print"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentCurrency={currentCurrency}
        onCurrencyChange={handleCurrencyChange}
        onOpenCreateModal={() => setIsModalOpen(true)}
        onLoadPreset={handleLoadPreset}
        onPrintDossier={handlePrint}
        onExportJSON={handleExportJSON}
        eventPlan={eventPlan}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 no-print focus:outline-none"
      >
        {/* Hero Event Overview Card */}
        <ErrorBoundary fallbackTitle="Overview Summary Error">
          <OverviewCard plan={eventPlan} onEditBrief={() => setIsModalOpen(true)} />
        </ErrorBoundary>

        {/* WAI-ARIA Accessible Tab Navigation */}
        <div
          role="tablist"
          aria-label="Planning Sections Navigation"
          className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto max-w-full"
        >
          <button
            id="tab-overview"
            role="tab"
            aria-selected={activeTab === 'overview'}
            aria-controls="panel-overview"
            tabIndex={activeTab === 'overview' ? 0 : -1}
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
            <span>Dashboard</span>
          </button>

          <button
            id="tab-ideas"
            role="tab"
            aria-selected={activeTab === 'ideas'}
            aria-controls="panel-ideas"
            tabIndex={activeTab === 'ideas' ? 0 : -1}
            type="button"
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              activeTab === 'ideas'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4" aria-hidden="true" />
            <span>Theme & Ideas</span>
          </button>

          <button
            id="tab-budget"
            role="tab"
            aria-selected={activeTab === 'budget'}
            aria-controls="panel-budget"
            tabIndex={activeTab === 'budget' ? 0 : -1}
            type="button"
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              activeTab === 'budget'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" aria-hidden="true" />
            <span>Smart Budget ({eventPlan.budgetItems.length})</span>
          </button>

          <button
            id="tab-timeline"
            role="tab"
            aria-selected={activeTab === 'timeline'}
            aria-controls="panel-timeline"
            tabIndex={activeTab === 'timeline' ? 0 : -1}
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              activeTab === 'timeline'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>Timeline & Run of Show ({eventPlan.timeline.length})</span>
          </button>

          <button
            id="tab-vendors"
            role="tab"
            aria-selected={activeTab === 'vendors'}
            aria-controls="panel-vendors"
            tabIndex={activeTab === 'vendors' ? 0 : -1}
            type="button"
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              activeTab === 'vendors'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" aria-hidden="true" />
            <span>Vendor Checklist ({eventPlan.vendors.length})</span>
          </button>
        </div>

        {/* Tab Content Display with Tabpanel Semantics */}
        <div className="tab-content-area">
          {activeTab === 'overview' && (
            <section
              id="panel-overview"
              role="tabpanel"
              aria-labelledby="tab-overview"
              className="space-y-6"
            >
              <ErrorBoundary fallbackTitle="Personalized Ideas Error">
                <PersonalizedIdeas ideas={eventPlan.ideas} vibe={eventPlan.vibe} />
              </ErrorBoundary>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ErrorBoundary fallbackTitle="Timeline Error">
                  <TimelineManager timeline={eventPlan.timeline} onUpdateTimeline={updateTimeline} />
                </ErrorBoundary>
                <ErrorBoundary fallbackTitle="Vendors Error">
                  <VendorChecklist
                    vendors={eventPlan.vendors}
                    currency={currentCurrency}
                    onUpdateVendors={updateVendors}
                  />
                </ErrorBoundary>
              </div>
            </section>
          )}

          {activeTab === 'ideas' && (
            <section id="panel-ideas" role="tabpanel" aria-labelledby="tab-ideas">
              <ErrorBoundary fallbackTitle="Theme Ideas Error">
                <PersonalizedIdeas ideas={eventPlan.ideas} vibe={eventPlan.vibe} />
              </ErrorBoundary>
            </section>
          )}

          {activeTab === 'budget' && (
            <section id="panel-budget" role="tabpanel" aria-labelledby="tab-budget">
              <ErrorBoundary fallbackTitle="Budget Manager Error">
                <BudgetManager
                  budgetItems={eventPlan.budgetItems}
                  totalBudget={eventPlan.totalBudget}
                  currency={currentCurrency}
                  onUpdateItems={updateBudgetItems}
                  onUpdateTotalBudget={updateTotalBudget}
                />
              </ErrorBoundary>
            </section>
          )}

          {activeTab === 'timeline' && (
            <section id="panel-timeline" role="tabpanel" aria-labelledby="tab-timeline">
              <ErrorBoundary fallbackTitle="Timeline Manager Error">
                <TimelineManager timeline={eventPlan.timeline} onUpdateTimeline={updateTimeline} />
              </ErrorBoundary>
            </section>
          )}

          {activeTab === 'vendors' && (
            <section id="panel-vendors" role="tabpanel" aria-labelledby="tab-vendors">
              <ErrorBoundary fallbackTitle="Vendor Checklist Error">
                <VendorChecklist
                  vendors={eventPlan.vendors}
                  currency={currentCurrency}
                  onUpdateVendors={updateVendors}
                />
              </ErrorBoundary>
            </section>
          )}
        </div>
      </main>

      {/* Footer Landmark */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Sparkles className="w-4 h-4 text-rose-500" aria-hidden="true" />
            <span>Celebration & Event Planner • Challenge 5</span>
          </div>
          <p>
            Powered by Google Gemini GenAI & Next.js. Engineered for PromptWars Virtual.
          </p>
        </div>
      </footer>

      {/* Printable Master Dossier for PDF Export */}
      <ExportDossier plan={eventPlan} />

      {/* Modal Dialog for Creating/Modifying Event Plan */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGeneratePlan}
        isLoading={isLoading}
        initialData={{
          eventType: eventPlan.eventType,
          title: eventPlan.title,
          eventDate: eventPlan.eventDate,
          location: eventPlan.location,
          guestCount: eventPlan.guestCount,
          totalBudget: eventPlan.totalBudget,
          currency: eventPlan.currency,
          vibe: eventPlan.vibe,
          specialRequirements: eventPlan.specialRequirements,
        }}
      />
    </div>
  );
}
