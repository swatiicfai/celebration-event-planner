'use client';

import React from 'react';
import { Calendar, MapPin, Users, DollarSign, CheckCircle2, Store, Clock, Sparkles } from 'lucide-react';
import { EventPlan } from '@/types/event';
import { formatCurrency, EVENT_TYPE_OPTIONS } from '@/lib/constants';
import { calculateBudgetMetrics, calculateTimelineProgress, calculateVendorStats, getDaysRemaining } from '@/lib/planUtils';
import confetti from 'canvas-confetti';

interface OverviewCardProps {
  plan: EventPlan;
  onEditBrief: () => void;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ plan, onEditBrief }) => {
  const budgetMetrics = calculateBudgetMetrics(plan.budgetItems, plan.totalBudget);
  const timelineProgress = calculateTimelineProgress(plan.timeline);
  const vendorStats = calculateVendorStats(plan.vendors);
  const daysRemaining = getDaysRemaining(plan.eventDate);

  const matchedType = EVENT_TYPE_OPTIONS.find((t) => t.id === plan.eventType) || EVENT_TYPE_OPTIONS[0];

  const perGuestCost = plan.guestCount > 0 ? Math.round(plan.totalBudget / plan.guestCount) : 0;

  const triggerConfetti = () => {
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
              <span>{matchedType.icon}</span>
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
              <span>{new Date(plan.eventDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl transition"
            title="Celebrate Milestone!"
          >
            <Sparkles className="w-4 h-4" />
            <span>Celebrate 🎉</span>
          </button>
          <button
            type="button"
            onClick={onEditBrief}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Edit Event Brief
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Budget Metric */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {formatCurrency(plan.totalBudget, plan.currency)}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Est: {formatCurrency(budgetMetrics.totalEstimated, plan.currency)}</span>
            <span
              className={`font-semibold ${
                budgetMetrics.isOverBudget ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {budgetMetrics.isOverBudget ? 'Over Budget' : 'On Track'}
            </span>
          </div>
        </div>

        {/* Timeline Readiness */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Readiness</span>
            <CheckCircle2 className="w-4 h-4 text-rose-600" aria-hidden="true" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {timelineProgress.percentComplete}%
          </div>
          <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${timelineProgress.percentComplete}%` }}
              role="progressbar"
              aria-valuenow={timelineProgress.percentComplete}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="mt-1 text-2xs text-slate-400">
            {timelineProgress.completedMilestones}/{timelineProgress.totalMilestones} milestones checked
          </p>
        </div>

        {/* Guest Count & Per Guest */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Guest Headcount</span>
            <Users className="w-4 h-4 text-blue-600" aria-hidden="true" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {plan.guestCount.toLocaleString()} <span className="text-xs font-normal text-slate-500">guests</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            ~{formatCurrency(perGuestCost, plan.currency)} per guest
          </div>
        </div>

        {/* Vendors Locked */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Vendors Secured</span>
            <Store className="w-4 h-4 text-purple-600" aria-hidden="true" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {vendorStats.bookedCount}/{vendorStats.totalVendors}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>{vendorStats.quotedCount} in quotes</span>
            <span className="font-semibold text-purple-600">{vendorStats.bookedPercent}% booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

