import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  generateFallbackPlan,
  CURRENCY_CONFIGS,
  EVENT_TYPE_OPTIONS,
  PRESET_EVENTS,
} from '@/lib/constants';
import { GeneratePlanRequest, EventType, Currency } from '@/types/event';

describe('constants - Currency Formatter', () => {
  it('formats USD correctly with commas', () => {
    expect(formatCurrency(25000, 'USD')).toBe('$25,000');
  });

  it('formats INR correctly with symbol', () => {
    expect(formatCurrency(150000, 'INR')).toBe('₹150,000');
  });

  it('formats EUR, GBP, CAD, AUD with respective symbols', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000');
    expect(formatCurrency(1000, 'GBP')).toBe('£1,000');
    expect(formatCurrency(1000, 'CAD')).toBe('CA$1,000');
    expect(formatCurrency(1000, 'AUD')).toBe('AU$1,000');
  });

  it('handles negative or zero values safely', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0');
  });

  it('verifies all supported currencies exist in CURRENCY_CONFIGS', () => {
    const supported: Currency[] = ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD'];
    for (const curr of supported) {
      expect(CURRENCY_CONFIGS[curr]).toBeDefined();
      expect(CURRENCY_CONFIGS[curr].code).toBe(curr);
    }
  });
});

describe('constants - Event Types & Presets', () => {
  it('includes core celebration types: wedding, birthday, community', () => {
    const ids = EVENT_TYPE_OPTIONS.map((o) => o.id);
    expect(ids).toContain('wedding');
    expect(ids).toContain('birthday');
    expect(ids).toContain('community');
    expect(ids).toContain('anniversary');
    expect(ids).toContain('corporate');
  });

  it('has presets defined with valid data', () => {
    expect(PRESET_EVENTS.length).toBeGreaterThanOrEqual(3);
    for (const preset of PRESET_EVENTS) {
      expect(preset.totalBudget).toBeGreaterThan(0);
      expect(preset.guestCount).toBeGreaterThan(0);
      expect(preset.vibe.length).toBeGreaterThan(10);
    }
  });
});

describe('constants - generateFallbackPlan', () => {
  const eventTypes: EventType[] = [
    'wedding',
    'birthday',
    'community',
    'anniversary',
    'corporate',
    'other',
  ];

  for (const type of eventTypes) {
    it(`generates complete, valid EventPlan for type "${type}"`, () => {
      const request: GeneratePlanRequest = {
        eventType: type,
        title: `Test ${type} Title`,
        eventDate: '2027-06-15',
        location: 'Grand Ballroom',
        guestCount: 120,
        totalBudget: 20000,
        currency: 'USD',
        vibe: 'Festive and joyful',
      };

      const plan = generateFallbackPlan(request);

      expect(plan.id).toBeDefined();
      expect(plan.title).toBe(request.title);
      expect(plan.eventDate).toBe('2027-06-15');
      expect(plan.totalBudget).toBe(20000);
      expect(plan.ideas.themeName).toBeDefined();
      expect(plan.ideas.colorPalette.length).toBe(5);
      expect(plan.ideas.decorConcepts.length).toBeGreaterThan(0);
      expect(plan.ideas.interactiveActivities.length).toBeGreaterThan(0);
      expect(plan.budgetItems.length).toBeGreaterThanOrEqual(4);
      expect(plan.timeline.length).toBeGreaterThanOrEqual(5);
      expect(plan.vendors.length).toBeGreaterThanOrEqual(3);

      // Verify budget items sum roughly matches total
      const budgetSum = plan.budgetItems.reduce((acc, i) => acc + i.estimatedCost, 0);
      expect(budgetSum).toBeGreaterThanOrEqual(18000);
      expect(budgetSum).toBeLessThanOrEqual(22000);
    });
  }

  it('defaults gracefully when zero budget is passed', () => {
    const plan = generateFallbackPlan({
      eventType: 'wedding',
      eventDate: '2027-01-01',
      location: 'Park',
      guestCount: 50,
      totalBudget: 0,
      currency: 'USD',
      vibe: 'Minimal',
    });
    expect(plan.totalBudget).toBe(10000);
  });
});

