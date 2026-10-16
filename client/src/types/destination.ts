export interface Destination {
  id: string;
  name: string;
  region: string;
  state: string;
  category: 'hill_station' | 'coastal' | 'heritage' | 'wildlife' | 'spiritual' | 'city';
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  idealDurationDays: number;
  averageDailyBudgetINR: number;
  lat: number;
  lng: number;
  imageUrl: string;
  tags: string[];
}

export type DestinationCategory = 'all' | 'hill_station' | 'coastal' | 'heritage' | 'wildlife' | 'spiritual' | 'city';
