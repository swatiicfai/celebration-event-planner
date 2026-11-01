'use client';

import React, { useState } from 'react';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import { BudgetItem, Currency } from '@/types/event';
import { formatCurrency } from '@/lib/constants';
import { calculateBudgetMetrics } from '@/lib/planUtils';

interface BudgetManagerProps {
  budgetItems: BudgetItem[];
  totalBudget: number;
  currency: Currency;
  onUpdateItems: (newItems: BudgetItem[]) => void;
  onUpdateTotalBudget: (newBudget: number) => void;
}

const CATEGORIES: BudgetItem['category'][] = [
  'Venue',
  'Catering & Drinks',
  'Decor & Flowers',
  'Photography & Video',
  'Entertainment & Music',
  'Attire & Beauty',
  'Stationery & Favors',
  'Logistics & Misc',
];

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgetItems,
  totalBudget,
  currency,
  onUpdateItems,
  onUpdateTotalBudget,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<BudgetItem['category']>('Venue');
  const [newItemEstimated, setNewItemEstimated] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

  const metrics = calculateBudgetMetrics(budgetItems, totalBudget);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemEstimated) return;

    const newItem: BudgetItem = {
      id: `custom-b-${Date.now()}`,
      category: newItemCategory,
      name: newItemName.trim(),
      estimatedCost: Number(newItemEstimated) || 0,
      actualCost: 0,
      paidStatus: 'unpaid',
      notes: newItemNotes.trim(),
    };

    onUpdateItems([...budgetItems, newItem]);
    setNewItemName('');
    setNewItemEstimated('');
    setNewItemNotes('');
    setShowAddForm(false);
  };

  const handleUpdateItem = (id: string, updates: Partial<BudgetItem>) => {
    onUpdateItems(
      budgetItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    onUpdateItems(budgetItems.filter((item) => item.id !== id));
  };

  const filteredItems = selectedCategory === 'all'
    ? budgetItems
    : budgetItems.filter((item) => item.category === selectedCategory);

  const budgetUsagePercent = totalBudget > 0 ? Math.min(Math.round((metrics.totalEstimated / totalBudget) * 100), 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Summary Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-900">Budget & Financial Allocator</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Track estimated quotes, actual invoices, and paid deposits in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Max Budget Cap:</span>
            <div className="relative">
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => onUpdateTotalBudget(Math.max(0, Number(e.target.value) || 0))}
                className="w-32 px-3 py-1.5 text-sm font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                min="0"
                step="500"
              />
            </div>
          </div>
        </div>

        {/* Progress Bar & Stat Pills */}
        <div className="pt-5 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>Estimated Allocation ({budgetUsagePercent}%)</span>
            <span className={metrics.isOverBudget ? 'text-rose-600' : 'text-emerald-700'}>
              {metrics.isOverBudget
                ? `Exceeds budget by ${formatCurrency(Math.abs(metrics.variance), currency)}!`
                : `${formatCurrency(metrics.remainingBudget, currency)} unallocated reserve remaining`}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${
                metrics.isOverBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold">Total Estimated</span>
              <p className="text-sm sm:text-base font-bold text-slate-800">
                {formatCurrency(metrics.totalEstimated, currency)}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold">Actual Invoiced</span>
              <p className="text-sm sm:text-base font-bold text-slate-800">
                {formatCurrency(metrics.totalActual, currency)}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold">Deposits / Paid</span>
              <p className="text-sm sm:text-base font-bold text-emerald-700">
                {formatCurrency(metrics.totalPaid, currency)}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold">Remaining Buffer</span>
              <p className={`text-sm sm:text-base font-bold ${metrics.remainingBudget < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                {formatCurrency(metrics.remainingBudget, currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Categories ({budgetItems.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = budgetItems.filter((i) => i.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Add Expense Item'}</span>
        </button>
      </div>

      {/* Add Expense Form Modal / Card */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900">Add New Budget Expense Item</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Item / Service Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vintage Champagne Toast"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as BudgetItem['category'])}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Estimated Cost ({currency}) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 750"
                value={newItemEstimated}
                onChange={(e) => setNewItemEstimated(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes / Vendor details (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Includes flutes and delivery"
              value={newItemNotes}
              onChange={(e) => setNewItemNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
            >
              Add Item
            </button>
          </div>
        </form>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Item & Category</th>
                <th className="p-4">Estimated</th>
                <th className="p-4">Actual Cost</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 text-2xs font-semibold rounded-md bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    {formatCurrency(item.estimatedCost, currency)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">{currency}</span>
                      <input
                        type="number"
                        min="0"
                        value={item.actualCost || ''}
                        onChange={(e) => handleUpdateItem(item.id, { actualCost: Number(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-24 px-2 py-1 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={item.paidStatus}
                      onChange={(e) => handleUpdateItem(item.id, { paidStatus: e.target.value as BudgetItem['paidStatus'] })}
                      className={`text-2xs font-semibold px-2 py-1 rounded-lg border-none cursor-pointer ${
                        item.paidStatus === 'fully_paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.paidStatus === 'deposit_paid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="deposit_paid">Deposit Paid (50%)</option>
                      <option value="fully_paid">Fully Paid</option>
                    </select>
                  </td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">
                    {item.notes || '-'}
                  </td>
                  <td className="p-4 text-right no-print">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

