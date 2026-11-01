import { NextRequest, NextResponse } from 'next/server';
import { GeneratePlanRequest, EventType, Currency } from '@/types/event';
import { generateEventPlanWithAI } from '@/lib/gemini';

const VALID_EVENT_TYPES: EventType[] = ['wedding', 'birthday', 'community', 'anniversary', 'corporate', 'other'];
const VALID_CURRENCIES: Currency[] = ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Input Validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request payload. Expected JSON object.' },
        { status: 400 }
      );
    }

    const {
      eventType,
      title,
      eventDate,
      location,
      guestCount,
      totalBudget,
      currency,
      vibe,
      specialRequirements,
    } = body;

    // Validate Event Type
    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { error: `Invalid event type. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate Numbers
    const parsedGuests = Number(guestCount);
    if (isNaN(parsedGuests) || parsedGuests <= 0 || parsedGuests > 100000) {
      return NextResponse.json(
        { error: 'Guest count must be a positive integer between 1 and 100,000.' },
        { status: 400 }
      );
    }

    const parsedBudget = Number(totalBudget);
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      return NextResponse.json(
        { error: 'Total budget must be a positive number greater than 0.' },
        { status: 400 }
      );
    }

    // Validate Currency
    const validCurrency: Currency = VALID_CURRENCIES.includes(currency) ? currency : 'USD';

    // Sanitize Strings
    const sanitizedRequest: GeneratePlanRequest = {
      eventType,
      title: typeof title === 'string' && title.trim().length > 0 ? title.trim().slice(0, 100) : `${eventType.toUpperCase()} Celebration`,
      eventDate: typeof eventDate === 'string' && eventDate.trim().length > 0 ? eventDate.trim() : new Date().toISOString().split('T')[0],
      location: typeof location === 'string' && location.trim().length > 0 ? location.trim().slice(0, 120) : 'Custom Venue',
      guestCount: Math.round(parsedGuests),
      totalBudget: Math.round(parsedBudget),
      currency: validCurrency,
      vibe: typeof vibe === 'string' && vibe.trim().length > 0 ? vibe.trim().slice(0, 300) : 'Elegant, memorable, and celebratory',
      specialRequirements: typeof specialRequirements === 'string' ? specialRequirements.trim().slice(0, 500) : '',
    };

    const plan = await generateEventPlanWithAI(sanitizedRequest);

    return NextResponse.json({
      success: true,
      data: plan,
      generatedWith: process.env.GEMINI_API_KEY ? 'Google Gemini GenAI' : 'Autonomous AI Planning Engine',
    });
  } catch (error: unknown) {
    console.error('Error generating event plan:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate event plan. Please check your inputs and try again.',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined,
      },
      { status: 500 }
    );
  }
}

