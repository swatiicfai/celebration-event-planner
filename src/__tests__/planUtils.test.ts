import { describe, it, expect } from 'vitest';
import { calculateBudgetMetrics, calculateTimelineProgress, calculateVendorStats, getDaysRemaining } from '@/lib/planUtils';
import { BudgetItem, TimelineMilestone, VendorItem } from '@/types/event';

describe('planUtils - Budget Metrics', () => {
  it('correctly calculates total estimated, actual, and remaining budget', () => {
    const items: BudgetItem[] = [
      { id: '1', category: 'Venue', name: 'Hall', estimatedCost: 4000, actualCost: 3800, paidStatus: 'deposit_paid' },
      { id: '2', category: 'Catering & Drinks', name: 'Buffet', estimatedCost: 3000, actualCost: 3200, paidStatus: 'fully_paid' },
      { id: '3', category: 'Photography & Video', name: 'Photos', estimatedCost: 1500, actualCost: 0, paidStatus: 'unpaid' },
    ];
    const totalBudget = 10000;

    const metrics = calculateBudgetMetrics(items, totalBudget);

    expect(metrics.totalEstimated).toBe(8500);
    expect(metrics.totalActual).toBe(7000);
    expect(metrics.isOverBudget).toBe(false);
    expect(metrics.remainingBudget).toBe(3000); // 10000 - 7000
    expect(metrics.categoryBreakdown['Venue'].count).toBe(1);
    expect(metrics.categoryBreakdown['Catering & Drinks'].actual).toBe(3200);
  });

  it('detects over-budget scenario when estimated exceeds total budget', () => {
    const items: BudgetItem[] = [
      { id: '1', category: 'Venue', name: 'Estate', estimatedCost: 12000, actualCost: 0, paidStatus: 'unpaid' },
    ];
    const metrics = calculateBudgetMetrics(items, 10000);
    expect(metrics.isOverBudget).toBe(true);
    expect(metrics.variance).toBe(-2000);
  });
});

describe('planUtils - Timeline Progress', () => {
  it('computes completion percentages and groups by phase', () => {
    const milestones: TimelineMilestone[] = [
      { id: '1', phase: 'Planning Phase (Months Before)', title: 'Venue', description: 'Book', targetTimeframe: '6 mo', completed: true, priority: 'high' },
      { id: '2', phase: 'Planning Phase (Months Before)', title: 'Photographer', description: 'Call', targetTimeframe: '5 mo', completed: false, priority: 'high' },
      { id: '3', phase: 'Final Preparations (Week Of)', title: 'Rehearsal', description: 'Practice', targetTimeframe: '2 d', completed: true, priority: 'medium' },
      { id: '4', phase: 'Day-of Event (Run of Show)', title: 'Entrance', description: 'Music', targetTimeframe: '7 PM', completed: false, priority: 'low' },
    ];

    const progress = calculateTimelineProgress(milestones);
    expect(progress.totalMilestones).toBe(4);
    expect(progress.completedMilestones).toBe(2);
    expect(progress.percentComplete).toBe(50);
    expect(progress.pendingHighPriority).toBe(1);
    expect(progress.groupedByPhase['Planning Phase (Months Before)'].length).toBe(2);
  });
});

describe('planUtils - Vendor Stats', () => {
  it('correctly aggregates vendor states and booking rates', () => {
    const vendors: VendorItem[] = [
      { id: '1', category: 'Venue', vendorName: 'Grand Ballroom', status: 'Booked', estimatedCost: 5000 },
      { id: '2', category: 'Catering', vendorName: 'Chef Special', status: 'Completed', estimatedCost: 3000 },
      { id: '3', category: 'Music & DJ', vendorName: 'DJ Spin', status: 'Quoted', estimatedCost: 1200 },
      { id: '4', category: 'Photography', vendorName: 'Foto Art', status: 'To Research', estimatedCost: 2000 },
    ];

    const stats = calculateVendorStats(vendors);
    expect(stats.totalVendors).toBe(4);
    expect(stats.bookedCount).toBe(2); // Booked + Completed
    expect(stats.quotedCount).toBe(1);
    expect(stats.toResearchCount).toBe(1);
    expect(stats.bookedPercent).toBe(50);
  });
});

describe('planUtils - Days Remaining', () => {
  it('returns valid days calculation', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const result = getDaysRemaining(dateStr);
    expect(result.days).toBe(1);
    expect(result.label).toBe('Tomorrow');
    expect(result.isPast).toBe(false);
  });
});

