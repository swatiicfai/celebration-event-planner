'use client';

import React from 'react';
import { EventPlan } from '@/types/event';
import { formatCurrency } from '@/lib/constants';

interface ExportDossierProps {
  plan: EventPlan;
}

export const ExportDossier: React.FC<ExportDossierProps> = ({ plan }) => {
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
      <div className="page-break-inside-avoid space-y-3">
        <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900">
          1. Theme & Design Direction
        </h2>
        <div className="text-sm">
          <strong>Concept:</strong> {plan.ideas.themeName}
        </div>
        <div className="text-xs italic text-slate-600">
          “{plan.ideas.tagline}”
        </div>

        <div className="flex items-center gap-4 pt-2">
          <span className="text-xs font-bold text-slate-700">Palette:</span>
          {plan.ideas.colorPalette.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-4 h-4 rounded-full border border-black/20"
                style={{ backgroundColor: c.hex }}
              />
              <span>{c.name} ({c.hex})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Table */}
      <div className="page-break-inside-avoid space-y-3">
        <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900">
          2. Financial Breakdown & Budget Items
        </h2>
        <table className="w-full text-left text-xs border border-slate-300">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="p-2 border-r border-slate-300">Item</th>
              <th className="p-2 border-r border-slate-300">Category</th>
              <th className="p-2 border-r border-slate-300">Estimated</th>
              <th className="p-2 border-r border-slate-300">Actual</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {plan.budgetItems.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border-r border-slate-300 font-medium">{item.name}</td>
                <td className="p-2 border-r border-slate-300">{item.category}</td>
                <td className="p-2 border-r border-slate-300 font-bold">
                  {formatCurrency(item.estimatedCost, plan.currency)}
                </td>
                <td className="p-2 border-r border-slate-300">
                  {item.actualCost > 0 ? formatCurrency(item.actualCost, plan.currency) : '-'}
                </td>
                <td className="p-2 capitalize">{item.paidStatus.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline Schedule */}
      <div className="page-break-inside-avoid space-y-3">
        <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900">
          3. Timeline & Day-of Run of Show
        </h2>
        <table className="w-full text-left text-xs border border-slate-300">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="p-2 border-r border-slate-300">Phase / Time</th>
              <th className="p-2 border-r border-slate-300">Milestone</th>
              <th className="p-2 border-r border-slate-300">Target Timeframe</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {plan.timeline.map((m) => (
              <tr key={m.id}>
                <td className="p-2 border-r border-slate-300 font-bold">
                  {m.timeSlot || m.phase}
                </td>
                <td className="p-2 border-r border-slate-300">
                  <div className="font-semibold">{m.title}</div>
                  <div className="text-slate-500">{m.description}</div>
                </td>
                <td className="p-2 border-r border-slate-300">{m.targetTimeframe}</td>
                <td className="p-2">{m.completed ? 'Completed' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vendors Table */}
      <div className="page-break-inside-avoid space-y-3">
        <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900">
          4. Vendor Directory & Status
        </h2>
        <table className="w-full text-left text-xs border border-slate-300">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="p-2 border-r border-slate-300">Vendor Name</th>
              <th className="p-2 border-r border-slate-300">Category</th>
              <th className="p-2 border-r border-slate-300">Contact</th>
              <th className="p-2 border-r border-slate-300">Estimated Cost</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {plan.vendors.map((v) => (
              <tr key={v.id}>
                <td className="p-2 border-r border-slate-300 font-bold">{v.vendorName}</td>
                <td className="p-2 border-r border-slate-300">{v.category}</td>
                <td className="p-2 border-r border-slate-300">
                  {v.contactPerson || ''} {v.contactEmail ? `(${v.contactEmail})` : ''}
                </td>
                <td className="p-2 border-r border-slate-300">
                  {formatCurrency(v.estimatedCost, plan.currency)}
                </td>
                <td className="p-2 font-semibold">{v.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sign-off footer */}
      <div className="pt-6 border-t border-slate-300 flex justify-between text-xs text-slate-500">
        <span>Celebration AI • Plan ID: {plan.id}</span>
        <span>Lead Planner Sign-off: _______________________</span>
      </div>
    </div>
  );
};

