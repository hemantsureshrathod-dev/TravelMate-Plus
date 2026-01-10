import express from 'express';
import { Trip } from '../models/Trip';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// @route   POST /api/trips
// @desc    Create a new trip
router.post('/', protect, async (req: any, res) => {
    try {
        const { destination, startDate, endDate, itinerary } = req.body;

        const trip = await Trip.create({
            userId: req.user.id,
            destination,
            startDate,
            endDate,
            itinerary,
        });

        res.status(201).json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/trips
// @desc    Get all trips for logged in user
router.get('/', protect, async (req: any, res) => {
    try {
        const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/trips/:id
// @desc    Get single trip
router.get('/:id', protect, async (req: any, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (trip && trip.userId.toString() === req.user.id) {
            res.json(trip);
        } else {
            res.status(404).json({ message: 'Trip not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
