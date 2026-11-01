'use client';

import React, { useState, useEffect, memo } from 'react';
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

const VIBE_SUGGESTIONS: Record<EventType, readonly string[]> = {
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
} as const;

/**
 * Event creation modal dialog empowering users to define custom event briefs,
 * select event vibes, and trigger AI generation.
 */
export const EventFormModal: React.FC<EventFormModalProps> = memo(function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}): React.ReactElement | null {
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
    const handleKeyDown = (e: KeyboardEvent): void => {
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
      setEventType(initialData.eventType || 'wedding');
      setTitle(initialData.title || '');
      setEventDate(initialData.eventDate || '');
      setLocation(initialData.location || '');
      setGuestCount(initialData.guestCount || 100);
      setTotalBudget(initialData.totalBudget || 15000);
      setCurrency(initialData.currency || 'USD');
      setVibe(initialData.vibe || '');
      setSpecialRequirements(initialData.specialRequirements || '');
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 90);
      setEventDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSubmit({
      eventType,
      title: title.trim() || undefined,
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      location: location.trim() || 'Custom Venue',
      guestCount: Math.max(1, guestCount),
      totalBudget: Math.max(100, totalBudget),
      currency,
      vibe: vibe.trim() || 'Magical, unforgettable, and elegant',
      specialRequirements: specialRequirements.trim() || undefined,
    });
  };

  const loadPreset = (presetIndex: number): void => {
    const preset = PRESET_EVENTS[presetIndex];
    if (preset) {
      setEventType(preset.eventType);
      setTitle(preset.title || '');
      setEventDate(preset.eventDate);
      setLocation(preset.location);
      setGuestCount(preset.guestCount);
      setTotalBudget(preset.totalBudget);
      setCurrency(preset.currency);
      setVibe(preset.vibe);
      setSpecialRequirements(preset.specialRequirements || '');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-plan-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 id="modal-plan-title" className="text-xl font-extrabold tracking-tight">
                  Design Your Celebration Plan
                </h2>
                <p className="text-xs text-rose-100">
                  Powered by Google Gemini GenAI Planning Engine
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close dialog"
              className="text-white/80 hover:text-white p-1 rounded-xl transition hover:bg-white/10 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Quick Preset Fill Buttons */}
          <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-rose-100">Quick Fill Preset:</span>
            <button
              type="button"
              onClick={() => loadPreset(0)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
            >
              💍 Wedding
            </button>
            <button
              type="button"
              onClick={() => loadPreset(1)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
            >
              🎂 Birthday
            </button>
            <button
              type="button"
              onClick={() => loadPreset(2)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
            >
              🏘️ Community
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Event Type Grid */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Select Celebration Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EVENT_TYPE_OPTIONS.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setEventType(type.id)}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    eventType === type.id
                      ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-400/30'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">{type.icon}</span>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                      {type.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-event-title" className="text-xs font-semibold text-slate-700 block mb-1">
                Event Title
              </label>
              <input
                id="form-event-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Maya & Arjun's Sangeet"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label htmlFor="form-event-date" className="text-xs font-semibold text-slate-700 block mb-1">
                Target Date *
              </label>
              <input
                id="form-event-date"
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Location / Venue Style */}
          <div>
            <label htmlFor="form-location" className="text-xs font-semibold text-slate-700 block mb-1">
              Venue / Location Style *
            </label>
            <input
              id="form-location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Waterfront Pavilion, Botanic Gardens, or Backyard Tent"
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Guest Count, Budget & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="form-guest-count" className="text-xs font-semibold text-slate-700 block mb-1">
                Expected Guests *
              </label>
              <input
                id="form-guest-count"
                type="number"
                required
                min="1"
                max="100000"
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label htmlFor="form-total-budget" className="text-xs font-semibold text-slate-700 block mb-1">
                Total Budget *
              </label>
              <input
                id="form-total-budget"
                type="number"
                required
                min="100"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Math.max(100, parseInt(e.target.value, 10) || 100))}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label htmlFor="form-currency" className="text-xs font-semibold text-slate-700 block mb-1">
                Currency
              </label>
              <select
                id="form-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                {Object.values(CURRENCY_CONFIGS).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vibe / Atmosphere */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="form-vibe" className="text-xs font-semibold text-slate-700">
                Desired Vibe & Aesthetic *
              </label>
              <span className="text-[11px] text-slate-400">Click a vibe suggestion below</span>
            </div>
            <textarea
              id="form-vibe"
              required
              rows={2}
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="e.g. Boho chic sunset garden with acoustic folk music and warm candlelight"
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {/* Quick Vibe Pill Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(VIBE_SUGGESTIONS[eventType] || VIBE_SUGGESTIONS.wedding).map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVibe(suggestion)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 transition"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label htmlFor="form-special-req" className="text-xs font-semibold text-slate-700 block mb-1">
              Special Requirements & Accessibility Needs
            </label>
            <textarea
              id="form-special-req"
              rows={2}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="e.g. Wheelchair accessible ramps, vegan & gluten-free options, drone footage, eco-friendly confetti"
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-md shadow-rose-200 hover:shadow-lg transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <Wand2 className="w-4 h-4" aria-hidden="true" />
              <span>{isLoading ? 'Generating Master Plan...' : 'Generate AI Event Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
