export type ActivityCategory =
  | 'sightseeing'
  | 'food'
  | 'nature'
  | 'heritage'
  | 'transport'
  | 'relaxation';

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  estimatedDuration: string;
  estimatedCost: number;
  category: ActivityCategory;
  notes?: string;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  dayNotes?: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  owner?: string;
  title: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  durationDays: number;
  travellers: number;
  budget: number;
  currency: string;
  interests: string[];
  pace: 'relaxed' | 'moderate' | 'fast';
  transport: string;
  summary: string;
  days: DayPlan[];
  estimatedTotalCost: number;
  notes: string[];
  status: 'draft' | 'planned' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryGenerationInput {
  destination: string;
  startDate?: string;
  endDate?: string;
  durationDays: number;
  travellers: number;
  budget: number;
  currency: string;
  interests: string[];
  pace: 'relaxed' | 'moderate' | 'fast';
  transport?: string;
  specialInstructions?: string;
}

export interface ItineraryGenerationResponse {
  message: string;
  itinerary: {
    title: string;
    summary: string;
    destination: string;
    durationDays: number;
    estimatedTotalCost: number;
    currency: string;
    days: DayPlan[];
    notes: string[];
  };
  meta: {
    generatedAt: string;
    disclaimer: string;
  };
}
