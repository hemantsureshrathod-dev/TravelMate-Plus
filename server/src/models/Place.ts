import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        city: { type: String, required: true },
    },
    category: { type: String, enum: ['Attraction', 'Food', 'Stay', 'EV_Station'], required: true },
    rating: { type: Number, default: 0 },
    images: [{ type: String }],
    tags: [{ type: String }], // e.g., 'Historical', 'Nature', 'Spicy', 'Veg'
}, { timestamps: true });

export const Place = mongoose.model('Place', placeSchema);
