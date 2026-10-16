import { Request, Response, NextFunction } from 'express';
import { generateItineraryInputSchema } from '../validators/ai.validator.js';
import { generateItineraryPlan, AIServiceError } from '../services/ai.service.js';

export async function generateItinerary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedInput = generateItineraryInputSchema.parse(req.body);

    const itinerary = await generateItineraryPlan(validatedInput);

    res.status(200).json({
      message: 'Itinerary generated successfully',
      itinerary,
      meta: {
        generatedAt: new Date().toISOString(),
        disclaimer:
          'AI-generated itinerary with estimated costs and durations. Please check local conditions, timings, and reservations before travel.',
      },
    });
  } catch (error) {
    if (error instanceof AIServiceError) {
      res.status(error.statusCode).json({
        error: error.message,
        code: error.code,
      });
      return;
    }
    next(error);
  }
}
