import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventPlan, GeneratePlanRequest } from '@/types/event';
import { generateFallbackPlan } from './constants';

export async function generateEventPlanWithAI(request: GeneratePlanRequest): Promise<EventPlan> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful fallback when API key is not configured locally or in preview
    console.info('GEMINI_API_KEY is not set. Generating intelligent structured event plan via localized planning engine.');
    return generateFallbackPlan(request);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const prompt = `
You are an elite, world-class event planner and celebration designer with 20+ years experience producing luxury weddings, milestone birthdays, and community festivals.
Generate a comprehensive, creative, financially sound, and actionable event master plan based on the following client brief:

EVENT BRIEF:
- Event Type: ${request.eventType}
- Event Title: ${request.title || 'Celebration'}
- Event Date: ${request.eventDate}
- Location / Venue Style: ${request.location}
- Guest Count: ${request.guestCount}
- Total Budget: ${request.totalBudget} ${request.currency}
- Vibe / Aesthetic: ${request.vibe}
- Special Requirements / Notes: ${request.specialRequirements || 'None specified'}

REQUIREMENTS FOR JSON OUTPUT:
Return a single JSON object (with NO markdown code fences, pure valid JSON) adhering to this schema:
{
  "id": "string",
  "title": "string",
  "eventType": "${request.eventType}",
  "eventDate": "${request.eventDate}",
  "location": "${request.location}",
  "guestCount": ${request.guestCount},
  "totalBudget": ${request.totalBudget},
  "currency": "${request.currency}",
  "vibe": "${request.vibe}",
  "specialRequirements": "string",
  "createdAt": "${new Date().toISOString()}",
  "ideas": {
    "themeName": "Creative name for the theme",
    "tagline": "Inspiring one-sentence event tagline",
    "colorPalette": [
      { "name": "Color name", "hex": "#HEX" },
      { "name": "Color name", "hex": "#HEX" },
      { "name": "Color name", "hex": "#HEX" },
      { "name": "Color name", "hex": "#HEX" },
      { "name": "Color name", "hex": "#HEX" }
    ],
    "decorConcepts": ["string", "string", "string", "string"],
    "interactiveActivities": ["string", "string", "string", "string"],
    "customFoodDrinkConcepts": ["string", "string", "string", "string"],
    "invitationCopySnippet": "Polished invitation phrasing snippet for stationery or RSVP card",
    "aiSuggestions": ["Pro planning tip 1", "Pro planning tip 2", "Pro planning tip 3"]
  },
  "budgetItems": [
    {
      "id": "b1",
      "category": "Venue" | "Catering & Drinks" | "Decor & Flowers" | "Photography & Video" | "Entertainment & Music" | "Attire & Beauty" | "Stationery & Favors" | "Logistics & Misc",
      "name": "string",
      "estimatedCost": number,
      "actualCost": 0,
      "paidStatus": "unpaid" | "deposit_paid" | "fully_paid",
      "notes": "string"
    }
  ],
  "timeline": [
    {
      "id": "t1",
      "phase": "Planning Phase (Months Before)" | "Vendor Locking (Weeks Before)" | "Final Preparations (Week Of)" | "Day-of Event (Run of Show)",
      "title": "string",
      "description": "string",
      "targetTimeframe": "string",
      "completed": boolean,
      "priority": "high" | "medium" | "low",
      "timeSlot": "string (only for day of event e.g. 10:00 AM)"
    }
  ],
  "vendors": [
    {
      "id": "v1",
      "category": "Venue" | "Catering" | "Photography" | "Music & DJ" | "Decor & Florist" | "Attire & Styling" | "Invitations & Favors" | "Logistics & Rentals",
      "vendorName": "string",
      "contactPerson": "string",
      "contactEmail": "string",
      "contactPhone": "string",
      "status": "To Research" | "Contacted" | "Quoted" | "Booked" | "Completed",
      "estimatedCost": number,
      "actualCost": 0,
      "notes": "string"
    }
  ]
}

Ensure the sum of estimatedCost across budgetItems is roughly equal to ${request.totalBudget}.
Ensure timeline items include a detailed "Day-of Event (Run of Show)" schedule with sequential timeSlot values.
Ensure vendor items match the event requirements.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean any markdown fences if present
    const cleanedJson = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed: EventPlan = JSON.parse(cleanedJson);
    if (!parsed.id) parsed.id = `plan-${Date.now()}`;
    return parsed;
  } catch (error) {
    console.warn('Gemini API call encountered an issue or rate limit. Falling back to local planning engine:', error);
    return generateFallbackPlan(request);
  }
}

