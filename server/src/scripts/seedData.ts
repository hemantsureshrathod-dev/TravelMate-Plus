import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Place } from '../models/Place';

dotenv.config();

// Maharashtra places data
const maharashtraPlaces = [
    // Attractions - Mumbai
    {
        name: 'Gateway of India',
        description: 'Historic arch monument overlooking the Arabian Sea',
        location: { lat: 18.9220, lng: 72.8347, city: 'Mumbai' },
        category: 'Attraction',
        rating: 4.5,
        tags: ['Historical', 'Monument', 'Heritage']
    },
    {
        name: 'Siddhivinayak Temple',
        description: 'Famous Ganesh temple in Mumbai',
        location: { lat: 19.0169, lng: 72.8317, city: 'Mumbai' },
        category: 'Attraction',
        rating: 4.7,
        tags: ['Temple', 'Religious', 'Spiritual']
    },
    {
        name: 'Marine Drive',
        description: '3.6 km long boulevard along the coast',
        location: { lat: 18.9446, lng: 72.8233, city: 'Mumbai' },
        category: 'Attraction',
        rating: 4.6,
        tags: ['Scenic', 'Beach', 'Viewpoint']
    },
    {
        name: 'Elephanta Caves',
        description: 'UNESCO World Heritage Site, ancient rock-cut caves',
        location: { lat: 18.9633, lng: 72.9325, city: 'Mumbai' },
        category: 'Attraction',
        rating: 4.4,
        tags: ['Historical', 'Caves', 'UNESCO']
    },

    // Attractions - Pune
    {
        name: 'Shaniwar Wada',
        description: 'Historic fortification built in 1732',
        location: { lat: 18.5204, lng: 73.8567, city: 'Pune' },
        category: 'Attraction',
        rating: 4.3,
        tags: ['Historical', 'Fort', 'Heritage']
    },
    {
        name: 'Aga Khan Palace',
        description: 'Palace with historical significance, Gandhi memorial',
        location: { lat: 18.5524, lng: 73.9037, city: 'Pune' },
        category: 'Attraction',
        rating: 4.2,
        tags: ['Historical', 'Museum', 'Gandhi']
    },
    {
        name: 'Sinhagad Fort',
        description: 'Historic hill fort with panoramic views',
        location: { lat: 18.3667, lng: 73.7500, city: 'Pune' },
        category: 'Attraction',
        rating: 4.5,
        tags: ['Fort', 'Trekking', 'Historical']
    },
    {
        name: 'Karla Caves',
        description: 'Ancient Buddhist rock-cut caves',
        location: { lat: 18.7800, lng: 73.4750, city: 'Lonavala' },
        category: 'Attraction',
        rating: 4.4,
        tags: ['Caves', 'Historical', 'Buddhist']
    },

    // Attractions - Aurangabad
    {
        name: 'Ajanta Caves',
        description: 'UNESCO World Heritage Site, Buddhist cave monuments',
        location: { lat: 20.5519, lng: 75.7033, city: 'Aurangabad' },
        category: 'Attraction',
        rating: 4.8,
        tags: ['UNESCO', 'Caves', 'Buddhist', 'Historical']
    },
    {
        name: 'Ellora Caves',
        description: 'UNESCO World Heritage Site, rock-cut cave temples',
        location: { lat: 20.0264, lng: 75.1783, city: 'Aurangabad' },
        category: 'Attraction',
        rating: 4.8,
        tags: ['UNESCO', 'Caves', 'Temples', 'Historical']
    },

    // Attractions - Kolhapur
    {
        name: 'Mahalaxmi Temple',
        description: 'Famous temple of Goddess Mahalaxmi',
        location: { lat: 16.7048, lng: 74.2433, city: 'Kolhapur' },
        category: 'Attraction',
        rating: 4.6,
        tags: ['Temple', 'Religious', 'Spiritual']
    },
    {
        name: 'Panhala Fort',
        description: 'Historic hill fort in Kolhapur district',
        location: { lat: 16.8167, lng: 73.9167, city: 'Kolhapur' },
        category: 'Attraction',
        rating: 4.4,
        tags: ['Fort', 'Historical', 'Trekking']
    },

    // Attractions - Nashik
    {
        name: 'Trimbakeshwar Temple',
        description: 'One of the 12 Jyotirlingas',
        location: { lat: 19.9333, lng: 73.5333, city: 'Nashik' },
        category: 'Attraction',
        rating: 4.5,
        tags: ['Temple', 'Religious', 'Jyotirlinga']
    },
    {
        name: 'Sula Vineyards',
        description: 'Popular wine estate and vineyard tours',
        location: { lat: 19.9500, lng: 73.7833, city: 'Nashik' },
        category: 'Attraction',
        rating: 4.3,
        tags: ['Vineyard', 'Wine', 'Tours']
    },

    // Attractions - Lonavala/Mahabaleshwar
    {
        name: 'Tiger\'s Leap',
        description: 'Scenic viewpoint in Lonavala',
        location: { lat: 18.7583, lng: 73.4097, city: 'Lonavala' },
        category: 'Attraction',
        rating: 4.3,
        tags: ['Viewpoint', 'Scenic', 'Nature']
    },
    {
        name: 'Mahabaleshwar Hill Station',
        description: 'Popular hill station with strawberry farms',
        location: { lat: 17.9214, lng: 73.6566, city: 'Mahabaleshwar' },
        category: 'Attraction',
        rating: 4.6,
        tags: ['Hill Station', 'Nature', 'Strawberry']
    },

    // Food - Mumbai
    {
        name: 'Ashok Vada Pav',
        description: 'Famous Vada Pav stall in Mumbai',
        location: { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
        category: 'Food',
        rating: 4.5,
        tags: ['Veg', 'Street Food', 'Vada Pav']
    },
    {
        name: 'Sardar Refreshments',
        description: 'Legendary Pav Bhaji in Tardeo',
        location: { lat: 18.9667, lng: 72.8333, city: 'Mumbai' },
        category: 'Food',
        rating: 4.6,
        tags: ['Veg', 'Pav Bhaji', 'Popular']
    },
    {
        name: 'Hotel Shabari',
        description: 'Authentic Maharashtrian thali',
        location: { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
        category: 'Food',
        rating: 4.4,
        tags: ['Veg', 'Thali', 'Traditional']
    },

    // Food - Pune
    {
        name: 'Shabree Restaurant',
        description: 'Famous for Misal Pav and Maharashtrian cuisine',
        location: { lat: 18.5204, lng: 73.8567, city: 'Pune' },
        category: 'Food',
        rating: 4.5,
        tags: ['Veg', 'Misal Pav', 'Traditional']
    },
    {
        name: 'Bedekar Misal',
        description: 'Popular Misal Pav joint',
        location: { lat: 18.5204, lng: 73.8567, city: 'Pune' },
        category: 'Food',
        rating: 4.4,
        tags: ['Veg', 'Misal Pav', 'Local']
    },

    // Food - Kolhapur
    {
        name: 'Hotel Padma',
        description: 'Kolhapuri Misal and traditional food',
        location: { lat: 16.7048, lng: 74.2433, city: 'Kolhapur' },
        category: 'Food',
        rating: 4.6,
        tags: ['Veg', 'Kolhapuri', 'Spicy']
    },
    {
        name: 'Hotel Shabari Kolhapur',
        description: 'Authentic Kolhapuri thali',
        location: { lat: 16.7048, lng: 74.2433, city: 'Kolhapur' },
        category: 'Food',
        rating: 4.5,
        tags: ['Veg', 'Thali', 'Kolhapuri']
    },

    // Stays - Various cities
    {
        name: 'Taj Mahal Palace',
        description: 'Luxury heritage hotel near Gateway of India',
        location: { lat: 18.9220, lng: 72.8347, city: 'Mumbai' },
        category: 'Stay',
        rating: 4.7,
        tags: ['Luxury', 'Heritage', '5-Star']
    },
    {
        name: 'JW Marriott Pune',
        description: '5-star hotel in Pune city center',
        location: { lat: 18.5204, lng: 73.8567, city: 'Pune' },
        category: 'Stay',
        rating: 4.6,
        tags: ['Luxury', 'Business', '5-Star']
    },
    {
        name: 'Lemon Tree Hotel Nashik',
        description: 'Comfortable stay in Nashik',
        location: { lat: 19.9975, lng: 73.7898, city: 'Nashik' },
        category: 'Stay',
        rating: 4.3,
        tags: ['Mid-Range', 'Comfortable']
    },

    // EV Charging Stations
    {
        name: 'Phoenix Marketcity EV Charging',
        description: 'EV charging point at Phoenix Mall',
        location: { lat: 18.5204, lng: 73.8567, city: 'Pune' },
        category: 'EV_Station',
        rating: 4.2,
        tags: ['Fast Charging', 'Mall', 'Public']
    },
    {
        name: 'Reliance EV Station Mumbai',
        description: 'EV charging at Reliance petrol pump',
        location: { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
        category: 'EV_Station',
        rating: 4.0,
        tags: ['Petrol Pump', 'Public', 'Charging']
    },
    {
        name: 'EV Charging Point Nashik',
        description: 'Public EV charging station',
        location: { lat: 19.9975, lng: 73.7898, city: 'Nashik' },
        category: 'EV_Station',
        rating: 4.1,
        tags: ['Public', 'Charging']
    },
    {
        name: 'BPCL EV Station Pune',
        description: 'EV charging at BPCL petrol pump',
        location: { lat: 18.5204, lng: 73.8567, city: 'Pune' },
        category: 'EV_Station',
        rating: 4.0,
        tags: ['Petrol Pump', 'Public']
    },
    {
        name: 'EV Station Kolhapur',
        description: 'Public EV charging facility',
        location: { lat: 16.7048, lng: 74.2433, city: 'Kolhapur' },
        category: 'EV_Station',
        rating: 4.0,
        tags: ['Public', 'Charging']
    },
    {
        name: 'Hotel EV Charging Aurangabad',
        description: 'EV charging for hotel guests and public',
        location: { lat: 19.8762, lng: 75.3433, city: 'Aurangabad' },
        category: 'EV_Station',
        rating: 4.1,
        tags: ['Hotel', 'Public']
    }
];

const seedPlaces = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI is not set in environment variables');
            console.error('💡 Please create a .env file with MONGO_URI=mongodb://localhost:27017/travelmate');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ Connected to MongoDB');

        // Clear existing places (optional - comment out if you want to keep existing data)
        await Place.deleteMany({});
        console.log('🧹 Cleared existing places');

        // Insert places
        const places = await Place.insertMany(maharashtraPlaces);
        console.log(`✅ Seeded ${places.length} places to database`);
        console.log(`   - Attractions: ${places.filter(p => p.category === 'Attraction').length}`);
        console.log(`   - Food: ${places.filter(p => p.category === 'Food').length}`);
        console.log(`   - Stays: ${places.filter(p => p.category === 'Stay').length}`);
        console.log(`   - EV Stations: ${places.filter(p => p.category === 'EV_Station').length}`);

        await mongoose.connection.close();
        console.log('✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedPlaces();
