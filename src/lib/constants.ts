import { Currency, CurrencyConfig, EventType, EventPlan, GeneratePlanRequest } from '@/types/event';

/**
 * Currency configuration dictionary mapping currency codes to symbols and descriptive names.
 */
export const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar' },
};

/**
 * Supported celebration event types with icons, labels, and descriptions aligned with the challenge prompt.
 */
export const EVENT_TYPE_OPTIONS: readonly {
  id: EventType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    id: 'wedding',
    label: 'Wedding Celebration',
    icon: '💍',
    description: 'Ceremonies, receptions, sangeet, rehearsal dinners & grand union events',
  },
  {
    id: 'birthday',
    label: 'Birthday Bash',
    icon: '🎂',
    description: 'Kids parties, milestone 18th/21st/30th/50th, themed celebrations & surprise parties',
  },
  {
    id: 'community',
    label: 'Community & Cultural Event',
    icon: '🏘️',
    description: 'Block parties, charity galas, cultural festivals, neighborhood food fairs & hackathons',
  },
  {
    id: 'anniversary',
    label: 'Anniversary & Milestone',
    icon: '🥂',
    description: 'Silver/Golden jubilees, romantic renewals, and personal triumphs',
  },
  {
    id: 'corporate',
    label: 'Corporate & Networking',
    icon: '💼',
    description: 'Team retreats, annual summits, product launches and galas',
  },
  {
    id: 'other',
    label: 'Custom Celebration',
    icon: '✨',
    description: 'Baby showers, graduation parties, housewarmings and reunions',
  },
] as const;

/**
 * Instant-fill curated celebration presets for rapid demonstration.
 */
export const PRESET_EVENTS: readonly GeneratePlanRequest[] = [
  {
    eventType: 'wedding',
    title: 'Aura & Royal Botanical Wedding',
    eventDate: '2027-04-18',
    location: 'Hilltop Glasshouse & Vineyard',
    guestCount: 150,
    totalBudget: 25000,
    currency: 'USD',
    vibe: 'Romantic, Botanical Glasshouse with Warm Fairy Lights & Acoustic Soul',
    specialRequirements: 'Eco-friendly biodegradable confetti, gluten-free dessert bar, signature mocktails and candid film photography.',
  },
  {
    eventType: 'birthday',
    title: 'Neon Retro Arcade 30th Birthday',
    eventDate: '2026-12-12',
    location: 'Urban Rooftop Loft',
    guestCount: 60,
    totalBudget: 5000,
    currency: 'USD',
    vibe: '80s Synthwave & Neon Glow with Retro Arcade Cabinets and Craft Sliders',
    specialRequirements: 'Custom LED photo booth, vinyl DJ set, glow-in-the-dark cocktails and customized birthday trivia.',
  },
  {
    eventType: 'community',
    title: 'Heritage Harvest & Arts Community Fair',
    eventDate: '2026-11-28',
    location: 'Greenfield Town Square & Park',
    guestCount: 400,
    totalBudget: 8500,
    currency: 'USD',
    vibe: 'Vibrant, Inclusive, Family-friendly with Folk Music & Artisan Food Trucks',
    specialRequirements: 'Wheelchair accessible ramps, local farmer vendor booths, interactive pottery workshop, zero-waste recycling station.',
  },
] as const;

/**
 * Formats a monetary amount into a clean currency string.
 *
 * @param amount - Number value to format
 * @param currency - Currency code (USD, INR, EUR, etc.)
 * @returns Formatted currency string (e.g., "$25,000", "₹1,50,000")
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const safeAmount = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `${config.symbol}${safeAmount.toLocaleString('en-US')}`;
}

/**
 * Generates an intelligent, tailored, structured EventPlan.
 * Supports all 6 event types with domain-authentic themes, budgets, timelines, and vendor networks.
 *
 * @param request - GeneratePlanRequest containing event preferences
 * @returns Complete EventPlan object
 */
