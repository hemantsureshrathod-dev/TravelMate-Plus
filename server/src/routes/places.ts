import express from 'express';
import { Place } from '../models/Place';
import { SavedPlace } from '../models/SavedPlace';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Helper function to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// @route   GET /api/places
// @desc    Get all places or filter by city/category
router.get('/', async (req, res) => {
    const { city, category, lat, lng, radius = 50 } = req.query;
    let query: any = {};

    if (city) query['location.city'] = new RegExp(city as string, 'i');
    if (category) query.category = category;

    try {
        let places: any = await Place.find(query);

        // If lat/lng provided, calculate distances and filter by radius
        if (lat && lng) {
            places = places.filter((place: any) => place.location && place.location.lat && place.location.lng).map((place: any) => ({
                ...place.toObject(),
                distance: calculateDistance(
                    parseFloat(lat as string),
                    parseFloat(lng as string),
                    place.location!.lat,
                    place.location!.lng
                )
            })).filter((place: any) => place.distance <= parseFloat(radius as string))
                .sort((a: any, b: any) => a.distance - b.distance);
        }

        res.json(places);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/places/nearby
// @desc    Get nearby places (attractions, food, EV stations)
router.get('/nearby', async (req, res) => {
    const { lat, lng, category, radius = 50 } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    try {
        const places = await Place.find(category ? { category } : {});

        const nearbyPlaces = places.filter((place: any) => place.location && place.location.lat && place.location.lng).map((place: any) => ({
            ...place.toObject(),
            distance: calculateDistance(
                parseFloat(lat as string),
                parseFloat(lng as string),
                place.location.lat,
                place.location.lng
            )
        })).filter((place: any) => place.distance <= parseFloat(radius as string))
            .sort((a: any, b: any) => a.distance - b.distance)
            .slice(0, 20);

        res.json(nearbyPlaces);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/places
// @desc    Add a place (Admin/User) - Protected
router.post('/', protect, async (req, res) => {
    try {
        const place = await Place.create(req.body);
        res.status(201).json(place);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// @route   POST /api/places/:id/save
// @desc    Save a place to user's favorites
router.post('/:id/save', protect, async (req: any, res) => {
    try {
        const existing = await SavedPlace.findOne({ userId: req.user.id, placeId: req.params.id });
        if (existing) {
            return res.status(400).json({ message: 'Place already saved' });
        }
        const savedPlace = await SavedPlace.create({ userId: req.user.id, placeId: req.params.id });
        res.status(201).json(savedPlace);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// @route   GET /api/places/saved
// @desc    Get user's saved places
router.get('/saved', protect, async (req: any, res) => {
    try {
        const savedPlaces = await SavedPlace.find({ userId: req.user.id }).populate('placeId');
        res.json(savedPlaces);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

export default router;
