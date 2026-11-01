import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventPlan, GeneratePlanRequest } from '@/types/event';
import { generateFallbackPlan } from './constants';
import { logger } from './logger';

/**
 * Generates an event plan using Google Gemini GenAI 1.5 Flash.
 * Falls back to the autonomous local planning engine if the API key is unavailable or rate limited.
 *
 * @param request - GeneratePlanRequest parameters
 * @returns Promise resolving to a comprehensive EventPlan
 */
export async function generateEventPlanWithAI(request: GeneratePlanRequest): Promise<EventPlan> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.info('GEMINI_API_KEY not configured. Generating plan via localized planning engine.');
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
You are an elite event planner with 20+ years experience designing weddings, birthdays, and community festivals.
Generate a comprehensive, creative, financially sound event plan based on this brief:

EVENT BRIEF:
- Event Type: ${request.eventType}
- Event Title: ${request.title || 'Celebration'}
- Event Date: ${request.eventDate}
- Location: ${request.location}
- Guest Count: ${request.guestCount}
- Total Budget: ${request.totalBudget} ${request.currency}
- Vibe: ${request.vibe}
- Special Requirements: ${request.specialRequirements || 'None specified'}

Return a single valid JSON object strictly matching this schema:
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
    "themeName": "Creative theme title",
    "tagline": "Inspiring one-sentence tagline",
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
    "invitationCopySnippet": "Polished invitation phrasing snippet",
    "aiSuggestions": ["Pro tip 1", "Pro tip 2", "Pro tip 3"]
  },
  "budgetItems": [
    {
      "id": "b1",
      "category": "Venue" | "Catering & Drinks" | "Decor & Flowers" | "Photography & Video" | "Entertainment & Music" | "Attire & Beauty" | "Stationery & Favors" | "Logistics & Misc",
      "name": "string",
      "estimatedCost": number,
      "actualCost": 0,
      "paidStatus": "unpaid",
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
      "completed": false,
      "priority": "high" | "medium" | "low",
      "timeSlot": "string (optional for day of event)"
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
      "status": "To Research",
      "estimatedCost": number,
      "actualCost": 0,
      "notes": "string"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedJson = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed: EventPlan = JSON.parse(cleanedJson);
    if (!parsed.id) parsed.id = `plan-${Date.now()}`;
    return parsed;
  } catch (error) {
    logger.warn('Gemini API call encountered an error. Falling back to local planning engine:', error);
    return generateFallbackPlan(request);
  }
}
