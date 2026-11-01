import { BudgetItem, TimelineMilestone, VendorItem } from '@/types/event';

export interface BudgetMetrics {
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  remainingBudget: number;
  variance: number;
  isOverBudget: boolean;
  categoryBreakdown: Record<string, { estimated: number; actual: number; count: number }>;
}

/**
 * Calculates itemized financial metrics, remaining balances, payment progress,
 * and category expenditure distribution.
 *
 * @param items - Array of BudgetItem entries
 * @param totalBudget - Total allocated budget for the celebration
 * @returns BudgetMetrics with calculated financial metrics
 */
export function calculateBudgetMetrics(items: BudgetItem[], totalBudget: number): BudgetMetrics {
  let totalEstimated = 0;
  let totalActual = 0;
  let totalPaid = 0;
  const categoryBreakdown: Record<string, { estimated: number; actual: number; count: number }> = {};

  for (const item of items) {
    const est = Number(item.estimatedCost) || 0;
    const actual = Number(item.actualCost) || 0;
    totalEstimated += est;
    totalActual += actual;

    if (item.paidStatus === 'fully_paid') {
      totalPaid += actual > 0 ? actual : est;
    } else if (item.paidStatus === 'deposit_paid') {
      totalPaid += Math.round((actual > 0 ? actual : est) * 0.5);
    }

    if (!categoryBreakdown[item.category]) {
      categoryBreakdown[item.category] = { estimated: 0, actual: 0, count: 0 };
    }
    categoryBreakdown[item.category].estimated += est;
    categoryBreakdown[item.category].actual += actual;
    categoryBreakdown[item.category].count += 1;
  }

  const effectiveSpent = totalActual > 0 ? totalActual : totalEstimated;
  const remainingBudget = totalBudget - effectiveSpent;
  const variance = totalBudget - totalEstimated;

  return {
    totalEstimated,
    totalActual,
    totalPaid,
    remainingBudget,
    variance,
    isOverBudget: totalEstimated > totalBudget || (totalActual > 0 && totalActual > totalBudget),
    categoryBreakdown,
  };
}

export interface TimelineProgress {
  totalMilestones: number;
  completedMilestones: number;
  percentComplete: number;
  pendingHighPriority: number;
  groupedByPhase: Record<string, TimelineMilestone[]>;
}

/**
 * Evaluates completion rates and groups milestones across chronological phases.
 *
 * @param milestones - Array of TimelineMilestone entries
 * @returns TimelineProgress summary
 */
export function calculateTimelineProgress(milestones: TimelineMilestone[]): TimelineProgress {
  const total = milestones.length;
  const completed = milestones.filter((m) => m.completed).length;
  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pendingHighPriority = milestones.filter((m) => !m.completed && m.priority === 'high').length;

  const groupedByPhase: Record<string, TimelineMilestone[]> = {};
  for (const item of milestones) {
    if (!groupedByPhase[item.phase]) {
      groupedByPhase[item.phase] = [];
    }
    groupedByPhase[item.phase].push(item);
  }

  return {
    totalMilestones: total,
    completedMilestones: completed,
    percentComplete,
    pendingHighPriority,
    groupedByPhase,
  };
}

export interface VendorStats {
  totalVendors: number;
  bookedCount: number;
  quotedCount: number;
  contactedCount: number;
  toResearchCount: number;
  bookedPercent: number;
}

/**
 * Aggregates vendor booking pipeline numbers and conversion rates.
 *
 * @param vendors - Array of VendorItem entries
 * @returns VendorStats summary
 */
export function calculateVendorStats(vendors: VendorItem[]): VendorStats {
  const total = vendors.length;
  const bookedCount = vendors.filter((v) => v.status === 'Booked' || v.status === 'Completed').length;
  const quotedCount = vendors.filter((v) => v.status === 'Quoted').length;
  const contactedCount = vendors.filter((v) => v.status === 'Contacted').length;
  const toResearchCount = vendors.filter((v) => v.status === 'To Research').length;
  const bookedPercent = total > 0 ? Math.round((bookedCount / total) * 100) : 0;

  return {
    totalVendors: total,
    bookedCount,
    quotedCount,
    contactedCount,
    toResearchCount,
    bookedPercent,
  };
}

/**
 * Computes remaining calendar days until celebration target date.
 *
 * @param targetDateStr - ISO date string
 * @returns Formatted days remaining object
 */
export function getDaysRemaining(targetDateStr: string): { days: number; isPast: boolean; label: string } {
  try {
    const target = new Date(targetDateStr);
    if (isNaN(target.getTime())) {
      return { days: 0, isPast: false, label: 'Date pending' };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - now.getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (isNaN(days)) {
      return { days: 0, isPast: false, label: 'Date pending' };
    }

    if (days < 0) {
      return { days: Math.abs(days), isPast: true, label: `${Math.abs(days)} days ago` };
    } else if (days === 0) {
      return { days: 0, isPast: false, label: 'Today!' };
    } else if (days === 1) {
      return { days: 1, isPast: false, label: 'Tomorrow' };
    } else {
      return { days, isPast: false, label: `${days} days to go` };
    }
  } catch {
    return { days: 0, isPast: false, label: 'Date pending' };
  }
}
