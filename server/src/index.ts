import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';
import placeRoutes from './routes/places';
import tripRoutes from './routes/trips';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', aiRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/trips', tripRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('TravelMate+ API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
            console.log(`🤖 AI Service: ${process.env.AI_API_KEY ? '✅ Enabled (Gemini)' : '⚠️  Fallback Mode (No API Key)'}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        console.error('💡 Make sure MongoDB is running and MONGO_URI is set correctly');
        process.exit(1);
    });
