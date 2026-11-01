'use client';

import React, { useState, useMemo, memo } from 'react';
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

const CATEGORIES: readonly BudgetItem['category'][] = [
  'Venue',
  'Catering & Drinks',
  'Decor & Flowers',
  'Photography & Video',
  'Entertainment & Music',
  'Attire & Beauty',
  'Stationery & Favors',
  'Logistics & Misc',
] as const;

/**
 * Smart Budget & Financial Allocator component providing ledger tracking,
 * category expenditure breakdown, and live over-budget alerts.
 */
export const BudgetManager: React.FC<BudgetManagerProps> = memo(function BudgetManager({
  budgetItems,
  totalBudget,
  currency,
  onUpdateItems,
  onUpdateTotalBudget,
}): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<BudgetItem['category']>('Venue');
  const [newItemEstimated, setNewItemEstimated] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

  const metrics = useMemo(
    () => calculateBudgetMetrics(budgetItems, totalBudget),
    [budgetItems, totalBudget]
  );

  const filteredItems = useMemo(
    () =>
      selectedCategory === 'all'
        ? budgetItems
        : budgetItems.filter((item) => item.category === selectedCategory),
    [budgetItems, selectedCategory]
  );

  const handleAddItem = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemEstimated) return;

    const newItem: BudgetItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      estimatedCost: Math.max(0, parseFloat(newItemEstimated) || 0),
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

  const handleDeleteItem = (id: string): void => {
    onUpdateItems(budgetItems.filter((item) => item.id !== id));
  };

  const handleActualCostChange = (id: string, costStr: string): void => {
    const cost = Math.max(0, parseFloat(costStr) || 0);
    onUpdateItems(
      budgetItems.map((item) => (item.id === id ? { ...item, actualCost: cost } : item))
    );
  };

  const handlePaidStatusChange = (id: string, status: BudgetItem['paidStatus']): void => {
    onUpdateItems(
      budgetItems.map((item) => (item.id === id ? { ...item, paidStatus: status } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Financial Health Summary Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              <h2 className="text-xl font-extrabold text-slate-900">
                Financial Health & Expense Allocator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track planned estimates against contracted actuals and paid vendor deposits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <label htmlFor="edit-total-budget" className="text-xs text-slate-400 block font-medium">
                Target Budget
              </label>
              <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                <span>{currency}</span>
                <input
                  id="edit-total-budget"
                  type="number"
                  aria-label="Edit total target budget"
                  value={totalBudget}
                  onChange={(e) => onUpdateTotalBudget(Math.max(0, Number(e.target.value) || 0))}
                  className="w-28 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block">Planned (Estimated)</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              {formatCurrency(metrics.totalEstimated, currency)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block">Actual Invoiced</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              {formatCurrency(metrics.totalActual, currency)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block">Deposits Paid</span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-600">
              {formatCurrency(metrics.totalPaid, currency)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block">
              {metrics.isOverBudget ? 'Budget Deficit' : 'Remaining Cushion'}
            </span>
            <span
              className={`text-lg sm:text-xl font-extrabold ${
                metrics.isOverBudget ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {formatCurrency(Math.abs(metrics.remainingBudget), currency)}
            </span>
          </div>
        </div>

        {/* Visual Budget Allocation Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-semibold mb-2 text-slate-600">
            <span>Budget Utilization</span>
            <span>
              {totalBudget > 0
                ? Math.min(100, Math.round((metrics.totalEstimated / totalBudget) * 100))
                : 0}
              % Allocated
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex" role="progressbar" aria-valuenow={Math.min(100, Math.round((metrics.totalEstimated / Math.max(1, totalBudget)) * 100))} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`h-full transition-all duration-500 ${
                metrics.isOverBudget
                  ? 'bg-rose-500'
                  : metrics.totalEstimated / totalBudget > 0.9
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (metrics.totalEstimated / Math.max(1, totalBudget)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Add Item Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0" role="group" aria-label="Filter budget items by category">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Items ({budgetItems.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = budgetItems.filter((i) => i.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
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
          aria-expanded={showAddForm}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{showAddForm ? 'Cancel' : 'Add Expense'}</span>
        </button>
      </div>

      {/* Add New Item Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAddItem}
          className="bg-white rounded-3xl p-6 border border-rose-200/80 shadow-md space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-900">Add New Budget Item</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="expense-name" className="text-xs font-semibold text-slate-700 block mb-1">
                Item Name *
              </label>
              <input
                id="expense-name"
                type="text"
                required
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. Wedding Cake & Dessert Table"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label htmlFor="expense-category" className="text-xs font-semibold text-slate-700 block mb-1">
                Category *
              </label>
              <select
                id="expense-category"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as BudgetItem['category'])}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="expense-cost" className="text-xs font-semibold text-slate-700 block mb-1">
                Estimated Cost ({currency}) *
              </label>
              <input
                id="expense-cost"
                type="number"
                required
                min="0"
                value={newItemEstimated}
                onChange={(e) => setNewItemEstimated(e.target.value)}
                placeholder="1500"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="expense-notes" className="text-xs font-semibold text-slate-700 block mb-1">
              Notes / Deliverables
            </label>
            <input
              id="expense-notes"
              type="text"
              value={newItemNotes}
              onChange={(e) => setNewItemNotes(e.target.value)}
              placeholder="e.g. 3 tiers, red velvet & champagne flavor with vegan gluten-free cupcakes"
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs"
            >
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* Itemized Budget Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3.5">Category & Item</th>
                <th scope="col" className="px-4 py-3.5">Estimated</th>
                <th scope="col" className="px-4 py-3.5">Actual Invoiced</th>
                <th scope="col" className="px-4 py-3.5">Payment Status</th>
                <th scope="col" className="px-4 py-3.5">Notes</th>
                <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {item.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-slate-700">
                    {formatCurrency(item.estimatedCost, currency)}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-mono text-[11px]">{currency}</span>
                      <input
                        type="number"
                        min="0"
                        aria-label={`Actual cost for ${item.name}`}
                        value={item.actualCost || ''}
                        onChange={(e) => handleActualCostChange(item.id, e.target.value)}
                        placeholder="0"
                        className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <select
                      aria-label={`Payment status for ${item.name}`}
                      value={item.paidStatus}
                      onChange={(e) =>
                        handlePaidStatusChange(item.id, e.target.value as BudgetItem['paidStatus'])
                      }
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                        item.paidStatus === 'fully_paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.paidStatus === 'deposit_paid'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="deposit_paid">Deposit Paid (50%)</option>
                      <option value="fully_paid">Fully Paid</option>
                    </select>
                  </td>

                  <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate" title={item.notes}>
                    {item.notes || '—'}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label={`Delete ${item.name}`}
                      title="Delete Item"
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-400"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
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
});
