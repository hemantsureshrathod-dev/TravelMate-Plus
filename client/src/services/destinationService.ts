import { apiRequest } from './api';
import { Destination } from '../types/destination';

export async function getDestinations(params?: {
  search?: string;
  category?: string;
}): Promise<Destination[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category && params.category !== 'all') query.set('category', params.category);

  const qs = query.toString();
  const endpoint = `/destinations${qs ? `?${qs}` : ''}`;
  const data = await apiRequest<{ destinations: Destination[]; count: number }>(endpoint);
  return data.destinations;
}

export async function getDestinationById(id: string): Promise<Destination> {
  const data = await apiRequest<{ destination: Destination }>(`/destinations/${id}`);
  return data.destination;
}
