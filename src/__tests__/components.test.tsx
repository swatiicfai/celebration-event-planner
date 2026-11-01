import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/Header';
import { OverviewCard } from '@/components/OverviewCard';
import { PersonalizedIdeas } from '@/components/PersonalizedIdeas';
import { BudgetManager } from '@/components/BudgetManager';
import { TimelineManager } from '@/components/TimelineManager';
import { VendorChecklist } from '@/components/VendorChecklist';
import { ExportDossier } from '@/components/ExportDossier';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { generateFallbackPlan, PRESET_EVENTS } from '@/lib/constants';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('UI Components Render & Interaction Suite', () => {
  const samplePlan = generateFallbackPlan(PRESET_EVENTS[0]);

  it('renders Header with logo, title, and handles preset clicks', () => {
    const handlePreset = vi.fn();
    render(
      <Header
        currentCurrency="USD"
        onCurrencyChange={vi.fn()}
        onOpenCreateModal={vi.fn()}
        onLoadPreset={handlePreset}
        onPrintDossier={vi.fn()}
        onExportJSON={vi.fn()}
        eventPlan={samplePlan}
        isLoading={false}
      />
    );
    expect(screen.getByText('Celebration AI')).toBeInTheDocument();
    expect(screen.getByText('New Plan')).toBeInTheDocument();

    const weddingPresetBtn = screen.getByLabelText('Load Luxury Wedding Preset');
    fireEvent.click(weddingPresetBtn);
    expect(handlePreset).toHaveBeenCalledWith(0);
  });

  it('renders OverviewCard with title and metrics', () => {
    render(<OverviewCard plan={samplePlan} onEditBrief={vi.fn()} />);
    expect(screen.getByText(samplePlan.title)).toBeInTheDocument();
    expect(screen.getByText('Total Budget')).toBeInTheDocument();
    expect(screen.getByText('Milestones Done')).toBeInTheDocument();
    expect(screen.getByText('Guest Headcount')).toBeInTheDocument();
  });

  it('renders PersonalizedIdeas with theme concept and copies HEX code', () => {
    render(
      <PersonalizedIdeas ideas={samplePlan.ideas} vibe={samplePlan.vibe} />
    );
    expect(screen.getByText(samplePlan.ideas.themeName)).toBeInTheDocument();
    expect(screen.getByText('Curated Color Palette')).toBeInTheDocument();

    const swatchButtons = screen.getAllByRole('button');
    expect(swatchButtons.length).toBeGreaterThan(0);
  });

  it('renders BudgetManager and handles adding an expense', () => {
    const updateItems = vi.fn();
    render(
      <BudgetManager
        budgetItems={samplePlan.budgetItems}
        totalBudget={samplePlan.totalBudget}
        currency="USD"
        onUpdateItems={updateItems}
        onUpdateTotalBudget={vi.fn()}
      />
    );
    expect(screen.getByText('Financial Health & Expense Allocator')).toBeInTheDocument();

    const addBtn = screen.getByText('Add Expense');
    fireEvent.click(addBtn);

    // Fill form
    const nameInput = screen.getByLabelText('Item Name *');
    const costInput = screen.getByLabelText('Estimated Cost (USD) *');
    fireEvent.change(nameInput, { target: { value: 'Custom Acoustic Trio' } });
    fireEvent.change(costInput, { target: { value: '1800' } });

    const saveBtn = screen.getByText('Save Item');
    fireEvent.click(saveBtn);

    expect(updateItems).toHaveBeenCalled();
  });

  it('renders TimelineManager and toggles milestone completion', () => {
    const updateTimeline = vi.fn();
    render(
      <TimelineManager
        timeline={samplePlan.timeline}
        onUpdateTimeline={updateTimeline}
      />
    );
    expect(screen.getByText('Interactive Timeline & Run of Show')).toBeInTheDocument();

    const toggleBtns = screen.getAllByLabelText(/Mark milestone/i);
    expect(toggleBtns.length).toBeGreaterThan(0);
    fireEvent.click(toggleBtns[0]);
    expect(updateTimeline).toHaveBeenCalled();
  });

  it('renders VendorChecklist and filters vendors', () => {
    const updateVendors = vi.fn();
    render(
      <VendorChecklist
        vendors={samplePlan.vendors}
        currency="USD"
        onUpdateVendors={updateVendors}
      />
    );
    expect(screen.getByText('Vendor Management & Checklists')).toBeInTheDocument();

    const addVendorBtn = screen.getByText('Add Vendor');
    fireEvent.click(addVendorBtn);

    const vendorNameInput = screen.getByLabelText('Vendor Name *');
    fireEvent.change(vendorNameInput, { target: { value: 'Artisan Bloom Studio' } });

    const saveBtn = screen.getByText('Save Vendor');
    fireEvent.click(saveBtn);
    expect(updateVendors).toHaveBeenCalled();
  });

  it('renders ExportDossier with print layout sections', () => {
    render(<ExportDossier plan={samplePlan} />);
    expect(screen.getByText('Official Master Event Dossier')).toBeInTheDocument();
    expect(screen.getByText('1. Creative Theme & Concept')).toBeInTheDocument();
    expect(screen.getByText('2. Financial Allocation & Budget Sheet')).toBeInTheDocument();
  });

  it('renders ErrorBoundary fallback when a child error is caught', () => {
    const ProblemChild = () => {
      throw new Error('Test component explosion');
    };

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallbackTitle="Custom Section Error">
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Section Error')).toBeInTheDocument();
    expect(screen.getByText('Reload Section')).toBeInTheDocument();

    spy.mockRestore();
  });
});
