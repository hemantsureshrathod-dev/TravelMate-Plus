import { apiRequest } from './api';
import { ItineraryGenerationInput, ItineraryGenerationResponse } from '../types/trip';

export async function generateItinerary(
  params: ItineraryGenerationInput
): Promise<ItineraryGenerationResponse> {
  return await apiRequest<ItineraryGenerationResponse>('/ai/generate-itinerary', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
