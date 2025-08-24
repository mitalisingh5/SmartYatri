
export interface Activity {
  time: string;
  description: string;
  estimated_cost: string;
  details?: string;
  address?: string;
}

export interface DiningOption {
  name: string;
  description: string;
  address?: string;
}

export interface Dining {
  lunch: DiningOption;
  dinner: DiningOption;
}

export interface DayPlan {
  day: number;
  theme: string;
  summary: string;
  activities: Activity[];
  dining: Dining;
}

export interface Itinerary {
  id: string; // Add a unique ID for each itinerary
  tripTitle: string;
  totalEstimatedCost: string;
  days: DayPlan[];
  location: {
      city: string;
      country: string;
  }
}

export interface Hotel {
  name: string;
  description: string;
  estimated_price: string;
  address: string;
}

export type View = 'form' | 'my_itineraries' | 'itinerary_display' | 'map_view' | 'dining_view' | 'hotel_view' | 'itinerary_dashboard';
