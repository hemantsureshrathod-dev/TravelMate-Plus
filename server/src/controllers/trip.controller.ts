import { Request, Response, NextFunction } from 'express';
import { Trip } from '../models/Trip.js';
import { saveTripSchema, updateTripSchema } from '../validators/trip.validator.js';

export async function createTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = saveTripSchema.parse(req.body);
    const userId = req.user!.id;

    const trip = await Trip.create({
      ...validated,
      owner: userId,
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip: trip.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

export async function getTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const trips = await Trip.find({ owner: userId }).sort({ updatedAt: -1 });

    res.status(200).json({
      trips: trips.map((t) => t.toJSON()),
      count: trips.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTripById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const trip = await Trip.findById(id);
    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    // Strict ownership verification
    if (trip.owner.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden: You do not have access to this trip' });
      return;
    }

    res.status(200).json({ trip: trip.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function updateTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const validated = updateTripSchema.parse(req.body);

    const trip = await Trip.findById(id);
    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    // Strict ownership verification
    if (trip.owner.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden: You cannot modify another user’s trip' });
      return;
    }

    Object.assign(trip, validated);
    await trip.save();

    res.status(200).json({
      message: 'Trip updated successfully',
      trip: trip.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const trip = await Trip.findById(id);
    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    // Strict ownership verification
    if (trip.owner.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden: You cannot delete another user’s trip' });
      return;
    }

    await Trip.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Trip deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
}
