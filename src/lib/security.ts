/**
 * Security and sanitization utilities for the Celebration & Event Planner.
 * Protects against XSS, injection, rate-abuse, and prototype pollution.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTimeMs: number;
}

// In-memory token bucket / sliding window rate limiter
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 15; // 15 requests per minute

/**
 * Checks whether an IP or identifier has exceeded the allowed rate limit.
 *
 * @param identifier - Unique client IP or fingerprint
 * @param maxRequests - Maximum allowed requests in the time window
 * @param windowMs - Time window in milliseconds
 * @returns RateLimitResult with allowed boolean and remaining quota
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = MAX_REQUESTS_PER_WINDOW,
  windowMs = WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // Clean expired entry
  if (entry && now > entry.expiresAt) {
    rateLimitMap.delete(identifier);
  }

  const current = rateLimitMap.get(identifier);

  if (!current) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + windowMs });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTimeMs: now + windowMs,
    };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTimeMs: current.expiresAt,
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTimeMs: current.expiresAt,
  };
}

/**
 * Resets the rate limit map (useful for test isolation).
 */
export function resetRateLimits(): void {
  rateLimitMap.clear();
}

/**
 * Sanitizes input string to prevent XSS and HTML injection.
 * Strips script tags and inner code, style tags, HTML tags, javascript: URLs, and trims whitespace.
 *
 * @param input - The raw input string
 * @param maxLength - Maximum allowed string length
 * @returns Sanitized safe string
 */
export function sanitizeString(input: unknown, maxLength = 300): string {
  if (typeof input !== 'string') {
    return '';
  }

  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags and content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Strip style tags and content
    .replace(/<[^>]*>/g, '') // Strip any remaining HTML tags
    .replace(/javascript:/gi, '') // Strip inline JS protocols
    .replace(/data:/gi, '') // Strip data URIs
    .replace(/on\w+\s*=/gi, '') // Strip inline event handlers
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip invisible control characters
    .trim();

  return sanitized.slice(0, maxLength);
}

/**
 * Validates that an input date matches YYYY-MM-DD ISO format and represents a real calendar date.
 *
 * @param dateStr - Date string to validate
 * @returns True if valid ISO date string
 */
export function isValidISODate(dateStr: string): boolean {
  if (typeof dateStr !== 'string') return false;
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoRegex.test(dateStr)) return false;

  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const testDate = new Date(year, month - 1, day);
  return (
    testDate.getFullYear() === year &&
    testDate.getMonth() === month - 1 &&
    testDate.getDate() === day
  );
}

/**
 * Validates and clamps an integer value within bounded min/max constraints.
 *
 * @param value - Unknown input value to parse
 * @param min - Minimum allowed bound
 * @param max - Maximum allowed bound
 * @param fallback - Default fallback if invalid
 * @returns Clamped safe integer
 */
export function clampInteger(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number(value);
  if (isNaN(parsed) || !Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(Math.round(parsed), min), max);
}