export function generateFallbackPlan(request: GeneratePlanRequest): EventPlan {
  const total = request.totalBudget > 0 ? request.totalBudget : 10000;
  const curr = request.currency || 'USD';
  const type = request.eventType;
  const planId = `plan-${Date.now()}`;
  const nowIso = new Date().toISOString();

  // 1. Wedding Celebration
  if (type === 'wedding') {
    return {
      id: planId,
      title: request.title || 'Dream Wedding Celebration',
      eventType: 'wedding',
      eventDate: request.eventDate,
      location: request.location,
      guestCount: request.guestCount,
      totalBudget: total,
      currency: curr,
      vibe: request.vibe,
      specialRequirements: request.specialRequirements || 'Customized wedding experience',
      createdAt: nowIso,
      ideas: {
        themeName: 'Ethereal Garden Bloom & Golden Candlelight',
        tagline: 'An unforgettable evening woven in romance, laughter, and timeless memories.',
        colorPalette: [
          { name: 'Sage Green', hex: '#87A987' },
          { name: 'Champagne Gold', hex: '#F3E5AB' },
          { name: 'Blush Rose', hex: '#F4C2C2' },
          { name: 'Ivory Cream', hex: '#FFFFF0' },
          { name: 'Muted Terracotta', hex: '#CC7F66' },
        ],
        decorConcepts: [
          'Hanging eucalyptus and wisteria floral chandelier suspended above the dance floor',
          'Cascading pillar candles along the aisle and banquet tables in warm brass candelabras',
          'Custom welcome mirror with hand-lettered calligraphy welcome signage and polaroid guestbook station',
          'Intimate lounge vignette with velvet sofas and fairy-lit olive trees',
        ],
        interactiveActivities: [
          'Audio Guestbook where guests leave heartfelt voicemails on vintage rotary phones',
          'Live Watercolor Painter capturing the ceremony and reception in real-time',
          'Late-night personalized s’mores & artisanal churro firepit station',
          'Choreographed couple entrance with cold-spark fountain effects',
        ],
        customFoodDrinkConcepts: [
          'Signature Cocktail: "The Love Spark" (Gin, Elderflower, Fresh Blackberry & Champagne foam)',
          'Signature Mocktail: "Rosewater Citrus Fizz" (Sparkling grapefruit, rosemary sprig, edible pansies)',
          'Late-Night Gourmet Sliders and Truffle Parmesan Fries served in bamboo cones',
          'Farm-to-table grazing tables featuring local cheeses, honeycomb, and heirloom figs',
        ],
        invitationCopySnippet:
          'Together with their families, invite you to join them in celebrating love, laughter, and happily ever after. Cocktails, dinner, and dancing to follow under the stars.',
        aiSuggestions: [
          'Book a day-of coordinator at least 3 months ahead to ensure timeline adherence without couple stress.',
          'Schedule golden-hour couple photography 45 minutes before sunset for optimal natural lighting.',
          'Prepare emergency beauty & sewing kit containing stain remover, blister pads, and backup pins.',
        ],
      },
      budgetItems: [
        { id: 'b1', category: 'Venue', name: 'Ceremony & Reception Venue Rental', estimatedCost: Math.round(total * 0.38), actualCost: 0, paidStatus: 'deposit_paid', notes: 'Includes tables, chairs, and security' },
        { id: 'b2', category: 'Catering & Drinks', name: 'Plated Dinner & Open Bar', estimatedCost: Math.round(total * 0.30), actualCost: 0, paidStatus: 'unpaid', notes: `Priced at ~$${Math.round((total * 0.30) / Math.max(request.guestCount, 1))}/guest` },
        { id: 'b3', category: 'Photography & Video', name: 'Photo & Cinematic Video Package (8 hrs)', estimatedCost: Math.round(total * 0.12), actualCost: 0, paidStatus: 'unpaid', notes: 'Includes drone footage and teaser reel' },
        { id: 'b4', category: 'Decor & Flowers', name: 'Floral Arches, Centerpieces & Ambient Lighting', estimatedCost: Math.round(total * 0.10), actualCost: 0, paidStatus: 'unpaid', notes: 'Locally sourced seasonal florals' },
        { id: 'b5', category: 'Entertainment & Music', name: 'Acoustic Ceremony Trio & Evening Live DJ', estimatedCost: Math.round(total * 0.05), actualCost: 0, paidStatus: 'unpaid', notes: 'Wireless mics and sound system included' },
        { id: 'b6', category: 'Stationery & Favors', name: 'Save the Dates, Menus, Signage & Eco Favors', estimatedCost: Math.round(total * 0.02), actualCost: 0, paidStatus: 'unpaid', notes: 'Seed-paper planting favors' },
        { id: 'b7', category: 'Logistics & Misc', name: 'Emergency Contingency & Gratuity Fund', estimatedCost: Math.round(total * 0.03), actualCost: 0, paidStatus: 'unpaid', notes: 'Buffer for unforeseen requirements' },
      ],
      timeline: [
        { id: 't1', phase: 'Planning Phase (Months Before)', title: 'Finalize Guest List & Secure Venue', description: 'Determine headcount bounds and sign venue contract with date guarantee.', targetTimeframe: '6-9 months out', completed: true, priority: 'high' },
        { id: 't2', phase: 'Planning Phase (Months Before)', title: 'Book Core Creative Team', description: 'Hire lead photographer, videographer, caterer, and band/DJ.', targetTimeframe: '4-6 months out', completed: true, priority: 'high' },
        { id: 't3', phase: 'Vendor Locking (Weeks Before)', title: 'Menu Tasting & Floral Mockups', description: 'Confirm dietary accommodations and review table setting proofs.', targetTimeframe: '6-8 weeks out', completed: false, priority: 'medium' },
        { id: 't4', phase: 'Vendor Locking (Weeks Before)', title: 'Finalize RSVP Counts & Seating Chart', description: 'Send final numbers to caterer and arrange escort card display.', targetTimeframe: '3 weeks out', completed: false, priority: 'high' },
        { id: 't5', phase: 'Final Preparations (Week Of)', title: 'Wedding Rehearsal & Vendor Schedule Distribution', description: 'Confirm load-in times with venue and give run-of-show to bridal party.', targetTimeframe: '2 days before', completed: false, priority: 'high' },
        { id: 't6', phase: 'Day-of Event (Run of Show)', title: 'Hair, Makeup & Groom Styling', description: 'Bridal suite prep with morning refreshments and photographer detail shots.', targetTimeframe: '09:00 AM', completed: false, priority: 'medium', timeSlot: '09:00 AM' },
        { id: 't7', phase: 'Day-of Event (Run of Show)', title: 'First Look & Wedding Party Portraits', description: 'Intimate first look followed by family and bridal party photographs.', targetTimeframe: '02:30 PM', completed: false, priority: 'high', timeSlot: '02:30 PM' },
        { id: 't8', phase: 'Day-of Event (Run of Show)', title: 'Ceremony Processional & Vows', description: 'Acoustic prelude music, vows exchange, ring ceremony, and joyful exit.', targetTimeframe: '04:30 PM', completed: false, priority: 'high', timeSlot: '04:30 PM' },
        { id: 't9', phase: 'Day-of Event (Run of Show)', title: 'Cocktail Hour & Passed Hors d’Oeuvres', description: 'Live jazz, signature drinks, and couple sunset portrait session.', targetTimeframe: '05:30 PM', completed: false, priority: 'medium', timeSlot: '05:30 PM' },
        { id: 't10', phase: 'Day-of Event (Run of Show)', title: 'Grand Entrance, Dinner & First Dance', description: 'Celebratory welcome, speeches, gourmet dinner, and open dance floor.', targetTimeframe: '07:00 PM', completed: false, priority: 'high', timeSlot: '07:00 PM' },
      ],
      vendors: [
        { id: 'v1', category: 'Venue', vendorName: request.location || 'Botanical Glasshouse Estate', contactPerson: 'Elena Vance', contactEmail: 'events@glasshouse.com', status: 'Booked', estimatedCost: Math.round(total * 0.38), actualCost: Math.round(total * 0.38), notes: 'Deposit paid; curfew at midnight.' },
        { id: 'v2', category: 'Catering', vendorName: 'Artisan Culinary Collective', contactPerson: 'Chef Marcus Roy', contactEmail: 'info@artisanculinary.com', status: 'Quoted', estimatedCost: Math.round(total * 0.30), notes: 'Final tasting scheduled next Thursday.' },
        { id: 'v3', category: 'Photography', vendorName: 'Lumière Visual Stories', contactPerson: 'Sofia Chen', contactEmail: 'sofia@lumierevisual.com', status: 'Booked', estimatedCost: Math.round(total * 0.12), notes: 'Contract includes second shooter.' },
        { id: 'v4', category: 'Music & DJ', vendorName: 'SoundWave Collective & Live Brass', contactPerson: 'DJ Tariq', contactEmail: 'booking@soundwave.com', status: 'Contacted', estimatedCost: Math.round(total * 0.05), notes: 'Sent song blacklist and first dance acoustic track.' },
        { id: 'v5', category: 'Decor & Florist', vendorName: 'Wildflower & Willow Floral Studio', contactPerson: 'Hannah Miller', contactEmail: 'hello@wildflowerwillow.com', status: 'Quoted', estimatedCost: Math.round(total * 0.10), notes: 'Reviewing arch dimensions.' },
      ],
    };
  }

  // 2. Birthday Bash
  if (type === 'birthday') {
    return {
      id: planId,
      title: request.title || 'Epic Birthday Celebration',
      eventType: 'birthday',
      eventDate: request.eventDate,
      location: request.location,
      guestCount: request.guestCount,
      totalBudget: total,
      currency: curr,
      vibe: request.vibe,
      specialRequirements: request.specialRequirements || 'Memorable themed party with high energy',
      createdAt: nowIso,
      ideas: {
        themeName: 'Midnight Neon & Electric Velvet Lounge',
        tagline: 'Level up another year of memories with electrifying music, immersive gaming, and great friends.',
        colorPalette: [
          { name: 'Electric Violet', hex: '#8A2BE2' },
          { name: 'Cyber Neon Cyan', hex: '#00F0FF' },
          { name: 'Hot Magenta', hex: '#FF007F' },
          { name: 'Deep Midnight Onyx', hex: '#0F0F1A' },
          { name: 'Glow Amber', hex: '#FFBF00' },
        ],
        decorConcepts: [
          'Custom Neon LED centerpiece sign with the birthday star’s nickname or milestone year',
          'Reflective chrome balloon installations with LED backlight glow tubes',
          'Retro arcade cabinet station and interactive glow-pong table',
          'Selfie mirror booth with AI instant portrait filters and digital delivery',
        ],
        interactiveActivities: [
          'Custom Roast & Toast or Fun Trivia game with live smartphone buzzer voting',
          'Flash Mixology Bar: Guests blend custom drink garnishes and smoking dry-ice infusions',
          'DJ request roulette and milestone montage video screening',
          'Midnight glow confetti drop & celebratory champagne pop',
        ],
        customFoodDrinkConcepts: [
          'Signature Cocktail: "The Neon Luminary" (Dragonfruit gin, blue curaçao, tonic that glows under UV light)',
          'Gourmet Slider Trio: Truffle wagyu, Nashville hot chicken, and crispy halloumi slider bites',
          'Custom Multi-tier drip cake with edible neon glitter and geometric toppers',
          'Late-night artisanal pizza delivery bar with gourmet hot honey dip',
        ],
        invitationCopySnippet:
          'Get ready to party! Join us for a night of neon lights, killer beats, and high spirits as we toast to another iconic year.',
        aiSuggestions: [
          'Curate a shared Spotify playlist link on the digital invitation for guest music requests beforehand.',
          'Designate a phone charging bar with marked cables so guests can record reels without battery worries.',
          'Order custom temporary glow tattoos with inside jokes for a viral party trend.',
        ],
      },
      budgetItems: [
        { id: 'b1', category: 'Venue', name: 'Private Lounge / Rooftop Booking', estimatedCost: Math.round(total * 0.35), actualCost: 0, paidStatus: 'deposit_paid', notes: 'Private mezzanine with dedicated bartender' },
        { id: 'b2', category: 'Catering & Drinks', name: 'Finger Food Buffet, Appetizers & Open Tab', estimatedCost: Math.round(total * 0.32), actualCost: 0, paidStatus: 'unpaid', notes: 'Slider bar & craft brews' },
        { id: 'b3', category: 'Entertainment & Music', name: 'Club DJ & Interactive Arcade Rental', estimatedCost: Math.round(total * 0.15), actualCost: 0, paidStatus: 'unpaid', notes: '3-hour DJ set and sound equipment' },
        { id: 'b4', category: 'Decor & Flowers', name: 'Neon Signs, Chrome Balloons & Glow Lights', estimatedCost: Math.round(total * 0.08), actualCost: 0, paidStatus: 'unpaid', notes: 'Custom LED rental' },
        { id: 'b5', category: 'Photography & Video', name: 'Photographer & 360 Video Booth', estimatedCost: Math.round(total * 0.07), actualCost: 0, paidStatus: 'unpaid', notes: '3 hours coverage' },
        { id: 'b6', category: 'Logistics & Misc', name: 'Custom Cake, Favors & Emergency Buffer', estimatedCost: Math.round(total * 0.03), actualCost: 0, paidStatus: 'unpaid', notes: 'Artisan bakery cake order' },
      ],
      timeline: [
        { id: 't1', phase: 'Planning Phase (Months Before)', title: 'Set Date & Book Party Space', description: 'Lock in date, location, and guest RSVP form.', targetTimeframe: '6-8 weeks out', completed: true, priority: 'high' },
        { id: 't2', phase: 'Vendor Locking (Weeks Before)', title: 'Commission Custom Cake & DJ Playlist', description: 'Confirm bakery flavor tasting and build Spotify mood board.', targetTimeframe: '3 weeks out', completed: false, priority: 'medium' },
        { id: 't3', phase: 'Vendor Locking (Weeks Before)', title: 'Order Neon Signage & Custom Favors', description: 'Approve custom LED proof and delivery timing.', targetTimeframe: '2 weeks out', completed: false, priority: 'high' },
        { id: 't4', phase: 'Final Preparations (Week Of)', title: 'Finalize RSVP Headcount & Food Quantities', description: 'Send headcount update to venue/caterer.', targetTimeframe: '4 days before', completed: false, priority: 'high' },
        { id: 't5', phase: 'Day-of Event (Run of Show)', title: 'Vendor Load-in & Lighting Setup', description: 'DJ soundcheck, balloon arrangement, bar setup.', targetTimeframe: '05:00 PM', completed: false, priority: 'high', timeSlot: '05:00 PM' },
        { id: 't6', phase: 'Day-of Event (Run of Show)', title: 'Doors Open & Welcome Drinks', description: 'Acoustic/chill beats, signature cocktails, photo booth fun.', targetTimeframe: '07:30 PM', completed: false, priority: 'medium', timeSlot: '07:30 PM' },
        { id: 't7', phase: 'Day-of Event (Run of Show)', title: 'Birthday Roast, Cake Cutting & Confetti', description: 'Toast by best friends, sparkler cake entrance, confetti pop.', targetTimeframe: '09:45 PM', completed: false, priority: 'high', timeSlot: '09:45 PM' },
        { id: 't8', phase: 'Day-of Event (Run of Show)', title: 'Dance Floor & High Energy Late Night', description: 'Full DJ dance party with late night sliders.', targetTimeframe: '10:15 PM', completed: false, priority: 'medium', timeSlot: '10:15 PM' },
      ],
      vendors: [
        { id: 'v1', category: 'Venue', vendorName: request.location || 'The Skyline Rooftop Bar', contactPerson: 'Jordan Hayes', status: 'Booked', estimatedCost: Math.round(total * 0.35), notes: 'Deposit cleared.' },
        { id: 'v2', category: 'Music & DJ', vendorName: 'Bassline Productions', contactPerson: 'DJ Jax', status: 'Booked', estimatedCost: Math.round(total * 0.15), notes: 'Includes laser lighting.' },
        { id: 'v3', category: 'Catering', vendorName: 'Metro Bites Catering & Sweets', contactPerson: 'Sarah Lin', status: 'Quoted', estimatedCost: Math.round(total * 0.32), notes: 'Slider tasting confirmed.' },
        { id: 'v4', category: 'Photography', vendorName: 'PixelWave 360 Booth', contactPerson: 'Dave K.', status: 'Contacted', estimatedCost: Math.round(total * 0.07), notes: 'Includes instant SMS sharing.' },
      ],
    };
  }

  // 3. Anniversary & Milestone
  if (type === 'anniversary') {
    return {
      id: planId,
      title: request.title || 'Golden Milestone Anniversary',
      eventType: 'anniversary',
      eventDate: request.eventDate,
      location: request.location,
      guestCount: request.guestCount,
      totalBudget: total,
      currency: curr,
      vibe: request.vibe,
      specialRequirements: request.specialRequirements || 'Romantic nostalgia, tribute retrospective, multi-generational family warmth',
      createdAt: nowIso,
      ideas: {
        themeName: 'A Tapestry of Gold: Celebrating Decades of Love',
        tagline: 'Reflecting on an enduring journey of devotion, laughter, and family legacy.',
        colorPalette: [
          { name: 'Burnished Gold', hex: '#D4AF37' },
          { name: 'Warm Cream', hex: '#FFFDD0' },
          { name: 'Burgundy Velvet', hex: '#800020' },
          { name: 'Olive Green', hex: '#556B2F' },
          { name: 'Champagne Shimmer', hex: '#F7E7CE' },
        ],
        decorConcepts: [
          'Illuminated retrospective memory walkway showcasing framed photos across the decades',
          'Antique gold candelabras surrounded by white garden roses and olive branches',
          'Custom velvet guestbook with family archival messages and golden ink pens',
          'Ambient string lighting canopy and vintage champagne tower installation',
        ],
        interactiveActivities: [
          'Vow renewal ceremony followed by surprise tribute speeches from children & grandchildren',
          'Live swing or jazz quartet performing songs from the original wedding year',
          'Vintage photo slideshow projected onto warm canvas during dinner',
          'Commemorative champagne toast with custom engraved flutes for all guests',
        ],
        customFoodDrinkConcepts: [
          'Signature Cocktail: "The Golden Jubilee" (Bourbon, spiced apple syrup, prosecco & gold leaf)',
          'Multi-course wine-paired dinner inspired by the couple’s favorite travel destinations',
          'Replica tiered wedding cake reimagined with modern artisanal flavors',
          'Late-night dessert bar with macarons, chocolate truffles, and espresso martinis',
        ],
        invitationCopySnippet:
          'Because you have shared in their lives and enriched their story, you are warmly invited to celebrate the milestone anniversary and enduring love of our parents.',
        aiSuggestions: [
          'Collect scanned historical family photographs 4 weeks in advance for seamless slide projection.',
          'Schedule an acoustic sound check 1 hour prior to guests arrival to balance speech acoustics.',
          'Arrange comfortable priority seating for senior family members near the stage.',
        ],
      },
      budgetItems: [
        { id: 'b1', category: 'Venue', name: 'Private Estate Courtyard & Dining Room', estimatedCost: Math.round(total * 0.36), actualCost: 0, paidStatus: 'deposit_paid', notes: 'Includes tables, linens, and private terrace' },
        { id: 'b2', category: 'Catering & Drinks', name: 'Curated 4-Course Dinner & Wine Pairing', estimatedCost: Math.round(total * 0.34), actualCost: 0, paidStatus: 'unpaid', notes: 'Wine sommelier pairing included' },
        { id: 'b3', category: 'Photography & Video', name: 'Documentary Photo & Audio Interview Package', estimatedCost: Math.round(total * 0.12), actualCost: 0, paidStatus: 'unpaid', notes: 'Includes family heritage video archive' },
        { id: 'b4', category: 'Entertainment & Music', name: 'Live Jazz Quartet & Audio Technician', estimatedCost: Math.round(total * 0.08), actualCost: 0, paidStatus: 'unpaid', notes: '4-hour live acoustic set' },
        { id: 'b5', category: 'Decor & Flowers', name: 'Gold Candelabras, Memory Wall & Florals', estimatedCost: Math.round(total * 0.07), actualCost: 0, paidStatus: 'unpaid', notes: 'Seasonal roses and archival framing' },
        { id: 'b6', category: 'Stationery & Favors', name: 'Embossed Invitations & Engraved Keepsake Flutes', estimatedCost: Math.round(total * 0.03), actualCost: 0, paidStatus: 'unpaid', notes: 'Custom monogrammed favor boxes' },
      ],
      timeline: [
        { id: 't1', phase: 'Planning Phase (Months Before)', title: 'Reserve Private Venue & Date', description: 'Lock in estate space and send out formal Save the Dates.', targetTimeframe: '4-5 months out', completed: true, priority: 'high' },
        { id: 't2', phase: 'Vendor Locking (Weeks Before)', title: 'Gather Archival Photos & Video Clips', description: 'Digitize legacy prints and assemble slideshow reel.', targetTimeframe: '6 weeks out', completed: false, priority: 'high' },
        { id: 't3', phase: 'Final Preparations (Week Of)', title: 'Finalize Seating Chart & Speeches Order', description: 'Confirm toast order with MC and send final headcount.', targetTimeframe: '5 days before', completed: false, priority: 'medium' },
        { id: 't4', phase: 'Day-of Event (Run of Show)', title: 'Courtyard Floral & Memory Wall Setup', description: 'Arrange archival memory walk and table candelabras.', targetTimeframe: '03:00 PM', completed: false, priority: 'high', timeSlot: '03:00 PM' },
        { id: 't5', phase: 'Day-of Event (Run of Show)', title: 'Guest Welcome & Champagne Reception', description: 'Jazz quartet begins; guests mingle and view memory gallery.', targetTimeframe: '05:30 PM', completed: false, priority: 'medium', timeSlot: '05:30 PM' },
        { id: 't6', phase: 'Day-of Event (Run of Show)', title: 'Vow Renewal & Golden Toast', description: 'Heartfelt renewal exchange followed by family tribute speeches.', targetTimeframe: '06:45 PM', completed: false, priority: 'high', timeSlot: '06:45 PM' },
        { id: 't7', phase: 'Day-of Event (Run of Show)', title: 'Plated Dinner & Retrospective Video', description: 'Four-course culinary service with archival video screening.', targetTimeframe: '07:30 PM', completed: false, priority: 'high', timeSlot: '07:30 PM' },
      ],
      vendors: [
        { id: 'v1', category: 'Venue', vendorName: request.location || 'The Heritage Courtyard Estate', contactPerson: 'Clara Oswald', status: 'Booked', estimatedCost: Math.round(total * 0.36), notes: 'Outdoor heaters included.' },
        { id: 'v2', category: 'Catering', vendorName: 'Sommelier & Savor Catering', contactPerson: 'Chef Antoine', status: 'Quoted', estimatedCost: Math.round(total * 0.34), notes: 'Tasting scheduled for family.' },
        { id: 'v3', category: 'Photography', vendorName: 'Legacy Archive Studios', contactPerson: 'Julian Ross', status: 'Booked', estimatedCost: Math.round(total * 0.12), notes: 'Specializes in multi-generational portraits.' },
        { id: 'v4', category: 'Music & DJ', vendorName: 'Velvet Strings & Jazz Quartet', contactPerson: 'Miles Vance', status: 'Contacted', estimatedCost: Math.round(total * 0.08), notes: 'Repertoire approved.' },
      ],
    };
  }

  // 4. Corporate & Networking
  if (type === 'corporate') {
    return {
      id: planId,
      title: request.title || 'Executive Leadership & Innovation Gala',
      eventType: 'corporate',
      eventDate: request.eventDate,
      location: request.location,
      guestCount: request.guestCount,
      totalBudget: total,
      currency: curr,
      vibe: request.vibe,
      specialRequirements: request.specialRequirements || 'High-impact keynote presentation, seamless AV, premier networking, executive hospitality',
      createdAt: nowIso,
      ideas: {
        themeName: 'Catalyst: Pioneering The Next Frontier',
        tagline: 'Fostering vision, meaningful connections, and celebratory industry breakthroughs.',
        colorPalette: [
          { name: 'Executive Navy', hex: '#0A192F' },
          { name: 'Titanium Silver', hex: '#C0C0C0' },
          { name: 'Innovation Cyan', hex: '#00D2D3' },
          { name: 'Pure White', hex: '#FFFFFF' },
          { name: 'Slate Gray', hex: '#4A5568' },
        ],
        decorConcepts: [
          'High-definition LED video wall backdrop with synchronized dynamic motion graphics',
          'Modern geometric stage design with directional spotlights and sleek acrylic podium',
          'Interactive sponsor demonstration booths and branded executive meeting pods',
          'Contemporary high-top cocktail tables with minimalist succulent centerpieces',
        ],
        interactiveActivities: [
          'Speed networking rotations facilitated via digital conference mobile app',
          'Live interactive polling with keynote results rendered in real time on stage screens',
          'Annual Excellence Awards presentation with custom laser-cut crystal trophies',
          'Closing executive cocktail social with live ambient lounge DJ',
        ],
        customFoodDrinkConcepts: [
          'Elevated passed appetizers: Mini beef wellingtons, tuna tartare crisps, vegan truffle arancini',
          'Custom Espresso & Nitro Cold Brew Bar with on-demand latte art',
          'Signature Mocktail: "The Catalyst Spark" (Yuzu, ginger beer, clarified lime & rosemary smoke)',
          'Artisan plated dinner catering to gluten-free, vegan, and kosher requirements',
        ],
        invitationCopySnippet:
          'You are cordially invited to join industry leaders, founders, and innovators for an evening of vision, strategic connection, and celebration at the Annual Leadership Gala.',
        aiSuggestions: [
          'Perform a complete AV latency and wireless mic frequency check 3 hours before doors open.',
          'Provide dedicated private lounge with high-speed Wi-Fi and power banks for VIP keynote speakers.',
          'Pre-print color-coded NFC/QR badges organized alphabetically for rapid 2-minute registration.',
        ],
      },
      budgetItems: [
        { id: 'b1', category: 'Venue', name: 'Conference Center Ballroom & Breakout Wings', estimatedCost: Math.round(total * 0.32), actualCost: 0, paidStatus: 'deposit_paid', notes: 'Includes high-speed Wi-Fi and security' },
        { id: 'b2', category: 'Logistics & Misc', name: 'Stage Production, LED Wall & Audio Engineering', estimatedCost: Math.round(total * 0.28), actualCost: 0, paidStatus: 'unpaid', notes: 'Professional broadcast-grade AV crew' },
        { id: 'b3', category: 'Catering & Drinks', name: 'Executive Dinner, Coffee Bar & Cocktail Reception', estimatedCost: Math.round(total * 0.24), actualCost: 0, paidStatus: 'unpaid', notes: 'Dietary certified catering team' },
        { id: 'b4', category: 'Stationery & Favors', name: 'Branded Lanyards, Welcome Packets & Awards', estimatedCost: Math.round(total * 0.08), actualCost: 0, paidStatus: 'unpaid', notes: 'Laser engraved crystal awards' },
        { id: 'b5', category: 'Photography & Video', name: 'Keynote Recording & Executive Headshots Booth', estimatedCost: Math.round(total * 0.05), actualCost: 0, paidStatus: 'unpaid', notes: 'Full-day multi-camera capture' },
        { id: 'b6', category: 'Entertainment & Music', name: 'Ambient Lounge DJ & Keynote Walk-up Stings', estimatedCost: Math.round(total * 0.03), actualCost: 0, paidStatus: 'unpaid', notes: 'Audio sting library prepared' },
      ],
      timeline: [
        { id: 't1', phase: 'Planning Phase (Months Before)', title: 'Secure Keynote Speakers & Convention Space', description: 'Confirm speaker riders, travel accommodations, and venue contract.', targetTimeframe: '4-6 months out', completed: true, priority: 'high' },
        { id: 't2', phase: 'Vendor Locking (Weeks Before)', title: 'Review AV Cue Sheets & Slide Presentations', description: 'Collect 16:9 presentation decks and test aspect ratios.', targetTimeframe: '3 weeks out', completed: false, priority: 'high' },
        { id: 't3', phase: 'Final Preparations (Week Of)', title: 'Pre-Print Attendee Badges & Safety Walkthrough', description: 'Verify registration desk flow, fire exits, and dietary tags.', targetTimeframe: '2 days before', completed: false, priority: 'high' },
        { id: 't4', phase: 'Day-of Event (Run of Show)', title: 'Technical Rehearsal & Speaker Mic Checks', description: 'Test lavalier microphones, slide clickers, and stage monitors.', targetTimeframe: '01:00 PM', completed: false, priority: 'high', timeSlot: '01:00 PM' },
        { id: 't5', phase: 'Day-of Event (Run of Show)', title: 'Registration & Welcome Coffee Networking', description: 'Attendees arrive, collect badges, and enjoy barista bar.', targetTimeframe: '03:00 PM', completed: false, priority: 'medium', timeSlot: '03:00 PM' },
        { id: 't6', phase: 'Day-of Event (Run of Show)', title: 'Opening Remarks & Keynote Addresses', description: 'Executive welcome followed by vision keynote and awards.', targetTimeframe: '04:15 PM', completed: false, priority: 'high', timeSlot: '04:15 PM' },
        { id: 't7', phase: 'Day-of Event (Run of Show)', title: 'Networking Cocktail Reception & Dinner', description: 'Chef-curated dinner and networking in sponsor lounge.', targetTimeframe: '06:30 PM', completed: false, priority: 'medium', timeSlot: '06:30 PM' },
      ],
      vendors: [
        { id: 'v1', category: 'Venue', vendorName: request.location || 'Metropolitan Convention Hall', contactPerson: 'David Miller', status: 'Booked', estimatedCost: Math.round(total * 0.32), notes: 'Loading dock access 8:00 AM.' },
        { id: 'v2', category: 'Logistics & Rentals', vendorName: 'Apex AV & Staging Solutions', contactPerson: 'Tech Lead Chris', status: 'Booked', estimatedCost: Math.round(total * 0.28), notes: 'LED wall and wireless rig included.' },
        { id: 'v3', category: 'Catering', vendorName: 'Premier Corporate Hospitality', contactPerson: 'Chef Laurent', status: 'Quoted', estimatedCost: Math.round(total * 0.24), notes: 'Coffee barista bar approved.' },
        { id: 'v4', category: 'Photography', vendorName: 'ProMedia Summit Photographers', contactPerson: 'Amanda Cole', status: 'Booked', estimatedCost: Math.round(total * 0.05), notes: 'Headshot studio setup in lobby.' },
      ],
    };
  }

  // 5. Default Community & Cultural Event (and 'other')
  return {
    id: planId,
    title: request.title || 'Community Celebration & Gathering',
    eventType: type === 'other' ? 'other' : 'community',
    eventDate: request.eventDate,
    location: request.location,
    guestCount: request.guestCount,
    totalBudget: total,
    currency: curr,
    vibe: request.vibe,
    specialRequirements: request.specialRequirements || 'Inclusive, vibrant, community-oriented gathering',
    createdAt: nowIso,
    ideas: {
      themeName: 'Unity In Bloom: Community Heritage & Arts Festival',
      tagline: 'Bringing neighbors, creators, and families together for a celebration of local culture and shared joy.',
      colorPalette: [
        { name: 'Sunny Marigold', hex: '#F9A825' },
        { name: 'Sky Azure', hex: '#0288D1' },
        { name: 'Forest Green', hex: '#2E7D32' },
        { name: 'Coral Terracotta', hex: '#E64A19' },
        { name: 'Warm Cream', hex: '#FFF8E1' },
      ],
      decorConcepts: [
        'Overhead multi-colored fabric bunting flags and solar lantern canopy',
        'Interactive community chalk mural wall where children and adults paint shared dreams',
        'Recycled wooden pallet lounge areas with vibrant upcycled cushions',
        'Clear, accessible directional wooden signs pointing to food trucks, stages, and first aid',
      ],
      interactiveActivities: [
        'Local Artisan Maker Market showcasing homegrown crafts and pottery demos',
        'Open Mic & Community Stage featuring school bands, folk dancers, and spoken word poets',
        'Scavenger hunt for kids with plantable wildflower seed prizes',
        'Community Recipe Exchange booth where attendees share grandmother secrets and home dishes',
      ],
      customFoodDrinkConcepts: [
        'Local Food Truck Row with multicultural street foods (tacos, dumplings, falafels, dosa rolls)',
        'Fresh Pressed Lemonade & Herbal Iced Tea Hydration Stations',
        'Community Bake-Off Tasting Table with votes for neighborhood champion',
        'Zero-waste composting and compostable cutlery only for food service',
      ],
      invitationCopySnippet:
        'Come one, come all! Join your neighbors and friends for an inspiring day of music, local flavors, art, and community spirit. Free admission for all ages.',
      aiSuggestions: [
        'Ensure ADA compliance with wheelchair accessible ramps, wide grass mats, and sign-language interpreter on main stage.',
        'Partner with local volunteer groups for clean-up teams and waste sorting management.',
        'Set up a volunteer check-in tent with emergency walkie-talkies and first-aid kits.',
      ],
    },
    budgetItems: [
      { id: 'b1', category: 'Venue', name: 'Park Permit, Power Hookups & Sanitation', estimatedCost: Math.round(total * 0.28), actualCost: 0, paidStatus: 'deposit_paid', notes: 'City council public park approval' },
      { id: 'b2', category: 'Logistics & Misc', name: 'Staging, Audio Sound System & Canopy Tents', estimatedCost: Math.round(total * 0.25), actualCost: 0, paidStatus: 'unpaid', notes: 'Covered canopy tents for rain or shine' },
      { id: 'b3', category: 'Entertainment & Music', name: 'Local Performer Honorariums & Sound Tech', estimatedCost: Math.round(total * 0.20), actualCost: 0, paidStatus: 'unpaid', notes: '5 community acts booked' },
      { id: 'b4', category: 'Stationery & Favors', name: 'Banners, Volunteer T-Shirts, Flyers & Signage', estimatedCost: Math.round(total * 0.12), actualCost: 0, paidStatus: 'unpaid', notes: 'Eco-printed flyers & QR schedules' },
      { id: 'b5', category: 'Decor & Flowers', name: 'Festive Bunting, Solar Lighting & Waste Bins', estimatedCost: Math.round(total * 0.08), actualCost: 0, paidStatus: 'unpaid', notes: 'Recyclable decor' },
      { id: 'b6', category: 'Logistics & Misc', name: 'First Aid Kit, Security & Contingency', estimatedCost: Math.round(total * 0.07), actualCost: 0, paidStatus: 'unpaid', notes: 'Required municipal compliance safety buffer' },
    ],
    timeline: [
      { id: 't1', phase: 'Planning Phase (Months Before)', title: 'Submit Park & Sound Permits to City Council', description: 'Obtain municipal approvals and sound permit clearance.', targetTimeframe: '3-4 months out', completed: true, priority: 'high' },
      { id: 't2', phase: 'Planning Phase (Months Before)', title: 'Recruit Community Food Vendors & Artisans', description: 'Send call for vendors and confirm health and hygiene insurance certificates.', targetTimeframe: '2 months out', completed: true, priority: 'high' },
      { id: 't3', phase: 'Vendor Locking (Weeks Before)', title: 'Schedule Volunteer Teams & Safety Briefing', description: 'Assign roles for greeting, crowd flow, waste management, and stage handling.', targetTimeframe: '3 weeks out', completed: false, priority: 'high' },
      { id: 't4', phase: 'Final Preparations (Week Of)', title: 'Site Walkthrough & Emergency Plan Review', description: 'Verify generator hookups, accessibility pathways, and emergency vehicle lane.', targetTimeframe: '3 days before', completed: false, priority: 'high' },
      { id: 't5', phase: 'Day-of Event (Run of Show)', title: 'Stage Setup, Soundcheck & Food Truck Parking', description: 'Canopies erected, food trucks positioned with safety buffer.', targetTimeframe: '08:00 AM', completed: false, priority: 'high', timeSlot: '08:00 AM' },
      { id: 't6', phase: 'Day-of Event (Run of Show)', title: 'Festival Gates Open & Welcome Speech', description: 'Opening remarks by community leaders and youth choir performance.', targetTimeframe: '10:00 AM', completed: false, priority: 'medium', timeSlot: '10:00 AM' },
      { id: 't7', phase: 'Day-of Event (Run of Show)', title: 'Artisan Demos & Cultural Performances', description: 'Live acts alternating on main stage and interactive workshops on lawn.', targetTimeframe: '01:00 PM', completed: false, priority: 'medium', timeSlot: '01:00 PM' },
      { id: 't8', phase: 'Day-of Event (Run of Show)', title: 'Community Awards & Closing Musical Act', description: 'Volunteer recognition ceremony and finale community dance.', targetTimeframe: '05:00 PM', completed: false, priority: 'high', timeSlot: '05:00 PM' },
      { id: 't9', phase: 'Day-of Event (Run of Show)', title: 'Site Teardown & Zero-Waste Cleanup', description: 'Waste audit, equipment return, and park grounds restored clean.', targetTimeframe: '06:30 PM', completed: false, priority: 'high', timeSlot: '06:30 PM' },
    ],
    vendors: [
      { id: 'v1', category: 'Venue', vendorName: request.location || 'Municipal Parks & Recreation Dept', contactPerson: 'Officer Dan Garcia', status: 'Booked', estimatedCost: Math.round(total * 0.28), notes: 'Permit #PR-9823 approved.' },
      { id: 'v2', category: 'Logistics & Rentals', vendorName: 'Apex Stage & Canopy Rentals', contactPerson: 'Markus Vance', status: 'Booked', estimatedCost: Math.round(total * 0.25), notes: 'Stage, sound board, and 10 canopy tents.' },
      { id: 'v3', category: 'Music & DJ', vendorName: 'Harmony Sound & Tech Crew', contactPerson: 'Aaliyah Jones', status: 'Quoted', estimatedCost: Math.round(total * 0.20), notes: 'Sound engineer on site for 8 hours.' },
      { id: 'v4', category: 'Invitations & Favors', vendorName: 'GreenTree Eco Print Co.', contactPerson: 'Samira Patel', status: 'Booked', estimatedCost: Math.round(total * 0.12), notes: 'Recycled canvas banners and volunteer wristbands.' },
    ],
  };
}
