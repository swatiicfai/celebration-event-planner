'use client';

import React, { memo } from 'react';
import { EventPlan } from '@/types/event';
import { formatCurrency } from '@/lib/constants';

interface ExportDossierProps {
  plan: EventPlan;
}

/**
 * Print & PDF Executive Master Dossier component formatted strictly for `@media print`.
 * Exports comprehensive theme, budget, timeline, and vendor sheets into a single document.
 */
export const ExportDossier: React.FC<ExportDossierProps> = memo(function ExportDossier({
  plan,
}): React.ReactElement {
  return (
    <div className="print-only p-8 text-black bg-white max-w-4xl mx-auto space-y-8 font-sans">
      {/* Dossier Header */}
      <div className="border-b-2 border-slate-900 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Official Master Event Dossier
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{plan.title}</h1>
            <p className="text-sm text-slate-600 mt-1">
              Category: {plan.eventType.toUpperCase()} • Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-bold text-slate-400">Total Budget</span>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(plan.totalBudget, plan.currency)}
            </div>
            <span className="text-xs text-slate-500">
              {plan.guestCount.toLocaleString()} Expected Guests
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-xs bg-slate-100 p-3 rounded-lg">
          <div>
            <strong className="text-slate-700">Date:</strong> {new Date(plan.eventDate).toLocaleDateString()}
          </div>
          <div>
            <strong className="text-slate-700">Venue:</strong> {plan.location}
          </div>
          <div className="col-span-2">
            <strong className="text-slate-700">Theme / Vibe:</strong> {plan.vibe}
          </div>
        </div>
      </div>

      {/* Theme & Ideas */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold border-b border-slate-300 pb-1">
          1. Creative Theme & Concept
        </h2>
        <div className="text-sm">
          <p className="font-bold text-base">{plan.ideas.themeName}</p>
          <p className="italic text-slate-700 mt-1">“{plan.ideas.tagline}”</p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Palette Colors</h3>
          <div className="flex gap-4">
            {plan.ideas.colorPalette.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-4 h-4 rounded border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span>
                  {c.name} ({c.hex})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <strong className="block text-slate-900 font-bold mb-1">Decor Concepts:</strong>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              {plan.ideas.decorConcepts.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong className="block text-slate-900 font-bold mb-1">Interactive Experiences:</strong>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              {plan.ideas.interactiveActivities.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Itemized Budget Sheet */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold border-b border-slate-300 pb-1">
          2. Financial Allocation & Budget Sheet
        </h2>
        <table className="w-full text-xs text-left border border-slate-200">
          <thead className="bg-slate-100 font-bold border-b border-slate-200">
            <tr>
              <th className="p-2">Category</th>
              <th className="p-2">Item Name</th>
              <th className="p-2 text-right">Estimated</th>
              <th className="p-2 text-right">Actual Invoiced</th>
              <th className="p-2">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {plan.budgetItems.map((item) => (
              <tr key={item.id}>
                <td className="p-2 font-medium">{item.category}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-right font-mono">
                  {formatCurrency(item.estimatedCost, plan.currency)}
                </td>
                <td className="p-2 text-right font-mono">
                  {item.actualCost > 0 ? formatCurrency(item.actualCost, plan.currency) : '—'}
                </td>
                <td className="p-2 capitalize">{item.paidStatus.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline Sheet */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold border-b border-slate-300 pb-1">
          3. Master Timeline & Day-of Run of Show
        </h2>
        <table className="w-full text-xs text-left border border-slate-200">
          <thead className="bg-slate-100 font-bold border-b border-slate-200">
            <tr>
              <th className="p-2">Phase / Time</th>
              <th className="p-2">Milestone / Agenda</th>
              <th className="p-2">Description</th>
              <th className="p-2">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {plan.timeline.map((m) => (
              <tr key={m.id}>
                <td className="p-2 font-mono font-bold">{m.timeSlot || m.targetTimeframe}</td>
                <td className="p-2 font-medium">{m.title}</td>
                <td className="p-2 text-slate-600">{m.description}</td>
                <td className="p-2 capitalize font-semibold">{m.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vendor Sheet */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold border-b border-slate-300 pb-1">
          4. Vendor Directory & Contacts
        </h2>
        <table className="w-full text-xs text-left border border-slate-200">
          <thead className="bg-slate-100 font-bold border-b border-slate-200">
            <tr>
              <th className="p-2">Category</th>
              <th className="p-2">Vendor Name</th>
              <th className="p-2">Contact Person</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {plan.vendors.map((v) => (
              <tr key={v.id}>
                <td className="p-2 font-medium">{v.category}</td>
                <td className="p-2 font-bold">{v.vendorName}</td>
                <td className="p-2">
                  {v.contactPerson || '—'} {v.contactEmail ? `(${v.contactEmail})` : ''}
                </td>
                <td className="p-2 font-semibold">{v.status}</td>
                <td className="p-2 text-right font-mono">
                  {formatCurrency(v.estimatedCost, plan.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
