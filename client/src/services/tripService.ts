import { apiRequest } from './api';
import { Trip } from '../types/trip';

export async function getTrips(): Promise<Trip[]> {
  const data = await apiRequest<{ trips: Trip[]; count: number }>('/trips');
  return data.trips;
}

export async function getTripById(id: string): Promise<Trip> {
  const data = await apiRequest<{ trip: Trip }>(`/trips/${id}`);
  return data.trip;
}

export async function createTrip(tripData: Partial<Trip>): Promise<Trip> {
  const data = await apiRequest<{ message: string; trip: Trip }>('/trips', {
    method: 'POST',
    body: JSON.stringify(tripData),
  });
  return data.trip;
}

export async function updateTrip(id: string, tripData: Partial<Trip>): Promise<Trip> {
  const data = await apiRequest<{ message: string; trip: Trip }>(`/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tripData),
  });
  return data.trip;
}

export async function deleteTrip(id: string): Promise<void> {
  await apiRequest<{ message: string; id: string }>(`/trips/${id}`, {
    method: 'DELETE',
  });
}
