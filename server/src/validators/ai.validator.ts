import { z } from 'zod';

export const generateItineraryInputSchema = z.object({
  destination: z
    .string({ required_error: 'Destination is required' })
    .trim()
    .min(2, 'Destination must be at least 2 characters')
    .max(100, 'Destination cannot exceed 100 characters'),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  durationDays: z
    .number({ required_error: 'Duration in days is required' })
    .int('Duration must be a whole number')
    .min(1, 'Trip must be at least 1 day')
    .max(14, 'Trip duration cannot exceed 14 days for optimal AI generation'),
  travellers: z
    .number({ required_error: 'Number of travellers is required' })
    .int()
    .min(1, 'Must have at least 1 traveller')
    .max(30, 'Travellers cannot exceed 30'),
  budget: z
    .number({ required_error: 'Budget is required' })
    .min(500, 'Budget must be at least 500'),
  currency: z.string().default('INR'),
  interests: z.array(z.string()).default([]),
  pace: z.enum(['relaxed', 'moderate', 'fast']).default('moderate'),
  transport: z.string().optional().default('Car / Local transport'),
  specialInstructions: z.string().max(500, 'Special instructions too long').optional().default(''),
});

export const activitySchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  time: z.string().min(1, 'Time is required'),
  title: z.string().min(1, 'Activity title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  estimatedDuration: z.string().min(1, 'Estimated duration is required'),
  estimatedCost: z.number().nonnegative().default(0),
  category: z.enum(['sightseeing', 'food', 'nature', 'heritage', 'transport', 'relaxation']).default('sightseeing'),
  notes: z.string().optional().default(''),
});

export const dayPlanSchema = z.object({
  dayNumber: z.number().int().min(1),
  theme: z.string().min(1, 'Day theme is required'),
  dayNotes: z.string().optional().default(''),
  activities: z.array(activitySchema).min(1, 'Each day must have at least one activity'),
});

export const generatedItinerarySchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  destination: z.string().min(1),
  durationDays: z.number().int().min(1),
  estimatedTotalCost: z.number().nonnegative().default(0),
  currency: z.string().default('INR'),
  days: z.array(dayPlanSchema).min(1),
  notes: z.array(z.string()).default([]),
});

export type GenerateItineraryInput = z.infer<typeof generateItineraryInputSchema>;
export type GeneratedItinerary = z.infer<typeof generatedItinerarySchema>;
export type ItineraryDay = z.infer<typeof dayPlanSchema>;
export type ItineraryActivity = z.infer<typeof activitySchema>;
