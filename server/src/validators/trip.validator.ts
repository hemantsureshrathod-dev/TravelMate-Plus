import { z } from 'zod';
import { activitySchema, dayPlanSchema } from './ai.validator.js';

export const saveTripSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  destination: z
    .string({ required_error: 'Destination is required' })
    .trim()
    .min(2, 'Destination must be at least 2 characters'),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  durationDays: z.number().int().min(1).max(30),
  travellers: z.number().int().min(1).max(50).default(1),
  budget: z.number().nonnegative(),
  currency: z.string().default('INR'),
  interests: z.array(z.string()).default([]),
  pace: z.enum(['relaxed', 'moderate', 'fast']).default('moderate'),
  transport: z.string().optional().default('Mixed / Car'),
  summary: z.string().default(''),
  days: z.array(dayPlanSchema).min(1, 'Trip must contain at least one day plan'),
  estimatedTotalCost: z.number().nonnegative().default(0),
  notes: z.array(z.string()).default([]),
  status: z.enum(['draft', 'planned', 'completed']).default('planned'),
});

export const updateTripSchema = saveTripSchema.partial();

export type SaveTripInput = z.infer<typeof saveTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
