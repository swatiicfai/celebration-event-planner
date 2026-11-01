import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkRateLimit,
  resetRateLimits,
  sanitizeString,
  isValidISODate,
  clampInteger,
} from '@/lib/security';

describe('security - Rate Limiting', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it('allows requests within window threshold', () => {
    const res1 = checkRateLimit('client-1', 5, 1000);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(4);

    const res2 = checkRateLimit('client-1', 5, 1000);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(3);
  });

  it('blocks requests exceeding maximum requests per window', () => {
    for (let i = 0; i < 3; i++) {
      checkRateLimit('client-spam', 3, 5000);
    }
    const blocked = checkRateLimit('client-spam', 3, 5000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetTimeMs).toBeGreaterThan(Date.now());
  });

  it('isolates different clients by IP or key', () => {
    for (let i = 0; i < 3; i++) {
      checkRateLimit('ip-a', 3, 5000);
    }
    expect(checkRateLimit('ip-a', 3, 5000).allowed).toBe(false);
    expect(checkRateLimit('ip-b', 3, 5000).allowed).toBe(true);
  });
});

describe('security - String Sanitization', () => {
  it('strips script tags and malicious HTML', () => {
    const input = '<script>alert("xss")</script>Hello World';
    expect(sanitizeString(input)).toBe('Hello World');
  });

  it('strips inline event handlers', () => {
    const input = '<img src=x onerror="alert(1)">Vibe';
    expect(sanitizeString(input)).toBe('Vibe');
  });

  it('strips javascript: and data: pseudo-protocols', () => {
    const input = 'javascript:alert(1) Special Note';
    expect(sanitizeString(input)).toBe('alert(1) Special Note');
  });

  it('enforces maximum length truncation safely', () => {
    const longString = 'a'.repeat(500);
    expect(sanitizeString(longString, 50).length).toBe(50);
  });

  it('handles non-string types safely without throwing', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
    expect(sanitizeString(12345)).toBe('');
  });
});

describe('security - ISO Date Validation', () => {
  it('accepts valid YYYY-MM-DD dates', () => {
    expect(isValidISODate('2027-04-18')).toBe(true);
    expect(isValidISODate('2026-12-31')).toBe(true);
  });

  it('rejects invalid or malformed date formats', () => {
    expect(isValidISODate('04/18/2027')).toBe(false);
    expect(isValidISODate('2027-13-01')).toBe(false); // Month 13
    expect(isValidISODate('2027-02-31')).toBe(false); // Feb 31
    expect(isValidISODate('not-a-date')).toBe(false);
  });
});

describe('security - Integer Clamping', () => {
  it('clamps values within bounds', () => {
    expect(clampInteger(50, 1, 100, 10)).toBe(50);
    expect(clampInteger(-10, 1, 100, 10)).toBe(1);
    expect(clampInteger(500, 1, 100, 10)).toBe(100);
  });

  it('returns fallback for NaN or infinite inputs', () => {
    expect(clampInteger('abc', 1, 100, 25)).toBe(25);
    expect(clampInteger(Infinity, 1, 100, 25)).toBe(25);
  });
});

