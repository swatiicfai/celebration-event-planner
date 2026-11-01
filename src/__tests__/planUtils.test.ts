import { describe, it, expect } from 'vitest';
import {
  calculateBudgetMetrics,
  calculateTimelineProgress,
  calculateVendorStats,
  getDaysRemaining,
} from '@/lib/planUtils';
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
    expect(metrics.totalPaid).toBe(5100); // 3800*0.5 (1900) + 3200 = 5100
    expect(metrics.isOverBudget).toBe(false);
    expect(metrics.remainingBudget).toBe(3000); // 10000 - 7000
    expect(metrics.variance).toBe(1500); // 10000 - 8500
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

  it('detects over-budget scenario when actual exceeds total budget even if estimated is under', () => {
    const items: BudgetItem[] = [
      { id: '1', category: 'Venue', name: 'Estate', estimatedCost: 8000, actualCost: 11000, paidStatus: 'fully_paid' },
    ];
    const metrics = calculateBudgetMetrics(items, 10000);
    expect(metrics.isOverBudget).toBe(true);
  });

  it('handles empty budget items gracefully without NaN', () => {
    const metrics = calculateBudgetMetrics([], 5000);
    expect(metrics.totalEstimated).toBe(0);
    expect(metrics.totalActual).toBe(0);
    expect(metrics.totalPaid).toBe(0);
    expect(metrics.remainingBudget).toBe(5000);
    expect(metrics.isOverBudget).toBe(false);
    expect(Object.keys(metrics.categoryBreakdown).length).toBe(0);
  });

  it('handles deposit_paid when actual cost is zero using estimated cost', () => {
    const items: BudgetItem[] = [
      { id: '1', category: 'Venue', name: 'Tent', estimatedCost: 2000, actualCost: 0, paidStatus: 'deposit_paid' },
    ];
    const metrics = calculateBudgetMetrics(items, 5000);
    expect(metrics.totalPaid).toBe(1000); // 2000 * 0.5
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

  it('handles empty milestones array without error', () => {
    const progress = calculateTimelineProgress([]);
    expect(progress.totalMilestones).toBe(0);
    expect(progress.completedMilestones).toBe(0);
    expect(progress.percentComplete).toBe(0);
    expect(progress.pendingHighPriority).toBe(0);
  });
});

describe('planUtils - Vendor Stats', () => {
  it('correctly aggregates vendor states and booking rates', () => {
    const vendors: VendorItem[] = [
      { id: '1', category: 'Venue', vendorName: 'Grand Ballroom', status: 'Booked', estimatedCost: 5000 },
      { id: '2', category: 'Catering', vendorName: 'Chef Special', status: 'Completed', estimatedCost: 3000 },
      { id: '3', category: 'Music & DJ', vendorName: 'DJ Spin', status: 'Quoted', estimatedCost: 1200 },
      { id: '4', category: 'Photography', vendorName: 'Foto Art', status: 'To Research', estimatedCost: 2000 },
      { id: '5', category: 'Decor & Florist', vendorName: 'Floral Art', status: 'Contacted', estimatedCost: 1000 },
    ];

    const stats = calculateVendorStats(vendors);
    expect(stats.totalVendors).toBe(5);
    expect(stats.bookedCount).toBe(2); // Booked + Completed
    expect(stats.quotedCount).toBe(1);
    expect(stats.contactedCount).toBe(1);
    expect(stats.toResearchCount).toBe(1);
    expect(stats.bookedPercent).toBe(40); // 2/5 * 100
  });

  it('handles empty vendors array without division by zero', () => {
    const stats = calculateVendorStats([]);
    expect(stats.totalVendors).toBe(0);
    expect(stats.bookedCount).toBe(0);
    expect(stats.bookedPercent).toBe(0);
  });
});

describe('planUtils - Days Remaining', () => {
  it('returns valid days calculation for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const result = getDaysRemaining(dateStr);
    expect(result.days).toBe(1);
    expect(result.label).toBe('Tomorrow');
    expect(result.isPast).toBe(false);
  });

  it('returns "Today!" for current day', () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const result = getDaysRemaining(dateStr);
    expect(result.days).toBe(0);
    expect(result.label).toBe('Today!');
    expect(result.isPast).toBe(false);
  });

  it('detects past dates correctly', () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    const dateStr = past.toISOString().split('T')[0];

    const result = getDaysRemaining(dateStr);
    expect(result.isPast).toBe(true);
    expect(result.label).toContain('days ago');
  });

  it('handles invalid date strings gracefully', () => {
    const result = getDaysRemaining('not-a-valid-date');
    expect(result.isPast).toBe(false);
    expect(result.days).toBe(0);
  });
});
