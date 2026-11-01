export type EventType = 'wedding' | 'birthday' | 'community' | 'anniversary' | 'corporate' | 'other';

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
}

export interface BudgetItem {
  id: string;
  category: 'Venue' | 'Catering & Drinks' | 'Decor & Flowers' | 'Photography & Video' | 'Entertainment & Music' | 'Attire & Beauty' | 'Stationery & Favors' | 'Logistics & Misc';
  name: string;
  estimatedCost: number;
  actualCost: number;
  paidStatus: 'unpaid' | 'deposit_paid' | 'fully_paid';
  notes?: string;
}

export type TimelinePhase = 
  | 'Planning Phase (Months Before)'
  | 'Vendor Locking (Weeks Before)'
  | 'Final Preparations (Week Of)'
  | 'Day-of Event (Run of Show)';

export interface TimelineMilestone {
  id: string;
  phase: TimelinePhase;
  title: string;
  description: string;
  targetTimeframe: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  timeSlot?: string; // e.g. "09:00 AM", "12:30 PM" for day of event
}

export type VendorCategory = 
  | 'Venue' 
  | 'Catering' 
  | 'Photography' 
  | 'Music & DJ' 
  | 'Decor & Florist' 
  | 'Attire & Styling' 
  | 'Invitations & Favors' 
  | 'Logistics & Rentals';

export type VendorStatus = 'To Research' | 'Contacted' | 'Quoted' | 'Booked' | 'Completed';

export interface VendorItem {
  id: string;
  category: VendorCategory;
  vendorName: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: VendorStatus;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface PersonalizedIdeas {
  themeName: string;
  tagline: string;
  colorPalette: ColorSwatch[];
  decorConcepts: string[];
  interactiveActivities: string[];
  customFoodDrinkConcepts: string[];
  invitationCopySnippet: string;
  aiSuggestions: string[];
}

export interface EventPlan {
  id: string;
  title: string;
  eventType: EventType;
  eventDate: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: Currency;
  vibe: string;
  specialRequirements: string;
  createdAt: string;
  ideas: PersonalizedIdeas;
  budgetItems: BudgetItem[];
  timeline: TimelineMilestone[];
  vendors: VendorItem[];
}

export interface GeneratePlanRequest {
  eventType: EventType;
  title?: string;
  eventDate: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: Currency;
  vibe: string;
  specialRequirements?: string;
}

