'use client';

import React, { useState, useMemo, memo } from 'react';
import { Store, Plus, Phone, Mail, Trash2 } from 'lucide-react';
import { VendorItem, VendorCategory, VendorStatus, Currency } from '@/types/event';
import { formatCurrency } from '@/lib/constants';
import { calculateVendorStats } from '@/lib/planUtils';

interface VendorChecklistProps {
  vendors: VendorItem[];
  currency: Currency;
  onUpdateVendors: (newVendors: VendorItem[]) => void;
}

const CATEGORIES: readonly VendorCategory[] = [
  'Venue',
  'Catering',
  'Photography',
  'Music & DJ',
  'Decor & Florist',
  'Attire & Styling',
  'Invitations & Favors',
  'Logistics & Rentals',
] as const;

const STATUSES: readonly VendorStatus[] = [
  'To Research',
  'Contacted',
  'Quoted',
  'Booked',
  'Completed',
] as const;

/**
 * Supplier & Vendor Checklist component providing lifecycle pipeline tracking,
 * category filtering, contact management, and cost oversight.
 */
export const VendorChecklist: React.FC<VendorChecklistProps> = memo(function VendorChecklist({
  vendors,
  currency,
  onUpdateVendors,
}): React.ReactElement {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New vendor state
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('Venue');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<VendorStatus>('To Research');

  const stats = useMemo(() => calculateVendorStats(vendors), [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchStatus = selectedStatus === 'all' || v.status === selectedStatus;
      const matchCat = selectedCategory === 'all' || v.category === selectedCategory;
      return matchStatus && matchCat;
    });
  }, [vendors, selectedStatus, selectedCategory]);

  const handleStatusChange = (id: string, newStatus: VendorStatus): void => {
    onUpdateVendors(
      vendors.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  };

  const handleDeleteVendor = (id: string): void => {
    onUpdateVendors(vendors.filter((v) => v.id !== id));
  };

  const handleAddVendor = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    const newVendor: VendorItem = {
      id: `vendor-${Date.now()}`,
      vendorName: vendorName.trim(),
      category,
      contactPerson: contactPerson.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      status,
      estimatedCost: Math.max(0, parseFloat(estimatedCost) || 0),
      notes: notes.trim() || undefined,
    };

    onUpdateVendors([...vendors, newVendor]);
    setVendorName('');
    setContactPerson('');
    setContactEmail('');
    setContactPhone('');
    setEstimatedCost('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-purple-600" aria-hidden="true" />
            <h2 className="text-xl font-extrabold text-slate-900">
              Vendor Management & Checklists
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain booking status, contacts, and contracts ({stats.bookedCount}/{stats.totalVendors} Booked — {stats.bookedPercent}%).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          aria-expanded={showAddForm}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-xs self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{showAddForm ? 'Cancel' : 'Add Vendor'}</span>
        </button>
      </div>

      {/* Supplier Status Badges */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter vendors by booking status">
          <button
            type="button"
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              selectedStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Statuses ({vendors.length})
          </button>
          {STATUSES.map((st) => {
            const count = vendors.filter((v) => v.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  selectedStatus === st
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter vendors by category">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
              selectedCategory === 'all'
                ? 'bg-purple-100 text-purple-800'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => {
            const count = vendors.filter((v) => v.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Vendor Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAddVendor}
          className="bg-slate-50/80 rounded-3xl p-6 border border-purple-200/80 shadow-xs space-y-4 text-xs"
        >
          <h3 className="text-sm font-bold text-slate-900">Add New Supplier or Vendor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="vendor-name" className="font-semibold text-slate-700 block mb-1">
                Vendor Name *
              </label>
              <input
                id="vendor-name"
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="e.g. Skyline Event Florals"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div>
              <label htmlFor="vendor-category" className="font-semibold text-slate-700 block mb-1">
                Category *
              </label>
              <select
                id="vendor-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vendor-status" className="font-semibold text-slate-700 block mb-1">
                Current Status
              </label>
              <select
                id="vendor-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as VendorStatus)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vendor-contact-person" className="font-semibold text-slate-700 block mb-1">
                Contact Person
              </label>
              <input
                id="vendor-contact-person"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Jessica Chen"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div>
              <label htmlFor="vendor-email" className="font-semibold text-slate-700 block mb-1">
                Email Address
              </label>
              <input
                id="vendor-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="jessica@skylineflorals.com"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div>
              <label htmlFor="vendor-phone" className="font-semibold text-slate-700 block mb-1">
                Phone Number
              </label>
              <input
                id="vendor-phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vendor-cost" className="font-semibold text-slate-700 block mb-1">
                Estimated / Contracted Cost ({currency})
              </label>
              <input
                id="vendor-cost"
                type="number"
                min="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="2500"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div>
              <label htmlFor="vendor-notes" className="font-semibold text-slate-700 block mb-1">
                Notes & Contract Terms
              </label>
              <input
                id="vendor-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 50% deposit paid, arch installation included"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-xs"
            >
              Save Vendor
            </button>
          </div>
        </form>
      )}

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.length === 0 ? (
          <p className="col-span-2 text-xs text-slate-400 py-6 text-center italic">
            No vendors found matching current status filter.
          </p>
        ) : (
          filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                      {vendor.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{vendor.vendorName}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {formatCurrency(vendor.estimatedCost, currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteVendor(vendor.id)}
                      aria-label={`Delete ${vendor.vendorName}`}
                      className="text-slate-300 hover:text-rose-600 transition p-1 focus:outline-none focus:ring-2 focus:ring-rose-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {vendor.contactPerson && (
                  <p className="text-xs text-slate-600 mt-1">
                    Contact: <strong className="text-slate-800">{vendor.contactPerson}</strong>
                  </p>
                )}

                {/* Contact Links */}
                {(vendor.contactEmail || vendor.contactPhone) && (
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                    {vendor.contactEmail && (
                      <a
                        href={`mailto:${vendor.contactEmail}`}
                        className="inline-flex items-center gap-1 hover:text-purple-600 transition"
                      >
                        <Mail className="w-3 h-3" aria-hidden="true" />
                        <span>{vendor.contactEmail}</span>
                      </a>
                    )}
                    {vendor.contactPhone && (
                      <a
                        href={`tel:${vendor.contactPhone}`}
                        className="inline-flex items-center gap-1 hover:text-purple-600 transition"
                      >
                        <Phone className="w-3 h-3" aria-hidden="true" />
                        <span>{vendor.contactPhone}</span>
                      </a>
                    )}
                  </div>
                )}

                {vendor.notes && (
                  <p className="text-[11px] text-slate-400 italic mt-2 bg-slate-50 p-2 rounded-lg">
                    “{vendor.notes}”
                  </p>
                )}
              </div>

              {/* Status Selector Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Status</span>
                <select
                  aria-label={`Booking status for ${vendor.vendorName}`}
                  value={vendor.status}
                  onChange={(e) => handleStatusChange(vendor.id, e.target.value as VendorStatus)}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                    vendor.status === 'Booked' || vendor.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : vendor.status === 'Quoted'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : vendor.status === 'Contacted'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
