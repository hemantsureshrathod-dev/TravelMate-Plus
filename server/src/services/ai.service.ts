import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import {
  GenerateItineraryInput,
  GeneratedItinerary,
  generatedItinerarySchema,
} from '../validators/ai.validator.js';

export class AIServiceError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code: string = 'AI_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export async function generateItineraryPlan(
  input: GenerateItineraryInput
): Promise<GeneratedItinerary> {
  const apiKey = env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new AIServiceError(
      'Gemini API key is not configured on the server. Please provide a valid GEMINI_API_KEY in the environment settings.',
      'API_KEY_MISSING',
      503
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = env.GEMINI_MODEL || 'gemini-flash-latest';

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
    },
  });

  const prompt = `
You are an expert travel planner specializing in Maharashtra and Indian travel.
Create an authentic, realistic, and practical travel itinerary based on the following verified specifications:

- Destination: ${input.destination}
- Duration: ${input.durationDays} days
- Start Date: ${input.startDate || 'Flexible'}
- Number of Travellers: ${input.travellers}
- Total Budget: ${input.budget} ${input.currency}
- Interests: ${input.interests.length > 0 ? input.interests.join(', ') : 'Sightseeing, Heritage, Local Food, Nature'}
- Preferred Pace: ${input.pace} (relaxed = 2-3 activities/day; moderate = 3-4 activities/day; fast = 4-5 activities/day)
- Transport Mode: ${input.transport || 'Local cabs / public transit / private car'}
- Special Requests: ${input.specialInstructions || 'None'}

RULES:
1. Provide a realistic day-by-day plan strictly covering exactly ${input.durationDays} days.
2. Estimated costs must be in ${input.currency} and keep within the total budget of ${input.budget} ${input.currency}.
3. Categories must strictly be one of: "sightseeing", "food", "nature", "heritage", "transport", "relaxation".
4. Provide genuine local advice, regional culinary specialties (e.g. Misal Pav, Malvani seafood, Pithla Bhakri), and practical travel tips for Maharashtra/India.
5. All costs and timings are estimates.

Output strictly valid JSON matching this schema:
{
  "title": "A captivating title for the trip (string)",
  "summary": "A concise 2-3 sentence overview highlighting the journey experience (string)",
  "destination": "${input.destination}",
  "durationDays": ${input.durationDays},
  "estimatedTotalCost": ${Math.round(input.budget * 0.9)},
  "currency": "${input.currency}",
  "days": [
    {
      "dayNumber": 1,
      "theme": "Theme title for day 1 (string)",
      "dayNotes": "Practical day note such as best transport or sunrise timing (string)",
      "activities": [
        {
          "id": "act-1-1",
          "time": "09:00 AM",
          "title": "Specific attraction name",
          "description": "Engaging description of what to experience and observe",
          "location": "Specific location or area",
          "estimatedDuration": "2 hours",
          "estimatedCost": 300,
          "category": "sightseeing",
          "notes": "Practical tip (e.g. entry ticket or photography permit)"
        }
      ]
    }
  ],
  "notes": [
    "Useful advisory note on dress code, monsoon precautions, local transport, or seasonal advice"
  ]
}
`;

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation request timed out after 35 seconds')), 35000)
    );

    const resultPromise = model.generateContent(prompt);
    const result = (await Promise.race([resultPromise, timeoutPromise])) as any;

    const responseText = result.response.text();

    if (!responseText) {
      throw new AIServiceError('Gemini returned an empty response. Please retry.', 'EMPTY_RESPONSE', 502);
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(responseText);
    } catch {
      // In case text has markdown json fences
      const cleaned = responseText
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      parsedJson = JSON.parse(cleaned);
    }

    const validated = generatedItinerarySchema.safeParse(parsedJson);

    if (!validated.success) {
      console.error('[AI Service] Schema validation failed on model output:', validated.error.format());
      throw new AIServiceError(
        'AI output did not conform to the expected itinerary format. Please retry generation.',
        'MALFORMED_OUTPUT',
        502
      );
    }

    return validated.data;
  } catch (error: any) {
    if (error instanceof AIServiceError) {
      throw error;
    }

    const errorMsg = error?.message || String(error);

    // Detect rate limit / quota exceeded
    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
      throw new AIServiceError(
        'Gemini API quota or rate limit reached. Please wait a minute and try again.',
        'RATE_LIMIT_EXCEEDED',
        429
      );
    }

    // Detect invalid API key
    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
      throw new AIServiceError(
        'The configured Gemini API key is invalid or unauthorized.',
        'INVALID_API_KEY',
        401
      );
    }

    if (errorMsg.includes('timed out')) {
      throw new AIServiceError(
        'AI generation service timed out. Please try again with fewer days or simplified preferences.',
        'TIMEOUT',
        504
      );
    }

    console.error('[AI Service] Unhandled Gemini Error:', errorMsg);
    throw new AIServiceError(
      'Failed to generate itinerary with AI provider. Please try again later.',
      'PROVIDER_ERROR',
      502
    );
  }
}
