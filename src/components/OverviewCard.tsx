'use client';

import React, { memo, useMemo } from 'react';
import { Calendar, MapPin, Users, DollarSign, CheckCircle2, Store, Clock, Sparkles } from 'lucide-react';
import { EventPlan } from '@/types/event';
import { formatCurrency, EVENT_TYPE_OPTIONS } from '@/lib/constants';
import { calculateBudgetMetrics, calculateTimelineProgress, calculateVendorStats, getDaysRemaining } from '@/lib/planUtils';
import confetti from 'canvas-confetti';

interface OverviewCardProps {
  plan: EventPlan;
  onEditBrief: () => void;
}

/**
 * Hero metric summary card providing executive oversight of event dates, budget,
 * timeline completion percentage, and booked vendors.
 */
export const OverviewCard: React.FC<OverviewCardProps> = memo(function OverviewCard({
  plan,
  onEditBrief,
}): React.ReactElement {
  const budgetMetrics = useMemo(
    () => calculateBudgetMetrics(plan.budgetItems, plan.totalBudget),
    [plan.budgetItems, plan.totalBudget]
  );

  const timelineProgress = useMemo(
    () => calculateTimelineProgress(plan.timeline),
    [plan.timeline]
  );

  const vendorStats = useMemo(
    () => calculateVendorStats(plan.vendors),
    [plan.vendors]
  );

  const daysRemaining = useMemo(
    () => getDaysRemaining(plan.eventDate),
    [plan.eventDate]
  );

  const matchedType = useMemo(
    () => EVENT_TYPE_OPTIONS.find((t) => t.id === plan.eventType) || EVENT_TYPE_OPTIONS[0],
    [plan.eventType]
  );

  const perGuestCost = useMemo(
    () => (plan.guestCount > 0 ? Math.round(plan.totalBudget / plan.guestCount) : 0),
    [plan.totalBudget, plan.guestCount]
  );

  const triggerConfetti = (): void => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      {/* Background ambient accents */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-100 rounded-full filter blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pink-100 rounded-full filter blur-3xl opacity-50 pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <span aria-hidden="true">{matchedType.icon}</span>
              <span>{matchedType.label}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                daysRemaining.isPast
                  ? 'bg-slate-100 text-slate-600'
                  : daysRemaining.days <= 7
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{daysRemaining.label}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {plan.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500" aria-hidden="true" />
              <span>
                {new Date(plan.eventDate).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-pink-500" aria-hidden="true" />
              <span>{plan.location}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start no-print">
          <button
            type="button"
            onClick={triggerConfetti}
            aria-label="Celebrate event milestone with confetti"
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-pink-400"
            title="Celebrate Milestone!"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Celebrate 🎉</span>
          </button>
          <button
            type="button"
            onClick={onEditBrief}
            aria-label="Edit event brief parameters"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Edit Event Brief
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Budget Metric */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Total Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatCurrency(plan.totalBudget, plan.currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span
              className={
                budgetMetrics.isOverBudget
                  ? 'text-rose-600 font-bold'
                  : 'text-emerald-700 font-medium'
              }
            >
              {budgetMetrics.isOverBudget ? '⚠️ Over Budget' : '✓ On Track'}
            </span>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Milestones Done</span>
            <CheckCircle2 className="w-4 h-4 text-rose-500" aria-hidden="true" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {timelineProgress.percentComplete}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {timelineProgress.completedMilestones}/{timelineProgress.totalMilestones} milestones checked
          </div>
        </div>

        {/* Guest Count & Per Guest Cost */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Guest Headcount</span>
            <Users className="w-4 h-4 text-blue-500" aria-hidden="true" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {plan.guestCount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ~{formatCurrency(perGuestCost, plan.currency)}/guest
          </div>
        </div>

        {/* Vendors Booked */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Vendors Secured</span>
            <Store className="w-4 h-4 text-purple-500" aria-hidden="true" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {vendorStats.bookedCount}/{vendorStats.totalVendors}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {vendorStats.bookedPercent}% Booked
          </div>
        </div>
      </div>
    </div>
  );
});
