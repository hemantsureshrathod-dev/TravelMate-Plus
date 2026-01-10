import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [{
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }],
}, { timestamps: true });

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
