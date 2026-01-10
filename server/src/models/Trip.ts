import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    itinerary: { type: Object }, // Flexible JSON structure for the plan
}, { timestamps: true });

export const Trip = mongoose.model('Trip', tripSchema);
