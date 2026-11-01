'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2 } from 'lucide-react';
import { EventType, Currency, GeneratePlanRequest } from '@/types/event';
import { EVENT_TYPE_OPTIONS, CURRENCY_CONFIGS, PRESET_EVENTS } from '@/lib/constants';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GeneratePlanRequest) => Promise<void>;
  isLoading: boolean;
  initialData?: GeneratePlanRequest | null;
}

const VIBE_SUGGESTIONS: Record<EventType, string[]> = {
  wedding: [
    'Romantic Botanical Glasshouse with Fairy Lights',
    'Modern Glamour & Black Tie Champagne Soiree',
    'Boho Rustic Farmhouse with Wildflowers & Acoustic Strings',
    'Royal Palace Grandeur with Traditional Sangeet & Feasts',
  ],
  birthday: [
    '80s Synthwave & Neon Arcade with Craft Sliders',
    'Tropical Boho Sunset Beach Picnic & Fire Dancers',
    'Chic Rooftop Velvet Cocktail Lounge with Vinyl DJ',
    'Enchanted Woodland Fairy Garden (Kids / Family)',
  ],
  community: [
    'Vibrant Street Food & Folk Arts Neighborhood Fair',
    'Zero-Waste Sustainability & Farm-to-Table Gathering',
    'High-Energy Hackathon & Tech Innovation Demo Day',
    'Multicultural Heritage Carnival with Live Stages',
  ],
  anniversary: [
    'Candlelit Intimate Tuscan Courtyard Dinner',
    'Golden Jubilee Retrospective with Memory Gallery',
    'Vineyard Sunset Wine Pairing & Live Quartet',
  ],
  corporate: [
    'Sleek Tech Summit & Interactive Keynote Experience',
    'Relaxed Nature Retreat with Team-building & Fireside Barbecue',
    'Charity Gala & Silent Auction Dinner',
  ],
  other: [
    'Pastel Cloud Baby Shower & Afternoon Tea',
    'Celebratory Graduation Fiesta with Food Trucks & DJ',
    'Cozy Autumn Housewarming with Spiced Cider & Grazing Boards',
  ],
};

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [totalBudget, setTotalBudget] = useState<number>(15000);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [vibe, setVibe] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Set default initial data
  useEffect(() => {
    if (initialData) {
      setEventType(initialData.eventType);
      setTitle(initialData.title || '');
      setEventDate(initialData.eventDate);
      setLocation(initialData.location);
      setGuestCount(initialData.guestCount);
      setTotalBudget(initialData.totalBudget);
      setCurrency(initialData.currency);
      setVibe(initialData.vibe);
      setSpecialRequirements(initialData.specialRequirements || '');
    } else {
      // Default future date
      const future = new Date();
      future.setMonth(future.getMonth() + 4);
      setEventDate(future.toISOString().split('T')[0]);
      setLocation('Hilltop Glasshouse & Gardens');
      setVibe('Romantic botanical elegance with warm candlelight and acoustic soul');
      setSpecialRequirements('Dietary options for vegan guests, biodegradable confetti, live acoustic music.');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      eventType,
      title: title.trim() || undefined,
      eventDate,
      location,
      guestCount,
      totalBudget,
      currency,
      vibe: vibe.trim() || 'Joyful and memorable celebration',
      specialRequirements: specialRequirements.trim() || undefined,
    });
  };

  const loadPreset = (presetIndex: number) => {
    const p = PRESET_EVENTS[presetIndex];
    if (!p) return;
    setEventType(p.eventType);
    setTitle(p.title || '');
    setEventDate(p.eventDate);
    setLocation(p.location);
    setGuestCount(p.guestCount);
    setTotalBudget(p.totalBudget);
    setCurrency(p.currency);
    setVibe(p.vibe);
    setSpecialRequirements(p.specialRequirements || '');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
                Generate AI Event Master Plan
              </h2>
              <p className="text-xs text-slate-500">
                Tailored budgets, timelines, supplier checklists & personalized themes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-medium whitespace-nowrap">Quick Pre-fill:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => loadPreset(0)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-rose-400 font-medium text-2xs transition"
            >
              💍 Luxury Wedding
            </button>
            <button
              type="button"
              onClick={() => loadPreset(1)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-pink-400 font-medium text-2xs transition"
            >
              🎂 30th Birthday
            </button>
            <button
              type="button"
              onClick={() => loadPreset(2)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-amber-400 font-medium text-2xs transition"
            >
              🏘️ Community Fair
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Event Type Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Celebration Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEventType(opt.id)}
                  className={`p-2.5 rounded-2xl border text-left flex items-start gap-2 transition ${
                    eventType === opt.id
                      ? 'border-rose-500 bg-rose-50/70 ring-1 ring-rose-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {opt.label.split(' ')[0]}
                    </span>
                    <span className="text-2xs text-slate-500 block truncate">
                      {opt.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Event Title / Honoree Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Liam & Maya’s Glasshouse Wedding, or Lucas's 10th Birthday"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Event Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location or Venue Style *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hilltop Glasshouse, Downtown Loft, Town Park"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Guest Count, Budget & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expected Guests *
              </label>
              <input
                type="number"
                required
                min="1"
                max="50000"
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value) || 1))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Budget *
              </label>
              <input
                type="number"
                required
                min="100"
                step="500"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Math.max(100, Number(e.target.value) || 100))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
              >
                {Object.values(CURRENCY_CONFIGS).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vibe & Aesthetic */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Desired Vibe & Atmosphere *
              </label>
              <span className="text-2xs text-slate-400">Tap a suggestion or type below</span>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(VIBE_SUGGESTIONS[eventType] || []).map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVibe(sug)}
                  className="px-2.5 py-1 text-2xs rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-600 transition text-left"
                >
                  + {sug}
                </button>
              ))}
            </div>

            <textarea
              required
              rows={2}
              placeholder="e.g. Warm bohemian, string quartets, lush florals, cozy candlelit dinner"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Special Requests / Dietary / Accessibility (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Wheelchair ramps required, gluten-free catering, child-safe activity zone, signature gin bar"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-pink-500 rounded-xl shadow-md shadow-rose-200 disabled:opacity-50 transition"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isLoading ? 'Generating Master Plan...' : 'Generate AI Event Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

