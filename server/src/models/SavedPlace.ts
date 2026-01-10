import mongoose from 'mongoose';

const savedPlaceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
}, { timestamps: true });

export const SavedPlace = mongoose.model('SavedPlace', savedPlaceSchema);
