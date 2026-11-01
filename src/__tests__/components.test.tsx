import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('UI Components Render Suite', () => {
  const samplePlan = generateFallbackPlan(PRESET_EVENTS[0]);

  it('renders Header with logo, title, and actions', () => {
    render(
      <Header
        currentCurrency="USD"
        onCurrencyChange={vi.fn()}
        onOpenCreateModal={vi.fn()}
        onLoadPreset={vi.fn()}
        onPrintDossier={vi.fn()}
        onExportJSON={vi.fn()}
        eventPlan={samplePlan}
        isLoading={false}
      />
    );
    expect(screen.getByText('Celebration AI')).toBeInTheDocument();
    expect(screen.getByText('New Plan')).toBeInTheDocument();
  });

  it('renders OverviewCard with title and metrics', () => {
    render(<OverviewCard plan={samplePlan} onEditBrief={vi.fn()} />);
    expect(screen.getByText(samplePlan.title)).toBeInTheDocument();
    expect(screen.getByText('Total Budget')).toBeInTheDocument();
    expect(screen.getByText('Milestones Done')).toBeInTheDocument();
    expect(screen.getByText('Guest Headcount')).toBeInTheDocument();
  });

  it('renders PersonalizedIdeas with theme concept and color swatches', () => {
    render(
      <PersonalizedIdeas ideas={samplePlan.ideas} vibe={samplePlan.vibe} />
    );
    expect(screen.getByText(samplePlan.ideas.themeName)).toBeInTheDocument();
    expect(screen.getByText('Curated Color Palette')).toBeInTheDocument();
    expect(screen.getByText('Decor & Atmosphere Concepts')).toBeInTheDocument();
  });

  it('renders BudgetManager with financial summary and table', () => {
    render(
      <BudgetManager
        budgetItems={samplePlan.budgetItems}
        totalBudget={samplePlan.totalBudget}
        currency="USD"
        onUpdateItems={vi.fn()}
        onUpdateTotalBudget={vi.fn()}
      />
    );
    expect(screen.getByText('Financial Health & Expense Allocator')).toBeInTheDocument();
    expect(screen.getByText('Add Expense')).toBeInTheDocument();
  });

  it('renders TimelineManager with timeline progress and milestones', () => {
    render(
      <TimelineManager
        timeline={samplePlan.timeline}
        onUpdateTimeline={vi.fn()}
      />
    );
    expect(screen.getByText('Interactive Timeline & Run of Show')).toBeInTheDocument();
    expect(screen.getByText('Add Milestone')).toBeInTheDocument();
  });

  it('renders VendorChecklist with supplier cards and filters', () => {
    render(
      <VendorChecklist
        vendors={samplePlan.vendors}
        currency="USD"
        onUpdateVendors={vi.fn()}
      />
    );
    expect(screen.getByText('Vendor Management & Checklists')).toBeInTheDocument();
    expect(screen.getByText('Add Vendor')).toBeInTheDocument();
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

