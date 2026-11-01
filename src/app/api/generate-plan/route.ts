import { NextRequest, NextResponse } from 'next/server';
import { GeneratePlanRequest, EventType, Currency } from '@/types/event';
import { generateEventPlanWithAI } from '@/lib/gemini';
import { checkRateLimit, sanitizeString, isValidISODate, clampInteger } from '@/lib/security';
import { logger } from '@/lib/logger';

const VALID_EVENT_TYPES: readonly EventType[] = [
  'wedding',
  'birthday',
  'community',
  'anniversary',
  'corporate',
  'other',
] as const;

const VALID_CURRENCIES: readonly Currency[] = [
  'USD',
  'INR',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
] as const;

/**
 * OPTIONS /api/generate-plan
 * CORS preflight request handler.
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * POST /api/generate-plan
 *
 * Secure server-side endpoint that handles AI generation of comprehensive event plans.
 * Enforces rate limiting, prototype pollution protection, strict input validation,
 * XSS sanitization, and graceful fallback.
 *
 * @param req - NextRequest object
 * @returns NextResponse with generated EventPlan data or structured error
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate Limiting Check
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous-client';

    const rateLimit = checkRateLimit(clientIp, 15, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait before generating another event plan.',
          retryAfterMs: Math.max(0, rateLimit.resetTimeMs - Date.now()),
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '15',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // 2. Parse & Validate Payload Text
    const rawText = await req.text();
    if (!rawText.trim()) {
      return NextResponse.json(
        { error: 'Empty request payload.' },
        { status: 400 }
      );
    }

    // Prototype Pollution Prevention in raw payload
    if (rawText.includes('"__proto__"') || rawText.includes('"constructor"') || rawText.includes('"prototype"')) {
      return NextResponse.json(
        { error: 'Forbidden property detected in request payload.' },
        { status: 400 }
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid request payload. Expected a JSON object.' },
        { status: 400 }
      );
    }

    const raw = body as Record<string, unknown>;

    // 3. Validate Event Type
    const eventType = raw.eventType as EventType;
    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        {
          error: `Invalid event type. Supported categories: ${VALID_EVENT_TYPES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 4. Validate and Sanitize Date
    const rawDate = typeof raw.eventDate === 'string' ? raw.eventDate.trim() : '';
    const safeDate = isValidISODate(rawDate)
      ? rawDate
      : new Date().toISOString().split('T')[0];

    // 5. Validate Numbers (Guest Count & Budget)
    const guestCount = clampInteger(raw.guestCount, 1, 100000, 100);
    const totalBudget = clampInteger(raw.totalBudget, 100, 100000000, 10000);

    // 6. Validate Currency
    const currencyCandidate = raw.currency as Currency;
    const currency: Currency = VALID_CURRENCIES.includes(currencyCandidate)
      ? currencyCandidate
      : 'USD';

    // 7. Sanitize Strings (Prevent XSS and script injection)
    const title = sanitizeString(raw.title, 100) || `${eventType.toUpperCase()} Celebration`;
    const location = sanitizeString(raw.location, 120) || 'Custom Venue';
    const vibe =
      sanitizeString(raw.vibe, 300) ||
      'Elegant, joyful, and meticulously coordinated celebration';
    const specialRequirements = sanitizeString(raw.specialRequirements, 500);

    const sanitizedRequest: GeneratePlanRequest = {
      eventType,
      title,
      eventDate: safeDate,
      location,
      guestCount,
      totalBudget,
      currency,
      vibe,
      specialRequirements,
    };

    // 8. Invoke Gemini AI or Local Planning Engine
    const plan = await generateEventPlanWithAI(sanitizedRequest);

    return NextResponse.json(
      {
        success: true,
        data: plan,
        generatedWith: process.env.GEMINI_API_KEY
          ? 'Google Gemini GenAI'
          : 'Autonomous AI Planning Engine',
      },
      {
        headers: {
          'X-RateLimit-Limit': '15',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error: unknown) {
    logger.error('Error in /api/generate-plan:', error);
    return NextResponse.json(
      {
        error: 'Failed to process event plan generation. Please verify your inputs.',
      },
      { status: 500 }
    );
  }
}
