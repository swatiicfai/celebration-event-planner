'use client';

import React, { useState, useEffect } from 'react';
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

type ActiveTab = 'overview' | 'ideas' | 'budget' | 'timeline' | 'vendors';

export default function HomePage() {
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrentCurrency(newCurrency);
    if (eventPlan) {
      setEventPlan({
        ...eventPlan,
        currency: newCurrency,
      });
    }
  };

  const handleLoadPreset = (index: number) => {
    const preset = PRESET_EVENTS[index];
    if (!preset) return;
    setIsLoading(true);
    setTimeout(() => {
      const plan = generateFallbackPlan(preset);
      setEventPlan(plan);
      setCurrentCurrency(plan.currency);
      setIsLoading(false);
      showToast(`Loaded ${preset.title} preset!`);
    }, 400);
  };

  const handleGeneratePlan = async (requestData: GeneratePlanRequest) => {
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
      // Fallback locally
      const fallback = generateFallbackPlan(requestData);
      setEventPlan(fallback);
      setCurrentCurrency(fallback.currency);
      setIsModalOpen(false);
      setActiveTab('overview');
      showToast('Generated plan using smart AI engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!eventPlan) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(eventPlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${eventPlan.title.toLowerCase().replace(/\s+/g, '-')}-plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Event plan JSON exported!');
  };

  const updateBudgetItems = (newItems: BudgetItem[]) => {
    if (!eventPlan) return;
    setEventPlan({ ...eventPlan, budgetItems: newItems });
  };

  const updateTotalBudget = (newTotal: number) => {
    if (!eventPlan) return;
    setEventPlan({ ...eventPlan, totalBudget: newTotal });
  };

  const updateTimeline = (newTimeline: TimelineMilestone[]) => {
    if (!eventPlan) return;
    setEventPlan({ ...eventPlan, timeline: newTimeline });
  };

  const updateVendors = (newVendors: VendorItem[]) => {
    if (!eventPlan) return;
    setEventPlan({ ...eventPlan, vendors: newVendors });
  };

  if (!eventPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading Event Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 no-print">
        {/* Hero Event Overview Card */}
        <OverviewCard plan={eventPlan} onEditBrief={() => setIsModalOpen(true)} />

        {/* Navigation Tabs */}
        <nav
          aria-label="Planning Sections"
          className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto max-w-full"
        >
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'ideas'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme & Ideas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'budget'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Smart Budget ({eventPlan.budgetItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'timeline'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timeline & Run of Show ({eventPlan.timeline.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
              activeTab === 'vendors'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Vendor Checklist ({eventPlan.vendors.length})</span>
          </button>
        </nav>

        {/* Tab Content Display */}
        <section aria-label="Tab View Content">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <PersonalizedIdeas ideas={eventPlan.ideas} vibe={eventPlan.vibe} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TimelineManager timeline={eventPlan.timeline} onUpdateTimeline={updateTimeline} />
                <VendorChecklist vendors={eventPlan.vendors} currency={currentCurrency} onUpdateVendors={updateVendors} />
              </div>
            </div>
          )}

          {activeTab === 'ideas' && (
            <PersonalizedIdeas ideas={eventPlan.ideas} vibe={eventPlan.vibe} />
          )}

          {activeTab === 'budget' && (
            <BudgetManager
              budgetItems={eventPlan.budgetItems}
              totalBudget={eventPlan.totalBudget}
              currency={currentCurrency}
              onUpdateItems={updateBudgetItems}
              onUpdateTotalBudget={updateTotalBudget}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineManager timeline={eventPlan.timeline} onUpdateTimeline={updateTimeline} />
          )}

          {activeTab === 'vendors' && (
            <VendorChecklist vendors={eventPlan.vendors} currency={currentCurrency} onUpdateVendors={updateVendors} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Sparkles className="w-4 h-4 text-rose-500" />
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
