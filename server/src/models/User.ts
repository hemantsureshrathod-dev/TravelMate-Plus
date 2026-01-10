import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: {
        food: { type: String, enum: ['Veg', 'Non-Veg', 'Jain'], default: 'Veg' },
        interests: [{ type: String }], // e.g., 'Historical', 'Nature'
    },
    savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
