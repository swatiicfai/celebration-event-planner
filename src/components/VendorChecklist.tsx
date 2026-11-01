'use client';

import React, { useState } from 'react';
import { Store, Plus, Phone, Mail, Trash2 } from 'lucide-react';
import { VendorItem, VendorCategory, VendorStatus, Currency } from '@/types/event';
import { formatCurrency } from '@/lib/constants';
import { calculateVendorStats } from '@/lib/planUtils';

interface VendorChecklistProps {
  vendors: VendorItem[];
  currency: Currency;
  onUpdateVendors: (newVendors: VendorItem[]) => void;
}

const CATEGORIES: VendorCategory[] = [
  'Venue',
  'Catering',
  'Photography',
  'Music & DJ',
  'Decor & Florist',
  'Attire & Styling',
  'Invitations & Favors',
  'Logistics & Rentals',
];

const STATUSES: VendorStatus[] = ['To Research', 'Contacted', 'Quoted', 'Booked', 'Completed'];

export const VendorChecklist: React.FC<VendorChecklistProps> = ({ vendors, currency, onUpdateVendors }) => {
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

  const stats = calculateVendorStats(vendors);

  const handleStatusChange = (id: string, newStatus: VendorStatus) => {
    onUpdateVendors(
      vendors.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  };

  const handleDeleteVendor = (id: string) => {
    onUpdateVendors(vendors.filter((v) => v.id !== id));
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    const newVendor: VendorItem = {
      id: `vendor-${Date.now()}`,
      category,
      vendorName: vendorName.trim(),
      contactPerson: contactPerson.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      status,
      estimatedCost: Number(estimatedCost) || 0,
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

  const filteredVendors = vendors.filter((v) => {
    const matchesStatus = selectedStatus === 'all' || v.status === selectedStatus;
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    return matchesStatus && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-slate-900">Vendor Management & Checklists</h3>
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                {stats.bookedPercent}% Secured ({stats.bookedCount}/{stats.totalVendors})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Seamlessly monitor vetting, contracts, proposals, and contact sheets for all event suppliers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add New Vendor'}</span>
          </button>
        </div>

        {/* Category & Status Pills Bar */}
        <div className="pt-4 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-2xs font-semibold text-slate-400 mr-1">Status:</span>
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedStatus === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({vendors.length})
            </button>
            {STATUSES.map((st) => {
              const count = vendors.filter((v) => v.status === st).length;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedStatus === st
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs pt-1 border-t border-slate-100">
            <span className="text-2xs font-semibold text-slate-400 mr-1">Category:</span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                  className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Vendor Form */}
      {showAddForm && (
        <form onSubmit={handleAddVendor} className="bg-white rounded-3xl p-6 border-2 border-purple-300 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900">Add New Supplier or Vendor</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Vendor / Studio Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Visuals"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Estimated Cost ({currency})</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 2500"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Rachel Green"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="rachel@studio.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VendorStatus)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes / Contract Deliverables</label>
            <input
              type="text"
              placeholder="e.g. Includes 8 hours of video coverage and 2 highlight reels"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500"
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
              className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm"
            >
              Save Vendor
            </button>
          </div>
        </form>
      )}

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block px-2 py-0.5 text-2xs font-bold rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 mb-1">
                    {vendor.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{vendor.vendorName}</h4>
                  {vendor.contactPerson && (
                    <p className="text-xs text-slate-500">Contact: {vendor.contactPerson}</p>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">
                    {formatCurrency(vendor.estimatedCost, currency)}
                  </span>
                  <span className="text-2xs text-slate-400">Est. quote</span>
                </div>
              </div>

              {/* Contact info snippets */}
              <div className="mt-3 flex flex-wrap gap-2 text-2xs text-slate-600">
                {vendor.contactEmail && (
                  <a
                    href={`mailto:${vendor.contactEmail}`}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md hover:bg-slate-100 text-slate-700"
                  >
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{vendor.contactEmail}</span>
                  </a>
                )}
                {vendor.contactPhone && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md text-slate-700">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{vendor.contactPhone}</span>
                  </span>
                )}
              </div>

              {vendor.notes && (
                <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                  “{vendor.notes}”
                </p>
              )}
            </div>

            {/* Bottom Status Selector & Delete */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-2xs font-semibold text-slate-400">Status:</span>
                <select
                  value={vendor.status}
                  onChange={(e) => handleStatusChange(vendor.id, e.target.value as VendorStatus)}
                  className={`text-2xs font-bold px-2 py-1 rounded-lg border-none cursor-pointer ${
                    vendor.status === 'Booked' || vendor.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : vendor.status === 'Quoted'
                      ? 'bg-blue-100 text-blue-800'
                      : vendor.status === 'Contacted'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteVendor(vendor.id)}
                className="text-slate-300 hover:text-rose-500 p-1 rounded-md transition no-print"
                title="Delete vendor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

